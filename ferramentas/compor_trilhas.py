"""Compõe trilhas originais e melancólicas (piano + pad + pulso) para os edits do Lances Eternos."""
import sys, subprocess
from pathlib import Path
import numpy as np

SR = 44100
rng = np.random.default_rng(7)

NOTAS = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}

def freq(nome, oitava):
    return 440.0 * 2 ** ((NOTAS[nome] + 12 * (oitava + 1) - 69) / 12)

def acorde(raiz, tipo, oitava=3):
    base = NOTAS[raiz] + 12 * (oitava + 1)
    inter = {"m": [0, 3, 7, 12], "M": [0, 4, 7, 12], "m7": [0, 3, 7, 10], "M7": [0, 4, 7, 11], "sus": [0, 5, 7, 12]}[tipo]
    return [440.0 * 2 ** ((base + i - 69) / 12) for i in inter]

def piano(f, dur, vel=0.5):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * (2.2 + f / 900)) * (1 - np.exp(-t * 300))
    s = sum((0.6 ** k) * np.sin(2 * np.pi * f * (k + 1) * t * (1 + 0.0004 * k)) for k in range(6))
    return vel * env * s

def pad(fs, dur):
    t = np.arange(int(SR * dur)) / SR
    att = np.minimum(1, t / 1.2) * np.minimum(1, (dur - t) / 1.2)
    s = np.zeros_like(t)
    for f in fs:
        for d in (-0.15, 0.0, 0.15):
            s += np.sin(2 * np.pi * (f * (1 + d / 100)) * t + rng.uniform(0, 6))
    return 0.05 * att * s / len(fs)

def pulso(dur):
    t = np.arange(int(SR * dur)) / SR
    return 0.55 * np.sin(2 * np.pi * (55 + 60 * np.exp(-t * 30)) * t) * np.exp(-t * 9)

def reverb(x, seg=2.2, mix=0.28):
    n = int(SR * seg)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 3.2)
    ir /= np.sqrt((ir ** 2).sum())
    L = 1 << int(np.ceil(np.log2(len(x) + n)))
    w = np.fft.irfft(np.fft.rfft(x, L) * np.fft.rfft(ir, L), L)[: len(x)]
    return (1 - mix) * x + mix * w

def compor(bpm, progressao, melodia, compassos_por_secao=4, secoes=4):
    beat = 60 / bpm
    compasso = beat * 4
    total = compasso * len(progressao) * secoes
    out = np.zeros(int(SR * (total + 3)))
    def add(sinal, t0):
        i = int(t0 * SR); out[i:i + len(sinal)] += sinal[: len(out) - i]
    t = 0.0
    for sec in range(secoes):
        intens = [0.55, 0.75, 1.0, 0.8][sec % 4]
        for c, (raiz, tipo) in enumerate(progressao):
            fs = acorde(raiz, tipo, 3)
            add(pad(fs, compasso + 0.6), t)
            add(piano(fs[0] / 2, compasso * 1.2, 0.35 * intens), t)          # baixo
            for b in range(4):                                               # arpejo
                f = fs[[0, 2, 1, 3][b]] * 2
                add(piano(f, beat * 2.5, 0.22 * intens), t + b * beat)
            if sec >= 1:                                                     # melodia entra na 2ª seção
                nota = melodia[(c + sec) % len(melodia)]
                add(piano(freq(*nota), compasso, 0.30 * intens), t)
                add(piano(freq(*nota) * 1.5, beat * 2, 0.12 * intens), t + 2 * beat)
            if sec >= 2:                                                     # pulso no clímax
                for b in range(4):
                    add(pulso(beat) * (0.9 if b % 2 == 0 else 0.5) * intens, t + b * beat)
            t += compasso
    out = reverb(out)
    fim = int(SR * total)
    out[fim - SR * 3: fim] *= np.linspace(1, 0, SR * 3)
    out = out[:fim]
    return out / np.max(np.abs(out)) * 0.89

FAIXAS = [
    ("lances_eternos_01_despedida.mp3", 76, [("A", "m"), ("F", "M7"), ("C", "M"), ("G", "sus")],
     [("E", 5), ("C", 5), ("G", 5), ("D", 5)]),
    ("lances_eternos_02_memoria.mp3", 84, [("D", "m"), ("A#", "M"), ("F", "M"), ("C", "M")],
     [("A", 5), ("F", 5), ("C", 6), ("G", 5)]),
    ("lances_eternos_03_ultimo_apito.mp3", 70, [("E", "m"), ("C", "M7"), ("G", "M"), ("D", "sus")],
     [("B", 5), ("G", 5), ("D", 6), ("A", 5)]),
]

if __name__ == "__main__":
    destino = Path(sys.argv[1]); destino.mkdir(parents=True, exist_ok=True)
    for nome, bpm, prog, mel in FAIXAS:
        y = compor(bpm, prog, mel)
        est = np.stack([y, np.roll(y, int(SR * 0.012))], axis=1)
        pcm = (est * 32767).astype("<i2").tobytes()
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-",
                        "-c:a", "libmp3lame", "-b:a", "192k", str(destino / nome)], input=pcm, check=True)
        print(nome, f"{len(y)/SR:.0f}s")

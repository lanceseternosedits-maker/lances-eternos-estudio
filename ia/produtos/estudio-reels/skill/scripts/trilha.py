"""Trilha própria gerada por código (sem direitos autorais, sem download): acordes, baixo, bateria leve
e um "pop" a cada troca de frase. Parâmetros no roteiro: "trilha": {"tom": 0, "bpm": 112, "clima": "alegre"|"tenso"}.
Uso direto: python3 scripts/trilha.py saida.wav 30
"""
from __future__ import annotations

import sys
import wave
from pathlib import Path

import numpy as np

SR = 44100
PROG = {"alegre": [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]],   # I V vi IV
        "tenso": [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 56, 59]]}    # vi IV V III


def gerar(saida: Path, total: float, trocas: list[float] | None = None, cfg: dict | None = None) -> None:
    cfg = cfg or {}
    tom, bpm = int(cfg.get("tom", 0)), float(cfg.get("bpm", 112))
    prog = PROG.get(cfg.get("clima", "alegre"), PROG["alegre"])
    n = int(SR * total)
    mix = np.zeros(n)
    rng = np.random.default_rng(3)
    hz = lambda m: 440 * 2 ** ((m + tom - 69) / 12)
    tempo = 60 / bpm

    def soma(sinal: np.ndarray, t: float, g: float) -> None:
        i = int(t * SR)
        if i >= n:
            return
        sinal = sinal[: n - i]
        mix[i:i + len(sinal)] += sinal * g

    def env(d: float, a: float = 0.02, r: float = 0.08) -> np.ndarray:
        t = np.arange(int(d * SR)) / SR
        return np.minimum(t / a, 1) * np.minimum(np.maximum(d - t, 0) / r, 1)

    compasso = tempo * 4
    k, t = 0, 0.0
    while t < total:
        acorde = prog[k % len(prog)]
        tt = np.arange(int(compasso * SR)) / SR
        pad = sum(np.sin(2 * np.pi * hz(m) * tt) + 0.3 * np.sin(2 * np.pi * hz(m + 12) * tt) for m in acorde)
        soma(pad * env(compasso, 0.3, 0.4) / len(acorde), t, 0.10)
        for b in range(4):                                     # baixo e pluck em cada tempo
            tb = t + b * tempo
            d = np.arange(int(tempo * SR)) / SR
            soma(np.sin(2 * np.pi * hz(acorde[0] - 24) * d) * np.exp(-d * 4), tb, 0.22)
            nota = acorde[(b + k) % 3] + 12
            soma(np.sin(2 * np.pi * hz(nota) * d) * np.exp(-d * 9), tb + tempo / 2, 0.07)
            kd = np.arange(int(0.35 * SR)) / SR                # bumbo no 1 e no 3, chimbal no contratempo
            if b % 2 == 0:
                soma(np.sin(2 * np.pi * np.cumsum(50 + 120 * np.exp(-kd * 30)) / SR) * np.exp(-kd * 8), tb, 0.35)
            hd = np.arange(int(0.05 * SR)) / SR
            soma(np.diff(np.concatenate([[0], rng.standard_normal(len(hd))])) * np.exp(-hd * 60), tb + tempo / 2, 0.05)
        t += compasso
        k += 1

    for tc in trocas or []:                                    # "pop" de transição em cada frase nova
        d = np.arange(int(0.18 * SR)) / SR
        soma(np.sin(2 * np.pi * (700 + 900 * np.exp(-d * 25)) * d) * np.exp(-d * 22), tc, 0.12)

    fade = int(1.0 * SR)
    mix[-fade:] *= np.linspace(1, 0, fade)
    mix[: int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))
    mix = mix / (np.max(np.abs(mix)) + 1e-9) * 0.8
    saida.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(saida), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((mix * 32767).astype(np.int16).tobytes())


if __name__ == "__main__":
    gerar(Path(sys.argv[1]), float(sys.argv[2]))

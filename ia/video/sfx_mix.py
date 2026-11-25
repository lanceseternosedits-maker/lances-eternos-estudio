# Faixa de efeitos sonoros: whoosh em cada corte + efeitos marcados no roteiro.
# Uso: python3 sfx_mix.py roteiro.json pasta_out   -> pasta_out/sfx.wav (48 kHz, estéreo)
# No roteiro, cada segmento pode ter "sfx": [{"t": segundos desde o início da cena, "som": "stamp", "g": 0.8}]
# Sons disponíveis: os .mp3 de video/sfx/ (whoosh, whoosh2, pop, stamp, door, alarm, clock, typing, unlock, riser, impact, ding, glitch, paper).
import json, sys, os, subprocess
import numpy as np

R = json.load(open(sys.argv[1])); OUT = sys.argv[2]
T = json.load(open(os.path.join(OUT, "timeline.json")))
SR = 48000; N = int(T["total"] * SR) + SR
DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sfx")
cache = {}
def load(nome):
    if nome not in cache:
        a = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", os.path.join(DIR, nome + ".mp3"), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                           capture_output=True, check=True).stdout
        cache[nome] = np.frombuffer(a, np.float32).reshape(-1, 2)
    return cache[nome]
mix = np.zeros((N, 2), np.float32)
def add(nome, t, g):
    x = load(nome); i = max(0, int(t * SR)); x = x[: N - i]
    if len(x): mix[i:i + len(x)] += x * g

segs = T["segmentos"]
for k, s in enumerate(segs):
    if k: add("whoosh" if k % 2 else "whoosh2", s["t0"] - 0.18, 0.45)   # o whoosh começa um pouco antes do corte
    for e in R["segmentos"][k].get("sfx", []):
        add(e["som"], s["t0"] + e["t"], e.get("g", 0.7))
peak = np.abs(mix).max()
if peak > 0.98: mix *= 0.98 / peak
import wave
with wave.open(os.path.join(OUT, "sfx.wav"), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype("<i2").tobytes())
print("ok sfx", round(T["total"], 2), "s,", sum(len(r.get("sfx", [])) for r in R["segmentos"]) + len(segs) - 1, "efeitos")

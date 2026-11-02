# Voz reserva (grátis) quando não houver ELEVENLABS_API_KEY: Kokoro, voz pm_santa.
# Prepare uma vez: bash prepara_kokoro.sh   Uso: python3 tts_kokoro.py roteiro.json pasta_saida
import json, sys, os, re
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

R = json.load(open(sys.argv[1])); OUT = sys.argv[2]; os.makedirs(OUT, exist_ok=True)
V = os.path.expanduser("~/.cache/kokoro")
k = Kokoro(f"{V}/kokoro.onnx", f"{V}/voices_pt.npz")
SR = 24000; t = 0.3; audio = [np.zeros(int(SR * t), np.float32)]; segs = []
for s in R["segmentos"]:
    x, sr = k.create(s["fala"], voice="pm_santa", speed=1.12, lang="pt-br")
    nz = np.nonzero(np.abs(x) > 0.01)[0]; x = x[max(0, nz[0] - 240): nz[-1] + 1200].astype(np.float32)
    d = len(x) / SR
    words = s["legenda"].split(); wts = [len(re.sub(r"\W", "", w)) + 2 + (3 if re.search(r"[.,:!?]$", w) else 0) for w in words]
    acc, ws = t, []
    for w, kk in zip(words, wts):
        dw = d * kk / sum(wts); ws.append({"w": w, "t0": round(acc, 3), "t1": round(acc + dw, 3)}); acc += dw
    segs.append({**{a: b for a, b in s.items() if a != "fala"}, "t0": round(t, 3), "t1": round(t + d, 3), "palavras": ws})
    audio.append(x); t += d
    p = s.get("pausa", 0.12); audio.append(np.zeros(int(SR * p), np.float32)); t += p
c = R.get("cauda", 1.0); audio.append(np.zeros(int(SR * c), np.float32)); t += c
sf.write(f"{OUT}/voz.wav", np.concatenate(audio), SR)
for a, b in zip(segs, segs[1:]): a["fim"] = b["t0"]
segs[-1]["fim"] = round(t, 3)
json.dump({"total": round(t, 3), "segmentos": segs}, open(f"{OUT}/timeline.json", "w"), ensure_ascii=False, indent=1)
print(f"total {t:.1f}s"); [print(f'{s["t0"]:6.2f}-{s["fim"]:6.2f} {s["cena"]}') for s in segs]

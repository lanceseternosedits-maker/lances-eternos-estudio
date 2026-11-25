"""Linha do tempo do "Arquivo Secreto" (plan.py da referência, agora genérico).
Uso: python3 plan.py <pasta_trabalho>
Lê <pasta>/plano.json  {"gap": 0.2, "cenas": [["hook", [["h1", 0.15], ["h2", null]], 0.35], ...]}
     (cena, [(clip, início na cena ou null = depois do anterior + gap)], cauda)
  e <pasta>/vo/durs.json + vo/<clip>.wav (voz.py).
Grava timeline.json (duração das cenas = da narração), narration.wav e mouth.json (volume por quadro, para a boca do mascote)."""
import json, sys, wave, os
import numpy as np
P = sys.argv[1]
D = json.load(open(os.path.join(P, "vo/durs.json")))
CFG = json.load(open(os.path.join(P, "plano.json")))
SR, FPS = 44100, 30
GAP = CFG.get("gap", 0.2)
tl = {"scenes": [], "clips": {}}
g = 0.0
for name, clips, tail in CFG["cenas"]:
    t = 0.0
    for c, st in clips:
        t = st if st is not None else t + GAP
        tl["clips"][c] = {"scene": name, "start": round(t, 3), "dur": round(D[c], 3)}
        t += D[c]
    dur = round(t + tail, 2)
    tl["scenes"].append({"name": name, "start": round(g, 3), "dur": dur})
    g += dur
tl["total"] = round(g, 3)
json.dump(tl, open(os.path.join(P, "timeline.json"), "w"), indent=1)

N = int((g + 0.5) * SR)
nar = np.zeros(N)
starts = {s["name"]: s["start"] for s in tl["scenes"]}
for c, info in tl["clips"].items():
    with wave.open(os.path.join(P, f"vo/{c}.wav")) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
    i = int((starts[info["scene"]] + info["start"]) * SR)
    nar[i:i + len(x)] += x[:max(0, N - i)]
nar = nar / np.max(np.abs(nar)) * 0.95
with wave.open(os.path.join(P, "narration.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((nar * 32767).astype(np.int16).tobytes())
hop = SR // FPS
env = [float(np.sqrt(np.mean(nar[i * hop:(i + 1) * hop] ** 2))) if i * hop < N else 0.0 for i in range(int(g * FPS) + 2)]
m = np.percentile([e for e in env if e > 0.01], 90)
env = [round(min(1.0, e / m), 3) for e in env]
json.dump(env, open(os.path.join(P, "mouth.json"), "w"))
print(json.dumps(tl["scenes"]), tl["total"])

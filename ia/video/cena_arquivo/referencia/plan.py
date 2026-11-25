"""Builds timeline.json (scene durations + clip starts) and narration.wav + per-frame mouth envelope."""
import json, wave, numpy as np
D = json.load(open("vo/durs.json"))
SR, FPS = 44100, 30
# scene: (duration_tail, [(clip, start or None=after previous + gap)])
PLAN = [
    ("hook",    [("h1", 0.15), ("h2", None)], 0.35),
    ("context", [("c1", 0.25), ("c2", None)], 0.45),
    ("hire",    [("r1", 0.2)], 0.5),
    ("chat",    [("t1", 0.1), ("t2", None), ("t3", None)], 0.6),
    ("believe", [("b1", 0.3)], 0.85),
    ("nuance",  [("n1", 0.15), ("n2", None)], 0.6),
    ("end",     [("e2", 1.7)], 0.9),
]
GAP = 0.2
tl = {"scenes": [], "clips": {}}
g = 0.0
for name, clips, tail in PLAN:
    t = 0.0
    for c, st in clips:
        t = st if st is not None else t + GAP
        tl["clips"][c] = {"scene": name, "start": round(t, 3), "dur": round(D[c], 3)}
        t += D[c]
    dur = round(t + tail, 2)
    tl["scenes"].append({"name": name, "start": round(g, 3), "dur": dur})
    g += dur
tl["total"] = round(g, 3)
json.dump(tl, open("timeline.json", "w"), indent=1)

N = int((g + 0.5) * SR)
nar = np.zeros(N)
starts = {s["name"]: s["start"] for s in tl["scenes"]}
for c, info in tl["clips"].items():
    with wave.open(f"vo/{c}.wav") as w:
        x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
    i = int((starts[info["scene"]] + info["start"]) * SR)
    nar[i:i + len(x)] += x
nar = nar / np.max(np.abs(nar)) * 0.95
with wave.open("narration.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((nar * 32767).astype(np.int16).tobytes())
hop = SR // FPS
env = [float(np.sqrt(np.mean(nar[i * hop:(i + 1) * hop] ** 2))) for i in range(int(g * FPS) + 2)]
m = np.percentile([e for e in env if e > 0.01], 90)
env = [round(min(1.0, e / m), 3) for e in env]
json.dump(env, open("mouth.json", "w"))
print(json.dumps(tl["scenes"]), tl["total"])

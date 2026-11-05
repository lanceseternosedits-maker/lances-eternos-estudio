# Acelera a voz já gerada (sem mudar o tom) e reescala a timeline. Uso: python3 acelera.py pasta_out 1.4
# Evita gerar a voz de novo quando a leitura saiu lenta (custo zero).
import json, subprocess, sys
OUT, F = sys.argv[1], float(sys.argv[2])
for ext, extra in (("wav", ["-ar", "44100", "-ac", "1"]), ("mp3", ["-b:a", "128k"])):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{OUT}/voz.wav", "-af", f"atempo={F}"] + extra + [f"{OUT}/voz_tmp.{ext}"], check=True)
import os
for ext in ("wav", "mp3"): os.replace(f"{OUT}/voz_tmp.{ext}", f"{OUT}/voz.{ext}")
T = json.load(open(f"{OUT}/timeline.json")); r = lambda x: round(x / F, 3)
T["total"] = r(T["total"])
for s in T["segmentos"]:
    for k in ("t0", "t1", "fim"): s[k] = r(s[k])
    s["dur_voz"] = r(s["dur_voz"])
    for w in s["palavras"]: w["t0"], w["t1"] = r(w["t0"]), r(w["t1"])
T["acelerado"] = F; json.dump(T, open(f"{OUT}/timeline.json", "w"), ensure_ascii=False, indent=1)
print(f"ok voz {F}x, total {T['total']:.1f}s")

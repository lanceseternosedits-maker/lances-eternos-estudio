"""Mistura voz + trilha + efeitos sonoros por evento (eventos.json da cena) e normaliza em -14 LUFS.
Uso (de ia/): python3 video/mix_eventos.py posts/<pasta>/out   → out/mix.wav
Efeitos de video/sfx: typing (corta na duração), whoosh, pop, ding. Volumes baixos: a voz manda.
"""
import json, subprocess, sys, os
OUT = sys.argv[1]; SFX = os.path.join(os.path.dirname(__file__), "sfx")
ev = json.load(open(f"{OUT}/eventos.json")); VOL = {"typing": 0.22, "whoosh": 0.35, "pop": 0.45, "ding": 0.35}
args = ["ffmpeg", "-y", "-loglevel", "error", "-i", f"{OUT}/voz.wav", "-i", f"{OUT}/trilha.wav"]
filt, rot = ["[1:a]volume=0.15[m]"], ["[v0]", "[m]"]
filt.insert(0, "[0:a]anull[v0]")
for k, e in enumerate(ev):
    args += ["-i", f"{SFX}/{e['som']}.mp3"]; i = k + 2; ms = int(max(0, e["t"]) * 1000)
    cut = f",atrim=0:{e['dur']:.2f},afade=t=out:st={max(0, e['dur'] - 0.15):.2f}:d=0.15" if e.get("dur") else ""
    filt.append(f"[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo{cut},volume={VOL.get(e['som'], 0.3)},adelay={ms}|{ms}[e{k}]"); rot.append(f"[e{k}]")
filt.append(f"{''.join(rot)}amix=inputs={len(rot)}:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]")
subprocess.run(args + ["-filter_complex", ";".join(filt), "-map", "[a]", "-ar", "44100", f"{OUT}/mix.wav"], check=True)
print("mix ok", len(ev), "efeitos")

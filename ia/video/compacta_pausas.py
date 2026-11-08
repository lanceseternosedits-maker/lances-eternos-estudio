# Encurta as pausas longas dentro de cada frase da voz já gerada (custo zero, sem mudar o tom nem a velocidade da fala)
# e refaz a timeline com o mesmo método do tts_frases.py. Use antes do acelera.py quando a leitura saiu arrastada.
# Uso: python3 compacta_pausas.py pasta_out [pausa_max_s=0.15]
import json, re, subprocess, sys, os
OUT = sys.argv[1]; PM = float(sys.argv[2]) if len(sys.argv) > 2 else 0.15; INI, GAP = 0.25, 0.12
T = json.load(open(f"{OUT}/timeline.json")); S = T["segmentos"]
dur = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
sil = lambda w: max(1, len(re.findall(r"[aeiouáéíóúâêôãõà]+", w.lower())))
arqs = []
for k, s in enumerate(S):
    a = round(s["t1"] - s["dur_voz"], 3); f = f"{OUT}/c{k}.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{OUT}/voz.wav", "-ss", str(a), "-t", str(s["dur_voz"]), "-af",
                    f"silenceremove=stop_periods=-1:stop_duration={PM}:stop_threshold=-42dB:stop_silence={PM}", "-ar", "44100", "-ac", "1", f], check=True)
    arqs.append(f)
segs, t = [], INI
for k, s in enumerate(S):
    d = dur(arqs[k]); leg = s["legenda"].split(); p = [sil(w) + 0.5 for w in leg]; x = t; ws = []
    for w, q in zip(leg, p): e = d * q / sum(p); ws.append({"w": w, "t0": round(x, 3), "t1": round(x + e, 3)}); x += e
    n = {a: b for a, b in s.items() if a not in ("t0", "t1", "fim", "palavras", "dur_voz")}
    segs.append({**n, "t0": round(t, 3), "t1": round(t + d, 3), "palavras": ws, "dur_voz": round(d, 3)}); t += d + GAP
total = round(t - GAP + 0.9, 3); segs[0]["t0"] = 0.0
for a, b in zip(segs, segs[1:]): a["fim"] = b["t0"]
segs[-1]["fim"] = total
fil = "".join(f"[{k}:a]apad=pad_dur={GAP if k < len(S) - 1 else 0}[a{k}];" for k in range(len(S))) + "".join(f"[a{k}]" for k in range(len(S))) + \
      f"concat=n={len(S)}:v=0:a=1,adelay={int(INI * 1000)}:all=1,apad=whole_dur={total}[o]"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error"] + sum((["-i", f] for f in arqs), []) + ["-filter_complex", fil, "-map", "[o]", "-ac", "1", "-ar", "44100", f"{OUT}/voz.wav"], check=True)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{OUT}/voz.wav", "-b:a", "128k", f"{OUT}/voz.mp3"], check=True)
[os.remove(f) for f in arqs]
T.update(total=total, segmentos=segs); json.dump(T, open(f"{OUT}/timeline.json", "w"), ensure_ascii=False, indent=1)
print(f"pausas compactadas: total {total:.1f}s")

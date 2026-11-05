# Voz frase por frase (Gemini TTS) para quando o Whisper não está disponível: cada segmento do roteiro vira um áudio
# separado, então o corte de cena cai exatamente na troca de frase. Palavras distribuídas pelas sílabas dentro da frase.
# Uso: GEMINI_API_KEY=... python3 tts_frases.py roteiro.json pasta_out  -> voz.mp3, voz.wav, timeline.json
import json, sys, os, re, base64, subprocess, urllib.request, concurrent.futures as cf
R = json.load(open(sys.argv[1])); OUT = sys.argv[2]; os.makedirs(OUT, exist_ok=True); S = R["segmentos"]
MODELO = R.get("modelo", "gemini-3.1-flash-tts-preview"); VOZ = R.get("voz", "Puck"); INI, GAP = 0.25, 0.12
ESTILO = R.get("estilo", "Diga em português do Brasil, com energia de criador de Reels, ritmo rápido e natural")
def gera(k):
    f = f"{OUT}/f{k}.wav"
    if os.path.exists(f): return f   # reaproveita frase já gerada (retomada após erro)
    for tent in range(5):
        try: return _gera(k)
        except urllib.error.HTTPError as e:
            if e.code != 429 or tent == 4: raise
            import time; time.sleep(20 * (tent + 1))   # limite de requisições: espera e tenta de novo
def _gera(k):
    body = {"contents": [{"parts": [{"text": f"{ESTILO}. Leia só o texto entre aspas: \"{S[k]['fala']}\""}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOZ}}}}}
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODELO}:generateContent", data=json.dumps(body).encode(),
                                 headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"})
    pcm = base64.b64decode(json.load(urllib.request.urlopen(req, timeout=300))["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
    f = f"{OUT}/f{k}.wav"; open(f + ".pcm", "wb").write(pcm)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", f + ".pcm", "-af",
                    "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                    "-ar", "44100", f], check=True); os.remove(f + ".pcm"); return f
with cf.ThreadPoolExecutor(2) as ex: arqs = list(ex.map(gera, range(len(S))))
dur = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
sil = lambda w: max(1, len(re.findall(r"[aeiouáéíóúâêôãõà]+", w.lower())))
segs, t = [], INI
for k, s in enumerate(S):
    d = dur(arqs[k]); leg = s["legenda"].split(); p = [sil(w) + 0.5 for w in leg]; x = t; ws = []
    for w, q in zip(leg, p): e = d * q / sum(p); ws.append({"w": w, "t0": round(x, 3), "t1": round(x + e, 3)}); x += e
    segs.append({**{a: b for a, b in s.items() if a != "fala"}, "t0": round(t, 3), "t1": round(t + d, 3), "palavras": ws, "dur_voz": round(d, 3)}); t += d + GAP
total = round(t - GAP + R.get("cauda", 0.9), 3); segs[0]["t0"] = 0.0
for a, b in zip(segs, segs[1:]): a["fim"] = b["t0"]
segs[-1]["fim"] = total
# junta: INI de silêncio, frases com GAP entre elas
fil = "".join(f"[{k}:a]apad=pad_dur={GAP if k < len(S) - 1 else 0}[a{k}];" for k in range(len(S))) + "".join(f"[a{k}]" for k in range(len(S))) + \
      f"concat=n={len(S)}:v=0:a=1,adelay={int(INI * 1000)}:all=1,apad=whole_dur={total}[o]"
args = ["ffmpeg", "-y", "-loglevel", "error"] + sum((["-i", f] for f in arqs), []) + ["-filter_complex", fil, "-map", "[o]", "-ac", "1", "-ar", "44100"]
subprocess.run(args + [f"{OUT}/voz.wav"], check=True); subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{OUT}/voz.wav", "-b:a", "128k", f"{OUT}/voz.mp3"], check=True)
[os.remove(f) for f in arqs]
json.dump({"total": total, "segmentos": segs, "tempos": "frase por frase + sílabas"}, open(f"{OUT}/timeline.json", "w"), ensure_ascii=False, indent=1)
print(f"total {total:.1f}s · voz {VOZ}"); [print(f'{s["t0"]:6.2f}-{s["fim"]:6.2f} {s["cena"]} ({s["dur_voz"]}s)') for s in segs]

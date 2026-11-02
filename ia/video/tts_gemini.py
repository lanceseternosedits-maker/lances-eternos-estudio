# Narração pelo Gemini TTS (mesma chave do vídeo e da imagem), em UMA tomada, com o tempo de cada palavra.
# O Gemini não devolve o tempo das palavras: o Whisper (faster-whisper, local) mede depois.
# Uso: GEMINI_API_KEY=... python3 tts_gemini.py roteiro.json pasta_saida [--audio arquivo_existente]
#   -> pasta/voz.wav + pasta/timeline.json (mesmo formato do tts_eleven.py; a cena e o montar.sh não mudam)
# roteiro.json: {"voz": "Puck", "estilo": "instrução de tom", "modelo": "...", "segmentos": [{"cena","fala","legenda",...}]}
import json, sys, os, base64, subprocess, re, unicodedata, difflib, urllib.request
import numpy as np

R = json.load(open(sys.argv[1])); OUT = sys.argv[2]; os.makedirs(OUT, exist_ok=True)
AUDIO = sys.argv[sys.argv.index("--audio") + 1] if "--audio" in sys.argv else None
S = R["segmentos"]; INI = 0.25
MODELO = R.get("modelo", os.environ.get("GEMINI_TTS_MODEL", "gemini-3.1-flash-tts-preview"))
VOZ = R.get("voz", "Puck")
ESTILO = R.get("estilo", "Leia em português do Brasil, como um criador de Reels animado e confiante: "
               "ritmo rápido mas claro, energia alta no começo, sem soar robótico, pausas curtas só na pontuação.")
texto = " ".join(s["fala"].strip() for s in S)

# 1) gerar a voz (PCM 24 kHz mono)
if not AUDIO:
    body = {"contents": [{"parts": [{"text": f"{ESTILO}\n\n{texto}"}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOZ}}}}}
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODELO}:generateContent",
                                 data=json.dumps(body).encode(),
                                 headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"})
    r = json.load(urllib.request.urlopen(req, timeout=300))
    pcm = base64.b64decode(r["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
    open(f"{OUT}/voz.pcm", "wb").write(pcm)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", f"{OUT}/voz.pcm",
                    "-af", "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                    "-b:a", "128k", f"{OUT}/voz.mp3"], check=True)
    os.remove(f"{OUT}/voz.pcm"); AUDIO = f"{OUT}/voz.mp3"

# 2) medir o tempo de cada palavra com o Whisper
raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", AUDIO, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
                     capture_output=True, check=True).stdout
wav = np.frombuffer(raw, np.float32); dur = len(wav) / 16000
from faster_whisper import WhisperModel
segw, _ = WhisperModel("small", compute_type="int8").transcribe(wav, language="pt", word_timestamps=True)
ww = [(w.word.strip(), w.start, w.end) for s in segw for w in s.words if w.word.strip()]

norm = lambda w: re.sub(r"\W", "", unicodedata.normalize("NFKD", w.lower()).encode("ascii", "ignore").decode())
fal = [(k, w) for k, s in enumerate(S) for w in s["fala"].split()]          # palavras do roteiro, com o segmento
tm = [None] * len(fal)
sm = difflib.SequenceMatcher(None, [norm(w) for _, w in fal], [norm(w) for w, _, _ in ww], autojunk=False)
for a, b, n in sm.get_matching_blocks():
    for i in range(n): tm[a + i] = (ww[b + i][1], ww[b + i][2])
# palavras não reconhecidas: interpolar entre as vizinhas
known = [i for i, t in enumerate(tm) if t]
assert len(known) >= len(fal) * 0.6, f"Whisper reconheceu só {len(known)}/{len(fal)} palavras — confira a voz"
for i in range(len(fal)):
    if tm[i]: continue
    p = max([j for j in known if j < i], default=None); q = min([j for j in known if j > i], default=None)
    a = tm[p][1] if p is not None else 0.0; b = tm[q][0] if q is not None else dur
    lo = p if p is not None else -1; hi = q if q is not None else len(fal)
    d = (b - a) / (hi - lo); tm[i] = (a + d * (i - lo - 1) + 0.01, a + d * (i - lo))

# 3) timeline no mesmo formato do tts_eleven.py
segs = []
for k, s in enumerate(S):
    ts = [tm[i] for i, (kk, _) in enumerate(fal) if kk == k]
    st, en = ts[0][0] + INI, ts[-1][1] + INI
    leg = s["legenda"].split()
    if len(leg) == len(ts): ws = [{"w": w, "t0": round(b + INI, 3), "t1": round(c + INI, 3)} for w, (b, c) in zip(leg, ts)]
    else:
        peso = [len(re.sub(r"\W", "", w)) + 2 for w in leg]; acc = st; ws = []
        for w, p in zip(leg, peso): d = (en - st) * p / sum(peso); ws.append({"w": w, "t0": round(acc, 3), "t1": round(acc + d, 3)}); acc += d
    segs.append({**{x: y for x, y in s.items() if x != "fala"}, "t0": round(st, 3), "t1": round(en, 3), "palavras": ws})
for k in range(1, len(segs)): segs[k]["t0"] = round(max(segs[k - 1]["t1"], segs[k]["t0"] - 0.12), 3)
segs[0]["t0"] = 0.0
total = round(max(dur, tm[-1][1]) + INI + R.get("cauda", 0.9), 3)
for x, y in zip(segs, segs[1:]): x["fim"] = y["t0"]
segs[-1]["fim"] = total
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", AUDIO, "-af", f"adelay={int(INI * 1000)}:all=1,apad=whole_dur={total}",
                "-ar", "44100", "-ac", "1", f"{OUT}/voz.wav"], check=True)
json.dump({"total": total, "segmentos": segs}, open(f"{OUT}/timeline.json", "w"), ensure_ascii=False, indent=1)
print(f"total {total:.1f}s · voz {VOZ} · {len(known)}/{len(fal)} palavras medidas pelo Whisper")
[print(f'{s["t0"]:6.2f}-{s["fim"]:6.2f} {s["cena"]}') for s in segs]

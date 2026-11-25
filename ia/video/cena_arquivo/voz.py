# Voz do "Arquivo Secreto": Gemini TTS, uma chamada por clip (o plan.py precisa da duração de cada frase).
# Substitui voice.py/tts.py da referência (Flite em inglês com fonética "aportuguesada").
# Uso: GEMINI_API_KEY=... python3 voz.py <roteiro.json> <pasta_trabalho>   -> pasta/vo/<clip>.wav + vo/durs.json
# Custo: ~US$ 0,02 por vídeo (texto curto). Clip já gerado não é refeito (apague o .wav para refazer).
import json, sys, os, base64, subprocess, time, wave, urllib.request, urllib.error

R = json.load(open(sys.argv[1])); OUT = sys.argv[2]
os.makedirs(f"{OUT}/vo", exist_ok=True)
MODELO = R.get("modelo", os.environ.get("GEMINI_TTS_MODEL", "gemini-3.1-flash-tts-preview"))
VOZ = R.get("voz", "Charon")
ESTILO = R.get("estilo", "Narrador brasileiro, voz masculina, contando um caso real em tom de suspense")
TEMPO = float(os.environ.get("ATEMPO", R.get("atempo", 1.0)))


def tts(txt, raw):
    body = {"contents": [{"parts": [{"text": f"{ESTILO}. Diga em português do Brasil: {txt}"}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOZ}}}}}
    for tent in range(6):
        try:
            req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODELO}:generateContent",
                                         data=json.dumps(body).encode(),
                                         headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"})
            r = json.load(urllib.request.urlopen(req, timeout=180))
            open(raw, "wb").write(base64.b64decode(r["candidates"][0]["content"]["parts"][0]["inlineData"]["data"]))
            return
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 503) and tent < 5:
                time.sleep(15 * (tent + 1)); continue
            raise SystemExit(f"Gemini recusou ({e.code}): {e.read()[:300]!r}")


durs = {}
for s in R["segmentos"]:
    k = s["clip"]; wav = f"{OUT}/vo/{k}.wav"
    if not os.path.exists(wav):
        raw = f"{OUT}/vo/{k}.pcm"
        tts(s["fala"], raw)
        # mesmo tratamento da referência: corta silêncio, EQ quente, compressão leve
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", raw, "-af",
                        "aresample=44100,silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
                        "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
                        "highpass=f=70,equalizer=f=140:t=q:w=1:g=3,equalizer=f=3200:t=q:w=1.5:g=2,"
                        f"acompressor=threshold=-20dB:ratio=3:attack=5:release=80,atempo={TEMPO}",
                        "-ac", "1", wav], check=True)
        os.remove(raw)
        print("voz", k, flush=True)
    with wave.open(wav) as w:
        durs[k] = w.getnframes() / w.getframerate()
json.dump(durs, open(f"{OUT}/vo/durs.json", "w"), indent=1)
print(json.dumps(durs), round(sum(durs.values()), 2))

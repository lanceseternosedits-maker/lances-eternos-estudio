# Narração ElevenLabs (voz Gabriel) com tempo exato de cada palavra.
# Uso: ELEVENLABS_API_KEY=... python3 tts_eleven.py roteiro.json pasta_saida
#   -> pasta/voz.wav + pasta/timeline.json  (mesmo formato que a cena lê)
# roteiro.json: {"voz": "<voice_id opcional>", "segmentos": [{"cena": "...", "fala": "texto falado", "legenda": "texto na tela", ...}]}
import json, sys, os, base64, subprocess, re, urllib.request

R = json.load(open(sys.argv[1])); OUT = sys.argv[2]; os.makedirs(OUT, exist_ok=True)
KEY = os.environ["ELEVENLABS_API_KEY"]
VOZ = R.get("voz", "fcJDpjLCtoGvTUQmNdkr")  # Gabriel Buranello (biblioteca ElevenLabs, pt-BR)
SET = {"stability": 0.35, "similarity_boost": 0.8, "style": 0.45, "speed": R.get("ritmo", 1.1)}
SR = 44100

def tts(texto, antes, depois):
    body = {"text": texto, "model_id": "eleven_multilingual_v2", "voice_settings": SET}
    if antes: body["previous_text"] = antes          # mantém a entonação contínua entre as frases
    if depois: body["next_text"] = depois
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VOZ}/with-timestamps?output_format=mp3_44100_128",
                                 data=json.dumps(body).encode(), headers={"xi-api-key": KEY, "Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req))

def palavras(al, off):
    # junta caracteres em palavras com início/fim reais
    ws, cur, t0 = [], "", None
    for ch, a, b in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
        if ch.isspace():
            if cur: ws.append([cur, t0 + off, last + off]); cur = ""
            continue
        if not cur: t0 = a
        cur += ch; last = b
    if cur: ws.append([cur, t0 + off, last + off])
    return ws

segs, partes, t = [], [], 0.3
S = R["segmentos"]
for i, s in enumerate(S):
    r = tts(s["fala"], S[i - 1]["fala"] if i else None, S[i + 1]["fala"] if i + 1 < len(S) else None)
    mp3 = f"{OUT}/s{i}.mp3"; open(mp3, "wb").write(base64.b64decode(r["audio_base64"]))
    al = r["alignment"]; ini = al["character_start_times_seconds"][0]; fim = al["character_end_times_seconds"][-1]
    falados = palavras(al, t - ini)
    # legenda: mesmas palavras da fala quando batem; senão distribui pelo tempo das palavras faladas
    leg = s["legenda"].split()
    if len(leg) == len(falados): ws = [{"w": w, "t0": round(a, 3), "t1": round(b, 3)} for w, (_, a, b) in zip(leg, falados)]
    else:
        a0, a1 = falados[0][1], falados[-1][2]; peso = [len(re.sub(r"\W", "", w)) + 2 for w in leg]; acc = a0; ws = []
        for w, p in zip(leg, peso): d = (a1 - a0) * p / sum(peso); ws.append({"w": w, "t0": round(acc, 3), "t1": round(acc + d, 3)}); acc += d
    d = fim - ini
    partes.append((mp3, ini, d)); segs.append({**{k: v for k, v in s.items() if k != "fala"}, "t0": round(t, 3), "t1": round(t + d, 3), "palavras": ws})
    t += d + s.get("pausa", 0.12)
total = t + R.get("cauda", 1.0)
# monta a faixa: cada frase no seu tempo
flt, ins = [], []
for k, (f, ini, d) in enumerate(partes):
    ins += ["-i", f]; flt.append(f"[{k}:a]atrim={ini:.3f}:{ini + d + .05:.3f},asetpts=PTS-STARTPTS,adelay={int(segs[k]['t0'] * 1000)}:all=1[a{k}]")
flt.append("".join(f"[a{k}]" for k in range(len(partes))) + f"amix=inputs={len(partes)}:normalize=0,apad=whole_dur={total:.3f}[o]")
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *ins, "-filter_complex", ";".join(flt), "-map", "[o]", "-ar", str(SR), "-ac", "1", f"{OUT}/voz.wav"], check=True)
for a, b in zip(segs, segs[1:]): a["fim"] = b["t0"]
segs[-1]["fim"] = round(total, 3)
json.dump({"total": round(total, 3), "segmentos": segs}, open(f"{OUT}/timeline.json", "w"), ensure_ascii=False, indent=1)
print(f"total {total:.1f}s"); [print(f'{s["t0"]:6.2f}-{s["fim"]:6.2f} {s["cena"]}') for s in segs]

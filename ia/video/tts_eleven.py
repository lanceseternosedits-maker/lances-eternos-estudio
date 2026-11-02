# Narração ElevenLabs (voz Gabriel) gravada em UMA tomada só, com o tempo exato de cada palavra.
# A fala sai contínua e natural; as cenas são cortadas depois, pelo tempo das palavras.
# Uso: ELEVENLABS_API_KEY=... python3 tts_eleven.py roteiro.json pasta_saida
#   -> pasta/voz.wav + pasta/timeline.json (mesmo formato que a cena lê)
# roteiro.json: {"voz": "<voice_id opcional>", "ritmo": 1.05, "segmentos": [{"cena": "...", "fala": "texto falado", "legenda": "texto na tela", ...}]}
import json, sys, os, base64, subprocess, re, urllib.request

R = json.load(open(sys.argv[1])); OUT = sys.argv[2]; os.makedirs(OUT, exist_ok=True)
KEY = os.environ["ELEVENLABS_API_KEY"]
VOZ = R.get("voz", "fcJDpjLCtoGvTUQmNdkr")  # Gabriel Buranello (biblioteca ElevenLabs, pt-BR)
SET = {"stability": 0.4, "similarity_boost": 0.8, "style": 0.35, "speed": R.get("ritmo", 1.05), "use_speaker_boost": True}
S = R["segmentos"]; INI = 0.25

# 1) texto único: as falas em sequência, separadas por espaço (a pontuação de cada fala dá as pausas naturais)
partes, spans, pos = [], [], 0
for s in S:
    f = s["fala"].strip(); spans.append((pos, pos + len(f))); partes.append(f); pos += len(f) + 1
texto = " ".join(partes)
body = {"text": texto, "model_id": R.get("modelo", "eleven_multilingual_v2"), "voice_settings": SET}
req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VOZ}/with-timestamps?output_format=mp3_44100_128",
                             data=json.dumps(body).encode(), headers={"xi-api-key": KEY, "Content-Type": "application/json"})
r = json.load(urllib.request.urlopen(req))
open(f"{OUT}/voz.mp3", "wb").write(base64.b64decode(r["audio_base64"]))
al = r.get("normalized_alignment") if r.get("normalized_alignment", {}).get("characters") and "".join(r["normalized_alignment"]["characters"]) == texto else r["alignment"]
ch, a0, a1 = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
assert "".join(ch) == texto, "alinhamento não bate com o texto"

# 2) palavras faladas com tempo, por segmento
def palavras(i0, i1):
    ws, cur, t0, last = [], "", None, None
    for i in range(i0, i1):
        c = ch[i]
        if c.isspace():
            if cur: ws.append([cur, t0, last]); cur = ""
            continue
        if not cur: t0 = a0[i]
        cur += c; last = a1[i]
    if cur: ws.append([cur, t0, last])
    return ws

segs = []
for k, (s, (i0, i1)) in enumerate(zip(S, spans)):
    fal = palavras(i0, i1); st, en = fal[0][1] + INI, fal[-1][2] + INI
    leg = s["legenda"].split()
    if len(leg) == len(fal): ws = [{"w": w, "t0": round(b + INI, 3), "t1": round(c + INI, 3)} for w, (_, b, c) in zip(leg, fal)]
    else:
        peso = [len(re.sub(r"\W", "", w)) + 2 for w in leg]; acc = st; ws = []
        for w, p in zip(leg, peso): d = (en - st) * p / sum(peso); ws.append({"w": w, "t0": round(acc, 3), "t1": round(acc + d, 3)}); acc += d
    segs.append({**{x: y for x, y in s.items() if x != "fala"}, "t0": round(st, 3), "t1": round(en, 3), "palavras": ws})
# a cena começa um pouquinho antes da primeira palavra e vai até a próxima cena
for k in range(1, len(segs)): segs[k]["t0"] = round(max(segs[k - 1]["t1"], segs[k]["t0"] - 0.12), 3)
segs[0]["t0"] = 0.0
total = round(a1[-1] + INI + R.get("cauda", 0.9), 3)
for x, y in zip(segs, segs[1:]): x["fim"] = y["t0"]
segs[-1]["fim"] = total
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{OUT}/voz.mp3", "-af", f"adelay={int(INI * 1000)}:all=1,apad=whole_dur={total}",
                "-ar", "44100", "-ac", "1", f"{OUT}/voz.wav"], check=True)
json.dump({"total": total, "segmentos": segs}, open(f"{OUT}/timeline.json", "w"), ensure_ascii=False, indent=1)
print(f"total {total:.1f}s ({len(texto)} caracteres)"); [print(f'{s["t0"]:6.2f}-{s["fim"]:6.2f} {s["cena"]}') for s in segs]

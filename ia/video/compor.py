# Monta o Reel a partir de clipes de vídeo prontos (ex.: Gemini Omni), um por segmento do roteiro.
# Uso: python3 compor.py roteiro.json pasta_out [clipes.json]
#   pasta_out precisa de timeline.json e voz.wav (tts_gemini.py); trilha.wav (musica.py) e sfx.wav (sfx_mix.py) são opcionais.
#   clipes.json: {"<cena>": {"arquivo": "caminho.mp4", "ini": 0.4}, ...}  (ini = segundos a pular no começo do clipe,
#   p.ex. quando o modelo abre com a imagem de referência). Sem clipes.json: pasta_out/clipes/<cena>.mp4, ini 0.
# O que faz: corta cada clipe na duração do seu segmento (t0 até o t0 do próximo), emenda em corte seco, descarta o áudio
# dos clipes, e põe por cima: etiqueta (campo tag) no topo, legenda palavra por palavra no
# terço inferior (palavra atual destacada; nunca fica vazia) e "COMENTA <CHAVE>" no último segmento. Depois mixa voz +
# trilha (sidechain, baixa) + efeitos, loudnorm -14 LUFS (mesmo filtro do montar.sh).  Saída: pasta_out/reel.mp4 (1080x1920, 30 fps).
import json, os, sys, subprocess, re, shutil
from PIL import Image, ImageDraw, ImageFont

R = json.load(open(sys.argv[1])); OUT = os.path.abspath(sys.argv[2])
T = json.load(open(os.path.join(OUT, "timeline.json"))); S = T["segmentos"]; TOTAL = T["total"]; N = len(S)
CL = json.load(open(sys.argv[3])) if len(sys.argv) > 3 else {}
W, H, FPS = 1080, 1920, 30
AQUI = os.path.dirname(os.path.abspath(__file__))
F_TAG = os.path.join(AQUI, "cena_modelo/f/space-grotesk-latin-700-normal.woff2")
F_LEG = "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"
if not os.path.exists(F_LEG): F_LEG = F_TAG
CREME, TINTA, LARANJA, AMARELO = (244, 235, 221), (22, 19, 31), (255, 122, 26), (255, 214, 64)
fonte = lambda p, s: ImageFont.truetype(p, s)

# ---------- tempos ----------
fim = [S[k + 1]["t0"] if k + 1 < N else TOTAL for k in range(N)]

# blocos de legenda: até 3 palavras, quebra depois de pontuação
blocos = []   # (k, [palavras])
for k, s in enumerate(S):
    cur = []
    for p in s["palavras"]:
        cur.append(p)
        if len(cur) == 3 or re.search(r"[,.?!:;]$", p["w"]): blocos.append((k, cur)); cur = []
    if cur: blocos.append((k, cur))
# cada bloco fica na tela do início da 1ª palavra até o início do próximo bloco (o 1º de cada cena começa no corte)
eventos = []  # (t, k, bloco_idx, palavra_idx)
for b, (k, ws) in enumerate(blocos):
    for i, p in enumerate(ws):
        t = p["t0"]
        if i == 0 and (b == 0 or blocos[b - 1][0] != k): t = S[k]["t0"]   # primeiro bloco da cena entra junto com a cena
        eventos.append([t, k, b, i])
eventos.sort(key=lambda e: e[0])
# garante que a troca de cena sempre gere um estado novo (etiqueta/selo mudam no corte)
for k in range(N):
    if not any(abs(e[0] - S[k]["t0"]) < 1e-6 and e[1] == k for e in eventos):
        ant = [e for e in eventos if e[0] <= S[k]["t0"]][-1]
        eventos.append([S[k]["t0"], k, ant[2], ant[3]])
eventos.sort(key=lambda e: e[0]); eventos[0][0] = 0.0

# ---------- desenho ----------
def caixa_texto(d, xy, txt, f, fg, bg, pad=(34, 18), raio=16, ancora="mt"):
    x, y = xy; l, t, r, b = d.textbbox((0, 0), txt, font=f); w, h = r - l, b - t
    x0 = x - w / 2 - pad[0] if ancora == "mt" else x - w - 2 * pad[0]
    d.rounded_rectangle([x0, y, x0 + w + 2 * pad[0], y + h + 2 * pad[1]], raio, fill=bg)
    d.text((x0 + pad[0] - l, y + pad[1] - t), txt, font=f, fill=fg)
    return x0, y, x0 + w + 2 * pad[0], y + h + 2 * pad[1]

def quadro(k, b, i):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    # etiqueta no topo (sombra leve + papel creme)
    tag = S[k].get("tag", "").upper(); ft = fonte(F_TAG, 64)
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ds = ImageDraw.Draw(sh)
    caixa_texto(ds, (W / 2 + 6, 190), tag, ft, (0, 0, 0, 0), (0, 0, 0, 110))
    im.alpha_composite(sh); caixa_texto(d, (W / 2, 184), tag, ft, TINTA, CREME + (255,))
    # sem selo contador (decisão do Vitor, 04/11: numeração não aparece para o público)
    # CTA no último segmento
    if k == N - 1:
        # numa linha só, abaixo da legenda (CTA_Y), para não cobrir o rosto do mascote
        chave = R.get("chave", "").upper(); fc = fonte(F_TAG, 100); y = int(os.environ.get("CTA_Y", 1430))
        w1 = d.textlength("COMENTA", font=fc) + 76; w2 = d.textlength(chave, font=fc) + 76; x0 = W / 2 - (w1 + w2 + 20) / 2
        caixa_texto(d, (x0 + w1 / 2, y), "COMENTA", fc, (255, 255, 255), LARANJA + (255,), pad=(38, 22), raio=22)
        caixa_texto(d, (x0 + w1 + 20 + w2 / 2, y), chave, fc, TINTA, AMARELO + (255,), pad=(38, 22), raio=22)
    # legenda: bloco atual, palavra atual em amarelo e um pouco maior
    ws = [p["w"] for p in blocos[b][1]]; base, maior = 92, 104
    fl, fm = fonte(F_LEG, base), fonte(F_LEG, maior)
    medidas = [d.textlength(w_, font=fm if j == i else fl) for j, w_ in enumerate(ws)]; esp = 26
    linhas, cur, larg = [], [], 0
    for j, m in enumerate(medidas):                       # quebra se passar de 960 px
        if cur and larg + esp + m > 960: linhas.append(cur); cur, larg = [], 0
        larg += (esp if cur else 0) + m; cur.append(j)
    linhas.append(cur); y = 1300 - (len(linhas) - 1) * 60
    for ln in linhas:
        tot = sum(medidas[j] for j in ln) + esp * (len(ln) - 1); x = W / 2 - tot / 2
        for j in ln:
            f = fm if j == i else fl
            d.text((x, y), ws[j], font=f, fill=AMARELO if j == i else (255, 255, 255), anchor="ls",
                   stroke_width=10, stroke_fill=(0, 0, 0))
            x += medidas[j] + esp
        y += 120
    return im

tmp = os.path.join(OUT, "_compor"); shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
lista = []
for n, (t, k, b, i) in enumerate(eventos):
    t1 = eventos[n + 1][0] if n + 1 < len(eventos) else TOTAL
    if t1 - t < 1e-4: continue
    p = os.path.join(tmp, f"o{n:04d}.png"); quadro(k, b, i).save(p); lista.append((p, t1 - t))
with open(os.path.join(tmp, "lista.txt"), "w") as fh:
    for p, d_ in lista: fh.write(f"file '{p}'\nduration {d_:.4f}\n")
    fh.write(f"file '{lista[-1][0]}'\n")

# ---------- vídeo: cortes secos + sobreposição ----------
args, fil = ["ffmpeg", "-y", "-loglevel", "error"], []
for k, s in enumerate(S):
    c = CL.get(s["cena"], {}); arq = c.get("arquivo", os.path.join(OUT, "clipes", s["cena"] + ".mp4")); ini = c.get("ini", 0)
    dur = fim[k] - s["t0"]
    real = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", arq],
                                capture_output=True, text=True).stdout)
    assert real - ini >= dur - 0.02, f"clipe {s['cena']} curto: {real - ini:.2f}s < {dur:.2f}s"
    args += ["-ss", f"{ini:.3f}", "-t", f"{dur + 0.1:.3f}", "-i", arq]
    fil.append(f"[{k}:v]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS},setsar=1,"
               f"trim=duration={dur:.4f},setpts=PTS-STARTPTS[v{k}]")
args += ["-f", "concat", "-safe", "0", "-i", os.path.join(tmp, "lista.txt")]
fil.append("".join(f"[v{k}]" for k in range(N)) + f"concat=n={N}:v=1:a=0[base]")
fil.append(f"[{N}:v]fps={FPS},format=rgba[ov];[base][ov]overlay=0:0:eof_action=repeat:format=auto,format=yuv420p[v]")
# ---------- áudio ----------
voz, tri, sfx = (os.path.join(OUT, x) for x in ("voz.wav", "trilha.wav", "sfx.wav"))
a = N + 1; args += ["-i", voz]; fil.append(f"[{a}:a]aresample=48000,highpass=f=80,acompressor=threshold=-20dB:ratio=3,volume=2,asplit=2[vo][vs]")
mix, n_in = "[vo]", 1
if os.path.exists(tri):
    args += ["-i", tri]; a += 1; fil.append(f"[{a}:a]volume=0.18[m];[m][vs]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=300[md]")
    mix += "[md]"; n_in += 1
else: fil.append("[vs]anullsink")
if os.path.exists(sfx):
    args += ["-i", sfx]; a += 1; fil.append(f"[{a}:a]volume=0.55[fx]"); mix += "[fx]"; n_in += 1
fil.append(f"{mix}amix=inputs={n_in}:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5[a]")
br = os.environ.get("VBR")   # ex.: VBR=8M para limitar o tamanho
venc = ["-c:v", "libx264", "-preset", "medium"] + (["-b:v", br, "-maxrate", br, "-bufsize", br] if br else ["-crf", "20"])
args += ["-filter_complex", ";".join(fil), "-map", "[v]", "-map", "[a]", "-t", f"{TOTAL:.3f}"] + venc + \
        ["-pix_fmt", "yuv420p", "-r", str(FPS), "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", os.path.join(OUT, "reel.mp4")]
subprocess.run(args, check=True)
shutil.rmtree(tmp, ignore_errors=True)
print("ok", os.path.join(OUT, "reel.mp4"), f"{TOTAL:.2f}s", N, "cenas", len(lista), "estados de legenda")

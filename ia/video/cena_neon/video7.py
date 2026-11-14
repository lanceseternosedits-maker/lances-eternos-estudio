#!/usr/bin/env python3
"""v7 (Vitor, 14/11): cenário moderno por tema (scene3.frag) + câmera variando por cena. Base: padrão v6 (Graphify) para qualquer roteiro: lê <post>/v6.json + <post>/out/timeline.json + <post>/out/voz.wav.
O video5.py (Graphify) tem as 16 cenas fixas; aqui cada segmento do v6.json descreve a sua cena:
  quem A (mascote, voz principal) | B (robô, voz que pergunta)
  tipo A | B | AB | orbita (grafo de luz sem personagem)
  placa "TEXTO", cor ouro|verde|vermelho|azul|ciano, conta [de, ate, "formato {}"] (número que conta na placa)
  medidor [de, ate, "RÓTULO"], grafo 0|1|"cresce", balao "TEXTO", cab ["parte normal ", "parte em destaque"], chave [palavras em dourado]
Texto na tela no Visual clean (14/11): Archivo Black branco + dourado #ffc93c, sombra suave, sem contorno.
Uso: DISPLAY=:99 CENA_FRAG=scene3.frag POST=posts/<pasta> python3 video7.py saida.mp4 [--quadros 0,120] [--faixa a:b]
"""
import json, math, os, subprocess, sys, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import video3 as V3
from video import ease, eout, lerp, pisca, W, H, FPS
from video3 import placa, VERDE, VERMELHO, FB

os.environ.setdefault("CENA_FRAG", "scene3.frag")
POST = os.environ["POST"]
CFG = json.load(open(os.path.join(POST, "v6.json")))
TL = json.load(open(os.path.join(POST, "out", "timeline.json")))
SEGS = CFG["segmentos"]; TS = TL["segmentos"]
assert len(SEGS) == len(TS), (len(SEGS), len(TS))
INI = [s["t0"] for s in TS]; FIM = TL["total"]
INICIOS = np.array(INI + [FIM]); DUR = FIM; NQ = int(round(DUR * FPS))
DURS = [b - a for a, b in zip(INI, INI[1:] + [FIM])]
QUEM = "".join(s.get("quem", "A") for s in SEGS)

OURO = (255, 201, 60); BRANCO = (255, 255, 255)
CORES = dict(ouro=OURO, verde=(120, 255, 120), vermelho=(255, 90, 70), azul=(110, 210, 255), ciano=(120, 255, 210), branco=(240, 240, 240))
AF = os.path.expanduser("~/.fonts/ArchivoBlack.ttf")
F_LEG = ImageFont.truetype(AF, 84); F_CAB = ImageFont.truetype(AF, 50); F_BAL = ImageFont.truetype(AF, 56)
def limpa(w): return w.strip(".,?!:;…").lower()

# ---------- palavras (tempo do TTS) ----------
PAL = [[(p["t0"] + .03, p["w"]) for p in s["palavras"]] for s in TS]
PLANO = []
for p in PAL:
    ch, cur = [], []
    for t, w in p:
        cur.append((t, w))
        if w[-1] in ".,?!:…" or len(cur) >= 3: ch.append(cur); cur = []
    if cur: ch.append(cur)
    PLANO.append(ch)
CHAVE = [set(limpa(w) for w in s.get("chave", [])) for s in SEGS]

# ---------- envelope da voz (boca) ----------
def _envelope():
    wv = wave.open(os.path.join(POST, "out", "voz.wav"))
    a = np.frombuffer(wv.readframes(wv.getnframes()), "<i2").astype(np.float32).reshape(-1, wv.getnchannels()).mean(1)
    sr = wv.getframerate(); a = np.diff(a); hop = sr // 60; n = len(a) // hop
    e = np.sqrt((a[:n * hop].reshape(n, hop) ** 2).mean(1))
    e = np.convolve(e, np.ones(3) / 3, "same"); e = e / (np.percentile(e, 95) + 1e-6)
    e = np.clip(e, 0, 1.2); o = np.zeros_like(e); v = 0.
    for i, x in enumerate(e): v += (x - v) * (.45 if x > v else .18); o[i] = v
    return o
ENV = _envelope()
def env(T): return float(ENV[min(len(ENV) - 1, int(T * 60))])
def falando(k, T): p = PAL[k]; return p[0][0] - .05 <= T <= p[-1][0] + .45

# ---------- cena a partir do spec ----------
def medidor(pct, cor, rot):
    im = Image.new("RGB", (512, 320), (3, 12, 9)); d = ImageDraw.Draw(im)
    f = ImageFont.truetype(FB, 78)
    while d.textlength(rot, font=f) > 470: f = ImageFont.truetype(FB, f.size - 4)
    d.text((256, 58), rot, font=f, fill=(235, 245, 235), anchor="mm")
    d.text((256, 210), f"{int(round(pct))}%", font=ImageFont.truetype(FB, 175), fill=cor, anchor="mm")
    return im
def tc(c): return tuple(int(255 * min(1, x * 1.1)) for x in c)

def cena(k, lt, T):
    s = SEGS[k]; tipo = s.get("tipo", s.get("quem", "A"))
    c = V3.base(T); c["uC"] = [(9., 0., 0., 0.), (9., 0., 0., 0.)]
    braco = ease((lt - .3) / .4) * (1 - ease((DURS[k] - .5 - lt) / .4) * 0) if s.get("braco") else 0.
    if "A" in tipo:
        c["uC"][0] = (.05, 0., .2, .12); c["uCb"][0] = (0., 1., 0., s.get("sobrancelha", -.25))
        c["uCa"][0] = (.15, .15 + braco * (2.35 + .25 * math.sin(lt * 9)), 1 + .02 * math.sin(T * 3.1), pisca(T, .7))
    if "B" in tipo:
        c["uC"][1] = (.05, 0., .2, -.1); c["uCb"][1] = (0., 1., 1., 0.)
        c["uCa"][1] = (.1, .1, 1 + .02 * math.sin(T * 2.7), 1.)
    tex = {}
    g = s.get("grafo", 0)
    c["uGraph"] = eout(lt / 2.6) if g == "cresce" else float(g)
    if s.get("medidor"):
        de, ate, rot = s["medidor"]; q = eout((lt - .3) / 2.2); v = de + (ate - de) * q
        cor = lerp(VERMELHO, VERDE, v / 100.)
        c.update(uMeter=(-1.0, 0., -1.9, 1.), uLevel=max(.04, v / 100.), uMeterCol=cor); tex["uMeterTex"] = medidor(v, tc(cor), rot)
    txt = s.get("placa", "")
    if s.get("conta"):
        de, ate, fmt = s["conta"]; v = de + (ate - de) * eout((lt - .2) / max(1., DURS[k] * .6))
        dec = 1 if isinstance(ate, float) and ate != int(ate) else 0
        txt = fmt.format(f"{v:,.{dec}f}".replace(",", "X").replace(".", ",").replace("X", "."))
    if txt:
        on = min(1., lt / .4) * (.3 if .12 < lt < .2 else 1.)
        c.update(uSign=(0., 3.9, -3.6, on), uSignSize=(2.0, .5))
    tex["uSignTex"] = placa(txt, CORES.get(s.get("cor", "ouro"), OURO)) if txt else placa("")
    if tipo == "orbita":
        a = -.5 + lt * .18
        c.update(uCamPos=(math.sin(a) * 4.2, 2.6, -2.6 + math.cos(a) * 4.2), uCamTgt=(0., 2.4, -2.6), uFov=1.0)
        if txt: c.update(uSign=(0., 3.9, -4.6, c["uSign"][3]))
        return c, dict(uFocus=3.9, uAperture=.6), tex
    return c, dict(uFocus=4.0, uAperture=.45), tex

def atuar(c, k, T):
    fala = QUEM[k]; on = falando(k, T); e = env(T) if on else 0.
    vis = [c["uCb"][i][1] > .5 for i in (0, 1)]
    face = [[0., 0., 0., 0.], [0., 0., 0., 0.]]
    for i, nome in enumerate("AB"):
        if not vis[i]: continue
        f = face[i]
        if nome == fala:
            f[0] = min(.9, max(0., (e - .1) / .75)) ** .8; f[1] = .06 * math.sin(T * 1.1 + i)
            ca = list(c["uCa"][i]); ca[2] += .025 * e
            if ca[1] < .5: ca[1] = .15 + .45 * max(0., math.sin(T * 2.6 + i)) * min(1., e * 1.5)
            c["uCa"][i] = tuple(ca)
        elif vis[1 - i]:
            f[1] = (1. if c["uC"][1 - i][0] > c["uC"][i][0] else -1.) * .55
        f[3] = .7 if nome == "A" else (-.3 if fala == "B" and nome == "B" else .4)
    c["uFace"] = [tuple(face[0]), tuple(face[1])]

TEMA = float(CFG.get("tema", 1)); TCOR = tuple(CFG.get("tema_cor", [.4, .3, 1.]))
SIGN_POS = tuple(CFG.get("placa_pos", [0., 3.4, -2.6]))
# movimentos de camera (Vitor, 14/11: "quero mudança de câmera, não câmera fechada como repórter")
def _cam(nome, q, lt, alvo):
    ax, ay, az = alvo
    if nome == "abertura":   a, b, t = (ax, 5.8, 12.5), (ax, 2.3, 8.6), (ax, 1.1, az)
    elif nome == "orbita":
        g = -.65 + 1.1 * q; r = 5.6
        return (ax + math.sin(g) * r, 1.7, az + math.cos(g) * r), (ax, 1.05, az), 1.0
    elif nome == "orbita2":
        g = .7 - 1.2 * q; r = 6.4
        return (ax + math.sin(g) * r, 2.4, az + math.cos(g) * r), (ax, 1.0, az), 1.0
    elif nome == "travelling": a, b, t = (ax - 3.4, 1.25, az + 6.2), (ax + 3.0, 1.25, az + 6.0), None
    elif nome == "baixo":    a, b, t = (ax + 1.6, .3, az + 3.9), (ax + .7, .38, az + 3.2), (ax, 1.55, az)
    elif nome == "dolly":    a, b, t = (ax, 1.5, az + 10.5), (ax, 1.2, az + 4.6), (ax, 1.0, az)
    elif nome == "lateral":  a, b, t = (ax + 5.6, 1.5, az + 2.0), (ax + 4.4, 1.3, az + 3.4), (ax, 1.0, az)
    elif nome == "lateral2": a, b, t = (ax - 5.4, 1.8, az + 2.6), (ax - 4.6, 1.4, az + 3.6), (ax, 1.0, az)
    elif nome == "alto":     a, b, t = (ax - .8, 6.2, az + 6.2), (ax + .4, 5.0, az + 5.4), (ax, .7, az)
    elif nome == "revela":   a, b, t = (ax, 2.6, az + 5.0), (ax, 1.3, az + 5.6), None
    elif nome == "close":    a, b, t = (ax - .5, 1.15, az + 3.6), (ax + .2, 1.05, az + 2.9), (ax, .95, az)
    else:                    a, b, t = (ax, 1.3, az + 7.5), (ax, 1.25, az + 6.8), (ax, 1.0, az)
    p = lerp(a, b, q)
    if t is None:
        t = (p[0] * .35, lerp((SIGN_POS[1], 0, 0), (1.0, 0, 0), ease(q * 1.4))[0] if nome == "revela" else 1.05, az)
    return p, t, 1.05
ROTA0 = ["abertura", "orbita", "baixo", "travelling", "lateral", "dolly", "orbita2", "alto", "lateral2", "close", "revela"]
ROTA = [c for c in ROTA0 if c not in CFG.get("sem_cams", [])]
_rng = __import__("random").Random(CFG.get("seed", 7))
CAMS = []
for k, s in enumerate(SEGS):
    if s.get("cam"): CAMS.append(s["cam"]); continue
    if k == 0: CAMS.append(CFG.get("cam_abertura", "abertura")); continue
    op = [c for c in ROTA if c not in CAMS[-3:] and c != "abertura"]
    if s.get("quem") == "B" or s.get("balao"): op = [c for c in op if c in ("baixo", "close", "lateral", "lateral2", "dolly")] or op
    CAMS.append(_rng.choice(op))

def enquadrar(c, pos, k, lt):
    vis = [c["uCb"][i][1] > .5 for i in (0, 1)]
    q = ease(min(1., lt / max(DURS[k], .5)))
    if all(vis): c["uC"][0] = (-.78, 0., .3, 0.); c["uC"][1] = (.78, 0., .3, 0.)
    elif any(vis): i = 0 if vis[0] else 1; c["uC"][i] = (0., 0., .3, 0.)
    alvo = (0., 0., .3)
    if not any(vis): return pos
    nome = CAMS[k]
    if all(vis) and nome in ("close", "baixo"): nome = "dolly"
    cp, ct, fov = _cam(nome, q, lt, alvo)
    if all(vis):  # plano a dois: afasta para caber os dois inteiros
        cp = tuple(t + (c0 - t) * 1.5 for c0, t in zip(cp, (ct[0], ct[1], ct[2])))
    if TEMA == 1: cp = (cp[0], min(cp[1], 5.4), max(cp[2], -5.0))  # dentro do estudio (teto 6,6)
    c["uCamPos"] = cp; c["uCamTgt"] = ct; c["uFov"] = fov
    # personagens viram um pouco para a camera (rosto sempre visivel)
    for i in (0, 1):
        if vis[i]:
            x, y, z, _ = c["uC"][i]
            yaw = math.atan2(cp[0] - x, cp[2] - z)
            c["uC"][i] = (x, y, z, -max(-.6, min(.6, yaw * .55)) * YAW_SINAL)
    sg = c.get("uSign", (0., 0., 0., 0.))
    if sg[3] > 0:
        sx, sy = c["uSignSize"]; f = min(1., 1.6 / sx)
        c["uSign"] = (SIGN_POS[0], SIGN_POS[1], SIGN_POS[2], sg[3]); c["uSignSize"] = (sx * f, sy * f)
    d = math.dist(cp, (0., 1., .3))
    pos = dict(pos); pos["uFocus"] = d; pos["uAperture"] = .3 if d > 6 else .4
    return pos
YAW_SINAL = float(CFG.get("yaw_sinal", 1.))

# ---------- texto na tela (Visual clean) ----------
def sombra(lay, desenha, raio=10, alfa=150):
    m = Image.new("L", lay.size, 0); desenha(ImageDraw.Draw(m), 255)
    m = m.filter(ImageFilter.GaussianBlur(raio)).point(lambda v: v * alfa // 255)
    s = Image.new("RGBA", lay.size, (0, 0, 0, 0)); s.putalpha(m)
    lay.alpha_composite(s, (0, 6))

def pop(age, d=.16):
    if age < 0: return 0.
    x = min(1., age / d); return 1 + .12 * math.sin(x * math.pi) if x < 1 else 1.

def legenda(lay, k, T):
    ch = PLANO[k]; b = 0
    for j, c in enumerate(ch):
        if T >= c[0][0] - .02: b = j
    c = [(t, w) for t, w in ch[b] if T >= t - .02]
    if not c: return
    gap = 22; larg = [F_LEG.getlength(w) for _, w in ch[b]]
    tot = sum(larg) + gap * (len(larg) - 1)
    if tot > W - 180:  # palavra comprida: diminui o bloco
        f = ImageFont.truetype(AF, int(84 * (W - 180) / tot)); larg = [f.getlength(w) for _, w in ch[b]]; tot = sum(larg) + gap * (len(larg) - 1)
    else: f = F_LEG
    x0 = (W - tot) / 2; y = 1440
    xs = []; x = x0
    for lw in larg: xs.append(x); x += lw + gap
    def tinta(d, a):
        for (t, w), xx in zip(c, xs): d.text((xx, y), w, font=f, fill=a, anchor="lm")
    sombra(lay, tinta, 12, 170)
    for (t, w), xx, lw in zip(c, xs, larg):
        s = pop(T - t + .02); cor = OURO if limpa(w) in CHAVE[k] else BRANCO
        if s == 1.:
            ImageDraw.Draw(lay).text((xx, y), w, font=f, fill=cor, anchor="lm")
        else:
            im = Image.new("RGBA", (int(lw) + 40, 160), (0, 0, 0, 0)); ImageDraw.Draw(im).text((20, 80), w, font=f, fill=cor, anchor="lm")
            im = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.BICUBIC)
            lay.alpha_composite(im, (int(xx + lw / 2 - im.width / 2), int(y - im.height / 2)))

def cabecalho(lay, k, lt):
    cab = SEGS[k].get("cab")
    if not cab: return
    a = min(1., lt / .25); partes = [(cab[0], BRANCO), (cab[1], OURO)]
    tot = sum(F_CAB.getlength(t) for t, _ in partes); x0 = (W - tot) / 2; y = 282 - 14 * (1 - ease(a))
    def tinta(d, al):
        x = x0
        for t, _ in partes: d.text((x, y), t, font=F_CAB, fill=al, anchor="lm"); x += F_CAB.getlength(t)
    sombra(lay, tinta, 10, int(160 * a))
    d = ImageDraw.Draw(lay); x = x0
    for t, cor in partes: d.text((x, y), t, font=F_CAB, fill=(*cor, int(255 * a)), anchor="lm"); x += F_CAB.getlength(t)

def balao(lay, k, lt):
    txt = SEGS[k].get("balao")
    if not txt: return
    s = pop(lt - .2, .22)
    if s <= 0: return
    tw = F_BAL.getlength(txt); bw, bh = int(tw + 64), 108
    im = Image.new("RGBA", (bw + 40, bh + 70), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([20, 20, bw + 20, bh + 20], 30, fill=(255, 255, 255, 245))
    d.polygon([(60, bh + 10), (110, bh + 10), (52, bh + 58)], fill=(255, 255, 255, 245))
    d.text((20 + bw / 2, 20 + bh / 2 + 3), txt, font=F_BAL, fill=(18, 18, 22), anchor="mm")
    im = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.BICUBIC)
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); sh.putalpha(im.getchannel("A").filter(ImageFilter.GaussianBlur(10)).point(lambda v: v * 90 // 255))
    cx, cy = 720, 600
    lay.alpha_composite(sh, (int(cx - im.width / 2), int(cy - im.height / 2) + 8)); lay.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2)))

def seg(T): return min(int(np.searchsorted(INICIOS, T, side="right") - 1), len(SEGS) - 1)

def overlay(i, frame):
    T = i / FPS; k = seg(T); lt = T - INI[k]
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    cabecalho(lay, k, lt); legenda(lay, k, T); balao(lay, k, lt)
    im = Image.fromarray(frame).convert("RGBA"); im.alpha_composite(lay)
    return np.asarray(im.convert("RGB"))

def uniforms(T):
    k = seg(T); lt = T - INI[k]
    c, pos, tex = cena(k, lt, T)
    pos = enquadrar(c, pos, k, lt); atuar(c, k, T)
    cp = list(c["uCamPos"]); n = .01
    cp[0] += n * math.sin(T * 1.7) + n * .5 * math.sin(T * 4.3); cp[1] += n * math.sin(T * 2.1 + 1)
    whip = max(0., 1 - lt / .14) if k > 0 else 0.
    cp[0] += .3 * whip ** 2 * (1 if k % 2 else -1)
    c["uCamPos"] = tuple(cp); c["uTime"] = T; c["uTema"] = TEMA; c["uTemaCor"] = TCOR
    p = dict(uTime=T, uFocus=3., uAperture=.4, uCA=0., uFlash=0., uExpo=1.0, uSeed=float(k), uBlurDir=(0., 0.), uCamVel=(cp[0] * .02, cp[1] * .02, 0.))
    p.update(pos)
    if whip > 0: p["uBlurDir"] = (.07 * whip * (1 if k % 2 else -1), 0.); p["uCA"] = max(p["uCA"], .01 * whip)
    return c, p, tex

def quadro(m, i):
    acc = None
    for s in (0., .5):
        c, p, tex = uniforms((i + s) / FPS)
        f = m.quadro(c, p, tex).astype(np.float32)
        acc = f if acc is None else (acc + f) * .5
    return overlay(i, acc.astype(np.uint8))

def main():
    from engine2 import Motor2
    out = sys.argv[1]; m = Motor2()
    if "--quadros" in sys.argv:
        os.makedirs(out, exist_ok=True)
        for i in [int(x) for x in sys.argv[sys.argv.index("--quadros") + 1].split(",")]:
            Image.fromarray(quadro(m, i)).save(f"{out}/q{i:04d}.jpg", quality=88)
        return
    a, b = 0, NQ
    if "--faixa" in sys.argv: a, b = [int(x) for x in sys.argv[sys.argv.index("--faixa") + 1].split(":")]; b = min(b, NQ)
    ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                           "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    for i in range(a, b):
        ff.stdin.write(quadro(m, i).tobytes())
        if i % 60 == 0: print("quadro", i, "/", b, flush=True)
    ff.stdin.close(); ff.wait(); print("ok", out, flush=True)

if __name__ == "__main__":
    main()

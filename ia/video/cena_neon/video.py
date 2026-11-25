#!/usr/bin/env python3
"""Teste v2: Deep Blue x o campeao, 3D por codigo + legendas em etiquetas + trilha estereo.
Uso: DISPLAY=:99 python3 video.py saida.mp4 [--ate N_quadros] [--quadros 0,40,80 --png pasta]
"""
import math, os, subprocess, sys, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from engine import Motor

W, H, FPS = 1080, 1920, 30
FN = "/usr/share/fonts"
F_HDR = ImageFont.truetype(f"{FN}/opentype/inter/InterDisplay-ExtraBold.otf", 66)
F_HDR_I = ImageFont.truetype(f"{FN}/truetype/liberation/LiberationSerif-BoldItalic.ttf", 78)
F_TAG = ImageFont.truetype(f"{FN}/truetype/dejavu/DejaVuSerif-Bold.ttf", 60)
F_BUB = ImageFont.truetype(f"{FN}/opentype/inter/InterDisplay-Black.otf", 58)
F_SCR = ImageFont.truetype(f"{FN}/opentype/inter/InterDisplay-Black.otf", 120)
F_SCR_S = ImageFont.truetype(f"{FN}/opentype/inter/InterDisplay-ExtraBold.otf", 34)

LARANJA, AMARELO, TINTA = (232, 112, 38), (247, 196, 28), (52, 24, 10)
DESTAQUE = (226, 84, 40)

def ease(x): x = min(max(x, 0.), 1.); return x * x * (3 - 2 * x)
def eout(x): x = min(max(x, 0.), 1.); return 1 - (1 - x) ** 3
def lerp(a, b, k): return tuple(x + (y - x) * k for x, y in zip(a, b))
def pisca(t, off=0.): return 0.12 if (t + off) % 2.6 < 0.11 else 1.0
def pop(t, d=0.18):
    if t <= 0: return 0.
    if t >= d: return 1.
    x = t / d; return 1 + 0.25 * math.sin(x * math.pi) - (1 - x) * 0.6 if x > .3 else x / .3 * .9

CAMP = (-1.15, 0., .1); ROBO = (1.15, 0., .1)
NOS = [(math.cos(i * 2.4) * (1.2 + (i % 4) * .5), 1.0 + math.sin(i * 1.7) * 1.3, -1.5 + math.sin(i * 3.1) * 1.4, .09 + (i % 3) * .05) for i in range(14)]

# ---------------- roteiro (11 cortes) ----------------
def base(lt, T):
    br = 1 + .02 * math.sin(T * 3.1)
    return dict(
        uSet=0, uSpot=1.0, uGraph=0., uKingTilt=0., uTable=(0., 0., 0., 1.), uScreen=(0., 2.5, -4.6, 1.),
        uC=[(*CAMP, -.45), (*ROBO, .3)],
        uCa=[(.12 + .05 * math.sin(T * 2), .12 + .05 * math.sin(T * 2 + 1), br, pisca(T)), (.1, .1, 1 + .015 * math.sin(T * 2.6), 1.)],
        uCb=[(0., 1., 0., 0.), (0., 1., 1., 0.)], uNodes=NOS)

def s_abertura(lt, T):
    c = base(lt, T); k = ease(lt / 1.6)
    c.update(uCamPos=lerp((0., 2.6, 9.5), (0., 1.9, 6.6), k), uCamTgt=(0., 1.2, -1.), uFov=1.2)
    return c, dict(uFocus=6.2 + 2.9 * (1 - k), uAperture=.25), "1997"

def s_campeao(lt, T):
    c = base(lt, T); k = ease(lt / 1.6)
    a = 2.5 + .25 * math.sin(lt * 9)
    c["uCa"][0] = (.15, a, 1 + .04 * math.sin(lt * 9), pisca(T, .7))
    c["uCb"][0] = (0., 1., 0., -.6)
    c.update(uCamPos=lerp((-.1, 1.5, 3.7), (-.3, 1.42, 3.2), k), uCamTgt=(-1.15, .95, .1), uFov=1.2)
    return c, dict(uFocus=3.3, uAperture=.55), "XADREZ"

def s_maquina(lt, T):
    c = base(lt, T); k = ease(lt / 1.6)
    on = min(1., lt / .45) * (0.4 if 0.15 < lt < 0.22 or 0.3 < lt < 0.34 else 1.)
    c["uCb"][1] = (0., 1., on, 0.)
    c["uC"][1] = (*ROBO, -.4)
    c["uCa"][1] = (.1, .1, 1 + .06 * eout(lt / .4) * math.exp(-lt * 4) * 3, 1.)
    c.update(uCamPos=lerp((2.5, .5, 3.5), (2.05, .8, 3.0), k), uCamTgt=(1.15, 1.0, .1), uFov=1.15, uSpot=.6)
    return c, dict(uFocus=3.0, uAperture=.6), "XADREZ"

def s_deepblue(lt, T):
    c = base(lt, T); a = -.25 + .5 * ease(lt / 1.6)
    c.update(uCamPos=(math.sin(a) * 5.2, 2.0, math.cos(a) * 5.2), uCamTgt=(0., 1.5, -1.5), uFov=1.15)
    return c, dict(uFocus=5.2, uAperture=.3), "DEEP BLUE"

def s_contador(lt, T):
    c = base(lt, T); k = ease(lt / 1.6)
    c.update(uCamPos=lerp((.7, 1.9, 2.8), (.4, 2.15, 2.0), k), uCamTgt=(0., 2.45, -4.6), uFov=1.25)
    return c, dict(uFocus=6.7, uAperture=.45), ("contador", eout(lt / 1.2))

def s_pensa(lt, T):
    c = base(lt, T); k = ease(lt / 1.6)
    c["uCa"][0] = (.15, 2.05 + .05 * math.sin(lt * 5), 1., pisca(T, .3))
    c["uCb"][0] = (0., 1., 0., 1.)
    c.update(uCamPos=lerp((-.35, 1.4, 3.1), (-.55, 1.35, 2.65), k), uCamTgt=(-1.15, 1.0, .1), uFov=1.3)
    return c, dict(uFocus=2.75, uAperture=.7), "XADREZ"

def s_tabuleiro(lt, T):
    c = base(lt, T); k = ease(lt / 1.6)
    c.update(uCamPos=lerp((.9, 1.15, 1.3), (.55, 1.0, .95), k), uCamTgt=(.15, .85, .05), uFov=1.5)
    return c, dict(uFocus=1.0, uAperture=.9), "JOGO 6"

def s_queda(lt, T):
    c = base(lt, T)
    x = (lt - .25) / .3
    tilt = 0. if x < 0 else (1.48 * eout(x) if x < 1 else 1.48 - .12 * abs(math.sin((lt - .55) * 18)) * math.exp(-(lt - .55) * 6))
    c["uKingTilt"] = tilt
    sh = .03 * math.exp(-(lt - .55) * 7) if lt > .55 else 0.
    c.update(uCamPos=(-.35 + sh * math.sin(lt * 90), .95 + sh * math.cos(lt * 77), 1.05), uCamTgt=(.18, .85, .06), uFov=1.55)
    return c, dict(uFocus=1.15, uAperture=.9, uFlash=.35 * math.exp(-(lt - .55) * 9) if lt > .55 else 0., uCA=.012 * math.exp(-(lt - .55) * 6) if lt > .55 else 0.), "19 LANCES"

def s_desiste(lt, T):
    c = base(lt, T); k = ease(lt / 1.6)
    up = eout(lt / .25)
    c["uCa"][0] = (2.75 * up + .1 * math.sin(lt * 14), 2.75 * up + .1 * math.sin(lt * 14 + 1), 1 + .12 * math.exp(-lt * 6) * math.sin(lt * 30), 1.)
    c["uCb"][0] = (0., 1., 0., -1.)
    c.update(uCamPos=lerp((-1.0, 1.2, 4.0), (-1.1, 1.2, 3.5), k), uCamTgt=(-1.15, 1.2, .1), uFov=1.2, uSpot=.7)
    return c, dict(uFocus=3.45, uAperture=.55), "1 x 0"

def s_hoje(lt, T):
    c = base(lt, T); a = lt * .45
    c.update(uSet=1, uGraph=eout(lt / .7), uTable=(0., 0., 0., 0.), uScreen=(0., 0., 0., 0.), uSpot=0.)
    c["uC"] = [(-9., 0., 0., 0.), (0., -.2, -1.5, 0.)]
    c["uCb"] = [(0., 0., 0., 0.), (0., 1., 1., 0.)]
    c.update(uCamPos=(math.sin(a) * 4.6, 1.6, math.cos(a) * 4.6 - 1.5), uCamTgt=(0., 1.0, -1.5), uFov=1.2)
    return c, dict(uFocus=4.6, uAperture=.45), None

def s_cta(lt, T):
    c = base(lt, T); k = ease(lt / 2.2)
    c["uC"] = [(-.78, 0., .6, -.2), (.78, 0., .6, -.05)]
    c["uCa"] = [(2.6 + .15 * math.sin(lt * 7), 2.6 + .15 * math.sin(lt * 7 + 2), 1 + .03 * math.sin(lt * 7), pisca(T)),
                (.15, 2.5 + .45 * math.sin(lt * 13), 1 + .02 * math.sin(lt * 9), 1.)]
    c["uCb"][0] = (0., 1., 0., -.6)
    c.update(uTable=(0., 0., -3., 0.), uCamPos=lerp((0., 1.65, 6.7), (0., 1.5, 6.0), k), uCamTgt=(0., 1.2, .3), uFov=.95)
    return c, dict(uFocus=5.5, uAperture=.45), "COMENTA"

# hdr: (texto, destaque?)  palavras: (texto, chave?)  balao: (texto, x, y)
CORTES = [
    (1.6, s_abertura, [("em ", 0), ("1997", 1)], [("Em", 0), ("1997", 1)], None),
    (1.6, s_campeao, [("o maior ", 0), ("campeão", 1)], [("o", 0), ("maior", 0), ("campeão", 1)], ("INVENCÍVEL", 640, 560)),
    (1.6, s_maquina, [("contra uma ", 0), ("máquina", 1)], [("contra", 0), ("uma", 0), ("máquina", 1)], None),
    (1.6, s_deepblue, [("a ", 0), ("Deep Blue", 1), (" da IBM", 0)], [("a", 0), ("Deep Blue", 1)], None),
    (1.6, s_contador, [("200 milhões de ", 0), ("posições", 1)], [("por", 0), ("segundo", 1)], None),
    (1.6, s_pensa, [("o campeão ", 0), ("travou", 1)], [("e", 0), ("ele", 0), ("travou", 1)], ("PERAÍ...", 700, 600)),
    (1.6, s_tabuleiro, [("jogo ", 0), ("6", 1)], [("no", 0), ("jogo", 0), ("6", 1)], None),
    (1.6, s_queda, [("só ", 0), ("19", 1), (" lances", 0)], [("só", 0), ("19", 1), ("lances", 0)], None),
    (1.6, s_desiste, [("e ele ", 0), ("desistiu", 1)], [("e", 0), ("desistiu", 1)], ("NÃO!", 540, 470)),
    (1.6, s_hoje, [("e ", 0), ("hoje", 1), ("?", 0)], [("hoje", 0), ("o", 0), ("celular", 0), ("joga", 0), ("melhor", 1)], None),
    (2.2, s_cta, [("comenta ", 0), ("XADREZ", 1)], [("comenta", 0), ("XADREZ", 1)], ("COMENTA XADREZ!", 540, 560)),
]
INICIOS = np.cumsum([0] + [c[0] for c in CORTES])
DUR = float(INICIOS[-1])
NQ = int(round(DUR * FPS))

# ---------------- telao ----------------
def tela(spec):
    im = Image.new("RGB", (512, 256), (4, 10, 28)); d = ImageDraw.Draw(im)
    for y in range(0, 256, 4): d.line([(0, y), (512, y)], fill=(8, 18, 44))
    if isinstance(spec, tuple):  # contador
        n = int(200_000_000 * spec[1]); txt = f"{n:,}".replace(",", ".")
        f = ImageFont.truetype(f"{FN}/opentype/inter/InterDisplay-Black.otf", 64)
        d.text((256, 108), txt, font=f, fill=(255, 200, 40), anchor="mm")
        d.text((256, 180), "POSIÇÕES POR SEGUNDO", font=F_SCR_S, fill=(90, 220, 255), anchor="mm")
    else:
        f = F_SCR
        while d.textlength(spec, font=f) > 460: f = ImageFont.truetype(f.path, f.size - 8)
        d.text((256, 128), spec, font=f, fill=(90, 225, 255), anchor="mm")
    d.rectangle([0, 0, 511, 255], outline=(255, 140, 40), width=6)
    return im

# ---------------- camadas 2D ----------------
rng = random.Random(4)
PAPEL = None
def papel():
    global PAPEL
    if PAPEL is None:
        a = np.random.default_rng(1).normal(0, 1, (190, W))
        base_c = np.array([238, 228, 206], float)
        img = np.clip(base_c[None, None] + a[..., None] * 6, 0, 255).astype(np.uint8)
        al = np.full((190, W), 255, np.uint8)
        edge = 150 + (np.random.default_rng(2).normal(0, 1, W).cumsum() * .8) % 12
        for x in range(W): al[int(edge[x]):, x] = 0
        p = Image.fromarray(img).convert("RGBA"); p.putalpha(Image.fromarray(al))
        sh = Image.new("RGBA", (W, 210), (0, 0, 0, 0)); m = Image.fromarray(al).filter(ImageFilter.GaussianBlur(8))
        sh.paste((0, 0, 0, 110), (0, 8), m)
        sh.alpha_composite(p); PAPEL = sh
    return PAPEL

GLIF = "ABCDEFGHJKMNPQRSTUVWXYZ#$%&*@0123456789"
def cabecalho(lay, hdr, lt):
    lay.alpha_composite(papel(), (0, -8))
    d = ImageDraw.Draw(lay)
    partes = []
    for txt, dest in hdr:
        if dest:
            n = len(txt); res = int(n * min(1., max(0., (lt - .05) / .35)))
            r = random.Random(int(lt * 20))
            txt = txt[:res] + "".join(r.choice(GLIF) if ch != " " else " " for ch in txt[res:])
        partes.append((txt, F_HDR_I if dest else F_HDR, DESTAQUE if dest else (22, 18, 16)))
    total = sum(d.textlength(t, font=f) for t, f, _ in partes)
    x = (W - total) / 2
    for t, f, c in partes:
        d.text((x, 104), t, font=f, fill=c, anchor="ls" if False else "lm"); x += d.textlength(t, font=f)

def etiquetas(lay, palavras, lt, dur):
    n = len(palavras); janela = min(dur * .62, .32 * n)
    blocos = []
    for i, (w, chave) in enumerate(palavras):
        t0 = .08 + janela * i / max(n, 1)
        if lt < t0: break
        tw = F_TAG.getlength(w); bw, bh = int(tw + 40), 92
        blocos.append((w, chave, bw, bh, lt - t0))
    if not blocos: return
    gap = 14; total = sum(b[2] for b in blocos) + gap * (len(blocos) - 1)
    linhas = [blocos] if total < W - 120 else [blocos[:len(blocos) // 2 + 1], blocos[len(blocos) // 2 + 1:]]
    y0 = 1500 - (len(linhas) - 1) * 46
    for li, lin in enumerate(linhas):
        tot = sum(b[2] for b in lin) + gap * (len(lin) - 1); x = (W - tot) / 2
        for w, chave, bw, bh, age in lin:
            s = pop(age)
            if s > 0:
                tag = Image.new("RGBA", (bw + 20, bh + 24), (0, 0, 0, 0)); td = ImageDraw.Draw(tag)
                td.rounded_rectangle([10, 16, bw + 10, bh + 16], 9, fill=(0, 0, 0, 120))
                td.rounded_rectangle([10, 10, bw + 10, bh + 10], 9, fill=(*(AMARELO if chave else LARANJA), 255))
                td.text((10 + bw / 2, 10 + bh / 2 + 2), w, font=F_TAG, fill=TINTA, anchor="mm")
                ang = (hash(w) % 5 - 2) * .8
                tag = tag.rotate(ang, resample=Image.BICUBIC, expand=True)
                tw2, th2 = max(1, int(tag.width * s)), max(1, int(tag.height * s))
                tag = tag.resize((tw2, th2), Image.BICUBIC)
                lay.alpha_composite(tag, (int(x + bw / 2 - tw2 / 2), int(y0 + li * 92 + bh / 2 - th2 / 2)))
            x += bw + gap

def balao(lay, b, lt):
    txt, cx, cy = b; s = pop(lt - .2, .22)
    if s <= 0: return
    tw = F_BUB.getlength(txt); bw, bh = int(tw + 60), 112
    im = Image.new("RGBA", (bw + 40, bh + 70), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([20, 26, bw + 20, bh + 26], 28, fill=(0, 0, 0, 90))
    d.rounded_rectangle([20, 20, bw + 20, bh + 20], 28, fill=(255, 255, 255, 255))
    d.polygon([(60, bh + 10), (110, bh + 10), (52, bh + 60)], fill=(255, 255, 255, 255))
    d.text((20 + bw / 2, 20 + bh / 2 + 3), txt, font=F_BUB, fill=(18, 18, 22), anchor="mm")
    im = im.rotate(-2, resample=Image.BICUBIC, expand=True)
    w2, h2 = max(1, int(im.width * s)), max(1, int(im.height * s))
    im = im.resize((w2, h2), Image.BICUBIC)
    lay.alpha_composite(im, (int(cx - w2 / 2), int(cy - h2 / 2)))

def overlay(i, frame):
    T = i / FPS; k = int(np.searchsorted(INICIOS, T, side="right") - 1); k = min(k, len(CORTES) - 1)
    dur, fn, hdr, pal, bal = CORTES[k]; lt = T - INICIOS[k]
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    cabecalho(lay, hdr, lt)
    etiquetas(lay, pal, lt, dur)
    if bal: balao(lay, bal, lt)
    im = Image.fromarray(frame).convert("RGBA"); im.alpha_composite(lay)
    return np.asarray(im.convert("RGB"))

# ---------------- render ----------------
def uniforms(i):
    T = i / FPS; k = int(np.searchsorted(INICIOS, T, side="right") - 1); k = min(k, len(CORTES) - 1)
    dur, fn, hdr, pal, bal = CORTES[k]; lt = T - INICIOS[k]
    cena, pos, scr = fn(lt, T)
    # yaw: sinal do shader e invertido
    pass
    # tremida de mao + chicote no inicio de cada corte
    cp = list(cena["uCamPos"]); n = .012
    cp[0] += n * math.sin(T * 1.7) + n * .5 * math.sin(T * 4.3); cp[1] += n * math.sin(T * 2.1 + 1)
    whip = max(0., 1 - lt / .14) if k > 0 else 0.
    cp[0] += .35 * whip ** 2 * (1 if k % 2 else -1)
    cena["uCamPos"] = tuple(cp)
    cena.setdefault("uRoll", .0 + .015 * math.sin(T * .9))
    cena["uTime"] = T
    p = dict(uTime=T, uFocus=3., uAperture=.4, uCA=0., uFlash=0., uExpo=1.05, uSeed=float(k), uBlurDir=(.0, 0.), uCamVel=(cp[0] * .02, cp[1] * .02, 0.))
    p.update(pos)
    if whip > 0:
        p["uBlurDir"] = (.07 * whip * (1 if k % 2 else -1), 0.); p["uCA"] = max(p["uCA"], .01 * whip)
    return cena, p, scr

def main():
    out = sys.argv[1]
    so = None
    if "--quadros" in sys.argv:
        so = [int(x) for x in sys.argv[sys.argv.index("--quadros") + 1].split(",")]
    ate = int(sys.argv[sys.argv.index("--ate") + 1]) if "--ate" in sys.argv else NQ
    m = Motor()
    if so is not None:
        os.makedirs(out, exist_ok=True)
        for i in so:
            c, p, s = uniforms(i)
            fr = overlay(i, m.quadro(c, p, tela(s) if s else None))
            Image.fromarray(fr).save(f"{out}/q{i:04d}.png")
        return
    video = out.replace(".mp4", "_video.mp4")
    ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                           "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", video], stdin=subprocess.PIPE)
    ultimo = None
    for i in range(ate):
        c, p, s = uniforms(i)
        if s != ultimo or isinstance(s, tuple): ultimo = s
        fr = overlay(i, m.quadro(c, p, tela(s) if s else None))
        ff.stdin.write(fr.tobytes())
        if i % 30 == 0: print("quadro", i, "/", ate, flush=True)
    ff.stdin.close(); ff.wait()
    print("ok", video)

if __name__ == "__main__":
    main()

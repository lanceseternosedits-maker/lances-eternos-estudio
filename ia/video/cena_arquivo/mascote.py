# Mascote de blocos do IA em 60s no lugar do apresentador humano do "Arquivo Secreto" (Vitor, 15/11: "manter nosso mascote").
# Mesmo canto, mesmo halo ciano e as mesmas reações do render2.py de referência: explain, point, both, shock,
# piscar a cada ~3,4 s, balançar 3 px a 2,2 Hz, boca e olhos reagindo ao volume da voz (mouth.json).
# Desenho em PIL com supersampling 2x. Paleta do mascote (mascote/clawd.jpg): terracota, olhos pretos verticais, perninhas.
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from base import cl, prog, eo, eio, H

S2 = 2
BW, BH = 560, 640            # caixa local (1x)
BOX_X, BOX_Y = -40, 1175     # olhos em ~y 1510: o conteúdo para em y 1300 e o mascote fica abaixo
TERRA = (204, 108, 76); TERRA_L = (222, 128, 94); TERRA_D = (168, 82, 56); TERRA_DD = (132, 62, 42)
INK = (16, 16, 20); BOCA = (70, 22, 30); LINGUA = (200, 90, 100)

# ombro esquerdo/direito fixos; mão de cada pose (coordenadas locais)
OMBRO_L, OMBRO_R = (118, 392), (442, 392)
POSES = {
    "rest":    ((58, 404), (502, 404)),
    "explain": ((58, 412), (352, 452)),   # bracinho no peito
    "point":   ((58, 412), (548, 238)),   # aponta pro conteúdo
    "both":    ((28, 300), (532, 300)),   # bracinhos abertos
    "shock":   ((150, 196), (410, 196)),  # bracinhos na cabeça
}


def _halo():
    g = Image.new("RGBA", (BW * S2, BH * S2), (0, 0, 0, 0))
    d = ImageDraw.Draw(g)
    d.ellipse((60 * S2, 120 * S2, 500 * S2, 560 * S2), fill=(77, 232, 255, 70))
    g = g.filter(ImageFilter.GaussianBlur(60 * S2))
    d = ImageDraw.Draw(g)
    d.ellipse((95 * S2, 155 * S2, 465 * S2, 525 * S2), outline=(77, 232, 255, 70), width=3 * S2)
    return g


HALO = _halo()
_f = np.ones((BH, BW), np.float32)
_f[BH - 150:] = np.linspace(1, 0, 150)[:, None] ** 1.3
FADE = _f


def _lerp(a, b, k):
    return (a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k)


def pose_at(t, keys):
    """keys: [(tempo, pose)]; transição de 0,28 s entre poses."""
    cur = POSES[keys[0][1]]
    for kt, nome in keys:
        if t < kt:
            break
        k = eio(prog(t, kt, 0.28))
        cur = tuple(_lerp(cur[j], POSES[nome][j], k) for j in range(2))
    return cur


def draw_char(cv, t, gt, keys, mouth, fps=30, brow=0.0, smile=0.3, enter=1.0):
    """brow: >0 surpresa (sobrancelhas sobem, olhos crescem), <0 erro (franzem). smile: curva da boca fechada."""
    s = S2
    img = HALO.copy()
    d = ImageDraw.Draw(img)

    def R(x0, y0, x1, y1, r, **kw):
        d.rounded_rectangle((x0 * s, y0 * s, x1 * s, y1 * s), r * s, **kw)

    bob = math.sin(gt * 2.2 * 2 * math.pi / 2.2 * 1.0) * 3 if False else math.sin(gt * 2 * math.pi * 2.2 / 2.2) * 3
    sway = math.sin(gt * 1.3) * 2.0
    ox, oy = sway, bob
    # sombra no chão
    d.ellipse(((150 + ox) * s, 598 * s, (410 + ox) * s, 622 * s), fill=(0, 0, 0, 90))
    # perninhas (4)
    for i in range(4):
        x = 150 + i * 72 + ox
        R(x, 510 + oy * .4, x + 46, 600, 8, fill=TERRA_D)
    # corpo: bloco largo com face clara em cima e lateral escura (volume)
    R(108 + ox, 214 + oy, 452 + ox, 530 + oy, 34, fill=TERRA_D)
    R(108 + ox, 206 + oy, 446 + ox, 520 + oy, 34, fill=TERRA)
    R(126 + ox, 216 + oy, 430 + ox, 250 + oy, 16, fill=TERRA_L)
    # olhos pretos verticais (piscam; crescem na surpresa)
    pisca = 1.0
    ph = (gt + 0.7) % 3.4
    if ph < 0.12:
        pisca = max(0.1, abs(ph - 0.06) / 0.06)
    es = 1 + 0.18 * max(0, brow)
    fi = min(len(mouth) - 1, int(round(gt * fps))) if mouth else 0
    o = (mouth[fi] * 0.75 + mouth[max(0, fi - 1)] * 0.25) if mouth else 0.0
    olho_h = 78 * es * pisca * (1 + 0.06 * o)
    for ex in (212, 336):
        cx, cy = ex + ox, 318 + oy
        R(cx - 15 * es, cy - olho_h / 2, cx + 15 * es, cy + olho_h / 2, 5, fill=INK)
    # sobrancelhas em bloco (sobem na surpresa, franzem no erro)
    if abs(brow) > 0.15:
        by = 262 - 12 * max(0, brow) + oy
        tilt = 10 * min(0, brow)
        for ex, sg in ((212, -1), (336, 1)):
            cx = ex + ox
            d.polygon([((cx - 24) * s, (by + (tilt if sg < 0 else 0)) * s), ((cx + 24) * s, (by + (0 if sg < 0 else tilt)) * s),
                       ((cx + 24) * s, (by + 10 + (0 if sg < 0 else tilt)) * s), ((cx - 24) * s, (by + 10 + (tilt if sg < 0 else 0)) * s)],
                      fill=TERRA_DD)
    # boca: abre com a voz; fechada vira um sorrisinho
    mx, my = 274 + ox, 408 + oy
    if o > 0.08:
        hh = 6 + 30 * o; ww = 26 + 8 * o
        R(mx - ww, my - hh / 2, mx + ww, my + hh / 2, min(10, hh / 2), fill=BOCA)
        if hh > 16:
            R(mx - ww * .55, my + hh / 2 - hh * .38, mx + ww * .55, my + hh / 2 - 3, 6, fill=LINGUA)
    else:
        d.arc(((mx - 22) * s, (my - 12 - 6 * smile) * s, (mx + 22) * s, (my + 4 + 6 * smile) * s), 20, 160, fill=TERRA_DD, width=5 * s)
    # bracinhos de bloco
    Lh, Rh = pose_at(t, keys)
    for sh, hd in ((OMBRO_L, Lh), (OMBRO_R, Rh)):
        a = (sh[0] + ox, sh[1] + oy * .6); b = (hd[0] + ox, hd[1] + oy * .6)
        d.line([(a[0] * s, a[1] * s), (b[0] * s, b[1] * s)], fill=TERRA_DD, width=50 * s)
        d.line([(a[0] * s, a[1] * s), (b[0] * s, b[1] * s)], fill=TERRA_D, width=42 * s)
        R(b[0] - 26, b[1] - 24, b[0] + 26, b[1] + 24, 10, fill=TERRA_D)
    img = img.resize((BW, BH), Image.LANCZOS)
    arr = np.array(img)
    arr[:, :, 3] = (arr[:, :, 3] * FADE * cl(enter * 1.5)).astype(np.uint8)
    img = Image.fromarray(arr)
    yoff = int(140 * (1 - eo(enter)))
    cv.alpha_composite(img, (0, BOX_Y + yoff), (-BOX_X, 0, BW, min(BH, H - BOX_Y - yoff)))

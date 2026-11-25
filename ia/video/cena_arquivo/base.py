import sys, os, math, random, subprocess, functools
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H, FPS = 1080, 1920, 30
# helpers do estilo "Arquivo Secreto" (render.py do zip de referência, sem as cenas do GPT-4)

# ---------- palette ----------
BG = (7, 8, 13)
WHITE = (245, 247, 250)
GREY = (140, 148, 165)
CYAN = (77, 232, 255)
RED = (255, 59, 92)
GREEN = (61, 255, 162)
BLUE = (47, 107, 255)

FD = "/usr/share/fonts/opentype/inter/"
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
MONO_R = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

@functools.lru_cache(None)
def F(name, size):
    path = {"black": FD + "InterDisplay-Black.otf", "xbold": FD + "InterDisplay-ExtraBold.otf",
            "bold": FD + "Inter-Bold.otf", "semi": FD + "Inter-SemiBold.otf", "med": FD + "Inter-Medium.otf",
            "mono": MONO, "monor": MONO_R}[name]
    return ImageFont.truetype(path, size)

# ---------- easing ----------
def cl(x, a=0.0, b=1.0): return max(a, min(b, x))
def prog(t, t0, d): return cl((t - t0) / d) if d > 0 else (1.0 if t >= t0 else 0.0)
def eo(x): return 1 - (1 - x) ** 3
def eio(x): return 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2
def back(x, s=1.9):
    x -= 1
    return 1 + (s + 1) * x ** 3 + s * x ** 2
def slam(t, t0, d=0.28):  # scale from 1.35 -> 1 with tiny overshoot
    p = prog(t, t0, d)
    return 1.35 - 0.35 * back(p, 1.2) if p < 1 else 1.0

# ---------- sprites ----------
_cache = {}
def text_sprite(text, font, fill, glow=None, glow_r=22, glow_a=0.85):
    key = (text, id(font), fill, glow, glow_r, glow_a)
    if key in _cache: return _cache[key]
    bb = font.getbbox(text)
    asc, desc = font.getmetrics()
    w = bb[2] - bb[0]; h = asc + desc
    pad = glow_r * 3 if glow else 6
    img = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    ImageDraw.Draw(img).text((pad - bb[0], pad), text, font=font, fill=fill + (255,))
    if glow:
        a = np.array(img)[:, :, 3]
        g = Image.fromarray(a).filter(ImageFilter.GaussianBlur(glow_r))
        ga = (np.array(g).astype(np.float32) * glow_a).clip(0, 255).astype(np.uint8)
        gl = np.zeros((img.height, img.width, 4), np.uint8)
        gl[:, :, :3] = glow; gl[:, :, 3] = ga
        gimg = Image.fromarray(gl)
        gimg.alpha_composite(img)
        img = gimg
    _cache[key] = img
    return img

def rgb_split(spr, dx):
    if dx == 0: return spr
    a = np.array(spr)
    out = a.copy()
    out[:, :, 0] = np.roll(a[:, :, 0], -dx, axis=1)
    out[:, :, 2] = np.roll(a[:, :, 2], dx, axis=1)
    out[:, :, 3] = np.maximum(np.maximum(np.roll(a[:, :, 3], -dx, 1), np.roll(a[:, :, 3], dx, 1)), a[:, :, 3])
    return Image.fromarray(out)

def paste(cv, spr, cx, cy, alpha=1.0, scale=1.0, rot=0):
    if alpha <= 0.003: return
    if scale != 1.0:
        spr = spr.resize((max(1, int(spr.width * scale)), max(1, int(spr.height * scale))), Image.BILINEAR)
    if rot:
        spr = spr.rotate(rot, Image.BICUBIC, expand=True)
    if alpha < 1:
        a = np.array(spr); a[:, :, 3] = (a[:, :, 3] * alpha).astype(np.uint8); spr = Image.fromarray(a)
    x = int(cx - spr.width / 2); y = int(cy - spr.height / 2)
    cv.alpha_composite(spr, (max(0, x), max(0, y)),
                       (max(0, -x), max(0, -y)))

def T(cv, t, text, font, fill, cx, cy, t0, mode="fade", glow=None, d=0.4, glitch=False, alpha=1.0):
    """Animated text. mode: fade (rise), slam, pop"""
    if t < t0: return
    spr = text_sprite(text, font, fill, glow)
    p = prog(t, t0, d)
    if glitch and t - t0 < 0.22:
        spr = rgb_split(spr, int(18 * (1 - (t - t0) / 0.22)) + 2)
    if mode == "fade":
        paste(cv, spr, cx, cy + 40 * (1 - eo(p)), alpha * eo(p))
    elif mode == "slam":
        paste(cv, spr, cx, cy, alpha * cl(p * 3), slam(t, t0, d))
    elif mode == "pop":
        paste(cv, spr, cx, cy, alpha * cl(p * 2.5), 0.6 + 0.4 * back(p))

def wrap(text, font, maxw):
    words = text.split(); lines = []; cur = ""
    for w_ in words:
        test = (cur + " " + w_).strip()
        if font.getlength(test) <= maxw: cur = test
        else: lines.append(cur); cur = w_
    if cur: lines.append(cur)
    return lines

def rrect_sprite(w, h, r, fill, outline=None, ow=3):
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(img).rounded_rectangle((0, 0, w - 1, h - 1), r, fill=fill, outline=outline, width=ow)
    return img

# ---------- background ----------
def _make_bg():
    base = Image.new("RGBA", (W, H), BG + (255,))
    # soft colour glows
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(glow)
    d.ellipse((-300, -200, 700, 700), fill=(40, 120, 255, 70))
    d.ellipse((500, 1300, 1500, 2300), fill=(255, 40, 90, 45))
    glow = glow.filter(ImageFilter.GaussianBlur(220))
    base.alpha_composite(glow)
    grid = Image.new("RGBA", (W, H + 90), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    for x in range(0, W + 1, 90): gd.line((x, 0, x, H + 90), fill=(120, 170, 255, 16), width=1)
    for y in range(0, H + 91, 90): gd.line((0, y, W, y), fill=(120, 170, 255, 16), width=1)
    # vignette
    yy, xx = np.mgrid[0:H, 0:W]
    r = np.sqrt(((xx - W / 2) / (W * 0.75)) ** 2 + ((yy - H / 2) / (H * 0.62)) ** 2)
    vig = (np.clip(r - 0.35, 0, 1) ** 1.6 * 235).astype(np.uint8)
    va = np.zeros((H, W, 4), np.uint8); va[:, :, 3] = vig
    return base, grid, Image.fromarray(va)
BASE, GRID, VIG = _make_bg()
rng = np.random.default_rng(3)
GRAIN = [rng.integers(-7, 8, (H, W, 1), dtype=np.int16) for _ in range(6)]
SCAN = np.ones((H, 1, 1), np.float32); SCAN[::4] = 0.94

def background(gt):
    cv = BASE.copy()
    off = int((gt * 22) % 90)
    cv.alpha_composite(GRID.crop((0, off, W, off + H)))
    return cv

def finish(cv, gt, glitch=0.0):
    cv.alpha_composite(VIG)
    a = np.array(cv)[:, :, :3].astype(np.int16)
    if glitch > 0.02:
        r = random.Random(int(gt * 1000))
        for _ in range(int(3 + glitch * 10)):
            y0 = r.randint(0, H - 60); hh = r.randint(8, int(30 + 120 * glitch))
            a[y0:y0 + hh] = np.roll(a[y0:y0 + hh], r.randint(-int(80 * glitch) - 1, int(80 * glitch) + 1), axis=1)
        s = int(12 * glitch)
        if s:
            a[:, :, 0] = np.roll(a[:, :, 0], -s, axis=1); a[:, :, 2] = np.roll(a[:, :, 2], s, axis=1)
    a = (a * SCAN[:, :, :]).astype(np.int16) + GRAIN[int(gt * FPS) % 6]
    return np.clip(a, 0, 255).astype(np.uint8)

def tag(cv, t, text="CURIOSIDADES • IA"):
    f = F("mono", 28)
    spr = text_sprite(text, f, CYAN)
    w = spr.width + 30
    pill = rrect_sprite(w, 64, 32, (77, 232, 255, 22), (77, 232, 255, 110), 2)
    a = eo(prog(t, 0.05, 0.4))
    paste(cv, pill, W / 2, 250, a); paste(cv, spr, W / 2, 252, a)

# ---------- icons ----------
def captcha_card(state="idle", check_p=0.0, w=780, h=210):
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((0, 0, w - 1, h - 1), 22, fill=(248, 249, 251, 255), outline=(210, 214, 222, 255), width=3)
    bx, by, bs = 52, h // 2 - 40, 80
    if state == "fail":
        d.rounded_rectangle((bx, by, bx + bs, by + bs), 10, fill=(255, 235, 238, 255), outline=RED + (255,), width=5)
        d.line((bx + 22, by + 22, bx + bs - 22, by + bs - 22), fill=RED, width=9)
        d.line((bx + bs - 22, by + 22, bx + 22, by + bs - 22), fill=RED, width=9)
    elif state == "ok":
        d.rounded_rectangle((bx, by, bx + bs, by + bs), 10, fill=(255, 255, 255, 255), outline=(190, 196, 206, 255), width=4)
        pts = [(bx + 14, by + 42), (bx + 34, by + 62), (bx + 70, by + 16)]
        L1 = math.dist(pts[0], pts[1]); L2 = math.dist(pts[1], pts[2]); L = (L1 + L2) * check_p
        if L > 0:
            if L <= L1:
                q = L / L1; e = (pts[0][0] + (pts[1][0] - pts[0][0]) * q, pts[0][1] + (pts[1][1] - pts[0][1]) * q)
                d.line([pts[0], e], fill=(20, 190, 110), width=13, joint="curve")
            else:
                q = (L - L1) / L2; e = (pts[1][0] + (pts[2][0] - pts[1][0]) * q, pts[1][1] + (pts[2][1] - pts[1][1]) * q)
                d.line([pts[0], pts[1], e], fill=(20, 190, 110), width=13, joint="curve")
    else:
        d.rounded_rectangle((bx, by, bx + bs, by + bs), 10, fill=(255, 255, 255, 255), outline=(190, 196, 206, 255), width=4)
    d.text((bx + bs + 36, h // 2), "Não sou um robô", font=F("semi", 50), fill=(30, 34, 44), anchor="lm")
    # generic shield icon on the right
    cx, cy = w - 80, h // 2 - 18
    d.arc((cx - 34, cy - 34, cx + 34, cy + 34), 40, 330, fill=(80, 120, 230), width=9)
    d.polygon([(cx + 34, cy - 8), (cx + 22, cy + 10), (cx + 46, cy + 10)], fill=(80, 120, 230))
    d.text((cx, cy + 62), "verificação", font=F("med", 22), fill=(140, 146, 158), anchor="mm")
    return img

def person_avatar(size=120, ring=CYAN):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    m = Image.new("L", (size, size), 0); ImageDraw.Draw(m).ellipse((0, 0, size - 1, size - 1), fill=255)
    inner = Image.new("RGBA", (size, size), (34, 40, 56, 255))
    d = ImageDraw.Draw(inner)
    d.ellipse((size * .33, size * .18, size * .67, size * .52), fill=(170, 182, 205))
    d.ellipse((size * .15, size * .58, size * .85, size * 1.2), fill=(170, 182, 205))
    img.paste(inner, (0, 0), m)
    ImageDraw.Draw(img).ellipse((1, 1, size - 2, size - 2), outline=ring + (255,), width=4)
    return img

def cursor_sprite():
    img = Image.new("RGBA", (70, 90), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    pts = [(6, 4), (6, 70), (22, 55), (34, 82), (46, 76), (34, 50), (56, 50)]
    d.polygon(pts, fill=(20, 20, 24), outline=(255, 255, 255))
    d.line(pts + [pts[0]], fill=(255, 255, 255), width=4)
    return img

def bubble(text, side, maxw=660, font=None, fill=(30, 34, 48), color=WHITE, hl=None):
    font = font or F("med", 44)
    lines = wrap(text, font, maxw)
    lh = 58
    tw = max(font.getlength(l) for l in lines)
    w = int(tw + 64); h = int(lh * len(lines) + 44)
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((0, 0, w - 1, h - 1), 36, fill=fill + (255,))
    if side == "l": d.rectangle((0, h - 40, 40, h - 1), fill=fill + (255,))
    else: d.rectangle((w - 40, h - 40, w - 1, h - 1), fill=fill + (255,))
    y = 22
    for l in lines:
        x = 32
        for i, wd in enumerate(l.split()):
            c = color
            if hl and wd.strip(".,").lower() in hl: c = hl[wd.strip(".,").lower()]
            d.text((x, y), wd, font=font, fill=c)
            x += font.getlength(wd + " ")
        y += lh
    return img

def typing_dots(cv, t, cx, cy, side_fill=(30, 34, 48)):
    b = rrect_sprite(150, 84, 36, side_fill + (255,))
    paste(cv, b, cx, cy)
    d = ImageDraw.Draw(cv)
    for i in range(3):
        off = math.sin(t * 9 - i * 0.9) * 7
        x = cx - 38 + i * 38; y = cy + off
        d.ellipse((x - 9, y - 9, x + 9, y + 9), fill=(200, 205, 220))


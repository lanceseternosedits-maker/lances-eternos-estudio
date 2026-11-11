#!/usr/bin/env python3
"""Monta o Reel: imagens geradas (assets/) + codigo (parallax, luz, contorno, texto, pos e som).
Uso: python compor.py roteiro.json assets/ saida.mp4
Precisa: pillow, numpy, ffmpeg no PATH."""
import json, math, os, shutil, subprocess, sys, tempfile, wave
from multiprocessing import Pool
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops

W, H, FPS = 1080, 1920, 30
CYAN, MAG = (0, 229, 255), (255, 46, 170)
CORES = {"ciano": CYAN, "magenta": MAG}
FONTES = ["/usr/share/fonts/opentype/inter/Inter-Black.otf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]
FB = next((f for f in FONTES if os.path.exists(f)), None)
FONT = lambda s: ImageFont.truetype(FB, max(8, int(s))) if FB else ImageFont.load_default()

def ease(t): t = max(0., min(1., t)); return t * t * (3 - 2 * t)
def eout(t): t = max(0., min(1., t)); return 1 - (1 - t) ** 3
def eback(t): t = max(0., min(1., t)); c = 1.9; return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2
def rgba(s): return Image.new("RGBA", s, (0, 0, 0, 0))

def add(base, layer):
    b = np.array(base.convert("RGB")).astype(np.float32); l = np.array(layer).astype(np.float32)
    b += l[..., :3] * (l[..., 3:4] / 255.)
    return Image.fromarray(np.clip(b, 0, 255).astype(np.uint8)).convert("RGBA")

def glow(layer, r, k=1.0):
    g = np.array(layer.filter(ImageFilter.GaussianBlur(r))).astype(np.float32); g[..., 3] = np.clip(g[..., 3] * k, 0, 255)
    return Image.fromarray(g.astype(np.uint8), "RGBA")

# ---------- preparo das imagens geradas ----------
def chroma(path):
    """recorta o fundo verde, tira o vazamento de verde e apara."""
    a = np.array(Image.open(path).convert("RGB")).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    verde = g - np.maximum(r, b)
    alpha = np.clip(1 - (verde - 40) / 60, 0, 1)
    a[..., 1] = np.minimum(g, np.maximum(r, b) + 10)  # despill
    m = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))
    im = Image.fromarray(a.astype(np.uint8)).convert("RGBA"); im.putalpha(m)
    return im.crop(im.getbbox() or (0, 0, *im.size))

def contorno_rim(im, ow=12):
    """contorno grosso escuro + luz de recorte ciano/magenta."""
    o = rgba((im.width + 2 * ow, im.height + 2 * ow)); o.alpha_composite(im, (ow, ow))
    dil = o.split()[3].filter(ImageFilter.MaxFilter(ow * 2 + 1))
    borda = Image.new("RGBA", o.size, (8, 6, 20, 255)); borda.putalpha(dil)
    borda.alpha_composite(o); o = borda
    al = np.array(o.split()[3]).astype(np.float32) / 255.
    for cor, dx in ((CYAN, 10), (MAG, -10)):
        edge = np.clip(al - np.roll(al, dx, axis=1), 0, 1)
        edge = np.array(Image.fromarray((edge * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4))) / 255.
        lay = np.zeros(al.shape + (4,), np.float32); lay[..., :3] = cor; lay[..., 3] = np.clip(edge * 1.5, 0, 1) * 255 * al
        o.alpha_composite(Image.fromarray(lay.astype(np.uint8), "RGBA"))
    return o

def fundo(path):
    im = Image.open(path).convert("RGB")
    s = max(W * 1.18 / im.width, H * 1.18 / im.height)
    return im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS).convert("RGBA")

# ---------- efeitos de codigo ----------
rng = np.random.default_rng(7)
HAZE = Image.fromarray((rng.random((60, 34)) * 255).astype(np.uint8)).resize((W + 400, H + 400), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
PARTS = [(rng.random() * W, rng.random() * H, rng.uniform(1.5, 5), rng.uniform(8, 40), [CYAN, MAG, (255, 240, 220)][i % 3]) for i in range(140)]

def haze(t, k=0.3):
    ox = int(150 + math.sin(t * .3) * 140); oy = int(150 + t * 18) % 300
    a = np.array(HAZE.crop((ox, oy, ox + W, oy + H))).astype(np.float32) * k
    lay = np.zeros((H, W, 4), np.uint8); lay[..., :3] = (110, 90, 200); lay[..., 3] = a.astype(np.uint8)
    return Image.fromarray(lay, "RGBA")

def beams(t):
    im = rgba((W, H)); d = ImageDraw.Draw(im)
    for i, (x, col) in enumerate([(300, CYAN), (540, (255, 255, 255)), (780, MAG)]):
        sway = math.sin(t * .9 + i * 2) * 60; fl = .75 + .25 * math.sin(t * 7 + i * 3) * math.sin(t * 3.3 + i)
        d.polygon([(x - 18, -20), (x + 18, -20), (540 + sway + 330, 1400), (540 + sway - 330, 1400)], fill=col + (int(40 * fl),))
    return im.filter(ImageFilter.GaussianBlur(28))

def particles(t):
    im = rgba((W, H)); d = ImageDraw.Draw(im)
    for i, (x, y, r, sp, c) in enumerate(PARTS):
        yy = (y - t * sp) % H; xx = x + math.sin(t * .8 + i) * 25; tw = .5 + .5 * math.sin(t * 4 + i)
        d.ellipse([xx - r, yy - r, xx + r, yy + r], fill=c + (int(150 * tw),))
        if i % 9 == 0:
            R = r * 9; d.ellipse([xx - R, yy - R, xx + R, yy + R], outline=c + (60,), width=3, fill=c + (18,))
    return im

def texto(lines, size, t0, t, y, acc):
    im = rgba((W, H)); d = ImageDraw.Draw(im); f = FONT(size); yy = y; n = 0
    for line in lines:
        ws = line.split(" "); wd = [d.textlength(w + " ", font=f) for w in ws]; x = (W - sum(wd)) / 2
        for w, ww in zip(ws, wd):
            k = eback((t - t0 - n * 0.07) / 0.35); n += 1
            if k > 0:
                col = acc if len(w) > 2 else (255, 255, 255); al = int(255 * min(1, k))
                d.text((x, yy + (1 - k) * 60), w, font=f, fill=col + (al,), stroke_width=10, stroke_fill=(6, 4, 18, al))
            x += ww
        yy += int(size * 1.15)
    g = glow(im, 16, .9); tint = Image.new("RGBA", im.size, MAG + (0,)); tint.putalpha(g.split()[3].point(lambda v: v // 2))
    o = rgba((W, H)); o.alpha_composite(tint); o.alpha_composite(im); return o

VIG = None
def post(img, flash=0., chroma_px=0):
    global VIG
    a = np.array(img.convert("RGB")).astype(np.float32) / 255.
    bl = Image.fromarray((np.clip(a - .62, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(26))
    a += np.array(bl).astype(np.float32) / 255. * 1.2
    lum = a.mean(axis=2, keepdims=True)
    a += (1 - lum) * np.array([-.01, .025, .06]) * .9 + lum * np.array([.05, -.01, .03]) * .6
    a = np.clip((a - .5) * 1.08 + .5, 0, 1)
    if VIG is None:
        yy, xx = np.mgrid[0:H, 0:W]; r = np.sqrt(((xx - W / 2) / (W * .75)) ** 2 + ((yy - H / 2) / (H * .62)) ** 2)
        VIG = np.clip(1 - (r - .55) * .9, .35, 1)[..., None]
    a *= VIG
    if chroma_px: a[..., 0] = np.roll(a[..., 0], chroma_px, 1); a[..., 2] = np.roll(a[..., 2], -chroma_px, 1)
    a += flash + (rng.random((H // 2, W // 2, 1)).repeat(2, 0).repeat(2, 1) - .5) * .045
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))

# ---------- render ----------
CTX = {}
def preparar(roteiro, assets):
    cenas = []
    for c in roteiro["cenas"]:
        atores = []
        for a in c.get("atores", []):
            im = contorno_rim(chroma(f"{assets}/ator_{c['id']}_{a['p']}.png"))
            h = int(H * a["h"]); im = im.resize((int(im.width * h / im.height), h), Image.LANCZOS)
            atores.append((a, im))
        cenas.append((c, fundo(f"{assets}/fundo_{c['id']}.png"), atores))
    return cenas

def quadro(i):
    cenas, cortes = CTX["cenas"], CTX["cortes"]
    t = i / FPS; s = max(j for j in range(len(cenas)) if t >= cortes[j])
    c, bg, atores = cenas[s]; lt = t - cortes[s]; p = lt / c["dur"]
    # camera: empurra o fundo (parallax lento) e os atores (mais rapido)
    z = 1.0 + 0.08 * ease(p); bw, bh = bg.size
    cw, ch = W / z * 1.0, H / z * 1.0
    cx = bw / 2 + (p - .5) * 50 * (1 if s % 2 else -1); cy = bh / 2 - p * 20
    fr = bg.crop((int(cx - cw / 2), int(cy - ch / 2), int(cx + cw / 2), int(cy + ch / 2))).resize((W, H), Image.BICUBIC)
    fr = add(fr, beams(t)); fr.alpha_composite(haze(t))
    for k, (a, im) in enumerate(atores):
        e = eout((lt - 0.15 - k * 0.15) / 0.6)
        off = {"esquerda": (-(1 - e) * 700, 0), "direita": ((1 - e) * 700, 0), "baixo": (0, (1 - e) * 900)}[a.get("entra", "baixo")]
        resp = 1 + 0.012 * math.sin(t * 3 + k)  # respiracao
        aim = im.resize((int(im.width * resp), int(im.height * resp)), Image.BICUBIC) if abs(resp - 1) > 1e-3 else im
        x = int(a["x"] * W - aim.width / 2 + off[0] + (p - .5) * 40 * (1 if k % 2 else -1)); y = int(a["y"] * H - aim.height + off[1])
        sh = rgba((W, H)); ImageDraw.Draw(sh).ellipse([x + aim.width * .15, y + aim.height - 30, x + aim.width * .85, y + aim.height + 30], fill=(0, 0, 0, 150))
        fr.alpha_composite(sh.filter(ImageFilter.GaussianBlur(18)))
        lay = rgba((W, H)); lay.alpha_composite(aim, (x, y)); fr = add(fr, glow(lay, 40, .35)); fr.alpha_composite(lay)
    if c.get("vs"):
        k = eback((lt - .7) / .4)
        if k > .05:
            vs = rgba((W, H)); ImageDraw.Draw(vs).text((W / 2, H * .55), "VS", font=FONT(220 * k), anchor="mm", fill=(255, 255, 255, 255), stroke_width=12, stroke_fill=MAG + (255,))
            fr = add(fr, glow(vs, 30, 1.2)); fr.alpha_composite(vs)
    fr = add(fr, particles(t))
    fr.alpha_composite(texto(c["texto"], 132 if len(c["texto"]) > 2 else 124, cortes[s] + .25, t, c.get("y_texto", 260), CORES.get(c.get("cor"), CYAN)))
    imp = c.get("impacto"); it = lt - imp if imp is not None else 9
    shake = max(0, 1 - abs(it) * 5) * 20
    if shake:
        fr = fr.transform(fr.size, Image.AFFINE, (1, 0, math.sin(t * 70) * shake, 0, 1, math.cos(t * 55) * shake), Image.BICUBIC)
    flash = max(0, .5 - lt * 2.5) + max(0, .5 - abs(it) * 2.5)
    out = post(fr, flash, 8 if lt < .1 else 0)
    out.save(f"{CTX['tmp']}/f{i:04d}.png", compress_level=1)

def init(cenas, cortes, tmp): CTX.update(cenas=cenas, cortes=cortes, tmp=tmp)

# ---------- som (trilha + efeitos nos cortes) ----------
def som(cortes, impactos, dur, path, SR=44100):
    N = int(SR * dur); L = np.zeros(N); R = np.zeros(N); r = np.random.default_rng(3)
    def put(sig, at, g=1., pan=0.):
        i = int(at * SR); j = min(N, i + len(sig)); s = sig[:j - i] * g
        L[i:j] += s * np.sqrt(.5 * (1 - pan)); R[i:j] += s * np.sqrt(.5 * (1 + pan))
    lp = lambda x, c: np.convolve(x, np.ones(max(1, int(SR / c / 2))) / max(1, int(SR / c / 2)), "same")
    env = lambda n, a, d: np.minimum(np.minimum(1, np.arange(n) / max(1, a * SR)), np.minimum(1, (n - np.arange(n)) / max(1, d * SR)))
    beat = 60 / 92; chords = [[220, 261.63, 329.63], [174.61, 220, 261.63], [196, 261.63, 329.63], [196, 246.94, 293.66]]
    pos, ci = 0., 0
    while pos < dur:
        n = int(beat * 4 * SR); sig = np.zeros(n)
        for f in chords[ci % 4]:
            for det in (-.004, 0, .005): ph = np.cumsum(np.full(n, f / 2 * (1 + det)) / SR); sig += 2 * (ph % 1) - 1
        put(lp(sig, 900) * env(n, .35, .4) * .05, pos)
        for b in range(4):
            nb = int(beat * SR); put(np.sin(2 * np.pi * chords[ci % 4][0] / 4 * np.arange(nb) / SR) * env(nb, .005, beat * .6) * .28, pos + b * beat)
        pos += beat * 4; ci += 1
    nk = int(.45 * SR); tk = np.arange(nk) / SR; kick = np.sin(2 * np.pi * np.cumsum(50 + 110 * np.exp(-tk * 28)) / SR) * np.exp(-tk * 7)
    nh = int(.06 * SR); x = r.standard_normal(nh); hat = (x - lp(x, 4000)) * np.exp(-np.arange(nh) / SR * 70)
    b = cortes[1] if len(cortes) > 1 else 0
    while b < dur - .4: put(kick, b, .55); put(hat, b + beat / 2, .12, .3); b += beat
    def impact():
        n = int(1.6 * SR); tt = np.arange(n) / SR
        return np.tanh((np.sin(2 * np.pi * np.cumsum(30 + 90 * np.exp(-tt * 9)) / SR) * np.exp(-tt * 2.2) + lp(r.standard_normal(n), 2500) * np.exp(-tt * 9) * .8) * 1.6)
    def whoosh(d=.55):
        n = int(d * SR); tt = np.arange(n) / SR; x = r.standard_normal(n); return (lp(x, 1800) - lp(x, 300)) * np.sin(np.pi * tt / d) ** 2 * 2.2
    put(impact(), 0, .9)
    for k, c in enumerate(cortes[1:-1]): put(whoosh(), c - .25, .6, (-1) ** k * .6); put(impact(), c + .05, .45)
    for at in impactos: put(impact(), at, 1.)
    mix = np.stack([L, R], 1); mix[-int(.8 * SR):] *= np.linspace(1, 0, int(.8 * SR))[:, None]
    mix = np.tanh(mix * 1.3) / np.tanh(1.3); mix *= .89 / np.max(np.abs(mix))
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())

def main():
    roteiro = json.load(open(sys.argv[1], encoding="utf-8")); assets, saida = sys.argv[2], sys.argv[3]
    cenas = preparar(roteiro, assets)
    cortes = [0.]
    for c in roteiro["cenas"]: cortes.append(cortes[-1] + c["dur"])
    dur = cortes[-1]; nq = int(dur * FPS)
    impactos = [cortes[k] + c["impacto"] for k, c in enumerate(roteiro["cenas"]) if c.get("impacto") is not None]
    tmp = tempfile.mkdtemp()
    with Pool(os.cpu_count(), initializer=init, initargs=(cenas, cortes, tmp)) as pool:
        for k, _ in enumerate(pool.imap(quadro, range(nq), chunksize=4)):
            if k % 60 == 0: print(f"quadro {k}/{nq}", flush=True)
    som(cortes, impactos, dur, f"{tmp}/som.wav")
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-framerate", str(FPS), "-i", f"{tmp}/f%04d.png", "-i", f"{tmp}/som.wav",
                    "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k",
                    "-movflags", "+faststart", "-shortest", saida], check=True)
    shutil.rmtree(tmp); print("pronto:", saida)

if __name__ == "__main__":
    main()

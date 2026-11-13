#!/usr/bin/env python3
"""Teste v3 (8 s): direcao de arte da referencia. Fundo preto, mascote fosco, medidor e placa de neon, chao espelhado.
Uso: DISPLAY=:99 python3 video3.py saida.mp4 [--quadros 0,40 --png] ; audio: ROTEIRO=video3 python3 audio.py trilha.wav
"""
import math, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import video as V0
from video import ease, eout, lerp, pisca, W, H, FPS

FB = "/usr/share/fonts/opentype/inter/InterDisplay-Black.otf"
V0.F_HDR = ImageFont.truetype("/usr/share/fonts/opentype/inter/InterDisplay-ExtraBold.otf", 74)
V0.F_HDR_I = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSerif-BoldItalic.ttf", 88)
V0.F_TAG = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", 72)
V0.F_BUB = ImageFont.truetype(FB, 66)

VERDE, VERMELHO = (.32, 1., .05), (1., .12, .06)
NOS = [(math.cos(i * 2.4) * (1.6 + (i % 4) * .55), 2.4 + math.sin(i * 1.7) * .95, -2.6 + math.sin(i * 3.1) * .8, .09 + (i % 3) * .05) for i in range(14)]

def fit(d, txt, size, maxw):
    f = ImageFont.truetype(FB, size)
    while d.textlength(txt, font=f) > maxw: f = ImageFont.truetype(FB, f.size - 6)
    return f

def placa(txt, cor=(120, 255, 210)):
    im = Image.new("RGB", (1024, 256), (2, 14, 14)); d = ImageDraw.Draw(im)
    d.text((512, 132), txt, font=fit(d, txt, 150, 880), fill=cor, anchor="mm")
    return im

def medidor(pct, cor):
    im = Image.new("RGB", (512, 320), (3, 12, 9)); d = ImageDraw.Draw(im)
    d.text((256, 58), "CHANCE", font=ImageFont.truetype(FB, 78), fill=(235, 245, 235), anchor="mm")
    d.text((256, 210), f"{int(round(pct))}%", font=ImageFont.truetype(FB, 175), fill=cor, anchor="mm")
    return im

def base(T):
    br = 1 + .02 * math.sin(T * 3.1)
    return dict(uRoll=0., uC=[(9., 0., 0., 0.), (9., 0., 0., 0.)],
                uCa=[(.15, .15, br, pisca(T)), (.1, .1, 1., 1.)], uCb=[(0., 0., 0., 0.), (0., 0., 1., 0.)],
                uTable=(0., 0., 0., 0.), uKingTilt=0., uMeter=(0., 0., 0., 0.), uLevel=.92, uMeterCol=VERDE,
                uSign=(0., 0., 0., 0.), uSignSize=(1.8, .45), uNodes=NOS, uGraph=0.)

def s_campeao(lt, T):
    c = base(T); k = ease(lt / 1.6)
    c["uC"][0] = (.05, 0., .2, .12); c["uCb"][0] = (0., 1., 0., -.6)
    c["uCa"][0] = (.15, 2.5 + .25 * math.sin(lt * 9), 1 + .03 * math.sin(lt * 9), pisca(T, .7))
    c.update(uMeter=(-.55, 0., -1.9, 1.), uLevel=.92, uSign=(.6, 4.3, -4.6, 0.), uSignSize=(1.3, .33),
             uCamPos=lerp((.1, 1.05, 5.0), (.05, 1.05, 4.3), k), uCamTgt=(0., 1.75, -1.), uFov=1.1)
    return c, dict(uFocus=4.5, uAperture=.45), dict(uSignTex=placa("CAMPEÃO"), uMeterTex=medidor(92, (110, 255, 90)))

def s_deepblue(lt, T):
    c = base(T); k = ease(lt / 1.6)
    on = min(1., lt / .45) * (.3 if .12 < lt < .2 or .28 < lt < .33 else 1.)
    c["uC"][1] = (0., 0., 0., 0.); c["uCb"][1] = (0., 1., on, 0.)
    c["uCa"][1] = (.1, .1, 1 + .18 * math.exp(-lt * 6) * (lt > .45), 1.)
    c.update(uSign=(0., 3.25, -2.6, on), uSignSize=(1.9, .47),
             uCamPos=lerp((.05, .45, 3.8), (0., .75, 3.1), k), uCamTgt=(0., 1.55, 0.), uFov=1.15)
    return c, dict(uFocus=3.2, uAperture=.4), dict(uSignTex=placa("DEEP BLUE", (110, 210, 255)))

def s_rede(lt, T):
    c = base(T); k = ease(lt / 1.6)
    c["uC"][0] = (-1.3, 0., .3, .35); c["uCb"][0] = (0., 1., 0., 0.)
    c["uC"][1] = (1.3, 0., .3, -.35); c["uCb"][1] = (0., 1., 1., 0.)
    n = int(200_000_000 * eout(lt / 1.25))
    c.update(uGraph=eout(lt / 1.1), uSign=(0., 4.65, -3.6, 1.), uSignSize=(2.3, .57),
             uCamPos=lerp((0., 2.3, 8.0), (0., 2.05, 6.9), k), uCamTgt=(0., 1.9, -1.), uFov=1.05)
    return c, dict(uFocus=7., uAperture=.25), dict(uSignTex=placa(f"{n:,}".replace(",", "."), (255, 205, 60)))

def s_trava(lt, T):
    c = base(T); k = ease(lt / 1.6); q = ease((lt - .15) / 1.1)
    c["uC"][0] = (.05, 0., .2, .15); c["uCb"][0] = (0., 1., 0., 1.)
    c["uCa"][0] = (.08, .08, 1. - .04 * q, pisca(T, .3))
    lv = .92 - .84 * q; cor = lerp(VERDE, VERMELHO, ease((lt - .3) / .8))
    c.update(uMeter=(-.55, 0., -1.9, 1.), uLevel=lv, uMeterCol=cor, uSign=(.6, 4.3, -4.6, 0.), uSignSize=(1.3, .33),
             uCamPos=lerp((-.1, 1.0, 4.0), (-.05, 1.0, 3.5), k), uCamTgt=(0., 1.7, -1.), uFov=1.1)
    tc = tuple(int(255 * min(1, x * 1.1)) for x in cor)
    return c, dict(uFocus=3.4, uAperture=.5), dict(uSignTex=placa("CAMPEÃO"), uMeterTex=medidor(lv * 100, tc))

def s_queda(lt, T):
    c = base(T); k = ease(lt / 1.6)
    c["uC"][0] = (-.95, 0., -.55, .6); c["uCb"][0] = (0., 1., 0., 1.); c["uCa"][0] = (2.3, 2.3, .97, 1.)
    c["uC"][1] = (.95, 0., -.55, -.6); c["uCb"][1] = (0., 1., 1., 0.)
    x = (lt - .55) / .32
    tilt = 0. if x < 0 else (1.5708 * x * x if x < 1 else 1.5708 - .12 * math.exp(-(x - 1) * 4) * abs(math.sin((x - 1) * 9)))
    c.update(uTable=(0., 0., 0., 1.), uKingTilt=tilt, uSign=(0., 3.2, -3.2, 1.), uSignSize=(1.6, .4),
             uCamPos=lerp((.45, 1.55, 3.1), (.3, 1.45, 2.6), k), uCamTgt=(.05, 1.05, -.2), uFov=1.0)
    return c, dict(uFocus=2.6, uAperture=.55), dict(uSignTex=placa("JOGO 6"))

CORTES = [
    (1.6, s_campeao, [("o maior ", 0), ("campeão", 1)], [("o", 0), ("maior", 0), ("campeão", 1)], None),
    (1.6, s_deepblue, [("contra a ", 0), ("Deep Blue", 1)], [("contra", 0), ("a", 0), ("Deep Blue", 1)], None),
    (1.6, s_rede, [("200 milhões de ", 0), ("posições", 1)], [("por", 0), ("segundo", 1)], None),
    (1.6, s_trava, [("o campeão ", 0), ("travou", 1)], [("e", 0), ("ele", 0), ("travou", 1)], ("PERAÍ...", 760, 700)),
    (1.6, s_queda, [("só ", 0), ("19", 1), (" lances", 0)], [("só", 0), ("19", 1), ("lances", 0)], None),
]
INICIOS = np.cumsum([0] + [c[0] for c in CORTES])
DUR = float(INICIOS[-1]); NQ = int(round(DUR * FPS))
EVENTOS = dict(abertura=0., powerup=float(INICIOS[1]) + .45, contador=float(INICIOS[2]), queda_medidor=float(INICIOS[3]) + .15,
               queda=float(INICIOS[4]) + .55 + .32)
V0.CORTES, V0.INICIOS = CORTES, INICIOS

def uniforms(T):
    k = min(int(np.searchsorted(INICIOS, T, side="right") - 1), len(CORTES) - 1)
    lt = T - INICIOS[k]
    cena, pos, tex = CORTES[k][1](lt, T)
    cp = list(cena["uCamPos"]); n = .01
    cp[0] += n * math.sin(T * 1.7) + n * .5 * math.sin(T * 4.3); cp[1] += n * math.sin(T * 2.1 + 1)
    whip = max(0., 1 - lt / .14) if k > 0 else 0.
    cp[0] += .3 * whip ** 2 * (1 if k % 2 else -1)
    cena["uCamPos"] = tuple(cp); cena["uTime"] = T
    p = dict(uTime=T, uFocus=3., uAperture=.4, uCA=0., uFlash=0., uExpo=1.0, uSeed=float(k), uBlurDir=(0., 0.), uCamVel=(cp[0] * .02, cp[1] * .02, 0.))
    p.update(pos)
    if whip > 0: p["uBlurDir"] = (.07 * whip * (1 if k % 2 else -1), 0.); p["uCA"] = max(p["uCA"], .01 * whip)
    return cena, p, tex

def quadro(m, i):
    acc = None
    for s in (0., .5):  # desfoque de movimento: media de 2 subquadros
        c, p, tex = uniforms((i + s) / FPS)
        f = m.quadro(c, p, tex).astype(np.float32)
        acc = f if acc is None else (acc + f) * .5
    return V0.overlay(i, acc.astype(np.uint8))

def main():
    from engine2 import Motor2
    out = sys.argv[1]; m = Motor2()
    if "--quadros" in sys.argv:
        os.makedirs(out, exist_ok=True)
        for i in [int(x) for x in sys.argv[sys.argv.index("--quadros") + 1].split(",")]:
            Image.fromarray(quadro(m, i)).save(f"{out}/q{i:04d}.png")
        return
    video = out.replace(".mp4", "_video.mp4")
    ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                           "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", video], stdin=subprocess.PIPE)
    for i in range(NQ):
        ff.stdin.write(quadro(m, i).tobytes())
        if i % 30 == 0: print("quadro", i, "/", NQ, flush=True)
    ff.stdin.close(); ff.wait(); print("ok", video)

if __name__ == "__main__":
    main()

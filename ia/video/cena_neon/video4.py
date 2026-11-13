#!/usr/bin/env python3
"""Graphify (61 s): visual v3 no tempo da narracao de duas vozes da outra sessao.
Uso: DISPLAY=:99 python3 video4.py saida.mp4 [--quadros 0,40] ; audio vem do reel.mp4 da outra sessao.
"""
import math, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import video as V0
import video3 as V3
from video import ease, eout, lerp, pisca, W, H, FPS
from video3 import placa, NOS, VERDE, VERMELHO, FB

OURO = (255, 205, 60)

def medidor(pct, cor, rot="TOKENS"):
    im = Image.new("RGB", (512, 320), (3, 12, 9)); d = ImageDraw.Draw(im)
    d.text((256, 58), rot, font=ImageFont.truetype(FB, 78), fill=(235, 245, 235), anchor="mm")
    d.text((256, 210), f"{int(round(pct))}%", font=ImageFont.truetype(FB, 175), fill=cor, anchor="mm")
    return im

def tc(c): return tuple(int(255 * min(1, x * 1.1)) for x in c)

def base(T):
    c = V3.base(T); c["uC"] = [(9., 0., 0., 0.), (9., 0., 0., 0.)]; return c

def A(c, pos=(.05, 0., .2, .12), braco=0., sob=-.25, T=0., lt=0.):
    c["uC"][0] = pos; c["uCb"][0] = (0., 1., 0., sob)
    c["uCa"][0] = (.15, .15 + braco * (2.35 + .25 * math.sin(lt * 9)), 1 + .02 * math.sin(T * 3.1), pisca(T, .7))

def B(c, pos=(.05, 0., .2, -.1), luz=1., T=0.):
    c["uC"][1] = pos; c["uCb"][1] = (0., 1., luz, 0.)
    c["uCa"][1] = (.1, .1, 1 + .02 * math.sin(T * 2.7), 1.)

def cam(c, a, b, tgt, lt, d=2.2, fov=1.1):
    c.update(uCamPos=lerp(a, b, ease(lt / d)), uCamTgt=tgt, uFov=fov)

MED = (-.55, 0., -1.9, 1.)
SIGN_ALTO = (.0, 3.9, -3.6, 1.)

# ---------- cenas ----------
def s_gancho(lt, T):
    c = base(T); A(c, braco=ease((lt - .3) / .4) * (1 - ease((lt - 2.3) / .4)), T=T, lt=lt)
    c.update(uMeter=MED, uLevel=.92)
    cam(c, (.1, 1.05, 5.2), (.05, 1.05, 4.3), (0., 1.75, -1.), lt, 3.)
    return c, dict(uFocus=4.5, uAperture=.45), dict(uMeterTex=medidor(92, tc(VERDE)), uSignTex=placa(""))

def s_plano(lt, T):
    c = base(T); B(c, T=T); q = ease((lt - .4) / 2.6)
    lv = .92 - .84 * q; cor = lerp(VERDE, VERMELHO, ease((lt - .8) / 1.6))
    c.update(uMeter=(.95, 0., -1.9, 1.), uLevel=lv, uMeterCol=cor)
    cam(c, (.2, 1.1, 5.4), (.1, 1.1, 4.8), (.2, 1.8, -1.), lt, 3.)
    return c, dict(uFocus=3.4, uAperture=.5), dict(uMeterTex=medidor(lv * 100, tc(cor)), uSignTex=placa(""))

def s_problema(lt, T):
    c = base(T); A(c, braco=ease((lt - 1.2) / .4), T=T, lt=lt)
    on = min(1., max(0., (lt - .9) / .3)) * (.3 if 1.0 < lt < 1.08 else 1.)
    c.update(uSign=(.55, 3.7, -3.4, on), uSignSize=(1.5, .38))
    cam(c, (.4, 1.3, 5.6), (.15, 1.25, 4.6), (.1, 2.0, -1.), lt, 4.)
    return c, dict(uFocus=4.7, uAperture=.4), dict(uMeterTex=medidor(8, tc(VERMELHO)), uSignTex=placa("GRÁTIS", (120, 255, 120)))

def s_porque(lt, T):
    c = base(T); B(c, T=T)
    cam(c, (.05, .9, 4.9), (0., 1.0, 4.4), (0., 1.6, 0.), lt, 2., 1.05)
    return c, dict(uFocus=2.9, uAperture=.55), dict(uSignTex=placa(""))

def s_sessao(lt, T):
    c = base(T); A(c, (-1.3, 0., .3, .35), sob=.6, T=T, lt=lt); B(c, (1.3, 0., .3, -.35), T=T)
    g = .35 + .15 * math.sin(lt * 7) * (lt > .3)
    n = int(12000 * eout(lt / 4.2))
    c.update(uGraph=g, uSign=(0., 4.65, -3.6, 1.), uSignSize=(2.3, .57))
    cam(c, (0., 2.3, 8.0), (0., 2.05, 6.9), (0., 1.9, -1.), lt, 4.5, 1.05)
    return c, dict(uFocus=7., uAperture=.25), dict(uSignTex=placa(f"{n:,}".replace(",", "."), (255, 120, 90)))

def s_le(lt, T):
    c = base(T); A(c, sob=1., T=T, lt=lt); q = ease((lt - .2) / 4.5)
    lv = .7 - .64 * q; cor = lerp((1., .7, .05), VERMELHO, ease(lt / 2.))
    n = int(12000 + 36000 * eout(lt / 5.))
    c.update(uMeter=(-1.0, 0., -1.9, 1.), uLevel=lv, uMeterCol=cor, uSign=(.6, 4.4, -4.6, 1.), uSignSize=(1.25, .31))
    cam(c, (-.1, 1.0, 4.0), (-.05, 1.0, 3.4), (0., 1.85, -1.), lt, 5.)
    return c, dict(uFocus=3.4, uAperture=.5), dict(uMeterTex=medidor(lv * 100, tc(cor)), uSignTex=placa(f"{n:,}".replace(",", "."), (255, 90, 70)))

def s_solucao(lt, T):
    c = base(T); B(c, T=T)
    cam(c, (.05, .7, 5.0), (0., .9, 4.5), (0., 1.65, 0.), lt, 1.6, 1.1)
    return c, dict(uFocus=3.2, uAperture=.4), dict(uSignTex=placa(""))

def s_graphify(lt, T):
    c = base(T); A(c, braco=ease((lt - .5) / .4), T=T, lt=lt)
    on = min(1., lt / .45) * (.3 if .12 < lt < .2 or .28 < lt < .33 else 1.)
    c.update(uSign=(0., 3.25, -2.6, on), uSignSize=(2.0, .5))
    cam(c, (.05, .5, 4.4), (0., .8, 3.5), (0., 1.6, 0.), lt, 3.)
    return c, dict(uFocus=3.6, uAperture=.4), dict(uSignTex=placa("GRAPHIFY", (110, 210, 255)))

def s_mapa(lt, T):
    c = base(T); A(c, (-1.3, 0., .3, .35), T=T, lt=lt); B(c, (1.3, 0., .3, -.35), T=T)
    c.update(uGraph=eout(lt / 2.6))
    cam(c, (0., 2.0, 8.4), (0., 2.3, 7.0), (0., 2.1, -1.5), lt, 4., 1.05)
    return c, dict(uFocus=7.5, uAperture=.25), dict(uSignTex=placa(""))

def s_meucodigo(lt, T):
    c = base(T); B(c, T=T); c.update(uGraph=1.)
    cam(c, (.3, 1.0, 5.0), (.2, 1.1, 4.5), (0., 1.8, -.5), lt, 2.)
    return c, dict(uFocus=3.4, uAperture=.55), dict(uSignTex=placa(""))

def s_exato(lt, T):
    c = base(T); c.update(uGraph=1.)
    a = -.5 + lt * .18
    cam(c, (math.sin(a) * 4.2, 2.6, -2.6 + math.cos(a) * 4.2), (math.sin(a + .1) * 3.6, 2.5, -2.6 + math.cos(a + .1) * 3.6), (0., 2.4, -2.6), lt, 4.6, 1.0)
    return c, dict(uFocus=3.9, uAperture=.6), dict(uSignTex=placa(""))

def s_proxima(lt, T):
    c = base(T); A(c, T=T, lt=lt); c.update(uMeter=MED, uLevel=.92, uGraph=1.)
    cam(c, (.1, 1.1, 5.0), (.05, 1.05, 4.2), (0., 1.85, -1.2), lt, 4.5)
    return c, dict(uFocus=4.4, uAperture=.45), dict(uMeterTex=medidor(92, tc(VERDE)), uSignTex=placa(""))

def s_quanto(lt, T):
    c = base(T); B(c, T=T)
    cam(c, (-.1, .9, 4.8), (-.05, 1.0, 4.4), (0., 1.6, 0.), lt, 1.4, 1.05)
    return c, dict(uFocus=2.9, uAperture=.55), dict(uSignTex=placa(""))

def s_economia(lt, T):
    c = base(T); A(c, braco=ease((lt - 3.) / .4), T=T, lt=lt)
    q = eout((lt - .3) / 2.2); lv = .08 + .87 * q; cor = lerp(VERMELHO, VERDE, ease((lt - .5) / 1.2))
    n = max(1, int(round(71 * eout((lt - .3) / 1.6))))
    c.update(uMeter=(-1.0, 0., -1.9, 1.), uLevel=lv, uMeterCol=cor, uSign=(.3, 4.4, -4.6, 1.), uSignSize=(1.2, .3))
    cam(c, (.1, 1.1, 5.2), (.05, 1.1, 4.2), (0., 1.95, -1.2), lt, 7.)
    return c, dict(uFocus=4.4, uAperture=.45), dict(uMeterTex=medidor(lv * 100, tc(cor)), uSignTex=placa(f"{n}x MENOS", OURO))

def s_para(lt, T):
    c = base(T); A(c, (-.95, 0., -.2, .5), T=T, lt=lt); B(c, (.95, 0., -.2, -.5), T=T)
    c.update(uSign=(0., 4.1, -4.4, 1.), uSignSize=(2.0, .5), uGraph=1.)
    cam(c, (.4, 1.6, 5.4), (.2, 1.5, 4.7), (.0, 1.6, -.8), lt, 3.5)
    return c, dict(uFocus=4.1, uAperture=.45), dict(uSignTex=placa("SÓ UMA VEZ", (120, 255, 210)))

def s_cta(lt, T):
    c = base(T); A(c, braco=ease((lt - .3) / .4), T=T, lt=lt)
    on = min(1., lt / .3)
    c.update(uSign=(0., 3.25, -2.6, on), uSignSize=(2.0, .5), uGraph=1.)
    cam(c, (.1, .9, 4.8), (.05, 1.0, 3.9), (0., 1.75, -.5), lt, 3.5)
    return c, dict(uFocus=4.0, uAperture=.45), dict(uSignTex=placa("MAPA", OURO))

# ---------- tempo da narracao (cortes medidos no reel da outra sessao) ----------
INI = [0, 3.03, 7.1, 11.7, 13.9, 18.67, 24.47, 26.13, 29.8, 33.87, 36.07, 40.7, 45.27, 46.73, 54.1, 57.67]
FIM = 61.4
# (cena, cabecalho, legenda, palavras-chave, balao)
SEG = [
    (s_gancho, [("o problema dos ", 0), ("tokens", 1)], "Resolveram o problema dos tokens do Claude.", {"tokens"}, None),
    (s_plano, [("US$ 20 · ", 0), ("acaba em 2 dias", 1)], "Peraí, meu plano de 20 dólares acaba em 2 dias?", {"20", "2"}, ("PERAÍ...", 760, 640)),
    (s_problema, [("uma ferramenta ", 0), ("grátis", 1)], "Esse é o problema. E uma ferramenta grátis faz ele render muito mais.", {"grátis"}, None),
    (s_porque, [("por que ", 0), ("acaba?", 1)], "E por que ele acaba tão rápido?", {"rápido?"}, ("POR QUÊ?", 740, 620)),
    (s_sessao, [("a cada ", 0), ("sessão nova", 1)], "Porque a cada sessão nova, o Claude Code sai procurando nos seus arquivos de novo.", {"nova,", "arquivos"}, None),
    (s_le, [("abre, lê, ", 0), ("gasta", 1)], "Abre arquivo, lê função, e lá se vão milhares de tokens antes de você pedir qualquer coisa.", {"milhares", "tokens"}, None),
    (s_solucao, [("qual é a ", 0), ("solução?", 1)], "E qual é a solução?", {"solução?"}, ("E AÍ?", 740, 640)),
    (s_graphify, [("grátis e ", 0), ("código aberto", 1)], "Chama Graphify. É grátis e de código aberto.", {"Graphify.", "grátis"}, None),
    (s_mapa, [("roda uma vez, ", 0), ("vira um mapa", 1)], "Você roda uma vez, e ele transforma o seu projeto num mapa.", {"mapa."}, None),
    (s_meucodigo, [("um mapa ", 0), ("do meu código?", 1)], "Tipo um mapa do meu código?", {"código?"}, ("TIPO UM MAPA?", 700, 600)),
    (s_exato, [("cada arquivo, ", 0), ("cada ligação", 1)], "Exato. Cada arquivo, cada função, cada ligação.", {"ligação."}, None),
    (s_proxima, [("na próxima ", 0), ("sessão", 1)], "Na próxima sessão, o Claude não sai procurando. Ele só consulta o mapa.", {"mapa."}, None),
    (s_quanto, [("quanto ", 0), ("economiza?", 1)], "E quanto economiza?", {"economiza?"}, ("QUANTO?", 740, 620)),
    (s_economia, [("maior o projeto, ", 0), ("mais economia", 1)], "No teste do criador, 71 vezes menos tokens. E quanto maior o projeto, mais você economiza.", {"71", "economiza."}, None),
    (s_para, [("não paga ", 0), ("duas vezes", 1)], "Para de pagar pro Claude procurar a mesma coisa duas vezes.", {"duas", "vezes."}, None),
    (s_cta, [("comenta ", 0), ("MAPA", 1)], "Comenta MAPA que eu te mando o link e o passo a passo.", {"MAPA"}, None),
]
INICIOS = np.array(INI + [FIM]); DUR = FIM; NQ = int(round(DUR * FPS))

def blocos(txt):
    ws = txt.split(); ch = []; cur = []
    for w in ws:
        cur.append(w)
        if w[-1] in ".,?!" or len(cur) >= 3: ch.append(cur); cur = []
    if cur: ch.append(cur)
    return ch

QUEM = "ABABAABAABAABAAA"
_ev = __import__("json").load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "palavras_graphify.json")))["seg"]
PAL = []  # por segmento: lista de (t_inicio, palavra)
for k, (fn, hdr, leg, chave, bal) in enumerate(SEG):
    ws = leg.split(); ts = [t + .03 for t in _ev[k]]
    assert len(ws) == len(ts), (k, len(ws), len(ts))
    PAL.append(list(zip(ts, ws)))
PLANO = []  # por segmento: blocos de ate 3 palavras com tempo de cada palavra
for k, p in enumerate(PAL):
    ch = []; cur = []
    for t, w in p:
        cur.append((t, w))
        if w[-1] in ".,?!" or len(cur) >= 3: ch.append(cur); cur = []
    if cur: ch.append(cur)
    PLANO.append(ch)

def _envelope():
    import wave
    wv = wave.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "narr_graphify.wav"))
    a = np.frombuffer(wv.readframes(wv.getnframes()), "<i2").astype(np.float32).reshape(-1, wv.getnchannels()).mean(1)
    sr = wv.getframerate(); a = np.diff(a)  # realce de voz sobre a musica grave
    hop = sr // 60; n = len(a) // hop
    e = np.sqrt((a[:n * hop].reshape(n, hop) ** 2).mean(1))
    e = np.convolve(e, np.ones(3) / 3, "same"); e = e / (np.percentile(e, 95) + 1e-6)
    return np.clip(e, 0, 1.2), 60.
ENV, ENV_FPS = _envelope()
def env(T): return float(ENV[min(len(ENV) - 1, int(T * ENV_FPS))])

def falando(k, T):
    p = PAL[k]
    return p[0][0] - .05 <= T <= p[-1][0] + .45

def pop_tag(age, d=.16):
    if age < 0: return 0.
    x = min(1., age / d); return 1 + .25 * math.sin(x * math.pi) if x < 1 else 1.

def legenda(lay, k, T):
    ch = PLANO[k]; chave = SEG[k][3]
    b = 0
    for j, c in enumerate(ch):
        if T >= c[0][0] - .02: b = j
    c = ch[b]
    d = ImageDraw.Draw(lay); F = V0.F_TAG; gap = 14
    vis = [(t, w) for t, w in c if T >= t - .02]
    if not vis: return
    larg = [int(F.getlength(w) + 40) for t, w in c]
    tot = sum(larg) + gap * (len(c) - 1); x = (W - tot) / 2; y0 = 1500
    for (t, w), bw in zip(c, larg):
        s = pop_tag(T - t + .02)
        if s > 0:
            at = T < t + .35 or w in chave
            bh = 92; tag = Image.new("RGBA", (bw + 20, bh + 24), (0, 0, 0, 0)); td = ImageDraw.Draw(tag)
            td.rounded_rectangle([10, 16, bw + 10, bh + 16], 9, fill=(0, 0, 0, 120))
            td.rounded_rectangle([10, 10, bw + 10, bh + 10], 9, fill=(*(V0.AMARELO if w in chave else V0.LARANJA), 255))
            td.text((10 + bw / 2, 10 + bh / 2 + 2), w, font=F, fill=V0.TINTA, anchor="mm")
            tag = tag.rotate((hash(w) % 5 - 2) * .8, resample=Image.BICUBIC, expand=True)
            tw2, th2 = max(1, int(tag.width * s)), max(1, int(tag.height * s))
            tag = tag.resize((tw2, th2), Image.BICUBIC)
            lay.alpha_composite(tag, (int(x + bw / 2 - tw2 / 2), int(y0 + bh / 2 - th2 / 2)))
        x += bw + gap

def atuar(cena, k, T):
    """boca no ritmo da voz, olhar para quem fala, gesto e balanco de quem fala"""
    fala = QUEM[k]; on = falando(k, T); e = env(T) if on else 0.
    vis = [cena["uCb"][i][1] > .5 for i in (0, 1)]
    face = [[0., 0., 0., 0.], [0., 0., 0., 0.]]
    for i, nome in enumerate("AB"):
        if not vis[i]: continue
        f = face[i]
        if nome == fala:
            f[0] = min(1., e * 1.15)
            f[1] = .25 * math.sin(T * 1.3 + i)  # olhar vivo
            ca = list(cena["uCa"][i]); ca[2] = ca[2] + .035 * e
            if ca[1] < .5:  # gesto com o braco quando nao esta erguido
                ca[1] = .15 + .55 * max(0., math.sin(T * 3.2 + i)) * min(1., e * 1.5)
            cena["uCa"][i] = tuple(ca)
            c = list(cena["uC"][i]); c[3] += .07 * math.sin(T * 2.4) * (1. if on else .3); cena["uC"][i] = tuple(c)
        else:
            outro = 1 - i
            if vis[outro]:
                f[1] = (1. if cena["uC"][outro][0] > cena["uC"][i][0] else -1.) * .9
            else:
                f[1] = .3 * math.sin(T * .7)
        f[3] = .6 if nome == "A" else (-.3 if fala == "B" and nome == "B" else .4)
    cena["uFace"] = [tuple(face[0]), tuple(face[1])]

def overlay(i, frame):
    T = i / FPS; k = min(int(np.searchsorted(INICIOS, T, side="right") - 1), len(SEG) - 1)
    lt = T - INI[k]; fn, hdr, leg, chave, bal = SEG[k]
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    V0.cabecalho(lay, hdr, lt); legenda(lay, k, T)
    if bal: V0.balao(lay, bal, lt)
    im = Image.fromarray(frame).convert("RGBA"); im.alpha_composite(lay)
    return np.asarray(im.convert("RGB"))

def uniforms(T):
    k = min(int(np.searchsorted(INICIOS, T, side="right") - 1), len(SEG) - 1)
    lt = T - INI[k]
    cena, pos, tex = SEG[k][0](lt, T)
    atuar(cena, k, T)
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
            Image.fromarray(quadro(m, i)).save(f"{out}/q{i:04d}.png")
        return
    a, b = 0, NQ
    if "--faixa" in sys.argv: a, b = [int(x) for x in sys.argv[sys.argv.index("--faixa") + 1].split(":")]
    video = out.replace(".mp4", "_video.mp4")
    ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                           "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", video], stdin=subprocess.PIPE)
    for i in range(a, b):
        ff.stdin.write(quadro(m, i).tobytes())
        if i % 60 == 0: print("quadro", i, "/", b, flush=True)
    ff.stdin.close(); ff.wait(); print("ok", video)

if __name__ == "__main__":
    main()

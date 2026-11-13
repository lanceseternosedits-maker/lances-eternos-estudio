#!/usr/bin/env python3
"""Trilha estereo continua (100 bpm) + efeitos sincronizados ao roteiro do video.py. Saida: wav 44.1 kHz estereo."""
import math, os, sys, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
V = __import__(os.environ.get('ROTEIRO', 'video'))

SR = 44100
DUR = V.DUR + .5
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)
CUTS = [float(x) for x in V.INICIOS[1:-1]]
DROP_OFF, DROP_ON = (float(V.INICIOS[9]), float(V.INICIOS[10])) if len(V.CORTES) > 10 else (1e9, 1e9)

def put(sig, at, g=1., pan=0.):
    i = int(at * SR)
    if i >= N: return
    if i < 0: sig = sig[-i:]; i = 0
    j = min(N, i + len(sig)); s = sig[:j - i] * g
    L[i:j] += s * math.sqrt(.5 * (1 - pan)); R[i:j] += s * math.sqrt(.5 * (1 + pan))

def put2(l, r, at, g=1.):
    i = int(at * SR); j = min(N, i + len(l))
    L[i:j] += l[:j - i] * g; R[i:j] += r[:j - i] * g

def env(n, a, d, sus=1.):
    e = np.full(n, sus, float); na = max(1, int(a * SR)); nd = max(1, int(d * SR))
    e[:na] = np.linspace(0, 1, na) * (1 if na < n else 1)
    if nd < n: e[-nd:] *= np.linspace(1, 0, nd)
    return e

def onepole(x, cut):
    """passa-baixa 1 polo vetorizado por blocos (aproximacao via filtro IIR em numpy puro)."""
    a = math.exp(-2 * math.pi * cut / SR)
    y = np.empty_like(x); acc = 0.
    # loop em blocos de 1 amostra e lento; usa lfilter manual com cumsum em log-espaco nao e estavel, entao faz em python so para sinais curtos
    for i in range(len(x)): acc = (1 - a) * x[i] + a * acc; y[i] = acc
    return y

def lpf(x, cut):  # media movel em cascata (rapido)
    k = max(1, int(SR / cut / 2.2)); ker = np.ones(k) / k
    return np.convolve(np.convolve(x, ker, "same"), ker, "same")

def hpf(x, cut): return x - lpf(x, cut)

def saw(f, n, ph=0.):
    p = (np.cumsum(np.broadcast_to(f, (n,)) / SR) + ph) % 1.; return 2 * p - 1

def midi(m): return 440. * 2 ** ((m - 69) / 12)

# ---------------- musica ----------------
BPM = 100; B = 60 / BPM; BAR = 4 * B
# Fm  Db  Ab  Eb
CH = [[53, 56, 60], [49, 53, 56], [56, 60, 63], [51, 55, 58]]
BASS = [41, 37, 44, 39]
nbars = int(DUR / BAR) + 1

def kick():
    n = int(.5 * SR); t = np.arange(n) / SR
    f = 46 + 140 * np.exp(-t * 30); s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)
    click = hpf(rng.standard_normal(n), 3000) * np.exp(-t * 300) * .4
    return np.tanh((s + click) * 1.8)

def clap():
    n = int(.35 * SR); t = np.arange(n) / SR; x = hpf(rng.standard_normal(n), 1200)
    e = np.exp(-t * 22) + .6 * np.exp(-((t - .012) * 400) ** 2) + .5 * np.exp(-((t - .024) * 400) ** 2)
    return x * e * .6

def hat(o=False):
    n = int((.28 if o else .05) * SR); t = np.arange(n) / SR
    x = hpf(rng.standard_normal(n), 7000); return x * np.exp(-t * (14 if o else 90))

K, C, Hc, Ho = kick(), clap(), hat(), hat(True)

def intensidade(t):
    if t < CUTS[0]: return .35          # intro filtrada
    if DROP_OFF <= t < DROP_ON: return .0
    return 1.

for b in range(nbars):
    t0 = b * BAR; ci = b % 4
    # pad largo (detune diferente em cada lado)
    n = int(BAR * SR) + int(.3 * SR)
    pl = np.zeros(n); pr = np.zeros(n)
    for m in CH[ci]:
        f = midi(m - 12)
        pl += saw(f * 1.004, n) + saw(f * .997, n, .3); pr += saw(f * .996, n, .6) + saw(f * 1.003, n, .1)
    e = env(n, .4, .5)
    put2(lpf(pl, 1400) * e * .028, lpf(pr, 1400) * e * .028, t0)
    # baixo 808
    for (pos, dur) in [(0, 1.4), (1.5, .4), (2.5, 1.3)]:
        n = int(dur * B * SR); t = np.arange(n) / SR
        f = midi(BASS[ci] - 12) * (1 + .5 * np.exp(-t * 40))
        s = np.tanh(np.sin(2 * np.pi * np.cumsum(f) / SR) * 2.2) * env(n, .003, .08)
        put(s, t0 + pos * B, .22 * (1 if intensidade(t0 + pos * B) > .5 else .5))
    # arpejo pluck em 16 avos, ping-pong
    notas = CH[ci] + [CH[ci][0] + 12, CH[ci][1] + 12]
    for s16 in range(16):
        ts = t0 + s16 * B / 4
        if ts > DUR: break
        m = notas[[0, 2, 1, 3, 2, 4, 3, 2][s16 % 8]] + 12
        n = int(.22 * SR); t = np.arange(n) / SR
        x = saw(midi(m), n) * .6 + np.sign(np.sin(2 * np.pi * midi(m) * t)) * .4
        x = lpf(x, 2600) * np.exp(-t * 16)
        g = .055 * (.55 + .45 * (s16 % 4 == 0)) * (.6 if intensidade(ts) < .5 else 1.)
        put(x, ts, g, -.45 if s16 % 2 else .45)
        put(x, ts + B * .75, g * .35, .45 if s16 % 2 else -.45)   # eco
    # bateria
    for beat in range(4):
        tb = t0 + beat * B; it = intensidade(tb)
        if it > .5:
            if beat in (0, 2): put(K, tb, .5)
            if beat == 2: put(K, tb + B * .75, .35)
            if beat in (1, 3): put(C, tb, .32, -.1)
        elif it > .2 and beat in (0, 2):
            put(lpf(K, 400), tb, .45)
        for s in range(4):
            th = tb + s * B / 4
            if it > .2 or (DROP_OFF <= th < DROP_ON):
                v = [.12, .05, .08, .05][s] * (1 if it > .5 else .6)
                put(Ho if s == 2 and beat % 2 else Hc, th + (.012 if s % 2 else 0), v, .3 if s % 2 else -.15)

# ---------------- efeitos ----------------
def whoosh(d=.42):
    n = int(d * SR); t = np.arange(n) / SR; x = rng.standard_normal(n)
    y = lpf(x, 2400) - lpf(x, 350); e = np.sin(np.pi * t / d) ** 3
    return y * e * 2.5

def popsnd(f0=1100, d=.09):
    n = int(d * SR); t = np.arange(n) / SR
    f = f0 * (1 + 1.2 * np.exp(-t * 60)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 45)

def boing():
    n = int(.35 * SR); t = np.arange(n) / SR
    f = 320 + 380 * np.exp(-t * 9) * (1 + .3 * np.sin(t * 60)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * .9

def glitch(d=.32):
    n = int(d * SR); out = np.zeros(n); i = 0
    while i < n:
        m = int(rng.uniform(.008, .03) * SR); f = rng.choice([1800, 2400, 3200, 900])
        out[i:i + m] += np.sign(np.sin(2 * np.pi * f * np.arange(min(m, n - i)) / SR)) * .3
        i += m + int(rng.uniform(.005, .02) * SR)
    return out * np.linspace(1, .3, n)

def impact():
    n = int(1.8 * SR); t = np.arange(n) / SR
    sub = np.sin(2 * np.pi * np.cumsum(32 + 110 * np.exp(-t * 10)) / SR) * np.exp(-t * 2.4)
    nz = lpf(rng.standard_normal(n), 3000) * np.exp(-t * 11) * .9
    return np.tanh((sub + nz) * 1.7)

def clack():
    n = int(.12 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 1900 * t) * .6 + np.sin(2 * np.pi * 820 * t) + hpf(rng.standard_normal(n), 1500) * .5) * np.exp(-t * 55)

def powerup(d=.9):
    n = int(d * SR); t = np.arange(n) / SR
    f = 120 + 900 * (t / d) ** 1.6
    x = saw(f, n) * .5 + np.sin(2 * np.pi * np.cumsum(f * 2) / SR) * .3
    return lpf(x, 3500) * (t / d) * np.exp(-np.maximum(t - d * .85, 0) * 30)

def riser(d):
    n = int(d * SR); t = np.arange(n) / SR
    x = hpf(rng.standard_normal(n), 2500) * .4 + np.sin(2 * np.pi * np.cumsum(300 + 1600 * (t / d) ** 2) / SR) * .25
    return x * (t / d) ** 2.2

def bell(f=1318.5, d=1.4):
    n = int(d * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 4) + .3 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 9)) * np.exp(-t * 3)

def stab():
    n = int(1.1 * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for m in [41, 48, 53, 56]: x += saw(midi(m), n) + saw(midi(m) * 1.006, n, .4)
    return lpf(x, 1600) * np.exp(-t * 3.2) * .25

for k, c in enumerate(CUTS):
    put(whoosh(), c - .2, .55, -.6 if k % 2 else .6)
# palavras (mesma conta do video.py) + glitch do cabecalho + baloes
for k, (dur, fn, hdr, pal, bal) in enumerate(V.CORTES):
    t0 = float(V.INICIOS[k]); n = len(pal); jan = min(dur * .62, .32 * n)
    for i, (w, chave) in enumerate(pal):
        put(popsnd(1500 if chave else 1050), t0 + .08 + jan * i / n, .22 if chave else .14, (i - n / 2) * .2)
    put(glitch(), t0 + .05, .045, .2)
    if bal: put(boing(), t0 + .2, .22, .3)
# momentos
EV = getattr(V, "EVENTOS", None)
if EV is None:
    EV = dict(abertura=0., powerup=float(V.INICIOS[2]), contador=float(V.INICIOS[4]), queda=float(V.INICIOS[7]) + .55, desiste=float(V.INICIOS[8]))
put(impact(), EV["abertura"], .55)
if "powerup" in EV: put(powerup(), EV["powerup"], .3, .3)
if "contador" in EV:
    for i in range(26): put(popsnd(2600 + (i % 3) * 300, .03), EV["contador"] + i * .045, .07, (i % 2 - .5) * .6)
if "queda" in EV:
    q = EV["queda"]; put(riser(.5), q - .65, .25); put(clack(), q, .7); put(impact(), q, .85); put(bell(880, 1.6), q + .01, .12)
if "desiste" in EV: put(stab(), EV["desiste"], .9); put(impact(), EV["desiste"] + .02, .4)
if "queda_medidor" in EV:
    t0 = EV["queda_medidor"]; n = int(1.0 * SR); tt = np.arange(n) / SR
    put(np.sin(2 * np.pi * np.cumsum(900 - 700 * tt) / SR) * np.exp(-tt * 1.5) * .5, t0, .25)
if DROP_OFF < 1e8:
    for i, f in enumerate([1568, 1976, 2349, 2637, 3136]):
        put(bell(f, .9), DROP_OFF + .1 + i * .18, .06, (i - 2) * .3)
    put(riser(1.4), DROP_ON - 1.4, .4); put(impact(), DROP_ON, .6); put(bell(1318.5), DROP_ON + .25, .2)

# ---------------- reverb + mix ----------------
def reverb(x, seed, d=1.6):
    n = int(d * SR); t = np.arange(n) / SR
    ir = np.random.default_rng(seed).standard_normal(n) * np.exp(-t * 3.2); ir = lpf(ir, 5000); ir /= np.sqrt((ir ** 2).sum())
    m = len(x) + n; F = 1 << (m - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, F) * np.fft.rfft(ir, F), F)[:len(x)]

wl, wr = reverb(L, 1), reverb(R, 2)
L2 = L + wl * .18; R2 = R + wr * .18
mix = np.stack([L2, R2], 1)
mix[-int(.5 * SR):] *= np.linspace(1, 0, int(.5 * SR))[:, None]
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= .95 / np.max(np.abs(mix))
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("ok", DUR)

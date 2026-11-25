import numpy as np, wave, sys
sys.path.insert(0, '.')
import json
SR = 44100
TL=json.load(open('timeline.json')); S={x['name']:x['start'] for x in TL['scenes']}; TOTAL=TL['total']; CL=TL['clips']
def c0(k): return CL[k]['start']
def c1(k): return CL[k]['start']+CL[k]['dur']
N = int((TOTAL + 0.5) * SR)
mix = np.zeros(N, np.float64)
rng = np.random.default_rng(7)

def add(sig, t, g=1.0):
    i = int(t * SR); j = min(N, i + len(sig))
    if i < N: mix[i:j] += sig[:j - i] * g

def env(n, a=0.002, r=None):
    e = np.ones(n); na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    if r: e *= np.exp(-np.arange(n) / (r * SR))
    return e

def lp(x, k):  # one-pole lowpass
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += k * (x[i] - acc); y[i] = acc
    return y

def impact(big=1.0):
    n = int(1.2 * SR); t = np.arange(n) / SR
    f = 40 + 110 * np.exp(-t * 18)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    nz = rng.normal(0, 1, n) * np.exp(-t * 22) * 0.5
    return (sub * 0.9 + nz) * big

def glitch():
    n = int(0.22 * SR); out = np.zeros(n); i = 0
    while i < n:
        L = rng.integers(200, 1600)
        seg = np.sign(np.sin(2 * np.pi * rng.uniform(80, 1400) * np.arange(L) / SR)) * rng.uniform(0.2, 0.6)
        if rng.random() < 0.4: seg = rng.normal(0, 0.4, L)
        out[i:i + L] = seg[:max(0, min(L, n - i))]; i += L
    return out * env(n, 0.001, 0.12) * 0.55

def whoosh(d=0.5):
    n = int(d * SR); t = np.linspace(0, 1, n)
    nz = rng.normal(0, 1, n)
    e = np.sin(np.pi * t) ** 2
    y = np.zeros(n); acc = 0.0; k = 0.02 + 0.25 * t
    for i in range(n): acc += k[i] * (nz[i] - acc); y[i] = acc
    return y * e * 0.9

def pop():
    n = int(0.12 * SR); t = np.arange(n) / SR
    f = 500 + 700 * (t / t[-1])
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 35) * 0.5

def click():
    n = int(0.018 * SR)
    return rng.normal(0, 1, n) * np.exp(-np.arange(n) / (0.003 * SR)) * 0.18

def ding():
    n = int(1.2 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 1318.5 * t) + 0.6 * np.sin(2 * np.pi * 1975.5 * t)) * np.exp(-t * 4) * 0.28 * env(n)

def buzz():
    n = int(0.38 * SR); t = np.arange(n) / SR
    return np.sign(np.sin(2 * np.pi * 92 * t)) * 0.22 * env(n, 0.005) * (t < 0.36)

def kick():
    n = int(0.4 * SR); t = np.arange(n) / SR
    f = 45 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * 0.75

def hat():
    n = int(0.05 * SR); x = rng.normal(0, 1, n); x = x - lp(x, 0.3)
    return x * np.exp(-np.arange(n) / (0.012 * SR)) * 0.1


t = np.arange(N) / SR
pad = np.zeros(N)
for f0, g in ((55, .5), (110, .35), (130.81, .22), (164.81, .2), (220, .08)):
    for h in (1, 2, 3):
        pad += np.sin(2 * np.pi * f0 * h * t + h) * g / h ** 1.5
pad *= 0.11 * (0.75 + 0.25 * np.sin(2 * np.pi * 0.12 * t)) * np.clip(t / 0.4, 0, 1)
mus = pad.copy()
BPM = 112; beat = 60 / BPM
def madd(sig, tt, g):
    i = int(tt * SR); j = min(N, i + len(sig))
    if i < N: mus[i:j] += sig[:j - i] * g
tt = 0.0; k = 0
mute_a, mute_b = S["believe"], S["believe"] + 0.9
while tt < TOTAL - 1.0:
    if not (mute_a - 0.1 <= tt < mute_b):
        madd(kick(), tt, 0.65)
        if k % 4 in (1, 3): madd(hat(), tt, 1.0)
        madd(hat(), tt + beat / 2, 0.7)
    tt += beat; k += 1
# narration + ducking
import wave as _w
with _w.open("narration.wav") as w_:
    nar = np.frombuffer(w_.readframes(w_.getnframes()), np.int16).astype(np.float64) / 32768
nar = np.pad(nar, (0, max(0, N - len(nar))))[:N]
e = np.abs(nar); win = int(0.15 * SR)
e = np.convolve(e, np.ones(win) / win, mode="same")
duck = 1 - 0.55 * np.clip(e / 0.05, 0, 1)
mix += mus * duck

sx = 0.6
s = S["hook"]
add(glitch(), s + 0.12, sx); add(impact(0.7), s + 0.12, sx); m = c0("h1") + 0.62
add(impact(1.0), s + m, sx); add(glitch(), s + m, .5 * sx); add(impact(0.9), s + c0("h2"), sx)
s = S["context"]
add(whoosh(0.35), s - 0.15, .5 * sx)
for i in range(11): add(click(), s + i / 26, sx)
add(pop(), s + 0.55, sx); add(click(), s + 2.12, 2.5 * sx); add(buzz(), s + 2.2, sx); add(glitch(), s + 2.2, .5 * sx)
s = S["hire"]; k1 = c0("r1") + 0.95
add(whoosh(0.35), s - 0.15, .5 * sx); add(impact(.8), s + k1, sx); add(impact(.9), s + k1 + .3, sx); add(pop(), s + k1 + .55, sx); add(ding(), s + k1 + 1.2, sx)
s = S["chat"]
add(whoosh(0.35), s - 0.15, .5 * sx); add(pop(), s + 0.55, sx)
for i in range(101): add(click(), s + c0("t2") + 0.3 + i / 46, 0.6 * sx)
add(pop(), s + c0("t3") + 0.75, sx); add(impact(1.0), s + c1("t3") - 0.35, sx); add(glitch(), s + c1("t3") - 0.35, .5 * sx)
s = S["believe"]
add(whoosh(0.4), s - 0.2, .6 * sx); add(pop(), s + .2, sx); add(ding(), s + 0.9, sx)
s = S["nuance"]
add(glitch(), s, .5 * sx); add(pop(), s + .2, sx); add(pop(), s + 1.15, sx); add(impact(.6), s + c0("n2"), sx)
s = S["end"]
add(whoosh(0.35), s - 0.15, .5 * sx); add(impact(.8), s + .55, sx); add(impact(1.1), s + .95, sx); add(glitch(), s + .95, .5 * sx); add(pop(), s + c0("e2"), sx)

mix += nar * 1.25
fe = int((TOTAL - 0.8) * SR); mix[fe:] *= np.linspace(1, 0, N - fe) ** 2
mix = np.tanh(mix * 1.05); mix = mix / np.max(np.abs(mix)) * 0.89
st = np.stack([mix, mix], 1)
with wave.open("audio2.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print("audio2", TOTAL)

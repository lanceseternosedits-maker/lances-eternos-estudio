import numpy as np, wave, sys
sys.path.insert(0, '.')
from render import starts, THINK, THINK_T0, THINK_CPS, AI_T0
SR = 44100
S, TOTAL = starts()
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

# ---- music ----
t = np.arange(N) / SR
pad = np.zeros(N)
for f0, g in ((55, .5), (110, .35), (130.81, .22), (164.81, .2), (220, .08)):
    for h in (1, 2, 3):
        pad += np.sin(2 * np.pi * f0 * h * t + h) * g / h ** 1.5
pad *= 0.16 * (0.75 + 0.25 * np.sin(2 * np.pi * 0.12 * t))
pad *= np.clip(t / 0.4, 0, 1)
mix += pad

BPM = 104; beat = 60 / BPM
b_start = S["context"]
mute_a, mute_b = S["believe"], S["believe"] + 1.55
k = 0
tt = b_start
while tt < TOTAL - 1.2:
    if not (mute_a - 0.1 <= tt < mute_b):
        add(kick(), tt, 0.9)
        if k % 4 in (1, 3): add(hat(), tt, 1.0)
        add(hat(), tt + beat / 2, 0.7)
    tt += beat; k += 1

# ---- sfx ----
s = S["hook"]
add(glitch(), s + 0.0); add(impact(0.8), s + 0.0); add(impact(1.0), s + 0.35); add(glitch(), s + 0.35, .7)
add(whoosh(0.4), s + 0.75, .5); add(impact(0.9), s + 2.0); add(glitch(), s + 2.0, .6)
s = S["context"]
add(whoosh(0.35), s - 0.15, .6)
for i in range(11): add(click(), s + 0.1 + i / 22)
add(pop(), s + 1.3); add(click(), s + 2.95, 3); add(buzz(), s + 3.05); add(glitch(), s + 3.05, .6)
s = S["hire"]
add(whoosh(0.35), s - 0.15, .6); add(impact(.8), s + .55); add(impact(.9), s + .85); add(pop(), s + 1.5); add(ding(), s + 2.5)
s = S["chat"]
add(whoosh(0.35), s - 0.15, .6); add(pop(), s + 1.2)
nchars = sum(len(x) for x in THINK) + 1
for i in range(nchars): add(click(), s + THINK_T0 + i / THINK_CPS, 0.9 + 0.2 * rng.random())
add(pop(), s + AI_T0); add(impact(1.0), s + AI_T0 + 1.6); add(glitch(), s + AI_T0 + 1.6, .5)
s = S["believe"]
add(whoosh(0.5), s - 0.25, .7); add(pop(), s + .6); add(ding(), s + 1.55)
s = S["nuance"]
add(glitch(), s, .6); add(pop(), s + .5); add(pop(), s + 2.1); add(pop(), s + 3.7); add(impact(.6), s + 3.7)
s = S["end"]
add(whoosh(0.35), s - 0.15, .6); add(impact(.8), s + 1.5); add(impact(1.1), s + 2.1); add(glitch(), s + 2.1, .7); add(pop(), s + 3.2)

# fade end
fe = int((TOTAL - 1.0) * SR); mix[fe:] *= np.linspace(1, 0, N - fe) ** 2
mix = np.tanh(mix * 1.1)
mix = mix / np.max(np.abs(mix)) * 0.89
st = np.stack([mix, mix], 1)
with wave.open("audio.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
print("audio", TOTAL)

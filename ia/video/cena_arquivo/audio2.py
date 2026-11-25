# Trilha do "Arquivo Secreto" (audio2.py da referência, agora genérico).
# Uso: python3 audio2.py <pasta>   (precisa de timeline.json, narration.wav e cenas.py com SFX() e, se quiser, MUTE())
# Gera audio2.wav (com voz) e audio2_sem_voz.wav. Tudo sintetizado aqui: pad em Lá menor, kick + hi-hat (112 BPM),
# ducking de 55% sob a voz, efeitos (impacto, glitch, whoosh, pop, clique, ding, buzz), soft clip e fade final.
import numpy as np, wave, sys, os, json, importlib.util
P = os.path.abspath(sys.argv[1])
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
SR = 44100
TL = json.load(open(os.path.join(P, 'timeline.json'))); S = {x['name']: x['start'] for x in TL['scenes']}; TOTAL = TL['total']; CL = TL['clips']
def c0(k): return CL[k]['start']
def c1(k): return CL[k]['start'] + CL[k]['dur']
spec = importlib.util.spec_from_file_location("cenas", os.path.join(P, "cenas.py")); CEN = importlib.util.module_from_spec(spec)
CEN.TL, CEN.MOUTH, CEN.c0, CEN.c1 = TL, [], c0, c1
spec.loader.exec_module(CEN)
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
mute_a, mute_b = CEN.MUTE(S, c0, c1) if hasattr(CEN, "MUTE") else (-9, -9)
while tt < TOTAL - 1.0:
    if not (mute_a - 0.1 <= tt < mute_b):
        madd(kick(), tt, 0.65)
        if k % 4 in (1, 3): madd(hat(), tt, 1.0)
        madd(hat(), tt + beat / 2, 0.7)
    tt += beat; k += 1
# narration + ducking
import wave as _w
with _w.open(os.path.join(P, "narration.wav")) as w_:
    nar = np.frombuffer(w_.readframes(w_.getnframes()), np.int16).astype(np.float64) / 32768
nar = np.pad(nar, (0, max(0, N - len(nar))))[:N]
e = np.abs(nar); win = int(0.15 * SR)
e = np.convolve(e, np.ones(win) / win, mode="same")
duck = 1 - 0.55 * np.clip(e / 0.05, 0, 1)
mix += mus * duck

SONS = {"impact": lambda: impact(1.0), "glitch": glitch, "whoosh": lambda: whoosh(0.35), "pop": pop, "click": click,
        "ding": ding, "buzz": buzz}
for som, tt_, g_ in CEN.SFX(S, c0, c1):
    add(SONS[som](), max(0.0, tt_), g_)

base_mix = mix.copy()
def master(m):
    m = m.copy(); fe = int((TOTAL - 0.8) * SR); m[fe:] *= np.linspace(1, 0, N - fe) ** 2
    m = np.tanh(m * 1.05); return m / np.max(np.abs(m)) * float(os.environ.get("PICO", 0.57))  # 0.57 ≈ -14 LUFS (checar.py: -16 a -12)
for nome, m in (("audio2.wav", master(base_mix + nar * 1.25)), ("audio2_sem_voz.wav", master(base_mix))):
    st = np.stack([m, m], 1)
    with wave.open(os.path.join(P, nome), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())
print("audio2", TOTAL)

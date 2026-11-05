import json, wave, sys, os, numpy as np
# Variações por vídeo (Diversidade de elementos, 05/11): MUS_TOM (semitons), MUS_BATIDA (s por tempo), MUS_PROG=menor, MUS_CHIP=1 (8-bit), MUS_SEM_PALMA=1
TOM = int(os.environ.get('MUS_TOM', 0)); CHIP = os.environ.get('MUS_CHIP') == '1'
TL=json.load(open(sys.argv[1]+"/timeline.json")); total=TL["total"]
cuts=[s["t0"] for s in TL["segmentos"]][1:]
durs=[c-p for p,c in zip([0]+cuts, cuts+[total])]
tmp=sys.argv[1]
# 2) trilha: pad I–V–vi–IV, baixo, bateria, pluck subindo e hit a cada troca de slide
SR = 48000; N = int(SR * total); L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(7)
def add(sig, t, g=1.0, pan=0.0):
    i = int(t * SR); sig = sig[: max(0, N - i)]
    if i < N and len(sig): L[i:i+len(sig)] += sig*g*(1-max(0, pan)); R[i:i+len(sig)] += sig*g*(1+min(0, pan))
tt = lambda d: np.arange(int(d*SR))/SR
hz = lambda m: 440*2**((m+TOM-69)/12)
def lp(x, a):
    y = np.empty_like(x); s = 0.0
    for i, v in enumerate(x): s += a*(v-s); y[i] = s
    return y
saw = lambda f, t: 2*((f*t) % 1)-1
def pad(ch, d):
    t = tt(d); s = sum((np.sign(np.sin(2*np.pi*hz(m+dt)*t))*.6 if CHIP else saw(hz(m+dt), t)) for m in ch for dt in (-.12, .12)); s = lp(s, .03 if CHIP else .06)/(len(ch)*2)
    return s*np.minimum(t/.05, 1)*np.minimum((d-t)/.05, 1)*.5
def kick():
    t = tt(.4); return np.sin(2*np.pi*np.cumsum(45+110*np.exp(-t*28))/SR)*np.exp(-t*7)*.9
def hat(d=.06):
    t = tt(d); n = np.diff(np.concatenate([[0], rng.standard_normal(len(t))])); return n*np.exp(-t*55)*.12
def clap():
    t = tt(.22); n = rng.standard_normal(len(t)); n = n-lp(n, .15); return n*np.exp(-t*18)*.28
def bell(m, d=1.2):
    t = tt(d); f = hz(m)
    return (np.sin(2*np.pi*f*t)+.4*np.sin(2*np.pi*f*2.01*t))*np.minimum(t/.004, 1)*np.exp(-t*2.6)*.3
def pluck(m, d=.4):
    t = tt(d); f = hz(m); s = np.sign(np.sin(2*np.pi*f*t))*.7 if CHIP else sum(np.sin(2*np.pi*f*n*t)/n**1.3 for n in range(1, 6))
    return s*np.minimum(t/.003, 1)*np.exp(-t*9)*.3
B = float(os.environ.get('MUS_BATIDA', .5)); prog = [[60,64,67,72],[55,59,62,67],[57,60,64,69],[53,57,60,65]]; roots = [36,31,33,29]
if os.environ.get('MUS_PROG') == 'menor': prog = [[57,60,64,69],[53,57,60,65],[48,52,55,60],[55,59,62,67]]; roots = [33,29,36,31]
for k in range(int(total//2)+1): add(pad(prog[k % 4], min(2.0, total-k*2)), k*2, .5)
for i in range(int(total/(B/2))):
    t0 = i*B/2; f = hz(roots[int(t0//2) % 4]); tb = tt(B/2*.9)
    add((np.sin(2*np.pi*f*tb)+.3*np.sin(4*np.pi*f*tb))*np.exp(-tb*5)*.3, t0)
    if i % 2: add(hat(), t0, 1, .3)
for i in range(int(total/B)):
    add(kick(), i*B, .9)
    if i % 2 and os.environ.get('MUS_SEM_PALMA') != '1': add(clap(), i*B)
penta = [0, 2, 4, 7, 9]
for i in range(int(total/(B/2))):
    if i % 3 == 0: step = i//3; add(pluck(72+penta[step % 5]+12*((step//5) % 2)), i*B/2, .35, (-.3 if i % 2 else .3))
t = 0.0
for d in durs[:-1]:
    t += d
    for j, m in enumerate((72, 76, 79)): add(bell(m, .9), t+j*.05, .25)
for j, m in enumerate((60, 64, 67, 72, 76, 79, 84)): add(bell(m, 1.5), total-durs[-1]+.06+j*.075, .35)
mix = np.tanh(np.stack([L, R], 1)*1.2); mix /= np.abs(mix).max()/0.89
e = int(.4*SR); mix[-e:] *= np.linspace(1, 0, e)[:, None]
with wave.open(f"{tmp}/trilha.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype("<i2").tobytes())


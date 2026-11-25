# Short vertical (1080x1920) a partir dos slides do carrossel + trilha original sintetizada.
# Uso: python3 short.py posts/AAAA-MM-DD-slug  -> posts/.../short.mp4
# Cada slide entra com corte seco e um leve zoom; a trilha (120 BPM, tom maior) bate um "hit" em cada troca.
import sys, os, glob, subprocess, wave
import numpy as np
from PIL import Image

post = sys.argv[1]
slides = sorted(glob.glob(os.path.join(post, "slides", "*.jpg")))
assert slides, "rode lista.js antes"
# tempo de tela: capa 2,5 s, itens 4,5 s (leitura), fechamento 3 s
durs = [2.5] + [4.5] * (len(slides) - 2) + [3.0]
total = sum(durs)
tmp = os.path.join(post, "_short"); os.makedirs(tmp, exist_ok=True)

# 1) quadros verticais: slide 1080x1350 centralizado num fundo da mesma cor do slide
for i, s in enumerate(slides):
    im = Image.open(s).convert("RGB"); bg = im.getpixel((6, 6))
    canvas = Image.new("RGB", (1080, 1920), bg); canvas.paste(im, (0, 285)); canvas.save(f"{tmp}/{i:02d}.png")

# 2) trilha: pad I–V–vi–IV, baixo, bateria, pluck subindo e hit a cada troca de slide
SR = 48000; N = int(SR * total); L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(7)
def add(sig, t, g=1.0, pan=0.0):
    i = int(t * SR); sig = sig[: max(0, N - i)]
    if i < N and len(sig): L[i:i+len(sig)] += sig*g*(1-max(0, pan)); R[i:i+len(sig)] += sig*g*(1+min(0, pan))
tt = lambda d: np.arange(int(d*SR))/SR
hz = lambda m: 440*2**((m-69)/12)
def lp(x, a):
    y = np.empty_like(x); s = 0.0
    for i, v in enumerate(x): s += a*(v-s); y[i] = s
    return y
saw = lambda f, t: 2*((f*t) % 1)-1
def pad(ch, d):
    t = tt(d); s = sum(saw(hz(m+dt), t) for m in ch for dt in (-.12, .12)); s = lp(s, .06)/(len(ch)*2)
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
    t = tt(d); f = hz(m); s = sum(np.sin(2*np.pi*f*n*t)/n**1.3 for n in range(1, 6))
    return s*np.minimum(t/.003, 1)*np.exp(-t*9)*.3
B = .5; prog = [[60,64,67,72],[55,59,62,67],[57,60,64,69],[53,57,60,65]]; roots = [36,31,33,29]
for k in range(int(total//2)+1): add(pad(prog[k % 4], min(2.0, total-k*2)), k*2, .5)
for i in range(int(total/(B/2))):
    t0 = i*B/2; f = hz(roots[int(t0//2) % 4]); tb = tt(B/2*.9)
    add((np.sin(2*np.pi*f*tb)+.3*np.sin(4*np.pi*f*tb))*np.exp(-tb*5)*.3, t0)
    if i % 2: add(hat(), t0, 1, .3)
for i in range(int(total/B)):
    add(kick(), i*B, .9)
    if i % 2: add(clap(), i*B)
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

# 3) vídeo: cada quadro com zoom lento 1.00→1.04, cortes secos, áudio normalizado a -14 LUFS
inputs, filt = [], []
for i, d in enumerate(durs):
    inputs += ["-i", f"{tmp}/{i:02d}.png"]   # 1 quadro de entrada; o zoompan gera os d*30 quadros (com -loop multiplicaria)
    fr = int(d*30)
    filt.append(f"[{i}:v]scale=1080:1920,zoompan=z='1+0.04*on/{fr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={fr}:s=1080x1920:fps=30,setsar=1[v{i}]")
filt.append("".join(f"[v{i}]" for i in range(len(durs))) + f"concat=n={len(durs)}:v=1:a=0[v]")
filt.append(f"[{len(durs)}:a]loudnorm=I=-14:TP=-1.5[a]")
cmd = ["ffmpeg", "-y", "-loglevel", "error", *inputs, "-i", f"{tmp}/trilha.wav", "-filter_complex", ";".join(filt),
       "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p",
       "-c:a", "aac", "-b:a", "192k", "-shortest", os.path.join(post, "short.mp4")]
subprocess.run(cmd, check=True)
print("ok", os.path.join(post, "short.mp4"), f"{total:.1f}s")

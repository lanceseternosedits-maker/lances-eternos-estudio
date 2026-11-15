# Motor do "Arquivo Secreto" (render2.py da referência, agora genérico e com o nosso mascote).
# As cenas de cada vídeo ficam em <pasta>/cenas.py (modelo: posts/2026-11-16-robo-inventou-uma-regra/arquivo/cenas.py).
# O cenas.py recebe prontos TL, MOUTH, c0(clip), c1(clip) e define:
#   FUN = {"cena": f(cv, t, gt) -> glitch}  (na ordem do plano.json)
#   SFX(S, c0, c1) -> [(som, t_absoluto, ganho)]   (usado pelo audio2.py)
#   MUDO = ("cena", início, fim)  (compasso sem batida no suspense; opcional)
# Uso (de qualquer pasta):
#   python3 render2.py <pasta> preview cena@t cena@t ...   -> <pasta>/folha.png (+ grande.png do 1º)
#   python3 render2.py <pasta> cena nome1 nome2 ...        -> <pasta>/v2_<nome>.mp4
#   python3 render2.py <pasta> tudo [-j 2]                 -> renderiza as cenas em N processos, concatena (-c copy),
#                                                             junta audio2.wav e reencoda a ~9 Mbit/s -> <pasta>/reel.mp4 e reel_sem_voz.mp4
import sys, os, json, subprocess, importlib.util
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image
from base import W, H, FPS, background, finish

P = os.path.abspath(sys.argv[1])
TL = json.load(open(os.path.join(P, "timeline.json")))
MOUTH = json.load(open(os.path.join(P, "mouth.json")))
SC = {s["name"]: s for s in TL["scenes"]}
CL = TL["clips"]


def c0(k): return CL[k]["start"]
def c1(k): return CL[k]["start"] + CL[k]["dur"]


def carregar():
    spec = importlib.util.spec_from_file_location("cenas", os.path.join(P, "cenas.py"))
    mod = importlib.util.module_from_spec(spec)
    mod.TL, mod.MOUTH, mod.c0, mod.c1 = TL, MOUTH, c0, c1
    spec.loader.exec_module(mod)
    return mod


CEN = carregar()


def frame(name, t):
    gt = SC[name]["start"] + t
    cv = background(gt)
    g = CEN.FUN[name](cv, t, gt)
    return finish(cv, gt, g)


def render_scene(name):
    dur = SC[name]["dur"]
    tmp = os.path.join(P, f"_v2_{name}.tmp.mp4"); final = os.path.join(P, f"v2_{name}.mp4")
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                          "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-crf", "18", "-preset", "veryfast",
                          "-pix_fmt", "yuv420p", tmp], stdin=subprocess.PIPE)
    for i in range(int(round(dur * FPS))):
        p.stdin.write(frame(name, i / FPS).tobytes())
    p.stdin.close()
    if p.wait() == 0: os.replace(tmp, final)
    else: raise SystemExit("ffmpeg falhou " + name)
    print("pronta", name, flush=True)


def tudo(n):
    nomes = [s["name"] for s in TL["scenes"]]
    lotes = [nomes[i::n] for i in range(n)]
    procs = [subprocess.Popen([sys.executable, os.path.abspath(__file__), P, "cena", *l]) for l in lotes if l]
    if any(p.wait() for p in procs): raise SystemExit("render de cena falhou")
    with open(os.path.join(P, "concat.txt"), "w") as f:
        for nm in nomes: f.write(f"file 'v2_{nm}.mp4'\n")
    sil = os.path.join(P, "_video.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", os.path.join(P, "concat.txt"),
                    "-c", "copy", sil], check=True)
    for wav, out in (("audio2.wav", "reel.mp4"), ("audio2_sem_voz.wav", "reel_sem_voz.mp4")):
        if os.path.exists(os.path.join(P, wav)):
            # a granulação muda todo quadro: em CRF 18 o MP4 passa de 200 MB; o final sai em ~9 Mbit/s (VBR), como o compor.py
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", sil, "-i", os.path.join(P, wav), "-map", "0:v", "-map", "1:a",
                            "-c:v", "libx264", "-preset", "medium", "-b:v", os.environ.get("VBR", "9M"), "-maxrate", "12M",
                            "-bufsize", "18M", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart",
                            os.path.join(P, out)], check=True)
            print("montado", out)


if __name__ == "__main__":
    cmd = sys.argv[2]
    if cmd == "preview":
        ims = []
        for arg in sys.argv[3:]:
            n, tt = arg.split("@")
            ims.append(Image.fromarray(frame(n, float(tt))))
        cols = min(6, len(ims)); rows = (len(ims) + cols - 1) // cols
        sheet = Image.new("RGB", (270 * cols, 480 * rows))
        for i, im in enumerate(ims): sheet.paste(im.resize((270, 480)), ((i % cols) * 270, (i // cols) * 480))
        sheet.save(os.path.join(P, "folha.png")); ims[0].save(os.path.join(P, "grande.png"))
    elif cmd == "cena":
        for n in sys.argv[3:]: render_scene(n)
    elif cmd == "tudo":
        tudo(int(sys.argv[sys.argv.index("-j") + 1]) if "-j" in sys.argv else 2)

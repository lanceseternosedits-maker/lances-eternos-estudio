# Transforma 1 imagem 9:16 por cena em clipe animado (movimento de câmera suave), para o compor.py.
# Uso: python3 anima_imagens.py pasta_post   (lê pasta/cenas/<cena>.jpg, pasta/out/timeline.json e o campo "mov" do roteiro)
# mov: punch (impacto no início), in, out, in_tr/in_br (zoom num canto), down (desce do topo), up, base (zoom ancorado embaixo)
import json, sys, os, subprocess
P = sys.argv[1]; T = json.load(open(f"{P}/out/timeline.json")); R = json.load(open(f"{P}/roteiro.json"))
mov = {s["cena"]: s.get("mov", "in") for s in R["segmentos"]}; os.makedirs(f"{P}/out/clipes", exist_ok=True)
FPS, W, H, BIG = 30, 1080, 1920, 4
for s in T["segmentos"]:
    n = int((s["fim"] - s["t0"] + 0.4) * FPS); m = mov[s["cena"]]
    e = f"(1-pow(1-on/{n - 1},3))"                      # ease-out
    z, x, y = {
        "punch": (f"1.28-0.2*(1-pow(1-min(on/12,1),3))-0.04*on/{n}", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),
        "in":    (f"1.0+0.12*{e}", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),
        "out":   (f"1.2-0.18*{e}", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),
        "in_tr": (f"1.0+0.16*{e}", f"(iw-iw/zoom)*{e}*0.85", f"(ih-ih/zoom)*0.25"),
        "in_br": (f"1.0+0.14*{e}", f"(iw-iw/zoom)*{e}*0.8", f"(ih-ih/zoom)*{e}*0.8"),
        "down":  ("1.18", "iw/2-(iw/zoom/2)", f"(ih-ih/zoom)*{e}"),
        "up":    ("1.18", "iw/2-(iw/zoom/2)", f"(ih-ih/zoom)*(1-{e})"),
        "base":  (f"1.28+0.06*{e}", "iw/2-(iw/zoom/2)", "ih-ih/zoom"),   # ancorado embaixo: sobe o personagem acima da legenda
    }[m]
    vf = (f"scale={W * BIG}:{H * BIG}:flags=lanczos,zoompan=z='{z}':x='{x}':y='{y}':d={n}:s={W}x{H}:fps={FPS},"
          f"unsharp=5:5:0.6,eq=contrast=1.04:saturation=1.08,format=yuv420p")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{P}/cenas/{s['cena']}.jpg", "-vf", vf, "-frames:v", str(n),
                    "-c:v", "libx264", "-crf", "16", "-preset", "fast", f"{P}/out/clipes/{s['cena']}.mp4"], check=True)
    print("ok", s["cena"], m, f"{n / FPS:.1f}s")

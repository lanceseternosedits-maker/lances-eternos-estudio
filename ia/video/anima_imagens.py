# Transforma 1 imagem 9:16 por cena em clipe animado (movimento de câmera suave), para o compor.py.
# Uso: python3 anima_imagens.py pasta_post   (lê pasta/cenas/<cena>.jpg, pasta/out/timeline.json e o campo "mov" do roteiro)
# planos: 2 (campo "planos" do roteiro ou PLANOS=2) = cada imagem vira plano aberto + plano fechado no personagem (foco_y: {cena: 0..1}).
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
    zp = lambda z, x, y, nn: f"zoompan=z='{z}':x='{x}':y='{y}':d={nn}:s={W}x{H}:fps={FPS}"
    pre, pos = f"scale={W * BIG}:{H * BIG}:flags=lanczos,", ",unsharp=5:5:0.6,eq=contrast=1.04:saturation=1.08,format=yuv420p,setsar=1"
    planos = int(os.environ.get("PLANOS", R.get("planos", 1)))
    if planos == 2 and n > 2 * FPS:
        # 2 planos por imagem (ritmo _aighostlab): o movimento escolhido + um plano fechado no personagem
        n1 = n // 2; n2 = n - n1; e1 = f"(1-pow(1-on/{n1 - 1},3))"; e2 = f"(1-pow(1-on/{n2 - 1},3))"
        z1 = z.replace(f"/{n - 1}", f"/{n1 - 1}").replace(f"on/{n}", f"on/{n1}")
        x1 = x.replace(f"/{n - 1}", f"/{n1 - 1}"); y1 = y.replace(f"/{n - 1}", f"/{n1 - 1}")
        cy = R.get("foco_y", {}).get(s["cena"], 0.55) if isinstance(R.get("foco_y"), dict) else 0.55
        z2, x2, y2 = f"1.42+0.06*{e2}", "iw/2-(iw/zoom/2)", f"max(0,min(ih-ih/zoom,ih*{cy}-(ih/zoom/2)))"
        fc = (f"[0:v]{pre}{zp(z1, x1, y1, n1)}{pos}[a];[1:v]{pre}{zp(z2, x2, y2, n2)}{pos}[b];[a][b]concat=n=2:v=1:a=0[v]")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{P}/cenas/{s['cena']}.jpg", "-i", f"{P}/cenas/{s['cena']}.jpg",
                        "-filter_complex", fc, "-map", "[v]", "-frames:v", str(n), "-c:v", "libx264", "-crf", "16", "-preset", "fast",
                        f"{P}/out/clipes/{s['cena']}.mp4"], check=True)
    else:
        vf = pre + zp(z, x, y, n) + pos
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{P}/cenas/{s['cena']}.jpg", "-vf", vf, "-frames:v", str(n),
                        "-c:v", "libx264", "-crf", "16", "-preset", "fast", f"{P}/out/clipes/{s['cena']}.mp4"], check=True)
    print("ok", s["cena"], m, f"{n / FPS:.1f}s")

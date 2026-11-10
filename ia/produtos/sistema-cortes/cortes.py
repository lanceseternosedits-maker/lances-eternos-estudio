#!/usr/bin/env python3
"""Sistema de Cortes (IA em 60s): acha os momentos mais altos de uma live (gritos e reações) e corta em vídeos verticais.
Uso:
  python3 cortes.py live.mp4                 -> lista os 5 melhores momentos (pra você aprovar)
  python3 cortes.py live.mp4 --cortar        -> corta os 5 em vertical 1080x1920 com zoom (pasta cortes/)
  python3 cortes.py live.mp4 --cortar --legenda live.srt   -> e queima a legenda (.srt do Whisper, por exemplo)
Opções: --n 5 (quantos cortes)  --antes 25 --depois 12 (segundos em volta do pico)  --espaco 90 (distância mínima entre cortes)
Precisa só do ffmpeg instalado. Corte só live de quem libera cortes (muitos streamers têm programa de cortes oficial).
"""
import argparse, os, re, subprocess, sys
p = argparse.ArgumentParser(); p.add_argument("video"); p.add_argument("--n", type=int, default=5); p.add_argument("--antes", type=float, default=25)
p.add_argument("--depois", type=float, default=12); p.add_argument("--espaco", type=float, default=90); p.add_argument("--cortar", action="store_true"); p.add_argument("--legenda")
a = p.parse_args()
def hms(s): s = int(s); return f"{s // 3600}:{s // 60 % 60:02d}:{s % 60:02d}"
# 1) volume a cada segundo (os gritos e as reações são os picos de volume da live)
r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", a.video, "-vn", "-af", "aresample=8000,asetnsamples=8000,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level", "-f", "null", "-"],
                   capture_output=True, text=True)
vol = [float(x) if x not in ("-inf", "inf") else -90 for x in re.findall(r"RMS_level=(-?[\d.]+|-inf)", r.stderr)]
if not vol: sys.exit("não consegui ler o áudio: confira se o ffmpeg está instalado e se o vídeo tem som")
# suaviza 3 s e compara com a média dos 2 minutos em volta (pico = mais alto que o normal daquele trecho)
sm = [sum(vol[max(0, i - 1):i + 2]) / len(vol[max(0, i - 1):i + 2]) for i in range(len(vol))]
base = [sum(sm[max(0, i - 60):i + 60]) / len(sm[max(0, i - 60):i + 60]) for i in range(len(sm))]
nota = sorted(range(len(sm)), key=lambda i: sm[i] - base[i], reverse=True)
picos = []
for i in nota:
    if all(abs(i - j) >= a.espaco for j in picos): picos.append(i)
    if len(picos) == a.n: break
picos.sort(); dur = len(vol)
print(f"{a.n} momentos pra aprovar (live de {hms(dur)}):")
for k, i in enumerate(picos, 1): print(f"  {k}) {hms(i)}  pico de +{sm[i] - base[i]:.0f} dB  · corte {hms(max(0, i - a.antes))} → {hms(min(dur, i + a.depois))}")
if not a.cortar: print("\nAprovou? Rode de novo com --cortar (e --legenda arquivo.srt se tiver)."); sys.exit()
# 2) corta em vertical: preenche 1080x1920 com o vídeo ampliado e desfocado atrás, o vídeo no meio com zoom lento
os.makedirs("cortes", exist_ok=True)
for k, i in enumerate(picos, 1):
    ini, d = max(0, i - a.antes), a.antes + a.depois
    vf = ("[0:v]split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20[f];"
          f"[b]scale=1080:-2,zoompan=z='min(1.15,1+on/{int(d * 30)}*0.15)':d=1:s=1080x608:fps=30[v];[f][v]overlay=0:(H-h)/2")
    if a.legenda: vf += f",subtitles={a.legenda}:force_style='Fontsize=16,Bold=1,Alignment=2,MarginV=60'"
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-ss", str(ini), "-t", str(d), "-i", a.video]
    if a.legenda: cmd[cmd.index("-ss"):cmd.index("-ss")] = ["-copyts"]
    subprocess.run(cmd + ["-filter_complex", vf, "-c:v", "libx264", "-crf", "20", "-c:a", "aac", "-b:a", "160k", f"cortes/corte_{k}.mp4"], check=True)
    print(f"cortes/corte_{k}.mp4 pronto")

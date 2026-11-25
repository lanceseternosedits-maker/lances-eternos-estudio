"""Checagem de qualidade do Reel, antes de postar (as mesmas regras que usamos no @iaem60s).

Uso:
  python3 scripts/checar.py roteiros/meu.json              # antes de renderizar (só o roteiro)
  python3 scripts/checar.py roteiros/meu.json saida/meu.mp4 # depois (roteiro + vídeo)

Regras: gancho curto, uma ideia por frase (até ~12 palavras), "Comenta PALAVRA" no meio e no fim,
fala até 3,0 palavras/s, até 35 s, 1080×1920, volume perto de -14 LUFS sem estourar.
A área segura, a legibilidade e o rosto do mascote você confere na folha de miniaturas (scripts/miniaturas.sh).
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

OK, AVISO, FALHA = "✅", "⚠️ ", "❌"


def palavras(txt: str) -> int:
    return len(re.findall(r"\w+", txt))


def checa_roteiro(r: dict) -> list[tuple[str, str, str]]:
    out = []
    segs = r.get("segmentos", [])
    gancho = segs[0]["fala"] if segs else ""
    pg = palavras(gancho.split(".")[0])
    out.append((OK if pg <= 12 else AVISO, "Gancho", f"1ª frase com {pg} palavras (ideal: até 12, com conflito, sem introdução)"))
    longas = [s["fala"] for s in segs for f in re.split(r"[.!?…]", s["fala"]) if palavras(f) > 14]
    out.append((OK if not longas else AVISO, "Frases curtas", "todas até ~14 palavras" if not longas else f"{len(longas)} frase(s) longa(s): corte"))
    p = (r.get("palavra") or "").upper()
    falas = [s["fala"].upper() for s in segs]
    meio = any(p and p in f for f in falas[1:-1])
    fim = bool(falas) and p and p in falas[-1]
    out.append((OK if p else FALHA, "Palavra do comentário", p or "falta \"palavra\" no roteiro"))
    out.append((OK if meio else AVISO, "CTA no meio", "\"Comenta PALAVRA\" aparece no meio" if meio else "ponha o \"Comenta PALAVRA\" também no meio (pega quem sai antes do fim)"))
    out.append((OK if fim else FALHA, "CTA no fim", "ok" if fim else "a última frase precisa ter \"Comenta PALAVRA\""))
    total = sum(palavras(s["fala"]) for s in segs)
    est = total / 2.6 + 0.15 * len(segs) + 1.4
    out.append((OK if est <= 35.5 else FALHA, "Tamanho", f"{total} palavras ≈ {est:.0f} s (teto 35 s)"))
    leg = r.get("legenda_post", "")
    linha1 = leg.upper().splitlines()[0] if leg.strip() else ""
    tem = bool(p) and p in linha1
    out.append((OK if tem else AVISO, "Legenda do post", "a 1ª linha já traz a palavra" if tem else "escreva \"legenda_post\" com a palavra na 1ª linha"))
    pergunta = leg.strip().endswith("?")
    out.append((OK if pergunta else AVISO, "Pergunta final", "a legenda termina com pergunta" if pergunta else "termine a legenda com uma pergunta fácil, sobre a vida da pessoa"))
    nums = [s for s in segs if s.get("numero") is not None]
    if nums:
        fonte = r.get("fonte_dos_numeros")
        out.append((OK if fonte else FALHA, "Fonte dos números", fonte or "todo número na tela precisa de fonte (\"fonte_dos_numeros\")"))
    return out


def checa_video(v: Path, r: dict, projeto: dict | None) -> list[tuple[str, str, str]]:
    out = []
    pr = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration",
                         "-of", "json", str(v)], capture_output=True, text=True, check=True)
    d = json.loads(pr.stdout)
    w, h, dur = d["streams"][0]["width"], d["streams"][0]["height"], float(d["format"]["duration"])
    out.append((OK if (w, h) == (1080, 1920) else FALHA, "Formato", f"{w}×{h} (precisa 1080×1920)"))
    out.append((OK if dur <= 35.5 else FALHA, "Duração", f"{dur:.1f} s (até 35 s; se passar, corte texto)"))
    if projeto and projeto.get("modo_voz") != "nenhuma":
        n = sum(palavras(s["fala"]) for s in r["segmentos"])
        out.append((OK if n / dur <= 3.0 else FALHA, "Velocidade da fala", f"{n / dur:.2f} palavras/s (máximo 3,0; nunca acelere a voz)"))
    vol = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(v), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    resumo = vol.stderr.rsplit("Summary:", 1)[-1]
    lufs = re.search(r"I:\s+(-?[\d.]+) LUFS", resumo)
    pico = re.search(r"Peak:\s+(-?[\d.]+) dBFS", resumo)
    if lufs:
        L, P = float(lufs.group(1)), float(pico.group(1)) if pico else -99
        out.append((OK if -16.5 <= L <= -11.5 and P <= -0.5 else AVISO, "Volume", f"{L:.1f} LUFS, pico {P:.1f} dB (alvo -14 LUFS, pico até -1 dB)"))
    else:
        out.append((AVISO, "Volume", "vídeo sem áudio"))
    return out


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    rot = Path(sys.argv[1])
    r = json.loads(rot.read_text(encoding="utf-8"))
    linhas = checa_roteiro(r)
    if len(sys.argv) > 2:
        proj = Path(__file__).resolve().parent.parent / "projetos" / f"{rot.stem}.json"
        linhas += checa_video(Path(sys.argv[2]), r, json.loads(proj.read_text(encoding="utf-8")) if proj.exists() else None)
    for s, n, txt in linhas:
        print(f"{s} {n}: {txt}")
    falhas = sum(1 for s, *_ in linhas if s == FALHA)
    print(f"\n{'Tudo certo para postar.' if not falhas else f'{falhas} falha(s): corrija antes de postar.'}")
    sys.exit(1 if falhas else 0)


if __name__ == "__main__":
    main()

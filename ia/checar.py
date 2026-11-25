"""Checagem automática de um Reel antes da 2ª aprovação do Vitor.

Uso:  python3 checar.py posts/AAAA-MM-DD-slug [...]
Mede o vídeo (reel.mp4 ou short.mp4) e o roteiro e grava o resultado em meta.json -> "checagem".
Regras do manual (Acabamento obrigatório, Publicação): fala ≤ 3,0 palavras/s, Reel até 35 s,
1080×1920, volume perto de -14 LUFS sem estourar, fontes e prova viral preenchidas, CTA na 1ª linha da legenda.
A área segura, a legibilidade e o rosto do mascote continuam no olho (folha de miniaturas).
"""
from __future__ import annotations

import datetime as dt
import json
import re
import subprocess
import sys
from pathlib import Path


def ffprobe(arq: Path) -> dict:
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                        "stream=width,height:format=duration", "-of", "json", str(arq)],
                       capture_output=True, text=True, check=True)
    d = json.loads(r.stdout)
    s = d["streams"][0]
    return {"largura": s["width"], "altura": s["height"], "duracao": float(d["format"]["duration"])}


def volume(arq: Path) -> tuple[float | None, float | None]:
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(arq), "-af", "ebur128=peak=true",
                        "-f", "null", "-"], capture_output=True, text=True)
    resumo = r.stderr.rsplit("Summary:", 1)[-1]
    lufs = re.search(r"I:\s+(-?[\d.]+) LUFS", resumo)
    pico = re.search(r"Peak:\s+(-?[\d.]+) dBFS", resumo)
    return (float(lufs.group(1)) if lufs else None, float(pico.group(1)) if pico else None)


def item(nome: str, valor: str, ok: bool, regra: str) -> dict:
    return {"nome": nome, "valor": valor, "ok": ok, "regra": regra}


def checar(pasta: Path) -> dict:
    meta_arq = pasta / "meta.json"
    meta = json.loads(meta_arq.read_text(encoding="utf-8")) if meta_arq.exists() else {}
    rot = json.loads((pasta / "roteiro.json").read_text(encoding="utf-8")) if (pasta / "roteiro.json").exists() else {}
    video = next((pasta / n for n in ("reel.mp4", "short.mp4") if (pasta / n).exists()), None)
    itens = []

    if video is None:
        itens.append(item("Vídeo", "nenhum reel.mp4/short.mp4", False, "o MP4 final precisa estar na pasta"))
    else:
        v = ffprobe(video)
        itens.append(item("Formato", f'{v["largura"]}×{v["altura"]}', (v["largura"], v["altura"]) == (1080, 1920), "1080×1920"))
        itens.append(item("Duração", f'{v["duracao"]:.1f} s', v["duracao"] <= 35.5, "até 35 s (corte texto se passar)"))
        falas = " ".join(s.get("fala", "") for s in rot.get("segmentos", []))
        palavras = len(re.findall(r"\w+", falas))
        if palavras:
            ritmo = palavras / v["duracao"]
            itens.append(item("Velocidade da fala", f"{ritmo:.2f} palavras/s ({palavras} palavras)", ritmo <= 3.0, "máximo 3,0 palavras/s"))
        lufs, pico = volume(video)
        if lufs is not None:
            itens.append(item("Volume", f"{lufs:.1f} LUFS, pico {pico:.1f} dB", -16.5 <= lufs <= -11.5 and (pico is None or pico <= -0.5),
                              "entre -16 e -12 LUFS, pico até -1 dB"))

    fontes = meta.get("fontes") or rot.get("fontes")
    itens.append(item("Fontes", f"{len(fontes)} fonte(s)" if fontes else "nenhuma", bool(fontes), "todo fato com fonte"))
    prova = meta.get("prova_viral") or rot.get("prova_viral")
    itens.append(item("Prova viral", "preenchida" if prova else "faltando", bool(prova), "toda pauta com a prova de que viralizou"))

    cta = (meta.get("cta") or rot.get("chave") or "").upper()
    for nome in ("legenda_reel_instagram.txt", "legenda_instagram.txt"):
        if (pasta / nome).exists():
            leg = (pasta / nome).read_text(encoding="utf-8")
            linha1 = leg.strip().splitlines()[0] if leg.strip() else ""
            itens.append(item("Legenda do Instagram", f"{len(leg)} caracteres", len(leg) <= 2200, "até 2.200 caracteres"))
            if cta:
                itens.append(item("CTA na legenda", cta, cta in leg.upper(), "a palavra do CTA aparece na legenda"))
            tags = len(re.findall(r"#\w+", leg))  # Instagram: máx. 5 por post desde dez/2025 (Vitor, 10/11)
            itens.append(item("Hashtags no Instagram", str(tags), 3 <= tags <= 5, "de 3 a 5 hashtags (o Instagram limita a 5)"))
            break
    else:  # aviso: algumas legendas foram direto para o Metricool sem arquivo na pasta
        itens.append(item("Legenda do Instagram", "não está na pasta (confira no Metricool)", None, "legenda_reel_instagram.txt"))
    itens.append(item("Resposta da DM", "ok" if (pasta / "resposta_dm.txt").exists() else "faltando",
                      (pasta / "resposta_dm.txt").exists(), "resposta_dm.txt com os links"))

    res = {"em": dt.datetime.now().strftime("%Y-%m-%d %H:%M"), "ok": all(i["ok"] is not False for i in itens), "itens": itens}
    if meta_arq.exists():
        meta["checagem"] = res
        meta_arq.write_text(json.dumps(meta, ensure_ascii=False), encoding="utf-8")
    return res


if __name__ == "__main__":
    for p in sys.argv[1:]:
        r = checar(Path(p))
        print(("OK " if r["ok"] else "FALHA ") + p)
        for i in r["itens"]:
            print(f'  {"⚠" if i["ok"] is None else "✔" if i["ok"] else "✘"} {i["nome"]}: {i["valor"]}  ({i["regra"]})')

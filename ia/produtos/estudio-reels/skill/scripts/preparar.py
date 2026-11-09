"""Prepara um roteiro para o render: tempos de cada frase e de cada palavra, voz (opcional) e trilha.

Uso (de dentro da pasta da skill):
  python3 scripts/preparar.py roteiros/meu.json                       # sem voz: só legenda e trilha
  python3 scripts/preparar.py roteiros/meu.json --voz minha --gravacoes gravacoes/meu/
  GEMINI_API_KEY=sua_chave python3 scripts/preparar.py roteiros/meu.json --voz gemini

Saída: projetos/<nome>.json (é o que o Remotion lê com --props), public/voz/<nome>.wav e public/trilha/<nome>.wav.

Voz:
  nenhuma  (padrão) o ritmo vem do número de palavras (2,6 palavras/s), sem custo.
  minha    uma gravação por frase do roteiro (01.m4a, 02.m4a...; qualquer formato que o ffmpeg leia),
           na mesma ordem dos segmentos. O silêncio do começo e do fim de cada arquivo é cortado.
  gemini   voz do Gemini (Google) com a SUA chave na variável GEMINI_API_KEY. Custa centavos de dólar
           por vídeo na conta do Google; a chave nunca é gravada em arquivo nenhum.
"""
from __future__ import annotations

import argparse
import base64
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
import trilha  # noqa: E402

RITMO = 2.6          # palavras por segundo quando não há voz (abaixo do teto de 3,0)
INICIO, PAUSA, CAUDA = 0.25, 0.15, 1.2


def silabas(p: str) -> int:
    return max(1, len(re.findall(r"[aeiouáéíóúâêôãõày]+", p.lower())))


def duracao(arq: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(arq)],
                       capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


def limpa(entrada: Path, saida: Path) -> None:
    """Corta o silêncio do começo e do fim e padroniza em wav 44,1 kHz mono."""
    corte = "silenceremove=start_periods=1:start_threshold=-45dB"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(entrada), "-af",
                    f"{corte},areverse,{corte},areverse", "-ar", "44100", "-ac", "1", str(saida)], check=True)


def voz_gemini(texto: str, saida: Path, voz: str, estilo: str) -> None:
    chave = os.environ.get("GEMINI_API_KEY")
    if not chave:
        sys.exit("Falta a variável GEMINI_API_KEY (a sua chave do Google AI Studio). Ou use --voz nenhuma / --voz minha.")
    corpo = {"contents": [{"parts": [{"text": f"{estilo}. Leia só o texto entre aspas: \"{texto}\""}]}],
             "generationConfig": {"responseModalities": ["AUDIO"],
                                  "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voz}}}}}
    modelo = os.environ.get("GEMINI_TTS_MODELO", "gemini-2.5-flash-preview-tts")
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{modelo}:generateContent",
                                 data=json.dumps(corpo).encode(), headers={"x-goog-api-key": chave, "Content-Type": "application/json"})
    import time
    for tentativa in range(4):
        try:
            resp = json.load(urllib.request.urlopen(req, timeout=300))
            break
        except urllib.error.HTTPError as e:
            if e.code != 429 or tentativa == 3:
                sys.exit(f"O Gemini recusou a voz (erro {e.code}). Confira a chave e o limite da sua conta.")
            time.sleep(20 * (tentativa + 1))  # 429 = limite por minuto: espera e tenta de novo
    pcm = base64.b64decode(resp["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
    bruto = saida.with_suffix(".pcm")
    bruto.write_bytes(pcm)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", str(bruto),
                    str(saida.with_suffix(".tmp.wav"))], check=True)
    bruto.unlink()
    limpa(saida.with_suffix(".tmp.wav"), saida)
    saida.with_suffix(".tmp.wav").unlink()


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("roteiro")
    ap.add_argument("--voz", choices=["nenhuma", "minha", "gemini"], default="nenhuma")
    ap.add_argument("--gravacoes", help="pasta com uma gravação por frase (só com --voz minha)")
    a = ap.parse_args()

    rot_arq = Path(a.roteiro)
    rot = json.loads(rot_arq.read_text(encoding="utf-8"))
    nome = rot_arq.stem
    segs = rot["segmentos"]
    (RAIZ / "public" / "voz").mkdir(parents=True, exist_ok=True)
    (RAIZ / "projetos").mkdir(exist_ok=True)
    tmp = RAIZ / "projetos" / f".{nome}_frases"
    tmp.mkdir(exist_ok=True)

    arquivos: list[Path | None] = [None] * len(segs)
    if a.voz == "minha":
        if not a.gravacoes:
            sys.exit("Com --voz minha, diga a pasta das gravações: --gravacoes gravacoes/meu/")
        grav = sorted(p for p in Path(a.gravacoes).iterdir() if p.is_file() and not p.name.startswith("."))
        if len(grav) != len(segs):
            sys.exit(f"O roteiro tem {len(segs)} frases e a pasta tem {len(grav)} gravações. Grave uma por frase, na ordem.")
        for k, g in enumerate(grav):
            arquivos[k] = tmp / f"{k:02d}.wav"
            limpa(g, arquivos[k])
    elif a.voz == "gemini":
        voz, estilo = rot.get("voz", "Puck"), rot.get("estilo_voz", "Diga em português do Brasil, com energia de criador de Reels, ritmo natural")
        for k, s in enumerate(segs):
            arquivos[k] = tmp / f"{k:02d}.wav"
            if not arquivos[k].exists():
                print(f"voz {k + 1}/{len(segs)}", flush=True)
                voz_gemini(s["fala"], arquivos[k], voz, estilo)

    t, tempos = INICIO, []
    for k, s in enumerate(segs):
        palavras = (s.get("legenda") or s["fala"]).split()
        d = duracao(arquivos[k]) if arquivos[k] else max(1.4, len(s["fala"].split()) / RITMO)
        pesos = [silabas(p) + 0.5 for p in palavras]
        x, ws = t, []
        for p, q in zip(palavras, pesos):
            e = d * q / sum(pesos)
            ws.append({"w": p, "t0": round(x, 3), "t1": round(x + e, 3)})
            x += e
        tempos.append({"t0": round(t, 3), "t1": round(t + d, 3), "palavras": ws})
        t += d + PAUSA
    total = round(t - PAUSA + CAUDA, 3)
    tempos[0]["t0"] = 0.0
    for atual, prox in zip(tempos, tempos[1:]):
        atual["fim"] = prox["t0"]
    tempos[-1]["fim"] = total

    audio = {}
    if any(arquivos):
        filtro = "".join(f"[{k}:a]adelay={int(tp['t0'] * 1000) if k else int(INICIO * 1000)}:all=1[a{k}];" for k, tp in enumerate(tempos))
        filtro += "".join(f"[a{k}]" for k in range(len(segs))) + f"amix=inputs={len(segs)}:normalize=0,apad=whole_dur={total}[o]"
        entradas = sum((["-i", str(f)] for f in arquivos), [])
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *entradas, "-filter_complex", filtro, "-map", "[o]",
                        "-ar", "44100", "-ac", "1", str(RAIZ / "public" / "voz" / f"{nome}.wav")], check=True)
        audio["voz"] = f"voz/{nome}.wav"
    trilha.gerar(RAIZ / "public" / "trilha" / f"{nome}.wav", total, [tp["t0"] for tp in tempos], rot.get("trilha", {}))
    audio["trilha"] = f"trilha/{nome}.wav"
    audio["volume_trilha"] = 0.22 if "voz" in audio else 0.6

    palavras = sum(len(s["fala"].split()) for s in segs)
    projeto = {**rot, "nome": nome, "fps": 30, "tempos": tempos, "total": total, "audio": audio, "modo_voz": a.voz}
    (RAIZ / "projetos" / f"{nome}.json").write_text(json.dumps(projeto, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"pronto: projetos/{nome}.json · {total:.1f} s · {palavras} palavras · {palavras / total:.2f} palavras/s · voz: {a.voz}")
    if total > 35.5:
        print("ATENÇÃO: passou de 35 s. Corte texto do roteiro (nunca acelere a fala).")


if __name__ == "__main__":
    main()

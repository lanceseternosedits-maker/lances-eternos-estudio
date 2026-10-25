"""
Lances Eternos - Estúdio de histórias (roda na nuvem, no GitHub Actions)
------------------------------------------------------------------------
Lê os roteiros em roteiros/*.json, busca cenas de futebol com licença livre no Pexels,
monta cada vídeo vertical no ritmo de uma música da pasta musicas/ com o texto da
história na tela e registra o resultado em fila.json para o agente de Publicação.

Uso:
    python estudio.py                 -> renderiza os vídeos de roteiros que ainda não estão na fila
    python estudio.py --url-base URL  -> grava em fila.json a URL pública de cada vídeo (URL + nome do arquivo)

Variáveis de ambiente:
    PIXABAY_API_KEY chave gratuita do Pixabay (https://pixabay.com/api/docs/)
    PEXELS_API_KEY  alternativa: chave do Pexels. Sem nenhuma das duas, usa os vídeos da pasta stock/.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import random
import tempfile
import urllib.parse
import urllib.request
from pathlib import Path

import editor as ed

RAIZ = Path(__file__).resolve().parent
PASTA_ROTEIROS = RAIZ / "roteiros"
PASTA_STOCK = RAIZ / "stock"
PASTA_CACHE = RAIZ / ".cache_cenas"
PASTA_SAIDA = RAIZ / "saida"
ARQ_FILA = RAIZ / "fila.json"
ARQ_USADOS = RAIZ / "pexels_usados.json"

CFG_ESTUDIO = {
    "largura": 1080, "altura": 1920, "fps": 30,
    "tamanho_texto": 64, "caracteres_por_linha": 22,
    "segundos_min_cena": 2.6, "segundos_max_cena": 5.5,
    "velocidade_cena": 0.8,     # 0.8 = levemente em câmera lenta
    "granulado": 8, "assinatura": "LANCES ETERNOS",
    "preset": "veryfast", "crf": 21,
}


# --------------------------------------------------------------------------- utilidades

def ler_json(p: Path, padrao):
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return padrao


def gravar_json(p: Path, dados) -> None:
    p.write_text(json.dumps(dados, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def achar_fonte() -> str:
    for f in [str(RAIZ / "fontes" / "Lora-Italic.ttf"),
              "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf",
              "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
              "C:/Windows/Fonts/georgiai.ttf"]:
        if Path(f).exists():
            return f
    raise SystemExit("Nenhuma fonte encontrada. Instale fonts-dejavu-core.")


def achar_fonte_sans() -> str:
    for f in ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "C:/Windows/Fonts/arialbd.ttf"]:
        if Path(f).exists():
            return f
    return achar_fonte()


# --------------------------------------------------------------------------- cenas (Pexels)

def buscar_pexels(busca: str, chave: str, usados: set[int]) -> tuple[int, str] | None:
    url = "https://api.pexels.com/videos/search?" + urllib.parse.urlencode(
        {"query": busca, "orientation": "portrait", "per_page": 20, "size": "medium"})
    req = urllib.request.Request(url, headers={"Authorization": chave, "User-Agent": "lances-eternos-estudio"})
    with urllib.request.urlopen(req, timeout=30) as r:
        dados = json.load(r)
    opcoes = []
    for v in dados.get("videos", []):
        if v.get("duration", 0) < 4:
            continue
        arquivos = [f for f in v.get("video_files", []) if f.get("file_type") == "video/mp4"
                    and (f.get("height") or 0) >= 1280 and (f.get("width") or 0) < (f.get("height") or 0)]
        if not arquivos:
            continue
        melhor = min(arquivos, key=lambda f: abs((f.get("height") or 0) - 1920))
        opcoes.append((v["id"], melhor["link"]))
    novos = [o for o in opcoes if o[0] not in usados]
    escolha = (novos or opcoes)
    return random.choice(escolha[:8]) if escolha else None


def buscar_pixabay(busca: str, chave: str, usados: set[int]) -> tuple[int, str] | None:
    url = "https://pixabay.com/api/videos/?" + urllib.parse.urlencode(
        {"key": chave, "q": busca, "per_page": 30, "safesearch": "true", "order": "popular"})
    req = urllib.request.Request(url, headers={"User-Agent": "lances-eternos-estudio"})
    with urllib.request.urlopen(req, timeout=30) as r:
        dados = json.load(r)
    opcoes = []
    proibidas = ("green screen", "chroma", "animation", "cartoon", "3d", "baseball", "american football", "rugby",
                 "table soccer", "foosball", "kicker", "table football", "subbuteo", "toy", "game", "miniature", "figure")
    for v in dados.get("hits", []):
        if v.get("duration", 0) < 4:
            continue
        if any(p in (v.get("tags") or "").lower() for p in proibidas):
            continue
        tamanhos = [t for t in (v.get("videos") or {}).values() if t.get("url") and (t.get("height") or 0) >= 720]
        if not tamanhos:
            continue
        # prefere vertical; senão o maior (recortado para 9:16 na montagem)
        vertical = [t for t in tamanhos if t["height"] > t["width"]]
        melhor = max(vertical or tamanhos, key=lambda t: t["height"])
        opcoes.append((int(v["id"]) + 10**9, melhor["url"], bool(vertical)))
    novos = [o for o in opcoes if o[0] not in usados]
    escolha = novos or opcoes
    escolha.sort(key=lambda o: not o[2])  # verticais primeiro
    if not escolha:
        return None
    o = random.choice(escolha[:8])
    return o[0], o[1]


def baixar(url: str, destino: Path) -> Path:
    if destino.exists() and destino.stat().st_size > 0:
        return destino
    req = urllib.request.Request(url, headers={"User-Agent": "lances-eternos-estudio"})
    with urllib.request.urlopen(req, timeout=120) as r, open(destino, "wb") as f:
        while True:
            bloco = r.read(1 << 20)
            if not bloco:
                break
            f.write(bloco)
    return destino


def obter_cena(busca: str, usados: set[int]) -> Path:
    PASTA_CACHE.mkdir(exist_ok=True)
    fontes = []
    if os.environ.get("PIXABAY_API_KEY", "").strip():
        fontes.append(("pixabay", buscar_pixabay, os.environ["PIXABAY_API_KEY"].strip()))
    if os.environ.get("PEXELS_API_KEY", "").strip():
        fontes.append(("pexels", buscar_pexels, os.environ["PEXELS_API_KEY"].strip()))
    for nome, buscar, chave in fontes:
        termo_base = busca if any(k in busca.lower() for k in ("soccer", "football", "futebol")) else f"soccer {busca}"
        for termo in [termo_base, "soccer stadium", "soccer ball"]:
            try:
                achado = buscar(termo, chave, usados)
            except Exception as e:  # noqa: BLE001
                ed.log(f"  aviso: busca no {nome} falhou para '{termo}': {e}")
                achado = None
            if achado:
                vid, link = achado
                usados.add(vid)
                return baixar(link, PASTA_CACHE / f"{nome}_{vid}.mp4")
    locais = sorted(p for p in PASTA_STOCK.glob("*") if p.suffix.lower() in ed.EXT_VIDEO) if PASTA_STOCK.exists() else []
    if not locais:
        raise RuntimeError("Sem PEXELS_API_KEY e sem vídeos em stock/.")
    return random.choice(locais)


# --------------------------------------------------------------------------- montagem

def quebrar(texto: str, largura: int) -> str:
    palavras, linhas, atual = texto.split(), [], ""
    for p in palavras:
        if len(atual) + len(p) + 1 > largura and atual:
            linhas.append(atual)
            atual = p
        else:
            atual = f"{atual} {p}".strip()
    if atual:
        linhas.append(atual)
    return "\n".join(linhas[:5])


def duracao_cena(texto: str, periodo: float) -> float:
    c = CFG_ESTUDIO
    alvo = min(c["segundos_max_cena"], max(c["segundos_min_cena"], 1.6 + 0.06 * len(texto)))
    unidade = periodo * 2
    return max(unidade, round(alvo / unidade) * unidade)


def render_cena(cfg: dict, clipe: Path, texto: str, dur: float, saida: Path, tmp: Path, i: int) -> None:
    c = CFG_ESTUDIO
    vel = c["velocidade_cena"]
    total = ed.duracao(cfg, clipe)
    fonte_dur = dur * vel
    ini = random.uniform(0, max(0.0, total - fonte_dur - 0.2)) if total > fonte_dur + 0.5 else 0.0
    fator = dur / min(fonte_dur, max(0.5, total - ini))
    arq_txt = tmp / f"txt{i}.txt"
    arq_txt.write_text(quebrar(texto, c["caracteres_por_linha"]), encoding="utf-8")
    fi, fo = 0.35, max(0.6, dur - 0.45)
    alpha = f"if(lt(t,{fi}),0,if(lt(t,{fi + 0.5}),(t-{fi})/0.5,if(lt(t,{fo}),1,if(lt(t,{dur}),({dur}-t)/{dur - fo:.3f},0))))"
    W, H = c["largura"], c["altura"]
    # preenche a tela 9:16 recortando o centro (cenas horizontais viram verticais sem faixas)
    vf = (f"[0:v]scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},"
          f"unsharp=5:5:0.5,setsar=1,setpts={fator:.5f}*PTS,fps={c['fps']},"
          f"drawtext=fontfile={ed.esc_filtro(achar_fonte())}:textfile={ed.esc_filtro(arq_txt)}"
          f":fontsize={c['tamanho_texto']}:fontcolor=white:line_spacing=18@ALINHAR@"
          f":x=(w-text_w)/2:y=(h-text_h)/2:shadowcolor=black@0.6:shadowx=0:shadowy=4"
          f":box=1:boxcolor=black@0.28:boxborderw=28"
          f":alpha='{alpha}'[v]")
    base = [cfg["ffmpeg"], "-y", "-v", "error", "-ss", f"{ini:.3f}", "-i", str(clipe),
            "-filter_complex", None, "-map", "[v]", "-an", "-t", f"{dur:.3f}",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "14", "-pix_fmt", "yuv420p", str(saida)]
    idx = base.index(None)
    for alinhar in (":text_align=C", ""):
        base[idx] = vf.replace("@ALINHAR@", alinhar)
        try:
            ed.rodar(base)
            return
        except RuntimeError:
            if not alinhar:
                raise


def montar_historia(cfg: dict, video: dict, destino: Path, usados: set[int]) -> dict:
    musica = ed.escolher_musica()
    batidas, periodo, energia, fps_env = ed.analisar_musica(cfg, musica)
    ed.log(f"  música: {musica.name} (~{60 / periodo:.0f} bpm)")
    cenas = video.get("cenas") or []
    if not cenas:
        raise RuntimeError("Roteiro sem cenas.")
    duracoes = [duracao_cena(c.get("texto", ""), periodo) for c in cenas]
    total = sum(duracoes)
    inicio_musica = ed.melhor_inicio_musica(batidas, energia, fps_env, total)
    c = CFG_ESTUDIO
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        partes = []
        for i, (cena, dur) in enumerate(zip(cenas, duracoes)):
            clipe = obter_cena(cena.get("busca") or "soccer stadium night", usados)
            p = tmp / f"c{i}.mp4"
            render_cena(cfg, clipe, cena.get("texto", ""), dur, p, tmp, i)
            partes.append(p)
            ed.log(f"  cena {i + 1}/{len(cenas)} ok ({dur:.1f}s)")
        lista = tmp / "lista.txt"
        lista.write_text("".join(f"file '{p.as_posix()}'\n" for p in partes), encoding="utf-8")
        junto = tmp / "junto.mp4"
        ed.rodar([cfg["ffmpeg"], "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(lista), "-c", "copy", str(junto)])
        vf = ("eq=contrast=1.06:saturation=0.68:brightness=-0.03:gamma=0.97,"
              "colorbalance=rs=-0.05:bs=0.07:rm=-0.03:bm=0.05:bh=0.03,vignette=PI/4.5")
        if c["granulado"]:
            vf += f",noise=alls={c['granulado']}:allf=t+u"
        if c["assinatura"]:
            vf += (f",drawtext=fontfile={ed.esc_filtro(achar_fonte_sans())}:text='{c['assinatura']}'"
                   f":fontsize=26:fontcolor=white@0.55:x=(w-text_w)/2:y=h*0.9")
        vf += f",fade=t=in:d=0.4,fade=t=out:st={max(0, total - 0.7):.2f}:d=0.7"
        af = f"afade=t=in:d=0.3,afade=t=out:st={max(0, total - 1.8):.2f}:d=1.8"
        ed.rodar([cfg["ffmpeg"], "-y", "-v", "error", "-i", str(junto), "-ss", f"{inicio_musica:.3f}", "-i", str(musica),
                  "-filter_complex", f"[0:v]{vf}[v];[1:a]{af}[a]", "-map", "[v]", "-map", "[a]", "-t", f"{total:.3f}",
                  "-c:v", "libx264", "-preset", c["preset"], "-crf", str(c["crf"]), "-profile:v", "high",
                  "-pix_fmt", "yuv420p", "-r", str(c["fps"]), "-maxrate", "10M", "-bufsize", "20M",
                  "-c:a", "aac", "-b:a", "192k",
                  "-movflags", "+faststart", str(destino)])
    return {"musica": musica.name, "duracao": round(total, 2)}


def legenda_de(video: dict) -> str:
    tags = []
    for t in list(video.get("hashtags", [])) + ["#futebol", "#edit", "#lanceseternos", "#futebolarte"]:
        t = t if t.startswith("#") else "#" + t
        if t.lower() not in [x.lower() for x in tags]:
            tags.append(t)
    base = (video.get("legenda") or "Alguns lances o tempo não apaga.").strip()
    return f"{base}\n\n👇 Qual craque você quer ver no próximo edit?\n\n" + " ".join(tags[:10])


# --------------------------------------------------------------------------- fluxo

def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url-base", default="", help="URL pública onde os vídeos ficam (termina com /)")
    ap.add_argument("--max", type=int, default=6, help="máximo de vídeos por execução")
    args = ap.parse_args()

    cfg = ed.carregar_config()
    ed.verificar_ffmpeg(cfg)
    PASTA_SAIDA.mkdir(exist_ok=True)
    (RAIZ / "musicas").mkdir(exist_ok=True)

    fila = ler_json(ARQ_FILA, {"videos": []})
    feitos = {v["id"] for v in fila["videos"]}
    usados = set(ler_json(ARQ_USADOS, []))
    novos = 0
    for rot in sorted(PASTA_ROTEIROS.glob("*.json")):
        dados = ler_json(rot, {})
        for video in dados.get("videos", []):
            vid = video.get("id")
            if not vid or vid in feitos or novos >= args.max:
                continue
            nome = f"{ed.slug(vid)}_{ed.slug(video.get('jogador', 'historia'))}.mp4"
            destino = PASTA_SAIDA / nome
            ed.log(f"Renderizando {vid} - {video.get('jogador', '')}")
            try:
                info = montar_historia(cfg, video, destino, usados)
            except Exception as e:  # noqa: BLE001
                ed.log(f"  ERRO em {vid}: {e}")
                continue
            fila["videos"].append({
                "id": vid, "data": dados.get("data"), "jogador": video.get("jogador"),
                "arquivo": nome, "url": (args.url_base + nome) if args.url_base else "",
                "legenda": legenda_de(video), "duracao": info["duracao"], "musica": info["musica"],
                "renderizado_em": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
                "status": "pronto",
            })
            feitos.add(vid)
            novos += 1
            ed.log(f"  OK -> {nome} ({info['duracao']}s)")
    gravar_json(ARQ_FILA, fila)
    gravar_json(ARQ_USADOS, sorted(usados)[-500:])
    ed.log(f"Concluído: {novos} vídeo(s) novo(s).")


if __name__ == "__main__":
    main()

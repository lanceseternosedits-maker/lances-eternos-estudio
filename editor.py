"""
Lances Eternos - Departamento de Edição
---------------------------------------
Pega os vídeos de entrada/, encontra o lance, corta no ritmo da música,
gera o vídeo vertical 9:16 com slow-mo, color grade frio e granulado,
e escreve a legenda + hashtags em saida/.

Uso:
    python editor.py            -> processa o que estiver em entrada/ e termina
    python editor.py --vigiar   -> fica rodando e processa cada vídeo novo que chegar
"""
from __future__ import annotations

import argparse
import datetime as dt
import difflib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import unicodedata
from pathlib import Path

import numpy as np

RAIZ = Path(__file__).resolve().parent
PASTA_ENTRADA = RAIZ / "entrada"
PASTA_MUSICAS = RAIZ / "musicas"
PASTA_SAIDA = RAIZ / "saida"
PASTA_PROCESSADOS = PASTA_ENTRADA / "processados"
PASTA_ERROS = PASTA_ENTRADA / "com_erro"
ARQ_CONFIG = RAIZ / "config.json"
ARQ_HISTORICO = RAIZ / "historico_musicas.json"
ARQ_LOG = RAIZ / "log.txt"

EXT_VIDEO = {".mp4", ".mov", ".mkv", ".webm", ".m4v", ".avi"}
EXT_AUDIO = {".mp3", ".wav", ".m4a", ".aac", ".flac", ".ogg"}

CONFIG_PADRAO = {
    "pasta_saida": "",
    "ffmpeg": "ffmpeg",
    "ffprobe": "ffprobe",
    "largura": 1080,
    "altura": 1920,
    "fps": 30,
    "pasta_pauta": "",
    "compilacao_a_partir_de_segundos": 90,
    "lances_por_compilacao": 4,
    "separacao_minima_lances": 10.0,
    "segundos_antes_do_lance": 6.0,
    "segundos_depois_do_lance": 2.0,
    "janela_busca_segundos": 20.0,
    "slowmo_velocidade": 0.5,
    "zoom_no_lance": 1.18,
    "batidas_por_corte": 4,
    "texto_na_tela": True,
    "fonte_texto": "C:/Windows/Fonts/georgiai.ttf",
    "tamanho_texto": 58,
    "granulado": 7,
    "nitidez": 0.6,
    "preset": "veryfast",
    "crf": 17,
    "hashtags_fixas": ["#futebol", "#edit", "#lanceseternos", "#football", "#futebolarte"],
}


# --------------------------------------------------------------------------- utilidades

def log(msg: str) -> None:
    linha = f"[{dt.datetime.now():%Y-%m-%d %H:%M:%S}] {msg}"
    print(linha, flush=True)
    try:
        with open(ARQ_LOG, "a", encoding="utf-8") as f:
            f.write(linha + "\n")
    except OSError:
        pass


def carregar_config() -> dict:
    cfg = dict(CONFIG_PADRAO)
    if ARQ_CONFIG.exists():
        try:
            cfg.update(json.loads(ARQ_CONFIG.read_text(encoding="utf-8")))
        except json.JSONDecodeError as e:
            log(f"AVISO: config.json com erro ({e}); usando padrões.")
    else:
        ARQ_CONFIG.write_text(json.dumps(CONFIG_PADRAO, indent=2, ensure_ascii=False), encoding="utf-8")
    if not Path(cfg["fonte_texto"]).exists():
        for alt in ["C:/Windows/Fonts/georgiai.ttf", "C:/Windows/Fonts/timesi.ttf",
                    "C:/Windows/Fonts/arial.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf",
                    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]:
            if Path(alt).exists():
                cfg["fonte_texto"] = alt
                break
    return cfg


def rodar(cmd: list[str]) -> subprocess.CompletedProcess:
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        raise RuntimeError(f"Comando falhou ({cmd[0]}):\n{r.stderr[-1500:]}")
    return r


def normalizar(txt: str) -> str:
    txt = unicodedata.normalize("NFKD", txt).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", txt).strip()


def slug(txt: str) -> str:
    return normalizar(txt).replace(" ", "-")[:50] or "lance"


def esc_filtro(caminho: str) -> str:
    """Escapa um caminho para usar dentro de um filtro do FFmpeg (Windows e Linux)."""
    p = str(caminho).replace("\\", "/").replace(":", "\\:").replace("'", "\\'")
    return f"'{p}'"


def tempo_para_seg(valor) -> float | None:
    if valor is None or valor == "":
        return None
    if isinstance(valor, (int, float)):
        return float(valor)
    partes = str(valor).strip().split(":")
    try:
        s = 0.0
        for p in partes:
            s = s * 60 + float(p)
        return s
    except ValueError:
        return None


# --------------------------------------------------------------------------- mídia

def duracao(cfg: dict, arq: Path) -> float:
    r = rodar([cfg["ffprobe"], "-v", "error", "-show_entries", "format=duration",
               "-of", "default=nk=1:nw=1", str(arq)])
    return float(r.stdout.strip())


def tem_audio(cfg: dict, arq: Path) -> bool:
    r = rodar([cfg["ffprobe"], "-v", "error", "-select_streams", "a", "-show_entries",
               "stream=index", "-of", "csv=p=0", str(arq)])
    return bool(r.stdout.strip())


def ler_audio(cfg: dict, arq: Path, sr: int, inicio: float = 0.0, dur: float | None = None) -> np.ndarray:
    cmd = [cfg["ffmpeg"], "-v", "error", "-ss", f"{inicio:.3f}"]
    if dur:
        cmd += ["-t", f"{dur:.3f}"]
    cmd += ["-i", str(arq), "-vn", "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"]
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.decode(errors="replace")[-800:])
    return np.frombuffer(r.stdout, dtype=np.float32)


def suavizar(x: np.ndarray, n: int) -> np.ndarray:
    if n <= 1 or len(x) < n:
        return x
    return np.convolve(x, np.ones(n) / n, mode="same")


# --------------------------------------------------------------------------- análise

def achar_lance(cfg: dict, arq: Path, dica: float | None) -> float:
    """Encontra o momento do lance pelo pico do barulho da torcida/narração."""
    total = duracao(cfg, arq)
    if not tem_audio(cfg, arq):
        return min(max(dica if dica is not None else total * 0.6, 0), total)
    jan = cfg["janela_busca_segundos"]
    if dica is not None:
        ini = max(0.0, dica - jan)
        fim = min(total, dica + jan)
    else:
        ini, fim = 0.0, total
    sr = 8000
    y = ler_audio(cfg, arq, sr, ini, fim - ini)
    if len(y) < sr:
        return dica if dica is not None else total / 2
    hop = sr // 4  # 0,25 s
    n = len(y) // hop
    rms = np.sqrt(np.mean(y[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
    curto = suavizar(rms, 4)    # ~1 s
    base = suavizar(rms, 40)    # ~10 s
    excesso = curto - base
    i_pico = int(np.argmax(excesso))
    alvo = excesso[i_pico] * 0.6
    i = i_pico
    while i > 0 and excesso[i - 1] >= alvo:
        i -= 1
    momento = ini + i * 0.25 - 0.5  # o grito da torcida vem logo depois do lance
    return float(min(max(momento, 0.0), total))


def achar_varios_lances(cfg: dict, arq: Path, k: int) -> list[float]:
    """Num vídeo longo de highlights, acha os k momentos mais fortes (picos de torcida),
    separados entre si. Sem picos claros, distribui os lances ao longo do vídeo."""
    total = duracao(cfg, arq)
    margem = 4.0
    espacados = [margem + (total - 2 * margem) * (i + 0.5) / k for i in range(k)]
    if not tem_audio(cfg, arq) or total < 30:
        return espacados
    sr, passo = 8000, 0.25
    y = ler_audio(cfg, arq, sr)
    hop = int(sr * passo)
    n = len(y) // hop
    if n < 40:
        return espacados
    rms = np.sqrt(np.mean(y[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
    excesso = suavizar(rms, 4) - suavizar(rms, 40)
    sep = int(cfg.get("separacao_minima_lances", 10.0) / passo)
    borda = int(margem / passo)
    candidatos = np.argsort(excesso)[::-1]
    picos: list[int] = []
    for i in candidatos:
        if i < borda or i > n - borda:
            continue
        if excesso[i] <= 0:
            break
        if all(abs(i - p) >= sep for p in picos):
            picos.append(int(i))
            if len(picos) == k:
                break
    # picos fracos (vídeo já com música por cima, sem torcida) -> usa lances espaçados
    if len(picos) < k or excesso[picos[-1]] < 0.15 * excesso[picos[0]]:
        log("  poucos picos de torcida claros; distribuindo os lances pelo vídeo")
        return espacados
    momentos = []
    for p in picos:
        alvo, i = excesso[p] * 0.6, p
        while i > 0 and excesso[i - 1] >= alvo:
            i -= 1
        momentos.append(max(0.0, i * passo - 0.5))
    # ordem: o mais forte por último (fecha o edit no auge); os demais em ordem cronológica
    mais_forte = momentos[0]
    resto = sorted(momentos[1:])
    return resto + [mais_forte]


def analisar_musica(cfg: dict, arq: Path) -> tuple[np.ndarray, float, np.ndarray, int]:
    """Retorna (tempos_das_batidas, periodo_batida, energia, sr_energia)."""
    sr = 22050
    y = ler_audio(cfg, arq, sr)
    hop = 512
    nfft = 1024
    n = 1 + (len(y) - nfft) // hop
    if n < 50:
        raise RuntimeError("Música curta demais.")
    janela = np.hanning(nfft).astype(np.float32)
    quadros = np.lib.stride_tricks.as_strided(y, shape=(n, nfft), strides=(y.strides[0] * hop, y.strides[0]))
    espec = np.log1p(np.abs(np.fft.rfft(quadros * janela, axis=1)))
    fluxo = np.maximum(np.diff(espec, axis=0), 0).sum(axis=1)
    fluxo = np.concatenate([[0], fluxo])
    fluxo = fluxo - suavizar(fluxo, 16)
    fluxo = np.maximum(fluxo, 0)
    fps_env = sr / hop
    # tempo por autocorrelação (60 a 160 bpm)
    ac = np.correlate(fluxo, fluxo, mode="full")[len(fluxo) - 1:]
    lag_min = int(fps_env * 60 / 160)
    lag_max = int(fps_env * 60 / 60)
    lag = lag_min + int(np.argmax(ac[lag_min:lag_max]))
    periodo = lag / fps_env
    # fase: deslocamento com mais energia no grid
    melhor, fase = -1.0, 0
    for f in range(lag):
        s = fluxo[f::lag].sum()
        if s > melhor:
            melhor, fase = s, f
    batidas = np.arange(fase, len(fluxo), lag) / fps_env
    energia = np.sqrt(np.mean(quadros ** 2, axis=1))
    return batidas, float(periodo), energia, int(fps_env)


def melhor_inicio_musica(batidas: np.ndarray, energia: np.ndarray, fps_env: int, dur_total: float) -> float:
    """Começa a música no trecho mais forte (refrão/drop), alinhado numa batida."""
    n = int(dur_total * fps_env)
    if len(energia) <= n:
        return float(batidas[0]) if len(batidas) else 0.0
    soma = np.convolve(energia, np.ones(n), mode="valid")
    i = int(np.argmax(soma))
    t = i / fps_env
    t = max(0.0, t - dur_total * 0.3)  # entra um pouco antes do auge
    candidatos = batidas[batidas >= t]
    return float(candidatos[0]) if len(candidatos) else float(t)


# --------------------------------------------------------------------------- pauta

def carregar_pautas(cfg: dict | None = None) -> list[dict]:
    """Lê as pautas da pasta entrada e, se configurada, da pasta do Drive onde o Radar salva.
    As mais recentes vêm primeiro, para o vídeo casar com a pauta do dia."""
    pastas = [PASTA_ENTRADA]
    if cfg and cfg.get("pasta_pauta"):
        p = Path(os.path.expandvars(os.path.expanduser(cfg["pasta_pauta"])))
        if p.exists():
            pastas.append(p)
    arquivos = sorted({a for pasta in pastas for a in pasta.glob("pauta*.json")}, key=lambda a: a.name, reverse=True)
    lances = []
    for arq in arquivos[:10]:
        try:
            dados = json.loads(arq.read_text(encoding="utf-8"))
            lances += dados.get("lances", [])
        except (json.JSONDecodeError, OSError) as e:
            log(f"AVISO: não consegui ler {arq.name}: {e}")
    return lances


def casar_com_pauta(arq: Path, lances: list[dict]) -> dict | None:
    nome = normalizar(arq.stem)
    melhor, nota = None, 0.0
    for l in lances:
        if l.get("id") and normalizar(l["id"]) in nome:
            return l
        for campo in ("titulo_video", "jogador", "lance"):
            alvo = normalizar(l.get(campo, "") or "")
            if not alvo:
                continue
            r = difflib.SequenceMatcher(None, nome, alvo).ratio()
            if campo == "jogador" and alvo in nome:
                r = max(r, 0.55)
            if r > nota:
                melhor, nota = l, r
    return melhor if nota >= 0.5 else None


# --------------------------------------------------------------------------- música

def escolher_musica() -> Path:
    musicas = sorted(p for p in PASTA_MUSICAS.iterdir() if p.suffix.lower() in EXT_AUDIO)
    if not musicas:
        raise RuntimeError("Nenhuma música em musicas/. Coloque pelo menos um arquivo de áudio licenciado lá.")
    hist = {}
    if ARQ_HISTORICO.exists():
        try:
            hist = json.loads(ARQ_HISTORICO.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            hist = {}
    musicas.sort(key=lambda p: hist.get(p.name, 0))
    escolhida = musicas[0]
    hist[escolhida.name] = time.time()
    ARQ_HISTORICO.write_text(json.dumps(hist, indent=2, ensure_ascii=False), encoding="utf-8")
    return escolhida


# --------------------------------------------------------------------------- montagem

def filtro_vertical(cfg: dict, zoom: float) -> str:
    W, H = cfg["largura"], cfg["altura"]
    zw = int(round(W * zoom / 2) * 2)
    nit = cfg["nitidez"]
    return (
        f"[0:v]split=2[a][b];"
        f"[a]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},"
        f"boxblur=24:2,eq=brightness=-0.10:saturation=0.6[fundo];"
        f"[b]scale=w='if(gt(a,{W}/{H}),{zw},-2)':h='if(gt(a,{W}/{H}),-2,{H})':flags=lanczos,"
        f"crop='min(iw,{W})':'min(ih,{H})',unsharp=5:5:{nit}[frente];"
        f"[fundo][frente]overlay=(W-w)/2:(H-h)/2,setsar=1"
    )


def render_trecho(cfg: dict, arq: Path, ini: float, dur_fonte: float, dur_alvo: float,
                  zoom: float, saida: Path) -> None:
    fator = dur_alvo / dur_fonte  # >1 = câmera lenta
    vf = filtro_vertical(cfg, zoom) + f",setpts={fator:.6f}*PTS,fps={cfg['fps']}[v]"
    rodar([cfg["ffmpeg"], "-y", "-v", "error", "-ss", f"{ini:.3f}", "-t", f"{dur_fonte:.3f}",
           "-i", str(arq), "-filter_complex", vf, "-map", "[v]", "-an",
           "-t", f"{dur_alvo:.3f}", "-c:v", "libx264", "-preset", "veryfast", "-crf", "12",
           "-pix_fmt", "yuv420p", str(saida)])


def arredondar_batidas(seg: float, periodo: float, por_corte: int) -> float:
    unidade = periodo * max(1, por_corte // 2)
    return max(unidade, round(seg / unidade) * unidade)


def trechos_lance_unico(cfg: dict, momento: float, total: float, periodo: float) -> list[tuple]:
    antes, depois = cfg["segundos_antes_do_lance"], cfg["segundos_depois_do_lance"]
    lento, por_corte = cfg["slowmo_velocidade"], cfg["batidas_por_corte"]
    ini_a = max(0.0, momento - antes)
    fim_a = max(ini_a + 0.5, momento - 1.5)
    ini_b = fim_a
    fim_b = min(total, momento + depois)
    if fim_b - ini_b < 1.0:
        ini_b = max(0.0, fim_b - 2.0)
    trechos = [  # (início, duração na fonte, duração no vídeo, zoom)
        (ini_a, fim_a - ini_a, arredondar_batidas(fim_a - ini_a, periodo, por_corte), 1.0),
        (ini_b, fim_b - ini_b, arredondar_batidas((fim_b - ini_b) / lento, periodo, por_corte), cfg["zoom_no_lance"]),
    ]
    # replay curto do lance, mais lento ainda, para fechar no auge da música
    ini_r = max(0.0, momento - 1.2)
    dur_r = min(1.6, total - ini_r)
    if dur_r > 0.6:
        trechos.append((ini_r, dur_r, arredondar_batidas(dur_r / (lento * 0.8), periodo, por_corte), cfg["zoom_no_lance"] * 1.12))
    return trechos


def trechos_compilacao(cfg: dict, momentos: list[float], total: float, periodo: float) -> list[tuple]:
    """Vários lances: cada um com uma entrada curta em velocidade normal e o impacto em câmera lenta;
    o último (o mais forte) ganha replay para fechar no auge."""
    lento, por_corte = cfg["slowmo_velocidade"], cfg["batidas_por_corte"]
    trechos = []
    for j, m in enumerate(momentos):
        ultimo = j == len(momentos) - 1
        ini_a = max(0.0, m - 2.5)
        dur_a = max(0.6, (m - 1.0) - ini_a)
        trechos.append((ini_a, dur_a, arredondar_batidas(dur_a, periodo, 2), 1.0))
        ini_b = max(0.0, m - 1.0)
        dur_b = max(0.8, min(1.8, total - ini_b))
        trechos.append((ini_b, dur_b, arredondar_batidas(dur_b / lento, periodo, por_corte), cfg["zoom_no_lance"]))
        if ultimo:
            ini_r = max(0.0, m - 0.8)
            dur_r = max(0.6, min(1.4, total - ini_r))
            trechos.append((ini_r, dur_r, arredondar_batidas(dur_r / (lento * 0.8), periodo, por_corte), cfg["zoom_no_lance"] * 1.12))
    return trechos


def montar_video(cfg: dict, arq: Path, lance: dict | None, saida_mp4: Path) -> dict:
    total = duracao(cfg, arq)
    compilacao = total >= cfg.get("compilacao_a_partir_de_segundos", 90)
    musica = escolher_musica()
    batidas, periodo, energia, fps_env = analisar_musica(cfg, musica)
    log(f"  música: {musica.name} (~{60 / periodo:.0f} bpm)")

    if compilacao:
        k = int(cfg.get("lances_por_compilacao", 4))
        momentos = achar_varios_lances(cfg, arq, k)
        momento = momentos[-1]
        log(f"  compilação de {total:.0f}s: {len(momentos)} lances em " + ", ".join(f"{m:.0f}s" for m in sorted(momentos)))
        trechos = trechos_compilacao(cfg, momentos, total, periodo)
    else:
        dica = tempo_para_seg(lance.get("minuto_no_video")) if lance else None
        momento = achar_lance(cfg, arq, dica)
        log(f"  lance encontrado em {momento:.1f}s de {total:.1f}s")
        trechos = trechos_lance_unico(cfg, momento, total, periodo)

    dur_total = sum(t[2] for t in trechos)
    inicio_musica = melhor_inicio_musica(batidas, energia, fps_env, dur_total)

    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        lista = tmp / "lista.txt"
        partes = []
        for i, (ini, dfonte, dalvo, zoom) in enumerate(trechos):
            p = tmp / f"t{i}.mp4"
            render_trecho(cfg, arq, ini, dfonte, dalvo, zoom, p)
            partes.append(p)
        lista.write_text("".join(f"file '{p.as_posix()}'\n" for p in partes), encoding="utf-8")
        junto = tmp / "junto.mp4"
        rodar([cfg["ffmpeg"], "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(lista),
               "-c", "copy", str(junto)])

        g = cfg["granulado"]
        vf = ("eq=contrast=1.07:saturation=0.70:brightness=-0.02:gamma=0.97,"
              "colorbalance=rs=-0.05:gs=-0.01:bs=0.07:rm=-0.03:bm=0.05:rh=-0.02:bh=0.03,"
              "vignette=PI/4.5")
        if g:
            vf += f",noise=alls={g}:allf=t+u"
        texto = (lance or {}).get("texto_tela", "").strip() if cfg["texto_na_tela"] else ""
        if texto:
            arq_txt = tmp / "texto.txt"
            arq_txt.write_text(quebrar_texto(texto, 26), encoding="utf-8")
            t_in = trechos[0][2] * 0.35
            vf += (f",drawtext=fontfile={esc_filtro(cfg['fonte_texto'])}:textfile={esc_filtro(arq_txt)}"
                   f":fontsize={cfg['tamanho_texto']}:fontcolor=white:line_spacing=14@ALINHAR@"
                   f":x=(w-text_w)/2:y=h*0.18:shadowcolor=black@0.55:shadowx=0:shadowy=3"
                   f":alpha='if(lt(t,{t_in:.2f}),0,if(lt(t,{t_in + 0.8:.2f}),(t-{t_in:.2f})/0.8,1))'")
        fade = 1.6
        af = f"afade=t=in:d=0.4,afade=t=out:st={max(0, dur_total - fade):.2f}:d={fade},volume=0.95"
        vf += f",fade=t=out:st={max(0, dur_total - 0.6):.2f}:d=0.6"

        def final(filtro: str) -> None:
            rodar([cfg["ffmpeg"], "-y", "-v", "error", "-i", str(junto),
                   "-ss", f"{inicio_musica:.3f}", "-i", str(musica),
                   "-filter_complex", f"[0:v]{filtro}[v];[1:a]{af}[a]",
                   "-map", "[v]", "-map", "[a]", "-t", f"{dur_total:.3f}",
                   "-c:v", "libx264", "-preset", cfg["preset"], "-crf", str(cfg["crf"]),
                   "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", str(cfg["fps"]),
                   "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(saida_mp4)])

        try:
            final(vf.replace("@ALINHAR@", ":text_align=C"))
        except RuntimeError:
            # FFmpeg antigo sem text_align: centraliza o bloco, linhas alinhadas à esquerda
            log("  aviso: FFmpeg sem suporte a texto centralizado; usando alinhamento simples.")
            final(vf.replace("@ALINHAR@", ""))

    return {"musica": musica.name, "duracao": round(dur_total, 2), "momento_lance": round(momento, 2)}


def quebrar_texto(texto: str, largura: int) -> str:
    palavras, linhas, atual = texto.split(), [], ""
    for p in palavras:
        if len(atual) + len(p) + 1 > largura and atual:
            linhas.append(atual)
            atual = p
        else:
            atual = f"{atual} {p}".strip()
    if atual:
        linhas.append(atual)
    return "\n".join(linhas[:3])


def escrever_legenda(cfg: dict, lance: dict | None, arq: Path, destino: Path, info: dict) -> None:
    if lance:
        legenda = lance.get("legenda") or f"{lance.get('jogador', '')} — {lance.get('lance', '')}".strip(" —")
        tags = list(lance.get("hashtags", []))
        if lance.get("jogador"):
            tags.append("#" + re.sub(r"[^A-Za-z0-9]", "", normalizar(lance["jogador"]).title()))
    else:
        legenda = "Alguns lances o tempo não apaga."
        tags = []
    tags += cfg["hashtags_fixas"]
    vistos, finais = set(), []
    for t in tags:
        t = t if t.startswith("#") else "#" + t
        if t.lower() not in vistos:
            vistos.add(t.lower())
            finais.append(t)
    corpo = (f"{legenda}\n\n👇 Qual lance você quer ver no próximo edit?\n\n" + " ".join(finais[:12]) + "\n")
    meta = (f"\n---\narquivo de origem: {arq.name}\nmúsica: {info['musica']}\n"
            f"duração: {info['duracao']}s | lance em {info['momento_lance']}s do original\n")
    if lance and lance.get("id"):
        meta += f"pauta: {lance['id']}\n"
    destino.write_text(corpo + meta, encoding="utf-8")


# --------------------------------------------------------------------------- fluxo

def preparar_pastas() -> None:
    for p in (PASTA_ENTRADA, PASTA_MUSICAS, PASTA_SAIDA, PASTA_PROCESSADOS, PASTA_ERROS):
        p.mkdir(parents=True, exist_ok=True)


def verificar_ffmpeg(cfg: dict) -> None:
    for prog in ("ffmpeg", "ffprobe"):
        if not shutil.which(cfg[prog]) and not Path(cfg[prog]).exists():
            raise SystemExit(f"ERRO: '{cfg[prog]}' não encontrado. Rode instalar.bat ou ajuste o caminho em config.json.")


def arquivo_estavel(arq: Path) -> bool:
    """Evita pegar um vídeo que ainda está sendo baixado/copiado."""
    try:
        t1 = arq.stat().st_size
        time.sleep(2)
        return t1 > 0 and t1 == arq.stat().st_size
    except OSError:
        return False


def processar_pendentes(cfg: dict) -> int:
    pendentes = sorted(p for p in PASTA_ENTRADA.iterdir() if p.is_file() and p.suffix.lower() in EXT_VIDEO)
    if not pendentes:
        return 0
    lances = carregar_pautas(cfg)
    feitos = 0
    for arq in pendentes:
        if not arquivo_estavel(arq):
            continue
        log(f"Editando: {arq.name}")
        lance = casar_com_pauta(arq, lances)
        log(f"  pauta: {lance.get('id', '?')} - {lance.get('jogador', '')}" if lance else "  pauta: sem correspondência (edit genérico)")
        base = f"{dt.date.today():%Y-%m-%d}_{slug((lance or {}).get('jogador') or arq.stem)}"
        if lance and lance.get("id"):
            base += f"_{slug(lance['id'])}"
        destino = PASTA_SAIDA / f"{base}.mp4"
        n = 2
        while destino.exists():
            destino = PASTA_SAIDA / f"{base}_{n}.mp4"
            n += 1
        try:
            info = montar_video(cfg, arq, lance, destino)
            escrever_legenda(cfg, lance, arq, destino.with_suffix(".txt"), info)
            shutil.move(str(arq), str(PASTA_PROCESSADOS / arq.name))
            log(f"  OK -> saida/{destino.name} ({info['duracao']}s)")
            feitos += 1
        except Exception as e:  # noqa: BLE001
            log(f"  ERRO em {arq.name}: {e}")
            try:
                shutil.move(str(arq), str(PASTA_ERROS / arq.name))
            except OSError:
                pass
    return feitos


def main() -> None:
    ap = argparse.ArgumentParser(description="Lances Eternos - editor automático")
    ap.add_argument("--vigiar", action="store_true", help="fica rodando e processa vídeos novos")
    ap.add_argument("--intervalo", type=int, default=30, help="segundos entre verificações no modo vigiar")
    args = ap.parse_args()

    global PASTA_SAIDA
    preparar_pastas()
    cfg = carregar_config()
    if cfg.get("pasta_saida"):
        destino = Path(os.path.expandvars(os.path.expanduser(cfg["pasta_saida"])))
        try:
            destino.mkdir(parents=True, exist_ok=True)
            PASTA_SAIDA = destino
            log(f"Vídeos prontos vão para: {destino}")
        except OSError as e:
            log(f"AVISO: não consegui usar a pasta_saida '{destino}' ({e}); usando a pasta saida local.")
    verificar_ffmpeg(cfg)

    if not args.vigiar:
        n = processar_pendentes(cfg)
        log(f"Concluído: {n} vídeo(s) editado(s)." if n else "Nada novo em entrada/.")
        return
    log("Modo vigiar: coloque vídeos em entrada/. Ctrl+C para parar.")
    try:
        while True:
            processar_pendentes(cfg)
            time.sleep(args.intervalo)
    except KeyboardInterrupt:
        log("Parado.")


if __name__ == "__main__":
    main()

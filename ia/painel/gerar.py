"""Painel do IA em 60s: gera painel/index.html com todos os posts, a semana em vagas e o que precisa do Vitor.

Uso (de dentro de ia/):  python3 painel/gerar.py
Lê posts/*/meta.json (+ roteiro.json, legendas, checagem), metricas.json e painel/publicacoes.json
(cópia do Metricool, atualizada por quem agenda). Gera as capas em painel/capas/ e o painel/index.html.

Status de cada post: meta.json "status" quando alguém marcou à mão ("roteiro aguardando aprovação",
"vídeo aguardando aprovação", "negado"); senão vem do Metricool: publicado, agendado, rascunho, erro.
"""
from __future__ import annotations

import datetime as dt
import html
import json
import re
import subprocess
from collections import defaultdict
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chance as chance_mod  # noqa: E402  chance estimada de ser bem recebido

IA = Path(__file__).resolve().parent.parent
PAINEL = IA / "painel"
CAPAS = PAINEL / "capas"
BRT = dt.timezone(dt.timedelta(hours=-3))
VAGAS_UTEIS = ["06:00", "12:00", "17:00", "19:30"]
VAGAS_FDS = ["09:00", "13:00", "17:00", "20:30"]
INICIO_4_POR_DIA = dt.date(2026, 11, 9)  # até 08/11 valeu a agenda especial de 2 por dia (estado.json)
# Exceção (Vitor, 07/11): 09 a 15/11 com 8 Reels por dia (CLAUDE.md)
SEMANA_8 = (dt.date(2026, 11, 9), dt.date(2026, 11, 15))
VAGAS8_UTEIS = ["06:00", "08:00", "10:00", "12:00", "14:00", "17:00", "19:30", "21:30"]
VAGAS8_FDS = ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "20:30"]  # Vitor, 07/11: 22:00 é tarde, começa às 07:00


def vagas_do_dia(dia: dt.date) -> list[str]:
    if dia < INICIO_4_POR_DIA:
        return []
    fds = dia.weekday() >= 5
    if SEMANA_8[0] <= dia <= SEMANA_8[1]:
        return VAGAS8_FDS if fds else VAGAS8_UTEIS
    return VAGAS_FDS if fds else VAGAS_UTEIS
DIAS = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"]
REDES = {"instagram": "IG", "tiktok": "TT", "youtube": "YT"}


def ler(p: Path, padrao=None):
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return padrao


def esc(t) -> str:
    return html.escape(str(t or ""))


def horarios_do_post(meta: dict) -> list[tuple[str, str]]:
    """meta.horarios -> [(rede, 'AAAA-MM-DD HH:MM')]. Aceita '19:45' (usa meta.data) e '06/11 19:30 (carrossel)'."""
    base = meta.get("data", "")
    out = []
    for chave, valor in (meta.get("horarios") or {}).items():
        iso = re.search(r"(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})", str(valor))
        if iso:
            out.append((chave.split("_")[0], f"{iso.group(1)} {iso.group(2)}"))
            continue
        m = re.search(r"(?:(\d{2})/(\d{2})\s+)?(\d{2}:\d{2})", str(valor))
        if not m or not base:
            continue
        data = f"{base[:4]}-{m.group(2)}-{m.group(1)}" if m.group(1) else base
        out.append((chave.split("_")[0], f"{data} {m.group(3)}"))
    return out


def capa(pasta: Path) -> str | None:
    thumb = CAPAS / f"thumb-{pasta.name}.jpg"  # capa estilo thumb (node painel/capas.js)
    if thumb.exists():
        return f"capas/{thumb.name}"
    destino = CAPAS / f"{pasta.name}.jpg"
    if destino.exists():
        return f"capas/{destino.name}"
    fonte = next((p for p in [pasta / "capa.jpg", *sorted((pasta / "slides").glob("*.jpg")),
                              *sorted((pasta / "slides").glob("*.png"))] if p.exists()), None)
    video = next((pasta / n for n in ("reel.mp4", "short.mp4") if (pasta / n).exists()), None)
    if fonte is None and video is None:
        previa = CAPAS / f"roteiro-{pasta.name}.jpg"  # node painel/capa_roteiro.js
        return f"capas/{previa.name}" if previa.exists() else None
    CAPAS.mkdir(parents=True, exist_ok=True)
    entrada = ["-ss", "1.5", "-i", str(video)] if fonte is None else ["-i", str(fonte)]
    r = subprocess.run(["ffmpeg", "-v", "error", "-y", *entrada, "-frames:v", "1", "-vf", "scale=270:-2", "-q:v", "6", str(destino)])
    return f"capas/{destino.name}" if r.returncode == 0 and destino.exists() else None


def titulo(pasta: Path, meta: dict, pubs: list[dict]) -> str:
    for nome in ("legenda_reel_instagram.txt", "legenda_instagram.txt"):
        if (pasta / nome).exists():
            linha = (pasta / nome).read_text(encoding="utf-8").strip().splitlines()
            if linha:
                return linha[0]
    for p in pubs:
        if p.get("texto"):
            return p["texto"]
    rot = ler(pasta / "roteiro.json", {}) or {}
    return rot.get("tese") or ", ".join(meta.get("temas", [])) or pasta.name


def status_do_post(meta: dict, pubs: list[dict]) -> str:
    if meta.get("status"):
        return meta["status"]
    st = {p["status"] for p in pubs}
    if "PUBLISHED" in st:
        return "publicado"
    if any(p["status"] == "PENDING" and not p.get("rascunho") for p in pubs):
        return "agendado"
    if any(p.get("rascunho") for p in pubs):
        return "rascunho"
    if "ERROR" in st:
        return "erro"
    return "sem publicação"


def classe(status: str) -> str:
    s = status.lower()
    if "aguardando" in s:
        return "espera"
    if "aprovado" in s:
        return "ok"
    return {"publicado": "ok", "agendado": "agenda", "rascunho": "neutro", "erro": "erro", "negado": "neutro"}.get(s, "neutro")


# Botões de aprovar/negar: só funcionam no app (Worker), que grava a decisão no D1 "iaem60s-painel".
JS = r"""
const API = 'api/';
let decisoes = {};
const aviso = (t) => { document.getElementById('aviso').textContent = t; };
function pintar() {
  let ap = 0, ng = 0, falta = 0;
  document.querySelectorAll('.decide').forEach(d => {
    const x = decisoes[d.dataset.pasta];
    let f = d.parentNode.querySelector('.flag');
    if (x && x.etapa === d.dataset.etapa) {
      x.decisao === 'aprovado' ? ap++ : ng++;
      d.querySelectorAll('button,input').forEach(b => b.style.display = 'none');
      if (!f) { f = document.createElement('div'); d.after(f); }
      f.className = 'flag ' + x.decisao;
      f.innerHTML = (x.decisao === 'aprovado' ? '✔ ' + d.dataset.etapa + ' aprovado' : '✘ negado') + (x.nota ? ' · ' + x.nota.replace(/</g, '&lt;') : '') + '<button>desfazer</button>';
      f.querySelector('button').onclick = () => decidir(d.dataset.pasta, d.dataset.etapa, 'desfazer');
    } else { falta++; d.querySelectorAll('button').forEach(b => b.style.display = ''); if (f) f.remove(); }
  });
  document.querySelectorAll('li[data-pasta]').forEach(li => { const x = decisoes[li.dataset.pasta]; if (x) li.dataset.dec = x.decisao; else delete li.dataset.dec; });
  aviso(`No app: ${ap} aprovado(s), ${ng} negado(s), ${falta} esperando você. As sessões aplicam as decisões na próxima rodada.`);
}
async function carregar() {
  try {
    const r = await fetch(API + 'decisoes', { cache: 'no-store' });
    if (!r.ok) throw 0;
    decisoes = await r.json(); pintar();
  } catch (e) {
    document.querySelectorAll('.decide button,.dia-todos').forEach(b => b.style.display = 'none');
    aviso('Aprovar e negar funciona só no app IA em 60s (ícone na tela de início).');
  }
}
async function decidir(pasta, etapa, decisao, nota) {
  const r = await fetch(API + 'decisao', { method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ pasta, etapa, decisao, nota: nota || '' }) }).catch(() => null);
  if (!r) { aviso('Sem conexão: a decisão não foi gravada.'); return false; }
  if (!r.ok) { aviso('Erro ao gravar (' + r.status + ').'); return false; }
  if (decisao === 'desfazer') delete decisoes[pasta]; else decisoes[pasta] = { etapa, decisao, nota };
  pintar(); return true;
}
document.querySelectorAll('.decide').forEach(d => {
  d.querySelector('.sim').onclick = () => decidir(d.dataset.pasta, d.dataset.etapa, 'aprovado');
  d.querySelector('.nao').onclick = () => {
    if (!d.querySelector('input')) {
      d.insertAdjacentHTML('beforeend', '<input placeholder="motivo (opcional)" style="flex:1;min-width:120px;font:inherit;font-size:12px;padding:6px;border-radius:8px;border:1px solid #262a33;background:#0b0d12;color:#e8e9ec"><button class="nao ok2">confirmar</button>');
      d.querySelector('.ok2').onclick = () => decidir(d.dataset.pasta, d.dataset.etapa, 'negado', d.querySelector('input').value.trim());
    }
  };
});
document.querySelectorAll('.dia-todos').forEach(b => b.onclick = async () => {
  if (b.dataset.armado !== '1') { b.dataset.armado = '1'; b.textContent = 'tocar de novo p/ confirmar'; return; }
  const ds = [...document.querySelectorAll('.decide')].filter(d => d.dataset.dia === b.dataset.dia && !decisoes[d.dataset.pasta]);
  b.textContent = 'aprovando…';
  for (const d of ds) { if (!(await decidir(d.dataset.pasta, d.dataset.etapa, 'aprovado'))) break; }
  b.textContent = 'aprovar o dia'; b.dataset.armado = '';
});
carregar();

// ---- notificações (Web Push): só no app instalado na tela de início
const sino = document.getElementById('sino');
const paraU8 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));
async function estadoSino() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return;
  try { if (!(await fetch(API + 'vapid')).ok) return; } catch (e) { return; }
  sino.style.display = '';
  const reg = await navigator.serviceWorker.register('/sw.js');
  const sub = await reg.pushManager.getSubscription();
  if (sub && Notification.permission === 'granted') { sino.textContent = '🔔 notificações ligadas'; sino.classList.add('ok'); }
}
sino.onclick = async () => {
  try {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { aviso('Notificação bloqueada. Libere em Ajustes > Notificações > IA em 60s.'); return; }
    const reg = await navigator.serviceWorker.register('/sw.js'); await navigator.serviceWorker.ready;
    const { chave } = await (await fetch(API + 'vapid')).json();
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: paraU8(chave) });
    const r = await fetch(API + 'inscrever', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(sub) });
    if (!r.ok) throw new Error('servidor ' + r.status);
    sino.textContent = '🔔 notificações ligadas'; sino.classList.add('ok');
    aviso('Pronto: mandei uma notificação de teste. A partir de agora você recebe quando tiver vídeo pra aprovar.');
  } catch (e) { aviso('Não consegui ligar as notificações: ' + e.message + '. Abra o painel pelo ícone da tela de início e tente de novo.'); }
};
estadoSino();
"""


def main() -> None:
    agora = dt.datetime.now(BRT)
    snap = ler(PAINEL / "publicacoes.json", {}) or {}
    publicacoes = snap.get("publicacoes", [])
    metricas = (ler(IA / "metricas.json", {}) or {}).get("posts", {})

    por_horario = {}
    posts = []
    for pasta in sorted((IA / "posts").iterdir()):
        if not pasta.is_dir() or pasta.name.startswith("_"):
            continue
        meta = ler(pasta / "meta.json", {}) or {}
        posts.append({"pasta": pasta, "meta": meta, "pubs": []})
        for rede, quando in horarios_do_post(meta):
            por_horario[(rede, quando)] = posts[-1]

    soltas = []
    for p in publicacoes:
        alvo = por_horario.get((p["rede"], p["data"]))
        (alvo["pubs"] if alvo else soltas).append(p)

    hist = chance_mod.historico()
    cartoes = []
    for post in posts:
        pasta, meta, pubs = post["pasta"], post["meta"], post["pubs"]
        if not meta and not pubs and not any((pasta / n).exists() for n in ("reel.mp4", "short.mp4")):
            continue
        st = status_do_post(meta, pubs)
        datas = sorted(p["data"] for p in pubs) or [q for _, q in horarios_do_post(meta)] or [meta.get("data") or pasta.name[:10]]
        cartoes.append({"pasta": pasta, "meta": meta, "pubs": sorted(pubs, key=lambda x: x["rede"]), "status": st,
                        "quando": datas[0], "titulo": titulo(pasta, meta, pubs), "capa": capa(pasta),
                        "metricas": metricas.get(pasta.name, {}), "checagem": meta.get("checagem")})
    for p in soltas:  # publicações sem pasta com meta.json (ex.: post antigo)
        cartoes.append({"pasta": None, "meta": {}, "pubs": [p], "status": status_do_post({}, [p]), "quando": p["data"],
                        "titulo": p.get("texto", ""), "capa": None, "metricas": {}, "checagem": None})
    cartoes.sort(key=lambda c: c["quando"], reverse=True)

    # ---- o que precisa do Vitor
    pendencias = []
    aguardando = defaultdict(list)
    for c in cartoes:
        nome = c["pasta"].name if c["pasta"] else c["titulo"][:40]
        if "aguardando" in c["status"].lower():
            aguardando[c["status"]].append(nome)
        if c["checagem"] and not c["checagem"]["ok"] and not c["meta"].get("checagem_aceita") and c["status"] not in ("publicado", "negado"):
            falhas = ", ".join(i["nome"] for i in c["checagem"]["itens"] if i["ok"] is False)
            pendencias.append(f"<b>Checagem falhou</b>: {esc(nome)} ({esc(falhas)})")
    for st, nomes in aguardando.items():
        lista = "".join(f"<li>{esc(n)}</li>" for n in sorted(nomes))
        pendencias.insert(0, f'<details><summary><b>{len(nomes)} {esc(st)}</b> ({sorted(nomes)[0][8:10]}/{sorted(nomes)[0][5:7]} a {sorted(nomes)[-1][8:10]}/{sorted(nomes)[-1][5:7]})</summary><ul>{lista}</ul></details>')
    limite = (agora - dt.timedelta(days=3)).strftime("%Y-%m-%d")
    for p in publicacoes:
        if p["status"] == "ERROR" and p["data"] >= limite:
            pendencias.append(f'<b>Erro no {REDES.get(p["rede"], p["rede"])}</b> {esc(p["data"][5:])}: {esc(p.get("erro", ""))}')

    # ---- semana em vagas (hoje + 6 dias), pelo Instagram
    ocupadas = defaultdict(list)
    for p in publicacoes:
        if p["rede"] == "instagram":
            ocupadas[p["data"]].append(p)
    for c in cartoes:  # roteiros e vídeos ainda sem agendamento entram na vaga prevista
        if "aguardando" in c["status"].lower():
            for rede, quando in horarios_do_post(c["meta"]):
                if rede == "instagram" and quando not in ocupadas:
                    ocupadas[quando].append({"status": "AGUARDANDO", "texto": c["titulo"], "rascunho": False, "pasta": c["pasta"].name})
    semana = []
    livres_3_dias = 0
    for d in range(7):
        dia = (agora + dt.timedelta(days=d)).date()
        vagas = vagas_do_dia(dia)
        horas = sorted(set(vagas) | {k[11:] for k in ocupadas if k.startswith(str(dia))})
        linhas = []
        for h in horas:
            ps = ocupadas.get(f"{dia} {h}", [])
            passou = dt.datetime.combine(dia, dt.time.fromisoformat(h), BRT) < agora
            if ps:
                p = ps[0]
                st = {"PUBLISHED": "publicado", "PENDING": "rascunho" if p.get("rascunho") else "agendado", "ERROR": "erro", "AGUARDANDO": "aguardando aprovação"}[p["status"]]
                linhas.append(f'<li class="{classe(st)}"{" data-pasta=" + chr(34) + esc(p["pasta"]) + chr(34) if p.get("pasta") else ""}><span>{h}</span>{esc(p["texto"][:70])}</li>')
            elif h in vagas and not passou:
                if d < 3:
                    livres_3_dias += 1
                linhas.append(f'<li class="livre"><span>{h}</span>vaga livre</li>')
        botao_dia = f'<button class="dia-todos" data-dia="{dia}">aprovar o dia</button>' if any(p.get("pasta") for k, ps in ocupadas.items() if k.startswith(str(dia)) for p in ps) else ""
        semana.append(f'<div class="dia"><h3>{DIAS[dia.weekday()]} {dia:%d/%m}{botao_dia}</h3><ul>{"".join(linhas)}</ul></div>')
    if livres_3_dias:
        pendencias.append(f"<b>{livres_3_dias} vaga(s) livre(s)</b> nos próximos 3 dias")

    # ---- cartões
    html_cartoes = []
    for c in cartoes:
        m = c["meta"]
        chips = "".join(
            f'<a class="chip {classe({"PUBLISHED": "publicado", "PENDING": "agendado", "ERROR": "erro"}[p["status"]])}"'
            f'{" href=" + chr(34) + esc(p["url"]) + chr(34) if p.get("url") else ""} title="{esc(p.get("erro", p["status"]))}">'
            f'{REDES.get(p["rede"], p["rede"])} {p["data"][8:10]}/{p["data"][5:7]} {p["data"][11:]}</a>' for p in c["pubs"])
        met = []
        for rede, v in c["metricas"].items():
            if isinstance(v, dict):
                partes = [f'{v[k]} {n}' for k, n in (("visualizacoes", "views"), ("salvamentos", "salv."), ("envios", "envios"),
                                                      ("comentarios", "coment.")) if v.get(k) is not None]
                met.append(f'{REDES.get(rede, rede)}: ' + " · ".join(partes))
        chk = ""
        if c["checagem"]:
            itens = "".join(f'<li class="{"aviso" if i["ok"] is None else "ok" if i["ok"] else "erro"}">{"⚠" if i["ok"] is None else "✔" if i["ok"] else "✘"} {esc(i["nome"])}: {esc(i["valor"])}</li>'
                            for i in c["checagem"]["itens"])
            chk = f'<details><summary>Checagem {"OK" if c["checagem"]["ok"] else "com falhas"}</summary><ul>{itens}</ul></details>'
        fontes = m.get("fontes") or []
        detalhes = " · ".join(x for x in [m.get("formato"), m.get("pilar"), f'CTA {m["cta"]}' if m.get("cta") else "",
                                           f"{len(fontes)} fonte(s)" if fontes else ""] if x)
        img = f'<img loading="lazy" src="{c["capa"]}?v={int((PAINEL / c["capa"]).stat().st_mtime)}" alt="">' if c["capa"] else '<div class="semcapa">sem capa</div>'
        nome = c["pasta"].name if c["pasta"] else "sem pasta no repositório"
        capa_ig = (f'<a class="chip ig" href="https://raw.githubusercontent.com/lanceseternosedits-maker/lances-eternos-estudio/midia-ia/ia/posts/{esc(nome)}/capa_instagram.jpg">📲 capa IG</a>'
                   if c["pasta"] and (c["pasta"] / "capa_instagram.jpg").exists() else "")
        decide = rot_html = ""
        pct_attr = ""
        if c["pasta"] and "aguardando" in c["status"].lower():
            etapa = "vídeo" if any((c["pasta"] / n).exists() for n in ("reel.mp4", "short.mp4")) else "roteiro"
            rot = ler(c["pasta"] / "roteiro.json", {}) or {}
            falas = "".join(f'<li><b>{esc(s.get("cena", ""))}</b> {esc(s.get("fala", ""))}</li>' for s in rot.get("segmentos", []))
            if etapa == "vídeo":
                capa_src = f'capas/thumb-{esc(nome)}.jpg'
                rot_html += (f'<video class="player" controls playsinline preload="none" poster="{capa_src}" src="videos/{esc(nome)}.mp4"></video>'
                             f'<a class="chip" href="videos/{esc(nome)}.mp4">▶ abrir vídeo em tela cheia</a>')
            if falas:
                extra = f'<li><b>brinde</b> {esc(rot.get("brinde", ""))}</li>' if rot.get("brinde") else ""
                rot_html += f'<details class="rot"><summary>Ver roteiro ({rot.get("palavras", "?")} palavras, ~{rot.get("duracao_estimada_s", "?")} s)</summary><ul>{falas}{extra}</ul></details>'
            ch = chance_mod.chance(c["pasta"], hist)
            pct_attr = f' data-chance="{ch["pct"]}"'
            linhas = "".join(f'<li><span class="{"mais" if a > 0 else "menos" if a < 0 else "zero"}">{"+" if a > 0 else ""}{a}</span> {esc(t)}</li>' for a, t in ch["fatores"])
            porque = (f'<details class="porque"><summary>Por que {ch["pct"]}%? · {esc(ch["tipo"])}</summary><ul>{linhas}</ul>'
                      f'<p>Estimativa com {len(hist)} Reels medidos ("bem recebido" = mais de 300 views no Instagram). Ajuda a comparar roteiros; não é promessa.</p></details>')
            decide = (f'<div class="decide" data-pasta="{esc(nome)}" data-etapa="{etapa}" data-dia="{esc(c["quando"][:10])}">'
                      f'<span class="chance {ch["nivel"].replace(" ", "-").replace("é", "e")}" title="chance estimada de ser bem recebido">🔥 {ch["pct"]}%<small>{esc(ch["nivel"])}</small></span>'
                      f'<button class="sim">✔ Aprovar {etapa}</button><button class="nao">✘ Negar</button></div>{porque}')
        html_cartoes.append(
            f'<article data-pasta="{esc(nome)}" data-status="{esc(c["status"])}"{pct_attr}>{img}<div class="info"><span class="st {classe(c["status"])}">{esc(c["status"])}</span>'
            f'<h4>{esc(c["titulo"][:110])}</h4><p class="sub">{esc(nome)}</p><p class="sub">{esc(detalhes)}</p>'
            f'<div class="chips">{chips}{capa_ig}</div>{"<p class=met>" + "<br>".join(esc(x) for x in met) + "</p>" if met else ""}{chk}{rot_html}{decide}</div></article>')

    contagem = defaultdict(int)
    for c in cartoes:
        contagem[c["status"]] += 1
    resumo = " · ".join(f"{n} {s}" for s, n in sorted(contagem.items(), key=lambda x: -x[1]))
    filtros = "".join(f'<button data-f="{esc(s)}">{esc(s)} ({n})</button>' for s, n in sorted(contagem.items(), key=lambda x: -x[1]))
    pend = "".join(f"<li>{p}</li>" for p in pendencias) or "<li>Nada pendente.</li>"

    pagina = f"""<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Painel IA em 60s</title>
<link rel="apple-touch-icon" href="icone-180.png"><link rel="icon" href="icone-512.png"><link rel="manifest" href="manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="IA em 60s"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="theme-color" content="#0f1115">
<style>
:root{{--bg:#0f1115;--card:#181b22;--line:#262a33;--tx:#e8e9ec;--mut:#9aa0ab;--ok:#3ecf8e;--ag:#5aa9ff;--esp:#ffb547;--erro:#ff6b6b}}
*{{box-sizing:border-box}}body{{margin:0;font:14px/1.45 system-ui,-apple-system,Segoe UI,sans-serif;background:var(--bg);color:var(--tx)}}
header{{padding:calc(20px + env(safe-area-inset-top)) 16px 8px}}h1{{margin:0;font-size:22px}}h2{{font-size:16px;margin:24px 0 10px}}.mut{{color:var(--mut)}}
main{{padding:0 16px 40px;max-width:1200px;margin:auto}}
.pend{{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--esp);border-radius:10px;padding:10px 14px}}
.pend ul{{margin:0;padding-left:18px}}.pend li{{margin:4px 0}}
.semana{{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}}
.dia{{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:8px 10px}}.dia h3{{margin:0 0 6px;font-size:13px;text-transform:uppercase;color:var(--mut)}}
.dia ul{{list-style:none;margin:0;padding:0}}.dia li{{font-size:12px;padding:5px 0;border-top:1px solid var(--line)}}.dia li span{{display:inline-block;width:42px;font-weight:600}}
li.livre{{color:var(--esp)}}li.espera span{{color:var(--esp)}}.pend details{{font-size:14px}}.pend details ul{{margin:4px 0;columns:2;font-size:12px;color:var(--mut)}}li.ok span{{color:var(--ok)}}li.agenda span{{color:var(--ag)}}li.erro{{color:var(--erro)}}
.filtros button{{background:var(--card);color:var(--tx);border:1px solid var(--line);border-radius:20px;padding:5px 12px;margin:0 6px 6px 0;font:inherit;cursor:pointer}}
.filtros button.on{{border-color:var(--ag);color:var(--ag)}}
.grade{{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}}
article{{background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;display:flex}}
article img,.semcapa{{width:96px;min-width:96px;height:170px;object-fit:cover;background:#000}}.semcapa{{display:flex;align-items:center;justify-content:center;color:var(--mut);font-size:11px}}
.info{{padding:8px 10px;min-width:0}}h4{{margin:4px 0;font-size:13px;line-height:1.3}}.sub{{margin:2px 0;color:var(--mut);font-size:11px;word-break:break-word}}
.st{{font-size:11px;font-weight:600;text-transform:uppercase}}.st.ok{{color:var(--ok)}}.st.agenda{{color:var(--ag)}}.st.espera{{color:var(--esp)}}.st.erro{{color:var(--erro)}}.st.neutro{{color:var(--mut)}}
.chips{{margin:6px 0}}.chip{{display:inline-block;font-size:11px;padding:2px 7px;border-radius:10px;margin:0 4px 4px 0;border:1px solid var(--line);color:var(--tx);text-decoration:none}}
.chip.ig{{border-color:#ff3fa4;color:#ff9ad5}}.chip.ok{{border-color:var(--ok)}}.chip.agenda{{border-color:var(--ag)}}.chip.erro{{border-color:var(--erro);color:var(--erro)}}
.met{{font-size:12px;margin:4px 0}}details{{font-size:11px;margin-top:4px}}details ul{{padding-left:4px;list-style:none;margin:4px 0}}details li.erro{{color:var(--erro)}}details li.ok{{color:var(--mut)}}details li.aviso{{color:var(--esp)}}
.player{{width:100%;max-width:240px;aspect-ratio:9/16;border-radius:10px;background:#000;margin:8px 0 4px;display:block}}
.rot ul li{{margin:3px 0;color:var(--tx)}}.rot b{{color:var(--mut);font-weight:600}}
.decide{{margin-top:8px;display:flex;gap:6px;flex-wrap:wrap}}.decide button,.dia-todos{{font:inherit;font-size:12px;border-radius:8px;padding:6px 10px;cursor:pointer;border:1px solid var(--line);background:#20242d;color:var(--tx)}}
.decide .sim{{border-color:var(--ok);color:var(--ok)}}.decide .nao{{border-color:var(--erro);color:var(--erro)}}
#sino{{font:inherit;font-size:12px;font-weight:600;vertical-align:middle;margin-left:8px;padding:5px 10px;border-radius:20px;border:1px solid #ffb547;background:#ffb5471a;color:#ffb547;cursor:pointer}}#sino.ok{{border-color:#3ecf8e;color:#3ecf8e;background:#3ecf8e1a}}
.chance{{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;font-weight:800;font-size:15px;border-radius:8px;padding:3px 9px;line-height:1.1;border:1px solid}}
.chance small{{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.04em}}
.chance.boa-aposta{{color:var(--ok);border-color:var(--ok);background:#3ecf8e1a}}.chance.medio{{color:var(--esp);border-color:var(--esp);background:#ffb5471a}}.chance.arriscado{{color:var(--erro);border-color:var(--erro);background:#ff6b6b1a}}
.porque ul li{{margin:3px 0;color:var(--tx)}}.porque span{{display:inline-block;min-width:28px;font-weight:700}}.porque .mais{{color:var(--ok)}}.porque .menos{{color:var(--erro)}}.porque .zero{{color:var(--mut)}}.porque p{{color:var(--mut);margin:4px 0 0}}
.flag{{display:inline-block;font-size:12px;font-weight:700;padding:4px 9px;border-radius:8px;margin-top:8px}}.flag.aprovado{{background:#3ecf8e22;color:var(--ok)}}.flag.negado{{background:#ff6b6b22;color:var(--erro)}}
.flag button{{margin-left:6px;background:none;border:none;color:var(--mut);font-size:11px;text-decoration:underline;cursor:pointer}}
.dia-todos{{float:right;font-size:10px!important;padding:2px 6px!important;text-transform:none;border-color:var(--ok)!important;color:var(--ok)!important}}
li[data-dec=aprovado]::before{{content:"✔";color:var(--ok);font-weight:700;margin-right:3px}}li[data-dec=negado]{{text-decoration:line-through;opacity:.5}}
#aviso{{font-size:12px;color:var(--mut);margin-top:6px}}
</style></head><body>
<header><h1>IA em 60s · painel <button id="sino" style="display:none">🔔 Ativar notificações</button></h1><div class="mut">Atualizado em {agora:%d/%m %H:%M} (Brasília) · Metricool lido em {esc(snap.get("lido_em", "?"))} · {esc(resumo)}</div></header>
<main>
<h2 id="pendentes">Precisa de você</h2><div class="pend"><ul>{pend}</ul><div id="aviso"></div></div>
<h2>Semana (Instagram, vagas do calendário)</h2><div class="semana">{"".join(semana)}</div>
<h2>Todos os posts ({len(cartoes)})</h2><div class="filtros"><button data-f="" class="on">todos</button>{filtros}<button id="porchance">🔥 maior chance primeiro</button></div>
<div class="grade">{"".join(html_cartoes)}</div>
</main>
<script>
document.getElementById('porchance').onclick=()=>{{
 const g=document.querySelector('.grade');  // prepend em ordem crescente deixa a maior chance no topo
 [...g.children].filter(a=>a.dataset.chance).sort((a,b)=>a.dataset.chance-b.dataset.chance).forEach(a=>g.prepend(a));
 document.querySelectorAll('article').forEach(a=>a.style.display=a.dataset.chance?'':'none');
}};
document.querySelectorAll('.filtros button:not(#porchance)').forEach(b=>b.onclick=()=>{{
 document.querySelectorAll('.filtros button').forEach(x=>x.classList.toggle('on',x===b));
 document.querySelectorAll('article').forEach(a=>a.style.display=(!b.dataset.f||a.dataset.status===b.dataset.f)?'':'none');
}});
""" + JS + """</script></body></html>
"""
    (PAINEL / "index.html").write_text(pagina, encoding="utf-8")
    # o Worker lê isto a cada 5 min e manda notificação de cada vídeo novo esperando aprovação
    def titulo_curto(c):
        rot = ler(c["pasta"] / "roteiro.json", {}) or {}
        seg = (rot.get("segmentos") or [{}])[0]
        return ((seg.get("etiqueta") or [None])[0] or seg.get("tag") or c["titulo"])[:90]
    videos = [{"pasta": c["pasta"].name, "titulo": titulo_curto(c), "quando": c["quando"]} for c in cartoes
              if c["pasta"] and "vídeo aguardando" in c["status"].lower()]
    (PAINEL / "pendentes.json").write_text(json.dumps({"gerado_em": f"{agora:%Y-%m-%d %H:%M}", "videos": videos}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"painel/index.html: {len(cartoes)} posts, {len(pendencias)} pendência(s)")


if __name__ == "__main__":
    main()

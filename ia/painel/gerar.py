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
CATEGORIAS = {"novidade": "🆕 novidade", "historia": "📜 história", "como_funciona": "⚙️ como funciona"}
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
    rot0 = ler(pasta / "roteiro.json", {}) or {}
    seg0 = (rot0.get("segmentos") or [{}])[0]
    for cand in ((rot0.get("capa") or {}).get("texto"), (seg0.get("etiqueta") or [None])[0], seg0.get("tag")):
        if cand and len(str(cand).split()) >= 2:
            return str(cand).upper()
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


def balde(status: str) -> str:
    s = status.lower()
    if "aguardando" in s:
        return "aprovar"
    if "aprovado" in s or "correção" in s or "produção" in s:
        return "producao"
    return {"agendado": "agendado", "publicado": "publicado", "negado": "negado"}.get(s, "outros")


def quando_bonito(q: str) -> str:
    try:
        d = dt.datetime.strptime(q[:16], "%Y-%m-%d %H:%M")
        return f"{DIAS[d.weekday()]} {d:%d/%m} · {d:%H:%M}"
    except ValueError:
        return q[:10]


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
    const st = d.closest('article') && d.closest('article').querySelector('.st');
    if (st && !st.dataset.orig) st.dataset.orig = st.textContent;
    const valida = x && x.etapa === d.dataset.etapa && (!d.dataset.versao || (x.em || '') >= d.dataset.versao);
    if (st) { st.textContent = valida ? (x.decisao === 'aprovado' ? '✔ ' + d.dataset.etapa + ' aprovado' : '✘ ' + d.dataset.etapa + ' negado') : st.dataset.orig;
              st.className = 'st ' + (valida ? (x.decisao === 'aprovado' ? 'ok' : 'erro') : 'espera'); }
    const art = d.closest('article');
    if (art) art.dataset.bucket = valida ? (x.decisao === 'aprovado' ? 'aprovado-agora' : 'negado-agora') : art.dataset.b0;
    if (valida) {
      x.decisao === 'aprovado' ? ap++ : ng++;
      d.querySelectorAll('button,input').forEach(b => b.style.display = 'none');
      if (!f) { f = document.createElement('div'); d.after(f); }
      f.className = 'flag ' + x.decisao;
      f.innerHTML = (x.decisao === 'aprovado' ? '✔ ' + d.dataset.etapa + ' aprovado' : '✘ negado') + (x.nota ? ' · ' + x.nota.replace(/</g, '&lt;') : '') + '<button>desfazer</button>';
      f.querySelector('button').onclick = () => decidir(d.dataset.pasta, d.dataset.etapa, 'desfazer');
    } else { falta++; d.querySelectorAll('button').forEach(b => b.style.display = ''); if (f) f.remove(); }
  });
  if (typeof recontar === 'function') { recontar(); aplicar(); }
  document.querySelectorAll('li[data-pasta]').forEach(li => { const x = decisoes[li.dataset.pasta]; if (x) li.dataset.dec = x.decisao; else delete li.dataset.dec; });
  aviso(ap + ng ? `Você decidiu ${ap + ng} agora (${ap} ✔ · ${ng} ✘). As sessões aplicam e agendam na próxima rodada.` : '');
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
  const j = await r.json().catch(() => ({}));
  if (decisao === 'desfazer') delete decisoes[pasta]; else decisoes[pasta] = { etapa, decisao, nota, em: j.em || '9999' };
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
    for st, nomes in ({} if True else aguardando).items():  # os quadros da aba Aprovar já mostram essas contagens
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
        cat = m.get("categoria") or "novidade"
        capa_ig = (f'<a class="chip ig" href="https://raw.githubusercontent.com/lanceseternosedits-maker/lances-eternos-estudio/midia-ia/ia/posts/{esc(nome)}/capa_instagram.jpg">📲 capa IG</a>'
                   if c["pasta"] and (c["pasta"] / "capa_instagram.jpg").exists() else "")
        responder = ""
        if c["pasta"] and c["pubs"] and (c["pasta"] / "resposta_dm.txt").exists():
            dm = (c["pasta"] / "resposta_dm.txt").read_text(encoding="utf-8").strip()
            palavra = (m.get("cta") or "").upper()
            responder = (f'<details class="resp"><summary>💬 Responder comentários{" (" + esc(palavra) + ")" if palavra else ""}</summary>'
                         f'<p class="mut">1) No comentário com a palavra, responda (toque para copiar, varia sozinho):</p>'
                         f'<button class="copiar" data-resp="1">📋 Copiar resposta pública</button>'
                         f'<p class="mut">2) Na DM da pessoa, cole:</p><textarea readonly rows="6">{esc(dm)}</textarea>'
                         f'<button class="copiar" data-dm="1">📋 Copiar DM</button></details>')
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
            versao = ""  # decisão de vídeo só vale para a versão que o Vitor viu (checagem roda no container em UTC)
            if etapa == "vídeo" and (c["meta"].get("checagem") or {}).get("em"):
                try:
                    versao = (dt.datetime.strptime(c["meta"]["checagem"]["em"], "%Y-%m-%d %H:%M") - dt.timedelta(hours=3)).strftime("%Y-%m-%d %H:%M")
                except ValueError:
                    versao = ""
            decide = (f'<div class="decide" data-pasta="{esc(nome)}" data-etapa="{etapa}" data-versao="{versao}" data-dia="{esc(c["quando"][:10])}">'
                      f'<span class="chance {ch["nivel"].replace(" ", "-").replace("é", "e")}" title="chance estimada de ser bem recebido">🔥 {ch["pct"]}%<small>{esc(ch["nivel"])}</small></span>'
                      f'<button class="sim">✔ Aprovar {etapa}</button><button class="nao">✘ Negar</button></div>{porque}')
        b = balde(c["status"])
        etapa_attr = f' data-etapa="{"vídeo" if decide and "Aprovar vídeo" in decide else "roteiro"}"' if decide else ""
        html_cartoes.append(
            f'<article data-pasta="{esc(nome)}" data-status="{esc(c["status"])}" data-bucket="{b}" data-b0="{b}"{etapa_attr} data-cat="{esc(cat)}" data-quando="{esc(c["quando"][:16])}"{pct_attr}>{img}<div class="info">'
            f'<div class="topo"><span class="cat">{CATEGORIAS.get(cat, cat)}</span> <span class="st {classe(c["status"])}">{esc(c["status"])}</span></div>'
            f'<h4 title="{esc(nome)}">{esc(c["titulo"][:110])}</h4><p class="quando">📅 {esc(quando_bonito(c["quando"]))}</p><p class="sub">{esc(detalhes)}</p>'
            f'<div class="chips">{chips}{capa_ig}</div>{"<p class=met>" + "<br>".join(esc(x) for x in met) + "</p>" if met else ""}{chk}{responder}{rot_html}{decide}</div></article>')

    # ---- gastos (painel/gastos.json + Gemini estimado pelo nº de vídeos com voz)
    g = ler(PAINEL / "gastos.json", {}) or {}
    cambio = g.get("cambio_brl") or 5.4
    mes = f"{agora:%Y-%m}"
    linhas_g, total_mes = [], 0.0
    for f in g.get("fixos", []):
        total_mes += f.get("valor_usd", 0)
        linhas_g.append((f["nome"], f.get("valor_usd", 0), "por mês", f.get("obs", ""), f.get("fonte", "")))
    for u in g.get("por_uso", []):
        n = sum(1 for d in (IA / "posts").iterdir() if d.is_dir() and d.name >= u.get("desde", "") and d.name[:7] <= mes
                and (d / "reel.mp4").exists() and (d / "roteiro.json").exists())
        v = round(n * u.get("usd_por_video", 0), 2)
        total_mes += v
        linhas_g.append((u["nome"], v, f"{n} vídeos × US$ {u.get('usd_por_video', 0):.2f}".replace(".", ","), u.get("obs", ""), u.get("fonte", "estimado")))
    pub_mes = len({p["data"] for p in publicacoes if p["status"] == "PUBLISHED" and p["rede"] == "instagram" and p["data"][:7] == mes})
    por_video = total_mes / pub_mes if pub_mes else 0
    br = lambda v: f"{v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    brl = lambda v: f"R$ {br(v * cambio)}"
    usd = lambda v: f"US$ {br(v)}"
    tabela_g = "".join(f'<tr><td><b>{esc(n)}</b><br><small>{esc(o)} · {esc(fo)}</small></td><td class="num"><b>{usd(v)}</b><br><small>{esc(q)}</small></td></tr>'
                       for n, v, q, o, fo in linhas_g)
    html_gastos = (f'<div class="filas"><div class="kpi"><b>{usd(total_mes)}</b><span>total do mês</span></div>'
                   f'<div class="kpi"><b>{usd(sum(v for n, v, q, o, fo in linhas_g if "por mês" not in q))}</b><span>por uso (Gemini)</span></div>'
                   f'<div class="kpi"><b>{usd(por_video)}</b><span>por post publicado ({pub_mes} no mês)</span></div></div>'
                   f'<table class="gastos"><tr><th>Serviço</th><th class="num">Valor</th></tr>{tabela_g}</table>'
                   f'<p class="mut" style="font-size:12px">Fixos: valores do plano. Gemini: estimado pelo nº de vídeos com voz desde que a chave paga começou (05/11); '
                   f'a fatura real fica no Google Cloud. Teto aprovado: US$ {br(g.get("teto_por_video_usd", 0.5))} por vídeo. Para ajustar valores, edite <code>ia/painel/gastos.json</code>.</p>')


    # ---- resultados (painel/resultados.json do analista.py + painel/insights.json do agente analista)
    res = ler(PAINEL / "resultados.json", {}) or {}
    ins = ler(PAINEL / "insights.json", {}) or {}
    milhar = lambda v: f"{int(v or 0):,}".replace(",", ".")
    num = lambda v: "–" if v is None else f"{v:g}".replace(".", ",")
    tot = res.get("totais") or {}
    TIPO = {"fazer_mais": ("🔁", "Fazer mais", "ok"), "corrigir": ("🛠", "Corrigir", "warn"), "testar": ("🧪", "Testar", "info"), "alerta": ("⚠️", "Alerta", "erro")}
    cards_ins = "".join(
        f'<div class="ins ins-{TIPO.get(i.get("tipo"), ("", "", "info"))[2]}"><p class="it">{TIPO.get(i.get("tipo"), ("💡", "Insight", ""))[0]} '
        f'{TIPO.get(i.get("tipo"), ("", "Insight", ""))[1]}</p><h4>{esc(i.get("titulo", ""))}</h4>'
        f'<p class="ev">📈 {esc(i.get("evidencia", ""))}</p><p class="ac">👉 {esc(i.get("acao", ""))}</p></div>' for i in ins.get("itens") or [])
    reels = res.get("reels") or []
    vmax = max([x["views"] for x in reels] or [1])
    linhas_r = "".join(
        f'<tr><td><a href="{esc(x.get("url") or "#")}" target="_blank"><b>{esc(x.get("titulo") or x.get("pasta") or "?")}</b></a><br>'
        f'<small>{esc(x["quando"][8:10])}/{esc(x["quando"][5:7])} {esc(x["quando"][11:])} · {esc(x["formato"])} · {CATEGORIAS.get(x["categoria"], x["categoria"])}</small>'
        f'<div class="barra"><i style="width:{max(2, round(100 * x["views"] / vmax))}%"></i></div></td>'
        f'<td class="num"><b>{milhar(x["views"])}</b><br><small>{num(x["vs_mediana"])}× mediana</small></td>'
        f'<td class="num">{num(x["passou_3s_pct"])}%<br><small>{"100%+" if (x.get("assistido_pct") or 0) > 100 else num(x.get("assistido_pct")) + "%"} visto</small></td>'
        f'<td class="num">{num(x["salvar_pct"])}% 💾<br><small>{num(x["enviar_pct"])}% ✈️ · {num(x["comentar_pct"])}% 💬</small></td></tr>' for x in reels)
    def tabela_grupo(nome, g):
        return (f'<h3>{nome}</h3><table class="gastos"><tr><th>Grupo</th><th class="num">Mediana views</th><th class="num">Salvam</th></tr>'
                + "".join(f'<tr><td><b>{esc(CATEGORIAS.get(x["nome"], x["nome"]))}</b> <small>({x["n"]})</small></td><td class="num">{milhar(x["mediana_views"])}</td>'
                          f'<td class="num">{num(x["salvar_pct"])}%</td></tr>' for x in g) + '</table>')
    html_resultados = ('<p class="mut" style="font-size:12px">Sem leitura ainda: rode <code>python3 painel/analista.py</code>.</p>' if not res else
        f'<div class="filas"><div class="kpi"><b>{milhar(tot.get("views_ig"))}</b><span>views no Instagram</span></div>'
        f'<div class="kpi"><b>{milhar(tot.get("mediana_views_ig"))}</b><span>mediana por Reel</span></div>'
        f'<div class="kpi"><b>{milhar(tot.get("salvamentos"))} · {milhar(tot.get("envios"))}</b><span>salvos · envios</span></div></div>'
        f'<div class="analista"><p class="it">🤖 Agente analista · leitura de {esc(str(ins.get("em") or res.get("lido_em") or "")[8:10])}/{esc(str(ins.get("em") or "")[5:7])} {esc(str(ins.get("em") or "")[11:16])}</p>'
        f'<p>{esc(ins.get("resumo") or "")}</p></div>{cards_ins}'
        + ("<h3>Automático (regras)</h3><ul class='auto'>" + "".join(f"<li>{esc(a)}</li>" for a in res.get("insights_auto") or []) + "</ul>")
        + f'<h3>Reels ({len(reels)}, {esc(" a ".join(f"{d[8:10]}/{d[5:7]}" for d in res.get("periodo") or []))})</h3>'
        f'<table class="gastos res"><tr><th>Reel</th><th class="num">Views</th><th class="num">Passa 3 s</th><th class="num">Salvam</th></tr>{linhas_r}</table>'
        + tabela_grupo("Por formato", res.get("por_formato") or []) + tabela_grupo("Por categoria", res.get("por_categoria") or [])
        + tabela_grupo("Por horário", res.get("por_faixa") or [])
        + f'<h3>TikTok</h3><p class="mut" style="font-size:13px">Mediana por vídeo: <b>{num(tot.get("mediana_tiktok_video"))}</b> views · posts de fotos: <b>{num(tot.get("mediana_tiktok_fotos"))}</b>.</p>'
        f'<p class="mut" style="font-size:12px">Fonte: Metricool ({esc(str(res.get("lido_em") or ""))}), atualiza com ~1 dia de atraso. Porcentagens sobre o alcance. '
        f'O agente analista lê de novo 2× por dia e reescreve os insights.</p>')

    cont = defaultdict(int)
    for c in cartoes:
        cont[balde(c["status"])] += 1
    pend = "".join(f"<li>{p}</li>" for p in pendencias)
    BALDES = [("aprovar", "📥 Pra aprovar"), ("producao", "🛠 Em produção"), ("agendado", "🗓 Agendados"), ("publicado", "✅ Publicados"),
              ("negado", "✘ Negados"), ("outros", "• Outros")]
    chips_todos = "".join(f'<button class="fb" data-b="{k}">{v} <b data-cont="{k}">{cont.get(k, 0)}</b></button>' for k, v in BALDES)
    chips_cat = "".join(f'<button class="fc" data-c="{k}">{v}</button>' for k, v in CATEGORIAS.items())

    pagina = f"""<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Painel IA em 60s</title>
<link rel="apple-touch-icon" href="icone-180.png"><link rel="icon" href="icone-512.png"><link rel="manifest" href="manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="IA em 60s"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="theme-color" content="#0f1115">
<style>
:root{{--bg:#0d0f13;--card:#171a21;--card2:#1e222b;--line:#272c36;--tx:#eceef2;--mut:#9aa0ab;--ok:#3ecf8e;--ag:#5aa9ff;--esp:#ffb547;--erro:#ff6b6b;--ac:#ff8a3d}}
*{{box-sizing:border-box;-webkit-tap-highlight-color:transparent}}
body{{margin:0;font:15px/1.45 -apple-system,system-ui,Segoe UI,sans-serif;background:var(--bg);color:var(--tx);padding-bottom:calc(76px + env(safe-area-inset-bottom))}}
header{{position:sticky;top:0;z-index:10;background:#0d0f13ee;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);padding:calc(10px + env(safe-area-inset-top)) 16px 10px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:8px}}
header h1{{margin:0;font-size:19px;flex:1}}header h1 small{{display:block;font-size:11px;font-weight:500;color:var(--mut)}}
.ib{{font:inherit;font-size:13px;font-weight:600;padding:7px 11px;border-radius:20px;border:1px solid var(--line);background:var(--card);color:var(--tx);cursor:pointer}}
#sino{{border-color:#ffb54766;color:var(--esp)}}#sino.ok{{border-color:#3ecf8e66;color:var(--ok)}}
main{{padding:12px 14px 20px;max-width:1100px;margin:auto}}
.aba{{display:none}}body[data-tab=aprovar] .aba-aprovar,body[data-tab=agenda] .aba-agenda,body[data-tab=publicados] .aba-publicados,body[data-tab=todos] .aba-todos,body[data-tab=gastos] .aba-gastos,body[data-tab=resultados] .aba-resultados{{display:block}}
body[data-tab=gastos] #grade,body[data-tab=gastos] #vazio,body[data-tab=resultados] #grade,body[data-tab=resultados] #vazio{{display:none!important}}
.ins{{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--mut);border-radius:14px;padding:10px 12px;margin:0 0 8px}}.ins h4{{margin:2px 0 6px;font-size:15px}}.ins p{{margin:4px 0;font-size:13px}}.ins .ev{{color:var(--mut)}}.it{{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--mut);margin:0}}.ins-ok{{border-left-color:#3fb950}}.ins-warn{{border-left-color:#d29922}}.ins-info{{border-left-color:#58a6ff}}.ins-erro{{border-left-color:var(--erro)}}.analista{{background:linear-gradient(135deg,#2a1f4a,#1c2a3f);border-radius:14px;padding:12px;margin:0 0 10px}}.analista p{{margin:4px 0;font-size:14px}}.barra{{height:6px;background:var(--line);border-radius:3px;margin-top:6px}}.barra i{{display:block;height:100%;background:#e8834a;border-radius:3px}}table.res .num{{width:78px}}table.res a{{color:inherit;text-decoration:none}}ul.auto{{font-size:13px;color:var(--mut);padding-left:18px}}ul.auto li{{margin:4px 0}}
.kpi{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px 8px;text-align:center}}.kpi b{{display:block;font-size:19px}}.kpi span{{font-size:11px;color:var(--mut)}}
table.gastos{{table-layout:fixed;width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden;font-size:13px}}
table.gastos th{{text-align:left;color:var(--mut);font-weight:600;padding:8px 10px;border-bottom:1px solid var(--line)}}table.gastos td{{padding:10px;border-bottom:1px solid var(--line);vertical-align:top}}
table.gastos small{{color:var(--mut);font-size:11px}}.num{{text-align:right;width:118px}}
h2{{font-size:17px;margin:18px 0 10px}}.mut{{color:var(--mut)}}
.filas{{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:2px 0 12px}}
.filas button{{font:inherit;font-size:14px;font-weight:700;padding:12px 6px;border-radius:14px;border:1px solid var(--line);background:var(--card);color:var(--mut);cursor:pointer}}
.filas button b{{display:block;font-size:22px;color:var(--tx)}}.filas button.on{{color:var(--tx);border-color:var(--ag);background:#5aa9ff14}}
.filas button[data-f=aprov].on{{border-color:var(--ok);background:#3ecf8e14}}.filas button[data-f=neg].on{{border-color:var(--erro);background:#ff6b6b14}}
.resumo{{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:4px 0 12px}}
.box{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px;text-align:center}}.box b{{display:block;font-size:24px}}.box span{{font-size:12px;color:var(--mut)}}
.pend{{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--esp);border-radius:12px;padding:8px 14px;margin-bottom:12px;font-size:13px}}
.pend ul{{margin:0;padding-left:18px}}.pend li{{margin:4px 0}}.pend details ul{{columns:2;font-size:12px;color:var(--mut)}}
.seg{{display:flex;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:3px;gap:3px;margin-bottom:10px}}
.seg button{{flex:1;font:inherit;font-size:13px;font-weight:600;padding:8px 6px;border-radius:9px;border:0;background:none;color:var(--mut);cursor:pointer}}.seg button.on{{background:var(--card2);color:var(--tx)}}
.chipsbar{{display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;margin-bottom:6px;scrollbar-width:none}}.chipsbar::-webkit-scrollbar{{display:none}}
.chipsbar button{{flex:none;font:inherit;font-size:13px;padding:6px 12px;border-radius:20px;border:1px solid var(--line);background:var(--card);color:var(--tx);cursor:pointer;white-space:nowrap}}
.chipsbar button.on{{border-color:var(--ag);color:var(--ag);background:#5aa9ff14}}.chipsbar b{{font-weight:700;margin-left:3px}}
.grade{{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px}}
article{{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;display:flex;transition:opacity .2s}}
article img,.semcapa{{width:108px;min-width:108px;aspect-ratio:9/16;height:auto;align-self:flex-start;object-fit:cover;background:#000}}.semcapa{{display:flex;align-items:center;justify-content:center;color:var(--mut);font-size:11px;height:192px}}
.info{{padding:10px 12px;min-width:0;flex:1}}.topo{{display:flex;flex-wrap:wrap;gap:6px;align-items:center}}
h4{{margin:6px 0 2px;font-size:15px;line-height:1.3}}.quando{{margin:2px 0;font-size:12px;color:var(--ag);font-weight:600}}.sub{{margin:2px 0;color:var(--mut);font-size:11px;word-break:break-word}}
.cat{{font-size:11px;font-weight:700;color:var(--tx);background:var(--card2);border-radius:8px;padding:2px 7px}}
.st{{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.02em}}.st.ok{{color:var(--ok)}}.st.agenda{{color:var(--ag)}}.st.espera{{color:var(--esp)}}.st.erro{{color:var(--erro)}}.st.neutro{{color:var(--mut)}}
.chips{{margin:6px 0}}.chip{{display:inline-block;font-size:12px;padding:3px 8px;border-radius:10px;margin:0 4px 4px 0;border:1px solid var(--line);color:var(--tx);text-decoration:none}}
.chip.ig{{border-color:#ff3fa466;color:#ff9ad5}}.chip.ok{{border-color:#3ecf8e66}}.chip.agenda{{border-color:#5aa9ff66}}.chip.erro{{border-color:var(--erro);color:var(--erro)}}
.met{{font-size:12px;margin:4px 0;color:var(--ok)}}details{{font-size:12px;margin-top:6px}}summary{{cursor:pointer;color:var(--mut)}}details ul{{padding-left:4px;list-style:none;margin:4px 0}}details li.erro{{color:var(--erro)}}details li.ok{{color:var(--mut)}}details li.aviso{{color:var(--esp)}}
.player{{width:100%;max-width:260px;aspect-ratio:9/16;border-radius:12px;background:#000;margin:8px 0 4px;display:block}}
.rot ul li{{margin:4px 0;color:var(--tx);font-size:13px}}.rot b{{color:var(--mut);font-weight:600}}
.decide{{margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;align-items:stretch}}
.decide button{{flex:1;min-width:110px;font:inherit;font-size:14px;font-weight:700;border-radius:12px;padding:10px;cursor:pointer;border:0}}
.decide .sim{{background:var(--ok);color:#06200f}}.decide .nao{{background:#ff6b6b26;color:var(--erro)}}
.decide input{{flex:1 1 100%}}
.chance{{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;font-weight:800;font-size:15px;border-radius:12px;padding:4px 10px;line-height:1.1;border:1px solid}}
.chance small{{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.04em}}
.chance.boa-aposta{{color:var(--ok);border-color:var(--ok);background:#3ecf8e1a}}.chance.medio{{color:var(--esp);border-color:var(--esp);background:#ffb5471a}}.chance.arriscado{{color:var(--erro);border-color:var(--erro);background:#ff6b6b1a}}
.porque ul li{{margin:3px 0;color:var(--tx)}}.porque span{{display:inline-block;min-width:28px;font-weight:700}}.porque .mais{{color:var(--ok)}}.porque .menos{{color:var(--erro)}}.porque .zero{{color:var(--mut)}}.porque p{{color:var(--mut);margin:4px 0 0}}
.flag{{display:inline-block;font-size:13px;font-weight:700;padding:6px 10px;border-radius:10px;margin-top:10px}}.flag.aprovado{{background:#3ecf8e22;color:var(--ok)}}.flag.negado{{background:#ff6b6b22;color:var(--erro)}}
.flag button{{margin-left:8px;background:none;border:none;color:var(--mut);font-size:12px;text-decoration:underline;cursor:pointer}}
article[data-bucket=decidido]{{opacity:.55}}
.semana{{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px}}
.dia{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px 12px}}.dia h3{{margin:0 0 6px;font-size:13px;text-transform:uppercase;color:var(--mut)}}
.dia ul{{list-style:none;margin:0;padding:0}}.dia li{{font-size:12px;padding:6px 0;border-top:1px solid var(--line)}}.dia li span{{display:inline-block;width:44px;font-weight:700}}
li.livre{{color:var(--esp)}}li.espera span{{color:var(--esp)}}li.ok span{{color:var(--ok)}}li.agenda span{{color:var(--ag)}}li.erro{{color:var(--erro)}}
.dia-todos{{float:right;font:inherit;font-size:10px;padding:2px 7px;border-radius:8px;border:1px solid var(--ok);background:none;color:var(--ok);cursor:pointer;text-transform:none}}
li[data-dec=aprovado]::before{{content:"✔";color:var(--ok);font-weight:700;margin-right:3px}}li[data-dec=negado]{{text-decoration:line-through;opacity:.5}}
#aviso{{font-size:12px;color:var(--mut);margin:6px 2px}}
nav{{position:fixed;left:0;right:0;bottom:0;z-index:20;display:flex;background:#12151bf2;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid var(--line);padding:6px 6px calc(6px + env(safe-area-inset-bottom))}}
nav button{{flex:1;font:inherit;font-size:11px;font-weight:600;color:var(--mut);background:none;border:0;padding:4px 0;cursor:pointer;position:relative}}
nav button i{{display:block;font-style:normal;font-size:21px;line-height:1.3}}nav button.on{{color:var(--tx)}}
nav .badge{{position:absolute;top:0;left:56%;min-width:18px;padding:0 5px;border-radius:9px;background:var(--erro);color:#fff;font-size:11px;line-height:18px}}
details.resp textarea{{width:100%;box-sizing:border-box;background:var(--bg);color:var(--tx);border:1px solid var(--line);border-radius:8px;font-size:12px;padding:6px}}button.copiar{{display:block;width:100%;margin:6px 0;padding:9px;border-radius:10px;border:1px solid var(--line);background:#e8834a;color:#fff;font-weight:600}}details.resp p{{font-size:12px;margin:6px 0 2px}}
.vazio{{text-align:center;color:var(--mut);padding:30px 10px}}
</style></head><body data-tab="aprovar">
<header><h1>IA em 60s<small>atualizado {agora:%d/%m %H:%M} · Metricool {esc(str(snap.get("lido_em", "?"))[:16])}</small></h1>
<button id="sino" class="ib" style="display:none">🔔 Ativar</button><button id="atualizar" class="ib" onclick="location.replace('/?t=' + Date.now() + location.hash)">↻</button></header>
<main>
<section class="aba aba-aprovar">
 <div class="filas" id="filas"><button data-f="pend" class="on">⏳ Pendentes <b data-cont="pend">0</b></button><button data-f="aprov">✔ Aprovados <b data-cont="aprov">0</b></button><button data-f="neg">✘ Negados <b data-cont="neg">0</b></button></div>
 <div id="aviso"></div>
 {('<div class="pend"><ul>' + pend + '</ul></div>') if pend else ''}
 <div class="seg" id="seg"><button data-e="" class="on">Tudo</button><button data-e="vídeo">🎬 Vídeos</button><button data-e="roteiro">📝 Roteiros</button></div>
 <div class="chipsbar" id="cats-a"><button data-c="" class="on">Todas</button>{chips_cat}<button id="porchance">🔥 maior chance</button></div>
</section>
<section class="aba aba-agenda"><h2>Semana</h2><div class="semana">{"".join(semana)}</div><h2>Próximos agendados</h2></section>
<section class="aba aba-publicados"><h2>Publicados</h2></section>
<section class="aba aba-resultados"><h2>📊 Resultados</h2>{html_resultados}</section>
<section class="aba aba-gastos"><h2>💰 Gastos de {agora:%m/%Y}</h2>{html_gastos}</section>
<section class="aba aba-todos"><h2>Todos os posts ({len(cartoes)})</h2><div class="chipsbar" id="baldes"><button data-b="" class="on">Todos</button>{chips_todos}</div><div class="chipsbar" id="cats-t"><button data-c="" class="on">Todas</button>{chips_cat}</div></section>
<div class="grade" id="grade">{"".join(html_cartoes)}</div>
<div class="vazio" id="vazio" style="display:none">Nada por aqui 🎉</div>
</main>
<nav><button data-t="aprovar"><i>📥</i>Aprovar<span class="badge" data-cont="pend"></span></button><button data-t="agenda"><i>📅</i>Agenda</button><button data-t="publicados"><i>✅</i>Publicados</button><button data-t="todos"><i>🗂</i>Todos</button><button data-t="resultados"><i>📊</i>Result.</button><button data-t="gastos"><i>💰</i>Gastos</button></nav>
<script>
const F = {{ fila: 'pend', e: '', ca: '', b: '', ct: '', chance: false }};
const FILA = {{ aprovar: 'pend', 'aprovado-agora': 'aprov', producao: 'aprov', 'negado-agora': 'neg', negado: 'neg' }};
const NORM = {{ 'aprovado-agora': 'producao', 'negado-agora': 'negado' }};
function visivel(a) {{
  const t = document.body.dataset.tab, b = a.dataset.bucket;
  if (t === 'aprovar') return FILA[b] === F.fila && (!F.e || (a.dataset.etapa || 'roteiro') === F.e) && (!F.ca || a.dataset.cat === F.ca) && (!F.chance || a.dataset.chance);
  if (t === 'agenda') return b === 'agendado' || b === 'producao' || b === 'aprovado-agora';
  if (t === 'publicados') return b === 'publicado';
  return (!F.b || (NORM[b] || b) === F.b) && (!F.ct || a.dataset.cat === F.ct);
}}
function ordenar() {{
  const t = document.body.dataset.tab, g = document.getElementById('grade');
  const arts = [...g.querySelectorAll('article')];
  const chave = (a) => {{
    const q = a.dataset.quando || '';
    if (t === 'aprovar') return '1' + (F.chance ? String(999 - (+a.dataset.chance || 0)).padStart(3, '0') : (a.dataset.etapa === 'vídeo' ? '0' : '1') + q);
    if (t === 'agenda') return q;
    return String(99999999999999 - +q.replace(/\\D/g, '')).padStart(14, '0');
  }};
  arts.sort((x, y) => chave(x) < chave(y) ? -1 : 1).forEach(a => g.appendChild(a));
}}
function aplicar() {{
  let n = 0;
  document.querySelectorAll('#grade article').forEach(a => {{ const v = visivel(a); a.style.display = v ? '' : 'none'; if (v) n++; }});
  ordenar();
  document.getElementById('vazio').style.display = n ? 'none' : '';
}}
function recontar() {{
  const c = {{}};
  document.querySelectorAll('#grade article').forEach(a => {{
    const b = a.dataset.bucket;
    c[NORM[b] || b] = (c[NORM[b] || b] || 0) + 1;
    if (FILA[b]) c[FILA[b]] = (c[FILA[b]] || 0) + 1;
  }});
  document.querySelectorAll('[data-cont]').forEach(el => {{ const v = c[el.dataset.cont] || 0; el.textContent = v; if (el.classList.contains('badge')) el.style.display = v ? '' : 'none'; }});
}}

const RESP = ['Te mandei na DM! 📩 Se não aparecer, olha em Solicitações de mensagem.', 'Enviado no direct! 🚀 Confere lá (às vezes cai em Solicitações).',
  'Mandei agora na DM 😉', 'Prontinho, tá na sua DM! 📩', 'Chegou aí? Mandei no direct 🙌'];
let nResp = 0;
document.addEventListener('click', async ev => {{
  const b = ev.target.closest('button.copiar'); if (!b) return;
  const txt = b.dataset.dm ? b.closest('details').querySelector('textarea').value : RESP[nResp++ % RESP.length];
  try {{ await navigator.clipboard.writeText(txt); }} catch (e) {{ const t = document.createElement('textarea'); t.value = txt; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }}
  const o = b.textContent; b.textContent = '✔ Copiado'; setTimeout(() => b.textContent = o, 1200);
}});
function aba(t) {{
  document.body.dataset.tab = t;
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('on', b.dataset.t === t));
  if (location.hash !== '#' + t) history.replaceState(null, '', '#' + t);
  aplicar(); window.scrollTo(0, 0);
}}
document.querySelectorAll('nav button').forEach(b => b.onclick = () => aba(b.dataset.t));
document.querySelectorAll('#filas button').forEach(b => b.onclick = () => {{ F.fila = b.dataset.f; document.querySelectorAll('#filas button').forEach(x => x.classList.toggle('on', x === b)); aplicar(); }});
document.querySelectorAll('#seg button').forEach(b => b.onclick = () => {{ F.e = b.dataset.e; document.querySelectorAll('#seg button').forEach(x => x.classList.toggle('on', x === b)); aplicar(); }});
document.querySelectorAll('#cats-a button:not(#porchance)').forEach(b => b.onclick = () => {{ F.ca = b.dataset.c; document.querySelectorAll('#cats-a button:not(#porchance)').forEach(x => x.classList.toggle('on', x === b)); aplicar(); }});
document.getElementById('porchance').onclick = (ev) => {{ F.chance = !F.chance; ev.currentTarget.classList.toggle('on', F.chance); aplicar(); }};
document.querySelectorAll('#baldes button').forEach(b => b.onclick = () => {{ F.b = b.dataset.b; document.querySelectorAll('#baldes button').forEach(x => x.classList.toggle('on', x === b)); aplicar(); }});
document.querySelectorAll('#cats-t button').forEach(b => b.onclick = () => {{ F.ct = b.dataset.c; document.querySelectorAll('#cats-t button').forEach(x => x.classList.toggle('on', x === b)); aplicar(); }});
""" + JS + """
const inicio = (location.hash || '').slice(1).replace('pendentes', 'aprovar');
recontar();
aba(['aprovar', 'agenda', 'publicados', 'todos', 'resultados', 'gastos'].includes(inicio) ? inicio : (document.querySelector('#grade article[data-bucket=aprovar]') ? 'aprovar' : 'agenda'));
</script></body></html>
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

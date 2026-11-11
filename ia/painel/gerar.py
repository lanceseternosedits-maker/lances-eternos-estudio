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
    if "reprovado" in s:  # reprovado no painel de revisão: fica com os negados
        return "negado"
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
        st_c = c["status"].lower()
        if "aguardando" in st_c or st_c == "roteiro aprovado":  # aprovado = vídeo em produção: a vaga não está livre
            for rede, quando in horarios_do_post(c["meta"]):
                if rede == "instagram" and quando not in ocupadas:
                    ocupadas[quando].append({"status": "AGUARDANDO" if "aguardando" in st_c else "roteiro aprovado", "texto": ("🎬 " if "aguardando" not in st_c else "") + c["titulo"], "rascunho": False, "pasta": c["pasta"].name})
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
                st = {"PUBLISHED": "publicado", "PENDING": "rascunho" if p.get("rascunho") else "agendado", "ERROR": "erro", "AGUARDANDO": "aguardando aprovação"}.get(p["status"], p["status"])
                tipo_li = "STORY" if p.get("tipo") == "STORY" else "POST"
                no_ar = "1" if p.get("status") == "PUBLISHED" else ""
                linhas.append(f'<li class="{classe(st)}" data-t="{dia}T{h}" data-tipo="{tipo_li}" data-noar="{no_ar}"{" data-pasta=" + chr(34) + esc(p["pasta"]) + chr(34) if p.get("pasta") else ""}><span>{h}</span>{esc(p["texto"][:70])}</li>')
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
            f'<a class="chip {classe({"PUBLISHED": "publicado", "PENDING": "agendado", "ERROR": "erro"}.get(p["status"], "rascunho"))}"'
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
            etapa = "vídeo" if ("vídeo" in c["status"].lower() or any((c["pasta"] / n).exists() for n in ("reel.mp4", "short.mp4"))) else "roteiro"  # status manda: clone sem o mp4 marcava "roteiro" (09/11)
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
            rv = c["meta"].get("revisao") or {}  # painel de revisão (revisores de IA, skill revisao-roteiro)
            if rv.get("veredito") and etapa == "roteiro":
                ic = {"passou": "✅", "ajustado": "🛠️", "reprovado": "⛔"}.get(rv["veredito"], "🔎")
                itens = "".join(f'<li><b>{esc(r.get("revisor", ""))}</b> {esc(r.get("veredito", ""))}: {esc(r.get("nota", ""))}</li>' for r in rv.get("pareceres", []))
                ajustes = "".join(f'<li>{esc(x)}</li>' for x in rv.get("ajustes", []))
                porque += (f'<details class="revisao"><summary>{ic} Revisores: {esc(rv["veredito"])} · {esc(rv.get("resumo", ""))}</summary><ul>{itens}</ul>'
                           + (f'<p><b>O que foi ajustado:</b></p><ul>{ajustes}</ul>' if ajustes else "") + '</details>')
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

    # ---- 📈 Redes (agente de redes sociais: painel/redes.json, gerado por painel/redes.py)
    rd = ler(PAINEL / "redes.json", {}) or {}
    def bloco_rede(nome, r):
        rs, se = r.get("resumo") or {}, r.get("serie") or []
        vals = [x.get("visualizacoes") or 0 for x in se][-14:]
        mx = max(vals or [0]) or 1
        barras = "".join(f'<i style="height:{max(2, round(v / mx * 36))}px" title="{v:,.0f}"></i>' for v in vals)
        ganho = rs.get("ganho_7d")
        return (f'<div class="rede"><p class="it">{nome}</p><b class="big">{milhar(rs.get("seguidores"))}</b> <span class="mut">seguidores'
                + (f' · <b style="color:var(--ok)">{"+" if (ganho or 0) >= 0 else ""}{ganho}</b> em 7 dias' if ganho is not None else "") + '</span>'
                f'<p class="mut" style="margin:4px 0">{milhar(rs.get("visualizacoes_7d"))} visualizações em 7 dias · {milhar(rs.get("visualizacoes_30d"))} em 30</p>'
                f'<div class="spark">{barras}</div></div>')
    html_redes = ('' if not rd else
        f'<h3>📈 Redes · seguidores e alcance</h3><div class="redes">{bloco_rede("📸 Instagram", rd.get("instagram") or {})}{bloco_rede("🎵 TikTok", rd.get("tiktok") or {})}</div>'
        + ('<div class="analista"><p class="it">📈 Agente de redes · leitura de ' + esc(str(rd.get("lido_em") or "")[8:10] + "/" + str(rd.get("lido_em") or "")[5:7]) + '</p>'
           + "".join(f"<p>• {esc(x)}</p>" for x in rd.get("leitura") or []) + '</div>' if rd.get("leitura") else '')
        + '<style>.redes{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 10px}.rede{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px 12px;font-size:13px}.rede .big{font-size:24px}.spark{display:flex;align-items:flex-end;gap:2px;height:38px;margin-top:6px}.spark i{flex:1;background:#58a6ff;border-radius:2px 2px 0 0;min-width:3px}</style>')
    html_resultados = html_redes + '<h3>🎬 Reels</h3>' + html_resultados
    # ---- 💵 Caixa do produto (agente financeiro): números ao vivo de /api/financeiro, preenchidos pelo script da página
    html_gastos = (f'<div id="caixa" data-gastos-brl="{total_mes * cambio:.2f}" data-cambio="{cambio}"><h3>💵 Super Assistente de IA</h3><p class="mut">carregando vendas…</p></div>'
                   + '<h3>💸 Gastos do projeto</h3>' + html_gastos)
    # ---- 🧠 Consumo da Claude (Vitor, 09/11): quem gasta o limite de uso; dados em painel/consumo.json (python3 painel/consumo.py)
    html_consumo = '<p class="mut">Sem leitura ainda (rode python3 painel/consumo.py).</p>'
    ck = IA / "painel" / "consumo.json"
    if ck.exists():
        C = json.loads(ck.read_text(encoding="utf-8"))
        barra = lambda pct, cor: f'<div class="cbar"><i style="width:{max(pct, 0.6)}%;background:{cor}"></i></div>'
        pizza, acc = [], 0.0
        for g in C["grupos"]:
            pizza.append(f'{g["cor"]} {acc:.2f}% {acc + g["pct"]:.2f}%'); acc += g["pct"]
        tk = C["tokens_pct"]; TKN = [("cache_lido", "releitura de contexto", "#ff7a3d"), ("cache_gravado", "contexto novo guardado", "#f5b83d"),
                                     ("saida", "texto escrito", "#38c172"), ("entrada", "texto lido novo", "#3d7bf2")]
        html_consumo = ('<div class="filas"><div class="kpi"><b>US$ ' + f'{C["total_usd"]:,.0f}'.replace(",", ".") + '</b><span>peso total (equivalente em API)</span></div>'
            + f'<div class="kpi"><b>{C["grupos"][0]["pct"]}%</b><span>{esc(C["grupos"][0]["nome"])}</span></div>'
            + f'<div class="kpi"><b>{tk.get("cache_lido", 0)}%</b><span>dos tokens são releitura de contexto</span></div></div>'
            + '<div class="analista"><p class="it">🧠 Leitura</p>' + "".join(f"<p>• {esc(x)}</p>" for x in C["leitura"]) + '</div>'
            + '<h3>Por tarefa</h3><div class="cpie" style="background:conic-gradient(' + ",".join(pizza) + ')"></div>'
            + "".join(f'<div class="crow"><span><b>{esc(g["nome"])}</b><small>{g["sessoes"]} {"sessão" if g["sessoes"] == 1 else "sessões"} · US$ {g["usd"]:.2f}</small></span><em>{g["pct"]}%</em>{barra(g["pct"], g["cor"])}</div>' for g in C["grupos"])
            + '<h3>Por modelo</h3>' + "".join(f'<div class="crow"><span><b>{esc(m["modelo"])}</b><small>US$ {m["usd"]:.2f}</small></span><em>{m["pct"]}%</em>{barra(m["pct"], "#7b61ff" if "Opus" in m["modelo"] else "#3d7bf2")}</div>' for m in C["modelos"])
            + '<h3>Onde vão os tokens</h3><div class="cstack">' + "".join(f'<i style="width:{tk.get(k, 0)}%;background:{c}" title="{n}"></i>' for k, n, c in TKN) + '</div>'
            + '<div class="cleg">' + "".join(f'<span><i style="background:{c}"></i>{n} {tk.get(k, 0)}%</span>' for k, n, c in TKN) + '</div>'
            + '<h3>Sessões que mais pesaram</h3><table class="gastos"><tr><th>Sessão</th><th class="num">Peso</th></tr>'
            + "".join(f'<tr><td><b>{esc(t["titulo"])}</b><br><small>{esc(t["modelo"])} · desde {t["criada"][8:10]}/{t["criada"][5:7]} · {t["cache_lido_m"]} mi tokens relidos</small></td><td class="num"><b>US$ {t["usd"]:.2f}</b></td></tr>' for t in C["top"])
            + '</table><p class="mut">' + esc(C["nota"]) + f' Leitura de {esc(C["lido_em"][:16].replace("T", " "))} UTC.</p>'
            + '<style>.cpie{width:150px;height:150px;border-radius:50%;margin:6px auto 14px;box-shadow:inset 0 0 0 38px var(--bg,#0d1117)}'
            + '.crow{display:grid;grid-template-columns:1fr auto;gap:2px 10px;margin:8px 0}.crow span b{display:block;font-size:14px}.crow small{color:#8b949e;font-size:12px}.crow em{font-style:normal;font-weight:800;align-self:center}'
            + '.cbar{grid-column:1/-1;height:9px;background:#ffffff14;border-radius:9px;overflow:hidden}.cbar i{display:block;height:100%;border-radius:9px}'
            + '.cstack{display:flex;height:22px;border-radius:11px;overflow:hidden;margin:8px 0}.cstack i{display:block;height:100%}'
            + '.cleg{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12.5px}.cleg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px}</style>')

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
.aba{{display:none}}body[data-tab=aprovar] .aba-aprovar,body[data-tab=agenda] .aba-agenda,body[data-tab=publicados] .aba-publicados,body[data-tab=todos] .aba-todos,body[data-tab=gastos] .aba-gastos,body[data-tab=resultados] .aba-resultados,body[data-tab=equipe] .aba-equipe,body[data-tab=consumo] .aba-consumo{{display:block}}
body[data-tab=gastos] #grade,body[data-tab=gastos] #vazio,body[data-tab=resultados] #grade,body[data-tab=resultados] #vazio,body[data-tab=equipe] #grade,body[data-tab=equipe] #vazio{{display:none!important}}
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
.revisao summary{{font-weight:700}}.revisao li b{{text-transform:capitalize}}
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
li[data-noar="1"]::before{{content:"✅";margin-right:4px}}li[data-noar="1"]{{opacity:.75}}li[data-noar="1"][data-dec]::before{{content:"✅"}}
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
<section class="aba aba-resultados"><h2>📊 Resultados</h2><div class="analista" id="robo"><p class="it">🤖 Robô de comentários</p><p>carregando…</p></div>{html_resultados}</section>
<section class="aba aba-equipe"><h2>🏢 Equipe</h2></section>
<section class="aba aba-gastos"><h2>💰 Gastos de {agora:%m/%Y}</h2>{html_gastos}</section>
<section class="aba aba-consumo"><h2>🧠 Consumo da Claude</h2>{html_consumo}</section>
<section class="aba aba-todos"><h2>Todos os posts ({len(cartoes)})</h2><div class="chipsbar" id="baldes"><button data-b="" class="on">Todos</button>{chips_todos}</div><div class="chipsbar" id="cats-t"><button data-c="" class="on">Todas</button>{chips_cat}</div></section>
<div class="grade" id="grade">{"".join(html_cartoes)}</div>
<div class="vazio" id="vazio" style="display:none">Nada por aqui 🎉</div>
</main>
<nav><button data-t="aprovar"><i>📥</i>Aprovar<span class="badge" data-cont="pend"></span></button><button data-t="agenda"><i>📅</i>Agenda</button><button data-t="publicados"><i>✅</i>Publicados</button><button data-t="todos"><i>🗂</i>Todos</button><button data-t="resultados"><i>📊</i>Result.</button><button data-t="equipe"><i>🏢</i>Equipe</button><button data-t="gastos"><i>💰</i>Gastos</button><button data-t="consumo"><i>🧠</i>Uso</button></nav>
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

fetch('/api/ig-status').then(r => r.json()).then(s => {{
  const el = document.getElementById('robo'); if (!el) return;
  if (!s.conectado) {{ el.innerHTML = '<p class="it">🤖 Robô de comentários</p><p>Instagram ainda não conectado. <a href="/conectar" style="color:#f0a070">Conectar</a></p>'; return; }}
  const t = Object.fromEntries((s.totais || []).map(x => [x.acao, x.n]));
  const dm = Object.entries(t).filter(([k]) => k.startsWith('dm')).reduce((a, [, n]) => a + n, 0), pub = t['resposta'] || 0;
  const rec = (s.recentes || []).slice(0, 5).map(x => `<li>@${{x.usuario}} · ${{x.palavra}} · ${{x.acao}}${{x.erro && !x.acao.startsWith('dm') ? ' ⚠' : ''}}</li>`).join('');
  el.innerHTML = `<p class="it">🤖 Robô de comentários · @${{s.usuario}} · última rodada ${{(s.ultima || '').slice(11)}}</p><p><b>${{dm}}</b> DMs enviadas · <b>${{pub}}</b> respondidos com o link da bio${{s.pausado ? ' · ⏸ pausado' : ''}}</p>` + (rec ? `<ul class="auto">${{rec}}</ul>` : '');
}}).catch(() => {{ const el = document.getElementById('robo'); if (el) el.style.display = 'none'; }});
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
aba(['aprovar', 'agenda', 'publicados', 'todos', 'resultados', 'gastos', 'consumo', 'equipe'].includes(inicio) ? inicio : (document.querySelector('#grade article[data-bucket=aprovar]') ? 'aprovar' : 'agenda'));
// ✅ na Agenda (Vitor, 08/11): confere ao vivo no Instagram o que já foi ao ar (Reel/post e story) e marca a linha
fetch('/api/publicados', { credentials: 'same-origin' }).then((r) => r.ok ? r.json() : { itens: [] }).then(({ itens = [] }) => {
  const ts = itens.map((i) => ({ t: Date.parse(i.t), tipo: i.tipo, url: i.url })).filter((i) => !isNaN(i.t));
  document.querySelectorAll('.dia li[data-t]').forEach((li) => {
    const slot = Date.parse(li.dataset.t + ':00-03:00');
    if (isNaN(slot) || slot > Date.now()) return;
    const story = li.dataset.tipo === 'STORY';
    const m = ts.find((i) => (story ? i.tipo === 'STORY' : i.tipo !== 'STORY') && i.t >= slot - 10 * 60e3 && i.t <= slot + 60 * 60e3);
    if (m) { li.dataset.noar = '1'; if (m.url) li.title = 'no ar: ' + m.url; }
  });
}).catch(() => {});
// 🏢 Equipe (Vitor, 08/11): escritório em pixel art com pessoinhas. Na mesa = trabalhando; fora da mesa = livre, curtindo a área de lazer.
(() => {
  const W = 180, H = 230, OFF = 22; // OFF = quanto o escritório desceu para caber a parede de vidro
  // cada agente: cor da camisa, cabelo, pele e do que ele gosta quando está livre (peso de cada lugar)
  const AG = [
    { id: 'cacador', nome: 'Caçador', faz: 'busca referências virais lá fora', quando: 'seg e qui 03:53', cor: '#3fb950', cab: '#5b3a1e', pele: '#e0ac69', chapeu: '#8b6b3a', gosta: { navegar: 5, cafe: 2, conversa: 2, gato: 1 } },
    { id: 'roteirista', nome: 'Roteirista', faz: 'escreve os 28 roteiros da rodada', quando: 'seg e qui 04:47', cor: '#58a6ff', cab: '#1f1f1f', pele: '#c68642', gosta: { sofa: 4, cafe: 4, conversa: 2 } },
    { id: 'revisores', nome: 'Revisores', faz: 'os 4 revisores conferem cada roteiro', quando: 'logo depois do roteirista', cor: '#ff6b6b', cab: '#b55239', pele: '#f1c27d', oculos: true, gosta: { sinuca: 5, conversa: 2, lanche: 1, pingpong: 2 } },
    { id: 'estudio', nome: 'Estúdio', faz: 'renderiza os vídeos aprovados', quando: 'quando você aprova roteiros', cor: '#e8834a', cab: '#2b2b2b', pele: '#8d5524', fone: true, gosta: { fliperama: 5, sofa: 2, sinuca: 2, pingpong: 1 } },
    { id: 'analista', nome: 'Analista', faz: 'lê as métricas e escreve insights', quando: 'todo dia 07:37 e 19:43', cor: '#d2a8ff', cab: '#e6c27a', pele: '#ffdbac', oculos: true, gosta: { lanche: 4, sinuca: 3, navegar: 2 } },
    { id: 'cobranca', nome: 'Cobrança', faz: 'te avisa do que espera aprovação', quando: 'todo dia 18:23', cor: '#f2cc60', cab: '#7a3b1e', pele: '#e0ac69', gosta: { conversa: 6, gato: 3, cafe: 2 } },
    { id: 'robo', nome: 'Robô das DMs', faz: 'responde quem comenta a palavra', quando: 'a cada 10 min', cor: '#79c0ff', robo: true, gosta: { tomada: 1 } },
    { id: 'financeiro', nome: 'Financeiro', faz: 'cuida das vendas e do lucro do Super Assistente', quando: 'todo dia 21:07 (vendas chegam na hora)', cor: '#2ea043', cab: '#3b2a1a', pele: '#f1c27d', gravata: true, gosta: { cafe: 3, lanche: 2, conversa: 2, pingpong: 2 } },
    { id: 'social', nome: 'Redes', faz: 'acompanha seguidores e alcance no IG e no TikTok', quando: 'todo dia 21:37', cor: '#ff7eb6', cab: '#e8834a', pele: '#ffdbac', celular: true, gosta: { navegar: 3, sofa: 2, conversa: 3, gato: 2, pingpong: 2 } },
  ];
  const MESAS = [[6, 22], [42, 22], [78, 22], [114, 22], [150, 22], [6, 58], [42, 58], [78, 58], [114, 58], [150, 58]];
  const ORDEM = ['cacador', 'roteirista', 'revisores', 'estudio', 'analista', 'cobranca', 'robo', 'financeiro', 'social'];
  AG.forEach((g, i) => { g.mesa = MESAS[ORDEM.indexOf(g.id)]; g.x = 70 + (i % 4) * 8; g.y = 150 + Math.floor(i / 4) * 10; g.alvo = null; g.faz_agora = null; g.ate = 0; g.frame = 0; g.dir = 1; g.emote = ''; g.emoteAte = 0; });
  // lugares da área de lazer: onde a pessoa fica, o que faz e os emojis que solta
  const LUGARES = {
    sinuca: { vagas: [[8, 124], [56, 124]], emotes: ['🎱', '😎', '🔥', 'boa!'] },
    lanche: { vagas: [[112, 124], [124, 124]], emotes: ['🍩', '🥤', '🍕', '😋'] },
    cafe: { vagas: [[78, 118]], emotes: ['☕', '😌'] },
    sofa: { vagas: [[22, 196], [34, 196], [46, 196]], emotes: ['📺', '😂', '🍿'] },
    navegar: { vagas: [[100, 170]], emotes: ['🌐', '👀', 'achei um trend!', '🤯'] },
    fliperama: { vagas: [[128, 170]], emotes: ['🕹️', '🏆', 'recorde!'] },
    gato: { vagas: [], emotes: ['😺', '🐾', '❤️'] },
    tomada: { vagas: [[132, 98]], emotes: ['🔋', '⚡'] },
    pingpong: { vagas: [[161, 130], [161, 156]], emotes: ['🏓', 'ponto!', '😤', '😂'] },
  };
  const gato = { x: 70, y: 186, alvo: [70, 186], ate: 0, dorme: true };
  const sec = document.querySelector('.aba-equipe');
  if (!sec) return;
  const st = document.createElement('style');
  st.textContent = '.escr{position:relative;width:100%;max-width:432px;margin:0 auto 12px}.escr canvas{width:100%;image-rendering:pixelated;border-radius:14px;border:1px solid var(--line);display:block}' +
    '.bal{position:absolute;transform:translate(-50%,-100%);background:#fff;color:#111;font-size:10px;line-height:1.2;padding:3px 6px;border-radius:8px;max-width:120px;text-align:center;box-shadow:0 1px 0 #0006;pointer-events:none;transition:left .1s linear,top .1s linear}.bal:after{content:"";position:absolute;left:50%;bottom:-4px;border:4px solid transparent;border-top-color:#fff;border-bottom:0;margin-left:-4px}.bal.em{font-size:12px;padding:1px 5px}.bal.av{background:#ffb547}' +
    '.tag{position:absolute;transform:translateX(-50%);font-size:9px;font-weight:700;color:#111;padding:1px 5px;border-radius:6px;white-space:nowrap;pointer-events:none}' +
    '.hbt{display:flex;gap:6px;align-items:center;margin:0 0 8px}.hbt button{background:var(--card);border:1px solid var(--line);color:inherit;border-radius:999px;padding:5px 12px;font-size:13px}.hbt button.on{background:#e8834a;border-color:#e8834a;color:#111;font-weight:700}.hbt a{margin-left:auto;font-size:13px;color:var(--mut);text-decoration:none}.hbf iframe{width:100%;height:72vh;min-height:420px;border:1px solid var(--line);border-radius:14px;display:block;background:#1d2421;margin:0 0 12px}' +
    '.agc{display:flex;gap:10px;align-items:flex-start;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:8px 10px;margin:0 0 6px;font-size:13px}.agc b.n{display:block}.agc .pt{width:10px;height:10px;border-radius:50%;margin-top:5px;flex:none;background:#555}.agc.on .pt{background:#3fb950;box-shadow:0 0 6px #3fb950}.agc.av .pt{background:#ffb547}.agc small{color:var(--mut)}';
  document.head.appendChild(st);
  const box = document.createElement('div'); box.className = 'escr';
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; box.appendChild(cv);
  const info = document.createElement('p'); info.style.cssText = 'font-size:12px;color:var(--mut);margin:0 0 8px';
  const lista = document.createElement('div');
  sec.appendChild(box); sec.appendChild(info); sec.appendChild(lista);
  // 🏨 Habblaud (Vitor, 11/11): o escritório do Habblaud (github.com/marmottajr/habblaud, MIT, com a ponte em
  // ferramentas/habblaud do main) mostrando a equipe; mora em /habblaud/ e lê o mesmo /api/atividade.
  // "Clássico" volta a este escritório desenhado aqui. A escolha fica no aparelho.
  let modo = localStorage.getItem('equipe-modo') === 'classico' ? 'classico' : 'habblaud';
  const hb = document.createElement('div');
  hb.innerHTML = '<div class="hbt"><button data-m="habblaud">🏨 Habblaud</button><button data-m="classico">🎨 Clássico</button><a href="/habblaud/index.html?equipe=1" target="_blank" rel="noopener">⛶ tela cheia</a></div><div class="hbf"></div>';
  sec.insertBefore(hb, box);
  const hbf = hb.querySelector('.hbf');
  const aplica = () => {
    hb.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.m === modo));
    box.style.display = modo === 'classico' ? '' : 'none';
    hbf.style.display = modo === 'habblaud' ? '' : 'none';
    // só carrega o Habblaud quando a aba Equipe é aberta (não pesa nas outras abas)
    if (modo === 'habblaud' && !hbf.firstChild && document.body.dataset.tab === 'equipe') {
      const f = document.createElement('iframe');
      f.src = '/habblaud/index.html?equipe=1'; f.title = 'Habblaud: o escritório da equipe'; f.allow = 'fullscreen';
      hbf.appendChild(f);
    }
  };
  hb.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { modo = b.dataset.m; localStorage.setItem('equipe-modo', modo); aplica(); }));
  document.querySelectorAll('nav button[data-t="equipe"]').forEach((b) => b.addEventListener('click', () => setTimeout(aplica, 0)));
  aplica();
  const pc = (v, t) => (v / t * 100) + '%';
  AG.forEach((g) => { const el = document.createElement('div'); el.className = 'tag'; el.textContent = g.nome; el.style.background = g.cor; el.style.left = pc(g.mesa[0] + 12, W); el.style.top = pc(g.mesa[1] + 26 + OFF, H); box.appendChild(el); });
  let x = cv.getContext('2d');
  const R = (c, a, b, w, h) => { x.fillStyle = c; x.fillRect(Math.round(a), Math.round(b), w, h); };
  let dados = {}, t = 0;
  const trab = (g) => (dados[g.id] || {}).estado === 'trabalhando';
  const parado = (g) => { const a = dados[g.id] || {}; return trab(g) && a.em && !g.robo && (Date.now() - Date.parse(a.em.replace(' ', 'T') + ':00-03:00')) > 3 * 3600e3; };
  const rnd = (n) => Math.floor(Math.random() * n);
  // ---------- paisagem lá fora (muda com a hora de Brasília) — desenhada num canvas à parte e atualizada a cada 1 s
  const VID = 16 + OFF; // altura da parede de vidro
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const ceuC = mk(W, VID), fundoC = mk(W, H);
  const PREDIOS = []; for (let px = 4, k = 0; px < W; px += 8 + (k % 3), k++) PREDIOS.push([px, 7 + ((k * 7) % 12)]);
  const JANELAS = []; for (let k = 0; k < 90; k++) JANELAS.push([(k * 37) % W, VID - 3 - ((k * 13) % 12), k % 3]);
  function hora() { return Number(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour: 'numeric', hour12: false })) % 24; }
  function ceu(seg) {
    const c = ceuC.getContext('2d'), h = hora();
    const fase = h >= 7 && h < 17 ? 'dia' : (h >= 17 && h < 19) || (h >= 5 && h < 7) ? 'tarde' : 'noite';
    const cores = { dia: ['#4fa9f5', '#bfe6ff'], tarde: ['#5b5fbf', '#ffb36b'], noite: ['#08122b', '#1f2f5c'] }[fase];
    const g = c.createLinearGradient(0, 0, 0, VID); g.addColorStop(0, cores[0]); g.addColorStop(1, cores[1]);
    c.fillStyle = g; c.fillRect(0, 0, W, VID);
    const P = (cor, a, b, w, hh) => { c.fillStyle = cor; c.fillRect(Math.round(a), Math.round(b), w, hh); };
    if (fase === 'noite') {
      for (let k = 0; k < 26; k++) if ((k * 7 + Math.floor(seg / 2)) % 9) P('#ffffff', (k * 53) % W, (k * 11) % 12 + 1, 1, 1);
      P('#f4f1d0', 112, 3, 5, 5); P(cores[0], 114, 3, 3, 3); // lua
    } else {
      P(fase === 'dia' ? '#fff3a0' : '#ff8a3d', fase === 'dia' ? 108 : 20, fase === 'dia' ? 3 : 10, 6, 6); // sol
      for (let k = 0; k < 3; k++) { const cx = ((seg * (0.5 + k * 0.2) + k * 60) % (W + 30)) - 15, cy = 3 + k * 4;
        P('#ffffffdd', cx, cy, 12, 3); P('#ffffffdd', cx + 3, cy - 2, 6, 2); }
    }
    for (let i = 0; i < W; i++) { const m = 6 + Math.round(4 * Math.sin(i / 11) + 2 * Math.sin(i / 5)); P(fase === 'noite' ? '#1b2747' : fase === 'tarde' ? '#7a5b8f' : '#7fa7c9', i, VID - m - 6, 1, m + 6); } // morros ao longe
    for (const [px, ph] of PREDIOS) P(fase === 'noite' ? '#10182e' : fase === 'tarde' ? '#4b3a5e' : '#5d7a94', px, VID - ph, 7, ph); // cidade
    if (fase !== 'dia') for (const [jx, jy, k] of JANELAS) if (PREDIOS.some(([px, ph]) => jx >= px && jx < px + 7 && jy >= VID - ph)) if ((k + Math.floor(seg / 7)) % 3) P('#ffd166', jx, jy, 1, 1);
    for (let i = 2; i < W; i += 9) { P(fase === 'noite' ? '#17331f' : '#3f8f4a', i, VID - 4, 5, 3); P(fase === 'noite' ? '#14291a' : '#2f7d3a', i + 1, VID - 6, 3, 2); } // árvores
  }
  // ---------- tudo que não mexe: desenhado uma vez só
  function estatico() {
    const antes = x; x = fundoC.getContext('2d');
    // moldura do vidro (sobre a paisagem)
    R('#2b313b', 0, 0, W, 2); R('#2b313b', 0, VID - 2, W, 2); for (let i = 0; i <= W; i += 24) R('#2b313b', i - 1, 0, 2, VID);
    R('#ffffff18', 3, 3, 6, 1); R('#ffffff18', 27, 3, 6, 1); R('#ffffff18', 75, 3, 6, 1); R('#ffffff18', 99, 3, 6, 1); // reflexo no vidro
    x.save(); x.translate(0, OFF);
    for (let j = 16, f = 0; j < 100; j += 4, f++) { R(f % 2 ? '#c9a46c' : '#c49d63', 0, j, W, 4); for (let i = (f * 13) % 24; i < W; i += 24) R('#a9844f', i, j, 1, 4); }
    R('#6e5a44', 0, 98, W, 2);
    for (let j = 100; j < H - OFF; j += 6) for (let i = 0; i < W; i += 6) R(((i + j) / 6) % 2 ? '#3d5a73' : '#456682', i, j, 6, 6);
    R('#5a3a22', 10, 108, 46, 26); R('#1f7a3d', 13, 111, 40, 20); R('#111', 13, 111, 2, 2); R('#111', 51, 111, 2, 2); R('#111', 13, 129, 2, 2); R('#111', 51, 129, 2, 2); R('#111', 32, 111, 2, 1); R('#111', 32, 130, 2, 1);
    R('#fff', 24, 120, 2, 2); R('#e8834a', 38, 118, 2, 2); R('#f2cc60', 41, 121, 2, 2); R('#ff6b6b', 39, 123, 2, 2); R('#58a6ff', 44, 119, 2, 2);
    R('#d9dde3', 128, 102, 12, 18); R('#aab0b8', 128, 110, 12, 1); R('#888', 138, 104, 1, 4); R('#888', 138, 113, 1, 4);
    R('#8b5a34', 104, 104, 22, 8); R('#a86f42', 104, 104, 22, 2); R('#f2cc60', 106, 102, 3, 2); R('#e8834a', 110, 101, 3, 3); R('#ff6b6b', 115, 102, 2, 2); R('#7ee787', 119, 101, 3, 3); R('#d2a8ff', 123, 102, 2, 2);
    R('#cfcfcf', 74, 102, 10, 12); R('#333', 76, 105, 6, 3); R('#fff', 77, 111, 3, 2);
    R('#222', 20, 168, 32, 18); R('#333', 34, 186, 4, 3);
    R('#8b2e2e', 14, 198, 42, 8); R('#a83a3a', 14, 194, 42, 5); R('#7a2626', 12, 194, 3, 12); R('#7a2626', 55, 194, 3, 12);
    R('#6b4a30', 92, 168, 18, 4); R('#222', 96, 160, 10, 8);
    R('#7b61ff', 122, 152, 12, 18); R('#111', 124, 155, 8, 6); R('#f2cc60', 125, 163, 2, 2); R('#ff6b6b', 129, 163, 2, 2);
    R('#e6e1d3', 130, 92, 6, 6); R('#222', 131, 94, 1, 2); R('#222', 134, 94, 1, 2);
    R('#2f7d3a', 2, 100, 7, 8); R('#7a4b2a', 3, 107, 5, 4); R('#2f7d3a', 136, 196, 7, 8); R('#7a4b2a', 137, 203, 5, 4);
    R('#2f7d3a', 2, 17, 6, 7); R('#7a4b2a', 3, 23, 4, 3); R('#2f7d3a', 136, 17, 6, 7); R('#7a4b2a', 137, 23, 4, 3); // plantas junto ao vidro
    R('#e8834a', 70, 196, 10, 7); R('#ff9a62', 71, 196, 8, 2);
    R('#6b4a30', 152, 60, 22, 18); R('#58a6ff', 154, 62, 3, 6); R('#ff6b6b', 158, 62, 3, 6); R('#f2cc60', 162, 63, 3, 5); R('#3fb950', 154, 70, 4, 6); R('#d2a8ff', 160, 70, 3, 6);
    R('#1d6fa3', 150, 136, 22, 12); R('#2a8cc9', 151, 137, 20, 10); R('#fff', 160, 136, 1, 12); R('#ddd', 150, 141, 22, 1); R('#5a3a22', 151, 148, 1, 3); R('#5a3a22', 170, 148, 1, 3); // pingue-pongue
    R('#7b61ff', 150, 190, 9, 7); R('#9a85ff', 151, 190, 7, 2); R('#3fb950', 164, 192, 9, 7); R('#5fd170', 165, 192, 7, 2); // pufes
    R('#2f7d3a', 172, 17, 6, 7); R('#7a4b2a', 173, 23, 4, 3); R('#2f7d3a', 172, 100, 7, 8); R('#7a4b2a', 173, 107, 5, 4);
    for (const [a, b] of MESAS) { R('#7a5232', a, b + 10, 24, 6); R('#5e3f27', a, b + 16, 2, 5); R('#5e3f27', a + 22, b + 16, 2, 5); R('#222', a + 6, b + 2, 12, 8); R('#222', a + 11, b + 10, 2, 1); R('#3b3f46', a + 8, b + 19, 8, 3); }
    x.restore(); x = antes;
  }
  // ---------- o que mexe (telas e luzinhas), já dentro do translate
  function cenario() {
    R(t % 30 < 15 ? '#3d7bf2' : '#7b61ff', 22, 170, 28, 14); R('#ffd166', 28 + (t % 40) / 4, 176, 4, 4); // TV
    R(t % 16 < 8 ? '#ff6b6b' : '#7ee787', 82, 103, 1, 1); // café
    R(t % 12 < 6 ? '#7ee787' : '#9ad0f5', 97, 161, 8, 6); // PC de navegar
    R(t % 8 < 4 ? '#ff6b6b' : '#f2cc60', 125, 157, 6, 2); // fliperama
    if (AG.filter((o) => o.faz_agora === 'pingpong' && o.modo === 'raquete').length === 2) { const k = (t % 16) / 16, yy = 138 + Math.abs(k * 2 - 1) * 8; R('#fff', 160 + Math.sin(t / 3) * 6, k < 0.5 ? 132 + k * 32 : 148 - (k - 0.5) * 32, 1, 1); }
  }
  // tela do computador do agente: linhas de "código" rolando na cor dele + barra de progresso (N/M); laranja piscando se parado
  function mesa(g, ligado) {
    const [a, b] = g.mesa;
    if (!ligado) { R('#151515', a + 7, b + 3, 10, 6); return; }
    if (parado(g)) { R(t % 10 < 5 ? '#ffb547' : '#5a3a00', a + 7, b + 3, 10, 6); R('#111', a + 11, b + 4, 2, 3); R('#111', a + 11, b + 8, 2, 1); return; }
    R('#0d1117', a + 7, b + 3, 10, 6);
    for (let l = 0; l < 4; l++) { const k = (l + Math.floor(t / 3)) % 7; R(l === 3 && t % 6 < 3 ? '#ffffff' : g.cor, a + 8, b + 3 + l, 2 + ((k * 5) % 7), 1); } // texto digitando
    const m = String((dados[g.id] || {}).progresso || '').match(/([0-9]+) *[/] *([0-9]+)/);
    if (m && +m[2] > 0) { R('#30363d', a + 8, b + 8, 8, 1); R('#3fb950', a + 8, b + 8, Math.max(1, Math.round(8 * Math.min(1, m[1] / m[2]))), 1); }
    R('#ffffff22', a + 3, b + 9, 18, 2);
  }
  // ---------- pessoinha (x,y = pés)
  function pessoa(g, px, py, modo) {
    if (g.robo) return robo(g, px, py, modo);
    const anda = modo === 'anda', costas = modo === 'senta';
    const pass = anda ? (Math.floor(t / 2) % 2) : 0;
    const bob = modo === 'senta' ? (t % 6 < 3 ? 0 : -0.5) : 0;
    R('#00000033', px - 3, py, 7, 1); // sombra
    if (!costas) { R('#2b2f36', px - 2, py - 4, 2, 4 - pass); R('#2b2f36', px + 1, py - 4, 2, 4 - (1 - pass)); R('#111', px - 2, py - 1 + 0, 2, 1); R('#111', px + 1, py - 1, 2, 1); }
    R(g.cor, px - 3, py - 9 + bob, 7, 5); // camisa
    const braco = modo === 'taco' ? (t % 10 < 5 ? 0 : 1) : (costas ? (t % 4 < 2 ? 0 : 1) : 0);
    R(g.cor, px - 4, py - 8 + bob - braco, 1, 3); R(g.cor, px + 4, py - 8 + bob - (costas ? 1 - braco : braco), 1, 3);
    R(g.pele, px - 4, py - 5 + bob - braco, 1, 1); R(g.pele, px + 4, py - 5 + bob, 1, 1);
    R(g.pele, px - 2, py - 13 + bob, 5, 4); // cabeça
    R(g.cab, px - 2, py - 14 + bob, 5, 2); // cabelo
    if (costas) R(g.cab, px - 2, py - 13 + bob, 5, 3);
    else { R(g.cab, px - 2, py - 13 + bob, 1, 2); const ox = g.dir > 0 ? 1 : 0; R('#111', px - 1 + ox, py - 11 + bob, 1, 1); R('#111', px + 1 + ox, py - 11 + bob, 1, 1);
      if (g.oculos) { R('#222', px - 2 + ox, py - 11 + bob, 2, 1); R('#222', px + 1 + ox, py - 11 + bob, 2, 1); } }
    if (g.chapeu) { R(g.chapeu, px - 3, py - 14 + bob, 7, 1); R(g.chapeu, px - 2, py - 16 + bob, 5, 2); }
    if (g.fone) { R('#111', px - 3, py - 13 + bob, 1, 3); R('#111', px + 3, py - 13 + bob, 1, 3); R('#111', px - 2, py - 15 + bob, 5, 1); }
    if (modo === 'taco') R('#c9a46c', px + (g.x < 30 ? 4 : -9), py - 7, 6, 1);
    if (g.gravata && !costas) { R('#b62324', px, py - 8 + bob, 1, 3); }
    if (g.celular && !costas && modo !== 'anda') { R('#222', px + 4, py - 7, 2, 3); R('#58a6ff', px + 4, py - 7, 2, 1); }
    if (modo === 'raquete') R('#d73a49', px + 4, py - 8 + (t % 6 < 3 ? 0 : -1), 2, 2);
    if (modo === 'come' && t % 12 < 6) R('#f2cc60', px + 4, py - 9, 2, 2);
  }
  function robo(g, px, py, modo) {
    const b = modo === 'senta' ? (t % 6 < 3 ? 0 : -0.5) : 0;
    R('#00000033', px - 3, py, 7, 1);
    R('#8b949e', px - 2, py - 3, 2, 3); R('#8b949e', px + 1, py - 3, 2, 3);
    R('#c9d1d9', px - 3, py - 9 + b, 7, 6); R(g.cor, px - 1, py - 7 + b, 3, 2);
    R('#c9d1d9', px - 3, py - 14 + b, 7, 5); R('#222', px - 2, py - 13 + b, 5, 3);
    R(t % 10 < 5 ? '#7ee787' : '#58a6ff', px - 1, py - 12 + b, 1, 1); R(t % 10 < 5 ? '#7ee787' : '#58a6ff', px + 1, py - 12 + b, 1, 1);
    R('#8b949e', px, py - 17 + b, 1, 3); R(t % 8 < 4 ? '#ff6b6b' : '#f2cc60', px - 1, py - 18 + b, 3, 1);
  }
  function desenhaGato() {
    const g = gato, p = Math.floor(t / 3) % 2;
    R('#00000033', g.x - 3, g.y, 7, 1);
    R('#f0a35e', g.x - 3, g.y - 3, 6, 3); R('#f0a35e', g.x + 2, g.y - 5, 3, 3); R('#f0a35e', g.x + 2, g.y - 6, 1, 1); R('#f0a35e', g.x + 4, g.y - 6, 1, 1);
    R('#d9823c', g.x - 4, g.y - 4 - (g.dorme ? 0 : p), 1, 2);
    if (g.dorme) { if (t % 30 < 15) { R('#fff', g.x + 6, g.y - 9, 2, 1); } } else { R('#111', g.x + 3, g.y - 4, 1, 1); }
  }
  // ---------- vida de quem está livre (Vitor, 08/11: "interagir de maneira genuína, com o sentimento de querer de cada agente")
  // Cada agente tem 4 vontades (0–100) que sobem com o tempo: cansaço, fome, social (vontade de conversar) e diversão.
  // Trabalhar cansa e dá fome. Cada lugar mata uma vontade, e ele só sai de lá quando ela passa. Nada é sorteado por relógio:
  // o que ele faz é a vontade mais forte, do jeito que ele gosta. Balão só aparece quando dois estão interagindo.
  const MATA = { cafe: { cansaco: -2.5 }, sofa: { cansaco: -2, diversao: -1 }, lanche: { fome: -3 }, sinuca: { diversao: -2 }, pingpong: { diversao: -2.5, cansaco: 0.4 },
    fliperama: { diversao: -2 }, navegar: { diversao: -1.5 }, gato: { social: -1, diversao: -1.5 }, conversa: { social: -2 }, janela: { cansaco: -0.8, diversao: -0.6 }, tomada: { cansaco: -3 } };
  const PRINCIPAL = { cafe: 'cansaco', sofa: 'cansaco', lanche: 'fome', sinuca: 'diversao', pingpong: 'diversao', fliperama: 'diversao', navegar: 'diversao', gato: 'social', conversa: 'social', janela: 'cansaco', tomada: 'cansaco' };
  const OPCOES = { cansaco: ['cafe', 'sofa', 'janela'], fome: ['lanche'], diversao: ['sinuca', 'pingpong', 'fliperama', 'navegar', 'sofa', 'gato'], social: ['conversa', 'gato'] };
  const SOCIAVEL = { cobranca: 1.6, social: 1.4, financeiro: 1.1, roteirista: 1.0, revisores: 0.9, cacador: 0.8, estudio: 0.8, analista: 0.7, robo: 0 };
  const AMIGOS = { 'roteirista-revisores': 3, 'roteirista-estudio': 2, 'cacador-roteirista': 2, 'financeiro-social': 3, 'analista-social': 2, 'analista-financeiro': 2, 'estudio-revisores': 1, 'cacador-social': 1 };
  const amizade = (a, b) => (AMIGOS[a.id + '-' + b.id] || AMIGOS[b.id + '-' + a.id] || 0) + (a.id === 'cobranca' || b.id === 'cobranca' ? 1 : 0);
  LUGARES.janela = { vagas: [[36, 19], [72, 19], [108, 19], [144, 19]] };
  AG.forEach((g) => { g.v = { cansaco: 10 + rnd(40), fome: rnd(45), social: rnd(55), diversao: rnd(55) }; g.soc = SOCIAVEL[g.id] ?? 1; });
  const livre = (o) => !trab(o) && !o.robo && !o.par;
  const curto = (s, n = 24) => { s = String(s || '').replace(/[“”"]/g, ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  function ocupado(lugar, i) { return AG.some((o) => o.faz_agora === lugar && o.vaga === i); }
  function vaiPara(g, l, i) { g.faz_agora = l; g.vaga = i; g.alvo = LUGARES[l].vagas[i]; g.motivo = PRINCIPAL[l]; }
  // o que ele mais quer agora (já pesando o jeito dele: os sociáveis sentem mais falta de gente)
  function vontade(g) {
    const pesos = { cansaco: 1, fome: 1.1, social: g.soc, diversao: 1 };
    return Object.keys(g.v).map((k) => [k, g.v[k] * pesos[k]]).sort((a, b) => b[1] - a[1])[0];
  }
  function decide(g) {
    if (g.robo) { if (g.faz_agora !== 'tomada') vaiPara(g, 'tomada', 0); return; }
    const [quer, forca] = vontade(g);
    if (forca < 22) { // nada aperta: vai olhar a vista pela janela
      const i = LUGARES.janela.vagas.findIndex((_, k) => !ocupado('janela', k));
      if (i >= 0) { vaiPara(g, 'janela', i); g.motivo = 'nada'; return; }
    }
    if (quer === 'social') { // procura alguém que TAMBÉM esteja a fim de conversar, de preferência um amigo
      const cand = AG.filter((o) => o !== g && livre(o) && o.v.social * o.soc + amizade(g, o) * 12 > 30)
        .sort((a, b) => (b.v.social * b.soc + amizade(g, b) * 12) - (a.v.social * a.soc + amizade(g, a) * 12));
      if (cand.length) return conversa(g, cand[0]);
    }
    if (quer === 'diversao') { // jogo de dupla só se outro também quiser brincar
      for (const jogo of ['sinuca', 'pingpong'].sort((a, b) => (g.gosta[b] || 0) - (g.gosta[a] || 0))) {
        if (!g.gosta[jogo] || ocupado(jogo, 0) || ocupado(jogo, 1)) continue;
        const par = AG.find((o) => o !== g && livre(o) && o.v.diversao > 35 && o.gosta[jogo]);
        if (par) return joga(g, par, jogo);
      }
    }
    // sozinho: entre os lugares que matam essa vontade, o que ele mais gosta e está livre
    const ops = OPCOES[quer].filter((l) => l !== 'conversa' && !(l === 'sinuca' || l === 'pingpong'))
      .sort((a, b) => (g.gosta[b] || 0) - (g.gosta[a] || 0));
    for (const l of ops) {
      if (l === 'gato') { g.faz_agora = 'gato'; g.motivo = quer; g.alvo = [gato.x - 6, gato.y]; return; }
      const i = (LUGARES[l].vagas || []).findIndex((_, k) => !ocupado(l, k));
      if (i >= 0) { vaiPara(g, l, i); g.motivo = quer; return; }
    }
    const i = LUGARES.janela.vagas.findIndex((_, k) => !ocupado('janela', k));
    if (i >= 0) vaiPara(g, 'janela', i);
  }
  // ---------- conversa: o assunto sai do trabalho real de cada um (o que está no status) e de como cada um está
  function papo(a, b) {
    const da = (dados[a.id] || {}).detalhe, db = (dados[b.id] || {}).detalhe, linhas = [];
    const reage = (quem, de) => quem.id === 'revisores' && de.id === 'roteirista' ? 'manda que eu reviso 🔎' : quem.id === 'financeiro' ? 'isso vende? 💰'
      : quem.id === 'social' ? 'vou ver se bombou 📈' : quem.id === 'estudio' && de.id === 'roteirista' ? 'já tô aquecendo o render 🎬' : quem.id === 'analista' ? 'depois me passa os números 📊' : 'boa! 👏';
    if (da) { linhas.push([a, 'acabei: ' + curto(da)]); linhas.push([b, reage(b, a)]); }
    else linhas.push([a, 'e aí, ' + b.nome.split(' ')[0] + '?']);
    if (db) { linhas.push([b, 'o meu: ' + curto(db)]); linhas.push([a, reage(a, b)]); }
    for (const [p, o] of [[a, b], [b, a]]) {
      if (p.v.cansaco > 55) linhas.push([p, 'tô moído hoje 😮‍💨']), linhas.push([o, 'pega um café ☕']);
      else if (p.v.fome > 55) linhas.push([p, 'bateu uma fome…']), linhas.push([o, 'tem pão de queijo lá 🧀']);
    }
    const h = hora();
    if (linhas.length < 4) linhas.push([b, h >= 17 && h < 19 ? 'viu o pôr do sol? 🌇' : h >= 19 || h < 6 ? 'a cidade acesa tá linda 🌃' : 'que dia bonito lá fora ☀️'], [a, 'demais']);
    if (gato.dorme) linhas.push([a, 'o gato dormiu de novo 😹']);
    return linhas;
  }
  function conversa(a, b) {
    const mx = 40 + rnd(70), my = 145 + rnd(25);
    a.par = b; b.par = a; a.faz_agora = b.faz_agora = 'conversa'; a.motivo = b.motivo = 'social';
    a.alvo = [mx - 5, my]; b.alvo = [mx + 5, my];
    a.roteiro = b.roteiro = { linhas: papo(a, b), i: 0, prox: 0 };
  }
  function joga(a, b, jogo) {
    vaiPara(a, jogo, 0); vaiPara(b, jogo, 1); a.par = b; b.par = a; a.motivo = b.motivo = 'diversao';
    const falas = jogo === 'sinuca' ? ['sua vez', 'caçapa do canto…', 'entrou! 🎱', 'sorte 😤', 'revanche?', 'bora'] : ['saque!', 'ponto! 🏓', 'quase…', 'essa foi minha', 'mais uma?', 'bora'];
    a.roteiro = b.roteiro = { linhas: falas.map((f, k) => [k % 2 ? b : a, f]), i: 0, prox: 0, loop: true };
  }
  function fala(g, txt) { g.fala = txt; g.falaAte = t + 22; }
  function separa(g) { const o = g.par; if (o) { o.par = null; o.roteiro = null; o.fala = ''; o.faz_agora = null; } g.par = null; g.roteiro = null; g.fala = ''; }
  function passo(g, dt) {
    // as vontades mudam com o tempo: trabalhar cansa e dá fome; parado, sobe a vontade de conversar e de brincar
    const V = g.v, sobe = (k, x) => { V[k] = Math.max(0, Math.min(100, V[k] + x * dt)); };
    if (!g.robo) { if (trab(g)) { sobe('cansaco', 0.9); sobe('fome', 0.6); sobe('social', 0.5 * g.soc); sobe('diversao', 0.5); } else { sobe('fome', 0.18); sobe('social', 0.25 * g.soc); sobe('diversao', 0.22); } }
    if (trab(g)) { if (g.par) separa(g); g.faz_agora = 'mesa'; g.alvo = [g.mesa[0] + 12, g.mesa[1] + 22]; }
    else if (!g.faz_agora || g.faz_agora === 'mesa') decide(g);
    const [ax, ay] = g.alvo || [g.x, g.y];
    const dx = ax - g.x, dy = ay - g.y, d = Math.hypot(dx, dy);
    if (d > 0.6) { const v = Math.min(d, 15 * dt); g.x += dx / d * v; g.y += dy / d * v; g.dir = dx >= 0 ? 1 : -1; g.modo = 'anda'; return; }
    g.x = ax; g.y = ay;
    const f = g.faz_agora;
    g.modo = f === 'mesa' ? 'senta' : f === 'sinuca' ? 'taco' : f === 'lanche' ? 'come' : f === 'pingpong' ? 'raquete' : 'parado';
    if (f === 'mesa') return;
    if (g.par) g.dir = g.par.x > g.x ? 1 : -1;
    if (f === 'gato') { g.dir = gato.x > g.x ? 1 : -1; gato.dorme = false; g.alvo = [gato.x - 6, gato.y]; }
    if (f === 'janela') g.dir = 1;
    for (const [k, x] of Object.entries(MATA[f] || {})) sobe(k, x); // estar no lugar mata a vontade
    // conversa/jogo: falam em turnos, só quando os dois já chegaram
    const R0 = g.roteiro, o = g.par;
    if (R0 && o && Math.hypot(o.x - o.alvo[0], o.y - o.alvo[1]) < 1 && t >= R0.prox && R0.linhas.length) {
      const [quem, txt] = R0.linhas[R0.i % R0.linhas.length];
      if (quem === g) { fala(g, txt); R0.i++; R0.prox = t + 26; if (!R0.loop && R0.i >= R0.linhas.length) R0.fim = true; }
    }
    // vai embora quando a vontade passou (na dupla, quando os dois já estão satisfeitos ou o papo acabou)
    const k = PRINCIPAL[f], satisfeito = k && V[k] < 12;
    if (o) { if ((satisfeito && o.v[PRINCIPAL[o.faz_agora]] < 12) || (R0 && R0.fim && t > R0.prox + 10 && (satisfeito || V.social < 30))) { separa(g); g.faz_agora = null; } }
    else if (satisfeito || (f === 'janela' && vontade(g)[1] > 30)) g.faz_agora = null;
  }
  function passoGato(dt) {
    if (AG.some((g) => g.faz_agora === 'gato' && Math.hypot(g.x - gato.x, g.y - gato.y) < 9)) return;
    if (t > gato.ate) { gato.dorme = Math.random() < 0.6; gato.alvo = gato.dorme ? [64 + rnd(20), 186 + rnd(10)] : [10 + rnd(120), 140 + rnd(55)]; gato.ate = t + 200 + rnd(300); }
    const dx = gato.alvo[0] - gato.x, dy = gato.alvo[1] - gato.y, d = Math.hypot(dx, dy);
    if (d > 0.6 && !gato.dorme) { const v = Math.min(d, 7 * dt); gato.x += dx / d * v; gato.y += dy / d * v; }
  }
  // ---------- balões (HTML, nítidos)
  const baloes = {};
  function balao(id, txt, px, py, cls) {
    let el = baloes[id];
    if (!txt) { if (el) { el.remove(); delete baloes[id]; } return; }
    if (!el) { el = baloes[id] = document.createElement('div'); box.appendChild(el); }
    const c = 'bal ' + (cls || ''), l = (Math.max(18, Math.min(W - 18, px)) / W * 100).toFixed(1) + '%', tp = ((py + OFF) / H * 100).toFixed(1) + '%';
    if (el.className !== c) el.className = c; if (el.textContent !== txt) el.textContent = txt;
    if (el.style.left !== l) el.style.left = l; if (el.style.top !== tp) el.style.top = tp;
  }
  let ultimo = 0, ultimoCeu = -1;
  function quadro(agora) {
    const dt = ultimo ? Math.min(0.1, (agora - ultimo) / 1000) : 0; ultimo = agora;
    t = Math.floor(agora / 100);
    const seg = Math.floor(agora / 1000);
    if (seg !== ultimoCeu) { ultimoCeu = seg; ceu(seg); }
    AG.forEach((g) => passo(g, dt)); passoGato(dt);
    x.drawImage(ceuC, 0, 0); x.drawImage(fundoC, 0, 0);
    x.save(); x.translate(0, OFF);
    cenario();
    AG.forEach((g) => mesa(g, trab(g) && Math.hypot(g.x - g.alvo[0], g.y - g.alvo[1]) < 2));
    const todos = [...AG.map((g) => ({ y: g.y, f: () => pessoa(g, g.x, g.y, g.modo) })), { y: gato.y, f: desenhaGato }];
    todos.sort((a, b) => a.y - b.y).forEach((o) => o.f());
    x.restore();
    for (const g of AG) {
      const a = dados[g.id] || {};
      if (g.modo === 'senta') balao(g.id, '', 0, 0); // o que está fazendo aparece na tela do computador (toque para ampliar)
      else balao(g.id, g.par && t < g.falaAte ? g.fala : '', g.x, g.y - 16, 'em'); // balão só em interação entre dois
    }
  }
  // ---------- toque numa mesa ou num personagem: abre a tela do computador dele em tamanho grande
  const st2 = document.createElement('style');
  st2.textContent = '.tela-g{position:fixed;inset:0;background:#000a;display:flex;align-items:center;justify-content:center;z-index:50;padding:18px}.tela-g .mon{width:100%;max-width:420px;background:#2b2f36;border-radius:14px;padding:10px 10px 18px;box-shadow:0 10px 40px #000}.tela-g .scr{background:#0d1117;border-radius:8px;padding:12px;font:13px/1.5 ui-monospace,Menlo,monospace;color:#c9d1d9;min-height:150px}.tela-g .bar{height:8px;background:#30363d;border-radius:4px;margin:10px 0 4px}.tela-g .bar i{display:block;height:100%;background:#3fb950;border-radius:4px}.tela-g .pe{width:60px;height:10px;background:#2b2f36;margin:-2px auto 0;border-radius:0 0 6px 6px}.tela-g .x{float:right;background:none;border:0;color:#8b949e;font-size:18px}.tela-g .cur{display:inline-block;width:8px;height:14px;background:#c9d1d9;vertical-align:-2px;animation:pisca 1s steps(1) infinite}@keyframes pisca{50%{opacity:0}}';
  document.head.appendChild(st2);
  function abreTela(g) {
    const a = dados[g.id] || {}, on = trab(g), av = parado(g);
    const m = String(a.progresso || '').match(/([0-9]+) *[/] *([0-9]+)/), pct = m && +m[2] ? Math.round(100 * Math.min(1, m[1] / m[2])) : null;
    const esc2 = (v) => String(v || '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const fazAgora = on ? '' : (g.faz_agora && LUGARES[g.faz_agora] ? ({ sinuca: 'jogando sinuca 🎱', lanche: 'fazendo um lanche 🍩', cafe: 'tomando café ☕', sofa: 'vendo TV 📺', navegar: 'navegando na internet 🌐', fliperama: 'no fliperama 🕹️', tomada: 'carregando a bateria 🔋', pingpong: 'jogando pingue-pongue 🏓' + (g.par ? ' com ' + g.par.nome : ''), sinuca: 'jogando sinuca 🎱' + (g.par ? ' com ' + g.par.nome : ''), janela: 'olhando a vista pela janela 🌇' })[g.faz_agora] : g.faz_agora === 'conversa' ? 'batendo papo com ' + (g.par ? g.par.nome : 'alguém') + ' 💬' : g.faz_agora === 'gato' ? 'fazendo carinho no gato 🐱' : 'dando uma volta');
    const div = document.createElement('div'); div.className = 'tela-g';
    div.innerHTML = '<div><div class="mon"><button class="x" aria-label="fechar">✕</button><div style="color:' + g.cor + ';font-weight:700;margin:0 0 6px">' + g.nome + (on ? ' · trabalhando' : ' · livre') + '</div><div class="scr">' +
      (on ? '<span style="color:' + g.cor + '">&gt;</span> ' + esc2(av ? 'parado? sem notícia desde ' + (a.em || '').slice(11) : (a.detalhe || g.faz)) + ' <span class="cur"></span>' +
            (pct != null ? '<div class="bar"><i style="width:' + pct + '%"></i></div><small>' + esc2(a.progresso) + ' · ' + pct + '%</small>' : (a.progresso ? '<br><small>' + esc2(a.progresso) + '</small>' : ''))
          : '<span style="color:#8b949e">💤 tela desligada. Agora está ' + esc2(fazAgora || 'na área de lazer') + '.</span>' + (g.v ? '<br><br><small>como está: cansaço ' + Math.round(g.v.cansaco) + ' · fome ' + Math.round(g.v.fome) + ' · quer conversar ' + Math.round(g.v.social) + ' · quer brincar ' + Math.round(g.v.diversao) + '</small>' : '') + (a.detalhe ? '<br><br><small>último trabalho: ' + esc2(a.detalhe) + '</small>' : '')) +
      '<br><br><small style="color:#8b949e">' + esc2(g.faz) + ' · ' + esc2(g.quando) + (a.em ? ' · atualizado ' + esc2(a.em.slice(8, 10) + '/' + a.em.slice(5, 7) + ' ' + a.em.slice(11)) : '') + '</small></div></div><div class="pe"></div></div>';
    div.addEventListener('click', (ev) => { if (ev.target === div || ev.target.classList.contains('x')) div.remove(); });
    document.body.appendChild(div);
  }
  cv.style.cursor = 'pointer';
  cv.addEventListener('click', (ev) => {
    const r = cv.getBoundingClientRect(), px = (ev.clientX - r.left) / r.width * W, py = (ev.clientY - r.top) / r.height * H - OFF;
    const alvo = AG.find((g) => px >= g.mesa[0] && px <= g.mesa[0] + 24 && py >= g.mesa[1] && py <= g.mesa[1] + 26) || AG.find((g) => Math.abs(px - g.x) < 6 && py > g.y - 16 && py < g.y + 2);
    if (alvo) abreTela(alvo);
  });
  function cartoes() {
    lista.innerHTML = AG.map((g) => {
      const a = dados[g.id] || {}, on = trab(g), av = parado(g);
      const txt = on ? (a.detalhe || g.faz) + (a.progresso ? ' · ' + a.progresso : '') : 'livre' + (a.detalhe ? ' · último: ' + a.detalhe : '');
      return '<div class="agc' + (on ? ' on' : '') + (av ? ' av' : '') + '"><i class="pt"></i><div><b class="n" style="color:' + g.cor + '">' + g.nome + '</b>' + txt.replace(/</g, '&lt;') +
        '<br><small>' + g.faz + ' · ' + g.quando + (a.em ? ' · atualizado ' + a.em.slice(8, 10) + '/' + a.em.slice(5, 7) + ' ' + a.em.slice(11) : '') + '</small></div></div>';
    }).join('');
  }
  async function busca() {
    try {
      const r = await fetch('/api/atividade', { credentials: 'same-origin' });
      if (!r.ok) throw new Error(r.status);
      const j = await r.json(); dados = j.agentes || {};
      const n = AG.filter(trab).length;
      info.textContent = n + ' de ' + AG.length + ' trabalhando · ' + (modo === 'classico' ? 'toque numa mesa ou num personagem para ver a tela dele' : 'toque num personagem para ver o que ele está fazendo') + ' · atualizado ' + (j.agora || '').slice(11);
    } catch (e) { info.textContent = 'não consegui ler o status agora (' + e.message + ')'; }
    cartoes();
  }
  estatico();
  const loop = (ts) => { if (document.body.dataset.tab === 'equipe' && !document.hidden && modo === 'classico') quadro(ts); else ultimo = 0; requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  setInterval(() => { if (document.body.dataset.tab === 'equipe') busca(); }, 20000);
  document.querySelectorAll('nav button[data-t="equipe"]').forEach((b) => b.addEventListener('click', busca));
  if (document.body.dataset.tab === 'equipe') busca();
})();
// 💵 Caixa (Vitor, 08/11): vendas da Kiwify, funil e lucro do mês, ao vivo
(() => {
  const el = document.getElementById('caixa'); if (!el) return;
  const R$ = (c) => 'R$ ' + (c / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  async function carrega() {
    try {
      const r = await fetch('/api/financeiro', { credentials: 'same-origin' }); if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      const mes = (d.agora || '').slice(0, 7), gastos = Math.round(Number(el.dataset.gastosBrl || 0) * 100);
      const doMes = (d.ultimas || []).filter((v) => (v.em || '').startsWith(mes) && /paid|approved|aprovad|complete/i.test(v.status + ' ' + v.evento) && !/refund|reembols|chargeback|estorn/i.test(v.status + ' ' + v.evento));
      const liqMes = doMes.reduce((t, v) => t + (v.liquido || v.valor || 0), 0);
      const f = {}; for (const x of d.funil || []) { f[x.tipo] = (f[x.tipo] || 0) + x.n; }
      const orig = {}; for (const x of (d.funil || []).filter((x) => x.tipo === 'clique')) orig[x.origem] = (orig[x.origem] || 0) + x.n;
      const conv = f.clique ? (d.vendas / f.clique * 100).toFixed(1).replace('.', ',') + '%' : '–';
      el.innerHTML = '<h3>💵 Super Assistente de IA</h3>' +
        (d.conectado ? '' : '<p class="mut">Kiwify ainda não conectada.</p>') +
        '<div class="filas"><div class="kpi"><b>' + d.vendas + '</b><span>vendas aprovadas</span></div><div class="kpi"><b>' + R$(d.liquido || 0) + '</b><span>líquido (bruto ' + R$(d.bruto || 0) + ')</span></div>' +
        '<div class="kpi"><b style="color:' + (liqMes - gastos >= 0 ? 'var(--ok)' : 'var(--erro)') + '">' + R$(liqMes - gastos) + '</b><span>lucro do mês (vendas − gastos)</span></div></div>' +
        '<table class="gastos"><tr><th>Funil (30 dias)</th><th class="num">Qtd</th></tr>' +
        '<tr><td>Comentários com KIT</td><td class="num">' + (d.comentarios_kit || 0) + '</td></tr>' +
        '<tr><td>Cartões de oferta na DM</td><td class="num">' + (d.ofertas_dm || 0) + '</td></tr>' +
        '<tr><td>Visitas à página /kit</td><td class="num">' + (f.visita || 0) + '</td></tr>' +
        '<tr><td>Cliques em comprar<br><small>' + Object.entries(orig).map(([k, v]) => k + ' ' + v).join(' · ') + '</small></td><td class="num">' + (f.clique || 0) + '</td></tr>' +
        '<tr><td>Vendas · conversão do clique</td><td class="num">' + d.vendas + ' · ' + conv + '</td></tr>' +
        '<tr><td>Reembolsos / estornos</td><td class="num">' + d.estornos + '</td></tr></table>' +
        ((d.ultimas || []).length ? '<p class="mut" style="font-size:12px">Últimas: ' + d.ultimas.slice(0, 5).map((v) => (v.em || '').slice(8, 10) + '/' + (v.em || '').slice(5, 7) + ' ' + (v.status || v.evento) + ' ' + (v.valor ? R$(v.valor) : '')).join(' · ') + '</p>' : '') +
        '<p class="mut" style="font-size:12px">Vendas chegam na hora pela Kiwify (e o 🔔 avisa). Funil: cliques passam por iaem60s.com/comprar. Atualizado ' + (d.agora || '').slice(11) + '.</p>';
    } catch (e) { el.innerHTML = '<h3>💵 Super Assistente de IA</h3><p class="mut">não consegui ler as vendas agora (' + e.message + ')</p>'; }
  }
  document.querySelectorAll('nav button[data-t="gastos"]').forEach((b) => b.addEventListener('click', carrega));
  if (document.body.dataset.tab === 'gastos' || location.hash === '#gastos') carrega();
})();
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
    roteiros = [{"pasta": c["pasta"].name, "titulo": titulo_curto(c), "quando": c["quando"]} for c in cartoes
                if c["pasta"] and "roteiro aguardando" in c["status"].lower()]
    # agenda dos próximos 3 dias (Brasília) para a cobrança das 18:23, que só lê este arquivo e o estado.json
    pubs_ag = ler(PAINEL / "publicacoes.json", {}) or {}
    pubs_ag = pubs_ag if isinstance(pubs_ag, list) else next((v for v in pubs_ag.values() if isinstance(v, list)), [])
    lim = (agora + dt.timedelta(days=3)).strftime("%Y-%m-%d %H:%M"); ja = f"{agora:%Y-%m-%d %H:%M}"
    agenda = {}
    for x in pubs_ag:
        d = str(x.get("data") or "")[:16]
        if ja <= d <= lim and not x.get("rascunho") and x.get("tipo") != "STORY" and x.get("status") not in ("PUBLISHED", "ERROR"):
            pasta_ag = x.get("pasta") or next((q.name for q in (IA / "posts").glob("*-" + str(x.get("texto") or "_")) if q.is_dir()), "_")
            rot_ag = ler(IA / "posts" / pasta_ag / "roteiro.json", {}) or {}
            ttl = ((rot_ag.get("segmentos") or [{}])[0].get("etiqueta") or [None])[0] or rot_ag.get("tese") or ""
            if not ttl or (" " not in ttl and "-" in ttl):  # sem etiqueta: usa o começo do texto do post
                ttl = str(x.get("texto") or ttl).split("\n")[0][:70]
            e = agenda.setdefault(d, {"quando": d, "titulo": ttl, "redes": []})
            if x.get("rede") not in e["redes"]: e["redes"].append(x.get("rede"))
    (PAINEL / "pendentes.json").write_text(json.dumps({"gerado_em": f"{agora:%Y-%m-%d %H:%M}", "videos": videos, "roteiros": roteiros,
        "agenda_3_dias": [agenda[k] for k in sorted(agenda)]}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"painel/index.html: {len(cartoes)} posts, {len(pendencias)} pendência(s)")
    import runpy  # respostas.json do robô de comentários (e o plano B zorcha.md)
    runpy.run_path(str(PAINEL / "zorcha.py"), run_name="__main__")


if __name__ == "__main__":
    main()

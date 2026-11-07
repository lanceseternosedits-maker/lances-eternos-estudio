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
from pathlib import Path

IA = Path(__file__).resolve().parent.parent
PAINEL = IA / "painel"
CAPAS = PAINEL / "capas"
BRT = dt.timezone(dt.timedelta(hours=-3))
VAGAS_UTEIS = ["06:00", "12:00", "17:00", "19:30"]
VAGAS_FDS = ["09:00", "13:00", "17:00", "20:30"]
INICIO_4_POR_DIA = dt.date(2026, 11, 9)  # até 08/11 valeu a agenda especial de 2 por dia (estado.json)
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
        m = re.search(r"(?:(\d{2})/(\d{2})\s+)?(\d{2}:\d{2})", str(valor))
        if not m or not base:
            continue
        data = f"{base[:4]}-{m.group(2)}-{m.group(1)}" if m.group(1) else base
        out.append((chave.split("_")[0], f"{data} {m.group(3)}"))
    return out


def capa(pasta: Path) -> str | None:
    destino = CAPAS / f"{pasta.name}.jpg"
    if destino.exists():
        return f"capas/{destino.name}"
    fonte = next((p for p in [pasta / "capa.jpg", *sorted((pasta / "slides").glob("*.jpg")),
                              *sorted((pasta / "slides").glob("*.png"))] if p.exists()), None)
    video = next((pasta / n for n in ("reel.mp4", "short.mp4") if (pasta / n).exists()), None)
    if fonte is None and video is None:
        return None
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
    return {"publicado": "ok", "agendado": "agenda", "rascunho": "neutro", "erro": "erro", "negado": "neutro"}.get(s, "neutro")


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
    for c in cartoes:
        nome = c["pasta"].name if c["pasta"] else c["titulo"][:40]
        if "aguardando" in c["status"].lower():
            pendencias.append(f'<b>{esc(c["status"])}</b>: {esc(nome)}')
        if c["checagem"] and not c["checagem"]["ok"] and c["status"] not in ("publicado", "negado"):
            falhas = ", ".join(i["nome"] for i in c["checagem"]["itens"] if i["ok"] is False)
            pendencias.append(f"<b>Checagem falhou</b>: {esc(nome)} ({esc(falhas)})")
    limite = (agora - dt.timedelta(days=3)).strftime("%Y-%m-%d")
    for p in publicacoes:
        if p["status"] == "ERROR" and p["data"] >= limite:
            pendencias.append(f'<b>Erro no {REDES.get(p["rede"], p["rede"])}</b> {esc(p["data"][5:])}: {esc(p.get("erro", ""))}')

    # ---- semana em vagas (hoje + 6 dias), pelo Instagram
    ocupadas = defaultdict(list)
    for p in publicacoes:
        if p["rede"] == "instagram":
            ocupadas[p["data"]].append(p)
    semana = []
    livres_3_dias = 0
    for d in range(7):
        dia = (agora + dt.timedelta(days=d)).date()
        vagas = [] if dia < INICIO_4_POR_DIA else VAGAS_FDS if dia.weekday() >= 5 else VAGAS_UTEIS
        horas = sorted(set(vagas) | {k[11:] for k in ocupadas if k.startswith(str(dia))})
        linhas = []
        for h in horas:
            ps = ocupadas.get(f"{dia} {h}", [])
            passou = dt.datetime.combine(dia, dt.time.fromisoformat(h), BRT) < agora
            if ps:
                p = ps[0]
                st = {"PUBLISHED": "publicado", "PENDING": "rascunho" if p.get("rascunho") else "agendado", "ERROR": "erro"}[p["status"]]
                linhas.append(f'<li class="{classe(st)}"><span>{h}</span>{esc(p["texto"][:70])}</li>')
            elif h in vagas and not passou:
                if d < 3:
                    livres_3_dias += 1
                linhas.append(f'<li class="livre"><span>{h}</span>vaga livre</li>')
        semana.append(f'<div class="dia"><h3>{DIAS[dia.weekday()]} {dia:%d/%m}</h3><ul>{"".join(linhas)}</ul></div>')
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
        img = f'<img loading="lazy" src="{c["capa"]}" alt="">' if c["capa"] else '<div class="semcapa">sem capa</div>'
        nome = c["pasta"].name if c["pasta"] else "sem pasta no repositório"
        html_cartoes.append(
            f'<article data-status="{esc(c["status"])}">{img}<div class="info"><span class="st {classe(c["status"])}">{esc(c["status"])}</span>'
            f'<h4>{esc(c["titulo"][:110])}</h4><p class="sub">{esc(nome)}</p><p class="sub">{esc(detalhes)}</p>'
            f'<div class="chips">{chips}</div>{"<p class=met>" + "<br>".join(esc(x) for x in met) + "</p>" if met else ""}{chk}</div></article>')

    contagem = defaultdict(int)
    for c in cartoes:
        contagem[c["status"]] += 1
    resumo = " · ".join(f"{n} {s}" for s, n in sorted(contagem.items(), key=lambda x: -x[1]))
    filtros = "".join(f'<button data-f="{esc(s)}">{esc(s)} ({n})</button>' for s, n in sorted(contagem.items(), key=lambda x: -x[1]))
    pend = "".join(f"<li>{p}</li>" for p in pendencias) or "<li>Nada pendente.</li>"

    pagina = f"""<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Painel IA em 60s</title>
<style>
:root{{--bg:#0f1115;--card:#181b22;--line:#262a33;--tx:#e8e9ec;--mut:#9aa0ab;--ok:#3ecf8e;--ag:#5aa9ff;--esp:#ffb547;--erro:#ff6b6b}}
*{{box-sizing:border-box}}body{{margin:0;font:14px/1.45 system-ui,-apple-system,Segoe UI,sans-serif;background:var(--bg);color:var(--tx)}}
header{{padding:20px 16px 8px}}h1{{margin:0;font-size:22px}}h2{{font-size:16px;margin:24px 0 10px}}.mut{{color:var(--mut)}}
main{{padding:0 16px 40px;max-width:1200px;margin:auto}}
.pend{{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--esp);border-radius:10px;padding:10px 14px}}
.pend ul{{margin:0;padding-left:18px}}.pend li{{margin:4px 0}}
.semana{{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}}
.dia{{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:8px 10px}}.dia h3{{margin:0 0 6px;font-size:13px;text-transform:uppercase;color:var(--mut)}}
.dia ul{{list-style:none;margin:0;padding:0}}.dia li{{font-size:12px;padding:5px 0;border-top:1px solid var(--line)}}.dia li span{{display:inline-block;width:42px;font-weight:600}}
li.livre{{color:var(--esp)}}li.ok span{{color:var(--ok)}}li.agenda span{{color:var(--ag)}}li.erro{{color:var(--erro)}}
.filtros button{{background:var(--card);color:var(--tx);border:1px solid var(--line);border-radius:20px;padding:5px 12px;margin:0 6px 6px 0;font:inherit;cursor:pointer}}
.filtros button.on{{border-color:var(--ag);color:var(--ag)}}
.grade{{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}}
article{{background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;display:flex}}
article img,.semcapa{{width:96px;min-width:96px;height:170px;object-fit:cover;background:#000}}.semcapa{{display:flex;align-items:center;justify-content:center;color:var(--mut);font-size:11px}}
.info{{padding:8px 10px;min-width:0}}h4{{margin:4px 0;font-size:13px;line-height:1.3}}.sub{{margin:2px 0;color:var(--mut);font-size:11px;word-break:break-word}}
.st{{font-size:11px;font-weight:600;text-transform:uppercase}}.st.ok{{color:var(--ok)}}.st.agenda{{color:var(--ag)}}.st.espera{{color:var(--esp)}}.st.erro{{color:var(--erro)}}.st.neutro{{color:var(--mut)}}
.chips{{margin:6px 0}}.chip{{display:inline-block;font-size:11px;padding:2px 7px;border-radius:10px;margin:0 4px 4px 0;border:1px solid var(--line);color:var(--tx);text-decoration:none}}
.chip.ok{{border-color:var(--ok)}}.chip.agenda{{border-color:var(--ag)}}.chip.erro{{border-color:var(--erro);color:var(--erro)}}
.met{{font-size:12px;margin:4px 0}}details{{font-size:11px;margin-top:4px}}details ul{{padding-left:4px;list-style:none;margin:4px 0}}details li.erro{{color:var(--erro)}}details li.ok{{color:var(--mut)}}details li.aviso{{color:var(--esp)}}
</style></head><body>
<header><h1>IA em 60s · painel</h1><div class="mut">Atualizado em {agora:%d/%m %H:%M} (Brasília) · Metricool lido em {esc(snap.get("lido_em", "?"))} · {esc(resumo)}</div></header>
<main>
<h2>Precisa de você</h2><div class="pend"><ul>{pend}</ul></div>
<h2>Semana (Instagram, vagas do calendário)</h2><div class="semana">{"".join(semana)}</div>
<h2>Todos os posts ({len(cartoes)})</h2><div class="filtros"><button data-f="" class="on">todos</button>{filtros}</div>
<div class="grade">{"".join(html_cartoes)}</div>
</main>
<script>
document.querySelectorAll('.filtros button').forEach(b=>b.onclick=()=>{{
 document.querySelectorAll('.filtros button').forEach(x=>x.classList.toggle('on',x===b));
 document.querySelectorAll('article').forEach(a=>a.style.display=(!b.dataset.f||a.dataset.status===b.dataset.f)?'':'none');
}});
</script></body></html>
"""
    (PAINEL / "index.html").write_text(pagina, encoding="utf-8")
    print(f"painel/index.html: {len(cartoes)} posts, {len(pendencias)} pendência(s)")


if __name__ == "__main__":
    main()

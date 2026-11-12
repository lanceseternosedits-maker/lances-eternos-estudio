"""Chance estimada de um post ser bem recebido (Vitor, 07/11: "qualquer dado que me ajude na decisão de aprovar").

Não é promessa: compara o roteiro com os Reels que já têm números em metricas.json e soma fatores do manual.
Cada fator aparece com o peso, para o Vitor ver de onde veio a porcentagem.
"bem recebido" = passar de ~300 views no Instagram (hoje só 2 de 8 Reels medidos chegaram lá).
"""
from __future__ import annotations

import json
import math
import re
import unicodedata
from pathlib import Path

IA = Path(__file__).resolve().parent.parent
BASE = 25  # 2 de 8 Reels medidos passaram de ~300 views (07/11)
CORTE_CHANCE = 55  # Vitor, 12/11: era 70 (nenhum Reel medido passava); 55 depois da calibração. Abaixo disto o roteiro novo é descartado sozinho
CORTE = 250  # views de referência (perto da mediana dos Reels medidos)
# apelidos da leitura da API (metricas.json) -> pasta do post
APELIDOS = {"5 skills": "2026-11-07-5-skills", "desenho animado": "2026-11-04-desenho-animado", "canva": "2026-11-04-canva-craft",
            "curriculo": "2026-11-03-curriculo-ia", "skill (02/11)": "2026-11-02-reel-skills", "esculacho": "2026-11-02-trend-esculacho",
            "gemini carbon": "2026-11-02-gemini-carbon"}
PARADAS = set("""a o as os um uma uns umas de da do das dos e em no na nos nas que pra para por com sem seu sua seus suas
voce voces ja mais tudo todo toda isso esse essa este esta ele ela eles elas nao sim ao aos se so mil estrelas semanas semana mes
dias dia numero bizarra bizarro nº gratis comenta te me eu vai vira faz fazer ter tem como qual quem onde quando agora hoje
projetos projeto e o n 1 2 3 4 5""".split())


def _ler(p: Path, padrao=None):
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return padrao


def _sem_acento(t: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", t.lower()) if unicodedata.category(c) != "Mn")


def tokens(pasta: Path) -> set[str]:
    rot = _ler(pasta / "roteiro.json", {}) or {}
    meta = _ler(pasta / "meta.json", {}) or {}
    seg = (rot.get("segmentos") or [{}])[0]
    leg = ""
    for n in ("legenda_reel_instagram.txt", "legenda_instagram.txt"):
        if (pasta / n).exists():
            leg = (pasta / n).read_text(encoding="utf-8").split("\n")[0]
            break
    txt = " ".join([rot.get("tese") or "", " ".join(seg.get("etiqueta") or []), seg.get("tag") or "", seg.get("fala") or "",
                    " ".join(meta.get("temas") or []), leg, pasta.name[11:].replace("-", " ")])
    return {w for w in re.findall(r"[a-z0-9]+", _sem_acento(txt)) if len(w) > 2 and w not in PARADAS}


def formato(pasta: Path) -> str:
    rot = _ler(pasta / "roteiro.json", {}) or {}
    f = _sem_acento(str(rot.get("formato") or (_ler(pasta / "meta.json", {}) or {}).get("formato") or ""))
    if "contagem" in f or "formato 3" in f:
        return "contagem"
    if (pasta / "roteiro.json").exists() or "reel" in f or "palco" in f:
        return "palco"
    return "carrossel"


def historico() -> list[dict]:
    m = _ler(IA / "metricas.json", {}) or {}
    views: dict[str, int] = {}
    for pasta, redes in (m.get("posts") or {}).items():
        ig = (redes or {}).get("instagram") or {}
        v = max([x for k, x in ig.items() if k.startswith("visualizacoes") and isinstance(x, (int, float))] or [0])
        if v:
            views[pasta.rstrip("?")] = int(v)
    for chave, val in m.items():  # leituras da API (a mais recente vale)
        if chave.startswith("leitura_api"):
            for apelido, d in ((val or {}).get("instagram_reels") or {}).items():
                if apelido in APELIDOS and isinstance(d, dict) and d.get("views"):
                    views[APELIDOS[apelido]] = max(views.get(APELIDOS[apelido], 0), int(d["views"]))
    out = []
    for pasta, v in views.items():
        p = IA / "posts" / pasta
        if p.is_dir():
            out.append({"pasta": pasta, "views": v, "tokens": tokens(p), "formato": formato(p)})
    return out


def _mediana(xs):
    """Mediana em escala log (com número par, média geométrica dos dois do meio)."""
    xs = sorted(xs)
    if not xs:
        return CORTE
    n = len(xs)
    return xs[n // 2] if n % 2 else round(math.sqrt(xs[n // 2 - 1] * xs[n // 2]))


def prob_real(pct: float) -> float:
    """Chance real (0-1) de passar de ~1.000 views, pela calibração em painel/calibracao.json (python3 painel/calibra.py)."""
    cal = _ler(IA / "painel" / "calibracao.json", None)
    if not cal or not cal.get("pontos"):
        return pct / 100
    pts = cal["pontos"]
    ate = [p["prob"] for p in pts if p["nota"] <= pct]
    depois = [p["prob"] for p in pts if p["nota"] >= pct]
    return round(((ate[-1] if ate else depois[0]) + (depois[0] if depois else ate[-1])) / 2, 3)


def chance(pasta: Path, hist: list[dict]) -> dict:
    rot = _ler(pasta / "roteiro.json", {}) or {}
    meta = _ler(pasta / "meta.json", {}) or {}
    seg = (rot.get("segmentos") or [{}])[0]
    fatores: list[tuple[int, str]] = []
    tk = tokens(pasta)

    # 1) parecido com o que já foi medido
    sims = sorted(((len(tk & h["tokens"]) / max(1, len(tk | h["tokens"])), h) for h in hist if h["pasta"] != pasta.name),
                  key=lambda x: -x[0])[:3]
    sims = [(s, h) for s, h in sims if s >= 0.08]
    if sims:
        peso = sum(s for s, _ in sims)
        prev = sum(s * math.log10(h["views"]) for s, h in sims) / peso
        ajuste = max(-18, min(25, round((prev - math.log10(CORTE)) * 25)))
        nomes = ", ".join(f'{h["pasta"][11:]} ({h["views"]:,} views)'.replace(",", ".") for _, h in sims[:2])
        fatores.append((ajuste, f"Parecido com {nomes}"))
        tipo = "parecido com o que já virou" if ajuste > 5 else "parecido com o que não foi bem" if ajuste < -5 else "parecido com resultados médios"
    else:
        tipo = "aposta nova"
        fatores.append((0, "Aposta nova: nenhum Reel medido com tema parecido"))

    # 2) formato
    f = formato(pasta)
    grupo = [h["views"] for h in hist if h["formato"] == f]
    if grupo:
        aj = max(-10, min(12, round(math.log10(_mediana(grupo) / _mediana([h["views"] for h in hist])) * 15)))
        nome = {"contagem": "contagem regressiva (formato 3)", "palco": "mascote no palco", "carrossel": "carrossel"}[f]
        fatores.append((aj, f"Formato {nome}: mediana {_mediana(grupo):,} views em {len(grupo)} post(s)".replace(",", ".")))

    # 3) prova viral
    prova = str(rot.get("prova_viral") or meta.get("prova_viral") or "")
    et = " ".join(seg.get("etiqueta") or [])
    m = re.search(r"\+\s?(\d+)\s?MIL", et.upper())
    if m:
        estrelas = int(m.group(1)) * 1000
    elif "estrela" in prova.lower():  # "Estrelas no GitHub (API, 07/11/2026): A 540, B 1.196 ..." -> soma
        trecho = prova.split(":", 1)[-1].split("criados")[0]
        m2 = re.search(r"total\s+([\d.]+)", trecho)
        estrelas = int(m2.group(1).replace(".", "")) if m2 else sum(
            int(x.replace(".", "")) for x in re.findall(r"(?<![\d/.])(\d{1,3}(?:\.\d{3})+|\d{3,6})(?![\d/])", trecho))
    else:
        estrelas = 0
    if estrelas >= 10000:
        fatores.append((6, f"Prova forte: +{estrelas // 1000} mil estrelas"))
    elif estrelas >= 3000:
        fatores.append((3, f"Prova média: +{estrelas // 1000} mil estrelas"))
    elif estrelas:
        fatores.append((-3, f"Prova fraca: {estrelas:,} estrelas".replace(",", ".")))
    elif prova:
        fatores.append((0, "Prova por imprensa/notícia (sem número de estrelas)"))
    else:
        fatores.append((-5, "Sem prova de que viralizou lá fora"))

    # 4) ritmo e duração (acabamento obrigatório)
    pal, dur = rot.get("palavras"), rot.get("duracao_estimada_s")
    if pal and dur:
        ritmo = pal / dur
        fatores.append((-10, f"Fala rápida: {ritmo:.1f} palavras/s (Nintendo, 3,8, decepcionou)") if ritmo > 3.05
                       else (2, f"Fala no ritmo: {ritmo:.1f} palavras/s"))
        if dur > 36:
            fatores.append((-5, f"Longo: ~{dur:.0f} s (alvo até 35 s)"))

    # 5) gatilhos do manual
    if rot.get("polemica") or meta.get("polemica"):
        fatores.append((4, "Polêmica (Vitor: traz engajamento), mas aposta: o da Nintendo não pegou"))
    gancho = _sem_acento(et + " " + (seg.get("fala") or ""))
    if "gratis" in gancho:
        fatores.append((3, "Promete algo grátis no gancho"))
    if rot.get("brinde"):
        fatores.append((2, "Brinde concreto na DM"))

    fatores.insert(0, (BASE, f"Ponto de partida: {BASE}% (2 de {len(hist)} Reels medidos passaram de 300 views)"))
    # 6) gosto do Vitor: parecido com roteiro que ele já aprovou ou negou no app
    julgados = []
    for d in (IA / "posts").iterdir():
        if d.is_dir() and d.name != pasta.name:
            m2 = _ler(d / "meta.json", {}) or {}
            st = str(m2.get("status") or "")
            if st == "negado" or st == "roteiro aprovado":
                julgados.append((d, st, m2.get("nota_vitor") or ""))
    if julgados:
        sim, d2, st, nota = max(((len(tk & tokens(d)) / max(1, len(tk | tokens(d))), d, st, n) for d, st, n in julgados), key=lambda x: x[0])
        if sim >= 0.12:
            fatores.append((-12, f'Parecido com "{d2.name[11:]}", que você negou ({nota or "sem nota"})') if st == "negado"
                           else (5, f'Parecido com "{d2.name[11:]}", que você aprovou'))

    pct = max(5, min(85, sum(a for a, _ in fatores)))
    nivel = "boa aposta" if pct >= 50 else "médio" if pct >= 30 else "arriscado"
    return {"pct": pct, "prob_real": prob_real(pct), "nivel": nivel, "tipo": tipo, "fatores": fatores}


def filtrar(pasta: Path, hist: list[dict] | None = None) -> dict:
    """Filtro do Vitor (12/11): chance < CORTE_CHANCE -> meta.json status "descartado" + nota_filtro; senão não mexe.
    Chame para todo roteiro novo ANTES de mandar para a aprovação. Devolve {"pct", "descartado"}."""
    hist = hist if hist is not None else historico()
    pct = chance(pasta, hist)["pct"]
    if pct >= CORTE_CHANCE:
        return {"pct": pct, "descartado": False}
    mp = pasta / "meta.json"
    meta = _ler(mp, {}) or {}
    meta["status"] = "descartado"
    meta["nota_filtro"] = f"chance {pct}%, abaixo do corte"
    mp.write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
    return {"pct": pct, "descartado": True}


if __name__ == "__main__":  # python3 painel/chance.py -> filtra os roteiros hoje "aguardando aprovação"
    h = historico()
    ok = desc = 0
    for d in sorted((IA / "posts").iterdir()):
        st = str((_ler(d / "meta.json", {}) or {}).get("status") or "").lower()
        if d.is_dir() and "roteiro aguardando" in st:
            r = filtrar(d, h)
            desc += r["descartado"]
            ok += not r["descartado"]
            print(f'{r["pct"]:>3}%  {"DESCARTADO" if r["descartado"] else "fica      "}  {d.name}')
    print(f"{desc} descartados, {ok} ficaram (corte {CORTE_CHANCE}%)")

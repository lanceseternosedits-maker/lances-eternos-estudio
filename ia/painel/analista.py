"""Analista de dados do IA em 60s (Vitor, 07/11): lê a leitura mais recente do Metricool e gera painel/resultados.json.

Uso (de dentro de ia/): python3 painel/analista.py
- Entrada: painel/dados/metricool_AAAA-MM-DD.json (o agente analista grava uma por leitura; cada linha leva a "pasta" do post).
- Saída: painel/resultados.json (totais, um item por Reel, médias por formato/categoria/horário e insights automáticos)
  e atualiza metricas.json → posts[pasta].instagram.visualizacoes (é o que o chance.py usa).
- Os insights escritos pelo agente (leitura humana dos números) ficam em painel/insights.json; o painel mostra os dois.
"""
from __future__ import annotations

import datetime as dt
import json
import math
from pathlib import Path

PAINEL = Path(__file__).resolve().parent
IA = PAINEL.parent


def ler(p: Path, padrao=None):
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return padrao


def mediana(xs):
    xs = sorted(x for x in xs if x is not None)
    if not xs:
        return None
    n = len(xs)
    return xs[n // 2] if n % 2 else (xs[n // 2 - 1] + xs[n // 2]) / 2


def pct(a, b):
    return round(100 * a / b, 1) if b else None


def brt(utc: str) -> dt.datetime:
    return dt.datetime.strptime(utc, "%Y%m%d%H%M%S") - dt.timedelta(hours=3)


def faixa(h: int) -> str:
    return "manhã (6–11h)" if h < 12 else "tarde (12–17h)" if h < 18 else "noite (18h+)"


def formato_curto(meta: dict, rot: dict) -> str:
    f = (meta.get("formato") or "").lower()
    if "contagem" in f or "formato 3" in f:
        return "contagem (formato 3)"
    if "pov" in f:
        return "POV"
    if "lista" in f or "formato 2" in f:
        return "lista + demo (formato 2)"
    if "carrossel" in f and "reel" not in f:
        return "carrossel"
    return "mascote no palco (formato 1)"


def duracao(meta: dict) -> float | None:
    for it in (meta.get("checagem") or {}).get("itens") or []:
        if it.get("nome") == "Duração":
            try:
                return float(str(it.get("valor")).split()[0])
            except ValueError:
                return None
    return None


def semanas(leituras, lido_em):
    """Semana x semana do mês (Vitor, 13/11): S1 = dias 1–7, S2 = 8–14, S3 = 15–21, S4 = 22–28, S5 = 29+.
    Junta todas as leituras (a mais nova vale para cada post), porque cada uma só cobre 14 dias."""
    ig, tk = {}, {}
    for f in leituras:
        d = ler(f, {}) or {}
        for row in d.get("instagram") or []:
            r = dict(zip(d["instagram_campos"], row)); ig[r["url"]] = r
        for row in d.get("tiktok") or []:
            r = dict(zip(d["tiktok_campos"], row)); tk[r["url"]] = r
    try:
        agora = dt.datetime.strptime(lido_em, "%Y-%m-%d %H:%M")
    except Exception:
        agora = dt.datetime.now()
    def chave(q):
        return (q.year, q.month, min((q.day - 1) // 7 + 1, 5))
    MES = ["", "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]
    g, gt, dias = {}, {}, {}
    for r in ig.values():
        q = brt(r["data_utc"])
        pasta = r.get("pasta")
        meta = ler(IA / "posts" / pasta / "meta.json", {}) if pasta else {}
        rot = ler(IA / "posts" / pasta / "roteiro.json", {}) if pasta else {}
        x = {"q": q, "titulo": r.get("titulo"), "views": r.get("views") or 0, "alcance": r.get("alcance") or 0,
             "salv": r.get("salvamentos") or 0, "env": r.get("envios") or 0, "com": r.get("comentarios") or 0,
             "p3": r.get("taxa_3s"), "cat": (meta or {}).get("categoria") or (rot or {}).get("categoria") or "novidade"}
        g.setdefault(chave(q), []).append(x)
        dias.setdefault(q.strftime("%Y-%m-%d"), []).append(x["views"])
    for r in tk.values():
        if r.get("duracao_s"):
            gt.setdefault(chave(brt(r["data_utc"])), []).append(r.get("views") or 0)
    out = []
    for k in sorted(g):
        v = g[k]; a, m, n = k
        ini = dt.datetime(a, m, (n - 1) * 7 + 1)
        fim_nom = ini + dt.timedelta(days=6) if n < 5 else (dt.datetime(a + (m == 12), m % 12 + 1, 1) - dt.timedelta(days=1))
        ultimo = max(x["q"] for x in v)
        fim = min(fim_nom, ultimo)
        ndias = (fim.date() - ini.date()).days + 1
        alc = sum(x["alcance"] for x in v)
        top = sorted(v, key=lambda x: -x["views"])[:3]
        cats = {}
        for x in v:
            cats.setdefault(x["cat"], []).append(x["views"])
        tkv = gt.get(k) or []
        out.append({
            "nome": f"S{n} {MES[m]}", "de_iso": ini.strftime("%Y-%m-%d"), "de": ini.strftime("%d/%m"), "ate": fim.strftime("%d/%m"), "ate_nominal": fim_nom.strftime("%d/%m"),
            "completa": fim_nom.date() < agora.date(), "dias": ndias, "reels": len(v), "reels_por_dia": round(len(v) / ndias, 1),
            "views": sum(x["views"] for x in v), "views_por_dia": round(sum(x["views"] for x in v) / ndias),
            "mediana_views": round(mediana([x["views"] for x in v]) or 0), "media_views": round(sum(x["views"] for x in v) / len(v)),
            "acima_1000": sum(1 for x in v if x["views"] >= 1000), "alcance": alc,
            "salvamentos": sum(x["salv"] for x in v), "envios": sum(x["env"] for x in v), "comentarios": sum(x["com"] for x in v),
            "salvar_pct": pct(sum(x["salv"] for x in v), alc), "enviar_pct": pct(sum(x["env"] for x in v), alc),
            "comentar_pct": pct(sum(x["com"] for x in v), alc), "passou_3s_pct": mediana([x["p3"] for x in v]),
            "idade_mediana_dias": round(mediana([(agora - x["q"]).total_seconds() / 86400 for x in v]) or 0, 1),
            "top": [{"titulo": x["titulo"], "views": x["views"]} for x in top],
            "por_categoria": {c: {"n": len(l), "mediana_views": round(mediana(l))} for c, l in cats.items()},
            "tiktok_videos": len(tkv), "tiktok_views": sum(tkv), "tiktok_mediana": mediana(tkv),
        })
    serie = [{"data": d, "reels": len(l), "views": sum(l), "mediana": round(mediana(l))} for d, l in sorted(dias.items())]
    return {"semanas": out, "dias": serie}


def main():
    leituras = sorted((PAINEL / "dados").glob("metricool_*.json"))
    if not leituras:
        print("sem leitura em painel/dados/")
        return
    d = ler(leituras[-1], {})
    ci, ct = d["instagram_campos"], d["tiktok_campos"]
    tk_por_pasta = {}
    for row in d.get("tiktok") or []:
        r = dict(zip(ct, row))
        if r.get("pasta") and r.get("duracao_s"):
            tk_por_pasta[r["pasta"]] = r
    itens = []
    for row in d.get("instagram") or []:
        r = dict(zip(ci, row))
        pasta = r.get("pasta")
        meta = ler(IA / "posts" / pasta / "meta.json", {}) if pasta else {}
        rot = ler(IA / "posts" / pasta / "roteiro.json", {}) if pasta else {}
        quando = brt(r["data_utc"])
        alc = r.get("alcance") or 0
        dur = duracao(meta or {}) or (tk_por_pasta.get(pasta) or {}).get("duracao_s")
        tk = tk_por_pasta.get(pasta) or {}
        itens.append({
            "pasta": pasta, "titulo": r.get("titulo"), "url": r.get("url"), "quando": quando.strftime("%Y-%m-%d %H:%M"),
            "faixa": faixa(quando.hour), "categoria": (meta or {}).get("categoria") or (rot or {}).get("categoria") or "novidade",
            "formato": formato_curto(meta or {}, rot or {}),
            "views": r.get("views") or 0, "alcance": alc, "curtidas": r.get("curtidas") or 0, "comentarios": r.get("comentarios") or 0,
            "salvamentos": r.get("salvamentos") or 0, "envios": r.get("envios") or 0,
            "tempo_medio_s": r.get("tempo_medio_s"), "duracao_s": dur,
            "assistido_pct": pct(r.get("tempo_medio_s") or 0, dur) if dur and (r.get("tempo_medio_s") or 0) < dur * 1.5 else None,
            "passou_3s_pct": r.get("taxa_3s"),
            "salvar_pct": pct(r.get("salvamentos") or 0, alc), "enviar_pct": pct(r.get("envios") or 0, alc),
            "comentar_pct": pct(r.get("comentarios") or 0, alc),
            "tiktok_views": tk.get("views"),
        })
    itens.sort(key=lambda x: -x["views"])
    med = mediana([x["views"] for x in itens]) or 1
    for x in itens:
        x["vs_mediana"] = round(x["views"] / med, 1)

    def grupo(chave):
        g = {}
        for x in itens:
            g.setdefault(x[chave], []).append(x)
        return sorted(({"nome": k, "n": len(v), "mediana_views": round(mediana([y["views"] for y in v])),
                        "salvar_pct": mediana([y["salvar_pct"] for y in v]), "passou_3s_pct": mediana([y["passou_3s_pct"] for y in v])}
                       for k, v in g.items()), key=lambda z: -z["mediana_views"])

    tiktok = [dict(zip(ct, r)) for r in d.get("tiktok") or []]
    tk_video = [r for r in tiktok if r.get("duracao_s")]
    tk_foto = [r for r in tiktok if not r.get("duracao_s")]
    tot = {"reels_medidos": len(itens), "views_ig": sum(x["views"] for x in itens), "alcance_ig": sum(x["alcance"] for x in itens),
           "salvamentos": sum(x["salvamentos"] for x in itens), "envios": sum(x["envios"] for x in itens),
           "comentarios": sum(x["comentarios"] for x in itens), "mediana_views_ig": round(med),
           "views_tiktok_video": sum(r["views"] for r in tk_video), "mediana_tiktok_video": mediana([r["views"] for r in tk_video]),
           "mediana_tiktok_fotos": mediana([r["views"] for r in tk_foto])}

    # insights automáticos (regras simples; a leitura do agente vai em insights.json)
    auto = []
    por_fmt = grupo("formato")
    if len(por_fmt) > 1 and por_fmt[0]["n"] >= 2:
        a, b = por_fmt[0], por_fmt[1]
        auto.append(f"Formato campeão: {a['nome']} (mediana {a['mediana_views']} views em {a['n']} Reels), "
                    f"{round(a['mediana_views'] / max(b['mediana_views'], 1), 1)}× o 2º ({b['nome']}).")
    top = itens[0] if itens else None
    if top:
        auto.append(f"Melhor Reel: {top['titulo']} com {top['views']} views ({top['vs_mediana']}× a mediana); "
                    f"salvamento {top['salvar_pct']}% e envio {top['enviar_pct']}% do alcance.")
    p3 = mediana([x["passou_3s_pct"] for x in itens])
    if p3 is not None and p3 < 50:
        auto.append(f"Gancho: só {p3}% (mediana) passa dos 3 primeiros segundos. Mais da metade sai antes do 1º item: o 1º quadro e a 1ª frase precisam de conflito.")
    ass = mediana([x["assistido_pct"] for x in itens])
    if ass:
        auto.append(f"Retenção: quem fica assiste em média {round(ass)}% do vídeo. O CTA do meio (na nº 3) pega mais gente que o do fim.")
    cm = mediana([x["comentar_pct"] for x in itens])
    sv = mediana([x["salvar_pct"] for x in itens])
    if cm is not None and sv is not None and sv > cm:
        auto.append(f"O público salva ({sv}% do alcance) mais do que comenta ({cm}%). Conteúdo útil funciona; o comentário ainda é o ponto fraco.")
    if tot["mediana_tiktok_video"] is not None and tot["mediana_tiktok_video"] < 0.2 * med:
        auto.append(f"TikTok travado: mediana de {tot['mediana_tiktok_video']} views por vídeo contra {round(med)} no Instagram"
                    + (f"; posts de fotos no TikTok tiveram mediana de {tot['mediana_tiktok_fotos']}." if tot["mediana_tiktok_fotos"] else "."))

    import re
    auto = [re.sub(r"(\d)\.(\d)", r"\1,\2", a) for a in auto]
    saida = {"gerado_em": dt.datetime.now().strftime("%Y-%m-%d %H:%M"), "leitura": leituras[-1].name, "lido_em": d.get("lido_em"),
             "periodo": d.get("periodo"), "totais": tot, "reels": itens, "por_formato": por_fmt, "por_categoria": grupo("categoria"),
             "por_faixa": grupo("faixa"), "insights_auto": auto,
             "semana_x_semana": semanas(leituras, d.get("lido_em") or ""),
             "tiktok": [{"titulo": r.get("titulo"), "views": r.get("views"), "foto": not r.get("duracao_s"), "pasta": r.get("pasta")} for r in tiktok]}
    (PAINEL / "resultados.json").write_text(json.dumps(saida, ensure_ascii=False, indent=1), encoding="utf-8")

    # alimenta o chance.py
    m = ler(IA / "metricas.json", {}) or {}
    posts = m.setdefault("posts", {})
    for x in itens:
        if x["pasta"]:
            ig = posts.setdefault(x["pasta"], {}).setdefault("instagram", {})
            ig.update({"visualizacoes": x["views"], "alcance": x["alcance"], "curtidas": x["curtidas"], "comentarios": x["comentarios"],
                       "salvamentos": x["salvamentos"], "envios": x["envios"], "lido_em": f"{d.get('lido_em')} (Metricool API)"})
            if x["tiktok_views"] is not None:
                posts[x["pasta"]].setdefault("tiktok", {}).update({"visualizacoes": x["tiktok_views"], "lido_em": f"{d.get('lido_em')} (Metricool API)"})
    (IA / "metricas.json").write_text(json.dumps(m, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(itens)} Reels · mediana {round(med)} views · {len(auto)} insights automáticos")
    for a in auto:
        print("-", a)


if __name__ == "__main__":
    main()

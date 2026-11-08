"""Agente de Redes Sociais (Vitor, 08/11): lê a última leitura de perfil do Metricool em painel/dados/redes_AAAA-MM-DD.json
(linhas cruas de getAnalyticsDataByMetrics, colunas em ig_cols/tt_cols + data no fim) e gera painel/redes.json
(série diária, totais de 7 e 30 dias, seguidores e o que mudou). Uso (de dentro de ia/): python3 painel/redes.py"""
import json
from pathlib import Path

PAINEL = Path(__file__).resolve().parent
arqs = sorted((PAINEL / "dados").glob("redes_*.json"))
if not arqs:
    raise SystemExit("sem leitura em painel/dados/redes_*.json")
d = json.loads(arqs[-1].read_text(encoding="utf-8"))
NOMES = {"IGEV01": "seguidores", "IGEV43": "ganhos", "IGEV44": "perdidos", "IGEV05": "visualizacoes", "IGEV06": "alcance", "IGEV23": "views_reels", "IGEV42": "contas_engajadas", "IGEV22": "reels",
         "TKEV07": "seguidores", "TKEV16": "ganhos", "TKEV17": "perdidos", "TKEV02": "visualizacoes", "TKEV11": "alcance", "TKEV09": "visitas_perfil", "TKEV01": "videos"}


def serie(linhas, cols):
    dias = {}
    for r in linhas:
        dia = f"{r[-1][:4]}-{r[-1][4:6]}-{r[-1][6:8]}"
        dias[dia] = {NOMES[c]: (float(v) if v not in (None, "") else None) for c, v in zip(cols, r[:-1])}
    return [{"dia": k, **dias[k]} for k in sorted(dias)]


def resumo(s):
    seg = [(x["dia"], x["seguidores"]) for x in s if x.get("seguidores")]
    ult = seg[-1] if seg else (None, None)
    sete = s[-7:]
    soma = lambda k, l: int(sum(x.get(k) or 0 for x in l))
    ini7 = next((v for dia, v in seg if dia >= sete[0]["dia"]), None) if sete else None
    return {"seguidores": int(ult[1]) if ult[1] is not None else None, "seguidores_em": ult[0],
            "ganho_7d": int(ult[1] - ini7) if ult[1] is not None and ini7 is not None else None,
            "visualizacoes_7d": soma("visualizacoes", sete), "visualizacoes_30d": soma("visualizacoes", s),
            "melhor_dia": max(s, key=lambda x: x.get("visualizacoes") or 0)["dia"] if s else None}


ig, tt = serie(d.get("ig", []), d["ig_cols"]), serie(d.get("tt", []), d["tt_cols"])
out = {"lido_em": d.get("lido_em"), "instagram": {"resumo": resumo(ig), "serie": ig}, "tiktok": {"resumo": resumo(tt), "serie": tt}}
ant = PAINEL / "redes.json"
if ant.exists():  # mantém a leitura escrita pelo agente (insights) se houver
    velho = json.loads(ant.read_text(encoding="utf-8"))
    out["leitura"] = velho.get("leitura", [])
(PAINEL / "redes.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print("redes.json:", out["instagram"]["resumo"], out["tiktok"]["resumo"])

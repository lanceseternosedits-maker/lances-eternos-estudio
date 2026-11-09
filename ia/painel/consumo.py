"""Consumo da Claude por tarefa (Vitor, 09/11: "aba nova com gráficos da distribuição de consumo da Claude").

Uso (de ia/): python3 painel/consumo.py  →  painel/consumo.json (a aba 🧠 Consumo do painel lê este arquivo)
Entrada: painel/dados/consumo_bruto.json, gravado pela sessão do painel com get_session de cada sessão (tokens e custo
equivalente em API de cada uma). O plano do Claude é fixo: o "US$" aqui é o PESO de cada tarefa (o que custaria na API),
útil para ver quem gasta o limite semanal, não uma cobrança.
"""
import json
from collections import defaultdict
from pathlib import Path

AQUI = Path(__file__).resolve().parent
import re
BR = AQUI / "dados" / "consumo_bruto.json"
B = json.loads(BR.read_text(encoding="utf-8")) if BR.exists() else {"lido_em": "", "sessoes": []}
# leitura nova (gravada pelo analista): junta por id, mantendo o histórico das sessões que já sumiram da lista
NOVO = AQUI / "dados" / "consumo_novo.json"
def grupo_de(t):
    t = (t or "").lower()
    for pad, g in ((r"^iaem60s$", "painel"), (r"produ[çc][ãa]o|turno da madrugada", "producao"), (r"roteir", "roteiros"), (r"est[úu]dio de reels|produto", "produto"),
                   (r"ca[çc]ador", "rotina:cacador"), (r"redes sociais", "rotina:redes"), (r"financeiro", "rotina:financeiro"), (r"cobran[çc]a", "rotina:cobranca"),
                   (r"analista", "rotina:analista"), (r"ia em 60s|iaem60s|gemini", "setup")):
        if re.search(pad, t):
            return g
    return "outros"
if NOVO.exists():
    N = json.loads(NOVO.read_text(encoding="utf-8")); por_id = {x["id"]: x for x in B["sessoes"]}
    for x in N.get("sessoes", []):
        x["grupo"] = x.get("grupo") or (por_id.get(x["id"], {}).get("grupo")) or grupo_de(x.get("titulo"))
        if x["grupo"] == "outros": x["titulo"] = "outro projeto"
        por_id[x["id"]] = {**por_id.get(x["id"], {}), **x}
    B = {"lido_em": N.get("lido_em", B["lido_em"]), "sessoes": list(por_id.values())}
    BR.write_text(json.dumps(B, ensure_ascii=False, indent=1), encoding="utf-8"); NOVO.unlink()

NOMES = {"painel": "🧭 Conversa do painel (orquestra tudo)", "producao": "🎬 Produção de vídeos", "roteiros": "✍️ Roteiros",
         "produto": "🧪 Produto Estúdio de Reels", "setup": "🛠️ Montagem do projeto", "rotina:cacador": "🔎 Caçador de referências",
         "rotina:redes": "📈 Redes sociais", "rotina:financeiro": "💵 Financeiro", "rotina:cobranca": "🔔 Cobrança",
         "rotina:analista": "📊 Analista", "outros": "📦 Outros projetos do Vitor"}
CORES = {"painel": "#ff7a3d", "producao": "#7b61ff", "roteiros": "#3d7bf2", "produto": "#38c172", "setup": "#f5b83d",
         "outros": "#9aa0ab"}

grupos = defaultdict(lambda: {"usd": 0.0, "sessoes": 0, "entrada": 0, "saida": 0, "cache_lido": 0, "cache_gravado": 0})
modelos = defaultdict(float)
tok = defaultdict(int)
sessoes = []
for s in B["sessoes"]:
    u = s.get("usage") or {}
    usd = float(u.get("cost_usd") or 0)
    g = grupos[s["grupo"]]
    g["usd"] += usd; g["sessoes"] += 1
    for k, c in (("entrada", "input_tokens"), ("saida", "output_tokens"), ("cache_lido", "cache_read_tokens"), ("cache_gravado", "cache_write_tokens")):
        g[k] += int(u.get(c) or 0); tok[k] += int(u.get(c) or 0)
    m = (s.get("ultimo_modelo_servido") or s.get("modelo") or "?").replace("claude-", "").replace("-5-5", " 5.5").replace("-5-1", " 5.1")
    modelos[m.capitalize()] += usd
    sessoes.append({"titulo": s["titulo"], "grupo": s["grupo"], "usd": round(usd, 2), "modelo": m.capitalize(),
                    "cache_lido_m": round(int(u.get("cache_read_tokens") or 0) / 1e6, 1), "criada": s.get("criada", "")[:10]})

total = sum(g["usd"] for g in grupos.values()) or 1
lista = sorted(({"grupo": k, "nome": NOMES.get(k, k), "cor": CORES.get(k, "#c9ced8" if not k.startswith("rotina") else "#5fd1c1"),
                 "usd": round(v["usd"], 2), "pct": round(100 * v["usd"] / total, 1), "sessoes": v["sessoes"],
                 "cache_lido_m": round(v["cache_lido"] / 1e6, 1), "saida_m": round(v["saida"] / 1e6, 2)} for k, v in grupos.items()),
               key=lambda x: -x["usd"])
rot = sum(x["usd"] for x in lista if x["grupo"].startswith("rotina"))
tot_tok = sum(tok.values()) or 1
painel = next((x for x in lista if x["grupo"] == "painel"), None)
cache_pct = round(100 * tok["cache_lido"] / tot_tok, 1)

leitura = []
if painel:
    leitura.append(f"A conversa do painel sozinha é {painel['pct']}% do consumo: ela carrega uma conversa enorme (cada resposta relê o histórico). "
                   "Ação: trabalho pesado (vídeo, landing, produto) vai para sessão nova e curta; o painel só orquestra.")
leitura.append(f"{cache_pct}% dos tokens são releitura de contexto (cache), não texto novo: conversa longa custa mais a cada mensagem.")
opus = sum(v for k, v in modelos.items() if "Opus" in k)
if opus / total > 0.7:
    leitura.append(f"Opus responde por {100 * opus / total:.0f}% do peso. Ação: produção de vídeo e rotinas em Sonnet (gasta bem menos do limite); Opus só para decidir e revisar.")
leitura.append(f"As rotinas agendadas (caçador, redes, financeiro, cobrança) somam só US$ {rot:.2f} ({100 * rot / total:.1f}%): são baratas, podem continuar.")
prod = next((x for x in lista if x["grupo"] == "producao"), None)
if prod:
    leitura.append(f"Produção de vídeos: {prod['pct']}% em {prod['sessoes']} sessões (~US$ {prod['usd'] / max(1, prod['sessoes']):.0f} por sessão).")

saida = {"lido_em": B["lido_em"], "total_usd": round(total, 2), "grupos": lista,
         "modelos": [{"modelo": k, "usd": round(v, 2), "pct": round(100 * v / total, 1)} for k, v in sorted(modelos.items(), key=lambda x: -x[1])],
         "tokens": {k: v for k, v in tok.items()}, "tokens_pct": {k: round(100 * v / tot_tok, 1) for k, v in tok.items()},
         "top": sorted(sessoes, key=lambda x: -x["usd"])[:8], "leitura": leitura,
         "nota": "US$ = quanto custaria na API (peso de cada tarefa). O plano do Claude é fixo; o que acaba é o limite de uso (5 h e semanal)."}
for t in saida["top"]:
    if t["grupo"] == "outros":
        t["titulo"] = "outro projeto"
(AQUI / "consumo.json").write_text(json.dumps(saida, ensure_ascii=False, indent=1), encoding="utf-8")
print("ok consumo.json", f"total US$ {total:.2f}", [(x['grupo'], x['pct']) for x in lista[:5]])

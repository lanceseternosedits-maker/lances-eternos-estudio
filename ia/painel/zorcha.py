"""Gera painel/respostas.json (lido pelo robô de comentários do Worker) e painel/zorcha.md (plano B manual): uma automação do Zorcha (comentário → resposta + DM) por post publicado ou agendado.

Uso (de dentro de ia/): python3 painel/zorcha.py
O Vitor cria as automações no app do Zorcha (não tem API): gatilho = o Reel específico + palavra; resposta pública; DM.
Rodar depois de agendar Reel novo e avisar o Vitor das palavras novas.
"""
import json
from pathlib import Path

IA = Path(__file__).resolve().parent.parent
RESP = ["Te mandei na DM! 📩 Se não aparecer, olha em Solicitações de mensagem.", "Enviado no direct! 🚀 Confere lá (às vezes cai em Solicitações).",
        "Mandei agora na DM 😉", "Prontinho, tá na sua DM! 📩", "Chegou aí? Mandei no direct 🙌"]


def ler(p):
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return {}


itens, robo = [], []
PUBS = (ler(IA / "painel" / "publicacoes.json") or {}).get("publicacoes", [])
SIGLAS = {"ia", "ias", "pc", "tv", "app", "apps", "top", "dm", "ibm", "darpa", "ikea", "bmw", "nba", "3d", "usb", "gpt", "eliza", "pov", "pdf", "vfx"}
NOMES = {n.lower(): n for n in "Claude ChatGPT Gemini Microsoft Windows Mac Apple Nintendo Google Kasparov Tay Deep Blue GitHub Instagram TikTok Canva Turing Bing Samsung Watson AlphaGo Sam Altman Nobel Sony PlayStation Linux Jarvis Sydney Chevrolet Dartmouth Jeopardy Nova York Brasil Switch".split()}
def bonito(t):
    """CAIXA ALTA → frase normal, mantendo siglas (IA, PC, TV) e nomes próprios."""
    ws = []
    for i, w in enumerate(t.lower().split()):
        nu = w.strip(".,:!?()\"'")
        if nu in SIGLAS: w = w.replace(nu, nu.upper())
        elif nu in NOMES: w = w.replace(nu, NOMES[nu])
        elif i == 0 or (ws and ws[-1][-1:] in "?!.:"): w = w[:1].upper() + w[1:]
        ws.append(w)
    return " ".join(ws)
for d in sorted((IA / "posts").iterdir()):
    mr = ler(d / "meta.json")
    if d.is_dir() and mr.get("cta") and (d / "resposta_dm.txt").exists() and mr.get("status") != "negado":
        hq = (mr.get("horarios") or {}).get("instagram") or ""
        import re as _re
        mq = _re.match(r"(\d{2})/(\d{2})\s+(\d{2}:\d{2})", hq)
        ano = (mr.get("data") or d.name)[:4]
        quando = hq if hq[:4].isdigit() else (f"{ano}-{mq.group(2)}-{mq.group(1)} {mq.group(3)}" if mq else (mr.get("data") or d.name[:10]))
        rot0 = ler(d / "roteiro.json"); seg0 = (rot0.get("segmentos") or [{}])[0]
        tit = next((str(x) for x in ((rot0.get("capa") or {}).get("texto"), (seg0.get("etiqueta") or [None])[0], seg0.get("tag"), rot0.get("tese")) if x and len(str(x).split()) >= 2), "")
        url = next((x.get("url") for x in PUBS if x.get("rede") == "instagram" and x.get("url") and x.get("data", "")[:16] == quando[:16]), "")
        robo.append({"palavra": mr["cta"].upper(), "pasta": d.name, "quando": quando, "titulo": bonito(tit)[:90],
                     "thumb": f"/capas/thumb-{d.name}.jpg" if (IA / "painel" / "capas" / f"thumb-{d.name}.jpg").exists() else "",
                     "url": url, "dm": (d / "resposta_dm.txt").read_text(encoding="utf-8").strip()})
    m = ler(d / "meta.json")
    if not d.is_dir() or not m.get("cta") or m.get("status") or not (d / "resposta_dm.txt").exists():
        continue  # status presente = ainda depende do Vitor (roteiro/vídeo) ou negado
    q = (m.get("horarios") or {}).get("instagram") or ""
    quando = f"{q[8:10]}/{q[5:7]} {q[11:16]}" if q[:4].isdigit() else (m.get("data") or q)
    itens.append((d.name, m["cta"].upper(), quando, (d / "resposta_dm.txt").read_text(encoding="utf-8").strip()))
itens.sort(key=lambda x: x[0], reverse=True)
contagem = {}
for _, p, _, _ in itens:
    contagem[p] = contagem.get(p, 0) + 1
out = ["# Automações do Zorcha (comentário → resposta + DM)", "",
       "Gerado por `python3 painel/zorcha.py`. Um bloco por Reel publicado ou agendado, do mais novo para o mais antigo.", "",
       "**Como criar no Zorcha:** nova automação de comentário → escolha **o Reel específico** (não \"qualquer post\") → palavra-chave → "
       "ative a resposta pública (cole 2 ou 3 das variações abaixo, se o app aceitar várias) → mensagem da DM (cole o texto do bloco). "
       "Marque a palavra em qualquer formato (maiúscula/minúscula). Teste comentando a palavra com outra conta.", "",
       "**Respostas públicas (variar):** " + " · ".join(f"\"{r}\"" for r in RESP), ""]
rep = [p for p, n in contagem.items() if n > 1]
if rep:
    out += [f"⚠️ Palavras usadas em mais de um Reel: {', '.join(rep)}. Por isso o gatilho tem que ser o Reel específico.", ""]
for nome, palavra, quando, dm in itens:
    out += [f"## {palavra} · {quando}", f"Post: `{nome}`", "", "```", dm, "```", ""]
kit = ler(IA / "produtos" / "assistente-pessoal" / "kit.json")
SITE = "https://iaem60s.com"
if kit.get("checkout"):
    dm_kit = (f"Opa! Aqui está o Super Assistente de IA 👇\n\n10 assistentes prontos (contas, cardápio, revisor, treino, inglês, agenda, estudos, "
              f"atendimento, viagem e detector de golpe) + as 6 alavancas que turbinam qualquer IA + 10 comandos turbo. PDF de 20 páginas.\n\n"
              f"👉 {kit['checkout']}\n\nGarantia de 7 dias. Detalhes: {SITE}/kit")
else:
    dm_kit = (f"Opa! O Super Assistente de IA está saindo do forno 🔥\n\nEle vai sair por R$ 17 e você já está na lista para receber o link. "
              f"Enquanto isso, veja tudo o que vem no kit: {SITE}/kit")
globais = [{"palavra": "KIT", "pasta": "", "quando": "", "dm": dm_kit}]
(IA / "painel" / "respostas.json").write_text(json.dumps({"respostas_publicas": RESP, "posts": robo, "globais": globais,
    "produto": {"nome": "Super Assistente de IA", "preco": kit.get("preco", ""), "checkout": kit.get("checkout", ""), "landing": SITE + "/kit",
                "resumo": "10 assistentes de IA prontos para ChatGPT, Claude ou Gemini", "capa": "/capas/kit-p1.jpg"}}, ensure_ascii=False, indent=1), encoding="utf-8")
(IA / "painel" / "zorcha.md").write_text("\n".join(out), encoding="utf-8")
print(f"{len(itens)} automações em painel/zorcha.md")

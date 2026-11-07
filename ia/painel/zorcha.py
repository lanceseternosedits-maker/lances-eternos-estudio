"""Gera painel/zorcha.md: uma automação do Zorcha (comentário → resposta + DM) por post publicado ou agendado.

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


itens = []
for d in sorted((IA / "posts").iterdir()):
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
(IA / "painel" / "zorcha.md").write_text("\n".join(out), encoding="utf-8")
print(f"{len(itens)} automações em painel/zorcha.md")

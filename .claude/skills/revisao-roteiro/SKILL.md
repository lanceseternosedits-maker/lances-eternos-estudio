---
name: revisao-roteiro
description: Painel de revisão do IA em 60s. Quatro revisores de IA (subagentes) debatem cada roteiro novo antes de ele ir para a aprovação do Vitor; o resultado vai para o meta.json (campo "revisao") e aparece no app do painel ao lado do aprovar/negar. Use em toda rodada de produção depois de escrever os roteiros, ou quando o Vitor pedir "passa no painel de revisão".
---

# Painel de revisão de roteiros (Vitor, 08/11)

Nenhum roteiro vai para o Vitor sem passar aqui. O objetivo é ele receber só roteiro bom: menos "negado" por nichado, bobo, confuso ou fonte fraca.

## Os 4 revisores
Rode os 4 **em paralelo** (ferramenta Agent, um subagente por revisor, `subagent_type: general-purpose`, modelo mais barato disponível, ex. `haiku` ou `sonnet`). Cada um recebe: o `roteiro.json` inteiro, o `meta.json`, e só o trecho do manual que precisa (abaixo). Nenhum vê o parecer do outro na 1ª volta.

| Revisor | Lê | Pergunta que responde |
|---|---|---|
| **vitor** | "Gosto do Vitor" e "Regra de ouro" em `ia/AGENTE.md`; últimas 20 linhas de `SELECT pasta, decisao, nota FROM decisoes ORDER BY em DESC` se o conector Cloudflare estiver disponível | O Vitor aprovaria? É nichado, bobo, confuso, "IA já faz isso", "nada a ver" ou genérico? A pessoa comum entende em 2 s e usa no dia a dia? |
| **fatos** | campos `fontes`, `prova_viral`, falas | Todo número, nome, data e estrela tem fonte oficial ou 2 fontes? Algo "grátis" que não é? Promessa exagerada? Prova viral dos últimos 7 dias (🆕)? |
| **gancho** | "Teste viral do roteiro", "Viralização" e "Regras da rodada" em `ia/AGENTE.md`; `ia/painel/insights.json`; `ia/skills/aprendizados_0811.md` (para ⚙️/📜) | Conflito em até 1,5 s? Etiqueta forte com número real? CTA no meio + pedido de envio no meio? Pergunta final sobre a vida da pessoa (não opinião), que se responde com 1 palavra? Cumpre as 5 "Regras da rodada" (contagem como padrão, 1º quadro com objeto reconhecível, história com "salva/manda" e 3 fatos, 1 roteiro do kit por rodada)? |
| **clareza** | falas | Alguma frase passa de ~12 palavras ou tem jargão sem tradução? Velocidade ≤ 3,0 palavras/s e até 35 s? Cada cena tem 1 ideia? |

Cada revisor devolve **só JSON**: `{"revisor": "...", "veredito": "passa" | "ajustar" | "reprova", "nota": "1 frase em PT-BR, para o Vitor ler", "ajustes": ["mudança concreta: cena X, de '...' para '...'"]}`.

## Debate e decisão
1. Se todos "passa" → veredito **passou**.
2. Se houver "ajustar" → aplique no `roteiro.json` os ajustes que não contradizem outro revisor, recalcule `palavras`/`duracao_estimada_s`, e rode **uma 2ª volta só com quem pediu ajuste** (mostrando o roteiro novo). Passou → **ajustado**.
3. Se o revisor **vitor** ou **fatos** disser "reprova" (ou alguém reprovar na 2ª volta) → **reprovado**: não vai para o Vitor. Grave `status: "reprovado na revisão"` no `meta.json`, tire do `estado.json` "aguardando aprovação" e escreva outro roteiro no lugar (que também passa no painel). Máximo 2 substituições por vaga; se a 3ª falhar, mande a melhor com veredito "ajustado" e o aviso na nota.
4. Gancho e clareza sozinhos não reprovam: viram ajuste.

## O que gravar no `meta.json`
```json
"revisao": {
  "veredito": "passou" | "ajustado" | "reprovado",
  "resumo": "até 8 palavras (ex.: gancho forte, fonte ok)",
  "pareceres": [{"revisor": "vitor", "veredito": "passa", "nota": "..."}, ...],
  "ajustes": ["cena s3: troquei 'token' por 'pedaço de palavra'"],
  "em": "AAAA-MM-DD HH:MM"
}
```
Depois rode `python3 painel/gerar.py` (de dentro de `ia/`): o app mostra "✅/🛠️ Revisores: …" embaixo do 🔥 % de chance, com o parecer de cada revisor ao abrir. Commit e push junto com os roteiros.

## Custo
Só tokens (4 subagentes curtos por roteiro, ~+10% na rodada de produção). Nada pago.

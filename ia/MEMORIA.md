# Memória da conversa com o Vitor (passagem de bastão entre sessões)

Toda sessão nova do painel lê este arquivo junto com o CLAUDE.md. Ele guarda o que está **em andamento** e o que **depende do Vitor**; as regras permanentes ficam no CLAUDE.md e no AGENTE.md, e a história completa no `git log`. Ao fim de cada dia (ou ao trocar de conversa), a sessão atualiza este arquivo: apaga o que terminou e anota o que ficou pendente. Máximo ~60 linhas.

## Como trabalhamos (Vitor, 09/11)
- Uma conversa do painel por dia (ou por semana); a anterior continua no app para consulta. Trabalho pesado (vídeo, landing, produto) vai para sessão nova e curta; o painel só orquestra.
- Sessões filhas abertas: produção `session_01Q8XwFp4PbQRk1Sr59ew9Br` (turno da madrugada 01:13 acorda ela), produto Estúdio de Reels `session_01Q8XwFoaqQJd2NFNhsrcEXt`.

## Em andamento (09/11)
- **Produção da semana:** a rodada de segunda (04:47) falhou por limite de uso; refeita às 11:36 de 09/11 (28 roteiros ter–sex, pelo painel de revisão).
- **Cidade 3D (Referência 7):** roteiros NÍVEL, INVERNO e OBRIGADO + cena `video/cena_cidade/` com a sessão de produção.
- **Estúdio de Reels (produto):** skill sendo montada na sessão do produto (`produtos/estudio-reels/PLANO.md`, `STATUS.md`). Landing pronta em `iaem60s.com/estudio` (pré-lançamento, noindex, "de R$ 47 por R$ 17"), gerada por `produtos/estudio-reels/landing.py`. Não abrir venda antes de a skill fazer tudo o que a página promete.
- **5 MP4 aguardando aprovação de vídeo** (internet-somada, programas-caros-gratis, samsung-vazou, a-ia-ganhou-nome, pense-passo-a-passo): em 09/11 13:29 o Vitor tocou "Aprovar roteiro" neles porque o painel (gerado num clone sem os mp4) mostrava a etapa errada; não vale como aprovação de vídeo. Corrigido no `gerar.py` (o status manda na etapa). Agendar quando aprovados (IG + TikTok + story +15 min).
- **Negados para refazer:** sua-ia-nao-te-conhece (vídeo; nota: virar "IA COM MEMÓRIA INFINITA", sempre lembra e fica na mesma página) e ia-configurada (sem nota). Roteiros NÍVEL, MORREU e OBRIGADO aprovados → produção.

## Depende do Vitor
- **Robô do Insta (09/11):** o Vitor **quer o botão "Me Envie"** (webhook_ok = 1; ficou 0 só das 17:05 às 17:15). Problema: depois do toque, o envio do TEXTO do material falha em ~metade das vezes (cartões sempre passam), então quem segue fica sem nada (ex.: Paulo, Desterro). Correção pronta e commitada no `painel/worker.js` (se o texto falhar → cartão "Aqui está o seu material" com botão "Abrir material" → `/links#PALAVRA`; log com o erro real), **publicada em 09/11 ~19:05** (regra de permissão do curl PUT liberada pelo Vitor). Republicar com PUT na API do Cloudflare, metadata `{"main_module":"worker.js","compatibility_date":"2026-11-01","keep_bindings":["secret_text","d1","plain_text"]}`. Depois conferir `dm_eventos` (acao `material_link` e o erro real).
- Estúdio de Reels: nome final, confirmar R$ 17 de lançamento → R$ 47 depois (o "de" tem que virar real), criar o produto na Kiwify e passar o link do checkout.
- Kiwify do Super Assistente: configurar o webhook (URL no CLAUDE.md, seção Financeiro).
- Conectores nas rotinas financeiro (Cloudflare) e redes (Cloudflare + Metricool): só pela tela do claude.ai.
- Virality Predictor (Higgsfield): criar conta e o conector, se topar o custo em créditos.

## Lembretes
- Formato de pagamento "de/por" só com preço que existiu de verdade.
- A conversa longa é o maior consumo (aba 🧠 Uso): manter esta memória curta e abrir conversa nova quando a atual passar de ~300 mil tokens.

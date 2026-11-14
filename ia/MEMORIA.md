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

- **Teste 4 Reels/dia (Vitor, 11/11: "seguir com ação recomendada"):** alcance caiu desde 09/11 (mediana/dia 2.684 → 260). Em 12 e 13/11 ficam só 4 por dia (12/11: ZAP 06:00, CELULAR 10:00, WATSON 17:00, APPLE 19:30; 13/11: MUSICA 06:00, ANIMA 10:00, IKEA 19:30, LIGOU 21:30). Viraram **rascunho no Metricool** (Reel + TikTok + story, nada apagado): CONTEXTO 12/11 12:00, NEGOCIO 12/11 14:00, SENTE 12/11 21:30, CRITICA 13/11 08:00, CURTO 13/11 12:00, CAMERA 13/11 14:00. O analista compara na leitura de 14/11; se a média por Reel subir, reaproveitar os 6 rascunhos em vagas futuras (trocar data e tirar o rascunho); se não, voltar às 8/dia.

## Produção religada (Vitor, 13/11)
- **4 vídeos por dia:** úteis 06:00 🆕 · 12:00 ⚙️ · 19:30 🆕 · 21:30 📜; fim de semana 09:00 🆕 · 13:00 ⚙️ · 19:00 🆕 · 20:30 📜 (`semana/cronograma.py`). 14 e 15/11 seguem com os 8 já agendados no Metricool (não mexer).
- **Rotinas religadas em 13/11:** produção seg e qui (14 vagas, 3 candidatos por vaga, nota 🔥 antes do painel de revisão), turno da madrugada e caçador **todo dia** 03:53 (até 15 achados, foco Nvidia e GTA 6). O prompt do turno da madrugada só pode ser editado da sessão de produção (`session_01Q8XwFp4PbQRk1Sr59ew9Br`): **atualizado em 14/11 (Vitor: "Sim")**: chance.py antes de produzir (respeitando `excecao_corte`), v6 com video5.py em 2 processos (--faixa) + capa no Visual clean, e não refazer roteiro em produção em outra sessão.
- **Padrão v6 (Graphify, aprovado 12/11) instalado em 13/11** (`ia/video/PADRAO.md` + `ia/video/cena_neon/`, código lido: sem rede nem chave, só moderngl + ffmpeg; regra no CLAUDE.md). **Falta no zip:** `engine.py` e `narr_graphify.wav`, então o `video5.py` ainda não roda. O Vitor precisa subir os dois no Drive ("Teste hibrido"). E o `video5.py` tem as 16 cenas do Graphify fixas: cada vídeo novo precisa adaptar `SEG`, tempos e áudio. Até lá, produção no padrão "perfil referência". **14/11: `engine.py` refeito e o v6 roda aqui (~3,7 s/quadro)**; falta adaptar o `video5.py` por vídeo (sessão nova e curta).
- **Foco de conteúdo (Vitor, 13/11):** fofoca da Nvidia (renúncia do Jensen Huang em 12/11) e GTA 6 (sai 19/11; como clipar). Roteiros feitos em 13/11: `2026-11-16-nvidia-perdeu-o-chefe` (25%) e `2026-11-19-ps5-grava-seu-gta-6` (48%), os dois **descartados pelo filtro** (sem apagar). **Exceção do Vitor (13/11, por voz): os dois vão para produção** (`status: roteiro aprovado`, campo `excecao_corte`; aplicado em 14/11).

## Visual clean (14/11)
- Vitor mandou prints do @clubedasskills: "mais organizado, clean, menos infantil". Modelo de capa novo **aprovado em 14/11** em `painel/capa_clean/` (exemplos: Voos, Nvidia, GTA em `painel/capa_clean/exemplos.jpg`); regra "Visual clean" no AGENTE.md. Falta: aplicar a mesma linguagem no texto dos vídeos (motor do vídeo ainda usa contorno/neon) . Capa clean do Reel dos voos pronta em `posts/2026-11-13-eua-pararam-os-voos/capa_instagram_clean.jpg`: o Vitor troca à mão no app do Instagram (Reel já publicado).
- 14/11 00:10: Reel "EUA pararam os voos" publicado no IG (pedido direto do Vitor); TikTok e story às 03:05.

## Depende do Vitor
- **Robô do Insta (09/11):** o Vitor **quer o botão "Me Envie"** (webhook_ok = 1; ficou 0 só das 17:05 às 17:15). Problema: depois do toque, o envio do TEXTO do material falha em ~metade das vezes (cartões sempre passam), então quem segue fica sem nada (ex.: Paulo, Desterro). Correção pronta e commitada no `painel/worker.js` (se o texto falhar → cartão "Aqui está o seu material" com botão "Abrir material" → `/links#PALAVRA`; log com o erro real), **publicada em 09/11 ~19:05** (regra de permissão do curl PUT liberada pelo Vitor). Republicar com PUT na API do Cloudflare, metadata `{"main_module":"worker.js","compatibility_date":"2026-11-01","keep_bindings":["secret_text","d1","plain_text"]}`. Depois conferir `dm_eventos` (acao `material_link` e o erro real).
- Estúdio de Reels: nome final, confirmar R$ 17 de lançamento → R$ 47 depois (o "de" tem que virar real), criar o produto na Kiwify e passar o link do checkout.
- Kiwify do Super Assistente: configurar o webhook (URL no CLAUDE.md, seção Financeiro).
- Conectores nas rotinas financeiro (Cloudflare) e redes (Cloudflare + Metricool): só pela tela do claude.ai.
- Virality Predictor (Higgsfield): criar conta e o conector, se topar o custo em créditos.

## Lembretes
- Formato de pagamento "de/por" só com preço que existiu de verdade.
- A conversa longa é o maior consumo (aba 🧠 Uso): manter esta memória curta e abrir conversa nova quando a atual passar de ~300 mil tokens.


## Filtro de chance (corte 56%, Vitor 13/11)
Regra completa no CLAUDE.md. Em 13/11 o corte de 56% valeu também para os aprovados: 10 dos 12 roteiros (aprovados + aguardando) foram para "descartado" (status anterior em `status_antes_filtro`); ficaram `agencia-de-marketing-no-claude` e `estudio-de-games-no-claude` (62%). Só ~11% dos roteiros passam (2 de 19 em 12–13/11): por isso 3 candidatos por vaga. A nota sobe sobretudo por semelhança de palavras com os campeões (+25) e prova de +10 mil estrelas; notícia sem Reel parecido começa em ~25%.

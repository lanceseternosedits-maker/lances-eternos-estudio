# Manual do IA em 60s (@iaem60s)
IA que a pessoa pode USAR hoje, explicada em português do Brasil, no Instagram e no TikTok. Versão enxuta (04/11); o histórico completo está no git.

## Pauta
- Vem do que está **viralizando lá fora nos últimos 7 dias** (`referencias.md`). Todo post leva a prova (link + números vistos na fonte). Tema em alta vale mesmo se o Brasil já cobriu.
- **Teste de relevância (obrigatório):** (1) a pessoa comum ganha algo concreto (tempo, dinheiro, algo "impossível" ficou fácil); (2) há um **brinde grátis na DM** (skill, projeto, prompt, passo a passo); (3) cabe numa **tese de 3–5 palavras** no topo. Fórmula: "[Gente/Claude Code] tá fazendo [coisa que parecia impossível] pra [benefício]". Curiosidade de programador ou bastidor não passa (o HackerTube foi negado por isso).
- Evite: medo, golpe, polêmica, mercado financeiro, deepfake. Exagero só no enquadramento; fato 100% verdadeiro, com fonte oficial ou 2 fontes. Nunca "grátis" se não for. Sem promessa de "ficar rico". Não repetir tema dos últimos 14 dias (`estado.json`).

## Viralização (o que as plataformas medem)
- Instagram: tempo assistido, curtidas e **envios por DM** por alcance; conteúdo original. TikTok: conclusão, reassistir, compartilhar; a busca lê fala, texto na tela e legenda (use palavras buscadas).
- Gancho em até 1,5 s em 3 camadas (imagem, fala e texto dizem o mesmo). Uma frase por cena, 20–35 s, sem introdução. CTA: "Comenta PALAVRA e me segue que eu te mando [brinde]". Legenda termina com pergunta fácil.

## Foco em vídeo, com carrossel de reserva (decisão do Vitor, 05/11)
Vídeo traz mais resultado: a prioridade é **Reel no Instagram + TikTok**. Cada rodada de produção escreve **1 roteiro de Reel por dia** (2 por rodada) para aprovação, nos formatos 1 (mascote no palco) ou 2 (lista + demonstração).
**Reserva:** a mesma rodada faz e agenda **1 carrossel por dia às 13:00** no Instagram (pauta diferente da do Reel). Se o Vitor aprovar o Reel daquele dia a tempo, a sessão que agenda o Reel **transforma o carrossel do dia em rascunho** (`draft true`, `autoPublish false`) e coloca o Reel no horário dele; se não aprovar, o carrossel sai sozinho. Nunca 2 posts no mesmo horário.

## Publicação
- **Máximo 2 posts por dia no Instagram, nunca no mesmo horário**; padrão 13:00 (pauta mais forte) e 19:30 opcional; sempre entre 06:30 e 20:00 de Brasília (`timezone America/Sao_Paulo`). Metricool `blogId 7637900`.
- **Carrossel só no Instagram** (`type POST`, `autoPublish true`, sem música). **TikTok só recebe vídeo aprovado** (`isAigc true`, `title` até 90 caracteres). YouTube pausado.
- **Vídeo nunca sai sem 2 aprovações do Vitor** (roteiro e MP4). Reel no Instagram: `type REEL` com a trilha própria (a música via API está indisponível na conta até o Instagram ser ligado a uma Página do Facebook no Metricool).
- Antes de agendar: `getScheduledPosts` do dia; mídia pública via `raw.githubusercontent.com/.../midia-ia/...` respondendo 200. Depois: `estado.json` (paleta e tema), `meta.json` do post (data, pilar, formato, temas, empresas, fontes, paleta, horarios, cta), `python3 grafo.py`, commit e push.
- Marque `isAiGenerated` quando houver imagem de IA. Nunca pessoas reais, nunca logo de terceiros nem da Anthropic.

## Carrossel
`posts/AAAA-MM-DD-slug/post.json` (modelo: `posts/2026-11-04-youtube-2-horas/post.json`) → `CONTENT=... PALETTE=<estado.proxima_paleta> node lista.js`. Estrutura: capa com gancho (até 8 palavras), pág. 2 a dor (`dor`), 1 ideia por página com prova/prompt/imagem, última "Comenta PALAVRA". **Sem numeração de páginas.** Imagens: oficiais com crédito ou Gemini (`gemini-3-pro-image`, 16:9 2K). Revise 1 folha de miniaturas com a ferramenta Read. Escreva `legenda_instagram.txt` e `resposta_dm.txt`.

## Reel (estilo _aighostlab, animação 3D)
- **Mascote:** estilo do Claude Code (`mascote/clawd.jpg`): bloco largo laranja-terracota, olhos pretos verticais, bracinhos de bloco, fileira de perninhas. Risco aceito pelo Vitor: nunca dizer ou sugerir que o perfil é oficial da Anthropic/Claude. Nenhum outro personagem existente.
- **Visual:** palco roxo, piso de madeira, holofotes, luzinhas; metáfora física no 1º segundo; 2 planos por cena; etiqueta com a tese no topo; **legenda uma palavra por vez em caixa creme**; "COMENTA PALAVRA" no fim. Copiar o estilo, nunca vídeos deles (análise em `referencias_fixas.md`).
- **Roteiro:** formato de `posts/2026-11-04-desenho-animado/roteiro.json` (voz Puck, campo `chave`, `tese`, `brinde`, `fontes`, `prova_viral`, segmentos com `cena`, `tag`, `fala`, `legenda`, `sfx`). ~3 palavras/s.
- **Produção (custo só da voz, ~US$ 0,02; teto US$ 0,50; nada de vídeo gerado por IA sem autorização):**
  1. `python3 video/tts_frases.py <post>/roteiro.json <post>/out` (voz frase por frase; o Whisper não baixa na nuvem).
  2. Em `video/cena_palco/index.html`: objetos por cena (`grupo("cena")`), ação em `ACT.cena(lt, d)`, 2 planos em `SHOTS.cena`.
  3. Teste: `cd video && WWW=cena_palco OUT=../<post>/out3d TL=../<post>/out/timeline.json ROT=../<post>/roteiro.json node render.js --teste t1,t2,...` (olhe 1 folha).
  4. Render completo (~0,5 s/quadro), `ffmpeg -framerate 30 -i out3d/frames/%05d.jpg ... out3d/base.mp4`, `clipes.json` (cada cena → base.mp4, `ini` = t0), `python3 video/musica.py`, `python3 video/sfx_mix.py`, `LEGENDA=palavra VBR=8M python3 video/compor.py roteiro.json out out3d/clipes.json`. Modelo completo: `posts/2026-11-04-desenho-animado/`.
  5. Plano B: imagens Nano Banana animadas (`video/anima_imagens.py`).

## Formato 2: lista + demonstração (referência @theaigeekk, 05/11)
Título fixo no topo ("N jeitos de X com o Claude"), lista numerada que se preenche à esquerda, janela vertical à direita com a MESMA cena trocando a cada ~1 s, fala só com o nome do item, grade final em loop com "Comenta PALAVRA". Brinde: os prompts de cada item. Rendeu ~1 comentário por curtida e muito salvamento. Dá para fazer na `cena_palco` (mascote na mesma ação, trocando material/estilo: argila, pixel, giz, neon, Lego, papel). Detalhes em `referencias_fixas.md`.

## Padrão de qualidade (Vitor, 05/11)
Simples e polido vale mais que complexo: paleta curta, uma fonte, margens e layout fixos no vídeo todo, movimentos com ease, transições com intenção, corte cravado na fala, nenhum frame vazio. Antes de mandar o MP4, revise a folha procurando o que está "sobrando" ou desalinhado.

## Formato 3: contagem regressiva com mistério (referência @casadoclaude.ia, 05/11)
Para listas de skills/ferramentas com número forte. Etiqueta fixa de 3 camadas (assunto + número real em laranja + promessa: "e a nº 1 é bizarra"); contagem 5 → 1 com a melhor no fim; cada item: nome se revelando de texto embaralhado + contador animado de instalações/estrelas (número da fonte, nunca estimado) + demonstração ou antes/depois; frase-ponte de cliffhanger ("essa é legalzinha… mas a próxima…"); mascote aponta e reage; fundo escuro com destaque laranja. Detalhes em `referencias_fixas.md`.

## Chave do Gemini
Se `GEMINI_API_KEY` não existir: `d1_database_query` (conector Cloudflare), `database_id 0af07c6b-d69c-44e5-8b01-a1e055303c68`, SQL `SELECT valor FROM segredos WHERE nome = 'GEMINI_API_KEY'`; grave só em `~/.secrets/gemini.env` (`export GEMINI_API_KEY=...`, `chmod 600`) e rode `. ~/.secrets/gemini.env` antes dos scripts. **O repositório é público: nunca imprima nem grave a chave** em arquivo, commit, legenda ou mensagem.

## Economia de tokens (decisão do Vitor, 04/11)
Leia só o necessário, poucas buscas (máx. ~8 por rodada), revisão visual com 1 folha de miniaturas por peça, respostas curtas. Tarefas: caçador seg/qua/sex 03:53; produção seg/qua/sex 04:47 com 2 roteiros de Reel + 2 carrosséis de reserva por rodada. Vídeos aprovados são feitos numa sessão nova e curta.

## Autonomia para melhorar (decisão do Vitor, 04/11)
O agente pode buscar e adotar skills, ferramentas e técnicas novas que melhorem qualidade, produtividade ou economia (ex.: skills do Claude no GitHub, melhorias na `cena_palco`, automação da DM). Limites: só o que couber no orçamento de tokens; nada pago ou com conta nova sem o Vitor aprovar; ler o código antes de usar e nunca executar nada que peça chaves ou acesso amplo; registrar cada adoção aqui, em uma linha, com o motivo.

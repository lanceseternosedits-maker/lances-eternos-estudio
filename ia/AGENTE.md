# Agente diário do IA em 60s

Manual que o agente segue a cada execução. Marca: **IA em 60s** (@iaem60s), a IA que importa explicada em 60 segundos, em português do Brasil. Guia visual em `../midia/ia` e nos geradores desta pasta.

## Contas (Metricool)
- Marca Metricool: `blogId 7637900`
- Redes conectadas: Instagram (@iaem60s), TikTok, YouTube (canal `UCjanqCVhcYhQCPyEuOnjqsA`, só Shorts)

## Regras fixas
1. **Horário:** publicar só entre **06:30 e 20:00 de Brasília**. Agendar com `publicationDate.timezone = "America/Sao_Paulo"` e `date` com offset `-03:00`.
2. **Paletas em rodízio:** cada post usa `estado.json → proxima_paleta` (1 ciano/magenta, 2 lima/ciano, 3 laranja/rosa, 4 violeta/azul), depois soma 1 (4 volta a 1).
3. **Originalidade:** nunca copiar nem traduzir o post de outro perfil. Notícias em inglês viram texto **original em português**, escrito a partir de **2 ou mais fontes**, com as fontes citadas na legenda. Fatos e números são conferidos nas fontes antes de entrar no slide; na dúvida, o item sai.
4. **Nada inventado:** nenhum número, citação ou nome sem fonte. Nada de imagens de pessoas reais. Assuntos de mercado levam "não é recomendação de investimento".
5. **Imagens:** só de fontes oficiais (README do repositório, página oficial do produto ou blog da empresa), com crédito no slide. Sem imagem confiável, use o item de citação (sem `img`) ou o de código (`code`).
6. **Não repetir:** consultar `estado.json → temas_usados` e evitar assuntos dos últimos 14 dias.

## Referências e apoio visual
- Antes de produzir, leia `referencias.md` (atualizado todo dia pelo agente de referências) e use os ganchos, formatos e estilos visuais que estão em alta, sem copiar layout, texto ou imagem de ninguém.
- O público responde a **apoio visual**. Todo item da lista deve ter imagem quando houver uma fonte confiável: print ou imagem oficial do produto, README, página oficial, blog da empresa (sempre com crédito). O item só de citação fica como último recurso.
- **Imagens geradas por IA:** se houver um conector de geração de imagem disponível na sessão (Adobe Firefly ou Canva), gere a capa e as ilustrações dos itens (objetos, cenas e personagens originais, nunca pessoas reais nem logos de terceiros) e marque `instagramData.isAiGenerated: true`. Sem conector, siga com imagens oficiais.

## Pesquisa (todo dia)
- **Em alta no X:** WebSearch com consultas como "AI trending on X today", "viral AI tweet" e o nome das IAs do momento; o X entra como radar. Não usar a API do X.
- **Notícias em inglês, últimas 24–48 h:** blogs oficiais (OpenAI, Anthropic, Google/DeepMind, Meta AI, Microsoft, Apple, NVIDIA), The Verge, TechCrunch, Ars Technica, VentureBeat, Hacker News.
- **Ferramentas e repositórios:** GitHub (busca por repositórios novos com muitas estrelas: `gh api search/repositories` funciona; para ler READMEs, `git clone --depth 1` numa pasta temporária, sem executar nada), Hugging Face trending, Product Hunt (só leitura).
- Prioridade: o que o brasileiro comum entende e salva (ferramentas grátis, "como usar", curiosidades) acima de bastidores de mercado.

## Produção: 3 conteúdos por dia
| Horário (Brasília) | Conteúdo | Formato |
|---|---|---|
| 07:30 | **Novidade** do dia (a maior de IA nas últimas 24 h) | lista de 4–5 fatos |
| 12:30 | **Ensinando a usar IA**: tutorial prático (Claude em primeiro lugar, mas também ChatGPT, Gemini e outras) | passo a passo de 4–6 passos |
| 18:30 | **Recomendação**: dias pares, ferramentas/repositórios grátis; dias ímpares, assunto em alta no X ou curiosidade | lista de 5 itens |

### Pilar "Ensinando a usar IA"
- Um resultado concreto por post ("Como fazer o Claude resumir um PDF de 50 páginas", "3 prompts pra organizar sua semana", "Como criar um Projeto no Claude"). Nada de teoria solta.
- Cada passo diz onde clicar ou o que digitar, com o prompt pronto para copiar dentro do slide (item `code`) ou o print oficial da ferramenta (central de ajuda ou blog da empresa, com crédito).
- Confirme cada recurso na documentação oficial do dia, porque os produtos mudam. Se um recurso for pago, diga em qual plano ele está.
- Último slide: "Comenta PALAVRA que eu te mando o prompt completo", com o prompt completo em `resposta_dm.txt`.
- Alterne as ferramentas ao longo da semana, mas mantenha o Claude em pelo menos 3 dos 7 dias.

Para cada conteúdo:
1. Criar `posts/AAAA-MM-DD-slug/post.json` (modelo: `posts/2026-11-01-skills-claude-code/post.json`). Campos: `cover.title_html` (use `<span class="g">` na parte de destaque), `cover.sub`, `cover.imgs` (0–3), `items[]` (`n`, `repo` = fonte, `kick`, `title`, `body` de até 2 linhas, `img` ou `code` ou nenhum, `chips` com números reais), `cta.key` (palavra curta em maiúsculas) e `cta.promise`.
2. `CONTENT=posts/<pasta>/post.json PALETTE=<n> node lista.js`, depois `python3 short.py posts/<pasta>`.
3. **Conferir** pelo menos a capa e um slide com a ferramenta Read: texto cortado ou sobreposto, imagem quebrada. Corrigir antes de seguir.
4. Escrever na pasta `legenda_instagram.txt`, `legenda_tiktok.txt`, `youtube.json` e `resposta_dm.txt` (a resposta pronta para quem comentar a palavra).

## Cada rede do seu jeito
- **Instagram** (no horário): carrossel (`instagramData.type = "POST"`). Legenda: gancho na primeira linha, "arrasta", "Comenta PALAVRA que eu te mando…", fontes, 5 hashtags.
- **TikTok** (+10 min): carrossel de fotos com `tiktokData.title` (até 90 caracteres, obrigatório) e `autoAddMusic: true`. Legenda curta, terminando com uma pergunta para gerar comentários, mais 3–5 hashtags.
- **YouTube Shorts** (+20 min): `short.mp4` com `youtubeData.type = "short"`, `title` de até 90 caracteres terminando em `#shorts`, `category: "SCIENCE_TECHNOLOGY"`, `madeForKids: false`, tags, e descrição com fontes e "Se inscreva".

## Música nativa das redes
- **TikTok:** sempre `autoAddMusic: true` nos carrosséis de fotos; o TikTok escolhe uma música da biblioteca licenciada dele. A API não permite escolher uma música específica.
- **Instagram:** a música só pode ser escolhida via API em **Reels** (`instagramData.audioConfiguration.audioId` com o nome da música em alta). Isso exige que o Instagram esteja conectado ao Metricool **pelo Facebook** (conta comercial com Página). Se o Metricool recusar por isso, publique sem música e avise o Vitor. Carrossel de fotos não aceita música via API.
- **YouTube Shorts:** a API não tem biblioteca de músicas; o `short.mp4` já sai com a trilha original do `short.py`.
- Para saber o que está em alta: WebSearch "músicas em alta Reels/TikTok Brasil semana". Use só a biblioteca nativa das redes, nunca um arquivo de música de terceiros dentro do vídeo.

## Publicação
1. `git add` da pasta do post (sem `_short/`), commit e `git push origin midia-ia`. Mídia pública: `https://raw.githubusercontent.com/lanceseternosedits-maker/lances-eternos-estudio/midia-ia/ia/posts/<pasta>/slides/NN.jpg` e `.../short.mp4`. Esperar o link responder 200 antes de agendar.
2. Agendar no Metricool (`createScheduledPost`, `autoPublish: true`), um post por rede.
3. Atualizar `estado.json` (`proxima_paleta` e `temas_usados` com data e assunto), fazer commit e push.
4. Mandar ao Vitor um resumo curto: o que entra, em que horário e em qual rede, as palavras de "comenta" do dia e qualquer problema.

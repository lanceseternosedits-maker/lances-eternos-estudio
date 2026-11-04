# IA em 60s (@iaem60s): projeto IAEM60S

Perfil de Vitor Gofredo: a IA que importa explicada em 60 segundos, em português do Brasil, no Instagram e no TikTok. Este repositório também guarda o "Estúdio Lances Eternos" (raiz e ramo `main`); o IA em 60s vive na pasta `ia/` do ramo **`midia-ia`**.

## Como falar com o Vitor
- Sempre em português do Brasil.
- Trate-o por "sir" ou "chefe", nunca "senhor".
- Nunca esconda falhas: se uma etapa falhou (Metricool recusou, imagem não baixou, chave sumiu), diga o que falhou e o que faria.

## Onde está cada coisa
- `ia/AGENTE.md`: **manual completo** (linha editorial, ganchos, carrossel, vídeo, publicação). É a fonte da verdade; o conteúdo dele está importado abaixo.
- `ia/referencias.md`: o que está viralizando lá fora (atualizado todo dia pelo caçador de referências). `ia/referencias_fixas.md`: exemplos de estilo que o Vitor mandou.
- `ia/estado.json`: próxima paleta e temas já usados (não repetir em 14 dias).
- `ia/posts/AAAA-MM-DD-slug/`: um post por pasta (`post.json`, `meta.json`, slides, legendas, `resposta_dm.txt`, roteiros e reels).
- `ia/lista.js` gera os slides do carrossel; `ia/grafo.py` gera `ia/grafo/GRAFO.md`; `ia/video/` tem voz (Gemini TTS), composição e mixagem dos reels; `ia/skills/` tem as skills de ganchos e formatos virais.

## Regras que nunca mudam
- **Segredos:** o repositório é público. A chave do Gemini vem da variável `GEMINI_API_KEY` ou do D1 (ver "Como carregar a chave do Gemini" no manual) e fica só em `~/.secrets/gemini.env`. Nunca imprima, commite ou envie uma chave.
- **Publicação:** só entre 06:30 e 20:00 de Brasília, no máximo 2 posts por dia no Instagram (menos volume, mais qualidade: decisão do Vitor, 04/11). Carrossel só no Instagram; TikTok só recebe vídeo aprovado. YouTube está pausado.
- **Vídeo animado:** nunca publica sem as duas aprovações do Vitor (roteiro e MP4). Teto de US$ 0,50 por vídeo; nada de vídeo gerado por IA (Omni/Veo) sem autorização expressa.
- **Verdade:** nada inventado; todo fato com fonte oficial ou 2 fontes; toda pauta com a prova de que viralizou lá fora.
- **Git:** trabalhe e faça push no ramo `midia-ia` (`git pull --rebase` se o push for rejeitado). Não suba `out/frames`, clipes brutos nem `_short/`.

## Tarefas agendadas (Claude Code na nuvem)
- **IA em 60s – caçador de referências:** todo dia às 03:53 de Brasília; atualiza `ia/referencias.md`.
- **IA em 60s – produção diária:** todo dia às 04:47 de Brasília; produz e agenda até 2 carrosséis (13:00 e, se bater o padrão, 19:30) e manda 1 roteiro de vídeo para aprovação.
- Metricool: `blogId 7637900`, fuso `America/Sao_Paulo`.

## Manual do agente

@ia/AGENTE.md

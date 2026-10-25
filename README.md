# Estúdio Lances Eternos

Estúdio na nuvem dos edits de história do perfil Lances Eternos. Roda sozinho no GitHub Actions.

## Como funciona

1. O agente Radar grava um roteiro em `roteiros/AAAA-MM-DD.json` (craque, cenas com texto e termo de busca, legenda, hashtags).
2. O workflow `Estúdio Lances Eternos` dispara, busca cenas de futebol com licença livre no Pixabay e monta cada vídeo 1080×1920 no ritmo de uma música da pasta `musicas/`, com a história na tela.
3. Os vídeos vão para o release público `videos` e entram em `fila.json` com o link e a legenda.
4. O agente de Publicação lê a `fila.json` e agenda os posts no TikTok pelo Metricool.

## Setup (uma vez só)

- Em **Settings → Secrets and variables → Actions**, crie o secret `PIXABAY_API_KEY` com a chave gratuita do Pixabay (pixabay.com/api/docs, aparece logado). Pexels (`PEXELS_API_KEY`) também funciona, se tiver chave.
- Envie de 3 a 5 músicas licenciadas para a pasta `musicas/`.
- Em **Settings → Actions → General**, deixe "Read and write permissions" ligado para o workflow.

## Formato do roteiro

```json
{"data": "2026-10-24", "videos": [{
  "id": "LE-1024-01", "jogador": "Neymar", "titulo": "A despedida da Seleção",
  "cenas": [{"texto": "2010. Um menino de 18 anos estreia pela Seleção.", "busca": "soccer stadium night"}],
  "legenda": "Texto do post.", "hashtags": ["#neymar"]
}]}
```

# IA em 60s (@iaem60s)

A IA que importa explicada em 60 segundos, em português do Brasil, no Instagram e no TikTok.

Tudo vive na pasta [`ia/`](ia/):

- [`ia/AGENTE.md`](ia/AGENTE.md): manual completo (linha editorial, ganchos, vídeo, publicação, calendário).
- `ia/posts/AAAA-MM-DD-slug/`: um post por pasta (roteiro, vídeo, legendas, `meta.json`).
- `ia/painel/`: painel visual com todos os posts, a semana em vagas e o que precisa de aprovação (`python3 painel/gerar.py`).
- `ia/checar.py`: checagem automática do Reel antes da 2ª aprovação (fala, duração, volume, fontes, legenda).
- `ia/video/`: voz, cenas 3D, trilha e montagem dos Reels.

A publicação é feita pelo Metricool, com duas aprovações do Vitor (roteiro e MP4).

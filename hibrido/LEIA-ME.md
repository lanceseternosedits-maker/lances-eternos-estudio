# Teste hibrido iaem60s (Gemini + codigo)

Fluxo: o Gemini (Nano Banana 2.1) gera so o que o codigo nao faz bem, que sao os cenarios com profundidade e os personagens 3D. O codigo faz o resto: camera e parallax, feixes de luz, nevoa, particulas, contorno grosso com luz neon na borda, sombra, texto animado, tratamento de cor, grao, trilha e efeitos sonoros nos cortes.

- gerar.py: le roteiro.json e gera a ficha de cada personagem, um cenario por cena e o personagem na pose de cada cena (usando a ficha como referencia, pra ser sempre o mesmo boneco). Fundo verde, recortado no codigo. A chave vem so da variavel GEMINI_API_KEY. O que ja existe em assets/ e pulado, entao rodar de novo nao cobra de novo. Com --mock roda sem chave e sem custo.
- compor.py: monta o Reel 1080x1920 a partir de assets/ + roteiro.json.
- roteiro.json: texto, tempos, prompts. Trocar o roteiro = novo video.
- teste-hibrido.yml: workflow do GitHub Actions (rodar manual em Actions).

Custo do roteiro de teste: 2 fichas + 4 cenarios (2K) + 4 poses = 10 imagens, cerca de US$ 0,40 (precos da pagina oficial do Google em 11/11/2026: US$ 0,0336 por imagem 1K e US$ 0,0504 em 2K no Nano Banana 2.1).
Modelo: troque com a variavel GEMINI_IMAGE_MODEL se quiser outro (ex.: gemini-3.1-flash-image).

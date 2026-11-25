# cena_neon: renderizador de referência do padrão de qualidade (Graphify, 12/11)

3D por código (raymarching em GLSL via moderngl), sem custo de API.
- `scene2.frag`: cena (cidade de luzes em bokeh, chão espelhado, mascote laranja, robô azul com tela, medidor de neon, placa de neon, grafo de luz). `uFace[2]` = boca aberta, olhar x, olhar y, sorriso.
- `post2.frag`: acabamento (profundidade de campo, bloom, partículas, ACES, grão, vinheta).
- `video5.py`: 16 cenas do Graphify, cortes no tempo da narração, legenda em etiquetas palavra por palavra, boca no ritmo da voz (envelope do áudio), olhar e gestos.
- Tempo das palavras: `palavras_graphify.json` (inícios de cada palavra por fala). Nos próximos vídeos, use os tempos que o TTS já gera na pipeline.
- Rodar (Linux): `Xvfb :99 &` e `DISPLAY=:99 python3 video5.py saida.mp4` (precisa `pip install moderngl numpy pillow` e ffmpeg; fontes Inter Display e DejaVu). Testes: `--quadros 0,120`.
- Sem placa de vídeo, 61 s levam ~55 min; com GPU, minutos.

## Faltando no pacote v6 (13/11)
O zip `cena-neon-padrao-v6.zip` do Drive veio sem `engine.py` (o `engine2.py` e o `video.py` importam `VERT`, `AQUI` e `Motor` dele) e sem `narr_graphify.wav` (o `video5.py` lê o áudio para mexer a boca). Sem eles o `video5.py` não roda: suba os dois na pasta "Teste hibrido" do Drive ou copie da máquina onde o v6 foi feito. Além disso, o `video5.py` traz as 16 cenas do Graphify fixas (`SEG`): cada vídeo novo precisa da sua lista de cenas, dos tempos das palavras (tirados do `out/timeline.json` do TTS) e do próprio áudio.

## 14/11: destravado
`engine.py` refeito (só `VERT` e `AQUI`; os shaders usam `gl_FragCoord`). Testado aqui: Xvfb + llvmpipe, ~3,7 s por quadro (61 s ≈ 1 h 50 em 1 processo; use 2 com `--faixa`). O `narr_graphify.wav` original continua faltando: para teste usei a nossa voz do Graphify (fora do git), então a boca do v6 do Graphify não casa com os tempos de `palavras_graphify.json`. Vídeo novo: copiar `video5.py`, trocar `SEG`, os tempos (do `out/timeline.json`) e o áudio.

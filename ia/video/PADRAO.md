# Padrão dos vídeos do IA em 60s

Pedido do Vitor em 12/11: "Quero os proximos videos nessa qualidade ou melhor."
A barra mínima é o Graphify v6, aprovado pelo Vitor em 12/11 ("Aprovado"), em graphify-v6.mp4 nesta pasta. Nenhum vídeo sai abaixo dele.
O v5 foi reprovado ("achei a boca do boneco muito tosca, ele nao esta alinhado com a camera, tao pouco o enquadramento esta bom").
Ritmo: 4 vídeos por dia (Vitor, 12/11: "Vamos diminuir a quantidade e melhorar a qualidade").

## O que todo vídeo precisa ter
1. Imagem 3D renderizada (não vídeo de IA): fundo escuro com cidade de luzes em bokeh, fios de luz quentes, chão espelhado.
2. Personagens próprios (mascote laranja e robô azul, ou outros nossos). Nunca os personagens ou a marca da referência.
3. Rosto: boca esculpida no rosto (cavidade escura com língua), nunca uma peça colada; personagem de frente para a câmera, sem girar o corpo.
3b. Enquadramento: personagem sozinho centralizado na altura dos olhos, com closes a cada 3 cenas; plano a dois com os dois inteiros e margem nas bordas; placas sempre visíveis, acima da cabeça e abaixo do cabeçalho.
3c. Atuação: boca abre e fecha no ritmo da voz de quem fala; quem ouve olha para quem fala; gesto de braço e balanço ao falar; sorriso e sobrancelha conforme a fala.
4. Legenda em etiquetas (laranja, palavra-chave em amarelo), no máximo 3 palavras por bloco, cada palavra entrando no tempo exato em que é dita.
5. Cabeçalho de papel no topo com a ideia da cena (parte em itálico vermelho).
6. Cortes de 2 a 5 s, câmera sempre em movimento leve, chicote de câmera entre cortes.
7. Adereços que mostram a ideia: medidor de neon, placa de neon com número que conta, grafo de luz, balão de fala nas perguntas.
8. Narração com 2 vozes (principal confiante e coadjuvante que pergunta), música e efeitos por baixo.
9. Acabamento: profundidade de campo, bloom, desfoque de movimento, granulação, vinheta.
10. Antes de entregar: quadro lado a lado com a referência; se algum item acima estiver abaixo, corrigir antes.

## Como foi feito (para reaproveitar)
- Renderizador: v2/video5.py (cenas, tempo, legenda, atuação, função enquadrar) sobre v2/video4.py + v2/scene2.frag (cena 3D) + v2/post2.frag (acabamento), rodando com moderngl.
- Tempo das palavras: vem do TTS (Gemini, vozes Puck e Fenrir) da pipeline do repositório lances-eternos-estudio.
- Custo: zero além do TTS que já é usado. Nesta máquina sem placa de vídeo, 61 s levam cerca de 55 min; num PC com GPU, minutos.

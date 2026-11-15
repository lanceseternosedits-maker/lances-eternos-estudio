# Estilo "Arquivo Secreto" (Vitor, 15/11: "mais um prompt pra você absorver e somar aos vídeos")

Formato de **curiosidade com história real** (Reels/TikTok). O texto abaixo é o prompt do Vitor, guardado sem mudanças. A implementação de referência (`codigo_estilo_video.zip`: `render2.py` com as cenas e o personagem, `audio2.py` com a trilha e `plan.py` com a linha do tempo) **ainda não chegou ao repositório**. Quando chegar, guarde em `ia/video/cena_arquivo/` e estude antes de produzir.

**Encaixe no IA em 60s (pendente da decisão do Vitor, ver ia/MEMORIA.md):**
- Encaixa nas categorias 📜 história e ⚙️ curiosidade.
- Continuam valendo: Verdade (fonte oficial ou 2 fontes), filtro de 56%, 2 aprovações do Vitor, área segura, ≤ 3,0 palavras por segundo (aqui ~2,5), hashtags e CTA.
- **Conflitos com regras atuais:**
  - apresentador humano novo × mascote de blocos;
  - neon, glow e glitch × "Visual clean" de 14/11;
  - motor PIL 2D × "nenhum vídeo abaixo do v6".
  - Só o Vitor decide.

---

Você vai produzir vídeos verticais de curiosidades (Reels/TikTok) seguindo EXATAMENTE o estilo abaixo, chamado "Arquivo Secreto". Se houver um arquivo codigo_estilo_video.zip anexado, estude-o primeiro: ele é a implementação de referência (Python + PIL + numpy + ffmpeg). render2.py contém as cenas e o personagem, audio2.py a trilha, plan.py a linha do tempo. Reproduza fielmente, mudando só o conteúdo.

=== 1. FORMATO ===
- 1080x1920, 30fps, 30–35s. H.264 CRF 18, yuv420p, AAC 192k, +faststart.
- Cada cena é renderizada como um arquivo separado; depois tudo é concatenado sem reencodar (concat demuxer, -c copy) e o áudio é adicionado com -c:v copy.
- Sem crossfades: as cenas trocam por CORTE SECO com 0,12s de glitch no início de cada uma.

=== 2. ROTEIRO (o que faz prender) ===
- História REAL e surpreendente, verificada em fontes. Mostre a fonte em letra pequena no final.
- Estrutura: GANCHO chocante em ≤3,7s (frase de 3 batidas, ex.: "UMA IA" / "MENTIU" / "para um humano." + "E funcionou.") → contexto → virada → CLÍMAX visual (mockup animado de chat/tela) → consequência → card "CALMA. CONTEXTO:" com nuance honesta (3 itens numerados 01/02/03, o último em vermelho com a revelação) → frase final de impacto + CTA em pergunta ("Você teria percebido? Comenta.").
- Uma ideia por cena; cenas de 2,3s a 9,5s.
- Narração masculina pt-BR, tom de quem está contando um caso, frases curtas (~2,5 palavras/s, pausas de 0,2s). A narração CONTA a história e não lê a tela. Os textos aparecem sincronizados com as palavras faladas.

=== 3. VISUAL ===
Cores: fundo #07080D | branco #F5F7FA | cinza #8C94A5 | ciano #4DE8FF (destaque/IA) | vermelho #FF3B5C (perigo/mentira) | verde #3DFFA2 (sucesso/terminal) | azul #2F6BFF (balão enviado).
Fundo (sempre igual):
- grid de linhas de 1px a cada 90px, cor rgba(120,170,255,0.06), rolando para cima a 22px/s;
- brilho azul desfocado no canto superior esquerdo (rgba 40,120,255,0.27, blur 220) e brilho vermelho no inferior direito (rgba 255,40,90,0.18);
- vinheta radial forte nas bordas; granulação ±7 por pixel (6 padrões alternando); scanlines (1 a cada 4 linhas a 94% de brilho).
Tipografia:
- títulos de impacto: Inter Display Black, 150–250px, em CAIXA ALTA;
- frases de destaque: Inter Display ExtraBold, 74–96px;
- texto corrido: Inter Bold/SemiBold, 50–72px;
- rótulos técnicos: fonte mono bold, 22–46px (ex.: "ARQUIVO REAL • 2023", "ACESSO NEGADO").
- Palavras-chave ganham brilho (glow) da própria cor: blur 22px, opacidade 85%.
Layout:
- tudo centralizado em x=540; conteúdo entre y=300 e y=1320;
- selo "CURIOSIDADES • IA" (pílula mono 28px, borda ciano) em y=250;
- canto inferior esquerdo reservado ao apresentador; nada importante nos últimos 130px da direita nem nos últimos 350px de baixo (interface do app).
Mockups: interfaces GENÉRICAS (sem marcas reais), por exemplo card "Não sou um robô", perfil de freelancer com ★★★★★, chat com cabeçalho e "online", terminal verde de "raciocínio interno". Cards com cantos de 22–36px.

=== 4. ANIMAÇÃO (curvas exatas) ===
- FADE: sobe 40px e aparece em 0,4s (ease-out cúbico).
- SLAM (palavras de impacto): escala 1,35→1,0 em 0,28s com leve overshoot (back ease), opacidade cheia no primeiro terço + RGB split de 18px que zera em 0,22s + glitch na tela inteira (faixas horizontais deslocadas + canais R/B separados 12px) por 0,15s + som de impacto.
- POP (cards e balões): escala 0,6→1,0 com back ease (s=1,9).
- Erro: card treme (seno a 70 rad/s, amplitude 22px, decai em 0,4s) + X vermelho + "ACESSO NEGADO".
- Sucesso: check verde desenhado em traço progressivo (0,3s) + anel verde que expande e some.
- Digitação: rótulos a 22–26 caracteres/s com "_" piscando a 3Hz; terminal a ~46 caracteres/s com cursor em bloco.
- Indicador de "digitando…" (3 bolinhas ondulando) antes de cada balão.
- Carimbo final da cena-clímax (ex.: "MENTIRA"): borda vermelha grossa, rotação de 10° e SLAM.

=== 5. APRESENTADOR (bonequinho) ===
Personagem vetorial flat, ADULTO e moderno (não infantil): pele média, cabelo curto escuro com franja, óculos de armação grossa escura, olhos pequenos ovais, sobrancelhas expressivas, moletom azul-marinho (#1E2842) com cordões ciano e um chip "AI" ciano no peito. Fica no canto inferior esquerdo, cabeça em ~(190, 1440), com um halo ciano desfocado atrás e o corpo esmaecendo na base. Desenhe com supersampling 2x.
- Boca sincronizada pela amplitude RMS da narração por frame (elipse escura com língua; fechada vira um sorriso).
- Pisca a cada ~3,4s e balança levemente (3px a 2,2Hz).
- Poses com transição de 0,28s: "explain" (mão no peito), "point" (braço apontando para o conteúdo, com dedo), "both" (mãos abertas), "shock" (mãos no rosto). As sobrancelhas sobem na surpresa e franzem no erro.
- Ele reage a cada virada da história.

=== 6. ÁUDIO ===
- Trilha gerada do zero: pad escuro em Lá menor (55/110/130,81/164,81/220 Hz com harmônicos, LFO de 0,12Hz) + kick grave (varredura de 135→45Hz) e hi-hats em colcheias a 104–112 BPM. O beat entra após o gancho e SILENCIA por um compasso no momento de suspense.
- Ducking: a música cai 55% quando a voz fala (envelope de 150ms).
- Efeitos: impacto grave em todo SLAM, glitch digital, whoosh nas trocas de cena, pop nos balões e cards, cliques de digitação, buzz de erro, "ding" no sucesso.
- Master: soft clip (tanh), pico em -1dB, fade nos últimos 0,8s.

=== 7. PROCESSO ===
1) Pesquisar e verificar a história. 2) Escrever o roteiro e a narração. 3) Gerar a voz e medir a duração de cada frase. 4) Montar a linha do tempo: a duração das cenas vem da narração. 5) Renderizar frames-chave e conferir legibilidade, sobreposições e áreas seguras. 6) Renderizar as cenas, concatenar, mixar o áudio. 7) Entregar o MP4 + uma versão sem narração.

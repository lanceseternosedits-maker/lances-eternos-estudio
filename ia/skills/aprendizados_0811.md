# Aprendizados de skills (busca de 08/11)

Busca no GitHub (repositórios de skills criados desde out/2026, por estrelas) e nos registros de skills. O X não é acessível daqui sem login; o ranking de estrelas do GitHub foi a prova de "em alta". Tudo abaixo foi lido antes; só entrou no projeto o que tem licença MIT.

## Instalado em `.claude/skills/` (MIT, com LICENSE)
| Skill | De onde | Para quê aqui |
|---|---|---|
| `threejs-scene` | Moh4696/open-3d-skills (303 ★) | Luz, materiais e geometria procedural (torno, varredura de perfil, texturas em canvas) para a `cena_quarto` e outras cenas 3D |
| `exploded-view` | Moh4696/open-3d-skills | Objeto que se desmonta em etapas, com etiqueta presa em cada peça: ótimo para ⚙️ como_funciona ("o que tem dentro do…") |
| `vox-explainer` | charlie947/motion-graphics-skills (608 ★) | Explicador estilo Vox (papel rasgado, meio-tom, fatos com fonte) para ⚙️ e 📜 |
| `motion-effects` | charlie947/motion-graphics-skills | 16 efeitos de interface (gráfico que se transforma, busca → resultados, logo de partículas) para demonstrar ferramentas |
| `systematic-debugging` e `verification-before-completion` | obra/superpowers (a coleção de skills mais citada nos rankings) | Causa raiz antes de qualquer conserto; só dizer "pronto" com prova rodada. Lição de 08/11: nos quadros pretos do vídeo do app, primeiro tentei refazer o quadro (remendo) e só depois achei a causa (a câmera entrando no monitor) |
| `motion-designer` | hughminhphan/motion-kit | Curvas por movimento (não o "power3.out" de sempre), duração pela distância, reações desiguais, texto que corta em vez de "subir com fade" |

## Só lido (não instalado)
- **andyhuo520/vibe-knowledge** (578 ★, MIT): depende de chave paga (MiMo/Renoise) e é em chinês; destilei as regras abaixo.
- **NiazMorshed2007/reanimate** (MIT): clona animação quadro a quadro de uma referência. Útil para medir ritmo de referência, mas copiar vídeo de terceiros é proibido aqui; pede Bun + 250 MB.
- **Nyxera0x/cutaway** (MIT, 31 MB): objeto 3D que se abre peça por peça a partir de uma foto. Ideia boa para ⚙️; pesado demais para instalar agora.
- **andreoliveiras/skills-de-conteudo** (MIT, PT-BR): fluxo de Reel tipográfico com Remotion; já fazemos mais que isso. Pegar só a regra "fala contínua: escreva o texto corrido inteiro e só depois corte nas cenas".
- **heydamir/unslop** (11,7 mil ★, CC-BY-4.0): tira a "cara de IA" de interfaces. Ler antes de refazer a landing do kit ou o painel.

## Regras novas para os vídeos (destiladas)
**Roteiro de explicador (⚙️ e 📜), 6 moldes que viralizaram em vídeo de conhecimento:**
- **A · Adivinha o conceito:** começa com uma pergunta/desafio que a pessoa responde por instinto, depois a versão que ninguém adivinha; o título só aparece depois do gancho; um objeto-protagonista atravessa o vídeo e muda de forma; fecha repetindo a cena do início e devolvendo a pergunta.
- **B · Dilema:** fato absurdo em 1 frase → "e você, faria o quê?" → história → resultado → reviravolta → pergunta de novo com 2 opções (comentário fácil).
- **C · Dor do dia a dia + princípio:** incômodo comum → "quem está roubando seu…?" → princípio com nome e ano → um objeto que muda a cada etapa → solução de 3 segundos.
- **D · Uma linha só:** vários pedaços que parecem soltos → "na verdade é uma linha" → uma linha de luz passa por 5–7 pontos (é o nosso vídeo do app).
- **E · Fases:** cada fase = pergunta, armadilha, resposta certa, carta de "segredo"; termina numa tela-resumo (é o que se salva).
- **F · Seis respostas:** uma pergunta grande, 6 respostas de 5–7 s cada, um objeto que gira e muda de cor a cada face.
- Para todos: a pessoa participa nos 3 primeiros segundos; 1 frase de efeito "printável" por bloco; a pergunta final se responde com 1 palavra.

**Sincronia fala × imagem:**
1. Nada aparece antes de ser falado (sem "spoiler" na tela); o objeto surge entre 0,2 s antes e 0,1 s depois da palavra.
2. Número que conta para cima termina exatamente quando é falado; número real de fonte não passa por valores intermediários (o quadro do meio mostraria um número que não existe).
3. Câmera é pontuação: empurrão lento e travelling para transição; zoom rápido só na revelação e no número-chave; não empurrar 3 planos seguidos.
4. Orçamento de ênfase: no máximo 4 "batidas" de palavra-chave, 3 tremidas de tela e 8 efeitos sonoros fortes por vídeo.
5. Nenhum quadro parado por mais de 3 s; depois que algo chega, segura 0,5–0,75 s antes de sair.
6. Texto na tela só palavra-chave (até ~4 palavras); a frase inteira fica na voz e na legenda.

**Movimento (motion-designer):** curva escolhida para cada movimento (`kit.land` para entrar, `kit.leave` para sair, `kit.heavy` para câmera), saída ~35% mais rápida que a entrada, seguidores com atraso desigual (0, 4, 9, 15, 22, 30 quadros), nada de "fade + subir 24 px" em tudo, nada de texto entrando com desfoque.

**3D (threejs-scene):** a maior parte do realismo vem da luz, não do número de polígonos. Aplicado na `cena_quarto` em 08/11: reflexos de estúdio (`RoomEnvironment` + PMREM, intensidade 0,25), que deram brilho de verdade ao metal e ao plástico. O tom ACES foi **testado e recusado** (desbota a madeira e as cores de cartoon).

## Pautas que essas buscas renderam (para o caçador avaliar)
Repositórios de skill criados desde out/2026 com mais estrelas (lidos em 08/11): unslop 11,7 mil ★ (tira a cara de IA de sites); replica-skill 8,4 mil ★ (11 skills que clonam um app e testam); pixelfx 6,0 mil ★ (244 efeitos de pixel art); tstack 3,3 mil ★ (skills do dia a dia de um dev famoso); teardown 2,6 mil ★ (qualquer máquina vira simulador 3D desmontável); founder-skill 2,7 mil ★ (testa um negócio antes de lançar); Papermorph 1,4 mil ★ (livro vira experiência animada e narrada); ray-sticker-shop 380 ★ em 1 semana (uma foto vira pacote de figurinhas animadas). Ficam de fora: skills de day trade (mercado financeiro) e de conteúdo adulto.

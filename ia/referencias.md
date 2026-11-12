# Referências em alta (atualizado pelo agente de referências)

Última atualização: **2026-11-12, ~07:00 UTC** (janela: 05/11 a 12/11).

**Exemplos fixos do Vitor** (Reels animados do _aighostlab: mascote cubo laranja em diorama 3D, corte a cada frase; 3º exemplo "Reverse Engineer Anything"; 4º exemplo colagem em papel kraft com carimbos; análise do _aighostlab de 04/11): estão em `referencias_fixas.md`, sem alterações. Continuam valendo e devem ser lidos junto com este arquivo. (Lembrete da regra de 04/11: nada de selo contador "1/7" nos vídeos.)

> **Sobre os números desta rodada:** estrelas, licenças e datas de criação vêm da **API oficial de busca do GitHub, lida em 12/11**. A leitura dos READMEs de repositórios de terceiros foi bloqueada de novo, então "o que faz" vem só da descrição oficial e **instalação, requisitos e custo estão "não verificado"**. A busca na web não trouxe nada novo e datado da semana (só notícias de fevereiro). TikTok, Instagram e X bloqueiam leitura automática: sem números de views. Rodada enxuta: **só 3 itens passaram no teste de relevância**. Antes de escrever "bombou lá fora" ou "grátis" no post, abrir o repositório e conferir.

## Viralizando lá fora
Filtrado pelo "teste de relevância" do `AGENTE.md`. Ordem = prioridade sugerida.

1. **pinky** (deixa agentes de IA usarem o seu celular, com você no controle)
   - **O que faz (descrição oficial):** "Let AI agents use your phone, with you in the loop" (agentes de IA operam o celular e você acompanha/aprova).
   - **Por que dá vontade:** é o gosto do Vitor: a IA **trabalha por você** no celular. Autor conhecido (DIYgod, criador do RSSHub), o que ajuda na confiança.
   - **Brinde possível:** link + lista "5 tarefas para pedir ao agente" (só as que estiverem no README ou que a gente testar).
   - **Prova:** **1.908 estrelas**, criado em 06/11, licença **Apache-2.0** ([DIYgod/pinky](https://github.com/DIYgod/pinky), API em 12/11).
   - **Não verificado:** quais celulares (Android/iPhone), instalação, modelos usados, permissões. Agente que controla o celular mexe em dados pessoais: avisar no vídeo. Parece a mesma ideia do Mika da rodada de 09/11; usar um ou outro, não os dois.

2. **ste80-humanizer** (skill que tira a "cara de texto feito por IA")
   - **O que faz (descrição oficial):** "agent skill que remove os sinais de IA e reescreve o texto 80% do caminho para o ASD-STE100 (inglês técnico simplificado), método que Andrej Karpathy compartilhou".
   - **Por que dá vontade:** todo mundo reconhece texto "de IA" (legenda, e-mail, currículo). Inimigo grande e conhecido; a skill promete o contrário.
   - **Brinde possível:** link + prompt "antes e depois" para a pessoa colar num texto dela. **Cuidado:** a regra foi feita para inglês; não verificado se funciona bem em português, então testar antes de prometer.
   - **Prova:** **418 estrelas**, criado em 09/11, licença **MIT** ([Dodaios/ste80-humanizer](https://github.com/Dodaios/ste80-humanizer), API em 12/11). Número menor que os da lista anterior: prova fraca, só entra se faltar pauta.

3. **cinematic-skill** (filme narrado feito só com código)
   - **O que faz (descrição oficial):** "skill para agentes: filmes narrados feitos inteiramente por código, com uma câmera contínua sobre fotos, mapas e cartões, sincronizada com a voz" (Claude Code, Codex, Cursor, Gemini).
   - **Por que dá vontade:** "fazer um filme/anúncio sem editor", mesma linha de cinecode e animated-shorts.
   - **Prova:** **213 estrelas**, criado em 09/11, **MIT** ([Moh4696/cinematic-skill](https://github.com/Moh4696/cinematic-skill), API em 12/11). Prova fraca e tema já coberto; baixa prioridade.

**Continuam de pé da rodada de 09/11** (números não relidos, valem como estavam): unslop (12.189★ em 09/11), Mika (7.804★), claude-animated-shorts (2.468★, já instalada no nosso projeto), skill da MotionSites (1.874★). Conferir estrelas no dia da produção.

**Apareceram e foram descartados:** S2Arm (2.659★, rodar jogos de Switch no iPhone: tema Nintendo flopou e é adjacente a pirataria; não divulgar), GestaltX / Erosion-CN / NX2navi (editores de sistema do iOS e afins: nicho/risco), sheeridVerify (2.046★, nome sugere burlar verificação de desconto/estudante: **não divulgar**), agentes-chat (547★, alternativa ao Slack com agentes, AGPL, exige Docker: técnico), phoneuse (613★, iPhone a partir de um PC Linux: técnico), lot-map (448★, mapa do Claude Code: curiosidade de programador), line-art-animation (489★, nicho), tinker-ai-skill (316★, programador).

## Ganchos sugeridos
Seguem o padrão de título com inimigo grande e paradoxo de `AGENTE.md` (nome de ferramenta nunca abre o título).
- **"Seu celular agora trabalha sozinho"** (pinky ou Mika; tese 4 palavras). Variante: "A IA usa seu celular por você". Chamada de DM: "Comenta AGENTE que eu te mando o passo a passo".
- **"Seu texto parece feito por IA"** (ste80-humanizer; inimigo = o texto genérico de IA). Variante: "O fim do texto com cara de IA". DM: "Comenta TEXTO".
- **"Filme sem câmera nem editor"** (cinematic-skill / cinecode / animated-shorts; usar só um por semana). DM: "Comenta FILME".
- **Prioridade sugerida:** (1) pinky como 🆕 novidade (maior número da semana, após conferir segurança); (2) ste80 só se funcionar em português num teste nosso; (3) animated-shorts com resultado nosso. Evitar temas dos últimos 14 dias (`estado.json`).

## Ganchos que estão rendendo (rodada anterior, 04/11)
Adaptados da ideia dos posts acima, nunca traduzidos.
- **Resultado no 1º segundo:** "Escrevi uma frase. O Canva me devolveu o post pronto, com letra certa." (Canva Craft)
- **Problema resolvido:** "Acabou a imagem de IA com letra torta." / "Seus posts de loja acabaram de ficar prontos sozinhos." (as duas formas de título foram reprovadas pelo Vitor em 09/11: ver "Título com gancho" em `AGENTE.md`)
- **Tese "parecia impossível":** "Gente tá animando vídeo sem nunca ter aberto o After Effects." (Clayzo / Claude Motion)
- **Choque com número (fato verdadeiro):** "O vídeo de IA mais visto da semana: 12 milhões de pessoas viram óculos que escrevem o que você fala sem som." (Subvocal; é boca mexendo em silêncio, NÃO leitura de pensamento; deixar claro que só chega em 2027 e só nos EUA)
- **Antes e depois:** "Eu levava a tarde cortando vídeo. Agora a IA corta e me manda pra aprovar." (Kino)
- **Segredo:** "Você tem Canva e ainda não achou essa aba."
- **Lista com número:** "3 IAs que fazem vídeo animado por você."
- **Humor do dia a dia:** "Você às 23h tentando arrumar a letra torta que a IA colocou na arte…" → virada com o Canva Craft.
- **Chamada:** "Comenta POST que eu te mando os 5 prompts que eu uso no Canva." / "Comenta ANIMA que eu te mando o passo a passo."

## Formatos e estilos visuais
- **"IA × feito à mão" com o som "Dame Hombro"** segue em alta no TikTok (versão polida feita por IA e depois a real, as duas pulando na batida) ([SocialPilot, 30/10](https://socialpilot.co/blog/tiktok-trends/)). Para nós: "o post que eu fiz na mão × o que o Canva Craft fez em 1 frase".
- **Carrossel "I'm so sorry"** (TikTok, mesma fonte): 4–5 fotos contando uma história e a revelação no último slide. Molde: "Eu pagava designer pra isso…" → última foto: o resultado em 1 frase de prompt.
- **POV + revelação** continua sendo o formato com mais views (dados da semana passada, Postdom): "POV: você descobriu que o Canva tem uma IA que escreve certo".
- **Demonstração com salvamento:** os posts de lançamento com mais salvamentos (Subvocal 13 mil, Kino 4 mil) mostram o produto funcionando nos primeiros segundos, sem apresentação. Cortar direto para o resultado.
- **Diorama "escritório de agentes"** (inspirado no Skydive, sem copiar): o mascote cubo laranja como chefe numa sala 3D com mini-robôs em mesinhas, cada um com uma tela (email, vídeo, planilha).
- Continua valendo tudo de `referencias_fixas.md` (diorama roxo com mascote, legenda palavra por palavra, colagem kraft).
- **Prompts sugeridos (Nano Banana/Canva/Adobe), só personagens originais:**
  - "Bloco laranja-terracota com olhos pretos retangulares segurando um pincel gigante, ao lado de um cartaz de loja que se monta sozinho em camadas flutuantes (fundo, foto, texto), palco diorama roxo noturno com holofotes, render 3D de brinquedo, 9:16, full-bleed"
  - "O mesmo mascote como diretor de cinema numa ilha de edição de brinquedo, tiras de filme se cortando sozinhas e indo para um botão verde APROVAR, luz quente, 9:16"
  - "Escritório isométrico em miniatura com pequenos robôs de brinquedo em mesinhas, cada um com uma tela brilhando (email, vídeo, planilha), o mascote laranja no centro com prancheta, 9:16"

## Músicas em alta
(Sem atualização nesta rodada; dados de 30/10, conferir no app.)
- **TikTok (janela de 27/10 a 10/11, [SocialPilot, atualizado em 30/10](https://socialpilot.co/blog/tiktok-trends/), nº de vídeos que usam o som):** "original sound" de "Harrison" 434,6 mil e de "secret" 407,9 mil (pico); "Housewife" (Tate McRae) 313,7 mil (pico); "Dame Hombro" (Bulin 47, Kevin Wai, Breyco) 184 mil, subindo; "H4UNT" (baldgirl) 117 mil (Halloween, deve cair); "Angel of My Dreams" (JADE) 78,6 mil, subindo; "Thin Ice" (Megan Thee Stallion) começando.
- **Reels (31/10 a 10/11, [SocialPilot, 30/10](https://socialpilot.co/blog/instagram-reels-trends/), nº de Reels):** "Angel Of My Dreams" (JADE) 211 mil, subindo; "Sunshine (Instrumental)" (Twista) 202 mil, subindo, **bom para dica com narração**; "Housewife" 190 mil; "Dame Hombro" 137 mil, subindo (o site diz que é a única da lista que provavelmente funciona em conta comercial); "Everlong" (Foo Fighters) 123 mil, bom para antes e depois; "November Rain" 322 mil (pico). Natal já começou: "All I Want for Christmas Is You" 5,8 milhões.
- **Brasil:** não achei ranking confiável e datado desta semana. Pistas de playlists sem data ([Redlist](https://www.redlist.com/playlist/61657)): "Mulher de Fases" (Japãozin), "Phonk Brasileiro Fresco" (DJ Moigus, DJ FKU), "Tuts Tuts Quero Ver 2" (Edy Lemond), "Ela Sabe Que É Gata Mesmo" (MC Vitera). Confira na aba de áudios em alta do app; música de grande gravadora pode estar bloqueada para conta comercial.

## Observações
- Esta rodada priorizou **projetos grátis do GitHub com muitas estrelas** (pedido do manual). Não houve prova de views em TikTok/Reels/X porque essas redes bloqueiam leitura automática.
- Os 2 itens de topo (unslop e Mika) têm "o que faz" só pela descrição oficial; **abrir o repositório e conferir licença, custo e instalação antes de gravar**. Itens "não verificado" não entram em slide como fato.
- Itens da rodada anterior (Canva Craft, Kino, Clayzo, Claude Motion, Subvocal, Robyn, Skydive, Cyclon) saíram da lista por já terem mais de 7 dias; Gems do Gemini viram "skills" em 17/11 ([NewsBytes](https://www.newsbytesapp.com/news/science/google-phases-out-gems-adds-gemini-skills-november-17-2026/tldr)), boa pauta de tutorial para o dia, confirmar no blog do Google.
- TikTok, Instagram e X não abrem para leitura automática; Canva/Adobe não foram usados nesta rodada.

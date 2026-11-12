# Referências em alta (atualizado pelo agente de referências)

Última atualização: **2026-11-12, ~12:00 UTC** (janela: 05/11 a 12/11). Corrigido no mesmo dia: a 1ª versão desta rodada só olhou o GitHub e **deixou de fora o lançamento do Claude Fable 5.2 (09/11)**, a maior notícia da semana. Agora é o item 1, **conferido na página oficial da Anthropic**.

**Exemplos fixos do Vitor** (Reels animados do _aighostlab: mascote cubo laranja em diorama 3D, corte a cada frase; 3º exemplo "Reverse Engineer Anything"; 4º exemplo colagem em papel kraft com carimbos; análise do _aighostlab de 04/11): estão em `referencias_fixas.md`, sem alterações. Continuam valendo e devem ser lidos junto com este arquivo. (Lembrete da regra de 04/11: nada de selo contador "1/7" nos vídeos.)

> **Sobre os números desta rodada:** os do Fable 5.2 vêm do **anúncio oficial** ([anthropic.com/claude-fable-and-mythos-5-2](https://www.anthropic.com/claude-fable-and-mythos-5-2), 09/11), lido na íntegra; o que vem só de reportagem está marcado. Estrelas, licenças e datas dos repositórios vêm da **API oficial de busca do GitHub, lida em 12/11**; os READMEs de terceiros foram bloqueados, então "o que faz" vem só da descrição oficial e **instalação, requisitos e custo estão "não verificado"**. TikTok, Instagram e X bloqueiam leitura automática: sem números de views. Antes de escrever "bombou lá fora" ou "grátis" no post, conferir na fonte.

## Viralizando lá fora
Filtrado pelo "teste de relevância" do `AGENTE.md`. Ordem = prioridade sugerida.

1. **Claude Fable 5.2** (novo modelo da Anthropic, lançado em **segunda, 09/11/2026**, junto com o Mythos 5.2)
   - **O que faz (página oficial):** melhora em código, raciocínio e visão; saída até 30% mais rápida que o Fable 5.1; modo rápido opcional até 2,5x mais rápido (US$ 16/80 por milhão), disponível no Claude Code. Pode atuar como "Advisor": modelos menores (Haiku, Sonnet, Opus) consultam o Fable.
   - **Preço (API, página oficial):** **US$ 8 de entrada e US$ 40 de saída por milhão de tokens**, mais barato que o 5.1 (reportagens: era US$ 10/50, corte de 20%). Interessa a quem usa a API; a pessoa comum sente pela assinatura.
   - **Prova com números (tabela oficial, números da própria Anthropic):** FrontierCode 2.0 (programação por agente) **49,1%** contra 32,4% do Fable 5.1 e 45,5% do Opus 5.5; FrontierSWE v2 **69,9%** contra 56,3%; Remote Labor Index (trabalho remoto de verdade) **41,3% contra 17,9%** do 5.1 e 21,3% do Opus 5.5; RoboDojo **64,9%** contra 27,6% (5.1) e 29,8% (GPT-6 Astra); Humanity's Last Exam (com ferramentas) 74,2% contra 65,6%. Destaque de custo no texto: no esforço "High" o Fable faz 45,3% no FrontierCode contra 45,5% do Opus 5.5, **com cerca de metade do custo por tarefa**. Caso do texto: ~1.000 agentes formalizaram a prova do Último Teorema de Fermat em 30 horas (o Opus 5.5 fez 26% em 18 horas).
   - **Honestidade obrigatória:** não é o melhor em tudo. No AutomationBench o Gemini 4 Carbon (53,9%) passa o Fable (51,4%); no AA-Briefcase (Elo) o Opus 5.5 fica à frente (1800 contra 1785). **A própria página recomenda o Opus 5.5 como modelo do dia a dia.** Dizer sempre "segundo a Anthropic"; nenhum teste independente nosso.
   - **Para a pessoa comum:** a página diz que "esta semana" assinantes de **planos pagos elegíveis** ganham uso extra de Fable: de **um a três resets** conforme o tempo de assinatura, e o Fable entra em **até 50% do limite semanal** nos planos Pro e nos assentos padrão do Team (detalhes: [artigo de suporte](https://support.claude.com/en/articles/17506494), **não li**). O padrão de esforço nos apps e no Claude Code é "Medium".
   - **NÃO está confirmado (não colocar no roteiro como fato):** (a) se o plano **Free** tem Fable 5.2: a página oficial não fala do Free (a TNW diz "todos os usuários", o Kingy diz que o Free não inclui; a página só diz que as salvaguardas permitem oferecer o Fable "a todos os usuários", sem citar plano); (b) a **data-limite "16/11, 23h59 PT"** da oferta: veio só do Kingy, não está na página oficial; (c) **versão mínima e comando do Claude Code** (2.1.321 e `claude --model claude-fable-5-2`, do Kingy): na página só consta o identificador da API `claude-fable-5-2`. Conferir no artigo de suporte e no app antes de gravar.
   - **Brinde possível:** "5 prompts para testar no Fable 5.2" (só os que a gente rodar de verdade) + como escolher o modelo no app. Não dar o modelo como grátis.
   - **Fora de pauta:** Mythos 5.2 (só organizações verificadas; foco em cibersegurança e biologia).
   - **Prova de buzz:** cobertura de CNBC, MacRumors, The New Stack, TNW e 9to5Mac em 09/11 (títulos vistos na busca). Views em redes sociais não foram lidas. Como a notícia já circulou, o diferencial do vídeo é o **uso prático** e a **oferta desta semana**, não repetir a notícia.

2. **pinky** (deixa agentes de IA usarem o seu celular, com você no controle)
   - **O que faz (descrição oficial):** "Let AI agents use your phone, with you in the loop" (agentes de IA operam o celular e você acompanha/aprova).
   - **Por que dá vontade:** é o gosto do Vitor: a IA **trabalha por você** no celular. Autor conhecido (DIYgod, criador do RSSHub), o que ajuda na confiança.
   - **Brinde possível:** link + lista "5 tarefas para pedir ao agente" (só as que estiverem no README ou que a gente testar).
   - **Prova:** **1.908 estrelas**, criado em 06/11, licença **Apache-2.0** ([DIYgod/pinky](https://github.com/DIYgod/pinky), API em 12/11).
   - **Não verificado:** quais celulares (Android/iPhone), instalação, modelos usados, permissões. Agente que controla o celular mexe em dados pessoais: avisar no vídeo. Parece a mesma ideia do Mika da rodada de 09/11; usar um ou outro, não os dois.

3. **ste80-humanizer** (skill que tira a "cara de texto feito por IA")
   - **O que faz (descrição oficial):** "agent skill que remove os sinais de IA e reescreve o texto 80% do caminho para o ASD-STE100 (inglês técnico simplificado), método que Andrej Karpathy compartilhou".
   - **Por que dá vontade:** todo mundo reconhece texto "de IA" (legenda, e-mail, currículo). Inimigo grande e conhecido; a skill promete o contrário.
   - **Brinde possível:** link + prompt "antes e depois" para a pessoa colar num texto dela. **Cuidado:** a regra foi feita para inglês; não verificado se funciona bem em português, então testar antes de prometer.
   - **Prova:** **418 estrelas**, criado em 09/11, licença **MIT** ([Dodaios/ste80-humanizer](https://github.com/Dodaios/ste80-humanizer), API em 12/11). Prova fraca, só entra se faltar pauta.

4. **cinematic-skill** (filme narrado feito só com código)
   - **O que faz (descrição oficial):** "skill para agentes: filmes narrados feitos inteiramente por código, com uma câmera contínua sobre fotos, mapas e cartões, sincronizada com a voz" (Claude Code, Codex, Cursor, Gemini).
   - **Por que dá vontade:** "fazer um filme/anúncio sem editor", mesma linha de cinecode e animated-shorts.
   - **Prova:** **213 estrelas**, criado em 09/11, **MIT** ([Moh4696/cinematic-skill](https://github.com/Moh4696/cinematic-skill), API em 12/11). Prova fraca e tema já coberto; baixa prioridade.

**Continuam de pé da rodada de 09/11** (números não relidos, valem como estavam): unslop (12.189★ em 09/11), Mika (7.804★), claude-animated-shorts (2.468★, já instalada no nosso projeto), skill da MotionSites (1.874★). Conferir estrelas no dia da produção.

**Apareceram e foram descartados:** S2Arm (2.659★, rodar jogos de Switch no iPhone: tema Nintendo flopou e é adjacente a pirataria; não divulgar), GestaltX / Erosion-CN / NX2navi (editores de sistema do iOS e afins: nicho/risco), sheeridVerify (2.046★, nome sugere burlar verificação de desconto/estudante: **não divulgar**), agentes-chat (547★, alternativa ao Slack com agentes, AGPL, exige Docker: técnico), phoneuse (613★, iPhone a partir de um PC Linux: técnico), lot-map (448★, mapa do Claude Code: curiosidade de programador), line-art-animation (489★, nicho), tinker-ai-skill (316★, programador).

## Ganchos sugeridos
Seguem o padrão de título com inimigo grande e paradoxo de `AGENTE.md` (nome de ferramenta nunca abre o título).
- **"A IA mais cara ficou mais barata"** (Fable 5.2; inimigo = preço; só com o corte confirmado na página oficial e sem prometer plano grátis). Variante: "Trabalho remoto de verdade: a IA dobrou" (Remote Labor Index 41,3% contra 17,9%, "segundo a Anthropic"). Variante de uso: "Meio custo, mesma nota" (esforço High do Fable contra o Opus 5.5). DM: "Comenta FABLE que eu te mando como ativar e 5 prompts".
- **"Seu celular agora trabalha sozinho"** (pinky ou Mika; tese 4 palavras). Variante: "A IA usa seu celular por você". DM: "Comenta AGENTE".
- **"Seu texto parece feito por IA"** (ste80-humanizer; inimigo = o texto genérico de IA). Variante: "O fim do texto com cara de IA". DM: "Comenta TEXTO".
- **"Filme sem câmera nem editor"** (cinematic-skill / cinecode / animated-shorts; usar só um por semana). DM: "Comenta FILME".
- **Prioridade sugerida:** (1) **Fable 5.2 como 🆕 novidade, com urgência** (a notícia esfria rápido e a oferta é "desta semana"); (2) pinky após conferir segurança; (3) animated-shorts com resultado nosso; ste80 só se funcionar em português num teste nosso. Evitar temas dos últimos 14 dias (`estado.json`).

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
- **Lição desta rodada:** buscar também **lançamentos das grandes empresas de IA** (Anthropic, OpenAI, Google) na semana, não só repositórios do GitHub. O Fable 5.2 passou batido na 1ª versão.
- Esta rodada priorizou **projetos grátis do GitHub com muitas estrelas** (pedido do manual). Não houve prova de views em TikTok/Reels/X porque essas redes bloqueiam leitura automática.
- Os itens "não verificado" não entram em slide como fato; abrir o repositório e conferir licença, custo e instalação antes de gravar.
- Itens da rodada anterior (Canva Craft, Kino, Clayzo, Claude Motion, Subvocal, Robyn, Skydive, Cyclon) saíram da lista por já terem mais de 7 dias; Gems do Gemini viram "skills" em 17/11 ([NewsBytes](https://www.newsbytesapp.com/news/science/google-phases-out-gems-adds-gemini-skills-november-17-2026/tldr)), boa pauta de tutorial para o dia, confirmar no blog do Google.
- TikTok, Instagram e X não abrem para leitura automática; Canva/Adobe não foram usados nesta rodada.

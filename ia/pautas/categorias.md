# Banco de pautas por categoria (Vitor, 07/11: "quero vídeos contando histórias do mundo da IA, como a IA nasceu, como funciona")

Regras: ver "Categorias" no `AGENTE.md`. Toda data, número e frase daqui **é candidata**: confira na fonte no dia de escrever o roteiro (fonte oficial ou 2 fontes) e corrija. Marque a pauta como usada (`[x]` + data) para não repetir.

## 📜 Histórias da IA (o que aconteceu de verdade, contado como história)

- [ ] **A máquina que humilhou o campeão** — 1997, Deep Blue (IBM) vence Garry Kasparov numa partida de 6 jogos; Kasparov acusou a IBM de trapaça e pediu revanche, que nunca aconteceu. Gancho: "Em 1997 o melhor jogador de xadrez do mundo perdeu pra uma máquina… e acusou ela de trapacear." Fontes: ibm.com/history/deep-blue · reportagens da época (NYT, 12/05/1997).
- [ ] **O lance 37** — 2016, AlphaGo (DeepMind) x Lee Sedol, jogo 2: a jogada que nenhum humano faria; Lee Sedol saiu da sala. Gancho: "Uma IA fez uma jogada tão estranha que o campeão do mundo levantou e saiu da sala." Fontes: deepmind.google (AlphaGo) · documentário "AlphaGo" (2017).
- [ ] **A primeira IA que fez gente desabafar** — 1966, ELIZA (Joseph Weizenbaum, MIT): um programa simples que imitava um terapeuta; a secretária dele pediu para ficar sozinha com ela. Fontes: artigo de Weizenbaum (Communications of the ACM, 1966) · livro "Computer Power and Human Reason" (1976).
- [ ] **O dia em que a IA ganhou nome** — 1956, conferência de Dartmouth: um grupo prometeu resolver a IA "num verão". Levou 70 anos. Fontes: proposta de Dartmouth (McCarthy et al., 1955, jmc.stanford.edu) · Stanford Encyclopedia of Philosophy.
- [ ] **A pergunta de Turing** — 1950, Alan Turing pergunta "máquinas podem pensar?" e cria o jogo da imitação. Fontes: "Computing Machinery and Intelligence", revista Mind (1950).
- [ ] **O chatbot que virou racista em 16 horas** — 2016, Tay (Microsoft) no Twitter, desligada em menos de um dia. Gancho: polêmica dentro da lei, sem repetir as frases ofensivas. Fontes: blog oficial da Microsoft (25/03/2016) · The Verge/BBC.
- [ ] **O artigo de 2017 que criou o ChatGPT** — "Attention Is All You Need", 8 pesquisadores do Google; o "T" do GPT vem daí, e quase todos saíram do Google depois. Fontes: arxiv.org/abs/1706.03762 · Financial Times/Wired sobre os autores.
- [ ] **1 milhão de pessoas em 5 dias** — 30/11/2022, lançamento do ChatGPT; o "código vermelho" no Google. Fontes: openai.com/index/chatgpt · post de Sam Altman (05/12/2022) · NYT (21/12/2022, "code red").
- [ ] **O inverno da IA** — anos 70 e 80: as promessas falharam, os governos cortaram o dinheiro e "IA" virou palavrão. Fontes: Relatório Lighthill (1973) · livros de história da computação.
- [ ] **A IA que ganhou no programa de perguntas** — 2011, IBM Watson vence os campeões do Jeopardy!. Fontes: IBM (história do Watson) · NYT (fev/2011).
- [ ] **O dia em que a IA aprendeu a ver** — 2012, AlexNet esmaga a competição ImageNet usando placas de vídeo de videogame. Fontes: artigo de Krizhevsky, Sutskever e Hinton (NeurIPS 2012) · ImageNet.

## ⚙️ Como a IA funciona (explicado com objeto do dia a dia, nunca aula)

Regra do Vitor: ninguém quer "aprender IA". O vídeo responde uma **curiosidade ou um incômodo** que a pessoa já teve ("por que ela inventa coisa?") e termina com um **truque pra usar melhor** (o brinde).

- [ ] **Por que a IA inventa coisas com tanta certeza** — ela prevê a próxima palavra mais provável, não consulta um banco de verdades; truque: pedir as fontes e "se não souber, diga que não sabe". Fontes: documentação da OpenAI/Anthropic sobre alucinação.
- [ ] **Por que a IA erra quantos "r" tem em "morango"** — ela lê pedaços de palavra (tokens), não letras; truque: pedir para soletrar antes de contar. Fontes: documentação de tokenização (OpenAI tokenizer, Anthropic).
- [ ] **Como a imagem sai do nada** — difusão: começa num chiado de TV e vai limpando até virar a imagem; truque: descrever luz e câmera no prompt. Fontes: artigo DDPM (Ho et al., 2020) · documentação do Stable Diffusion.
- [ ] **Por que a IA "esquece" o começo da conversa** — janela de contexto; truque: resumir e colar o resumo numa conversa nova. Fontes: documentação de context window da Anthropic/OpenAI.
- [ ] **O ChatGPT não está na internet (na maioria das vezes)** — ele aprendeu com textos até uma data; quando busca, ele avisa; truque: mandar o link. Fontes: ajuda oficial da OpenAI sobre data de corte e busca.
- [ ] **Por que a mesma pergunta dá respostas diferentes** — temperatura/sorteio; truque: pedir 3 versões e escolher. Fontes: documentação da API (parâmetro temperature).
- [ ] **Como a IA clona uma voz com 10 segundos** — e por que você precisa de uma "palavra-código" com a família contra golpe. Fontes: documentação de clonagem (ElevenLabs) · alertas de golpe (FTC, Febraban).
- [ ] **O que é "treinar" uma IA** — ler bilhões de textos e ajustar bilhões de botõezinhos (parâmetros); quanto custa. Fontes: relatório AI Index (Stanford HAI) com custos de treino.

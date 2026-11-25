# Estúdio de Reels: status da v1 (09/11)

## O que ficou pronto
- **A skill** em `skill/`: `SKILL.md` em português (fluxo com 2 aprovações, 3 jeitos de começar, regras de roteiro e de qualidade, avisos ao comprador) + projeto **Remotion 4 + three.js** (`@remotion/three`).
  - **2 cenários:** `Contagem` (5 → 1: selo Nº, nome à máquina de escrever, odômetro com número real, objeto no pedestal, fechamento com os 5 objetos + COMENTA + notificação de DM) e `Cidade` (praça → cidade em 5 etapas, trilha de etapas, contador de jogo com selo ILUSTRATIVO, número grande da etapa, gente chegando, câmera volta ao 1º quadro = loop).
  - **Mascote em blocos** (`src/Mascote.jsx`): cor e 7 acessórios configuráveis, pisca, respira, 6 ações. Desenho próprio, sem logo de ninguém.
  - **11 objetos feitos só com código** (`src/Objetos.jsx`), **legenda palavra por palavra** em pílula, **fita crepe** no topo, tudo dentro da área segura (`src/Tela.jsx`).
  - **Voz em 3 modos** (`scripts/preparar.py`): nenhuma (padrão, grátis), a do comprador (1 gravação por frase) ou Gemini com a chave DELE (`GEMINI_API_KEY` no terminal dele; nunca gravada). Nenhuma chave nossa no produto.
  - **Trilha própria gerada por código** (`scripts/trilha.py`, numpy), sem download nem direito autoral.
  - **Checagem** (`scripts/checar.py`, mesmas regras do `ia/checar.py` + regras de roteiro: gancho, CTA no meio e no fim, pergunta final, fonte dos números) e **folha de miniaturas** (`scripts/miniaturas.sh`). `scripts/fazer.sh` faz tudo em 1 comando e normaliza o volume em -14 LUFS.
  - **Teste aqui:** `exemplo_contagem` (33,2 s, 1080×1920, -14,3 LUFS, todas as checagens ✅) e `exemplo_cidade`. Revisei as folhas de miniaturas e corrigi: câmera perto demais, selo "Nº 5" quebrando linha, subtítulo sem contraste, quadro laranja poluindo o topo, notificação de DM em cima do mascote, emoji que não renderiza, COMENTA em cima do contador na cidade, trilha de etapas grande demais. Os MP4 e quadros de teste ficaram em `demo/`.
- **Landing:** fica com a sessão do painel (aviso dela em 09/11: `landing.py` e `painel/estudio.html` são dela). Eu não mexi nessas duas; para ela, deixei os quadros e os 2 MP4 de teste em `demo/` (contagem_capa, contagem_1, cidade_1, cidade_2), prontos para a galeria de cenários.
- Nada publicado, nada pago, nenhum Worker alterado.
- Para rodar aqui na nuvem: `cd ia && npm install` (o `node_modules` não vem no clone), e renderizar com `GL=swangle NAVEGADOR=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell REMOTION=$(realpath ../../../node_modules/.bin/remotion) bash scripts/fazer.sh roteiros/exemplo_contagem.json` (de dentro de `skill/`). Contagem leva ~5 min, cidade ~4 min.

## O que o Vitor precisa decidir
1. **Nome:** "Estúdio de Reels" (provisório). Outras ideias: "Reel Pronto", "Fábrica de Reels", "Estúdio 60s".
2. **Preço:** R$ 47 pagamento único (sugestão do plano). Combo com o Super Assistente (R$ 17) como order bump?
3. **Âncora:** **sem âncora** na página. "De R$ 97" só pode entrar se o produto for vendido a R$ 97 antes; "um motion custa R$ 150+" só com fonte. Hoje não temos nenhuma das duas.
4. **Produto na Kiwify:** criar o produto (entrega: zip da skill) e passar o link do checkout para a sessão do painel ligar `/comprar?o=estudio`.
5. **Domínio `/estudio`:** a sessão do painel já criou a rota; só confirmar que fica.
6. **Bônus do 8º dia** (roteiros dos nossos Reels mais vistos) e **suporte** (DM? e-mail?): confirmar se entram.
7. **Mascote no produto:** o padrão é laranja-terracota com olhos verticais, parecido com o nosso. Para vender, sugiro trocar a cor padrão por outra (ex.: azul do exemplo da cidade) para não parecer personagem de terceiros.

## O que falta (v2)
- Mais cenários (o plano fala em 6: sistema em peças/quarto, palco, linha do tempo, lista + demonstração).
- As 5 perguntas do mascote com 3 opções renderizadas lado a lado (hoje a SKILL.md orienta, mas não gera a prévia automática).
- Revisão do roteiro por revisores de IA dentro da skill (nosso diferencial do plano; na v1 só a checagem automática).
- Legenda sincronizada com a fala de verdade (hoje as palavras são distribuídas pelas sílabas dentro de cada frase; bom o suficiente com 1 áudio por frase).
- Testar a instalação limpa no Windows e no Mac (aqui só rodou no Linux da nuvem, com GL=swangle).
- Empacotar o zip da entrega (sem `node_modules`, `saida/`, `projetos/`), guia em PDF, e o Reel de lançamento feito com a própria skill (com voz).
- `/comprar?o=estudio` ligado ao checkout e DM automática com palavra própria (ex.: ESTUDIO) apontando para a landing.

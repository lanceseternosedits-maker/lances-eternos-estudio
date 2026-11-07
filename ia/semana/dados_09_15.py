# Semana 09–15/11/2026: 56 roteiros (8 por dia). Gerado por ia/semana/gera_semana.py.
# Estrelas: API do GitHub lida em 07/11/2026; reler na fonte no dia da produção.
# L = contagem (formato 3); S = projeto único (formato 1, mascote no palco).
# Itens de L: (nome falado, repo, fala do item). A fala do item já começa com a posição.

DIAS = {
 "2026-11-09": ["06:00","08:00","10:00","12:00","14:00","17:00","19:30","21:30"],
 "2026-11-10": ["06:00","08:00","10:00","12:00","14:00","17:00","19:30","21:30"],
 "2026-11-11": ["06:00","08:00","10:00","12:00","14:00","17:00","19:30","21:30"],
 "2026-11-12": ["06:00","08:00","10:00","12:00","14:00","17:00","19:30","21:30"],
 "2026-11-13": ["06:00","08:00","10:00","12:00","14:00","17:00","19:30","21:30"],
 "2026-11-14": ["09:00","11:00","13:00","15:00","17:00","19:00","20:30","22:00"],
 "2026-11-15": ["09:00","11:00","13:00","15:00","17:00","19:00","20:30","22:00"],
}

V = []  # na ordem dos horários acima

def L(slug, chave, assunto, promessa, gancho, itens, ponte, fecho, brinde, conceito, polemica=False, obs=""):
    V.append(dict(tipo="L", slug=slug, chave=chave, assunto=assunto, promessa=promessa, gancho=gancho,
                  itens=itens, ponte=ponte, fecho=fecho, brinde=brinde, conceito=conceito, polemica=polemica, obs=obs))

def S(slug, chave, tese, repo, falas, brinde, conceito, polemica=False, obs="", fontes=None):
    V.append(dict(tipo="S", slug=slug, chave=chave, tese=tese, repo=repo, falas=falas, brinde=brinde,
                  conceito=conceito, polemica=polemica, obs=obs, fontes=fontes or []))

# ───────────── SEGUNDA 09/11 ─────────────
S("leis-do-brasil","LEIS","TODAS AS LEIS DO BRASIL NUM LUGAR SÓ","ctresb/leis",[
 "Alguém juntou todas as leis do Brasil num lugar só. De graça.",
 "Chama Leis. É um projeto aberto no GitHub.",
 "Você procura o assunto e acha a lei, sem caçar em dez sites do governo.",
 "Já passou de duas mil e seiscentas estrelas. Comenta LEIS que eu te mando o link.",
 "E dá pra jogar o texto da lei no ChatGPT e pedir: me explica como se eu tivesse doze anos.",
 "Comenta LEIS e me segue pra mais IA que serve pra vida real."],
 "link do projeto + prompt 'explica essa lei em linguagem simples'",
 "Cartório antigo que vira biblioteca de luz: pilhas de processos em papel pardo, carimbos, um arquivo de aço que se abre e solta folhas voando que viram uma tela de busca; paleta verde-bandeira + amarelo-ouro + papel. Nº 1: o mascote abre um livro gigante de leis que acende. Fechamento: carimbo APROVADO.",
 obs="Projeto não oficial: dizer 'projeto aberto', nunca 'do governo'. Conferir no README como ele obtém os textos.")

L("programas-caros-gratis","GRATIS","5 PROGRAMAS CAROS REFEITOS DE GRAÇA","E O Nº 1 É O MAIS USADO DO MUNDO",
 "Você paga caro por Word, Excel e AutoCAD. Alguém refez os cinco do zero, de graça.",
 [("VibeOffice","tcchen2026/VibeOffice","Quinto: VibeOffice. Um pacote de escritório no navegador, sem instalar e sem conta."),
  ("FigCraft","storytold/figcraft","Quarto: FigCraft. Design de telas no estilo Figma, aberto."),
  ("GridCraft","storytold/gridcraft","Terceiro: GridCraft. Uma planilha no estilo Excel."),
  ("CADCraft","storytold/cadcraft","Segundo: CADCraft. Desenho técnico no estilo AutoCAD, de graça."),
  ("WordCraft","storytold/wordcraft","E o primeiro: WordCraft. O Word refeito do zero, código aberto.")],
 "Esse é útil… comenta GRATIS que eu te mando os cinco. Mas o próximo assusta.",
 "Comenta GRATIS e me segue que eu te mando os links dos cinco.",
 "links dos 5 + aviso de que são projetos novos (podem ter bugs)",
 "Loja de software dos anos 90 em liquidação: prateleiras de caixas de CD com preço riscado, etiquetas 'R$ 0', esteira de caixa registradora; paleta vermelho-liquidação + amarelo + cinza-loja. Gancho: uma caixa de software com cadeado é aberta a marteladas pelo mascote. Nº 1: uma folha de documento gigante sai voando da caixa e se escreve sozinha. Fechamento: notinha fiscal comprida com os 5 itens a R$ 0,00.",
 polemica=True, obs="Sem logos nem telas da Microsoft/Autodesk/Figma; nomes citados só para comparação ('no estilo'). Clean-room, licença Apache-2.0. 'A Microsoft cobra' vale para Word/Excel; Figma e AutoCAD são de outras empresas: o gancho fala só 'esses programas são pagos' se preferir.")

S("internet-somada","INTERNET","SOMA O WI-FI COM O 4G","net-merge/net-merge",[
 "Seu celular tem Wi-Fi e 4G. E se usasse os dois ao mesmo tempo?",
 "O net-merge faz isso: junta todas as conexões numa só.",
 "Wi-Fi, cabo, dados do celular, roteador do vizinho que é seu amigo. Tudo junto.",
 "Quase três mil estrelas em menos de um mês. Comenta INTERNET que eu te mando.",
 "Funciona no Windows, no Mac, no Linux e no Android. E é de graça.",
 "Comenta INTERNET e me segue que eu te mando o link e o passo a passo."],
 "link + passo a passo de instalação no Windows",
 "Encanamento de dados: canos transparentes de cores diferentes (Wi-Fi azul, 4G laranja, cabo verde) se juntando num cano grosso que enche uma caixa-d'água de bolinhas de luz; paleta azul-piscina + laranja + verde-cano. Mascote de capacete de obra girando registros.",
 obs="Não prometer 'velocidade dobrada': o README fala em balanceamento por conexão.")

L("playstation-no-pc","PLAY","5 JOGOS DE PLAYSTATION RODANDO NO PC","E O Nº 1 FOI APAGADO DA LOJA",
 "Esses jogos de PlayStation nunca saíram pro PC. Os fãs fizeram rodar mesmo assim.",
 [("CTR Nitro-Fueled","GetLostIn/CTR-NitroFueled-PC","Quinto: Crash Team Racing rodando nativo no Windows."),
  ("inFAMOUS Second Son","HayatoG/iss_pc","Quarto: inFAMOUS Second Son, jogável no PC, com o seu jogo."),
  ("Shadow of the Colossus","AjncSystem/ShadowOfTheColossus-PC","Terceiro: Shadow of the Colossus no Windows, sem emulador."),
  ("Uncharted","Supermedo/uncharted_pc","Segundo: a coleção Uncharted rodando nativa no PC."),
  ("P.T.","LoreanXavier/pt-pc","E o primeiro: P.T., o jogo de terror que foi apagado da loja, agora no PC.")],
 "Esse é bom… comenta PLAY que eu te mando os cinco. Mas o próximo é lenda.",
 "Comenta PLAY e me segue. E lembra: só com o jogo que é seu.",
 "links dos 5 + aviso: precisa da cópia do SEU jogo, nenhum traz arquivos de jogo",
 "Corredor de locadora de videogame abandonada à noite, com fita de 'proibido' rasgada; TVs CRT ligadas com chiado, caixas de jogo genéricas sem arte; paleta azul-PlayStation-genérico (anil) + vermelho + verde-fósforo. Gancho: um console genérico de blocos se abre e de dentro sai um PC. Nº 1: corredor escuro com uma luz piscando no fim (terror leve, sem susto). Fechamento: fichas de locadora com os 5 nomes.",
 polemica=True, obs="Nunca ROM/ISO nem link de jogo. Todos dizem 'sem arquivos de jogo' / 'seu dump'. Sem logos, personagens ou capas da Sony/Konami. P.T. foi retirado da PlayStation Store em 2015 (fato conhecido; citar fonte jornalística na legenda).")

L("apps-gratis-mac","MAC","3 APPS GRÁTIS QUE O MAC DEVIA TER","E O Nº 1 É VICIANTE",
 "Seu Mac caro não vem com isso. Três apps grátis resolvem.",
 [("BetterWispr","opennookorg/betterwispr","Terceiro: BetterWispr. Segura um atalho, fala, e o texto aparece em qualquer app. Sem internet."),
  ("Atticus","SaarthurR/atticus-mac","Segundo: Atticus. Assistente de voz que usa o seu plano do Claude."),
  ("Tendedero","alejandrobujan/tendedero","E o primeiro: Tendedero. Cada print fica pendurado num varal no topo da tela.")],
 "Esse ajuda muito… comenta MAC que eu te mando os três. Mas o primeiro é viciante.",
 "Comenta MAC e me segue que eu te mando os três links.",
 "links dos 3",
 "Varal de roupa num quintal ensolarado: prendedores de madeira, roupas que viram janelas de app, cesto de vime; paleta azul-céu + branco-lençol + madeira clara. Nº 1: os prints pendurados no varal balançando ao vento. Mascote de chapéu de palha pendurando as janelas.")

S("chatgpt-faz-gif","GIF","O CHATGPT AGORA FAZ GIF","",[
 "O ChatGPT agora transforma sua foto num GIF animado.",
 "Veio com o Images 2.6, a nova versão do gerador de imagem.",
 "Você pede o movimento, ajusta a velocidade e edita quadro por quadro.",
 "Ainda está chegando aos poucos para as contas. Comenta GIF que eu te mando os prompts.",
 "Testa com a foto do seu cachorro: faz ele piscar e abanar o rabo.",
 "Comenta GIF e me segue que eu te mando cinco prompts prontos."],
 "5 prompts de GIF + onde achar a opção no ChatGPT",
 "Ateliê de flipbook: bloco de papel que folheia sozinho, mesa de luz, lápis de cor espalhados; paleta verde-menta + rosa-chiclete + creme. Gancho: uma foto Polaroid começa a se mexer. Mascote folheando o bloco com boné de pintor.",
 fontes=["https://thenextweb.com/news/chatgpt-animated-gifs-images-2-6-openai","https://www.androidauthority.com/chatgpt-animated-gif-generation-3731805/","https://decrypt.co/382574/chatgpt-gif-maker-openai-unannounced-images-2-6-model"],
 obs="Liberação gradual (Decrypt); não dizer que o plano grátis tem com certeza. Reconferir no dia. Sem logo da OpenAI.")

S("ia-chinesa-no-bolso","CHINA","A IA CHINESA QUE CONTROLA SEU PC PELO CELULAR","ccch1mneyyy/dsh-Go",[
 "Uma IA chinesa roda no seu celular e ainda controla o seu computador.",
 "Chama dsh-go. Leva o agente do DeepSeek pro bolso.",
 "Roda no próprio telefone e manda comandos pro PC à distância.",
 "Treze mil estrelas em duas semanas. Comenta CHINA que eu te mando.",
 "Mas atenção: dá acesso ao seu PC. Leia tudo antes e use num computador de teste.",
 "Comenta CHINA e me segue. A China tá correndo, e quase ninguém aqui viu."],
 "link + checklist de segurança antes de instalar",
 "Mercado noturno chinês genérico (sem marcas): lanternas de papel vermelhas, letreiros de luz sem texto legível, barracas de vapor; paleta vermelho-lanterna + dourado + verde-jade. Gancho: um celular flutua e puxa fios de luz até um PC. Mascote de capa de chuva transparente pilotando um controle remoto.",
 polemica=True, obs="README em chinês: reler antes de afirmar recursos. Polêmica pela origem chinesa e pelo acesso ao PC; enfatizar segurança, sem medo gratuito.")

L("bizarros-github","BIZARRO","5 PROJETOS MAIS BIZARROS DA SEMANA","E O Nº 1 IMPRIME A SUA CARA",
 "Esses projetos não servem pra nada. E mesmo assim todo mundo quer ver.",
 [("Athenaion","Leonxlnx/athenaion","Quinto: uma Grécia antiga inteira feita só com código, sem uma imagem."),
  ("Qwenputer","divagr18/qwenputer","Quarto: um computador inteiro escondido dentro de uma IA."),
  ("Web Ocean","Noniv/web-ocean","Terceiro: um oceano com pôr do sol num arquivo menor que uma foto."),
  ("Handwired","chenglou/handwired","Segundo: transforma código comum numa rede neural."),
  ("Print My Profile Pic","aschmelyun/print-my-profile-pic","E o primeiro: você dá uma estrela e a sua foto sai impressa numa maquininha de recibo.")],
 "Esse é lindo… comenta BIZARRO que eu te mando os cinco. Mas o próximo é pior.",
 "Comenta BIZARRO e me segue pra ver o que mais aparece.",
 "links dos 5",
 "Gabinete de curiosidades: estantes de museu com redomas de vidro, cada uma guardando um item da lista (templo grego, ocean em aquário, chip); paleta vinho + dourado-museu + verde-vidro. Nº 1: maquininha de recibo cuspe um papel com o rosto do mascote. Fechamento: etiquetas de museu.")

# ───────────── TERÇA 10/11 ─────────────
S("ia-le-whatsapp","ZAP","A IA ACHA AQUELA MENSAGEM NO SEU WHATSAPP","finereli/whatsapp-mcp",[
 "Sabe aquela mensagem perdida no WhatsApp? A IA acha pra você.",
 "O whatsapp-mcp deixa o Claude ler e buscar as suas conversas.",
 "Só ler: ele não manda mensagem, não apaga nada.",
 "Você pergunta: qual era o endereço que a Ana mandou? Comenta ZAP que eu te mando.",
 "Seus dados vão pra um servidor. Se preferir, rode a sua própria cópia.",
 "Comenta ZAP e me segue que eu te mando o passo a passo."],
 "link + passo a passo + aviso de privacidade",
 "Agência de correio antiga: escaninhos de madeira cheios de envelopes verdes, carimbos, uma lupa enorme; paleta verde-WhatsApp-genérico (verde-garrafa) + creme + marrom. Mascote de quepe de carteiro e lupa procurando um envelope. Sem logo do WhatsApp.",
 obs="Projeto não oficial e só leitura. Dizer claramente que as mensagens passam pelo serviço deles ou pela sua cópia no Cloudflare.")

L("projetos-celular","CELULAR","5 PROJETOS QUE TURBINAM SEU CELULAR","E O Nº 1 TIRA A PROPAGANDA DO SISTEMA",
 "Seu celular tem propaganda até no sistema. Cinco projetos resolvem.",
 [("MeshLive","MeshLive/meshlive-android","Quinto: MeshLive. Chamada de vídeo entre celulares por Bluetooth, sem internet."),
  ("Droidline","KnifeLemon/Droidline","Quarto: Droidline. Automatiza tarefas repetidas no Android, sem cabo e sem root."),
  ("AVault","arpanjot-coding/AVault","Terceiro: AVault. Grava suas ligações num cofre criptografado."),
  ("iPhone-use","zhongerxin/iPhone-use","Segundo: iPhone-use. Uma IA mexe no seu iPhone de verdade pelo cabo."),
  ("Android Ad Cleaner","rddmwmddr/android-ad-cleaner","E o primeiro: tira a propaganda do sistema de celular chinês. Sem root.")],
 "Esse é esperto… comenta CELULAR que eu te mando os cinco. Mas o próximo salva.",
 "Comenta CELULAR e me segue que eu te mando os cinco links.",
 "links dos 5 + aviso: gravar ligação é legal no Brasil para quem participa dela, mas divulgar pode não ser",
 "Oficina de conserto de celular de rua: bancada com lupa articulada, chaves de fenda minúsculas, telas trincadas viram vitrais; paleta turquesa + laranja-solda + preto-bancada. Nº 1: pop-ups de propaganda (sem marcas) estourando como bolhas. Mascote com lupa de relojoeiro.",
 obs="Ad Cleaner mira sistemas Android de marcas chinesas (Xiaomi etc., comuns no Brasil): README em chinês, conferir modelos. Gravação de ligação: Lei 9.296/96 e jurisprudência — participante pode gravar; não estimular divulgação.")

S("testa-seu-negocio","NEGOCIO","11 IAS TESTAM SEU NEGÓCIO ANTES DE ABRIR","Jakeschincariol/founder-skill",[
 "Antes de gastar um real no seu negócio, deixa onze IAs tentarem derrubar a ideia.",
 "O founder-skill dá ao Claude um conselho, um diretor de marketing e um financeiro.",
 "E ainda cem compradores de mentira dizem se comprariam.",
 "Mais de duas mil e quinhentas estrelas. Comenta NEGOCIO que eu te mando.",
 "Não garante sucesso. Mas mostra o furo antes de você abrir.",
 "Comenta NEGOCIO e me segue que eu te mando as onze skills."],
 "link + 3 perguntas para testar a ideia hoje",
 "Sala de reunião de tubarões em miniatura (sem rostos humanos): mesa comprida, cadeiras de couro com bonecos de bloco anônimos, quadro com gráfico; paleta azul-marinho + dourado + branco. Gancho: uma ideia em lâmpada é colocada na mesa e todos se viram. Mascote de gravata e crachá apresentando.",
 obs="Grátis, MIT. Sem promessa de lucro. O README cita Hormozi/Thiel/Jobs: não usar nomes nem rostos no vídeo.")

L("apple-nao-queria","APPLE","5 PROJETOS QUE A APPLE NÃO QUERIA","E O Nº 1 RODA NUM ANDROID",
 "A Apple só deixa o sistema dela rodar nos aparelhos dela. Esses cinco projetos não ligaram.",
 [("Mac Subsystem for Android","harkhowalia-1/MacSubsystemForAndroid","Quinto: apps de Android rodando no Mac, cada um na sua janela."),
  ("Snapintosh","Snapintosh/Snapintosh","Quarto: o macOS ligando num notebook que nem é da Apple."),
  ("UniXNU","UniXNU/UniXNU","Terceiro: iOS e macOS em aparelhos que não são da Apple."),
  ("terminal-mac","govijr/terminal-mac","Segundo: um macOS inteiro rodando dentro do terminal."),
  ("hakios","oosexgang/hakios-xnu-kernel","E o primeiro: o coração do sistema da Apple rodando num celular Android.")],
 "Esse é ousado… comenta APPLE que eu te mando os cinco. Mas o próximo é pior.",
 "Comenta APPLE e me segue. São projetos experimentais, use por sua conta.",
 "links dos 5 + aviso: experimentais, podem violar termos de uso; nada de usar no aparelho principal",
 "Pomar à noite com uma única maçã de vidro brilhando numa redoma (genérica, sem mordida), cercas de jardim e placa 'propriedade privada'; paleta verde-pomar + prata + vermelho-maçã. Gancho: a redoma racha. Nº 1: a maçã de vidro entra num celular de blocos verde. Mascote de lanterna na cabeça, se esgueirando.",
 polemica=True, obs="Sem logo da Apple (nada de maçã mordida). Projetos experimentais; macOS fora de hardware Apple viola a licença do macOS: dizer 'a Apple não permite'. Não ensinar o passo a passo no vídeo.")

L("musica-gratis","MUSICA","3 PROGRAMAS GRÁTIS PRA FAZER MÚSICA","E O Nº 1 TE ENSINA A CANTAR",
 "Estúdio de música custa caro. Esses três são de graça.",
 [("LYNX SHARE","Ka1-S/LYNX-SHARE","Terceiro: LYNX SHARE. Estúdio no estilo FL Studio, que abre seus projetos de lá."),
  ("Lemon Studio","ItsAlphaNeon/Lemon-Studio","Segundo: Lemon Studio. Estúdio de áudio grátis que você já sabe usar."),
  ("onkey","dsmurrell/onkey","E o primeiro: onkey. Ouve a música que você ama e te ensina a cantar.")],
 "Esse é completo… comenta MUSICA que eu te mando os três. Mas o primeiro é o mais legal.",
 "Comenta MUSICA e me segue que eu te mando os três links.",
 "links dos 3 (onkey é só para Mac)",
 "Estúdio de garagem: caixas de ovo na parede, tapete persa, amplificador velho, luzinhas de Natal; paleta mostarda + vinho + marrom-tapete. Nº 1: o mascote com microfone de pedestal e notas musicais virando degraus. Fone de ouvido gigante como acessório.")

L("animar-sem-saber","ANIMA","3 SKILLS QUE ANIMAM SEM VOCÊ SABER ANIMAR","E O Nº 1 TIRA A CARA DE IA",
 "Vídeo com cara de IA espanta seguidor. Essas três skills consertam isso.",
 [("claude-animation-skills","artemnovitckii/claude-animation-skills","Terceiro: seis skills que fazem animação pra Reels sem filmar nada."),
  ("cinecode","sarpstar/cinecode","Segundo: cinecode. Ele escreve o roteiro, monta cada quadro e te entrega o MP4."),
  ("motionmaxxing","Tejashmakwana/motionmaxxing","E o primeiro: motionmaxxing. Pega vídeo com cara de IA e deixa com cara de designer.")],
 "Esse é prático… comenta ANIMA que eu te mando as três. Mas o primeiro muda tudo.",
 "Comenta ANIMA e me segue que eu te mando as três skills.",
 "links das 3 (precisam do Claude Code, que vem nos planos pagos)",
 "Estúdio de stop-motion de massinha: bonecos de massinha meio prontos, câmera em tripé, cenários de papelão; paleta coral + azul-petróleo + bege-massinha. Nº 1: um boneco 'cara de IA' borrado é remodelado e fica nítido. Mascote de avental sujo de massinha esculpindo.")

S("camera-sony-destravada","CAMERA","DESTRAVARAM A CÂMERA DA SONY","QAQLeonard/a7c2-tools",[
 "Tem recurso escondido na sua câmera Sony. E alguém destravou.",
 "A ferramenta a7c2-tools é pra Sony A7C II.",
 "Com um clique: perfis de cor novos, LUTs próprias e tela na vertical.",
 "Mais de mil estrelas. Comenta CAMERA que eu te mando.",
 "Mexe no firmware: pode dar problema e afetar a garantia. Tem botão de voltar ao de fábrica.",
 "Comenta CAMERA e me segue. Só pra quem sabe o risco."],
 "link + aviso de risco/garantia",
 "Laboratório fotográfico com luz vermelha: varal de fotos secando, bacias de revelação, uma câmera de blocos sobre a mesa com cadeado; paleta vermelho-revelação + preto + âmbar. Gancho: o cadeado da câmera estala e abre. Mascote de colete de fotógrafo.",
 polemica=True, obs="Só um modelo (A7C II, firmware 2.01): deixar claro. Sem logo da Sony. Avisar risco de firmware e garantia.")

S("manual-ikea-3d","IKEA","O MANUAL DA IKEA VIROU ANIMAÇÃO 3D","Nutlope/bygga",[
 "Você nunca mais vai brigar com manual de móvel.",
 "O Bygga pega o manual de papel e vira um guia em 3D, passo a passo.",
 "É só escanear o manual com a câmera.",
 "A peça gira na tela e mostra onde encaixa. Comenta IKEA que eu te mando.",
 "Projeto aberto, feito por um desenvolvedor independente.",
 "Comenta IKEA e me segue pra mais IA que resolve a vida."],
 "link",
 "Apartamento vazio de mudança: caixas de papelão, parafusos espalhados, chave Allen gigante; paleta amarelo-sueco + azul + pinho. Gancho: o mascote enrolado num manual de papel. Peças de móvel voando e se encaixando sozinhas.",
 obs="Projeto não oficial da IKEA: dizer 'manual de móvel'; sem logo. Usa a API da Together AI (verificar se tem custo para o usuário).")

# ───────────── QUARTA 11/11 ─────────────
S("procura-dentro-das-fotos","ACHA","PROCURE NO PC PELO QUE TEM DENTRO DA FOTO","ARahim3/DigUp",[
 "Você digita 'praia com cachorro' e o PC acha a foto.",
 "O DigUp procura pelo que tem dentro dos arquivos, não pelo nome.",
 "Fotos, PDFs, gravações e vídeos. Tudo no seu computador, sem nuvem.",
 "Seis mil estrelas em um mês. Comenta ACHA que eu te mando.",
 "Usa um modelo do Google que roda no seu próprio PC.",
 "Comenta ACHA e me segue que eu te mando o link."],
 "link + 5 buscas pra testar",
 "Garimpo: o mascote de chapéu de minerador com bateia, num rio de arquivos (fotos e PDFs como pepitas); paleta terra + ouro + azul-rio. Nº 1: a bateia peneira e sobra a foto da praia com cachorro.")

L("projetos-gamer","GAMER","5 PROJETOS QUE TODO GAMER QUERIA","E O Nº 1 TRANSFORMA QUALQUER JOGO EM CO-OP",
 "Seu jogo favorito é só pra um jogador? Não mais.",
 [("BCD","thebcd69/bcd-games","Quinto: BCD. Jogos de Windows no iPhone, com Steam e GOG."),
  ("Steam Stash","AssassinCreator/steam-stash-value-report-card","Quarto: mostra quanto vale a sua biblioteca da Steam."),
  ("Autopilot","ramenvr/autopilot","Terceiro: Autopilot. Uma IA que joga qualquer jogo."),
  ("Bridgeplay","raymondchins/Bridgeplay","Segundo: Bridgeplay. Jogos de Windows da Steam rodando no Mac."),
  ("Co-op Anything","cranebeaker/coop-anything","E o primeiro: a IA transforma jogo de um jogador em multiplayer com os amigos.")],
 "Esse é útil… comenta GAMER que eu te mando os cinco. Mas o próximo é sonho.",
 "Comenta GAMER e me segue que eu te mando os cinco links.",
 "links dos 5 + aviso: jogos comprados por você",
 "Quarto de LAN party anos 2000: monitores de tubo em mesas dobráveis, cabos de rede coloridos no chão, latas de refrigerante genéricas, pizza; paleta verde-LED + roxo + laranja-pizza. Nº 1: dois mascotes no sofá, tela dividida. Mascote de headset com antena.")

L("projetos-casa","CASA","3 PROJETOS QUE DEIXAM SUA CASA ESPERTA","E O Nº 1 LIBERA SEU PORTA-RETRATO",
 "Sua casa tem aparelho travado que podia fazer muito mais.",
 [("House Control","0xProbabillity/house-control","Terceiro: sua casa vira um modelo 3D no celular, e você acende a luz tocando nele."),
  ("CleanFrame","nthnclrk/CleanFrame","Segundo: uma tela inicial limpa pra TV The Frame, da Samsung."),
  ("Photo Frame Dashboard","wesbos/photo-frame-dashboard","E o primeiro: porta-retrato digital travado vira painel com os apps que você quiser.")],
 "Esse é lindo… comenta CASA que eu te mando os três. Mas o primeiro é genial.",
 "Comenta CASA e me segue que eu te mando os três links.",
 "links dos 3",
 "Casa de bonecas aberta ao meio: cômodos em corte com luzinhas acendendo uma a uma, telhado que levanta; paleta salmão + verde-sálvia + madeira. Nº 1: um porta-retrato na parede vira um painel de apps. Mascote de pantufas e controle na mão.",
 obs="House Control usa Smart Life/Home Assistant/Hue/Apple Home: citar só 'lâmpadas inteligentes'.")

L("copiar-qualquer-app","COPIA","5 PROJETOS PRA ENTENDER QUALQUER PROGRAMA","E O Nº 1 TE ENSINA A FAZER O SEU",
 "As big techs escondem como os programas funcionam. Esses projetos abrem tudo.",
 [("eleven","Zfinix/eleven","Quinto: eleven. Uma IA lê e explica programas fechados do seu lado."),
  ("Reverse Engineer Anything","NabilRFG12/Reverse-Engineer-anything","Quarto: agentes que descobrem como um app funciona por dentro."),
  ("Awesome Reverse Engineered","alexgaoth/awesome-reverse-engineered","Terceiro: dezessete mil ferramentas nascidas de engenharia reversa, num lugar só."),
  ("REA Prompts","JoasASantos/REA-Prompts","Segundo: prompts prontos pra desmontar qualquer programa."),
  ("Craft Anything","storytold/craft-anything","E o primeiro: entende como qualquer programa funciona e te ajuda a fazer o seu.")],
 "Esse é poderoso… comenta COPIA que eu te mando os cinco. Mas o próximo é o maior.",
 "Comenta COPIA e me segue. Use só com programa que é seu ou que a licença permite.",
 "links dos 5 + aviso legal (Lei de Software 9.609/98)",
 "Oficina de relojoeiro gigante: um relógio de bolso enorme aberto mostrando engrenagens, lupas, pinças, molas pelo chão; paleta latão + azul-aço + creme. Gancho: o mascote de óculos de lupa desparafusa uma caixa preta. Nº 1: as peças se remontam numa caixa nova com a cara do mascote.",
 polemica=True, obs="Engenharia reversa tem limites legais: não sugerir burlar proteção nem copiar software pago. Linguagem: 'entender como funciona'.")

S("ia-do-fim-do-mundo","SOBREVIVE","A IA QUE FUNCIONA SEM INTERNET","anonnerdfrenzy/survival-llm",[
 "Se a internet cair amanhã, essa IA continua funcionando.",
 "O survival-llm é um assistente e uma biblioteca de sobrevivência que roda no seu PC.",
 "Primeiros socorros, água, comida, conserto. Sem internet.",
 "E ele mostra a fonte de cada resposta. Comenta SOBREVIVE que eu te mando.",
 "Instala hoje, enquanto a internet ainda funciona.",
 "Comenta SOBREVIVE e me segue que eu te mando o link."],
 "link + o que baixar antes de ficar offline",
 "Bunker aconchegante: prateleiras de enlatados genéricos, rádio a manivela, lanterna, mapa de papel; paleta verde-oliva + laranja-sinalizador + cinza-concreto. Gancho: as luzes da cidade (maquete) apagam e só o notebook do mascote acende. Mascote de mochila de trilha e lanterna de cabeça.",
 obs="Sem medo gratuito: tom de 'kit de emergência'. Não substitui médico; dizer na legenda.")

L("ia-edita-foto","FOTO","3 IAS GRÁTIS PRA FOTO QUE RODAM NO SEU PC","E O Nº 1 TRANSFORMA FOTO EM 3D",
 "Editar foto com IA tem limite por dia. Essas três rodam no seu PC, sem limite.",
 [("kokon","GabrieleLozupone/kokon","Terceiro: kokon. Você descreve a mudança e ele edita, sem limite diário."),
  ("Shisei","wquguru/shisei","Segundo: Shisei. Mais de duzentas e cinquenta poses prontas pra guiar a sua IA de imagem."),
  ("Idol","speridlabs/idol-sdk","E o primeiro: Idol. Uma única foto vira um objeto em 3D.")],
 "Esse é ótimo… comenta FOTO que eu te mando os três. Mas o primeiro é bruxaria.",
 "Comenta FOTO e me segue que eu te mando os três links.",
 "links dos 3 (kokon precisa de placa de vídeo)",
 "Estúdio fotográfico de praia: fundo infinito de areia, guarda-sol, rebatedor prateado, flash de estúdio; paleta areia + azul-turquesa + branco. Nº 1: uma foto 2D sai do porta-retrato e vira escultura girando. Mascote de chapéu-panamá segurando um rebatedor.")

S("refazendo-todo-software","TUDO","ESTÃO REFAZENDO TODO PROGRAMA DO MUNDO","HeyPuter/everything",[
 "Um grupo quer refazer todos os programas do mundo do zero. E dar de graça.",
 "O projeto se chama Everything. Do pessoal do Puter.",
 "A ideia: recriar cada software e abrir o código pra qualquer um usar.",
 "Sete mil e quinhentas estrelas em três semanas. Comenta TUDO que eu te mando.",
 "Loucura ou futuro? As big techs não devem estar gostando.",
 "Comenta TUDO e me segue. Você acha que dá certo?"],
 "link + lista dos programas que já estão lá",
 "Canteiro de obras de uma cidade de software: guindastes levantando janelas de app, andaimes, plantas baixas; paleta laranja-obra + azul-planta + cinza. Gancho: uma cidade de prédios-logo genéricos é demolida e reconstruída em blocos. Mascote de capacete e prancheta.",
 polemica=True, obs="Ver no README o que já existe; não exagerar o estágio.")

S("digita-o-movimento","BONECO","DIGITE O MOVIMENTO E O BONECO FAZ","blendi-remade/prompt2rig",[
 "Você digita 'dança de TikTok' e um boneco 3D dança na hora.",
 "O prompt2rig junta um modelo de vídeo com captura de movimento.",
 "O personagem já sai pronto pra animação e jogo.",
 "Quinhentas estrelas em três semanas. Comenta BONECO que eu te mando.",
 "Serve pra quem faz jogo, animação ou só quer brincar.",
 "Comenta BONECO e me segue que eu te mando o link."],
 "link",
 "Estúdio de captura de movimento: chão com grade, câmeras em volta, manequim de pontinhos; paleta verde-chroma + magenta + preto. Mascote de roupa de captura com bolinhas, dançando. Nº 1 (fim): o manequim copia o mascote.",
 obs="Precisa de GPU; conferir requisitos.")

# ───────────── QUINTA 12/11 ─────────────
L("windows-gratis","WINDOWS","3 PROGRAMAS GRÁTIS QUE O WINDOWS DEVIA TER","E O Nº 1 LÊ ATÉ SEUS PRINTS",
 "O Windows deixa você na mão em três coisas. Esses três programas grátis resolvem.",
 [("Prism","FortoGraphy/prism-download-manager","Terceiro: Prism. Gerenciador de download com até trinta e duas conexões."),
  ("WinShun","LingCore/WinShun","Segundo: WinShun. Aperta Ctrl duas vezes e acha qualquer arquivo, até dentro do Word."),
  ("kensaku","yjid/kensaku","E o primeiro: kensaku. Procura até o texto dentro dos seus prints.")],
 "Esse é rápido… comenta WINDOWS que eu te mando os três. Mas o primeiro é o melhor.",
 "Comenta WINDOWS e me segue que eu te mando os três links.",
 "links dos 3",
 "Janela de casa de verdade (moldura de madeira) que abre para vários céus diferentes; peitoril com vasinhos; paleta azul-céu + verde-planta + branco-tinta. Nº 1: um print voa pela janela e as letras saltam dele. Mascote de luva de jardinagem regando.",
 obs="WinShun tem foco em busca por pinyin (chinês); a busca de texto completo vale para qualquer idioma — conferir.")

S("jarvis-em-portugues","JARVIS","UM JARVIS EM PORTUGUÊS NO SEU PC","jgm-source/jarvis-opensource",[
 "Um brasileiro fez um JARVIS em português que controla o seu PC.",
 "Você fala, ele ouve, responde e mexe no computador.",
 "Abre programa, organiza tarefa e conversa com você.",
 "É de graça e o código é aberto. Comenta JARVIS que eu te mando.",
 "Precisa de uma chave de IA; dá pra usar uma opção grátis.",
 "Comenta JARVIS e me segue pra mais IA feita no Brasil."],
 "link + passo a passo de instalação",
 "Oficina de inventor brasileiro: bancada com ferramentas, ventilador de teto, bandeirinhas de festa junina, um capacete de blocos com visor; paleta verde-amarelo dessaturado + vermelho-oficina. Mascote de óculos de solda falando com um holograma.",
 obs="'JARVIS' é nome do projeto; sem imagens do Homem de Ferro/Marvel. Conferir quais chaves (Groq tem plano grátis).")

L("skills-de-design","DESIGN","3 SKILLS QUE FAZEM DESIGN DE AGÊNCIA","E O Nº 1 PARECE DA APPLE",
 "Design bonito custa caro na agência. Essas três skills fazem em minutos.",
 [("Aixio Layer","Aixio-AI/aixio-layer-v2","Terceiro: Aixio Layer. Separa uma arte pronta em camadas pra você editar."),
  ("skills","juliobsz/skills","Segundo: uma skill que faz site de premiação com uma linha."),
  ("Dimensional Drawing","enesozturk/dimensional-drawing","E o primeiro: desenhos de interface em 3D no estilo da Apple.")],
 "Esse ajuda… comenta DESIGN que eu te mando as três. Mas a primeira é linda.",
 "Comenta DESIGN e me segue que eu te mando as três.",
 "links das 3",
 "Mesa de luz de designer gráfico vista de frente: réguas, pantones genéricos, recortes de papel colorido, estilete; paleta azul-klein + laranja + branco-papel. Nº 1: uma tela de app se ergue em camadas 3D flutuantes. Mascote de boina riscando.")

L("console-no-celular","MOBILE","5 JOGOS DE CONSOLE RODANDO NO CELULAR","E O Nº 1 RODA A 60 QUADROS",
 "Esses jogos de console nunca saíram pro celular. Os fãs botaram.",
 [("PokeDaisy","lidor30/pokedaisy","Quinto: PokeDaisy. Player de Game Boy pra portátil Android."),
  ("GTA V iOS","kevinerikjs/gta5-ios-port","Quarto: GTA V nativo no iPhone, com os arquivos do seu jogo."),
  ("BOTW Android","mamcjr/BOTWRecompAndroid","Terceiro: Breath of the Wild recompilado pra Android."),
  ("nx2android","shirai91/nx2android","Segundo: leva jogos de Switch pro Android, um por um."),
  ("D2R Mobile","jhaizhou-ops/d2r-mobile","E o primeiro: Diablo dois no celular, com toque e sessenta quadros por segundo.")],
 "Esse é absurdo… comenta MOBILE que eu te mando os cinco. Mas o próximo é o mais pedido.",
 "Comenta MOBILE e me segue. Só com o jogo que você comprou.",
 "links dos 5 + aviso: precisa da sua cópia; nunca ROM",
 "Pátio de escola na hora do recreio, ao entardecer: bancos de cimento, mochilas, um portátil de blocos passando de mão em mão; paleta laranja-pôr-do-sol + azul-uniforme + cinza-cimento. Nº 1: o celular vira uma arena com chamas pixeladas. Mascote de boné virado para trás.",
 polemica=True, obs="Nintendo de novo (Nintendo saiu 08/11): misturado com Rockstar/Blizzard, ok por ser outra pauta. Nunca ROM. Sem logos/personagens. 'Só com o seu jogo'.")

S("ocr-15x-rapido","TEXTO","TIRA O TEXTO DE QUALQUER FOTO","datalab-to/indra",[
 "Foto de documento, print, cardápio: essa IA tira o texto em segundos.",
 "Chama Indra. É um leitor de texto minúsculo, que roda no processador comum.",
 "Os criadores dizem que é quinze vezes mais rápido que o Tesseract, o clássico.",
 "Mil e seiscentas estrelas. Comenta TEXTO que eu te mando.",
 "Sem nuvem: o documento não sai do seu computador.",
 "Comenta TEXTO e me segue que eu te mando o link."],
 "link + jeito fácil de usar",
 "Escritório de datilografia dos anos 60: máquinas de escrever, papel carbono, arquivos; paleta verde-escritório + creme + preto-tinta. Gancho: uma foto de cardápio vira letras que voam e caem num papel limpo. Mascote de viseira de contador.",
 obs="'15x' é afirmação dos criadores (README): dizer 'segundo os criadores'. Requer instalar Python (é para quem tem paciência).")

S("quadros-ganham-vida","QUADRO","QUADROS FAMOSOS GANHAM VIDA COM IA","alchaincyf/huashu-art-motion",[
 "A Noite Estrelada, girando de verdade. Feita com uma skill.",
 "O huashu-art-motion anima pinturas com código.",
 "São trinta e cinco estilos de arte e nove jeitos de narrar.",
 "Seis mil e quatrocentas estrelas. Comenta QUADRO que eu te mando.",
 "Perfeito pra vídeo de história da arte ou pra aula.",
 "Comenta QUADRO e me segue que eu te mando o link e os prompts."],
 "link + 3 prompts de estilos",
 "Museu à noite depois que fecha: molduras douradas na parede, banco de veludo, cordão de isolamento; paleta azul-noite + dourado + vermelho-veludo. Gancho: o céu de um quadro genérico (pinceladas espirais) começa a girar. Mascote de crachá de vigia com lanterna.",
 obs="Obras em domínio público (Van Gogh). README em chinês: conferir. Precisa do Claude Code.")

S("loja-de-apps-bmw","BMW","UMA LOJA DE APPS PRO SEU BMW","robertnisipeanu/mgu-store",[
 "Tem dono de BMW instalando app que a BMW não oferece.",
 "O mgu-store é uma loja de apps pra central multimídia iDrive 7 e 8.",
 "Instala e atualiza apps por link, pelo GitHub ou por pendrive.",
 "Quinhentas e setenta estrelas. Comenta BMW que eu te mando.",
 "Atenção: mexer no sistema do carro pode afetar a garantia. Só se souber o que faz.",
 "Comenta BMW e me segue pra mais coisa que as marcas não contam."],
 "link + aviso de garantia",
 "Garagem de luxo à noite com um carro de blocos genérico (sem logo) sob holofote, ferramentas na parede, chão polido; paleta azul-elétrico + prata + preto. Gancho: o painel do carro acende e mostra ícones de app. Mascote de macacão de mecânico.",
 polemica=True, obs="Sem logo ou carro real da BMW. Público pequeno no Brasil; polêmica pelo 'a marca não queria'.")

S("figurinhas-de-aves","AVES","FIGURINHA DE TODAS AS AVES DO MUNDO","alchaincyf/huashu-bird-sticker",[
 "Onze mil e sessenta e quatro aves. Cada uma virou figurinha.",
 "Alguém fez figurinhas de todas as espécies de aves vivas do mundo.",
 "Com nome em quarenta e três línguas, inclusive português.",
 "Tem tucano, sabiá e bem-te-vi. Comenta AVES que eu te mando.",
 "Dá pra mandar no WhatsApp ou usar em aula de ciências.",
 "Comenta AVES e me segue pra mais coisa bonita feita com IA."],
 "link + como transformar em figurinha de WhatsApp",
 "Floresta atlântica de papel recortado (camadas de papel): cipós, flores, um álbum de figurinhas aberto no chão; paleta verde-mata + amarelo-ipê + azul-arara. Gancho: figurinhas voam do álbum e viram pássaros. Mascote de binóculo e chapéu de explorador.",
 obs="Conferir se o pacote tem português entre as 43 línguas e se tucano/sabiá/bem-te-vi estão lá antes de falar.")

# ───────────── SEXTA 13/11 ─────────────
L("assistentes-que-trabalham","AGENTE","3 ASSISTENTES DE IA QUE TRABALHAM SOZINHOS","E O Nº 1 SÓ TE CHAMA QUANDO PRECISA",
 "Assistente de IA que espera você mandar não é assistente. Esses três trabalham sozinhos.",
 [("Talorys","rociiu/talorys","Terceiro: Talorys. Seu assistente com memória e lembretes, na sua conta, de graça."),
  ("OpenDuet","CopilotKit/OpenDuet","Segundo: OpenDuet. Um agente que adianta o seu trabalho e te mantém por dentro."),
  ("agent-autoloop","KKKKhazix/agent-autoloop","E o primeiro: ele trabalha no fundo e só te chama quando tem dúvida.")],
 "Esse é prático… comenta AGENTE que eu te mando os três. Mas o primeiro é o sonho.",
 "Comenta AGENTE e me segue que eu te mando os três links.",
 "links dos 3 (exigem um pouco de técnica)",
 "Escritório de madrugada vazio onde só robôzinhos de blocos trabalham: cadeiras girando, luminárias, café esfriando; paleta azul-madrugada + amarelo-luminária + cinza. Gancho: o mascote dorme na mesa enquanto as tarefas se riscam sozinhas. Nº 1: um cartão sobe 'preciso de você' e o mascote acorda.")

L("linux-em-todo-lugar","LINUX","3 JEITOS DE TER LINUX ONDE NINGUÉM ESPERA","E O Nº 1 NEM PRECISA DE PENDRIVE",
 "Todo mundo acha que instalar Linux é difícil. Esses três provam que não.",
 [("LordOS","lordbasex/LordOS","Terceiro: LordOS. Um Linux grátis com área de trabalho própria."),
  ("LinuxRunner","mxhm11cr/LinuxRunner","Segundo: LinuxRunner. Programas de Linux rodando no iPhone e no iPad."),
  ("hop","Arjun-Ingole/hop","E o primeiro: hop. Instala o Linux do lado do Windows, sem pendrive.")],
 "Esse é diferente… comenta LINUX que eu te mando os três. Mas o primeiro é o mais fácil.",
 "Comenta LINUX e me segue que eu te mando os três links.",
 "links dos 3 + aviso: faça backup antes",
 "Acampamento de pinguins de blocos (genéricos, sem o mascote do Linux) numa geleira: iglus, fogueira, auroras; paleta azul-gelo + verde-aurora + branco. Nº 1: um notebook se divide ao meio com duas janelas. Mascote de gorro e cachecol.",
 obs="Instalar ao lado do Windows tem risco de perder dados: backup.")

S("atendente-telefone-ia","LIGA","CRIE UM ATENDENTE DE TELEFONE COM IA","C4rohan/Lampline",[
 "Seu negócio perde cliente que liga e ninguém atende? Dá pra ter um atendente de IA.",
 "O Lampline cria atendentes de telefone com IA no seu computador.",
 "E testa cada mudança com outra IA ligando pra ele.",
 "Roda grátis, sem chave. Comenta LIGA que eu te mando.",
 "Com a sua chave de IA, cada ligação custa centavos.",
 "Comenta LIGA e me segue que eu te mando o passo a passo."],
 "link + roteiro de atendimento pronto para pizzaria/salão",
 "Central telefônica antiga com cabos de plugar, telefones de disco coloridos, luzinhas piscando; paleta vermelho-telefone + creme + verde-oliva. Mascote de headset de telefonista plugando cabos. Nº 1: um telefone toca e responde sozinho com balão.",
 obs="Conferir 'grátis sem chave' (modo local) vs custo com chaves.")

L("placas-de-10-dolares","PLACA","3 PROJETOS COM UMA PLACA DE 10 DÓLARES","E O Nº 1 SABE O QUE VOCÊ FAZ PELO WI-FI",
 "Uma plaquinha de dez dólares consegue saber o que você está fazendo. Só pelo Wi-Fi.",
 [("Whistle","andrisgauracs/whistle-esp32","Terceiro: você fala uma cor e a luz muda. Sem internet."),
  ("ESP32 Thinks","raullenchai/esp32-thinks","Segundo: o seu próprio assistente de voz numa placa barata."),
  ("WiFi Sensing Kit","andrisgauracs/wifi-sensing-kit","E o primeiro: três placas aprendem o que você está fazendo só pelo sinal do Wi-Fi.")],
 "Esse é divertido… comenta PLACA que eu te mando os três. Mas o primeiro dá medo.",
 "Comenta PLACA e me segue que eu te mando os três links.",
 "links dos 3 + lista de compras",
 "Laboratório de inventor de garagem à noite: protoboards, LEDs, ferro de solda fumegando, ondas de Wi-Fi visíveis como anéis no ar; paleta verde-placa + cobre + azul-LED. Gancho: anéis de Wi-Fi atravessam a sala e desenham a silhueta do mascote. Mascote de óculos de proteção soldando.",
 polemica=True, obs="Tom de curiosidade, não de medo. Explicar que é um experimento que usa a webcam só para treinar.")

L("estudio-de-voz-gratis","VOZ","3 ESTÚDIOS DE VOZ GRÁTIS COM IA","E O Nº 1 CLONA VOZ",
 "Narrar vídeo com voz de IA costuma ser pago. Esses três são de graça.",
 [("Speech Studio","timoncool/speech-studio","Terceiro: Speech Studio. Voz e transcrição no Windows, sem internet."),
  ("AudioSmith","hehehai/AudioSmith","Segundo: AudioSmith. Faz audiobook, dublagem e transcrição no Mac."),
  ("Ming TTS","inclusionAI/Ming-3.0-tts","E o primeiro: Ming. Clona e cria vozes que você controla com palavras.")],
 "Esse é útil… comenta VOZ que eu te mando os três. Mas o primeiro impressiona.",
 "Comenta VOZ e me segue. E só clone a voz de quem deixou.",
 "links dos 3 + aviso: clonar voz só com autorização",
 "Cabine de rádio antiga: microfone de fita, letreiro NO AR (texto 'NO AR' em fonte clara), painel de botões, discos; paleta vermelho-NO-AR + madeira + verde-válvula. Nº 1: ondas sonoras saem do microfone e viram outra voz (cor diferente). Mascote de fone gigante e gravata-borboleta.",
 obs="Clonagem de voz: reforçar consentimento (deepfake proibido). Conferir idiomas (Speech Studio destaca russo).")

L("video-do-zero","VIDEO","3 SKILLS QUE FAZEM VÍDEO DO ZERO","E O Nº 1 FAZ UM EPISÓDIO EM UMA LINHA",
 "Você só dá o tema. Essas três skills entregam o vídeo pronto.",
 [("otopilot","wj-sidiss/otopilot","Terceiro: otopilot. Tema vira Short com roteiro, voz, legenda e capa. Sem chave."),
  ("take-one","talsiach/take-one","Segundo: take-one. Faz comercial e clipe a partir de uma frase."),
  ("What If","kelano86/what-if-animation","E o primeiro: uma linha vira um episódio animado de 'E se…'.")],
 "Esse é rápido… comenta VIDEO que eu te mando as três. Mas a primeira é a mais divertida.",
 "Comenta VIDEO e me segue que eu te mando as três.",
 "links das 3",
 "Cinema drive-in à noite: telão, carros de blocos genéricos, pipoqueiro, projetor soltando feixe; paleta azul-noite + vermelho-cinema + amarelo-pipoca. Nº 1: o telão mostra uma pergunta 'E SE…?' e uma animação nasce. Mascote de óculos 3D.",
 obs="What If usa ElevenLabs para voz (pode ter custo): conferir.")

S("namorada-de-ia","AMIGA","A AMIGA DE IA QUE LEMBRA DE VOCÊ","zeekk0/OpenAmika",[
 "Tem gente conversando todo dia com uma amiga de IA. E agora o código é aberto.",
 "A OpenAmika tem avatar animado, voz em tempo real e memória longa.",
 "Ela lembra do que você contou semana passada.",
 "E roda com o modelo que você escolher. Comenta AMIGA que eu te mando.",
 "Mas IA não substitui gente. Usa pra brincar, não pra se isolar.",
 "Comenta AMIGA e me segue. Você conversaria com uma?"],
 "link + aviso de uso saudável",
 "Quarto aconchegante à noite estilo anime genérico (sem personagens existentes): pufe, luzinhas, janela com chuva, tela com um avatar de blocos; paleta lilás + rosa-neon suave + azul-chuva. Mascote de pijama e caneca conversando com a tela.",
 polemica=True, obs="Personagem original do projeto; mostrar só avatar genérico de blocos. Tom responsável sobre solidão.")

S("npc-que-responde","NPC","FAÇA QUALQUER PERSONAGEM DE JOGO FALAR COM VOCÊ","christos-antono/NPCTalk",[
 "E se o NPC do seu jogo respondesse o que você falou?",
 "O NPCTalk faz qualquer personagem de jogo falar de volta, com voz de IA.",
 "Já vem com um exemplo completo em GTA V.",
 "Funciona com agentes como o Claude Code. Comenta NPC que eu te mando.",
 "É mod: use no modo single player, nunca online.",
 "Comenta NPC e me segue que eu te mando o link."],
 "link + aviso: só single player",
 "Cidade de jogo de mundo aberto genérica (blocos) ao pôr do sol: carros parados, um vendedor de rua de blocos com balão de fala; paleta laranja-GTA-genérico (pôr do sol) + rosa + azul-piscina. Mascote de boné e microfone de lapela conversando com o NPC.",
 obs="Usa Fish Audio (serviço pago para voz): avisar. Sem logo/arte de GTA.")

# ───────────── SÁBADO 14/11 ─────────────
S("aprender-coisa-dificil","APRENDE","A IA QUE TE ENSINA COISA DIFÍCIL","amosblomqvist/learnharness",[
 "Quer aprender algo difícil? Essa IA não te dá a resposta. Ela te ensina.",
 "O learnharness transforma um agente de IA num professor paciente.",
 "Ele vai no seu ritmo e te faz pensar.",
 "Quase seis mil estrelas em três semanas. Comenta APRENDE que eu te mando.",
 "Funciona pra programação, matemática ou qualquer assunto chato.",
 "Comenta APRENDE e me segue que eu te mando o link."],
 "link + prompt de 'professor socrático' para usar no ChatGPT",
 "Escalada em parede de boulder: agarras coloridas viram fórmulas, colchão azul, giz no ar; paleta laranja-agarra + azul-colchão + cinza-pedra. Mascote de magnésio nas mãos subindo, e a IA (um balão) dá dica de onde pôr o pé.",
 obs="Tema próximo de 'estudar' (08/11): ângulo 'aprender qualquer coisa difícil', público adulto.")

L("3d-sem-saber","MODELO","3 PROJETOS GRÁTIS PRA CRIAR EM 3D","E O Nº 1 FAZ CENA A PARTIR DE UMA FOTO",
 "Fazer 3D levava anos de curso. Esses três projetos fazem em minutos.",
 [("anyscene","apekshik/anyscene","Terceiro: anyscene. Um parágrafo vira uma cena realista no Blender."),
  ("SculptForge","islandmed/SculptForge","Segundo: SculptForge. Escultura 3D grátis, com IA que transforma imagem em 3D."),
  ("DeepOpen 3D","deepopen-com/deepopen-3d-webs","E o primeiro: você manda uma foto e ele cria uma cena 3D que dá pra navegar.")],
 "Esse é forte… comenta MODELO que eu te mando os três. Mas o primeiro é surreal.",
 "Comenta MODELO e me segue que eu te mando os três.",
 "links dos 3 (anyscene usa serviço pago 'fal')",
 "Ateliê de escultor de argila branca: tornos, bustos de argila genéricos, panos úmidos, claraboia; paleta branco-argila + terracota + azul-claraboia. Nº 1: uma foto na parede se dobra e vira um cômodo em 3D onde a câmera entra. Mascote de avental e espátula.")

L("ia-gigante-no-pc","LOCAL","3 JEITOS DE RODAR IA GIGANTE NO SEU PC","E O Nº 1 RODA UMA IA DE 748 BILHÕES",
 "As big techs querem que você pague mensalidade de IA. Esses três rodam IA no seu computador.",
 [("kapitsa","nace-ai/kapitsa","Terceiro: kapitsa. IA rápida em Mac com chip da Apple."),
  ("PolyStrata","simplexai-labs/PolyStrata","Segundo: PolyStrata. Instala vários modelos de IA com um clique."),
  ("Project Maya","mw00/project-maya","E o primeiro: roda modelos de centenas de bilhões de parâmetros nas suas placas.")],
 "Esse é útil… comenta LOCAL que eu te mando os três. Mas o primeiro pede máquina parruda.",
 "Comenta LOCAL e me segue que eu te mando os três links.",
 "links dos 3 + aviso de hardware necessário",
 "Sala de servidores caseira em um armário de lavanderia: máquina de lavar, PCs empilhados com LEDs, ventiladores, roupa no varal; paleta azul-LED + branco-azulejo + laranja-aviso. Gancho: uma nuvem de chuva é puxada para dentro de um gabinete. Mascote de touca de banho e chave inglesa.",
 polemica=True, obs="Project Maya exige várias GPUs: dizer 'pra quem tem máquina forte'. Não sugerir que é barato.")

S("comercial-com-trilha","COMERCIAL","A IA FAZ O COMERCIAL DO SEU PRODUTO, COM MÚSICA","alchaincyf/huashu-motion",[
 "Comercial de produto custa caro. Essa skill faz um com trilha própria.",
 "O huashu-motion faz vídeo de lançamento com o seu agente de IA.",
 "Ele compõe a música e você aponta no quadro o que quer mudar.",
 "Duas mil e quatrocentas estrelas. Comenta COMERCIAL que eu te mando.",
 "Bom pra loja, app ou serviço que precisa aparecer.",
 "Comenta COMERCIAL e me segue que eu te mando o passo a passo."],
 "link + roteiro de comercial de 15 s",
 "Set de filmagem de comercial de TV: fundo infinito, um produto genérico (caixa de blocos) girando num pedestal, claquete, grua; paleta amarelo-estúdio + preto + ciano. Mascote diretor de megafone e boné. Nº 1: o mascote aponta um quadro e ele muda de cor.",
 obs="README em chinês: conferir. Precisa de agente (Claude Code).")

S("vire-um-personagem","AVATAR","VIRE UM PERSONAGEM COM A SUA WEBCAM","livliv-dev/player",[
 "Você mexe a boca e um personagem desenhado mexe junto.",
 "O player é um personagem 2.5D que roda no navegador.",
 "Ele segue o seu rosto pela webcam e mexe a boca quando você fala.",
 "Mil estrelas em poucos dias. Comenta AVATAR que eu te mando.",
 "Bom pra live, aula ou pra quem não quer mostrar o rosto.",
 "Comenta AVATAR e me segue que eu te mando o link."],
 "link",
 "Teatro de fantoches de papel: palco de caixa de papelão, cortina de feltro, fantoches de vareta; paleta vermelho-feltro + azul-celeste + papel pardo. Mascote atrás de uma webcam de blocos, e um fantoche de papel imita seus movimentos.")

L("apps-pra-quem-vive-no-chat","MAPA","3 APPS PRA QUEM VIVE NO CHATGPT","E O Nº 1 DESENHA NA SUA TELA",
 "Você tem cem conversas com IA e não acha nenhuma? Esses três apps resolvem.",
 [("ClipBoardLine","orkunisitmak/clipboardline","Terceiro: guarda tudo que você copia, com busca até em imagem."),
  ("KIKUmap","tang1693/KIKUmap","Segundo: KIKUmap. Um mapa mental das suas conversas com o Claude e o ChatGPT."),
  ("Big Arrow","franzenzenhofer/big-arrow-on-the-screen","E o primeiro: a IA desenha setas na sua tela pra mostrar onde clicar.")],
 "Esse é organizado… comenta MAPA que eu te mando os três. Mas o primeiro é genial.",
 "Comenta MAPA e me segue que eu te mando os três.",
 "links dos 3 (KIKUmap e Big Arrow são para Mac)",
 "Sala de detetive: quadro de cortiça com fios vermelhos ligando bilhetes, lâmpada pendente, arquivo; paleta cortiça + vermelho-fio + verde-abajur. Nº 1: uma seta enorme vermelha atravessa a tela do monitor. Mascote de sobretudo e chapéu de detetive.")

S("mod-fps-oblivion","FPS","O MOD QUE DESTRAVOU O OBLIVION REMASTERED","LTSharpe/OblivionRemasteredPerformanceFix",[
 "O Oblivion Remastered travava nas cidades. Um fã consertou o motor do jogo.",
 "O mod mexe direto no motor e aumenta o FPS nas cidades.",
 "E quase acaba com as travadas na viagem, com a mesma imagem.",
 "Ele ainda publicou os testes. Comenta FPS que eu te mando.",
 "É grátis e o código é aberto.",
 "Comenta FPS e me segue pra mais coisa que gamer precisa."],
 "link + como instalar",
 "Taverna medieval de blocos à luz de velas: barris, lareira, mapa de pergaminho, espada na parede; paleta marrom-taverna + laranja-fogo + verde-musgo. Gancho: um contador de FPS em pergaminho sobe. Mascote de capuz de aventureiro.",
 obs="Sem arte/logos do jogo. Mod para single player.")

S("ia-liga-pra-voce","LIGACAO","A IA LIGA PRO SEU CELULAR QUANDO TERMINA","mutonby/agentring",[
 "E se a IA te ligasse quando terminar o serviço?",
 "O agentring faz seu agente de IA ligar pro seu celular.",
 "Toca como ligação de verdade, mesmo bloqueado. A voz te explica o que fez.",
 "E você pode ligar de volta. Comenta LIGACAO que eu te mando.",
 "Roda na sua máquina, sem número de telefone pago.",
 "Comenta LIGACAO e me segue que eu te mando o link."],
 "link",
 "Cabine telefônica vermelha numa rua de paralelepípedo à noite com chuva fina, poste de luz; paleta vermelho-cabine + azul-chuva + amarelo-poste. Mascote de capa de chuva atende o telefone; um robozinho de blocos do outro lado.")

# ───────────── DOMINGO 15/11 ─────────────
S("tv-que-cobra-licao","LICAO","A TV QUE SÓ LIGA DEPOIS DA LIÇÃO","chadyi/StudyOnTV",[
 "Essa TV só libera o desenho depois que a criança responde as perguntas.",
 "O StudyOnTV é um app grátis pra TV Android.",
 "A criança responde e ganha tempo de tela.",
 "Os pais mudam as perguntas pelo celular, com um QR code. Comenta LICAO que eu te mando.",
 "Tudo roda na TV, sem conta e sem servidor.",
 "Comenta LICAO e me segue. Você usaria com seu filho?"],
 "link + 20 perguntas prontas para crianças de 7 a 10 anos",
 "Sala de brinquedos colorida: tapete de EVA de letras, TV de blocos com cadeado de estrela, pufe; paleta amarelo-EVA + azul-royal + verde-limão. Gancho: a TV mostra uma pergunta e um cadeado. Mascote de capelo de formatura.",
 obs="Tema próximo de 'estudar' (08/11): ângulo pais + TV. Conferir se a interface aceita perguntas em português.")

S("laboratorio-3d-gratis","LAB","LABORATÓRIO DE CIÊNCIAS 3D DE GRAÇA","smithjohn78390/tongjiang-lab",[
 "Sua escola não tem laboratório? Esse site tem.",
 "O Tongjiang Lab tem aulas de ciência em 3D, interativas e grátis.",
 "Você mexe no experimento e vê o que acontece.",
 "Mil e seiscentas estrelas. Comenta LAB que eu te mando.",
 "É feito pro ensino médio e roda no navegador.",
 "Comenta LAB e me segue pra mais IA que ajuda a estudar."],
 "link + 3 experimentos para começar",
 "Laboratório de química de escola: bancadas pretas, tubos de ensaio coloridos borbulhando, tabela periódica genérica, jaleco pendurado; paleta verde-químico + roxo + branco-jaleco. Mascote de óculos de proteção e luvas, misturando dois tubos que soltam fumaça colorida.",
 obs="Site em chinês/inglês? Conferir idioma antes; se não tiver português, dizer 'em inglês'.")

L("skills-chinesas-agencia","AGENCIA","3 SKILLS CHINESAS QUE FAZEM TRABALHO DE AGÊNCIA","E O Nº 1 ACHA O SEU PRÓXIMO VIRAL",
 "Na China, uma skill já faz o trabalho de uma agência inteira. Três exemplos.",
 [("AI Promo Video","liyupi/ai-promo-video-maker","Terceiro: uma frase e ela faz o vídeo de lançamento do seu produto, em 4K."),
  ("Luobo PPT","zhouwei713/luobo-ppt","Segundo: faz apresentação de PowerPoint editável e bonita."),
  ("Taishang Laojun","liuhaisi2026212-maker/taishang-laojun","E o primeiro: acha o que está viralizando, sugere o tema e escreve o roteiro.")],
 "Esse assusta… comenta AGENCIA que eu te mando as três. Mas a primeira é a mais perigosa.",
 "Comenta AGENCIA e me segue. As agências vão ter que correr.",
 "links das 3 + dica de tradução (READMEs em chinês)",
 "Escritório de agência de publicidade vazio, com post-its caindo e cadeiras rodando sozinhas; janela com skyline genérica de cidade asiática à noite; paleta vermelho + dourado + branco. Gancho: uma placa 'AGÊNCIA' cai e no lugar sobe um notebook. Mascote de terno e óculos escuros.",
 polemica=True, obs="READMEs em chinês: conferir detalhes. Tom: 'as agências vão ter que se adaptar', sem ataque.")

L("blender-com-ia","BLENDER","3 PROJETOS QUE DEIXAM O BLENDER FÁCIL","E O Nº 1 FAZ 3D COM TEXTO",
 "O Blender é grátis, mas assusta todo mundo. Esses três facilitam.",
 [("Maya Workflow Kit","5hyuns/maya-workflow-kit-for-blender","Terceiro: deixa o Blender com o jeito do Maya, pra quem vem de lá."),
  ("Blender Skills","EL4CTEO/blender-skills","Segundo: ensina o seu agente de IA a modelar, animar e exportar no Blender."),
  ("sand3d","Sandflow-ai/sand3d","E o primeiro: modelagem 3D em código, feita pra IA desenhar.")],
 "Esse ajuda… comenta BLENDER que eu te mando os três. Mas o primeiro é o futuro.",
 "Comenta BLENDER e me segue que eu te mando os três.",
 "links dos 3",
 "Fábrica de brinquedos de madeira: esteira, peças torneadas, pintura, caixas; paleta laranja-Blender-genérico (tangerina) + azul-aço + madeira. Nº 1: uma frase digitada vira um brinquedo na esteira. Mascote de macacão e boné de fábrica.",
 obs="Sem logo do Blender.")

S("captura-de-qualquer-bicho","BICHO","CAPTURA DE MOVIMENTO DE QUALQUER BICHO","patch-gg/anymove",[
 "Captura de movimento de um cavalo, a partir de um vídeo de IA.",
 "O anymove pega um vídeo e tira o esqueleto do bicho.",
 "Usa duas câmeras no mesmo quadro e entrega um modelo 3D animado.",
 "Do mesmo criador do pixelfx. Comenta BICHO que eu te mando.",
 "Serve pra jogo, animação e efeitos especiais.",
 "Comenta BICHO e me segue que eu te mando o link."],
 "link",
 "Savana de papelão ao pôr do sol: árvores de recorte, girafas e cavalos de blocos com pontinhos de captura; paleta laranja-savana + amarelo + marrom. Mascote de chapéu de safári e câmera filmando um cavalo de blocos que vira esqueleto de linhas.",
 obs="pixelfx (mesmo autor patch-gg) foi item do 5 skills: conferir que é o mesmo autor (é: patch-gg).")

S("crie-seu-app-de-mac","APP","CRIE SEU PRÓPRIO APP DE MAC SEM SABER PROGRAMAR","daveebbelaar/bama",[
 "Você descreve o app e o Claude faz um app de Mac de verdade.",
 "O BAMA é um pacote de skills pra criar apps nativos de Mac.",
 "Ele pesquisa, desenha, programa e testa o app.",
 "Mil e seiscentas estrelas. Comenta APP que eu te mando.",
 "Precisa do Claude Code e de um Mac.",
 "Comenta APP e me segue que eu te mando o passo a passo."],
 "link + 3 ideias de app para começar",
 "Ateliê de marcenaria fina: bancada, plaina, pedaços de madeira virando janelas de app arredondadas; paleta nogueira + cinza-alumínio + verde-semáforo. Mascote de avental de couro e lápis atrás da orelha.",
 obs="'Sem saber programar' é exagero leve: dizer 'sem escrever código'.")

L("skills-video-explicativo","EXPLICA","3 SKILLS QUE FAZEM VÍDEO EXPLICATIVO","E O Nº 1 FOI FEITO PRA VIRALIZAR",
 "Vídeo explicativo é o que mais viraliza. Essas três skills fazem sozinhas.",
 [("Riso B-roll","YIAN6557/eian-riso-broll","Terceiro: animação no estilo gráfica antiga, em duas cores, pra vídeo vertical."),
  ("Whiteboard Teacher","liangdabiao/whiteboard-teacher-video","Segundo: o desenho vai aparecendo na lousa conforme você fala."),
  ("Vibe Knowledge Film","HeyChengC/vibe-knowledge-film","E o primeiro: desmonta um vídeo viral e copia o estilo pro seu tema.")],
 "Esse é bonito… comenta EXPLICA que eu te mando as três. Mas a primeira é a arma secreta.",
 "Comenta EXPLICA e me segue que eu te mando as três.",
 "links das 3 + dica de tradução",
 "Sala de aula antiga com lousa verde, giz, carteiras de madeira, globo terrestre; paleta verde-lousa + amarelo-giz + madeira. Nº 1: a lousa se divide em quadros de storyboard que se animam. Mascote de jaleco de professor e apagador.",
 obs="Vídeo de criação de vídeo é a 4ª pauta de vídeo da semana: fica no domingo, longe das outras.")

S("figurinha-animada","FIGURINHA","FIGURINHA ANIMADA DO SEU PERSONAGEM","WoYun520/pixel-gif-sticker-pack",[
 "Seu personagem virando um pacote de figurinhas animadas.",
 "Essa skill cria figurinhas em GIF a partir de um desenho de referência.",
 "E ela mesma confere se cada GIF ficou certo.",
 "Saiu há poucos dias e já passou de quinhentas estrelas. Comenta FIGURINHA que eu te mando.",
 "Funciona no Codex, e dá pra adaptar pro Claude.",
 "Comenta FIGURINHA e me segue que eu te mando o link."],
 "link + como colocar no WhatsApp",
 "Papelaria de bairro: prateleiras de cadernos, máquina de xerox, adesivos holográficos em cartela; paleta rosa-chiclete + azul-caneta + amarelo-marca-texto. Mascote de pochete e boné, colando figurinhas que se mexem em pixel art.",
 obs="Criado em 05/11: estrelas mudam rápido, reler. 'Adaptar pro Claude' é opinião: dizer 'feita pro Codex'.")

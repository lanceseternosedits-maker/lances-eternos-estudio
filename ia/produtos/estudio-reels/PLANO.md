# Estúdio de Reels com IA: plano do produto (Vitor, 09/11: "quero a landing-page e um produto similar ao do @_aighostlab")

Referência: Referência 8 em `referencias_fixas.md` (Skill Motion Creator, R$ 47 de R$ 97, precisa do Claude Pro).
Regra: estrutura e preço parecidos são mercado; **textos, estilos, nomes e layout são nossos**.

## O que é
Uma **skill para o Claude Code** (vem no Claude Pro) que transforma um assunto em **Reel animado pronto**: roteiro com gancho testado, animação 3D com mascote, voz, legenda palavra por palavra, trilha e MP4 1080×1920. Ela é feita com o mesmo motor que produz os Reels do @iaem60s: **o perfil é a demonstração**.

## Diferenciais nossos (o que ele não tem)
1. **Revisão antes de gastar tempo:** 4 revisores de IA julgam o roteiro (gancho, clareza, fatos, "a pessoa comum entende?") antes de animar (nosso painel de revisão).
2. **Checagem de qualidade automática:** velocidade da fala ≤ 3 palavras/s, até 35 s, área segura do Reels/TikTok (nada embaixo dos botões), volume certo (`checar.py`).
3. **Formatos que deram view de verdade, com os números:** contagem 5→1 (mediana de 2.500 views no nosso perfil, contra 231 de outros formatos), sistema em peças (quarto + cadeia de objetos), cidade em 5 etapas com contador, palco com mascote.
4. **Roteiro pensado pra comentário:** "Comenta PALAVRA" no meio, pedido de envio, pergunta final de 1 palavra, legenda e 1º comentário prontos.
5. Em português do Brasil, do começo ao fim.

## O que a pessoa recebe (proposta)
- A skill (zip + instalação em 1 comando), com 6 cenários prontos e regras de cor, luz e câmera.
- Seu mascote: 5 perguntas → 3 opções em 3D, ajuste conversando, igual em todo vídeo.
- 3 jeitos: do zero (dá o assunto), com a sua voz (manda o áudio), ou "nem ideia" (dá o nicho e recebe 3 pautas).
- Legenda + 1º comentário + resposta da DM prontos para cada vídeo.
- Guia em PDF: da instalação ao 1º vídeo.
- **Bônus no 8º dia (depois da garantia):** os roteiros dos nossos Reels que mais deram view.

## Oferta (sugestão; o Vitor decide)
- **R$ 47 pagamento único** (âncora R$ 97 só se for preço de verdade praticado antes; senão, âncora = "um motion encomendado custa R$ 150+"; regra de verdade do perfil), garantia de 7 dias, Kiwify (já integrada: webhook, funil `/comprar?o=`, 🔔 de venda).
- Combo com o Super Assistente (R$ 17) como order bump.
- Requisito claro: Claude Pro (ou acima) + computador (Windows ou Mac).

## Técnico (v1)
- Motor: **Remotion 4 + three.js** (`@remotion/three`): o próprio Remotion baixa o navegador no PC do comprador (o nosso pipeline atual usa Playwright, que é mais chato de instalar). Licença do Remotion: grátis para pessoa física e empresa de até 3 pessoas (avisar na FAQ, como ele faz).
- Voz: (a) a voz do próprio usuário (grava no celular), (b) Gemini TTS com a chave dele (custo ~US$ 0,02 por vídeo, avisar), (c) sem voz, só legenda e trilha.
- Nada de chave nossa dentro do produto. Nada de logo de terceiros. Fontes grátis (@fontsource).

## Landing
- `iaem60s.com/estudio` (Worker), mesmo funil `/comprar?o=estudio`. Estrutura: demo em vídeo acima da dobra (um Reel nosso com números reais), carta curta, conversa de exemplo, 3 jeitos, galeria dos cenários (quadros dos nossos Reels), o que recebe, bônus, preço, garantia, FAQ honesta (plano do Claude, precisa programar?, Windows, uso comercial, licença do Remotion, suporte).
- Prova social **só real** (views e comentários dos nossos Reels, prints do painel). Depoimento só depois de cliente real.

## Ordem de trabalho
1. Esqueleto da skill (SKILL.md, 2 cenários: contagem e cidade) rodando em Remotion aqui no ambiente; 1 Reel de teste.
2. Landing em rascunho (não publicada) + prévia para o Vitor.
3. Vitor aprova nome, preço e cria o produto na Kiwify → link de checkout no `kit.json`-equivalente.
4. Restante dos cenários, mascote, guia PDF, bônus.

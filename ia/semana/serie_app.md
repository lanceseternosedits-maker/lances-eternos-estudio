# Série "Como um app é feito com IA" (formato 4, Vitor 08/11)

Referência: @destravandosaas (série que percorre a cadeia toda de um SaaS). **Nossa versão, original (Vitor, 08/11: "estilo tecnológico e descolado", nada de oficina):** um **estúdio dark com neon** (roxo e ciano, piso de vidro escuro refletindo as luzes, mesa flutuante, telas holográficas). O mascote usa **moletom com capuz, fones e óculos de realidade aumentada**. O app é um **holograma no centro da sala**: começa como um único cubo de luz e, a cada episódio, ganha um **módulo neon novo** encaixado e ligado por linhas de luz (dados correndo como partículas). No último, o holograma vira uma "cidade" de módulos pulsando: o app completo. Terminal no topo com o pedido para a IA. Selo fixo **"PEÇA · NOME"** + contador **"N/15"**. Legenda uma palavra por vez. Fecha com "na próxima peça: …" + **Comenta PEÇA** (palavra única da série; o brinde é o mapa completo + o prompt daquela peça).

Regra de verdade: conceitos gerais (sem número), mas cada peça cita a documentação oficial que explica o conceito (ex.: MDN, Stripe, Supabase, Cloudflare). Nada de marca no vídeo além do Claude/ChatGPT no terminal.

| # | Selo | Terminal (gancho) | Módulo que entra no holograma | Ideia em 1 frase (o que a pessoa leva) | Próxima |
|---|---|---|---|---|---|
| 1 | PEÇA · APP | `> faz um app de agendamento` | o cubo central (o app) acende | A IA faz o app em minutos, mas ele só existe no seu computador: desligou o PC, sumiu. | servidor |
| 2 | PEÇA · DEPLOY | `> coloca meu app no ar` | o módulo SERVIDOR, com o selo "LIGADO 24H" piscando | Colocar no ar é mudar o app para um computador que nunca desliga: o servidor. | domínio |
| 3 | PEÇA · DOMÍNIO | `> quero meu app em meuapp.com` | o letreiro neon com o nome do app | Domínio é o endereço: troca um número difícil por um nome que a pessoa lembra. | banco de dados |
| 4 | PEÇA · BANCO DE DADOS | `> salva os agendamentos` | a torre de gavetas de luz (cada dado numa gaveta) | Sem banco de dados o app esquece tudo; é o armário onde cada informação tem gaveta. | login |
| 5 | PEÇA · LOGIN | `> cada cliente vê só os dele` | o portal com leitor de crachá | Login é o app saber quem é você antes de abrir a sua gaveta. | senha |
| 6 | PEÇA · SENHA | `> salva a senha do usuário` | o cofre que embaralha a senha em símbolos | O app certo nunca guarda a sua senha: guarda um "embaralhado" que não dá pra desfazer. | 2FA |
| 7 | PEÇA · 2FA | `> protege a conta com código` | o 2º cadeado com código no celular | Senha vazou? O código no celular é a segunda chave que o ladrão não tem. | pagamento |
| 8 | PEÇA · PAGAMENTO | `> cobra 30 reais por mês` | o módulo com cartão holográfico e "PAGO ✓" | O app não guarda o cartão: quem guarda é a empresa de pagamento; o app só recebe o "pago". | webhook |
| 9 | PEÇA · WEBHOOK | `> me avisa quando pagarem` | o sino de luz que toca quando chega o "pago" | Webhook é o app ser avisado na hora, em vez de ficar perguntando "já pagou?". | e-mail |
| 10 | PEÇA · E-MAIL | `> manda lembrete 1 dia antes` | os envelopes de luz saindo voando | O app manda e-mail sozinho por um serviço próprio pra não cair no spam. | API |
| 11 | PEÇA · API | `> conecta com o Google Agenda` | os cabos de luz ligando a outros apps | API é a tomada que deixa um app conversar com outro. | IA no app |
| 12 | PEÇA · IA NO APP | `> põe uma IA pra atender clientes` | o chat holográfico que responde sozinho | O app ganha uma IA que responde cliente 24 h, com as regras do seu negócio. | backup |
| 13 | PEÇA · BACKUP | `> e se apagar tudo?` | o clone translúcido guardado ao lado | Backup é a cópia guardada em outro lugar: deu problema, volta como estava. | escala |
| 14 | PEÇA · ESCALA | `> e se 10 mil pessoas entrarem?` | o holograma se multiplicando em vários | Escala é o app virar vários quando chega muita gente, e voltar a ser um quando acalma. | monitoramento |
| 15 | PEÇA · MONITORAMENTO | `> me avisa se o app cair` | o radar girando no topo | O app completo vigia a si mesmo e te avisa antes do cliente reclamar. Fim: a cidade de módulos completa pulsando. | (nova série) |

**Brinde (Comenta PEÇA):** o mapa das 15 peças numa imagem + o prompt pronto daquela peça para pedir ao Claude/ChatGPT. **Fixar no perfil** o episódio que mais estourar.
**Ordem de produção:** 1 peça por dia, no horário nobre (19:30 úteis / 19:00 fim de semana), começando pela 1; roteiros detalhados (`roteiro.json`) sempre 3 à frente, com aprovação do Vitor.

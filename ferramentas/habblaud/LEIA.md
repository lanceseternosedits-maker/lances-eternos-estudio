# Habblaud + equipe IA em 60s

O [Habblaud](https://github.com/marmottajr/habblaud) é um escritório em pixel art que mostra, ao vivo, o que os agentes
do Claude Code estão fazendo. Esta pasta liga a **equipe da nuvem** (as rotinas que gravam na tabela `atividade` do
painel) ao escritório, para o Vitor acompanhar o trabalho de todos num lugar só, junto com as sessões locais do
Claude Code do Mac.

## Instalar (no Mac)

```bash
bash ferramentas/habblaud/instalar.sh     # baixa o Habblaud 1.0.3 em ~/habblaud e aplica a ponte
cd ~/habblaud
npm run equipe:login                      # o código chega no celular (🔔), você digita no terminal
npm run build && npm start                # http://localhost:4747
```

Opcional: `npm run mod:install` (uso das contas e status ao vivo das sessões locais).

## Na aba 🏢 Equipe do painel (celular)

O mesmo escritório roda dentro do painel, sem Mac e sem servidor do Habblaud: o worker serve o cliente em
`/habblaud/` (arquivos em `ia/painel/habblaud/` do `midia-ia`) e ele abre com `?equipe=1`, lendo `/api/atividade`
direto do painel, com o login que o celular já tem. A aba mostra o Habblaud por padrão, com 🎨 Clássico (o escritório
antigo) e ⛶ tela cheia.

Para atualizar os arquivos do painel depois de mudar a ponte: `bash ferramentas/habblaud/gerar-painel.sh <pasta do midia-ia>`.

## O que aparece

| Sala | Agentes |
| --- | --- |
| Produção | Caçador, Roteirista, Revisores, Estúdio |
| Resultados | Analista, Redes, Cobrança |
| Vendas e DMs | Financeiro, Robô das DMs |

- **Trabalhando** → na mesa, com o `detalhe` no balão e o `progresso` (ex.: 3/5) como tarefa.
- **Livre** → vai para a copa/lounge (a vida social do Habblaud).
- **Trabalhando há mais de 3 h sem atualizar** → levanta a mão com "⚠ parado?" e um aviso na tela
  (a mesma regra da aba 🏢 Equipe do painel).
- Avisos quando alguém começa, termina ou fica parado; tudo também no feed de atividade.
- Mesmo visual (camisa, cabelo, pele, óculos, fone) e mesmos nomes da aba Equipe.

O painel é lido a cada 15 s. Para a equipe aparecer certa, cada rotina continua atualizando o seu personagem na tabela
`atividade` (regra do `CLAUDE.md` do `midia-ia`).

## Segurança

- Usa o mesmo login do painel (código no celular). A sessão fica só no Mac, em `~/.habblaud/equipe.json`
  (permissão 600), e vale 1 ano. `npm run equipe:login -- --sair` apaga.
- Só lê `GET /api/atividade`. Não muda nada no painel.
- Os agentes da equipe usam ids `equipe:` e são tratados como o modo demonstração: **nunca sobem para o Habblaud World**
  (os Termos dele exigem dados de sessões reais da máquina), não entram no timelapse e não ganham terminal nem editor.
- `HABBLAUD_EQUIPE=0` desliga a equipe. `HABBLAUD_WORLD=0` desliga o World inteiro, se preferir.

## Arquivos

- `equipe-iaem60s.patch`: a ponte (aplica sobre o commit `faa1a01` do Habblaud). Arquivos novos:
  `server/sources/equipe.ts` (a fonte), `server/sources/equipe.test.ts`, `scripts/equipe-login.ts`; mudanças pequenas em
  `server/model/office.ts`, `server/index.ts`, `shared/timeline.ts` e `package.json`.
- `instalar.sh`: baixa, aplica e instala.
- `gerar-painel.sh`: gera o cliente para `ia/painel/habblaud/` do `midia-ia`.

Testado com um painel simulado (os 5 testes novos passam; a suíte do Habblaud continua igual: as 2 falhas que existem já
falhavam antes da ponte, uma de tempo do World e outra de permissão de arquivo ao rodar como root). O login de verdade
no painel ainda não foi testado, porque depende do código chegar no celular do Vitor.

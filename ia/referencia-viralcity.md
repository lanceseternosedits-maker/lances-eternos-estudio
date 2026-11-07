# Referência: o "sistema" do perfil viralcity.jogo (partes 1 e 2)

Duas gravações de tela (Reels, 06/11/2026) em que o perfil mostra o painel que roda por trás dos canais dele.
Abaixo: a narração reconstruída das legendas, o que aparece na tela e o que dá para trazer para o IA em 60s.

## Narração (reconstruída das legendas na tela)

**Parte 1**
> O jogo vocês já viram. Agora o sistema que roda por trás. [...] liberar o acesso.
> Painel da fábrica. Na Home, cada canal do YouTube aparece em tempo real: views por hora, inscritos, até a monetização.
> Quem decide o que cada canal produz é o Maestro. Ele tem a agenda de todos os canais e solta um vídeo por vez, no seu horário.
> Se a voz ou a IA batem no limite do dia, ele espera e continua sozinho do ponto onde parou.
> Quando o vídeo fica pronto, ele chega aqui. A IA pesquisou o tema, escreveu o roteiro, narrou, gerou as cenas e montou...

**Parte 2**
> ...e já cortou os shorts: três vídeos curtos, cada um com um fato que prende. Sozinho.
> Depois vêm as thumbnails e as cinco opções de título, pra eu escolher. Escolho horário, aprovo, e ele sobe no YouTube, agendado, com a thumbnail e o título.
> É literalmente só revisar o vídeo e clicar em publicar.
> Antes disso, uma checagem automática: duração, volume, narração, fatos com fonte, títulos e tags.
> A descrição já vem escrita, com os capítulos e as fontes, e as tags que buscam.
> E os shorts vão sozinhos pra fila do Instagram.

(Trechos entre colchetes ou completados não estavam legíveis nas legendas; o áudio não foi transcrito.)

## O que aparece na tela

1. **Escritório em pixel art** (o "jogo"): cada sala é um canal/página (Canal 1 – YouTube, Página 1 – Reels, Página 3 – Reels...).
2. **Home / tempo real**: views em 48 h, views por hora, inscritos, total; gráfico de views por dia com uma cor por canal
   (os 2–3 últimos dias vêm das leituras de 10 em 10 min porque a API do YouTube ainda não fechou o dia).
3. **Por canal**: inscritos, views 48 h, views 28 dias, views totais, nº de vídeos públicos e barras de **monetização**
   (inscritos x/1.000, horas públicas x/4.000 em 12 meses, views de Shorts x/10 mi em 90 dias).
4. **Agenda de produção – Maestro** (ligado/desligado): "solta um vídeo por vez, na hora da vaga, e para quando a IA ou a voz batem
   no limite do dia". Lista "Próximas produções" com estados: *pronto pra revisão*, *produzindo desde 08:00*, *próximo a sair*,
   *abre às 10:00*, *espera até 21:00 (a cota de imagens do dia acabou)*. Tabela "A semana" (canal × hora × dias) e "Vaga por vaga" do dia.
5. **Tela de produção do vídeo** (ex.: Canal 2, vídeo longo de ciência animada, 10 min):
   - player do vídeo longo;
   - **Shorts do vídeo**: 3 cortes automáticos (31–47 s), cada um com um gancho no título ("O grão que já foi proibido", "Começou com cabras?");
   - **Título**: 5 opções geradas (com contagem de caracteres) + campo para escrever outro;
   - **Thumbnails do sistema**: 5 prontas, com nota; opção de subir a própria ("Minhas thumbnails");
   - **Em qual vaga o vídeo sai**: grade de horários livres/ocupados → botão **Aprovar e publicar** / Rejeitar.
6. **Checagem automática** (tudo "OK" antes de liberar): duração (dentro de 8–12 min), volume (-19,1 LUFS, pico -2 dB),
   narração (palavras x casadas com o roteiro), fatos com fonte e link, título (5 opções de 70 a 100 caracteres, sem travessão),
   tags (18 tags, 392 de 500 caracteres), thumbnails (5 prontas, nota média 7,8), shorts (3 de 31 a 47 s).
7. **Descrição pronta**: texto, pergunta para comentários, **capítulos com minutagem**, **fontes** e hashtags; bloco de tags.
8. **Aba Instagram do canal**: fila dos shorts com data/hora, "Publicar agora"/"Cancelar", e "Saíram nos últimos dias".

## O que o IA em 60s já tem e o que falta

| Peça do sistema mostrado | IA em 60s hoje | O que falta |
|---|---|---|
| Maestro / agenda por vagas | tarefas agendadas: referências (seg/qui 03:53), produção de 14 roteiros (seg/qui 04:47), cobrança de aprovações (09:23 e 18:23); vagas fixas de 4 posts por dia | ver as vagas da semana numa tela, com o que está em cada uma |
| Estados de cada vídeo | escritos em texto livre em `temas_usados` do `estado.json` | campo `status` em cada `meta.json` (roteiro aguardando, vídeo aguardando, agendado, publicado, negado) |
| Aprovação antes de publicar | 2 aprovações do Vitor (roteiro e MP4) pela conversa | aprovar na tela, vendo o vídeo |
| Checagem automática | regras no manual (fala ≤ 3 palavras/s, área segura, legibilidade, capa, fontes) | um script que mede e grava OK/falha no `meta.json` antes da 2ª aprovação |
| Fatos com fonte | `fontes` e `prova_viral` no `meta.json` | mostrar no cartão do vídeo |
| Opções de título/gancho | 1 legenda por rede | 3 a 5 ganchos para escolher na aprovação |
| Painel em tempo real | `metricas.json` lido do Metricool antes da produção | tela com views, salvamentos e envios por post e por rede |
| Shorts cortados do longo / YouTube | YouTube pausado; formato é Reel de ~35 s | não se aplica agora |

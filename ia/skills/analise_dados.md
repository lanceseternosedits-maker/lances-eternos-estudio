# Análise de dados para a probabilidade (Vitor, 12/11)
Skills instaladas de `social-media-skills/skills` (MIT, 300★), só markdown, sem script, sem chave: `analytics-and-reporting` (METER), `content-audit`, `competitor-analysis` (SCOUT), `experimentation-and-ab-testing`, `viral-reverse-engineering`. Elas citam WoopSocial e brand-profile: aqui a fonte dos números é o **Metricool** (`painel/dados/metricool_*.json`, `metricas.json`, `resultados.json`) e a marca é o `AGENTE.md`.

## Como usar com o `chance.py` (a % que filtra os roteiros em 70)
- **Nossos × nossos** (`analytics-and-reporting`, `content-audit`): métrica de sinal, não vaidade: salvamento, envio, comentário por alcance e % que passa dos 3 s; comparar sempre com a mediana dos nossos Reels do mesmo formato/categoria; sem número, marcar "lacuna" (nunca inventar). Fatores novos do `chance.py` saem daqui.
- **Nossos × online** (`competitor-analysis`, `viral-reverse-engineering`): a "prova viral" do roteiro (views de perfis grandes em `referencias.md`) é o benchmark externo; desmontar por que o post lá fora funcionou (gancho, formato, objeto) e comparar com o nosso roteiro antes de aprovar.
- **Teste** (`experimentation-and-ab-testing`): mudar uma variável por vez (ex.: pergunta de vida × opinião) e ler o resultado no analista.
- Regra das skills que vale aqui: amostra pequena engana (poucos Reels medidos), correlação não é causa, termina em 3 recomendações.
Registro: instaladas em 12/11 a pedido do Vitor; código lido (só markdown, nenhum comando).

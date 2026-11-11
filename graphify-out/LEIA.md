# Mapa do projeto (Graphify)

Gerado em 11/11/2026 com `graphifyy` 0.9.95. Cobre **os dois lados do projeto**:

- `estudio/…` → branch `main` (estúdio Lances Eternos: `estudio.py`, `editor.py`, ferramentas, workflow)
- `midia-ia/…` → branch `midia-ia` (IA em 60s: `ia/`, `.claude/skills`, `.claude/agents`, `midia/`)

Os caminhos dentro do grafo começam com `estudio/` ou `midia-ia/` para indicar de qual branch o arquivo veio.

## Números

- 5.209 nós, 7.094 ligações, 901 grupos (os 60 maiores com nome dado à mão)
- Código: 494 arquivos, extraídos localmente (AST, sem IA)
- Documentos: 528 arquivos lidos pelo Gemini (`gemini-3-flash-preview`), em 3 passadas;
  **402 entraram no mapa**, 126 voltaram sem nós (lista em `documentos_fora.txt`, a maioria legendas e respostas de DM curtas)
- Custo: ~1,25 milhão de tokens de entrada e ~0,56 milhão de saída no Gemini (`cost.json`)

## O que ficou de fora de propósito

- Imagens (612) e vídeos/áudios (135): são capas e reels já renderizados; o texto deles está nos roteiros e legendas
- `three.module.min.js` (8 cópias da biblioteca three.js nas cenas 3D): é código de terceiros e gerava milhares de nós sem sentido
- `ia/grafo/graph.json`: é o grafo de posts do próprio projeto (dado, não código)

## Como usar

```bash
pip install graphifyy
graphify query "como o reel é renderizado e publicado"
graphify explain "Painel IA em 60s"
graphify path "estudio.py" "worker.js"
graphify god-nodes
```

Abra `graph.html` no navegador para ver o mapa (visão por grupos). `GRAPH_REPORT.md` tem o relatório completo.

Cada ligação vem marcada como **EXTRACTED** (está escrita no arquivo), **INFERRED** (dedução do modelo) ou **AMBIGUOUS**. Confira as INFERRED antes de tratar como fato.

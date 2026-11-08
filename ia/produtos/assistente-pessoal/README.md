# Produto nº 2: Super Assistente de IA (R$ 47)

- `conteudo.py`: todo o texto do kit (editar aqui).
- `gerar_pdf.py`: gera `kit.html`, `kit.pdf` (20 páginas, A5). Rodar de `ia/`: `python3 produtos/assistente-pessoal/gerar_pdf.py`.
- `capa.jpg`: capa do produto (1ª página do PDF).
- `venda.md`: oferta, texto da página da Kiwify, lançamento, DM de venda e passo a passo da Kiwify.
- Validação: Reels `posts/2026-11-10-*` (ASSISTENTE, EQUIPE, CONFIGURA). Meta: 30 pedidos em 72 h (contar na tabela `comentarios` do D1 por palavra).
- O repositório é público: `kit.pdf` e `kit.html` ficam fora do git (.gitignore). Para gerar, rode o `gerar_pdf.py`. O texto em `conteudo.py` continua público.
- **Landing page** (Vitor, 08/11): `landing.py` gera `painel/kit.html`, servida em https://painel-iaem60s.vgofredousa.workers.dev/kit (banner no topo do `/links`, que é o link da bio). Prévia das páginas: `painel/capas/kit-p1/p9/p13/p19.jpg`. Preço, checkout e **depoimentos reais** ficam em `kit.json` (seção de depoimentos só aparece com relato real e autorizado; nunca inventar). O robô responde a palavra **KIT** em qualquer Reel (globais em `painel/respostas.json`, gerado pelo `zorcha.py`): sem checkout manda a landing; com checkout manda o link de compra.

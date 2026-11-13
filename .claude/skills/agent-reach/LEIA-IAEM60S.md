# Agent Reach no IA em 60s (Vitor, 13/11)
- Instalar na sessão (o container é novo a cada sessão): `pip install -q --break-system-packages git+https://github.com/Panniantong/Agent-Reach.git` (MIT).
- **Instagram precisa de login.** Use SÓ a conta de pesquisa (secundária), nunca o @iaem60s. O cookie fica no D1 `iaem60s-painel`, `config.ig_pesquisa_sessionid` (o Vitor cola em painel.iaem60s.com/segredo-instagram). Para usar: leia pelo conector Cloudflare e grave em `~/.secrets/ig_cookies.txt` (formato Netscape: `.instagram.com	TRUE	/	TRUE	0	sessionid	<valor>`), `chmod 600`. Nunca imprima, commite nem mande o valor.
- Baixar um Reel de referência: `yt-dlp --cookies ~/.secrets/ig_cookies.txt -o "%(id)s.%(ext)s" <url do reel>` (sem cookie o Instagram bloqueia). Números do post: `--print-json --skip-download`.
- Canal `instagram` do agent-reach (busca de perfis e posts) depende de baixar o OpenCLI pela API do GitHub, que a rede desta nuvem bloqueia (403 em 13/11); use o yt-dlp.
- Com calma: poucas consultas por sessão, para não marcar a conta.

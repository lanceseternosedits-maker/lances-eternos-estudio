"""Gera kit.html e kit.pdf do produto "Seu assistente pessoal em 1 tarde" a partir de conteudo.py.

Uso (de dentro de ia/): python3 produtos/assistente-pessoal/gerar_pdf.py
Página A5 (boa no celular). Fontes embutidas (Archivo Black, Inter, JetBrains Mono).
"""
import base64
import html
import subprocess
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
IA = AQUI.parent.parent
sys.path.insert(0, str(AQUI))
import conteudo as C  # noqa: E402

F = IA / "video" / "cena_contagem" / "f"


def fonte(nome, arquivo):
    b = base64.b64encode((F / arquivo).read_bytes()).decode()
    return f"@font-face{{font-family:'{nome}';src:url(data:font/woff2;base64,{b}) format('woff2')}}"


e = html.escape
LARANJA, TINTA, CREME = "#e8834a", "#1d1b2e", "#fbf6ee"
css = (fonte("Titulo", "archivo-black-latin-400-normal.woff2") + fonte("Corpo", "inter-latin-500-normal.woff2")
       + fonte("Mono", "jetbrains-mono-latin-500-normal.woff2") + f"""
@page {{ size: A5; margin: 14mm 13mm 16mm; @bottom-center {{ content: counter(page); font: 9pt Corpo; color: #998 }} }}
@page capa {{ margin: 0; @bottom-center {{ content: none }} }}
* {{ box-sizing: border-box }}
body {{ font: 10pt/1.5 Corpo, sans-serif; color: {TINTA}; margin: 0 }}
h1, h2, h3 {{ font-family: Titulo; font-weight: 400; line-height: 1.15; margin: 0 0 8pt }}
h2 {{ font-size: 19pt; color: {TINTA} }} h2 small {{ display: block; font: 9pt Corpo; color: {LARANJA}; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 4pt }}
h3 {{ font-size: 13pt }}
p {{ margin: 0 0 7pt }}
a {{ color: #b2541f; word-break: break-all }}
.pg {{ break-before: page }}
.capa {{ page: capa; height: 210mm; background: {TINTA}; color: #fff; padding: 22mm 14mm; display: flex; flex-direction: column; justify-content: space-between }}
.capa .selo {{ font: 9pt Corpo; letter-spacing: .14em; text-transform: uppercase; color: {LARANJA} }}
.capa h1 {{ font-size: 31pt; margin-top: 10mm }} .capa h1 em {{ color: {LARANJA}; font-style: normal }}
.capa p {{ font-size: 11.5pt; color: #d9d6ea; max-width: 105mm }}
.capa .bichos {{ font-size: 21pt; letter-spacing: 2pt }}
.capa .rod {{ font-size: 8.5pt; color: #9a96b5 }}
.passo {{ display: flex; gap: 9pt; margin: 0 0 9pt; padding: 9pt; background: {CREME}; border-radius: 8pt }}
.passo b.n {{ font: 20pt Titulo; color: {LARANJA}; min-width: 18pt }}
.caixa {{ background: {CREME}; border-left: 4pt solid {LARANJA}; border-radius: 6pt; padding: 8pt 10pt; margin: 6pt 0 10pt }}
pre {{ font: 8.4pt/1.45 Mono, monospace; white-space: pre-wrap; background: #f1ede6; border: 1px solid #e3ddd2; border-radius: 6pt; padding: 8pt 9pt; margin: 4pt 0 9pt }}
ul {{ margin: 0 0 8pt; padding-left: 13pt }} li {{ margin-bottom: 3pt }}
.ast h2 {{ font-size: 17pt }} .ast .em {{ font-size: 24pt }}
.ast .para {{ font-size: 10.5pt; color: #4a4760 }}
.ast .lab {{ font: 8pt Corpo; letter-spacing: .1em; text-transform: uppercase; color: {LARANJA}; margin: 8pt 0 2pt }}
.aviso {{ font-size: 8.5pt; color: #7a5a3a; background: #fff4e8; border-radius: 5pt; padding: 5pt 8pt }}
.check li {{ list-style: none; margin-left: -13pt; font-size: 10.5pt; margin-bottom: 6pt }} .check li::before {{ content: '☐  '; color: {LARANJA} }}
.toc li {{ font-size: 10.5pt; margin-bottom: 4pt }}
.mut {{ color: #7d7a90; font-size: 8.5pt }}
""")

partes = []
partes.append(f"""<section class="capa"><div><div class="selo">IA em 60s · Kit</div><h1>{e(C.TITULO).replace('1 tarde', '<em>1 tarde</em>')}</h1>
<p>{e(C.SUBTITULO)}</p></div><div class="bichos">{''.join(a['emoji'] for a in C.ASSISTENTES)}</div>
<div class="rod">{e(C.VERSAO)} · Perfil independente, sem ligação com OpenAI, Anthropic ou Google.</div></section>""")

partes.append('<section class="pg"><h2><small>Antes de começar</small>O que tem aqui</h2><ul class="toc">'
              + "<li><b>Como usar este kit</b>: o plano de 1 tarde</li><li><b>Parte 1</b>: faça a IA te conhecer (a sua ficha)</li>"
              + f"<li><b>Parte 2</b>: {len(C.ASSISTENTES)} assistentes prontos para contratar</li><li><b>Parte 3</b>: como treinar seus assistentes</li>"
              + "<li><b>Limites e segurança</b></li><li><b>Checklist final</b></li></ul>"
              + '<div class="caixa"><b>A ideia em 1 frase:</b> em vez de explicar tudo para a IA toda vez, você conta quem é uma vez só e cria assistentes com tarefas fixas. Ela passa a trabalhar por você, e não você por ela.</div>'
              + '</section><section class="pg"><h2><small>Antes de começar</small>Como usar este kit</h2>' + "".join(f'<div class="passo"><b class="n">{n}</b><div><b>{e(t)}</b><br>{e(d)}</div></div>' for n, t, d in C.COMO_USAR)
              + "</section>")

onde = "".join(f"<h3>{e(ia)}</h3><ul>" + "".join(f"<li>{e(x)}</li>" for x in itens) + "</ul>" for ia, itens in C.ONDE)
partes.append(f"""<section class="pg"><h2><small>Parte 1</small>Faça a IA te conhecer</h2>
<p>As três IAs têm um lugar para guardar quem você é e para criar assistentes com instruções fixas. Os menus mudam com frequência: se não achar o botão, use os links da ajuda oficial na última página.</p>{onde}</section>""")
partes.append(f"""<section class="pg"><h2><small>Parte 1</small>A sua ficha "quem sou eu"</h2>
<p>Responda primeiro, de cabeça ou no papel:</p><ul>{''.join(f'<li>{e(q)}</li>' for q in C.FICHA_PERGUNTAS)}</ul>
<p>Agora troque o que está entre colchetes e cole no lugar indicado na página anterior:</p><pre>{e(C.FICHA)}</pre></section>""")

for i, a in enumerate(C.ASSISTENTES, 1):
    partes.append(f"""<section class="pg ast"><h2><small>Parte 2 · Assistente {i} de {len(C.ASSISTENTES)}</small><span class="em">{a['emoji']}</span> {e(a['nome'])}</h2>
<p class="para">{e(a['para'])}</p><div class="lab">Onde criar</div><p>Projeto no ChatGPT ou no Claude, ou Gem no Gemini, com o nome "{e(a['nome'])}". Cole as instruções abaixo.</p>
<div class="lab">Instruções (copie e cole)</div><pre>{e(a['instrucoes'])}</pre>
<div class="lab">3 pedidos prontos para testar</div><ul>{''.join(f'<li>{e(p)}</li>' for p in a['pedidos'])}</ul>
<div class="lab">Dica</div><p>{e(a['dica'])}</p>{f'<p class="aviso">⚠️ {e(a["aviso"])}</p>' if a['aviso'] else ''}</section>""")

partes.append('<section class="pg"><h2><small>Parte 3</small>Como treinar seus assistentes</h2><p>"Treinar" aqui é ajustar as instruções com o uso, sem programação nenhuma.</p>'
              + "".join(f"<h3>{e(t)}</h3><p>{e(d)}</p>" for t, d in C.TREINAR) + "</section>")
partes.append('<section class="pg"><h2><small>Importante</small>Limites e segurança</h2><ul>' + "".join(f"<li>{e(x)}</li>" for x in C.SEGURANCA) + "</ul>"
              + '<h2 style="margin-top:14pt"><small>Fim da tarde</small>Checklist final</h2><ul class="check">' + "".join(f"<li>{e(x)}</li>" for x in C.CHECKLIST) + "</ul>"
              + '<div class="caixa">Ficou com dúvida ou quer um assistente que não está aqui? Manda DM para o <b>@iaem60s</b> com a palavra <b>KIT</b>.</div>'
              + f'<p class="mut">{e(C.VERSAO)}. Os nomes de menus podem mudar; os links de ajuda oficial são: '
              + " · ".join(f'<a href="{v}">{e(k)}</a>' for k, v in C.AJUDA.items())
              + ". ChatGPT, Claude e Gemini são marcas de seus donos; este kit é independente. Uso pessoal: não redistribua.</p></section>")

doc = f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>{e(C.TITULO)}</title><style>{css}</style></head><body>{"".join(partes)}</body></html>'
(AQUI / "kit.html").write_text(doc, encoding="utf-8")
js = f"""const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://{AQUI}/kit.html'); await p.waitForTimeout(500);
  await p.pdf({{ path: '{AQUI}/kit.pdf', format: 'A5', printBackground: true, preferCSSPageSize: true }}); await b.close(); }})();"""
subprocess.run(["node", "-e", js], check=True)
print("kit.pdf ok")

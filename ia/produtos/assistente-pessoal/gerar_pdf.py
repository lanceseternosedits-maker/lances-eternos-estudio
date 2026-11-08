"""Gera kit.html e kit.pdf do "Super Assistente de IA" a partir de conteudo.py.

Uso (de dentro de ia/): python3 produtos/assistente-pessoal/gerar_pdf.py
A5 (bom no celular), fontes embutidas (Archivo Black, Inter, JetBrains Mono). kit.pdf e kit.html ficam fora do git.
"""
import base64
import html
import re
import subprocess
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
IA = AQUI.parent.parent
sys.path.insert(0, str(AQUI))
import conteudo as C  # noqa: E402

F = IA / "video" / "cena_contagem" / "f"


def fonte(nome, arquivo):
    return f"@font-face{{font-family:'{nome}';src:url(data:font/woff2;base64,{base64.b64encode((F / arquivo).read_bytes()).decode()}) format('woff2')}}"


def t(s):
    """escapa e transforma [n] em referência sobrescrita."""
    return re.sub(r"\[(\d+)\]", r'<sup>[\1]</sup>', html.escape(s))


e = html.escape
LAR, TIN, CRE, LIN = "#ff7a3d", "#17152a", "#fbf6ee", "#e9e2d6"
css = (fonte("Titulo", "archivo-black-latin-400-normal.woff2") + fonte("Corpo", "inter-latin-500-normal.woff2")
       + fonte("Mono", "jetbrains-mono-latin-500-normal.woff2") + f"""
@page {{ size: A5; margin: 13mm 12mm 15mm; @bottom-right {{ content: counter(page); font: 8pt Corpo; color: #a39e94 }}
        @bottom-left {{ content: 'Super Assistente de IA · @iaem60s'; font: 7.5pt Corpo; color: #b9b3a8 }} }}
@page cheia {{ margin: 0; @bottom-right {{ content: none }} @bottom-left {{ content: none }} }}
* {{ box-sizing: border-box }}
body {{ font: 9.6pt/1.5 Corpo, sans-serif; color: {TIN}; margin: 0 }}
h1, h2, h3, .big {{ font-family: Titulo; font-weight: 400; line-height: 1.12; margin: 0 }}
h2 {{ font-size: 18pt; margin-bottom: 8pt }}
h3 {{ font-size: 11.5pt; margin: 9pt 0 4pt }}
.kick {{ font: 7.5pt Corpo; letter-spacing: .16em; text-transform: uppercase; color: {LAR}; margin-bottom: 3pt; display: block }}
p {{ margin: 0 0 6pt }} sup {{ font-size: 6.5pt; color: {LAR} }}
a {{ color: #b44d1c; word-break: break-all; text-decoration: none }}
.pg {{ break-before: page }}
.cheia {{ page: cheia; height: 210mm; padding: 20mm 14mm; color: #fff; background: {TIN}; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden }}
.cheia .halo {{ position: absolute; width: 150mm; height: 150mm; right: -60mm; top: -50mm; border-radius: 50%; background: radial-gradient(circle, {LAR}55, transparent 65%) }}
.capa h1 {{ font-size: 40pt; line-height: 1 }} .capa h1 em {{ color: {LAR}; font-style: normal; display: block }}
.capa .sub {{ font-size: 11pt; color: #d8d4ec; margin-top: 8mm; max-width: 110mm }}
.grade10 {{ display: grid; grid-template-columns: repeat(5, 1fr); gap: 3mm; margin: 6mm 0 }}
.grade10 div {{ background: #ffffff12; border: 1px solid #ffffff22; border-radius: 3mm; padding: 2.5mm 1mm; text-align: center; font-size: 15pt }}
.grade10 small {{ display: block; font: 6.2pt Corpo; color: #cfcbe3; margin-top: 1mm }}
.selo {{ display: inline-block; font: 8pt Corpo; letter-spacing: .14em; text-transform: uppercase; background: {LAR}; color: {TIN}; padding: 2pt 7pt; border-radius: 20pt }}
.rod {{ font-size: 7.5pt; color: #8f8aa8 }}
.cards3 {{ display: grid; gap: 7pt }}
.stat {{ display: flex; gap: 10pt; align-items: center; background: {CRE}; border-radius: 9pt; padding: 10pt 12pt }}
.stat .big {{ font-size: 25pt; color: {LAR}; min-width: 62pt; text-align: center }} .stat b {{ display: block; font-size: 10.5pt }}
.lic {{ background: {TIN}; color: #fff; border-radius: 9pt; padding: 10pt 12pt; margin-top: 8pt; font-size: 9.6pt }}
.metodo {{ display: grid; grid-template-columns: 1fr 1fr; gap: 7pt; margin-top: 4pt }}
.metodo div {{ background: {CRE}; border-radius: 9pt; padding: 10pt; min-height: 62pt }} .metodo .big {{ font-size: 22pt; color: {LAR} }}
.alav {{ border: 1px solid {LIN}; border-radius: 9pt; padding: 8pt 10pt; margin-bottom: 7pt; break-inside: avoid }}
.alav h3 {{ margin-top: 0 }} .alav .pq {{ font-size: 8.8pt; color: #5d5870 }}
.frase {{ font: 8.3pt/1.45 Mono; background: {TIN}; color: #ffe2d2; border-radius: 6pt; padding: 6pt 8pt; margin-top: 4pt }}
table {{ width: 100%; border-collapse: collapse; font-size: 8.6pt }} th {{ text-align: left; font: 7.5pt Corpo; letter-spacing: .08em; text-transform: uppercase; color: {LAR}; padding: 4pt }}
td {{ border-top: 1px solid {LIN}; padding: 5pt 4pt; vertical-align: top }}
pre {{ font: 7.9pt/1.45 Mono, monospace; white-space: pre-wrap; background: {TIN}; color: #f3eee6; border-radius: 8pt; padding: 9pt 10pt; margin: 3pt 0 8pt; position: relative }}
pre::before {{ content: 'COPIE E COLE'; position: absolute; right: 8pt; top: -7pt; font: 6.5pt Corpo; letter-spacing: .12em; background: {LAR}; color: {TIN}; padding: 1.5pt 6pt; border-radius: 10pt }}
.faixa {{ margin: 0 0 8pt; padding: 9pt 11pt 9pt; border-radius: 10pt; color: #fff }}
.faixa h2 {{ font-size: 19pt; margin: 0 }} .faixa .kick {{ color: #ffffffcc }} .faixa .em {{ font-size: 22pt; margin-right: 4pt }}
.faixa p {{ margin: 4pt 0 0; color: #ffffffe6; font-size: 9.4pt }}
.pqbox {{ background: {CRE}; border-radius: 7pt; padding: 6pt 9pt; font-size: 8.8pt; margin-bottom: 6pt }}
.lab {{ font: 7.3pt Corpo; letter-spacing: .12em; text-transform: uppercase; color: {LAR}; margin: 6pt 0 2pt }}
.ped li {{ margin-bottom: 2pt }} ul {{ margin: 0 0 6pt; padding-left: 12pt }}
.ex {{ border-left: 3pt solid {LAR}; padding: 3pt 8pt; font-size: 8.6pt; color: #3e3a52; background: #fff8f2 }}
.ex small {{ color: #a39e94 }}
.aviso {{ font-size: 7.8pt; color: #7a5a3a; margin-top: 6pt }}
.check li {{ list-style: none; margin-left: -12pt; margin-bottom: 4pt }} .check li::before {{ content: '☐  '; color: {LAR} }}
.fontes li {{ font-size: 7.6pt; margin-bottom: 4pt }}
.toc div {{ display: flex; justify-content: space-between; border-bottom: 1px dashed {LIN}; padding: 5pt 0; font-size: 10pt }} .toc span {{ color: {LAR} }}
""")

P = []
P.append(f"""<section class="cheia capa"><div class="halo"></div><div><span class="selo">IA em 60s · Kit</span>
<h1 style="margin-top:12mm">Super<em>Assistente</em>de IA</h1><p class="sub">{e(C.SUBTITULO)}</p></div>
<div><div class="grade10">{''.join(f'<div>{a["emoji"]}<small>{e(a["nome"])}</small></div>' for a in C.ASSISTENTES)}</div>
<div class="rod">{e(C.VERSAO)} · Para ChatGPT, Claude e Gemini, inclusive nos planos grátis. Perfil independente, sem ligação com OpenAI, Anthropic ou Google.</div></div></section>""")

toc = [("Por que isso funciona (os números)", "3"), ("O método em 4 passos", "4"), ("As 6 alavancas que turbinam qualquer IA", "5"),
       ("Onde configurar em cada IA", "7"), ("A ficha QUEM SOU EU", "8"), ("Os 10 assistentes prontos", "9"),
       ("10 comandos turbo", "19"), ("Ajuste, segurança e checklist", "20"), ("Fontes", "21")]
P.append('<section class="pg"><span class="kick">Sumário</span><h2>O que tem aqui</h2><div class="toc">'
         + "".join(f"<div><b>{e(a)}</b><span>p. {b}</span></div>" for a, b in toc)
         + '</div><div class="lic" style="margin-top:12pt"><b>Em 1 frase:</b> você conta para a IA quem é <u>uma vez</u>, cria assistentes com tarefas fixas e usa 10 comandos que melhoram qualquer resposta. Ela passa a trabalhar por você.</div></section>')

P.append('<section class="pg"><span class="kick">Por que isso funciona</span><h2>O que os estudos mediram</h2><div class="cards3">'
         + "".join(f'<div class="stat"><div class="big">{n}</div><div><b>{e(r)}</b>{t(d)} <sup>[{f}]</sup></div></div>' for n, r, d, f in C.NUMEROS)
         + f'</div><div class="lic">{t(C.NUMEROS_LICAO)}</div></section>')

P.append('<section class="pg"><span class="kick">O método</span><h2>4 passos, 1 tarde</h2><div class="metodo">'
         + "".join(f'<div><div class="big">{n}</div><b>{e(a)}</b><br>{e(b)}</div>' for n, a, b in C.METODO)
         + '</div><p style="margin-top:10pt">Comece pela ficha (passo 1): ela já melhora todas as conversas. Depois escolha só 3 assistentes, os que resolvem a sua maior dor. Os outros ficam para a semana seguinte.</p></section>')

for i in range(0, len(C.ALAVANCAS), 3):
    P.append(f'<section class="pg"><span class="kick">As 6 alavancas · {i // 3 + 1}/2</span><h2>{"O que turbina qualquer IA" if i == 0 else "Mais 3 alavancas"}</h2>'
             + "".join(f'<div class="alav"><h3>{a["icone"]} {e(a["nome"])}</h3><p>{e(a["oque"])}</p><p class="pq">📊 {t(a["porque"])}</p>'
                       f'<div class="frase">{e(a["frase"])}</div></div>' for a in C.ALAVANCAS[i:i + 3]) + "</section>")

P.append('<section class="pg"><span class="kick">Configuração</span><h2>Onde configurar em cada IA</h2>'
         '<table><tr><th>IA</th><th>Sobre você</th><th>Assistentes</th></tr>'
         + "".join(f'<tr><td><b>{e(a)}</b></td><td>{e(b)}</td><td>{e(c)}<br><span style="color:#8a8598">{t(d)}</span></td></tr>' for a, b, c, d in C.ONDE)
         + '</table><p style="margin-top:9pt">Os menus mudam com as atualizações dos apps. Se não achar o botão, procure pelo nome do recurso (Instruções personalizadas, Projetos, Gems) ou use a ajuda oficial na página de fontes <sup>[11]–[14]</sup>.</p>'
         '<div class="lic"><b>Grátis?</b> As três IAs têm plano grátis e você consegue começar com ele. Alguns recursos, como mais Projetos ou modelos de raciocínio, podem pedir o plano pago.</div></section>')

P.append(f'<section class="pg"><span class="kick">Passo 1 · 20 minutos</span><h2>A ficha QUEM SOU EU</h2>'
         f'<p>Troque o que está entre colchetes e cole em "Sobre você" (página anterior). Ela já traz 4 das 6 alavancas embutidas:</p>'
         f'<pre>{e(C.FICHA)}</pre><ul>{"".join(f"<li>{t(x)}</li>" for x in C.FICHA_PORQUE)}</ul></section>')

for i, a in enumerate(C.ASSISTENTES, 1):
    P.append(f"""<section class="pg"><div class="faixa" style="background:{a['cor']}"><span class="kick">Assistente {i} de {len(C.ASSISTENTES)}</span>
<h2><span class="em">{a['emoji']}</span>{e(a['nome'])}</h2><p>{e(a['faz'])}</p></div>
<div class="pqbox">📊 <b>Por que funciona:</b> {t(a['porque'])}</div>
<div class="lab">Crie um Projeto (ChatGPT/Claude) ou Gem (Gemini) chamado "{e(a['nome'])}" com:</div><pre>{e(a['prompt'])}</pre>
<div class="lab">Peça assim</div><ul class="ped">{''.join(f'<li>{e(p)}</li>' for p in a['pedidos'])}</ul>
<div class="lab">Como fica a resposta</div><div class="ex">{e(a['exemplo'])}<br><small>exemplo ilustrativo</small></div>
{f'<p class="aviso">⚠️ {e(a["aviso"])}</p>' if a['aviso'] else ''}</section>""")

P.append('<section class="pg"><span class="kick">Use em qualquer conversa</span><h2>10 comandos turbo</h2><table><tr><th>Cole isto</th><th>Quando</th><th>Por quê</th></tr>'
         + "".join(f'<tr><td style="font-family:Mono;font-size:7.8pt">{e(a)}</td><td>{e(b)}</td><td>{t(c)}</td></tr>' for a, b, c in C.TURBO)
         + "</table></section>")

P.append('<section class="pg"><span class="kick">Semana 1</span><h2>Ajuste, segurança e checklist</h2>'
         + "".join(f"<h3>{e(a)}</h3><p>{t(b)}</p>" for a, b in C.AJUSTE)
         + '<h3>🔒 Segurança</h3><ul>' + "".join(f"<li>{t(x)}</li>" for x in C.SEGURANCA) + "</ul>"
         + '<h3>✅ Checklist</h3><ul class="check">' + "".join(f"<li>{e(x)}</li>" for x in C.CHECKLIST) + "</ul></section>")

P.append('<section class="pg"><span class="kick">Referências</span><h2>Fontes</h2><ol class="fontes">'
         + "".join(f'<li>{e(n)}. <a href="{u}">{e(u)}</a></li>' for n, u in C.FONTES)
         + f'</ol><p class="aviso">{e(C.VERSAO)}. Exemplos de resposta são ilustrativos. ChatGPT, Claude e Gemini são marcas de seus donos; este material é independente. '
           'Uso pessoal: não redistribua. Dúvidas: DM para @iaem60s com a palavra KIT.</p></section>')

doc = f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>{e(C.TITULO)}</title><style>{css}</style></head><body>{"".join(P)}</body></html>'
(AQUI / "kit.html").write_text(doc, encoding="utf-8")
js = f"""const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://{AQUI}/kit.html'); await p.waitForTimeout(600);
  await p.pdf({{ path: '{AQUI}/kit.pdf', format: 'A5', printBackground: true, preferCSSPageSize: true }}); await b.close(); }})();"""
subprocess.run(["node", "-e", js], check=True)
print("kit.pdf ok")

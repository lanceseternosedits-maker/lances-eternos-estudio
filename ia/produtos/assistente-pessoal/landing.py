"""Landing page do Super Assistente de IA (Vitor, 08/11): gera painel/kit.html, servida pelo Worker em /kit.

Uso (de ia/): python3 produtos/assistente-pessoal/landing.py
Lê conteudo.py (assistentes, números) e kit.json (checkout, preço, depoimentos REAIS).
A seção de depoimentos só aparece quando kit.json tiver relatos reais (nunca inventar: CDC/CONAR).
"""
import html
import json
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
IA = AQUI.parent.parent
sys.path.insert(0, str(AQUI))
import conteudo as C  # noqa: E402

import base64
F = IA / "video" / "cena_contagem" / "f"
FONTES = "".join(f"@font-face{{font-family:'{n}';src:url(data:font/woff2;base64,{base64.b64encode((F / a).read_bytes()).decode()}) format('woff2');font-display:swap}}"
                 for n, a in [("Titulo", "archivo-black-latin-400-normal.woff2"), ("Corpo", "inter-latin-500-normal.woff2")])
K = json.loads((AQUI / "kit.json").read_text(encoding="utf-8"))
e = html.escape
link = K["checkout"] or "https://www.instagram.com/iaem60s/"
cta = f"Quero o meu por R$ {K['preco']}" if K["checkout"] else "Comenta KIT no Instagram"
nota_cta = ("Pagamento seguro pela Kiwify · Pix, cartão ou boleto · garantia de 7 dias" if K["checkout"]
            else "Lançamento em breve: comente KIT em qualquer Reel do @iaem60s e receba o link com o preço de lançamento")

assist = "".join(f'<div class="as" style="--c:{a["cor"]}"><span>{a["emoji"]}</span><b>{e(a["nome"])}</b><p>{e(a["faz"])}</p></div>' for a in C.ASSISTENTES)
nums = "".join(f'<div class="num"><b>{e(n)}</b><span>{e(r)}</span><p>{e(d.split(" (")[0].split(". (")[0])}</p><small>{e(d[d.rfind("(") + 1:-1]) if "(" in d else ""}</small></div>' for n, r, d, f in C.NUMEROS)
alav = "".join(f'<li><span>{a["icone"]}</span><div><b>{e(a["nome"])}</b> {e(a["oque"])}</div></li>' for a in C.ALAVANCAS)
deps = K.get("depoimentos") or []
sec_dep = ("" if not deps else '<section><h2>Quem já usa</h2><div class="deps">' + "".join(
    f'<blockquote>“{e(d["texto"])}”<cite>{e(d["nome"])}{" · " + e(d["assistente"]) if d.get("assistente") else ""}</cite></blockquote>' for d in deps) + "</div></section>")
faq = [("Preciso saber programar?", "Não. É copiar, colar e ajustar com palavras. Se você sabe mandar mensagem no WhatsApp, consegue."),
       ("Preciso pagar o ChatGPT, o Claude ou o Gemini?", "Não para começar: funciona nos planos grátis. Alguns recursos extras (como mais Projetos) podem pedir o plano pago."),
       ("Em quanto tempo eu configuro?", "Uma tarde: 20 minutos na ficha QUEM SOU EU e de 1 a 2 horas para os 3 primeiros assistentes."),
       ("Como recebo?", "Na hora, por e-mail, depois do pagamento: um PDF de 20 páginas pensado para ler no celular."),
       ("E se eu não gostar?", "Você tem 7 dias de garantia: pede o reembolso pela própria plataforma de pagamento, sem perguntas.")]
faq_h = "".join(f"<details><summary>{e(q)}</summary><p>{e(a)}</p></details>" for q, a in faq)

page = f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Super Assistente de IA · IA em 60s</title><meta name="description" content="10 assistentes de IA prontos para ChatGPT, Claude ou Gemini. Configure em 1 tarde.">
<meta property="og:title" content="Super Assistente de IA"><meta property="og:description" content="10 assistentes de IA prontos. Configure em 1 tarde.">
<meta property="og:image" content="/capas/kit-p1.jpg">
<style>{FONTES}
:root{{--l:#ff7a3d;--t:#17152a;--c:#fbf6ee;--m:#6d6880}}*{{box-sizing:border-box}}
body{{margin:0;font:16px/1.55 Corpo,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--t);background:#fff}}
h1,h2,h3{{font-family:Titulo,sans-serif;line-height:1.1;margin:0 0 12px}}
section{{max-width:620px;margin:0 auto;padding:44px 20px}}h2{{font-size:27px}}.k{{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--l);font-weight:700;display:block;margin-bottom:6px}}
.hero{{background:radial-gradient(circle at 85% 0,#ff7a3d55,transparent 55%),var(--t);color:#fff}}.hero section{{padding:34px 20px 40px}}
.hero h1{{font-size:44px}}.hero h1 em{{color:var(--l);font-style:normal}}.hero p.s{{font-size:18px;color:#dcd8ef;margin:0 0 22px}}
.capa{{display:block;width:62%;max-width:270px;margin:6px auto 26px;border-radius:14px;box-shadow:0 18px 50px #0008;transform:rotate(-3deg)}}
.btn{{display:block;text-align:center;background:var(--l);color:var(--t);font-weight:800;font-size:19px;padding:17px;border-radius:14px;text-decoration:none;box-shadow:0 8px 24px #ff7a3d55}}
.nota{{text-align:center;font-size:13px;color:#b9b4d1;margin-top:10px}}.preco{{text-align:center;margin:0 0 12px}}.preco s{{color:#8f8aa8}}.preco b{{font-size:30px;color:#fff}}
.chk{{list-style:none;padding:0;margin:0 0 22px}}.chk li{{padding:5px 0 5px 28px;position:relative}}.chk li::before{{content:"✓";position:absolute;left:0;color:var(--l);font-weight:900}}
.dor{{background:var(--c)}}.dor p{{font-size:18px}}
.nums{{display:grid;gap:12px}}.num{{background:var(--c);border-radius:16px;padding:16px 18px;display:grid;grid-template-columns:96px 1fr;column-gap:12px;align-items:center}}
.num b{{grid-row:span 3;font:32px Titulo;color:var(--l)}}.num span{{font-weight:800}}.num p{{margin:0;color:var(--m);font-size:15px}}.num small{{color:#a39e94;font-size:12px}}
.grid{{display:grid;grid-template-columns:1fr 1fr;gap:10px}}.as{{border:1px solid #eee5d8;border-top:5px solid var(--c);border-radius:14px;padding:12px}}
.as span{{font-size:26px}}.as b{{display:block;margin:4px 0}}.as p{{margin:0;font-size:13.5px;color:var(--m)}}
.alav{{list-style:none;padding:0;margin:0}}.alav li{{display:flex;gap:12px;padding:10px 0;border-bottom:1px dashed #eadfcf}}.alav span{{font-size:24px}}
.prev{{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:8px}}.prev img{{width:72%;max-width:300px;flex:none;border-radius:12px;border:1px solid #eee;scroll-snap-align:center}}
.passos{{counter-reset:p;list-style:none;padding:0}}.passos li{{counter-increment:p;padding:10px 0 10px 50px;position:relative}}.passos li::before{{content:counter(p);position:absolute;left:0;top:6px;width:36px;height:36px;border-radius:50%;background:var(--t);color:#fff;font:18px/36px Titulo;text-align:center}}
.deps{{display:grid;gap:12px}}blockquote{{margin:0;background:var(--c);border-radius:16px;padding:16px}}cite{{display:block;margin-top:8px;font-style:normal;color:var(--m);font-size:14px}}
.gar{{display:flex;gap:14px;align-items:center;background:var(--c);border-radius:16px;padding:16px}}.gar .ic{{font-size:40px}}
details{{border-bottom:1px solid #eee;padding:12px 0}}summary{{font-weight:800;cursor:pointer}}
.final{{background:var(--t);color:#fff}}.final h2{{color:#fff}}footer{{text-align:center;font-size:12px;color:#9a96ad;padding:20px;background:var(--t)}}
.fix{{position:fixed;left:12px;right:12px;bottom:12px;max-width:600px;margin:0 auto;display:none}}.fix.on{{display:block}}
</style></head><body>
<div class="hero"><section><span class="k">IA em 60s · Kit digital</span>
<h1>Seu <em>Super Assistente</em> de IA</h1>
<p class="s">10 assistentes prontos para o ChatGPT, o Claude ou o Gemini. Você configura numa tarde e a IA passa a trabalhar por você: nas contas, no cardápio, nos textos, nos estudos e no seu negócio.</p>
<img class="capa" src="/capas/kit-p1.jpg" alt="Capa do Super Assistente de IA">
<ul class="chk"><li>10 assistentes com o texto pronto para copiar e colar</li><li>A ficha que faz a IA te conhecer de verdade</li><li>As 6 alavancas que deixam qualquer IA muito melhor</li><li>10 comandos turbo para usar em qualquer conversa</li></ul>
<p class="preco">{f'<s>R$ {K["preco"]}</s> &nbsp;<b>R$ {K["preco_lancamento"]}</b> com o cupom {e(K["cupom"])}' if K["checkout"] and K.get("cupom") else f'<b>R$ {K["preco"]}</b>'}</p>
<a class="btn" id="cta1" href="{e(link)}">{e(cta)}</a><p class="nota">{e(nota_cta)}</p></section></div>

<div class="dor"><section><span class="k">O problema</span><h2>Você explica tudo pra IA toda vez. E ela responde igual pra todo mundo.</h2>
<p>A IA não sabe quem você é, o que você faz nem como você gosta das coisas. Sem isso, a resposta vem genérica, longa e você desiste.</p>
<p><b>O Super Assistente resolve isso em uma tarde:</b> você conta quem é uma vez só e cria assistentes com tarefas fixas, que já sabem o que fazer.</p></section></div>

<section><span class="k">Produtividade de verdade</span><h2>O que os estudos mediram com quem usa IA do jeito certo</h2><div class="nums">{nums}</div>
<p style="color:var(--m);font-size:14px;margin-top:14px">Resultados de estudos com profissionais, não promessa de resultado individual. O ganho vem do jeito de usar, e é isso que o kit ensina.</p></section>

<section style="padding-top:0"><span class="k">O que vem no kit</span><h2>Seus 10 assistentes</h2><div class="grid">{assist}</div></section>

<section style="padding-top:0"><span class="k">Por dentro</span><h2>Veja as páginas</h2><div class="prev">
<img src="/capas/kit-p9.jpg" alt="Página do assistente Contas da casa"><img src="/capas/kit-p13.jpg" alt="Página de um assistente"><img src="/capas/kit-p19.jpg" alt="Página dos 10 comandos turbo"></div>
<p style="color:var(--m);font-size:14px">PDF de 20 páginas, pensado para ler no celular. Cada assistente tem o prompt pronto, 3 pedidos para testar e um exemplo de resposta.</p></section>

<section style="padding-top:0"><span class="k">O método</span><h2>As 6 alavancas que turbinam qualquer IA</h2><ul class="alav">{alav}</ul></section>

<section style="padding-top:0"><span class="k">Como funciona</span><h2>4 passos, 1 tarde</h2><ol class="passos">{''.join(f'<li><b>{e(a)}:</b> {e(b)}</li>' for n, a, b in C.METODO)}</ol></section>

{sec_dep}

<section style="padding-top:0"><div class="gar"><span class="ic">🛡️</span><div><b>Garantia de 7 dias.</b> Não gostou? Peça o reembolso pela plataforma de pagamento, sem perguntas.</div></div></section>

<section style="padding-top:0"><span class="k">Dúvidas</span><h2>Perguntas frequentes</h2>{faq_h}</section>

<div class="final"><section><h2>Pare de trabalhar para a IA. Faça ela trabalhar por você.</h2>
<a class="btn" href="{e(link)}">{e(cta)}</a><p class="nota">{e(nota_cta)}</p></section></div>
<footer>Super Assistente de IA · @iaem60s<br>Perfil independente, sem ligação com OpenAI, Anthropic ou Google. ChatGPT, Claude e Gemini são marcas de seus donos.</footer>
<a class="btn fix" id="fix" href="{e(link)}">{e(cta)}</a>
<script>const c=document.getElementById('cta1'),f=document.getElementById('fix');new IntersectionObserver(([x])=>f.classList.toggle('on',!x.isIntersecting)).observe(c);</script>
</body></html>"""
(IA / "painel" / "kit.html").write_text(page, encoding="utf-8")
print("painel/kit.html ok", "(com checkout)" if K["checkout"] else "(sem checkout: CTA = comentar KIT)", f"{len(deps)} depoimento(s)")

"""Landing page do Super Assistente de IA (Vitor, 08/11): gera painel/kit.html, servida pelo Worker em /kit.

Uso (de ia/): python3 produtos/assistente-pessoal/landing.py
Lê conteudo.py (assistentes, números) e kit.json (checkout, preço, prazo, depoimentos REAIS).
Estrutura (guias de página de vendas: Hotmart, Herospark, Crevio, Tray): headline + demo acima da dobra, problema,
prova (estudos), oferta completa, amostra grátis, para quem é/não é, depoimentos (só reais), garantia, preço com
ancoragem real, FAQ de objeções, CTA em 4 pontos + barra fixa no celular. Urgência só se prazo_lancamento existir.
"""
import base64
import html
import json
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
IA = AQUI.parent.parent
sys.path.insert(0, str(AQUI))
import conteudo as C  # noqa: E402

F = IA / "video" / "cena_contagem" / "f"
FONTES = "".join(f"@font-face{{font-family:'{n}';src:url(data:font/woff2;base64,{base64.b64encode((F / a).read_bytes()).decode()}) format('woff2');font-display:swap}}"
                 for n, a in [("Titulo", "archivo-black-latin-400-normal.woff2"), ("Corpo", "inter-latin-500-normal.woff2"), ("Mono", "jetbrains-mono-latin-500-normal.woff2")])
K = json.loads((AQUI / "kit.json").read_text(encoding="utf-8"))
e = html.escape
tem_checkout = bool(K.get("checkout"))
link = K["checkout"] or "https://www.instagram.com/iaem60s/"
cta = "Quero meu Super Assistente" if tem_checkout else "Comenta KIT no Instagram"
cupom_ok = tem_checkout and K.get("cupom") and K.get("preco_lancamento")
preco_final = K["preco_lancamento"] if cupom_ok else K["preco"]
micro = "Acesso imediato · Pix, cartão ou boleto · Garantia de 7 dias" if tem_checkout else "Lançamento em breve: comente KIT em qualquer Reel do @iaem60s"
prazo = K.get("prazo_lancamento") or ""

ASS = C.ASSISTENTES
amostra = next(a for a in ASS if a["nome"] == "Detector de golpe")
cards = "".join(f'<div class="ac rv" style="--c:{a["cor"]}"><div class="ae">{a["emoji"]}</div><div><b>{e(a["nome"])}</b><p>{e(a["faz"])}</p></div></div>' for a in ASS)
nums = "".join(
    f'<div class="nm rv"><div class="nb" data-n="{e(n)}">{e(n)}</div><div><b>{e(r)}</b><p>{e(d.split(". (")[0].split(" (")[0])}</p>'
    f'<small>{e(d[d.rfind("(") + 1:-1]) if "(" in d else ""}</small></div></div>' for n, r, d, f in C.NUMEROS)
alav = "".join(f'<div class="al rv"><span>{a["icone"]}</span><b>{e(a["nome"])}</b><p>{e(a["oque"])}</p></div>' for a in C.ALAVANCAS)
deps = K.get("depoimentos") or []
sec_dep = ("" if not deps else '<section class="w"><span class="k">Quem já usa</span><h2>O que estão dizendo</h2><div class="dps">' + "".join(
    f'<figure class="dp rv"><div class="st">★★★★★</div><blockquote>“{e(d["texto"])}”</blockquote><figcaption><b>{e(d["nome"])}</b>'
    f'{" · usa o " + e(d["assistente"]) if d.get("assistente") else ""}</figcaption></figure>' for d in deps) + "</div></section>")
faq = [("Preciso saber programar ou entender de IA?", "Não. Tudo é copiar, colar e ajustar com palavras. Se você manda mensagem no WhatsApp, você consegue."),
       ("Preciso pagar o ChatGPT, o Claude ou o Gemini?", "Não para começar: funciona nos planos grátis das três. Alguns recursos extras (como mais Projetos ou o modo de raciocínio) podem pedir o plano pago."),
       ("Funciona no celular?", "Sim. O PDF foi feito para ler no celular e os assistentes funcionam nos apps do ChatGPT, do Claude e do Gemini."),
       ("Quanto tempo leva para configurar?", "Uma tarde: 20 minutos na ficha QUEM SOU EU e de 1 a 2 horas para os 3 primeiros assistentes."),
       ("Como eu recebo?", "Na hora, por e-mail, logo depois do pagamento aprovado (no Pix é imediato)."),
       ("E se eu não gostar?", "Você tem 7 dias de garantia incondicional: pede o reembolso pela plataforma de pagamento e recebe 100% de volta, sem perguntas."),
       ("Por que não usar só os prompts grátis da internet?", "Prompt solto ajuda numa conversa. Aqui você monta assistentes fixos que já te conhecem, com as 6 alavancas que os estudos mostram que melhoram as respostas, organizados para o dia a dia.")]
faq_h = "".join(f"<details class='rv'><summary>{e(q)}</summary><p>{e(a)}</p></details>" for q, a in faq)
inclui = ["10 assistentes prontos (prompt completo de cada)", "Ficha QUEM SOU EU para a IA te conhecer", "As 6 alavancas que turbinam qualquer IA",
          "10 comandos turbo para qualquer conversa", "30 pedidos prontos + exemplo de resposta", "Funciona no ChatGPT, Claude e Gemini", "PDF de 20 páginas para o celular"]
preco_html = (f'<div class="pa"><s>R$ {e(K["preco"])}</s><span class="cp">cupom {e(K["cupom"])}</span></div><div class="pv"><small>R$</small>{e(preco_final)}</div>'
              if cupom_ok else f'<div class="pv"><small>R$</small>{e(preco_final)}</div>')
parc = '<p class="pp">pagamento único · sem mensalidade · acesso para sempre</p>'

page = f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Super Assistente de IA · 10 assistentes prontos · IA em 60s</title>
<meta name="description" content="Transforme o ChatGPT, o Claude ou o Gemini num Super Assistente: 10 assistentes prontos que já te conhecem. Configure em 1 tarde.">
<meta property="og:title" content="Super Assistente de IA"><meta property="og:description" content="10 assistentes de IA prontos. Configure em 1 tarde."><meta property="og:image" content="/capas/kit-p1.jpg">
<meta name="theme-color" content="#0f0d1d">
<style>{FONTES}
:root{{--l:#ff7a3d;--l2:#ffb347;--t:#0f0d1d;--t2:#1b1830;--c:#fbf6ee;--m:#6d6880;--g:linear-gradient(135deg,#ff7a3d,#ffb347)}}
*{{box-sizing:border-box}}html{{scroll-behavior:smooth}}body{{margin:0;font:16.5px/1.6 Corpo,-apple-system,sans-serif;color:var(--t);background:#fff;-webkit-font-smoothing:antialiased}}
h1,h2,h3{{font-family:Titulo;line-height:1.08;margin:0 0 14px;letter-spacing:-.01em}}h2{{font-size:clamp(27px,7vw,38px)}}
.w{{max-width:680px;margin:0 auto;padding:64px 22px}}.k{{display:inline-block;font-size:12px;letter-spacing:.16em;text-transform:uppercase;font-weight:800;color:var(--l);margin-bottom:10px}}
.gt{{background:var(--g);-webkit-background-clip:text;background-clip:text;color:transparent}}
.bar{{background:var(--g);color:var(--t);text-align:center;font-size:14px;font-weight:800;padding:9px 12px}}
.dk{{background:radial-gradient(900px 500px at 90% -10%,#ff7a3d40,transparent 60%),radial-gradient(700px 500px at -10% 30%,#6a4cff30,transparent 60%),var(--t);color:#fff}}
.hero .w{{padding-top:40px;padding-bottom:56px}}.hero h1{{font-size:clamp(40px,11vw,62px)}}.hero .sub{{font-size:19px;color:#d6d2ea;margin:0 0 26px}}
.pill{{display:inline-flex;gap:8px;align-items:center;background:#ffffff14;border:1px solid #ffffff26;border-radius:99px;padding:6px 12px;font-size:13px;color:#e9e6f7;margin-bottom:18px}}
.pill i{{width:8px;height:8px;border-radius:50%;background:#3ddc84;box-shadow:0 0 10px #3ddc84}}
.mock{{position:relative;height:340px;margin:8px 0 30px}}.book{{position:absolute;left:4%;top:10px;width:52%;max-width:250px;border-radius:10px 16px 16px 10px;transform:perspective(900px) rotateY(18deg) rotateX(4deg);
box-shadow:-8px 0 0 #2a2645,22px 30px 60px #000a;animation:fl 6s ease-in-out infinite}}
.phone{{position:absolute;right:2%;top:40px;width:48%;max-width:230px;background:#0b0a16;border:7px solid #2b2840;border-radius:28px;padding:12px 10px;box-shadow:0 30px 70px #000b;animation:fl 6s ease-in-out -3s infinite}}
@keyframes fl{{50%{{transform:translateY(-8px) perspective(900px) rotateY(18deg) rotateX(4deg)}}}}.phone{{animation-name:fp}}@keyframes fp{{50%{{transform:translateY(-8px)}}}}
.msg{{font-size:11.5px;line-height:1.4;border-radius:12px;padding:8px 10px;margin:6px 0;max-width:92%}}.msg.u{{background:#ff7a3d;color:#1b1206;margin-left:auto;border-bottom-right-radius:3px}}
.msg.a{{background:#24213a;color:#ece9f8;border-bottom-left-radius:3px;min-height:16px}}.ph{{font-size:10px;color:#8f8aa8;text-align:center;margin-bottom:4px}}
.btn{{display:block;text-align:center;background:var(--g);color:#1b1206;font-family:Titulo;font-size:19px;padding:19px 18px;border-radius:16px;text-decoration:none;
box-shadow:0 10px 30px #ff7a3d66,inset 0 -3px 0 #0002;transition:transform .15s}}.btn:active{{transform:scale(.98)}}
.btn.pulse{{animation:pu 2.4s infinite}}@keyframes pu{{0%,100%{{box-shadow:0 10px 30px #ff7a3d66}}50%{{box-shadow:0 10px 46px #ff7a3daa}}}}
.mic{{text-align:center;font-size:13px;color:#b9b4d1;margin-top:12px}}.mic.cl{{color:var(--m)}}
.trust{{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 18px;margin-top:18px;font-size:13px;color:#cfcbe3}}
.ias{{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:22px}}.ias span{{border:1px solid #ffffff2a;border-radius:99px;padding:6px 14px;font-size:13px;color:#e9e6f7}}
.cmp{{display:grid;grid-template-columns:1fr 1fr;gap:10px}}.cb{{border-radius:18px;padding:16px}}.cb.n{{background:#f3f1ee}}.cb.s{{background:var(--t);color:#fff}}
.cb h3{{font-size:15px;font-family:Corpo;font-weight:800;margin-bottom:8px}}.cb ul{{margin:0;padding-left:0;list-style:none;font-size:14px}}.cb li{{padding:4px 0}}
.cb.n li::before{{content:"✕ ";color:#c0392b}}.cb.s li::before{{content:"✓ ";color:#3ddc84}}
.nms{{display:grid;gap:12px}}.nm{{display:grid;grid-template-columns:110px 1fr;gap:14px;align-items:center;background:var(--c);border-radius:20px;padding:18px}}
.nb{{font-family:Titulo;font-size:36px;background:var(--g);-webkit-background-clip:text;background-clip:text;color:transparent}}.nm b{{display:block}}.nm p{{margin:2px 0;color:var(--m);font-size:14.5px}}.nm small{{color:#a39e94;font-size:12px}}
.acs{{display:grid;gap:10px}}.ac{{display:flex;gap:14px;align-items:flex-start;border:1px solid #eee5d8;border-radius:18px;padding:14px 16px;background:#fff;position:relative;overflow:hidden}}
.ac::before{{content:"";position:absolute;left:0;top:0;bottom:0;width:5px;background:var(--c)}}.ae{{font-size:28px;width:48px;height:48px;flex:none;border-radius:14px;background:color-mix(in srgb,var(--c) 14%,white);display:grid;place-items:center}}
.ac b{{display:block;font-size:16px}}.ac p{{margin:2px 0 0;font-size:14px;color:var(--m)}}
.prev{{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:6px 2px 14px;margin:0 -22px;padding-left:22px}}.prev img{{width:68%;max-width:280px;flex:none;border-radius:14px;box-shadow:0 12px 30px #0002;scroll-snap-align:center}}
.amo{{background:var(--t);color:#fff;border-radius:22px;padding:20px}}.amo pre{{font:12px/1.5 Mono,monospace;white-space:pre-wrap;background:#ffffff0d;border:1px solid #ffffff1f;border-radius:14px;padding:14px;margin:12px 0;max-height:300px;overflow:auto}}
.cop{{display:inline-block;background:#ffffff1a;border:1px solid #ffffff33;color:#fff;border-radius:10px;padding:9px 14px;font-weight:700;cursor:pointer;font:inherit}}
.als{{display:grid;grid-template-columns:1fr 1fr;gap:10px}}.al{{background:#ffffff0a;border:1px solid #ffffff1f;border-radius:18px;padding:14px}}.al span{{font-size:24px}}.al b{{display:block;margin:6px 0 2px}}.al p{{margin:0;font-size:13.5px;color:#cfcbe3}}
.pq{{display:grid;gap:10px}}.pq div{{border-radius:18px;padding:16px}}.pq .si{{background:#eefaf2}}.pq .no{{background:#fdf0ee}}.pq ul{{margin:6px 0 0;padding-left:18px;font-size:15px}}
.dps{{display:grid;gap:12px}}.dp{{margin:0;background:var(--c);border-radius:18px;padding:18px}}.st{{color:#f5a623;letter-spacing:2px}}.dp blockquote{{margin:6px 0 10px;font-size:16px}}.dp figcaption{{font-size:14px;color:var(--m)}}
.gar{{display:grid;grid-template-columns:96px 1fr;gap:16px;align-items:center;border:2px dashed #3ddc84;border-radius:22px;padding:18px;background:#f3fcf6}}
.selo{{width:96px;height:96px;border-radius:50%;background:radial-gradient(circle,#3ddc84,#1f9e58);color:#fff;display:grid;place-items:center;text-align:center;font-family:Titulo;font-size:28px;line-height:.9;box-shadow:0 8px 20px #1f9e5855}}.selo small{{display:block;font:11px Corpo;font-weight:800}}
.oferta{{background:#fff;color:var(--t);border-radius:26px;padding:24px 20px;box-shadow:0 30px 80px #0006;position:relative}}
.oferta .tag{{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:var(--g);color:#1b1206;font-weight:800;font-size:13px;padding:6px 14px;border-radius:99px;white-space:nowrap}}
.inc{{list-style:none;padding:0;margin:8px 0 18px}}.inc li{{padding:7px 0 7px 30px;position:relative;border-bottom:1px solid #f0ebe3;font-size:15px}}.inc li::before{{content:"✓";position:absolute;left:4px;color:#1f9e58;font-weight:900}}
.pa{{text-align:center;color:var(--m)}}.pa s{{font-size:18px}}.cp{{margin-left:8px;background:#fff1e8;color:#c4521b;font-weight:800;font-size:12px;padding:3px 8px;border-radius:8px}}
.pv{{text-align:center;font-family:Titulo;font-size:64px;line-height:1;margin:6px 0}}.pv small{{font-size:24px;vertical-align:top;margin-right:4px}}.pp{{text-align:center;color:var(--m);font-size:13.5px;margin:0 0 16px}}
.cd{{display:flex;justify-content:center;gap:8px;margin:10px 0 0}}.cd div{{background:var(--t);color:#fff;border-radius:10px;padding:6px 10px;text-align:center;font-family:Titulo;font-size:20px;min-width:56px}}.cd small{{display:block;font:10px Corpo;color:#b9b4d1}}
details{{border-bottom:1px solid #eee;padding:16px 0}}summary{{font-weight:800;cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:12px}}summary::after{{content:"+";color:var(--l);font-size:22px;line-height:1}}details[open] summary::after{{content:"–"}}details p{{margin:10px 0 0;color:#4a4660}}
.sobre{{display:flex;gap:16px;align-items:center;background:var(--c);border-radius:22px;padding:18px}}.av{{width:64px;height:64px;flex:none;border-radius:18px;background:var(--g);display:grid;place-items:center;font-size:30px}}
footer{{text-align:center;font-size:12.5px;color:#8f8aa8;padding:26px 22px 110px;background:var(--t)}}
.fix{{position:fixed;left:0;right:0;bottom:0;padding:10px 14px calc(10px + env(safe-area-inset-bottom));background:#0f0d1de6;backdrop-filter:blur(10px);display:flex;gap:12px;align-items:center;transform:translateY(110%);transition:transform .3s;z-index:9}}
.fix.on{{transform:none}}.fix .fp{{color:#fff;font-family:Titulo;font-size:22px;white-space:nowrap}}.fix .fp small{{display:block;font:11px Corpo;color:#b9b4d1}}.fix .btn{{flex:1;padding:14px;font-size:16px}}
.rv{{opacity:0;transform:translateY(18px);transition:opacity .6s,transform .6s}}.rv.vi{{opacity:1;transform:none}}
@media (min-width:760px){{.acs{{grid-template-columns:1fr 1fr}}.als{{grid-template-columns:1fr 1fr 1fr}}.pq{{grid-template-columns:1fr 1fr}}.nms{{grid-template-columns:1fr}}}}
@media (prefers-reduced-motion:reduce){{*{{animation:none!important;transition:none!important}}.rv{{opacity:1;transform:none}}}}
</style></head><body>
{f'<div class="bar">🔥 Lançamento: R$ {e(K["preco_lancamento"])} com o cupom {e(K["cupom"])} <span id="cdb"></span></div>' if cupom_ok and prazo else ''}
<header class="dk hero"><div class="w">
<div class="pill"><i></i> {"🔥 À venda agora · R$ " + e(preco_final) if tem_checkout else "Para ChatGPT, Claude e Gemini · funciona no plano grátis"}</div>
<h1>Pare de explicar tudo pra IA. Tenha um <span class="gt">Super Assistente</span> que já te conhece.</h1>
<p class="sub">10 assistentes prontos para copiar e colar, que trabalham por você nas contas da casa, no cardápio, nos textos, nos estudos e no seu negócio. Configurados em 1 tarde, sem saber programar.</p>
<div class="mock" aria-hidden="true"><img class="book" src="/capas/kit-p1.jpg" alt="">
<div class="phone"><div class="ph">Seu Super Assistente</div><div class="msg u">o que eu faço pro jantar hoje?</div><div class="msg a" id="digita"></div></div></div>
<a class="btn pulse" href="{e(link)}" id="cta1">{e(cta)} →</a><p class="mic">{e(micro)}</p>
<div class="trust"><span>⚡ Acesso imediato</span><span>🛡️ 7 dias de garantia</span><span>📱 Feito para o celular</span></div></div></header>

<section class="w"><span class="k">O problema</span><h2>A IA responde igual pra todo mundo. Porque ela não sabe quem você é.</h2>
<p>Você pergunta, recebe um textão genérico, explica de novo, ajusta, desiste. A culpa não é sua: a IA começa toda conversa do zero.</p>
<div class="cmp rv"><div class="cb n"><h3>IA do jeito comum</h3><ul><li>Explica tudo de novo, toda vez</li><li>Resposta longa e genérica</li><li>Inventa quando não sabe</li><li>Você trabalha para ela</li></ul></div>
<div class="cb s"><h3>Com o Super Assistente</h3><ul><li>Já sabe sua rotina e objetivos</li><li>Resposta curta, no seu formato</li><li>Diz "não sei" e pede fonte</li><li>Ela trabalha por você</li></ul></div></div></section>

<section class="w" style="padding-top:0"><span class="k">Não é achismo</span><h2>O que os estudos mediram com quem usa IA do jeito certo</h2><div class="nms">{nums}</div>
<p class="mic cl">Resultados medidos em estudos com profissionais, não promessa de resultado individual. O ganho vem do jeito de usar, e é exatamente isso que o kit ensina.</p></section>

<section class="w" style="padding-top:0"><span class="k">O que você recebe</span><h2>10 assistentes prontos para trabalhar por você</h2><div class="acs">{cards}</div>
<a class="btn" style="margin-top:22px" href="{e(link)}">{e(cta)} →</a></section>

<section class="w" style="padding-top:0"><span class="k">Por dentro do kit</span><h2>Veja as páginas</h2>
<div class="prev"><img src="/capas/kit-p9.jpg" alt="Página do assistente Contas da casa"><img src="/capas/kit-p13.jpg" alt="Página de um assistente"><img src="/capas/kit-p19.jpg" alt="Página dos 10 comandos turbo"></div>
<p class="mic cl">Cada assistente: prompt completo, 3 pedidos prontos e um exemplo de resposta. PDF de 20 páginas.</p></section>

<div class="dk"><section class="w"><span class="k">Amostra grátis</span><h2>Teste agora um dos 10: o Detector de golpe 🛡️</h2>
<div class="amo rv"><p style="margin:0;color:#cfcbe3">Copie, cole no ChatGPT, Claude ou Gemini e mande uma mensagem suspeita que você recebeu.</p>
<pre id="amostra">{e(amostra["prompt"])}</pre><button class="cop" id="copiar">📋 Copiar o assistente</button></div>
<h2 style="margin-top:48px">As 6 alavancas que turbinam qualquer IA</h2><p style="color:#cfcbe3">O método por trás dos assistentes. Você aprende a aplicar em qualquer pedido.</p><div class="als">{alav}</div>
<a class="btn" style="margin-top:24px" href="{e(link)}">{e(cta)} →</a></section></div>

<section class="w"><span class="k">É para você?</span><h2>Para quem é (e para quem não é)</h2><div class="pq">
<div class="si rv"><b>✅ É para você se</b><ul><li>Usa IA, mas acha as respostas genéricas</li><li>Quer delegar tarefas do dia a dia</li><li>Tem pequeno negócio e responde cliente o dia todo</li><li>Estuda, trabalha e quer ganhar tempo</li></ul></div>
<div class="no rv"><b>❌ Não é para você se</b><ul><li>Procura curso de programação ou de criar IA</li><li>Espera ficar rico com IA</li><li>Não pretende usar nenhuma IA</li></ul></div></div></section>

{sec_dep}

<section class="w" style="padding-top:0"><div class="sobre rv"><div class="av">🤖</div><div><b>Feito pelo @iaem60s</b><p style="margin:4px 0 0;color:var(--m);font-size:14.5px">Todo dia a gente testa e explica em 60 segundos as ferramentas de IA que fazem trabalho por você. Este kit junta o que mais funciona no dia a dia.</p></div></div></section>

<div class="dk" id="oferta"><section class="w"><div class="oferta rv"><span class="tag">{'🔥 Preço de lançamento' if cupom_ok else '⭐ Kit completo'}</span>
<h2 style="text-align:center;font-size:26px;margin-top:10px">Super Assistente de IA</h2><ul class="inc">{''.join(f'<li>{e(x)}</li>' for x in inclui)}</ul>
{preco_html}{parc}{'<div class="cd" id="cd"></div>' if cupom_ok and prazo else ''}
<a class="btn pulse" style="margin-top:14px" href="{e(link)}">{e(cta)} →</a><p class="mic cl">{e(micro)}</p>
<p class="mic cl" style="margin-top:6px">Menos que 1 mês de assinatura de uma IA paga, e serve na versão grátis.</p></div>
<div class="gar rv" style="margin-top:26px;background:#f3fcf6;color:var(--t)"><div class="selo">7<small>DIAS</small></div><div><b>Garantia incondicional de 7 dias.</b> Use o kit. Se não gostar por qualquer motivo, peça o reembolso pela plataforma de pagamento e receba 100% de volta. O risco é todo nosso.</div></div></section></div>

<section class="w"><span class="k">Dúvidas</span><h2>Perguntas frequentes</h2>{faq_h}
<a class="btn" style="margin-top:28px" href="{e(link)}">{e(cta)} →</a><p class="mic cl">{e(micro)}</p></section>

<footer>Super Assistente de IA · @iaem60s<br>Perfil independente, sem ligação com OpenAI, Anthropic ou Google. ChatGPT, Claude e Gemini são marcas de seus donos.<br>Os estudos citados medem grupos de profissionais; resultados individuais variam.</footer>
<div class="fix" id="fix"><div class="fp"><small>{'de R$ ' + e(K['preco']) + ' por' if cupom_ok else 'kit completo'}</small>R$ {e(preco_final)}</div><a class="btn" href="{e(link)}">{e(cta)}</a></div>
<script>
const io=new IntersectionObserver(es=>es.forEach(x=>{{if(x.isIntersecting){{x.target.classList.add('vi');io.unobserve(x.target)}}}}),{{threshold:.15}});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
const fix=document.getElementById('fix'),c1=document.getElementById('cta1'),of=document.getElementById('oferta');let v1=true,vo=false;
new IntersectionObserver(([x])=>{{v1=x.isIntersecting;fix.classList.toggle('on',!v1&&!vo)}}).observe(c1);
new IntersectionObserver(([x])=>{{vo=x.isIntersecting;fix.classList.toggle('on',!v1&&!vo)}},{{threshold:.2}}).observe(of);
const txt="Pelo que você me contou: sem lactose e 20 min. Omelete de legumes com o que tem na geladeira (ovos, tomate, espinafre) + arroz de ontem. ✅";
const dg=document.getElementById('digita');let i=0;(function t(){{if(i<=txt.length){{dg.textContent=txt.slice(0,i++);setTimeout(t,28)}}else setTimeout(()=>{{i=0;t()}},4000)}})();
document.getElementById('copiar').onclick=async b=>{{const s=document.getElementById('amostra').textContent;try{{await navigator.clipboard.writeText(s)}}catch(_){{}}b.target.textContent='✔ Copiado! Cole na sua IA'}};
const prazo="{e(prazo)}";if(prazo){{const fim=new Date(prazo).getTime();const pad=n=>String(n).padStart(2,'0');(function tk(){{let r=Math.max(0,fim-Date.now());const d=Math.floor(r/864e5),h=Math.floor(r/36e5)%24,m=Math.floor(r/6e4)%60,s=Math.floor(r/1e3)%60;
const cd=document.getElementById('cd');if(cd)cd.innerHTML=[[d,'dias'],[h,'horas'],[m,'min'],[s,'seg']].map(([v,l])=>`<div>${{pad(v)}}<small>${{l}}</small></div>`).join('');
const cb=document.getElementById('cdb');if(cb)cb.textContent=r?`· termina em ${{d?d+'d ':''}}${{pad(h)}}:${{pad(m)}}:${{pad(s)}}`:'· encerrado';if(r)setTimeout(tk,1000)}})()}}
</script></body></html>"""
(IA / "painel" / "kit.html").write_text(page, encoding="utf-8")
print("painel/kit.html ok", "(com checkout)" if tem_checkout else "(sem checkout: CTA = comentar KIT)", f"{len(deps)} depoimento(s)", "contagem" if prazo else "sem contagem")

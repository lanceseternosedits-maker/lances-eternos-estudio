"""Landing do Estúdio de Reels com IA (Vitor, 09/11: "bora pra torar a landing page").

Uso (de ia/): python3 produtos/estudio-reels/landing.py  →  painel/estudio.html (Worker serve em /estudio; mídia em /estudio/<arquivo>)
Lê estudio.json (preço, checkout, âncora) e painel/resultados.json (números REAIS dos nossos Reels).
Referência de estrutura: Referência 8 em referencias_fixas.md (textos, layout e nomes nossos).
Sem checkout → modo pré-lançamento (botão leva ao Instagram, "Comenta ESTUDIO").
"""
import base64
import html
import json
from pathlib import Path

AQUI = Path(__file__).resolve().parent
IA = AQUI.parent.parent
F = IA / "video" / "cena_contagem" / "f"
FONTES = "".join(f"@font-face{{font-family:'{n}';src:url(data:font/woff2;base64,{base64.b64encode((F / a).read_bytes()).decode()}) format('woff2');font-display:swap}}"
                 for n, a in [("Titulo", "archivo-black-latin-400-normal.woff2"), ("Corpo", "inter-latin-500-normal.woff2"), ("Mono", "jetbrains-mono-latin-500-normal.woff2")])
K = json.loads((AQUI / "estudio.json").read_text(encoding="utf-8"))
R = json.loads((IA / "painel" / "resultados.json").read_text(encoding="utf-8"))
e = html.escape
br = lambda n: f"{n:,}".replace(",", ".")

tem_checkout = bool(K.get("checkout"))
link = "/comprar?o=estudio" if tem_checkout else "https://www.instagram.com/iaem60s/"
cta = f"Quero o Estúdio por R$ {K['preco']}" if tem_checkout else "Quero entrar na lista · comenta ESTUDIO"
micro = ("pagamento único · Pix ou cartão · garantia de 7 dias" if tem_checkout
         else "pré-lançamento: comente ESTUDIO em qualquer Reel do @iaem60s e receba o link primeiro")
ancora = f'<s>R$ {e(K["ancora"])}</s> ' if K.get("ancora") else ""

# ---- prova: só número real (Metricool, lido pelo analista)
T = R["totais"]
reels = sorted(R["reels"], key=lambda x: -(x.get("views") or 0))
melhor = reels[0]
fm = R.get("por_formato", [])
def med(nome):
    for v in fm:
        if nome in v["nome"]:
            return int(v.get("mediana_views") or 0)
    return 0
periodo = R["periodo"]
d = lambda s: f"{s[8:10]}/{s[5:7]}"
provas = [(br(T["views_ig"]), f"views no Instagram em {T['reels_medidos']} Reels"), (br(melhor["views"]), "views no melhor Reel"),
          (br(T["salvamentos"]), "salvamentos"), (br(T["comentarios"]), "comentários")]
prova_h = "".join(f'<div class="nm rv"><b>{n}</b><span>{e(t)}</span></div>' for n, t in provas)

ESTILOS = [("tv", "Contagem 5 → 1", "Sala de TV à noite. O formato que mais deu view no perfil."),
           ("skills", "Palco com neon", "Fundo escuro, tela grande e o mascote reagindo a cada item."),
           ("edicao", "Ilha de edição", "Claquete, tela e grade roxa. Pra falar de vídeo e criação."),
           ("windows", "Papel e termômetro", "Etiqueta de papel rasgado e medidor subindo. Pra comparar."),
           ("historia", "Linha do tempo", "Cena de época e manchete de jornal. Pra contar história."),
           ("sistema", "Sistema em peças", "Quarto, computador e cada peça virando um objeto. Pra explicar como algo funciona.")]
galeria = "".join(f'<figure class="gl rv"><video src="estudio/{k}.mp4" poster="estudio/{k}.jpg" muted loop playsinline autoplay preload="none"></video>'
                  f'<figcaption><b>{e(n)}</b><span>{e(t)}</span></figcaption></figure>' for k, n, t in ESTILOS)

DIF = [("🧑‍⚖️", "4 revisores antes de animar", "Gancho, clareza, fatos e \"a pessoa comum entende?\". Roteiro fraco volta antes de gastar seu tempo."),
       ("📏", "Checagem automática", "Fala até 3 palavras por segundo, até 35 s, nada embaixo dos botões do Reels, volume no ponto."),
       ("📈", "Formatos com número", f"Contagem 5 → 1: mediana de {br(med('contagem'))} views no nosso perfil, contra {br(med('palco'))} do mascote parado no palco."),
       ("💬", "Feito pra comentário", "\"Comenta PALAVRA\" no meio do vídeo, pedido de envio, pergunta final de 1 palavra. Legenda e 1º comentário prontos.")]
dif_h = "".join(f'<div class="df rv"><span>{i}</span><div><b>{e(t)}</b><p>{e(x)}</p></div></div>' for i, t, x in DIF)

PASSOS = [("Você pede", "uma frase basta"), ("Roteiro", "com gancho e revisão"), ("Cenas", "você aprova o storyboard"),
          ("Voz, legenda e som", "sincronizados palavra por palavra"), ("MP4 pronto", "1080×1920, checado")]
passos_h = "".join(f'<li class="rv"><i>0{n}</i><b>{e(a)}</b><span>{e(b)}</span></li>' for n, (a, b) in enumerate(PASSOS, 1))

JEITOS = [("Do zero", "Você dá o assunto", "Ele escreve, revisa, anima, narra e entrega."),
          ("Com a sua voz", "Você manda o áudio", "Cada cena cai em cima da sua fala, com legenda palavra por palavra."),
          ("Sem ideia", "Você diz o nicho", "Ele traz 3 pautas com gancho e você escolhe uma.")]
jeitos_h = "".join(f'<div class="jt rv"><small>{e(a)}</small><b>{e(b)}</b><p>{e(c)}</p></div>' for a, b, c in JEITOS)

RECEBE = [("A skill do Estúdio", "Instala no Claude Code e vira o seu estúdio: roteiro, revisão, animação 3D, voz, legenda, trilha e MP4."),
          ("6 cenários prontos", "Os mesmos que você vê nesta página, com regras de cor, luz e câmera, e um jeito novo a cada vídeo."),
          ("Seu mascote 3D", "Responda 5 perguntas e escolha entre 3 opções. Ajuste conversando; ele aparece igual em todo vídeo."),
          ("Kit de publicação", "Para cada Reel: legenda, 1º comentário fixado, palavra do \"Comenta\" e a resposta da DM."),
          ("Guia em PDF", "Da instalação ao primeiro Reel, com os pedidos que funcionam e o que fazer se travar.")]
recebe_h = "".join(f'<li class="rv"><b>{e(a)}</b><span>{e(b)}</span></li>' for a, b in RECEBE)

FAQ = [("Preciso de algum plano do Claude?", "Sim: o Estúdio roda no Claude Code, que vem no plano Claude Pro (ou acima). No plano grátis não funciona."),
       ("Precisa de computador?", "Sim, Windows ou Mac. O vídeo é montado no seu computador; o celular serve para postar."),
       ("Preciso saber programar ou editar vídeo?", "Não. Você conversa em português e aprova. O código quem escreve é a IA."),
       ("E a voz?", "Três opções: a sua própria voz (grava no celular), voz de IA do Google Gemini com a sua chave (custa cerca de US$ 0,02 por vídeo, cobrado pelo Google) ou sem voz, só legenda e trilha."),
       ("É um curso?", "Não. É uma ferramenta que faz os vídeos com você. O guia em PDF explica a instalação e como pedir."),
       ("Posso usar os vídeos para o meu negócio?", "Sim, os vídeos são seus. O motor de render (Remotion) é grátis para pessoas e empresas de até 3 pessoas; empresas maiores precisam da licença deles."),
       ("Faz vídeo horizontal?", "O padrão é vertical (Reels, TikTok, Shorts). Peça 16:9 ou 4:5 e ele refaz o layout."),
       ("Como recebo?", "Na hora, por e-mail, assim que o pagamento é aprovado (no Pix é imediato)."),
       ("E se não for pra mim?", "Você tem 7 dias de garantia: pede o reembolso pela plataforma de pagamento e recebe 100% de volta.")]
faq_h = "".join(f"<details class='rv'><summary>{e(q)}</summary><p>{e(a)}</p></details>" for q, a in FAQ)

page = f"""<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Estúdio de Reels com IA · do assunto ao Reel pronto · IA em 60s</title>
<meta name="description" content="Você dá o assunto e o Claude entrega o Reel pronto: roteiro com gancho, animação 3D, voz, legenda e MP4. O mesmo estúdio que faz os Reels do @iaem60s.">
<meta property="og:title" content="Estúdio de Reels com IA"><meta property="og:description" content="Do assunto ao Reel pronto, sem abrir editor."><meta property="og:image" content="estudio/demo.jpg">
<meta name="theme-color" content="#120f1f">{"" if tem_checkout else "<meta name=\"robots\" content=\"noindex\">"}
<style>{FONTES}
:root{{--l:#ff7a3d;--a:#ffc24a;--t:#120f1f;--t2:#1c1830;--t3:#26203f;--c:#f7f2ea;--m:#a49fbd;--g:linear-gradient(135deg,#ff7a3d,#ffc24a)}}
*{{box-sizing:border-box}}html{{scroll-behavior:smooth}}body{{margin:0;font:16.5px/1.6 Corpo,-apple-system,sans-serif;color:var(--c);background:var(--t);-webkit-font-smoothing:antialiased}}
h1,h2{{font-family:Titulo;line-height:1.04;margin:0 0 16px;letter-spacing:-.015em}}h2{{font-size:clamp(28px,7.4vw,42px)}}
.w{{max-width:720px;margin:0 auto;padding:68px 22px}}.k{{display:inline-block;font:12px Mono;letter-spacing:.14em;text-transform:uppercase;color:var(--a);margin-bottom:12px}}
.gt{{background:var(--g);-webkit-background-clip:text;background-clip:text;color:transparent}}
nav{{position:sticky;top:0;z-index:9;display:flex;justify-content:space-between;align-items:center;padding:12px 18px;background:#120f1fd9;backdrop-filter:blur(10px);border-bottom:1px solid #ffffff12}}
nav b{{font-family:Titulo;font-size:15px}}nav b i{{font-style:normal;color:var(--l)}}nav a{{font:700 13px Corpo;color:#1b1206;background:var(--g);padding:9px 14px;border-radius:99px;text-decoration:none}}
.hero{{background:radial-gradient(800px 520px at 100% 0%,#ff7a3d33,transparent 60%),radial-gradient(700px 520px at 0% 40%,#6a4cff2e,transparent 60%)}}
.hero .w{{padding-top:34px;display:grid;gap:28px}}.hero h1{{font-size:clamp(40px,11.5vw,66px)}}.hero p.sub{{font-size:19px;color:#d9d4ec;margin:0 0 22px}}
.tape{{display:inline-block;background:#f3e3c3;color:#2a1c0c;font:15px Titulo;padding:7px 14px;transform:rotate(-2deg);box-shadow:0 6px 0 #0004;margin-bottom:18px;position:relative}}
.tape:before,.tape:after{{content:"";position:absolute;top:-8px;width:46px;height:18px;background:#fff6;transform:rotate(-8deg)}}.tape:before{{left:-14px}}.tape:after{{right:-14px;transform:rotate(10deg)}}
.cel{{position:relative;width:min(300px,78vw);margin:0 auto;border:9px solid #2b2742;border-radius:38px;overflow:hidden;background:#000;box-shadow:0 40px 90px #000c,0 0 0 1px #ffffff14}}
.cel video{{display:block;width:100%;aspect-ratio:9/16;object-fit:cover}}
.som{{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);white-space:nowrap;border:0;background:#000b;color:#fff;font:700 14px Corpo;padding:10px 16px;border-radius:99px;cursor:pointer;backdrop-filter:blur(6px)}}
.cnt{{position:absolute;bottom:70px;left:50%;transform:translateX(-50%);white-space:nowrap;font:12px Mono;background:#000a;color:var(--a);padding:5px 9px;border-radius:8px}}
.btn{{display:block;text-align:center;background:var(--g);color:#1b1206;font:19px Titulo;padding:19px 18px;border-radius:18px;text-decoration:none;box-shadow:0 14px 36px #ff7a3d55;transition:transform .15s}}
.btn:active{{transform:scale(.98)}}.mi{{text-align:center;font-size:13px;color:var(--m);margin:10px 0 0}}
.ck{{list-style:none;padding:0;margin:18px 0 0;display:flex;flex-wrap:wrap;gap:8px 16px;font-size:14.5px;color:#e6e1f5}}.ck li:before{{content:"✓ ";color:#3ddc84;font-weight:800}}
.nms{{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:22px 0 10px}}.nm{{background:var(--t2);border:1px solid #ffffff14;border-radius:18px;padding:18px}}
.nm b{{display:block;font:clamp(30px,8vw,40px) Titulo;background:var(--g);-webkit-background-clip:text;background-clip:text;color:transparent}}.nm span{{font-size:14px;color:var(--m)}}
.fonte{{font:12px Mono;color:#7f7a98}}
.carta{{background:var(--c);color:#241d33}}.carta .k{{color:#c4521d}}.carta p{{font-size:18px;margin:0 0 16px}}.carta em{{font-family:Titulo;font-style:normal;color:#c4521d}}
.chat{{background:var(--t2);border:1px solid #ffffff14;border-radius:22px;padding:18px;margin:22px 0}}.chat .hd{{font:12px Mono;color:var(--m);margin-bottom:10px}}
.m{{max-width:88%;border-radius:16px;padding:11px 14px;margin:8px 0;font-size:15px;line-height:1.45}}.m.u{{margin-left:auto;background:var(--l);color:#1b1206;border-bottom-right-radius:4px}}
.m.c{{background:var(--t3);border-bottom-left-radius:4px}}.m.c code{{font:13px Mono;color:#3ddc84}}
ol.ps{{list-style:none;padding:0;margin:20px 0;display:grid;gap:10px}}ol.ps li{{display:grid;grid-template-columns:52px 1fr;grid-template-rows:auto auto;column-gap:12px;background:var(--t2);border-radius:16px;padding:14px 16px;border:1px solid #ffffff10}}
ol.ps i{{grid-row:span 2;font:22px Titulo;font-style:normal;color:var(--l);align-self:center}}ol.ps b{{font-size:17px}}ol.ps span{{font-size:14px;color:var(--m)}}
.jts{{display:grid;gap:12px}}.jt{{background:var(--t2);border-radius:18px;padding:18px;border-left:4px solid var(--l)}}.jt small{{font:12px Mono;color:var(--a);text-transform:uppercase;letter-spacing:.1em}}
.jt b{{display:block;font:20px Titulo;margin:4px 0}}.jt p{{margin:0;color:#d4cfe6;font-size:15px}}
.gls{{display:grid;grid-template-columns:1fr 1fr;gap:12px}}.gl{{margin:0;background:var(--t2);border-radius:18px;overflow:hidden;border:1px solid #ffffff12}}
.gl video{{display:block;width:100%;aspect-ratio:9/16;object-fit:cover;background:#000}}.gl figcaption{{padding:10px 12px 14px}}.gl b{{display:block;font-size:15px}}.gl span{{font-size:13px;color:var(--m);line-height:1.35;display:block}}
.dfs{{display:grid;gap:12px}}.df{{display:grid;grid-template-columns:44px 1fr;gap:12px;background:var(--t2);border-radius:18px;padding:16px;border:1px solid #ffffff12}}.df span{{font-size:30px}}.df b{{font-size:17px}}.df p{{margin:4px 0 0;color:#d4cfe6;font-size:15px}}
ul.rc{{list-style:none;padding:0;margin:18px 0;display:grid;gap:10px}}ul.rc li{{background:var(--t2);border-radius:16px;padding:14px 16px 14px 46px;position:relative;border:1px solid #ffffff10}}
ul.rc li:before{{content:"✓";position:absolute;left:16px;top:13px;width:20px;height:20px;border-radius:50%;background:#3ddc84;color:#0b2a17;font:800 13px/20px Corpo;text-align:center}}
ul.rc b{{display:block}}ul.rc span{{font-size:14.5px;color:var(--m)}}
.bonus{{background:linear-gradient(135deg,#3b2a12,#24183a);border:1px dashed var(--a);border-radius:18px;padding:18px;margin-top:14px}}.bonus b{{color:var(--a)}}
.pq{{display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:15px}}.pq div{{background:var(--t2);border-radius:16px;padding:16px}}.pq h3{{font:17px Titulo;margin:0 0 8px}}.pq p{{margin:6px 0;color:#d4cfe6}}
.preco{{text-align:center;background:var(--t2);border:1px solid #ff7a3d55;border-radius:26px;padding:30px 20px;box-shadow:0 30px 80px #ff7a3d22}}
.preco s{{color:var(--m);font-size:20px}}.pv{{font:clamp(64px,18vw,88px)/1 Titulo;margin:6px 0}}.pv small{{font-size:.38em;vertical-align:.9em;margin-right:4px}}
.req{{display:inline-block;margin:12px 0 18px;font-size:13.5px;color:#ffd8a8;background:#ff7a3d1f;border:1px solid #ff7a3d55;border-radius:99px;padding:6px 12px}}
.gar{{display:grid;grid-template-columns:92px 1fr;gap:16px;align-items:center;margin-top:24px}}.selo{{width:92px;height:92px;border-radius:50%;border:3px solid #3ddc84;display:grid;place-items:center;text-align:center;font:30px/1 Titulo;color:#3ddc84}}.selo small{{display:block;font:10px Mono;letter-spacing:.12em}}
details{{background:var(--t2);border-radius:14px;margin:8px 0;padding:4px 16px;border:1px solid #ffffff10}}summary{{cursor:pointer;font-weight:700;padding:12px 0;list-style:none}}summary:after{{content:"+";float:right;color:var(--l);font-size:20px}}details[open] summary:after{{content:"–"}}details p{{margin:0 0 14px;color:#d4cfe6}}
.ps2{{background:var(--c);color:#241d33;border-radius:20px;padding:20px;margin-top:22px;font-size:16px}}.ps2 b{{font-family:Titulo}}
footer{{text-align:center;font-size:12.5px;color:#7f7a98;padding:30px 22px 110px}}footer a{{color:#a9a3c7}}
.fix{{position:fixed;left:12px;right:12px;bottom:12px;z-index:10;transform:translateY(140%);transition:transform .35s}}.fix.on{{transform:none}}.fix .btn{{font-size:17px;padding:16px}}
.rv{{opacity:0;transform:translateY(18px);transition:opacity .6s,transform .6s cubic-bezier(.2,.8,.2,1)}}.rv.in{{opacity:1;transform:none}}
@media(min-width:900px){{.hero .w{{max-width:1080px;grid-template-columns:1.15fr .85fr;align-items:center}}.gls{{grid-template-columns:repeat(3,1fr)}}.dfs,.jts{{grid-template-columns:1fr 1fr}}.fix{{display:none}}}}
@media(prefers-reduced-motion:reduce){{.rv{{opacity:1;transform:none}}}}
</style></head><body>
<nav><b>Estúdio de Reels <i>·</i> IA em 60s</b><a href="{e(link)}">{"Quero" if tem_checkout else "Lista"}</a></nav>
<header class="hero"><div class="w">
 <div><span class="tape">FEITO PELO @IAEM60S</span>
  <h1>Você dá o assunto. <span class="gt">Ele entrega o Reel pronto.</span></h1>
  <p class="sub">Roteiro com gancho, animação 3D, voz, legenda palavra por palavra e MP4 no tamanho do Reels e do TikTok. Sem abrir editor, sem aprender After Effects.</p>
  <a class="btn" href="{e(link)}">{e(cta)} →</a><p class="mi">{e(micro)}</p>
  <ul class="ck"><li>6 cenários prontos</li><li>4 revisores no roteiro</li><li>você só aprova</li></ul></div>
 <div class="cel"><span class="cnt">{br(melhor["views"])} views ▶</span><video id="demo" src="estudio/demo.mp4" poster="estudio/demo.jpg" muted loop playsinline autoplay preload="metadata"></video>
  <button class="som" id="som">🔊 toque pra ouvir</button></div>
</div></header>

<section class="w"><span class="k">prova, sem enfeite</span><h2>Um perfil novo. <span class="gt">{br(T["views_ig"])} views</span> em 2 semanas.</h2>
<p>Todo Reel do @iaem60s sai deste estúdio. Esses são os números do Instagram de {d(periodo[0])} a {d(periodo[1])}, sem anúncio pago:</p>
<div class="nms">{prova_h}</div><p class="fonte">fonte: Instagram @iaem60s via Metricool · {T["reels_medidos"]} Reels medidos · números de um perfil que começou do zero, não promessa de resultado</p></section>

<section class="carta"><div class="w"><span class="k">pra quem posta (ou queria postar) todo dia</span><h2>O problema nunca foi ideia. <em>É a edição.</em></h2>
<p>Você sabe sobre o que falar. Mas um Reel animado bom leva uma tarde: roteiro, cena, legenda, som, exportar, ver que o texto ficou embaixo dos botões, exportar de novo.</p>
<p>Aí você posta menos. E quem posta todo dia leva a atenção que podia ser sua.</p>
<p>Contratar motion designer custa caro <em>por vídeo</em>. Template pronto tem cara de template. Aprender After Effects leva meses.</p>
<p>A gente resolveu isso pra gente primeiro: montamos um estúdio dentro do Claude que escreve, revisa, anima e entrega <b>os Reels do @iaem60s</b>. O Estúdio de Reels é esse mesmo estúdio, pronto pra você instalar.</p></div></section>

<section class="w"><span class="k">como funciona</span><h2>Você pede. <span class="gt">Ele faz o resto.</span></h2>
<div class="chat rv"><div class="hd">claude code · estúdio de reels</div>
<div class="m u">faz um Reel de 30 s: 5 programas caros que têm versão grátis</div>
<div class="m c">Roteiro pronto. Gancho: "Você paga por 5 programas que têm versão grátis, e a nº 1 é bizarra". Os 4 revisores aprovaram; o de clareza trocou 1 frase longa. Olha as 7 cenas 👇</div>
<div class="m u">aprovado, só troca a sala por uma biblioteca</div>
<div class="m c">Feito. Narrando, legendando e renderizando… <code>✓ reel.mp4 · 31 s · 1080×1920</code><br><code>✓ fala 2,8 palavras/s · área segura · volume</code></div></div>
<ol class="ps">{passos_h}</ol>
<p>Você aprova <b>duas vezes</b>: o roteiro e o vídeo. O resto é com ele.</p></section>

<section class="w" style="padding-top:0"><span class="k">3 jeitos de usar</span><h2>Do zero, <span class="gt">com a sua voz</span> ou sem ideia nenhuma.</h2><div class="jts">{jeitos_h}</div></section>

<section class="w"><span class="k">cenários</span><h2>Um cenário pra <span class="gt">cada assunto.</span></h2><p>Todos saíram do estúdio e foram ao ar no @iaem60s. E nenhum vídeo repete a combinação de cenário, cor e câmera do anterior.</p><div class="gls">{galeria}</div></section>

<section class="w"><span class="k">o que ninguém mais faz</span><h2>Não é só animar. <span class="gt">É acertar antes.</span></h2><div class="dfs">{dif_h}</div></section>

<section class="w"><span class="k">o que você recebe</span><h2>Seu estúdio de Reels, <span class="gt">hoje.</span></h2><ul class="rc">{recebe_h}</ul>
<div class="bonus rv"><b>🎁 Bônus no 8º dia:</b> os roteiros dos Reels do @iaem60s que mais deram view, com o porquê de cada gancho, prontos pra você adaptar.</div></section>

<section class="w" style="padding-top:0"><div class="pq"><div class="rv"><h3>É pra você se…</h3><p>✓ você quer postar todo dia sem passar a tarde editando</p><p>✓ tem perfil, negócio ou marca pessoal</p><p>✓ já usa (ou topa assinar) o Claude Pro</p></div>
<div class="rv"><h3>Não é pra você se…</h3><p>✗ você só tem celular, sem computador</p><p>✗ procura vídeo com gente real filmada</p><p>✗ quer promessa de ficar rico</p></div></div></section>

<section class="w" id="preco"><div class="preco rv"><span class="k">pagamento único</span><div>{ancora}</div><div class="pv"><small>R$</small>{e(K["preco"])}</div>
<span class="req">⚠️ Requisito: Claude Pro (ou acima) + computador Windows ou Mac</span>
<a class="btn" href="{e(link)}">{e(cta)} →</a><p class="mi">{e(micro)}</p></div>
<div class="gar rv"><div class="selo">7<small>DIAS</small></div><div><b>Garantia de 7 dias.</b> Instale, faça seus Reels. Se não for pra você, peça o reembolso em até 7 dias e recebe 100% de volta.</div></div></section>

<section class="w"><span class="k">dúvidas</span><h2>Perguntas <span class="gt">frequentes.</span></h2>{faq_h}
<div class="ps2 rv"><b>P.S.</b> Um único Reel animado encomendado costuma custar mais do que isso. Aqui você leva o estúdio inteiro e faz quantos quiser. E se não for pra você, tem 7 dias pra pedir o dinheiro de volta.</div>
<p style="margin-top:22px"><a class="btn" href="{e(link)}">{e(cta)} →</a></p></section>

<footer>Estúdio de Reels com IA · feito pelo <a href="https://www.instagram.com/iaem60s/">@iaem60s</a><br>Claude e Claude Code são produtos da Anthropic. Este estúdio é independente e não tem ligação com a Anthropic.</footer>
<div class="fix" id="fix"><a class="btn" href="{e(link)}">{e(cta)} →</a></div>
<script>
const io=new IntersectionObserver(es=>es.forEach(x=>{{if(x.isIntersecting){{x.target.classList.add('in');io.unobserve(x.target)}}}}),{{threshold:.12}});document.querySelectorAll('.rv').forEach(el=>io.observe(el));
const v=document.getElementById('demo'),s=document.getElementById('som');s.onclick=()=>{{v.muted=!v.muted;if(!v.muted){{v.currentTime=0;v.play()}}s.textContent=v.muted?'🔊 toque pra ouvir':'🔇 tirar o som'}};
const fx=document.getElementById('fix'),pr=document.getElementById('preco');addEventListener('scroll',()=>{{const r=pr.getBoundingClientRect();fx.classList.toggle('on',scrollY>600&&!(r.top<innerHeight&&r.bottom>0))}},{{passive:true}});
document.querySelectorAll('.gl video').forEach(x=>new IntersectionObserver(es=>es.forEach(y=>y.isIntersecting?x.play().catch(()=>{{}}):x.pause())).observe(x));
</script></body></html>"""
(IA / "painel" / "estudio.html").write_text(page, encoding="utf-8")
print("ok painel/estudio.html", len(page) // 1024, "KB")

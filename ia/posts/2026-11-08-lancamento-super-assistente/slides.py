"""Carrossel de lançamento do Super Assistente de IA (1080×1350). Gera slide-1..6.png a partir de conteudo.py."""
import base64, html, subprocess, sys
from pathlib import Path
AQUI = Path(__file__).resolve().parent; IA = AQUI.parent.parent
sys.path.insert(0, str(IA / "produtos" / "assistente-pessoal")); import conteudo as C
F = IA / "video" / "cena_contagem" / "f"
def f64(a): return base64.b64encode((F / a).read_bytes()).decode()
capa = base64.b64encode((IA / "painel" / "capas" / "kit-p1.jpg").read_bytes()).decode()
e = html.escape
css = f"""@font-face{{font-family:T;src:url(data:font/woff2;base64,{f64('archivo-black-latin-400-normal.woff2')})}}
@font-face{{font-family:B;src:url(data:font/woff2;base64,{f64('inter-latin-500-normal.woff2')})}}
@font-face{{font-family:M;src:url(data:font/woff2;base64,{f64('jetbrains-mono-latin-500-normal.woff2')})}}
*{{box-sizing:border-box;margin:0}}body{{width:1080px;height:1350px;overflow:hidden;font-family:B;color:#fff;
background:radial-gradient(900px 600px at 95% 0,#ff7a3d55,transparent 60%),radial-gradient(800px 600px at 0 100%,#6a4cff33,transparent 60%),#0f0d1d;padding:90px 80px;position:relative}}
h1,h2{{font-family:T;line-height:1.02;letter-spacing:-.01em}}h1{{font-size:96px}}h2{{font-size:70px;margin-bottom:34px}}
.g{{background:linear-gradient(135deg,#ff7a3d,#ffb347);-webkit-background-clip:text;color:transparent}}
.k{{font-size:28px;letter-spacing:.16em;text-transform:uppercase;color:#ff7a3d;font-weight:800;margin-bottom:24px}}
.p{{font-size:36px;line-height:1.4;color:#d8d4ec}}.pag{{position:absolute;right:80px;bottom:60px;font-size:26px;color:#8f8aa8}}
.marca{{position:absolute;left:80px;bottom:60px;font-size:26px;color:#8f8aa8}}
.card{{background:#ffffff10;border:2px solid #ffffff22;border-radius:32px;padding:30px 34px}}"""
def pag(i, corpo): return f"<html><head><meta charset=utf-8><style>{css}</style></head><body>{corpo}<div class=marca>@iaem60s</div><div class=pag>{i}/6</div></body></html>"
S = []
S.append(pag(1, f"""<div class=k>Lançamento</div><h1>Pare de explicar tudo pra IA.</h1>
<p class=p style="margin-top:30px;font-size:40px">Tenha um <b class=g style="font-family:T">Super Assistente</b> que já te conhece.</p>
<img src="data:image/jpeg;base64,{capa}" style="position:absolute;right:90px;bottom:150px;width:430px;border-radius:18px;transform:rotate(-5deg);box-shadow:0 40px 90px #000c">
<div style="position:absolute;left:80px;bottom:190px;font-size:34px;color:#fff;font-weight:800">arrasta ➜</div>"""))
S.append(pag(2, """<div class=k>O problema</div><h2>A IA responde igual pra todo mundo.</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:20px">
<div class=card style="background:#ffffff08"><p style="font-size:32px;font-weight:800;margin-bottom:20px">IA comum</p><p class=p style="font-size:30px">✕ explica tudo toda vez<br>✕ resposta genérica<br>✕ inventa quando não sabe</p></div>
<div class=card style="border-color:#ff7a3d"><p style="font-size:32px;font-weight:800;margin-bottom:20px">Super Assistente</p><p class=p style="font-size:30px;color:#fff">✓ já sabe sua rotina<br>✓ curta e no seu formato<br>✓ diz "não sei" e pede fonte</p></div></div>
<p class=p style="margin-top:50px">Porque ela não sabe quem você é. <b style="color:#fff">Dá pra resolver em 1 tarde.</b></p>"""))
grid = "".join(f'<div class=card style="padding:22px;text-align:center;border-top:6px solid {a["cor"]}"><div style="font-size:58px">{a["emoji"]}</div><div style="font-size:24px;font-weight:800;margin-top:8px">{e(a["nome"])}</div></div>' for a in C.ASSISTENTES)
S.append(pag(3, f"""<div class=k>O que vem no kit</div><h2>10 assistentes <span class=g>prontos</span></h2>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px">{grid}</div>
<p class=p style="margin-top:28px;font-size:30px">Copia, cola no ChatGPT, Claude ou Gemini e pronto. Funciona no plano grátis.</p>"""))
nums = "".join(f'<div class=card style="display:flex;gap:30px;align-items:center;margin-bottom:22px"><div class=g style="font-family:T;font-size:84px;min-width:250px">{e(n)}</div><div><div style="font-size:34px;font-weight:800">{e(r)}</div><div style="font-size:24px;color:#b9b4d1;margin-top:6px">{e(d[d.rfind("(")+1:-1])}</div></div></div>' for n, r, d, f in C.NUMEROS)
S.append(pag(4, f"""<div class=k>Não é achismo</div><h2>O que os estudos mediram</h2>{nums}
<p class=p style="font-size:26px;color:#9a96b0">Estudos com profissionais usando IA do jeito certo. Não é promessa individual: é o método que o kit ensina.</p>"""))
S.append(pag(5, """<div class=k>Por dentro</div><h2>As 6 alavancas + 10 comandos turbo</h2>
<div class=card style="font-family:M;font-size:30px;line-height:1.55;color:#ffe2d2;background:#00000055">
"Pense passo a passo antes<br>de responder."</div>
<p class=p style="margin-top:26px">Só essa frase levou o acerto da IA de <b class=g style="font-family:T;font-size:48px">17,7%</b> para <b class=g style="font-family:T;font-size:48px">78,7%</b> num teste de lógica.</p>
<p class=p style="margin-top:22px;font-size:30px;color:#9a96b0">(Kojima et al., NeurIPS 2022) · No kit: as 6 que mais melhoram qualquer resposta.</p>"""))
S.append(pag(6, """<div class=k>Super Assistente de IA</div><h2 style="font-size:80px">Por <span class=g>R$ 17</span>.</h2>
<p class=p>PDF de 20 páginas pra ler no celular · pagamento único · garantia de 7 dias.</p>
<div style="margin-top:70px;background:linear-gradient(135deg,#ff7a3d,#ffb347);border-radius:36px;padding:46px;color:#1b1206;text-align:center">
<div style="font-family:T;font-size:64px;line-height:1.05">💬 Comenta KIT</div><div style="font-size:34px;font-weight:800;margin-top:14px">que eu te mando o link na DM</div></div>
<p class=p style="margin-top:40px;text-align:center">ou toca no link da bio 🔗</p>"""))
for i, h in enumerate(S, 1): (AQUI / f"slide-{i}.html").write_text(h, encoding="utf-8")
js = f"""const {{chromium}}=require('playwright');(async()=>{{const b=await chromium.launch();const p=await b.newPage({{viewport:{{width:1080,height:1350}}}});
for(let i=1;i<=6;i++){{await p.goto('file://{AQUI}/slide-'+i+'.html');await p.waitForTimeout(300);await p.screenshot({{path:'{AQUI}/slide-'+i+'.png'}});}}await b.close();}})();"""
subprocess.run(["node", "-e", js], check=True); print("6 slides ok")

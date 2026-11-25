"""Story de divulgação de cada post (Vitor, 08/11: "jogue todos os nossos posts nos stories todo dia").

Uso (de ia/): python3 stories.py <pasta> [<pasta> ...]  → grava posts/<pasta>/story.jpg (1080×1920)
A API não tem "compartilhar post no story" nem sticker de link: o story é a capa do post com
"🆕 POST NOVO" e "Comenta PALAVRA no post". Agendar como STORY no Metricool 15 min depois do post.
"""
import base64, json, subprocess, sys
from pathlib import Path
IA = Path(__file__).resolve().parent
F = IA / "video" / "cena_contagem" / "f"
b64 = lambda p: base64.b64encode(Path(p).read_bytes()).decode()
fonte = f"@font-face{{font-family:T;src:url(data:font/woff2;base64,{b64(F / 'archivo-black-latin-400-normal.woff2')})}}"
for pasta in sys.argv[1:]:
    d = IA / "posts" / pasta
    m = json.loads((d / "meta.json").read_text(encoding="utf-8"))
    palavra = (m.get("cta") or "").upper()
    capa = d / "capa_instagram.jpg"
    if capa.exists():
        # recorte 3:4 da capa (y 240–1680) num cartão central, para a faixa de baixo não cobrir o título
        img = (f'<div style="position:absolute;left:120px;top:290px;width:840px;height:1120px;border-radius:40px;overflow:hidden;box-shadow:0 40px 100px #000c">'
               f'<img src="data:image/jpeg;base64,{b64(capa)}" style="position:absolute;left:0;top:-186.7px;width:840px;height:1493.3px"></div>')
    else:  # carrossel: 1º slide no centro
        img = (f'<img src="data:image/png;base64,{b64(d / "slide-1.png")}" style="position:absolute;left:120px;top:330px;width:840px;border-radius:36px;'
               f'box-shadow:0 40px 100px #000c">')
    html = f"""<html><head><meta charset=utf-8><style>{fonte}*{{margin:0}}body{{width:1080px;height:1920px;position:relative;overflow:hidden;
background:radial-gradient(900px 700px at 90% 0,#ff7a3d66,transparent 60%),#0f0d1d;font-family:T;color:#fff}}
.top{{position:absolute;top:150px;left:50%;transform:translateX(-50%);background:#ff3d3d;padding:22px 44px;border-radius:99px;font-size:46px;white-space:nowrap;box-shadow:0 14px 40px #0008}}
.bot{{position:absolute;bottom:250px;left:70px;right:70px;background:linear-gradient(135deg,#ff7a3d,#ffb347);color:#1b1206;border-radius:40px;padding:38px 30px;text-align:center;font-size:56px;line-height:1.1;box-shadow:0 20px 50px #0009}}
.bot small{{display:block;font-size:34px;margin-top:10px}}</style></head><body>{img}
<div class=top>🆕 POST NOVO NO PERFIL</div><div class=bot>💬 Comenta {palavra}<small>no post que eu te mando na DM</small></div></body></html>"""
    tmp = d / "_story.html"; tmp.write_text(html, encoding="utf-8")
    js = f"const {{chromium}}=require('playwright');(async()=>{{const b=await chromium.launch();const p=await b.newPage({{viewport:{{width:1080,height:1920}}}});await p.goto('file://{tmp}');await p.waitForTimeout(300);await p.screenshot({{path:'{d}/story.jpg',type:'jpeg',quality:88}});await b.close()}})();"
    subprocess.run(["node", "-e", js], check=True); tmp.unlink()
    print(pasta, palavra, "ok")

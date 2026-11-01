# Grafo de conteúdo do IA em 60s: liga cada post a pilar, temas, empresas, fontes, paleta, horário e rede,
# e (quando metricas.json tiver dados) mede o que rende. Uso: python3 grafo.py  ->  grafo/graph.json, grafo/grafo.html, grafo/GRAFO.md
import json, glob, os, datetime, collections
import networkx as nx

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "grafo"); os.makedirs(OUT, exist_ok=True)
met = json.load(open(os.path.join(BASE, "metricas.json"))).get("posts", {})
PILARES = ["novidade", "tutorial", "recomendacao", "em_alta"]   # o plano diário do AGENTE.md

def score(m):
    """Engajamento ponderado por rede (salvar e compartilhar valem mais que curtir). None se não houver dado."""
    if not m: return None
    tot = 0.0; ok = False
    for rede, d in m.items():
        if not isinstance(d, dict): continue
        ok = True
        tot += d.get("salvamentos", 0) * 3 + d.get("compartilhamentos", 0) * 3 + d.get("comentarios", 0) * 2 + d.get("curtidas", 0)
    return tot if ok else None

G = nx.Graph()
posts = []
for f in sorted(glob.glob(os.path.join(BASE, "posts", "*", "meta.json"))):
    pid = os.path.basename(os.path.dirname(f)); m = json.load(open(f))
    s = score(met.get(pid)); m["id"] = pid; m["score"] = s; posts.append(m)
    G.add_node(pid, tipo="post", label=pid[11:], data=m.get("data"), score=s)
    links = [("pilar", m.get("pilar")), ("formato", m.get("formato")), ("paleta", f"paleta {m.get('paleta')}"), ("cta", m.get("cta"))]
    links += [("tema", t) for t in m.get("temas", [])] + [("empresa", e) for e in m.get("empresas", [])] + [("fonte", x) for x in m.get("fontes", [])]
    links += [("rede", r) for r in m.get("horarios", {})] + [("horario", h[:2] + "h") for h in m.get("horarios", {}).values()]
    for tipo, v in links:
        if not v: continue
        n = f"{tipo}:{v}"; G.add_node(n, tipo=tipo, label=str(v)); G.add_edge(pid, n)

# ---------- agregados ----------
def agg(tipo):
    rows = []
    for n, d in G.nodes(data=True):
        if d["tipo"] != tipo: continue
        ps = [p for p in G.neighbors(n)]; sc = [G.nodes[p]["score"] for p in ps if G.nodes[p]["score"] is not None]
        rows.append((d["label"], len(ps), (sum(sc) / len(sc)) if sc else None))
    return sorted(rows, key=lambda r: (-(r[2] or -1), -r[1]))
hoje = max([p["data"] for p in posts] or [datetime.date.today().isoformat()])
d7 = (datetime.date.fromisoformat(hoje) - datetime.timedelta(days=6)).isoformat()
rec = [p for p in posts if p["data"] >= d7]
cont = lambda key: collections.Counter(x for p in rec for x in (p.get(key) or []))
tem_metricas = any(p["score"] is not None for p in posts)

L = [f"# Grafo de conteúdo do IA em 60s", f"Gerado em {datetime.datetime.now():%Y-%m-%d %H:%M} · {len(posts)} posts · {G.number_of_nodes()} nós · {G.number_of_edges()} ligações", ""]
L += ["## Use antes de criar", ""]
sat_t = [t for t, c in cont("temas").most_common() if c >= 3]; sat_e = [e for e, c in cont("empresas").most_common() if c >= 3]
L += [f"- **Temas saturados (3+ posts em 7 dias, evite):** {', '.join(sat_t) or 'nenhum'}",
      f"- **Empresas saturadas (3+ posts em 7 dias, evite):** {', '.join(sat_e) or 'nenhuma'}"]
pc = collections.Counter(p.get("pilar") for p in rec)
falta = [p for p in PILARES if pc[p] == 0]
L += [f"- **Pilares sem post nos últimos 7 dias (prioridade):** {', '.join(falta) or 'nenhum'}",
      f"- **Posts por pilar (7 dias):** " + ", ".join(f"{k} {v}" for k, v in pc.most_common()), ""]
L += ["## O que vem funcionando", ""]
if not tem_metricas:
    L += ["Ainda sem métricas em `metricas.json`. O analista semanal preenche; até lá, o grafo só mostra cobertura.", ""]
else:
    for tipo, nome in [("pilar", "Pilar"), ("tema", "Tema"), ("empresa", "Empresa"), ("paleta", "Paleta"), ("horario", "Horário"), ("rede", "Rede"), ("formato", "Formato")]:
        L += [f"### {nome}", "| " + nome + " | posts | engajamento médio |", "|---|---|---|"]
        L += [f"| {a} | {b} | {c:.0f} |" if c is not None else f"| {a} | {b} | sem dado |" for a, b, c in agg(tipo)[:8]] + [""]
    top = sorted([p for p in posts if p["score"] is not None], key=lambda p: -p["score"])
    L += ["### Melhores posts", ""] + [f"- {p['id']} ({p['pilar']}): {p['score']:.0f}" for p in top[:5]] + [""]
L += ["## Cobertura geral", "", "| Tema | posts |", "|---|---|"] + [f"| {a} | {b} |" for a, b, _ in sorted(agg("tema"), key=lambda r: -r[1])[:15]]
L += ["", "Engajamento = salvamentos×3 + compartilhamentos×3 + comentários×2 + curtidas, somado nas redes."]
open(os.path.join(OUT, "GRAFO.md"), "w").write("\n".join(L) + "\n")

# ---------- json + html interativo (sem dependências externas) ----------
data = {"nodes": [{"id": n, **d} for n, d in G.nodes(data=True)], "links": [{"source": a, "target": b} for a, b in G.edges()]}
json.dump(data, open(os.path.join(OUT, "graph.json"), "w"), ensure_ascii=False, indent=1)
HTML = """<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Grafo de conteúdo · IA em 60s</title>
<style>body{margin:0;background:#0B0820;color:#F5F3FF;font:14px Inter,system-ui,sans-serif;overflow:hidden}
#info{position:fixed;left:16px;top:14px;max-width:340px}#info h1{font-size:18px;margin:0 0 6px}#info p{margin:2px 0;color:#B9B3D9}
#leg span{display:inline-block;margin:4px 10px 0 0}#leg i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px}
#tip{position:fixed;pointer-events:none;background:#130F2E;border:1px solid #2a2350;padding:8px 10px;border-radius:8px;display:none;max-width:280px}</style></head>
<body><div id="info"><h1>Grafo de conteúdo · IA em 60s</h1><p>Posts (brancos) ligados ao que usam. Passe o mouse num nó; clique para destacar as ligações; arraste para mover.</p><div id="leg"></div></div>
<div id="tip"></div><canvas id="c"></canvas><script>
const D=__DATA__;const C={post:'#F5F3FF',pilar:'#FF4FD8',tema:'#5CE1FF',empresa:'#C8FF2E',fonte:'#6B6590',paleta:'#FFB13B',rede:'#3D7BFF',horario:'#B26BFF',formato:'#FF3D8B',cta:'#2EE6FF'};
const cv=document.getElementById('c'),x=cv.getContext('2d');let W,H;const rs=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};rs();onresize=rs;
const N=D.nodes,id={};N.forEach((n,i)=>{id[n.id]=n;let a=i*2.4;n.x=W/2+Math.cos(a)*(150+i*2);n.y=H/2+Math.sin(a)*(150+i*2);n.vx=0;n.vy=0;n.deg=0});
const L=D.links.map(l=>({s:id[l.source],t:id[l.target]}));L.forEach(l=>{l.s.deg++;l.t.deg++});
N.forEach(n=>n.r=n.tipo==='post'?7+(n.score?Math.min(10,Math.log10(n.score+1)*3):0):3+Math.min(9,n.deg*1.4));
document.getElementById('leg').innerHTML=Object.entries(C).map(([k,v])=>`<span><i style="background:${v}"></i>${k}</span>`).join('');
let sel=null,drag=null;function step(){for(const a of N){for(const b of N){if(a===b)continue;let dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy+.01;if(d2<90000){let f=900/d2;a.vx+=dx*f*.05;a.vy+=dy*f*.05}}a.vx+=(W/2-a.x)*.0009;a.vy+=(H/2-a.y)*.0009}
for(const l of L){let dx=l.t.x-l.s.x,dy=l.t.y-l.s.y,d=Math.hypot(dx,dy)||1,f=(d-70)*.006;l.s.vx+=dx/d*f*d*.05;l.s.vy+=dy/d*f*d*.05;l.t.vx-=dx/d*f*d*.05;l.t.vy-=dy/d*f*d*.05}
for(const n of N){if(n===drag)continue;n.vx*=.82;n.vy*=.82;n.x+=n.vx;n.y+=n.vy}}
const near=n=>sel&&(n===sel||L.some(l=>(l.s===sel&&l.t===n)||(l.t===sel&&l.s===n)));
function draw(){step();x.clearRect(0,0,W,H);for(const l of L){x.globalAlpha=sel?(l.s===sel||l.t===sel?.9:.06):.25;x.strokeStyle='#8a83c0';x.beginPath();x.moveTo(l.s.x,l.s.y);x.lineTo(l.t.x,l.t.y);x.stroke()}
for(const n of N){x.globalAlpha=sel&&!near(n)?.15:1;x.fillStyle=C[n.tipo]||'#888';x.beginPath();x.arc(n.x,n.y,n.r,0,7);x.fill();if(n.tipo!=='fonte'&&(n.deg>2||n.tipo==='post'||near(n))){x.fillStyle='#F5F3FF';x.font=(n.tipo==='post'?'600 12px':'11px')+' Inter,sans-serif';x.fillText(n.label,n.x+n.r+3,n.y+4)}}requestAnimationFrame(draw)}draw();
const at=e=>N.find(n=>Math.hypot(n.x-e.clientX,n.y-e.clientY)<n.r+3);const tip=document.getElementById('tip');
cv.onmousemove=e=>{if(drag){drag.x=e.clientX;drag.y=e.clientY}const n=at(e);if(n){tip.style.display='block';tip.style.left=e.clientX+14+'px';tip.style.top=e.clientY+10+'px';tip.innerHTML=`<b>${n.label}</b><br>${n.tipo}${n.tipo==='post'?'<br>data: '+n.data+'<br>engajamento: '+(n.score??'sem dado'):'<br>'+n.deg+' posts'}`}else tip.style.display='none'};
cv.onmousedown=e=>{drag=at(e)};cv.onmouseup=e=>{const n=at(e);if(n&&drag===n)sel=sel===n?null:n;drag=null};
</script></body></html>"""
open(os.path.join(OUT, "grafo.html"), "w").write(HTML.replace("__DATA__", json.dumps(data, ensure_ascii=False)))
print("ok", len(posts), "posts,", G.number_of_nodes(), "nós,", G.number_of_edges(), "ligações")

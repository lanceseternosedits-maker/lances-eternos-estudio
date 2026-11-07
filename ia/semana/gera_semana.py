"""Gera os 56 roteiros da semana a partir de dados_09_15.py.
Uso: python3 semana/gera_semana.py  (de dentro de ia/)"""
import json, os, sys, datetime, itertools
sys.path.insert(0, os.path.dirname(__file__))
from dados_09_15 import DIAS, V
EST = json.load(open(os.path.join(os.path.dirname(__file__), "estrelas_07_11.json")))
HOJE = datetime.date(2026, 11, 7)

OP = {  # opções não "gastas" (a fica de fora até o fim de novembro; câmera b vetada)
 "etiqueta": ["b) papel rasgado com fita","c) letreiro neon","d) faixa diagonal de aviso","e) tela de terminal","f) página de caderno","g) placa de rua/aeroporto"],
 "nome": ["b) carimbo","c) máquina de escrever","d) split-flap","e) letras caindo e encaixando","f) escrito à mão"],
 "contador": ["b) odômetro","c) velocímetro","d) pote de estrelas","e) placar HI-SCORE","f) termômetro"],
 "legenda": ["b) palavra gigante com pop","c) karaokê com marca-texto","d) balão de fala do mascote","e) tarja de TV"],
 "transicao": ["b) whip pan","c) íris","d) virada de página","e) glitch RGB","f) zoom atravessando tela"],
 "camera": ["c) travelling lateral","d) órbita","e) câmera na mão","f) plongée/contra-plongée"],
 "fechamento": ["b) pódio","c) post-its na parede","d) tela CONTINUE?","e) página de caderno","f) cartões que viram"],
 "tipografia": ["b) Archivo Black","c) Fraunces","d) Press Start 2P (só enfeite) + Space Grotesk","e) Caveat + Space Grotesk","f) Bebas Neue"],
 "som": ["trilha 01 + efeitos de papel","trilha 02 + efeitos de máquina","trilha 03 + efeitos arcade","trilha 01 + efeitos de natureza","trilha 02 + efeitos de oficina","trilha 03 + efeitos de cidade"],
}
ACAO = ["digitar","ler","dançar","se esconder","correr","pilotar","pintar","cozinhar","regar","pescar","consertar","fotografar","patinar","malabarismo","escalar","surfar","tocar bateria","varrer","empacotar","soldar","costurar","jogar dardos","andar de skate","fazer mágica","remar","plantar","carimbar","martelar","medir","peneirar"]
def elementos(i, v):
    e = {k: OP[k][(i * (j + 1) + j) % len(OP[k])] for j, k in enumerate(OP)}
    e["mascote"] = "acessório e ação do conceito; ação principal: " + ACAO[i % len(ACAO)]
    return e

UN = "zero um dois três quatro cinco seis sete oito nove dez onze doze treze catorze quinze dezesseis dezessete dezoito dezenove".split()
DZ = {20:"vinte",30:"trinta",40:"quarenta",50:"cinquenta",60:"sessenta",70:"setenta",80:"oitenta",90:"noventa"}
def ext(n):
    if n < 20: return UN[n]
    d, u = n // 10 * 10, n % 10
    return DZ[d] + ("" if u == 0 else " e " + UN[u])
def mil(n):
    k = round(n / 1000)
    return f"+{k} MIL" if k >= 1 else f"+{n}"
def semanas(datas):
    dias = (HOJE - min(datas)).days
    return "EM 1 MÊS" if dias > 24 else f"EM {max(1, round(dias / 7))} SEMANAS" if dias > 10 else "EM 10 DIAS" if dias > 7 else "NA SEMANA"
def palavras(t): return len(t.split())

slots = [(d, h) for d, hs in DIAS.items() for h in hs]
assert len(slots) == len(V) == 56, (len(slots), len(V))
resumo, estado_novos = [], []
for i, ((dia, hora), v) in enumerate(zip(slots, V)):
    pasta = f"posts/{dia}-{v['slug']}"; os.makedirs(pasta, exist_ok=True)
    el = elementos(i, v)
    if v["tipo"] == "L":
        n = len(v["itens"]); est = [EST[r] for _, r, _ in v["itens"]]
        total = sum(e["estrelas"] for e in est)
        datas = [datetime.date.fromisoformat(e["criado"]) for e in est]
        etiqueta = [v["assunto"], f"{mil(total)} ESTRELAS {semanas(datas)}", v["promessa"]]
        segs = [dict(cena="gancho", tag=v["assunto"], fala=v["gancho"], legenda=v["gancho"], itens=v["slug"], etiqueta=etiqueta,
                     sfx=[{"t":0.1,"som":"whoosh","g":0.6}])]
        for k, ((nome, repo, fala), e) in enumerate(zip(v["itens"], est)):
            pos = n - k
            f = fala
            if pos == 3 or (n == 3 and pos == 2):  # CTA no meio, na frase-ponte depois da nº 3
                f = fala + " " + v["ponte"]
            segs.append(dict(cena=f"n{pos}", tag=f"{pos}º", item=nome, repo=repo, estrelas=e["estrelas"], fala=f, legenda=f, sfx=[{"t":0.0,"som":"whoosh","g":0.5}]))
        segs.append(dict(cena="cta", tag=f"COMENTA {v['chave']}", fala=v["fecho"], legenda=v["fecho"], sfx=[]))
        fontes = [f"https://github.com/{r}" for _, r, _ in v["itens"]]
        prova = "Estrelas no GitHub (API, 07/11/2026): " + ", ".join(f"{nm} {EST[r]['estrelas']:,}".replace(",", ".") for nm, r, _ in v["itens"]) + f"; total {total:,}".replace(",", ".") + f"; criados entre {min(datas):%d/%m} e {max(datas):%d/%m}."
        tese = " · ".join(etiqueta); formato = "contagem"
    else:
        segs = []
        nomes = ["gancho", "s1", "s2", "s3", "s4", "cta"]
        if v["repo"]:
            e = EST[v["repo"]]; etq2 = f"{mil(e['estrelas'])} ESTRELAS {semanas([datetime.date.fromisoformat(e['criado'])])}"
            prova = f"Estrelas no GitHub (API, 07/11/2026): {v['repo']} {e['estrelas']:,}".replace(",", ".") + f", criado em {e['criado'][8:10]}/{e['criado'][5:7]}."
            fontes = [f"https://github.com/{v['repo']}"] + v["fontes"]
        else:
            etq2 = "NOVIDADE DESTA SEMANA"; fontes = v["fontes"]
            prova = "Coberto por The Next Web, Android Authority e Decrypt (04–05/11/2026); recurso novo do ChatGPT (Images 2.6)."
        etiqueta = [v["tese"], etq2, ""]
        for nm, f in zip(nomes, v["falas"]):
            sg = dict(cena=nm, tag=v["tese"] if nm == "gancho" else ("COMENTA " + v["chave"] if nm == "cta" else ""), fala=f, legenda=f, sfx=[])
            if nm == "gancho": sg.update(itens=v["slug"], etiqueta=etiqueta, sfx=[{"t":0.1,"som":"whoosh","g":0.6}])
            if nm == "s3" and v["repo"]: sg.update(item=v["repo"].split("/")[1], repo=v["repo"], estrelas=EST[v["repo"]]["estrelas"])
            segs.append(sg)
        tese = " · ".join(x for x in etiqueta if x); formato = "palco"
    nw = sum(palavras(s["fala"]) for s in segs); dur = nw / 2.9
    rot = dict(voz="Puck", estilo="narrador de Reels brasileiro, energético mas claro, ritmo natural (máx. 3,0 palavras/s)", formato=formato,
               chave=v["chave"], tese=tese, conceito=v["conceito"], elementos=el, brinde=v["brinde"], fontes=fontes, prova_viral=prova,
               obs=v.get("obs", ""), polemica=v["polemica"], agenda=f"{dia} {hora}", palavras=nw, duracao_estimada_s=round(dur, 1),
               status="aguardando aprovação", segmentos=segs)
    json.dump(rot, open(f"{pasta}/roteiro.json", "w"), ensure_ascii=False, indent=1)
    links = "\n".join(f"• {u}" for u in fontes)
    open(f"{pasta}/resposta_dm.txt", "w").write(f"Oi! Que bom que você comentou {v['chave']} 🙌\nAqui está o que eu prometi ({v['brinde']}):\n{links}\n\nSe curtir, me segue pra mais IA que serve pra vida real. 💜\n")
    json.dump(dict(data=dia, horario=hora, pilar="reel", formato=formato, temas=[v["slug"]], fontes=fontes, cta=v["chave"], polemica=v["polemica"],
                   horarios={"instagram": f"{dia} {hora}", "tiktok": f"{dia} {hora}"}, status="aguardando aprovação"),
              open(f"{pasta}/meta.json", "w"), ensure_ascii=False, indent=1)
    estado_novos.append(f"{dia} {hora} Reel ({formato}): {v['slug']} (CTA {v['chave']}; aguardando aprovação do roteiro)")
    resumo.append((i + 1, dia, hora, v, segs, rot))
json.dump(estado_novos, open("semana/estado_novos.json", "w"), ensure_ascii=False, indent=1)
# resumo para o Vitor
DS = {"2026-11-09":"SEG 09/11","2026-11-10":"TER 10/11","2026-11-11":"QUA 11/11","2026-11-12":"QUI 12/11","2026-11-13":"SEX 13/11","2026-11-14":"SÁB 14/11","2026-11-15":"DOM 15/11"}
out = ["# Roteiros da semana 09–15/11 (56 Reels, 8 por dia)\n", "Estrelas lidas na API do GitHub em 07/11. Teste viral: ✅ conflito no gancho · ✅ título com número · ✅ frases curtas · ✅ 1 efeito por cena · ✅ dor + brinde. Fala ≤ 3,0 palavras/s.\n"]
dia_ant = None
for n, dia, hora, v, segs, rot in resumo:
    if dia != dia_ant: out.append(f"\n## {DS[dia]}\n"); dia_ant = dia
    pol = " 🔥" if v["polemica"] else ""
    out.append(f"**{n}. {hora}{pol} · {rot['tese']}**  \n{v['conceito'].split(':')[0][:110]}… · {rot['palavras']} palavras ≈ {rot['duracao_estimada_s']} s · COMENTA **{v['chave']}** · brinde: {v['brinde']}  \n")
    out.append("  \n".join(f"{j}. {s['fala']}" for j, s in enumerate(segs, 1)) + f"  \n_Prova:_ {rot['prova_viral']}" + (f"  \n_Cuidado:_ {rot['obs']}" if rot['obs'] else "") + "\n")
open("semana/ROTEIROS_09_15.md", "w").write("\n".join(out))
print("ok", len(resumo), "maior duração", max(r[5]["duracao_estimada_s"] for r in resumo))
for n, dia, hora, v, segs, rot in resumo:
    if rot["duracao_estimada_s"] > 33: print("LONGO", n, v["slug"], rot["duracao_estimada_s"])

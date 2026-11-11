#!/usr/bin/env python3
"""Gera cenarios e personagens do roteiro no Gemini (Nano Banana) e salva em assets/.

Chave: SO pela variavel de ambiente GEMINI_API_KEY (secret do GitHub). Nunca no codigo.
Uso:  python gerar.py roteiro.json assets/          (real, cobra por imagem)
      python gerar.py roteiro.json assets/ --mock   (sem chave: imagens de teste, custo zero)
Ja gerado = pulado (rodar de novo nao cobra duas vezes).
"""
import base64, json, os, sys, time, urllib.request, urllib.error

API = "https://generativelanguage.googleapis.com/v1beta/interactions"
MODELO = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-nano-banana-2.1")
VERDE = "solid pure chroma-key green background (#00FF00), flat, no shadows on the background, no floor, character fully inside the frame"


def chamar(partes, aspecto, tamanho):
    chave = os.environ.get("GEMINI_API_KEY")
    if not chave:
        sys.exit("GEMINI_API_KEY nao definida (configure o secret no GitHub).")
    corpo = {"model": MODELO, "input": partes,
             "response_format": {"type": "image", "mime_type": "image/png", "aspect_ratio": aspecto, "image_size": tamanho}}
    req = urllib.request.Request(API, data=json.dumps(corpo).encode(), method="POST",
                                 headers={"x-goog-api-key": chave, "Content-Type": "application/json"})
    for tentativa in range(4):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                resp = json.load(r)
            break
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")[:400]
            if e.code in (429, 500, 503) and tentativa < 3:
                time.sleep(10 * (tentativa + 1)); continue
            sys.exit(f"Gemini respondeu {e.code}: {msg}")
    img = (resp.get("output_image") or {}).get("data")
    if not img:  # formato completo: steps -> model_output -> content
        for st in resp.get("steps", []):
            for c in st.get("content", []) if st.get("type") == "model_output" else []:
                if c.get("type") == "image" and c.get("data"):
                    img = c["data"]
    if not img:
        sys.exit("Resposta sem imagem: " + json.dumps(resp)[:400])
    return base64.b64decode(img)


def img_parte(caminho):
    return {"type": "image", "mime_type": "image/png", "data": base64.b64encode(open(caminho, "rb").read()).decode()}


def mock(destino, tipo, rotulo):
    """Imagem de teste sem custo, para validar o fluxo sem chave."""
    from PIL import Image, ImageDraw
    if tipo == "fundo":
        im = Image.new("RGB", (1080, 1920)); d = ImageDraw.Draw(im)
        for y in range(1920):
            k = y / 1920; d.line([(0, y), (1080, y)], fill=(int(30 - 20 * k), int(10 + 5 * k), int(70 - 50 * k)))
        for i in range(9):
            d.rectangle([60 + i * 110, 700 + (i % 3) * 60, 140 + i * 110, 1300], fill=(40, 30 + i * 8, 110))
    else:
        im = Image.new("RGB", (1024, 1365), (0, 255, 0)); d = ImageDraw.Draw(im)
        cor = (255, 140, 30) if hash(rotulo) % 2 else (150, 80, 255)
        d.rounded_rectangle([262, 300, 762, 1000], 80, fill=cor)
        d.rounded_rectangle([350, 450, 470, 560], 30, fill=(255, 255, 255)); d.rounded_rectangle([554, 450, 674, 560], 30, fill=(255, 255, 255))
        d.ellipse([390, 480, 440, 530], fill=(20, 20, 30)); d.ellipse([594, 480, 644, 530], fill=(20, 20, 30))
        d.rectangle([330, 1000, 420, 1250], fill=cor); d.rectangle([604, 1000, 694, 1250], fill=cor)
    d.text((20, 20), "MOCK " + rotulo, fill=(255, 255, 255))
    im.save(destino)


def main():
    roteiro = json.load(open(sys.argv[1], encoding="utf-8"))
    out = sys.argv[2]; usar_mock = "--mock" in sys.argv
    os.makedirs(out, exist_ok=True)
    estilo = roteiro["estilo"]
    n = 0

    # 1) ficha de cada personagem (referencia fixa para manter o mesmo boneco em todas as poses)
    for nome, desc in roteiro["personagens"].items():
        f = f"{out}/ficha_{nome}.png"
        if os.path.exists(f): continue
        if usar_mock: mock(f, "ator", nome); continue
        p = f"Character design reference: {desc}. Full body, front view, neutral pose. {estilo}. {VERDE}."
        open(f, "wb").write(chamar([{"type": "text", "text": p}], "3:4", "1K")); n += 1
        print("ficha", nome, flush=True)

    for cena in roteiro["cenas"]:
        # 2) cenario sem personagens, com profundidade
        f = f"{out}/fundo_{cena['id']}.png"
        if not os.path.exists(f):
            if usar_mock: mock(f, "fundo", cena["id"])
            else:
                p = f"Vertical background plate, no characters, no text: {cena['fundo']}. Strong depth: blurred foreground elements, sharp midground, soft hazy background. {estilo}."
                open(f, "wb").write(chamar([{"type": "text", "text": p}], "9:16", "2K")); n += 1
                print("fundo", cena["id"], flush=True)
        # 3) cada personagem na pose da cena, usando a ficha como referencia
        for a in cena.get("atores", []):
            f = f"{out}/ator_{cena['id']}_{a['p']}.png"
            if os.path.exists(f): continue
            if usar_mock: mock(f, "ator", a["p"]); continue
            p = (f"Same character as the reference image, identical design, colors and proportions. Pose: {a['pose']}. "
                 f"Full body. {estilo}. {VERDE}.")
            partes = [img_parte(f"{out}/ficha_{a['p']}.png"), {"type": "text", "text": p}]
            open(f, "wb").write(chamar(partes, "3:4", "1K")); n += 1
            print("ator", cena["id"], a["p"], flush=True)
    print(f"imagens novas geradas: {n}")


if __name__ == "__main__":
    main()

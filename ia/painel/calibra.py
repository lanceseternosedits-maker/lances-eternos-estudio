"""Calibra a 🔥 do chance.py contra o resultado real (Vitor, 12/11: "vamos recalibrar").
Mede, nos Reels já medidos, quantos passaram de VIRAL_VIEWS views em cada faixa da nota e grava painel/calibracao.json
(regressão isotônica simples). O chance.py lê esse arquivo e devolve `prob_real` junto de `pct`.
Rode de novo depois de cada leitura nova do analista: python3 painel/calibra.py"""
import json
import datetime as dt
import chance as c

VIRAL_VIEWS = 1000  # "bom" = passou de 1.000 views no Instagram (mediana dos Reels é ~430)


def pav(pontos):
    """Pool-adjacent-violators: probabilidade não decrescente com a nota."""
    blocos = [[p, 1, [p]] for p in pontos]  # [média, peso, membros]
    i = 0
    while i < len(blocos) - 1:
        if blocos[i][0] > blocos[i + 1][0]:
            a, b = blocos[i], blocos[i + 1]
            peso = a[1] + b[1]
            blocos[i:i + 2] = [[(a[0] * a[1] + b[0] * b[1]) / peso, peso, a[2] + b[2]]]
            i = max(i - 1, 0)
        else:
            i += 1
    out = []
    base = sum(pontos) / len(pontos)
    for m, w, mem in blocos:  # suaviza blocos pequenos em direção à taxa base (2 observações de peso)
        out += [(m * w + 2 * base) / (w + 2)] * len(mem)
    return out


def main():
    hist = c.historico()
    linhas = sorted(((c.chance(c.IA / "posts" / h["pasta"], hist)["pct"], int(h["views"] >= VIRAL_VIEWS), h["views"]) for h in hist))
    iso = pav([y for _, y, _ in linhas])
    pontos = [{"nota": n, "prob": round(p, 3)} for (n, _, _), p in zip(linhas, iso)]
    base = sum(y for _, y, _ in linhas) / len(linhas)
    json.dump({"gerado_em": dt.date.today().isoformat(), "viral_views": VIRAL_VIEWS, "n": len(linhas), "taxa_base": round(base, 3),
               "pontos": pontos}, open(c.IA / "painel" / "calibracao.json", "w"), indent=1)
    print(f"{len(linhas)} Reels, base {base:.0%} passam de {VIRAL_VIEWS} views")
    for n in (20, 30, 40, 50, 60, 70):
        print(f"nota {n}% -> chance real de passar de {VIRAL_VIEWS} views: {c.prob_real(n):.0%}")


if __name__ == "__main__":
    main()

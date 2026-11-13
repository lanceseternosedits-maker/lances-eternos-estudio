"""Cronograma por categoria (Vitor, 07/11): reorganiza os horários de 07 a 15/11.

Uso (de dentro de ia/): python3 semana/cronograma.py [--aplicar]
- Cada dia tem horários de 🆕 novidade (N), 📜 história (H) e ⚙️ como funciona (F); ver "Categorias" no manual.
- Já agendados no Metricool ficam onde estão (FIXOS).
- História e como funciona ficam no horário do próprio roteiro (campo "agenda"), se ele cair num H/F.
- As novidades que temos preenchem os N em ordem: vídeos aprovados, vídeos prontos esperando, em produção, roteiros aprovados.
- Sem --aplicar só mostra; com --aplicar grava meta.json/roteiro.json e semana/cronograma.md.
"""
from __future__ import annotations

import datetime as dt
import json
import sys
from pathlib import Path

IA = Path(__file__).resolve().parent.parent
POSTS = IA / "posts"
# Vitor (13/11): 4 por dia = 2 🆕 (1º e 3º horário) + 1 ⚙️ (meio-dia) + 1 📜 (noite), intercalado
UTEIS = [("06:00", "N"), ("12:00", "F"), ("19:30", "N"), ("21:30", "H")]
FDS = [("09:00", "N"), ("13:00", "F"), ("19:00", "N"), ("20:30", "H")]
# grade antiga de 8/dia (07–12/11): úteis 06/08/10/12/14/17/19:30/21:30; fds 07/09/11/13/15/17/19/20:30
FDS_08 = [("07:00", "N"), ("09:00", "F"), ("11:00", "N"), ("13:00", "N"), ("15:00", "H"), ("17:00", "N"), ("19:00", "H"), ("20:30", "N")]  # 08/11 já agendado, grade antiga
HOJE_RESTO = [("15:00", "N"), ("17:00", "N"), ("19:00", "H"), ("21:00", "F")]  # sábado 07/11: 6 no total (Vitor, 07/11)
FIXOS: dict = {}  # já agendados no Metricool que não podem mudar (os de 07–08/11 já saíram)
# ordem de prioridade das novidades (vídeos prontos primeiro)
PRIMEIRAS: list = []  # a lista de 08/11 já foi publicada
# aprovados primeiro; roteiro ainda sem aprovação fica por último
ORDEM_STATUS = {"vídeo aguardando aprovação": 0, "roteiro aprovado": 1, "roteiro aguardando aprovação": 2}
CAT = {"N": "novidade", "H": "historia", "F": "como_funciona"}
ROT = {"N": "🆕", "H": "📜", "F": "⚙️"}


def ler(p):
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}


def slots(dias: int = 10):
    """Vagas de hoje (Brasília) até `dias` dias à frente, na grade de 4 por dia (Vitor, 13/11)."""
    out = []
    d = (dt.datetime.now(dt.timezone.utc) - dt.timedelta(hours=3)).date()
    fim = d + dt.timedelta(days=dias)
    while d <= fim:
        for h, c in (FDS if d.weekday() >= 5 else UTEIS):
            out.append((str(d), h, c))
        d += dt.timedelta(days=1)
    return out


def main(aplicar: bool):
    posts = {}
    for p in sorted(POSTS.iterdir()):
        if p.is_dir() and p.name >= "2026-11-07":
            m = ler(p / "meta.json")
            st = m.get("status") or ""
            if st in ("roteiro aprovado", "vídeo aguardando aprovação", "roteiro aguardando aprovação") or p.name in PRIMEIRAS:
                posts[p.name] = {"meta": m, "rot": ler(p / "roteiro.json"), "cat": m.get("categoria") or "novidade"}
    grade = {}
    for k, v in FIXOS.items():
        grade[k] = v
    # história / como funciona no horário do próprio roteiro
    sem_lugar = []
    for nome, x in posts.items():
        if x["cat"] != "novidade":
            q = (x["rot"].get("agenda") or "")[:16]
            if q and q not in grade:
                grade[q] = nome
            else:
                sem_lugar.append(nome)
    novidades = [n for n in PRIMEIRAS if n in posts] + sorted(
        (n for n, x in posts.items() if x["cat"] == "novidade" and n not in PRIMEIRAS),
        key=lambda n: (ORDEM_STATUS.get(posts[n]["meta"].get("status") or "", 0),
                       (posts[n]["meta"].get("horarios") or {}).get("instagram") or n))
    linhas, vagas = [], []
    for data, h, c in slots():
        q = f"{data} {h}"
        if q not in grade and c == "N" and novidades:
            grade[q] = novidades.pop(0)
        nome = grade.get(q)
        if nome is None:
            vagas.append((q, c))
        cat = posts[nome]["cat"] if nome in posts else "novidade"
        linhas.append(f"| {data[8:10]}/{data[5:7]} {h} | {ROT[c]} | {nome[11:] if nome else '**VAGA ' + CAT[c] + '**'} |"
                      + (" (já agendado)" if q in FIXOS else "") + (" ⚠️ categoria diferente" if nome and cat != CAT[c] else ""))
    print("\n".join(linhas))
    print(f"\nvagas: {len(vagas)} ({sum(1 for _, c in vagas if c == 'N')} N, {sum(1 for _, c in vagas if c == 'H')} H, {sum(1 for _, c in vagas if c == 'F')} F)"
          f" · novidades sobrando: {len(novidades)} · sem lugar: {sem_lugar}")
    if not aplicar:
        return
    for q, nome in grade.items():
        if nome in posts and q not in FIXOS:
            p = POSTS / nome
            m, r = posts[nome]["meta"], posts[nome]["rot"]
            m["data"], m["horario"], m["horarios"] = q[:10], q[11:], {"instagram": q, "tiktok": q}
            m.setdefault("categoria", posts[nome]["cat"])
            (p / "meta.json").write_text(json.dumps(m, ensure_ascii=False, indent=1), encoding="utf-8")
            if r:
                r["agenda"] = q
                r.setdefault("categoria", posts[nome]["cat"])
                (p / "roteiro.json").write_text(json.dumps(r, ensure_ascii=False, indent=1), encoding="utf-8")
    (IA / "semana" / "cronograma.md").write_text(
        "# Cronograma por categoria (próximos 10 dias)\n\nGerado por `semana/cronograma.py`. 🆕 novidade · 📜 história · ⚙️ como funciona.\n"
        "Regra (Vitor, 13/11): 4 por dia, intercalado = 2 🆕 (1º e 3º) + 1 ⚙️ + 1 📜; úteis 06:00/12:00/19:30/21:30, fim de semana 09:00/13:00/19:00/20:30.\n\n| Quando | Cat. | Post |\n|---|---|---|\n"
        + "\n".join(linhas) + f"\n\nVagas: {len(vagas)}. Novidades sem horário: {', '.join(novidades) or 'nenhuma'}.\n", encoding="utf-8")


if __name__ == "__main__":
    main("--aplicar" in sys.argv)

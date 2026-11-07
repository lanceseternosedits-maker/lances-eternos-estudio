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
# Vitor (07/11): intercalar sempre (nunca 2 novidades seguidas): 4 🆕 + 2 ⚙️ (manhã) + 2 📜 (noite)
UTEIS = [("06:00", "N"), ("08:00", "F"), ("10:00", "N"), ("12:00", "F"), ("14:00", "N"), ("17:00", "H"), ("19:30", "N"), ("21:30", "H")]
FDS = [("07:00", "N"), ("09:00", "F"), ("11:00", "N"), ("13:00", "F"), ("15:00", "N"), ("17:00", "H"), ("19:00", "N"), ("20:30", "H")]
FDS_08 = [("07:00", "N"), ("09:00", "F"), ("11:00", "N"), ("13:00", "N"), ("15:00", "H"), ("17:00", "N"), ("19:00", "H"), ("20:30", "N")]  # 08/11 já agendado, grade antiga
HOJE_RESTO = [("15:00", "N"), ("17:00", "N"), ("19:00", "H"), ("21:00", "F")]  # sábado 07/11: 6 no total (Vitor, 07/11)
FIXOS = {"2026-11-07 13:00": "2026-11-07-editar-video", "2026-11-07 20:30": "2026-11-07-programas-pc",
         "2026-11-08 13:00": "2026-11-08-estudar-ia", "2026-11-08 20:30": "2026-11-05-10-estilos"}
# ordem de prioridade das novidades (vídeos prontos primeiro)
PRIMEIRAS = ["2026-11-08-windows-gratis", "2026-11-08-console-no-celular", "2026-11-08-skills-de-design",
             "2026-11-08-estudio-de-voz-gratis", "2026-11-08-captura-de-qualquer-bicho", "2026-11-08-apps-pra-quem-vive-no-chat",
             "2026-11-08-video-do-zero", "2026-11-08-ia-gigante-no-pc", "2026-11-08-skills-chinesas-agencia", "2026-11-08-crie-seu-app-de-mac"]
# aprovados primeiro; roteiro ainda sem aprovação fica por último
ORDEM_STATUS = {"vídeo aguardando aprovação": 0, "roteiro aprovado": 1, "roteiro aguardando aprovação": 2}
CAT = {"N": "novidade", "H": "historia", "F": "como_funciona"}
ROT = {"N": "🆕", "H": "📜", "F": "⚙️"}


def ler(p):
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else {}


def slots():
    out = [("2026-11-07", h, c) for h, c in HOJE_RESTO]
    d = dt.date(2026, 11, 8)
    while d <= dt.date(2026, 11, 15):
        for h, c in (FDS_08 if d == dt.date(2026, 11, 8) else FDS if d.weekday() >= 5 else UTEIS):
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
        "# Cronograma por categoria (07 a 15/11)\n\nGerado por `semana/cronograma.py`. 🆕 novidade · 📜 história · ⚙️ como funciona.\n"
        "Regra (Vitor, 07/11): 8 por dia, sempre intercalado = 4 🆕 + 2 ⚙️ + 2 📜, nunca 2 novidades seguidas (sábado 07/11: 6 no total; domingo 08/11 ficou na grade antiga, já agendado).\n\n| Quando | Cat. | Post |\n|---|---|---|\n"
        + "\n".join(linhas) + f"\n\nVagas: {len(vagas)}. Novidades sem horário: {', '.join(novidades) or 'nenhuma'}.\n", encoding="utf-8")


if __name__ == "__main__":
    main("--aplicar" in sys.argv)

# Cenas do "Arquivo Secreto": o robô que inventou uma regra (Moffatt v. Air Canada, 2024 BCCRT 149).
# TL, MOUTH, c0, c1 chegam prontos do render2.py. Mockups genéricos: sem logo nem nome da companhia na tela (só na fonte).
import math
from PIL import Image, ImageDraw
from base import (W, F, cl, prog, eo, eio, back, slam, text_sprite, paste, T, wrap, rrect_sprite, tag, bubble,
                  typing_dots, WHITE, GREY, CYAN, RED, GREEN, BLUE)
from mascote import draw_char

AMAR = (255, 210, 90)


def gl(t, keys, amp=0.8, d=0.16):
    g = 0
    for k in keys:
        if 0 <= t - k < d: g = max(g, amp * (1 - (t - k) / d))
    return g


def ini(t):
    return (1 - t / 0.12) if t < 0.12 else 0


def boca(cv, t, gt, keys, **kw):
    draw_char(cv, t, gt, keys, MOUTH, **kw)


def aviao(d, cx, cy, s, cor):
    """avião genérico visto de cima (silhueta simples)."""
    P = lambda x, y: (cx + x * s, cy + y * s)
    d.polygon([P(-4, -40), P(4, -40), P(6, -8), P(40, 10), P(40, 18), P(6, 8), P(5, 30), P(16, 38), P(16, 44),
               P(0, 40), P(-16, 44), P(-16, 38), P(-5, 30), P(-6, 8), P(-40, 18), P(-40, 10), P(-6, -8)], fill=cor)


def cartao_embarque(w=760, h=220):
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    d.rounded_rectangle((0, 0, w - 1, h - 1), 28, fill=(248, 249, 251, 255), outline=(210, 214, 222, 255), width=3)
    d.rounded_rectangle((0, 0, 190, h - 1), 28, fill=(47, 107, 255, 255)); d.rectangle((160, 0, 190, h - 1), fill=(47, 107, 255, 255))
    aviao(d, 95, h // 2, 1.6, (255, 255, 255))
    for y in range(14, h - 10, 22): d.line((214, y, 214, y + 10), fill=(190, 196, 206), width=3)
    d.text((244, 40), "CARTÃO DE EMBARQUE", font=F("mono", 30), fill=(40, 46, 60))
    d.text((244, 96), "Ida • só a passagem", font=F("semi", 40), fill=(30, 34, 44))
    d.text((244, 152), "ASSENTO 14C    PORTÃO 7", font=F("monor", 26), fill=(120, 126, 140))
    return img


def cab_chat(w=940):
    hdr = Image.new("RGBA", (w, 120), (0, 0, 0, 0)); d = ImageDraw.Draw(hdr)
    d.rounded_rectangle((0, 0, w - 1, 119), 28, fill=(17, 20, 30, 255))
    d.ellipse((22, 18, 106, 102), fill=(47, 107, 255)); aviao(d, 64, 60, 0.85, (255, 255, 255))
    d.text((126, 24), "Assistente virtual", font=F("bold", 40), fill=WHITE)
    d.ellipse((128, 84, 142, 98), fill=GREEN)
    d.text((152, 78), "companhia aérea • online", font=F("med", 26), fill=GREY)
    d.text((w - 30, 60), "CHAT", font=F("mono", 24), fill=CYAN, anchor="rm")
    return hdr


MSG_CLIENTE = "Tem desconto pra quem perdeu alguém da família?"
MSG_ROBO = "Sim! Compre agora e peça o desconto em até 90 dias."


# ---------------------------------------------------------------- cenas
def s_hook(cv, t, gt):
    m = c0("h1") + 0.55
    if t >= 0.0:
        p = eo(prog(t, -0.35, 0.35))
        paste(cv, cartao_embarque(), W / 2, 420 - 30 * (1 - p), p, 0.72)
    T(cv, t, "ARQUIVO REAL  •  2024", F("mono", 34), CYAN, W / 2, 575, -0.3, "fade", d=0.3)
    T(cv, t, "UM ROBÔ", F("black", 170), WHITE, W / 2, 730, -0.3, "slam", glitch=True)
    T(cv, t, "INVENTOU", F("black", 190), RED, W / 2, 905, m, "slam", glow=RED, glitch=True)
    T(cv, t, "uma regra.", F("semi", 72), WHITE, W / 2, 1065, m + 0.45, "fade")
    T(cv, t, "E a empresa pagou.", F("xbold", 96), CYAN, W / 2, 1215, c0("h2"), "slam", glow=CYAN, glitch=True)
    boca(cv, t, gt, [(0, "explain"), (c0("h2"), "point")], brow=1.0 if m <= t < m + 1.0 else 0.2)
    return gl(t, [m, c0("h2")])


def s_context(cv, t, gt):
    tag(cv, t)
    lbl = "NOVEMBRO, 2022"
    n = int(cl((t + 0.2) * 26, 0, len(lbl)))
    if n: paste(cv, text_sprite(lbl[:n] + ("_" if int(t * 3) % 2 == 0 else " "), F("mono", 40), CYAN), W / 2, 440)
    T(cv, t, "A avó dele tinha morrido.", F("bold", 66), WHITE, W / 2, 545, 0.2)
    if t >= 0.9:
        p = prog(t, 0.9, 0.4)
        paste(cv, cartao_embarque(), W / 2, 745, cl(p * 2), 0.7 + 0.3 * back(p))
    q0 = c0("c2")
    if t >= q0:
        p = eo(prog(t, q0, 0.3))
        paste(cv, cab_chat(), W / 2, 960 - 30 * (1 - p), p)
    if q0 + 0.25 <= t < q0 + 0.9: typing_dots(cv, t, 145, 1070 + 42)
    if t >= q0 + 0.9:
        hb = bubble(MSG_CLIENTE, "l", maxw=700)
        p = prog(t, q0 + 0.9, 0.25)
        paste(cv, hb, 70 + hb.width / 2, 1070 + hb.height / 2, cl(p * 2), 0.85 + 0.15 * back(p))
    boca(cv, t, gt, [(0, "explain"), (q0, "point")], brow=-0.3 if t < 1.6 else 0.2, smile=0.0)
    return ini(t)


def s_chat(cv, t, gt):
    hp = eo(prog(t, 0.0, 0.3))
    paste(cv, cab_chat(), W / 2, 330 - 30 * (1 - hp), hp)
    hb = bubble(MSG_CLIENTE, "l", maxw=700); top = 430
    paste(cv, hb, 70 + hb.width / 2, top + hb.height / 2)
    T(cv, t, "CLIENTE", F("mono", 22), GREY, 122, top + hb.height + 26, 0.0)
    ab = bubble(MSG_ROBO, "r", fill=BLUE, hl={"90": AMAR, "dias.": AMAR, "dias": AMAR})
    ay0 = top + hb.height + 70
    ai = c0("t1") + 0.25
    if ai - 0.6 <= t < ai: typing_dots(cv, t, W - 145, ay0 + 42, BLUE)
    if t >= ai:
        p = prog(t, ai, 0.25)
        paste(cv, ab, W - 70 - ab.width / 2, ay0 + ab.height / 2, cl(p * 2), 0.85 + 0.15 * back(p))
        T(cv, t, "ROBÔ DA EMPRESA", F("mono", 22), CYAN, W - 190, ay0 + ab.height + 26, ai + 0.15)
    neg = c0("t2") + 0.55
    cy = ay0 + ab.height + 150
    if t >= c0("t2"):
        p = prog(t, c0("t2"), 0.35)
        shake = math.sin((t - neg) * 70) * 22 * (1 - (t - neg) / 0.4) if neg <= t < neg + 0.4 else 0
        card = Image.new("RGBA", (780, 170), (0, 0, 0, 0)); d = ImageDraw.Draw(card)
        falhou = t >= neg
        d.rounded_rectangle((0, 0, 779, 169), 26, fill=(248, 249, 251, 255), outline=(RED + (255,)) if falhou else (210, 214, 222, 255), width=4)
        bx, by = 44, 45
        d.rounded_rectangle((bx, by, bx + 80, by + 80), 10, fill=(255, 235, 238, 255) if falhou else (255, 255, 255, 255),
                            outline=(RED + (255,)) if falhou else (190, 196, 206, 255), width=5)
        if falhou:
            d.line((bx + 22, by + 22, bx + 58, by + 58), fill=RED, width=9); d.line((bx + 58, by + 22, bx + 22, by + 58), fill=RED, width=9)
        d.text((160, 85), "Pedido de desconto", font=F("semi", 50), fill=(30, 34, 44), anchor="lm")
        paste(cv, card, W / 2 + shake, cy, cl(p * 2), 0.7 + 0.3 * back(p))
    T(cv, t, "PEDIDO NEGADO", F("mono", 46), RED, W / 2, cy + 125, neg, "slam", glow=RED, glitch=True)
    T(cv, t, "A regra de verdade:", F("semi", 52), WHITE, W / 2, cy + 210, neg + 0.7)
    T(cv, t, "não vale depois da viagem.", F("bold", 56), AMAR, W / 2, cy + 275, neg + 1.0)
    boca(cv, t, gt, [(0, "explain"), (ai, "point"), (neg, "shock")], brow=-0.8 if t >= neg else (0.5 if t >= ai else 0.0), smile=0.2)
    return max(gl(t, [neg], 0.75, 0.2), ini(t))


DEFESA = "> O chatbot é responsável pelas próprias ações."
CPS = 46


def s_court(cv, t, gt):
    tag(cv, t)
    lbl = "NO TRIBUNAL • 2024"
    n = int(cl((t + 0.1) * 26, 0, len(lbl)))
    if n: paste(cv, text_sprite(lbl[:n] + ("_" if int(t * 3) % 2 == 0 else " "), F("mono", 40), CYAN), W / 2, 430)
    tw, th = 940, 250
    ty = 520
    if t >= 0.25:
        p = eo(prog(t, 0.25, 0.35))
        panel = Image.new("RGBA", (tw, th), (0, 0, 0, 0)); d = ImageDraw.Draw(panel)
        d.rounded_rectangle((0, 0, tw - 1, th - 1), 24, fill=(4, 10, 8, 245), outline=(61, 255, 162, 150), width=3)
        d.rectangle((3, 70, tw - 4, 72), fill=(61, 255, 162, 60))
        d.text((30, 36), "DEFESA DA EMPRESA", font=F("mono", 28), fill=GREEN, anchor="lm")
        d.text((tw - 30, 36), "resumo do tribunal", font=F("monor", 22), fill=(110, 170, 140), anchor="rm")
        nn = int(cl((t - (c0("d1") + 0.9)) * CPS, 0, 999)); fnt = F("monor", 38); y = 104; used = 0
        for l in wrap(DEFESA, fnt, tw - 70):
            show = l[:max(0, nn - used)]; used += len(l) + 1
            if show: d.text((30, y), show, font=fnt, fill=(170, 255, 210))
            if show and (len(show) < len(l) or nn >= len(DEFESA)) and int(t * 3) % 2 == 0 and nn - (used - len(l) - 1) <= len(l):
                cx_ = 30 + fnt.getlength(show); d.rectangle((cx_ + 4, y + 4, cx_ + 24, y + 44), fill=GREEN)
            y += 56
        paste(cv, panel, W / 2, ty + th / 2 + 40 * (1 - p), p)
    q = c0("d2")
    T(cv, t, "“Uma alegação notável.”", F("xbold", 74), WHITE, W / 2, 880, q + 0.1, glow=None)
    T(cv, t, "— o tribunal, 14/02/2024", F("monor", 28), GREY, W / 2, 950, q + 0.4)
    st_t = q + 1.6
    if t >= st_t:
        st = Image.new("RGBA", (520, 140), (0, 0, 0, 0)); d = ImageDraw.Draw(st)
        d.rounded_rectangle((4, 4, 515, 135), 16, outline=RED, width=9, fill=(255, 59, 92, 40))
        d.text((260, 72), "CONDENADA", font=F("black", 70), fill=RED, anchor="mm")
        paste(cv, st, W / 2, 1080, cl(prog(t, st_t, 0.1) * 2), slam(t, st_t, 0.22), rot=8)
    T(cv, t, "pagar CA$ 812,02", F("xbold", 64), WHITE, W / 2, 1205, st_t + 0.45, "slam", glitch=True)
    if t >= c0("d3"):
        p = prog(t, c0("d3"), 0.35); pulse = 1 + 0.03 * math.sin((t - c0("d3")) * 6)
        txt = text_sprite("Manda pra um amigo  •  Comenta PRINT", F("bold", 42), (12, 14, 20))
        pill = rrect_sprite(txt.width + 40, 96, 48, WHITE + (255,))
        pill.alpha_composite(txt, (20, (96 - txt.height) // 2 + 2))
        paste(cv, pill, W / 2, 1295, cl(p * 2), (0.6 + 0.4 * back(p)) * pulse)
    boca(cv, t, gt, [(0, "explain"), (q, "both"), (st_t, "shock"), (c0("d3"), "point")],
         brow=1.0 if st_t <= t < st_t + 1.2 else (-0.6 if t < q else 0.4), smile=0.3)
    return max(gl(t, [st_t, st_t + 0.45], 0.8, 0.2), ini(t))


def s_nuance(cv, t, gt):
    tag(cv, t)
    T(cv, t, "CALMA. CONTEXTO:", F("mono", 46), CYAN, W / 2, 450, 0.0, "slam", glitch=True)
    t3 = c0("n2") + 1.0
    rows = [("01", "Era pouco: CA$ 650,88 de diferença na passagem.", WHITE, 0.15),
            ("02", "Outra página do próprio site tinha a regra certa.", WHITE, 0.6),
            ("03", "Mas o robô faz parte do site. Quem responde é a empresa.", RED, t3)]
    y = 560
    for num, txt, col, t0 in rows:
        fnt = F("bold", 52) if col == RED else F("semi", 48)
        lines = wrap(txt, fnt, 720); hgt = len(lines) * 64
        if t >= t0:
            p = eo(prog(t, t0, 0.35))
            box = Image.new("RGBA", (900, hgt + 64), (0, 0, 0, 0)); d = ImageDraw.Draw(box)
            bc = RED if col == RED else CYAN
            d.rounded_rectangle((0, 0, 899, hgt + 63), 24, fill=bc + (22,), outline=bc + (90,), width=2)
            d.text((34, 33), num, font=F("mono", 34), fill=bc); yy = 27
            for l in lines: d.text((120, yy), l, font=fnt, fill=col); yy += 64
            paste(cv, box, W / 2 + 50 * (1 - p), y + (hgt + 64) / 2, p, 1.0 if col != RED else (1.0 + 0.06 * (1 - p)))
        y += hgt + 92
    boca(cv, t, gt, [(0, "explain"), (t3, "point")], brow=-0.3 if t < t3 else 0.9, smile=0.3)
    return max(gl(t, [t3], 0.6), ini(t))


def s_end(cv, t, gt):
    tag(cv, t)
    T(cv, t, "Robô de empresa", F("semi", 64), WHITE, W / 2, 480, 0.0)
    T(cv, t, "te prometeu algo?", F("semi", 64), WHITE, W / 2, 562, 0.2)
    k = c0("e1") + 1.35
    T(cv, t, "TIRA PRINT.", F("black", 150), RED, W / 2, 730, k, "slam", glow=RED, glitch=True)
    if t >= k + 0.4:
        p = eo(prog(t, k + 0.4, 0.35))
        card = Image.new("RGBA", (900, 200), (0, 0, 0, 0)); d = ImageDraw.Draw(card)
        d.rounded_rectangle((0, 0, 899, 199), 26, fill=(77, 232, 255, 22), outline=(77, 232, 255, 110), width=2)
        d.text((36, 52), "1", font=F("mono", 40), fill=CYAN, anchor="lm"); d.text((90, 52), "Print com data e hora", font=F("semi", 46), fill=WHITE, anchor="lm")
        d.text((36, 140), "2", font=F("mono", 40), fill=CYAN, anchor="lm"); d.text((90, 140), "Pede o link da regra oficial", font=F("semi", 46), fill=WHITE, anchor="lm")
        paste(cv, card, W / 2, 935 + 30 * (1 - p), p)
    T(cv, t, "Fonte: Moffatt v. Air Canada, 2024 BCCRT 149 · ABA · Canadian Press", F("monor", 22), GREY, W / 2, 1075, k + 0.6)
    e2 = c0("e2")
    if t >= e2:
        p = prog(t, e2, 0.35); pulse = 1 + 0.03 * math.sin((t - e2) * 6)
        txt = text_sprite("Já brigou com chatbot?  Comenta PRINT.", F("bold", 44), (12, 14, 20))
        pill = rrect_sprite(txt.width + 40, 104, 52, WHITE + (255,))
        pill.alpha_composite(txt, (20, (104 - txt.height) // 2 + 2))
        paste(cv, pill, W / 2, 1220, cl(p * 2), (0.6 + 0.4 * back(p)) * pulse)
    boca(cv, t, gt, [(0, "point"), (k, "shock"), (e2, "explain")], brow=0.5, smile=0.8)
    return max(gl(t, [k]), ini(t))


FUN = {"hook": s_hook, "context": s_context, "chat": s_chat, "court": s_court, "nuance": s_nuance, "end": s_end}


def SFX(S, c0, c1):
    ev = []
    s = S["hook"]; m = c0("h1") + 0.55
    ev += [("impact", s + 0.02, .42), ("impact", s + m, .6), ("glitch", s + m, .3), ("impact", s + c0("h2"), .54)]
    s = S["context"]
    ev += [("whoosh", s - 0.15, .3)] + [("click", s + i / 26, .6) for i in range(14)]
    ev += [("pop", s + 0.9, .6), ("pop", s + c0("c2"), .5), ("pop", s + c0("c2") + 0.9, .6)]
    s = S["chat"]; neg = c0("t2") + 0.55
    ev += [("whoosh", s - 0.15, .3), ("pop", s + c0("t1") + 0.25, .6), ("pop", s + c0("t2"), .5),
           ("buzz", s + neg, .6), ("glitch", s + neg, .3), ("impact", s + neg, .4)]
    s = S["court"]; st_t = c0("d2") + 1.6
    ev += [("whoosh", s - 0.15, .3)] + [("click", s + i / 26, .6) for i in range(18)]
    ev += [("click", s + c0("d1") + 0.9 + i / 46, .36) for i in range(len(DEFESA))]
    ev += [("pop", s + c0("d2") + 0.1, .5), ("impact", s + st_t, .66), ("glitch", s + st_t, .3), ("impact", s + st_t + 0.45, .5),
           ("pop", s + c0("d3"), .6)]
    s = S["nuance"]; t3 = c0("n2") + 1.0
    ev += [("glitch", s, .3), ("pop", s + .15, .6), ("pop", s + .6, .6), ("impact", s + t3, .36)]
    s = S["end"]; k = c0("e1") + 1.35
    ev += [("whoosh", s - 0.15, .3), ("impact", s + k, .66), ("glitch", s + k, .3), ("ding", s + k + 0.4, .5), ("pop", s + c0("e2"), .6)]
    return ev


def MUTE(S, c0, c1):
    """janela sem batida (suspense): da defesa da empresa até o carimbo."""
    return (S["court"] + c0("d2") + 0.2, S["court"] + c0("d2") + 1.6)

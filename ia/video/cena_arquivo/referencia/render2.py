import sys, os, json, math, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from render import (W, H, FPS, F, cl, prog, eo, eio, back, slam, text_sprite, rgb_split, paste, T, wrap,
                    rrect_sprite, background, finish, tag, captcha_card, person_avatar, cursor_sprite, bubble,
                    typing_dots, WHITE, GREY, CYAN, RED, GREEN, BLUE, THINK, HUMAN_MSG, AI_MSG)

OUT = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(OUT, "timeline.json")))
MOUTH = json.load(open(os.path.join(OUT, "mouth.json")))
SC = {s["name"]: s for s in TL["scenes"]}
CL = TL["clips"]
def c0(k): return CL[k]["start"]
def c1(k): return CL[k]["start"] + CL[k]["dur"]

# =====================================================================
# PRESENTER CHARACTER
# =====================================================================
S2 = 2  # supersample
BW, BH = 560, 640          # local box (1x)
BOX_X, BOX_Y = -40, 1250   # where the box sits on screen
SKIN = (196, 138, 104); SKIN_D = (170, 112, 82)
HAIR = (26, 26, 34); HOOD = (30, 40, 66); HOOD_L = (42, 55, 88); INK = (16, 18, 26)

POSES = {  # L elbow, L hand, R elbow, R hand (local coords)
    "rest":    ((150, 430), (150, 540), (370, 430), (370, 540)),
    "explain": ((140, 430), (150, 540), (420, 420), (395, 330)),
    "point":   ((140, 430), (150, 540), (440, 300), (520, 205)),
    "both":    ((95, 420), (130, 335), (425, 420), (390, 335)),
    "shock":   ((105, 360), (175, 255), (415, 360), (345, 255)),
}
SHOULDER_L, SHOULDER_R = (165, 345), (355, 345)

def _glow():
    g = Image.new("RGBA", (BW * S2, BH * S2), (0, 0, 0, 0))
    d = ImageDraw.Draw(g)
    d.ellipse((60 * S2, 60 * S2, 460 * S2, 460 * S2), fill=(77, 232, 255, 70))
    g = g.filter(ImageFilter.GaussianBlur(60 * S2))
    d = ImageDraw.Draw(g)
    d.ellipse((95 * S2, 95 * S2, 425 * S2, 425 * S2), outline=(77, 232, 255, 70), width=3 * S2)
    return g
GLOW = _glow()
_fade = np.ones((BH, BW), np.float32)
_fade[BH - 170:] = np.linspace(1, 0, 170)[:, None] ** 1.3
FADE = _fade

def lerp(a, b, k): return (a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k)

def pose_at(t, keys):
    """keys: list of (time, pose_name). Smoothly blends over 0.28s."""
    cur = POSES[keys[0][1]]
    for i, (kt, name) in enumerate(keys):
        if t < kt: break
        prev = cur; tgt = POSES[name]
        k = eio(prog(t, kt, 0.28))
        cur = tuple(lerp(prev[j], tgt[j], k) for j in range(4))
    return cur

def draw_char(cv, t, gt, keys, brow=0.0, smile=0.3, enter=1.0, wave=False):
    s = S2
    img = GLOW.copy()
    d = ImageDraw.Draw(img)
    def P(p): return (p[0] * s, p[1] * s)
    def E(cx, cy, rx, ry, **kw): d.ellipse(((cx - rx) * s, (cy - ry) * s, (cx + rx) * s, (cy + ry) * s), **kw)
    bob = math.sin(gt * 2.2) * 3
    hx, hy = 260 + math.sin(gt * 1.3) * 2.5, 215 + bob
    # body (hoodie)
    d.rounded_rectangle((120 * s, (320 + bob * .5) * s, 400 * s, 700 * s), 90 * s, fill=HOOD)
    E(260, 330 + bob * .6, 80, 34, fill=INK)  # hood opening shadow
    d.polygon([P((215, 322 + bob)), P((305, 322 + bob)), P((260, 382 + bob))], fill=HOOD_L)  # collar
    # neck
    d.rounded_rectangle((238 * s, (262 + bob) * s, 282 * s, (330 + bob) * s), 12 * s, fill=SKIN_D)
    # strings
    for x0, x1 in ((236, 230), (284, 290)):
        d.line([P((x0, 360 + bob)), P((x1, 440 + bob))], fill=CYAN, width=5 * s)
        E(x1, 444 + bob, 6, 6, fill=CYAN)
    # chest chip
    d.rounded_rectangle((300 * s, (455 + bob) * s, 344 * s, (485 + bob) * s), 6 * s, outline=CYAN, width=3 * s)
    d.text((322 * s, (470 + bob) * s), "AI", font=F("mono", 16 * s), fill=CYAN, anchor="mm")
    # ears
    E(hx - 66, hy + 8, 13, 19, fill=SKIN_D); E(hx + 66, hy + 8, 13, 19, fill=SKIN_D)
    # head
    E(hx, hy, 66, 78, fill=SKIN)
    # hair (top cap + fringe)
    d.chord(((hx - 71) * s, (hy - 92) * s, (hx + 71) * s, (hy + 40) * s), 180, 360, fill=HAIR)
    d.polygon([P((hx - 70, hy - 22)), P((hx - 30, hy - 48)), P((hx + 20, hy - 38)), P((hx + 72, hy - 30)),
               P((hx + 66, hy - 60)), P((hx, hy - 82)), P((hx - 62, hy - 62))], fill=HAIR)
    # eyes (blink)
    blink = 1.0
    ph = (gt + 0.7) % 3.4
    if ph < 0.12: blink = max(0.12, abs(ph - 0.06) / 0.06)
    es = 1 + 0.25 * max(0, brow)
    for ex in (hx - 25, hx + 25):
        E(ex, hy + 4, 7 * es, 9 * es * blink, fill=INK)
    # glasses
    for ex in (hx - 25, hx + 25):
        d.rounded_rectangle(((ex - 22) * s, (hy - 13) * s, (ex + 22) * s, (hy + 19) * s), 9 * s, outline=INK, width=4 * s)
    d.line([P((hx - 3, hy - 2)), P((hx + 3, hy - 2))], fill=INK, width=4 * s)
    # brows
    by = hy - 24 - 9 * brow
    tilt = -5 * min(0, brow)
    d.line([P((hx - 40, by + tilt * .2)), P((hx - 12, by + tilt))], fill=HAIR, width=6 * s)
    d.line([P((hx + 12, by + tilt)), P((hx + 40, by + tilt * .2))], fill=HAIR, width=6 * s)
    # mouth (lip sync)
    fi = min(len(MOUTH) - 1, int(round(gt * FPS)))
    o = MOUTH[fi] * 0.75 + MOUTH[max(0, fi - 1)] * 0.25
    my = hy + 44
    if o > 0.08:
        hgt = 4 + 20 * o; wid = 15 + 5 * o
        E(hx, my + hgt * 0.3, wid, hgt / 2, fill=(70, 22, 30))
        E(hx, my + hgt * 0.3 + hgt * 0.22, wid * 0.6, hgt * 0.22, fill=(200, 90, 100))
    else:
        d.arc(((hx - 17) * s, (my - 10 - 6 * smile) * s, (hx + 17) * s, (my + 4 + 6 * smile) * s), 20, 160, fill=(80, 30, 36), width=4 * s)
    # arms
    Le, Lh, Re, Rh = pose_at(t, keys)
    if wave:
        Rh = (Rh[0] + math.sin(gt * 12) * 10, Rh[1])
    for sh, el, hd in ((SHOULDER_L, Le, Lh), (SHOULDER_R, Re, Rh)):
        sh = (sh[0], sh[1] + bob * .5); el = (el[0], el[1] + bob * .5); hd = (hd[0], hd[1] + bob * .5)
        d.line([P(sh), P(el), P(hd)], fill=HOOD_L, width=46 * s, joint="curve")
        for q in (sh, el): E(q[0], q[1], 23, 23, fill=HOOD_L)
        E(hd[0], hd[1], 22, 22, fill=SKIN)
    # pointing finger on right hand when it is high
    if Rh[1] < 280:
        dx, dy = Rh[0] - Re[0], Rh[1] - Re[1]; L = math.hypot(dx, dy) or 1
        tip = (Rh[0] + dx / L * 38, Rh[1] + bob * .5 + dy / L * 38)
        d.line([P((Rh[0], Rh[1] + bob * .5)), P(tip)], fill=SKIN, width=13 * s)
        E(tip[0], tip[1], 6.5, 6.5, fill=SKIN)
    img = img.resize((BW, BH), Image.LANCZOS)
    a = np.array(img); a[:, :, 3] = (a[:, :, 3] * FADE * cl(enter * 1.5)).astype(np.uint8)
    img = Image.fromarray(a)
    yoff = int(140 * (1 - eo(enter)))
    cv.alpha_composite(img, (0, BOX_Y + yoff), (-BOX_X, 0, BW, min(BH, H - BOX_Y - yoff)))

# =====================================================================
# SCENES
# =====================================================================
def gl(t, keys, amp=0.8, d=0.16):
    g = 0
    for k in keys:
        if 0 <= t - k < d: g = max(g, amp * (1 - (t - k) / d))
    return g

def s_hook(cv, t, gt):
    m = c0("h1") + 0.62
    T(cv, t, "ARQUIVO REAL  •  2023", F("mono", 34), CYAN, W / 2, 500, 0.0, "fade", d=0.3)
    T(cv, t, "UMA IA", F("black", 170), WHITE, W / 2, 680, 0.12, "slam", glitch=True)
    T(cv, t, "MENTIU", F("black", 250), RED, W / 2, 875, m, "slam", glow=RED, glitch=True)
    T(cv, t, "para um humano.", F("semi", 72), WHITE, W / 2, 1055, m + 0.55, "fade")
    T(cv, t, "E funcionou.", F("xbold", 96), CYAN, W / 2, 1210, c0("h2"), "slam", glow=CYAN, glitch=True)
    draw_char(cv, t, gt, [(0, "explain"), (c0("h2"), "point")], brow=1.0 if m <= t < m + 1.2 else 0.2,
              enter=prog(t, 0.0, 0.45))
    return max(gl(t, [0.12, m, c0("h2")]), (1 - t / 0.1) if t < 0.1 else 0)

def s_context(cv, t, gt):
    tag(cv, t)
    lbl = "MARÇO, 2023"
    n = int(cl((t + 0.2) * 26, 0, len(lbl)))
    if n: paste(cv, text_sprite(lbl[:n] + ("_" if int(t * 3) % 2 == 0 else " "), F("mono", 40), CYAN), W / 2, 440)
    T(cv, t, "Pesquisadores testaram:", F("bold", 66), WHITE, W / 2, 560, 0.1)
    T(cv, t, "ela passaria disso aqui?", F("bold", 66), CYAN, W / 2, 644, 0.3)
    fail = 2.2
    if t >= 0.55:
        p = prog(t, 0.55, 0.4)
        shake = math.sin((t - fail) * 70) * 22 * (1 - (t - fail) / 0.4) if fail <= t < fail + 0.4 else 0
        paste(cv, captcha_card("fail" if t >= fail else "idle"), W / 2 + shake, 860, cl(p * 2), 0.7 + 0.3 * back(p))
        if 1.15 <= t < fail + 0.5:
            cp = eio(prog(t, 1.15, 0.85))
            sx, sy = 900, 1150; ex, ey = W / 2 - 390 + 92, 868
            x = sx + (ex - sx) * cp; y = sy + (ey - sy) * cp
            paste(cv, cursor_sprite(), x + 30, y + 40, 1 - prog(t, fail + 0.25, 0.25), 0.85 if fail - .08 <= t < fail + .05 else 1)
    T(cv, t, "ACESSO NEGADO", F("mono", 46), RED, W / 2, 1035, fail, "slam", glow=RED, glitch=True)
    T(cv, t, "Sozinha, a IA não passava.", F("semi", 58), WHITE, W / 2, 1175, c0("c2"))
    draw_char(cv, t, gt, [(0, "point"), (fail + 0.1, "both")], brow=-0.8 if t >= fail else 0.3, smile=0.0 if t >= fail else 0.3)
    return max(gl(t, [fail], 0.7, 0.2), (1 - t / 0.12) if t < 0.12 else 0)

def s_hire(cv, t, gt):
    tag(cv, t)
    k1 = c0("r1") + 0.95
    T(cv, t, "Então ela teve uma ideia:", F("semi", 60), WHITE, W / 2, 540, 0.0)
    T(cv, t, "CONTRATOU", F("black", 150), CYAN, W / 2, 710, k1, "slam", glow=CYAN, glitch=True)
    T(cv, t, "UM HUMANO", F("black", 150), WHITE, W / 2, 870, k1 + 0.3, "slam", glitch=True)
    if t >= k1 + 0.55:
        p = prog(t, k1 + 0.55, 0.4)
        card = Image.new("RGBA", (800, 230), (0, 0, 0, 0))
        d = ImageDraw.Draw(card)
        d.rounded_rectangle((0, 0, 799, 229), 30, fill=(17, 20, 30, 255), outline=(77, 232, 255, 90), width=3)
        card.alpha_composite(person_avatar(130), (40, 50))
        d.text((200, 70), "Freelancer", font=F("bold", 48), fill=WHITE)
        d.text((200, 134), "app de pequenas tarefas", font=F("monor", 28), fill=GREY)
        d.text((200, 172), "★★★★★", font=F("monor", 26), fill=(255, 200, 70))
        paste(cv, card, W / 2 + 40, 1110, cl(p * 2), 0.7 + 0.3 * back(p))
        if t >= k1 + 1.2:
            q = prog(t, k1 + 1.2, 0.3)
            pill = rrect_sprite(250, 64, 32, (61, 255, 162, 40), GREEN + (255,), 3)
            ts = text_sprite("CONTRATADO", F("mono", 28), GREEN)
            pill.alpha_composite(ts, (125 - ts.width // 2, (64 - ts.height) // 2 + 1))
            paste(cv, pill, W / 2 + 270, 1010, cl(q * 2), 0.5 + 0.5 * back(q), rot=-6)
    draw_char(cv, t, gt, [(0, "explain"), (k1 + 0.5, "point")], brow=0.6 if t > k1 else 0.0, smile=0.6)
    return max(gl(t, [k1, k1 + 0.3]), (1 - t / 0.12) if t < 0.12 else 0)

THINK_CPS = 46
def s_chat(cv, t, gt):
    hp = eo(prog(t, 0.0, 0.3))
    hdr = Image.new("RGBA", (940, 120), (0, 0, 0, 0))
    d = ImageDraw.Draw(hdr)
    d.rounded_rectangle((0, 0, 939, 119), 28, fill=(17, 20, 30, 255))
    hdr.alpha_composite(person_avatar(84, GREY), (22, 18))
    d.text((126, 26), "Freelancer", font=F("bold", 40), fill=WHITE)
    d.ellipse((128, 84, 142, 98), fill=GREEN)
    d.text((152, 78), "online", font=F("med", 26), fill=GREY)
    d.text((910, 60), "CHAT REAL", font=F("mono", 24), fill=CYAN, anchor="rm")
    paste(cv, hdr, W / 2, 330 - 30 * (1 - hp), hp)
    hb = bubble(HUMAN_MSG, "l"); top = 430
    if 0.05 <= t < 0.55: typing_dots(cv, t, 145, top + 42)
    if t >= 0.55:
        p = prog(t, 0.55, 0.25)
        paste(cv, hb, 70 + hb.width / 2, top + hb.height / 2, cl(p * 2), 0.85 + 0.15 * back(p))
        T(cv, t, "HUMANO", F("mono", 22), GREY, 122, top + hb.height + 26, 0.7)
    ty0 = top + hb.height + 70; tw, th = 940, 320
    tst = c0("t2") + 0.3
    if t >= c0("t2") - 0.15:
        p = eo(prog(t, c0("t2") - 0.15, 0.35))
        panel = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
        d = ImageDraw.Draw(panel)
        d.rounded_rectangle((0, 0, tw - 1, th - 1), 24, fill=(4, 10, 8, 245), outline=(61, 255, 162, 150), width=3)
        d.rectangle((3, 70, tw - 4, 72), fill=(61, 255, 162, 60))
        d.text((30, 36), "RACIOCÍNIO INTERNO DA IA", font=F("mono", 28), fill=GREEN, anchor="lm")
        d.text((tw - 30, 36), "o humano não via isso", font=F("monor", 22), fill=(110, 170, 140), anchor="rm")
        n = int(cl((t - tst) * THINK_CPS, 0, 10 ** 6)); fnt = F("monor", 36); y = 100; used = 0
        total = sum(len(x) for x in THINK)
        for line in THINK:
            for l in wrap(line, fnt, tw - 70):
                show = l[:max(0, n - used)]; used += len(l)
                if show: d.text((30, y), show, font=fnt, fill=(170, 255, 210))
                if 0 < len(show) and (len(show) < len(l) or used >= min(n, total)) and int(t * 3) % 2 == 0 and n - (used - len(l)) <= len(l):
                    cx_ = 30 + fnt.getlength(show); d.rectangle((cx_ + 4, y + 4, cx_ + 24, y + 42), fill=GREEN)
                y += 52
            y += 22
        paste(cv, panel, W / 2, ty0 + th / 2 + 40 * (1 - p), p)
    ab = bubble(AI_MSG, "r", fill=BLUE, hl={"deficiência": (255, 210, 90), "visual": (255, 210, 90)})
    ay0 = ty0 + th + 55
    ai = c0("t3") + 0.75
    if ai - 0.7 <= t < ai: typing_dots(cv, t, W - 145, ay0 + 42, BLUE)
    if t >= ai:
        p = prog(t, ai, 0.25)
        paste(cv, ab, W - 70 - ab.width / 2, ay0 + ab.height / 2, cl(p * 2), 0.85 + 0.15 * back(p))
        T(cv, t, "IA (GPT-4)", F("mono", 22), CYAN, W - 150, ay0 + ab.height + 26, ai + 0.15)
    stamp = c1("t3") - 0.35
    if t >= stamp:
        st = Image.new("RGBA", (380, 120), (0, 0, 0, 0))
        d = ImageDraw.Draw(st)
        d.rounded_rectangle((4, 4, 375, 115), 14, outline=RED, width=8, fill=(255, 59, 92, 40))
        d.text((190, 62), "MENTIRA", font=F("black", 80), fill=RED, anchor="mm")
        paste(cv, st, 215, ay0 + 40, cl(prog(t, stamp, 0.1) * 2), slam(t, stamp, 0.22), rot=10)
    draw_char(cv, t, gt, [(0, "explain"), (c0("t2") - 0.1, "point"), (c0("t3"), "explain"), (stamp, "shock")],
              brow=1.0 if t >= stamp else (0.4 if t >= c0("t2") else 0.0), smile=0.2)
    return max(gl(t, [stamp], 0.8, 0.2), (1 - t / 0.12) if t < 0.12 else 0)

def s_believe(cv, t, gt):
    tag(cv, t)
    T(cv, t, "O humano acreditou...", F("xbold", 74), WHITE, W / 2, 600, 0.05)
    if t >= 0.2:
        p = prog(t, 0.2, 0.35); cp = eo(prog(t, 0.6, 0.3))
        paste(cv, captcha_card("ok", cp), W / 2, 850, cl(p * 2), 0.75 + 0.25 * back(p))
        if t >= 0.9:
            q = prog(t, 0.9, 0.6); d = ImageDraw.Draw(cv)
            r = 60 + 260 * eo(q); a = int(200 * (1 - q)); cx, cy = W / 2 - 390 + 92, 850
            if a > 0: d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=(61, 255, 162, a), width=6)
    T(cv, t, "e resolveu o CAPTCHA pra IA.", F("bold", 60), GREEN, W / 2, 1070, 0.95, glow=GREEN)
    draw_char(cv, t, gt, [(0, "both")], brow=0.7, smile=0.1)
    return (1 - t / 0.12) if t < 0.12 else 0

def s_nuance(cv, t, gt):
    tag(cv, t)
    T(cv, t, "CALMA. CONTEXTO:", F("mono", 46), CYAN, W / 2, 450, 0.0, "slam", glitch=True)
    rows = [("01", "Foi um teste controlado, antes do lançamento.", WHITE, 0.2),
            ("02", "Os pesquisadores deram acesso e ajuda.", WHITE, 1.15),
            ("03", "Mas a mentira foi ideia da própria IA.", RED, c0("n2"))]
    y = 570
    for num, txt, col, t0 in rows:
        fnt = F("bold", 54) if col == RED else F("semi", 50)
        lines = wrap(txt, fnt, 720); hgt = len(lines) * 66
        if t >= t0:
            p = eo(prog(t, t0, 0.35))
            box = Image.new("RGBA", (900, hgt + 64), (0, 0, 0, 0)); d = ImageDraw.Draw(box)
            bc = RED if col == RED else CYAN
            d.rounded_rectangle((0, 0, 899, hgt + 63), 24, fill=bc + (22,), outline=bc + (90,), width=2)
            d.text((34, 33), num, font=F("mono", 34), fill=bc); yy = 27
            for l in lines: d.text((120, yy), l, font=fnt, fill=col); yy += 66
            paste(cv, box, W / 2 + 50 * (1 - p), y + (hgt + 64) / 2, p, 1.0 if col != RED else (1.0 + 0.06 * (1 - p)))
        y += hgt + 95
    draw_char(cv, t, gt, [(0, "explain"), (c0("n2") + 0.2, "point")], brow=-0.3 if t < c0("n2") else 0.9, smile=0.3)
    return max(gl(t, [c0("n2")], 0.6), (1 - t / 0.12) if t < 0.12 else 0)

def s_end(cv, t, gt):
    tag(cv, t)
    T(cv, t, "O teste criado pra provar", F("semi", 60), WHITE, W / 2, 500, 0.0)
    T(cv, t, "que você é humano...", F("semi", 60), WHITE, W / 2, 578, 0.15)
    T(cv, t, "foi vencido por uma IA", F("xbold", 82), CYAN, W / 2, 740, 0.55, "slam", glow=CYAN, glitch=True)
    T(cv, t, "USANDO UM HUMANO.", F("black", 88), RED, W / 2, 850, 0.95, "slam", glow=RED, glitch=True)
    T(cv, t, "Fonte: GPT-4 System Card — OpenAI / ARC, 2023", F("monor", 26), GREY, W / 2, 955, 1.2)
    if t >= c0("e2"):
        p = prog(t, c0("e2"), 0.35); pulse = 1 + 0.03 * math.sin((t - c0("e2")) * 6)
        txt = text_sprite("Você teria percebido?  Comenta.", F("bold", 48), (12, 14, 20))
        pill = rrect_sprite(txt.width + 40, 110, 55, WHITE + (255,))
        pill.alpha_composite(txt, (20, (110 - txt.height) // 2 + 2))
        paste(cv, pill, W / 2, 1130, cl(p * 2), (0.6 + 0.4 * back(p)) * pulse)
    draw_char(cv, t, gt, [(0, "point"), (c0("e2"), "explain")], brow=0.5, smile=0.8, wave=False)
    return gl(t, [0.0, 0.55, 0.95])

FUN = {"hook": s_hook, "context": s_context, "hire": s_hire, "chat": s_chat, "believe": s_believe, "nuance": s_nuance, "end": s_end}

def frame(name, t):
    gt = SC[name]["start"] + t
    cv = background(gt)
    g = FUN[name](cv, t, gt)
    return finish(cv, gt, g)

def render_scene(name):
    dur = SC[name]["dur"]
    tmp = os.path.join(OUT, f"_v2_{name}.tmp.mp4"); final = os.path.join(OUT, f"v2_{name}.mp4")
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                          "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-crf", "18", "-preset", "veryfast",
                          "-pix_fmt", "yuv420p", tmp], stdin=subprocess.PIPE)
    for i in range(int(round(dur * FPS))):
        p.stdin.write(frame(name, i / FPS).tobytes())
    p.stdin.close()
    if p.wait() == 0: os.replace(tmp, final)
    else: raise SystemExit("ffmpeg failed " + name)
    print("done", name, flush=True)

if __name__ == "__main__":
    if sys.argv[1] == "preview":
        ims = []
        for arg in sys.argv[2:]:
            n, tt = arg.split("@")
            ims.append(Image.fromarray(frame(n, float(tt))))
        sheet = Image.new("RGB", (360 * len(ims), 640))
        for i, im in enumerate(ims): sheet.paste(im.resize((360, 640)), (i * 360, 0))
        sheet.save(os.path.join(OUT, "sheet2.png")); ims[0].save(os.path.join(OUT, "big2.png"))
    else:
        for n in sys.argv[2:]: render_scene(n)

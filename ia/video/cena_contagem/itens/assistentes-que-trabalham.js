// Reel 🆕 contagem "3 assistentes de IA que trabalham sozinhos" (Talorys, OpenDuet, agent-autoloop; 15/11 19:00). Motor da cena_contagem.
// Identidade: escritório à noite com as luzes acesas e ninguém nas mesas, só robozinhos genéricos (blocos azuis) trabalhando sozinhos;
// o mascote dança no meio porque não precisa fazer nada. Nº 3: caderno de lembretes com um sininho; nº 2: robô que empilha papéis prontos;
// nº 1: robô trabalhando no fundo e um telefone que só toca quando aparece um "?". Azul-noite + amarelo-luminária + coral.
// Elementos: placa de rua, nome em carimbo, placar HI-SCORE, tarja de TV, zoom atravessando uma tela, órbita, pódio, Caveat.
// Mascote de fone de ouvido grande; ação principal: dançar.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const NOITE = "#16213e", NOITE2 = "#0e1630", LUM = "#ffd166", CORAL = "#ff6b6b", AZR = "#4f8cff", TINTA = "#141a2a", FUNDO = "#eef1f8", CREME = "#fffaf0", VERDE = "#2fb36b";
rim.color.set(0x9fb8ff); rim.intensity = 1.6; key.color.set(0xfff0d6); key.intensity = 130; key.position.set(2, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xc8d4ff, .6));
// ---------- escritório à noite ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#273153"; g.fillRect(0, 0, w, h); g.fillStyle = "#0e1630"; for (let i = 0; i < 4; i++) g.fillRect(30 + i * 120, 30, 100, 110); g.fillStyle = "rgba(255,240,180,.8)"; for (let i = 0; i < 60; i++) g.fillRect(38 + (i % 4) * 120 + ((i * 17) % 80), 40 + ((i * 29) % 90), 6, 8); g.fillStyle = "#1c2645"; g.fillRect(0, 190, w, 66); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const cT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#3a4466"; g.fillRect(0, 0, w, h); for (let i = 0; i < 300; i++) { g.fillStyle = i % 2 ? "#414c70" : "#353f60"; g.fillRect((i * 37) % w, (i * 71) % h, 4, 4); } }); cT.wrapS = cT.wrapT = THREE.RepeatWrapping; cT.repeat.set(5, 3);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: cT, roughness: .8 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
const pista = mesh(new THREE.CircleGeometry(.9, 32), new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: LUM, emissiveIntensity: .25 }), S, 1.0, .01, -.1); pista.rotation.x = -Math.PI / 2; pista.castShadow = false;
// 3 mesas com luminária e robozinho
const mesa = (x, z) => { const g = new THREE.Group(); g.position.set(x, 0, z); S.add(g); box(1.2, .06, .7, M("#c9b28c", { roughness: .5 }), g, 0, .8, 0); for (const [a, b] of [[-.55, -.3], [.55, -.3], [-.55, .3], [.55, .3]]) box(.05, .8, .05, M("#555"), g, a, .4, b);
  box(.04, .5, .04, M("#333"), g, .45, 1.08, -.2); const lum = mesh(new THREE.ConeGeometry(.14, .16, 14, 1, true), E(LUM, 1.2), g, .38, 1.3, -.2); lum.rotation.z = .8;
  const tela = box(.5, .32, .03, E("#bfe3ff", .5), g, -.1, 1.05, -.25); return { g, tela }; };
const MESAS = [mesa(-2.1, -1.6), mesa(-.4, -2.0), mesa(1.4, -1.8)];
const robo = (x, y, z, c = AZR) => { const g = new THREE.Group(); g.position.set(x, y, z); S.add(g); box(.32, .28, .24, M(c, { roughness: .4 }), g, 0, .14, 0); for (const s of [-1, 1]) box(.05, .09, .02, M("#111"), g, s * .07, .17, .13); const an = box(.02, .14, .02, M("#ccc"), g, 0, .35, 0); const br = [-1, 1].map(s => box(.06, .16, .06, M(c), g, s * .2, .12, .05)); return { g, br }; };
const R3 = robo(-2.1, .83, -1.35), R2 = robo(-.4, .83, -1.75, "#7fc4ff"), R1 = robo(1.4, .83, -1.55, "#9fe3b0");
// nº 3: caderno de lembretes + sino
const CAD = new THREE.Group(); CAD.position.set(-1.8, .84, -1.45); S.add(CAD); box(.4, .03, .3, M("#fff"), CAD, 0, 0, 0); for (let i = 0; i < 4; i++) box(.3, .005, .02, M("#99a"), CAD, 0, .02, -.1 + i * .06); const SINO = new THREE.Group(); SINO.position.set(-1.6, 1.5, -1.3); S.add(SINO); mesh(new THREE.ConeGeometry(.12, .16, 16, 1, true), M(LUM, { metalness: .7, roughness: .3, side: THREE.DoubleSide }), SINO, 0, 0, 0); mesh(new THREE.SphereGeometry(.03, 8, 6), M("#a77"), SINO, 0, -.08, 0);
// nº 2: pilha de papéis prontos
const PAP = []; for (let i = 0; i < 10; i++) { const p = box(.3, .012, .22, M(i % 2 ? "#fff" : "#f2f6ff"), S, 0, 0, 0); p.visible = false; PAP.push(p); }
// nº 1: telefone que só toca com "?"
const TEL = new THREE.Group(); TEL.position.set(1.75, .84, -1.5); S.add(TEL); box(.28, .1, .2, M(CORAL), TEL, 0, .05, 0); const fone = box(.32, .06, .08, M(CORAL), TEL, 0, .13, 0);
const interT = ctex(96, 96, g => { g.fillStyle = "#fff"; g.beginPath(); g.arc(48, 48, 44, 0, 7); g.fill(); g.fillStyle = CORAL; g.font = "700 70px CV"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("?", 48, 52); });
const INTER = mesh(new THREE.PlaneGeometry(.4, .4), new THREE.MeshBasicMaterial({ map: interT, transparent: true }), S, 1.75, 1.55, -1.3); INTER.castShadow = false;
// ---------- mascote: fone grande; dança ----------
const FON = new THREE.Group(); FON.position.set(0, 1.5, 0); MAS.corpo.add(FON); mesh(new THREE.TorusGeometry(.78, .05, 8, 24, Math.PI), M("#222"), FON, 0, 0, 0); for (const s of [-1, 1]) mesh(new THREE.CylinderGeometry(.22, .22, .16, 16), M(CORAL), FON, s * .78, -.05, 0).rotation.z = Math.PI / 2;
const MX = 1.0, MZ = -.1;
const danca = (lt, x = MX, z = MZ) => { const b = lt * 2 * Math.PI * 1.1; pose(MAS, { x: x + Math.sin(b / 2) * .15, z, y: Math.abs(Math.sin(b)) * .18, ry: Math.sin(b / 2) * .5, braco: [1.4 + Math.sin(b) * .8, 1.4 - Math.sin(b) * .8], sq: Math.max(0, -Math.sin(b)) * .06, piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(b / 2) * .1; };
const NS = ["gancho", "n3", "n2", "n1", "cta"]; NS.forEach(n => grupo(n));
const digita = (r, lt, on = 1) => { r.br.forEach((b, i) => b.position.y = .12 + (on ? Math.abs(Math.sin(lt * 14 + i * 1.7)) * .05 : 0)); };
const reset = (lt) => { [R3, R2, R1].forEach(r => digita(r, lt)); MESAS.forEach((m, i) => m.tela.material.emissiveIntensity = .4 + Math.max(0, Math.sin(lt * 3 + i)) * .4); PAP.forEach(p => p.visible = false); SINO.visible = false; INTER.visible = false; pista.material.emissiveIntensity = .2 + Math.max(0, Math.sin(lt * 7)) * .3; fone.position.y = .13; };
// ---------- órbita ----------
const ORB = { gancho: [-.3, .1, 7.6, 2.5, V(0, 1.3, -.8)], n3: [.25, -.05, 6.8, 2.3, V(-1.0, 1.2, -1.0)], n2: [-.2, .1, 6.8, 2.4, V(-.2, 1.2, -1.2)], n1: [.2, -.1, 6.8, 2.3, V(1.0, 1.3, -1.0)], cta: [.05, -.08, 8.0, 2.5, V(0, 1.2, -.6)] };
const SHOTS = {}; NS.forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a0, a1, r, y, l] = ORB[nome] || ORB.cta, a = a0 + (a1 - a0) * eio(lt / d); cam.position.set(l.x + Math.sin(a) * r, y, l.z + Math.cos(a) * r); cam.lookAt(l); };
const ACT = {
  gancho(lt) { reset(lt); danca(lt); },
  n3(lt) { reset(lt); SINO.visible = true; SINO.rotation.z = Math.sin(lt * 18) * .4 * (lt % 1.6 < .5 ? 1 : 0); danca(lt); },
  n2(lt, d) { reset(lt); PAP.forEach((p, i) => { const u = Math.max(0, Math.min(1, lin(lt, .2, d) * 1.4 - i * .1)); p.visible = u > 0; p.position.set(-.1 + (1 - eio(u)) * -.3, .86 + i * .014 + (1 - eio(u)) * .4, -1.45); p.rotation.y = (1 - u) * 2; }); danca(lt); },
  n1(lt, d) { reset(lt); const tem = lt > 1.6 && lt < 3.0; INTER.visible = tem; INTER.scale.setScalar(Math.max(.01, back(lin(lt, 1.6, 1.9)))); fone.position.y = .13 + (tem ? Math.abs(Math.sin(lt * 30)) * .04 : 0); digita(R1, lt, !tem); tem ? (pose(MAS, { x: MX + .3, z: MZ, y: 0, ry: .4, braco: [.3, 1.6], piscar: pisca(lt) }), MAS.g.rotation.z = 0) : danca(lt); },
  cta(lt) { reset(lt); danca(lt, 1.7, 1.1); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, ITENS } = C; const GY3 = 620; let CAB = null;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `700 ${f}px CV`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const fmtP = n => Math.round(n).toLocaleString("pt-BR");
  const carimbo = (txt, x, y, lt, t0, cor, rot = -.08) => { if (lt < t0) return; const k = lin(lt, t0, t0 + .18), s = 2.4 - 1.4 * eo(k), tr = k >= 1 ? Math.max(0, 1 - (lt - t0 - .18) / .15) : 0; const fs = cabe(84, txt, 560);
    X.save(); X.translate(x + Math.sin(lt * 80) * 6 * tr, y); X.rotate(rot); X.scale(s, s); X.globalAlpha = Math.min(1, .3 + k); X.font = `700 ${fs}px CV`; const w = X.measureText(txt).width + 60;
    X.fillStyle = "rgba(255,250,240,.95)"; X.beginPath(); X.roundRect(0, -fs * .7, w, fs * 1.4, 12); X.fill(); X.strokeStyle = cor; X.lineWidth = 8; X.stroke(); X.fillStyle = cor; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText(txt, 30, 4); X.restore(); X.globalAlpha = 1; };
  const U = {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 60], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(238,241,248,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (CAB && nome !== "gancho" && nome !== "cta") U.cab2(...CAB); CAB = null; },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.fillStyle = "#7a8090"; X.fillRect(-330, 118, 18, 60); X.fillRect(312, 118, 18, 60);
      X.fillStyle = "#1d5c3a"; X.beginPath(); X.roundRect(-460, -132, 920, 264, 16); X.fill(); X.strokeStyle = "#fff"; X.lineWidth = 6; X.beginPath(); X.roundRect(-447, -119, 894, 238, 10); X.stroke();
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = "#fff"; cabe(64, l1, 840); X.fillText(l1, 0, -34); X.fillStyle = LUM; cabe(62, l2, 840); X.fillText(l2, 0, 32); X.fillStyle = "#cfeedd"; cabe(48, l3, 840); X.fillText(l3, 0, 94); X.restore(); },
    cabecalho(s, lt, t) { CAB = [s, lt, t]; },
    cab2(s, lt, t) { const y = 680; X.fillStyle = CORAL; X.beginPath(); X.arc(100, y, 44, 0, 7); X.fill(); X.fillStyle = "#fff"; X.font = "700 60px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag.replace(/\D/g, ""), 100, y + 3);
      carimbo(s.item, 160, y, lt, .15, NOITE);
      const v = s.estrelas * eio(lin(lt, .4, 1.9)); X.fillStyle = NOITE2; X.beginPath(); X.roundRect(600, 770, 340, 160, 14); X.fill(); X.strokeStyle = LUM; X.lineWidth = 5; X.stroke(); X.fillStyle = LUM; X.font = "400 24px PS"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("HI-SCORE", 770, 806);
      X.fillStyle = "#fff"; X.font = "700 74px CV"; X.fillText(fmtP(v), 770, 860); X.fillStyle = "#c9d4ff"; X.font = "700 24px CV"; X.fillText("★ estrelas no GitHub", 770, 904); },
    legenda(seg, t) { const ch = C.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 74; X.font = `700 ${fs}px CV`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 780 && fs > 40) { fs -= 2; X.font = `700 ${fs}px CV`; }
      const y = 1405, x0 = 505 - tot() / 2; X.fillStyle = NOITE; X.fillRect(40, y - 56, 910, 112); X.fillStyle = LUM; X.fillRect(40, y + 48, 910, 8); X.fillStyle = CORAL; X.fillRect(60, y - 90, 300, 40); X.fillStyle = "#fff"; X.font = "700 28px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("PLANTÃO DA NOITE", 210, y - 70);
      let x = x0; X.font = `700 ${fs}px CV`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? LUM : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 240 + u * 2300, h = w * .62;
      X.save(); X.fillStyle = NOITE2; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 14 * (1 - u) + 4); X.fill("evenodd"); X.restore(); },
    fechamento(lt) { X.fillStyle = "rgba(238,241,248,.45)"; X.fillRect(0, 640, 1080, 860);
      const it = ITENS.slice().reverse(), P = [[it[0], 410, 210, CORAL, 1], [it[1], 190, 150, AZR, 2], [it[2], 630, 110, VERDE, 3]];
      P.forEach(([s, x, h, c, n], i) => { const k = eo(lin(lt, .1 + i * .15, .5 + i * .15)), hh = h * k, base = 1330; X.fillStyle = c; X.fillRect(x - 100, base - hh, 200, hh); X.fillStyle = "rgba(0,0,0,.2)"; X.fillRect(x - 100, base - hh, 200, 12);
        if (k > .6) { X.fillStyle = "#fff"; X.font = "700 66px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(n + "º", x, base - hh + 56); X.fillStyle = TINTA; X.font = `700 ${cabe(44, s.item, 200)}px CV`; X.fillText(s.item, x, base - hh - 66); X.fillStyle = "#555"; X.font = "700 30px CV"; X.fillText(fmtP(s.estrelas) + " ★", x, base - hh - 26); } });
      X.fillStyle = TINTA; X.fillRect(70, 1330, 690, 12);
      const p = back(lin(lt, .7, 1.1)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 760); X.scale(p, p); X.fillStyle = CORAL; X.beginPath(); X.roundRect(-290, -62, 580, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = `700 ${cabe(80, "Comenta " + CHAVE, 540)}px CV`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 4); X.restore();
      if (lt > 1.1) { X.globalAlpha = eo(lin(lt, 1.1, 1.5)); X.fillStyle = TINTA; X.font = "700 40px CV"; X.textAlign = "center"; X.fillText("Que tarefa do trabalho você largaria pra eles?", 505, 1410); X.globalAlpha = 1; } },
  }; return U; };
const cores = { LAR: CORAL, VERDE: LUM, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

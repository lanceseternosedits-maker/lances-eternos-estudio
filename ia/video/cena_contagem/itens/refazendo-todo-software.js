// Reel 🆕 "Estão refazendo todo programa do mundo" (Everything, do pessoal do Puter; 15/11 11:00). Motor da cena_contagem.
// Identidade: pista de skate de concreto ao ar livre, à tarde: rampas, corrimão, grafites geométricos; janelas de programas genéricos
// (texto, planilha, foto, navegador, música) viram caixas de papelão abertas com a etiqueta "CÓDIGO ABERTO" e saem distribuídas pela pista.
// Concreto + laranja-cone + azul-elétrico. Sem logo de empresa. Elementos: página de caderno, nome em carimbo, velocímetro, tarja de TV,
// zoom atravessando uma tela, órbita, pódio, Caveat. Mascote de capacete de skate e joelheira; ação principal: andar de skate.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const CONC = "#b9b6ae", CONE = "#ff7a1a", AZE = "#2f6fff", AZE2 = "#1a3fa8", TINTA = "#1c1c22", FUNDO = "#f2f1ec", CREME = "#fffaf0", VERDE = "#2fb36b", ROSA = "#ff5fa2", AMAR = "#ffd23f";
rim.color.set(0xffd8b0); rim.intensity = 1.5; key.color.set(0xfff4e6); key.intensity = 150; key.position.set(3, 10, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xfff4ea, .6));
// ---------- pista ----------
const ceuT = ctex(512, 256, (g, w, h) => { const sk = g.createLinearGradient(0, 0, 0, h); sk.addColorStop(0, "#7fb8ff"); sk.addColorStop(1, "#ffe0c0"); g.fillStyle = sk; g.fillRect(0, 0, w, h); g.fillStyle = "#c9c4b8"; g.fillRect(0, 170, w, 86); [[30, CONE], [150, AZE], [280, ROSA], [400, VERDE]].forEach(([x, c]) => { g.fillStyle = c; g.beginPath(); g.moveTo(x, 250); g.lineTo(x + 40, 185); g.lineTo(x + 80, 250); g.fill(); g.fillRect(x + 50, 200, 40, 40); }); });
mesh(new THREE.PlaneGeometry(26, 12), new THREE.MeshBasicMaterial({ map: ceuT }), S, 0, 5, -5).castShadow = false;
const cT = ctex(256, 256, (g, w, h) => { g.fillStyle = CONC; g.fillRect(0, 0, w, h); for (let i = 0; i < 600; i++) { g.fillStyle = i % 2 ? "#c4c1b9" : "#aeaba3"; g.fillRect((i * 37) % w, (i * 71) % h, 2, 2); } g.strokeStyle = "#a09d95"; g.lineWidth = 2; g.strokeRect(0, 0, w, h); }); cT.wrapS = cT.wrapT = THREE.RepeatWrapping; cT.repeat.set(6, 4);
const chao = mesh(new THREE.PlaneGeometry(26, 14), new THREE.MeshStandardMaterial({ map: cT, roughness: .9 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// rampas (quarter pipe) + corrimão
const rampa = (x, z, ry) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; S.add(g); const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(1.4, 0); sh.lineTo(1.4, 1.1); sh.quadraticCurveTo(.2, 1.0, 0, 0); const geo = new THREE.ExtrudeGeometry(sh, { depth: 1.8, bevelEnabled: false }); mesh(geo, M("#c9c5bc", { roughness: .8 }), g, 0, 0, -.9); box(.06, .06, 1.8, M("#888", { metalness: .8 }), g, 1.4, 1.12, 0); return g; };
rampa(-3.6, -1.6, 0); rampa(3.6, -1.6, Math.PI);
box(2.0, .05, .05, M("#999", { metalness: .8 }), S, .6, .5, -.9); for (const x of [-.3, 1.5]) box(.05, .5, .05, M("#999", { metalness: .8 }), S, x, .25, -.9);
for (let i = 0; i < 4; i++) { const c = mesh(new THREE.ConeGeometry(.12, .34, 12), M(CONE, { roughness: .5 }), S, -2.2 + i * 1.5, .17, .9 - (i % 2) * .4); }
// janelas de programas → caixas "código aberto"
const progT = (tipo) => ctex(200, 150, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 200, 150); g.fillStyle = "#e7ecf2"; g.fillRect(0, 0, 200, 22); ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(12 + i * 14, 11, 5, 0, 7); g.fill(); });
  if (tipo === 0) { g.fillStyle = "#bbb"; for (let i = 0; i < 6; i++) g.fillRect(16, 36 + i * 16, 168 - (i % 3) * 30, 6); }
  if (tipo === 1) { g.strokeStyle = "#9ad"; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(10, 34 + i * 18); g.lineTo(190, 34 + i * 18); g.stroke(); } for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(10 + i * 45, 26); g.lineTo(10 + i * 45, 140); g.stroke(); } g.fillStyle = VERDE; g.fillRect(55, 70, 40, 14); }
  if (tipo === 2) { g.fillStyle = "#9fd3ff"; g.fillRect(14, 30, 172, 108); g.fillStyle = "#ffd36b"; g.beginPath(); g.arc(150, 60, 16, 0, 7); g.fill(); g.fillStyle = "#4a8a4a"; g.beginPath(); g.moveTo(14, 138); g.lineTo(80, 70); g.lineTo(140, 138); g.fill(); }
  if (tipo === 3) { g.fillStyle = "#eef2f7"; g.fillRect(14, 30, 172, 22); g.fillStyle = "#ccc"; g.fillRect(14, 62, 80, 70); g.fillRect(104, 62, 82, 30); g.fillRect(104, 100, 82, 32); }
  if (tipo === 4) { g.fillStyle = ROSA; for (let i = 0; i < 12; i++) { const hh = 20 + (i * 37) % 70; g.fillRect(16 + i * 14, 130 - hh, 10, hh); } } });
const caixaT = ctex(256, 96, g => { g.fillStyle = "#c89b63"; g.fillRect(0, 0, 256, 96); g.fillStyle = "#fff"; g.fillRect(16, 22, 224, 52); g.fillStyle = VERDE; g.font = "700 34px CV"; g.textAlign = "center"; g.fillText("CÓDIGO ABERTO", 128, 60); });
const PROG = [0, 1, 2, 3, 4].map(i => { const g = new THREE.Group(); S.add(g); const jan = mesh(new THREE.PlaneGeometry(.8, .6), new THREE.MeshBasicMaterial({ map: progT(i), side: THREE.DoubleSide }), g, 0, 0, 0); jan.castShadow = false;
  const cx = new THREE.Group(); g.add(cx); box(.7, .45, .5, M("#c89b63", { roughness: .9 }), cx, 0, -.08, 0); mesh(new THREE.PlaneGeometry(.66, .25), new THREE.MeshBasicMaterial({ map: caixaT }), cx, 0, -.08, .26).castShadow = false; for (const s of [-1, 1]) { const a = box(.7, .02, .25, M("#b88a52"), cx, 0, .15, s * .3); a.rotation.x = s * .6; }
  return { g, jan, cx }; });
const progPos = i => V(-2.4 + i * 1.2, 1.9 + (i % 2) * .35, -1.6);
const progs = (k, t) => PROG.forEach((p, i) => { const u = Math.max(0, Math.min(1, k * 1.6 - i * .15)); const b = progPos(i); p.g.visible = true; p.g.position.set(b.x, b.y - eio(u) * (b.y - .3), b.z + eio(u) * (1.0 + (i % 2) * .5)); p.jan.visible = u < .5; p.cx.visible = u >= .5; p.cx.scale.setScalar(Math.max(.01, back(Math.min(1, (u - .5) * 2)))); p.g.rotation.y = Math.sin(t + i) * .15 * (1 - u); });
// ---------- mascote: capacete de skate + joelheiras; anda de skate ----------
const CAP = new THREE.Group(); CAP.position.set(0, 1.5, 0); MAS.corpo.add(CAP); const casco = mesh(new THREE.SphereGeometry(.62, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2), M(AZE, { roughness: .3 }), CAP, 0, -.05, 0); casco.scale.set(1.15, .6, .95);
MAS.pernas.forEach((p, i) => { if (i % 3 === 0) box(.2, .14, .26, M(TINTA), p, 0, .05, .02); });
const SK = new THREE.Group(); S.add(SK); box(1.6, .05, .5, M(CONE, { roughness: .4 }), SK, 0, .1, 0); for (const x of [-.55, .55]) for (const z of [-.18, .18]) { const r = mesh(new THREE.CylinderGeometry(.06, .06, .05, 12), M("#fff"), SK, x, .05, z); r.rotation.x = Math.PI / 2; }
const MZ = .5;
const anda = (lt, x0, x1, d = 2.0) => { const k = eio(Math.min(1, lt / d)), x = x0 + (x1 - x0) * k, y = .12 + Math.abs(Math.sin(lt * 3)) * .05, rz = Math.sin(lt * 2) * .06; SK.visible = true; SK.position.set(x, 0, MZ); SK.rotation.set(0, 0, rz); pose(MAS, { x, z: MZ, y, ry: -.25, braco: [1.0 + Math.sin(lt * 3) * .3, 1.0 - Math.sin(lt * 3) * .3], sq: .04, piscar: pisca(lt) }); MAS.g.rotation.z = rz; };
const ollie = (lt, x, t0) => { const u = lt - t0, h = u > 0 && u < .6 ? Math.sin(u / .6 * Math.PI) * .7 : 0; SK.visible = true; SK.position.set(x, h * .9, MZ); SK.rotation.set(0, 0, h * .4); pose(MAS, { x, z: MZ, y: .12 + h, ry: -.25, braco: [2.0, 2.0], sq: -h * .05, piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const NS = ["gancho", "s1", "s2", "s3", "s4", "cta"]; NS.forEach(n => grupo(n));
let VEL = 0;
// ---------- órbita ----------
const ORB = { gancho: [-.3, .05, 7.8, 2.6, V(0, 1.4, -.8)], s1: [.25, -.05, 7.4, 2.5, V(.2, 1.3, -.6)], s2: [-.2, .2, 7.8, 2.7, V(0, 1.4, -1.0)], s3: [.25, -.1, 7.2, 2.4, V(.4, 1.2, -.4)], s4: [-.25, .1, 7.6, 2.6, V(0, 1.2, -.6)], cta: [.05, -.08, 8.0, 2.6, V(0, 1.2, -.4)] };
const SHOTS = {}; NS.forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a0, a1, r, y, l] = ORB[nome] || ORB.cta, a = a0 + (a1 - a0) * eio(lt / d); cam.position.set(l.x + Math.sin(a) * r, y, l.z + Math.cos(a) * r); cam.lookAt(l); };
const ACT = {
  gancho(lt, d) { progs(0, lt); anda(lt, -1.6, 1.2, d); },
  s1(lt, d) { progs(0, lt); anda(lt, 1.2, -.2, d); },
  s2(lt, d) { progs(lin(lt, .2, d * .9), lt); anda(lt, -.2, 1.0, d); },
  s3(lt, d) { progs(1, lt); VEL = eio(lin(lt, .2, 1.8)); ollie(lt, 1.0, 1.0); },
  s4(lt, d) { progs(1, lt); anda(lt, 1.0, -.6, d); },
  cta(lt, d) { progs(1, lt); ollie(lt % 1.4, 1.5, .2); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `700 ${f}px CV`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const carimbo = (txt, x, y, lt, t0, cor, rot = -.08, fs = 88) => { if (lt < t0) return; const k = lin(lt, t0, t0 + .18), s = 2.4 - 1.4 * eo(k), tr = k >= 1 ? Math.max(0, 1 - (lt - t0 - .18) / .15) : 0;
    X.save(); X.translate(x + Math.sin(lt * 80) * 6 * tr, y); X.rotate(rot); X.scale(s, s); X.globalAlpha = Math.min(1, .3 + k); X.font = `700 ${fs}px CV`; const w = X.measureText(txt).width + 64;
    X.fillStyle = "rgba(255,250,240,.94)"; X.beginPath(); X.roundRect(-w / 2, -fs * .66, w, fs * 1.32, 12); X.fill(); X.strokeStyle = cor; X.lineWidth = 9; X.stroke(); X.fillStyle = cor; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(txt, 0, 4); X.restore(); X.globalAlpha = 1; };
  const velocimetro = (k, x, y) => { const r = 110, v = 7808 * k; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,250,240,.96)"; X.beginPath(); X.roundRect(-r - 30, -r - 30, 2 * r + 60, r + 130, 22); X.fill();
    const a0 = Math.PI; X.lineWidth = 24; [[0, .33, "#9fd3ff"], [.33, .66, AMAR], [.66, 1, CONE]].forEach(([a, b, c]) => { X.strokeStyle = c; X.beginPath(); X.arc(0, 0, r, a0 + a * Math.PI, a0 + b * Math.PI); X.stroke(); });
    const ang = a0 + k * Math.PI; X.strokeStyle = TINTA; X.lineWidth = 8; X.lineCap = "round"; X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(ang) * (r - 18), Math.sin(ang) * (r - 18)); X.stroke(); X.lineCap = "butt"; X.fillStyle = TINTA; X.beginPath(); X.arc(0, 0, 13, 0, 7); X.fill();
    X.font = "700 54px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(Math.round(v).toLocaleString("pt-BR"), 0, 50); X.font = "700 24px CV"; X.fillStyle = AZE2; X.fillText("★ estrelas no GitHub", 0, 88); X.restore(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(242,241,236,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") carimbo("EVERYTHING", 330, 700, lt, .5, AZE, -.08, 92);
      if (nome === "s2") carimbo("CÓDIGO ABERTO", 340, 700, lt, 1.2, VERDE, -.06, 80);
      if (nome === "s3") velocimetro(VEL, 790, 800);
      if (nome === "s4") carimbo("LOUCURA OU FUTURO?", 470, 700, lt, .8, CONE, -.05, 72); },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(-.012); X.shadowColor = "rgba(20,20,30,.22)"; X.shadowBlur = 18; X.shadowOffsetY = 6; X.fillStyle = CREME; X.fillRect(-445, -122, 890, 244); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(47,111,255,.3)"; X.lineWidth = 2; for (let y = -70; y < 122; y += 54) { X.beginPath(); X.moveTo(-445, y); X.lineTo(445, y); X.stroke(); } X.strokeStyle = "rgba(255,95,162,.45)"; X.beginPath(); X.moveTo(-375, -122); X.lineTo(-375, 122); X.stroke();
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(62, l1, 790); X.fillText(l1, -350, -30); X.fillStyle = CONE; cabe(66, l2, 790); X.fillText(l2, -350, 36); X.fillStyle = AZE2; cabe(58, l3, 790); X.fillText(l3, -350, 96); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = C.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 76; X.font = `700 ${fs}px CV`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 780 && fs > 40) { fs -= 2; X.font = `700 ${fs}px CV`; }
      const y = 1405, x0 = 505 - tot() / 2; X.fillStyle = AZE2; X.fillRect(40, y - 56, 910, 112); X.fillStyle = CONE; X.fillRect(40, y + 48, 910, 8); X.fillStyle = CONE; X.fillRect(60, y - 90, 250, 40); X.fillStyle = "#fff"; X.font = "700 28px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("DIRETO DA PISTA", 185, y - 70);
      let x = x0; X.font = `700 ${fs}px CV`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? AMAR : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 240 + u * 2300, h = w * .75;
      X.save(); X.fillStyle = "#1c1c22"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 12 * (1 - u) + 4); X.fill("evenodd"); X.restore(); },
    fechamento(lt) { X.fillStyle = "rgba(242,241,236,.5)"; X.fillRect(0, 640, 1080, 860);
      const P = [["TODO", "programa", 410, 220, AZE, "1º"], ["GRÁTIS", "pra usar", 190, 150, VERDE, "2º"], ["ABERTO", "o código", 630, 120, CONE, "3º"]];
      P.forEach(([a, b, x, h, c, n], i) => { const k = eo(lin(lt, .1 + i * .15, .5 + i * .15)), hh = h * k, base = 1330; X.fillStyle = c; X.fillRect(x - 100, base - hh, 200, hh); X.fillStyle = "rgba(0,0,0,.2)"; X.fillRect(x - 100, base - hh, 200, 12);
        if (k > .6) { X.fillStyle = "#fff"; X.font = "700 60px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(n, x, base - hh + 56); X.fillStyle = TINTA; X.font = `700 ${cabe(52, a, 190)}px CV`; X.fillText(a, x, base - hh - 66); X.fillStyle = "#555"; X.font = "700 32px CV"; X.fillText(b, x, base - hh - 24); } });
      X.fillStyle = TINTA; X.fillRect(70, 1330, 690, 12);
      const p = back(lin(lt, .7, 1.1)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 760); X.scale(p, p); X.fillStyle = AZE; X.beginPath(); X.roundRect(-280, -62, 560, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = "700 84px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 4); X.restore();
      if (lt > 1.1) { X.globalAlpha = eo(lin(lt, 1.1, 1.5)); X.fillStyle = TINTA; X.font = "700 40px CV"; X.textAlign = "center"; X.fillText("Qual programa pago você trocaria primeiro?", 505, 1410); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: AZE, VERDE: CONE, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

// Reel "5 programas grátis pro seu PC" (07/11 19:30). Identidade: mesa de trabalho vista de cima, papelaria gigante,
// verde-oliva + creme + vermelho-carimbo. Elementos: etiqueta de papel rasgado com fita, nome em carimbo, odômetro,
// legenda de 1 palavra gigante, virada de página, fechamento em post-its; mascote de óculos e crachá, digitando.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const OLIVA = "#6b7a3a", CREME = "#f3ead6", CARIMBO = "#d1342f", TINTA = "#1d1a14", KRAFT = "#c9a46a";

// ---------- cenário: tampo de mesa visto de cima ----------
const mesa = new THREE.Group(); S.add(mesa);
const madeiraT = ctex(1024, 1024, (g, w, h) => { g.fillStyle = "#b7834f"; g.fillRect(0, 0, w, h); for (let i = 0; i < 140; i++) { g.strokeStyle = `rgba(90,52,24,${.08 + (i % 5) * .03})`; g.lineWidth = 2 + (i % 3); g.beginPath(); const y = i * 7.3; g.moveTo(0, y); for (let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x / 90 + i) * 6); g.stroke(); } });
madeiraT.wrapS = madeiraT.wrapT = THREE.RepeatWrapping; madeiraT.repeat.set(2, 2);
const tampo = mesh(new THREE.PlaneGeometry(16, 12), new THREE.MeshStandardMaterial({ map: madeiraT, roughness: .7 }), mesa, 0, 0, 0); tampo.rotation.x = -Math.PI / 2;
const lap = new THREE.Group(); lap.position.set(-2.6, 0, -1.6); lap.rotation.y = .35; mesa.add(lap);
mesh(new THREE.CylinderGeometry(.12, .12, 3.2, 6), M("#f2c230"), lap, 0, .12, 0).rotation.z = Math.PI / 2; mesh(new THREE.ConeGeometry(.12, .4, 6), M("#e8c9a0"), lap, 1.8, .12, 0).rotation.z = -Math.PI / 2;
mesh(new THREE.CylinderGeometry(.13, .13, .3, 12), M("#e89aa8"), lap, -1.75, .12, 0).rotation.z = Math.PI / 2;
const caneca = new THREE.Group(); caneca.position.set(2.7, 0, -1.7); mesa.add(caneca); mesh(new THREE.CylinderGeometry(.45, .4, .9, 24), M(OLIVA), caneca, 0, .45, 0);
mesh(new THREE.CircleGeometry(.4, 24), M("#3b2414"), caneca, 0, .91, 0).rotation.x = -Math.PI / 2; mesh(new THREE.TorusGeometry(.22, .06, 8, 16), M(OLIVA), caneca, .5, .45, 0);
for (let i = 0; i < 3; i++) { const c = mesh(new THREE.TorusGeometry(.18, .025, 6, 20), M("#c9ccd6", { metalness: .8 }), mesa, -1.2 + i * .5, .03, 1.7 + i * .1); c.rotation.x = Math.PI / 2; c.scale.set(1, 2.2, 1); }
rim.color.set(0xfff1d6); key.color.set(0xfff6e6);

// ---------- mascote: óculos redondos + crachá ----------
for (const s of [-1, 1]) { const o = mesh(new THREE.TorusGeometry(.17, .025, 8, 24), M("#222", { metalness: .6 }), MAS.corpo, s * .27, 1.04, .53); o.castShadow = false; }
box(.16, .02, .02, M("#222"), MAS.corpo, 0, 1.06, .53);
const cracha = box(.24, .3, .02, M("#ffffff"), MAS.corpo, .38, .66, .51); box(.24, .07, .021, M(OLIVA), MAS.corpo, .38, .78, .512);
const teclado = new THREE.Group(); S.add(teclado); box(1.8, .1, .7, M("#e9e4d8"), teclado, 0, .05, 0);
const teclas = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) teclas.push(box(.15, .06, .15, M(r === 1 && c === 4 ? CARIMBO : "#ffffff"), teclado, -.72 + c * .18, .12, -.2 + r * .2));
function digita(lt, x, z) { teclado.position.set(x, 0, z + .75); teclado.visible = true;
  const a = Math.abs(Math.sin(lt * 18)), b = Math.abs(Math.sin(lt * 18 + 1.6)); MAS.bracos[0].rotation.x = 0; pose(MAS, { x, z, y: 0, braco: [-.2 + a * .35, -.2 + b * .35], piscar: pisca(lt), sq: a * .03 });
  MAS.corpo.rotation.x = .18; teclas.forEach((k, i) => k.position.y = .12 - (Math.floor(lt * 14 + i * 3) % 9 === 0 ? .04 : 0)); }

// ---------- gancho: o notebook abre sozinho e solta 5 janelas como cartas ----------
const gG = grupo("gancho");
const note = new THREE.Group(); note.position.set(1.1, 0, 0); gG.add(note); box(2.0, .1, 1.4, M("#c9ccd6", { metalness: .5, roughness: .3 }), note, 0, .05, 0);
const tampa = new THREE.Group(); tampa.position.set(0, .1, -.7); note.add(tampa); box(2.0, 1.3, .06, M("#c9ccd6", { metalness: .5, roughness: .3 }), tampa, 0, .65, 0);
const telaG = ctex(512, 320, (g, w, h) => { g.fillStyle = "#1f2a14"; g.fillRect(0, 0, w, h); g.fillStyle = OLIVA; g.fillRect(0, 0, w, 36); for (let i = 0; i < 5; i++) { g.fillStyle = [CREME, "#e8d9a8", "#cfe0b0", "#f2c9a8", "#d9d2f0"][i]; g.fillRect(30 + i * 90, 70 + i * 30, 120, 90); } });
mesh(new THREE.PlaneGeometry(1.86, 1.16), new THREE.MeshBasicMaterial({ map: telaG, toneMapped: false }), tampa, 0, .65, .035);
const janelas = [0, 1, 2, 3, 4].map(i => { const t = ctex(256, 180, (g, w, h) => { g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); g.fillStyle = [OLIVA, CARIMBO, "#3d6fb6", "#d99a2b", "#7a4fb0"][i]; g.fillRect(0, 0, w, 30);
    for (const x of [14, 34, 54]) { g.fillStyle = "#fff"; g.beginPath(); g.arc(x, 15, 6, 0, 7); g.fill(); } g.fillStyle = "#ddd"; for (let k = 0; k < 4; k++) g.fillRect(16, 50 + k * 28, 120 + (k * 40) % 100, 12); });
  const m = mesh(new THREE.PlaneGeometry(.9, .64), new THREE.MeshBasicMaterial({ map: t, toneMapped: false, side: THREE.DoubleSide }), gG, 0, 0, 0); m.castShadow = true; return m; });

// ---------- itens ----------
// n5 Folio: folha de PDF gigante; marca-texto passa e uma caneta assina
const n5 = grupo("n5");
const pdfT = ctex(512, 700, (g, w, h, p = 0, a = 0) => { g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); g.fillStyle = CARIMBO; g.font = "700 40px AB"; g.fillText("PDF", 30, 60);
  for (let i = 0; i < 12; i++) { g.fillStyle = "#c9c4b8"; g.fillRect(30, 100 + i * 34, 420 - (i * 37) % 120, 12); }
  g.fillStyle = "rgba(255,226,64,.6)"; g.fillRect(26, 200, 380 * p, 22);
  g.strokeStyle = "#1d3d8f"; g.lineWidth = 5; g.beginPath(); for (let x = 0; x <= 260 * a; x += 4) { const y = 610 + Math.sin(x / 14) * 18 * Math.sin(x / 70); x ? g.lineTo(60 + x, y) : g.moveTo(60, y); } g.stroke();
  g.fillStyle = "#aaa"; g.fillRect(50, 640, 300, 3); });
const folha = mesh(new THREE.PlaneGeometry(1.9, 2.6), new THREE.MeshStandardMaterial({ map: pdfT, roughness: .8 }), n5, 1.0, .02, .1); folha.rotation.x = -Math.PI / 2;
const caneta = new THREE.Group(); n5.add(caneta); mesh(new THREE.CylinderGeometry(.06, .06, 1.1, 10), M("#1d3d8f"), caneta, 0, .55, 0); mesh(new THREE.ConeGeometry(.06, .16, 10), M("#222"), caneta, 0, -.08, 0).rotation.x = Math.PI;
const marca = new THREE.Group(); n5.add(marca); box(.22, .9, .22, M("#ffe240"), marca, 0, .45, 0);

// n4 Quiet: caderno que vira páginas sozinho + cadeado
const n4 = grupo("n4");
const cad = new THREE.Group(); cad.position.set(1.0, 0, .1); n4.add(cad); box(2.4, .1, 1.7, M(OLIVA), cad, 0, .05, 0);
const pagT = ctex(256, 360, (g, w, h) => { g.fillStyle = CREME; g.fillRect(0, 0, w, h); g.strokeStyle = "#9cb8d8"; g.lineWidth = 2; for (let y = 40; y < h; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } g.fillStyle = "#555"; g.font = "700 26px CV"; g.fillText("ideia boa…", 20, 84); g.fillText("lista do dia", 20, 132); });
const paginas = []; for (let i = 0; i < 6; i++) { const pv = new THREE.Group(); pv.position.set(0, .12 + i * .004, 0); cad.add(pv); const m = mesh(new THREE.PlaneGeometry(1.15, 1.6), new THREE.MeshStandardMaterial({ map: pagT, side: THREE.DoubleSide }), pv, .58, 0, 0); m.rotation.x = -Math.PI / 2; m.castShadow = false; paginas.push(pv); }
const cadeado = new THREE.Group(); cadeado.position.set(2.3, 0, -.6); n4.add(cadeado); box(.5, .45, .2, M("#d6b04a", { metalness: .7, roughness: .3 }), cadeado, 0, .25, 0);
mesh(new THREE.TorusGeometry(.17, .045, 8, 20, Math.PI), M("#c9ccd6", { metalness: .9 }), cadeado, 0, .48, 0);

// n3 HatchZip: caixa de papelão estufada abre e os arquivos saem em fila
const n3 = grupo("n3");
const caixa = new THREE.Group(); caixa.position.set(1.0, 0, -.2); n3.add(caixa); box(1.4, .9, 1.1, M(KRAFT, { roughness: .9 }), caixa, 0, .45, 0); box(1.42, .08, .14, M("#e8dcc0"), caixa, 0, .9, 0);
const abas = [-1, 1].map(s => { const p = new THREE.Group(); p.position.set(s * .7, .9, 0); caixa.add(p); box(.7, .04, 1.1, M(KRAFT, { roughness: .9 }), p, -s * .35, 0, 0); return p; });
const arqs = []; for (let i = 0; i < 9; i++) { const m = mesh(new THREE.BoxGeometry(.5, .04, .66), M(["#ffffff", "#f6e9b8", "#d9ecd0"][i % 3]), n3, 0, 0, 0); arqs.push(m); }

// n2 Hob: um "cérebro" de papel entra no notebook e balões de conversa saem da tela
const n2 = grupo("n2");
const note2 = note.clone(true); note2.position.set(1.1, 0, -.2); n2.add(note2); note2.children[1].rotation.x = -.15;
const cerebro = new THREE.Group(); n2.add(cerebro); for (let i = 0; i < 9; i++) { const b = mesh(new THREE.SphereGeometry(.17, 14, 10), M("#f2a7b8", { roughness: .6 }), cerebro, Math.sin(i * 2.1) * .2, Math.cos(i * 1.3) * .12, Math.cos(i * 2.1) * .15); }
const baloes = [0, 1, 2].map(i => { const t = ctex(256, 128, (g, w, h) => { g.fillStyle = i % 2 ? CREME : "#cfe0b0"; g.beginPath(); g.roundRect(4, 4, w - 8, h - 30, 24); g.fill(); g.beginPath(); g.moveTo(40, h - 28); g.lineTo(30, h - 4); g.lineTo(70, h - 28); g.fill();
    g.fillStyle = TINTA; g.font = "700 30px AB"; g.fillText(["Oi! Posso ajudar?", "Resumo pronto ✓", "Sem assinatura"][i], 20, 60); });
  const m = mesh(new THREE.PlaneGeometry(1.1, .55), new THREE.MeshBasicMaterial({ map: t, transparent: true, toneMapped: false, side: THREE.DoubleSide }), n2, 0, 0, 0); m.castShadow = false; return m; });

// n1 TwinDesk: três telas e um celular deslizam e se encaixam; um cursor pula de tela em tela
const n1 = grupo("n1"); const telas = []; n1.scale.setScalar(1.45); n1.position.set(-.3, 0, .3);
const TC = ["#2f5d8a", "#6b7a3a", "#8a3b5b", "#c9853a"];
for (let i = 0; i < 4; i++) { const cel = i === 3; const g = new THREE.Group(); n1.add(g); const w = cel ? .5 : 1.25, h = cel ? .95 : .8;
  box(w + .08, h + .08, .06, M("#15151a"), g, 0, h / 2 + .3, 0); const t = ctex(256, 200, (gg, ww, hh) => { gg.fillStyle = TC[i]; gg.fillRect(0, 0, ww, hh); gg.fillStyle = "rgba(255,255,255,.85)"; for (let k = 0; k < 3; k++) gg.fillRect(20, 30 + k * 50, 140 - k * 30, 28); });
  mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, toneMapped: false }), g, 0, h / 2 + .3, .035); if (!cel) box(.08, .3, .08, M("#15151a"), g, 0, .15, -.05);
  telas.push({ g, alvo: [-.45 + (i % 3) * 1.38 - (cel ? 0 : 0) + (cel ? 2.2 : 0), 0, cel ? .35 : -.4], de: [(i - 1.5) * 4, 0, -3 - i] }); }
telas[3].alvo = [3.0, 0, .3];
const cursor = new THREE.Group(); n1.add(cursor); const curT = ctex(64, 64, (g) => { g.fillStyle = "#fff"; g.strokeStyle = "#000"; g.lineWidth = 4; g.beginPath(); g.moveTo(8, 4); g.lineTo(8, 52); g.lineTo(22, 40); g.lineTo(32, 60); g.lineTo(40, 56); g.lineTo(30, 36); g.lineTo(48, 36); g.closePath(); g.fill(); g.stroke(); });
mesh(new THREE.PlaneGeometry(.35, .35), new THREE.MeshBasicMaterial({ map: curT, transparent: true, toneMapped: false }), cursor, 0, 0, 0);
const arqVoa = box(.3, .04, .4, M(CREME), n1, 0, 0, 0);

// ---------- fechamento: post-its caindo ----------
const cG = grupo("cta"); const posts = [];
for (let i = 0; i < 40; i++) { const m = mesh(new THREE.PlaneGeometry(.3, .3), M(["#ffe066", "#ff9fb2", "#a5e3b4", "#9fc9ff"][i % 4], { side: THREE.DoubleSide }), cG, 0, 0, 0); m.castShadow = false; posts.push({ m, x: (rnd() - .5) * 7, z: -2 + rnd() * 4, y0: 3 + rnd() * 5, v: .6 + rnd() * .5, w: rnd() * 5 }); }

// ---------- câmera: de cima, descendo em diagonal ----------
// plongée 3/4 (câmera alta na diagonal, olhando para baixo ~30°): mostra o rosto do mascote e o tampo da mesa
const TOP = (x, z, alt = 6.4, d = 3.4, tx = x, tz = z) => [V(x - .6, 1.2 + alt * .38, z + 2.4 + d * .75), V(tx, .9, tz)];
const SHOTS = {
  gancho: [TOP(0, 0, 7.2, 3.6), TOP(.5, 0, 5.2, 2.6, .5, -.2)],
  n5: [TOP(0, .2, 7.0, 3.4), TOP(.2, .2, 5.4, 2.6, .1, .1)], n4: [TOP(0, 0, 7.0, 3.4), TOP(.2, 0, 5.4, 2.6, .1, 0)],
  n3: [TOP(0, 0, 7.0, 3.4), TOP(.2, 0, 5.4, 2.6, .1, -.2)], n2: [TOP(0, 0, 7.0, 3.4), TOP(.2, 0, 5.4, 2.6, .1, -.2)],
  n1: [TOP(.4, 0, 8.4, 4.2, .4, -.2), TOP(.6, 0, 6.8, 3.4, .7, -.2)], cta: [TOP(0, 0, 6.8, 3.6), TOP(0, 0, 5.6, 3.0)],
};
const ACT = {
  gancho(lt, d) { const ab = eio(lin(lt, .2, .9)); tampa.rotation.x = -1.55 + ab * 1.3; teclado.visible = false; MAS.corpo.rotation.x = 0;
    janelas.forEach((j, i) => { const s = lin(lt, 1.0 + i * .18, 1.9 + i * .18), e = eo(s); j.visible = s > 0; const a = (i - 2) * .55;
      j.position.set(1.1 + Math.sin(a) * 2.6 * e, .5 + e * (1.6 - Math.abs(i - 2) * .25), -.3 + Math.cos(a) * .6 * e - e * .4); j.rotation.set(-1.0 + e * .6, a * .4 * e, (1 - e) * 2 + a * .2); });
    pose(MAS, { x: -1.2, y: hop(lt, .4, .2), braco: [1.3 + Math.sin(lt * 6) * .3, 1.3 + Math.sin(lt * 6 + 1) * .3], piscar: pisca(lt), sq: Math.max(0, Math.cos(lt * Math.PI / .4)) * .05 }); },
  n5(lt, d) { pdfT.draw(eio(lin(lt, .4, 1.6)), eio(lin(lt, 1.8, d - .4))); digita(lt, -1.25, -.2);
    const p = eio(lin(lt, .4, 1.6)); marca.visible = lt < 1.8; marca.position.set(.4 + p * 1.3, .1, -.25); marca.rotation.set(0, 0, -.3);
    const a = eio(lin(lt, 1.8, d - .4)); caneta.visible = lt >= 1.6; caneta.position.set(.35 + a * .9, .15 + Math.abs(Math.sin(lt * 14)) * .05, .95 + Math.sin(a * 30) * .06); caneta.rotation.set(.4, 0, -.4); },
  n4(lt, d) { digita(lt, -1.25, -.2); paginas.forEach((p, i) => { const s = ((lt * 2.2 - i * .3) % 1.8); p.rotation.z = s > 0 && s < 1 ? Math.PI * eio(s) : 0; });
    cadeado.rotation.y = Math.sin(lt * 2) * .3; cadeado.position.y = Math.abs(Math.sin(lt * 3)) * .1; },
  n3(lt, d) { teclado.visible = false; MAS.corpo.rotation.x = 0; const ab = eio(lin(lt, .3, .8)); abas.forEach((a, i) => a.rotation.z = (i ? -1 : 1) * ab * 2.3); caixa.scale.set(1 + (1 - ab) * Math.sin(lt * 30) * .02, 1, 1);
    arqs.forEach((m, i) => { const s = lin(lt, .8 + i * .22, 1.4 + i * .22), e = eo(s); m.visible = s > 0; m.position.set(1.0 - e * (2.2 - (i % 5) * .02) + (i > 4 ? 0 : 0), .9 * (1 - e) + .03 + Math.sin(e * Math.PI) * 1.0 + (i > 4 ? .05 : 0), -.2 + e * (1.2 - Math.floor(i / 5) * .0) + (i % 5) * .02 - (i > 4 ? .7 : 0)); m.rotation.set(0, e * .2, (1 - e) * 2); });
    pose(MAS, { x: -1.3, y: hop(lt, .5, .15), braco: [1.0, 1.0 + Math.sin(lt * 8) * .3], piscar: pisca(lt) }); },
  n2(lt, d) { digita(lt, -1.25, .1); const e = eio(lin(lt, .3, 1.3)); cerebro.position.set(-.4 + e * 1.5, 1.6 - e * .9 + Math.sin(lt * 3) * .05, .5 - e * .6); cerebro.scale.setScalar(1 - e * .55); cerebro.visible = e < .99; cerebro.rotation.y = lt * 2;
    baloes.forEach((b, i) => { const s = eo(lin(lt, 1.4 + i * .7, 1.9 + i * .7)); b.visible = s > 0; b.position.set(1.6 + (i % 2) * .5, 1.3 + i * .55, -.3); b.scale.setScalar(.3 + .7 * back(s)); b.lookAt(cam.position); }); },
  n1(lt, d) { teclado.visible = false; MAS.corpo.rotation.x = 0;
    telas.forEach((T, i) => { const e = eio(lin(lt, .2 + i * .25, 1.3 + i * .25)); T.g.position.set(T.de[0] + (T.alvo[0] - T.de[0]) * e, 0, T.de[2] + (T.alvo[2] - T.de[2]) * e); T.g.rotation.y = (1 - e) * (i - 1.5) * .8; });
    const k = Math.floor(Math.max(0, lt - 2.0) / .7) % 4, f = (Math.max(0, lt - 2.0) % .7) / .7, A = telas[k].g.position, B = telas[(k + 1) % 4].g.position; cursor.visible = lt > 2.0;
    cursor.position.set(A.x + (B.x - A.x) * eio(f), 1.0 + Math.sin(f * Math.PI) * .8, A.z + (B.z - A.z) * eio(f) + .15); cursor.lookAt(cam.position);
    arqVoa.visible = lt > 2.0; arqVoa.position.set(cursor.position.x - .1, cursor.position.y - .25, cursor.position.z); arqVoa.rotation.set(.6, 0, Math.sin(lt * 4) * .2);
    pose(MAS, { x: -1.3, y: hop(lt, .35, .2) * (lt > 1.5 ? 1 : 0), braco: [1.6 + Math.sin(lt * 9) * .3, 1.6 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt), sq: lt > 1.5 ? Math.max(0, Math.cos(lt * Math.PI / .35)) * .06 : 0 });
    return lt > 1.0 && lt < 1.2 ? .02 : 0; },
  cta(lt, d) { teclado.visible = false; MAS.corpo.rotation.x = 0; pose(MAS, { x: 0, y: hop(lt, .5, .15), braco: [.3, 1.9 + Math.sin(lt * 9) * .5], piscar: pisca(lt) });
    posts.forEach(P => { const y = ((P.y0 - lt * P.v * 2) % 5 + 5) % 5; P.m.position.set(P.x + Math.sin(lt * 2 + P.w) * .3, y, P.z); P.m.rotation.set(-Math.PI / 2 + Math.sin(lt * 3 + P.w) * .6, lt * P.w * .3, 0); }); },
};

// ---------- elementos de tela (2D) ----------
const ui = C => { const { X, ITENS, TOTAL, MAXE, fmt, eo, lin, eio, back, blocos, SEGR, CHAVE } = C;
  const rasgado = (x, y, w, h, cor, sd) => { X.fillStyle = cor; X.beginPath(); X.moveTo(x, y); let s = sd; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i <= 24; i++) X.lineTo(x + w * i / 24, y + (r() - .5) * 12); for (let i = 0; i <= 16; i++) X.lineTo(x + w + (r() - .5) * 10, y + h * i / 16); for (let i = 24; i >= 0; i--) X.lineTo(x + w * i / 24, y + h + (r() - .5) * 12); X.closePath(); X.fill(); };
  const fita = (x, y, w, a) => { X.save(); X.translate(x, y); X.rotate(a); X.fillStyle = "rgba(240,230,190,.85)"; X.fillRect(-w / 2, -22, w, 44); X.restore(); };
  return {
    fundo(t) { X.fillStyle = "#e7dcc3"; X.fillRect(0, 0, 1080, 1920); X.fillStyle = "rgba(107,122,58,.08)"; for (let y = 0; y < 1920; y += 48) X.fillRect(0, y, 1080, 2); },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta, b = nome === "gancho" ? back(lin(t, 0, .5)) : 1;
      X.save(); X.translate(540, 210); X.rotate(-.025); X.scale(b, b); X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 18; X.shadowOffsetY = 8; rasgado(-470, -130, 940, 270, CREME, 7); X.shadowColor = "transparent";
      X.textAlign = "center"; const cabe = (t, f, mx, fam) => { while (f > 24) { X.font = `400 ${f}px ${fam}`; if (X.measureText(t).width <= mx) break; f -= 2; } }; X.fillStyle = TINTA; cabe(l1, 62, 860, "AB"); X.fillText(l1, 0, -42); X.fillStyle = CARIMBO; cabe(l2, 50, 860, "AB"); X.fillText(l2, 0, 22); X.fillStyle = OLIVA; X.font = "700 62px CV"; X.fillText(l3.toLowerCase(), 0, 96);
      X.restore(); fita(120, 92, 170, -.6); fita(960, 92, 170, .6); },
    cabecalho(s, lt, t) { // carimbo batendo com o nome + odômetro de rolinhos
      const c = lin(lt, .05, .3), sc = c < 1 ? 2.2 - 1.2 * eo(c) : 1 + Math.max(0, .06 - (lt - .3) * .3);
      X.save(); X.translate(330, 500); X.rotate(-.07); X.scale(sc, sc); X.globalAlpha = Math.min(1, c * 3); X.strokeStyle = CARIMBO; X.lineWidth = 8; X.font = "400 58px AB"; const w = X.measureText(s.item.toUpperCase()).width + 70;
      X.strokeRect(-w / 2, -50, w, 100); X.fillStyle = CARIMBO; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.item.toUpperCase(), 0, 4); X.font = "400 30px AB"; X.fillText(s.tag, -w / 2 + 6, -64); X.restore(); X.globalAlpha = 1;
      // odômetro
      const v = Math.round(s.estrelas * eio(lin(lt, .35, 1.9))), dig = String(s.estrelas).length, alvo = String(v).padStart(dig, "0"), x0 = 1020 - dig * 84, y0 = 580;
      X.fillStyle = TINTA; X.beginPath(); X.roundRect(x0 - 16, y0 - 78, dig * 84 + 24, 156, 16); X.fill();
      for (let i = 0; i < dig; i++) { const x = x0 + i * 84, frac = (s.estrelas * eio(lin(lt, .35, 1.9)) / Math.pow(10, dig - 1 - i)) % 10, d0 = Math.floor(frac), off = (frac - d0);
        X.save(); X.beginPath(); X.rect(x, y0 - 65, 74, 130); X.clip(); X.fillStyle = "#f8f3e6"; X.fillRect(x, y0 - 65, 74, 130); X.fillStyle = TINTA; X.font = "400 98px AB"; X.textAlign = "center"; X.textBaseline = "middle";
        for (const k of [0, 1]) X.fillText(String((d0 + k) % 10), x + 37, y0 + 6 + (k - off) * 116);
        const sg = X.createLinearGradient(0, y0 - 65, 0, y0 + 65); sg.addColorStop(0, "rgba(0,0,0,.35)"); sg.addColorStop(.3, "rgba(0,0,0,0)"); sg.addColorStop(.7, "rgba(0,0,0,0)"); sg.addColorStop(1, "rgba(0,0,0,.35)"); X.fillStyle = sg; X.fillRect(x, y0 - 65, 74, 130); X.restore(); }
      X.fillStyle = TINTA; X.font = "700 40px CV"; X.textAlign = "right"; X.fillText("estrelas no GitHub ★", 1020, y0 + 118); },
    legenda(seg, t) { // uma palavra gigante por vez, com pop
      let w = seg.palavras.find(p => t >= p.t0 - .02 && t < p.t1 + .02) || seg.palavras.filter(p => t >= p.t0).pop(); if (!w) return; const k = lin(t, w.t0, w.t0 + .14), sc = .6 + .4 * back(k);
      const txt = w.w.replace(/[.,:;!?]+$/, ""); X.save(); X.translate(540, 1680); X.rotate(Math.sin(w.t0 * 13) * .05); X.scale(sc, sc); let fs = 128; X.font = `400 ${fs}px AB`; while (X.measureText(txt).width > 960 && fs > 60) { fs -= 6; X.font = `400 ${fs}px AB`; }
      X.textAlign = "center"; X.textBaseline = "middle"; X.lineWidth = 16; X.strokeStyle = TINTA; X.lineJoin = "round"; X.strokeText(txt, 0, 0); X.fillStyle = /\d/.test(txt) ? "#ffe066" : CREME; X.fillText(txt, 0, 0); X.restore(); },
    transicao(lt, s) { if (!s.item || lt > .32) return; const p = eio(lt / .32), x = 1080 * (1 - p) * 1.4 - 200; // virada de página: a folha passa da direita para a esquerda
      X.save(); X.fillStyle = "#f3ead6"; X.beginPath(); X.moveTo(x, 0); X.lineTo(x + 900, 0); X.lineTo(x + 500, 1920); X.lineTo(x - 400, 1920); X.closePath(); X.shadowColor = "rgba(0,0,0,.35)"; X.shadowBlur = 40; X.globalAlpha = 1 - p * .2; X.fill(); X.restore(); },
    fechamento(lt) { // post-its na parede
      X.fillStyle = "rgba(29,26,20,.35)"; X.fillRect(0, 380, 1080, 1540);
      ITENS.forEach((s, i) => { const a = back(lin(lt, i * .09, i * .09 + .35)), c = i % 2, r = Math.floor(i / 2), x = 300 + c * 480 + (i === 4 ? 240 : 0), y = 560 + r * 330;
        X.save(); X.translate(x, y); X.rotate((i % 3 - 1) * .06); X.scale(a, a); X.shadowColor = "rgba(0,0,0,.3)"; X.shadowBlur = 16; X.shadowOffsetY = 8; X.fillStyle = ["#ffe066", "#ff9fb2", "#a5e3b4", "#9fc9ff", "#ffd29a"][i]; X.fillRect(-190, -130, 380, 260); X.shadowColor = "transparent";
        X.fillStyle = TINTA; X.textAlign = "center"; X.font = "400 34px AB"; X.fillText(s.tag + " " + s.item, 0, -30); X.font = "700 46px CV"; X.fillText(fmt(s.estrelas).toLowerCase() + " ★", 0, 40); X.restore(); });
      const p = back(lin(lt, .5, .9)); X.save(); X.translate(540, 1580); X.rotate(-.04); X.scale(p, p); X.fillStyle = "#ffe066"; X.shadowColor = "rgba(0,0,0,.35)"; X.shadowBlur = 20; X.fillRect(-380, -110, 760, 220); X.shadowColor = "transparent";
      X.fillStyle = CARIMBO; X.textAlign = "center"; X.textBaseline = "middle"; X.font = "400 92px AB"; X.fillText("COMENTA " + CHAVE, 0, -10); X.fillStyle = TINTA; X.font = "700 44px CV"; X.fillText("que eu te mando os 5 links", 0, 66); X.restore(); },
  }; };
const cores = { LAR: CARIMBO, VERDE: OLIVA, FUNDO: "#e7dcc3", CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui };
}

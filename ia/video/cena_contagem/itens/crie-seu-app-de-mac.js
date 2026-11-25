// Reel POV "Crie seu próprio app de Mac sem escrever código" (08/11 19:00). Roda no motor da cena_contagem (mesmo mascote 3D),
// com cenas próprias: gancho, s1–s4, cta. Identidade: ateliê de marcenaria fina (bancada, plaina, madeira que vira janela de app);
// nogueira + cinza-alumínio + verde-semáforo. Elementos: etiqueta em placa de rua, nome em split-flap, velocímetro, legenda em
// balão de fala do mascote, transição chicote, câmera plongée/contra-plongée, fechamento "CONTINUE?", Fraunces.
// Mascote de avental de couro e lápis atrás da "orelha"; ação principal: fazer mágica. Sem logos (nada de maçã nem marca).
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const NOG = "#5a3a22", NOG2 = "#7b5233", ALU = "#b9bec6", VERDE = "#27c24c", CREME = "#f6efe2", TINTA = "#1d1712", FUNDO = "#2a1d14";
rim.color.set(0xffd9a8); rim.intensity = 1.8; key.color.set(0xfff0dc); key.intensity = 110; key.position.set(1.5, 7.5, 5);

// ---------- cenário: oficina ----------
const of = new THREE.Group(); S.add(of);
const tabT = ctex(512, 512, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#3d2a1c" : "#45301f"; g.fillRect(i * 64, 0, 64, h); g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(i * 64, 0, 3, h); } });
tabT.wrapS = tabT.wrapT = THREE.RepeatWrapping; tabT.repeat.set(4, 2);
mesh(new THREE.PlaneGeometry(20, 9), new THREE.MeshStandardMaterial({ map: tabT, roughness: .85 }), of, 0, 4.5, -2.6);
const pisoT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#6e5a48"; g.fillRect(0, 0, w, h); for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(${200 + (i % 50)},${170 + (i % 40)},120,.25)`; g.fillRect((i * 37) % w, (i * 91) % h, 6, 2); } });
pisoT.wrapS = pisoT.wrapT = THREE.RepeatWrapping; pisoT.repeat.set(6, 4);
const piso = mesh(new THREE.PlaneGeometry(20, 12), new THREE.MeshStandardMaterial({ map: pisoT, roughness: .9 }), of, 0, 0, 1); piso.rotation.x = -Math.PI / 2;
// painel de ferramentas na parede (pegboard) + luminária
const pegT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#c9a06a"; g.fillRect(0, 0, w, h); g.fillStyle = "#8a6a40"; for (let x = 16; x < w; x += 32) for (let y = 16; y < h; y += 32) { g.beginPath(); g.arc(x, y, 4, 0, 7); g.fill(); } });
mesh(new THREE.PlaneGeometry(4.6, 2.2), new THREE.MeshStandardMaterial({ map: pegT, roughness: .8 }), of, .8, 3.0, -2.55);
const ferramentas = []; const FC = [VERDE, "#ffb02e", "#ff5f57", "#4fa3ff", "#c58cff"];
for (let i = 0; i < 5; i++) { const g = new THREE.Group(); g.position.set(-.9 + i * .85, 3.1, -2.45); of.add(g); const c = FC[i];
  if (i === 0) { mesh(new THREE.TorusGeometry(.2, .05, 8, 20), M(TINTA), g, 0, .2, 0); mesh(new THREE.CylinderGeometry(.04, .04, .5, 8), M(NOG2), g, .2, -.2, 0).rotation.z = .7; }
  else if (i === 1) { box(.06, .9, .02, M(ALU, { metalness: .7 }), g, 0, 0, 0); box(.1, .3, .06, M(NOG2), g, 0, .55, 0); }
  else if (i === 2) { box(.5, .14, .14, M(ALU, { metalness: .7 }), g, 0, .35, 0); mesh(new THREE.CylinderGeometry(.04, .04, .7, 8), M(NOG2), g, 0, 0, 0); }
  else if (i === 3) { mesh(new THREE.CylinderGeometry(.05, .05, .9, 8), M("#f2c230"), g, 0, 0, 0); mesh(new THREE.ConeGeometry(.05, .14, 8), M("#e8c9a0"), g, 0, -.52, 0).rotation.x = Math.PI; }
  else { box(.6, .06, .02, M(ALU, { metalness: .7 }), g, 0, 0, 0); box(.06, .6, .02, M(ALU, { metalness: .7 }), g, -.27, -.27, 0); }
  const luz = mesh(new THREE.CircleGeometry(.36, 24), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0 }), g, 0, 0, -.05); luz.castShadow = false; ferramentas.push({ g, luz }); }
// bancada de nogueira à direita do mascote
const banc = new THREE.Group(); banc.position.set(1.2, 0, -.4); of.add(banc); const nogM = M(NOG, { roughness: .6 });
const tampoT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#7b5233"; g.fillRect(0, 0, w, h); for (let i = 0; i < 50; i++) { g.strokeStyle = `rgba(50,28,12,${.15 + (i % 4) * .05})`; g.lineWidth = 2; g.beginPath(); g.moveTo(0, i * 5.3); for (let x = 0; x <= w; x += 32) g.lineTo(x, i * 5.3 + Math.sin(x / 70 + i) * 3); g.stroke(); } });
box(2.8, .16, 1.3, new THREE.MeshStandardMaterial({ map: tampoT, roughness: .5 }), banc, 0, 1.0, 0); for (const [x, z] of [[-1.25, -.5], [1.25, -.5], [-1.25, .5], [1.25, .5]]) box(.14, 1.0, .14, nogM, banc, x, .5, z); box(2.6, .08, 1.1, nogM, banc, 0, .25, 0);
const TOPO = 1.08;
// cavacos (lascas de madeira) que voam da plaina
const cavacos = []; for (let i = 0; i < 26; i++) { const c = mesh(new THREE.TorusGeometry(.07, .022, 4, 10, Math.PI * 1.4), M("#e2b77a"), of, 0, 0, 0); c.castShadow = false; cavacos.push({ c, ph: rnd(), s: rnd() - .5 }); }
function voaCavacos(on, lt, x, y, z) { cavacos.forEach(C => { const k = (lt * 1.4 + C.ph) % 1; C.c.visible = on && k < .9; C.c.position.set(x - .2 - k * .9, y + Math.sin(k * Math.PI) * .7, z + C.s * .7); C.c.rotation.set(lt * 5 + C.ph * 6, lt * 3, C.s * 3); }); }
// plaina
const plaina = new THREE.Group(); of.add(plaina); box(.7, .16, .22, M(ALU, { metalness: .75, roughness: .3 }), plaina, 0, .08, 0); box(.24, .22, .08, M(NOG2), plaina, -.2, .26, 0); mesh(new THREE.SphereGeometry(.09, 10, 8), M(NOG2), plaina, .25, .22, 0);
// tábua que vira janela de app (arredondada, com os 3 botões)
function janelaApp(cor, linhas = 4) { const t = ctex(320, 220, g => { g.fillStyle = "#fbfaf7"; g.beginPath(); g.roundRect(0, 0, 320, 220, 26); g.fill(); g.fillStyle = "#e9e6df"; g.beginPath(); g.roundRect(0, 0, 320, 44, [26, 26, 0, 0]); g.fill();
  ["#ff5f57", "#ffbd2e", VERDE].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(28 + i * 26, 22, 9, 0, 7); g.fill(); }); g.fillStyle = cor; g.beginPath(); g.roundRect(20, 62, 90, 140, 12); g.fill();
  g.fillStyle = "#d7d2c8"; for (let k = 0; k < linhas; k++) g.fillRect(126, 68 + k * 34, 160 - (k * 31) % 60, 14); });
  const m = mesh(new THREE.PlaneGeometry(1.28, .88), new THREE.MeshBasicMaterial({ map: t, transparent: true, toneMapped: false, side: THREE.DoubleSide }), of, 0, 0, 0); m.castShadow = false; return m; }
const tabua = box(1.2, .14, .55, M("#a8774a"), of, 0, 0, 0);

// ---------- mascote: avental de couro + lápis atrás da orelha; mágica com faíscas ----------
// avental de couro só como cinto baixo (contorna o corpo, longe do rosto) + alças nas laterais + bolsinho de lado: nada de placa na frente, que parecia uma boca
const couro = M("#7a4524", { roughness: .7 }); box(1.58, .12, 1.08, couro, MAS.corpo, 0, .5, 0); box(.12, .13, 1.09, M("#c9a64a", { metalness: .7, roughness: .3 }), MAS.corpo, .3, .5, 0);
for (const s of [-1, 1]) box(.06, .62, .5, couro, MAS.corpo, s * .78, .82, 0);
box(.1, .28, .3, M("#5e3218"), MAS.corpo, -.81, .5, .15);
const lapis = new THREE.Group(); lapis.position.set(.74, 1.42, .05); lapis.rotation.set(.2, 0, -1.1); MAS.corpo.add(lapis); mesh(new THREE.CylinderGeometry(.04, .04, .5, 6), M("#f2c230"), lapis, 0, 0, 0); mesh(new THREE.ConeGeometry(.04, .1, 6), M("#e8c9a0"), lapis, 0, -.3, 0).rotation.x = Math.PI;
const faiscas = []; for (let i = 0; i < 24; i++) { const f = mesh(new THREE.OctahedronGeometry(.045), E(i % 3 ? "#ffe27a" : VERDE, 2.5), S, 0, 0, 0); f.castShadow = false; faiscas.push({ f, a: rnd() * 6.28, r: .25 + rnd() * .5, v: 2 + rnd() * 3 }); }
function magica(lt, on, alvo) { const L = new THREE.Vector3(), R2 = new THREE.Vector3(); MAS.bracos[0].children[0].getWorldPosition(L); MAS.bracos[1].children[0].getWorldPosition(R2);
  faiscas.forEach((F, i) => { F.f.visible = on; if (!on) return; const base = i % 2 ? L : R2, k = (lt * .8 + F.a) % 1; const p = alvo ? base.clone().lerp(alvo, k) : base;
    F.f.position.set(p.x + Math.cos(F.a + lt * F.v) * F.r * (1 - k * .5), p.y + Math.sin(F.a + lt * F.v) * F.r * .6 + (alvo ? Math.sin(k * Math.PI) * .5 : 0), p.z + .2); F.f.rotation.y = lt * 5; }); }
const MX = -.95, MZ = .5;
const poseMagica = (lt, forca = 1) => pose(MAS, { x: MX, z: MZ, y: hop(lt, .6, .05), ry: .35, braco: [1.6 + Math.sin(lt * 7) * .35 * forca, 1.6 + Math.sin(lt * 7 + 1.5) * .35 * forca], piscar: pisca(lt) });
const poseFala = (lt) => pose(MAS, { x: MX, z: MZ, y: hop(lt, .45, .04), ry: .3, braco: [.35 + Math.sin(lt * 4) * .1, .6 + Math.sin(lt * 5) * .25], piscar: pisca(lt) });

// ---------- cenas ----------
// gancho (POV): tábua cai na bancada, a plaina passa soltando cavacos, a mágica transforma a madeira numa janela de app
const gG = grupo("gancho"); const appG = janelaApp("#4fa3ff");
// s1: pacote de skills = 5 ferramentas no painel acendem uma a uma
const g1 = grupo("s1"); const caixa = new THREE.Group(); caixa.position.set(1.2, TOPO, -.3); g1.add(caixa); box(1.3, .45, .55, M(VERDE, { roughness: .5 }), caixa, 0, .22, 0); box(1.36, .08, .6, M("#1e9c3c"), caixa, 0, .47, 0); box(.5, .08, .08, M(ALU, { metalness: .8 }), caixa, 0, .6, 0);
// s2: pesquisa (lupa sobre planta), desenha (lápis riscando), programa (plaina), testa (martelinho + check)
const g2 = grupo("s2"); const plantaT = ctex(320, 220, (g, w, h, p = 0) => { g.fillStyle = "#2a5d9f"; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 1; for (let x = 0; x < w; x += 20) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 20) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  g.strokeStyle = "#fff"; g.lineWidth = 4; g.beginPath(); g.roundRect(40, 30, 240 * Math.max(.02, p), 160 * Math.max(.02, p), 18); g.stroke(); if (p > .6) { g.beginPath(); g.moveTo(40, 66); g.lineTo(40 + 240 * p, 66); g.stroke(); g.strokeRect(60, 86, 70, 90); } });
const planta = mesh(new THREE.PlaneGeometry(1.4, .96), new THREE.MeshStandardMaterial({ map: plantaT, roughness: .8 }), g2, 1.0, TOPO + .01, -.3); planta.rotation.x = -Math.PI / 2; planta.castShadow = false;
const lupa = new THREE.Group(); g2.add(lupa); mesh(new THREE.TorusGeometry(.22, .04, 8, 24), M(TINTA, { metalness: .4 }), lupa, 0, 0, 0); mesh(new THREE.CylinderGeometry(.04, .05, .4, 8), M(NOG2), lupa, .26, -.26, 0).rotation.z = Math.PI / 4;
const lapisG = new THREE.Group(); g2.add(lapisG); mesh(new THREE.CylinderGeometry(.045, .045, .6, 6), M("#f2c230"), lapisG, 0, .3, 0); mesh(new THREE.ConeGeometry(.045, .12, 6), M("#e8c9a0"), lapisG, 0, -.06, 0).rotation.x = Math.PI;
const app2 = janelaApp("#ff8a3d", 3); const martelo = new THREE.Group(); g2.add(martelo); box(.36, .14, .14, M(ALU, { metalness: .7 }), martelo, 0, .5, 0); mesh(new THREE.CylinderGeometry(.035, .035, .55, 8), M(NOG2), martelo, 0, .22, 0);
const checkT = ctex(128, 128, g => { g.fillStyle = VERDE; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 16; g.lineCap = "round"; g.beginPath(); g.moveTo(34, 66); g.lineTo(56, 88); g.lineTo(96, 42); g.stroke(); });
const check = mesh(new THREE.PlaneGeometry(.5, .5), new THREE.MeshBasicMaterial({ map: checkT, transparent: true, toneMapped: false }), g2, 0, 0, 0); check.castShadow = false;
// s3: cavacos viram estrelas que sobem
const g3 = grupo("s3"); const estrelas = []; const estT = ctex(64, 64, g => { g.fillStyle = "#ffd23f"; g.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 13 : 30, a = -Math.PI / 2 + i * Math.PI / 5; g.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r); } g.fill(); });
for (let i = 0; i < 26; i++) { const e = mesh(new THREE.PlaneGeometry(.26, .26), new THREE.MeshBasicMaterial({ map: estT, transparent: true, toneMapped: false, depthWrite: false }), g3, 0, 0, 0); e.castShadow = false; estrelas.push({ e, x: rnd() * 2.4 - .2, ph: rnd(), v: .5 + rnd() * .5 }); }
const app3 = janelaApp(VERDE, 4);
// s4: notebook genérico de alumínio (sem logo) com terminal
const g4 = grupo("s4"); const note = new THREE.Group(); note.position.set(1.15, TOPO, -.2); note.rotation.y = -.25; g4.add(note); box(1.5, .06, 1.0, M(ALU, { metalness: .7, roughness: .3 }), note, 0, .03, 0);
const tampa = new THREE.Group(); tampa.position.set(0, .06, -.5); note.add(tampa); box(1.5, .98, .05, M(ALU, { metalness: .7, roughness: .3 }), tampa, 0, .49, 0);
const termT = ctex(320, 200, (g, w, h, n = 0) => { g.fillStyle = "#14161a"; g.fillRect(0, 0, w, h); g.font = "500 18px JB"; const L = ["> descreve: app de notas", "  pesquisando...  ok", "  desenhando...   ok", "  programando...  ok", "  testando...     ok", "> pronto ✓"];
  L.slice(0, n).forEach((l, i) => { g.fillStyle = i === 5 ? VERDE : "#cfd6df"; g.fillText(l, 14, 30 + i * 28); }); });
mesh(new THREE.PlaneGeometry(1.38, .86), new THREE.MeshBasicMaterial({ map: termT, toneMapped: false }), tampa, 0, .49, .03).castShadow = false;
// cta: janelas de app flutuando
const cG = grupo("cta"); const flut = [janelaApp("#4fa3ff", 3), janelaApp("#ff8a3d", 4), janelaApp(VERDE, 2)];

// ---------- câmera: plongée (de cima, inclinada) e contra-plongée (de baixo) alternando ----------
const PL = (lt, d, x = .05) => [V(x + .3 - lt / d * .6, 4.6, 5.4), V(x, .9, -.2)], CP = (lt, d, x = .05) => [V(x - .3 + lt / d * .6, .45, 5.6), V(x, 1.75, -.3)];
const PLANO = { gancho: [PL, CP], s1: [CP, PL], s2: [PL, CP], s3: [CP, PL], s4: [PL, PL], cta: [CP, CP] };
const SHOTS = {}; Object.keys(PLANO).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d, t) => { const [A, B] = PLANO[nome] || PLANO.cta, f = lt < d / 2 ? A : B, l2 = lt < d / 2 ? lt : lt - d / 2; const [p, l] = f(l2, d / 2);
  const ch = ["s1", "s2", "s3", "s4", "cta"].includes(nome) ? (1 - eo(lin(lt, 0, .3))) * 2.2 : 0; cam.position.copy(p); cam.position.x += ch; cam.lookAt(l.x + ch * 1.2, l.y, l.z); };
const tudoInvisivel = () => { [appG, app2, app3, ...flut].forEach(a => a.visible = false); tabua.visible = plaina.visible = false; magica(0, false); voaCavacos(false, 0); };

const ACT = {
  gancho(lt, d) { tudoInvisivel(); const cai = eo(lin(lt, 0, .45)); tabua.visible = lt < 2.9; tabua.position.set(1.15, TOPO + .07 + (1 - cai) * 2.5, -.2); tabua.rotation.set(0, .1, (1 - cai) * .6); tabua.scale.set(1, lt > 2.6 ? 1 - lin(lt, 2.6, 2.9) : 1, 1);
    const pl = lin(lt, .6, 2.4); plaina.visible = lt > .5 && lt < 2.6; plaina.position.set(1.7 - pl * 1.1 + Math.sin(lt * 14) * .04, TOPO + .21, -.2); plaina.rotation.y = .1; voaCavacos(lt > .6 && lt < 2.6, lt, plaina.position.x, TOPO + .3, -.2);
    const vira = back(lin(lt, 2.7, 3.4)); appG.visible = lt > 2.7; appG.position.set(1.15, TOPO + .7 + Math.sin(lt * 2) * .05, -.1); appG.scale.setScalar(Math.max(.01, vira)); appG.rotation.y = -.2 + (1 - vira) * 3;
    if (lt < 2.3) poseFala(lt); else poseMagica(lt); magica(lt, lt > 2.3, appG.position); return lt > .38 && lt < .5 ? .03 : 0; },
  s1(lt, d) { tudoInvisivel(); poseMagica(lt, .7); magica(lt, true, null); ferramentas.forEach((F, i) => { const k = lin(lt, .9 + i * .3, 1.1 + i * .3); F.luz.material.opacity = k * .75; F.g.scale.setScalar(1 + Math.sin(k * Math.PI) * .25); });
    caixa.scale.setScalar(Math.max(.01, back(lin(lt, .1, .6)))); caixa.rotation.y = Math.sin(lt * 1.5) * .1; },
  s2(lt, d) { tudoInvisivel(); poseFala(lt); const P = [.56, 1.35, 2.14, 3.27];
    const kp = lin(lt, P[0], P[1]); lupa.visible = lt < P[1] + .1; lupa.position.set(.8 + Math.sin(lt * 6) * .3, TOPO + .45, -.25 + Math.cos(lt * 6) * .15); lupa.rotation.x = -1.2;
    const kd = lin(lt, P[1], P[2]); plantaT.draw(kd); lapisG.visible = lt > P[1] - .1 && lt < P[2] + .1; lapisG.position.set(.55 + kd * .9, TOPO + .05 + Math.abs(Math.sin(lt * 18)) * .03, -.45 + Math.sin(kd * 9) * .2); lapisG.rotation.z = -.5;
    const kg = lin(lt, P[2], P[3]); plaina.visible = lt > P[2] - .1 && lt < P[3]; plaina.position.set(1.6 - kg * .9, TOPO + .15, .05); voaCavacos(plaina.visible, lt, plaina.position.x, TOPO + .3, .05);
    app2.visible = lt > P[2] + .3; app2.position.set(1.1, TOPO + .75, -.2); app2.scale.setScalar(Math.max(.01, back(lin(lt, P[2] + .3, P[2] + .8)))); app2.rotation.y = -.15;
    martelo.visible = lt > P[3] - .1; const bate = Math.abs(Math.sin((lt - P[3]) * 9)); martelo.position.set(1.75, TOPO + .55, 0); martelo.rotation.z = .4 + bate * .8 * (lt < P[3] + 1 ? 1 : 0);
    check.visible = lt > P[3] + .5; check.position.set(1.62, TOPO + 1.25, -.1); check.scale.setScalar(Math.max(.01, back(lin(lt, P[3] + .5, P[3] + .9)))); check.lookAt(cam.position); },
  s3(lt, d) { tudoInvisivel(); poseMagica(lt); app3.visible = true; app3.position.set(1.1, TOPO + .8 + Math.sin(lt * 2) * .05, -.2); app3.rotation.y = -.15 + Math.sin(lt) * .05; magica(lt, true, app3.position);
    estrelas.forEach(E2 => { const k = (lt * E2.v * .5 + E2.ph) % 1; E2.e.position.set(E2.x, TOPO + k * 2.8, -.6 + E2.ph * .8); E2.e.scale.setScalar(Math.sin(k * Math.PI) * 1.1 + .05); E2.e.lookAt(cam.position); }); },
  s4(lt, d) { tudoInvisivel(); termT.draw(Math.min(6, Math.floor(lt * 3.2))); tampa.rotation.x = -(1 - eo(lin(lt, 0, .5))) * 1.4;
    pose(MAS, { x: MX, z: MZ, y: 0, ry: .55, braco: [.3, .9 + Math.abs(Math.sin(lt * 14)) * .2], piscar: pisca(lt) }); },
  cta(lt, d) { tudoInvisivel(); poseMagica(lt, 1.2); magica(lt, true, null); flut.forEach((a, i) => { a.visible = true; a.position.set(.3 + i * .95, 2.2 + Math.sin(lt * 1.5 + i) * .15, -1 - i * .1); a.rotation.set(0, -.2 + i * .1, Math.sin(lt + i) * .05); a.scale.setScalar(.8 * Math.max(.01, back(lin(lt, i * .15, .4 + i * .15)))); }); },
};

// ---------- elementos de tela (2D), tudo entre y=260 e y=1500 e a 130 px da direita ----------
const ui = C => { const { X, gl, GH, ITENS, MAXE, eo, lin, eio, back, SEGR, SEG, CHAVE } = C;
  const cabe = (t, f, mx, peso = 700) => { while (f > 20) { X.font = `${peso} ${f}px FR`; if (X.measureText(t).width <= mx) break; f -= 2; } return f; };
  const GY3 = 560, U = {}; let FALA = null;
  const quebra = (txt, mx) => { const ws = txt.split(" "), L = []; let cur = ""; for (const w of ws) { const tt = cur ? cur + " " + w : w; if (X.measureText(tt).width > mx && cur) { L.push(cur); cur = w; } else cur = tt; } if (cur) L.push(cur); return L; };
  const flap = (txt, x, y, tw, th, lt, t0) => { for (let i = 0; i < txt.length; i++) { const pronto = lt > t0 + i * .09, ch = pronto ? txt[i] : "ABCDEFGHJKLMNPRSTUVXZ0123456789"[(Math.floor(lt * 28) + i * 7) % 31], xx = x + i * (tw + 8);
      X.fillStyle = "#17191d"; X.beginPath(); X.roundRect(xx, y, tw, th, 8); X.fill(); X.fillStyle = "#fff"; X.font = `700 ${Math.round(th * .7)}px FR`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(ch, xx + tw / 2, y + th / 2 + 4);
      X.fillStyle = "rgba(0,0,0,.55)"; X.fillRect(xx, y + th / 2 - 2, tw, 4); } };
  return Object.assign(U, {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); X.fillStyle = "#3b2a1d"; for (let i = 0; i < 10; i++) X.fillRect(0, 1420 + i * 56, 1080, 2); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); const fg = X.createLinearGradient(0, GY3, 0, GY3 + 60); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(42,29,20,0)"); X.fillStyle = fg; X.fillRect(0, GY3, 1080, 60);
      const fb = X.createLinearGradient(0, GY3 + GH, 0, GY3 + GH - 80); fb.addColorStop(0, FUNDO); fb.addColorStop(1, "rgba(42,29,20,0)"); X.fillStyle = fb; X.fillRect(0, GY3 + GH - 80, 1080, 80);
      if (nome === "s1") { flap("BAMA", 70, 600, 92, 120, lt, .2); X.font = "italic 700 38px FR"; X.fillStyle = CREME; X.textAlign = "left"; X.fillText("pacote de skills", 76, 765); }
      if (nome === "s3") { const s = SEGR.find(x => x.item); flap(s.item.toUpperCase(), 70, 600, 92, 120, lt, .05);
        // velocímetro
        const cx = 780, cy = 760, r = 130, v = s.estrelas * eio(lin(lt, .1, 1.3)), a0 = Math.PI * .8, a1 = Math.PI * 2.2, frac = v / 2000;
        X.fillStyle = "rgba(20,15,10,.82)"; X.beginPath(); X.arc(cx, cy, r + 22, 0, 7); X.fill(); X.lineWidth = 18; X.strokeStyle = "#4a3a2c"; X.beginPath(); X.arc(cx, cy, r, a0, a1); X.stroke();
        X.strokeStyle = VERDE; X.beginPath(); X.arc(cx, cy, r, a0, a0 + (a1 - a0) * frac); X.stroke(); X.fillStyle = CREME; for (let i = 0; i <= 10; i++) { const a = a0 + (a1 - a0) * i / 10; X.fillRect(cx + Math.cos(a) * (r - 30) - 2, cy + Math.sin(a) * (r - 30) - 2, 5, 5); }
        const an = a0 + (a1 - a0) * frac; X.strokeStyle = "#ff5f57"; X.lineWidth = 7; X.lineCap = "round"; X.beginPath(); X.moveTo(cx, cy); X.lineTo(cx + Math.cos(an) * (r - 18), cy + Math.sin(an) * (r - 18)); X.stroke(); X.fillStyle = CREME; X.beginPath(); X.arc(cx, cy, 12, 0, 7); X.fill();
        X.textAlign = "center"; X.textBaseline = "middle"; X.fillStyle = CREME; X.font = "700 50px FR"; X.fillText(String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, "."), cx, cy + 62); X.fillStyle = "rgba(20,15,10,.82)"; X.beginPath(); X.roundRect(cx - 170, cy + r + 34, 340, 46, 23); X.fill(); X.font = "700 22px FR"; X.fillStyle = "#e9dcc6"; X.fillText("ESTRELAS NO GITHUB", cx, cy + r + 58); } },
    etiqueta(t, nome) { // placa de rua verde
      const [l1, l2] = SEGR[0].etiqueta, b = nome === "gancho" ? back(lin(t, 0, .45)) : 1; X.save(); X.translate(530, 410); X.scale(b, b);
      X.fillStyle = "#555b63"; X.fillRect(-14, 130, 28, 60); X.shadowColor = "rgba(0,0,0,.4)"; X.shadowBlur = 20; X.shadowOffsetY = 8; X.fillStyle = "#11713a"; X.beginPath(); X.roundRect(-450, -140, 900, 280, 26); X.fill(); X.shadowColor = "transparent";
      X.strokeStyle = "#fff"; X.lineWidth = 7; X.beginPath(); X.roundRect(-436, -126, 872, 252, 18); X.stroke(); X.fillStyle = "#fff"; X.textAlign = "left"; X.textBaseline = "alphabetic";
      const tit = l1.replace(/^POV:\s*/, ""); X.font = "700 46px FR"; X.fillStyle = "#ffd23f"; X.fillText("POV:", -406, -66); X.font = "700 50px FR"; const L = quebra(tit, 690); X.fillStyle = "#fff"; L.slice(0, 2).forEach((l, i) => X.fillText(l, -276, -66 + i * 60));
      X.fillStyle = "#ffffff"; X.fillRect(-406, 30, 812, 4); X.fillStyle = "#b9ffcb"; cabe(l2, 50, 812); X.fillText(l2, -406, 96); X.restore(); },
    cabecalho() {},
    legenda(seg, t, sr) { // balão de fala do mascote, com a frase em blocos curtos
      const ws = seg.palavras, ch = []; let cur = []; for (const w of ws) { cur.push(w); if (/[.,:?!]$/.test(w.w) || cur.length >= 5) { ch.push(cur); cur = []; } } if (cur.length) ch.push(cur);
      let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b], p = back(lin(t, c[0].t0 - .05, c[0].t0 + .12));
      X.font = "700 56px FR"; const txt = c.map(w => w.w).join(" "), L = quebra(txt, 760), h = 40 + L.length * 62, w = Math.min(860, Math.max(...L.map(l => X.measureText(l).width)) + 80), x0 = 540 - w / 2 + 40, y0 = 1490 - h;
      X.save(); X.translate(330, y0); X.scale(.85 + .15 * p, .85 + .15 * p); X.translate(-330, -y0); X.shadowColor = "rgba(0,0,0,.4)"; X.shadowBlur = 18; X.fillStyle = CREME; X.beginPath(); X.roundRect(x0, y0, w, h, 34); X.fill();
      X.beginPath(); X.moveTo(300, y0 + 4); X.lineTo(270, y0 - 56); X.lineTo(380, y0 + 4); X.fill(); X.shadowColor = "transparent";
      X.textAlign = "center"; X.textBaseline = "middle"; let k = 0; L.forEach((l, i) => { const lw = X.measureText(l).width; let xx = x0 + w / 2 - lw / 2; X.textAlign = "left";
        for (const pw of l.split(" ")) { const wd = c[k++]; const on = wd && t >= wd.t0 - .02; X.fillStyle = (pw.replace(/[.,!?]/g, "") === CHAVE) ? VERDE : on ? TINTA : "rgba(29,23,18,.35)"; X.fillText(pw, xx, y0 + 52 + i * 62); xx += X.measureText(pw + " ").width; } }); X.restore(); },
    transicao(lt, s, nome) { if (!["s1", "s2", "s3", "s4", "cta"].includes(nome) || lt > .28) return; const k = 1 - lt / .28, cv = X.canvas;
      X.save(); for (let i = 1; i <= 6; i++) { X.globalAlpha = .22 * k; X.drawImage(cv, i * 75 * k, 0); X.drawImage(cv, -i * 45 * k, 0); } X.globalAlpha = .4 * k; X.fillStyle = "#ffe2b8"; for (let i = 0; i < 12; i++) X.fillRect(0, 560 + (i * 83) % 860, 1080, 3 + (i % 3) * 3); X.restore(); },
    fechamento(lt) { // CONTINUE? numa janela de app, com contagem e botão COMENTA
      const p = back(lin(lt, 0, .4)); X.save(); X.translate(540, 790); X.scale(p * .7, p * .7); X.shadowColor = "rgba(0,0,0,.5)"; X.shadowBlur = 40; X.fillStyle = "#fbfaf7"; X.beginPath(); X.roundRect(-400, -300, 800, 560, 36); X.fill(); X.shadowColor = "transparent";
      X.fillStyle = "#e9e6df"; X.beginPath(); X.roundRect(-400, -300, 800, 70, [36, 36, 0, 0]); X.fill(); ["#ff5f57", "#ffbd2e", VERDE].forEach((c, i) => { X.fillStyle = c; X.beginPath(); X.arc(-352 + i * 40, -265, 13, 0, 7); X.fill(); });
      X.textAlign = "center"; X.textBaseline = "middle"; X.fillStyle = TINTA; X.font = "700 84px FR"; X.fillText("CONTINUE?", 0, -150); const n = Math.max(0, 9 - Math.floor(lt * 2.5)); X.fillStyle = "#ff5f57"; X.font = "700 150px FR"; X.fillText(String(n), 0, -10);
      const pul = 1 + Math.sin(lt * 8) * .03; X.save(); X.translate(0, 160); X.scale(pul, pul); X.fillStyle = VERDE; X.beginPath(); X.roundRect(-320, -62, 640, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = "700 72px FR"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore(); X.restore();
      },
  }); };
const cores = { LAR: VERDE, VERDE, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

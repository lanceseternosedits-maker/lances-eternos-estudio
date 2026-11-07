// Reel 📜 história "Deep Blue × Kasparov" (07/11 19:00). Motor da cena_contagem (mesmo mascote 3D), cenas gancho, s1–s4, cta.
// Identidade: sala de torneio de 1997: tabuleiro gigante no palco, relógio de xadrez de madeira, monitor de tubo com braço robótico
// de blocos movendo as peças (sem logo nenhum); luz dourada, azul-marinho + dourado.
// Elementos: etiqueta em painel de aeroporto, nome em split-flap, legenda em tarja de TV de 1997, transição virada de página,
// câmera em travelling lateral, fechamento em página de caderno, Fraunces. Mascote de boina (no topo: nada na frente do rosto,
// porque o Vitor negou um vídeo em que o avental parecia uma boca); ação principal: pensar (cabeça inclinada, bolinhas de pensamento).
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const NAVY = "#0d1a36", NAVY2 = "#16284f", OURO = "#e7b54a", CREME = "#f5ecd7", TINTA = "#141a2a", AZUL = "#3d6fd8", FUNDO = "#0a1428", VERM = "#e5483b";
rim.color.set(0x8fb0ff); rim.intensity = 1.5; key.color.set(0xffd58a); key.intensity = 140; key.position.set(-.5, 8, 5); key.target.position.set(-.2, .6, 0);

// ---------- cenário ----------
const sala = new THREE.Group(); S.add(sala);
const paredeT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#13244a"; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 64) { g.fillStyle = "#0e1c3c"; g.fillRect(x, 0, 30, h); g.fillStyle = "rgba(231,181,74,.25)"; g.fillRect(x + 30, 0, 2, h); } g.fillStyle = "#7a5a22"; g.fillRect(0, h - 40, w, 6); });
paredeT.wrapS = THREE.RepeatWrapping; paredeT.repeat.set(4, 1);
mesh(new THREE.PlaneGeometry(22, 9), new THREE.MeshStandardMaterial({ map: paredeT, roughness: .9 }), sala, 0, 4.5, -3.2);
const pisoT = ctex(256, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#3a2616" : "#432c1a"; g.fillRect(0, i * 32, w, 32); g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(0, i * 32, w, 2); } });
pisoT.wrapS = pisoT.wrapT = THREE.RepeatWrapping; pisoT.repeat.set(6, 5);
const piso = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: pisoT, roughness: .7 }), sala, 0, 0, 1); piso.rotation.x = -Math.PI / 2;
const luzOuro = new THREE.PointLight(0xffc463, 18, 9, 1.4); luzOuro.position.set(.4, 3.2, 1.2); sala.add(luzOuro);
// cortina de cone de luz dourada sobre o tabuleiro
const cone = new THREE.Mesh(new THREE.ConeGeometry(2.2, 7, 32, 1, true), new THREE.MeshBasicMaterial({ color: "#ffd27a", transparent: true, opacity: .06, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
cone.position.set(.4, 3.6, -.4); sala.add(cone);

// tabuleiro gigante (8×8) num tablado
const BX = .4, BZ = -.35, SQ = .34, BY = .16;
box(SQ * 8 + .3, BY, SQ * 8 + .3, M("#5a3a1e", { roughness: .5 }), sala, BX, BY / 2, BZ);
const casaT = ctex(512, 512, (g, w, h) => { for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { g.fillStyle = (r + c) % 2 ? "#2a3f6e" : "#e9dcc0"; g.fillRect(c * 64, r * 64, 64, 64); } });
const casas = mesh(new THREE.PlaneGeometry(SQ * 8, SQ * 8), new THREE.MeshStandardMaterial({ map: casaT, roughness: .45 }), sala, BX, BY + .002, BZ); casas.rotation.x = -Math.PI / 2;
const sq = (c, r) => V(BX + (c - 3.5) * SQ, BY, BZ + (3.5 - r) * SQ);   // r=0 é a fileira perto da câmera (lado do mascote)
// peças por torno (perfil)
const perfil = pts => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 24);
const GEO = {
  peao: perfil([[0, 0], [.12, 0], [.12, .04], [.07, .07], [.05, .2], [.08, .22], [.05, .24], [.07, .3], [.04, .36], [0, .37]]),
  torre: perfil([[0, 0], [.13, 0], [.13, .05], [.09, .09], [.08, .3], [.11, .32], [.11, .4], [0, .4]]),
  rei: perfil([[0, 0], [.14, 0], [.14, .05], [.09, .1], [.06, .38], [.1, .42], [.07, .46], [.09, .52], [0, .54]]),
  dama: perfil([[0, 0], [.14, 0], [.14, .05], [.09, .1], [.055, .34], [.1, .4], [.06, .44], [.08, .48], [0, .5]]),
};
const MC = M("#efe3c6", { roughness: .35 }), MA = M("#2f5fc7", { roughness: .25, metalness: .35 });
function peca(tipo, mat, c, r) { const g = new THREE.Group(); sala.add(g); mesh(GEO[tipo], mat, g, 0, 0, 0);
  if (tipo === "rei") { box(.035, .16, .035, mat, g, 0, .6, 0); box(.11, .035, .035, mat, g, 0, .62, 0); }
  if (tipo === "dama") { mesh(new THREE.SphereGeometry(.045, 12, 10), mat, g, 0, .53, 0); }
  g.scale.setScalar(1.25); const p = sq(c, r); g.position.copy(p); g.userData.casa = p.clone(); return g; }
const reiC = peca("rei", MC, 4, 0), damaA = peca("dama", MA, 3, 6);
const PECAS = [reiC, damaA, peca("torre", MC, 0, 0), peca("dama", MC, 2, 1), peca("peao", MC, 1, 1), peca("peao", MC, 5, 1), peca("peao", MC, 6, 2), peca("peao", MC, 3, 3),
  peca("rei", MA, 6, 7), peca("torre", MA, 7, 7), peca("peao", MA, 5, 6), peca("peao", MA, 6, 6), peca("peao", MA, 2, 5), peca("peao", MA, 4, 4)];
const cavA = peca("torre", MA, 1, 6);   // peça que o braço move na s2

// relógio de xadrez de madeira num banquinho, à esquerda do tabuleiro (frente)
const rel = new THREE.Group(); rel.position.set(-.3, 0, 1.1); rel.rotation.y = .25; sala.add(rel);
for (const [x, z] of [[-.25, -.18], [.25, -.18], [-.25, .18], [.25, .18]]) box(.06, .55, .06, M("#4a2f18"), rel, x, .275, z);
box(.7, .06, .5, M("#6b4423"), rel, 0, .58, 0);
box(.72, .32, .26, M("#8a5a2e", { roughness: .45 }), rel, 0, .77, 0);
const mostT = ctex(256, 128, (g, w, h, a = 0, b = 0) => { for (const [cx, ang] of [[64, a], [192, b]]) { g.fillStyle = "#fbf3df"; g.beginPath(); g.arc(cx, 64, 54, 0, 7); g.fill(); g.strokeStyle = "#2a1a0c"; g.lineWidth = 5; g.stroke();
  g.fillStyle = "#2a1a0c"; for (let i = 0; i < 12; i++) { const q = i / 12 * 6.283; g.fillRect(cx + Math.cos(q) * 44 - 2, 64 + Math.sin(q) * 44 - 2, 4, 4); }
  g.strokeStyle = VERM; g.lineWidth = 4; g.beginPath(); g.moveTo(cx, 64); g.lineTo(cx + Math.sin(ang) * 40, 64 - Math.cos(ang) * 40); g.stroke(); } });
mesh(new THREE.PlaneGeometry(.62, .31), new THREE.MeshBasicMaterial({ map: mostT, transparent: true }), rel, 0, .77, .132).castShadow = false;
const botoes = [-.18, .18].map(x => mesh(new THREE.CylinderGeometry(.045, .045, .08, 12), M(OURO, { metalness: .6, roughness: .3 }), rel, x, .96, 0));

// monitor de tubo numa mesa, atrás à direita, + braço robótico de blocos (sem logo)
const mon = new THREE.Group(); mon.position.set(2.55, 0, -2.0); mon.rotation.y = -.45; sala.add(mon);
box(1.5, .08, .9, M("#3a2a1c"), mon, 0, 1.0, 0); for (const x of [-.65, .65]) box(.08, 1.0, .8, M("#2c2016"), mon, x, .5, 0);
box(1.0, .82, .78, M("#cfc8b4", { roughness: .6 }), mon, 0, 1.45, 0); box(.6, .5, .4, M("#b9b29d"), mon, 0, 1.4, -.5);
const telaT = ctex(256, 192, (g, w, h, k = 1, n = 0) => { g.fillStyle = "#020608"; g.fillRect(0, 0, w, h); if (k <= 0) return;
  const hh = Math.max(3, h * .8 * k), ww = k < .08 ? Math.max(4, w * .8 * k / .08) : w * .8; g.fillStyle = "#06221a"; g.fillRect((w - ww) / 2, (h - hh) / 2, ww, hh);
  if (k > .5) { g.font = "500 20px JB"; g.fillStyle = "#7dffb8"; ["> DEEP BLUE", "  calculando...", `  ${200 + (n * 37) % 700} mi lances/s`, n % 2 ? "> ok_" : "> ok"].forEach((l, i) => g.fillText(l, 26, 50 + i * 30)); }
  else { g.fillStyle = "#c8ffe0"; g.fillRect((w - ww) / 2, h / 2 - hh / 2, ww, hh); } });
const tela = mesh(new THREE.PlaneGeometry(.78, .6), new THREE.MeshBasicMaterial({ map: telaT, toneMapped: false }), mon, 0, 1.47, .395); tela.castShadow = false;
const brilhoTela = new THREE.PointLight(0x7dffb8, 4, 3, 2); brilhoTela.position.set(0, 1.5, .8); mon.add(brilhoTela);
// papel contínuo (registros) que sai do monitor na s4
const papelT = ctex(128, 512, g => { g.fillStyle = "#f7f4ea"; g.fillRect(0, 0, 128, 512); for (let y = 0; y < 512; y += 32) { g.fillStyle = "rgba(120,200,150,.35)"; g.fillRect(14, y, 100, 16); }
  g.fillStyle = "#cfc9b8"; for (let y = 8; y < 512; y += 22) { g.beginPath(); g.arc(6, y, 3, 0, 7); g.fill(); g.beginPath(); g.arc(122, y, 3, 0, 7); g.fill(); }
  g.fillStyle = "#3a3a3a"; for (let y = 10; y < 512; y += 16) g.fillRect(20, y, 30 + (y * 7) % 60, 4); });
papelT.wrapT = THREE.RepeatWrapping;
const papel = mesh(new THREE.PlaneGeometry(.42, 1), new THREE.MeshStandardMaterial({ map: papelT, side: THREE.DoubleSide, roughness: .9 }), sala, 0, 0, 0); papel.castShadow = false;

const ARMB = V(2.15, 0, -1.05), OMB = V(2.15, 1.25, -1.05), L1 = 1.35, L2 = 1.35;
const metal = M("#8d97a8", { metalness: .7, roughness: .35 }), ARM = new THREE.Group(); sala.add(ARM);
box(.5, .2, .5, M("#2c3445", { metalness: .5 }), ARM, ARMB.x, .1, ARMB.z); box(.26, 1.05, .26, metal, ARM, ARMB.x, .65, ARMB.z);
const seg1 = box(.18, .18, L1, metal, ARM), seg2 = box(.15, .15, L2, metal, ARM), junta = mesh(new THREE.SphereGeometry(.14, 16, 12), M(OURO, { metalness: .6, roughness: .3 }), ARM);
const garra = new THREE.Group(); ARM.add(garra); box(.22, .1, .22, M("#2c3445", { metalness: .5 }), garra, 0, .05, 0); const dedos = [-1, 1].map(s => box(.04, .2, .12, metal, garra, s * .08, -.08, 0));
function liga(m, a, b) { m.position.copy(a).lerp(b, .5); m.lookAt(b); }
function braco(G2) { const d = G2.clone().sub(OMB), L = Math.min(d.length(), L1 + L2 - .02), dir = d.normalize(), a = (L1 * L1 - L2 * L2 + L * L) / (2 * L), h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
  const up = V(0, 1, 0).sub(dir.clone().multiplyScalar(dir.y)).normalize(), cot = OMB.clone().add(dir.clone().multiplyScalar(a)).add(up.multiplyScalar(h)), fim = OMB.clone().add(dir.clone().multiplyScalar(L));
  liga(seg1, OMB, cot); liga(seg2, cot, fim); junta.position.copy(cot); garra.position.copy(fim).add(V(0, .02, 0)); }
const REPOUSO = V(1.7, 1.3, -.6);
// move uma peça de A para B com o braço (k de 0 a 1): desce, pega, sobe, leva, solta, volta
function move(pc, A, B, k) { const ALT = .95; let g, pp = A.clone();
  if (k < .2) g = REPOUSO.clone().lerp(A.clone().add(V(0, .75, 0)), eio(k / .2));
  else if (k < .28) g = A.clone().add(V(0, .75 - eio((k - .2) / .08) * .02, 0));
  else if (k < .75) { const u = eio((k - .28) / .47); pp = A.clone().lerp(B, u); pp.y += Math.sin(u * Math.PI) * ALT; g = pp.clone().add(V(0, .73, 0)); }
  else { pp = B.clone(); g = B.clone().add(V(0, .73, 0)).lerp(REPOUSO, eio((k - .75) / .25)); }
  pc.position.copy(pp); braco(g); dedos.forEach((f, i) => f.position.x = (i ? 1 : -1) * (k > .26 && k < .75 ? .06 : .1)); }

// ---------- mascote: boina no topo da cabeça; pensar ----------
const boina = new THREE.Group(); boina.position.set(.12, 1.52, 0); boina.rotation.z = -.18; MAS.corpo.add(boina);
mesh(new THREE.CylinderGeometry(.6, .62, .1, 32), M(NAVY2, { roughness: .8 }), boina, 0, .02, 0); mesh(new THREE.SphereGeometry(.58, 32, 12, 0, 6.283, 0, 1.4), M(NAVY2, { roughness: .8 }), boina, 0, 0, 0).scale.set(1, .45, 1);
mesh(new THREE.CylinderGeometry(.03, .04, .1, 8), M(NAVY2), boina, 0, .16, 0);
const pens = [0, 1, 2].map(i => mesh(new THREE.SphereGeometry(.07 + i * .035, 14, 10), M(CREME, { emissive: CREME, emissiveIntensity: .25 }), S));
const MX = -1.75, MZ = .35;
function pensa(lt, on, x = MX) { pose(MAS, { x, z: MZ, y: hop(lt, .9, .04), ry: .38, braco: [.25, 2.3 + Math.sin(lt * 3) * .12], piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(lt * 1.3) * .06 - .08;
  pens.forEach((p, i) => { const k = on ? eo(lin(lt % 2.4, i * .25, i * .25 + .3)) : 0; p.visible = k > .02; p.scale.setScalar(Math.max(.01, k)); p.position.set(x + .55 + i * .25, 1.85 + i * .3 + Math.sin(lt * 2 + i) * .03, MZ + .1); }); }
function fala(lt, x = MX) { pose(MAS, { x, z: MZ, y: hop(lt, .5, .05), ry: .38, braco: [.35 + Math.sin(lt * 4) * .12, .5 + Math.sin(lt * 5) * .25], piscar: pisca(lt) }); MAS.g.rotation.z = 0; pens.forEach(p => p.visible = false); }

// lupa gigante (s3), sempre ao lado do tabuleiro, nunca na frente do mascote
const lupa = new THREE.Group(); S.add(lupa); mesh(new THREE.TorusGeometry(.42, .06, 12, 40), M(OURO, { metalness: .7, roughness: .25 }), lupa, 0, 0, 0);
mesh(new THREE.CircleGeometry(.4, 40), new THREE.MeshStandardMaterial({ color: "#cfe6ff", transparent: true, opacity: .25, roughness: .05, metalness: .2 }), lupa, 0, 0, 0).castShadow = false;
mesh(new THREE.CylinderGeometry(.06, .07, .7, 12), M("#4a2f18"), lupa, .52, -.52, 0).rotation.z = Math.PI / 4;

const G0 = grupo("gancho"), G1 = grupo("s1"), G2 = grupo("s2"), G3 = grupo("s3"), G4 = grupo("s4"), GC = grupo("cta");
const repoe = () => { PECAS.concat([cavA]).forEach(p => { p.position.copy(p.userData.casa); p.rotation.set(0, 0, 0); }); braco(REPOUSO); lupa.visible = false; papel.visible = false; telaT.draw(1, 0); };

// ---------- câmera: travelling lateral (a câmera desliza de lado acompanhando a ação) ----------
const TR = { gancho: [[-1.2, -.3, 7.0, 2.4], [-.5, .3, 6.4, 2.0]], s1: [[.3, -.4, 7.0, 2.6], [-1.0, -.4, 6.6, 2.2]], s2: [[-.9, -.1, 6.8, 2.7], [-.3, .3, 6.8, 2.3]],
  s3: [[-1.2, -.5, 6.4, 2.1], [-.6, .2, 6.8, 2.6]], s4: [[.1, .6, 6.8, 2.4], [.2, -.3, 7.0, 2.2]], cta: [[-1.0, -.2, 7.2, 2.3], [-1.0, -.2, 7.2, 2.3]] };
const SHOTS = {}; Object.keys(TR).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [A, B] = TR[nome] || TR.cta, f = lt < d / 2 ? A : B, u = eio((lt < d / 2 ? lt : lt - d / 2) / (d / 2));
  const x = f[0] + (f[1] - f[0]) * u; cam.position.set(x, f[3], f[2]); cam.lookAt(-.3 + (x + .3) * .45, .9, -.35); };

const ACT = {
  gancho(lt, d) { repoe(); // a dama azul ataca, o rei creme tomba (Kasparov abandona), mascote leva susto e depois desconfia
    move(damaA, damaA.userData.casa, sq(4, 2), lin(lt, .4, 2.9)); const tomba = eo(lin(lt, 3.6, 4.3)); reiC.rotation.z = tomba * 1.45; reiC.position.x += tomba * .18; reiC.position.y += Math.sin(tomba * Math.PI) * .05;
    mostT.draw(lt * .8, 2.3 + lt * .05);
    if (lt < 3.6) pensa(lt, true); else if (lt < 5.3) { pose(MAS, { x: MX, z: MZ, y: Math.max(0, Math.sin(lin(lt, 3.6, 4.1) * Math.PI) * .45), sq: lt > 4.1 && lt < 4.3 ? .14 : 0, ry: .3, braco: [1.9, 1.9], piscar: 1 }); MAS.g.rotation.z = 0; pens.forEach(p => p.visible = false); }
    else { pensa(lt - 5.3, false); MAS.g.rotation.z = -.15; }
    return lt > 3.6 && lt < 3.9 ? .04 : 0; },
  s1(lt, d) { repoe(); damaA.position.copy(sq(4, 2)); reiC.rotation.z = 1.45; reiC.position.x += .18; braco(REPOUSO.clone().add(V(Math.sin(lt * 3) * .25, Math.sin(lt * 4) * .15, .2))); telaT.draw(1, Math.floor(lt * 6)); mostT.draw(2, 2.6); fala(lt); },
  s2(lt, d) { repoe(); telaT.draw(1, Math.floor(lt * 6) + 9); // 1996: o rei creme está de pé; 1997: a peça azul avança e o relógio dispara
    move(cavA, cavA.userData.casa, sq(3, 4), lin(lt, 2.3, 4.6)); mostT.draw(lt * 4, lt * 6); botoes.forEach((b, i) => b.position.y = .96 - (Math.floor(lt * 4) % 2 === i ? .03 : 0));
    if (lt < 2.2) { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .3), ry: .38, braco: [2.2 + Math.sin(lt * 9) * .3, 2.2 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; pens.forEach(p => p.visible = false); }
    else pensa(lt - 2.2, true); },
  s3(lt, d) { repoe(); damaA.position.copy(sq(4, 2)); telaT.draw(1, Math.floor(lt * 6)); mostT.draw(3, 3); // lupa sobre a dama azul (a jogada "humana demais")
    lupa.visible = true; const a = back(lin(lt, .2, .8)); const alvo = sq(4, 2); lupa.position.set(alvo.x + Math.sin(lt * 1.6) * .25, alvo.y + 1.15 + Math.sin(lt * 2.2) * .06, alvo.z + .35); lupa.rotation.set(-.35, .15, Math.sin(lt) * .1); lupa.scale.setScalar(Math.max(.01, a));
    if (lt < 2.6) pensa(lt, true); else fala(lt); },
  s4(lt, d) { repoe(); damaA.position.copy(sq(4, 2)); mostT.draw(3, 3); // o papel dos registros sai do monitor; depois a tela apaga e o braço desaba
    const sai = eo(lin(lt, .5, 2.3)); papel.visible = sai > .01; const p0 = V(2.25, 1.15, -1.6); papel.scale.set(1, Math.max(.01, sai * 1.6), 1); papel.position.set(p0.x - .2, p0.y - sai * .8 + .1, p0.z + .55); papel.rotation.set(-.5, -.45, 0); papelT.offset.y = -sai * .5;
    const apaga = lin(lt, 3.0, 3.6); telaT.draw(apaga <= 0 ? 1 : apaga < 1 ? .45 * (1 - apaga) : 0, Math.floor(lt * 6)); brilhoTela.intensity = 4 * (1 - apaga);
    const cai = eo(lin(lt, 3.4, 4.4)); braco(REPOUSO.clone().lerp(V(1.9, .25, -.3), cai));
    if (lt < 3.2) fala(lt); else { pose(MAS, { x: MX, z: MZ, y: 0, sq: .06 * Math.sin(lin(lt, 3.2, 3.6) * Math.PI), ry: .5, braco: [.15, .15], piscar: lt > 3.6 && lt < 4.0 ? .15 : 1 }); MAS.g.rotation.z = .1; pens.forEach(p => p.visible = false); } },
  cta(lt, d) { repoe(); damaA.position.copy(sq(4, 2)); reiC.rotation.z = 1.45; reiC.position.x += .18; telaT.draw(0); brilhoTela.intensity = 0; braco(V(1.9, .25, -.3)); pensa(lt, true, -1.2); },
};

// ---------- elementos de tela (2D), tudo entre y=260 e y=1500 e a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C;
  const GY3 = 600, U = {};
  const quebra = (txt, mx) => { const ws = txt.split(" "), L = []; let cur = ""; for (const w of ws) { const tt = cur ? cur + " " + w : w; if (X.measureText(tt).width > mx && cur) { L.push(cur); cur = w; } else cur = tt; } if (cur) L.push(cur); return L; };
  const flap = (txt, x, y, tw, th, lt, t0, cor = "#fff") => { for (let i = 0; i < txt.length; i++) { const xx = x + i * (tw + 6); if (txt[i] === " ") continue; const pronto = lt > t0 + i * .06, ch = pronto ? txt[i] : "ABCDEFGHJKLMNPRSTUVXZ0123456789"[(Math.floor(lt * 28) + i * 7) % 31];
      X.fillStyle = "#0b0f1a"; X.beginPath(); X.roundRect(xx, y, tw, th, 7); X.fill(); X.fillStyle = cor; X.font = `700 ${Math.round(th * .66)}px FR`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(ch, xx + tw / 2, y + th / 2 + 3);
      X.fillStyle = "rgba(0,0,0,.6)"; X.fillRect(xx, y + th / 2 - 2, tw, 3); } };
  return Object.assign(U, {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); const v = X.createRadialGradient(540, 1000, 50, 540, 1000, 800); v.addColorStop(0, "rgba(231,181,74,.10)"); v.addColorStop(1, "rgba(0,0,0,0)"); X.fillStyle = v; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); const fg = X.createLinearGradient(0, GY3, 0, GY3 + 70); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(10,20,40,0)"); X.fillStyle = fg; X.fillRect(0, GY3, 1080, 70);
      const fb = X.createLinearGradient(0, GY3 + GH, 0, GY3 + GH - 90); fb.addColorStop(0, FUNDO); fb.addColorStop(1, "rgba(10,20,40,0)"); X.fillStyle = fb; X.fillRect(0, GY3 + GH - 90, 1080, 90);
      if (nome === "s1") { flap("KASPAROV", 70, 640, 70, 96, lt, .05, CREME); X.font = "700 54px FR"; X.fillStyle = OURO; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("×", 70, 790); flap("DEEP BLUE", 130, 742, 70, 96, lt, 1.5, "#8fb4ff"); }
      if (nome === "s2") { const n = lt < 2.2 ? 1996 : 1997, res = lt < 2.2 ? "KASPAROV VENCE" : "REVANCHE";
        flap(String(n), 70, 640, 70, 96, lt < 2.2 ? lt : lt - 2.2, .0, OURO); X.font = "700 46px FR"; X.fillStyle = CREME; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText(res, 380, 688);
        if (lt > 4.4) { const p = back(lin(lt, 4.4, 4.8)); X.save(); X.translate(540, 800); X.scale(p, p); X.fillStyle = VERM; X.beginPath(); X.roundRect(-250, -48, 500, 96, 14); X.fill(); X.fillStyle = "#fff"; X.font = "700 56px FR"; X.textAlign = "center"; X.fillText("19 LANCES", 0, 4); X.restore(); } }
      if (nome === "s3" && lt > 2.6) { const p = back(lin(lt, 2.6, 2.9)); X.save(); X.translate(300, 730); X.rotate(-.12); X.scale(p, p); X.strokeStyle = VERM; X.lineWidth = 8; X.beginPath(); X.roundRect(-210, -50, 420, 100, 10); X.stroke();
        X.fillStyle = VERM; X.font = "700 46px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("REGISTROS?", 0, 4); X.restore(); }
      if (nome === "s4") { flap(lt < 2.6 ? "PUBLICADOS DEPOIS" : "NUNCA MAIS JOGOU", 70, 650, 46, 70, lt < 2.6 ? lt : lt - 2.6, .1, lt < 2.6 ? CREME : OURO); } },
    etiqueta(t, nome) { // painel de aeroporto: azul-marinho, letras douradas, sem animação de entrada (1º quadro legível)
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.shadowColor = "rgba(0,0,0,.5)"; X.shadowBlur = 24; X.fillStyle = "#070c18"; X.beginPath(); X.roundRect(70, 280, 880, 300, 20); X.fill(); X.shadowColor = "transparent";
      X.strokeStyle = OURO; X.lineWidth = 4; X.beginPath(); X.roundRect(82, 292, 856, 276, 14); X.stroke();
      X.fillStyle = OURO; X.font = "700 26px FR"; X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillText("PARTIDA FINAL  ·  NOVA YORK  ·  MAIO DE 1997", 110, 334);
      X.fillStyle = "rgba(231,181,74,.35)"; X.fillRect(110, 350, 800, 2);
      const tit = l1.replace(/^1997:\s*/, ""); X.font = "700 52px FR"; const L = quebra(tit, 800); X.fillStyle = "#fff"; L.slice(0, 2).forEach((l, i) => X.fillText(l, 110, 418 + i * 62));
      X.fillStyle = VERM; X.beginPath(); X.roundRect(110, 520, 22, 22, 4); X.fill(); X.fillStyle = "#ffd27a"; X.font = "700 34px FR"; X.fillText(l3 || l2, 146, 544); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { // tarja de TV de 1997: barra azul-marinho com fio dourado e selo "AO VIVO"
      const ws = seg.palavras, ch = []; let cur = []; for (const w of ws) { cur.push(w); if (/[.,:?!]$/.test(w.w) || cur.length >= 5) { ch.push(cur); cur = []; } } if (cur.length) ch.push(cur);
      let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      X.font = "700 54px FR"; const L = quebra(c.map(w => w.w).join(" "), 800), h = 36 + L.length * 64, y0 = 1490 - h;
      X.fillStyle = "rgba(7,12,24,.92)"; X.fillRect(60, y0, 900, h); X.fillStyle = OURO; X.fillRect(60, y0, 900, 5);
      X.fillStyle = VERM; X.fillRect(60, y0 - 44, 196, 44); X.fillStyle = "#fff"; X.font = "700 24px FR"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("● AO VIVO  1997", 74, y0 - 21);
      X.font = "700 54px FR"; let k = 0; L.forEach((l, i) => { let xx = 92; for (const pw of l.split(" ")) { const wd = c[k++]; const on = wd && t >= wd.t0 - .02, atual = on && wd && t < wd.t1 + .2;
        X.fillStyle = pw.replace(/[.,!?]/g, "") === CHAVE ? "#ffd27a" : atual ? OURO : on ? CREME : "rgba(245,236,215,.35)"; X.fillText(pw, xx, y0 + 50 + i * 64); xx += X.measureText(pw + " ").width; } }); },
    transicao(lt, s, nome) { // virada de página: uma folha creme sai para a esquerda, dobrando na borda
      if (!["s1", "s2", "s3", "s4", "cta"].includes(nome) || lt > .4) return; const k = eio(lt / .4), e = 1180 * (1 - k) - 100;
      X.save(); X.fillStyle = CREME; X.beginPath(); X.moveTo(0, 0); X.lineTo(e, 0); X.lineTo(e - 160, 1920); X.lineTo(0, 1920); X.fill();
      X.strokeStyle = "rgba(61,111,216,.25)"; X.lineWidth = 2; for (let y = 120; y < 1920; y += 64) { X.beginPath(); X.moveTo(0, y); X.lineTo(e - 160 * y / 1920, y); X.stroke(); }
      const sg = X.createLinearGradient(e - 80, 0, e + 60, 0); sg.addColorStop(0, "rgba(0,0,0,0)"); sg.addColorStop(.5, "rgba(0,0,0,.35)"); sg.addColorStop(1, "rgba(0,0,0,0)"); X.fillStyle = sg; X.fillRect(e - 240, 0, 320, 1920);
      X.fillStyle = "#e6dcc3"; X.beginPath(); X.moveTo(e, 0); X.lineTo(e + 70 * (1 - k), 0); X.lineTo(e - 160 + 70 * (1 - k), 1920); X.lineTo(e - 160, 1920); X.fill(); X.restore(); },
    fechamento(lt) { // página de caderno com a "súmula" da partida e o COMENTA
      const p = back(lin(lt, 0, .45)); X.save(); X.translate(540, 1000); X.rotate(-.03); X.scale(.6 + .4 * p, .6 + .4 * p); X.globalAlpha = Math.min(1, p * 1.5);
      X.shadowColor = "rgba(0,0,0,.5)"; X.shadowBlur = 40; X.fillStyle = "#fbf6e8"; X.fillRect(-400, -330, 800, 640); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(61,111,216,.35)"; X.lineWidth = 2; for (let y = -250; y < 310; y += 52) { X.beginPath(); X.moveTo(-400, y); X.lineTo(400, y); X.stroke(); } X.strokeStyle = "rgba(229,72,59,.6)"; X.beginPath(); X.moveTo(-320, -330); X.lineTo(-320, 310); X.stroke();
      X.fillStyle = TINTA; X.textAlign = "left"; X.textBaseline = "alphabetic"; X.font = "700 44px FR"; X.fillText("Súmula · maio de 1997", -296, -268);
      X.font = "700 38px FR"; [["1996", "Kasparov venceu"], ["1997", "Deep Blue venceu"], ["?", "trapaça ou não?"]].forEach(([a, b], i) => { X.fillStyle = i === 2 ? VERM : AZUL; X.fillText(a, -296, -170 + i * 104); X.fillStyle = TINTA; X.fillText(b, -150, -170 + i * 104); });
      const pul = 1 + Math.sin(lt * 7) * .03; X.save(); X.translate(0, 210); X.scale(pul, pul); X.fillStyle = NAVY; X.beginPath(); X.roundRect(-340, -60, 680, 120, 60); X.fill(); X.fillStyle = "#ffd27a"; X.font = "700 64px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore();
      X.restore(); X.globalAlpha = 1; },
  }); };
const cores = { LAR: OURO, VERDE: OURO, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

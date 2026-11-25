// Reel "3 skills que fazem vídeo do zero" (08/11). Identidade: cinema drive-in à noite: telão, carros de blocos genéricos,
// carrinho de pipoca, projetor soltando feixe, varal de lâmpadas; azul-noite + vermelho-cinema + amarelo-pipoca.
// Elementos: etiqueta em letreiro neon, nome em carimbo, placar HI-SCORE, legenda em balão de fala do mascote, transição em íris,
// câmera plongée/contra-plongée, fechamento em pódio, Caveat + Space Grotesk. Mascote de óculos 3D, ação principal: cozinhar
// (estoura pipoca na panela enquanto o telão mostra o vídeo nascendo). Sem logos nem filmes reais. Texto entre y=260 e y=1500.
export default function (K) {
const { rim, key, THREE, S, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const NOITE = "#0e1a3a", CINE = "#e0283a", PIPOCA = "#ffd23f", CREME = "#fff6e0", TINTA = "#120f1c", CIANO = "#5fe0ff";

// ---------- cenário: asfalto, telão, carros de blocos, varal de lâmpadas, estrelas ----------
S.fog = new THREE.Fog("#0b1430", 9, 24);
const asfT = ctex(512, 512, g => { g.fillStyle = "#1c2236"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 1800; i++) { g.fillStyle = `rgba(${i % 2 ? 0 : 200},${i % 2 ? 0 : 210},${i % 2 ? 10 : 240},.08)`; g.fillRect((i * 97) % 512, (i * 233) % 512, 3, 3); }
  g.fillStyle = "rgba(255,210,63,.55)"; for (let y = 0; y < 512; y += 128) g.fillRect(250, y, 12, 70); });
asfT.wrapS = asfT.wrapT = THREE.RepeatWrapping; asfT.repeat.set(5, 4);
const piso = mesh(new THREE.PlaneGeometry(26, 18), new THREE.MeshStandardMaterial({ map: asfT, roughness: .9 }), S, 0, 0, 0); piso.rotation.x = -Math.PI / 2;
// telão (conteúdo muda por cena)
const telT = ctex(640, 360, (g, w, h, cena = "gancho", p = 0, f = 0) => { if (TELA && TELA[cena]) TELA[cena](g, w, h, p, f); });
const telao = new THREE.Group(); telao.position.set(.3, -.5, -4.0); S.add(telao);
for (const x of [-3.1, 3.1]) box(.25, 4.6, .25, M("#3a3f55"), telao, x, 2.3, -.2);
box(6.3, 3.6, .15, M("#2a2f45"), telao, 0, 3.0, -.1);
mesh(new THREE.PlaneGeometry(6.0, 3.375), new THREE.MeshBasicMaterial({ map: telT, toneMapped: false }), telao, 0, 3.0, 0).castShadow = false;
function carro(par, x, z, ry, cor) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; par.add(g); box(1.9, .5, .95, M(cor, { roughness: .4, metalness: .3 }), g, 0, .45, 0); box(1.05, .42, .85, M(cor, { roughness: .4, metalness: .3 }), g, -.1, .9, 0);
  box(1.0, .34, .87, M("#9fc4ff", { roughness: .1, emissive: "#203060", emissiveIntensity: .4 }), g, -.1, .9, 0); for (const xx of [-.6, .6]) for (const zz of [-.48, .48]) { const r = mesh(new THREE.CylinderGeometry(.2, .2, .12, 16), M("#111"), g, xx, .2, zz); r.rotation.x = Math.PI / 2; }
  for (const zz of [-.3, .3]) box(.04, .1, .16, E("#ff4040", 1.5), g, -.96, .5, zz); return g; }
carro(S, -4.2, -1.8, .35, "#2f8f8a"); carro(S, 4.4, -1.6, -.4, "#c86a2a"); carro(S, -2.6, -3.0, .15, "#6a4aa8"); carro(S, 2.9, -3.1, -.2, "#b8b2a6");
const lamps = []; for (let i = 0; i < 18; i++) { const x = -6 + i * .7, y = 3.0 - Math.sin(i / 17 * Math.PI) * .45; const l = mesh(new THREE.SphereGeometry(.07, 10, 8), E(i % 2 ? PIPOCA : CINE, 2.2), S, x, y, -2.2); l.castShadow = false; lamps.push(l); }
rim.color.set(0x6f8cff); rim.intensity = 2.0; key.color.set(0xfff0d8); key.intensity = 95;
const luzTela = new THREE.PointLight(0x9fc0ff, 10, 9, 1.4); luzTela.position.set(.3, 2.5, -3.2); S.add(luzTela);

// ---------- projetor com feixe ----------
const proj = new THREE.Group(); proj.position.set(2.1, 0, .3); proj.rotation.y = -.25; S.add(proj);
box(.12, 1.1, .12, M("#2b2b33"), proj, 0, .55, 0); box(.6, .42, .5, M("#3a3f55", { metalness: .5, roughness: .4 }), proj, 0, 1.3, 0);
for (const z of [-.18, .18]) { const r = mesh(new THREE.CylinderGeometry(.24, .24, .06, 20), M("#22252f"), proj, -.05, 1.68, z * 1.8 - .02); r.rotation.x = Math.PI / 2; r.rotation.y = Math.PI / 2; }
const lente = mesh(new THREE.CylinderGeometry(.1, .12, .2, 16), E("#fff6c8", 2), proj, 0, 1.3, -.32); lente.rotation.x = Math.PI / 2;
const feixe = mesh(new THREE.ConeGeometry(1.5, 5.0, 24, 1, true), new THREE.MeshBasicMaterial({ color: "#cfe6ff", transparent: true, opacity: .10, depthWrite: false, side: THREE.DoubleSide }), S, 0, 0, 0); feixe.castShadow = false;
{ const a = new THREE.Vector3(2.0, 1.3, .05), b = new THREE.Vector3(.3, 2.5, -3.9), d = b.clone().sub(a); feixe.position.copy(a.clone().add(b).multiplyScalar(.5)); feixe.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), d.normalize()); }

// ---------- mascote: óculos 3D (lentes vermelha e azul, abaixo do chapéu, sem cobrir os olhos: aro fino) + panela de pipoca ----------
const ocu = new THREE.Group(); ocu.position.set(0, 1.04, .53); MAS.corpo.add(ocu);
for (const [x, c] of [[-.27, "#ff3050"], [.27, "#30c8ff"]]) { mesh(new THREE.PlaneGeometry(.4, .46), new THREE.MeshStandardMaterial({ color: c, transparent: true, opacity: .35, roughness: .1 }), ocu, x, 0, .01).castShadow = false;
  for (const [w, h, yy, xx] of [[.44, .04, .25, 0], [.44, .04, -.25, 0], [.04, .5, 0, -.22], [.04, .5, 0, .22]]) box(w, h, .03, M("#f4f1ea"), ocu, x + xx, yy, 0); }
box(.12, .04, .03, M("#f4f1ea"), ocu, 0, .1, 0); for (const s of [-1, 1]) box(.03, .04, .5, M("#f4f1ea"), ocu, s * .5, .2, -.25);
const panela = new THREE.Group(); MAS.bracos[1].add(panela); panela.position.set(.62, -.02, 0);
box(.42, .05, .06, M("#2b2b33"), panela, -.16, 0, 0); const pan = mesh(new THREE.CylinderGeometry(.34, .28, .22, 24, 1, true), M("#9aa0a8", { metalness: .8, roughness: .3, side: THREE.DoubleSide }), panela, .3, .05, 0);
mesh(new THREE.CylinderGeometry(.28, .28, .02, 24), M("#7d838c", { metalness: .8, roughness: .35 }), panela, .3, -.06, 0);
const PIP = []; const pipM = M("#fff4d6", { roughness: .9, emissive: "#ffe9a8", emissiveIntensity: .15 });
for (let i = 0; i < 26; i++) { const p = mesh(new THREE.IcosahedronGeometry(.06 + rnd() * .03, 0), pipM, S, 0, 0, 0); p.castShadow = false; PIP.push({ p, ph: rnd(), v: .9 + rnd() * .6, ax: (rnd() - .5) * .5, az: (rnd() - .5) * .5 }); }
// carrinho de pipoca ao lado (fogareiro)
const car = new THREE.Group(); car.position.set(-.15, 0, .55); S.add(car);
box(.7, .7, .55, M(CINE, { roughness: .5 }), car, 0, .35, 0); box(.72, .1, .57, M(CREME), car, 0, .62, 0); for (const z of [-.2, .2]) mesh(new THREE.CylinderGeometry(.13, .13, .05, 16), M("#111"), car, -.3, .13, z).rotation.x = Math.PI / 2;
const chama = mesh(new THREE.ConeGeometry(.12, .25, 10), E("#ff8a2a", 2.5), car, 0, .8, 0); chama.castShadow = false;
const _v = new THREE.Vector3();
function cozinha(lt, x = -1.05, z = .4, ry = .3, extra = {}) { const ch = Math.sin(lt * 7) * .18;
  pose(MAS, { x, z, ry, y: hop(lt, .9, .03), braco: [.35 + Math.sin(lt * 3) * .1, .25 + ch], piscar: pisca(lt), ...extra });
  car.position.set(x + 1.0, 0, z + .35); chama.scale.set(1, .8 + Math.sin(lt * 23) * .2, 1);
  MAS.g.updateMatrixWorld(true); pan.getWorldPosition(_v);
  PIP.forEach((P, i) => { const k = (lt * P.v + P.ph) % 1, sb = Math.sin(k * Math.PI); P.p.position.set(_v.x + P.ax * .4, _v.y + .08 + sb * (.35 + P.v * .25), _v.z + P.az * .4); P.p.rotation.set(lt * 4 + i, lt * 3, 0); P.p.visible = k > .05; }); }

// ---------- conteúdo do telão ----------
const titulo = (g, w, txt, y, fs, cor, fam = "SG") => { g.font = `700 ${fs}px ${fam}`; g.fillStyle = cor; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, w / 2, y); };
var TELA = {
  gancho(g, w, h, p, f) { g.fillStyle = "#101626"; g.fillRect(0, 0, w, h); titulo(g, w, "TEMA:", 90, 56, "#8fa0c8"); const t = "gatos no espaço"; titulo(g, w, t.slice(0, Math.ceil(t.length * Math.min(1, p * 2))), 170, 62, CREME, "CV");
    if (p > .55) { const q = Math.min(1, (p - .55) * 3); g.fillStyle = PIPOCA; g.beginPath(); g.roundRect(w / 2 - 170 * q, 230, 340 * q, 76, 14); g.fill(); if (q >= 1) titulo(g, w, "▶ VÍDEO PRONTO", 270, 40, TINTA); } },
  n3(g, w, h, p, f) { g.fillStyle = "#16203c"; g.fillRect(0, 0, w, h); g.fillStyle = "#0a0f1e"; g.fillRect(230, 18, 180, 324); const gr = g.createLinearGradient(0, 18, 0, 342); gr.addColorStop(0, "#3a6ad8"); gr.addColorStop(1, "#d86a3a"); g.fillStyle = gr; g.fillRect(238, 26, 164, 308);
    g.fillStyle = "#fff"; g.beginPath(); g.arc(320, 150 + Math.sin(f) * 6, 34, 0, 7); g.fill(); g.fillStyle = TINTA; g.fillRect(250, 270, 140, 26); g.fillStyle = PIPOCA; g.font = "700 18px SG"; g.textAlign = "center"; g.fillText("LEGENDA", 320, 288);
    ["ROTEIRO", "VOZ", "LEGENDA", "CAPA"].forEach((t, i) => { const on = p > .15 + i * .18; g.textAlign = "left"; g.font = "700 34px SG"; g.fillStyle = on ? "#7ee787" : "#4a5578"; g.fillText((on ? "✓ " : "· ") + t, i < 2 ? 22 : 430, 120 + (i % 2) * 90); }); },
  n2(g, w, h, p, f) { g.fillStyle = "#2a0e18"; g.fillRect(0, 0, w, h); for (let i = 0; i < 12; i++) { g.fillStyle = `rgba(255,${120 + i * 10},80,${.12})`; g.beginPath(); g.arc(320, 200, 40 + i * 26, 0, 7); g.fill(); }
    const s = .7 + .3 * Math.min(1, p * 3); g.save(); g.translate(320, 190); g.rotate(Math.sin(f * .5) * .15); g.scale(s, s); g.fillStyle = "#3fd0a0"; g.beginPath(); g.roundRect(-40, -80, 80, 170, 18); g.fill(); g.fillStyle = "#fff"; g.fillRect(-40, -10, 80, 40); g.fillStyle = "#2a8a6a"; g.fillRect(-18, -105, 36, 30); g.restore();
    titulo(g, w, "COMERCIAL", 330, 40, PIPOCA); g.fillStyle = "#fff"; g.font = "700 48px SG"; g.textAlign = "center"; for (let i = 0; i < 3; i++) g.fillText("♪", 120 + i * 200, 90 + Math.sin(f + i * 2) * 14);
    g.fillStyle = "#000"; g.fillRect(0, 0, w, 26); g.fillRect(0, h - 26, w, 26); },
  n1(g, w, h, p, f) { g.fillStyle = "#1a1030"; g.fillRect(0, 0, w, h); if (p < .35) { titulo(g, w, "E SE…?", 180, 120, PIPOCA, "CV"); return; }
    const q = Math.min(1, (p - .35) * 2.2); g.fillStyle = "#0c0820"; g.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { g.fillStyle = "rgba(255,255,255,.7)"; g.fillRect((i * 137) % w, (i * 71) % h, 3, 3); }
    g.fillStyle = "#e0663a"; g.beginPath(); g.arc(470, 230, 70 * q, 0, 7); g.fill(); g.strokeStyle = "#ffd29a"; g.lineWidth = 6; g.beginPath(); g.ellipse(470, 230, 110 * q, 26 * q, -.3, 0, 7); g.stroke();
    const x = 120 + q * 160, y = 190 + Math.sin(f * 1.3) * 10; g.fillStyle = "#f4f1ea"; g.beginPath(); g.roundRect(x - 34, y - 30, 68, 60, 14); g.fill(); g.fillStyle = "#222"; g.fillRect(x - 14, y - 12, 7, 18); g.fillRect(x + 7, y - 12, 7, 18);
    g.strokeStyle = "#8fd4ff"; g.lineWidth = 4; g.beginPath(); g.arc(x, y, 50, 0, 7); g.stroke(); titulo(g, w, "EPISÓDIO 1", 330, 34, PIPOCA); },
  cta(g, w, h, p, f) { g.fillStyle = "#101626"; g.fillRect(0, 0, w, h); titulo(g, w, "FIM", 150, 110, CREME, "CV"); titulo(g, w, "comenta VIDEO", 270, 52, PIPOCA, "CV"); },
};

const gG = grupo("gancho"), g3 = grupo("n3"), g2 = grupo("n2"), g1 = grupo("n1"), cG = grupo("cta");
// n2: notas musicais 3D saindo do projetor; n1: estrelinhas nascendo à frente do telão
const notas = []; for (let i = 0; i < 6; i++) { const n = new THREE.Group(); g2.add(n); mesh(new THREE.SphereGeometry(.1, 12, 8), E(PIPOCA, 1.2), n, 0, 0, 0).scale.set(1.3, 1, 1); box(.03, .38, .03, E(PIPOCA, 1.2), n, .11, .19, 0); notas.push(n); }
const brilhos = []; for (let i = 0; i < 24; i++) { const b = mesh(new THREE.OctahedronGeometry(.07, 0), E(i % 2 ? PIPOCA : CIANO, 2.4), g1, 0, 0, 0); b.castShadow = false; brilhos.push({ b, a: rnd() * 6.28, r: .6 + rnd() * 1.6, y: 1.2 + rnd() * 2.6, ph: rnd() }); }

// ---------- câmera: plongée (de cima, 3/4, rosto visível) na 1ª metade; contra-plongée (de baixo) na 2ª ----------
const SHOTS = {}; ["gancho", "n3", "n2", "n1", "cta"].forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d, t, sh) => { const meio = lt >= d / 2, u = meio ? (lt - d / 2) / (d / 2) : lt / (d / 2), lado = nome === "n2" ? -1 : 1;
  if (nome === "cta") { cam.position.set(Math.sin(lt * .4) * .5 - .4, .9, 5.2 - u * .3); cam.lookAt(-.4, 1.5, 0); }
  else if (nome === "gancho" && lt < 1.6) { cam.position.set(.2, 2.2, 6.4 - lt * .2); cam.lookAt(-.1, 1.6, -1); }
  else if (!meio) { cam.position.set(lado * (.5 + u * .3), 3.9 - u * .2, 5.9 - u * .3); cam.lookAt(-.05, 1.0, -.5); }
  else { cam.position.set(-lado * (.3 + u * .25), .5, 7.0 - u * .35); cam.lookAt(-.05, 1.6, -.5); }
  cam.position.x += Math.sin(t * 61) * sh; cam.position.y += Math.cos(t * 47) * sh; };

const ACT = {
  gancho(lt, d) { cozinha(lt); telT.draw("gancho", lin(lt, .2, d - .4), lt * 6); },
  n3(lt, d) { cozinha(lt, -1.05, .4, .35); telT.draw("n3", lin(lt, .4, d * .6), lt * 4); },
  n2(lt, d) { cozinha(lt, -1.05, .4, .4); telT.draw("n2", lin(lt, .3, 2), lt * 4); notas.forEach((n, i) => { const k = (lt * .35 + i / 6) % 1; n.position.set(1.8 - k * 1.5 + Math.sin(k * 9 + i) * .2, 1.7 + k * 1.4, -k * 1.2); n.rotation.z = Math.sin(lt * 3 + i) * .3; n.scale.setScalar(Math.sin(k * Math.PI) + .01); }); },
  n1(lt, d) { cozinha(lt, -1.05, .4, .35); telT.draw("n1", lin(lt, .2, d - .5), lt * 4); const on = lin(lt, 1.6, 2.6);
    brilhos.forEach(B => { const k = (lt * .5 + B.ph) % 1; B.b.visible = on > 0; B.b.position.set(.3 + Math.cos(B.a + lt * .5) * B.r * on, B.y + k * .4, -3.2 + Math.sin(B.a + lt * .5) * .6); B.b.scale.setScalar((1 - k) * on + .01); B.b.rotation.y = lt * 3; }); },
  cta(lt, d) { cozinha(lt, -.4, .4, .15, { braco: [.35 + Math.sin(lt * 5) * .2, .25 + Math.sin(lt * 7) * .18] }); telT.draw("cta", 1, lt * 4); },
};

// ---------- elementos de tela (2D) ----------
const CAB = { ult: null };
const ui = C => { const { X, gl, GW, GH, ITENS, eo, lin, eio, back, SEGR, CHAVE } = C;
  const cabe = (t, f, mx, fam = "SG", w = 700) => { while (f > 18) { X.font = `${w} ${f}px ${fam}`; if (X.measureText(t).width <= mx) break; f -= 2; } return f; };
  let TMP = null;
  const neon = (txt, x, y, fs, cor, t, falha = -1) => { X.font = `700 ${fs}px SG`; X.textAlign = "center"; X.textBaseline = "middle"; X.shadowColor = cor; X.shadowBlur = 28; X.fillStyle = cor; X.fillText(txt, x, y); X.shadowBlur = 10; X.fillStyle = "#fff8f0"; X.globalAlpha = .55; X.fillText(txt, x, y); X.globalAlpha = 1; X.shadowBlur = 0; };
  function cab(s, lt, t) { // carimbo + placar HI-SCORE
    X.save(); X.textBaseline = "middle"; X.textAlign = "left";
    X.fillStyle = CINE; X.beginPath(); X.roundRect(60, 536, 118, 96, 14); X.fill(); X.fillStyle = "#fff"; X.font = "700 62px SG"; X.textAlign = "center"; X.fillText(s.tag, 119, 586);
    const bate = lin(lt, .2, .35), sc = lt < .2 ? 0 : 1 + (1 - eo(bate)) * .9; if (sc > 0) { const nm = s.item.toUpperCase(); const fs = cabe(nm, 64, 620); const w = X.measureText(nm).width + 56;
      X.translate(200 + w / 2, 584); X.rotate(-.045); X.scale(sc, sc); X.globalAlpha = Math.min(1, bate * 2.5); X.fillStyle = "rgba(255,246,224,.92)"; X.fillRect(-w / 2, -50, w, 100); X.strokeStyle = CINE; X.lineWidth = 7; X.strokeRect(-w / 2, -50, w, 100); X.lineWidth = 2; X.strokeRect(-w / 2 + 9, -41, w - 18, 82);
      X.fillStyle = CINE; X.font = `700 ${fs}px SG`; X.textAlign = "center"; X.fillText(nm, 0, 4); X.globalCompositeOperation = "destination-out"; X.globalAlpha = .25; for (let i = 0; i < 40; i++) X.fillRect(-w / 2 + (i * 53) % w, -46 + (i * 29) % 92, 6, 3); }
    X.restore(); X.globalAlpha = 1;
    const v = Math.round(s.estrelas * eio(lin(lt, .35, 1.7))); X.fillStyle = "rgba(8,12,28,.9)"; X.beginPath(); X.roundRect(60, 656, 560, 92, 14); X.fill();
    X.fillStyle = PIPOCA; X.font = "400 20px PS"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("HI-SCORE", 84, 684); X.fillStyle = "#9fb0d8"; X.font = "700 22px SG"; X.fillText("ESTRELAS NO GITHUB", 84, 722);
    X.fillStyle = lt < 1.7 || Math.floor(t * 5) % 2 ? CIANO : "#fff"; X.font = "700 70px SG"; X.textAlign = "right"; X.fillText(String(v), 596, 704); }
  return {
    fundo(t) { const g = X.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, "#050a1e"); g.addColorStop(.45, NOITE); g.addColorStop(1, "#0a0f22"); X.fillStyle = g; X.fillRect(0, 0, 1080, 1920);
      X.fillStyle = "rgba(255,255,255,.7)"; for (let i = 0; i < 60; i++) { const s = 1.5 + (i % 3) * .8 + Math.sin(t * 2 + i) * .6; X.fillRect((i * 271) % 1080, (i * 157) % 760, s, s); } },
    etiqueta(t) { // letreiro neon
      const [l1, l2, l3] = SEGR[0].etiqueta; X.fillStyle = "rgba(10,8,24,.9)"; X.beginPath(); X.roundRect(50, 268, 920, 246, 22); X.fill();
      X.strokeStyle = CINE; X.lineWidth = 4; X.shadowColor = CINE; X.shadowBlur = 18; X.beginPath(); X.roundRect(60, 278, 900, 226, 18); X.stroke(); X.shadowBlur = 0;
      for (let i = 0; i < 22; i++) { X.fillStyle = (i + Math.floor(t * 4)) % 3 ? "rgba(255,210,63,.9)" : "rgba(255,210,63,.25)"; X.beginPath(); X.arc(80 + i * 40, 278, 5, 0, 7); X.fill(); X.beginPath(); X.arc(80 + i * 40, 504, 5, 0, 7); X.fill(); }
      neon(l1, 510, 338, cabe(l1, 58, 840), "#ff4a5e", t); neon(l2, 510, 400, cabe(l2, 50, 840), CIANO, t);
      X.font = `700 ${cabe(l3.toLowerCase(), 56, 840, "CV")}px CV`; X.textAlign = "center"; X.textBaseline = "middle"; X.shadowColor = PIPOCA; X.shadowBlur = 22; X.fillStyle = PIPOCA; X.fillText(l3.toLowerCase().replace("nº", "nº"), 510, 462); X.shadowBlur = 0; },
    cabecalho(s, lt, t) { CAB.ult = [s, lt, t]; },
    desenha3D(glc, nome) { if (!TMP) { TMP = document.createElement("canvas"); TMP.width = GW; TMP.height = GH; }
      const g = TMP.getContext("2d"); g.globalCompositeOperation = "source-over"; g.clearRect(0, 0, GW, GH); g.drawImage(glc, 0, 0); g.globalCompositeOperation = "destination-in";
      const m = g.createLinearGradient(0, 0, 0, GH); m.addColorStop(0, "rgba(0,0,0,0)"); m.addColorStop(.1, "#000"); m.addColorStop(.9, "#000"); m.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = m; g.fillRect(0, 0, GW, GH);
      if (nome === "cta") { X.save(); X.beginPath(); X.roundRect(140, 540, 800, 470, 26); X.clip(); X.drawImage(TMP, 0, 420, GW, GH); X.restore(); X.strokeStyle = PIPOCA; X.lineWidth = 5; X.beginPath(); X.roundRect(140, 540, 800, 470, 26); X.stroke(); return; }
      X.drawImage(TMP, 0, 640); if (CAB.ult) { cab(...CAB.ult); CAB.ult = null; } },
    legenda(seg, t) { // balão de fala do mascote
      const ws = seg.palavras, ch = []; let cur = []; for (const w of ws) { cur.push(w); if (/[.,:?!…]$/.test(w.w) || cur.length >= 5) { ch.push(cur); cur = []; } } if (cur.length) ch.push(cur);
      let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b], p = back(lin(t, c[0].t0 - .05, c[0].t0 + .12));
      let fs = 60; X.font = `700 ${fs}px SG`; const larg = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (larg() > 820 && fs > 34) { fs -= 2; X.font = `700 ${fs}px SG`; }
      const w = larg() + 70, h = fs + 64, x0 = Math.max(60, Math.min(950 - w, 330 - w * .25)), y0 = 1488 - h;
      X.save(); X.translate(330, y0 + h); X.scale(.85 + .15 * p, .85 + .15 * p); X.translate(-330, -(y0 + h)); X.shadowColor = "rgba(0,0,0,.45)"; X.shadowBlur = 18; X.fillStyle = CREME; X.beginPath(); X.roundRect(x0, y0, w, h, 34); X.fill();
      X.beginPath(); X.moveTo(290, y0 + 4); X.lineTo(250, y0 - 54); X.lineTo(370, y0 + 4); X.fill(); X.shadowColor = "transparent";
      let x = x0 + 35; X.textAlign = "left"; X.textBaseline = "middle"; for (const wd of c) { const on = t >= wd.t0 - .02; X.fillStyle = on && t < wd.t1 + .2 ? CINE : on ? TINTA : "rgba(18,15,28,.35)"; X.fillText(wd.w, x, y0 + h / 2 + 2); x += X.measureText(wd.w + " ").width; } X.restore(); },
    transicao(lt, s) { if (!s.item || lt > .4) return; const r = 40 + 1400 * eio(lt / .4); X.save(); X.fillStyle = "#05060d"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.arc(540, 1000, r, 0, Math.PI * 2, true); X.fill("evenodd"); X.restore(); },
    fechamento(lt) { // pódio
      const ord = [ITENS[1], ITENS[2], ITENS[0]], xs = [235, 540, 845], hs = [130, 190, 95], base = 1250;
      ord.forEach((s, i) => { const a = back(lin(lt, .1 + i * .12, .5 + i * .12)); if (a <= 0) return; const h = hs[i] * a, x = xs[i];
        X.fillStyle = ["#c9c6d6", PIPOCA, "#d08a4a"][i]; X.fillRect(x - 140, base - h, 280, h); X.fillStyle = TINTA; X.font = "700 52px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag, x, base - h + 42);
        X.fillStyle = CREME; X.font = `700 ${cabe(s.item, 40, 260)}px SG`; X.fillText(s.item, x, base - h - 30); });
      const p = eo(lin(lt, .6, 1.0)); X.save(); X.translate(540, 1340); X.scale(.7 + .3 * p, .7 + .3 * p); X.globalAlpha = p; X.fillStyle = CINE; X.beginPath(); X.roundRect(-400, -52, 800, 104, 20); X.fill();
      X.fillStyle = "#fff"; X.font = "700 70px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore(); X.globalAlpha = 1;
      X.save(); X.globalAlpha = lin(lt, .9, 1.3); X.fillStyle = PIPOCA; X.font = "700 52px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("que eu te mando as 3", 540, 1446); X.restore(); X.globalAlpha = 1; },
  }; };
const cores = { LAR: CINE, VERDE: CIANO, FUNDO: NOITE, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

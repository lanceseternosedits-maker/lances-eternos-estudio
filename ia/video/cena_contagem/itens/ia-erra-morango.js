// Reel ⚙️ como funciona "Por que a IA errava até pra contar letra" (07/11 21:00). Motor da cena_contagem (mesmo mascote 3D).
// Identidade: feira de manhã: barraca listrada, caixotes de morangos gigantes e ímãs de letra (S-T-R-A-W-B-E-R-R-Y) que se partem
// em pedaços coloridos (os tokens) e depois se alinham um a um e acendem; vermelho-morango + verde-folha + creme.
// Elementos: etiqueta em página de caderno, nome com letras caindo e encaixando, legenda uma palavra gigante por vez com pop,
// transição íris circular, câmera na mão, fechamento com post-its na parede, Caveat. Mascote de chapéu de palha de feirante
// (no topo: nada na frente do rosto; o avental do roteiro saiu porque um avental na frente do corpo pareceu boca e o Vitor negou
// outro vídeo por isso); ação principal: contar morangos nos dedos.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const VERM = "#d7263d", VERM2 = "#a3172b", FOLHA = "#3f9b3a", CREME = "#fbf1dc", TINTA = "#2a1a14", FUNDO = "#f3e3c3", CEU = "#bfe3f2", AMAR = "#ffd23f";
rim.color.set(0xfff2d0); rim.intensity = 1.2; key.color.set(0xfff4e0); key.intensity = 150; key.position.set(2, 9, 6); key.target.position.set(0, .8, 0);
S.add(new THREE.AmbientLight(0xfff0dd, .5));

// ---------- cenário: feira de manhã ----------
const fe = new THREE.Group(); S.add(fe);
const fundoT = ctex(512, 256, (g, w, h) => { const sk = g.createLinearGradient(0, 0, 0, h); sk.addColorStop(0, "#9fd6ee"); sk.addColorStop(1, "#e9f6f2"); g.fillStyle = sk; g.fillRect(0, 0, w, h);
  g.fillStyle = "#cfe8c4"; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(i * 64 + 20, h - 40, 50 + (i * 17) % 25, 0, 7); g.fill(); } g.fillStyle = "#e8d2a8"; g.fillRect(0, h - 40, w, 40); });
mesh(new THREE.PlaneGeometry(24, 10), new THREE.MeshBasicMaterial({ map: fundoT }), fe, 0, 4, -4.5).castShadow = false;
const chaoT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#cdb48a"; g.fillRect(0, 0, w, h); for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(${120 + (i % 60)},${95 + (i % 40)},70,.25)`; g.beginPath(); g.arc((i * 37) % w, (i * 91) % h, 2 + i % 4, 0, 7); g.fill(); } });
chaoT.wrapS = chaoT.wrapT = THREE.RepeatWrapping; chaoT.repeat.set(6, 4);
const chao = mesh(new THREE.PlaneGeometry(24, 14), new THREE.MeshStandardMaterial({ map: chaoT, roughness: .95 }), fe, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// barraca: balcão de madeira + toldo listrado vermelho/creme
const BAL = new THREE.Group(); BAL.position.set(.9, 0, -.9); fe.add(BAL); const mad = M("#a8743f", { roughness: .7 });
box(3.6, .9, 1.0, mad, BAL, 0, .45, 0); box(3.8, .08, 1.15, M("#c48b4c"), BAL, 0, .94, 0);
for (const x of [-1.8, 1.8]) box(.1, 2.9, .1, mad, BAL, x, 1.45, -.45);
const toldoT = ctex(512, 64, (g, w, h) => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? CREME : VERM; g.fillRect(i * 32, 0, 32, h); } });
const toldo = mesh(new THREE.BoxGeometry(4.0, .06, 1.5), new THREE.MeshStandardMaterial({ map: toldoT, roughness: .8 }), BAL, 0, 2.95, .1); toldo.rotation.x = .28;
const franjaT = ctex(512, 64, (g, w, h) => { g.clearRect(0, 0, w, h); for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? CREME : VERM; g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32 + 32, 0); g.lineTo(i * 32 + 32, 30); g.arc(i * 32 + 16, 30, 16, 0, Math.PI); g.fill(); } });
mesh(new THREE.PlaneGeometry(4.0, .4), new THREE.MeshStandardMaterial({ map: franjaT, transparent: true, side: THREE.DoubleSide }), BAL, 0, 2.62, .82).castShadow = false;
const TOPO = .98;
// morango gigante (corpo vermelho com sementes + folhas)
const semT = ctex(256, 128, (g, w, h) => { g.fillStyle = VERM; g.fillRect(0, 0, w, h); g.fillStyle = "#ffe08a"; for (let y = 8; y < h; y += 14) for (let x = (y / 14 % 2) * 9; x < w; x += 18) { g.beginPath(); g.ellipse(x, y, 2.4, 3.6, 0, 0, 7); g.fill(); } });
semT.wrapS = THREE.RepeatWrapping;
const geoMor = (() => { const pts = []; for (let i = 0; i <= 16; i++) { const t = i / 16, y = t; const r = Math.sin(Math.pow(t, .75) * Math.PI) * .5 * (t < .85 ? 1 : 1) + .001; pts.push(new THREE.Vector2(r * (t > .7 ? 1 - (t - .7) * 1.1 : 1), y)); } return new THREE.LatheGeometry(pts, 28); })();
const morM = new THREE.MeshStandardMaterial({ map: semT, roughness: .35 });
function morango(par, s = 1) { const g = new THREE.Group(); par.add(g); const b = mesh(geoMor, morM, g, 0, 0, 0); b.rotation.x = Math.PI; b.position.y = 1;
  for (let i = 0; i < 6; i++) { const f = mesh(new THREE.ConeGeometry(.12, .42, 4), M(FOLHA), g, 0, 1.0, 0); f.rotation.set(1.25, i / 6 * 6.283, 0); f.translateY(.16); }
  mesh(new THREE.CylinderGeometry(.03, .04, .18, 6), M("#2f6f2a"), g, 0, 1.1, 0); g.scale.setScalar(s); return g; }
// caixotes com morangos no balcão
for (const [x, n] of [[-1.15, 3], [1.15, 3]]) { const c = new THREE.Group(); c.position.set(x, TOPO, -.05); BAL.add(c); box(1.0, .3, .7, M("#d9b27a"), c, 0, .15, 0);
  for (let i = 0; i < n; i++) { const m = morango(c, .32); m.position.set(-.3 + i * .3, .18, (i % 2) * .12 - .06); m.rotation.set(.3, i, .2); } }
const morG = morango(fe, .95); morG.position.set(-.05, 0, 1.05);   // um morango enorme ao lado do mascote (palco da metáfora)

// ímãs de letra: STRAWBERRY em cubos coloridos sobre o balcão
const PAL = ["#ff5a5f", "#ffb627", "#3bceac", "#5b8cff", "#c86bff", "#ff8c42", "#2ec4b6", "#ff4f9a", "#7ac74f", "#4d9de0"];
const LET = "STRAWBERRY".split(""); const TOK = [0, 0, 0, 1, 1, 2, 2, 2, 2, 2];   // str | aw | berry
const TOKC = ["#5b8cff", AMAR, "#3bceac"];
const letT = (ch, cor, aceso) => ctex(128, 128, g => { g.fillStyle = cor; g.beginPath(); g.roundRect(0, 0, 128, 128, 22); g.fill(); g.fillStyle = aceso ? "#fff" : "#fffaf0"; g.font = "700 96px CV"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(ch, 64, 70); });
const IMAS = LET.map((ch, i) => { const g = new THREE.Group(); S.add(g); const mats = { base: letT(ch, PAL[i]), tok: letT(ch, TOKC[TOK[i]]), r: letT(ch, VERM, true), apag: letT(ch, "#bdb2a0") };
  const lado = M("#ffffff", { roughness: .4 }); const frente = new THREE.MeshStandardMaterial({ map: mats.base, roughness: .35 });
  const cubo = mesh(new THREE.BoxGeometry(.3, .3, .14), [lado, lado, lado, lado, frente, lado], g, 0, 0, 0); return { g, cubo, frente, mats, ch, i }; });
const LX = .9, LY = TOPO + .62, LZ = -.15, PASSO = .33;
const posLetra = (i, sep = 0) => V(LX + (i - 4.5) * PASSO + (TOK[i] - 1) * sep, LY, LZ);
function textura(I, nome) { if (I.frente.map !== I.mats[nome]) { I.frente.map = I.mats[nome]; I.frente.needsUpdate = true; } }

// ---------- mascote: chapéu de palha no topo; contar nos dedos ----------
const chapeu = new THREE.Group(); chapeu.position.set(0, 1.5, 0); MAS.corpo.add(chapeu); const palha = M("#e8c77a", { roughness: .9 });
mesh(new THREE.CylinderGeometry(.95, .95, .05, 36), palha, chapeu, 0, .03, 0); mesh(new THREE.CylinderGeometry(.42, .5, .4, 28), palha, chapeu, 0, .24, 0); mesh(new THREE.CylinderGeometry(.505, .505, .1, 28), M(VERM), chapeu, 0, .1, 0);
const MX = -1.55, MZ = .55;
const conta = (lt, ry = .35) => { const k = Math.floor(lt * 2.2) % 3; pose(MAS, { x: MX, z: MZ, y: hop(lt, .45, .05), ry, braco: [k === 0 ? 1.3 : .3, k === 1 ? 1.3 : k === 2 ? 2.0 : .4], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const confuso = lt => { pose(MAS, { x: MX, z: MZ, y: 0, ry: .3, braco: [.9 + Math.sin(lt * 4) * .2, .9 + Math.sin(lt * 4 + 2) * .2], piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(lt * 2.4) * .12; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .3), ry: .3, braco: [2.1 + Math.sin(lt * 9) * .3, 2.1 + Math.sin(lt * 9 + 1) * .3], sq: Math.max(0, Math.cos(lt * Math.PI / .35)) * .06, piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
// "?" flutuando (s3)
const intT = ctex(128, 128, g => { g.fillStyle = AMAR; g.beginPath(); g.arc(64, 64, 58, 0, 7); g.fill(); g.fillStyle = TINTA; g.font = "700 100px CV"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("?", 64, 72); });
const ints = [0, 1, 2].map(() => { const m = mesh(new THREE.PlaneGeometry(.4, .4), new THREE.MeshBasicMaterial({ map: intT, transparent: true }), S); m.castShadow = false; return m; });
// 3 morangos que pulam no balcão (s1: tem três) e acendem (s4)
const tres = [0, 1, 2].map(i => { const m = morango(S, .45); return m; });

const G0 = grupo("gancho"), G1 = grupo("s1"), G2 = grupo("s2"), G3 = grupo("s3"), G4 = grupo("s4"), GC = grupo("cta");
const repoe = () => { IMAS.forEach(I => { I.g.position.copy(posLetra(I.i)); I.g.rotation.set(0, 0, 0); I.g.scale.setScalar(1); I.g.visible = true; textura(I, "base"); }); ints.forEach(m => m.visible = false); tres.forEach(m => m.visible = false); };

// ---------- câmera na mão: tremor suave e deriva lenta ----------
const BASE = { gancho: [V(-.6, 2.0, 6.6), V(-.1, 1.0, -.2)], s1: [V(-.1, 1.8, 6.3), V(-.1, 1.1, -.2)], s2: [V(.1, 2.0, 6.0), V(-.05, 1.3, -.3)], s3: [V(-.9, 1.7, 5.8), V(-.4, 1.1, -.1)],
  s4: [V(.2, 1.9, 5.9), V(0, 1.3, -.3)], cta: [V(-.3, 1.9, 6.8), V(0, 1.1, -.2)] };
const SHOTS = {}; Object.keys(BASE).forEach(n => SHOTS[n] = [BASE[n], BASE[n]]);
const camera = (cam, nome, lt, d, t) => { const [p, l] = BASE[nome] || BASE.cta, u = lt / d;
  const nx = Math.sin(t * 1.3) * .06 + Math.sin(t * 3.7) * .025, ny = Math.sin(t * 1.7 + 1) * .05 + Math.sin(t * 4.3) * .02;
  cam.position.set(p.x + nx + (u - .5) * .35, p.y + ny, p.z - u * .35); cam.lookAt(l.x + nx * .4, l.y + ny * .4, l.z); cam.rotateZ(Math.sin(t * 1.1) * .012); };

const ACT = {
  gancho(lt, d) { repoe(); // ímãs caem no balcão um a um (encaixando); mascote conta nos dedos e erra
    IMAS.forEach(I => { const k = lin(lt, .5 + I.i * .17, .85 + I.i * .17); const p = posLetra(I.i); I.g.position.set(p.x, p.y + (1 - eo(k)) * 2.6 + (k > .98 ? 0 : 0), p.z); I.g.visible = k > 0; I.g.rotation.z = (1 - eo(k)) * (I.i % 2 ? .6 : -.6); });
    if (lt < 5) conta(lt); else confuso(lt); },
  s1(lt, d) { repoe(); IMAS.forEach(I => { if (I.ch === "R") textura(I, "r"); const sobe = I.ch === "R" ? Math.sin(lin(lt, .1 + [2, 7, 8].indexOf(I.i) * .25, .45 + [2, 7, 8].indexOf(I.i) * .25) * Math.PI) * .25 : 0; I.g.position.y += sobe; });
    tres.forEach((m, i) => { const k = back(lin(lt, .05 + i * .22, .4 + i * .22)); m.visible = k > .01; m.scale.setScalar(.45 * Math.max(.01, k)); m.position.set(-.3 + i * .5, TOPO - .9 + 0, .5); m.position.y = 0; m.position.set(.1 + i * .55, 0, 1.0); m.rotation.y = lt + i; });
    if (lt < 1.5) feliz(lt); else conta(lt); },
  s2(lt, d) { repoe(); // os ímãs se partem em 3 pedaços coloridos (tokens)
    const sep = eo(lin(lt, .7, 1.6)) * .35; IMAS.forEach(I => { I.g.position.copy(posLetra(I.i, sep)); if (lt > .7) textura(I, "tok"); I.g.position.y += Math.sin(lt * 3 + TOK[I.i]) * .03 * (sep > 0 ? 1 : 0); I.g.rotation.z = Math.sin(lt * 2 + TOK[I.i]) * .04; });
    conta(lt, .5); },
  s3(lt, d) { repoe(); IMAS.forEach(I => { I.g.position.copy(posLetra(I.i, .35)); textura(I, "tok"); I.g.rotation.z = Math.sin(lt * 2.5 + TOK[I.i] * 2) * .12; I.g.position.y += Math.sin(lt * 3 + TOK[I.i] * 2) * .05; });
    ints.forEach((m, i) => { const k = back(lin(lt, .1 + i * .2, .4 + i * .2)); m.visible = k > .01; m.scale.setScalar(Math.max(.01, k)); m.position.set(MX + .9 + i * .35, 1.9 + i * .28 + Math.sin(lt * 3 + i) * .05, MZ); m.lookAt(cam.position); });
    confuso(lt); },
  s4(lt, d) { repoe(); // as letras se alinham uma a uma e acendem; os R ficam vermelhos
    IMAS.forEach(I => { const k = lin(lt, .6 + I.i * .17, .8 + I.i * .17); const p = posLetra(I.i); I.g.position.set(p.x, p.y + Math.sin(k * Math.PI) * .18, p.z); textura(I, k <= 0 ? "apag" : I.ch === "R" ? "r" : "base"); I.g.scale.setScalar(1 + Math.sin(k * Math.PI) * .2); });
    tres.forEach((m, i) => { const k = back(lin(lt, 4.4 + i * .15, 4.7 + i * .15)); m.visible = k > .01; m.scale.setScalar(.45 * Math.max(.01, k)); m.position.set(.1 + i * .55, 0, 1.0); m.rotation.y = lt + i; });
    if (lt < 4.4) conta(lt); else feliz(lt); },
  cta(lt, d) { repoe(); IMAS.forEach(I => { if (I.ch === "R") textura(I, "r"); }); feliz(lt); },
};

// ---------- elementos de tela (2D), tudo entre y=260 e y=1500 e a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C;
  const GY3 = 640, U = {};
  const fonte = (f, txt, mx) => { while (f > 24) { X.font = `700 ${f}px CV`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const tiles = (txt, cx, y, tw, lt, t0, cores, sep = [], escala = 1) => { const n = txt.length, gap = 8, tot = n * tw + (n - 1) * gap + sep.reduce((a, b) => a + b, 0); let x = cx - tot / 2;
    for (let i = 0; i < n; i++) { if (sep[i]) x += sep[i]; const k = lin(lt, t0 + i * .07, t0 + i * .07 + .3); if (k <= 0) { x += tw + gap; continue; } const yy = y - (1 - eo(k)) * 260;
      X.save(); X.translate(x + tw / 2, yy + tw / 2); X.rotate((1 - eo(k)) * (i % 2 ? .5 : -.5)); X.scale(escala, escala); X.fillStyle = "rgba(0,0,0,.18)"; X.beginPath(); X.roundRect(-tw / 2 + 4, -tw / 2 + 6, tw, tw, 14); X.fill();
      X.fillStyle = cores(i); X.beginPath(); X.roundRect(-tw / 2, -tw / 2, tw, tw, 14); X.fill(); X.fillStyle = "#fff"; X.font = `700 ${Math.round(tw * .78)}px CV`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(txt[i], 0, 6); X.restore(); x += tw + gap; } };
  return Object.assign(U, {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); X.fillStyle = "rgba(215,38,61,.07)"; for (let i = 0; i < 14; i++) X.fillRect(0, i * 140, 1080, 70); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); const fg = X.createLinearGradient(0, GY3, 0, GY3 + 60); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(243,227,195,0)"); X.fillStyle = fg; X.fillRect(0, GY3, 1080, 60);
      const fb = X.createLinearGradient(0, GY3 + GH, 0, GY3 + GH - 70); fb.addColorStop(0, FUNDO); fb.addColorStop(1, "rgba(243,227,195,0)"); X.fillStyle = fb; X.fillRect(0, GY3 + GH - 70, 1080, 70);
      // nome: letras caindo e encaixando (STRAWBERRY) + resposta
      if (nome === "gancho") { tiles("STRAWBERRY", 500, 590, 76, lt, 2.6, i => PAL[i]); if (lt > 7.2) { const p = back(lin(lt, 7.2, 7.6)); X.save(); X.translate(840, 760); X.rotate(.1); X.scale(p, p); X.fillStyle = "#fff"; X.beginPath(); X.arc(0, 0, 78, 0, 7); X.fill(); X.strokeStyle = VERM; X.lineWidth = 8; X.stroke(); X.fillStyle = VERM; X.font = "700 110px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("2?", 0, 8); X.restore(); } }
      if (nome === "s1") { tiles("STRAWBERRY", 500, 590, 76, 9, 0, i => LET[i] === "R" ? VERM : "#bdb2a0"); const p = back(lin(lt, .1, .5)); X.save(); X.translate(840, 760); X.rotate(-.08); X.scale(p, p); X.fillStyle = FOLHA; X.beginPath(); X.arc(0, 0, 78, 0, 7); X.fill(); X.fillStyle = "#fff"; X.font = "700 120px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("3", 0, 8); X.restore(); }
      if (nome === "s2" || nome === "s3") { const sp = nome === "s2" ? eo(lin(lt, .7, 1.6)) * 34 : 34; tiles("STRAWBERRY", 500, 590, 72, 9, 0, i => lt > .7 || nome === "s3" ? TOKC[TOK[i]] : PAL[i], [0, 0, 0, sp, 0, sp]);
        if (nome === "s2" && lt > 2.3) { const p = back(lin(lt, 2.3, 2.7)); X.save(); X.translate(500, 760); X.scale(p, p); X.fillStyle = TINTA; X.beginPath(); X.roundRect(-150, -42, 300, 84, 42); X.fill(); X.fillStyle = AMAR; X.font = "700 64px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("tokens", 0, 4); X.restore(); } }
      if (nome === "s4") { const n = Math.min(10, Math.max(0, Math.floor((lt - .6) / .17) + 1)); tiles("STRAWBERRY", 500, 590, 76, 9, 0, i => i < n ? (LET[i] === "R" ? VERM : FOLHA) : "#bdb2a0");
        if (lt > 4.4) { const p = back(lin(lt, 4.4, 4.8)); X.save(); X.translate(840, 760); X.scale(p, p); X.fillStyle = FOLHA; X.beginPath(); X.arc(0, 0, 78, 0, 7); X.fill(); X.fillStyle = "#fff"; X.font = "700 100px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("3 ✓", 0, 8); X.restore(); } } },
    etiqueta(t, nome) { // página de caderno presa no topo (sem animação de entrada: 1º quadro legível)
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(510, 400); X.rotate(-.015); X.shadowColor = "rgba(60,30,10,.25)"; X.shadowBlur = 18; X.shadowOffsetY = 6; X.fillStyle = "#fffdf6"; X.fillRect(-440, -125, 880, 250); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(91,140,255,.35)"; X.lineWidth = 2; for (let y = -70; y < 125; y += 56) { X.beginPath(); X.moveTo(-440, y); X.lineTo(440, y); X.stroke(); } X.strokeStyle = "rgba(215,38,61,.55)"; X.beginPath(); X.moveTo(-370, -125); X.lineTo(-370, 125); X.stroke();
      for (let i = 0; i < 7; i++) { X.fillStyle = FUNDO; X.beginPath(); X.arc(-400, -100 + i * 34, 7, 0, 7); X.fill(); }
      X.fillStyle = "rgba(255,210,63,.75)"; X.save(); X.rotate(-.05); X.fillRect(-120, -142, 240, 36); X.restore();
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; fonte(62, l1, 780); X.fillText(l1, -350, -22);
      X.fillStyle = VERM; fonte(58, l2, 780); X.fillText(l2, -350, 40); X.fillStyle = FOLHA; fonte(50, l3, 780); X.fillText(l3, -350, 96); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { // uma palavra gigante por vez com pop
      const ws = seg.palavras; let w = ws.findIndex(x => t < x.t1 + .06); if (w < 0) w = ws.length - 1; const W = ws[w]; if (t < W.t0 - .25) return;
      const p = back(lin(t, W.t0 - .04, W.t0 + .14)); const txt = W.w.replace(/[,.:]$/, ""), chave = txt.replace(/[?!]/g, "") === CHAVE;
      const f = fonte(130, txt, 820); X.save(); X.translate(510, 1395); X.scale(.6 + .4 * p, .6 + .4 * p); X.textAlign = "center"; X.textBaseline = "middle";
      X.lineWidth = 16; X.strokeStyle = "#fff"; X.lineJoin = "round"; X.strokeText(txt, 0, 0); X.fillStyle = chave ? VERM : TINTA; X.fillText(txt, 0, 0); X.restore(); },
    transicao(lt, s, nome) { // íris circular abrindo a partir do centro
      if (!["s1", "s2", "s3", "s4", "cta"].includes(nome) || lt > .38) return; const r = eio(lt / .38) * 1300;
      X.save(); X.fillStyle = VERM; X.beginPath(); X.rect(0, 0, 1080, 1920); X.moveTo(510 + Math.max(1, r), 1000); X.arc(510, 1000, Math.max(1, r), 0, Math.PI * 2, true); X.closePath(); X.fill(); X.strokeStyle = CREME; X.lineWidth = 18; X.beginPath(); X.arc(510, 1000, Math.max(1, r), 0, Math.PI * 2); X.stroke(); X.restore(); },
    fechamento(lt) { // post-its na parede
      const P = [["COMENTA " + CHAVE, AMAR, 510, 820, -.04, 72, VERM], ["peça pra ela soletrar letra por letra", "#9be3c4", 300, 1340, .05, 50, TINTA], ["antes de contar", "#ffb3c1", 700, 1350, -.06, 50, TINTA]];
      P.forEach(([txt, cor, x, y, r, f, tc], i) => { const p = back(lin(lt, i * .2, i * .2 + .35)); if (p <= 0) return; X.save(); X.translate(x, y); X.rotate(r); X.scale(p, p);
        const w = i ? 360 : 640, h = i ? 200 : 180; X.shadowColor = "rgba(60,30,10,.3)"; X.shadowBlur = 16; X.shadowOffsetY = 8; X.fillStyle = cor; X.fillRect(-w / 2, -h / 2, w, h); X.shadowColor = "transparent";
        X.fillStyle = "rgba(255,255,255,.5)"; X.fillRect(-50, -h / 2 - 14, 100, 28); X.fillStyle = tc; X.textAlign = "center"; X.textBaseline = "middle"; X.font = `700 ${f}px CV`;
        const ws = txt.split(" "), L = []; let c = ""; for (const w2 of ws) { const tt = c ? c + " " + w2 : w2; if (X.measureText(tt).width > w - 40 && c) { L.push(c); c = w2; } else c = tt; } L.push(c);
        L.forEach((l, k) => X.fillText(l, 0, (k - (L.length - 1) / 2) * f * 1.05 + 4)); X.restore(); }); },
  }); };
const cores = { LAR: VERM, VERDE: FOLHA, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

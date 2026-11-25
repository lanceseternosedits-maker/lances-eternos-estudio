// Reel 📜 história "O chatbot que a Microsoft desligou em 1 dia" (08/11 19:00). Motor da cena_contagem (mesmo mascote 3D), cenas gancho, s1–s4, cta.
// Identidade: quarto adolescente de 2016 com telão de rede social genérica (sem logo de ninguém), balões de mensagem chovendo
// que ficam vermelhos (sem texto: nunca mostramos nem repetimos as ofensas), sirene girando e botão gigante DESLIGAR;
// no fim, um filtro (peneira) que segura os balões vermelhos. Paleta azul-claro + rosa + vermelho-alerta.
// Elementos: etiqueta em tela de terminal, nome em texto embaralhado decifrando, legenda em tarja de TV/arcade, transição glitch RGB,
// câmera na mão, fechamento em tela CONTINUE? com contagem, Bebas Neue. Mascote de boné (no topo) e fone (conchas nas laterais):
// nada na frente do rosto nem abaixo dos olhos; ação principal: tentar segurar os balões que caem.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const AZUL = "#7cc8ff", AZUL2 = "#3a8ee6", ROSA = "#ff7eb6", ROSA2 = "#ffb3d3", VERM = "#ff3b3b", CREME = "#fff6fb", TINTA = "#16182a", FUNDO = "#101a33", VERDE = "#46f08a";
rim.color.set(0xff9ccf); rim.intensity = 1.4; key.color.set(0xeaf4ff); key.intensity = 140; key.position.set(1.5, 9, 6); key.target.position.set(0, .8, 0);
S.add(new THREE.AmbientLight(0xdfe8ff, .45));

// ---------- cenário: quarto de 2016 ----------
const q = new THREE.Group(); S.add(q);
const paredeT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#bfe3ff"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,126,182,.35)"; for (let i = 0; i < 40; i++) { const x = (i * 97) % w, y = (i * 53) % (h - 40); g.beginPath(); g.arc(x, y, 3 + i % 3, 0, 7); g.fill(); }
  g.fillStyle = "#9fd0f5"; g.fillRect(0, h - 36, w, 36); });
paredeT.wrapS = THREE.RepeatWrapping; paredeT.repeat.set(3, 1);
mesh(new THREE.PlaneGeometry(22, 9), new THREE.MeshStandardMaterial({ map: paredeT, roughness: .9 }), q, 0, 3.6, -3.4);
const pisoT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#e9d8f0"; g.fillRect(0, 0, w, h); for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(${200 + i % 40},${150 + i % 50},${200 + i % 30},.35)`; g.fillRect((i * 37) % w, (i * 91) % h, 3, 3); } });
pisoT.wrapS = pisoT.wrapT = THREE.RepeatWrapping; pisoT.repeat.set(6, 4);
const piso = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: pisoT, roughness: .95 }), q, 0, 0, 1); piso.rotation.x = -Math.PI / 2;
// pôsteres genéricos (formas), cama com colcha rosa, luzinhas
for (const [x, y, c] of [[-3.2, 3.2, ROSA], [-2.3, 3.6, AZUL2], [3.4, 3.3, "#ffd23f"]]) { const p = box(.7, .9, .03, M(c, { roughness: .8 }), q, x, y, -3.35); p.castShadow = false; }
const cama = new THREE.Group(); cama.position.set(-3.1, 0, -1.6); q.add(cama); box(1.8, .45, 2.4, M("#f2f2f7"), cama, 0, .225, 0); box(1.85, .14, 2.3, M(ROSA, { roughness: .9 }), cama, 0, .5, .05); box(.9, .2, .45, M(CREME), cama, 0, .62, -.9);
const luzes = []; for (let i = 0; i < 14; i++) { const l = mesh(new THREE.SphereGeometry(.05, 8, 6), E(i % 2 ? ROSA : "#ffe27a", 2), q, -3.6 + i * .55, 4.1 - Math.sin(i / 13 * Math.PI) * .35, -3.3); l.castShadow = false; luzes.push(l); }
// telão de rede social genérica: feed de balões; k = estado (0 azul, 1 vermelho/alerta, 2 desligado, 3 filtro)
const TEL = V(1.25, 2.15, -2.6);
const telaT = ctex(512, 320, (g, w, h, k = 0, t = 0) => { g.fillStyle = k === 2 ? "#05070d" : "#f4f8ff"; g.fillRect(0, 0, w, h); if (k === 2) { g.fillStyle = "#1c2236"; g.font = "400 46px BB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("OFFLINE", w / 2, h / 2); return; }
  g.fillStyle = k === 1 ? VERM : AZUL2; g.fillRect(0, 0, w, 44); g.fillStyle = "#fff"; g.font = "400 30px BB"; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText(k === 1 ? "⚠ ALERTA" : "FEED", 16, 24);
  // avatar genérico do robô (círculo + 2 olhos)
  g.fillStyle = ROSA; g.beginPath(); g.arc(470, 22, 16, 0, 7); g.fill(); g.fillStyle = TINTA; g.fillRect(463, 16, 4, 10); g.fillRect(473, 16, 4, 10);
  for (let i = 0; i < 6; i++) { const y = 60 + ((i * 52 - t * 70) % 312 + 312) % 312, dir = i % 2, red = k === 1 && (i + Math.floor(t * 2)) % 3 !== 0, blk = k === 3 && red;
    g.fillStyle = red ? (blk ? "#c9ced9" : VERM) : dir ? ROSA2 : AZUL; const x = dir ? 190 : 24; g.beginPath(); g.roundRect(x, y, 300, 40, 18); g.fill();
    g.fillStyle = "rgba(255,255,255,.75)"; if (!red) { g.fillRect(x + 18, y + 12, 160 + (i * 41) % 90, 6); g.fillRect(x + 18, y + 24, 90, 6); } else { g.font = "400 30px BB"; g.fillStyle = "#fff"; g.textAlign = "center"; g.fillText(blk ? "BLOQUEADO" : "⚠ REMOVIDO", x + 150, y + 22); g.textAlign = "left"; } } });
const mold = box(3.3, 2.15, .14, M("#20263f", { roughness: .4 }), q, TEL.x, TEL.y, TEL.z - .08);
const tela = mesh(new THREE.PlaneGeometry(3.1, 1.94), new THREE.MeshBasicMaterial({ map: telaT, toneMapped: false }), q, TEL.x, TEL.y, TEL.z); tela.castShadow = false;
const brilho = new THREE.PointLight(0x9fd0ff, 6, 6, 1.6); brilho.position.set(TEL.x, TEL.y, TEL.z + 1.2); q.add(brilho);
// sirene em cima do telão
const sir = new THREE.Group(); sir.position.set(TEL.x + 1.35, TEL.y + 1.2, TEL.z); q.add(sir); box(.36, .1, .36, M("#333a55"), sir, 0, 0, 0);
const sirC = mesh(new THREE.CylinderGeometry(.14, .17, .3, 20), new THREE.MeshStandardMaterial({ color: VERM, emissive: VERM, emissiveIntensity: .3, transparent: true, opacity: .9 }), sir, 0, .2, 0);
const sirL = new THREE.SpotLight(0xff3030, 0, 9, .5, .6, 1); sirL.position.set(0, .2, 0); sir.add(sirL); sir.add(sirL.target);
const sirene = (on, t) => { sirC.material.emissiveIntensity = on ? 2.2 : .3; sirL.intensity = on ? 60 : 0; const a = t * 7; sirL.target.position.set(Math.cos(a) * 3, -1, Math.sin(a) * 3); };
// botão gigante DESLIGAR num pedestal à direita
const bot = new THREE.Group(); bot.position.set(1.7, 0, .7); q.add(bot); mesh(new THREE.CylinderGeometry(.42, .5, .8, 28), M("#e7e9f2"), bot, 0, .4, 0);
const botT = ctex(256, 64, (g, w, h) => { g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); g.fillStyle = VERM; g.font = "400 46px BB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("DESLIGAR", w / 2, h / 2 + 2); });
mesh(new THREE.PlaneGeometry(.66, .17), new THREE.MeshBasicMaterial({ map: botT }), bot, 0, .55, .505).castShadow = false;
const cup = mesh(new THREE.CylinderGeometry(.34, .36, .18, 28), new THREE.MeshStandardMaterial({ color: VERM, emissive: VERM, emissiveIntensity: .25, roughness: .3 }), bot, 0, .89, 0);
// balões 3D que chovem (cápsulas achatadas com rabinho), viram vermelhos
const BAL = []; for (let i = 0; i < 16; i++) { const g = new THREE.Group(); q.add(g); const mat = new THREE.MeshStandardMaterial({ color: AZUL, roughness: .35, emissive: "#000" });
  mesh(new THREE.CapsuleGeometry(.16, .36, 6, 14), mat, g, 0, 0, 0).rotation.z = Math.PI / 2; mesh(new THREE.ConeGeometry(.07, .14, 8), mat, g, -.2, -.16, 0).rotation.z = .6;
  BAL.push({ g, mat, x: -2.8 + (i * 0.37) % 3.6, z: -.9 + (i % 4) * .2, ph: (i * .618) % 1, v: .8 + (i % 5) * .12 }); }
function chove(lt, vel, verm, filtro) { BAL.forEach((b, i) => { const u = ((lt * vel * b.v * .35 + b.ph) % 1), y = 4.4 - u * 4.6; let yy = y; const red = verm > 0 && (i % 3 !== 0 || verm > 1);
  if (filtro && red && yy < 1.75) yy = 1.75 + Math.sin(lt * 3 + i) * .03;   // a peneira segura os vermelhos
  b.g.visible = true; b.g.position.set(b.x + Math.sin(lt * 1.5 + i) * .12, Math.max(.2, yy), b.z); b.g.rotation.z = Math.sin(lt * 2 + i) * .2;
  b.mat.color.set(red ? VERM : i % 2 ? ROSA2 : AZUL); b.mat.emissive.set(red ? "#5a0000" : "#000"); }); }
const esconde = () => BAL.forEach(b => b.g.visible = false);
// peneira/filtro (s4): aro + tela em grade, na altura dos balões
const filT = ctex(256, 256, (g, w, h) => { g.clearRect(0, 0, w, h); g.strokeStyle = "rgba(70,240,138,.9)"; g.lineWidth = 4; for (let x = 0; x <= w; x += 22) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); g.beginPath(); g.moveTo(0, x); g.lineTo(w, x); g.stroke(); } });
const fil = new THREE.Group(); q.add(fil); const filP = mesh(new THREE.PlaneGeometry(3.8, 1.6), new THREE.MeshBasicMaterial({ map: filT, transparent: true, side: THREE.DoubleSide, toneMapped: false }), fil, 0, 0, 0); filP.rotation.x = -Math.PI / 2; filP.castShadow = false;
box(3.9, .06, .06, E(VERDE, 1.5), fil, 0, 0, .8); box(3.9, .06, .06, E(VERDE, 1.5), fil, 0, 0, -.8); fil.position.set(-.85, 1.6, .1);

// ---------- mascote: boné no topo (aba curta, clara) e fone com conchas nas laterais ----------
const bone = new THREE.Group(); bone.position.set(0, 1.5, -.05); MAS.corpo.add(bone);
mesh(new THREE.SphereGeometry(.5, 28, 12, 0, 6.283, 0, 1.3), M(ROSA, { roughness: .7 }), bone, 0, 0, 0).scale.set(1.2, .75, 1.05);
box(.8, .035, .3, M(ROSA2, { roughness: .7 }), bone, 0, .0, .58);
bone.traverse(o => { o.castShadow = false; o.receiveShadow = false; });
const arco = mesh(new THREE.TorusGeometry(.8, .045, 10, 30, Math.PI), M("#e9ecf6", { roughness: .4 }), MAS.corpo, 0, 1.1, 0); arco.castShadow = false;
for (const s of [-1, 1]) mesh(new THREE.CylinderGeometry(.17, .17, .12, 20), M(AZUL2, { roughness: .4 }), MAS.corpo, s * .8, 1.1, 0).rotation.z = Math.PI / 2;
const MX = -.85, MZ = .55;
function segura(lt, vel = 1) { lt += .5; const x = MX + Math.sin(lt * 1.7 * vel) * .7; pose(MAS, { x, z: MZ, y: hop(lt, .45 / vel, .22), andar: lt * 2 * vel, ry: Math.sin(lt * 1.7 * vel) * .2, braco: [2.4 + Math.sin(lt * 8) * .25, 2.4 + Math.sin(lt * 8 + 1.5) * .25], piscar: pisca(lt) }); MAS.g.rotation.z = Math.cos(lt * 1.7 * vel) * .08; }
function fala(lt, x = MX, ry = .2) { pose(MAS, { x, z: MZ, y: hop(lt, .5, .05), ry, braco: [.35 + Math.sin(lt * 4) * .12, .5 + Math.sin(lt * 5) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; }

const G0 = grupo("gancho"), G1 = grupo("s1"), G2 = grupo("s2"), G3 = grupo("s3"), G4 = grupo("s4"), GC = grupo("cta");
const repoe = () => { esconde(); fil.visible = false; sirene(false, 0); cup.position.y = .89; brilho.color.set(0x9fd0ff); brilho.intensity = 6; luzes.forEach((l, i) => l.material.emissiveIntensity = 1.6 + Math.sin(i) * .4); };

// ---------- câmera na mão: leve balanço contínuo + tremida maior no alerta ----------
const MAO = { gancho: [[.1, 2.0, 7.4, 1.6], [.3, 1.9, 6.8, 1.6]], s1: [[.5, 2.1, 7.0, 1.8], [.2, 1.8, 6.6, 1.6]], s2: [[-.2, 1.9, 7.2, 1.6], [.1, 2.0, 6.7, 1.7]],
  s3: [[.6, 1.9, 6.8, 1.4], [.3, 1.9, 7.0, 1.6]], s4: [[-.3, 2.3, 7.2, 1.6], [0, 2.1, 6.8, 1.6]], cta: [[0, 2.0, 7.6, 1.6], [0, 2.0, 7.6, 1.6]] };
const SHOTS = {}; Object.keys(MAO).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
let TREME = 0;
const camera = (cam, nome, lt, d, t) => { const [A, B] = MAO[nome] || MAO.cta, f = lt < d / 2 ? A : B, u = eio((lt < d / 2 ? lt : lt - d / 2) / (d / 2));
  const hx = Math.sin(t * 1.3) * .07 + Math.sin(t * 3.1) * .03 + Math.sin(t * 37) * .03 * TREME, hy = Math.sin(t * 1.7 + 1) * .05 + Math.cos(t * 29) * .03 * TREME;
  cam.position.set(f[0] + hx, f[1] + hy, f[2] - u * .3); cam.lookAt(.15 + hx * .5, f[3] + hy * .4, -.6); };

const ACT = {
  gancho(lt, d) { repoe(); TREME = lt > 4.7 ? 1 : 0; const alerta = lt > 4.7; telaT.draw(alerta ? 1 : 0, lt); sirene(alerta, lt); if (alerta) { brilho.color.set(0xff6060); }
    chove(lt, alerta ? 1.6 : 1, alerta ? 1 : 0); segura(lt, alerta ? 1.5 : 1); },
  s1(lt, d) { repoe(); TREME = 0; telaT.draw(0, lt + 7); chove(lt, .9, 0); if (lt < 1.0) fala(lt); else segura(lt, .9); },
  s2(lt, d) { repoe(); TREME = lt > 2.6 ? 1.3 : .3; const r = lt > 2.6; telaT.draw(r ? 1 : 0, lt + 11); sirene(r, lt); if (r) brilho.color.set(0xff6060); chove(lt, r ? 2.1 : 1.2, r ? (lt > 4.2 ? 2 : 1) : 0); segura(lt, r ? 1.8 : 1.2);
    if (lt > 4.2) { MAS.g.position.y = 0; MAS.corpo.scale.set(1.06, .9, 1.06); } },
  s3(lt, d) { repoe(); TREME = lt < .7 ? .6 : 0; const ap = lin(lt, .4, .6), off = lt > .6; // o mascote pula no botão DESLIGAR; tudo apaga
    telaT.draw(off ? 2 : 1, lt); sirene(!off, lt); brilho.intensity = off ? 0 : 6; brilho.color.set(0xff6060); if (!off) chove(lt, 2, 1); cup.position.y = .89 - Math.sin(ap * Math.PI) * .1;
    if (lt < .65) pose(MAS, { x: .95 + (1 - eo(lin(lt, 0, .3))) * -.8, z: .7, y: Math.sin(lin(lt, 0, .6) * Math.PI) * .9, ry: .3, braco: [2.3, 2.3], piscar: 1 });
    else fala(lt, .7, -.25); MAS.g.rotation.z = 0; },
  s4(lt, d) { repoe(); TREME = 0; telaT.draw(3, lt); fil.visible = true; fil.scale.setScalar(Math.max(.01, back(lin(lt, .1, .6)))); chove(lt, 1.1, 1, true); fala(lt, MX - .6, .25); },
  cta(lt, d) { repoe(); TREME = 0; telaT.draw(2, 0); brilho.intensity = 0; fala(lt, -.4, .1); luzes.forEach((l, i) => l.material.emissiveIntensity = (Math.floor(lt * 4) + i) % 2 ? 2.4 : .6); },
};

// ---------- elementos de tela (2D), tudo entre y=260 e y=1500 e a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, decifra } = C;
  const GY3 = 590, U = {};
  const quebra = (txt, mx) => { const ws = txt.split(" "), L = []; let cur = ""; for (const w of ws) { const tt = cur ? cur + " " + w : w; if (X.measureText(tt).width > mx && cur) { L.push(cur); cur = w; } else cur = tt; } if (cur) L.push(cur); return L; };
  const revela = (txt, x, y, fs, lt, t0, cor, fundo = "rgba(16,26,51,.9)") => { if (lt < t0) return; const p = eo(lin(lt, t0, t0 + .7)), s = decifra(txt, p, Math.floor(lt * 22));
    X.font = `400 ${fs}px BB`; const w = X.measureText(txt).width + fs * .7; X.fillStyle = fundo; X.beginPath(); X.roundRect(x - w / 2, y - fs * .62, w, fs * 1.24, 12); X.fill();
    X.fillStyle = cor; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s, x, y + fs * .05); };
  return Object.assign(U, {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); const v = X.createRadialGradient(540, 1000, 60, 540, 1000, 820); v.addColorStop(0, "rgba(255,126,182,.14)"); v.addColorStop(1, "rgba(0,0,0,0)"); X.fillStyle = v; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); const fg = X.createLinearGradient(0, GY3, 0, GY3 + 70); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(16,26,51,0)"); X.fillStyle = fg; X.fillRect(0, GY3, 1080, 70);
      const fb = X.createLinearGradient(0, GY3 + GH, 0, GY3 + GH - 90); fb.addColorStop(0, FUNDO); fb.addColorStop(1, "rgba(16,26,51,0)"); X.fillStyle = fb; X.fillRect(0, GY3 + GH - 90, 1080, 90);
      if (nome === "gancho") revela("MENOS DE 1 DIA NO AR", 520, 680, 74, lt, 4.8, VERM);
      if (nome === "s1") revela("TAY", 300, 700, 150, lt, .0, ROSA);
      if (nome === "s2" && lt > 2.6) revela("⚠ CONTEÚDO REMOVIDO", 520, 680, 70, lt, 2.6, "#fff", "rgba(255,59,59,.92)");
      if (nome === "s3") revela("DESCULPAS EM PÚBLICO · 25/03/2016", 520, 680, 58, lt, 1.0, AZUL);
      if (nome === "s4") revela("FILTRO: LIGADO", 520, 680, 74, lt, .3, VERDE); },
    etiqueta(t, nome) { // tela de terminal (preta, texto verde/rosa); estática no 1º quadro
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.shadowColor = "rgba(0,0,0,.55)"; X.shadowBlur = 26; X.fillStyle = "#06080f"; X.beginPath(); X.roundRect(70, 280, 880, 290, 18); X.fill(); X.shadowColor = "transparent";
      X.fillStyle = "#1d2236"; X.beginPath(); X.roundRect(70, 280, 880, 44, [18, 18, 0, 0]); X.fill(); [VERM, "#ffd23f", VERDE].forEach((c, i) => { X.fillStyle = c; X.beginPath(); X.arc(102 + i * 30, 302, 9, 0, 7); X.fill(); });
      X.fillStyle = "#8a93b8"; X.font = "500 22px JB"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("~/historia-da-ia  ·  " + l2.toLowerCase(), 200, 303);
      X.fillStyle = VERDE; X.font = "400 64px BB"; X.textBaseline = "alphabetic"; const L = quebra("> " + l1, 820); L.slice(0, 2).forEach((l, i) => X.fillText(l, 100, 398 + i * 66));
      X.fillStyle = ROSA; X.font = "400 46px BB"; X.fillText(l3 + (Math.floor(t * 2) % 2 ? " _" : ""), 100, 540); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { // tarja de TV/arcade: faixa rosa com borda azul e selo REC piscando
      const ws = seg.palavras, ch = []; let cur = []; for (const w of ws) { cur.push(w); if (/[.,:?!]$/.test(w.w) || cur.length >= 5) { ch.push(cur); cur = []; } } if (cur.length) ch.push(cur);
      let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      X.font = "400 72px BB"; const L = quebra(c.map(w => w.w).join(" "), 820), h = 30 + L.length * 74, y0 = 1490 - h;
      X.fillStyle = "rgba(10,14,30,.94)"; X.fillRect(60, y0, 890, h); X.fillStyle = AZUL; X.fillRect(60, y0, 890, 6); X.fillRect(60, y0 + h - 6, 890, 6);
      X.fillStyle = ROSA; X.fillRect(60, y0 - 46, 200, 46); X.fillStyle = TINTA; X.font = "400 34px BB"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText((Math.floor(t * 2) % 2 ? "● " : "○ ") + "REC  2016", 76, y0 - 21);
      X.font = "400 72px BB"; let k = 0; L.forEach((l, i) => { let xx = 92; for (const pw of l.split(" ")) { const wd = c[k++]; const on = wd && t >= wd.t0 - .02, atual = on && wd && t < wd.t1 + .2;
        X.fillStyle = pw.replace(/[.,!?:]/g, "") === CHAVE ? "#ffd23f" : atual ? ROSA : on ? CREME : "rgba(255,246,251,.3)"; X.fillText(pw, xx, y0 + 52 + i * 74); xx += X.measureText(pw + " ").width; } }); },
    transicao(lt, s, nome) { // glitch RGB: faixas deslocadas em ciano/magenta por 0,25 s
      if (nome === "gancho" || lt > .25) return; const k = 1 - lt / .25; X.save(); X.globalCompositeOperation = "screen";
      for (let i = 0; i < 14; i++) { const y = 300 + ((i * 173 + Math.floor(lt * 60) * 61) % 1180), h = 14 + (i * 23) % 50, dx = ((i % 2) ? 1 : -1) * (20 + (i * 37) % 60) * k;
        X.fillStyle = i % 2 ? `rgba(0,229,255,${.45 * k})` : `rgba(255,40,140,${.45 * k})`; X.fillRect(dx, y, 1080, h); }
      X.restore(); if (lt < .06) { X.fillStyle = "rgba(255,255,255,.18)"; X.fillRect(0, 0, 1080, 1920); } },
    fechamento(lt) { // tela CONTINUE? com contagem regressiva e a pergunta
      X.fillStyle = "rgba(6,8,15,.82)"; X.fillRect(60, 620, 890, 840); X.strokeStyle = ROSA; X.lineWidth = 6; X.strokeRect(70, 630, 870, 820);
      const p = back(lin(lt, 0, .4)); X.save(); X.translate(505, 770); X.scale(p, p); X.fillStyle = "#ffd23f"; X.font = "400 130px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("CONTINUE?", 0, 0); X.restore();
      const n = Math.max(0, 9 - Math.floor(lt * 2)); X.fillStyle = VERM; X.font = "400 190px BB"; X.textAlign = "center"; X.fillText(String(n), 505, 960);
      if (lt > .8) { X.fillStyle = CREME; X.font = "400 54px BB"; X.fillText("A CULPA FOI DA IA", 505, 1100); X.fillText("OU DAS PESSOAS?", 505, 1160); }
      const pul = 1 + Math.sin(lt * 7) * .03; X.save(); X.translate(505, 1320); X.scale(pul, pul); X.fillStyle = ROSA; X.beginPath(); X.roundRect(-300, -62, 600, 124, 62); X.fill();
      X.fillStyle = TINTA; X.font = "400 84px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 6); X.restore(); },
  }); };
const cores = { LAR: ROSA, VERDE: AZUL, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

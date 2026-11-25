// Reel "5 jogos de console rodando no celular" (08/11 09:00). Identidade: pátio de escola no recreio ao entardecer,
// laranja-pôr-do-sol + azul-uniforme + cinza-cimento. Elementos: etiqueta em tela de terminal, nome em carimbo, placar HI-SCORE,
// legenda em tarja de TV, transição de zoom atravessando a tela do celular, câmera plongée/contra-plongée, fechamento em pódio,
// Caveat + Space Grotesk. Mascote de boné virado para trás, martelando o "console" para dentro do celular.
// Sem logos, personagens ou artes de Nintendo/Sony/Rockstar/Blizzard. Tudo do texto importante entre y=260 e y=1500, x<=950.
export default function (K) {
const { rim, key, THREE, S, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const SOL = "#ff8a3d", AZUL = "#2f5bd3", CIM = "#a8a39b", CREME = "#fff3e0", TINTA = "#16130f", OURO = "#ffd23f";

// ---------- cenário: pátio de cimento, muro azul, bancos e mochilas ----------
const pat = new THREE.Group(); S.add(pat); S.fog = new THREE.Fog("#f3b27a", 9, 22);
const pisoT = ctex(512, 512, g => { g.fillStyle = "#b3ada4"; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(${i % 2 ? 80 : 230},${i % 2 ? 76 : 225},70,.10)`; g.fillRect((i * 97) % 512, (i * 233) % 512, 3, 3); }
  g.strokeStyle = "rgba(60,55,50,.35)"; g.lineWidth = 3; for (let k = 0; k <= 512; k += 128) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, 512); g.moveTo(0, k); g.lineTo(512, k); g.stroke(); } });
pisoT.wrapS = pisoT.wrapT = THREE.RepeatWrapping; pisoT.repeat.set(6, 4);
const piso = mesh(new THREE.PlaneGeometry(24, 16), new THREE.MeshStandardMaterial({ map: pisoT, roughness: .95 }), pat, 0, 0, 0); piso.rotation.x = -Math.PI / 2;
const faixa = mesh(new THREE.PlaneGeometry(9, .09), M("#f4f1ea"), pat, 0, .005, 1.6); faixa.rotation.x = -Math.PI / 2; faixa.receiveShadow = true; faixa.castShadow = false;
const muro = new THREE.Group(); muro.position.z = -4.2; pat.add(muro); box(20, .9, .3, M(AZUL, { roughness: .8 }), muro, 0, .45, 0); box(20, .8, .3, M("#e9e2d2", { roughness: .9 }), muro, 0, 1.3, 0); box(20, .08, .36, M("#8d877e"), muro, 0, 1.74, 0);
function banco(par, x, z, ry) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; par.add(g); box(1.9, .12, .6, M(CIM, { roughness: .9 }), g, 0, .4, 0); for (const s of [-.7, .7]) box(.18, .36, .5, M("#938d84", { roughness: .9 }), g, s, .18, 0); return g; }
function mochila(par, x, y, z, cor, ry = 0) { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; par.add(g); box(.42, .5, .26, M(cor, { roughness: .7 }), g, 0, .25, 0); box(.32, .2, .08, M(cor, { roughness: .6 }), g, 0, .16, .16); box(.44, .1, .28, M("#22262e"), g, 0, .52, 0); return g; }
banco(pat, -3.6, -2.4, .25); banco(pat, 3.7, -2.4, -.25); mochila(pat, -3.9, .46, -2.4, "#e04b3a", .3); mochila(pat, -3.2, .46, -2.3, AZUL, .1); mochila(pat, 3.4, .46, -2.4, "#2fa36b", -.2); mochila(pat, 4.6, 0, -1.6, OURO, -.6);
for (const [x, z] of [[-6, -3.6], [6.2, -3.4]]) { box(.25, 2.4, .25, M("#6b4a2e"), pat, x, 1.2, z); const c = mesh(new THREE.IcosahedronGeometry(1.1, 0), M("#4f8a3a", { flatShading: true }), pat, x, 2.9, z); c.scale.y = .85; }
rim.color.set(0xff7a2a); rim.intensity = 2.6; rim.position.set(-5, 2.2, -4); key.color.set(0xffe0bf); key.intensity = 95;
const sol = new THREE.DirectionalLight(0xffb070, 1.2); sol.position.set(6, 3, 2); S.add(sol);

// ---------- mascote: boné azul virado para trás + martelo na mão direita (rosto livre) ----------
const bone = new THREE.Group(); bone.position.set(0, 1.5, -.05); MAS.corpo.add(bone);
mesh(new THREE.SphereGeometry(.48, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M(AZUL, { roughness: .6 }), bone, 0, 0, 0).scale.set(1.05, .6, 1);
box(.62, .05, .42, M(AZUL, { roughness: .6 }), bone, 0, .02, -.5); mesh(new THREE.SphereGeometry(.06, 8, 6), M(OURO), bone, 0, .28, 0);
const martelo = new THREE.Group(); MAS.bracos[1].add(martelo);
box(.72, .08, .08, M("#8a5a32", { roughness: .7 }), martelo, .62, 0, 0); box(.2, .36, .22, M("#5b6270", { metalness: .7, roughness: .3 }), martelo, 1.0, 0, 0);
// golpe: sobe, desce rápido no instante do golpe, volta devagar
function golpe(lt, hits) { let a = .25; for (const h of hits) { if (lt >= h - .32 && lt < h - .06) a = .25 + 1.3 * eo(lin(lt, h - .32, h - .06)); else if (lt >= h - .06 && lt < h) a = 1.55 - 1.95 * lin(lt, h - .06, h); else if (lt >= h && lt < h + .35) a = -.4 + .65 * eo(lin(lt, h, h + .35)); } return a; }
const bateu = (lt, hits) => hits.some(h => lt > h && lt < h + .12);
function martela(lt, x, hits, z = .35) { const a = golpe(lt, hits); pose(MAS, { x, z, y: bateu(lt, hits) ? 0 : hop(lt, .8, .04), sq: bateu(lt, hits) ? .06 : 0, braco: [.35, a], ry: .25, piscar: bateu(lt, hits) ? .4 : pisca(lt + .5) }); return bateu(lt, hits) ? .025 : 0; }

// celular deitado no banco central (tela para cima) + bloco "console" que o martelo enfia nele
const mesa = banco(pat, .55, -.1, 0); mesa.scale.set(1.1, 1, 1.4);
function celular(par, cor = "#17171c") { const g = new THREE.Group(); par.add(g); box(1.7, .08, .9, M(cor, { roughness: .35, metalness: .3 }), g, 0, 0, 0);
  const t = ctex(340, 180, (gg, w, h, f = 0, cena = 0) => TELAS[cena](gg, w, h, f)); const tela = mesh(new THREE.PlaneGeometry(1.58, .8), new THREE.MeshBasicMaterial({ map: t, toneMapped: false }), g, 0, .045, 0); tela.rotation.x = -Math.PI / 2; tela.castShadow = false; g.userData.t = t; return g; }
const pix = (g, x, y, s, c) => { g.fillStyle = c; g.fillRect(x, y, s, s); };
const TELAS = [
  (g, w, h, f) => { g.fillStyle = "#101014"; g.fillRect(0, 0, w, h); g.fillStyle = SOL; g.font = "700 40px SG"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(f % 2 ? "▶ JOGAR" : "CARREGANDO…", w / 2, h / 2); },
  (g, w, h, f) => { g.fillStyle = "#9bbc0f"; g.fillRect(0, 0, w, h); for (let i = 0; i < 18; i++) pix(g, (i * 53 + f * 4) % w, 120 + (i % 3) * 16, 16, "#306230"); pix(g, 150, 60 + (f % 2) * 6, 40, "#0f380f"); pix(g, 160, 70 + (f % 2) * 6, 8, "#9bbc0f"); pix(g, 176, 70 + (f % 2) * 6, 8, "#9bbc0f"); },
  (g, w, h, f) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#ff7a3d"); gr.addColorStop(1, "#ffd08a"); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? "#2b2440" : "#3d3358"; const bh = 50 + (i * 37) % 90; g.fillRect(i * 40, h - bh, 36, bh); } g.fillStyle = "#e04b3a"; g.fillRect((f * 18) % w, h - 22, 40, 14); },
  (g, w, h, f) => { g.fillStyle = "#8fd4ff"; g.fillRect(0, 0, w, h); g.fillStyle = "#4f8a3a"; g.beginPath(); g.moveTo(0, h); g.lineTo(90, 70); g.lineTo(170, 130); g.lineTo(260, 50); g.lineTo(w, h); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.moveTo(240 - f * 3, 40); g.lineTo(280 - f * 3, 40); g.lineTo(260 - f * 3, 52); g.fill(); },
  (g, w, h, f) => { g.fillStyle = "#1a1d3a"; g.fillRect(0, 0, w, h); for (let k = 0; k < 3; k++) { g.fillStyle = k <= f % 4 ? OURO : "#3a3f6a"; g.beginPath(); g.roundRect(30 + k * 100, 50, 80, 80, 10); g.fill(); } },
  (g, w, h, f) => { g.fillStyle = "#1b0d0a"; g.fillRect(0, 0, w, h); for (let i = 0; i < 26; i++) pix(g, (i * 41) % w, h - 20 - ((i * 29 + f * 9) % 120), 14, ["#ff3b1f", "#ff8a3d", OURO][i % 3]); g.fillStyle = "#fff"; g.font = "700 30px SG"; g.textAlign = "right"; g.fillText("60 FPS", w - 12, 30); },
];
const CEL = [];   // um celular por cena (gancho + 5 itens), cada um no grupo da cena
const bloco = (par, cor) => { const b = new THREE.Group(); par.add(b); box(.36, .3, .36, M(cor, { roughness: .5 }), b, 0, 0, 0); box(.26, .04, .1, E(SOL, 1.2), b, 0, .02, .19); return b; };

// ---------- gancho: console de mesa grande no banco; o mascote martela e ele vira celular ----------
const gG = grupo("gancho"); const celG = celular(gG); celG.position.set(.55, .5, -.1);
const consoleG = new THREE.Group(); gG.add(consoleG); box(1.3, .42, .95, M("#e8e4dc", { roughness: .5 }), consoleG, 0, 0, 0); box(1.32, .06, .97, M("#2b2b33"), consoleG, 0, .1, 0); mesh(new THREE.CylinderGeometry(.05, .05, .03, 12), E(AZUL, 2), consoleG, .5, .22, .3);
const controle = new THREE.Group(); gG.add(controle); box(.5, .1, .26, M("#2b2b33"), controle, 0, 0, 0); for (const s of [-1, 1]) box(.14, .1, .28, M("#2b2b33"), controle, s * .26, -.03, .05);

// ---------- itens ----------
const ITEM = {};
for (const [k, nome] of [[1, "n5"], [2, "n4"], [3, "n3"], [4, "n2"], [5, "n1"]]) { const gr = grupo(nome); const c = celular(gr); c.position.set(.55, .5, -.1); const b = bloco(gr, ["#9aa0a8", "#e04b3a", "#4f8a3a", "#2f5bd3", "#8a1f1f"][k - 1]); ITEM[nome] = { gr, c, b, k, extra: new THREE.Group() }; gr.add(ITEM[nome].extra); }
// n5 PokeDaisy: portátil genérico de tela verde sai do celular
{ const e = ITEM.n5.extra; box(.55, .85, .14, M("#c9c6bf"), e, 0, 0, 0); box(.42, .34, .02, M("#9bbc0f", { emissive: "#9bbc0f", emissiveIntensity: .5 }), e, 0, .17, .08); box(.14, .05, .02, M("#2b2b33"), e, -.13, -.16, .08); box(.05, .14, .02, M("#2b2b33"), e, -.13, -.16, .08); for (const [x, y] of [[.12, -.12], [.2, -.2]]) mesh(new THREE.CylinderGeometry(.04, .04, .03, 12), M("#8a1f4a"), e, x, y, .08).rotation.x = Math.PI / 2; }
// n4 GTA V iOS: prédios de blocos sobem do celular + carrinho
{ const e = ITEM.n4.extra; ITEM.n4.predios = []; for (let i = 0; i < 6; i++) { const h = .4 + (i * 37 % 5) * .15; const p = box(.22, h, .22, M(["#3d3358", "#2b2440", "#4a4170"][i % 3]), e, -.6 + i * .24, h / 2, (i % 2) * .2 - .1); p.userData.h = h; ITEM.n4.predios.push(p); }
  ITEM.n4.carro = new THREE.Group(); e.add(ITEM.n4.carro); box(.3, .1, .16, M("#e04b3a"), ITEM.n4.carro, 0, .07, 0); box(.16, .08, .14, M("#ffd0b0"), ITEM.n4.carro, -.02, .15, 0); }
// n3 BOTW Android: colinas e uma asa-delta de papel
{ const e = ITEM.n3.extra; ITEM.n3.morros = [[-.4, .5], [.2, .7], [.6, .4]].map(([x, h]) => mesh(new THREE.ConeGeometry(.32, h, 5), M("#4f8a3a", { flatShading: true }), e, x, h / 2, 0));
  ITEM.n3.asa = mesh(new THREE.ConeGeometry(.22, .05, 3), M("#fff3e0"), e, 0, 0, 0); ITEM.n3.asa.rotation.x = Math.PI / 2; }
// n2 nx2android: três cartuchos genéricos entram no celular, um por um
{ const e = ITEM.n2.extra; ITEM.n2.carts = [0, 1, 2].map(i => { const c = new THREE.Group(); e.add(c); box(.3, .36, .06, M("#3b3f4a"), c, 0, 0, 0); box(.22, .18, .07, E([SOL, "#2fa36b", OURO][i], .6), c, 0, .04, 0); return c; }); }
// n1 D2R Mobile: o celular vira arena com chamas pixeladas
{ const e = ITEM.n1.extra; ITEM.n1.chamas = []; for (let i = 0; i < 34; i++) { const f = mesh(new THREE.BoxGeometry(.09, .09, .09), E(["#ff3b1f", "#ff8a3d", OURO][i % 3], 2.2), e, 0, 0, 0); f.castShadow = false; ITEM.n1.chamas.push({ f, a: rnd() * 6.28, r: .45 + rnd() * .35, ph: rnd(), v: .7 + rnd() * .6 }); }
  ITEM.n1.aro = mesh(new THREE.TorusGeometry(.75, .04, 8, 40), E("#ff8a3d", 2.5), e, 0, .06, 0); ITEM.n1.aro.rotation.x = Math.PI / 2; }

// ---------- fechamento: pódio de cimento, mascote no 1º lugar ----------
const cG = grupo("cta"); const pod = new THREE.Group(); pod.position.set(0, 0, -.2); cG.add(pod);
for (const [x, h, c] of [[-1.15, .55, "#c9c6bf"], [0, .9, OURO], [1.15, .38, "#d08a4a"]]) box(1.1, h, 1.0, M(c, { roughness: .6 }), pod, x, h / 2, 0);
const confs = []; for (let i = 0; i < 60; i++) { const c = mesh(new THREE.PlaneGeometry(.08, .14), M([SOL, AZUL, OURO, CREME][i % 4], { side: THREE.DoubleSide }), cG, 0, 0, 0); c.castShadow = false; confs.push({ c, x: (rnd() - .5) * 6, z: -1.4 + rnd() * 2.6, y0: rnd() * 6, v: .7 + rnd() * .6, w: 2 + rnd() * 4 }); }

// ---------- câmera: plongée (de cima, 3/4, rosto visível) na 1ª metade; contra-plongée (de baixo) na 2ª ----------
const SHOTS = { gancho: [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]] }; ["n5", "n4", "n3", "n2", "n1", "cta"].forEach(n => SHOTS[n] = SHOTS.gancho);
const camera = (cam, nome, lt, d, t, sh) => { const meio = lt >= d / 2, u = meio ? (lt - d / 2) / (d / 2) : lt / (d / 2), lado = (["n4", "n2"].includes(nome) ? -1 : 1);
  if (nome === "cta") { cam.position.set(Math.sin(lt * .4) * .8, .55 + u * .15, 5.6 - u * .3); cam.lookAt(0, 1.6, 0); }
  else if (!meio) { cam.position.set(-.2 + lado * (.6 + u * .4), 3.9 - u * .2, 4.6 - u * .3); cam.lookAt(-.1, .7, 0); }
  else { cam.position.set(-.1 - lado * (.4 + u * .3), .38, 6.4 - u * .35); cam.lookAt(-.05, 1.3, 0); }
  cam.position.x += Math.sin(t * 61) * sh; cam.position.y += Math.cos(t * 47) * sh; };

const HITS = [.35, .95];
const ACT = {
  gancho(lt, d) { const ent = eo(lin(lt, 0, .3)); const sh = martela(lt, -1.0 - (1 - ent) * .6, [.55, 1.1]);
    const sq = eio(lin(lt, 1.1, 1.5)); consoleG.position.set(.15, .67 - sq * .15, -.1); consoleG.scale.set(1 - sq * .99, 1 - sq * .99, 1 - sq * .99); consoleG.visible = sq < .98; consoleG.rotation.y = Math.sin(lt * 20) * (lt > .55 && lt < .7 ? .05 : 0);
    controle.position.set(.95, .52, .35); controle.rotation.y = -.4; controle.visible = sq < .5;
    const p = back(lin(lt, 1.45, 1.9)); celG.scale.setScalar(.5 + .5 * p); celG.userData.t.draw(Math.floor(lt * 2), 0); celG.position.y = .5 + Math.max(0, Math.sin(lin(lt, 1.45, 1.9) * Math.PI)) * .2; return sh; },
  cta(lt, d) { pose(MAS, { x: 0, y: .9 + hop(lt, .5, .15), z: -.2, braco: [.3 + Math.sin(lt * 6) * .2, 1.6 + Math.sin(lt * 9) * .2], piscar: pisca(lt) });
    confs.forEach(C => { const y = ((C.y0 - lt * C.v * 2) % 6 + 6) % 6; C.c.position.set(C.x + Math.sin(lt * 2 + C.w) * .2, y, C.z); C.c.rotation.set(lt * C.w, lt * C.w * .6, 0); }); },
};
for (const nome of ["n5", "n4", "n3", "n2", "n1"]) ACT[nome] = (lt, d) => { const I = ITEM[nome]; const sh = martela(lt, -1.0, HITS);
  const fundo = eio(lin(lt, .3, 1.05)); I.b.position.set(.12, .73 - fundo * .28, -.1); I.b.scale.set(1, 1 - fundo * .9, 1); I.b.visible = fundo < .97;
  const liga = lt > 1.05; I.c.userData.t.draw(Math.floor(lt * 8), liga ? I.k : 0); const s = back(lin(lt, 1.1, 1.6)); const e = I.extra; e.visible = lt > 1.1; e.position.set(.75, .56, -.1); e.scale.setScalar(Math.max(.01, s));
  if (nome === "n5") { e.position.y = .56 + .5 * s + Math.sin(lt * 2) * .04; e.rotation.set(-.35, Math.sin(lt * 1.3) * .3, 0); }
  if (nome === "n4") { I.predios.forEach((p, i) => { const g = back(lin(lt, 1.1 + i * .08, 1.5 + i * .08)); p.scale.y = Math.max(.01, g); p.position.y = p.userData.h * g / 2; }); I.carro.position.set(-.7 + ((lt * .5) % 1.4), 0, .3); }
  if (nome === "n3") { I.morros.forEach((m, i) => m.scale.setScalar(Math.max(.01, back(lin(lt, 1.1 + i * .1, 1.6 + i * .1))))); I.asa.position.set(-.5 + (lt - 1.1) * .35, .9 + Math.sin(lt * 2) * .08, .1); I.asa.rotation.z = Math.sin(lt * 2) * .2; }
  if (nome === "n2") I.carts.forEach((c, i) => { const a = lin(lt, 1.2 + i * .55, 1.6 + i * .55); c.visible = a < 1; c.position.set(.0, 1.1 - eio(a) * .55, 0); c.rotation.set(-Math.PI / 2 * eio(a), 0, 0); });
  if (nome === "n1") { const cres = eio(lin(lt, 1.1, 2.0)); I.c.scale.set(1 + cres * .25, 1, 1 + cres * .25); I.chamas.forEach(F => { const k = (lt * F.v + F.ph) % 1; F.f.position.set(Math.cos(F.a + lt * .6) * F.r, k * .9, Math.sin(F.a + lt * .6) * F.r * .55); F.f.scale.setScalar(1 - k); }); I.aro.material.emissiveIntensity = 2 + Math.sin(lt * 9) * .8; }
  return sh; };

// ---------- elementos de tela (2D) ----------
const CAB = { ult: null, agora: 0 };
const ui = C => { const { X, gl, GW, GH, ITENS, eo, lin, eio, back, blocos, SEGR, CHAVE } = C;
  const cabe = (t, f, mx, fam = "SG", w = 700) => { while (f > 18) { X.font = `${w} ${f}px ${fam}`; if (X.measureText(t).width <= mx) break; f -= 2; } return f; };
  let TMP = null;
  return {
    fundo(t) { const g = X.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, "#ff7a3d"); g.addColorStop(.32, "#ffb36b"); g.addColorStop(.5, "#ffd9a0"); g.addColorStop(1, "#8d877e"); X.fillStyle = g; X.fillRect(0, 0, 1080, 1920);
      X.fillStyle = "rgba(255,240,200,.85)"; X.beginPath(); X.arc(800, 640, 90, 0, 7); X.fill(); X.fillStyle = "rgba(255,240,200,.25)"; X.beginPath(); X.arc(800, 640, 150, 0, 7); X.fill(); },
    etiqueta(t) { // tela de terminal
      const [l1, l2, l3] = SEGR[0].etiqueta; X.fillStyle = "rgba(14,16,22,.94)"; X.beginPath(); X.roundRect(60, 270, 890, 228, 18); X.fill();
      X.fillStyle = "#2a2f3a"; X.beginPath(); X.roundRect(60, 270, 890, 40, [18, 18, 0, 0]); X.fill(); ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => { X.fillStyle = c; X.beginPath(); X.arc(90 + i * 28, 290, 8, 0, 7); X.fill(); });
      X.fillStyle = "#8b93a7"; X.font = "500 22px JB"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("recreio@patio:~$ ./top5", 190, 291);
      const tp = 1, cur = Math.floor(t * 2.5) % 2 ? "▌" : "";
      X.textBaseline = "alphabetic"; X.fillStyle = "#f4f1ea"; cabe(l1, 50, 840); X.fillText(l1.slice(0, Math.ceil(l1.length * tp)), 84, 366);
      const p2 = l2.split(" "), num = p2.slice(0, 2).join(" ") + " ", r2 = p2.slice(2).join(" "); cabe(l2, 46, 840); X.fillStyle = SOL; X.fillText(num, 84, 422); const w = X.measureText(num).width; X.fillStyle = "#7ee787"; X.fillText(r2, 84 + w, 422);
      cabe(l3, 42, 820); X.fillStyle = OURO; X.fillText("> " + l3, 84, 476); X.fillStyle = "#7ee787"; X.fillText(cur, 84 + X.measureText("> " + l3 + " ").width, 476); },
    cabecalho(s, lt, t) { if (!CAB.agora) { CAB.ult = [s, lt, t]; return; } // carimbo + placar HI-SCORE
      X.save(); X.textBaseline = "middle"; X.textAlign = "left";
      X.fillStyle = AZUL; X.beginPath(); X.roundRect(60, 516, 118, 96, 14); X.fill(); X.fillStyle = "#fff"; X.font = "700 62px SG"; X.textAlign = "center"; X.fillText(s.tag, 119, 566);
      const bate = lin(lt, .2, .35), sc = lt < .2 ? 0 : 1 + (1 - eo(bate)) * .9; if (sc > 0) { const nm = s.item.toUpperCase(); const fs = cabe(nm, 64, 680); const w = X.measureText(nm).width + 56;
        X.translate(200 + w / 2, 564); X.rotate(-.045); X.scale(sc, sc); X.globalAlpha = Math.min(1, bate * 2.5); X.strokeStyle = "#c8321e"; X.lineWidth = 7; X.strokeRect(-w / 2, -50, w, 100); X.lineWidth = 2; X.strokeRect(-w / 2 + 9, -41, w - 18, 82);
        X.fillStyle = "#c8321e"; X.font = `700 ${fs}px SG`; X.textAlign = "center"; X.fillText(nm, 0, 4); X.globalCompositeOperation = "destination-out"; X.globalAlpha = .25; for (let i = 0; i < 40; i++) X.fillRect(-w / 2 + (i * 53) % w, -46 + (i * 29) % 92, 6, 3); }
      X.restore(); X.globalAlpha = 1;
      const v = Math.round(s.estrelas * eio(lin(lt, .35, 1.7))); X.fillStyle = "rgba(14,16,22,.88)"; X.beginPath(); X.roundRect(60, 634, 600, 92, 14); X.fill();
      X.fillStyle = OURO; X.font = "400 20px PS"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("HI-SCORE", 84, 662); X.fillStyle = "#8b93a7"; X.font = "700 22px SG"; X.fillText("ESTRELAS NO GITHUB", 84, 700);
      X.fillStyle = lt < 1.7 || Math.floor(t * 5) % 2 ? "#7ee787" : "#fff"; X.font = "700 70px SG"; X.textAlign = "right"; X.fillText(v.toLocaleString("pt-BR"), 640, 682); },
    desenha3D(glc, nome, lt) { const _cab = () => { if (CAB.ult) { CAB.agora = 1; this.cabecalho(...CAB.ult); CAB.agora = 0; CAB.ult = null; } }; if (!TMP) { TMP = document.createElement("canvas"); TMP.width = GW; TMP.height = GH; }
      const g = TMP.getContext("2d"); g.globalCompositeOperation = "source-over"; g.clearRect(0, 0, GW, GH); g.drawImage(glc, 0, 0); g.globalCompositeOperation = "destination-in";
      const m = g.createLinearGradient(0, 0, 0, GH); m.addColorStop(0, "rgba(0,0,0,0)"); m.addColorStop(.12, "#000"); m.addColorStop(.86, "#000"); m.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = m; g.fillRect(0, 0, GW, GH);
      if (nome === "cta") { X.save(); X.beginPath(); X.roundRect(140, 520, 800, 440, 26); X.clip(); X.drawImage(TMP, 0, 380, GW, GH); X.restore(); return; }
      X.drawImage(TMP, 0, 660); _cab(); },
    legenda(seg, t) { // tarja de TV
      const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      X.fillStyle = AZUL; X.fillRect(0, 1352, 1080, 124); X.fillStyle = SOL; X.fillRect(0, 1352, 1080, 8); X.fillRect(0, 1468, 1080, 8);
      X.fillStyle = "#c8321e"; X.fillRect(60, 1376, 92, 34); X.fillStyle = "#fff"; X.font = "700 22px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("AO VIVO", 106, 1394);
      let fs = 56; const tot = () => c.reduce((a, w) => a + X.measureText(w.w.toUpperCase() + " ").width, 0); X.font = `700 ${fs}px SG`; while (tot() > 760 && fs > 30) { fs -= 2; X.font = `700 ${fs}px SG`; }
      let x = 175; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02; X.fillStyle = on && t < w.t1 + .2 ? OURO : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w.toUpperCase(), x, 1428); x += X.measureText(w.w.toUpperCase() + " ").width; } },
    transicao(lt, s) { // zoom atravessando a tela do celular
      if (!s.item || lt > .3) return; const p = eio(lt / .3), w = 260 + p * 1900, h = w * 1.9, cx = 540, cy = 1000;
      X.save(); X.fillStyle = "#16130f"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(cx - w / 2, cy - h / 2, w, h, 40 + p * 60); X.fill("evenodd");
      X.strokeStyle = "#3a3f4a"; X.lineWidth = 18 + p * 30; X.beginPath(); X.roundRect(cx - w / 2, cy - h / 2, w, h, 40 + p * 60); X.stroke(); X.restore(); },
    fechamento(lt) { // pódio
      const ord = [ITENS[3], ITENS[4], ITENS[2]], xs = [210, 505, 800], hs = [150, 210, 110], base = 1240;
      ord.forEach((s, i) => { const a = back(lin(lt, .1 + i * .12, .5 + i * .12)); if (a <= 0) return; const h = hs[i] * a, x = xs[i];
        X.fillStyle = [ "#c9c6bf", OURO, "#d08a4a"][i]; X.fillRect(x - 135, base - h, 270, h); X.fillStyle = TINTA; X.font = "700 52px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag, x, base - h + 40);
        X.fillStyle = "#fff"; X.font = `700 ${cabe(s.item, 36, 250)}px SG`; X.fillStyle = TINTA; X.fillText(s.item, x, base - h - 30); });
      const q = lin(lt, .55, .9); X.globalAlpha = q; X.fillStyle = "rgba(14,16,22,.85)"; X.beginPath(); X.roundRect(90, 1252, 830, 54, 12); X.fill(); X.fillStyle = "#f4f1ea"; X.font = "700 30px SG"; X.textAlign = "center";
      X.fillText(`4º ${ITENS[1].item}  ·  5º ${ITENS[0].item}`, 505, 1280); X.globalAlpha = 1;
      const p = eo(lin(lt, .6, 1.0)); X.save(); X.translate(505, 1432); X.scale(.7 + .3 * p, .7 + .3 * p); X.globalAlpha = p; X.fillStyle = "#c8321e"; X.beginPath(); X.roundRect(-400, -52, 800, 104, 20); X.fill();
      X.fillStyle = "#fff"; X.font = "700 70px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore(); X.globalAlpha = 1;
      X.save(); X.translate(505, 1338); X.rotate(-.03); X.globalAlpha = lin(lt, .9, 1.3); X.fillStyle = TINTA; X.font = "700 50px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("só com o jogo que você comprou", 0, 0); X.restore(); X.globalAlpha = 1; },
  }; };
const cores = { LAR: SOL, VERDE: "#7ee787", FUNDO: "#8d877e", CREME, TINTA, BRILHO: "rgba(255,200,120,.0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

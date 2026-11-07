// Reel "3 apps pra quem vive no ChatGPT" (08/11). Identidade: sala de detetive à noite: quadro de cortiça com fios vermelhos,
// lâmpada pendente verde, arquivo de aço; cortiça + vermelho-fio + verde-abajur. Elementos: etiqueta em tela de terminal,
// nome em máquina de escrever, pote de estrelas, legenda de 1 palavra gigante com pop, transição glitch RGB,
// câmera plongée/contra-plongée, fechamento em post-its no quadro, Press Start 2P (só enfeite) + Space Grotesk.
// Mascote de sobretudo e chapéu de detetive, ação principal: surfar (numa pasta de arquivo que desliza pelo chão).
// Sem logos de terceiros. Texto importante entre y=260 e y=1500, longe da borda direita.
export default function (K) {
const { rim, key, THREE, S, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const CORT = "#b8875a", FIO = "#d7372f", ABA = "#3f9a5e", CREME = "#f4ead8", TINTA = "#1b1712", AMBAR = "#ffc857", PAREDE = "#1f2a24";

// ---------- cenário: piso de tábuas, parede verde-escura, quadro de cortiça com fios, arquivo, lâmpada pendente ----------
S.fog = new THREE.Fog("#141a16", 8, 20);
const pisoT = ctex(512, 512, g => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#5a3a22" : "#4c311d"; g.fillRect(0, i * 64, 512, 64); g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(0, i * 64, 512, 3); g.fillRect((i * 173) % 512, i * 64, 3, 64); }
  for (let i = 0; i < 300; i++) { g.fillStyle = "rgba(255,220,180,.04)"; g.fillRect((i * 97) % 512, (i * 233) % 512, 40, 2); } });
pisoT.wrapS = pisoT.wrapT = THREE.RepeatWrapping; pisoT.repeat.set(5, 4);
const piso = mesh(new THREE.PlaneGeometry(24, 16), new THREE.MeshStandardMaterial({ map: pisoT, roughness: .8 }), S, 0, 0, 0); piso.rotation.x = -Math.PI / 2;
const parT = ctex(256, 256, g => { g.fillStyle = PAREDE; g.fillRect(0, 0, 256, 256); for (let x = 0; x < 256; x += 32) { g.fillStyle = "rgba(255,255,255,.035)"; g.fillRect(x, 0, 12, 256); } });
parT.wrapS = parT.wrapT = THREE.RepeatWrapping; parT.repeat.set(8, 3);
mesh(new THREE.PlaneGeometry(24, 9), new THREE.MeshStandardMaterial({ map: parT, roughness: .9 }), S, 0, 4.5, -3.6);
// quadro grande da parede: bilhetes e fotos ligados por fios vermelhos
const quadroT = ctex(1024, 512, g => { g.fillStyle = CORT; g.fillRect(0, 0, 1024, 512); for (let i = 0; i < 2500; i++) { g.fillStyle = `rgba(${i % 2 ? 90 : 230},${i % 2 ? 60 : 190},40,.18)`; g.fillRect((i * 97) % 1024, (i * 233) % 512, 3, 3); }
  const P = [[120, 110], [330, 80], [560, 140], [800, 90], [200, 340], [470, 360], [720, 330], [920, 300]];
  g.strokeStyle = FIO; g.lineWidth = 5; for (const [a, b] of [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 2], [5, 6], [6, 3], [6, 7]]) { g.beginPath(); g.moveTo(...P[a]); g.lineTo(...P[b]); g.stroke(); }
  P.forEach(([x, y], i) => { g.save(); g.translate(x, y); g.rotate((i % 3 - 1) * .08); g.fillStyle = i % 3 === 0 ? "#f2eee4" : i % 3 === 1 ? "#ffe066" : "#d9e4ea"; g.fillRect(-60, -46, 120, 92);
    g.fillStyle = "rgba(30,25,20,.55)"; for (let l = 0; l < 4; l++) g.fillRect(-46, -26 + l * 16, 70 + (l * 13) % 22, 6); g.restore(); g.fillStyle = FIO; g.beginPath(); g.arc(x, y - 40, 9, 0, 7); g.fill(); }); });
box(5.4, 2.5, .08, M("#5a3a22"), S, 0, 2.55, -3.5);
mesh(new THREE.PlaneGeometry(5.2, 2.3), new THREE.MeshStandardMaterial({ map: quadroT, roughness: .9 }), S, 0, 2.55, -3.45);
function arquivo(par, x, z, ry, gav = 3) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; par.add(g); box(.9, gav * .5, .8, M("#5d6b66", { metalness: .5, roughness: .45 }), g, 0, gav * .25, 0);
  const gs = []; for (let i = 0; i < gav; i++) { const d = new THREE.Group(); d.position.set(0, .25 + i * .5, .41); g.add(d); box(.8, .42, .04, M("#6f7f79", { metalness: .5, roughness: .4 }), d, 0, 0, 0); box(.24, .05, .06, M("#c9c3b0", { metalness: .8, roughness: .25 }), d, 0, .08, .04); box(.2, .07, .02, M("#f4ead8"), d, 0, -.06, .03); gs.push(d); } return { g, gs }; }
arquivo(S, -3.4, -2.6, .35); arquivo(S, 3.6, -2.7, -.4, 2);
// lâmpada pendente verde
const lamp = new THREE.Group(); lamp.position.set(.1, 3.9, -.4); S.add(lamp); box(.02, 1.6, .02, M("#111"), lamp, 0, .8, 0);
mesh(new THREE.ConeGeometry(.55, .45, 24, 1, true), M(ABA, { side: THREE.DoubleSide, roughness: .4, metalness: .3 }), lamp, 0, -.1, 0);
mesh(new THREE.SphereGeometry(.14, 16, 12), E("#fff2c8", 3), lamp, 0, -.28, 0);
const luz = new THREE.PointLight(0xffe3a0, 18, 9, 1.4); luz.position.set(.1, 3.4, -.3); S.add(luz);
rim.color.set(0x5fd08a); rim.intensity = 1.8; key.color.set(0xffe6b8); key.intensity = 90;

// ---------- mascote: chapéu de detetive + sobretudo (só da cintura para baixo: rosto livre) + prancha (pasta de arquivo) ----------
const chapeu = new THREE.Group(); chapeu.position.set(0, 1.52, 0); MAS.corpo.add(chapeu);
mesh(new THREE.CylinderGeometry(.82, .82, .05, 32), M("#6b5a45", { roughness: .8 }), chapeu, 0, 0, 0);
mesh(new THREE.CylinderGeometry(.46, .52, .42, 32), M("#6b5a45", { roughness: .8 }), chapeu, 0, .22, 0);
mesh(new THREE.CylinderGeometry(.53, .53, .09, 32), M("#2a2018"), chapeu, 0, .06, 0);
const casaco = M("#b59a6a", { roughness: .85 });
box(1.56, .36, 1.06, casaco, MAS.corpo, 0, .6, 0); box(1.58, .07, 1.08, M("#4a3a28"), MAS.corpo, 0, .74, 0); box(.12, .1, .02, M("#c9a64a", { metalness: .8, roughness: .3 }), MAS.corpo, 0, .74, .55);
for (const s of [-1, 1]) { const l = box(.36, .14, .04, casaco, MAS.corpo, s * .52, .84, .51); l.rotation.z = s * .35; }
const prancha = new THREE.Group(); S.add(prancha);
box(2.3, .06, .78, M("#c98a3c", { roughness: .6 }), prancha, 0, .05, 0); box(.6, .07, .3, M("#c98a3c", { roughness: .6 }), prancha, -.7, .06, -.42); box(1.6, .02, .5, M("#f2eee4"), prancha, .1, .095, 0);
for (const x of [-.8, .8]) for (const z of [-.28, .28]) mesh(new THREE.SphereGeometry(.06, 10, 8), M("#222"), prancha, x, .02, z);
function surfa(lt, x, z = .3, ry = .35, extra = {}) { const ond = Math.sin(lt * 2.6), bal = Math.sin(lt * 5.2) * .08;
  prancha.position.set(x, 0, z); prancha.rotation.set(0, ry, ond * .06); prancha.visible = true;
  pose(MAS, { x, z, y: .12 + Math.abs(ond) * .03, ry, sq: Math.max(0, -ond) * .05, braco: [1.05 + bal, 1.05 - bal], piscar: pisca(lt), ...extra }); MAS.g.rotation.z = ond * .09; }

// ---------- gancho: chuva de "conversas" (bilhetes) e o mascote surfa no meio, perdido ----------
const gG = grupo("gancho"); const bil = [];
for (let i = 0; i < 70; i++) { const c = mesh(new THREE.PlaneGeometry(.34, .24), M(["#f2eee4", "#ffe066", "#d9e4ea"][i % 3], { side: THREE.DoubleSide, roughness: .8 }), gG, 0, 0, 0); c.castShadow = false;
  bil.push({ c, x: (rnd() - .5) * 6.5, z: -2 + rnd() * 3.2, y0: rnd() * 5, v: .5 + rnd() * .5, ph: rnd() * 6, w: 1 + rnd() * 2 }); }
const pilha = new THREE.Group(); gG.add(pilha); pilha.position.set(1.3, 0, 0);
for (let i = 0; i < 14; i++) { const p = box(.62, .05, .46, M(["#f2eee4", "#ffe066", "#d9e4ea"][i % 3], { roughness: .8 }), pilha, Math.sin(i * 1.7) * .06, .03 + i * .055, Math.cos(i * 2.3) * .05); p.rotation.y = Math.sin(i * 3.1) * .3; }
const interr = new THREE.Group(); gG.add(interr); interr.position.set(1.3, 1.7, 0);
const qT = ctex(256, 256, g => { g.font = "700 220px SG"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = FIO; g.fillText("?", 128, 140); });
mesh(new THREE.PlaneGeometry(.9, .9), new THREE.MeshBasicMaterial({ map: qT, transparent: true, toneMapped: false }), interr, 0, 0, 0).castShadow = false;

// ---------- n3 ClipBoardLine: cartões copiados (imagem, texto, link) voam para a gaveta; a lupa acha até a imagem ----------
const g3 = grupo("n3"); const arq3 = arquivo(g3, 1.25, -.2, -.35, 3);
const cartT = ["img", "txt", "link"].map((k, i) => ctex(200, 140, g => { g.fillStyle = "#fbfaf6"; g.fillRect(0, 0, 200, 140); g.strokeStyle = "#333"; g.lineWidth = 4; g.strokeRect(2, 2, 196, 136);
  if (k === "img") { g.fillStyle = "#8fd4ff"; g.fillRect(14, 14, 172, 112); g.fillStyle = "#4f8a3a"; g.beginPath(); g.moveTo(14, 126); g.lineTo(80, 60); g.lineTo(130, 100); g.lineTo(186, 50); g.lineTo(186, 126); g.fill(); g.fillStyle = "#ffd23f"; g.beginPath(); g.arc(150, 40, 14, 0, 7); g.fill(); }
  else if (k === "txt") { g.fillStyle = "#555"; for (let l = 0; l < 5; l++) g.fillRect(16, 20 + l * 22, 150 - (l * 23) % 50, 9); }
  else { g.fillStyle = "#2f5bd3"; g.font = "700 30px SG"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("www", 100, 60); g.fillRect(40, 84, 120, 5); } }));
const cartoes = []; for (let i = 0; i < 9; i++) { const c = mesh(new THREE.PlaneGeometry(.5, .35), new THREE.MeshStandardMaterial({ map: cartT[i % 3], side: THREE.DoubleSide, roughness: .7 }), g3, 0, 0, 0); c.castShadow = false; cartoes.push(c); }
const lupa = new THREE.Group(); g3.add(lupa); mesh(new THREE.TorusGeometry(.26, .045, 10, 32), M("#2a2018", { metalness: .4 }), lupa, 0, 0, 0);
mesh(new THREE.CircleGeometry(.24, 32), new THREE.MeshStandardMaterial({ color: "#bfe6ff", transparent: true, opacity: .35, roughness: .1 }), lupa, 0, 0, 0); box(.07, .4, .07, M("#5a3a22"), lupa, .26, -.34, 0).rotation.z = .6;

// ---------- n2 KIKUmap: num cavalete, o quadro monta o mapa mental das conversas, com fios ----------
const g2 = grupo("n2"); const cav = new THREE.Group(); cav.position.set(1.2, 0, -.2); cav.rotation.y = -.3; g2.add(cav);
for (const s of [-1, 1]) { const p = box(.08, 2.1, .08, M("#5a3a22"), cav, s * .7, 1.0, 0); p.rotation.z = s * -.08; } box(.08, 1.9, .08, M("#5a3a22"), cav, 0, .9, -.5).rotation.x = .3;
box(1.86, .08, .2, M("#5a3a22"), cav, 0, .78, .08);
const mapaT = ctex(512, 384, (g, w, h, p = 0) => { g.fillStyle = CORT; g.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${i % 2 ? 90 : 230},${i % 2 ? 60 : 190},40,.18)`; g.fillRect((i * 97) % w, (i * 233) % h, 3, 3); }
  const C0 = [256, 192], N = [[90, 70], [420, 70], [80, 300], [430, 300], [256, 40], [256, 345]], NM = ["CLAUDE", "CHATGPT", "IDEIAS", "TRABALHO", "VIAGEM", "CÓDIGO"];
  g.strokeStyle = FIO; g.lineWidth = 5; N.forEach((n, i) => { const k = cl01(p * 7 - i - .5); if (k <= 0) return; g.beginPath(); g.moveTo(...C0); g.lineTo(C0[0] + (n[0] - C0[0]) * k, C0[1] + (n[1] - C0[1]) * k); g.stroke(); });
  const nota = (x, y, txt, cor, fs) => { g.fillStyle = cor; g.fillRect(x - 70, y - 30, 140, 60); g.fillStyle = TINTA; g.font = `700 ${fs}px SG`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, x, y + 2); g.fillStyle = FIO; g.beginPath(); g.arc(x, y - 26, 7, 0, 7); g.fill(); };
  if (p > .02) nota(...C0, "CONVERSAS", "#f2eee4", 22);
  N.forEach((n, i) => { if (cl01(p * 7 - i - .5) >= 1) nota(...n, NM[i], ["#ffe066", "#a5e3b4", "#9fc9ff"][i % 3], 24); }); });
function cl01(x) { return Math.max(0, Math.min(1, x)); }
mesh(new THREE.PlaneGeometry(1.7, 1.28), new THREE.MeshStandardMaterial({ map: mapaT, roughness: .85 }), cav, 0, 1.46, .06);

// ---------- n1 Big Arrow: mesa com monitor genérico; uma seta vermelha enorme atravessa a tela e aponta o botão ----------
const g1 = grupo("n1"); const mesa = new THREE.Group(); mesa.position.set(1.15, 0, -.3); mesa.rotation.y = -.3; g1.add(mesa);
box(1.9, .08, 1.0, M("#6b4a2e", { roughness: .6 }), mesa, 0, .78, 0); for (const x of [-.85, .85]) for (const z of [-.42, .42]) box(.07, .78, .07, M("#4c311d"), mesa, x, .39, z);
box(.1, .3, .1, M("#2b2b33"), mesa, 0, .95, -.15); box(.5, .03, .3, M("#2b2b33"), mesa, 0, .83, -.15);
box(1.5, .95, .08, M("#2b2b33", { roughness: .4 }), mesa, 0, 1.55, -.15);
const telaT = ctex(480, 300, (g, w, h, p = 0, f = 0) => { g.fillStyle = "#e9eef3"; g.fillRect(0, 0, w, h); g.fillStyle = "#c9d3dd"; g.fillRect(0, 0, w, 34); ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(20 + i * 22, 17, 7, 0, 7); g.fill(); });
  g.fillStyle = "#9aa6b2"; for (let l = 0; l < 6; l++) g.fillRect(30, 60 + l * 26, 280 - (l * 37) % 90, 10); for (let i = 0; i < 3; i++) { g.fillStyle = "#cfd8e0"; g.fillRect(330, 56 + i * 52, 120, 38); }
  const on = p > .5; g.fillStyle = on && f % 2 ? "#3fbf6a" : "#2f9a55"; g.beginPath(); g.roundRect(170, 220, 140, 50, 10); g.fill(); g.fillStyle = "#fff"; g.font = "700 26px SG"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("CLIQUE", 240, 246);
  if (on) { g.strokeStyle = FIO; g.lineWidth = 6; g.beginPath(); g.arc(240, 245, 46 + (f % 3) * 6, 0, 7); g.stroke(); } });
const tela = mesh(new THREE.PlaneGeometry(1.4, .86), new THREE.MeshBasicMaterial({ map: telaT, toneMapped: false }), mesa, 0, 1.55, -.105); tela.castShadow = false;
const seta = new THREE.Group(); mesa.add(seta); const vermelho = M(FIO, { emissive: FIO, emissiveIntensity: .35, roughness: .4 });
box(1.3, .2, .2, vermelho, seta, .65, 0, 0); const ponta = mesh(new THREE.ConeGeometry(.3, .55, 4), vermelho, seta, -.25, 0, 0); ponta.rotation.z = Math.PI / 2;
const lascas = []; for (let i = 0; i < 16; i++) { const l = box(.06, .06, .02, M("#dfe8ef", { emissive: "#ffffff", emissiveIntensity: .4 }), mesa, 0, 0, 0); l.castShadow = false; lascas.push({ l, a: rnd() * 6.28, v: .4 + rnd() * .6 }); }

// ---------- fechamento: o mascote surfa diante do quadro (post-its em 2D) ----------
grupo("cta");

// ---------- câmera: plongée (de cima, 3/4, rosto visível) na 1ª metade; contra-plongée (de baixo) na 2ª ----------
const SHOTS = {}; ["gancho", "n3", "n2", "n1", "cta"].forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d, t, sh) => { const meio = lt >= d / 2, u = meio ? (lt - d / 2) / (d / 2) : lt / (d / 2), lado = nome === "n2" ? -1 : 1;
  if (nome === "cta") { cam.position.set(Math.sin(lt * .4) * .6, .5 + u * .15, 6.0 - u * .3); cam.lookAt(0, 1.45, 0); }
  else if (!meio) { cam.position.set(lado * (.5 + u * .3), 4.1 - u * .2, 5.7 - u * .3); cam.lookAt(-.05, .85, 0); }
  else { cam.position.set(-lado * (.3 + u * .25), .45, 7.0 - u * .35); cam.lookAt(-.05, 1.35, 0); }
  cam.position.x += Math.sin(t * 61) * sh; cam.position.y += Math.cos(t * 47) * sh; };

const ACT = {
  gancho(lt, d) { const ent = eo(lin(lt, 0, .7)); surfa(lt, -1.6 + ent * .7, .4, .3, { ry: .3 + Math.sin(lt * 1.6) * .35 });
    bil.forEach(B => { const y = ((B.y0 - lt * B.v * 1.6) % 5 + 5) % 5; B.c.position.set(B.x + Math.sin(lt * 1.5 + B.ph) * .25, y, B.z); B.c.rotation.set(lt * B.w + B.ph, lt * B.w * .6, B.ph); });
    interr.scale.setScalar(Math.max(.01, back(lin(lt, .5, 1.0)))); interr.position.y = 1.7 + Math.sin(lt * 3) * .08; interr.rotation.z = Math.sin(lt * 2) * .15; },
  n3(lt, d) { surfa(lt, -1.0, .35, .4); const gav = arq3.gs[2], ab = eio(lin(lt, .3, .8)) * (1 - eio(lin(lt, d - 1.2, d - .7)));
    gav.position.z = .41 + ab * .42;
    cartoes.forEach((c, i) => { const t0 = .6 + i * .38, a = lin(lt, t0, t0 + .7); c.visible = a > 0 && a < 1; const e = eio(a);
      c.position.set(-.6 + e * 1.85 + Math.sin(i) * .05, 1.6 + Math.sin(a * Math.PI) * .6 - e * .25, .2 + e * .1); c.rotation.set(-e * 1.2, Math.sin(lt * 3 + i) * .4, e * .6); c.scale.setScalar(1 - e * .3); });
    const lp = lin(lt, 3.2, 4.2); lupa.visible = lt > 3.2; lupa.scale.setScalar(Math.max(.01, back(lp))); lupa.position.set(1.25 + Math.sin(lt * 1.8) * .3, 1.95 + Math.cos(lt * 2.4) * .12, .55); lupa.rotation.set(0, -.35, Math.sin(lt * 1.8) * .2); },
  n2(lt, d) { surfa(lt, -1.0, .35, .45); mapaT.draw(lin(lt, .3, Math.min(d - 1, 4.2))); },
  n1(lt, d) { surfa(lt, -1.0, .4, .45); const a = lin(lt, .5, 1.05), hit = lt > 1.05, k = Math.floor(lt * 6);
    seta.visible = lt > .5; const e = eio(a); seta.position.set(2.4 - e * 2.15 + (hit ? Math.sin((lt - 1.05) * 30) * .03 * Math.max(0, 1 - (lt - 1.05) * 2) : 0), 2.6 - e * 1.38, .6 - e * .62);
    seta.rotation.set(0, .5 * (1 - e), -.45 * (1 - e) - .5); telaT.draw(hit ? 1 : 0, k);
    lascas.forEach(L => { const q = lin(lt, 1.05, 2.0); L.l.visible = q > 0 && q < 1; L.l.position.set(Math.cos(L.a) * q * L.v * 1.2, 1.4 + Math.sin(L.a) * q * L.v - q * q * .6, -.05 + q * .5); L.l.rotation.set(q * 9 * L.v, q * 7, 0); });
    return hit && lt < 1.25 ? .03 : 0; },
  cta(lt, d) { surfa(lt, Math.sin(lt * 1.2) * .5, .2, Math.sin(lt * .9) * .3, { braco: [1.0 + Math.sin(lt * 6) * .15, 1.9 + Math.sin(lt * 9) * .35] }); },
};

// ---------- elementos de tela (2D) ----------
const CAB = { ult: null };
const ui = C => { const { X, gl, GW, GH, ITENS, MAXE, eo, lin, eio, back, SEGR, CHAVE } = C;
  const cabe = (t, f, mx, fam = "SG", w = 700) => { while (f > 18) { X.font = `${w} ${f}px ${fam}`; if (X.measureText(t).width <= mx) break; f -= 2; } return f; };
  const estrela = (x, y, r, c) => { X.fillStyle = c; X.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; X.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } X.closePath(); X.fill(); };
  let TMP = null;
  function cab(s, lt, t) { // tag + máquina de escrever + pote de estrelas (+ selo SÓ PRO MAC)
    X.save(); X.textBaseline = "middle"; X.textAlign = "left";
    X.fillStyle = FIO; X.beginPath(); X.roundRect(60, 536, 116, 92, 14); X.fill(); X.fillStyle = "#fff"; X.font = "700 60px SG"; X.textAlign = "center"; X.fillText(s.tag, 118, 584);
    const n = Math.min(s.item.length, Math.floor(Math.max(0, lt - .12) / .07)), txt = s.item.slice(0, n), fs = cabe(s.item, 70, 560, "JB", 500);
    X.fillStyle = "rgba(14,16,14,.82)"; X.beginPath(); X.roundRect(192, 536, X.measureText(s.item).width + 60, 92, 14); X.fill();
    X.font = `500 ${fs}px JB`; X.fillStyle = CREME; X.textAlign = "left"; X.fillText(txt, 220, 586); if (n < s.item.length || Math.floor(t * 3) % 2) { X.fillStyle = AMBAR; X.fillRect(224 + X.measureText(txt).width, 552, 8, 62); }
    const v = s.estrelas * eio(lin(lt, .35, 1.9)), nv = Math.min(1, v / MAXE), px = 840, py = 530, pw = 140, ph = 180;
    X.fillStyle = "rgba(14,16,14,.82)"; X.beginPath(); X.roundRect(60, 646, 520, 104, 14); X.fill();
    X.fillStyle = AMBAR; X.font = "700 72px SG"; X.textAlign = "left"; X.fillText(Math.round(v).toLocaleString("pt-BR") + " ★", 84, 694); X.fillStyle = "#c9c3b0"; X.font = "700 24px SG"; X.fillText("ESTRELAS NO GITHUB", 88, 734);
    X.save(); X.beginPath(); X.roundRect(px - pw / 2, py, pw, ph, 26); X.clip(); X.fillStyle = "rgba(220,235,240,.18)"; X.fillRect(px - pw / 2, py, pw, ph); let k = 0;
    for (let row = 0; row < 12; row++) for (let c = 0; c < 4; c++) { const yy = py + ph - 14 - row * 15, xx = px - pw / 2 + 20 + c * 33 + (row % 2) * 14; if ((ph - (yy - py)) / ph > nv) continue; estrela(xx, yy, 13, ["#f2b705", "#ffd447", "#e8a000"][(k++) % 3]); } X.restore();
    X.strokeStyle = "rgba(244,234,216,.85)"; X.lineWidth = 6; X.beginPath(); X.roundRect(px - pw / 2, py, pw, ph, 26); X.stroke(); X.fillStyle = FIO; X.fillRect(px - pw / 2 - 6, py - 20, pw + 12, 24);
    if (/KIKU|Arrow/.test(s.item)) { const a = back(lin(lt, .9, 1.25)); if (a > 0) { X.save(); X.translate(700, 800); X.rotate(-.06); X.scale(a, a); X.fillStyle = CREME; X.beginPath(); X.roundRect(-150, -38, 300, 76, 12); X.fill();
      X.strokeStyle = FIO; X.lineWidth = 5; X.strokeRect(-140, -29, 280, 58); X.fillStyle = FIO; X.font = "700 40px SG"; X.textAlign = "center"; X.fillText("SÓ PRO MAC", 0, 3); X.restore(); } }
    X.restore(); }
  return {
    fundo(t) { X.fillStyle = PAREDE; X.fillRect(0, 0, 1080, 1920); for (let x = 0; x < 1080; x += 64) { X.fillStyle = "rgba(255,255,255,.03)"; X.fillRect(x, 0, 24, 1920); }
      const g = X.createRadialGradient(560, 760, 60, 560, 760, 900); g.addColorStop(0, "rgba(255,226,150,.16)"); g.addColorStop(1, "rgba(0,0,0,.35)"); X.fillStyle = g; X.fillRect(0, 0, 1080, 1920);
      X.fillStyle = "#14110e"; X.fillRect(0, 1500, 1080, 420); },
    etiqueta(t) { // tela de terminal
      const [l1, l2, l3] = SEGR[0].etiqueta; X.fillStyle = "rgba(10,14,11,.95)"; X.beginPath(); X.roundRect(60, 270, 890, 236, 18); X.fill();
      X.fillStyle = "#26302a"; X.beginPath(); X.roundRect(60, 270, 890, 42, [18, 18, 0, 0]); X.fill(); ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => { X.fillStyle = c; X.beginPath(); X.arc(90 + i * 28, 291, 8, 0, 7); X.fill(); });
      X.fillStyle = "#8fa898"; X.font = "400 16px PS"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("detetive@arquivo:~$ ./caso_03", 190, 292);
      const cur = Math.floor(t * 2.5) % 2 ? "▌" : ""; X.textBaseline = "alphabetic";
      X.fillStyle = "#f4f1ea"; cabe(l1, 52, 840); X.fillText(l1, 84, 370);
      const p2 = l2.split(" "), num = p2.slice(0, 2).join(" ") + " ", r2 = p2.slice(2).join(" "); cabe(l2, 48, 840); X.fillStyle = "#ff6a5a"; X.fillText(num, 84, 428); const w = X.measureText(num).width; X.fillStyle = "#7ee7a0"; X.fillText(r2, 84 + w, 428);
      cabe("> " + l3, 44, 820); X.fillStyle = AMBAR; X.fillText("> " + l3, 84, 484); X.fillStyle = "#7ee7a0"; X.fillText(cur, 84 + X.measureText("> " + l3 + " ").width, 484); },
    cabecalho(s, lt, t) { CAB.ult = [s, lt, t]; },
    desenha3D(glc, nome) { if (!TMP) { TMP = document.createElement("canvas"); TMP.width = GW; TMP.height = GH; }
      const g = TMP.getContext("2d"); g.globalCompositeOperation = "source-over"; g.clearRect(0, 0, GW, GH); g.drawImage(glc, 0, 0); g.globalCompositeOperation = "destination-in";
      const m = g.createLinearGradient(0, 0, 0, GH); m.addColorStop(0, "rgba(0,0,0,0)"); m.addColorStop(.1, "#000"); m.addColorStop(.88, "#000"); m.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = m; g.fillRect(0, 0, GW, GH);
      X.drawImage(TMP, 0, nome === "cta" ? 700 : 660); if (CAB.ult) { cab(...CAB.ult); CAB.ult = null; } },
    legenda(seg, t) { // uma palavra gigante por vez, com pop
      const ws = seg.palavras; let i = ws.findIndex(w => t < w.t1); if (i < 0) i = ws.length - 1; const w = ws[i]; if (t < ws[0].t0 - .05) return;
      const txt = w.w.replace(/[.,:;…?!]+$/, "").toUpperCase(), p = back(lin(t, w.t0 - .02, w.t0 + .14)), fs = cabe(txt, 120, 880);
      X.save(); X.translate(540, 1405); X.scale(.6 + .4 * p, .6 + .4 * p); X.rotate((i % 2 ? 1 : -1) * .03); X.font = `700 ${fs}px SG`; X.textAlign = "center"; X.textBaseline = "middle";
      const dest = txt === CHAVE || /^\d|MAC|SETA|MAPA|IMAGEM|GENIAL/.test(txt); X.lineJoin = "round"; X.lineWidth = 18; X.strokeStyle = TINTA; X.strokeText(txt, 0, 0); X.fillStyle = dest ? "#ff6a5a" : CREME; X.fillText(txt, 0, 0); X.restore(); },
    transicao(lt, s, nome) { // glitch RGB nas trocas de cena
      if (nome === "gancho" || lt > .28) return; const k = 1 - lt / .28, cv = X.canvas;
      X.save(); X.globalCompositeOperation = "lighter"; for (let i = 0; i < 8; i++) { const y = 300 + ((i * 241 + Math.floor(lt * 60) * 113) % 1200), h = 30 + (i * 41) % 140, dx = (i % 2 ? 1 : -1) * 46 * k; X.globalAlpha = .5 * k; X.drawImage(cv, 0, y, 1080, h, dx, y, 1080, h); }
      X.globalCompositeOperation = "multiply"; X.globalAlpha = .5 * k; X.fillStyle = "#ff3050"; X.fillRect(0, 0, 1080, 1920 * .5 * (1 - k)); X.fillStyle = "#30e0ff"; X.fillRect(0, 1920 * (1 - .3 * k), 1080, 1920 * .3 * k); X.restore(); },
    fechamento(lt) { // post-its presos no quadro, ligados por fio vermelho
      const P = [[230, 720], [540, 680], [850, 720]].map(([x, y], i) => [x - (i === 2 ? 30 : 0), y]), cores = ["#a5e3b4", "#9fc9ff", "#ffe066"];
      X.strokeStyle = FIO; X.lineWidth = 5; const q = eo(lin(lt, .5, .9)); X.beginPath(); X.moveTo(...P[0]); X.lineTo(P[0][0] + (P[1][0] - P[0][0]) * q, P[0][1] + (P[1][1] - P[0][1]) * q); X.stroke();
      if (q >= 1) { const q2 = eo(lin(lt, .9, 1.2)); X.beginPath(); X.moveTo(...P[1]); X.lineTo(P[1][0] + (P[2][0] - P[1][0]) * q2, P[1][1] + (P[2][1] - P[1][1]) * q2); X.stroke(); }
      ITENS.forEach((s, i) => { const a = back(lin(lt, .1 + i * .12, .42 + i * .12)); if (a <= 0) return; X.save(); X.translate(...P[i]); X.rotate([-.06, .04, -.03][i]); X.scale(a, a);
        X.fillStyle = "rgba(0,0,0,.35)"; X.fillRect(-122, -102, 250, 220); X.fillStyle = cores[i]; X.fillRect(-130, -112, 250, 220); X.fillStyle = FIO; X.beginPath(); X.arc(-5, -100, 13, 0, 7); X.fill();
        X.textAlign = "center"; X.textBaseline = "middle"; X.fillStyle = FIO; X.font = "700 50px SG"; X.fillText(s.tag, -5, -46); X.fillStyle = TINTA; X.font = `700 ${cabe(s.item, 42, 220)}px SG`; X.fillText(s.item, -5, 12);
        X.font = "700 32px SG"; X.fillStyle = "#4a3a2a"; X.fillText(s.estrelas + " ★", -5, 64); X.restore(); });
      const p = back(lin(lt, .6, 1.0)); X.save(); X.translate(540, 1300); X.rotate(-.03); X.scale(p, p); X.font = "700 88px SG"; const w1 = X.measureText("COMENTA ").width, w2 = X.measureText(CHAVE).width;
      X.fillStyle = "rgba(0,0,0,.4)"; X.fillRect(-(w1 + w2) / 2 - 30, -58, w1 + w2 + 70, 136); X.fillStyle = FIO; X.fillRect(-(w1 + w2) / 2 - 40, -70, w1 + w2 + 80, 140); X.textAlign = "left"; X.textBaseline = "middle"; X.fillStyle = "#fff"; X.fillText("COMENTA ", -(w1 + w2) / 2, 2); X.fillStyle = "#ffe066"; X.fillText(CHAVE, -(w1 + w2) / 2 + w1, 2); X.restore();
      X.globalAlpha = eo(lin(lt, 1.1, 1.5)); X.fillStyle = "rgba(10,14,11,.85)"; X.beginPath(); X.roundRect(170, 1400, 740, 70, 14); X.fill(); X.fillStyle = CREME; X.font = "700 38px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("que eu te mando os 3 links", 540, 1436); X.globalAlpha = 1; },
  }; };
const cores = { LAR: FIO, VERDE: ABA, FUNDO: PAREDE, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

// Reel "5 projetos grátis pra estudar com IA" (08/11 13:00). Identidade: biblioteca de madeira à luz da manhã,
// amarelo-lápis + azul-caderno. Elementos: etiqueta em página de caderno, nome na máquina de escrever, pote enchendo
// de estrelas, legenda karaokê com marca-texto, transição em íris, fechamento numa página de caderno escrita à mão;
// mascote de mochila e boné, lendo e anotando; câmera em travelling lateral pelas estantes.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const AMAR = "#f2b705", AZUL = "#2c5aa0", PAPEL = "#f7f1e1", TINTA = "#1e2433", MADEIRA = "#7a4b2a";

// ---------- cenário: biblioteca ----------
const bib = new THREE.Group(); S.add(bib);
const pisoT = ctex(512, 512, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = `hsl(28,45%,${30 + (i * 7) % 12}%)`; g.fillRect(0, i * 64, w, 64); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(0, i * 64, w, 3); for (let x = (i * 137) % 200; x < w; x += 230) g.fillRect(x, i * 64, 3, 64); } });
pisoT.wrapS = pisoT.wrapT = THREE.RepeatWrapping; pisoT.repeat.set(4, 3);
const piso = mesh(new THREE.PlaneGeometry(20, 12), new THREE.MeshStandardMaterial({ map: pisoT, roughness: .7 }), bib, 0, 0, 0); piso.rotation.x = -Math.PI / 2;
mesh(new THREE.PlaneGeometry(20, 8), M("#e9dcc0", { roughness: .95 }), bib, 0, 4, -3.2);
const CORES_L = ["#b5413a", "#2c5aa0", "#3f7d4f", "#d9a12b", "#6c3f8f", "#c8693a", "#1f4e5f", "#8a2d3b"];
for (let e = 0; e < 4; e++) { const est = new THREE.Group(); est.position.set(-6.3 + e * 4.2, 0, -2.9); bib.add(est); box(3.6, 4.4, .5, M(MADEIRA, { roughness: .8 }), est, 0, 2.2, -.1);
  for (let pr = 0; pr < 5; pr++) { box(3.5, .08, .5, M("#5d3820"), est, 0, .3 + pr * .9, .05); let x = -1.6; let k = e * 31 + pr * 7;
    while (x < 1.6) { const w = .12 + ((k * 13) % 7) * .025, h = .55 + ((k * 7) % 5) * .06; box(w, h, .38, M(CORES_L[k % 8], { roughness: .7 }), est, x + w / 2, .34 + pr * .9 + h / 2, .08); x += w + .015; k++; } } }
// raios de sol entrando pela janela (alto, à direita) e poeira brilhando
const raios = []; for (let i = 0; i < 4; i++) { const r = mesh(new THREE.PlaneGeometry(1.2, 9), new THREE.MeshBasicMaterial({ color: "#fff1c2", transparent: true, opacity: .1, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }), bib, 3.5 - i * 1.2, 3.6, -1.5 + i * .3); r.rotation.set(0, -.3, .55); r.castShadow = false; raios.push(r); }
const sol = new THREE.DirectionalLight(0xfff0c8, 1.6); sol.position.set(6, 8, 3); S.add(sol);
const poeira = []; for (let i = 0; i < 60; i++) { const p = mesh(new THREE.SphereGeometry(.015, 6, 4), new THREE.MeshBasicMaterial({ color: "#fff6d8", transparent: true, opacity: .8 }), bib, 0, 0, 0); p.castShadow = false; poeira.push({ p, x: (rnd() - .2) * 6, y: 1 + rnd() * 3, z: -1.5 + rnd() * 3, f: rnd() * 6 }); }
const mesaL = new THREE.Group(); mesaL.position.set(.4, 0, -.2); bib.add(mesaL); box(3.6, .1, 1.6, M("#8a5a35", { roughness: .6 }), mesaL, 0, .78, 0); for (const x of [-1.6, 1.6]) for (const z of [-.65, .65]) box(.1, .78, .1, M("#5d3820"), mesaL, x, .39, z);
rim.color.set(0xffd89a); key.color.set(0xfff4dc);

// ---------- mascote: mochila + boné; lê e anota ----------
const moch = new THREE.Group(); MAS.corpo.add(moch); box(1.1, .8, .35, M(AZUL, { roughness: .7 }), moch, 0, .95, -.62); box(.8, .3, .12, M("#244a85"), moch, 0, .75, -.82);
for (const x of [-.68, .68]) box(.06, .55, .5, M("#1d3a6a"), moch, x, .85, -.1);
const bone = new THREE.Group(); MAS.corpo.add(bone); mesh(new THREE.CylinderGeometry(.62, .66, .22, 24, 1, false, 0, Math.PI * 2), M(AMAR), bone, 0, 1.6, 0).scale.set(1.15, 1, .78);
box(.8, .04, .45, M(AMAR), bone, 0, 1.52, .55);
const livro = new THREE.Group(); S.add(livro); const capa = M("#b5413a");
const fL = new THREE.Group(); livro.add(fL); box(.5, .03, .7, capa, fL, -.25, 0, 0); const fR = new THREE.Group(); livro.add(fR); box(.5, .03, .7, capa, fR, .25, 0, 0);
const pagL = ctex(128, 180, (g, w, h) => { g.fillStyle = PAPEL; g.fillRect(0, 0, w, h); g.fillStyle = "#9aa3b5"; for (let y = 20; y < h - 10; y += 14) g.fillRect(10, y, w - 20 - (y % 3) * 8, 4); });
box(.46, .04, .66, M("#ffffff", { map: pagL }), fL, -.25, .02, 0); box(.46, .04, .66, M("#ffffff", { map: pagL }), fR, .25, .02, 0);
const folhaV = new THREE.Group(); livro.add(folhaV); box(.46, .01, .66, M(PAPEL), folhaV, .25, .045, 0);
const lapis = new THREE.Group(); S.add(lapis); mesh(new THREE.CylinderGeometry(.04, .04, .6, 6), M(AMAR), lapis, 0, 0, 0); mesh(new THREE.ConeGeometry(.04, .12, 6), M("#e8c9a0"), lapis, 0, -.36, 0).rotation.x = Math.PI;
function le(lt, x, z = .2) { livro.visible = true; lapis.visible = true;
  pose(MAS, { x, z, y: 0, ry: .25, braco: [.55, .55 + (Math.floor(lt / 1.2) % 2 ? Math.abs(Math.sin(lt * 16)) * .25 : 0)], piscar: pisca(lt) });
  livro.position.set(x + .62, .62, z + .78); livro.rotation.set(1.25, .45, 0); livro.scale.setScalar(.85); fL.rotation.z = .25; fR.rotation.z = -.25; folhaV.rotation.z = -(((lt % 1.2) / 1.2) > .7 ? Math.PI * eio((((lt % 1.2) / 1.2) - .7) / .3) : 0);
  const w = new THREE.Vector3(); MAS.bracos[1].getWorldPosition(w); lapis.position.set(w.x + .1, w.y + .15, w.z + .3); lapis.rotation.set(.6, 0, -.5 + Math.sin(lt * 16) * .1); }
const esconde = () => { livro.visible = false; lapis.visible = false; };

// ---------- gancho: pilha de livros despenca e vira um tablet ----------
const gG = grupo("gancho"); const pilha = [];
for (let i = 0; i < 7; i++) { const b = box(.9 - (i % 3) * .08, .16, .62, M(CORES_L[i], { roughness: .7 }), gG, 1.1, .86 + i * .17, 0); b.rotation.y = (i % 2 ? .12 : -.1); pilha.push({ b, y: .86 + i * .17, ry: b.rotation.y, v: new THREE.Vector3((rnd() - .5) * 2, 1 + rnd(), (rnd() - .2) * 1.5), w: (rnd() - .5) * 8 }); }
const tabT = ctex(300, 420, (g, w, h) => { g.fillStyle = "#101826"; g.fillRect(0, 0, w, h); g.fillStyle = AMAR; g.font = "700 40px FR"; g.fillText("Aula 1", 24, 70); g.fillStyle = "#9fb7e0"; for (let i = 0; i < 6; i++) g.fillRect(24, 110 + i * 40, 230 - (i * 37) % 90, 16); });
const tablet = new THREE.Group(); gG.add(tablet); box(.9, 1.25, .06, M("#1b1b22"), tablet, 0, 0, 0); mesh(new THREE.PlaneGeometry(.82, 1.15), new THREE.MeshBasicMaterial({ map: tabT, toneMapped: false }), tablet, 0, 0, .035);

// ---------- itens ----------
const n5 = grupo("n5"); // grammai: redação com sublinhados vermelhos que viram verdes
const redT = ctex(512, 640, (g, w, h, p = 0) => { g.fillStyle = PAPEL; g.fillRect(0, 0, w, h); g.strokeStyle = "#b9c8e6"; for (let y = 60; y < h; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  g.fillStyle = TINTA; g.font = "700 30px CV"; ["I has a dream that", "one day this nation", "will rise up and", "live out the true", "meaning of it's creed"].forEach((t, i) => g.fillText(t, 30, 92 + i * 80));
  [[30, 98, 72], [300, 418, 64]].forEach(([x, y, w2], i) => { const ok = p > (i + 1) / 3; g.strokeStyle = ok ? "#2a9d4a" : "#d1342f"; g.lineWidth = 5; g.beginPath(); for (let k = 0; k <= w2; k += 6) g.lineTo(x + 20 + k, y + 8 + Math.sin(k / 3) * 3); g.stroke();
    if (ok) { g.fillStyle = "#2a9d4a"; g.font = "700 26px CV"; g.fillText(i ? "its" : "have", x + 20, y - 26); } }); });
const redacao = mesh(new THREE.PlaneGeometry(1.7, 2.1), M("#ffffff", { map: redT }), n5, 1.4, 1.85, -.6); redacao.rotation.x = -.15;
const n4 = grupo("n4"); // ESP32 Labs: placa com chip, LED piscando e fios
const placa = new THREE.Group(); placa.position.set(1.4, .84, 0); placa.scale.setScalar(1.5); n4.add(placa); box(1.6, .06, 1.0, M("#1f6b3a", { roughness: .5 }), placa, 0, 0, 0); box(.5, .1, .5, M("#1b1b22"), placa, -.2, .07, 0);
for (let i = 0; i < 10; i++) box(.04, .03, .12, M("#d9c27a", { metalness: .8 }), placa, -.45 + (i % 5) * .1 + (i > 4 ? 0 : 0), .05, i > 4 ? .3 : -.3);
const led = mesh(new THREE.SphereGeometry(.07, 12, 10), E("#ff3b3b", 3), placa, .5, .12, -.2); const luzLed = new THREE.PointLight(0xff3b3b, 0, 2); luzLed.position.set(.5, .3, -.2); placa.add(luzLed);
const fios = [["#e63946", .3], ["#2c5aa0", .1], [AMAR, -.1]].map(([c, z]) => { const cur = new THREE.CatmullRomCurve3([V(.7, .05, z), V(1.0, .5, z), V(1.3, .1, z + .3)]); return mesh(new THREE.TubeGeometry(cur, 20, .02, 6), M(c), placa, 0, 0, 0); });
const n3 = grupo("n3"); // Claudemy: o diploma se monta com módulos que encaixam
const dipT = ctex(512, 360, (g, w, h) => { g.fillStyle = PAPEL; g.fillRect(0, 0, w, h); g.strokeStyle = AMAR; g.lineWidth = 12; g.strokeRect(14, 14, w - 28, h - 28); g.fillStyle = TINTA; g.textAlign = "center"; g.font = "700 46px FR"; g.fillText("Certificado", w / 2, 110);
  g.font = "700 34px CV"; g.fillText("Curso concluído!", w / 2, 180); g.fillStyle = "#d1342f"; g.beginPath(); g.arc(w / 2, 270, 34, 0, 7); g.fill(); });
const diploma = mesh(new THREE.PlaneGeometry(1.7, 1.2), M("#ffffff", { map: dipT }), n3, 1.4, 1.95, -.7); const modulos = [];
for (let i = 0; i < 6; i++) modulos.push(box(.5, .3, .3, M([AZUL, AMAR, "#3f7d4f", "#b5413a", "#6c3f8f", "#c8693a"][i], { roughness: .5 }), n3, 0, 0, 0));
const n2 = grupo("n2"); // Word Atlas: cartões de vocabulário ilustrados girando + alto-falante
const PAL = [["apple", "#d1342f"], ["house", "#2c5aa0"], ["cat", "#c8693a"], ["moon", "#6c3f8f"], ["tree", "#3f7d4f"]];
const cartoes = PAL.map(([wd, c], i) => { const t = ctex(256, 320, (g, w, h) => { g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); g.fillStyle = c; g.beginPath(); if (i === 1) { g.fillRect(70, 110, 116, 90); g.moveTo(56, 112); g.lineTo(128, 50); g.lineTo(200, 112); } else g.arc(128, 130, 70, 0, 7); g.fill();
    g.fillStyle = TINTA; g.font = "700 46px FR"; g.textAlign = "center"; g.fillText(wd, 128, 270); }); return mesh(new THREE.PlaneGeometry(.6, .75), new THREE.MeshBasicMaterial({ map: t, toneMapped: false, side: THREE.DoubleSide }), n2, 0, 0, 0); });
const fala = new THREE.Group(); fala.position.set(2.4, .84, -.3); n2.add(fala); mesh(new THREE.ConeGeometry(.22, .35, 20, 1, true), M("#2b2b33", { side: THREE.DoubleSide }), fala, 0, .25, 0).rotation.z = Math.PI / 2;
const ondas = [0, 1, 2].map(i => { const o = mesh(new THREE.TorusGeometry(.18 + i * .12, .02, 6, 24, Math.PI * .7), E(AMAR, 1.5), fala, .1, .25, 0); o.rotation.set(0, Math.PI / 2, -Math.PI * .35); return o; });
const n1 = grupo("n1"); // Cicada: aula ao vivo no laptop; balões em duas línguas viram legenda
const lap = new THREE.Group(); lap.position.set(1.3, .84, -.2); n1.add(lap); box(1.7, .07, 1.1, M("#c9ccd6", { metalness: .5, roughness: .3 }), lap, 0, .035, 0);
const tela1 = new THREE.Group(); tela1.position.set(0, .07, -.55); lap.add(tela1); box(1.7, 1.05, .05, M("#c9ccd6", { metalness: .5, roughness: .3 }), tela1, 0, .52, 0);
const aulaT = ctex(512, 320, (g, w, h, t = 0, p = 0) => { g.fillStyle = "#2a3346"; g.fillRect(0, 0, w, h); g.fillStyle = "#f2d3b0"; g.beginPath(); g.arc(150, 150, 50, 0, 7); g.fill(); g.fillStyle = "#3a4a6a"; g.fillRect(90, 200, 120, 120);
  g.fillStyle = "#fff"; g.fillRect(270, 60, 210, 140); g.fillStyle = "#333"; g.font = "700 22px SG"; g.fillText("E = mc²", 300, 140); g.fillStyle = "#ff3b3b"; g.beginPath(); g.arc(30, 24, 9 + Math.sin(t * 6) * 2, 0, 7); g.fill(); g.fillStyle = "#fff"; g.font = "700 18px SG"; g.fillText("AO VIVO", 46, 30);
  if (p > 0) { g.fillStyle = "rgba(0,0,0,.7)"; g.fillRect(0, h - 70, w, 70); g.fillStyle = "#fff"; g.font = "700 20px SG"; g.textAlign = "center"; g.fillText("Energy equals mass times…", w / 2, h - 44); g.fillStyle = AMAR; g.fillText("Energia é igual à massa vezes…", w / 2, h - 16); g.textAlign = "left"; } });
mesh(new THREE.PlaneGeometry(1.6, .96), new THREE.MeshBasicMaterial({ map: aulaT, toneMapped: false }), tela1, 0, .53, .03);
const bal = [["Hello, class!", "#ffffff"], ["Olá, turma!", AMAR]].map(([t2, c], i) => { const t = ctex(320, 140, (g, w, h) => { g.fillStyle = c; g.beginPath(); g.roundRect(4, 4, w - 8, h - 34, 26); g.fill(); g.beginPath(); g.moveTo(i ? w - 70 : 50, h - 32); g.lineTo(i ? w - 40 : 40, h - 4); g.lineTo(i ? w - 100 : 90, h - 32); g.fill();
    g.fillStyle = TINTA; g.font = "700 40px FR"; g.textAlign = "center"; g.fillText(t2, w / 2, 70); }); return mesh(new THREE.PlaneGeometry(1.1, .48), new THREE.MeshBasicMaterial({ map: t, transparent: true, toneMapped: false, side: THREE.DoubleSide }), n1, 0, 0, 0); });

// ---------- fechamento: aviõezinhos de papel cruzando a biblioteca ----------
const cG = grupo("cta"); const avioes = [];
const aviaoGeo = (() => { const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, .35, -.22, 0, -.25, 0, .02, -.18, 0, 0, .35, 0, .02, -.18, .22, 0, -.25, 0, 0, .35, 0, -.08, -.2, 0, .02, -.18], 3)); g.computeVertexNormals(); return g; })();
for (let i = 0; i < 9; i++) { const a = mesh(aviaoGeo, M(i % 3 ? "#ffffff" : AMAR, { side: THREE.DoubleSide }), cG, 0, 0, 0); avioes.push({ a, y: 1.5 + rnd() * 2.2, z: -1.5 + rnd() * 2.5, v: .9 + rnd() * .6, ph: rnd() * 10, dir: i % 2 ? 1 : -1 }); }

// ---------- câmera: travelling lateral (desliza em x durante a fala) ----------
const SHOTS = { gancho: [[V(0, 2, 6), V(0, 1.3, 0)], [V(0, 2, 6), V(0, 1.3, 0)]] };
["n5", "n4", "n3", "n2", "n1", "cta"].forEach(n => SHOTS[n] = SHOTS.gancho);
const camera = (cam, nome, lt, d, t, sh) => { const u = lt / d, dir = ["n4", "n2", "cta"].includes(nome) ? -1 : 1, x0 = .1 - dir * .8, x = x0 + dir * 1.6 * eio(u);
  const alvoX = nome === "cta" ? 0 : .35; cam.position.set(x, 1.95 + Math.sin(t * .7) * .05, 5.4); cam.lookAt(alvoX + (x - .25) * .35, 1.25, 0); cam.position.x += Math.sin(t * 61) * sh; cam.position.y += Math.cos(t * 47) * sh; };

const ACT = {
  gancho(lt, d) { esconde(); const cai = lin(lt, .7, 1.6);
    pilha.forEach((P, i) => { const tt = Math.max(0, lt - .7 - i * .03); const e = Math.min(1, tt / .9); P.b.visible = lt < 1.75; P.b.position.set(1.1 + P.v.x * tt, Math.max(.9, P.y + P.v.y * tt - 4 * tt * tt), P.v.z * tt * .5); P.b.rotation.set(P.w * tt * .2, P.ry + P.w * tt * .3, P.w * tt * .25); });
    const tb = back(lin(lt, 1.6, 2.2)); tablet.visible = lt > 1.6; tablet.position.set(1.1, 1.6 + Math.sin(lt * 2) * .04, .1); tablet.scale.setScalar(tb); tablet.rotation.set(-.1, -.25 + Math.sin(lt) * .05, 0);
    pose(MAS, { x: -1.3, y: lt > .7 && lt < 1.0 ? .25 : hop(lt, .6, .08), sq: lt > .7 && lt < .85 ? .12 : 0, braco: lt > .7 && lt < 1.6 ? [1.6, 1.6] : [.3, .5], piscar: lt > .7 && lt < 1.2 ? .3 : pisca(lt), ry: .3 }); },
  n5(lt, d) { le(lt, -.75); redT.draw(eio(lin(lt, .8, d - .3))); },
  n4(lt, d) { le(lt, -.75); const on = Math.floor(lt * 3) % 2; led.material.emissiveIntensity = on ? 4 : .3; luzLed.intensity = on ? 3 : 0; placa.rotation.y = Math.sin(lt * .8) * .1; },
  n3(lt, d) { le(lt, -.75); modulos.forEach((m, i) => { const e = eio(lin(lt, .3 + i * .3, .9 + i * .3)); m.position.set(1.4 + (-.55 + (i % 3) * .55) * e + (1 - e) * (2.5 - i * .3), 1.2 + Math.floor(i / 3) * .32 * e + (1 - e) * 2, -.5 + (1 - e) * .8); m.rotation.set((1 - e) * 3, (1 - e) * 2, 0); m.visible = lt > .3 + i * .3; });
    const dp = back(lin(lt, 2.2, 2.8)); diploma.scale.setScalar(Math.max(.01, dp)); diploma.visible = lt > 2.2; },
  n2(lt, d) { le(lt, -.8); cartoes.forEach((c, i) => { const a = lt * .9 + i / 5 * Math.PI * 2; c.position.set(1.3 + Math.cos(a) * 1.1, 1.55 + Math.sin(a * 2) * .12, Math.sin(a) * .7 - .2); c.lookAt(cam.position); c.scale.setScalar(back(lin(lt, i * .12, i * .12 + .5))); });
    ondas.forEach((o, i) => o.material.emissiveIntensity = (Math.floor(lt * 4) + i) % 3 === 0 ? 3 : .4); },
  n1(lt, d) { le(lt, -.85); aulaT.draw(lt, lt > 2.2 ? 1 : 0); tela1.rotation.x = -.15;
    bal.forEach((b, i) => { const s = back(lin(lt, .5 + i * .5, .9 + i * .5)); b.visible = s > .01; b.scale.setScalar(1.45 * Math.max(.01, s) * (lt > 2.2 ? Math.max(.01, 1 - (lt - 2.2) * 2) : 1)); b.position.set(1.3 + (i ? .55 : -.55), 2.15 + i * .2 + Math.sin(lt * 2 + i) * .04, -.3); b.lookAt(cam.position); }); },
  cta(lt, d) { esconde(); pose(MAS, { x: 0, y: hop(lt, .5, .15), braco: [.3, 1.9 + Math.sin(lt * 9) * .5], piscar: pisca(lt), ry: 0 });
    avioes.forEach(A => { const x = ((lt * A.v * 1.6 + A.ph) % 8) - 4; A.a.position.set(A.dir * x, A.y + Math.sin(lt * 2 + A.ph) * .2, A.z); A.a.rotation.set(Math.sin(lt * 3 + A.ph) * .2, A.dir * Math.PI / 2, Math.sin(lt * 2 + A.ph) * .3); }); },
};
const anima = t => { raios.forEach((r, i) => r.material.opacity = .08 + Math.sin(t * .8 + i) * .03); poeira.forEach(P => P.p.position.set(P.x + Math.sin(t * .3 + P.f) * .3, P.y + Math.sin(t * .5 + P.f) * .2, P.z)); };
Object.keys(ACT).forEach(k => { const f = ACT[k]; ACT[k] = (lt, d) => { anima(lt + k.length); return f(lt, d); }; });

// ---------- elementos de tela (2D) ----------
const ui = C => { const { X, ITENS, MAXE, fmt, eo, lin, eio, back, blocos, SEGR, CHAVE } = C;
  const pagina = (x, y, w, h, margem = true) => { X.fillStyle = PAPEL; X.fillRect(x, y, w, h); X.strokeStyle = "rgba(44,90,160,.28)"; X.lineWidth = 2; for (let yy = y + 46; yy < y + h; yy += 46) { X.beginPath(); X.moveTo(x, yy); X.lineTo(x + w, yy); X.stroke(); }
    if (margem) { X.strokeStyle = "rgba(209,52,47,.6)"; X.beginPath(); X.moveTo(x + 90, y); X.lineTo(x + 90, y + h); X.stroke(); } X.fillStyle = "#d9d0bb"; for (let yy = y + 30; yy < y + h; yy += 70) { X.beginPath(); X.arc(x + 34, yy, 12, 0, 7); X.fill(); } };
  const cabe = (t, f, mx, fam, peso = 700) => { while (f > 22) { X.font = `${peso} ${f}px ${fam}`; if (X.measureText(t).width <= mx) break; f -= 2; } };
  const estrela = (x, y, r, c) => { X.fillStyle = c; X.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; X.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } X.closePath(); X.fill(); };
  return {
    fundo(t) { X.fillStyle = "#efe4cb"; X.fillRect(0, 0, 1080, 1920); },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta, e = nome === "gancho" ? eo(lin(t, 0, .45)) : 1;
      X.save(); X.translate(0, (1 - e) * -340); X.shadowColor = "rgba(0,0,0,.18)"; X.shadowBlur = 20; X.shadowOffsetY = 8; pagina(40, 60, 1000, 330); X.shadowColor = "transparent";
      X.fillStyle = TINTA; X.textAlign = "left"; cabe(l1, 64, 880, "FR"); X.fillText(l1, 120, 150); X.fillStyle = AZUL; cabe(l2, 50, 880, "FR"); X.fillText(l2, 120, 236);
      X.fillStyle = "#d1342f"; X.font = "700 64px CV"; X.fillText(l3.toLowerCase().replace("nº", "nº"), 120, 326); const w = X.measureText(l3.toLowerCase()).width; X.strokeStyle = "#d1342f"; X.lineWidth = 5; X.beginPath(); for (let x = 0; x <= w; x += 10) X.lineTo(120 + x, 344 + Math.sin(x / 18) * 5); X.stroke(); X.restore(); },
    cabecalho(s, lt, t) { // máquina de escrever + pote de estrelas
      const n = Math.floor(Math.max(0, lt - .1) / .07), txt = s.item.slice(0, n); X.fillStyle = TINTA; X.font = "500 70px JB"; X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillText(txt, 140, 560);
      if ((t * 2) % 1 < .5 || n < s.item.length) { const w = X.measureText(txt).width; X.fillRect(144 + w, 500, 8, 70); }
      X.strokeStyle = "#d1342f"; X.lineWidth = 6; X.beginPath(); X.ellipse(84, 532, 46, 40, -.2, 0, 7); X.stroke(); X.fillStyle = "#d1342f"; X.font = "700 52px CV"; X.textAlign = "center"; X.fillText(s.tag, 84, 550);
      // pote
      const v = s.estrelas * eio(lin(lt, .3, 1.9)), nv = Math.min(1, v / MAXE), px = 900, py = 470, pw = 150, ph = 190;
      X.save(); X.beginPath(); X.roundRect(px - pw / 2, py, pw, ph, 28); X.clip(); let k = 0; for (let row = 0; row < 12; row++) for (let c = 0; c < 4; c++) { const yy = py + ph - 14 - row * 15, xx = px - pw / 2 + 22 + c * 36 + (row % 2) * 16; if ((ph - (yy - py)) / ph > nv) continue; estrela(xx, yy, 14, ["#f2b705", "#ffd447", "#e8a000"][(k++) % 3]); } X.restore();
      X.strokeStyle = "rgba(30,36,51,.75)"; X.lineWidth = 6; X.beginPath(); X.roundRect(px - pw / 2, py, pw, ph, 28); X.stroke(); X.fillStyle = "#b5413a"; X.fillRect(px - pw / 2 - 6, py - 22, pw + 12, 26);
      X.fillStyle = TINTA; X.font = "700 54px FR"; X.textAlign = "right"; X.fillText(fmt(v).toLowerCase() + " ★", px - pw / 2 - 24, 620); X.font = "700 34px CV"; X.fillText("estrelas no GitHub", px - pw / 2 - 24, 664); },
    legenda(seg, t) { // karaokê com marca-texto
      const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b]; let fs = 64; X.font = `700 ${fs}px FR`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0);
      while (tot() > 920 && fs > 36) { fs -= 2; X.font = `700 ${fs}px FR`; } let x = 540 - tot() / 2; const y = 1690; X.textBaseline = "middle"; X.textAlign = "left";
      X.fillStyle = "rgba(247,241,225,.92)"; X.fillRect(40, y - fs, 1000, fs * 2);
      for (const w of c) { const ww = X.measureText(w.w).width, p = Math.max(0, Math.min(1, (t - w.t0) / Math.max(.05, w.t1 - w.t0))); if (p > 0) { X.fillStyle = "rgba(255,214,10,.75)"; X.fillRect(x - 4, y - fs * .42, (ww + 8) * p, fs * .84); }
        X.fillStyle = TINTA; X.fillText(w.w, x, y + 3); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s) { if (!s.item || lt > .4) return; const r = 40 + 1400 * eio(lt / .4); X.save(); X.fillStyle = TINTA; X.beginPath(); X.rect(0, 0, 1080, 1920); X.arc(540, 1080, r, 0, Math.PI * 2, true); X.fill("evenodd"); X.restore(); },
    fechamento(lt) { X.save(); X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 24; pagina(60, 420, 960, 1340); X.restore();
      X.fillStyle = TINTA; X.font = "700 58px FR"; X.textAlign = "left"; X.fillText("Pra estudar:", 150, 520);
      ITENS.forEach((s, i) => { const p = lin(lt, .1 + i * .12, .5 + i * .12); if (p <= 0) return; const y = 640 + i * 138, txt = `${s.tag} ${s.item} — ${fmt(s.estrelas).toLowerCase()} ★`; X.font = "700 60px CV"; const w = X.measureText(txt).width;
        X.save(); X.beginPath(); X.rect(140, y - 70, w * eo(p) + 10, 100); X.clip(); X.fillStyle = i === 4 ? "#d1342f" : AZUL; X.fillText(txt, 150, y); X.restore(); });
      const p = eo(lin(lt, .8, 1.2)); X.fillStyle = "#d1342f"; X.font = "700 96px CV"; X.textAlign = "center"; X.globalAlpha = p; X.fillText("Comenta " + CHAVE + "!", 540, 1450);
      X.strokeStyle = "#d1342f"; X.lineWidth = 7; for (const dy of [0, 18]) { X.beginPath(); for (let x = -330; x <= 330 * (2 * p - 1); x += 10) X.lineTo(540 + x, 1480 + dy + Math.sin(x / 20) * 4); X.stroke(); } X.globalAlpha = 1;
      X.fillStyle = TINTA; X.font = "700 46px CV"; X.fillText("que eu te mando os 5 links", 540, 1580); },
  }; };
const cores = { LAR: AMAR, VERDE: AZUL, FUNDO: "#efe4cb", CREME: PAPEL, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

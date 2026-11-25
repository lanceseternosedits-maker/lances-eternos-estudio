// Reel "Captura de movimento de qualquer bicho" (08/11 17:00), formato palco (cenas s1–s4) no motor do formato 3.
// Identidade: savana de papelão ao pôr do sol, laranja-savana + amarelo + marrom. Elementos: etiqueta em página de caderno,
// nome em carimbo, placar HI-SCORE, legenda karaokê com marca-texto, transição glitch RGB, câmera em órbita, fechamento em pódio,
// Caveat + Space Grotesk. Mascote de chapéu de safári andando de skate e filmando um cavalo de blocos que vira esqueleto de linhas.
// Texto importante entre y=260 e y=1500 e x<=950.
export default function (K) {
const { rim, key, THREE, S, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const SAV = "#f08a2c", AMA = "#ffcf3f", MAR = "#7a4a26", PAP = "#d9b07a", TINTA = "#2a1a0e", CIANO = "#3fe0ff";

// ---------- cenário: savana de papelão (recortes planos com borda de papelão) ----------
const sv = new THREE.Group(); S.add(sv); S.fog = new THREE.Fog("#f6a85a", 10, 26);
const chaoT = ctex(512, 512, g => { g.fillStyle = "#e0a25a"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "rgba(122,74,38,.22)"; g.lineWidth = 2; for (let y = 6; y < 512; y += 12) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); } for (let i = 0; i < 300; i++) { g.fillStyle = "rgba(255,230,160,.25)"; g.fillRect((i * 131) % 512, (i * 71) % 512, 4, 2); } });
chaoT.wrapS = chaoT.wrapT = THREE.RepeatWrapping; chaoT.repeat.set(6, 6);
const chao = mesh(new THREE.CircleGeometry(14, 48), new THREE.MeshStandardMaterial({ map: chaoT, roughness: 1 }), sv, 0, 0, 0); chao.rotation.x = -Math.PI / 2;
function recorte(par, shape, cor, x, y, z, ry = 0, esp = .06) { const g = new THREE.ExtrudeGeometry(shape, { depth: esp, bevelEnabled: false }); const m = new THREE.Mesh(g, [M(cor, { roughness: .95 }), M(PAP, { roughness: 1 })]); m.position.set(x, y, z); m.rotation.y = ry; m.castShadow = m.receiveShadow = true; par.add(m); return m; }
function acacia(par, x, z, s, ry) { const tr = new THREE.Shape(); tr.moveTo(-.08, 0); tr.lineTo(.08, 0); tr.lineTo(.05, 1.4); tr.lineTo(.4, 1.9); tr.lineTo(.3, 1.95); tr.lineTo(0, 1.6); tr.lineTo(-.35, 1.95); tr.lineTo(-.42, 1.9); tr.lineTo(-.05, 1.4); tr.lineTo(-.08, 0);
  const t = recorte(par, tr, MAR, x, 0, z, ry); t.scale.setScalar(s); const co = new THREE.Shape(); co.absellipse(0, 0, 1.2, .32, 0, Math.PI * 2); const c = recorte(par, co, "#7c8a2e", x, 2.0 * s, z - .02, ry); c.scale.setScalar(s); }
[[-4.5, -3.5, 1.3, .3], [4.2, -4.2, 1.6, -.2], [-7, -6, 1.8, .2], [6.8, -6.5, 1.2, -.3], [1.5, -7.5, 1.4, 0]].forEach(a => acacia(sv, ...a));
for (const [x, z, w, h, c] of [[-5, -10, 8, 2.4, "#c86a3a"], [4, -11, 9, 3.2, "#b2563a"], [0, -12.5, 12, 2.0, "#9a4a3a"]]) { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(-w / 4, h * .7); s.lineTo(0, h); s.lineTo(w / 3, h * .6); s.lineTo(w / 2, 0); recorte(sv, s, c, x, 0, z); }
for (let i = 0; i < 26; i++) { const s = new THREE.Shape(); s.moveTo(-.06, 0); s.lineTo(0, .3 + rnd() * .2); s.lineTo(.06, 0); const a = rnd() * 6.28, r = 2.6 + rnd() * 6; recorte(sv, s, "#c99a3a", Math.cos(a) * r, 0, Math.sin(a) * r - 1, rnd() * 3, .02); }
rim.color.set(0xff7a2a); rim.intensity = 2.4; rim.position.set(-5, 2.5, -5); key.color.set(0xffe2b8); key.intensity = 95;
const sol = new THREE.DirectionalLight(0xffa860, 1.1); sol.position.set(5, 2.5, 3); S.add(sol);

// girafa de blocos com pontinhos de captura (fundo)
const gir = new THREE.Group(); gir.position.set(-4.4, 0, -2.8); gir.rotation.y = .5; sv.add(gir); const GC = M(AMA, { roughness: .7 }), GM = M("#a8641e");
box(1.1, .55, .5, GC, gir, 0, 1.55, 0); for (const [x, z] of [[-.4, -.18], [.4, -.18], [-.4, .18], [.4, .18]]) box(.12, 1.3, .12, GC, gir, x, .65, z);
const pesc = box(.22, 1.4, .22, GC, gir, .5, 2.4, 0); pesc.rotation.z = -.3; box(.42, .22, .24, GC, gir, .78, 3.1, 0); for (let i = 0; i < 7; i++) box(.16, .02, .16, GM, gir, -.35 + (i % 4) * .22, 1.83, -.1 + Math.floor(i / 4) * .2);

// ---------- cavalo de blocos articulado (vira esqueleto de linhas) ----------
const cav = new THREE.Group(); S.add(cav); const CM = M("#b0703a", { roughness: .6, transparent: true }), CE = M("#5a3418", { transparent: true });
const corpoC = box(1.3, .5, .5, CM, cav, 0, 1.15, 0); const pescoco = new THREE.Group(); pescoco.position.set(.6, 1.3, 0); cav.add(pescoco); const pm = box(.24, .7, .26, CM, pescoco, .15, .3, 0); pescoco.rotation.z = -.55;
const cabeca = new THREE.Group(); cabeca.position.set(.3, .7, 0); pescoco.add(cabeca); const cm = box(.5, .22, .22, CM, cabeca, .15, 0, 0); cabeca.rotation.z = .9; const crina = box(.08, .6, .1, CE, pescoco, -.02, .35, 0);
const cauda = box(.08, .5, .08, CE, cav, -.7, 1.0, 0); cauda.rotation.z = .4;
const pernas = [[.5, .18], [.5, -.18], [-.5, .18], [-.5, -.18]].map(([x, z]) => { const q = new THREE.Group(); q.position.set(x, .95, z); cav.add(q); const coxa = box(.14, .45, .14, CM, q, 0, -.22, 0);
  const jo = new THREE.Group(); jo.position.y = -.45; q.add(jo); const can = box(.11, .45, .11, CM, jo, 0, -.22, 0); box(.14, .08, .16, CE, jo, 0, -.46, .01); return { q, jo, ms: [coxa, can] }; });
const CMs = [corpoC, pm, cm, ...pernas.flatMap(p => p.ms)];
// pontos e ossos (linhas) em coordenadas do mundo
const pontosRef = () => { const w = []; const add = (o, x, y, z) => { const v = new THREE.Vector3(x, y, z); o.localToWorld(v); w.push(v); };
  add(cav, -.6, 1.2, 0); add(cav, .55, 1.25, 0); add(pescoco, .15, .65, 0); add(cabeca, .38, 0, 0); pernas.forEach(p => { add(p.q, 0, 0, 0); add(p.jo, 0, 0, 0); add(p.jo, 0, -.48, 0); }); return w; };
const OSSOS = [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [1, 7], [7, 8], [8, 9], [0, 10], [10, 11], [11, 12], [0, 13], [13, 14], [14, 15]];
const esq = new THREE.Group(); S.add(esq); const PT = []; const OS = [];
for (let i = 0; i < 16; i++) { const p = mesh(new THREE.SphereGeometry(.055, 12, 8), E(CIANO, 2.6), esq, 0, 0, 0); p.castShadow = false; PT.push(p); }
for (let i = 0; i < OSSOS.length; i++) { const o = mesh(new THREE.CylinderGeometry(.022, .022, 1, 6), E("#ffffff", 1.6), esq, 0, 0, 0); o.castShadow = false; OS.push(o); }
const Y = new THREE.Vector3(0, 1, 0);
function cavalo(lt, { x = 0, z = 0, ry = 0, galope = 1, solido = 1, esqueleto = 0, brilho = 0 }) { cav.visible = solido > .01; cav.position.set(x, Math.abs(Math.sin(lt * 6 * galope)) * .06, z); cav.rotation.y = ry;
  pernas.forEach((p, i) => { const f = Math.sin(lt * 6 * galope + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0)); p.q.rotation.z = f * .45 * galope; p.jo.rotation.z = Math.max(0, -f) * .7 * galope; });
  pescoco.rotation.z = -.55 + Math.sin(lt * 6 * galope) * .06; cauda.rotation.z = .4 + Math.sin(lt * 8) * .2;
  CMs.forEach(m => { m.material.opacity = solido; }); CM.opacity = solido; CE.opacity = solido; CM.emissive = new THREE.Color(brilho ? CIANO : "#000"); CM.emissiveIntensity = brilho * .25;
  esq.visible = esqueleto > .01; if (!esq.visible) return; cav.updateMatrixWorld(true); const W = pontosRef();
  PT.forEach((p, i) => { if (!W[i]) { p.visible = false; return; } p.visible = true; p.position.copy(W[i]); p.scale.setScalar(esqueleto * (1 + .25 * Math.sin(lt * 9 + i))); });
  OS.forEach((o, i) => { const [a, b] = OSSOS[i]; const A = W[a], B = W[b]; const d = B.clone().sub(A), L = d.length() * esqueleto; o.position.copy(A).addScaledVector(d.normalize(), L / 2); o.scale.set(1, Math.max(.001, L), 1); o.quaternion.setFromUnitVectors(Y, d); }); }

// ---------- mascote: chapéu de safári + câmera de mão + skate (rosto livre) ----------
const chapeu = new THREE.Group(); chapeu.position.set(0, 1.52, 0); MAS.corpo.add(chapeu); mesh(new THREE.CylinderGeometry(.72, .72, .05, 28), M("#d8c08a"), chapeu, 0, 0, 0); mesh(new THREE.CylinderGeometry(.42, .5, .34, 24), M("#d8c08a"), chapeu, 0, .18, 0); mesh(new THREE.CylinderGeometry(.505, .505, .08, 24), M(MAR), chapeu, 0, .08, 0);
chapeu.traverse(o => { o.castShadow = false; }); const camM = new THREE.Group(); MAS.bracos[1].add(camM); box(.34, .26, .42, M("#2b2b33"), camM, .42, .05, .05); mesh(new THREE.CylinderGeometry(.09, .1, .2, 16), M("#111"), camM, .42, .05, .34).rotation.x = Math.PI / 2; const rec = mesh(new THREE.SphereGeometry(.035, 8, 6), E("#ff2a2a", 3), camM, .52, .22, .1);
const skate = new THREE.Group(); S.add(skate); box(1.6, .06, .5, M("#e04b3a"), skate, 0, .14, 0); for (const [x, z] of [[-.55, -.2], [.55, -.2], [-.55, .2], [.55, .2]]) mesh(new THREE.CylinderGeometry(.07, .07, .06, 14), M(AMA), skate, x, .07, z).rotation.x = Math.PI / 2;
function andaSkate(lt, x, z, ry, filmando = 1) { skate.position.set(x, 0, z); skate.rotation.y = ry; skate.rotation.z = Math.sin(lt * 3) * .03; rec.visible = Math.floor(lt * 3) % 2 === 0;
  pose(MAS, { x, z, y: .17 + Math.sin(lt * 3) * .02, ry: ry + (filmando ? .15 : 0), braco: [.5 + Math.sin(lt * 2) * .1, filmando ? .25 : 1.2 + Math.sin(lt * 8) * .3], sq: Math.sin(lt * 6) * .02, piscar: pisca(lt + .5) }); }

// ---------- objetos por cena ----------
const gG = grupo("gancho");
const s1 = grupo("s1"); const quadro = new THREE.Group(); quadro.position.set(1.8, 1.5, -1.4); s1.add(quadro); box(1.7, 1.1, .08, M(PAP), quadro, 0, 0, 0);
const filmeT = ctex(256, 160, (g, w, h, f = 0) => { g.fillStyle = "#ffcf8a"; g.fillRect(0, 0, w, h); g.fillStyle = "#b0703a"; const x = 40 + (f % 20) * 6; g.fillRect(x, 70, 90, 34); g.fillRect(x + 80, 40, 22, 40); for (let i = 0; i < 4; i++) g.fillRect(x + 8 + i * 22, 100, 10, 36 + ((f + i) % 2) * 6); g.fillStyle = "#222"; g.font = "700 18px SG"; g.fillText("VÍDEO DE IA", 10, 24); });
mesh(new THREE.PlaneGeometry(1.5, .9), new THREE.MeshBasicMaterial({ map: filmeT, toneMapped: false }), quadro, 0, 0, .05);
const s2 = grupo("s2"); const tripes = [-1, 1].map(s => { const g = new THREE.Group(); g.position.set(s * 2.0, 0, 1.2); g.lookAt(0, 0, 0); s2.add(g); for (let k = 0; k < 3; k++) { const p = box(.04, 1.2, .04, M("#333"), g, Math.cos(k * 2.1) * .18, .55, Math.sin(k * 2.1) * .18); p.rotation.set(Math.sin(k * 2.1) * .15, 0, -Math.cos(k * 2.1) * .15); } box(.34, .26, .4, M("#2b2b33"), g, 0, 1.25, 0); const l = mesh(new THREE.ConeGeometry(.6, 2.2, 16, 1, true), new THREE.MeshBasicMaterial({ color: CIANO, transparent: true, opacity: .12, depthWrite: false, side: THREE.DoubleSide }), g, 0, 1.25, 1.2); l.rotation.x = -Math.PI / 2; l.castShadow = false; return { g, l }; });
const s3 = grupo("s3"); const pontosV = []; for (let i = 0; i < 30; i++) { const p = mesh(new THREE.SphereGeometry(.04, 8, 6), E(CIANO, 2), s3, 0, 0, 0); p.castShadow = false; pontosV.push({ p, a: rnd() * 6.28, r: 1 + rnd() * 1.5, y: .3 + rnd() * 2.2, v: .2 + rnd() * .4 }); }
const s4 = grupo("s4"); const placas = []; [["JOGO", AMA], ["ANIMAÇÃO", "#ffffff"], ["EFEITOS", "#ff8a3d"]].forEach(([t, c], i) => { const g = new THREE.Group(); s4.add(g); const tx = ctex(320, 120, gg => { gg.fillStyle = c; gg.fillRect(0, 0, 320, 120); gg.strokeStyle = MAR; gg.lineWidth = 8; gg.strokeRect(4, 4, 312, 112); gg.fillStyle = TINTA; gg.font = "700 52px SG"; gg.textAlign = "center"; gg.textBaseline = "middle"; gg.fillText(t, 160, 64); });
  box(.06, 1.2, .06, M(MAR), g, 0, .6, 0); mesh(new THREE.BoxGeometry(1.2, .45, .05), [M(PAP), M(PAP), M(PAP), M(PAP), new THREE.MeshStandardMaterial({ map: tx, roughness: .9 }), M(PAP)], g, 0, 1.35, 0); placas.push(g); });
const cG = grupo("cta"); const pod = new THREE.Group(); pod.position.set(0, 0, -.3); pod.visible = false; cG.add(pod);
for (const [x, h, c] of [[-1.25, .5, "#c9c0b0"], [0, .85, AMA], [1.25, .35, "#d08a4a"]]) { const s = new THREE.Shape(); s.moveTo(-.55, 0); s.lineTo(.55, 0); s.lineTo(.55, h); s.lineTo(-.55, h); const m = recorte(pod, s, c, x, 0, 0, 0, .9); m.position.z = -.45; }
const confs = []; for (let i = 0; i < 50; i++) { const c = mesh(new THREE.PlaneGeometry(.08, .14), M([SAV, AMA, CIANO, "#fff"][i % 4], { side: THREE.DoubleSide }), cG, 0, 0, 0); c.castShadow = false; confs.push({ c, x: (rnd() - .5) * 6, z: -1.4 + rnd() * 2.6, y0: rnd() * 6, v: .7 + rnd() * .6, w: 2 + rnd() * 4 }); }

// ---------- câmera em órbita (rosto do mascote sempre de frente ou 3/4) ----------
const SHOTS = { gancho: [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]] }; ["s1", "s2", "s3", "s4", "cta"].forEach(n => SHOTS[n] = SHOTS.gancho);
const ORB = { gancho: [.05, .4, 7.0, 2.0], s1: [.15, .55, 6.4, 2.1], s2: [-.35, .15, 6.8, 2.5], s3: [.3, -.15, 6.2, 1.8], s4: [-.2, .4, 6.6, 2.2], cta: [-.25, .25, 6.4, 1.7] };
let T = 0; const camera = (cam, nome, lt, d, t) => { T = t; const [a0, a1, r, h] = ORB[nome] || ORB.cta; const a = a0 + (a1 - a0) * eio(lt / d); cam.position.set(Math.sin(a) * r, h + Math.sin(t * .7) * .1, Math.cos(a) * r); cam.lookAt(0, nome === "cta" ? 1.5 : 1.0, 0); };

const ACT = {
  gancho(lt) { andaSkate(lt, -1.7 + eo(lin(lt, 0, 1)) * .4, .4, .2); const e = eio(lin(lt, 1.6, 3.2)); cavalo(lt, { x: .9, z: -.2, ry: .15, solido: 1 - e * .65, esqueleto: e, galope: 1 }); },
  s1(lt) { filmeT.draw(Math.floor(lt * 10)); andaSkate(lt, -2.0, .5, .25); const e = eio(lin(lt, .3, 1.6)); cavalo(lt, { x: .4, z: .1, ry: .1, solido: .35 * (1 - e) + .05, esqueleto: 1, galope: .8 }); },
  s2(lt) { andaSkate(lt, -2.1 + Math.sin(lt * .8) * .15, .9, .35); const e = eio(lin(lt, 1.6, 3.0)); tripes.forEach((T2, i) => { T2.l.material.opacity = .08 + .08 * Math.sin(lt * 6 + i); }); cavalo(lt, { x: .3, z: 0, ry: lt * .6, solido: .1 + e * .9, esqueleto: 1 - e * .6, brilho: e, galope: .6 }); },
  s3(lt) { andaSkate(lt, -2.0, .6, .3, 0); cavalo(lt, { x: .6, z: -.1, ry: .2, solido: .9, esqueleto: .7, galope: 1.1 }); pontosV.forEach(P => P.p.position.set(Math.cos(P.a + lt * P.v) * P.r + .4, P.y + Math.sin(lt * 2 + P.a) * .1, Math.sin(P.a + lt * P.v) * P.r * .5 - .5)); },
  s4(lt) { andaSkate(lt, -2.2, .7, .3); cavalo(lt, { x: -.2 + ((lt * .9) % 3.5), z: -1.6, ry: 0, solido: 1, esqueleto: .5, galope: 1.4 }); placas.forEach((g, i) => { const s = back(lin(lt, .3 + i * .5, .7 + i * .5)); g.position.set(-.3 + i * 1.25, 0, .5 + (i % 2) * -.3); g.scale.setScalar(Math.max(.01, s)); g.rotation.y = -.15 + Math.sin(lt * 2 + i) * .06; }); },
  cta(lt) { skate.visible = true; skate.position.set(0, 0, -.3); skate.rotation.set(0, 0, 0); pose(MAS, { x: 0, z: -.3, y: .17 + hop(lt, .5, .12), braco: [.3, 1.5 + Math.sin(lt * 8) * .25], piscar: pisca(lt) }); rec.visible = false;
    cavalo(lt, { x: 2.0, z: .4, ry: -.6, solido: 0, esqueleto: 1, galope: .5 }); confs.forEach(C => { const y = ((C.y0 - lt * C.v * 2) % 6 + 6) % 6; C.c.position.set(C.x, y, C.z); C.c.rotation.set(lt * C.w, lt * C.w * .6, 0); }); },
};

// ---------- 2D ----------
const CAB = { ult: null, agora: 0 };
const ui = C => { const { X, gl, GW, GH, ITENS, SEGR, CHAVE, blocos } = C;
  const cabe = (t, f, mx, fam = "SG", w = 700) => { while (f > 18) { X.font = `${w} ${f}px ${fam}`; if (X.measureText(t).width <= mx) break; f -= 2; } return f; };
  let TMP = null;
  return {
    fundo(t) { const g = X.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, "#e8542c"); g.addColorStop(.3, "#f6943f"); g.addColorStop(.48, "#ffd27a"); g.addColorStop(1, "#d9a15e"); X.fillStyle = g; X.fillRect(0, 0, 1080, 1920);
      X.fillStyle = "rgba(255,236,170,.9)"; X.beginPath(); X.arc(300, 700, 120, 0, 7); X.fill(); },
    etiqueta() { // página de caderno
      const [l1, l2] = SEGR[0].etiqueta; X.save(); X.translate(505, 375); X.rotate(-.012); X.shadowColor = "rgba(60,30,10,.35)"; X.shadowBlur = 18; X.shadowOffsetY = 6; X.fillStyle = "#fffdf4"; X.fillRect(-445, -100, 890, 200); X.shadowBlur = 0; X.shadowOffsetY = 0;
      X.strokeStyle = "rgba(80,140,220,.35)"; X.lineWidth = 2; for (let y = -62; y < 100; y += 44) { X.beginPath(); X.moveTo(-445, y); X.lineTo(445, y); X.stroke(); } X.strokeStyle = "rgba(220,60,60,.6)"; X.beginPath(); X.moveTo(-370, -100); X.lineTo(-370, 100); X.stroke();
      for (let i = 0; i < 3; i++) { X.fillStyle = "#e9d9b0"; X.beginPath(); X.arc(-412, -55 + i * 55, 11, 0, 7); X.fill(); }
      X.fillStyle = TINTA; X.textAlign = "left"; X.textBaseline = "alphabetic"; cabe(l1, 50, 790); X.fillText(l1, -350, -22); const p = l2.split(" "), n = p[0] + " " + p[1] + " ", r = p.slice(2).join(" ");
      X.font = "700 64px CV"; X.fillStyle = "#d4481c"; X.fillText(n, -350, 64); const w = X.measureText(n).width; X.fillStyle = TINTA; X.fillText(r, -350 + w, 64); X.restore(); },
    cabecalho(s, lt, t) { if (!CAB.agora) { CAB.ult = [s, lt, t]; return; } const { eo, lin, eio } = C; X.save(); X.textBaseline = "middle";
      const bate = lin(lt, .15, .3), sc = lt < .15 ? 0 : 1 + (1 - eo(bate)) * .9; if (sc > 0) { const nm = s.item.toUpperCase(); const fs = cabe(nm, 70, 560); const w = X.measureText(nm).width + 60;
        X.translate(60 + w / 2, 560); X.rotate(-.05); X.scale(sc, sc); X.globalAlpha = Math.min(1, bate * 2.5); X.strokeStyle = "#a8261a"; X.lineWidth = 7; X.strokeRect(-w / 2, -52, w, 104); X.lineWidth = 2; X.strokeRect(-w / 2 + 9, -43, w - 18, 86);
        X.fillStyle = "#a8261a"; X.font = `700 ${fs}px SG`; X.textAlign = "center"; X.fillText(nm, 0, 4); X.globalCompositeOperation = "destination-out"; X.globalAlpha = .25; for (let i = 0; i < 40; i++) X.fillRect(-w / 2 + (i * 53) % w, -48 + (i * 29) % 96, 6, 3); }
      X.restore(); X.globalAlpha = 1;
      const v = Math.round(s.estrelas * eio(lin(lt, .3, 1.6))); X.fillStyle = "rgba(42,26,14,.9)"; X.beginPath(); X.roundRect(60, 634, 560, 92, 14); X.fill();
      X.fillStyle = AMA; X.font = "400 20px PS"; X.textAlign = "left"; X.fillText("HI-SCORE", 84, 662); X.fillStyle = "#d9b98a"; X.font = "700 22px SG"; X.fillText("ESTRELAS NO GITHUB", 84, 700);
      X.fillStyle = lt < 1.6 || Math.floor(t * 5) % 2 ? CIANO : "#fff"; X.font = "700 70px SG"; X.textAlign = "right"; X.fillText(String(v), 600, 682); },
    desenha3D(glc, nome) { const _cab = () => { if (CAB.ult) { CAB.agora = 1; this.cabecalho(...CAB.ult); CAB.agora = 0; CAB.ult = null; } }; if (!TMP) { TMP = document.createElement("canvas"); TMP.width = GW; TMP.height = GH; }
      const g = TMP.getContext("2d"); g.globalCompositeOperation = "source-over"; g.clearRect(0, 0, GW, GH); g.drawImage(glc, 0, 0); g.globalCompositeOperation = "destination-in";
      const m = g.createLinearGradient(0, 0, 0, GH); m.addColorStop(0, "rgba(0,0,0,0)"); m.addColorStop(.12, "#000"); m.addColorStop(.86, "#000"); m.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = m; g.fillRect(0, 0, GW, GH);
      if (nome === "cta") { X.drawImage(TMP, 0, 470); return; } X.drawImage(TMP, 0, 600); _cab(); },
    legenda(seg, t) { // karaokê com marca-texto deslizando
      const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 62; X.font = `700 ${fs}px SG`; const sp = () => X.measureText(" ").width; const tot = () => c.reduce((a, w) => a + X.measureText(w.w).width, 0) + sp() * (c.length - 1); while (tot() > 840 && fs > 34) { fs -= 2; X.font = `700 ${fs}px SG`; }
      const x0 = 505 - tot() / 2, y = 1420; X.fillStyle = "rgba(255,253,244,.94)"; X.beginPath(); X.roundRect(x0 - 30, y - fs * .8, tot() + 60, fs * 1.6, 14); X.fill();
      let x = x0, hx = x0, hw = 0; for (const w of c) { const ww = X.measureText(w.w).width; if (t >= w.t0 - .02) { const p = Math.min(1, (t - w.t0 + .02) / Math.max(.08, w.t1 - w.t0)); hw = x - x0 + ww * p; } x += ww + sp(); }
      X.fillStyle = "rgba(255,214,0,.85)"; X.fillRect(x0 - 6, y - fs * .42, hw + 12, fs * .86);
      x = x0; X.textAlign = "left"; X.textBaseline = "middle"; for (const w of c) { X.fillStyle = TINTA; X.fillText(w.w, x, y + 2); x += X.measureText(w.w).width + sp(); } },
    transicao(lt, s, nome) { // glitch RGB nas trocas de cena
      if (nome === "gancho" || lt > .28) return; const k = 1 - lt / .28, cv = X.canvas;
      X.save(); X.globalCompositeOperation = "lighter"; for (let i = 0; i < 8; i++) { const y = ((i * 241 + Math.floor(lt * 60) * 113) % 1820), h = 30 + (i * 41) % 140, dx = (i % 2 ? 1 : -1) * 46 * k; X.globalAlpha = .5 * k; X.drawImage(cv, 0, y, 1080, h, dx, y, 1080, h); }
      X.globalCompositeOperation = "multiply"; X.globalAlpha = .5 * k; X.fillStyle = "#ff3050"; X.fillRect(0, 0, 1080, 1920 * .5 * (1 - k)); X.fillStyle = "#30e0ff"; X.fillRect(0, 1920 * (1 - .3 * k), 1080, 1920 * .3 * k); X.restore(); },
    fechamento(lt) { const { lin, back, eo } = C; const it = ITENS[0];
      const usos = [["ANIMAÇÃO", 210, 150], ["JOGO", 505, 210], ["EFEITOS", 800, 110]], base = 1250;
      usos.forEach(([t, x, hh], i) => { const a = back(lin(lt, .1 + i * .12, .5 + i * .12)); if (a <= 0) return; const h = hh * a; X.fillStyle = ["#c9c0b0", AMA, "#d08a4a"][i]; X.fillRect(x - 135, base - h, 270, h); X.strokeStyle = MAR; X.lineWidth = 4; X.strokeRect(x - 135, base - h, 270, h);
        X.fillStyle = TINTA; X.font = `700 ${cabe(t, 40, 240)}px SG`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(t, x, base - h + 42); });
      X.save(); X.globalAlpha = lin(lt, .5, .9); X.fillStyle = TINTA; X.font = "700 54px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(`${it.item} · ${it.estrelas} estrelas`, 505, 1300); X.restore();
      const p = eo(lin(lt, .6, 1.0)); X.save(); X.translate(505, 1418); X.scale(.7 + .3 * p, .7 + .3 * p); X.globalAlpha = p; X.fillStyle = "#a8261a"; X.beginPath(); X.roundRect(-380, -54, 760, 108, 20); X.fill();
      X.fillStyle = "#fff"; X.font = "700 72px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore(); X.globalAlpha = 1; },
  }; };
const cores = { LAR: SAV, VERDE: CIANO, FUNDO: "#d9a15e", CREME: "#fffdf4", TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

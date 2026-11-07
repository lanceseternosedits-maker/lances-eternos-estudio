// Reel "3 programas grátis que o Windows devia ter" (08/11 07:00). Identidade: janela de casa (moldura de madeira) que abre
// para vários céus; peitoril com vasinhos; azul-céu + verde-planta + branco-tinta. Elementos: etiqueta de papel rasgado com fita,
// nome escrito à mão, termômetro, legenda de 1 palavra gigante com pop, transição chicote (whip pan), câmera em órbita,
// fechamento com cartões que viram, Bebas Neue. Mascote de luvas de jardinagem, remando num barquinho (rega no gancho).
// Nº 1: um print voa pela janela e as letras saltam dele. Sem logos nem telas de terceiros.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const CEU = "#5db4ef", PLANTA = "#3f9a4c", BRANCO = "#fbf8f0", TINTA = "#1c2a33", MADEIRA = "#8a5a35", PAREDE = "#ece4d4", TERRA = "#c8693c";
rim.color.set(0xfff4e0); rim.intensity = 1.2; key.color.set(0xfff6ea); key.intensity = 95; key.position.set(-1, 8, 6); key.target.position.set(.4, 1.4, -1);

// ---------- cenário: parede, janela de madeira, peitoril com vasos ----------
const casa = new THREE.Group(); S.add(casa);
const WX = .7, WY = 2.1, WW = 2.4, WH = 2.0, ZW = -1.6;   // vão da janela
const paredeM = M(PAREDE, { roughness: .9 });
box(20, 10, .3, paredeM, casa, 0, 5 + WY + WH / 2, ZW).position.y = WY + WH / 2 + 5;          // acima
box(20, WY - WH / 2, .3, paredeM, casa, 0, (WY - WH / 2) / 2, ZW);                             // abaixo
box(10, WH, .3, paredeM, casa, WX - WW / 2 - 5, WY, ZW); box(10, WH, .3, paredeM, casa, WX + WW / 2 + 5, WY, ZW);
const rodape = box(20, .25, .06, M(BRANCO), casa, 0, .12, ZW + .17);
const pisoT = ctex(512, 512, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#b98957" : "#c4955f"; g.fillRect(0, i * 64, w, 64); g.fillStyle = "rgba(60,30,10,.25)"; g.fillRect(0, i * 64, w, 2); g.fillRect(((i * 197) % 400) + 40, i * 64, 2, 64); } });
pisoT.wrapS = pisoT.wrapT = THREE.RepeatWrapping; pisoT.repeat.set(4, 3);
const piso = mesh(new THREE.PlaneGeometry(20, 10), new THREE.MeshStandardMaterial({ map: pisoT, roughness: .6 }), casa, 0, 0, 2); piso.rotation.x = -Math.PI / 2;
const madM = M(MADEIRA, { roughness: .6 });
box(WW + .3, .16, .36, madM, casa, WX, WY + WH / 2 + .05, ZW + .05); box(.16, WH + .2, .36, madM, casa, WX - WW / 2 - .05, WY, ZW + .05); box(.16, WH + .2, .36, madM, casa, WX + WW / 2 + .05, WY, ZW + .05);
const peitoril = box(WW + .7, .12, .7, madM, casa, WX, WY - WH / 2 - .02, ZW + .3);
// céu atrás da janela (troca a cada cena)
const ceuT = ctex(640, 400, (g, w, h, tipo = "cinza", t = 0) => {
  const P = { cinza: ["#7d8794", "#b4bcc4"], azul: ["#2f8fe0", "#a9dcff"], aurora: ["#f08a5d", "#ffd59a"], dia: ["#3a9be8", "#d3efff"], por: ["#5b3c8f", "#f39a6b"], noite: ["#0e1a3a", "#3b4f86"], arco: ["#46a8f0", "#e6f6ff"] }[tipo] || [ "#7d8794", "#b4bcc4" ];
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, P[0]); gr.addColorStop(1, P[1]); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  if (tipo === "azul" || tipo === "dia" || tipo === "arco") { g.fillStyle = "#fff3b0"; g.beginPath(); g.arc(w * .78, h * .26, 46, 0, 7); g.fill(); g.fillStyle = "rgba(255,240,170,.35)"; g.beginPath(); g.arc(w * .78, h * .26, 74, 0, 7); g.fill(); }
  if (tipo === "aurora") { g.fillStyle = "#ffe9a8"; g.beginPath(); g.arc(w * .3, h * .95, 90, 0, 7); g.fill(); }
  if (tipo === "por") { g.fillStyle = "#ffcf7a"; g.beginPath(); g.arc(w * .65, h * .9, 70, 0, 7); g.fill(); }
  if (tipo === "noite" || tipo === "por") { g.fillStyle = "#fff"; for (let i = 0; i < 40; i++) { const s = 1 + (i % 3); g.globalAlpha = .4 + .6 * Math.abs(Math.sin(t * 2 + i)); g.fillRect((i * 151) % w, (i * 83) % (h * .6), s, s); } g.globalAlpha = 1; }
  if (tipo === "arco") ["#ff6b6b", "#ffb04a", "#ffe066", "#6fd17a", "#5db4ef", "#8f7bff"].forEach((c, i) => { g.strokeStyle = c; g.lineWidth = 14; g.beginPath(); g.arc(w * .45, h * 1.15, 300 - i * 14, Math.PI, 0); g.stroke(); });
  if (tipo !== "noite") { g.fillStyle = tipo === "cinza" ? "rgba(90,98,108,.8)" : "rgba(255,255,255,.92)"; for (let i = 0; i < 4; i++) { const x = ((i * 190 + t * 22) % (w + 200)) - 100, y = 60 + (i * 67) % 160; for (const [dx, dy, r] of [[0, 0, 34], [30, -12, 40], [64, 0, 32], [32, 10, 34]]) { g.beginPath(); g.arc(x + dx, y + dy, r, 0, 7); g.fill(); } } }
  if (tipo === "cinza") { g.strokeStyle = "rgba(220,230,240,.55)"; g.lineWidth = 2; for (let i = 0; i < 60; i++) { const x = (i * 53 + t * 40) % w, y = (i * 97 + t * 600) % h; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 6, y + 22); g.stroke(); } }
});
const ceu = mesh(new THREE.PlaneGeometry(7, 4.4), new THREE.MeshBasicMaterial({ map: ceuT, toneMapped: false }), casa, WX, WY + .3, ZW - 1.2); ceu.castShadow = ceu.receiveShadow = false;
let ceuAtual = ""; const pintaCeu = (tipo, t) => { ceuT.draw(tipo, t); ceuAtual = tipo; };
// folhas da janela (abrem para dentro, presas nas laterais)
const folhas = [-1, 1].map(s => { const piv = new THREE.Group(); piv.position.set(WX + s * WW / 2, WY, ZW + .1); casa.add(piv); const f = new THREE.Group(); f.position.x = -s * WW / 4; piv.add(f);
  const fw = WW / 2, fh = WH; box(fw, .1, .08, M(BRANCO), f, 0, fh / 2 - .05, 0); box(fw, .1, .08, M(BRANCO), f, 0, -fh / 2 + .05, 0); box(.1, fh, .08, M(BRANCO), f, fw / 2 - .05, 0, 0); box(.1, fh, .08, M(BRANCO), f, -fw / 2 + .05, 0, 0); box(fw, .06, .06, M(BRANCO), f, 0, 0, 0);
  const vid = mesh(new THREE.PlaneGeometry(fw - .1, fh - .1), new THREE.MeshStandardMaterial({ color: "#cfe8ff", transparent: true, opacity: .22, roughness: .05, metalness: .2 }), f, 0, 0, 0); vid.castShadow = false;
  box(.06, .06, .14, M("#c9a64a", { metalness: .8, roughness: .3 }), f, -s * (fw / 2 - .18) * -1, 0, .08); return { piv, s }; });
const abre = a => folhas.forEach(F => F.piv.rotation.y = F.s * a * 1.75);
// vasinhos no peitoril
const vasos = [-.85, 0, .85].map((dx, i) => { const v = new THREE.Group(); v.position.set(WX + dx, WY - WH / 2 + .04, ZW + .38); casa.add(v); mesh(new THREE.CylinderGeometry(.2, .15, .32, 16), M(TERRA), v, 0, .16, 0);
  mesh(new THREE.CylinderGeometry(.21, .21, .06, 16), M("#b25a30"), v, 0, .32, 0); for (let k = 0; k < 5; k++) { const f = mesh(new THREE.SphereGeometry(.12, 8, 6), M(PLANTA, { flatShading: true }), v, Math.cos(k * 1.3) * .1, .42 + (k % 2) * .08, Math.sin(k * 1.3) * .08); f.scale.set(1, 1.4, .7); }
  const flor = new THREE.Group(); flor.position.y = .62; v.add(flor); for (let p = 0; p < 5; p++) mesh(new THREE.SphereGeometry(.07, 8, 6), M(["#ff7aa2", "#ffd23f", "#ffffff"][i]), flor, Math.cos(p * 1.256) * .08, 0, Math.sin(p * 1.256) * .08); mesh(new THREE.SphereGeometry(.05, 8, 6), M("#ffb000"), flor, 0, .02, 0); return { v, flor }; });

// ---------- mascote: luvas de jardinagem, num barquinho, remando ----------
for (const b of MAS.bracos) { const s = b.position.x > 0 ? 1 : -1; mesh(new THREE.SphereGeometry(.15, 12, 10), M(PLANTA, { roughness: .8 }), b, s * .36, 0, 0).scale.set(1.1, .9, 1.1); box(.08, .2, .26, M("#2f7a3a"), b, s * .27, 0, 0); }
const barco = new THREE.Group(); S.add(barco); const cascoM = M("#a0663a", { roughness: .7 });
box(2.0, .3, 1.1, cascoM, barco, 0, .2, 0); box(2.1, .1, .12, M("#7a4a28"), barco, 0, .38, .55); box(2.1, .1, .12, M("#7a4a28"), barco, 0, .38, -.55); box(.12, .1, 1.2, M("#7a4a28"), barco, 1.03, .38, 0); box(.12, .1, 1.2, M("#7a4a28"), barco, -1.03, .38, 0);
box(1.6, .06, .04, M("#ffffff"), barco, 0, .27, .555);
const agua = mesh(new THREE.CircleGeometry(1.6, 40), M("#4aa6e0", { roughness: .2, metalness: .1 }), S, 0, .015, 0); agua.rotation.x = -Math.PI / 2; agua.scale.set(1.4, .9, 1); agua.castShadow = false;
const ondas = [0, 1, 2].map(() => { const o = mesh(new THREE.TorusGeometry(1, .02, 6, 48), M("#d8f1ff", { emissive: "#d8f1ff", emissiveIntensity: .3 }), S, 0, .03, 0); o.rotation.x = Math.PI / 2; o.castShadow = false; return o; });
const remo = new THREE.Group(); S.add(remo); const haste = new THREE.Group(); remo.add(haste); mesh(new THREE.CylinderGeometry(.04, .04, 1.9, 8), M("#d9b07a"), haste, 0, -.6, 0); box(.26, .5, .05, M("#d9b07a"), haste, 0, -1.55, 0); box(.06, .2, .06, M("#2f7a3a"), haste, 0, .3, 0);
const BX = -1.15, BZ = .35;
function rema(lt, forte = 1) { const c = lt * 4.2, s = Math.sin(c); barco.position.set(BX, Math.sin(lt * 3) * .03, BZ); barco.rotation.set(Math.sin(lt * 2.3) * .03, .15, Math.sin(lt * 3) * .04);
  agua.position.set(BX, .015, BZ); ondas.forEach((o, i) => { const k = (lt * .5 + i / 3) % 1; o.position.set(BX, .03, BZ); o.scale.set(1.1 + k * 1.2, 1.1 + k * .8, 1); o.material.opacity = 1 - k; o.material.transparent = true; });
  pose(MAS, { x: BX, z: BZ, y: .28 + Math.sin(lt * 3) * .03, ry: .3, braco: [.2 + s * .25 * forte, 1.0 + s * .45 * forte], piscar: pisca(lt), sq: Math.abs(s) * .03 });
  MAS.corpo.rotation.x = s * .06; remo.visible = true; remo.position.set(BX + .95, 1.25 + s * .05, BZ + .15); haste.rotation.set(s * .55, 0, -.25 + Math.cos(c) * .1); }

// ---------- gancho: chuva cinza e janela fechada; as folhas abrem, o céu fica azul e o mascote rega as flores ----------
const gG = grupo("gancho");
const regador = new THREE.Group(); gG.add(regador); mesh(new THREE.CylinderGeometry(.22, .25, .4, 16), M("#5fb0e6", { metalness: .4, roughness: .3 }), regador, 0, 0, 0);
const bico = mesh(new THREE.CylinderGeometry(.03, .05, .6, 8), M("#5fb0e6", { metalness: .4 }), regador, .32, .12, 0); bico.rotation.z = -1.0; mesh(new THREE.TorusGeometry(.15, .03, 6, 16, Math.PI), M("#3d8cc4"), regador, -.05, .25, 0);
const gotas = []; for (let i = 0; i < 18; i++) { const g = mesh(new THREE.SphereGeometry(.03, 6, 4), E("#9fdcff", .6), gG, 0, 0, 0); g.castShadow = false; gotas.push({ g, ph: rnd() }); }

// ---------- itens ----------
// nº 3 Prism: 32 conexões = chuva de blocos azuis em faixas paralelas entrando pela janela e enchendo um pote
const n3 = grupo("n3"); const pote = new THREE.Group(); pote.position.set(WX + .2, WY - WH / 2 + .06, ZW + .55); n3.add(pote);
mesh(new THREE.CylinderGeometry(.42, .38, .9, 24, 1, true), new THREE.MeshStandardMaterial({ color: "#e8f6ff", transparent: true, opacity: .35, side: THREE.DoubleSide, roughness: .1 }), pote, 0, .45, 0).castShadow = false;
const liq = mesh(new THREE.CylinderGeometry(.37, .35, 1, 24), E("#3aa0ff", .5), pote, 0, 0, 0); mesh(new THREE.TorusGeometry(.42, .03, 6, 24), M(BRANCO), pote, 0, .9, 0).rotation.x = Math.PI / 2;
const blocos = []; for (let i = 0; i < 32; i++) { const b = mesh(new THREE.BoxGeometry(.07, .16, .07), E(["#3aa0ff", "#7ad0ff", "#ffffff"][i % 3], 1.2), n3, 0, 0, 0); b.castShadow = false; blocos.push({ b, faixa: i % 8, ph: (i * .37) % 1 }); }
// nº 2 WinShun: duas teclas Ctrl batem, a lupa passa pelos papéis que entram voando e um deles acende
const n2 = grupo("n2"); const tecT = ctex(256, 192, g => { g.fillStyle = "#f7f4ec"; g.fillRect(0, 0, 256, 192); g.fillStyle = TINTA; g.font = "400 110px BB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("CTRL", 128, 104); });
const teclas = [0, 1].map(i => { const k = new THREE.Group(); k.position.set(WX - .5 + i * 1.0, WY - WH / 2 + .1, ZW + .55); n2.add(k); box(.8, .3, .6, M("#d9d4c8"), k, 0, .15, 0);
  const top = mesh(new THREE.PlaneGeometry(.7, .5), new THREE.MeshStandardMaterial({ map: tecT }), k, 0, .305, 0); top.rotation.x = -Math.PI / 2; return k; });
const papT = ctex(128, 160, (g, w, h, acesa = 0) => { g.fillStyle = acesa ? "#fff8c4" : "#ffffff"; g.fillRect(0, 0, w, h); g.fillStyle = acesa ? "#e0a800" : "#9aa7b3"; for (let k = 0; k < 7; k++) g.fillRect(14, 22 + k * 18, 70 + (k * 23) % 30, 8); });
const papAceso = ctex(128, 160, (g, w, h) => { g.fillStyle = "#fff8c4"; g.fillRect(0, 0, w, h); g.fillStyle = "#e0a800"; for (let k = 0; k < 7; k++) g.fillRect(14, 22 + k * 18, 70 + (k * 23) % 30, 8); g.fillStyle = "rgba(255,210,63,.8)"; g.fillRect(10, 72, 108, 16); });
const papeis = []; for (let i = 0; i < 9; i++) { const p = mesh(new THREE.PlaneGeometry(.4, .5), new THREE.MeshBasicMaterial({ map: i === 4 ? papAceso : papT, side: THREE.DoubleSide, toneMapped: false }), n2, 0, 0, 0); p.castShadow = false; papeis.push(p); }
const lupa = new THREE.Group(); n2.add(lupa); mesh(new THREE.TorusGeometry(.34, .06, 10, 32), M(TINTA, { metalness: .4 }), lupa, 0, 0, 0); const lente = mesh(new THREE.CircleGeometry(.32, 32), new THREE.MeshStandardMaterial({ color: "#cfe8ff", transparent: true, opacity: .3 }), lupa, 0, 0, 0); lente.castShadow = false;
mesh(new THREE.CylinderGeometry(.06, .07, .6, 10), M(MADEIRA), lupa, .38, -.38, 0).rotation.z = Math.PI / 4;
// nº 1 kensaku: um print voa pela janela e as letras saltam dele para uma barra de busca
const n1 = grupo("n1"); const printT = ctex(256, 440, g => { g.fillStyle = "#f4f6f8"; g.fillRect(0, 0, 256, 440); g.fillStyle = "#3f9a4c"; g.fillRect(0, 0, 256, 50); g.fillStyle = "#fff"; g.font = "400 30px BB"; g.fillText("COMPROVANTE", 18, 36);
  g.fillStyle = "#c9d2da"; for (let k = 0; k < 4; k++) g.fillRect(18, 80 + k * 30, 150 + (k * 37) % 60, 12); g.fillStyle = TINTA; g.font = "400 64px BB"; g.fillText("RECIBO", 40, 270); g.fillStyle = "#c9d2da"; for (let k = 0; k < 4; k++) g.fillRect(18, 310 + k * 28, 120 + (k * 51) % 90, 12); });
const print = new THREE.Group(); n1.add(print); box(.9, 1.5, .04, M("#222"), print, 0, 0, -.03); mesh(new THREE.PlaneGeometry(.84, 1.44), new THREE.MeshBasicMaterial({ map: printT, toneMapped: false }), print, 0, 0, 0).castShadow = false;
const letras = "RECIBO".split("").map(ch => { const t = ctex(96, 96, g => { g.fillStyle = "#ffd23f"; g.beginPath(); g.roundRect(4, 4, 88, 88, 14); g.fill(); g.fillStyle = TINTA; g.font = "400 80px BB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(ch, 48, 54); });
  const m = mesh(new THREE.BoxGeometry(.3, .3, .06), [M("#e0b020"), M("#e0b020"), M("#e0b020"), M("#e0b020"), new THREE.MeshBasicMaterial({ map: t, toneMapped: false }), M("#e0b020")], n1, 0, 0, 0); return m; });
const buscaT = ctex(512, 96, g => { g.fillStyle = "#ffffff"; g.beginPath(); g.roundRect(4, 4, 504, 88, 44); g.fill(); g.strokeStyle = TINTA; g.lineWidth = 6; g.beginPath(); g.arc(52, 44, 20, 0, 7); g.stroke(); g.beginPath(); g.moveTo(66, 60); g.lineTo(84, 78); g.stroke(); });
const busca = mesh(new THREE.PlaneGeometry(2.5, .48), new THREE.MeshBasicMaterial({ map: buscaT, transparent: true, toneMapped: false }), n1, 0, 0, 0); busca.castShadow = false;
const brilhos = []; for (let i = 0; i < 20; i++) { const b = mesh(new THREE.OctahedronGeometry(.05), E("#fff3a0", 2.5), n1, 0, 0, 0); b.castShadow = false; brilhos.push({ b, a: rnd() * 6.28, r: .4 + rnd() * .9 }); }

// ---------- fechamento: pétalas caindo, céu com arco-íris ----------
const cG = grupo("cta"); const petalas = [];
for (let i = 0; i < 50; i++) { const p = mesh(new THREE.CircleGeometry(.06, 8), M(["#ff7aa2", "#ffd23f", "#ffffff", PLANTA][i % 4], { side: THREE.DoubleSide }), cG, 0, 0, 0); p.castShadow = false; p.scale.y = 1.6; petalas.push({ p, x: (rnd() - .5) * 6, z: -1 + rnd() * 2.5, y0: rnd() * 5, v: .5 + rnd() * .5, w: 1 + rnd() * 3 }); }

// ---------- câmera: órbita lenta em volta da janela; chicote (whip pan) na entrada de cada item ----------
const SHOTS = {}; ["gancho", "n3", "n2", "n1", "cta"].forEach(n => SHOTS[n] = [[V(0, 2, 6), V(.2, 1.6, 0)], [V(0, 2, 6), V(.2, 1.6, 0)]]);
const ALVO = [.25, 1.75, -.6];
const camera = (cam, nome, lt, d, t) => { const dir = nome === "n2" ? -1 : 1, a = dir * (-.28 + (lt / d) * .56), chicote = ["n3", "n2", "n1"].includes(nome) ? (1 - eo(lin(lt, 0, .32))) * 1.3 * -dir : 0, r = 7.1;
  cam.position.set(ALVO[0] + Math.sin(a + chicote) * r, 2.3 + Math.sin(t * .7) * .08, ALVO[2] + Math.cos(a + chicote) * r); cam.lookAt(ALVO[0] + chicote * 1.5, ALVO[1], ALVO[2]); };

const ACT = {
  gancho(lt, d) { remo.visible = false; const ab = eio(lin(lt, 1.2, 2.0)); abre(ab); pintaCeu(ab < .3 ? "cinza" : "azul", lt);
    pose(MAS, { x: BX, z: BZ, y: .28, ry: .35, braco: [.3, ab > .2 ? 1.0 : .4], piscar: pisca(lt), sq: lt < .25 ? .1 : 0 }); barco.position.set(BX, 0, BZ); barco.rotation.set(0, .15, Math.sin(lt * 3) * .03); agua.position.set(BX, .015, BZ);
    ondas.forEach((o, i) => { const k = (lt * .4 + i / 3) % 1; o.position.set(BX, .03, BZ); o.scale.set(1.1 + k, 1.1 + k * .7, 1); });
    const w = new THREE.Vector3(); MAS.bracos[1].children[0].getWorldPosition(w); const inc = eio(lin(lt, 2.0, 2.4)); regador.position.set(w.x + .35, w.y + .05, w.z + .1); regador.rotation.set(0, .3, -inc * .7);
    const bx = regador.position.x + .55, by = regador.position.y - .05; gotas.forEach(G => { const k = (lt * 1.6 + G.ph) % 1; G.g.visible = inc > .5; G.g.position.set(bx + k * .9, by - k * k * .7, regador.position.z - k * .5); });
    vasos.forEach((V, i) => { const s = back(lin(lt, 2.6 + i * .3, 3.1 + i * .3)); V.flor.scale.setScalar(Math.max(.01, s)); });
    return lt < .8 ? .006 : 0; },
  n3(lt, d) { abre(1); pintaCeu("aurora", lt); rema(lt); vasos.forEach(V => V.flor.scale.setScalar(1)); const f = eio(lin(lt, .4, d * .9)); liq.scale.y = Math.max(.02, f * .85); liq.position.y = f * .85 / 2 + .02;
    blocos.forEach(B => { const k = (lt * 1.3 + B.ph) % 1, x = WX - .9 + B.faixa * .26, xe = pote.position.x + (B.faixa - 3.5) * .05; B.b.position.set(x + (xe - x) * k * k, WY + .9 - k * 2.0, ZW - .9 + k * 1.45); B.b.visible = lt > .3 && k < .95; }); },
  n2(lt, d) { abre(1); pintaCeu("dia", lt); rema(lt, .8); vasos.forEach(V => V.flor.scale.setScalar(0.01));
    teclas.forEach((k, i) => { const bate = [.5, .85, 1.05, 1.4].some(tt => lt > tt && lt < tt + .12); k.position.y = WY - WH / 2 + .1 - (bate ? .1 : 0); k.scale.setScalar(back(lin(lt, .1 + i * .1, .45 + i * .1)) || .01); });
    const sai = eo(lin(lt, 1.4, 2.4)); papeis.forEach((p, i) => { const a = i / 9 * 6.28 + lt * .7, r = .9 + (i % 3) * .2; p.position.set(WX + Math.cos(a) * r * sai, WY + .2 + Math.sin(a * 1.3) * .5 * sai, ZW + .2 + sai * (.8 + Math.sin(a) * .4)); p.rotation.set(Math.sin(a) * .3, a * .5, Math.cos(a) * .2); p.scale.setScalar(Math.max(.01, sai)); });
    const achou = lin(lt, 3.2, 3.8), alvo = papeis[4].position; lupa.visible = lt > 2.0; const la = lt * 1.8;
    lupa.position.set(WX + Math.cos(la) * .8 * (1 - achou) + alvo.x * achou - WX * achou, WY + .3 + Math.sin(la) * .4 * (1 - achou) + (alvo.y - WY - .3) * achou, ZW + 1.2 + (alvo.z + .15 - ZW - 1.2) * achou); lupa.lookAt(cam.position);
    papeis[4].scale.setScalar(Math.max(.01, sai) * (1 + achou * .5)); },
  n1(lt, d) { abre(1); pintaCeu("por", lt); rema(lt, .6); const voa = eio(lin(lt, .15, 1.1)), sl = lin(lt, 1.3, 2.6);
    print.position.set(WX + .2 - voa * .1, WY + 1.4 - voa * 1.3 + Math.sin(lt * 2) * .04, ZW - 1 + voa * 2.0); print.rotation.set((1 - voa) * -1.2, (1 - voa) * 2.5 + Math.sin(lt) * .08, (1 - voa) * .5); print.scale.setScalar(.4 + voa * .6);
    busca.position.set(WX + .15, WY + 1.15, ZW + 1.5); busca.scale.setScalar(Math.max(.01, back(lin(lt, 1.0, 1.4)))); busca.lookAt(cam.position);
    letras.forEach((L, i) => { const k = eio(lin(sl, i * .1, i * .1 + .45)), x0 = print.position.x - .25 + (i % 3) * .2, y0 = print.position.y - .15, x1 = busca.position.x - .55 + i * .33, y1 = busca.position.y, z0 = print.position.z + .1, z1 = busca.position.z + .05;
      L.position.set(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k + Math.sin(k * Math.PI) * .7, z0 + (z1 - z0) * k); L.rotation.set(0, (1 - k) * 6.28, Math.sin(k * Math.PI) * .6); L.scale.setScalar(Math.max(.01, lin(sl, i * .1, i * .1 + .08)) * (1 + Math.sin(k * Math.PI) * .3)); L.lookAt(cam.position); L.rotateY(0); });
    brilhos.forEach(B => { const k = lin(lt, 2.4, 3.4); B.b.visible = k > 0 && k < 1; B.b.position.set(busca.position.x + Math.cos(B.a) * B.r * (.5 + k), busca.position.y + Math.sin(B.a) * B.r * .6 * (.5 + k), busca.position.z + .1); B.b.rotation.y = lt * 4; }); },
  cta(lt, d) { abre(1); pintaCeu("arco", lt); vasos.forEach(V => V.flor.scale.setScalar(1)); rema(lt * .3, .2); pose(MAS, { x: BX, z: BZ, y: .28 + hop(lt, .5, .08), ry: .25, braco: [.3, 2.0 + Math.sin(lt * 9) * .45], piscar: pisca(lt) }); remo.visible = false;
    petalas.forEach(P => { const y = ((P.y0 - lt * P.v) % 5 + 5) % 5; P.p.position.set(P.x + Math.sin(lt * 1.5 + P.w) * .3, y, P.z); P.p.rotation.set(lt * P.w, lt * P.w * .6, 0); }); },
};

// ---------- elementos de tela (2D): tudo entre y=260 e y=1500, nada a menos de 130 px da direita ----------
const ui = C => { const { X, gl, GW, GH, ITENS, MAXE, eo, lin, eio, back, SEGR, CHAVE } = C;
  const rasgado = (x, y, w, h, cor, sd) => { X.fillStyle = cor; X.beginPath(); X.moveTo(x, y); let s = sd; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i <= 24; i++) X.lineTo(x + w * i / 24, y + (r() - .5) * 14); for (let i = 0; i <= 16; i++) X.lineTo(x + w + (r() - .5) * 10, y + h * i / 16); for (let i = 24; i >= 0; i--) X.lineTo(x + w * i / 24, y + h + (r() - .5) * 14); X.closePath(); X.fill(); };
  const fita = (x, y, w, a) => { X.save(); X.translate(x, y); X.rotate(a); X.fillStyle = "rgba(255,248,214,.88)"; X.fillRect(-w / 2, -20, w, 40); X.fillStyle = "rgba(0,0,0,.05)"; for (let i = -w / 2; i < w / 2; i += 10) X.fillRect(i, -20, 2, 40); X.restore(); };
  const cabe = (t, f, mx, fam, peso = 400) => { while (f > 20) { X.font = `${peso} ${f}px ${fam}`; if (X.measureText(t).width <= mx) break; f -= 2; } return f; };
  const fmtP = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const GY3 = 540; let CAB = null; const U = {};
  return Object.assign(U, {
    fundo(t) { X.fillStyle = PAREDE; X.fillRect(0, 0, 1080, 1920); X.fillStyle = "rgba(63,154,76,.06)"; for (let x = 0; x < 1080; x += 54) X.fillRect(x, 0, 22, 1920);
      for (let i = 0; i < 9; i++) { X.fillStyle = i % 2 ? "#b98957" : "#c4955f"; X.fillRect(0, 1380 + i * 64, 1080, 64); X.fillStyle = "rgba(60,30,10,.25)"; X.fillRect(0, 1380 + i * 64, 1080, 2); } },
    desenha3D(g, nome) { X.drawImage(g, 0, GY3); const fg = X.createLinearGradient(0, GY3, 0, GY3 + 50); fg.addColorStop(0, PAREDE); fg.addColorStop(1, "rgba(236,228,212,0)"); X.fillStyle = fg; X.fillRect(0, GY3, 1080, 50);
      const fp = X.createLinearGradient(0, GY3 + GH, 0, GY3 + GH - 60); fp.addColorStop(0, "#bf8f5a"); fp.addColorStop(1, "rgba(191,143,90,0)"); X.fillStyle = fp; X.fillRect(0, GY3 + GH - 60, 1080, 60);
      if (CAB && nome !== "gancho" && nome !== "cta") U.cab2(...CAB); CAB = null; },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta, b = nome === "gancho" ? back(lin(t, 0, .45)) : 1;
      X.save(); X.translate(530, 410); X.rotate(-.02); X.scale(b, b); X.shadowColor = "rgba(0,0,0,.22)"; X.shadowBlur = 16; X.shadowOffsetY = 7; rasgado(-445, -118, 890, 236, BRANCO, 11); X.shadowColor = "transparent";
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(l1, 74, 840, "BB"); X.fillText(l1, 0, -36); X.fillStyle = "#1f78c8"; cabe(l2, 62, 840, "BB"); X.fillText(l2, 0, 26);
      X.fillStyle = PLANTA; cabe(l3, 62, 840, "BB"); X.fillText(l3, 0, 90); X.restore(); fita(115, 305, 150, -.55); fita(945, 305, 150, .55); },
    cabecalho(s, lt, t) { CAB = [s, lt, t]; },
    cab2(s, lt, t) { // nome escrito à mão (traço revelando com lápis) + termômetro
      const y = 620, p = eio(lin(lt, .12, .9)); X.save(); X.fillStyle = TINTA; X.beginPath(); X.arc(112, y - 8, 46, 0, 7); X.fill(); X.fillStyle = "#ffd23f"; X.font = "400 58px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag, 112, y - 4);
      X.font = "700 104px CV"; X.textAlign = "left"; const nm = s.item, w = X.measureText(nm).width; X.beginPath(); X.rect(176, y - 90, w * p + 6, 160); X.clip(); X.fillStyle = TINTA; X.fillText(nm, 180, y + 10); X.restore();
      if (p < 1) { const px = 180 + w * p, py = y + 6 + Math.sin(lt * 40) * 10; X.save(); X.translate(px, py); X.rotate(-.7); X.fillStyle = "#f2c230"; X.fillRect(-8, -80, 16, 70); X.fillStyle = "#e8c9a0"; X.beginPath(); X.moveTo(-8, -10); X.lineTo(8, -10); X.lineTo(0, 8); X.fill(); X.restore(); }
      X.fillStyle = PLANTA; X.fillRect(182, y + 38, w * p, 5);
      // termômetro (tubo de 590 a 960, bulbo em 1000), mercúrio sobe até estrelas/MAXE
      const tx = 890, top = 600, bot = 960, v = s.estrelas * eio(lin(lt, .35, 1.9)), h = (bot - top) * v / MAXE * .92;
      X.fillStyle = "#ffffff"; X.strokeStyle = TINTA; X.lineWidth = 6; X.beginPath(); X.roundRect(tx - 24, top - 10, 48, bot - top + 30, 24); X.fill(); X.stroke(); X.beginPath(); X.arc(tx, bot + 42, 42, 0, 7); X.fill(); X.stroke();
      X.fillStyle = "#e5483a"; X.beginPath(); X.arc(tx, bot + 42, 32, 0, 7); X.fill(); X.fillRect(tx - 12, bot + 20 - h, 24, h + 10);
      X.fillStyle = TINTA; for (let i = 0; i <= 8; i++) X.fillRect(tx - 24, top + 8 + i * (bot - top - 8) / 8, 12, 3);
      X.textAlign = "left"; X.textBaseline = "middle"; X.font = "400 76px BB"; X.lineWidth = 10; X.strokeStyle = PAREDE; X.strokeText(fmtP(v) + " ★", 74, 720); X.fillStyle = "#c0392b"; X.fillText(fmtP(v) + " ★", 74, 720);
      X.font = "400 32px BB"; X.fillStyle = TINTA; X.fillText("ESTRELAS NO GITHUB", 76, 774); },
    legenda(seg, t) { // uma palavra gigante por vez, com pop
      let w = seg.palavras.find(p => t >= p.t0 - .02 && t < p.t1 + .02) || seg.palavras.filter(p => t >= p.t0).pop(); if (!w) return; const k = lin(t, w.t0, w.t0 + .14), sc = .6 + .4 * back(k);
      const txt = w.w.replace(/[.,:;!?…]+$/, "").toUpperCase(); X.save(); X.translate(540, 1415); X.rotate(Math.sin(w.t0 * 13) * .04); X.scale(sc, sc); let fs = 150; X.font = `400 ${fs}px BB`; while (X.measureText(txt).width > 820 && fs > 60) { fs -= 6; X.font = `400 ${fs}px BB`; }
      X.textAlign = "center"; X.textBaseline = "middle"; X.lineWidth = 18; X.strokeStyle = TINTA; X.lineJoin = "round"; X.strokeText(txt, 0, 4); X.fillStyle = txt === CHAVE ? "#ffd23f" : /\d/.test(txt) ? "#7fd0ff" : BRANCO; X.fillText(txt, 0, 4); X.restore(); },
    transicao(lt, s) { if (!s.item || lt > .3) return; const k = 1 - lt / .3, cv = X.canvas; // chicote: rastro horizontal borrado
      X.save(); for (let i = 1; i <= 6; i++) { X.globalAlpha = .22 * k; X.drawImage(cv, i * 70 * k, 0); X.drawImage(cv, -i * 50 * k, 0); } X.globalAlpha = .5 * k; X.fillStyle = "#ffffff";
      for (let i = 0; i < 14; i++) X.fillRect(0, 300 + (i * 97) % 1200, 1080, 4 + (i % 3) * 3); X.restore(); },
    fechamento(lt) { // cartões que viram
      ITENS.forEach((s, i) => { const x = 70 + i * 305 + 142, y = 760, p = lin(lt, .15 + i * .22, .55 + i * .22), sx = Math.abs(Math.cos(p * Math.PI)), frente = p >= .5;
        X.save(); X.translate(x, y + Math.sin(p * Math.PI) * -24); X.scale(Math.max(.02, sx), 1); X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 18; X.shadowOffsetY = 8;
        X.fillStyle = frente ? BRANCO : ["#1f78c8", PLANTA, "#e5483a"][i]; X.beginPath(); X.roundRect(-142, -190, 284, 380, 22); X.fill(); X.shadowColor = "transparent"; X.textAlign = "center"; X.textBaseline = "middle";
        if (!frente) { X.fillStyle = "rgba(255,255,255,.9)"; X.font = "400 150px BB"; X.fillText("?", 0, 10); }
        else { X.fillStyle = ["#1f78c8", PLANTA, "#e5483a"][i]; X.font = "400 76px BB"; X.fillText(s.tag, 0, -110); X.fillStyle = TINTA; X.font = `700 ${cabe(s.item, 70, 250, "CV", 700)}px CV`; X.fillText(s.item, 0, -10); X.fillStyle = "#c0392b"; X.font = "400 58px BB"; X.fillText(fmtP(s.estrelas) + " ★", 0, 90); X.fillStyle = "#7b8794"; X.font = "400 26px BB"; X.fillText("ESTRELAS", 0, 140); }
        X.restore(); });
      const p = back(lin(lt, .9, 1.3)); X.save(); X.translate(530, 1425); X.rotate(-.02); X.scale(p, p); X.shadowColor = "rgba(0,0,0,.3)"; X.shadowBlur = 20; X.fillStyle = TINTA; X.beginPath(); X.roundRect(-400, -62, 800, 124, 62); X.fill(); X.shadowColor = "transparent";
      X.textAlign = "center"; X.textBaseline = "middle"; X.font = "400 92px BB"; X.fillStyle = BRANCO; const w1 = X.measureText("COMENTA ").width, w2 = X.measureText(CHAVE).width; X.textAlign = "left"; X.fillText("COMENTA ", -(w1 + w2) / 2, 6); X.fillStyle = "#ffd23f"; X.fillText(CHAVE, -(w1 + w2) / 2 + w1, 6); X.restore(); },
  }); };
const cores = { LAR: "#1f78c8", VERDE: PLANTA, FUNDO: PAREDE, CREME: BRANCO, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

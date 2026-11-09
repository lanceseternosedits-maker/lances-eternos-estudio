// Reel ⚙️ como funciona "Quando usar o modo pensar" (modelos que raciocinam; o1 × GPT-4o na prova AIME 2024: 74% × 12%; 14/11 13:00).
// Identidade: cabana de neve à noite com lareira acesa: uma ampulheta gigante no meio (o tempo pensando), um caderno que se enche de
// rabiscos atrás de um biombo (o raciocínio escondido), e duas placas de madeira no fim ("PENSAR" e "NORMAL"). Madeira + neve + laranja-fogo.
// Elementos: faixa diagonal de aviso, letras caindo e encaixando, placar HI-SCORE (acerto na prova), bloco de 4 palavras com a atual colorida,
// virada de página, plongée/contra-plongée, cartões que viram, Space Grotesk. Mascote de touca de lã com pompom; ação: virar a ampulheta.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const MAD = "#8a5a33", MAD2 = "#5e3b20", NEVE = "#f4f8fc", FOGO = "#ff8a3d", AZN = "#1c2a4a", TINTA = "#1b2233", FUNDO = "#eef2f8", AMAR = "#ffd23f", VERDE = "#2fb36b", VERM = "#e5484d", CREME = "#fffaf0";
rim.color.set(0xffb070); rim.intensity = 1.6; key.color.set(0xdfe8ff); key.intensity = 120; key.position.set(2, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xdfe6ff, .55)); const fogo = new THREE.PointLight(0xff8a3d, 8, 7); fogo.position.set(-2.2, 1.0, -1.8); S.add(fogo);
// ---------- cabana ----------
const tT = ctex(256, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#9a6a40" : "#8a5a33"; g.fillRect(0, i * 32, w, 32); g.fillStyle = "rgba(0,0,0,.15)"; g.fillRect(0, i * 32 + 30, w, 2); } }); tT.wrapS = tT.wrapT = THREE.RepeatWrapping; tT.repeat.set(4, 2);
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshStandardMaterial({ map: tT, roughness: .8 }), S, 0, 4.5, -2.8).castShadow = false;
const janT = ctex(256, 256, g => { g.fillStyle = AZN; g.fillRect(0, 0, 256, 256); g.fillStyle = "#fff"; for (let i = 0; i < 40; i++) { g.beginPath(); g.arc((i * 61) % 256, (i * 37) % 256, 3, 0, 7); g.fill(); } g.fillStyle = NEVE; g.fillRect(0, 200, 256, 56); g.strokeStyle = MAD2; g.lineWidth = 14; g.strokeRect(7, 7, 242, 242); g.beginPath(); g.moveTo(128, 0); g.lineTo(128, 256); g.moveTo(0, 128); g.lineTo(256, 128); g.stroke(); });
mesh(new THREE.PlaneGeometry(1.4, 1.4), new THREE.MeshBasicMaterial({ map: janT }), S, 1.9, 2.6, -2.75).castShadow = false;
const pT = ctex(256, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#6e4426" : "#7a4e2c"; g.fillRect(0, i * 32, w, 32); } }); pT.wrapS = pT.wrapT = THREE.RepeatWrapping; pT.repeat.set(5, 4);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: pT, roughness: .7 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
const tap = mesh(new THREE.CircleGeometry(1.6, 32), M("#b33a3a", { roughness: 1 }), S, 0, .005, .2); tap.rotation.x = -Math.PI / 2; tap.castShadow = false;
// lareira
const LAR = new THREE.Group(); LAR.position.set(-2.3, 0, -2.4); S.add(LAR); box(1.6, 1.6, .5, M("#9a948c", { roughness: .9 }), LAR, 0, .8, 0); box(1.0, .8, .52, M("#1a1410"), LAR, 0, .5, .02);
const CHAMA = [0, 1, 2].map(i => mesh(new THREE.ConeGeometry(.14 - i * .03, .45, 8), E(i ? AMAR : FOGO, 2), LAR, -.15 + i * .15, .4, .2));
// ampulheta gigante
const AMP = new THREE.Group(); AMP.position.set(-.2, 1.5, -.9); AMP.scale.setScalar(1.35); S.add(AMP); for (const s of [-1, 1]) { box(1.0, .1, 1.0, M(MAD2, { roughness: .5 }), AMP, 0, s * .82, 0); }
for (const [x, z] of [[-.42, -.42], [.42, -.42], [-.42, .42], [.42, .42]]) box(.06, 1.6, .06, M(MAD2), AMP, x, 0, z);
const vidro = new THREE.MeshStandardMaterial({ color: "#dff2ff", transparent: true, opacity: .35, roughness: .05 }); for (const s of [-1, 1]) { const c = mesh(new THREE.ConeGeometry(.38, .74, 24, 1, true), vidro, AMP, 0, s * .4, 0); c.rotation.x = s > 0 ? Math.PI : 0; c.castShadow = false; }
const areiaC = mesh(new THREE.ConeGeometry(.3, .5, 24), M("#f0c674", { roughness: .9 }), AMP, 0, .45, 0); areiaC.rotation.x = Math.PI; const areiaB = mesh(new THREE.ConeGeometry(.3, .5, 24), M("#f0c674", { roughness: .9 }), AMP, 0, -.55, 0); const fio = box(.02, .7, .02, M("#f0c674"), AMP, 0, -.1, 0);
const areia = k => { areiaC.scale.setScalar(Math.max(.01, 1 - k)); areiaB.scale.setScalar(Math.max(.01, k)); areiaB.position.y = -.78 + .25 * k; fio.visible = k > 0 && k < 1; };
// biombo + caderno com rabiscos (raciocínio escondido)
const BIO = new THREE.Group(); BIO.position.set(2.0, 0, -1.5); BIO.rotation.y = -.4; S.add(BIO); for (let i = 0; i < 3; i++) { const p = box(.6, 1.7, .04, M("#e8dcc4", { roughness: .9 }), BIO, -.6 + i * .6, .85, 0); p.rotation.y = (i - 1) * .3; }
const cadC = document.createElement("canvas"); cadC.width = 256; cadC.height = 320; const cg = cadC.getContext("2d"); const cadT = new THREE.CanvasTexture(cadC); cadT.colorSpace = THREE.SRGBColorSpace;
const CAD = mesh(new THREE.PlaneGeometry(.7, .88), new THREE.MeshStandardMaterial({ map: cadT, side: THREE.DoubleSide }), S, 1.75, 1.15, -1.25); CAD.rotation.y = -.4; CAD.castShadow = false;
const desCad = k => { cg.fillStyle = "#fffdf6"; cg.fillRect(0, 0, 256, 320); cg.strokeStyle = "rgba(59,120,196,.3)"; for (let y = 30; y < 320; y += 24) { cg.beginPath(); cg.moveTo(0, y); cg.lineTo(256, y); cg.stroke(); }
  const L = ["passo 1: o que pede?", "tenta: x = 12", "não... volta", "tenta: x = 7", "confere: ok!", "resposta: 7"]; const n = Math.floor(k * L.length * 1.0001); cg.font = "700 20px SG"; L.slice(0, n).forEach((s, i) => { cg.fillStyle = i === 2 ? VERM : i === 5 ? VERDE : TINTA; cg.fillText(s, 14, 50 + i * 44); if (i === 1) { cg.strokeStyle = VERM; cg.beginPath(); cg.moveTo(12, 44 + i * 44); cg.lineTo(150, 44 + i * 44); cg.stroke(); } }); cadT.needsUpdate = true; };
// placas PENSAR / NORMAL
const plT = (txt, sub, cor) => ctex(320, 200, g => { g.fillStyle = cor; g.beginPath(); g.roundRect(0, 0, 320, 200, 18); g.fill(); g.fillStyle = "#fff"; g.font = "700 56px SG"; g.textAlign = "center"; g.fillText(txt, 160, 80); g.font = "700 26px SG"; sub.forEach((s, i) => g.fillText(s, 160, 125 + i * 32)); });
const PLS = [["PENSAR", ["conta · plano", "decisão difícil"], AZN, -1.4], ["NORMAL", ["texto rápido", "ideia"], VERDE, 1.6]].map(([t, s, c, x]) => { const g = new THREE.Group(); g.position.set(x, 0, .2); S.add(g); box(.08, 1.2, .08, M(MAD2), g, 0, .6, 0); mesh(new THREE.PlaneGeometry(1.1, .69), new THREE.MeshStandardMaterial({ map: plT(t, s, c) }), g, 0, 1.35, .05).castShadow = false; g.visible = false; return g; });
// ---------- mascote: touca de lã com pompom; vira a ampulheta ----------
const TOU = new THREE.Group(); TOU.position.set(0, 1.5, 0); MAS.corpo.add(TOU); const tc = mesh(new THREE.SphereGeometry(.6, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), M("#3a6fd8", { roughness: 1 }), TOU, 0, -.06, 0); tc.scale.set(1.2, .7, .95); box(1.4, .16, 1.0, M("#f4f8fc", { roughness: 1 }), TOU, 0, -.02, 0); mesh(new THREE.SphereGeometry(.16, 12, 10), M("#fff", { roughness: 1 }), TOU, 0, .42, 0);
const MX = 1.5, MZ = .7;
const vira = (lt, t0) => { const u = lt - t0, k = eio(Math.max(0, Math.min(1, u / .6))); AMP.rotation.z = k * Math.PI; pose(MAS, { x: MX - .4, z: MZ - .3, y: hop(lt, .6, .03), ry: -.5, braco: [.4 + k * .4, 1.8 - k * .8], piscar: pisca(lt) }); MAS.g.rotation.z = 0; return u > .6 ? u - .6 : -1; };
const espera = (lt, ry = -.3) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, 1.2, .02), ry, sq: .02, braco: [.2, 1.5 + Math.sin(lt * 1.5) * .1], piscar: pisca(lt) }); MAS.g.rotation.z = .05; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .22), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let HS = [0, 0];
const reset = (lt) => { CHAMA.forEach((c, i) => c.scale.set(1, 1 + Math.sin(lt * 9 + i * 2) * .15, 1)); fogo.intensity = 7 + Math.sin(lt * 11) * 1.5; PLS.forEach(p => p.visible = false); AMP.rotation.z = 0; desCad(0); };
// ---------- plongée / contra-plongée ----------
const BS = { gancho: [V(-.2, 4.2, 7.2), V(.1, .9, -.8)], s1: [V(.6, 1.0, 6.6), V(1.0, 1.6, -1.2)], s2: [V(0, 4.2, 7.0), V(.1, 1.0, -.8)], s3: [V(-.2, 1.0, 6.8), V(.1, 1.6, -.8)], s4: [V(0, 4.0, 7.4), V(.1, .9, 0)], cta: [V(0, 2.8, 7.8), V(.1, 1.4, -.6)] };
const SHOTS = {}; Object.keys(BS).forEach(n => { const s = [BS[n][0], BS[n][1]]; SHOTS[n] = [s, s]; });
const camera = (cam, nome, lt, d) => { const [p, l] = BS[nome] || BS.cta, u = eio(Math.min(1, lt / d)); cam.position.set(p.x, p.y + (p.y > 2 ? -.4 : .25) * u, p.z - u * .5); cam.lookAt(l.x, l.y, l.z); };
const ACT = {
  gancho(lt, d) { reset(lt); const u = vira(lt, .3); areia(u < 0 ? 0 : Math.min(1, u / 3)); },
  s1(lt, d) { reset(lt); AMP.rotation.z = Math.PI; areia(.3 + lin(lt, 0, d) * .4); desCad(lin(lt, .3, d * .9)); espera(lt, -.5); },
  s2(lt, d) { reset(lt); AMP.rotation.z = Math.PI; areia(.7 + lin(lt, 0, d) * .3); desCad(1); HS = [12 * eio(lin(lt, .5, 1.6)), 74 * eio(lin(lt, 1.6, 3.4))]; lt > 3.4 ? feliz(lt) : espera(lt); },
  s3(lt, d) { reset(lt); AMP.rotation.z = Math.PI; areia(1); desCad(1); pose(MAS, { x: MX, z: MZ, y: 0, ry: -.1, sq: .06, braco: [.1, .1], piscar: lt % 2 < 1.6 ? pisca(lt) : .15 }); MAS.g.rotation.z = Math.sin(lt * 1.2) * .06; },
  s4(lt, d) { reset(lt); areia(1); AMP.rotation.z = Math.PI; PLS.forEach((p, i) => { const k = lin(lt, .3 + i * 1.6, .7 + i * 1.6); p.visible = k > 0; p.scale.setScalar(Math.max(.01, back(k))); }); pose(MAS, { x: .1, z: 1.2, y: hop(lt, .8, .03), ry: lt < 2 ? -.5 : .5, braco: lt < 2 ? [1.6, .4] : [.4, 1.6], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
  cta(lt, d) { reset(lt); areia(1); AMP.rotation.z = Math.PI; PLS.forEach(p => { p.visible = true; p.scale.setScalar(1); }); pose(MAS, { x: .1, z: 2.0, y: hop(lt, .35, .22), ry: -.15, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `700 ${f}px SG`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const listras = (w, h) => { X.save(); X.beginPath(); X.rect(-w / 2, -h / 2, w, h); X.clip(); X.fillStyle = AMAR; X.fillRect(-w / 2, -h / 2, w, h); X.fillStyle = TINTA; for (let x = -w / 2 - h; x < w / 2 + h; x += 56) { X.beginPath(); X.moveTo(x, -h / 2); X.lineTo(x + 28, -h / 2); X.lineTo(x + 28 - h, h / 2); X.lineTo(x - h, h / 2); X.fill(); } X.restore(); };
  const cai = (txt, cx, y, lt, t0, cor, tw = 92) => { const x0 = cx - (txt.length * (tw + 8) - 8) / 2; for (let i = 0; i < txt.length; i++) { if (txt[i] === " ") continue; const k = lin(lt, t0 + i * .06, t0 + i * .06 + .32); if (k <= 0) continue; const yy = y - (1 - eo(k)) * 240;
      X.save(); X.translate(x0 + i * (tw + 8) + tw / 2, yy); X.rotate((1 - eo(k)) * (i % 2 ? .5 : -.5)); X.fillStyle = cor; X.beginPath(); X.roundRect(-tw / 2, -tw / 2 - 6, tw, tw + 12, 12); X.fill(); X.fillStyle = "#fff"; X.font = `700 ${Math.round(tw * .78)}px SG`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(txt[i], 0, 4); X.restore(); } };
  const placar = (x, y, rot, v, cor) => { X.fillStyle = "#0e1424"; X.beginPath(); X.roundRect(x - 190, y - 80, 380, 170, 14); X.fill(); X.strokeStyle = cor; X.lineWidth = 5; X.stroke(); X.fillStyle = cor; X.font = "400 22px PS"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(rot, x, y - 46); X.fillStyle = "#fff"; X.font = "700 74px SG"; X.fillText(Math.round(v) + "%", x, y + 14); X.fillStyle = "#c9d3e6"; X.font = "700 20px SG"; X.fillText("acerto na prova de matemática", x, y + 62); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(238,242,248,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") cai("RACIOCINA", 505, 700, lt, .8, AZN, 84);
      if (nome === "s2") { if (lt > .4) placar(280, 760, "MODELO COMUM", HS[0], VERM); if (lt > 1.5) placar(740, 760, "MODO PENSAR", HS[1], VERDE); }
      if (nome === "s3") cai("SÓ ESPERA", 505, 700, lt, .3, VERM, 84); },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(.04); X.save(); X.translate(0, -112); listras(980, 32); X.restore(); X.save(); X.translate(0, 116); listras(980, 32); X.restore();
      X.fillStyle = TINTA; X.fillRect(-490, -96, 980, 196); X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = "#fff"; cabe(72, l1, 900); X.fillText(l1, 0, -18); X.fillStyle = AMAR; cabe(50, l2, 900); X.fillText(l2, 0, 40); X.fillStyle = "#9fe3b0"; cabe(46, l3, 900); X.fillText(l3, 0, 88); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 76; X.font = `700 ${fs}px SG`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 860 && fs > 44) { fs -= 2; X.font = `700 ${fs}px SG`; }
      const y = 1400, x0 = 505 - tot() / 2; X.fillStyle = "rgba(27,34,51,.85)"; X.beginPath(); X.roundRect(x0 - 26, y - fs * .66, tot() + 36, fs * 1.28, 16); X.fill();
      let x = x0; X.textAlign = "left"; X.textBaseline = "middle"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2, ch_ = w.w.replace(/[.,!?:]/g, "").toUpperCase() === CHAVE; X.fillStyle = ch_ ? FOGO : at ? AMAR : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .42) return; const u = eio(lt / .42), x = 1080 - u * 1500;
      X.save(); X.fillStyle = CREME; X.beginPath(); X.moveTo(x, 0); X.quadraticCurveTo(x - 160, 960, x, 1920); X.lineTo(x + 420, 1920); X.lineTo(x + 420, 0); X.closePath(); X.fill();
      const g = X.createLinearGradient(x - 80, 0, x + 120, 0); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(.6, "rgba(0,0,0,.2)"); g.addColorStop(1, "rgba(0,0,0,0)"); X.fillStyle = g; X.fillRect(x - 80, 0, 200, 1920); X.restore(); },
    fechamento(lt) { // cartões que viram: CONTA · PLANO · DECISÃO = modo pensar
      [["CONTA", "pensar"], ["PLANO", "pensar"], ["TEXTO", "normal"]].forEach(([a, b], i) => { const k = lin(lt, .1 + i * .22, .55 + i * .22), sx = Math.abs(Math.cos(k * Math.PI)), frente = k > .5, x = 210 + i * 300, y = 830;
        X.save(); X.translate(x, y); X.scale(Math.max(.02, sx), 1); X.fillStyle = frente ? "#fff" : AZN; X.beginPath(); X.roundRect(-130, -150, 260, 300, 22); X.fill();
        if (frente) { X.fillStyle = TINTA; X.font = `700 ${cabe(56, a, 220)}px SG`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(a, 0, -24); X.fillStyle = b === "normal" ? VERDE : AZN; X.font = "700 36px SG"; X.fillText("→ " + b, 0, 40); } else { X.fillStyle = "#fff"; X.font = "700 110px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("?", 0, 8); } X.restore(); });
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 1060); X.scale(p, p); X.fillStyle = FOGO; X.beginPath(); X.roundRect(-300, -62, 600, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = `700 ${cabe(72, "Comenta " + CHAVE, 560)}px SG`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 4); X.restore(); },
  }; };
const cores = { LAR: FOGO, VERDE: AZN, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

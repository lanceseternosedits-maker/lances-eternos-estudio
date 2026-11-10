// Reel 🆕 "O manual da IKEA virou animação 3D" (Bygga; 13/11 19:30). Motor da cena_contagem.
// Identidade: sala de apartamento recém-mudado: caixa de móvel desmontado aberta, parafusos espalhados, chave Allen, o manual de papel
// no chão; o celular escaneia o manual e as peças de uma estante sobem do chão e se encaixam sozinhas, uma por uma, com seta de onde vai.
// Sem logo nem cores da marca (nada de azul e amarelo): madeira clara + verde-sálvia + coral. O mascote "surfa" em cima de uma tábua da estante.
// Elementos: tela de terminal, nome em máquina de escrever, pote enchendo de estrelas, uma palavra gigante por vez, virada de página,
// plongée/contra-plongée, post-its na parede, Press Start só no enfeite + Space Grotesk. Mascote de bermuda de surfe; ação: surfar.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const SAL = "#7fa88a", SAL2 = "#4f7a5d", CORAL = "#ff6f59", MAD = "#d9b98c", MAD2 = "#b8915f", CREME = "#fffaf0", TINTA = "#1f2622", FUNDO = "#f3f6f1", VERDE = "#3ddc84";
rim.color.set(0xfff0d8); rim.intensity = 1.3; key.color.set(0xffffff); key.intensity = 150; key.position.set(-2, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xf6fff4, .62));
// ---------- sala ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#e9efe6"; g.fillRect(0, 0, w, h); g.fillStyle = "#cfe0d2"; g.fillRect(300, 40, 150, 110); g.fillStyle = "#a9d3f0"; g.fillRect(310, 50, 130, 90); g.fillStyle = "#fff"; g.fillRect(372, 50, 6, 90); g.fillStyle = SAL; g.fillRect(0, 200, w, 8); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const mT = ctex(256, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#cfae80" : "#c3a173"; g.fillRect(0, i * 32, w, 32); } }); mT.wrapS = mT.wrapT = THREE.RepeatWrapping; mT.repeat.set(5, 4);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: mT, roughness: .6 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
const tap = mesh(new THREE.CircleGeometry(1.8, 40), M(SAL, { roughness: 1 }), S, -.2, .005, .2); tap.rotation.x = -Math.PI / 2; tap.castShadow = false;
// caixa de papelão aberta + parafusos + chave Allen
const CX = new THREE.Group(); CX.position.set(2.2, 0, -1.2); CX.rotation.y = -.4; S.add(CX); const pap = M("#c89b63", { roughness: .9 }); box(1.4, .5, .9, pap, CX, 0, .25, 0); for (const s of [-1, 1]) { const ab = box(1.4, .02, .45, pap, CX, 0, .5, s * .67); ab.rotation.x = s * .9; }
for (let i = 0; i < 9; i++) mesh(new THREE.CylinderGeometry(.025, .025, .14, 6), M("#aaa", { metalness: .9 }), S, -1.2 + (i * .37) % 1.4, .03, 1.0 + (i * .23) % .5).rotation.z = Math.PI / 2 + i;
const allen = box(.04, .04, .4, M("#777", { metalness: .9 }), S, .9, .03, 1.2); allen.rotation.y = .7;
// manual de papel no chão
const manT = ctex(256, 340, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 256, 340); g.strokeStyle = TINTA; g.lineWidth = 3; g.strokeRect(40, 40, 70, 90); g.strokeRect(150, 50, 60, 80); g.beginPath(); g.moveTo(110, 85); g.lineTo(150, 90); g.stroke(); g.strokeRect(50, 190, 160, 20); g.strokeRect(50, 230, 160, 20); g.fillStyle = TINTA; g.font = "700 30px SG"; g.fillText("1", 20, 30); g.fillText("2", 20, 180); g.beginPath(); g.arc(200, 300, 18, 0, 7); g.stroke(); });
const MAN = mesh(new THREE.PlaneGeometry(.9, 1.2), new THREE.MeshStandardMaterial({ map: manT, side: THREE.DoubleSide }), S, -1.4, .02, .5); MAN.rotation.x = -Math.PI / 2; MAN.rotation.z = .3;
// celular escaneando
const CEL = new THREE.Group(); S.add(CEL); box(.36, .7, .04, M("#222"), CEL, 0, 0, 0); const telaC = box(.32, .64, .01, E("#cfefff", .5), CEL, 0, 0, .025);
const raio = mesh(new THREE.PlaneGeometry(1.0, .04), new THREE.MeshBasicMaterial({ color: VERDE, transparent: true, opacity: .8 }), S); raio.rotation.x = -Math.PI / 2; raio.castShadow = false;
// estante (peças que sobem e encaixam) — posição final
const EST = new THREE.Group(); EST.position.set(-.3, 0, -1.5); S.add(EST); const madM = M(MAD, { roughness: .55 });
const PECAS = [[[.06, 1.8, .45], [-.7, .9, 0]], [[.06, 1.8, .45], [.7, .9, 0]], [[1.46, .05, .45], [0, .04, 0]], [[1.46, .05, .45], [0, .62, 0]], [[1.46, .05, .45], [0, 1.2, 0]], [[1.46, .05, .45], [0, 1.78, 0]], [[1.46, 1.8, .02], [0, .9, -.23]]].map(([d, p], i) => { const m = box(d[0], d[1], d[2], i === 6 ? M("#efe6d6") : madM, EST, p[0], p[1], p[2]); m.userData.fim = V(...p); return m; });
const seta = mesh(new THREE.ConeGeometry(.12, .3, 12), M(CORAL), S); seta.castShadow = false;
const monta = (k, lt) => { const n = PECAS.length; PECAS.forEach((m, i) => { const u = Math.max(0, Math.min(1, k * n - i)); m.visible = u > 0; const f = m.userData.fim; m.position.set(f.x + (1 - eio(u)) * (i % 2 ? 1.2 : -1.2), f.y + (1 - eio(u)) * 1.4, f.z + (1 - eio(u)) * 1.2); m.rotation.set((1 - eio(u)) * 1.2, (1 - eio(u)) * 2, 0); });
  const atual = Math.min(n - 1, Math.floor(k * n)); const f = PECAS[atual].userData.fim; seta.visible = k < 1; seta.position.set(EST.position.x + f.x, f.y + .5 + Math.sin(lt * 6) * .06, EST.position.z + f.z + .3); seta.rotation.x = Math.PI; };
// ---------- mascote: bermuda de surfe; surfa numa tábua ----------
const BER = box(1.52, .26, 1.02, M(CORAL, { roughness: .6 }), MAS.corpo, 0, .5, 0);
const PRANCHA = box(1.8, .06, .7, M(MAD2, { roughness: .4 }), S, 0, 0, 0);
const surfa = (lt, x, z, alt = .6) => { const y = alt + Math.sin(lt * 2.4) * .12, rz = Math.sin(lt * 2.4 + .6) * .12; PRANCHA.visible = true; PRANCHA.position.set(x, y, z); PRANCHA.rotation.set(0, -.3, rz);
  pose(MAS, { x, z, y: y + .04, ry: -.3, braco: [1.3 + Math.sin(lt * 2.4) * .3, 1.3 - Math.sin(lt * 2.4) * .3], sq: .04, piscar: pisca(lt) }); MAS.g.rotation.z = rz; };
const chaoP = (lt, x, ry = -.3, br = [.4, .6]) => { PRANCHA.visible = false; pose(MAS, { x, z: .6, y: hop(lt, .8, .03), ry, braco: br, piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let POTE = 0;
const reset = (lt) => { CEL.visible = false; raio.visible = false; seta.visible = false; };
// ---------- plongée / contra-plongée ----------
const BS = { gancho: [V(.2, 4.4, 7.2), V(-.3, .8, -.4)], s1: [V(-.2, 1.0, 6.8), V(-.2, 1.8, -.8)], s2: [V(.3, 4.3, 6.8), V(-.8, .5, .2)], s3: [V(-.3, 1.0, 6.8), V(-.3, 1.6, -1.0)], s4: [V(.2, 4.2, 7.2), V(-.2, .9, -.6)], cta: [V(0, 3.0, 7.8), V(-.2, 1.4, -.8)] };
const SHOTS = {}; Object.keys(BS).forEach(n => { const s = [BS[n][0], BS[n][1]]; SHOTS[n] = [s, s]; });
const camera = (cam, nome, lt, d) => { const [p, l] = BS[nome] || BS.cta, u = eio(Math.min(1, lt / d)); cam.position.set(p.x, p.y + (p.y > 2 ? -.4 : .25) * u, p.z - u * .5); cam.lookAt(l.x, l.y, l.z); };
const ACT = {
  gancho(lt, d) { reset(lt); monta(0, lt); PECAS.forEach((m, i) => { m.visible = true; m.position.set(-1.6 + i * .5, .05 + (i % 3) * .07, .9 - (i % 2) * .3); m.rotation.set(Math.PI / 2 * (i % 2), i * .9, 0); }); chaoP(lt, .9, -.5, [.3, 1.6 + Math.sin(lt * 8) * .3]); },
  s1(lt, d) { reset(lt); monta(lin(lt, .3, d) * .3, lt); surfa(lt, 1.1, .5); },
  s2(lt, d) { reset(lt); monta(.3, lt); CEL.visible = true; CEL.position.set(-1.4, 1.1, .5); CEL.rotation.set(-Math.PI / 2 + .2, 0, .3); raio.visible = true; const u = (lt * .7) % 1; raio.position.set(-1.4 + Math.sin(.3) * (u - .5) * 1.1, .04, .5 + Math.cos(.3) * (u - .5) * 1.1); raio.rotation.z = .3; telaC.material.emissiveIntensity = .5 + Math.sin(lt * 8) * .3; chaoP(lt, .6, -.6); },
  s3(lt, d) { reset(lt); monta(.3 + lin(lt, .2, d * .85) * .7, lt); POTE = eio(lin(lt, .3, 2.2)); surfa(lt, 1.4, .7, .8); },
  s4(lt, d) { reset(lt); monta(1, lt); surfa(lt, 1.5, .7); },
  cta(lt, d) { reset(lt); monta(1, lt); chaoP(lt, 1.1, -.2, [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3]); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `700 ${f}px SG`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const estrela = (x, y, r, cor) => { X.fillStyle = cor; X.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; X.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } X.closePath(); X.fill(); };
  const pote = (v, x, y) => { const w = 150, h = 170; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,255,255,.93)"; X.beginPath(); X.roundRect(-110, -h / 2 - 40, 220, h + 140, 20); X.fill();
    X.fillStyle = "rgba(127,168,138,.18)"; X.strokeStyle = SAL2; X.lineWidth = 5; X.beginPath(); X.roundRect(-w / 2, -h / 2, w, h, 22); X.fill(); X.stroke(); X.fillStyle = MAD2; X.fillRect(-w / 2 + 12, -h / 2 - 20, w - 24, 22);
    X.save(); X.beginPath(); X.roundRect(-w / 2 + 5, -h / 2 + 5, w - 10, h - 10, 18); X.clip(); const n = Math.floor(v / 658 * 30); for (let i = 0; i < n; i++) estrela(-w / 2 + 20 + (i % 5) * 26 + (Math.floor(i / 5) % 2) * 12, h / 2 - 18 - Math.floor(i / 5) * 24, 13, i % 3 ? CORAL : "#ffb3a6"); X.restore();
    X.fillStyle = TINTA; X.font = "700 46px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(Math.round(v) + " ★", 0, h / 2 + 36); X.font = "700 20px SG"; X.fillStyle = SAL2; X.fillText("ESTRELAS NO GITHUB", 0, h / 2 + 68); X.restore(); };
  const maquina = (txt, x, y, lt, t0, fs) => { if (lt < t0) return; const n = Math.min(txt.length, Math.floor((lt - t0) * 14)); X.font = `700 ${fs}px SG`; X.textAlign = "left"; X.textBaseline = "middle"; const s = txt.slice(0, n), w = X.measureText(txt).width;
    X.fillStyle = "rgba(255,250,240,.95)"; X.beginPath(); X.roundRect(x - 24, y - fs * .75, w + 60, fs * 1.5, 14); X.fill(); X.fillStyle = TINTA; X.fillText(s, x, y + 3); if (n < txt.length || Math.floor(lt * 3) % 2) X.fillRect(x + X.measureText(s).width + 4, y - fs * .38, 6, fs * .76); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(243,246,241,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") maquina("Bygga", 110, 700, lt, .3, 96);
      if (nome === "s2") maquina("escaneia o manual", 110, 700, lt, .4, 64);
      if (nome === "s3") pote(658 * POTE, 190, 860);
      if (nome === "s4") maquina("projeto aberto · dev independente", 110, 700, lt, .3, 46); },
    etiqueta(t, nome) { // tela de terminal
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410);
      X.fillStyle = "#14201a"; X.beginPath(); X.roundRect(-460, -140, 920, 280, 18); X.fill(); X.fillStyle = "#2a3a31"; X.beginPath(); X.roundRect(-460, -140, 920, 42, [18, 18, 0, 0]); X.fill();
      [CORAL, "#ffd23f", VERDE].forEach((c, i) => { X.fillStyle = c; X.beginPath(); X.arc(-428 + i * 30, -119, 9, 0, 7); X.fill(); }); X.fillStyle = "#8fb59a"; X.font = "400 18px PS"; X.textAlign = "right"; X.textBaseline = "middle"; X.fillText("bygga.sh", 440, -118);
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = VERDE; X.font = "700 54px SG"; X.fillText(">", -430, -30); X.fillStyle = "#fff"; cabe(58, l1, 790); X.fillText(l1, -390, -30);
      X.fillStyle = "#ffd2c9"; cabe(50, l2, 840); X.fillText(l2, -430, 38); X.fillStyle = "#bfe6c9"; cabe(46, l3, 800); X.fillText(l3, -430, 100); if (Math.floor(t * 2) % 2 === 0) { const w = X.measureText(l3).width; X.fillRect(-420 + w, 66, 22, 40); } X.restore(); },
    cabecalho() {},
    legenda(seg, t) { // uma palavra gigante por vez com pop
      const ws = seg.palavras; let w = ws.findIndex(x => t < x.t1 + .06); if (w < 0) w = ws.length - 1; const W = ws[w]; if (t < W.t0 - .25) return;
      const p = back(lin(t, W.t0 - .04, W.t0 + .14)); const txt = W.w.replace(/[,.:]$/, ""), chave = txt.replace(/[?!]/g, "").toUpperCase() === CHAVE;
      let f = 128; X.font = `700 ${f}px SG`; while (X.measureText(txt).width > 820 && f > 56) { f -= 4; X.font = `700 ${f}px SG`; }
      X.save(); X.translate(505, 1395); X.scale(.6 + .4 * p, .6 + .4 * p); X.textAlign = "center"; X.textBaseline = "middle"; X.lineWidth = 18; X.strokeStyle = "#fff"; X.lineJoin = "round"; X.strokeText(txt, 0, 0); X.fillStyle = chave ? CORAL : TINTA; X.fillText(txt, 0, 0); X.restore(); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .42) return; const u = eio(lt / .42), x = 1080 - u * 1500;
      X.save(); X.fillStyle = CREME; X.beginPath(); X.moveTo(x, 0); X.quadraticCurveTo(x - 160, 960, x, 1920); X.lineTo(x + 420, 1920); X.lineTo(x + 420, 0); X.closePath(); X.fill();
      const g = X.createLinearGradient(x - 80, 0, x + 120, 0); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(.6, "rgba(0,0,0,.2)"); g.addColorStop(1, "rgba(0,0,0,0)"); X.fillStyle = g; X.fillRect(x - 80, 0, 200, 1920); X.restore(); },
    fechamento(lt) { // post-its na parede
      X.fillStyle = "rgba(243,246,241,.28)"; X.fillRect(0, 640, 1080, 860);
      [["1", "ESCANEIA", "o manual", "#ffe27a", -.06], ["2", "GIRA", "a peça", "#bfe6c9", .05], ["3", "ENCAIXA", "sem briga", "#ffc4b8", -.03]].forEach(([n, a, b, c, r], i) => { const k = back(lin(lt, .1 + i * .2, .45 + i * .2)); if (k <= 0) return; const x = 215 + i * 290, y = 870 + (i % 2) * 30;
        X.save(); X.translate(x, y); X.rotate(r); X.scale(k, k); X.shadowColor = "rgba(0,0,0,.3)"; X.shadowBlur = 14; X.fillStyle = c; X.fillRect(-125, -125, 250, 250); X.shadowBlur = 0; X.fillStyle = "rgba(255,255,255,.55)"; X.fillRect(-50, -140, 100, 32);
        X.fillStyle = TINTA; X.textAlign = "center"; X.textBaseline = "middle"; X.font = "400 34px PS"; X.fillText(n, 0, -70); X.font = `700 ${cabe(52, a, 220)}px SG`; X.fillText(a, 0, 4); X.fillStyle = "#4a5a50"; X.font = "700 34px SG"; X.fillText(b, 0, 62); X.restore(); });
      const p = back(lin(lt, .8, 1.2)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(320, 1160); X.scale(p * .8, p * .8); X.fillStyle = CORAL; X.beginPath(); X.roundRect(-290, -62, 580, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = "700 70px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 4); X.restore();
      if (lt > 1.2) { X.globalAlpha = eo(lin(lt, 1.2, 1.6)); X.fillStyle = TINTA; X.font = "700 40px SG"; X.textAlign = "center"; X.fillText("Qual móvel da sua casa tá esperando montagem?", 505, 1290); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: CORAL, VERDE: SAL, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

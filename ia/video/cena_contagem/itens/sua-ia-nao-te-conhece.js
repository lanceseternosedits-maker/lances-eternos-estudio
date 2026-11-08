// Reel ⚙️ como funciona "Sua IA não sabe nada de você" (instruções personalizadas/memória; 12/11 08:00). Motor da cena_contagem.
// Identidade: recepção de hotel com balcão de madeira e latão, sineta, quadro de chaves; o mascote é o recepcionista que não
// reconhece o hóspede e pede tudo de novo; uma ficha de cadastro é preenchida e carimbada, e na volta ele já sabe tudo.
// Paleta azul-petróleo + latão. Elementos: etiqueta em placa de rua/aeroporto, legenda karaokê com marca-texto deslizando,
// virada de página, travelling lateral, fechamento em página de caderno, Bebas Neue. Mascote de colete de recepcionista
// (faixa no topo) e crachá no braço (fora do rosto); ação principal: preencher a ficha.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, mascote, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const PET = "#0f4c5c", PET2 = "#1b6f83", LAT = "#c9a227", LAT2 = "#8f7212", CREME = "#fbf3e0", TINTA = "#10232a", FUNDO = "#e9f1f2", VERM = "#c0392b";
rim.color.set(0xffe6a8); rim.intensity = 1.3; key.color.set(0xfff6e6); key.intensity = 150; key.position.set(1, 9, 6); key.target.position.set(0, .9, -.3);
S.add(new THREE.AmbientLight(0xf2f7f8, .55));

// ---------- cenário: recepção ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = PET; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,.05)"; for (let x = 0; x < w; x += 36) g.fillRect(x, 0, 3, h); g.fillStyle = LAT; g.fillRect(0, 150, w, 6); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.5).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(22, 12), M("#c8b48f", { roughness: .7 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
const tap = mesh(new THREE.PlaneGeometry(3, 1.6), M("#8a1f2b", { roughness: 1 }), S, 1.6, .01, .8); tap.rotation.x = -Math.PI / 2;
// quadro de chaves
const chT = ctex(256, 160, g => { g.fillStyle = "#6b4426"; g.fillRect(0, 0, 256, 160); for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { g.fillStyle = LAT; g.beginPath(); g.arc(24 + c * 42, 30 + r * 48, 7, 0, 7); g.fill(); g.fillRect(22 + c * 42, 34 + r * 48, 4, 18); } });
mesh(new THREE.PlaneGeometry(1.6, 1.0), new THREE.MeshStandardMaterial({ map: chT }), S, -1.5, 2.4, -2.45);
// balcão
const BAL = new THREE.Group(); BAL.position.set(-.6, 0, -.3); S.add(BAL); box(2.6, 1.0, .8, M("#7a4b2a", { roughness: .6 }), BAL, 0, .5, 0); box(2.7, .07, .9, M(LAT, { metalness: .6, roughness: .3 }), BAL, 0, 1.03, 0);
const sino = new THREE.Group(); sino.position.set(.7, 1.07, .15); BAL.add(sino); mesh(new THREE.SphereGeometry(.12, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), M(LAT, { metalness: .8, roughness: .2 }), sino, 0, 0, 0); mesh(new THREE.CylinderGeometry(.13, .13, .02, 16), M("#333"), sino, 0, 0, 0);
// ficha de cadastro (preenchida aos poucos) sobre o balcão
const fT = ctex(300, 380, (g, w, h, k = 0, carimbo = 0) => { g.fillStyle = CREME; g.fillRect(0, 0, w, h); g.fillStyle = PET; g.font = "400 40px BB"; g.fillText("FICHA DO HÓSPEDE", 20, 48);
  const L = [["QUEM É", "Ana, 34 anos"], ["O QUE FAZ", "dona de padaria"], ["COMO QUER", "resposta curta"], ["", "café sem açúcar"]];
  L.forEach(([a, b], i) => { const y = 100 + i * 66; g.fillStyle = "#8a9aa0"; g.font = "400 22px BB"; g.fillText(a, 20, y); g.strokeStyle = "#c8d3d6"; g.beginPath(); g.moveTo(20, y + 34); g.lineTo(280, y + 34); g.stroke();
    const n = Math.floor(Math.min(1, Math.max(0, k * 4 - i)) * b.length); g.fillStyle = TINTA; g.font = "700 30px CV"; g.fillText(b.slice(0, n), 24, y + 30); });
  if (carimbo) { g.save(); g.translate(190, 320); g.rotate(-.2); g.globalAlpha = carimbo; g.strokeStyle = VERM; g.lineWidth = 6; g.strokeRect(-100, -28, 200, 56); g.fillStyle = VERM; g.font = "400 40px BB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("CADASTRADO", 0, 2); g.restore(); } });
const FICHA = mesh(new THREE.PlaneGeometry(.75, .95), new THREE.MeshStandardMaterial({ map: fT, roughness: .8 }), S, -.15, 1.4, .15); FICHA.rotation.x = -.45;
let fU = ""; const ficha = (k, c) => { const u = Math.round(k * 40) + "|" + Math.round(c * 10); if (u !== fU) { fU = u; fT.draw(k, c); } };
// hóspede (outro boneco de blocos, azul, com mala) na frente do balcão
const HOS = mascote(M("#5b8fd9", { roughness: .5 }), M("#141014", { roughness: .3 })); HOS.g.scale.setScalar(.82); const mala = box(.45, .55, .2, M("#8a5a33"), S, 0, 0, 0);
// balões de fala 3D (NOME? / já sei!)
const balT = (txt, cor) => ctex(256, 128, g => { g.fillStyle = "#fff"; g.beginPath(); g.roundRect(6, 6, 244, 96, 30); g.fill(); g.beginPath(); g.moveTo(60, 100); g.lineTo(40, 126); g.lineTo(96, 100); g.fill(); g.fillStyle = cor; g.font = "400 64px BB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 128, 58); });
const BAL1 = mesh(new THREE.PlaneGeometry(1.0, .5), new THREE.MeshBasicMaterial({ map: balT("SEU NOME?", VERM), transparent: true }), S); BAL1.castShadow = false;
const BAL2 = mesh(new THREE.PlaneGeometry(1.0, .5), new THREE.MeshBasicMaterial({ map: balT("OI, ANA!", PET2), transparent: true }), S); BAL2.castShadow = false;

// ---------- mascote recepcionista: faixa de colete no topo + crachá no braço ----------
const COL = new THREE.Group(); COL.position.set(0, 1.48, 0); MAS.corpo.add(COL); box(1.54, .1, 1.04, M(PET2), COL, 0, 0, 0); box(1.55, .03, 1.05, M(LAT, { metalness: .6 }), COL, 0, .06, 0);
const crT = ctex(128, 80, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 128, 80); g.fillStyle = PET; g.fillRect(0, 0, 128, 22); g.fillStyle = TINTA; g.font = "400 30px BB"; g.textAlign = "center"; g.fillText("RECEPÇÃO", 64, 60); });
const cra = mesh(new THREE.PlaneGeometry(.26, .16), new THREE.MeshStandardMaterial({ map: crT }), MAS.bracos[1], .2, 0, .16); cra.castShadow = false;
const RX = -.9, RZ = -.85;
const escreve = lt => { const k = Math.sin(lt * 16); pose(MAS, { x: RX, z: RZ, y: .6, ry: 0, braco: [.5, 1.0 + k * .12], piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(lt * 5) * .02; };
const pergunta = lt => { pose(MAS, { x: RX, z: RZ, y: .6 + hop(lt, .6, .03), ry: .25, braco: [.3, 1.3 + Math.sin(lt * 6) * .2], piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(lt * 3) * .05; };
const feliz = lt => { pose(MAS, { x: RX, z: RZ, y: .6 + hop(lt, .35, .2), ry: .2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const hosp = (lt, x) => { pose(HOS, { x, z: .45, y: hop(lt, .9, .02), ry: -.6, braco: [.3, .5], andar: 0, piscar: pisca(lt + 1.3) }); HOS.g.rotation.z = 0; mala.position.set(x + .8, .28, .55); };
const chega = (lt, x0, x1, d = 1.2) => { const k = eio(lin(lt, 0, d)); const x = x0 + (x1 - x0) * k; pose(HOS, { x, z: .45, y: 0, ry: -1.2 + k * .6, braco: [.3, .5], andar: lt * 2 * (k < 1 ? 1 : 0), piscar: pisca(lt + 1.3) }); mala.position.set(x + .9, .28, .55); };

grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = () => { BAL1.visible = false; BAL2.visible = false; FICHA.visible = false; };
const bal = (B, k, x, y) => { B.visible = k > .01; B.scale.setScalar(Math.max(.01, back(k))); B.position.set(x, y, -.3); B.lookAt(cam.position); };

// ---------- travelling lateral ----------
const TR = { gancho: [-.5, .3], s1: [.4, -.2], s3: [-.4, .2], s2: [.3, -.3], s4: [-.3, .5], cta: [.1, -.1] };
const SHOTS = {}; Object.keys(TR).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a, b] = TR[nome] || TR.cta, x = a + (b - a) * eio(lt / d); cam.position.set(x, 2.1, 6.6); cam.lookAt(x * .6 + .1, 1.2, -.5); };

const ACT = {
  gancho(lt, d) { reset(); hosp(lt, 1.7); bal(BAL1, Math.min(1, .7 + .3 * Math.abs(Math.sin(lt * 3))), RX + .4, 3.05); pergunta(lt); },
  s1(lt, d) { reset(); hosp(lt, 1.7); FICHA.visible = true; ficha(0, 0); const k = back(lin(lt, .3, .8)); FICHA.scale.setScalar(Math.max(.01, k)); pergunta(lt); },
  s3(lt, d) { reset(); hosp(lt, 1.7); FICHA.visible = true; ficha(lin(lt, .2, d - .3), 0); escreve(lt); },
  s2(lt, d) { reset(); hosp(lt, 1.7); FICHA.visible = true; ficha(1, eo(lin(lt, .3, .6))); if (lt < .8) escreve(lt); else feliz(lt); },
  s4(lt, d) { reset(); FICHA.visible = false; chega(lt, 3.8, 1.7); bal(BAL2, lin(lt, 1.3, 1.6), RX + .4, 3.05); if (lt < 1.3) pergunta(lt); else feliz(lt); },
  cta(lt, d) { reset(); hosp(lt, 1.7); bal(BAL2, 1, RX + .4, 3.05); feliz(lt); },
};

// ---------- elementos de tela (2D): entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 22) { X.font = `400 ${f}px BB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(233,241,242,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s2") { const p = back(lin(lt, .2, .55)); X.save(); X.translate(505, 650); X.scale(p, p); X.fillStyle = LAT; X.beginPath(); X.roundRect(-380, -52, 760, 104, 52); X.fill(); X.fillStyle = TINTA; X.font = "400 76px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 5); X.restore(); } },
    etiqueta(t, nome) { // placa de aeroporto (fundo petróleo, seta e texto amarelo)
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.fillStyle = "#16262c"; X.beginPath(); X.roundRect(-455, -128, 910, 256, 14); X.fill(); X.fillStyle = LAT; X.fillRect(-455, -128, 910, 10);
      X.fillStyle = "#ffd23f"; X.beginPath(); X.moveTo(-420, -70); X.lineTo(-370, -70); X.lineTo(-370, -92); X.lineTo(-330, -50); X.lineTo(-370, -8); X.lineTo(-370, -30); X.lineTo(-420, -30); X.closePath(); X.fill();
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = "#ffd23f"; cabe(76, l1, 720); X.fillText(l1, -310, -24); X.fillStyle = "#fff"; cabe(56, l2, 840); X.fillText(l2, -420, 46); X.fillStyle = "#9fd6e3"; cabe(50, l3, 840); X.fillText(l3, -420, 104); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { // karaokê com marca-texto latão
      const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 84; X.font = `400 ${fs}px BB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 860 && fs > 46) { fs -= 2; X.font = `400 ${fs}px BB`; }
      const W = tot(), y = 1400; let x = 505 - W / 2; const xs = c.map(w => { const r = [x, X.measureText(w.w).width]; x += X.measureText(w.w + " ").width; return r; });
      let fim = xs[0][0] - 10; c.forEach((w, i) => { const k = lin(t, w.t0, w.t1); if (k > 0) fim = xs[i][0] + xs[i][1] * k + 10; });
      X.fillStyle = "rgba(255,255,255,.9)"; X.beginPath(); X.roundRect(xs[0][0] - 24, y - fs * .62, W + 30, fs * 1.18, 14); X.fill();
      X.fillStyle = "rgba(201,162,39,.75)"; X.beginPath(); X.roundRect(xs[0][0] - 14, y - fs * .4, Math.max(0, fim - xs[0][0] + 14), fs * .76, 8); X.fill();
      X.textAlign = "left"; X.textBaseline = "middle"; c.forEach((w, i) => { X.fillStyle = TINTA; X.fillText(w.w, xs[i][0], y + 4); }); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .42) return; const u = eio(lt / .42), x = 1080 - u * 1500;
      X.save(); X.fillStyle = PET2; X.beginPath(); X.moveTo(x, 0); X.quadraticCurveTo(x - 160, 960, x, 1920); X.lineTo(x + 420, 1920); X.lineTo(x + 420, 0); X.closePath(); X.fill();
      const g = X.createLinearGradient(x - 80, 0, x + 120, 0); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(.6, "rgba(0,0,0,.25)"); g.addColorStop(1, "rgba(0,0,0,0)"); X.fillStyle = g; X.fillRect(x - 80, 0, 200, 1920); X.restore(); },
    fechamento(lt) { // página de caderno com o que escrever
      X.save(); X.translate(505, 1020); X.rotate(.01); X.fillStyle = "#fffdf6"; X.shadowColor = "rgba(0,0,0,.2)"; X.shadowBlur = 20; X.fillRect(-440, -320, 880, 640); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(15,76,92,.22)"; X.lineWidth = 2; for (let y = -250; y < 320; y += 64) { X.beginPath(); X.moveTo(-440, y); X.lineTo(440, y); X.stroke(); } X.strokeStyle = "rgba(192,57,43,.45)"; X.beginPath(); X.moveTo(-370, -320); X.lineTo(-370, 320); X.stroke();
      X.fillStyle = PET; X.font = "400 56px BB"; X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillText("CONTA PRA IA, UMA VEZ SÓ:", -340, -200);
      ["quem você é", "o que você faz", "como quer a resposta"].forEach((l, i) => { const a = eo(lin(lt, .15 + i * .2, .5 + i * .2)); X.globalAlpha = a; X.fillStyle = TINTA; X.font = "700 54px CV"; X.fillText("✓ " + l, -330 + (1 - a) * 30, -122 + i * 64); });
      X.globalAlpha = 1; const p = back(lin(lt, .8, 1.2)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(0, 150); X.scale(p, p); X.fillStyle = PET; X.beginPath(); X.roundRect(-380, -62, 760, 124, 62); X.fill();
      X.fillStyle = "#fff"; X.font = "400 76px BB"; X.textAlign = "center"; X.textBaseline = "middle"; const w1 = X.measureText("COMENTA ").width, w2 = X.measureText(CHAVE).width; X.textAlign = "left"; X.fillText("COMENTA ", -(w1 + w2) / 2, 5); X.fillStyle = "#ffd23f"; X.fillText(CHAVE, -(w1 + w2) / 2 + w1, 5); X.restore();
      if (lt > 1.2) { X.globalAlpha = eo(lin(lt, 1.2, 1.6)); X.fillStyle = PET2; X.font = "400 44px BB"; X.textAlign = "center"; X.fillText("É SÓ TROCAR PELOS SEUS DADOS", 0, 268); X.globalAlpha = 1; } X.restore(); },
  }; };
const cores = { LAR: LAT, VERDE: PET2, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

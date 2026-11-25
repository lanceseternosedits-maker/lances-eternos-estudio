// Reel ⚙️ como funciona "Sua IA parou no tempo" (data de corte + pedir busca/fonte; 15/11 09:00). Motor da cena_contagem.
// Identidade: banca de jornal de esquina ao amanhecer: a "IA" é um arquivo de jornais velhos e amarelados atrás do balcão, com um
// calendário de parede parado numa data ("DATA DE CORTE"); o mascote jornaleiro chega de bicicleta-de-blocos e entrega o jornal do dia
// (o link), que acende uma antena no telhado da banca (a busca na internet). Verde-banca + papel-jornal + vermelho-manchete.
// Elementos: papel rasgado com fita, nome em máquina de escrever, placar HI-SCORE (ilustrativo), karaokê com marca-texto, virada de página,
// câmera na mão, tela CONTINUE?, Fraunces. Mascote de boné de jornaleiro; ação principal: entregar o jornal do dia.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const VB = "#1f6e4a", VB2 = "#124a31", JORN = "#efe9da", AMAREL = "#d9c48f", VERM = "#d93a3a", TINTA = "#1d1c19", FUNDO = "#f5f1e6", AMAR = "#ffd23f", CEU = "#ffc9a3";
rim.color.set(0xffd8b0); rim.intensity = 1.5; key.color.set(0xfff0e0); key.intensity = 145; key.position.set(3, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xffeedd, .6));
// ---------- rua ao amanhecer ----------
const ceuT = ctex(512, 256, (g, w, h) => { const sk = g.createLinearGradient(0, 0, 0, h); sk.addColorStop(0, "#9fc3ef"); sk.addColorStop(.7, CEU); g.fillStyle = sk; g.fillRect(0, 0, w, h); g.fillStyle = "#b7a59a"; for (let i = 0; i < 8; i++) g.fillRect(i * 66, 120 - (i * 29) % 70, 56, 140); g.fillStyle = "rgba(255,240,200,.7)"; for (let i = 0; i < 30; i++) g.fillRect((i * 47) % w + 8, 130 + (i * 13) % 80, 8, 10); });
mesh(new THREE.PlaneGeometry(26, 12), new THREE.MeshBasicMaterial({ map: ceuT }), S, 0, 5, -5).castShadow = false;
const calT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#b9b2a4"; g.fillRect(0, 0, w, h); g.strokeStyle = "#a59e90"; g.lineWidth = 3; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, h); g.stroke(); g.beginPath(); g.moveTo(0, i * 32); g.lineTo(w, i * 32); g.stroke(); } }); calT.wrapS = calT.wrapT = THREE.RepeatWrapping; calT.repeat.set(6, 4);
const chao = mesh(new THREE.PlaneGeometry(26, 14), new THREE.MeshStandardMaterial({ map: calT, roughness: .9 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// banca de jornal
const BAN = new THREE.Group(); BAN.position.set(-.7, 0, -1.9); S.add(BAN); const vb = M(VB, { roughness: .5 });
box(3.2, 2.4, 1.2, vb, BAN, 0, 1.2, -.3); box(3.4, .12, 1.6, M(VB2), BAN, 0, 2.46, -.2); box(3.0, 1.5, .02, new THREE.MeshStandardMaterial({ color: "#cfe6f0", transparent: true, opacity: .18, roughness: .05 }), BAN, 0, 1.35, .31); box(2.9, 1.4, .02, M("#fff6e0", { roughness: 1 }), BAN, 0, 1.35, -.85);
const manT = ctex(512, 96, g => { g.fillStyle = VERM; g.fillRect(0, 0, 512, 96); g.fillStyle = "#fff"; g.font = "900 60px FR"; g.textAlign = "center"; g.fillText("BANCA", 256, 68); }); mesh(new THREE.PlaneGeometry(2.2, .42), new THREE.MeshBasicMaterial({ map: manT }), BAN, 0, 2.15, .33).castShadow = false;
// arquivo de jornais velhos (a IA) dentro da banca
const PIL = []; for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) PIL.push(box(.5, .08 + (i + j) % 3 * .1, .4, M(AMAREL, { roughness: 1 }), BAN, -1.1 + i * .7, .9 + j * .42, .1));
// calendário parado
const calC = document.createElement("canvas"); calC.width = 200; calC.height = 240; const cg = calC.getContext("2d"); const calTx = new THREE.CanvasTexture(calC); calTx.colorSpace = THREE.SRGBColorSpace;
const desCal = (sacode) => { cg.fillStyle = "#fff"; cg.fillRect(0, 0, 200, 240); cg.fillStyle = VERM; cg.fillRect(0, 0, 200, 56); cg.fillStyle = "#fff"; cg.font = "900 34px FR"; cg.textAlign = "center"; cg.fillText("DATA DE", 100, 30); cg.font = "900 22px FR"; cg.fillText("CORTE", 100, 52); cg.fillStyle = TINTA; cg.font = "900 110px FR"; cg.fillText("?", 100, 180); cg.font = "700 20px FR"; cg.fillStyle = "#777"; cg.fillText("parou aqui", 100, 222); calTx.needsUpdate = true; };
const CAL = mesh(new THREE.PlaneGeometry(.5, .6), new THREE.MeshBasicMaterial({ map: calTx }), BAN, 1.25, 1.75, .34); CAL.castShadow = false; desCal();
// antena (busca na internet)
const ANT = new THREE.Group(); ANT.position.set(.4, 2.5, -1.9); S.add(ANT); box(.04, .7, .04, M("#999", { metalness: .8 }), ANT, 0, .35, 0); const pontaA = mesh(new THREE.SphereGeometry(.07, 10, 8), E("#7cf2a8", 0), ANT, 0, .74, 0);
const ONDAS = [0, 1, 2].map(i => { const m = mesh(new THREE.TorusGeometry(.2 + i * .15, .015, 6, 24), new THREE.MeshBasicMaterial({ color: "#7cf2a8", transparent: true }), ANT, 0, .74, 0); m.castShadow = false; m.visible = false; return m; });
// jornal do dia (na mão do mascote → no balcão)
const jdT = ctex(256, 320, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 256, 320); g.fillStyle = TINTA; g.font = "900 34px FR"; g.textAlign = "center"; g.fillText("HOJE", 128, 46); g.fillStyle = VERM; g.fillRect(16, 60, 224, 6); g.fillStyle = "#333"; for (let i = 0; i < 10; i++) g.fillRect(20, 84 + i * 22, 216 - (i % 3) * 40, 8); g.fillStyle = "#2f6fd6"; g.font = "700 20px FR"; g.fillText("link da notícia", 128, 306); });
const JD = mesh(new THREE.PlaneGeometry(.44, .55), new THREE.MeshStandardMaterial({ map: jdT, side: THREE.DoubleSide }), S); JD.castShadow = false;
// ---------- mascote: boné de jornaleiro ----------
const BON = new THREE.Group(); BON.position.set(0, 1.5, 0); MAS.corpo.add(BON); mesh(new THREE.CylinderGeometry(.66, .7, .18, 28), M("#5a4632", { roughness: .9 }), BON, 0, .05, 0); box(.9, .04, .4, M("#4a3826"), BON, 0, -.02, .6);
const MX = 1.4, MZ = .8;
const segura = (lt, ry = -.4) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, 1.0], piscar: pisca(lt) }); MAS.g.rotation.z = 0; JD.visible = true; JD.position.set(MX - .55, 1.35, MZ + .25); JD.rotation.set(0, -.4, .1); };
const entrega = (lt, t0) => { const u = Math.max(0, Math.min(1, (lt - t0) / .9)); pose(MAS, { x: MX - u * .9, z: MZ - u * .6, y: hop(lt, .4, .05), ry: -.6, braco: [.3, 1.0 + u * .6], piscar: pisca(lt) }); MAS.g.rotation.z = 0;
  JD.visible = true; JD.position.set(MX - .55 - u * 1.3, 1.35 - u * .05, MZ + .25 - u * 1.9); JD.rotation.set(-u * .3, -.4 + u * .4, .1); return u >= 1; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ + .5, y: hop(lt, .35, .22), ry: -.25, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let DIAS = 0;
const reset = (lt) => { JD.visible = false; ONDAS.forEach(o => o.visible = false); pontaA.material.emissiveIntensity = 0; CAL.rotation.z = 0; };
const busca = lt => { pontaA.material.emissiveIntensity = 2 + Math.sin(lt * 8); ONDAS.forEach((o, i) => { const u = (lt * .8 + i / 3) % 1; o.visible = true; o.scale.setScalar(.6 + u * 1.4); o.material.opacity = 1 - u; o.rotation.x = Math.PI / 2; }); };
// ---------- câmera na mão ----------
const BS = { gancho: [V(.2, 2.5, 7.2), V(-.2, 1.5, -1.4)], s1: [V(.6, 2.2, 6.2), V(.3, 1.6, -1.6)], s2: [V(-.2, 2.6, 6.8), V(-.3, 1.9, -1.6)], s3: [V(.4, 2.4, 6.6), V(0, 1.6, -1.2)], s4: [V(0, 2.5, 6.8), V(-.1, 1.8, -1.4)], cta: [V(0, 2.4, 7.4), V(0, 1.5, -1.0)] };
const SHOTS = {}; Object.keys(BS).forEach(n => { const s = [BS[n][0], BS[n][1]]; SHOTS[n] = [s, s]; });
const camera = (cam, nome, lt, d, t) => { const [p, l] = BS[nome] || BS.cta, u = lt / d; const nx = Math.sin(t * 1.3) * .05 + Math.sin(t * 3.7) * .02, ny = Math.sin(t * 1.7 + 1) * .04 + Math.sin(t * 4.3) * .015;
  cam.position.set(p.x + nx, p.y + ny, p.z - u * .35); cam.lookAt(l.x + nx * .4, l.y + ny * .4, l.z); cam.rotateZ(Math.sin(t * 1.1) * .012); };
const ACT = {
  gancho(lt, d) { reset(lt); DIAS = 0; segura(lt, -.2); },
  s1(lt, d) { reset(lt); CAL.rotation.z = Math.sin(lt * 3) * .04; DIAS = lin(lt, .3, d) * 180; segura(lt, -.5); },
  s2(lt, d) { reset(lt); DIAS = 180 + lin(lt, 0, d) * 60; if (lt > d * .55) busca(lt); segura(lt, -.3); },
  s3(lt, d) { reset(lt); DIAS = 240; entrega(lt, .3); if (lt > 1.2) busca(lt); },
  s4(lt, d) { reset(lt); DIAS = 0; JD.visible = true; JD.position.set(-.1, 1.0, -1.4); JD.rotation.set(-.3, 0, .1); busca(lt); pose(MAS, { x: MX - .9, z: MZ - .6, y: hop(lt, .8, .03), ry: -.3, braco: [.3, .6], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
  cta(lt, d) { reset(lt); JD.visible = true; JD.position.set(-.1, 1.0, -1.4); busca(lt); feliz(lt); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx, peso = 900) => { while (f > 20) { X.font = `${peso} ${f}px FR`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const rasgado = (x, y, w, h, s) => { X.beginPath(); X.moveTo(x, y); for (let i = 0; i <= 40; i++) X.lineTo(x + w * i / 40, y + ((i * 7 + s) % 5) * 2.4 - 4); for (let i = 0; i <= 40; i++) X.lineTo(x + w - w * i / 40, y + h + ((i * 11 + s) % 6) * 2.6 - 6); X.closePath(); };
  const maquina = (txt, x, y, lt, t0, fs, cor = TINTA) => { if (lt < t0) return; const n = Math.min(txt.length, Math.floor((lt - t0) * 22)); X.font = `700 ${cabe(fs, txt, 860, 700)}px FR`; X.textAlign = "left"; X.textBaseline = "middle"; const s = txt.slice(0, n), w = X.measureText(txt).width;
    X.fillStyle = "rgba(255,255,255,.95)"; X.beginPath(); X.roundRect(x - 22, y - fs * .75, w + 56, fs * 1.5, 12); X.fill(); X.fillStyle = cor; X.fillText(s, x, y + 3); if (n < txt.length || Math.floor(lt * 3) % 2) X.fillRect(x + X.measureText(s).width + 4, y - fs * .38, 6, fs * .76); };
  const placar = (v, x, y) => { X.fillStyle = "#121212"; X.beginPath(); X.roundRect(x - 170, y - 80, 340, 168, 14); X.fill(); X.strokeStyle = AMAR; X.lineWidth = 5; X.stroke(); X.fillStyle = AMAR; X.font = "400 20px PS"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("HI-SCORE", x, y - 50);
    X.fillStyle = "#fff"; X.font = "900 64px FR"; X.fillText(Math.round(v), x, y + 4); X.fillStyle = "#cfc9b8"; X.font = "700 20px FR"; X.fillText("dias sem notícia (exemplo)", x, y + 56); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(245,241,230,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1" || nome === "s2") placar(DIAS, 790, 770);
      if (nome === "s2") maquina("DATA DE CORTE", 90, 700, lt, .3, 64, VERM);
      if (nome === "s4") { maquina("pesquise na internet antes de responder", 90, 690, lt, .4, 46); maquina("e me mostre as fontes", 90, 770, lt, 2.2, 46, VB); } },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(-.012); X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 16; X.shadowOffsetY = 6; X.fillStyle = JORN; rasgado(-450, -122, 900, 244, 7); X.fill(); X.shadowColor = "transparent";
      X.fillStyle = "rgba(217,58,58,.4)"; for (const [x, r] of [[-405, -.5], [405, .5]]) { X.save(); X.translate(x, -114); X.rotate(r); X.fillRect(-70, -18, 140, 36); X.restore(); }
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(72, l1, 840); X.fillText(l1, 0, -30); X.fillStyle = VERM; cabe(56, l2, 840); X.fillText(l2, 0, 34); X.fillStyle = VB; cabe(46, l3, 840, 700); X.fillText(l3, 0, 92); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 76; X.font = `900 ${fs}px FR`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 840 && fs > 44) { fs -= 2; X.font = `900 ${fs}px FR`; }
      const y = 1400; let x = 505 - tot() / 2; const xs = c.map(w => { const r = [x, X.measureText(w.w).width]; x += X.measureText(w.w + " ").width; return r; });
      let fim = xs[0][0] - 10; c.forEach((w, i) => { const k = lin(t, w.t0, w.t1); if (k > 0) fim = xs[i][0] + xs[i][1] * k + 10; });
      X.fillStyle = "rgba(255,210,63,.9)"; X.beginPath(); X.roundRect(xs[0][0] - 14, y - fs * .45, Math.max(0, fim - xs[0][0] + 14), fs * .84, 8); X.fill();
      X.textAlign = "left"; X.textBaseline = "middle"; c.forEach((w, i) => { X.fillStyle = TINTA; X.lineWidth = 10; X.strokeStyle = "#fff"; X.lineJoin = "round"; X.strokeText(w.w, xs[i][0], y + 4); X.fillText(w.w, xs[i][0], y + 4); }); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .42) return; const u = eio(lt / .42), x = 1080 - u * 1500;
      X.save(); X.fillStyle = JORN; X.beginPath(); X.moveTo(x, 0); X.quadraticCurveTo(x - 160, 960, x, 1920); X.lineTo(x + 420, 1920); X.lineTo(x + 420, 0); X.closePath(); X.fill();
      const g = X.createLinearGradient(x - 80, 0, x + 120, 0); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(.6, "rgba(0,0,0,.2)"); g.addColorStop(1, "rgba(0,0,0,0)"); X.fillStyle = g; X.fillRect(x - 80, 0, 200, 1920); X.restore(); },
    fechamento(lt) { // CONTINUE? compacto (o mascote fica visível embaixo)
      X.fillStyle = "rgba(18,74,49,.92)"; X.beginPath(); X.roundRect(90, 650, 830, 440, 30); X.fill(); X.strokeStyle = AMAR; X.lineWidth = 6; X.stroke();
      X.textAlign = "center"; X.textBaseline = "middle"; X.fillStyle = "#fff"; X.font = "900 80px FR"; X.fillText("CONTINUE?", 505, 715); const n = Math.max(0, 9 - Math.floor(lt * 1.6)); X.fillStyle = AMAR; X.font = "900 110px FR"; X.save(); X.translate(505, 830); const pp = 1 + .12 * (1 - ((lt * 1.6) % 1)); X.scale(pp, pp); X.fillText(String(n), 0, 0); X.restore();
      const p = back(lin(lt, .5, .9)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 950); X.scale(p, p); X.fillStyle = VERM; X.beginPath(); X.roundRect(-280, -58, 560, 116, 58); X.fill(); X.fillStyle = "#fff"; X.font = `900 ${cabe(70, "Comenta " + CHAVE, 520)}px FR`; X.fillText("Comenta " + CHAVE, 0, 4); X.restore();
      if (lt > 1.0) { X.globalAlpha = eo(lin(lt, 1.0, 1.4)); X.fillStyle = "#e9f2ec"; X.font = "700 36px FR"; X.fillText("e recebe o prompt da notícia fresca", 505, 1045); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: VB, VERDE: AMAR, FUNDO, CREME: JORN, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

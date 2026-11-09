// Reel 📜 história "1950: máquinas podem pensar?" (Alan Turing, "Computing Machinery and Intelligence"; 11/11 17:00). Motor da cena_contagem.
// Identidade: escritório britânico de 1950: escrivaninha com máquina de escrever, xícara de chá, quadro-negro "CAN MACHINES THINK?",
// e uma cortina dividindo o palco em dois (o jogo da imitação): do lado esquerdo uma pessoa de blocos (genérica), do direito uma
// máquina de válvulas; bilhetes passam por baixo da cortina. Verde-garrafa + creme. Nenhuma foto ou rosto de pessoa real.
// Elementos (trocados na produção para não repetir vizinhos): placa de rua, nome em split-flap, sem contador (história), uma palavra
// gigante por vez com pop, chicote de câmera, câmera na mão, cartões que viram, Caveat. Mascote de boina; ação: passar bilhetes.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, mascote, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const VG = "#1f5e46", VG2 = "#143f2f", CR = "#f6ecd6", TINTA = "#1e1a14", FUNDO = "#ece2c9", MAD = "#8a5a33", OURO = "#c9a227", VERM = "#a8322a";
rim.color.set(0xffe6b8); rim.intensity = 1.3; key.color.set(0xfff0d6); key.intensity = 140; key.position.set(1, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xfff0dc, .55));
// ---------- escritório ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#d8cba8"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(31,94,70,.12)"; for (let x = 0; x < w; x += 30) g.fillRect(x, 0, 12, h); g.fillStyle = VG; g.fillRect(0, 170, w, h - 170); g.fillStyle = MAD; g.fillRect(0, 166, w, 8); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const tT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 4; x++) { g.fillStyle = (x + y) % 2 ? "#6e4426" : "#7d4f2c"; g.fillRect(x * 64, y * 32, 64, 32); } }); tT.wrapS = tT.wrapT = THREE.RepeatWrapping; tT.repeat.set(6, 5);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: tT, roughness: .7 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// quadro-negro
const qT = ctex(512, 256, g => { g.fillStyle = "#24332b"; g.fillRect(0, 0, 512, 256); g.strokeStyle = MAD; g.lineWidth = 16; g.strokeRect(8, 8, 496, 240); g.fillStyle = "#f2f2e8"; g.font = "700 62px CV"; g.textAlign = "center"; g.fillText("Can machines think?", 256, 120); g.font = "700 40px CV"; g.fillText("— A. M. Turing, 1950", 256, 190); });
mesh(new THREE.PlaneGeometry(3.2, 1.6), new THREE.MeshStandardMaterial({ map: qT, roughness: .9 }), S, 0, 2.9, -2.7);
// cortina no meio (divide pessoa × máquina)
const cortT = ctex(128, 256, (g, w, h) => { g.fillStyle = VERM; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 16) { const gr = g.createLinearGradient(x, 0, x + 16, 0); gr.addColorStop(0, "rgba(0,0,0,.25)"); gr.addColorStop(.5, "rgba(255,255,255,.08)"); gr.addColorStop(1, "rgba(0,0,0,.25)"); g.fillStyle = gr; g.fillRect(x, 0, 16, h); } });
const pano = mesh(new THREE.PlaneGeometry(2.4, 2.2), new THREE.MeshStandardMaterial({ map: cortT, side: THREE.DoubleSide }), S, .15, 1.25, -1.3); pano.rotation.y = 1.15; const trilho = box(.06, .06, 2.6, M(OURO, { metalness: .6 }), S, .15, 2.38, -1.3); trilho.rotation.y = 1.15 - Math.PI / 2;
// lado esquerdo: pessoa genérica de blocos (cinza-azulada) numa escrivaninha; lado direito: máquina de válvulas
const PES = mascote(M("#7b8fa6", { roughness: .6 }), M("#141014", { roughness: .3 })); PES.g.scale.setScalar(.85);
box(1.3, .08, .7, M(MAD), S, -1.7, .85, -1.1); for (const [x, z] of [[-2.25, -1.35], [-1.15, -1.35], [-2.25, -.85], [-1.15, -.85]]) box(.06, .85, .06, M("#5c3a20"), S, x, .42, z);
const MQ = new THREE.Group(); MQ.position.set(-1.7, .89, -1.05); S.add(MQ); box(.55, .17, .4, M("#262626", { roughness: .4 }), MQ, 0, .085, 0); box(.6, .07, .1, M("#333"), MQ, 0, .25, -.12); const folhaMq = box(.38, .32, .01, M(CR), MQ, 0, .38, -.14);
const xic = new THREE.Group(); xic.position.set(-1.2, .89, -.95); S.add(xic); mesh(new THREE.CylinderGeometry(.09, .07, .12, 16), M("#fff"), xic, 0, .06, 0); mesh(new THREE.CylinderGeometry(.16, .16, .01, 16), M("#fff"), xic, 0, .005, 0);
const VAPOR = [0, 1, 2].map(i => { const m = mesh(new THREE.SphereGeometry(.04, 8, 6), new THREE.MeshBasicMaterial({ color: "#fff", transparent: true, opacity: .4 }), S); m.castShadow = false; return m; });
const MAQ = new THREE.Group(); MAQ.position.set(1.7, 0, -1.2); S.add(MAQ); box(1.3, 1.9, .7, M("#3d4a43", { metalness: .3, roughness: .5 }), MAQ, 0, .95, 0);
const VALV = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) VALV.push(mesh(new THREE.CylinderGeometry(.07, .07, .2, 10), E("#ffb347", .5), MAQ, -.42 + c * .28, 1.2 + r * .25, .38));
const fitaT = ctex(128, 32, g => { g.fillStyle = CR; g.fillRect(0, 0, 128, 32); g.fillStyle = TINTA; for (let i = 0; i < 12; i++) if ((i * 7) % 3) g.fillRect(6 + i * 10, 10, 5, 12); }); box(.8, .06, .2, new THREE.MeshStandardMaterial({ map: fitaT }), MAQ, 0, .55, .4);
// bilhetes passando por baixo da cortina
const bilT = (txt) => ctex(200, 120, g => { g.fillStyle = CR; g.fillRect(0, 0, 200, 120); g.fillStyle = TINTA; g.font = "700 34px CV"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 100, 62); });
const BIL = ["Você é gente?", "Claro que sou.", "Quanto é 34957 + 70764?"].map(t => { const m = mesh(new THREE.PlaneGeometry(.6, .36), new THREE.MeshStandardMaterial({ map: bilT(t), side: THREE.DoubleSide }), S); m.rotation.x = -Math.PI / 2 + .3; m.visible = false; return m; });
// ---------- mascote: boina (no topo); passa os bilhetes, na frente da cortina ----------
const BOI = new THREE.Group(); BOI.position.set(-.1, 1.52, 0); BOI.rotation.z = .15; MAS.corpo.add(BOI); mesh(new THREE.CylinderGeometry(.62, .68, .12, 32), M("#2b2b33", { roughness: .9 }), BOI, 0, 0, 0); mesh(new THREE.SphereGeometry(.05, 8, 6), M("#2b2b33"), BOI, 0, .09, 0);
const MX = .55, MZ = .75;
const passa = lt => { const k = Math.sin(lt * 2.4); pose(MAS, { x: MX + k * .15, z: MZ, y: hop(lt, .6, .03), ry: k * .3, braco: [.7 + Math.max(0, -k) * .8, .7 + Math.max(0, k) * .8], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const olha = (lt, ry = 0) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .5 + Math.sin(lt * 2) * .1], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .24), ry: 0, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = (lt) => { BIL.forEach(b => b.visible = false); VALV.forEach((v, i) => v.material.emissiveIntensity = .4 + .6 * Math.max(0, Math.sin(lt * 5 + i * 1.7))); VAPOR.forEach((m, i) => { const u = (lt * .4 + i / 3) % 1; m.position.set(-1.2 + Math.sin(u * 6) * .04, 1.05 + u * .5, -.95); m.material.opacity = .4 * (1 - u); });
  pose(PES, { x: -1.7, z: -.55, y: 0, ry: Math.PI, braco: [.8 + Math.sin(lt * 18) * .1, .8 - Math.sin(lt * 18) * .1], piscar: 1 }); PES.g.rotation.y = Math.PI; folhaMq.position.y = .38 + (lt % 3) * .01; };
const voa = (b, de, ate, k) => { b.visible = k > 0 && k < 1; const e = eio(k); b.position.lerpVectors(de, ate, e); b.position.y = .25 + Math.sin(k * Math.PI) * .2; };
// ---------- câmera na mão ----------
const BS = { gancho: [V(0, 2.3, 6.8), V(0, 1.6, -1.2)], s1: [V(-.5, 2.1, 6.0), V(-.3, 1.9, -2)], s2: [V(.2, 2.2, 6.4), V(0, 1.2, -1.0)], s3: [V(.5, 2.0, 6.0), V(.4, 1.3, -1.0)], s4: [V(-.3, 2.2, 6.4), V(.3, 1.4, -1.2)], cta: [V(0, 2.3, 7.0), V(0, 1.5, -1.0)] };
const SHOTS = {}; Object.keys(BS).forEach(n => SHOTS[n] = [BS[n], BS[n]]);
const camera = (cam, nome, lt, d, t) => { const [p, l] = BS[nome] || BS.cta, u = lt / d; const nx = Math.sin(t * 1.3) * .05 + Math.sin(t * 3.7) * .02, ny = Math.sin(t * 1.7 + 1) * .04 + Math.sin(t * 4.3) * .015;
  cam.position.set(p.x + nx, p.y + ny, p.z - u * .35); cam.lookAt(l.x + nx * .4, l.y + ny * .4, l.z); cam.rotateZ(Math.sin(t * 1.1) * .012); };
const ACT = {
  gancho(lt) { reset(lt); olha(lt); },
  s1(lt) { reset(lt); olha(lt, -.3); },
  s2(lt, d) { reset(lt); voa(BIL[0], V(-1.4, .3, -.4), V(1.2, .3, -.4), lin(lt, .4, 2.0)); voa(BIL[1], V(1.2, .3, -.4), V(-1.4, .3, -.4), lin(lt, 2.4, 4.0)); passa(lt); },
  s3(lt, d) { reset(lt); voa(BIL[2], V(-1.4, .3, -.4), V(1.2, .3, -.4), lin(lt, .3, 1.9)); passa(lt); },
  s4(lt, d) { reset(lt); olha(lt, .2); },
  cta(lt) { reset(lt); feliz(lt); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `700 ${f}px CV`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const CHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const flap = (alvo, x, y, tw, lt, t0) => { for (let i = 0; i < alvo.length; i++) { const c = alvo[i], k = lin(lt, t0 + i * .05, t0 + i * .05 + .5), xx = x + i * (tw + 5); X.fillStyle = "#1b1b1b"; X.beginPath(); X.roundRect(xx, y - tw * .7, tw, tw * 1.4, 5); X.fill(); if (c === " ") continue;
    X.fillStyle = k >= 1 ? OURO : "#ccc"; X.font = `700 ${Math.round(tw * 1.1)}px SG`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(k >= 1 ? c : CHS[(Math.floor(lt * 30) + i * 7) % CHS.length], xx + tw / 2, y + 3); X.fillStyle = "rgba(0,0,0,.5)"; X.fillRect(xx, y - 1, tw, 3); } };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(236,226,201,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") { X.fillStyle = "rgba(20,20,20,.85)"; X.beginPath(); X.roundRect(110, 610, 780, 120, 16); X.fill(); flap("ALAN TURING", 150, 670, 52, lt, .2); }
      if (nome === "s2") { X.fillStyle = "rgba(20,20,20,.85)"; X.beginPath(); X.roundRect(70, 610, 870, 120, 16); X.fill(); flap("JOGO DA IMITAÇÃO".replace("Ç", "C").replace("Ã", "A"), 96, 670, 46, lt, .2); }
      if (nome === "s4") { X.fillStyle = "rgba(255,255,255,.92)"; X.beginPath(); X.roundRect(90, 615, 830, 120, 18); X.fill(); X.fillStyle = VG; X.font = "700 58px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("aposta: até o ano 2000, em 5 minutos", 505, 675); } },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.fillStyle = "#4a3a28"; X.fillRect(-300, 110, 16, 70); X.fillRect(284, 110, 16, 70);
      X.fillStyle = VG; X.beginPath(); X.roundRect(-455, -128, 910, 256, 14); X.fill(); X.strokeStyle = CR; X.lineWidth = 6; X.beginPath(); X.roundRect(-440, -113, 880, 226, 8); X.stroke();
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = "#fff"; cabe(74, l1, 830); X.fillText(l1, 0, -30); X.fillStyle = OURO; cabe(56, l2, 830); X.fillText(l2, 0, 32); X.fillStyle = "#cfe8dc"; cabe(50, l3, 830); X.fillText(l3, 0, 90); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ws = seg.palavras; let w = ws.findIndex(x => t < x.t1 + .06); if (w < 0) w = ws.length - 1; const W = ws[w]; if (t < W.t0 - .25) return;
      const p = back(lin(t, W.t0 - .04, W.t0 + .14)); const txt = W.w.replace(/[,.:]$/, ""), chave = txt.replace(/[?!]/g, "").toUpperCase() === CHAVE;
      let f = 136; X.font = `700 ${f}px CV`; while (X.measureText(txt).width > 820 && f > 56) { f -= 4; X.font = `700 ${f}px CV`; }
      X.save(); X.translate(505, 1395); X.scale(.6 + .4 * p, .6 + .4 * p); X.textAlign = "center"; X.textBaseline = "middle"; X.lineWidth = 16; X.strokeStyle = "#fff"; X.lineJoin = "round"; X.strokeText(txt, 0, 0); X.fillStyle = chave ? VERM : VG2; X.fillText(txt, 0, 0); X.restore(); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .3) return; const k = 1 - lt / .3, cv = X.canvas; X.save(); for (let i = 1; i <= 6; i++) { X.globalAlpha = .22 * k; X.drawImage(cv, i * 70 * k, 0); X.drawImage(cv, -i * 50 * k, 0); } X.globalAlpha = .5 * k; X.fillStyle = "#fff"; for (let i = 0; i < 14; i++) X.fillRect(0, 300 + (i * 97) % 1200, 1080, 4 + (i % 3) * 3); X.restore(); },
    fechamento(lt) { // cartões que viram: 1950 · JOGO · ANO 2000
      [["1950", "a pergunta"], ["JOGO", "da imitação"], ["2000", "a aposta"]].forEach(([a, b], i) => { const k = lin(lt, .1 + i * .22, .55 + i * .22), sx = Math.abs(Math.cos(k * Math.PI)), frente = k > .5, x = 210 + i * 300, y = 860;
        X.save(); X.translate(x, y); X.scale(Math.max(.02, sx), 1); X.fillStyle = frente ? CR : VG; X.beginPath(); X.roundRect(-130, -170, 260, 340, 22); X.fill();
        if (frente) { X.fillStyle = VG; X.font = "700 76px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(a, 0, -20); X.fillStyle = "#6b5a40"; X.font = "700 44px CV"; X.fillText(b, 0, 56); } else { X.fillStyle = "#fff"; X.font = "700 140px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("?", 0, 8); } X.restore(); });
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 1170); X.scale(p, p); X.fillStyle = VERM; X.beginPath(); X.roundRect(-320, -66, 640, 132, 66); X.fill(); X.fillStyle = "#fff"; X.font = "700 84px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 6); X.restore();
      if (lt > 1.3) { X.globalAlpha = eo(lin(lt, 1.3, 1.7)); X.fillStyle = "#fff"; X.beginPath(); X.roundRect(205, 1282, 600, 76, 38); X.fill(); X.fillStyle = VG2; X.font = "700 52px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Salva pra contar pra alguém", 505, 1322); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: VG, VERDE: OURO, FUNDO, CREME: CR, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

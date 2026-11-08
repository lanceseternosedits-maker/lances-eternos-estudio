// Reel 📜 história "1956: prometeram a IA em 2 meses" (proposta de Dartmouth, 31/08/1955; encontro no verão de 1956; 10/11 17:00).
// Identidade: campus universitário no verão: gramado, fachada de tijolo genérica com torre de relógio (sem brasão nem nome),
// cadeiras de praia, mesa com máquina de escrever e a proposta datilografada, calendário JUL/AGO 1956 cujas folhas voam até 2026.
// Paleta verde-grama + amarelo-sol + tijolo. Elementos (trocados na produção para não repetir o "Mostra um exemplo" do mesmo dia):
// etiqueta em placa de campus, nome em letreiro split-flap, sem contador (história), legenda uma palavra gigante por vez com pop,
// transição chicote de câmera (whip pan), travelling lateral, fechamento em página de caderno, Fraunces.
// Mascote de chapéu de pescador amarelo (no topo); ação principal: datilografar a proposta.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const GRAMA = "#4caf50", GRAMA2 = "#2e7d32", SOL = "#ffc928", SOL2 = "#e0a100", TIJ = "#b5523b", CEU = "#9fd8ff", PAP = "#fffaf0", TINTA = "#1d2a1a", FUNDO = "#e8f6ff";
rim.color.set(0xfff0b0); rim.intensity = 1.3; key.color.set(0xfff7e0); key.intensity = 160; key.position.set(2, 10, 6); key.target.position.set(0, .8, 0);
S.add(new THREE.AmbientLight(0xf0faff, .6));

// ---------- cenário ----------
const ceuT = ctex(512, 256, (g, w, h) => { const sk = g.createLinearGradient(0, 0, 0, h); sk.addColorStop(0, "#6cc4ff"); sk.addColorStop(1, "#d8f1ff"); g.fillStyle = sk; g.fillRect(0, 0, w, h);
  g.fillStyle = "#fff"; [[80, 50], [300, 30], [430, 70]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 22, 0, 7); g.arc(x + 24, y - 8, 26, 0, 7); g.arc(x + 50, y, 20, 0, 7); g.fill(); }); });
mesh(new THREE.PlaneGeometry(26, 12), new THREE.MeshBasicMaterial({ map: ceuT }), S, 0, 5, -5).castShadow = false;
const facT = ctex(512, 256, (g, w, h) => { g.fillStyle = TIJ; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(80,30,20,.35)"; for (let y = 0; y < h; y += 12) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  g.fillStyle = "#fff6e0"; for (let r = 0; r < 2; r++) for (let c = 0; c < 7; c++) { g.fillRect(24 + c * 70, 40 + r * 100, 40, 64); g.fillStyle = "#7ab8e0"; g.fillRect(28 + c * 70, 44 + r * 100, 32, 56); g.fillStyle = "#fff6e0"; } });
box(9, 2.6, .4, new THREE.MeshStandardMaterial({ map: facT, roughness: .9 }), S, 0, 1.3, -3.6);
const TORRE = new THREE.Group(); TORRE.position.set(0, 2.6, -3.6); S.add(TORRE); box(1.1, 1.4, .5, M("#c46a50"), TORRE, 0, .7, 0); mesh(new THREE.ConeGeometry(.8, .9, 4), M("#3d5a3d"), TORRE, 0, 1.85, 0).rotation.y = Math.PI / 4;
const relT = ctex(128, 128, g => { g.fillStyle = "#fff"; g.beginPath(); g.arc(64, 64, 60, 0, 7); g.fill(); g.strokeStyle = TINTA; g.lineWidth = 6; g.stroke(); g.lineCap = "round"; g.beginPath(); g.moveTo(64, 64); g.lineTo(64, 24); g.moveTo(64, 64); g.lineTo(92, 64); g.stroke(); });
mesh(new THREE.CircleGeometry(.36, 32), new THREE.MeshBasicMaterial({ map: relT }), TORRE, 0, .85, .26);
const gT = ctex(256, 256, (g, w, h) => { g.fillStyle = GRAMA; g.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { g.fillStyle = i % 2 ? "#5cbf5f" : "#3f9a43"; g.fillRect((i * 37) % w, (i * 71) % h, 2, 5); } });
gT.wrapS = gT.wrapT = THREE.RepeatWrapping; gT.repeat.set(6, 4); const chao = mesh(new THREE.PlaneGeometry(26, 14), new THREE.MeshStandardMaterial({ map: gT, roughness: 1 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// cadeiras de praia (as 4 do gancho e as 10 do s1)
const cadeira = (x, z, c) => { const g = new THREE.Group(); g.position.set(x, 0, z); S.add(g); const p = M("#d9c3a0"); box(.05, .42, .05, p, g, -.22, .21, .2); box(.05, .42, .05, p, g, .22, .21, .2); box(.05, .7, .05, p, g, -.22, .35, -.15); box(.05, .7, .05, p, g, .22, .35, -.15);
  const as = box(.46, .04, .42, M(c), g, 0, .38, .02); const enc = box(.46, .5, .04, M(c), g, 0, .66, -.2); enc.rotation.x = -.3; return g; };
const CAD = Array.from({ length: 10 }, (_, i) => cadeira(-2.7 + (i % 5) * .62 + (i >= 5 ? .31 : 0), -1.75 + (i >= 5 ? .55 : 0), i % 2 ? "#ff8f6b" : "#5ab4e5"));
// mesa + máquina de escrever + proposta
box(1.5, .07, .8, M("#8a5a33"), S, .7, .78, -.1); for (const [x, z] of [[.05, -.4], [1.35, -.4], [.05, .2], [1.35, .2]]) box(.06, .78, .06, M("#6b4426"), S, x, .39, z);
const MQ = new THREE.Group(); MQ.position.set(.35, .82, -.05); MQ.rotation.y = -.45; S.add(MQ); box(.62, .2, .44, M("#2b3a4a", { roughness: .4 }), MQ, 0, .1, 0); box(.68, .08, .1, M("#3b4c5e"), MQ, 0, .28, -.13);
const teclas = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) teclas.push(mesh(new THREE.CylinderGeometry(.026, .026, .03, 10), M("#e8e2d0"), MQ, -.2 + c * .08 + r * .02, .21, .12 - r * .07));
const propT = ctex(300, 400, (g, w, h, k = 1) => { g.fillStyle = PAP; g.fillRect(0, 0, w, h); g.fillStyle = TINTA; g.font = "700 22px FR"; g.textAlign = "center"; g.fillText("A PROPOSAL FOR THE", 150, 44); g.fillText("SUMMER RESEARCH PROJECT", 150, 70);
  g.font = "700 26px FR"; g.fillStyle = "#b5523b"; g.fillText("ARTIFICIAL INTELLIGENCE", 150, 104); g.fillStyle = "#666"; const n = Math.floor(k * 9); for (let i = 0; i < n; i++) g.fillRect(28, 130 + i * 26, 244 - (i * 41) % 70, 8);
  g.fillStyle = TINTA; g.font = "700 20px FR"; g.fillText("31 de agosto de 1955", 150, 380); });
const PROP = mesh(new THREE.PlaneGeometry(.5, .66), new THREE.MeshStandardMaterial({ map: propT, roughness: .8, side: THREE.DoubleSide }), MQ, 0, .5, -.16); PROP.rotation.x = -.15;
let propU = -1; const prop = k => { const u = Math.round(k * 9); if (u !== propU) { propU = u; propT.draw(k); } };
// saco de dinheiro (pediram dinheiro), balão de fala + seta (linguagem / melhorar sozinha)
const SACO = new THREE.Group(); S.add(SACO); mesh(new THREE.SphereGeometry(.34, 20, 16), M("#c9a46a", { roughness: .9 }), SACO, 0, .34, 0); mesh(new THREE.CylinderGeometry(.08, .16, .16, 12), M("#c9a46a"), SACO, 0, .7, 0);
const cifT = ctex(128, 128, g => { g.fillStyle = "#2e7d32"; g.font = "700 100px FR"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("$", 64, 70); });
const cif = mesh(new THREE.PlaneGeometry(.36, .36), new THREE.MeshBasicMaterial({ map: cifT, transparent: true }), SACO, 0, .36, .35); cif.castShadow = false;
const ico = txt => { const t = ctex(160, 160, g => { g.fillStyle = "#fff"; g.beginPath(); g.arc(80, 80, 74, 0, 7); g.fill(); g.strokeStyle = TINTA; g.lineWidth = 8; g.stroke(); g.fillStyle = TINTA; g.font = "700 84px FR"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 80, 88); });
  const m = mesh(new THREE.PlaneGeometry(.6, .6), new THREE.MeshBasicMaterial({ map: t, transparent: true }), S); m.castShadow = false; return m; };
const ICO = [ico("Aa"), ico("↑")];
// calendário JUL/AGO 1956 (folhas voam no s4)
const calT = (mes, ano) => ctex(200, 220, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 200, 220); g.fillStyle = "#d84a3a"; g.fillRect(0, 0, 200, 56); g.fillStyle = "#fff"; g.font = "700 36px FR"; g.textAlign = "center"; g.fillText(mes, 100, 42);
  g.fillStyle = TINTA; g.font = "700 30px FR"; g.fillText(ano, 100, 196); g.fillStyle = "#c8c8c8"; for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) g.fillRect(14 + c * 25, 70 + r * 22, 18, 14); });
const CAL = new THREE.Group(); CAL.position.set(2.35, 0, -.6); S.add(CAL); box(.06, 1.5, .06, M("#555"), CAL, 0, .75, 0);
const folhas = [["JUL", "1956"], ["AGO", "1956"]].map(([m, a], i) => mesh(new THREE.BoxGeometry(.7, .77, .01), [M("#fff"), M("#fff"), M("#fff"), M("#fff"), new THREE.MeshStandardMaterial({ map: calT(m, a) }), M("#fff")], CAL, (i - .5) * .74, 1.75, .04));
const VOAM = Array.from({ length: 8 }, () => { const m = box(.5, .55, .01, M("#fff", { side: THREE.DoubleSide }), S, 0, 0, 0); m.visible = false; return m; });

// ---------- mascote: chapéu de pescador amarelo; datilografar ----------
const CH = new THREE.Group(); CH.position.set(0, 1.5, 0); MAS.corpo.add(CH); mesh(new THREE.CylinderGeometry(.5, .56, .3, 28), M(SOL), CH, 0, .15, 0); mesh(new THREE.CylinderGeometry(.82, .82, .04, 32), M(SOL2), CH, 0, .02, 0);
const MX = -1.05, MZ = .5;
const datilo = (lt, ry = .55) => { const k = Math.sin(lt * 20); pose(MAS, { x: MX, z: MZ, y: 0, ry, braco: [.95 + k * .1, .95 - k * .1], piscar: pisca(lt) }); MAS.g.rotation.z = 0; teclas.forEach((t, i) => t.position.y = .21 - (Math.floor(lt * 11 + i * 5) % 6 === 0 ? .015 : 0)); };
const olha = (lt, ry = .3) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .9, .03), ry, braco: [.3, .5 + Math.sin(lt * 2) * .1], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .26), ry: .2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], sq: Math.max(0, Math.cos(lt * Math.PI / .35)) * .06, piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
let ANO = 1956;

grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = () => { CAD.forEach(c => c.visible = false); SACO.visible = false; ICO.forEach(m => m.visible = false); VOAM.forEach(m => m.visible = false); folhas.forEach(f => f.visible = true); ANO = 1956; };
const pop = (o, k) => { o.visible = k > .01; o.scale.setScalar(Math.max(.01, back(k))); };

// ---------- travelling lateral ----------
const TR = { gancho: [-.5, .4], s1: [-1.0, -.2], s2: [.3, -.3], s3: [-.2, .5], s4: [.6, 1.2], cta: [.1, -.2] };
const SHOTS = {}; Object.keys(TR).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a, b] = TR[nome] || TR.cta, x = a + (b - a) * eio(lt / d); cam.position.set(x, 2.0, 6.0); cam.lookAt(x * .7 + .1, 1.15, -.6); };

const ACT = {
  gancho(lt, d) { reset(); [0, 1, 2, 3].forEach(i => pop(CAD[i], lin(lt, .6 + i * .25, 1.0 + i * .25))); prop(lin(lt, 0, d * .6)); const k = lin(lt, 2.8, 3.3); pop(SACO, k); SACO.position.set(1.3, .82, .05);
    if (lt < d * .7) datilo(lt); else { olha(lt, .2); MAS.g.rotation.z = Math.sin(lt * 3) * .06; } },
  s1(lt, d) { reset(); CAD.forEach((c, i) => pop(c, lin(lt, .3 + i * .12, .6 + i * .12))); prop(1); folhas.forEach((f, i) => { const k = back(lin(lt, d * .55 + i * .2, d * .55 + i * .2 + .4)); f.scale.setScalar(.6 + .4 * k); }); olha(lt, .45); },
  s2(lt, d) { reset(); CAD.forEach(c => c.visible = true); prop(1); datilo(lt + 2, .4); },
  s3(lt, d) { reset(); CAD.forEach(c => c.visible = true); prop(1); ICO.forEach((m, i) => { pop(m, lin(lt, .8 + i * 1.2, 1.2 + i * 1.2)); m.position.set(1.1 + i * .8, 1.75 + Math.sin(lt * 2 + i) * .06, .2); m.lookAt(cam.position); }); olha(lt, .3); },
  s4(lt, d) { reset(); CAD.forEach(c => c.visible = true); prop(1); const k = lin(lt, 1.6, d - .6); ANO = Math.round(1956 + eio(k) * 70); folhas.forEach(f => f.visible = k <= 0);
    VOAM.forEach((m, i) => { const a = (k * 8 - i); if (k <= 0 || a < 0 || a > 1.6) return; m.visible = true; m.position.set(2.35 + a * 1.6 - (i % 2) * .3, 1.75 + a * 1.4, -.5 + a * .8); m.rotation.set(a * 3, a * 2 + i, a * 4); }); if (k < 1) olha(lt, -.1); else feliz(lt); },
  cta(lt, d) { reset(); CAD.forEach(c => c.visible = true); prop(1); ANO = 2026; folhas.forEach(f => f.visible = false); feliz(lt); },
};

// ---------- elementos de tela (2D): entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 22) { X.font = `700 ${f}px FR`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZÊ";
  const flap = (alvo, x, y, tw, lt, t0) => { for (let i = 0; i < alvo.length; i++) { const c = alvo[i], k = lin(lt, t0 + i * .05, t0 + i * .05 + .5); const xx = x + i * (tw + 6);
      X.fillStyle = "#1c1c1c"; X.beginPath(); X.roundRect(xx, y - tw * .7, tw, tw * 1.4, 6); X.fill(); if (c === " ") continue;
      const ch = k >= 1 ? c : CH[(Math.floor(lt * 30) + i * 7) % CH.length]; X.fillStyle = k >= 1 ? SOL : "#ddd"; X.font = `700 ${Math.round(tw * 1.05)}px FR`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(ch, xx + tw / 2, y + 4);
      X.fillStyle = "rgba(0,0,0,.55)"; X.fillRect(xx, y - 1, tw, 3); } };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(232,246,255,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s2" || nome === "s3") { const t0 = nome === "s2" ? .2 : -9; X.fillStyle = "rgba(20,20,20,.85)"; X.beginPath(); X.roundRect(70, 600, 870, 210, 18); X.fill(); flap("INTELIGÊNCIA", 112, 655, 58, lt, t0); flap("ARTIFICIAL", 176, 752, 58, lt, t0 + .4); }
      if (nome === "s4" || nome === "cta") { const y = nome === "cta" ? 700 : 690; X.fillStyle = "rgba(255,255,255,.9)"; X.beginPath(); X.roundRect(320, y - 80, 370, 150, 20); X.fill(); X.fillStyle = ANO >= 2026 ? GRAMA2 : TIJ; X.font = "700 120px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(String(ANO), 505, y + 4); }
      if (nome === "s1") { const a = eo(lin(lt, .3, .8)); X.globalAlpha = a; X.fillStyle = "rgba(255,255,255,.9)"; X.beginPath(); X.roundRect(60, 610, 520, 110, 18); X.fill(); X.fillStyle = TINTA; X.font = "700 52px FR"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("10 pessoas · 2 meses", 84, 666); X.globalAlpha = 1; } },
    etiqueta(t, nome) { // placa de campus (verde com borda branca, em dois postes)
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.fillStyle = "#6b4a2b"; X.fillRect(-380, 120, 18, 60); X.fillRect(362, 120, 18, 60);
      X.fillStyle = GRAMA2; X.beginPath(); X.roundRect(-450, -128, 900, 256, 22); X.fill(); X.strokeStyle = "#fff"; X.lineWidth = 7; X.beginPath(); X.roundRect(-436, -114, 872, 228, 16); X.stroke();
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = "#fff"; cabe(58, l1, 820); X.fillText(l1, 0, -34); X.fillStyle = SOL; cabe(52, l2, 820); X.fillText(l2, 0, 28); X.fillStyle = "#d9f2d6"; cabe(44, l3, 820); X.fillText(l3, 0, 86); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { // uma palavra gigante por vez com pop
      const ws = seg.palavras; let w = ws.findIndex(x => t < x.t1 + .06); if (w < 0) w = ws.length - 1; const W = ws[w]; if (t < W.t0 - .25) return;
      const p = back(lin(t, W.t0 - .04, W.t0 + .14)); const txt = W.w.replace(/[,.:]$/, ""), chave = txt.replace(/[?!]/g, "").toUpperCase() === CHAVE;
      let f = 124; X.font = `700 ${f}px FR`; while (X.measureText(txt).width > 820 && f > 50) { f -= 4; X.font = `700 ${f}px FR`; }
      X.save(); X.translate(505, 1395); X.scale(.6 + .4 * p, .6 + .4 * p); X.textAlign = "center"; X.textBaseline = "middle"; X.lineWidth = 16; X.strokeStyle = "#fff"; X.lineJoin = "round"; X.strokeText(txt, 0, 0); X.fillStyle = chave ? TIJ : TINTA; X.fillText(txt, 0, 0); X.restore(); },
    transicao(lt, s, nome) { // chicote de câmera: borrão horizontal varrendo a tela
      if (nome === "gancho" || lt > .3) return; const a = 1 - lt / .3, x = (lt / .3) * 1600 - 300;
      X.save(); for (let i = 0; i < 26; i++) { X.fillStyle = `rgba(${i % 2 ? "255,201,40" : "255,255,255"},${.5 * a})`; X.fillRect(x - 900 + (i * 53) % 900, (i * 79) % 1920, 700, 26 + (i * 13) % 60); }
      const g = X.createLinearGradient(x - 600, 0, x + 300, 0); g.addColorStop(0, "rgba(232,246,255,0)"); g.addColorStop(.7, `rgba(232,246,255,${.85 * a})`); g.addColorStop(1, "rgba(232,246,255,0)"); X.fillStyle = g; X.fillRect(0, 0, 1080, 1920); X.restore(); },
    fechamento(lt) { // página de caderno com os 3 fatos + COMENTA
      X.save(); X.translate(505, 1030); X.rotate(-.01); X.fillStyle = "#fffdf6"; X.shadowColor = "rgba(0,0,0,.2)"; X.shadowBlur = 20; X.fillRect(-440, -300, 880, 600); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(46,125,50,.25)"; X.lineWidth = 2; for (let y = -240; y < 300; y += 62) { X.beginPath(); X.moveTo(-440, y); X.lineTo(440, y); X.stroke(); }
      X.fillStyle = TINTA; X.font = "700 46px FR"; X.textAlign = "left"; X.textBaseline = "alphabetic"; ["1955: a proposta", "1956: o verão em Dartmouth", "2026: 70 anos depois"].forEach((l, i) => { const a = eo(lin(lt, .1 + i * .25, .5 + i * .25)); X.globalAlpha = a; X.fillText(l, -390 + (1 - a) * 30, -180 + i * 62); });
      X.globalAlpha = 1; const p = back(lin(lt, .8, 1.2)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(0, 80); X.scale(p, p); X.fillStyle = SOL; X.beginPath(); X.roundRect(-340, -64, 680, 128, 64); X.fill();
      X.fillStyle = TINTA; X.font = "700 70px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore();
      if (lt > 1.2) { X.globalAlpha = eo(lin(lt, 1.2, 1.6)); X.fillStyle = GRAMA2; X.font = "700 42px FR"; X.textAlign = "center"; X.fillText("Salva pra contar pra alguém", 0, 230); X.globalAlpha = 1; } X.restore(); },
  }; };
const cores = { LAR: SOL, VERDE: GRAMA, FUNDO, CREME: PAP, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

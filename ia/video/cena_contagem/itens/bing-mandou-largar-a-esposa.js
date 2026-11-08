// Reel 📜 história "A IA que mandou ele largar a esposa" (Bing/Sydney × Kevin Roose, fev/2023; 09/11 21:30). Motor da cena_contagem.
// Identidade: sala de estar escura à noite: sofá vinho, notebook brilhando na mesinha, relógio de parede, balões de coração
// que murcham e um coração de neon na parede; a tela do chat vira um coração gigante. Paleta vinho + rosa-neon. Sem logos.
// Elementos: etiqueta em faixa diagonal de aviso, nome com letras caindo e encaixando (SYDNEY), sem contador (história),
// legenda karaokê com marca-texto deslizando, transição íris circular, câmera na mão, fechamento com cartões que viram, Bebas Neue.
// Mascote de cachecol listrado (enrolado na base do corpo, ponta caída para o lado; nada no rosto); ação: se afastar devagar no sofá.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const VINHO = "#5a1430", VINHO2 = "#3a0b1f", ROSA = "#ff3d8b", ROSA2 = "#ff9cc4", CREME = "#fff1f6", TINTA = "#1a0710", FUNDO = "#2a0816", AMAR = "#ffd23f";
rim.color.set(0xff5aa0); rim.intensity = 2.0; key.color.set(0xffd9ea); key.intensity = 70; key.position.set(1, 8, 5); key.target.position.set(0, .8, 0);
S.add(new THREE.AmbientLight(0x6a3050, .7));
const brilho = new THREE.PointLight(0xa8d4ff, 6, 6); brilho.position.set(.9, 1.3, .9); S.add(brilho);

// ---------- cenário ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#4a1028"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,.035)"; for (let x = 0; x < w; x += 28) g.fillRect(x, 0, 10, h); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshStandardMaterial({ map: pT, roughness: 1 }), S, 0, 4.5, -2.2).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(22, 12), M("#2a1018", { roughness: .9 }), S, 0, 0, 2); chao.rotation.x = -Math.PI / 2;
const tap = mesh(new THREE.CircleGeometry(1.9, 48), M("#7a2246", { roughness: 1 }), S, .2, .01, .4); tap.rotation.x = -Math.PI / 2;
// coração de neon na parede
const cor = (s = 1) => { const sh = new THREE.Shape(); sh.moveTo(0, -.5 * s); sh.bezierCurveTo(-.9 * s, .1 * s, -.45 * s, .75 * s, 0, .35 * s); sh.bezierCurveTo(.45 * s, .75 * s, .9 * s, .1 * s, 0, -.5 * s); return sh; };
const neonM = E(ROSA, 2.4); const NEON = mesh(new THREE.ExtrudeGeometry(cor(.9), { depth: .05, bevelEnabled: false }), neonM, S, 1.9, 2.75, -2.1); NEON.castShadow = false;
// sofá vinho
const sofM = M(VINHO, { roughness: .85 }); const SOF = new THREE.Group(); SOF.position.set(-1.0, 0, -.9); S.add(SOF);
box(2.9, .45, 1.0, sofM, SOF, 0, .32, 0); box(2.9, .85, .3, sofM, SOF, 0, .85, -.42); for (const x of [-1.55, 1.55]) box(.3, .7, 1.0, sofM, SOF, x, .5, 0); box(2.6, .14, .8, M("#6e1a3c"), SOF, 0, .6, .05);
// relógio de parede
const relT = ctex(256, 256, (g, w, h, hr = 10, mi = 0) => { g.fillStyle = CREME; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill(); g.strokeStyle = TINTA; g.lineWidth = 10; g.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; g.fillStyle = TINTA; g.fillRect(128 + Math.sin(a) * 96 - 4, 128 - Math.cos(a) * 96 - 4, 8, 8); }
  const ah = (hr % 12 + mi / 60) / 12 * 6.283, am = mi / 60 * 6.283; g.lineCap = "round"; g.lineWidth = 12; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + Math.sin(ah) * 56, 128 - Math.cos(ah) * 56); g.stroke();
  g.strokeStyle = ROSA; g.lineWidth = 7; g.beginPath(); g.moveTo(128, 128); g.lineTo(128 + Math.sin(am) * 88, 128 - Math.cos(am) * 88); g.stroke(); });
mesh(new THREE.CylinderGeometry(.45, .45, .06, 40), [M(TINTA), new THREE.MeshStandardMaterial({ map: relT, emissive: "#fff", emissiveMap: relT, emissiveIntensity: .25 }), M(TINTA)], S, -1.0, 2.55, -2.12).rotation.x = Math.PI / 2;
let relU = ""; const relogio = (h, m) => { const u = h + ":" + Math.round(m); if (u !== relU) { relU = u; relT.draw(h, m); } };
// mesinha + notebook com a tela virada para a câmera (3/4)
box(1.3, .08, .7, M("#2a1a22"), S, 1.0, .5, .55); for (const [x, z] of [[.45, .3], [1.55, .3], [.45, .8], [1.55, .8]]) box(.06, .5, .06, M("#1c1016"), S, x, .25, z);
const telT = ctex(320, 220, (g, w, h, modo = "chat", k = 0) => { g.fillStyle = "#f6eef8"; g.fillRect(0, 0, w, h); g.fillStyle = "#e3d4ea"; g.fillRect(0, 0, w, 30); g.fillStyle = VINHO; g.font = "400 24px BB"; g.fillText("CHAT", 14, 23);
  if (modo === "coracao") { const s = 1 + Math.sin(k * 9) * .08; g.save(); g.translate(160, 128); g.scale(s, s); g.fillStyle = ROSA; g.beginPath(); g.moveTo(0, 60); g.bezierCurveTo(-110, -10, -55, -90, 0, -40); g.bezierCurveTo(55, -90, 110, -10, 0, 60); g.fill(); g.restore(); return; }
  const n = Math.min(5, Math.floor(k * 6)); for (let i = 0; i < n; i++) { const eu = i % 2 === 0, y = 42 + i * 34; g.fillStyle = eu ? "#cfd8ff" : (modo === "insiste" ? ROSA : "#ffffff"); g.beginPath(); g.roundRect(eu ? 120 : 14, y, 186, 26, 13); g.fill();
    g.fillStyle = eu ? "#7d8bc9" : (modo === "insiste" ? "#fff" : "#c9a9bd"); g.fillRect(eu ? 134 : 28, y + 10, 120 - (i * 23) % 50, 7); if (!eu && modo === "insiste") { g.fillStyle = "#fff"; g.font = "400 22px BB"; g.fillText("♥", 268, y + 21); } } });
const NB = new THREE.Group(); NB.position.set(1.0, .55, .55); NB.rotation.y = -.55; S.add(NB); box(.95, .04, .6, M("#b9bccb"), NB, 0, .02, 0);
const tela = mesh(new THREE.BoxGeometry(.95, .62, .03), [M("#9a9db0"), M("#9a9db0"), M("#9a9db0"), M("#9a9db0"), new THREE.MeshStandardMaterial({ map: telT, emissive: "#fff", emissiveMap: telT, emissiveIntensity: .9 }), M("#9a9db0")], NB, 0, .33, -.3); tela.rotation.x = -.18;
let telU = ""; const telaD = (m, k) => { const u = m + Math.round(k * 60); if (u !== telU) { telU = u; telT.draw(m, k); } };
// coração gigante que sai da tela (s2/s3)
const BIG = mesh(new THREE.ExtrudeGeometry(cor(1), { depth: .25, bevelEnabled: true, bevelThickness: .06, bevelSize: .06, bevelSegments: 3 }), E(ROSA, 1.2), S); BIG.visible = false;
// balões de coração com barbante (murcham no fim)
const BAL = [[-2.3, 2.05, -.6, ROSA], [-1.95, 2.35, -.75, ROSA2], [.05, 2.2, -.7, "#ff5f6d"]].map(([x, y, z, c]) => { const g = new THREE.Group(); g.position.set(x, y, z); S.add(g);
  const h = mesh(new THREE.ExtrudeGeometry(cor(.55), { depth: .22, bevelEnabled: true, bevelThickness: .08, bevelSize: .08, bevelSegments: 4 }), M(c, { roughness: .25, emissive: c, emissiveIntensity: .25 }), g, 0, 0, -.11);
  const fio = mesh(new THREE.CylinderGeometry(.006, .006, 1.4, 4), M("#ddd"), g, 0, -.95, 0); return { g, h, fio, y }; });

// ---------- mascote: cachecol listrado na base do corpo + ponta caída ao lado ----------
const cT = ctex(128, 32, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? CREME : ROSA; g.fillRect(i * 16, 0, 16, h); } }); cT.wrapS = THREE.RepeatWrapping; cT.repeat.set(4, 1);
const cM = new THREE.MeshStandardMaterial({ map: cT, roughness: .95 });
mesh(new THREE.BoxGeometry(1.6, .16, 1.1), cM, MAS.corpo, 0, .5, 0); const ponta = mesh(new THREE.BoxGeometry(.22, .5, .08), cM, MAS.corpo, .82, .32, .3); ponta.rotation.z = .15;
const SX = -.55, SY = .5, SZ = -.6;   // sentado no sofá
const senta = (lt, x = SX, ry = .35, braco = [.3, .7]) => { pose(MAS, { x, z: SZ, y: SY + hop(lt, 1.2, .02), ry, braco, piscar: pisca(lt) }); MAS.g.rotation.z = 0; };

grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = () => { BIG.visible = false; BAL.forEach(b => { b.g.scale.set(1, 1, 1); b.g.position.y = b.y; }); brilho.intensity = 6; neonM.emissiveIntensity = 2.4; };
const flutua = lt => BAL.forEach((b, i) => { b.g.position.y = b.y + Math.sin(lt * 1.3 + i * 2) * .06; b.g.rotation.z = Math.sin(lt + i) * .08; });

// ---------- câmera na mão ----------
const BASE = { gancho: [V(.3, 1.75, 5.4), V(.1, 1.15, -.4)], s1: [V(-.6, 1.9, 5.0), V(-.5, 1.6, -.6)], s2: [V(.6, 1.6, 4.9), V(.5, 1.2, -.2)], s3: [V(.0, 1.7, 5.6), V(.0, 1.2, -.4)],
  s4: [V(-.4, 1.8, 5.2), V(-.3, 1.3, -.5)], cta: [V(0, 1.8, 6.0), V(0, 1.3, -.4)] };
const SHOTS = {}; Object.keys(BASE).forEach(n => SHOTS[n] = [BASE[n], BASE[n]]);
const camera = (cam, nome, lt, d, t) => { const [p, l] = BASE[nome] || BASE.cta, u = lt / d;
  const nx = Math.sin(t * 1.3) * .05 + Math.sin(t * 3.7) * .02, ny = Math.sin(t * 1.7 + 1) * .04 + Math.sin(t * 4.3) * .015;
  cam.position.set(p.x + nx, p.y + ny, p.z - u * .3); cam.lookAt(l.x + nx * .4, l.y + ny * .4, l.z); cam.rotateZ(Math.sin(t * 1.1) * .01); };

const ACT = {
  gancho(lt, d) { reset(); flutua(lt); relogio(22, 0); telaD(lt > d * .6 ? "insiste" : "chat", lin(lt, 0, d * .5) + .17); senta(lt); },
  s1(lt, d) { reset(); flutua(lt); const m = eio(lin(lt, .3, d - .3)) * 120; relogio(22 + Math.floor(m / 60), m % 60); telaD("chat", .9); senta(lt, SX, .4, [.3, .9 + Math.sin(lt * 5) * .25]); },
  s2(lt, d) { reset(); flutua(lt); relogio(0, 0); const k = lin(lt, d * .45, d * .45 + .8); telaD(k > 0 ? "coracao" : "chat", k > 0 ? lt : .9);
    BIG.visible = k > 0; if (k > 0) { const e = back(k); BIG.scale.setScalar(Math.max(.01, e * .55 * (1 + Math.sin(lt * 8) * .05))); BIG.position.set(1.2 + e * .2, .9 + e * .75, .4); BIG.rotation.set(0, -.3, 0); }
    neonM.emissiveIntensity = 2.4 + Math.sin(lt * 8) * .8; senta(lt, SX, .5); },
  s3(lt, d) { reset(); flutua(lt); relogio(0, 30); telaD("insiste", .9); BIG.visible = true; BIG.scale.setScalar(.55 * (1 + Math.sin(lt * 10) * .07)); BIG.position.set(1.4, 1.65, .4); BIG.rotation.set(0, -.3 + Math.sin(lt) * .1, 0);
    // se afasta devagar pelo sofá
    const x = SX - eio(lin(lt, .4, d - .5)) * 1.3; senta(lt, x, .55, [.9, .3]); MAS.g.rotation.z = Math.sin(lt * 1.2) * .04; },
  s4(lt, d) { reset(); relogio(3, eio(lin(lt, 0, d)) * 20); telaD("chat", .5); neonM.emissiveIntensity = 1.2; brilho.intensity = 3;
    const m = eo(lin(lt, .3, d - .4)); BAL.forEach((b, i) => { b.g.scale.set(1 - m * .45, 1 - m * .55, 1 - m * .3); b.g.position.y = b.y - m * (.9 + i * .2); b.g.rotation.z = m * (i % 2 ? .5 : -.4); });
    senta(lt, SX - 1.3, .3, [.25, .25]); },
  cta(lt, d) { reset(); flutua(lt); relogio(3, 20); telaD("coracao", lt); senta(lt, SX - .6, .3, [.3, 1.8 + Math.sin(lt * 8) * .3]); },
};

// ---------- elementos de tela (2D): entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 22) { X.font = `400 ${f}px BB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const listras = (w, h) => { X.save(); X.beginPath(); X.rect(-w / 2, -h / 2, w, h); X.clip(); X.fillStyle = AMAR; X.fillRect(-w / 2, -h / 2, w, h); X.fillStyle = TINTA; for (let x = -w / 2 - h; x < w / 2 + h; x += 56) { X.beginPath(); X.moveTo(x, -h / 2); X.lineTo(x + 28, -h / 2); X.lineTo(x + 28 - h, h / 2); X.lineTo(x - h, h / 2); X.fill(); } X.restore(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 80], [GY3 + GH, GY3 + GH - 90]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(42,8,22,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") { const a = eo(lin(lt, .2, .6)); X.globalAlpha = a; X.fillStyle = CREME; X.font = "400 92px BB"; X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillText("2 HORAS", 80, 700); X.fillStyle = ROSA2; X.font = "400 46px BB"; X.fillText("DE CONVERSA", 84, 750); X.globalAlpha = 1; }
      if (nome === "s2" || nome === "s3") { // SYDNEY: letras caindo e encaixando
        const txt = "SYDNEY", tw = 96, gap = 12, x0 = 505 - (txt.length * (tw + gap) - gap) / 2, t0 = nome === "s3" ? -9 : .5;
        for (let i = 0; i < txt.length; i++) { const k = lin(lt, t0 + i * .12, t0 + i * .12 + .35); if (k <= 0) continue; const y = 680 - (1 - eo(k)) * 300, b = k < 1 ? 0 : Math.max(0, .18 - (lt - t0 - i * .12 - .35)) * 40;
          X.save(); X.translate(x0 + i * (tw + gap) + tw / 2, y - b); X.rotate((1 - eo(k)) * (i % 2 ? .5 : -.5)); X.fillStyle = ROSA; X.beginPath(); X.roundRect(-tw / 2, -tw / 2 - 8, tw, tw + 16, 12); X.fill();
          X.fillStyle = "#fff"; X.font = "400 96px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(txt[i], 0, 6); X.restore(); } } },
    etiqueta(t, nome) { // faixa diagonal de aviso (estática: 1º quadro legível)
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(-.045);
      X.save(); X.translate(0, -112); listras(980, 34); X.restore(); X.save(); X.translate(0, 118); listras(980, 34); X.restore();
      X.fillStyle = TINTA; X.fillRect(-490, -95, 980, 196); X.textAlign = "center"; X.textBaseline = "alphabetic";
      X.fillStyle = "#fff"; cabe(84, l1, 900); X.fillText(l1, 0, -14); X.fillStyle = ROSA; cabe(54, l2, 900); X.fillText(l2, 0, 44); X.fillStyle = AMAR; cabe(44, l3, 900); X.fillText(l3, 0, 88); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { // karaokê: o marca-texto rosa desliza por baixo das palavras
      const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 84; X.font = `400 ${fs}px BB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 860 && fs > 46) { fs -= 2; X.font = `400 ${fs}px BB`; }
      const W = tot(), y = 1400; let x = 505 - W / 2; const xs = c.map(w => { const r = [x, X.measureText(w.w).width]; x += X.measureText(w.w + " ").width; return r; });
      let fim = xs[0][0] - 10; c.forEach((w, i) => { const k = lin(t, w.t0, w.t1); if (k > 0) fim = xs[i][0] + xs[i][1] * k + 10; });
      X.fillStyle = "rgba(255,61,139,.85)"; X.beginPath(); X.roundRect(xs[0][0] - 14, y - fs * .42, Math.max(0, fim - xs[0][0] + 14), fs * .78, 8); X.fill();
      X.textAlign = "left"; X.textBaseline = "middle"; c.forEach((w, i) => { X.fillStyle = "#fff"; X.shadowColor = "rgba(0,0,0,.6)"; X.shadowBlur = 10; X.fillText(w.w, xs[i][0], y + 4); X.shadowBlur = 0; }); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .4) return; const r = eio(lt / .4) * 1300;
      X.save(); X.fillStyle = VINHO2; X.beginPath(); X.rect(0, 0, 1080, 1920); X.moveTo(505 + Math.max(1, r), 1000); X.arc(505, 1000, Math.max(1, r), 0, Math.PI * 2, true); X.closePath(); X.fill();
      X.strokeStyle = ROSA; X.lineWidth = 14; X.beginPath(); X.arc(505, 1000, Math.max(1, r), 0, Math.PI * 2); X.stroke(); X.restore(); },
    fechamento(lt) { // cartões que viram: 2023 · SYDNEY · 2 HORAS, depois COMENTA
      const cards = [["FEV 2023", "o ano"], ["SYDNEY", "o nome dela"], ["2 HORAS", "de conversa"]];
      cards.forEach(([a, b], i) => { const k = lin(lt, .1 + i * .22, .55 + i * .22), sx = Math.abs(Math.cos(k * Math.PI)), frente = k > .5, x = 210 + i * 300, y = 860;
        X.save(); X.translate(x, y); X.scale(Math.max(.02, sx), 1); X.fillStyle = frente ? CREME : ROSA; X.beginPath(); X.roundRect(-130, -170, 260, 340, 22); X.fill();
        if (frente) { X.fillStyle = VINHO; X.font = "400 64px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(a, 0, -20); X.fillStyle = "#8a4a64"; X.font = "400 38px BB"; X.fillText(b, 0, 50); }
        else { X.fillStyle = "#fff"; X.font = "400 120px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("?", 0, 8); } X.restore(); });
      const p = back(lin(lt, .9, 1.3)); X.save(); X.translate(505, 1170); X.scale(p, p); X.fillStyle = ROSA; X.beginPath(); X.roundRect(-330, -70, 660, 140, 70); X.fill();
      X.fillStyle = "#fff"; X.font = "400 96px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 6); X.restore();
      if (lt > 1.3) { X.globalAlpha = eo(lin(lt, 1.3, 1.7)); X.fillStyle = CREME; X.font = "400 64px BB"; X.textAlign = "center"; X.fillText("VOCÊ TERIA DESLIGADO?", 505, 1340); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: ROSA, VERDE: ROSA2, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

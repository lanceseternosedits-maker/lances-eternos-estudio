// Reel 📜 história "1 milhão de pessoas em 5 dias" (lançamento do ChatGPT, 30/11/2022; 14/11 20:30). Motor da cena_contagem.
// Identidade: festa de aniversário de 4 anos num salão: bolo com 4 velas, balões, bandeirinhas e uma janela de chat gigante na parede
// (genérica, sem logo) que vai enchendo de pedidos ("poema", "trabalho de escola", "código"); notificações chovem do teto.
// Rosa-festa + azul-céu + amarelo. Elementos: placa de rua, nome em carimbo, sem contador (história), uma palavra gigante por vez,
// íris circular, câmera na mão, post-its na parede, Bebas Neue. Mascote de chapéu de aniversário; ação principal: soprar as velas.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const ROSA = "#ff6fa8", ROSA2 = "#d63f7c", CEU = "#7cc4ff", AZ = "#2f6fd6", AMAR = "#ffd23f", TINTA = "#231a2e", FUNDO = "#fff4f8", CREME = "#fffaf3", VERDE = "#2fb36b";
rim.color.set(0xffd6ea); rim.intensity = 1.4; key.color.set(0xffffff); key.intensity = 145; key.position.set(2, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xfff0f6, .62));
// ---------- salão ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#ffe3ee"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,111,168,.18)"; for (let i = 0; i < 40; i++) { g.beginPath(); g.arc((i * 61) % w, (i * 37) % 180, 6, 0, 7); g.fill(); } g.fillStyle = "#f6cfe0"; g.fillRect(0, 196, w, 60); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const chT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? "#fff" : "#ffd6e6"; g.fillRect(x * 32, y * 32, 32, 32); } }); chT.wrapS = chT.wrapT = THREE.RepeatWrapping; chT.repeat.set(5, 3);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: chT, roughness: .5 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
for (let i = 0; i < 16; i++) { const b = mesh(new THREE.ConeGeometry(.12, .26, 3), M([ROSA, AMAR, CEU, VERDE][i % 4]), S, -3.4 + i * .45, 3.5 - Math.sin(i / 15 * Math.PI) * .35, -2.4); b.rotation.z = Math.PI; b.castShadow = false; }
const BAL = []; for (let i = 0; i < 6; i++) { const g = new THREE.Group(); g.position.set([-2.8, -2.3, 2.4, 2.9, -3.1, 3.2][i], 2.4 + (i % 3) * .3, -2.0); S.add(g); mesh(new THREE.SphereGeometry(.26, 16, 12), M([ROSA, AMAR, CEU][i % 3], { roughness: .2 }), g, 0, 0, 0).scale.y = 1.15; box(.01, .9, .01, M("#ccc"), g, 0, -.7, 0); BAL.push(g); }
// janela de chat gigante (genérica)
const chC = document.createElement("canvas"); chC.width = 512; chC.height = 320; const cg = chC.getContext("2d"); const chTx = new THREE.CanvasTexture(chC); chTx.colorSpace = THREE.SRGBColorSpace;
const CH = new THREE.Group(); CH.position.set(.2, 2.55, -2.72); S.add(CH); box(3.0, 1.9, .08, M("#fff", { roughness: .4 }), CH, 0, 0, 0); mesh(new THREE.PlaneGeometry(2.86, 1.76), new THREE.MeshBasicMaterial({ map: chTx }), CH, 0, 0, .045).castShadow = false;
const PEDIDOS = ["escreve um poema", "faz meu trabalho de escola", "explica esse código", "receita com o que tenho", "resume esse livro"];
const desChat = (n, t) => { cg.fillStyle = "#f7f7fb"; cg.fillRect(0, 0, 512, 320); cg.fillStyle = "#e9e9f2"; cg.fillRect(0, 0, 512, 34); cg.fillStyle = TINTA; cg.font = "400 24px BB"; cg.fillText("CHAT · PRÉVIA GRÁTIS", 14, 25);
  const L = PEDIDOS.slice(0, Math.min(PEDIDOS.length, n)).slice(-4); L.forEach((s, i) => { cg.font = "400 30px BB"; const w = cg.measureText(s).width + 36; cg.fillStyle = AZ; cg.beginPath(); cg.roundRect(498 - w, 50 + i * 66, w, 50, 18); cg.fill(); cg.fillStyle = "#fff"; cg.fillText(s, 516 - w, 84 + i * 66); }); chTx.needsUpdate = true; };
// mesa + bolo com 4 velas
box(2.0, .08, 1.0, M("#fff", { roughness: .4 }), S, -.8, .85, -1.0); for (const [x, z] of [[-1.7, -1.4], [.1, -1.4], [-1.7, -.6], [.1, -.6]]) box(.05, .85, .05, M("#ccc"), S, x, .42, z);
const BOLO = new THREE.Group(); BOLO.position.set(-.8, .89, -1.0); S.add(BOLO); mesh(new THREE.CylinderGeometry(.5, .5, .4, 28), M("#ffd6e6", { roughness: .7 }), BOLO, 0, .2, 0); mesh(new THREE.CylinderGeometry(.36, .36, .28, 28), M(ROSA, { roughness: .6 }), BOLO, 0, .54, 0);
const CHAMAS = [0, 1, 2, 3].map(i => { const x = -.18 + i * .12; box(.04, .22, .04, M([CEU, AMAR, VERDE, "#fff"][i]), BOLO, x, .79, 0); return mesh(new THREE.SphereGeometry(.04, 8, 6), E("#ffb347", 2.5), BOLO, x, .94, 0); });
// notificações caindo
const notT = ctex(200, 80, g => { g.fillStyle = "#fff"; g.beginPath(); g.roundRect(0, 0, 200, 80, 16); g.fill(); g.fillStyle = ROSA; g.beginPath(); g.arc(36, 40, 18, 0, 7); g.fill(); g.fillStyle = TINTA; g.font = "400 26px BB"; g.fillText("viu isso?!", 64, 50); });
const NOT = []; for (let i = 0; i < 14; i++) { const m = mesh(new THREE.PlaneGeometry(.6, .24), new THREE.MeshBasicMaterial({ map: notT, transparent: true, side: THREE.DoubleSide }), S); m.castShadow = false; m.visible = false; NOT.push(m); }
// ---------- mascote: chapéu de aniversário + língua de sogra ----------
const CHP = new THREE.Group(); CHP.position.set(.2, 1.5, 0); CHP.rotation.z = -.15; MAS.corpo.add(CHP); mesh(new THREE.ConeGeometry(.3, .7, 20), M(AMAR, { roughness: .5 }), CHP, 0, .35, 0); mesh(new THREE.SphereGeometry(.08, 10, 8), M(ROSA), CHP, 0, .72, 0);
const MX = .9, MZ = .6;
const festa = (lt, ry = -.3) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .5, .08), ry, braco: [1.4 + Math.sin(lt * 7) * .4, 1.4 - Math.sin(lt * 7) * .4], piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(lt * 3.5) * .05; };
const olha = (lt, ry = -.3) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .6], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const sopra = (lt, t0) => { const u = lt - t0; pose(MAS, { x: -.1, z: -.2, y: 0, ry: -.9, sq: u > 0 && u < .6 ? -.05 : .03, braco: [.3, .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; CHAMAS.forEach((c, i) => c.visible = u < .3 + i * .1); };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = (lt) => { CHAMAS.forEach(c => { c.visible = true; c.scale.setScalar(1 + Math.sin(lt * 15) * .15); }); NOT.forEach(n => n.visible = false); BAL.forEach((b, i) => { b.position.y = 2.4 + (i % 3) * .3 + Math.sin(lt * 1.5 + i) * .06; }); };
const chove = (lt, k) => NOT.forEach((n, i) => { const u = ((lt * .5 + i / 14) % 1); n.visible = k > i / 14; n.position.set(-2.6 + (i * .41) % 5.2, 3.6 - u * 3.3, -.4 + (i % 3) * .3); n.rotation.z = Math.sin(lt * 2 + i) * .3; });
// ---------- câmera na mão ----------
const BS = { gancho: [V(.1, 2.5, 7.0), V(0, 1.7, -1.2)], s1: [V(-.3, 2.6, 6.6), V(.2, 2.2, -2.0)], s2: [V(.4, 2.5, 6.4), V(.2, 2.1, -1.8)], s3: [V(0, 2.6, 7.0), V(0, 1.8, -1.0)], s4: [V(-.6, 2.0, 5.6), V(-.6, 1.3, -1.0)], cta: [V(0, 2.4, 7.4), V(0, 1.5, -.8)] };
const SHOTS = {}; Object.keys(BS).forEach(n => { const s = [BS[n][0], BS[n][1]]; SHOTS[n] = [s, s]; });
const camera = (cam, nome, lt, d, t) => { const [p, l] = BS[nome] || BS.cta, u = lt / d; const nx = Math.sin(t * 1.3) * .05 + Math.sin(t * 3.7) * .02, ny = Math.sin(t * 1.7 + 1) * .04 + Math.sin(t * 4.3) * .015;
  cam.position.set(p.x + nx, p.y + ny, p.z - u * .35); cam.lookAt(l.x + nx * .4, l.y + ny * .4, l.z); cam.rotateZ(Math.sin(t * 1.1) * .012); };
const ACT = {
  gancho(lt, d) { reset(lt); desChat(Math.floor(lin(lt, 1.5, d) * 2), lt); chove(lt, lin(lt, d * .6, d)); olha(lt, -.2); },
  s1(lt, d) { reset(lt); desChat(0, lt); olha(lt, .2); },
  s2(lt, d) { reset(lt); desChat(1 + Math.floor(lin(lt, .3, d) * 4.99), lt); festa(lt, .2); },
  s3(lt, d) { reset(lt); desChat(5, lt); chove(lt, 1); festa(lt); },
  s4(lt, d) { reset(lt); desChat(5, lt); sopra(lt, 2.4); },
  cta(lt, d) { reset(lt); desChat(5, lt); CHAMAS.forEach(c => c.visible = false); pose(MAS, { x: 1.3, z: 1.4, y: hop(lt, .35, .22), ry: -.3, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px BB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const carimbo = (txt, x, y, lt, t0, cor, rot = -.1, fs = 96) => { if (lt < t0) return; const k = lin(lt, t0, t0 + .18), s = 2.4 - 1.4 * eo(k), tr = k >= 1 ? Math.max(0, 1 - (lt - t0 - .18) / .15) : 0;
    X.save(); X.translate(x + Math.sin(lt * 80) * 6 * tr, y); X.rotate(rot); X.scale(s, s); X.globalAlpha = Math.min(1, .3 + k); X.font = `400 ${fs}px BB`; const w = X.measureText(txt).width + 64;
    X.fillStyle = "rgba(255,250,243,.94)"; X.beginPath(); X.roundRect(-w / 2, -fs * .62, w, fs * 1.24, 12); X.fill(); X.strokeStyle = cor; X.lineWidth = 9; X.stroke(); X.fillStyle = cor; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(txt, 0, 4); X.restore(); X.globalAlpha = 1; };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(255,244,248,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "gancho") carimbo("1 MILHÃO", 330, 700, lt, d5(lt), ROSA2, -.08, 100);
      if (nome === "s1") carimbo("30/11/2022", 330, 700, lt, .6, AZ, -.08, 96);
      if (nome === "s3") carimbo("SÓ DAVA ELE", 340, 700, lt, .3, ROSA2, -.1, 90);
      if (nome === "s4") carimbo("4 ANOS", 330, 700, lt, .5, VERDE, -.08, 110); },
    etiqueta(t, nome) { // placa de rua azul com seta
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.fillStyle = "#7a8090"; X.fillRect(-330, 118, 18, 60); X.fillRect(312, 118, 18, 60);
      X.fillStyle = AZ; X.beginPath(); X.roundRect(-460, -132, 920, 264, 18); X.fill(); X.strokeStyle = "#fff"; X.lineWidth = 6; X.beginPath(); X.roundRect(-447, -119, 894, 238, 12); X.stroke();
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = "#fff"; cabe(88, l1, 840); X.fillText(l1, 0, -30); X.fillStyle = AMAR; cabe(64, l2, 840); X.fillText(l2, 0, 36); X.fillStyle = "#ffd6e6"; cabe(56, l3, 760); X.fillText(l3, -30, 98);
      X.fillStyle = "#fff"; X.beginPath(); X.moveTo(370, 80); X.lineTo(410, 80); X.lineTo(410, 66); X.lineTo(436, 88); X.lineTo(410, 110); X.lineTo(410, 96); X.lineTo(370, 96); X.closePath(); X.fill(); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ws = seg.palavras; let w = ws.findIndex(x => t < x.t1 + .06); if (w < 0) w = ws.length - 1; const W = ws[w]; if (t < W.t0 - .25) return;
      const p = back(lin(t, W.t0 - .04, W.t0 + .14)); const txt = W.w.replace(/[,.:]$/, ""), chave = txt.replace(/[?!]/g, "").toUpperCase() === CHAVE;
      let f = 150; X.font = `400 ${f}px BB`; while (X.measureText(txt).width > 820 && f > 60) { f -= 4; X.font = `400 ${f}px BB`; }
      X.save(); X.translate(505, 1395); X.scale(.6 + .4 * p, .6 + .4 * p); X.textAlign = "center"; X.textBaseline = "middle"; X.lineWidth = 18; X.strokeStyle = "#fff"; X.lineJoin = "round"; X.strokeText(txt, 0, 0); X.fillStyle = chave ? ROSA2 : TINTA; X.fillText(txt, 0, 0); X.restore(); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .4) return; const r = eio(lt / .4) * 1300;
      X.save(); X.fillStyle = ROSA2; X.beginPath(); X.rect(0, 0, 1080, 1920); X.moveTo(505 + Math.max(1, r), 1000); X.arc(505, 1000, Math.max(1, r), 0, Math.PI * 2, true); X.closePath(); X.fill();
      X.strokeStyle = AMAR; X.lineWidth = 14; X.beginPath(); X.arc(505, 1000, Math.max(1, r), 0, Math.PI * 2); X.stroke(); X.restore(); },
    fechamento(lt) { // post-its na parede
      [["30/11/2022", "o lançamento", "#ffe27a", -.06], ["1 MILHÃO", "em 5 dias", "#bfe3ff", .05], ["4 ANOS", "este mês", "#ffc4dc", -.03]].forEach(([a, b, c, r], i) => { const k = back(lin(lt, .1 + i * .2, .45 + i * .2)); if (k <= 0) return; const x = 215 + i * 290, y = 830 + (i % 2) * 30;
        X.save(); X.translate(x, y); X.rotate(r); X.scale(k, k); X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 14; X.fillStyle = c; X.fillRect(-125, -115, 250, 230); X.shadowBlur = 0; X.fillStyle = "rgba(255,255,255,.55)"; X.fillRect(-50, -130, 100, 32);
        X.fillStyle = TINTA; X.textAlign = "center"; X.textBaseline = "middle"; X.font = `400 ${cabe(70, a, 220)}px BB`; X.fillText(a, 0, -14); X.fillStyle = "#5a4a6a"; X.font = "400 38px BB"; X.fillText(b, 0, 52); X.restore(); });
      const p = back(lin(lt, .8, 1.2)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(400, 1070); X.scale(p, p); X.fillStyle = ROSA2; X.beginPath(); X.roundRect(-290, -62, 580, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = "400 88px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 6); X.restore();
      if (lt > 1.2) { X.globalAlpha = eo(lin(lt, 1.2, 1.6)); X.fillStyle = TINTA; X.font = "400 50px BB"; X.textAlign = "center"; X.fillText("SALVA PRA CONTAR PRA ALGUÉM", 400, 1185); X.globalAlpha = 1; } },
  }; };
const d5 = lt => 3.4;
const cores = { LAR: ROSA, VERDE: AZ, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

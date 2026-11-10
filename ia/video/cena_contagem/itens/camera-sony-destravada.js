// Reel 🆕 "Destravaram a câmera da Sony" (a7c2-tools para a A7C II; 13/11 14:00). Motor da cena_contagem.
// Identidade: ginásio de escalada: uma câmera mirrorless GIGANTE e genérica (sem marca nem logo) vira o paredão, com agarras coloridas;
// o mascote escala até o topo, onde uma tampa secreta abre e solta os recursos escondidos (paletas de cor, cartão de LUT, tela que gira
// na vertical). No aviso, aparece um botão grande "VOLTAR AO DE FÁBRICA". Ardósia + laranja-agarra + verde-limão.
// Elementos: faixa diagonal de aviso, nome escrito à mão, termômetro, tarja de TV, zoom atravessando uma tela, órbita,
// cartões que viram, Archivo Black. Mascote de capacete e mosquetão; ação principal: escalar.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const ARD = "#2e3a46", ARD2 = "#1d252e", LAR = "#ff7a1a", LIMA = "#b6f03c", CREME = "#fff8ee", TINTA = "#151b22", FUNDO = "#eef1f4", AZ = "#3aa0ff", ROSA = "#ff5f8f", AMAR = "#ffd23f";
rim.color.set(0xffe3c8); rim.intensity = 1.4; key.color.set(0xffffff); key.intensity = 150; key.position.set(3, 10, 7); key.target.position.set(0, 1.5, -.5);
S.add(new THREE.AmbientLight(0xeef4ff, .6));
// ---------- ginásio ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#d9e0e6"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(46,58,70,.08)"; for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(i * 50, 0); g.lineTo(i * 50 + 80, h); g.lineTo(i * 50 + 60, h); g.lineTo(i * 50 - 20, 0); g.fill(); } });
mesh(new THREE.PlaneGeometry(24, 12), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 5, -3.4).castShadow = false;
const colT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#3a6ea5"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,.08)"; for (let y = 0; y < h; y += 32) g.fillRect(0, y, w, 3); }); colT.wrapS = colT.wrapT = THREE.RepeatWrapping; colT.repeat.set(4, 3);
const chao = mesh(new THREE.PlaneGeometry(24, 14), new THREE.MeshStandardMaterial({ map: colT, roughness: .9 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// câmera gigante (paredão)
const CAM = new THREE.Group(); CAM.position.set(-.6, 0, -1.6); S.add(CAM); const corpoM = M("#23272d", { roughness: .55 });
box(3.4, 2.3, 1.0, corpoM, CAM, 0, 1.15, 0); box(1.0, .6, .9, corpoM, CAM, 1.15, 2.55, 0); const lente = mesh(new THREE.CylinderGeometry(.85, .85, 1.0, 40), M("#15181c", { roughness: .4 }), CAM, -.3, 1.15, .95); lente.rotation.x = Math.PI / 2;
const vidro = mesh(new THREE.CircleGeometry(.62, 40), M("#2b4a7a", { metalness: .9, roughness: .1 }), CAM, -.3, 1.15, 1.46); vidro.castShadow = false; mesh(new THREE.TorusGeometry(.72, .05, 8, 40), M(LAR, { roughness: .3 }), CAM, -.3, 1.15, 1.46);
box(.3, .12, .3, M("#888", { metalness: .8 }), CAM, 1.15, 2.92, 0); const dial = mesh(new THREE.CylinderGeometry(.22, .22, .12, 24), M("#555", { metalness: .7 }), CAM, -1.2, 2.36, 0);
// agarras coloridas no paredão
const AG = []; for (let i = 0; i < 18; i++) { const x = -1.6 + (i * 1.37) % 3.2, y = .3 + (i * .83) % 2.0; if (Math.hypot(x + .3, y - 1.15) < 1.0) continue; const a = mesh(new THREE.SphereGeometry(.09 + (i % 3) * .03, 8, 6), M([LAR, LIMA, AZ, ROSA, AMAR][i % 5], { roughness: .6 }), CAM, x, y, .52); a.scale.z = .6; AG.push(a); }
// tampa secreta no topo + itens que saem
const TAMPA = new THREE.Group(); TAMPA.position.set(.6, 2.3, -.5); CAM.add(TAMPA); box(1.0, .05, .9, M(LAR), TAMPA, 0, 0, .45);
const swT = c => ctex(64, 64, g => { g.fillStyle = c; g.fillRect(0, 0, 64, 64); });
const PERFIS = ["#d9a066", "#4fa3a5", "#c94f6d", "#e8e0c8"].map((c, i) => { const m = mesh(new THREE.BoxGeometry(.32, .32, .04), new THREE.MeshStandardMaterial({ map: swT(c) }), S); m.visible = false; return m; });
const lutT = ctex(256, 160, g => { g.fillStyle = CREME; g.fillRect(0, 0, 256, 160); const gr = g.createLinearGradient(20, 0, 236, 0); gr.addColorStop(0, "#2a6f97"); gr.addColorStop(.5, "#f4d35e"); gr.addColorStop(1, "#ee6c4d"); g.fillStyle = gr; g.fillRect(20, 20, 216, 70); g.fillStyle = TINTA; g.font = "400 40px AB"; g.textAlign = "center"; g.fillText("LUT", 128, 138); });
const LUT = mesh(new THREE.PlaneGeometry(.7, .44), new THREE.MeshStandardMaterial({ map: lutT, side: THREE.DoubleSide }), S); LUT.visible = false;
// telinha traseira (gira na vertical)
const telaT = ctex(200, 120, g => { const gr = g.createLinearGradient(0, 0, 200, 120); gr.addColorStop(0, "#ffb36b"); gr.addColorStop(1, "#5a7bd8"); g.fillStyle = gr; g.fillRect(0, 0, 200, 120); g.fillStyle = "rgba(255,255,255,.8)"; g.fillRect(96, 0, 2, 120); g.fillRect(0, 58, 200, 2); });
const TELA = new THREE.Group(); TELA.position.set(1.85, 1.3, .2); S.add(TELA); box(.06, .7, 1.1, M("#111"), TELA, 0, 0, 0); const tl = mesh(new THREE.PlaneGeometry(1.0, .6), new THREE.MeshBasicMaterial({ map: telaT }), TELA, .035, 0, 0); tl.rotation.y = Math.PI / 2; tl.castShadow = false;
// botão "voltar ao de fábrica"
const botT = ctex(256, 128, g => { g.fillStyle = LIMA; g.beginPath(); g.roundRect(0, 0, 256, 128, 26); g.fill(); g.fillStyle = TINTA; g.font = "400 34px AB"; g.textAlign = "center"; g.fillText("VOLTAR AO", 128, 56); g.fillText("DE FÁBRICA", 128, 98); });
const BOT = new THREE.Group(); BOT.position.set(.1, 0, 1.0); S.add(BOT); box(.5, .9, .5, M(ARD), BOT, 0, .45, 0); const botao = mesh(new THREE.CylinderGeometry(.2, .22, .12, 20), E(LIMA, .5), BOT, 0, .96, 0); const plB = mesh(new THREE.PlaneGeometry(.9, .45), new THREE.MeshBasicMaterial({ map: botT, transparent: true }), BOT, 0, 1.4, 0); plB.castShadow = false;
// ---------- mascote: capacete + mosquetão; escala ----------
const CAP = new THREE.Group(); CAP.position.set(0, 1.5, 0); MAS.corpo.add(CAP); const casco = mesh(new THREE.SphereGeometry(.62, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M(LAR, { roughness: .35 }), CAP, 0, -.05, 0); casco.scale.set(1.15, .55, .95);
const MOS = mesh(new THREE.TorusGeometry(.09, .025, 6, 14), M("#ccc", { metalness: .9 }), MAS.corpo, .6, .5, .5); const CORDA = box(.03, 3, .03, M(AMAR), S, 0, 0, 0);
const MZ0 = .1;
const escala = (lt, y0, y1, d) => { const k = eio(lin(lt, 0, d)), y = y0 + (y1 - y0) * k, ph = lt * 6; pose(MAS, { x: .9, z: MZ0 - .55, y, ry: 0, braco: [1.6 + Math.sin(ph) * .5, 1.6 - Math.sin(ph) * .5], andar: k < 1 ? lt * 3 : 0, piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(ph) * .05; CORDA.position.set(.9, y + 2.4, MZ0 - .55); };
const noTopo = (lt, ry = 0) => { pose(MAS, { x: .4, z: -1.6, y: 2.3 + hop(lt, .5, .05), ry, braco: [2.0 + Math.sin(lt * 9) * .3, 1.0], piscar: pisca(lt) }); MAS.g.rotation.z = 0; CORDA.position.set(.4, 4.7, -1.6); };
const chaoP = (lt, x, ry = -.3, braco = [.4, .6]) => { pose(MAS, { x, z: .6, y: hop(lt, .8, .03), ry, braco, piscar: pisca(lt) }); MAS.g.rotation.z = 0; CORDA.position.set(0, -5, 0); };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let TERM = 0;
const reset = (lt) => { PERFIS.forEach(p => p.visible = false); LUT.visible = false; TAMPA.rotation.x = 0; TELA.rotation.x = 0; BOT.visible = false; dial.rotation.y = lt * .5; };
const abre = (k, lt) => { TAMPA.rotation.x = -eio(k) * 1.6; PERFIS.forEach((p, i) => { const u = Math.max(0, Math.min(1, k * 1.4 - i * .12)); p.visible = u > 0; p.position.set(-1.2 + i * .42 + Math.sin(lt * 2 + i) * .03, 3.6 + eio(u) * (.5 + (i % 2) * .25), -2.3); p.rotation.set(0, Math.sin(lt + i) * .3, Math.sin(lt * 1.5 + i) * .2); });
  LUT.visible = k > .5; LUT.position.set(1.9, 2.8 + eio(Math.max(0, k - .5) * 2) * .7, -1.2); LUT.rotation.y = Math.sin(lt) * .3; };
// ---------- órbita ----------
const ORB = { gancho: [-.35, -.1, 7.8, 2.6, V(-.2, 1.8, -.8)], s1: [.3, .05, 7.6, 2.8, V(.2, 2.0, -.8)], s2: [-.15, .2, 8.6, 3.6, V(.3, 2.9, -1.2)], s3: [.25, -.05, 8.4, 3.5, V(.3, 2.8, -1.2)], s4: [-.3, -.55, 7.4, 2.4, V(-.8, 1.4, -.4)], cta: [.1, -.1, 8.2, 2.7, V(-.2, 1.9, -.8)] };
const SHOTS = {}; Object.keys(ORB).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a0, a1, r, y, l] = ORB[nome] || ORB.cta, a = a0 + (a1 - a0) * eio(lt / d); cam.position.set(l.x + Math.sin(a) * r, y, l.z + Math.cos(a) * r); cam.lookAt(l); };
const ACT = {
  gancho(lt, d) { reset(lt); TAMPA.rotation.x = -Math.abs(Math.sin(lt * 4)) * .12; escala(lt, 0, .5, d); },
  s1(lt, d) { reset(lt); escala(lt, .5, 1.3, d); },
  s2(lt, d) { reset(lt); abre(lin(lt, .2, 1.4), lt); TELA.rotation.x = eio(lin(lt, 2.0, 2.6)) * Math.PI / 2; noTopo(lt, .2); },
  s3(lt, d) { reset(lt); abre(1, lt); TELA.rotation.x = Math.PI / 2; TERM = eio(lin(lt, .3, 2.0)); noTopo(lt, -.1); },
  s4(lt, d) { reset(lt); abre(1, lt); BOT.visible = true; BOT.scale.setScalar(Math.max(.01, back(lin(lt, 1.6, 2.0)))); botao.material.emissiveIntensity = .5 + Math.max(0, Math.sin(lt * 6)) * 1.2; chaoP(lt, -1.4, .3, [.4, lt > 2.2 ? 1.3 : .6]); },
  cta(lt, d) { reset(lt); abre(1, lt); TELA.rotation.x = Math.PI / 2; BOT.visible = true; chaoP(lt, -1.2, -.1, [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3]); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 620;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px AB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const listras = (w, h) => { X.save(); X.beginPath(); X.rect(-w / 2, -h / 2, w, h); X.clip(); X.fillStyle = AMAR; X.fillRect(-w / 2, -h / 2, w, h); X.fillStyle = TINTA; for (let x = -w / 2 - h; x < w / 2 + h; x += 56) { X.beginPath(); X.moveTo(x, -h / 2); X.lineTo(x + 28, -h / 2); X.lineTo(x + 28 - h, h / 2); X.lineTo(x - h, h / 2); X.fill(); } X.restore(); };
  const termometro = (k, x, y) => { const v = Math.round(1159 * k); X.save(); X.translate(x, y); X.fillStyle = "rgba(255,255,255,.94)"; X.beginPath(); X.roundRect(-110, -170, 220, 360, 22); X.fill();
    X.fillStyle = "#e8ecf0"; X.beginPath(); X.roundRect(-22, -140, 44, 220, 22); X.fill(); X.beginPath(); X.arc(0, 100, 40, 0, 7); X.fill(); X.fillStyle = LAR; X.beginPath(); X.arc(0, 100, 30, 0, 7); X.fill(); const hh = 210 * k; X.fillRect(-12, 90 - hh, 24, hh + 10);
    for (let i = 0; i <= 4; i++) { X.fillStyle = TINTA; X.fillRect(26, 70 - i * 50, 16, 4); } X.fillStyle = TINTA; X.font = "400 46px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(v.toLocaleString("pt-BR"), 0, 160); X.font = "400 18px AB"; X.fillStyle = "#56606b"; X.fillText("★ ESTRELAS NO GITHUB", 0, 186); X.restore(); };
  const mao = (txt, x, y, lt, t0, fs) => { const p = eio(lin(lt, t0, t0 + .8)); X.save(); X.font = `700 ${fs}px CV`; X.textAlign = "left"; X.textBaseline = "middle"; const w = X.measureText(txt).width; X.fillStyle = "rgba(255,255,255,.92)"; X.beginPath(); X.roundRect(x - 24, y - fs * .7, w + 48, fs * 1.4, 18); X.fill(); X.beginPath(); X.rect(x - 6, y - fs, w * p + 12, fs * 2); X.clip(); X.fillStyle = TINTA; X.fillText(txt, x, y + 4); X.restore(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 60], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(238,241,244,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") mao("a7c2-tools", 100, 690, lt, .2, 92);
      if (nome === "s2") { const L = [["PERFIS DE COR", .4], ["LUTS PRÓPRIAS", 1.1], ["TELA NA VERTICAL", 2.0]]; L.forEach(([s, t0], i) => { const k = back(lin(lt, t0, t0 + .3)); if (k <= 0) return; X.save(); X.translate(80, 680 + i * 74); X.scale(k, k); X.fillStyle = [LAR, AZ, LIMA][i]; X.beginPath(); X.roundRect(0, -30, 420, 60, 30); X.fill(); X.fillStyle = i === 2 ? TINTA : "#fff"; X.font = "400 36px AB"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("✓ " + s, 24, 2); X.restore(); }); }
      if (nome === "s3") termometro(TERM, 820, 870);
      if (nome === "s4") { X.save(); X.translate(505, 700); X.rotate(-.04); listras(900, 26); X.translate(0, 22); X.fillStyle = TINTA; X.fillRect(-450, 0, 900, 92); X.fillStyle = AMAR; X.font = `400 ${cabe(46, "MEXE NO FIRMWARE: PODE AFETAR A GARANTIA", 860)}px AB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("MEXE NO FIRMWARE: PODE AFETAR A GARANTIA", 0, 48); X.restore(); } },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(-.04); X.save(); X.translate(0, -112); listras(980, 32); X.restore(); X.save(); X.translate(0, 116); listras(980, 32); X.restore();
      X.fillStyle = TINTA; X.fillRect(-490, -96, 980, 196); X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = "#fff"; cabe(70, l1, 900); X.fillText(l1, 0, -18); X.fillStyle = LAR; cabe(52, l2, 900); X.fillText(l2, 0, 40); X.fillStyle = LIMA; cabe(44, l3, 900); X.fillText(l3, 0, 88); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 64; X.font = `400 ${fs}px AB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 780 && fs > 36) { fs -= 2; X.font = `400 ${fs}px AB`; }
      const y = 1405, x0 = 505 - tot() / 2; X.fillStyle = ARD2; X.fillRect(40, y - 56, 910, 112); X.fillStyle = LAR; X.fillRect(40, y + 48, 910, 8); X.fillStyle = LAR; X.fillRect(60, y - 90, 310, 40); X.fillStyle = "#fff"; X.font = "400 24px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("DIRETO DO PAREDÃO", 215, y - 70);
      let x = x0; X.font = `400 ${fs}px AB`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? LIMA : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 260 + u * 2300, h = w * .62;
      X.save(); X.fillStyle = "#111418"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 18 * (1 - u) + 4); X.fill("evenodd"); X.restore(); },
    fechamento(lt) { // cartões que viram: PERFIS · LUTS · VERTICAL
      X.fillStyle = "rgba(238,241,244,.28)"; X.fillRect(0, 640, 1080, 860);
      [["PERFIS", "de cor novos"], ["LUTS", "próprias"], ["VERTICAL", "a tela"]].forEach(([a, b], i) => { const k = lin(lt, .1 + i * .22, .55 + i * .22), sx = Math.abs(Math.cos(k * Math.PI)), frente = k > .5, x = 210 + i * 300, y = 880;
        X.save(); X.translate(x, y); X.scale(Math.max(.02, sx), 1); X.fillStyle = frente ? "#fff" : LAR; X.beginPath(); X.roundRect(-130, -170, 260, 340, 22); X.fill();
        if (frente) { X.fillStyle = TINTA; X.font = `400 ${cabe(52, a, 220)}px AB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(a, 0, -20); X.fillStyle = "#56606b"; X.font = "400 30px AB"; X.fillText(b, 0, 46); } else { X.fillStyle = "#fff"; X.font = "400 130px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("?", 0, 8); } X.restore(); });
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 1190); X.scale(p, p); X.fillStyle = LAR; X.beginPath(); X.roundRect(-310, -62, 620, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = `400 ${cabe(70, "COMENTA " + CHAVE, 560)}px AB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore();
      if (lt > 1.3) { X.globalAlpha = eo(lin(lt, 1.3, 1.7)); X.fillStyle = TINTA; X.font = "400 32px AB"; X.textAlign = "center"; X.fillText("SÓ PRA QUEM SABE O RISCO", 505, 1300); X.globalAlpha = 1; } },
  }; };
const cores = { LAR, VERDE: LIMA, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

// Objetos e ações dos itens n5…n1 do Reel "5 projetos pra TV e celular" (05/11). Recebe K com as ferramentas da cena.
export default function (K) {
const { rim, key, palco, aro, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, misT, caixaMisterio, LAR, CREME, aponta, V } = K;
const CORES = ["#ff5a5f", "#ffd23f", "#3bceac", "#5b8cff", "#c86bff", "#ff9f1c"];


// ---------- identidade deste vídeo: sala de estar à noite (sem palco), azul-noite + âmbar ----------
const AMB = "#ffb703";
const sala0 = new THREE.Group(); S.add(sala0);
const piso = mesh(new THREE.PlaneGeometry(14, 10), M("#3b2a22", { roughness: .8 }), sala0, 0, 0, 0); piso.rotation.x = -Math.PI / 2;
const tapeteT = ctex(512, 512, (g, w, h) => { g.fillStyle = "#26324a"; g.beginPath(); g.arc(w / 2, h / 2, w / 2, 0, 7); g.fill(); g.strokeStyle = "#ffb703"; g.lineWidth = 10; for (const r of [230, 190, 120]) { g.beginPath(); g.arc(w / 2, h / 2, r, 0, 7); g.stroke(); } });
const tapete = mesh(new THREE.CircleGeometry(2.6, 48), new THREE.MeshStandardMaterial({ map: tapeteT, transparent: true, roughness: .9 }), sala0, 0, .01, .3); tapete.rotation.x = -Math.PI / 2;
const parede = mesh(new THREE.PlaneGeometry(14, 7), M("#1b2236", { roughness: .9 }), sala0, 0, 3.5, -2.6);
const janelaT = ctex(400, 300, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#0b1430"); gr.addColorStop(1, "#24325c"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = "#fff4cf"; g.beginPath(); g.arc(300, 70, 34, 0, 7); g.fill(); for (let i = 0; i < 40; i++) { g.fillStyle = "rgba(255,255,255,.7)"; g.fillRect((i * 97) % w, (i * 53) % 160, 2, 2); }
  for (let i = 0; i < 9; i++) { const x = i * 46, hh = 60 + (i * 37) % 90; g.fillStyle = "#0a0f1f"; g.fillRect(x, h - hh, 40, hh); g.fillStyle = "#ffcf6b"; for (let k = 0; k < 6; k++) if ((i + k) % 3) g.fillRect(x + 8 + (k % 2) * 16, h - hh + 12 + Math.floor(k / 2) * 20, 8, 8); } });
const janela = new THREE.Group(); janela.position.set(-2.1, 2.7, -2.55); sala0.add(janela);
box(2.0, 1.5, .08, M("#e9dcc6"), janela, 0, 0, 0); mesh(new THREE.PlaneGeometry(1.84, 1.34), new THREE.MeshBasicMaterial({ map: janelaT, toneMapped: false }), janela, 0, 0, .05); box(.05, 1.34, .1, M("#e9dcc6"), janela, 0, 0, .05);
const sofa = new THREE.Group(); sofa.position.set(-.2, 0, -1.9); sala0.add(sofa); const TEC = M("#c0573e", { roughness: .85 });
box(3.4, .45, 1.0, TEC, sofa, 0, .32, 0); box(3.4, .8, .3, TEC, sofa, 0, .85, -.38); box(.3, .6, 1.0, TEC, sofa, -1.7, .55, 0); box(.3, .6, 1.0, TEC, sofa, 1.7, .55, 0);
for (const x of [-.85, .85]) box(1.6, .14, .85, M("#d46a4f", { roughness: .85 }), sofa, x, .62, .05);
const abajur = new THREE.Group(); abajur.position.set(2.6, 0, -1.6); sala0.add(abajur); box(.06, 2.1, .06, M("#222"), abajur, 0, 1.05, 0);
mesh(new THREE.CylinderGeometry(.22, .36, .42, 24, 1, true), new THREE.MeshStandardMaterial({ color: "#ffe2a8", emissive: "#ffcf6b", emissiveIntensity: 1.2, side: THREE.DoubleSide }), abajur, 0, 2.15, 0);
const luzAb = new THREE.PointLight(0xffc46b, 18, 7, 1.5); luzAb.position.set(0, 2.0, .2); abajur.add(luzAb);
const planta = new THREE.Group(); planta.position.set(-2.8, 0, -1.4); sala0.add(planta); mesh(new THREE.CylinderGeometry(.25, .2, .45, 16), M("#e9dcc6"), planta, 0, .22, 0);
for (let i = 0; i < 7; i++) { const f = mesh(new THREE.SphereGeometry(.28, 12, 8), M(i % 2 ? "#3f8f5a" : "#2f7a4a"), planta, Math.sin(i * 1.7) * .22, .7 + i * .12, Math.cos(i * 1.7) * .18); f.scale.set(1, .55, .6); }
rim.color.set(0x6f8cff); key.color.set(0xffe6c4);

// gancho: TV antiga de tubo liga com chuvisco e um "?" aparece no meio do chiado
const gG = grupo("gancho");
const chiadoT = ctex(256, 192, (g, w, h, k = 0, liga = 0) => { const d = g.createImageData(w, h); let s = k * 7919 + 1;
  for (let i = 0; i < d.data.length; i += 4) { s = (s * 16807) % 2147483647; const v = (s % 255) * liga; d.data[i] = v; d.data[i + 1] = v; d.data[i + 2] = v * 1.05; d.data[i + 3] = 255; } g.putImageData(d, 0, 0);
  if (liga > .6) { g.font = "700 140px SG"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = AMB; g.globalAlpha = (liga - .6) / .4; g.fillText("?", w / 2 + (k % 3 - 1) * 4, h / 2 + 8); g.globalAlpha = 1; } });
const crt = new THREE.Group(); crt.position.set(1.1, 0, 0); gG.add(crt);
box(1.5, 1.2, 1.1, M("#6b4a2e", { roughness: .6 }), crt, 0, 1.15, 0); mesh(new THREE.PlaneGeometry(1.1, .82), new THREE.MeshBasicMaterial({ map: chiadoT, toneMapped: false }), crt, -.1, 1.17, .56);
for (const s of [-1, 1]) { const a = box(.03, .7, .03, M("#aaa", { metalness: .8 }), crt, s * .25, 2.05, 0); a.rotation.z = s * .5; }
box(.9, .5, .7, M("#3a2a1e"), crt, 0, .3, 0); const luzCrt = new THREE.PointLight(0xbfd6ff, 0, 5, 1.5); luzCrt.position.set(1.0, 1.2, 1.0); gG.add(luzCrt);
const ctrl0 = new THREE.Group(); gG.add(ctrl0); box(.14, .5, .06, M("#1d1a1a"), ctrl0, 0, 0, 0); mesh(new THREE.SphereGeometry(.035, 10, 8), E("#ff3b3b", 2), ctrl0, 0, .15, .04);

// fechamento: pipoca caindo na sala
const cG = grupo("cta"); const pip = [];
for (let i = 0; i < 70; i++) { const m = mesh(new THREE.SphereGeometry(.06 + rnd() * .03, 8, 6), M(i % 5 ? "#fff3d6" : "#ffd36b", { roughness: .9 }), cG); m.castShadow = false; m.scale.set(1, .8, 1.1); pip.push({ m, x: (rnd() - .5) * 6, z: -1 + rnd() * 2.5, y0: 4 + rnd() * 5, v: .7 + rnd() * .6, w: rnd() * 6 }); }
const balde = new THREE.Group(); cG.add(balde); mesh(new THREE.CylinderGeometry(.32, .24, .5, 20, 1, true), new THREE.MeshStandardMaterial({ map: ctex(256, 64, (g, w, h) => { for (let x = 0; x < w; x += 32) { g.fillStyle = (x / 32) % 2 ? "#fff" : "#e63946"; g.fillRect(x, 0, 32, h); } }), side: THREE.DoubleSide }), balde, 0, 0, 0);
for (let i = 0; i < 9; i++) mesh(new THREE.SphereGeometry(.08, 8, 6), M("#fff3d6"), balde, Math.sin(i * 2.3) * .18, .27 + (i % 3) * .05, Math.cos(i * 2.3) * .18);

// peças reutilizáveis: celular e TV (genéricos, sem marca)
function celular(par, tex, x, y, z, s = 1) { const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(s); par.add(g);
  mesh(new THREE.BoxGeometry(.78, 1.55, .09), M("#16151b", { metalness: .5, roughness: .3 }), g, 0, 0, 0);
  mesh(new THREE.PlaneGeometry(.7, 1.42), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }), g, 0, 0, .05); return g; }
function tv(par, tex, x, y, z, w = 2.6, h = 1.5) { const g = new THREE.Group(); g.position.set(x, y, z); par.add(g);
  box(w + .1, h + .1, .1, M("#0d0c0e", { metalness: .4, roughness: .35 }), g, 0, 0, 0);
  mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }), g, 0, 0, .06);
  box(.5, .06, .3, M("#0d0c0e"), g, 0, -h / 2 - .5, 0); box(.08, .45, .08, M("#0d0c0e"), g, 0, -h / 2 - .25, 0); return g; }
function telaApps(g, w, h, n = 12, sel = -1) { g.fillStyle = "#101826"; g.fillRect(0, 0, w, h); g.fillStyle = "#f4ead8"; g.font = "700 26px SG"; g.textAlign = "center"; g.fillText("9:41", w / 2, 40);
  for (let i = 0; i < n; i++) { const c = i % 3, r = Math.floor(i / 3), x = 30 + c * 82, y = 80 + r * 92; g.fillStyle = CORES[i % 6]; g.beginPath(); g.roundRect(x, y, 62, 62, 16); g.fill();
    if (i === sel) { g.strokeStyle = "#fff"; g.lineWidth = 6; g.beginPath(); g.roundRect(x - 6, y - 6, 74, 74, 20); g.stroke(); } } }

// n5 NOIR: celular soltando pacotinhos de dados para servidores; uma lupa passa por cima
const n5 = grupo("n5");
const appsT = ctex(300, 600, (g, w, h) => telaApps(g, w, h));
const cel5 = celular(n5, appsT, .75, 1.45, 0, 1.05); cel5.rotation.y = -.25;
const servs = [[2.1, 2.2, -1.4], [2.4, 1.2, -1.2], [1.9, .5, -1.6]].map(([x, y, z]) => { const s = new THREE.Group(); s.position.set(x, y, z); n5.add(s);
  box(.55, .36, .4, M("#2a2622", { metalness: .5 }), s, 0, 0, 0); for (let k = 0; k < 3; k++) mesh(new THREE.SphereGeometry(.03, 8, 6), E(k ? "#3bceac" : LAR, 2), s, -.18 + k * .1, .08, .21); return s; });
const pacotes = []; for (let i = 0; i < 18; i++) { const p = mesh(new THREE.BoxGeometry(.09, .09, .09), E(CORES[i % 6], 1.6), n5, 0, 0, 0); p.castShadow = false; pacotes.push({ p, s: i % 3, ph: i / 18 }); }
const lupa = new THREE.Group(); n5.add(lupa); mesh(new THREE.TorusGeometry(.26, .04, 10, 30), M("#d9d4cc", { metalness: .8, roughness: .2 }), lupa, 0, 0, 0);
mesh(new THREE.CircleGeometry(.24, 24), new THREE.MeshStandardMaterial({ color: "#bfe8ff", transparent: true, opacity: .25 }), lupa, 0, 0, 0);
mesh(new THREE.CylinderGeometry(.04, .05, .45, 10), M("#3a2a20"), lupa, .25, -.3, 0).rotation.z = .7;

// n4 TV Detox: TV lenta e entulhada (carregando...) que fica limpa no meio da fala
const n4 = grupo("n4");
const tv4T = ctex(640, 370, (g, w, h, t = 0, limpa = 0) => {
  if (limpa < 1) { g.fillStyle = "#1a1418"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 14; i++) { const x = (i % 5) * 128 + 6, y = Math.floor(i / 5) * 118 + 8; g.fillStyle = CORES[(i * 2) % 6]; g.globalAlpha = .85; g.fillRect(x, y, 118, 104); g.globalAlpha = 1;
      g.fillStyle = "#fff"; g.font = "700 22px SG"; g.textAlign = "center"; g.fillText(["OFERTA", "PATROCINADO", "NOVO!", "ASSINE", "GRÁTIS*", "PROMO"][i % 6], x + 59, y + 60); }
    g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(0, 0, w, h); g.save(); g.translate(w / 2, h / 2); g.rotate(t * 5); g.strokeStyle = "#fff"; g.lineWidth = 10; g.beginPath(); g.arc(0, 0, 44, 0, 4.4); g.stroke(); g.restore(); }
  if (limpa > 0) { g.save(); g.beginPath(); g.rect(0, 0, w * limpa, h); g.clip(); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#1d2433"); gr.addColorStop(1, "#0d1018"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = "#f4ead8"; g.font = "700 46px SG"; g.textAlign = "left"; g.fillText("20:15", 40, 70); g.font = "500 22px IN"; g.fillStyle = "#9aa3b5"; g.fillText("Início", 40, 104);
    for (let i = 0; i < 4; i++) { g.fillStyle = ["#e5383b", "#2b7de9", "#3bceac", "#f4ead8"][i]; g.beginPath(); g.roundRect(40 + i * 146, 190, 126, 126, 20); g.fill(); }
    g.restore(); if (limpa < 1) { g.fillStyle = "#fff"; g.fillRect(w * limpa - 3, 0, 6, h); } } });
const tv4 = tv(n4, tv4T, .95, 1.75, -.5);
const controle = new THREE.Group(); n4.add(controle); box(.14, .5, .06, M("#1d1a1a"), controle, 0, 0, 0); mesh(new THREE.SphereGeometry(.035, 10, 8), E(LAR, 1.5), controle, 0, .15, .04);

// n3 3D Model Anything: feixe de escaneamento; a sala surge em malha aramada e depois sólida
const n3 = grupo("n3");
const sala = new THREE.Group(); sala.position.set(1.05, 0, -.4); n3.add(sala); const salaPecas = [];
function peca(geo, cor, x, y, z) { const m = mesh(geo, new THREE.MeshStandardMaterial({ color: cor, transparent: true, opacity: 0 }), sala, x, y, z);
  const l = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: "#5ee7ff", transparent: true, opacity: 0 })); m.add(l); salaPecas.push({ m, l, y }); return m; }
peca(new THREE.BoxGeometry(2.4, .04, 1.8), "#8a6a4a", 0, .02, 0); peca(new THREE.BoxGeometry(2.4, 1.5, .04), "#d9cbb4", 0, .77, -.9); peca(new THREE.BoxGeometry(.04, 1.5, 1.8), "#cdbfa6", -1.2, .77, 0);
peca(new THREE.BoxGeometry(1.1, .32, .5), "#5b8cff", -.3, .2, -.55); peca(new THREE.BoxGeometry(1.1, .3, .12), "#4a76de", -.3, .5, -.78);
peca(new THREE.CylinderGeometry(.28, .28, .05, 24), "#c79a63", .65, .42, .2); peca(new THREE.CylinderGeometry(.04, .04, .4, 8), "#3a2a20", .65, .2, .2);
peca(new THREE.BoxGeometry(.5, .7, .04), "#3bceac", .6, 1.0, -.86);
const cel3 = celular(n3, ctex(300, 600, (g, w, h) => { g.fillStyle = "#0b1b26"; g.fillRect(0, 0, w, h); g.strokeStyle = "#5ee7ff"; g.lineWidth = 3; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(0, i * 80); g.lineTo(w, i * 80 + 40); g.stroke(); } g.fillStyle = "#5ee7ff"; g.font = "700 30px SG"; g.textAlign = "center"; g.fillText("ESCANEANDO", w / 2, h - 50); }), 0, 0, 0, .45);
const feixe = mesh(new THREE.PlaneGeometry(2.6, .05), new THREE.MeshBasicMaterial({ color: "#5ee7ff", transparent: true, opacity: .8, toneMapped: false }), sala, 0, .5, 0); feixe.castShadow = false;

// n2 Mika: celular grande; um dedinho-robô toca os apps sozinho e uma lista vai sendo marcada
const n2 = grupo("n2");
const mikaT = ctex(300, 600, (g, w, h, sel = -1) => telaApps(g, w, h, 12, sel));
const cel2 = celular(n2, mikaT, .85, 1.55, 0, 1.25); cel2.rotation.y = -.2;
const dedo = new THREE.Group(); n2.add(dedo); mesh(new THREE.CylinderGeometry(.06, .06, .5, 12), E("#5ee7ff", .8), dedo, 0, .25, 0); mesh(new THREE.SphereGeometry(.075, 14, 10), E("#5ee7ff", 1.4), dedo, 0, 0, 0);
const listaT = ctex(320, 220, (g, w, h, n = 0) => { g.clearRect(0, 0, w, h); g.fillStyle = "rgba(244,234,216,.95)"; g.beginPath(); g.roundRect(0, 0, w, h, 18); g.fill();
  ["Abrir o app", "Achar o pedido", "Confirmar"].forEach((s, i) => { const y = 50 + i * 62; g.strokeStyle = "#1b1712"; g.lineWidth = 4; g.strokeRect(22, y - 18, 34, 34);
    if (i < n) { g.strokeStyle = LAR; g.lineWidth = 7; g.beginPath(); g.moveTo(26, y); g.lineTo(37, y + 11); g.lineTo(58, y - 16); g.stroke(); } g.fillStyle = "#1b1712"; g.font = "700 30px SG"; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText(s, 74, y + 2); }); });
const lista = mesh(new THREE.PlaneGeometry(1.1, .76), new THREE.MeshBasicMaterial({ map: listaT, transparent: true, toneMapped: false }), n2, 2.15, 2.25, -.3); lista.castShadow = false;

// n1 CleanYourTV: a caixa "?" explode; TV gigante coberta de anúncios que voam para fora, sobra a tela limpa
const n1 = grupo("n1");
const limpoT = ctex(640, 370, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#1d2433"); gr.addColorStop(1, "#0d1018"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = "#f4ead8"; g.font = "700 46px SG"; g.textAlign = "left"; g.fillText("Início", 40, 74); for (let i = 0; i < 4; i++) { g.fillStyle = ["#e5383b", "#2b7de9", "#3bceac", "#f4ead8"][i]; g.beginPath(); g.roundRect(40 + i * 146, 170, 126, 126, 20); g.fill(); } });
const tv1 = tv(n1, limpoT, 1.0, 1.8, -.5, 2.8, 1.62);
const ADS = ["OFERTA!", "PATROCINADO", "ASSINE JÁ", "NOVO", "PROMO", "VEJA AGORA", "ANÚNCIO", "GRÁTIS*", "CLIQUE"];
const anuncios = ADS.map((txt, i) => { const t = ctex(256, 160, (g, w, h) => { g.fillStyle = CORES[i % 6]; g.fillRect(0, 0, w, h); g.strokeStyle = "#fff"; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8);
    g.fillStyle = "#fff"; g.font = "700 40px SG"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, w / 2, h / 2); });
  const c = i % 3, r = Math.floor(i / 3); const m = mesh(new THREE.PlaneGeometry(.92, .54), new THREE.MeshBasicMaterial({ map: t, toneMapped: false, side: THREE.DoubleSide }), n1, 0, 0, 0); m.castShadow = false;
  return { m, bx: 1.0 - .93 + c * .93, by: 1.8 + .54 - r * .54, ord: [4, 1, 7, 0, 5, 2, 8, 3, 6][i], v: new THREE.Vector3((rnd() - .5) * 3, 1 + rnd() * 2, 1.5 + rnd() * 2), w: (rnd() - .5) * 10 }; });

const SHOTS = {
  n5: [[V(.2, 2.1, 6.4), V(.4, 1.4, -.2)], [V(.4, 1.8, 5.0), V(.25, 1.45, 0)]],
  n4: [[V(.1, 2.1, 6.4), V(.2, 1.5, 0)], [V(.4, 1.9, 5.1), V(.2, 1.55, -.3)]],
  n3: [[V(.2, 2.3, 6.2), V(.3, .9, -.3)], [V(.6, 1.9, 4.9), V(.35, .85, -.4)]],
  n2: [[V(.2, 2.1, 6.4), V(.4, 1.5, 0)], [V(.5, 1.9, 5.0), V(.3, 1.55, 0)]],
  n1: [[V(.2, 2.2, 6.6), V(.4, 1.5, 0)], [V(.6, 2.0, 5.2), V(.5, 1.7, -.3)]],
};
const ACT = {
  n5(lt, d) { pose(MAS, { x: -1.15, y: hop(lt, .7, .06), piscar: pisca(lt), ...aponta(lt) }); cel5.rotation.y = -.25 + Math.sin(lt * 1.5) * .08;
    const o = new THREE.Vector3(.75, 1.6, .1);
    pacotes.forEach(P => { const k = ((lt * .55 + P.ph) % 1), alvo = servs[P.s].position; P.p.position.lerpVectors(o, alvo, k); P.p.position.y += Math.sin(k * Math.PI) * .7; P.p.rotation.set(lt * 4, lt * 3, 0); P.p.visible = lt > .3; });
    lupa.position.set(.75 + Math.sin(lt * 1.8) * .3, 1.55 + Math.cos(lt * 2.3) * .45, .45); lupa.rotation.set(0, -.2, Math.sin(lt) * .2); },
  n4(lt, d) { const limpa = eio(lin(lt, d * .45, d * .75)); tv4T.draw(lt, limpa);
    pose(MAS, { x: -1.15, y: limpa > .99 ? hop(lt, .4, .2) : 0, braco: [.2, .7 + (lt % .6 < .15 ? .25 : 0)], ry: .45, piscar: pisca(lt) });
    const w = new THREE.Vector3(); MAS.bracos[1].getWorldPosition(w); controle.position.set(w.x + .22, w.y + .12, w.z + .2); controle.rotation.set(-.9, 0, .3); },
  n3(lt, d) { const ar = eio(lin(lt, .3, d * .55)), so = eio(lin(lt, d * .55, d * .85));
    salaPecas.forEach((P, i) => { const vis = cl01(ar * salaPecas.length - i); P.l.material.opacity = vis * (1 - so * .7); P.m.material.opacity = so; P.m.scale.y = .2 + .8 * eo(vis); });
    feixe.position.y = .1 + ((lt * .9) % 1.4); feixe.visible = so < .9; feixe.material.opacity = .8 * (1 - so);
    pose(MAS, { x: -1.35, y: 0, braco: [.2, 1.1 + Math.sin(lt * 2) * .1], ry: .5, piscar: pisca(lt) });
    const w = new THREE.Vector3(); MAS.bracos[1].getWorldPosition(w); cel3.position.set(w.x + .22, w.y + .28, w.z + .15); cel3.rotation.set(0, .9, 0); },
  n2(lt, d) { const k = Math.floor(lt / .55) % 12, toque = (lt % .55) / .55; mikaT.draw(k); listaT.draw(Math.min(3, Math.floor(lt / (d / 3.4))));
    const c = k % 3, r = Math.floor(k / 3); const alvo = new THREE.Vector3(); const px = 61 + c * 82, py = 111 + r * 92; cel2.localToWorld(alvo.set((px / 300 - .5) * .7, (.5 - py / 600) * 1.42, .08));
    dedo.position.set(alvo.x, alvo.y + .02, alvo.z + .1 + Math.max(0, Math.sin(toque * Math.PI)) * .25); dedo.rotation.set(Math.PI / 2 - .3, 0, 0);
    pose(MAS, { x: -1.1, y: hop(lt, .8, .05), piscar: pisca(lt), ...aponta(lt) }); },
  n1(lt, d) { const liga = eio(lin(lt, 0, .55));
    tv1.visible = true; tv1.scale.setScalar(.6 + .4 * back(lin(lt, 0, .6))); tv1.position.y = 1.8 + (lt < .55 ? Math.sin(lt * 50) * .02 : 0);
    anuncios.forEach(A => { const t0 = 1.3 + A.ord * .28, tt = Math.max(0, lt - t0); A.m.visible = tt < 1.6;
      A.m.position.set(A.bx + A.v.x * tt, A.by + A.v.y * tt - 3 * tt * tt, -.39 + A.v.z * tt); A.m.rotation.set(A.w * tt * .3, A.w * tt * .2, A.w * tt * .15); A.m.scale.setScalar(back(lin(lt, 0, .35)) * (tt > 0 ? 1 : 1 + Math.sin(lt * 12 + A.ord) * .03)); });
    pose(MAS, { x: -1.3, y: lt < .6 ? 0 : hop(lt, .35, .12) * (lt < 1.6 ? 1 : .4), sq: lt > .45 && lt < .6 ? .15 : 0, piscar: lt > .45 && lt < 1.2 ? .4 : pisca(lt), ...aponta(lt) });
    return lt > .45 && lt < .8 ? (.8 - lt) * .15 : 0; },
};
ACT.gancho = (lt, d) => { const liga = lin(lt, .7, 1.4), k = Math.floor(lt * 18); chiadoT.draw(k, eio(liga)); luzCrt.intensity = 14 * eio(liga);
  crt.position.y = lt > .7 && lt < .85 ? Math.sin(lt * 80) * .02 : 0; crt.rotation.y = -.25 + Math.sin(lt * .8) * .05;
  const sobe = eo(lin(lt, 1.4, 1.9)); pose(MAS, { x: -1.15, y: lt < 1.4 ? .3 : hop(lt, .5, .12) * sobe, z: lt < 1.4 ? -1.2 : -1.2 + sobe * 1.2, sq: lt > 1.4 && lt < 1.55 ? .15 : 0, piscar: pisca(lt), ...(lt < 1.4 ? { braco: [.2, .7 + (lt % .5 < .12 ? .25 : 0)], ry: .3 } : aponta(lt)) });
  const w = new THREE.Vector3(); MAS.bracos[1].getWorldPosition(w); ctrl0.position.set(w.x + .22, w.y + .12, w.z + .2); ctrl0.rotation.set(-.9, 0, .3); ctrl0.visible = lt < 1.6;
  return lt > .7 && lt < .9 ? .02 : 0; };
SHOTS.gancho = [[V(.1, 2.0, 6.0), V(0, 1.2, -.4)], [V(.5, 1.7, 4.4), V(.6, 1.2, 0)]];
ACT.cta = (lt, d) => { pose(MAS, { x: 0, y: hop(lt, .5, .15), braco: [.3, 1.9 + Math.sin(lt * 9) * .5], piscar: pisca(lt), sq: Math.max(0, Math.cos(lt * Math.PI / .5)) * .05 });
  const w = new THREE.Vector3(); MAS.bracos[0].getWorldPosition(w); balde.position.set(w.x - .2, w.y + .05, w.z + .25);
  pip.forEach(P => { const y = ((P.y0 - lt * P.v * 2.2) % 6 + 6) % 6; P.m.position.set(P.x + Math.sin(lt * 2 + P.w) * .2, y, P.z); P.m.rotation.set(lt * P.w, lt * 2, 0); }); };
SHOTS.cta = [[V(0, 1.8, 6.2), V(0, 1.2, -.3)], [V(.5, 1.6, 5.0), V(0, 1.2, 0)]];
function cl01(x) { return Math.max(0, Math.min(1, x)); }
const cores = { LAR: AMB, VERDE: "#7fd7ff", FUNDO: "#0b1020", CREME: "#f4ead8", TINTA: "#14121a", BRILHO: "rgba(255,183,3,.12)" };
return { SHOTS, ACT, cores, semPalco: true };
}

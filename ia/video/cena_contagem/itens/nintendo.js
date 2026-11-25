// Reel "5 projetos que a Nintendo não queria" (08/11 19:30). Identidade: fliperama neon proibido com sirene,
// magenta + verde-limão + vermelho-alerta. Elementos: letreiro neon com letra falhando, nome em split-flap, placar 8-bit
// HI-SCORE, legenda em tarja de arcade, transição glitch RGB + LEVEL UP, fechamento "CONTINUE?"; mascote de fone gamer,
// se escondendo da sirene; câmera em órbita + câmera na mão. Sem logos, personagens ou artes da Nintendo.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const MAG = "#ff2bd6", LIMA = "#b6ff3b", ALERTA = "#ff2a2a", NOITE = "#0a0712";

// ---------- cenário: fliperama ----------
const arc = new THREE.Group(); S.add(arc); S.fog = new THREE.Fog(NOITE, 6, 16);
const xadrezT = ctex(512, 512, (g, w, h) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? "#15101f" : "#2a1d3d"; g.fillRect(i * 64, j * 64, 64, 64); } });
xadrezT.wrapS = xadrezT.wrapT = THREE.RepeatWrapping; xadrezT.repeat.set(5, 4);
const piso = mesh(new THREE.PlaneGeometry(20, 14), new THREE.MeshStandardMaterial({ map: xadrezT, roughness: .25, metalness: .3 }), arc, 0, 0, 0); piso.rotation.x = -Math.PI / 2;
mesh(new THREE.PlaneGeometry(20, 8), M("#120c1e", { roughness: .9 }), arc, 0, 4, -3.6);
const telasArc = [];
function maquina(par, x, z, ry, cor, k) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; par.add(g);
  box(1.0, 2.1, .9, M("#1b1424", { roughness: .5 }), g, 0, 1.05, 0); box(1.02, .3, .92, E(cor, 1.4), g, 0, 2.25, 0);
  const t = ctex(64, 64, (gg, w, h, f = 0) => { gg.fillStyle = "#050308"; gg.fillRect(0, 0, w, h); for (let i = 0; i < 14; i++) { gg.fillStyle = [MAG, LIMA, "#36d6ff", "#ffd23f"][(i + k + f) % 4]; gg.fillRect((i * 17 + f * 3 + k * 11) % 56, (i * 23 + f * 5) % 56, 6, 6); } }, true);
  const sc = mesh(new THREE.PlaneGeometry(.78, .62), new THREE.MeshBasicMaterial({ map: t, toneMapped: false }), g, 0, 1.55, .46); sc.rotation.x = -.15; telasArc.push(t);
  box(.9, .1, .35, M("#2a2238"), g, 0, 1.05, .55); for (let b = 0; b < 3; b++) mesh(new THREE.CylinderGeometry(.05, .05, .04, 12), E([MAG, LIMA, "#36d6ff"][b], 2), g, -.2 + b * .2, 1.12, .58); return g; }
[[-3.2, -2.2, .3, MAG], [-1.9, -2.6, .12, LIMA], [1.9, -2.6, -.12, "#36d6ff"], [3.2, -2.2, -.3, MAG], [-4.4, -1.2, .7, LIMA], [4.4, -1.2, -.7, "#ffd23f"]].forEach(([x, z, r, c], k) => maquina(arc, x, z, r, c, k));
const sirene = new THREE.Group(); sirene.position.set(0, 3.3, -2.0); arc.add(sirene); mesh(new THREE.CylinderGeometry(.22, .26, .3, 20), E(ALERTA, 2.5), sirene, 0, 0, 0);
const spot = new THREE.SpotLight(0xff2a2a, 60, 14, .45, .5, 1.2); spot.position.set(0, 3.3, -2.0); arc.add(spot, spot.target);
const fumaca = []; for (let i = 0; i < 14; i++) { const f = mesh(new THREE.PlaneGeometry(2.4, .8), new THREE.MeshBasicMaterial({ color: "#6b4a9a", transparent: true, opacity: .07, depthWrite: false }), arc, 0, 0, 0); f.rotation.x = -Math.PI / 2; f.castShadow = false; fumaca.push({ f, x: (rnd() - .5) * 8, z: -2 + rnd() * 4, ph: rnd() * 6 }); }
rim.color.set(0xff2bd6); rim.intensity = 2.2; key.color.set(0xe6dcff); key.intensity = 70;

// ---------- mascote: fone gamer + controle ----------
const fone = new THREE.Group(); MAS.corpo.add(fone); const arco = mesh(new THREE.TorusGeometry(.78, .05, 8, 30, Math.PI), M("#1d1a24"), fone, 0, 1.12, 0); arco.rotation.z = 0;
for (const s of [-1, 1]) { mesh(new THREE.CylinderGeometry(.2, .2, .14, 20), M("#1d1a24"), fone, s * .8, 1.0, 0).rotation.z = Math.PI / 2; mesh(new THREE.TorusGeometry(.16, .025, 6, 20), E(LIMA, 2), fone, s * .88, 1.0, 0).rotation.y = Math.PI / 2; }
const controle = new THREE.Group(); S.add(controle); box(.6, .12, .3, M("#2a2238"), controle, 0, 0, 0); for (const s of [-1, 1]) box(.16, .12, .32, M("#2a2238"), controle, s * .3, -.04, .05);
for (let b = 0; b < 4; b++) mesh(new THREE.SphereGeometry(.035, 8, 6), E([MAG, LIMA, "#36d6ff", "#ffd23f"][b], 2), controle, .15 + (b % 2) * .07, .07, -.04 + Math.floor(b / 2) * .07);
function joga(lt, x, z = .4) { controle.visible = true; const a = Math.abs(Math.sin(lt * 15)) * .15; pose(MAS, { x, z, y: hop(lt, .7, .05), braco: [.5 + a, .5 + Math.abs(Math.sin(lt * 15 + 1)) * .15], ry: .2, piscar: pisca(lt) });
  const w = new THREE.Vector3(); MAS.corpo.getWorldPosition(w); controle.position.set(x + .05, .95 + MAS.g.position.y, z + .62); controle.rotation.set(.5, .2, Math.sin(lt * 8) * .1); }

// ---------- gancho: letreiro PROIBIDO pisca e racha; o mascote se esconde atrás da máquina e espia ----------
const gG = grupo("gancho");
const proT = ctex(512, 160, (g, w, h, on = 1) => { g.clearRect(0, 0, w, h); g.font = "400 120px BB"; g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = ALERTA; g.shadowBlur = on ? 30 : 0; g.fillStyle = on ? "#ffdede" : "#5a2020"; g.fillText("PROIBIDO", w / 2, h / 2 + 6); g.lineWidth = 6; g.strokeStyle = on ? ALERTA : "#3a1515"; g.strokeRect(10, 10, w - 20, h - 20); });
const metades = [0, 1].map(i => { const geo = new THREE.PlaneGeometry(1.4, .9); const uv = geo.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, (i + uv.getX(k)) / 2);
  const m = mesh(geo, new THREE.MeshBasicMaterial({ map: proT, transparent: true, toneMapped: false, side: THREE.DoubleSide }), gG, 0, 0, 0); m.castShadow = false; return m; });
const maqG = maquina(gG, 1.6, .2, -.25, MAG, 9);

// ---------- itens ----------
const n5 = grupo("n5"); // mush8: kart de blocos derrapando numa pista que sai de dentro de um iPhone
const fone5 = new THREE.Group(); fone5.position.set(1.2, .05, -.2); fone5.rotation.y = -.3; n5.add(fone5); box(1.0, .08, 2.0, M("#15151a"), fone5, 0, 0, 0);
const pistaT = ctex(256, 512, (g, w, h, t = 0) => { g.fillStyle = "#2b2b33"; g.fillRect(0, 0, w, h); g.fillStyle = "#fff"; for (let y = (t * 400) % 60 - 60; y < h; y += 60) g.fillRect(w / 2 - 6, y, 12, 30); for (let y = 0; y < h; y += 40) { g.fillStyle = (Math.floor(y / 40 + t * 8) % 2) ? ALERTA : "#fff"; g.fillRect(0, y, 16, 40); g.fillRect(w - 16, y, 16, 40); } });
const pista = mesh(new THREE.PlaneGeometry(.9, 1.85), new THREE.MeshBasicMaterial({ map: pistaT, toneMapped: false }), fone5, 0, .05, 0); pista.rotation.x = -Math.PI / 2;
const kart = new THREE.Group(); n5.add(kart); box(.6, .16, .9, E(MAG, .3), kart, 0, .16, 0); box(.3, .25, .3, M("#ffd23f"), kart, 0, .4, -.05); for (const [x, z] of [[-.32, -.3], [.32, -.3], [-.32, .32], [.32, .32]]) mesh(new THREE.CylinderGeometry(.12, .12, .1, 14), M("#111"), kart, x, .12, z).rotation.z = Math.PI / 2;
const faiscas = []; for (let i = 0; i < 16; i++) { const f = mesh(new THREE.BoxGeometry(.05, .05, .05), E(i % 2 ? "#36d6ff" : "#ffd23f", 3), n5, 0, 0, 0); f.castShadow = false; faiscas.push({ f, ph: rnd(), s: rnd() - .5 }); }
const n4 = grupo("n4"); // NX2Apple: cartucho genérico entra no Mac e um ícone voa para o iPhone
const mac = new THREE.Group(); mac.position.set(.9, 0, -.3); n4.add(mac); box(1.6, .06, 1.0, M("#c9ccd6", { metalness: .6, roughness: .3 }), mac, 0, .7, 0); box(.1, .7, .1, M("#888"), mac, 0, .35, 0);
const macTela = new THREE.Group(); macTela.position.set(0, .73, -.5); macTela.rotation.x = -.15; mac.add(macTela); box(1.6, 1.0, .05, M("#c9ccd6", { metalness: .6, roughness: .3 }), macTela, 0, .5, 0);
const barraT = ctex(256, 160, (g, w, h, p = 0) => { g.fillStyle = "#111622"; g.fillRect(0, 0, w, h); g.fillStyle = "#fff"; g.font = "400 22px PS"; g.fillText("BUILD", 20, 50); g.fillStyle = "#333"; g.fillRect(20, 90, 216, 24); g.fillStyle = LIMA; g.fillRect(20, 90, 216 * p, 24); });
mesh(new THREE.PlaneGeometry(1.5, .9), new THREE.MeshBasicMaterial({ map: barraT, toneMapped: false }), macTela, 0, .5, .03);
const cart = new THREE.Group(); n4.add(cart); box(.5, .62, .1, M("#3b2f55"), cart, 0, 0, 0); box(.36, .3, .11, E(LIMA, .6), cart, 0, .05, 0);
const iph = new THREE.Group(); iph.position.set(2.6, 1.2, .2); iph.rotation.y = -.5; n4.add(iph); box(.5, 1.0, .06, M("#15151a"), iph, 0, 0, 0); const iconeT = ctex(64, 64, g => { g.fillStyle = MAG; g.beginPath(); g.roundRect(4, 4, 56, 56, 14); g.fill(); g.fillStyle = "#fff"; g.font = "400 30px PS"; g.textAlign = "center"; g.fillText("▶", 34, 44); });
const icone = mesh(new THREE.PlaneGeometry(.3, .3), new THREE.MeshBasicMaterial({ map: iconeT, transparent: true, toneMapped: false }), n4, 0, 0, 0); icone.castShadow = false;
const n3 = grupo("n3"); // TotK Recomp: PC gamer com RGB; uma espada de blocos sai do monitor
const pc = new THREE.Group(); pc.position.set(2.3, 0, -.6); n3.add(pc); box(.7, 1.5, 1.2, M("#141018", { metalness: .4 }), pc, 0, .75, 0); const rgb = []; for (let i = 0; i < 3; i++) { const r = mesh(new THREE.TorusGeometry(.18, .03, 8, 24), E(MAG, 3), pc, .36, 1.15 - i * .4, 0); r.rotation.y = Math.PI / 2; rgb.push(r); }
const mon = new THREE.Group(); mon.position.set(.8, 0, -.7); n3.add(mon); box(1.9, 1.1, .08, M("#0d0b12"), mon, 0, 1.35, 0); box(.1, .8, .1, M("#0d0b12"), mon, 0, .4, -.05);
const montT = ctex(320, 180, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#4ab3ff"); gr.addColorStop(1, "#bff0ff"); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = "#3f8f5a"; g.beginPath(); g.moveTo(0, h); g.lineTo(80, 90); g.lineTo(150, 140); g.lineTo(230, 70); g.lineTo(w, h); g.fill(); });
mesh(new THREE.PlaneGeometry(1.8, 1.0), new THREE.MeshBasicMaterial({ map: montT, toneMapped: false }), mon, 0, 1.35, .05);
const espada = new THREE.Group(); n3.add(espada); box(.12, 1.1, .05, M("#d9e4ff", { metalness: .9, roughness: .15 }), espada, 0, .55, 0); box(.4, .08, .1, M("#3b2f55"), espada, 0, 0, 0); box(.08, .3, .08, M("#6b4a2e"), espada, 0, -.2, 0);
const n2 = grupo("n2"); // MacNativeGames: chip gigante; dois mundos se erguem em cima dele
const chip = new THREE.Group(); chip.position.set(1.0, 0, -.2); n2.add(chip); box(2.2, .14, 2.2, M("#20202a", { metalness: .7, roughness: .3 }), chip, 0, .07, 0);
for (let i = 0; i < 24; i++) { const s = Math.floor(i / 6), k = i % 6, p = -.9 + k * .36; box(.08, .05, .2, M("#c9a64a", { metalness: .9 }), chip, s < 2 ? p : (s === 2 ? -1.15 : 1.15), .04, s < 2 ? (s ? -1.15 : 1.15) : p); }
const monte = mesh(new THREE.ConeGeometry(.55, 1.1, 6), M("#4f8f5a", { flatShading: true }), chip, -.45, .14, .1); const neve = mesh(new THREE.ConeGeometry(.2, .3, 6), M("#ffffff", { flatShading: true }), chip, -.45, .14, .1);
const ilha = new THREE.Group(); chip.add(ilha); mesh(new THREE.ConeGeometry(.45, .6, 7), M("#6b5a4a", { flatShading: true }), ilha, 0, 0, 0).rotation.x = Math.PI; mesh(new THREE.CylinderGeometry(.45, .45, .12, 7), M("#5ab36a", { flatShading: true }), ilha, 0, .34, 0);
const nuvens = []; for (let i = 0; i < 4; i++) { const n = mesh(new THREE.SphereGeometry(.2, 10, 8), M("#ffffff"), chip, 0, 0, 0); n.scale.set(1.6, .7, 1); nuvens.push(n); }
const n1 = grupo("n1"); // nxnative: portátil genérico se desmonta e vira iPhone, iPad e Mac
const port = new THREE.Group(); port.position.set(1.0, 1.5, 0); n1.add(port); const pecas = [];
const pc1 = (geo, mat, x, y, z, dir) => { const m = mesh(geo, mat, port, x, y, z); m.userData = { b: m.position.clone(), d: new THREE.Vector3(...dir) }; pecas.push(m); return m; };
pc1(new THREE.BoxGeometry(1.3, .75, .12), M("#1b1b22"), 0, 0, 0, [0, .6, -1]); const telaPT = ctex(256, 140, g => { g.fillStyle = "#000"; g.fillRect(0, 0, 256, 140); g.fillStyle = LIMA; g.font = "400 22px PS"; g.fillText("PRESS START", 18, 80); });
pc1(new THREE.PlaneGeometry(1.1, .6), new THREE.MeshBasicMaterial({ map: telaPT, toneMapped: false }), 0, 0, .065, [0, .6, -.8]);
pc1(new THREE.BoxGeometry(.32, .75, .14), M("#7a3cff"), -.82, 0, 0, [-1.4, .2, .3]); pc1(new THREE.BoxGeometry(.32, .75, .14), M(LIMA), .82, 0, 0, [1.4, .2, .3]);
for (const [x, y, c] of [[-.82, .15, "#222"], [.82, -.15, "#222"]]) pc1(new THREE.CylinderGeometry(.07, .07, .08, 12), M(c), x, y, .1, [x * 2, y * 3, 1]).rotation.x = Math.PI / 2;
const destino = new THREE.Group(); n1.add(destino); const disp = [];
for (const [w, h, x, nm] of [[.42, .85, -.2, "iphone"], [.9, 1.2, 1.0, "ipad"], [1.5, 1.0, 2.5, "mac"]]) { const g = new THREE.Group(); g.position.set(x, 1.3, -.2); destino.add(g); box(w, h, .06, M("#c9ccd6", { metalness: .6, roughness: .3 }), g, 0, 0, 0);
  const t = ctex(256, Math.round(256 * h / w), (gg, ww, hh) => { gg.fillStyle = "#0b0b12"; gg.fillRect(0, 0, ww, hh); gg.fillStyle = MAG; gg.fillRect(ww * .1, hh * .3, ww * .8, hh * .4); gg.fillStyle = LIMA; gg.font = `400 ${Math.round(ww / 14)}px PS`; gg.textAlign = "center"; gg.fillText("PLAY", ww / 2, hh * .55); });
  mesh(new THREE.PlaneGeometry(w * .9, h * .9), new THREE.MeshBasicMaterial({ map: t, toneMapped: false }), g, 0, 0, .035); if (nm === "mac") box(.4, .4, .1, M("#c9ccd6", { metalness: .6 }), g, 0, -.65, -.05); disp.push(g); }

// ---------- fechamento: moedas e pixels caindo ----------
const cG = grupo("cta"); const moedas = [];
for (let i = 0; i < 40; i++) { const m = i % 2 ? mesh(new THREE.CylinderGeometry(.12, .12, .03, 18), M("#ffd23f", { metalness: .8, roughness: .2, emissive: "#6a4a00", emissiveIntensity: .5 }), cG, 0, 0, 0) : mesh(new THREE.BoxGeometry(.1, .1, .1), E([MAG, LIMA, "#36d6ff"][i % 3], 2), cG, 0, 0, 0); m.castShadow = false; moedas.push({ m, x: (rnd() - .5) * 6, z: -1.5 + rnd() * 3, y0: 3 + rnd() * 5, v: .8 + rnd() * .6, w: rnd() * 8 }); }

// ---------- câmera: órbita lenta + câmera na mão nos sustos ----------
const SHOTS = { gancho: [[V(0, 2, 6), V(.2, 1.2, 0)], [V(0, 2, 6), V(.2, 1.2, 0)]] }; ["n5", "n4", "n3", "n2", "n1", "cta"].forEach(n => SHOTS[n] = SHOTS.gancho);
const alvo = { gancho: [.4, 1.3, 0], n5: [.2, .9, 0], n4: [.5, 1.1, 0], n3: [.5, 1.2, -.3], n2: [.1, 1.0, -.1], n1: [.6, 1.4, -.1], cta: [0, 1.1, 0] };
const camera = (cam, nome, lt, d, t, sh) => { const [ax, ay, az] = alvo[nome] || alvo.cta, a = -.45 + (lt / d) * .9 + (["n4", "n2"].includes(nome) ? .3 : 0), r = nome === "n1" ? 6.6 : 5.8;
  const tremor = (nome === "gancho" && lt > .8 && lt < 2.2) || (nome === "n1" && lt < 1.2) ? .05 : .012;
  cam.position.set(ax + Math.sin(a) * r + Math.sin(t * 13) * tremor, 2.0 + Math.sin(t * .9) * .15 + Math.cos(t * 17) * tremor, az + Math.cos(a) * r); cam.lookAt(ax, ay, az); };

const ACT = {
  gancho(lt, d) { controle.visible = false; const k = Math.floor(lt * 12), on = lt < .8 ? ([1, 0, 1, 1, 0, 1][k % 6]) : 1; proT.draw(on);
    const racha = eio(lin(lt, 1.0, 1.8)); metades.forEach((m, i) => { const s = i ? 1 : -1; m.position.set(.3 + s * (.35 + racha * .5), 2.6 - racha * 2.4 * (i ? 1 : .8), -.8 + racha * .4); m.rotation.set(-racha * 1.2, 0, s * racha * (i ? 1.2 : .9)); });
    const esc = lt > .9 && lt < 2.6; const pk = lin(lt, 2.6, 3.0); pose(MAS, { x: esc ? 1.6 - .2 : -.7 + (1 - eo(pk)) * 2.3, z: esc ? -.9 : .2, y: 0, sq: esc ? .25 : 0, ry: esc ? -.4 : .2, braco: esc ? [1.4, 1.4] : [.4, 1.2], piscar: esc && (lt % .5) < .1 ? .2 : pisca(lt) });
    if (lt <= .9) pose(MAS, { x: -.7, z: .2, ry: .2, braco: [.3, .4], piscar: pisca(lt), y: hop(lt, .45, .1) });
    return lt > 1.0 && lt < 1.3 ? .03 : 0; },
  n5(lt, d) { joga(lt, -.85); pistaT.draw(lt); const a = lt * 2.2; kart.position.set(1.2 + Math.sin(a) * .25, .12, -.2 + Math.cos(a * .5) * .6); kart.rotation.y = -.3 + Math.sin(a) * .5;
    faiscas.forEach(F => { const k = (lt * 3 + F.ph) % 1; F.f.position.set(kart.position.x + F.s * .6, .1 + k * .4, kart.position.z + .5 + k * .4); F.f.visible = k < .8; }); },
  n4(lt, d) { joga(lt, -.9); const ent = eio(lin(lt, .2, 1.0)); cart.position.set(.9 - .2 * ent + (1 - ent) * -.6, 1.8 - ent * .95, .2 - ent * .1); cart.rotation.set(0, 0, (1 - ent) * .8); cart.visible = ent < .99;
    const p = eio(lin(lt, 1.0, 2.2)); barraT.draw(p); const v = eio(lin(lt, 2.2, 3.0)); icone.visible = lt > 2.2; icone.position.set(.9 + (2.6 - .9) * v, 1.4 + Math.sin(v * Math.PI) * .9, -.3 + .5 * v); icone.lookAt(cam.position); icone.scale.setScalar(1 + Math.sin(v * Math.PI) * .6); },
  n3(lt, d) { joga(lt, -.85); rgb.forEach((r, i) => r.material.emissive.setHSL((lt * .4 + i * .2) % 1, 1, .5)); const s = back(lin(lt, .6, 1.4)); espada.position.set(.8, .9 + s * .5, -.6 + s * .7); espada.rotation.set(-.3 * s, lt * 1.2, .5); espada.scale.setScalar(Math.max(.01, s)); },
  n2(lt, d) { joga(lt, -1.0); const m = back(lin(lt, .4, 1.2)), il = eo(lin(lt, 1.0, 2.0)); monte.scale.setScalar(Math.max(.01, m)); monte.position.y = .14 + .55 * m; neve.scale.setScalar(Math.max(.01, m)); neve.position.y = .14 + 1.0 * m;
    ilha.position.set(.5, .5 + il * 1.5 + Math.sin(lt * 2) * .06, -.2); ilha.scale.setScalar(Math.max(.01, il)); nuvens.forEach((n, i) => { n.position.set(.5 + Math.cos(lt * .6 + i * 1.6) * .8, 2.0 + il * .3 + (i % 2) * .15, -.2 + Math.sin(lt * .6 + i * 1.6) * .5); n.scale.setScalar(il); n.scale.x *= 1.6; n.scale.y *= .7; }); },
  n1(lt, d) { controle.visible = false; const ex = eio(lin(lt, .5, 1.4)), junta = eio(lin(lt, 1.6, 2.6));
    port.visible = junta < .95; port.rotation.set(Math.sin(lt * 1.5) * .15, lt * .5, 0); port.scale.setScalar(1 - junta); pecas.forEach(p => p.position.copy(p.userData.b).addScaledVector(p.userData.d, ex * .9));
    disp.forEach((g, i) => { const s = back(lin(lt, 1.8 + i * .25, 2.5 + i * .25)); g.scale.setScalar(Math.max(.01, s)); g.rotation.y = -.25 + Math.sin(lt + i) * .05; });
    pose(MAS, { x: -1.2, y: lt < .5 ? 0 : hop(lt, .35, .2), sq: lt > .4 && lt < .55 ? .15 : 0, braco: lt > .5 ? [1.5 + Math.sin(lt * 9) * .3, 1.5 + Math.sin(lt * 9 + 1) * .3] : [.3, .3], piscar: lt > .45 && lt < 1.2 ? .3 : pisca(lt) });
    return lt > .45 && lt < .75 ? .03 : 0; },
  cta(lt, d) { controle.visible = false; pose(MAS, { x: 0, y: hop(lt, .5, .15), braco: [.3, 1.9 + Math.sin(lt * 9) * .5], piscar: pisca(lt) });
    moedas.forEach(P => { const y = ((P.y0 - lt * P.v * 2.2) % 6 + 6) % 6; P.m.position.set(P.x, y, P.z); P.m.rotation.set(lt * P.w, lt * 3, 0); }); },
};
const anima = (t) => { const a = t * 4; spot.target.position.set(Math.sin(a) * 4, 0, Math.cos(a) * 2); sirene.rotation.y = a; telasArc.forEach((tx, i) => tx.draw(Math.floor(t * 8) + i)); fumaca.forEach(F => F.f.position.set(F.x + Math.sin(t * .3 + F.ph), .15, F.z)); };
let T0 = 0; Object.keys(ACT).forEach(k => { const f = ACT[k]; ACT[k] = (lt, d) => { anima(lt + (T0 += 0)); return f(lt, d); }; });

// ---------- elementos de tela (2D) ----------
const ui = C => { const { X, ITENS, MAXE, fmt, eo, lin, eio, back, blocos, SEGR, CHAVE } = C;
  const neon = (txt, x, y, fs, cor, fam = "BB", falha = -1, t = 0) => { X.font = `400 ${fs}px ${fam}`; X.textAlign = "left"; X.textBaseline = "middle"; let xx = x - X.measureText(txt).width / 2;
    for (let i = 0; i < txt.length; i++) { const ch = txt[i], apag = i === falha && (Math.floor(t * 9) % 4 === 0 || Math.floor(t * 13) % 7 === 0); X.shadowColor = cor; X.shadowBlur = apag ? 0 : 26; X.fillStyle = apag ? "#3a2a44" : "#fff6ff";
      X.fillText(ch, xx, y); if (!apag) { X.shadowBlur = 50; X.globalAlpha = .5; X.fillStyle = cor; X.fillText(ch, xx, y); X.globalAlpha = 1; } xx += X.measureText(ch).width; } X.shadowBlur = 0; };
  const cabe = (t, f, mx, fam) => { while (f > 20) { X.font = `400 ${f}px ${fam}`; if (X.measureText(t).width <= mx) break; f -= 2; } return f; };
  return {
    fundo(t) { X.fillStyle = NOITE; X.fillRect(0, 0, 1080, 1920); X.fillStyle = "rgba(255,42,42,.06)"; X.fillRect(0, 0, 1080, 1920 * (.5 + .5 * Math.sin(t * 4))); },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.strokeStyle = "rgba(255,43,214,.5)"; X.lineWidth = 4; X.strokeRect(36, 66, 1008, 330);
      neon(l1, 540, 140, cabe(l1, 84, 980, "BB"), MAG, "BB", 7, t); neon(l2, 540, 238, cabe(l2, 72, 980, "BB"), LIMA, "BB", -1, t); neon(l3, 540, 330, cabe(l3, 66, 980, "BB"), ALERTA, "BB", 12, t); },
    cabecalho(s, lt, t) { // split-flap + placar HI-SCORE
      const nome = s.item.toUpperCase(), n = nome.length, tw = Math.min(64, 900 / n), x0 = 60;
      for (let i = 0; i < n; i++) { const pronto = lt > .15 + i * .07, ch = pronto ? nome[i] : "ABCDEFGHJKLMNPRSTUVXZ0123456789"[(Math.floor(lt * 30) + i * 7) % 31], x = x0 + i * (tw + 6);
        X.fillStyle = "#1a1622"; X.fillRect(x, 440, tw, 96); X.fillStyle = "#fff"; X.font = `400 ${Math.round(tw * 1.25)}px BB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(ch, x + tw / 2, 492); X.fillStyle = "rgba(0,0,0,.6)"; X.fillRect(x, 486, tw, 4); }
      X.fillStyle = ALERTA; X.font = "400 30px PS"; X.textAlign = "left"; X.fillText(s.tag, 64, 418);
      const v = Math.round(s.estrelas * eio(lin(lt, .3, 1.8))); X.fillStyle = "#ffd23f"; X.font = "400 28px PS"; X.textAlign = "left"; X.fillText("HI-SCORE", 64, 600);
      X.fillStyle = (Math.floor(t * 6) % 2 || lt < 1.8) ? LIMA : "#fff"; X.font = "400 64px PS"; X.fillText(String(v).padStart(6, "0"), 64, 670); X.fillStyle = "#9a8fb5"; X.font = "400 18px PS"; X.fillText("ESTRELAS NO GITHUB", 64, 716); },
    legenda(seg, t) { const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      X.fillStyle = "#000"; X.fillRect(0, 1610, 1080, 150); X.fillStyle = MAG; X.fillRect(0, 1610, 1080, 6); X.fillRect(0, 1754, 1080, 6);
      let fs = 40; X.font = `400 ${fs}px PS`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w.toUpperCase() + " ").width, 0); while (tot() > 1000 && fs > 22) { fs -= 2; X.font = `400 ${fs}px PS`; }
      let x = 540 - tot() / 2; X.textAlign = "left"; X.textBaseline = "middle"; for (const w of c) { const on = t >= w.t0 - .02; X.fillStyle = on && t < w.t1 + .2 ? "#ffd23f" : on ? "#fff" : "#4a4060"; X.fillText(w.w.toUpperCase(), x, 1688); x += X.measureText(w.w.toUpperCase() + " ").width; }
      X.fillStyle = "rgba(255,255,255,.04)"; for (let y = 1616; y < 1754; y += 4) X.fillRect(0, y, 1080, 2); },
    transicao(lt, s) { if (!s.item || lt > .4) return; const k = 1 - lt / .4, cv = X.canvas;
      X.save(); X.globalCompositeOperation = "lighter"; for (let i = 0; i < 7; i++) { const y = ((i * 263 + Math.floor(lt * 60) * 97) % 1800), h = 40 + (i * 37) % 120, dx = (i % 2 ? 1 : -1) * 40 * k; X.globalAlpha = .55 * k; X.drawImage(cv, 0, y, 1080, h, dx, y, 1080, h); } X.restore();
      const p = back(lin(lt, 0, .2)); X.save(); X.translate(540, 1100); X.scale(p, p); X.font = "400 72px PS"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillStyle = "#000"; X.fillText("LEVEL UP!", 6, 6); X.fillStyle = LIMA; X.globalAlpha = k; X.fillText("LEVEL UP!", 0, 0); X.restore(); },
    fechamento(lt) { X.fillStyle = "rgba(10,7,18,.86)"; X.fillRect(0, 400, 1080, 1520); X.textAlign = "center"; X.textBaseline = "middle";
      X.fillStyle = "#fff"; X.font = "400 64px PS"; X.fillText("CONTINUE?", 540, 520); const n = Math.max(0, 9 - Math.floor(lt * 3)); X.fillStyle = ALERTA; X.font = "400 120px PS"; X.fillText(String(n), 540, 680);
      ITENS.forEach((s, i) => { const p = lin(lt, .2 + i * .1, .4 + i * .1); if (p <= 0) return; X.globalAlpha = p; X.textAlign = "left"; X.fillStyle = i === 4 ? LIMA : "#fff"; X.font = "400 30px PS"; X.fillText(`${s.tag} ${s.item.toUpperCase()}`, 90, 830 + i * 78); X.textAlign = "right"; X.fillStyle = "#ffd23f"; X.fillText(String(s.estrelas).padStart(6, "0"), 990, 830 + i * 78); X.globalAlpha = 1; });
      const pi = Math.floor(lt * 3) % 2; X.fillStyle = pi ? MAG : "#c21fa5"; X.beginPath(); X.roundRect(140, 1290, 800, 150, 20); X.fill(); X.fillStyle = "#fff"; X.font = "400 50px PS"; X.textAlign = "center"; X.fillText("COMENTA " + CHAVE, 540, 1368);
      X.fillStyle = "#9a8fb5"; X.font = "400 22px PS"; X.fillText("SÓ COM JOGO QUE É SEU", 540, 1500); },
  }; };
const cores = { LAR: MAG, VERDE: LIMA, FUNDO: NOITE, CREME: "#fff6ff", TINTA: "#0a0712", BRILHO: "rgba(255,43,214,.08)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

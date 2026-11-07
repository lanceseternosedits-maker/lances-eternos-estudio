// Reel "3 skills chinesas que fazem trabalho de agência" (08/11). Identidade: escritório de agência de publicidade vazio à noite,
// post-its caindo e cadeiras girando sozinhas; janelão com skyline genérica de cidade asiática; vermelho + dourado + branco.
// Elementos: faixa diagonal de aviso, nome em máquina de escrever, pote enchendo de estrelas, legenda em tarja de TV,
// transição virada de página, câmera em órbita, fechamento em post-its na parede, Press Start 2P (só enfeite) + Space Grotesk.
// Mascote de terno com óculos escuros na testa (olhos sempre à mostra), costurando com agulha e linha vermelha.
// Gancho: a placa AGÊNCIA despenca e no lugar sobe um notebook. Nº 1: caldeirão dourado que cospe celulares virais e um roteiro.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const VERM = "#d7262e", OURO = "#f2c14e", BRANCO = "#fbf7f0", TINTA = "#1a0f0f", NOITE = "#1c1216", CARPETE = "#4a3d40";
rim.color.set(0xff5a4a); rim.intensity = 2.0; key.color.set(0xfff0dc); key.intensity = 105; key.position.set(-1, 8, 6); key.target.position.set(.2, 1.2, -.6);
const luzOuro = new THREE.PointLight(0xf2c14e, 5, 7, 1.5); luzOuro.position.set(.8, 2.4, .6); S.add(luzOuro);

// ---------- cenário: carpete, janelão com a cidade à noite, mesas, cadeiras que giram, post-its ----------
const esc = new THREE.Group(); S.add(esc); const ZW = -1.8;
const piso = mesh(new THREE.PlaneGeometry(16, 9), M(CARPETE, { roughness: .95 }), esc, 0, 0, 2.5); piso.rotation.x = -Math.PI / 2;
const cidT = ctex(1024, 512, (g, w, h, t = 0) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#0d0a1e"); gr.addColorStop(1, "#3a1630"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = "rgba(255,240,220,.8)"; for (let i = 0; i < 50; i++) g.fillRect((i * 197) % w, (i * 61) % 160, 2, 2);
  g.fillStyle = "#f6e7c8"; g.beginPath(); g.arc(840, 90, 34, 0, 7); g.fill();
  const P = [[20, 260, 90], [120, 170, 70], [200, 300, 110], [320, 120, 80], [410, 230, 120], [540, 80, 70], [620, 200, 100], [730, 150, 90], [830, 260, 80], [920, 190, 100]];
  P.forEach(([x, y, bw], i) => { g.fillStyle = i % 2 ? "#1d1426" : "#251a30"; g.fillRect(x, y, bw, h - y); if (i === 5) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + bw / 2, y - 70); g.lineTo(x + bw, y); g.fill(); g.fillRect(x + bw / 2 - 2, y - 120, 4, 50); }
    for (let yy = y + 14; yy < h - 10; yy += 22) for (let xx = x + 10; xx < x + bw - 10; xx += 18) { const on = ((xx * 7 + yy * 13 + i) % 5) < 2; if (on) { g.fillStyle = ((xx + yy) % 3) ? "rgba(255,214,140,.85)" : "rgba(255,120,110,.8)"; g.fillRect(xx, yy, 8, 10); } }
    if (i % 3 === 0) { g.fillStyle = i % 2 ? VERM : OURO; g.globalAlpha = .7 + .3 * Math.sin(t * 3 + i); g.fillRect(x + 8, y + 30, 14, 70); g.globalAlpha = 1; } });
  for (let i = 0; i < 6; i++) { const x = 60 + i * 170, y = 380 + (i % 2) * 30; g.fillStyle = VERM; g.beginPath(); g.ellipse(x, y, 16, 20, 0, 0, 7); g.fill(); g.fillStyle = OURO; g.fillRect(x - 6, y + 18, 12, 6); } });
const janela = mesh(new THREE.PlaneGeometry(9, 4.5), new THREE.MeshBasicMaterial({ map: cidT, toneMapped: false }), esc, 0, 2.6, ZW - .4); janela.castShadow = janela.receiveShadow = false;
const caixilho = M("#2b2226", { metalness: .5, roughness: .4 }); [-3, -1, 1, 3].forEach(x => box(.08, 4.5, .1, caixilho, esc, x, 2.6, ZW - .3)); box(9, .1, .1, caixilho, esc, 0, .4, ZW - .3); box(9, .1, .1, caixilho, esc, 0, 4.8, ZW - .3);
// mesas com monitores apagados
const mesaM = M("#efe6d8", { roughness: .5 }), pernaM = M("#2b2226", { metalness: .6 });
function mesa(x, z) { const g = new THREE.Group(); g.position.set(x, 0, z); esc.add(g); box(1.6, .06, .8, mesaM, g, 0, .78, 0); [[-.75, -.35], [.75, -.35], [-.75, .35], [.75, .35]].forEach(([a, b]) => box(.05, .78, .05, pernaM, g, a, .39, b));
  box(.7, .45, .04, M("#141014"), g, 0, 1.08, -.2); box(.06, .2, .06, pernaM, g, 0, .88, -.2); return g; }
mesa(-2.3, ZW + .8); mesa(2.4, ZW + .8);
// cadeiras de escritório que giram sozinhas
const cadeiras = [[-2.6, .3], [2.6, .4], [-.2, -1.0]].map(([x, z], i) => { const c = new THREE.Group(); c.position.set(x, 0, z); esc.add(c); const cor = M(i === 1 ? VERM : "#2b2226", { roughness: .6 });
  for (let k = 0; k < 5; k++) { const p = box(.32, .04, .05, pernaM, c, 0, .06, 0); p.rotation.y = k * 1.2566; p.translateX(.16); }
  box(.05, .38, .05, pernaM, c, 0, .26, 0); const top = new THREE.Group(); top.position.y = .45; c.add(top); box(.55, .09, .55, cor, top, 0, 0, 0); box(.55, .6, .08, cor, top, 0, .35, -.25); return top; });
// post-its caindo o tempo todo
const posts = []; for (let i = 0; i < 26; i++) { const p = mesh(new THREE.PlaneGeometry(.18, .18), M(["#ffe066", "#ff9fb2", "#ffd29a", BRANCO][i % 4], { side: THREE.DoubleSide, roughness: .9 }), esc, 0, 0, 0); p.castShadow = false; posts.push({ p, x: (rnd() - .5) * 6.5, z: -1.4 + rnd() * 2.6, y0: rnd() * 4.5, v: .25 + rnd() * .3, w: 1 + rnd() * 2.5, ph: rnd() * 6 }); }
function anima(t) { cadeiras.forEach((c, i) => c.rotation.y = t * (1.1 + i * .5) * (i % 2 ? -1 : 1)); cidT.draw(t);
  posts.forEach(P => { const y = ((P.y0 - t * P.v) % 4.5 + 4.5) % 4.5; P.p.position.set(P.x + Math.sin(t * 1.4 + P.ph) * .25, y + .02, P.z); P.p.rotation.set(Math.sin(t * P.w + P.ph) * .9, t * P.w * .5, Math.cos(t * P.w) * .5); }); }

// ---------- mascote: terno, gravata vermelha, óculos escuros na testa, agulha e linha ----------
const terno = M("#1f1b2b", { roughness: .55 });
box(1.56, .36, 1.04, terno, MAS.corpo, 0, .6, 0);
box(.36, .34, .02, M(BRANCO), MAS.corpo, 0, .63, .525); const grav = box(.12, .3, .02, M(VERM), MAS.corpo, 0, .62, .54); box(.1, .06, .03, M(VERM), MAS.corpo, 0, .79, .54);
box(.08, .24, .02, M(OURO), MAS.corpo, -.5, .65, .53);
MAS.bracos.forEach(b => { const s = b.position.x > 0 ? 1 : -1; box(.26, .26, .34, terno, b, s * .08, 0, 0); });
const oculos = new THREE.Group(); oculos.position.set(0, 1.43, .44); oculos.rotation.x = -.35; MAS.corpo.add(oculos);
[-.27, .27].forEach(x => box(.38, .2, .05, M("#0b0b0e", { metalness: .6, roughness: .15 }), oculos, x, 0, 0)); box(.2, .04, .04, M(OURO, { metalness: .8 }), oculos, 0, .04, 0);
const agulha = new THREE.Group(); agulha.position.set(.42, .02, .14); MAS.bracos[1].add(agulha); const prata = M("#d8dde2", { metalness: .9, roughness: .2 });
mesh(new THREE.CylinderGeometry(.025, .004, .75, 8), prata, agulha, 0, .25, 0); mesh(new THREE.TorusGeometry(.035, .01, 6, 12), prata, agulha, 0, .6, 0);
const fio = []; for (let i = 0; i < 26; i++) { const f = mesh(new THREE.SphereGeometry(.025, 6, 4), E(VERM, .6), S, 0, 0, 0); f.castShadow = false; fio.push(f); }
const BX = -1.0, BZ = .45; const ponta = new THREE.Vector3(); const rastro = [];
function costura(lt, x = BX, ry = .25) { const c = Math.sin(lt * 5.5);
  pose(MAS, { x, z: BZ, ry, braco: [.35, .9 + c * .55], piscar: pisca(lt), sq: Math.abs(c) * .025 }); MAS.corpo.rotation.set(0, 0, 0);
  agulha.rotation.z = -.4 + c * .3; MAS.g.updateMatrixWorld(true); agulha.children[0].getWorldPosition(ponta);
  rastro.unshift(ponta.clone()); if (rastro.length > 60) rastro.pop(); fio.forEach((f, i) => { const p = rastro[Math.min(rastro.length - 1, i * 2)]; f.position.copy(p); f.position.y -= i * .012; f.position.x += i * .015; }); }

// ---------- gancho: a placa AGÊNCIA despenca e no lugar sobe um notebook ----------
const gG = grupo("gancho"); const placaT = ctex(512, 160, g => { g.fillStyle = VERM; g.fillRect(0, 0, 512, 160); g.strokeStyle = OURO; g.lineWidth = 10; g.strokeRect(10, 10, 492, 140);
  g.fillStyle = OURO; g.font = "700 92px SG"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("AGÊNCIA", 256, 86); });
const placa = new THREE.Group(); gG.add(placa); placa.scale.setScalar(1.35); box(2.0, .62, .1, [M(VERM), M(VERM), M(VERM), M(VERM), new THREE.MeshStandardMaterial({ map: placaT, emissive: "#ffffff", emissiveMap: placaT, emissiveIntensity: .25 }), M(VERM)], placa, 0, 0, 0);
const cabos = [-.8, .8].map(x => { const c = mesh(new THREE.CylinderGeometry(.012, .012, 1.5, 4), M("#999"), gG, 0, 0, 0); c.userData.x = x; return c; });
const telaT = ctex(256, 160, (g, w, h, k = 0) => { g.fillStyle = "#130d10"; g.fillRect(0, 0, w, h); g.fillStyle = VERM; g.fillRect(0, 0, w, 18); g.fillStyle = OURO; g.font = "400 14px PS"; g.fillText("SKILL.md", 10, 48);
  g.fillStyle = "#f6e7c8"; for (let i = 0; i < 5; i++) g.fillRect(10, 66 + i * 16, Math.min(200, (k * 60 + i * 40) % 230), 7); });
function notebook(par) { const n = new THREE.Group(); par.add(n); n.scale.setScalar(1.25); box(1.3, .06, .9, M("#cfd2d6", { metalness: .6, roughness: .3 }), n, 0, 0, 0); const tampa = new THREE.Group(); tampa.position.set(0, .03, -.44); n.add(tampa);
  box(1.3, .82, .05, M("#cfd2d6", { metalness: .6, roughness: .3 }), tampa, 0, .41, -.02); const tl = mesh(new THREE.PlaneGeometry(1.18, .72), new THREE.MeshBasicMaterial({ map: telaT, toneMapped: false }), tampa, 0, .41, .006); tl.castShadow = false; return { n, tampa }; }
const nbG = notebook(gG);

// ---------- itens ----------
// nº 3 AI Promo Video: uma frase no notebook e sai um filme de lançamento (fita de filme + foguete decolando)
const n3 = grupo("n3"); const nb3 = notebook(n3); nb3.n.position.set(.7, .82, .2); nb3.tampa.rotation.x = -.15;
const filmeT = ctex(512, 96, g => { g.fillStyle = "#151015"; g.fillRect(0, 0, 512, 96); g.fillStyle = BRANCO; for (let i = 0; i < 16; i++) { g.fillRect(i * 32 + 6, 6, 18, 10); g.fillRect(i * 32 + 6, 80, 18, 10); }
  for (let i = 0; i < 4; i++) { g.fillStyle = [VERM, OURO, "#ff9fb2", "#7cc8ff"][i]; g.fillRect(i * 128 + 10, 22, 108, 52); } });
const filme = mesh(new THREE.PlaneGeometry(3.4, .5, 40, 1), new THREE.MeshStandardMaterial({ map: filmeT, side: THREE.DoubleSide, emissive: "#ffffff", emissiveMap: filmeT, emissiveIntensity: .3 }), n3, 0, 0, 0); filme.castShadow = false;
const fPos = filme.geometry.attributes.position, fBase = Float32Array.from(fPos.array);
const foguete = new THREE.Group(); n3.add(foguete); mesh(new THREE.CylinderGeometry(.16, .16, .7, 16), M(BRANCO), foguete, 0, 0, 0); mesh(new THREE.ConeGeometry(.16, .3, 16), M(VERM), foguete, 0, .5, 0);
[0, 1, 2].forEach(i => { const a = mesh(new THREE.BoxGeometry(.03, .22, .2), M(VERM), foguete, Math.cos(i * 2.09) * .16, -.3, Math.sin(i * 2.09) * .16); a.rotation.y = -i * 2.09; });
mesh(new THREE.CircleGeometry(.07, 16), E("#7cc8ff", 1.5), foguete, 0, .12, .161);
const fogo = mesh(new THREE.ConeGeometry(.12, .4, 12), E(OURO, 3), foguete, 0, -.55, 0); fogo.rotation.x = Math.PI; fogo.castShadow = false;
const fumaca = []; for (let i = 0; i < 14; i++) { const f = mesh(new THREE.SphereGeometry(.12, 10, 8), M("#e8e2da", { transparent: true, opacity: .8 }), n3, 0, 0, 0); f.castShadow = false; fumaca.push({ f, ph: i / 14, dx: (rnd() - .5) * .5 }); }
// nº 2 Luobo PPT: slides de apresentação saem do notebook em leque e se arrumam num cavalete
const n2 = grupo("n2"); const SL = [0, 1, 2, 3, 4].map(i => ctex(256, 144, g => { g.fillStyle = BRANCO; g.fillRect(0, 0, 256, 144); g.fillStyle = [VERM, OURO, VERM, "#3a7bd5", OURO][i]; g.fillRect(0, 0, 256, 26);
  g.fillStyle = "#c9bfb2"; g.fillRect(14, 40, 120, 8); g.fillRect(14, 56, 90, 8); if (i % 2 === 0) { for (let k = 0; k < 4; k++) { g.fillStyle = k % 2 ? OURO : VERM; const hh = 20 + k * 16; g.fillRect(150 + k * 24, 130 - hh, 16, hh); } }
  else { g.fillStyle = OURO; g.beginPath(); g.moveTo(190, 90); g.arc(190, 90, 38, 0, 4.4); g.fill(); g.fillStyle = VERM; g.beginPath(); g.moveTo(190, 90); g.arc(190, 90, 38, 4.4, 6.283); g.fill(); } }));
const slides = SL.map(t => { const m = mesh(new THREE.BoxGeometry(1.1, .62, .02), [M(BRANCO), M(BRANCO), M(BRANCO), M(BRANCO), new THREE.MeshStandardMaterial({ map: t, emissive: "#ffffff", emissiveMap: t, emissiveIntensity: .25 }), M(BRANCO)], n2, 0, 0, 0); return m; });
const cav = new THREE.Group(); cav.position.set(1.1, 0, -.5); n2.add(cav); const madeira = M("#8a5a35"); [[-.5, .2], [.5, .2]].forEach(([x, r]) => { const p = box(.06, 2.3, .06, madeira, cav, x, 1.1, 0); p.rotation.z = x > 0 ? -.12 : .12; });
box(.06, 2.2, .06, madeira, cav, 0, 1.05, -.45).rotation.x = .25; box(1.4, .06, .14, madeira, cav, 0, 1.0, .05);
const nb2 = notebook(n2); nb2.n.position.set(-.1, .82, .55); nb2.n.rotation.y = .35; nb2.tampa.rotation.x = -.15;
// nº 1 Taishang Laojun: caldeirão dourado que borbulha, cospe celulares com vídeo viral e desenrola um roteiro
const n1 = grupo("n1"); const cald = new THREE.Group(); cald.position.set(.8, 0, -.1); n1.add(cald); const ouroM = M(OURO, { metalness: .85, roughness: .25 });
mesh(new THREE.SphereGeometry(.75, 28, 18, 0, Math.PI * 2, Math.PI * .35, Math.PI * .65), ouroM, cald, 0, .95, 0); mesh(new THREE.TorusGeometry(.66, .07, 10, 32), ouroM, cald, 0, 1.38, 0).rotation.x = Math.PI / 2;
[0, 1, 2].forEach(i => { const p = mesh(new THREE.CylinderGeometry(.07, .1, .45, 10), ouroM, cald, Math.cos(i * 2.09) * .45, .2, Math.sin(i * 2.09) * .45); });
[-1, 1].forEach(s => mesh(new THREE.TorusGeometry(.14, .04, 8, 16), ouroM, cald, s * .78, 1.3, 0).rotation.y = Math.PI / 2);
const caldo = mesh(new THREE.CircleGeometry(.6, 32), E(VERM, 1.4), cald, 0, 1.33, 0); caldo.rotation.x = -Math.PI / 2; caldo.castShadow = false;
const bolhas = []; for (let i = 0; i < 12; i++) { const b = mesh(new THREE.SphereGeometry(.06, 8, 6), E("#ff7a5a", 1.6), cald, 0, 0, 0); b.castShadow = false; bolhas.push({ b, a: rnd() * 6.28, r: rnd() * .45, ph: rnd() }); }
const celT = ctex(128, 220, (g, w, h) => { g.fillStyle = "#111"; g.fillRect(0, 0, w, h); const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#ff7a5a"); gr.addColorStop(1, VERM); g.fillStyle = gr; g.fillRect(8, 10, w - 16, h - 20);
  g.fillStyle = "rgba(255,255,255,.9)"; g.beginPath(); g.moveTo(52, 86); g.lineTo(84, 108); g.lineTo(52, 130); g.fill(); g.fillStyle = BRANCO; g.font = "700 26px SG"; g.textAlign = "center"; g.fillText("♥ 1M", 64, 190); });
const celulares = [0, 1, 2].map(i => { const c = new THREE.Group(); n1.add(c); box(.42, .76, .04, M("#111"), c, 0, 0, -.025); mesh(new THREE.PlaneGeometry(.4, .72), new THREE.MeshBasicMaterial({ map: celT, toneMapped: false }), c, 0, 0, 0).castShadow = false; return c; });
const rotT = ctex(256, 512, (g, w, h) => { g.fillStyle = "#f6ead2"; g.fillRect(0, 0, w, h); g.fillStyle = VERM; g.font = "700 30px SG"; g.fillText("ROTEIRO", 20, 50); g.fillStyle = "#6b5a48"; for (let i = 0; i < 16; i++) g.fillRect(20, 80 + i * 26, 160 + (i * 37) % 60, 8); });
const rolo = new THREE.Group(); n1.add(rolo); const papel = mesh(new THREE.PlaneGeometry(.7, 1.4), new THREE.MeshStandardMaterial({ map: rotT, side: THREE.DoubleSide, roughness: .8 }), rolo, 0, -.7, 0); papel.castShadow = false;
mesh(new THREE.CylinderGeometry(.06, .06, .82, 12), M(VERM), rolo, 0, 0, 0).rotation.z = Math.PI / 2; const pontaRolo = mesh(new THREE.CylinderGeometry(.06, .06, .82, 12), M(VERM), rolo, 0, -1.4, 0); pontaRolo.rotation.z = Math.PI / 2;
const fagulhas = []; for (let i = 0; i < 18; i++) { const f = mesh(new THREE.OctahedronGeometry(.05), E(OURO, 2.6), n1, 0, 0, 0); f.castShadow = false; fagulhas.push({ f, a: rnd() * 6.28, ph: rnd() }); }

// ---------- fechamento ----------
grupo("cta");

// ---------- câmera: órbita lenta pelo escritório ----------
const SHOTS = {}; ["gancho", "n3", "n2", "n1", "cta"].forEach(n => SHOTS[n] = [[V(0, 2, 6), V(.2, 1.5, 0)], [V(0, 2, 6), V(.2, 1.5, 0)]]);
const ALVO = [.05, 1.35, -.2];
const camera = (cam, nome, lt, d, t) => { const dir = nome === "n2" ? -1 : 1, a = dir * (-.22 + (lt / d) * .44), r = 5.9;
  cam.position.set(ALVO[0] + Math.sin(a) * r, 2.3 + Math.sin(t * .7) * .08, ALVO[2] + Math.cos(a) * r); cam.lookAt(ALVO[0], ALVO[1], ALVO[2]); };

const ACT = {
  gancho(lt, d) { anima(lt); costura(lt, BX, .3); const cai = lin(lt, 1.1, 1.8), sobe = eio(lin(lt, 1.9, 2.8));
    placa.position.set(.7 + cai * .3, 2.55 - cai * cai * 2.4, -.2 + cai * .4); placa.rotation.set(cai * .6, 0, cai * cai * 1.4); placa.visible = cai < 1;
    cabos.forEach(c => { c.visible = cai === 0; c.position.set(.7 + c.userData.x, 3.6, -.2); });
    nbG.n.position.set(.75, -.6 + sobe * 1.5, -.2); nbG.n.rotation.y = (1 - sobe) * 2; nbG.tampa.rotation.x = -(1 - eio(lin(lt, 2.6, 3.3))) * 1.5 - .15; telaT.draw(lt);
    return cai > .95 && cai < 1 ? .03 : lt > 1.8 && lt < 2.0 ? .02 : 0; },
  n3(lt, d) { anima(lt); costura(lt); telaT.draw(lt); const sai = eo(lin(lt, .4, 1.8));
    for (let i = 0; i < fPos.count; i++) { const x0 = fBase[i * 3], u = (x0 + 1.7) / 3.4; const show = u <= sai; const ang = u * 2.2;
      fPos.setXYZ(i, .7 + Math.sin(ang) * 1.1 * (show ? 1 : 0) - .3 * u, 1.4 + u * 1.2 + fBase[i * 3 + 1] * (show ? 1 : 0) + Math.sin(lt * 3 + u * 6) * .06, .2 - Math.cos(ang) * .6 * u); }
    fPos.needsUpdate = true; filme.geometry.computeVertexNormals();
    const dec = eio(lin(lt, 2.0, 4.5)); foguete.position.set(1.6, 1.0 + dec * 3.0, .1); foguete.rotation.z = Math.sin(lt * 8) * .03 * (1 - dec); foguete.scale.setScalar(Math.max(.01, back(lin(lt, 1.0, 1.5))));
    fogo.scale.set(1, .7 + Math.abs(Math.sin(lt * 30)) * .6 + dec, 1); fogo.visible = lt > 1.8;
    fumaca.forEach(F => { const k = (lt * .9 + F.ph) % 1; F.f.visible = lt > 2.0; F.f.position.set(1.6 + F.dx * k * 2, foguete.position.y - .6 - k * 1.2, .1 + F.dx * k); F.f.scale.setScalar(.4 + k * 1.4); F.f.material.opacity = .8 * (1 - k); }); },
  n2(lt, d) { anima(lt); costura(lt, -1.25, .35); telaT.draw(lt);
    slides.forEach((s, i) => { const leque = eo(lin(lt, .3 + i * .12, 1.0 + i * .12)), arruma = eio(lin(lt, 2.4 + i * .18, 3.0 + i * .18));
      const ax = -.1 + Math.cos(.6 + i * .5) * 1.1 * leque, ay = 1.3 + Math.sin(.6 + i * .5) * 1.0 * leque, az = .5;
      const bx = cav.position.x, by = 1.35 + i * .02, bz = cav.position.z + .12 + i * .03;
      s.position.set(ax + (bx - ax) * arruma, ay + (by - ay) * arruma, az + (bz - az) * arruma); s.rotation.set(-.1 * (1 - arruma), (.4 - i * .15) * (1 - arruma), (i - 2) * .12 * (1 - arruma)); s.scale.setScalar(Math.max(.01, leque)); }); },
  n1(lt, d) { anima(lt); costura(lt, -1.3, .35);
    bolhas.forEach(B => { const k = (lt * 1.5 + B.ph) % 1; B.b.position.set(Math.cos(B.a) * B.r, 1.34 + k * .25, Math.sin(B.a) * B.r); B.b.scale.setScalar(1 - k); }); caldo.material.emissiveIntensity = 1.2 + Math.sin(lt * 8) * .4;
    celulares.forEach((c, i) => { const k = eo(lin(lt, .4 + i * .35, 1.2 + i * .35)); c.visible = k > 0; c.position.set(.8 + (i - 1) * .95 * k, 1.4 + k * (1.2 + (i === 1 ? .35 : 0)), -.1 + k * .5); c.rotation.set(0, (1 - k) * 4, (i - 1) * -.15 * k); c.scale.setScalar(.4 + k * .6); });
    const des = eio(lin(lt, 2.1, 3.2)); rolo.position.set(.8, 1.55 + des * .1, .7); rolo.visible = lt > 1.9; papel.scale.y = Math.max(.01, des); papel.position.y = -.7 * des; pontaRolo.position.y = -1.4 * des; rolo.position.y = 1.55 + des * .9;
    fagulhas.forEach(F => { const k = (lt * 1.2 + F.ph) % 1; F.f.position.set(.8 + Math.cos(F.a) * (.3 + k), 1.4 + k * 1.6, -.1 + Math.sin(F.a) * (.3 + k) * .5); F.f.rotation.y = lt * 5; F.f.scale.setScalar(1 - k); }); luzOuro.intensity = 6 + Math.sin(lt * 9) * 2; },
  cta(lt, d) { anima(lt); costura(lt, -.2, .05); },
};

// ---------- elementos de tela (2D): tudo entre y=260 e y=1500, nada a menos de 130 px da direita ----------
const CAB = { ult: null, agora: 0 };
const ui = C => { const { X, GW, GH, ITENS, MAXE, eo, lin, eio, back, blocos, SEGR, CHAVE } = C;
  const cabe = (t, f, mx, fam = "SG", w = 700) => { while (f > 18) { X.font = `${w} ${f}px ${fam}`; if (X.measureText(t).width <= mx) break; f -= 2; } return f; };
  const listras = (x, y, w, h) => { X.save(); X.beginPath(); X.rect(x, y, w, h); X.clip(); X.fillStyle = TINTA; X.fillRect(x, y, w, h); X.fillStyle = OURO; for (let i = -h; i < w; i += 36) { X.beginPath(); X.moveTo(x + i, y + h); X.lineTo(x + i + 18, y + h); X.lineTo(x + i + 18 + h, y); X.lineTo(x + i + h, y); X.fill(); } X.restore(); };
  const estrela = (x, y, r, cor) => { X.fillStyle = cor; X.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; X.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } X.closePath(); X.fill(); };
  const fmtP = n => Math.round(n).toLocaleString("pt-BR");
  let TMP = null;
  return {
    fundo(t) { const g = X.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, "#2a1218"); g.addColorStop(1, NOITE); X.fillStyle = g; X.fillRect(0, 0, 1080, 1920);
      X.fillStyle = "rgba(242,193,78,.06)"; for (let i = 0; i < 12; i++) { X.beginPath(); X.arc(80 + (i * 283) % 920, 600 + (i * 157) % 900, 40 + (i % 3) * 30, 0, 7); X.fill(); } },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta, e = nome === "gancho" ? .9 + .1 * back(lin(t, 0, .4)) : 1;
      X.save(); X.translate(520, 390); X.rotate(-.04); X.scale(e, e); X.shadowColor = "rgba(0,0,0,.4)"; X.shadowBlur = 20; X.fillStyle = OURO; X.fillRect(-680, -100, 1360, 200); X.shadowColor = "transparent";
      listras(-680, -100, 1360, 20); listras(-680, 80, 1360, 20);
      X.textAlign = "center"; X.textBaseline = "middle"; X.fillStyle = TINTA; cabe(l1, 58, 820); X.fillText(l1, 0, -22);
      const p = l2.split(" "), num = p.slice(0, 2).join(" "), resto = " " + p.slice(2).join(" "); cabe(l2, 50, 800); const w1 = X.measureText(num).width, w2 = X.measureText(resto).width;
      X.textAlign = "left"; X.fillStyle = VERM; X.fillText(num, -(w1 + w2) / 2, 40); X.fillStyle = TINTA; X.fillText(resto, -(w1 + w2) / 2 + w1, 40); X.restore();
      X.save(); X.translate(520, 528); X.rotate(.025); X.fillStyle = VERM; X.fillRect(-440, -36, 880, 72); X.fillStyle = BRANCO; X.textAlign = "center"; X.textBaseline = "middle"; cabe(l3, 44, 820); X.fillText(l3, 0, 3); X.restore(); },
    cabecalho(s, lt, t) { if (!CAB.agora) { CAB.ult = [s, lt, t]; return; } // máquina de escrever + pote de estrelas
      X.save(); X.fillStyle = VERM; X.beginPath(); X.arc(112, 660, 48, 0, 7); X.fill(); X.strokeStyle = OURO; X.lineWidth = 5; X.stroke(); X.fillStyle = BRANCO; X.font = "700 50px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag, 112, 663);
      const n = Math.floor(Math.max(0, lt - .1) / .065), txt = s.item.slice(0, n); const fs = cabe(s.item, 64, 520, "JB", 500); X.fillStyle = "rgba(26,15,15,.85)"; X.beginPath(); X.roundRect(176, 618, X.measureText(s.item).width + 60, 88, 12); X.fill();
      X.fillStyle = BRANCO; X.textAlign = "left"; X.fillText(txt, 200, 664); if ((t * 2) % 1 < .5 || n < s.item.length) { const w = X.measureText(txt).width; X.fillStyle = OURO; X.fillRect(204 + w, 630, 7, 64); }
      const v = s.estrelas * eio(lin(lt, .3, 1.8)), nv = Math.min(1, v / MAXE), px = 840, py = 610, pw = 140, ph = 180;
      X.save(); X.beginPath(); X.roundRect(px - pw / 2, py, pw, ph, 26); X.clip(); X.fillStyle = "rgba(255,255,255,.12)"; X.fillRect(px - pw / 2, py, pw, ph); let k = 0;
      for (let row = 0; row < 12; row++) for (let c = 0; c < 4; c++) { const yy = py + ph - 14 - row * 15, xx = px - pw / 2 + 20 + c * 34 + (row % 2) * 14; if ((ph - (yy - py)) / ph > nv) continue; estrela(xx, yy, 13, [OURO, "#ffd447", "#e8a000"][(k++) % 3]); } X.restore();
      X.strokeStyle = BRANCO; X.lineWidth = 5; X.beginPath(); X.roundRect(px - pw / 2, py, pw, ph, 26); X.stroke(); X.fillStyle = VERM; X.fillRect(px - pw / 2 - 6, py - 20, pw + 12, 24);
      X.fillStyle = OURO; X.font = "700 60px SG"; X.textAlign = "right"; X.textBaseline = "alphabetic"; X.fillText(fmtP(v) + " ★", px - pw / 2 - 24, 770); X.fillStyle = "#e9d9c0"; X.font = "700 26px SG"; X.fillText("ESTRELAS NO GITHUB", px - pw / 2 - 24, 806); X.restore(); },
    desenha3D(glc, nome) { const _cab = () => { if (CAB.ult) { CAB.agora = 1; this.cabecalho(...CAB.ult); CAB.agora = 0; CAB.ult = null; } }; if (!TMP) { TMP = document.createElement("canvas"); TMP.width = GW; TMP.height = GH; }
      const g = TMP.getContext("2d"); g.globalCompositeOperation = "source-over"; g.clearRect(0, 0, GW, GH); g.drawImage(glc, 0, 0); g.globalCompositeOperation = "destination-in";
      const m = g.createLinearGradient(0, 0, 0, GH); m.addColorStop(0, "rgba(0,0,0,0)"); m.addColorStop(.1, "#000"); m.addColorStop(.88, "#000"); m.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = m; g.fillRect(0, 0, GW, GH);
      X.drawImage(TMP, 0, nome === "cta" ? 620 : 660); if (nome === "cta") { X.fillStyle = "rgba(20,10,14,.45)"; X.fillRect(0, 560, 1080, 1360); } _cab(); },
    legenda(seg, t) { // tarja de TV
      const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      X.fillStyle = VERM; X.fillRect(0, 1352, 1080, 124); X.fillStyle = OURO; X.fillRect(0, 1352, 1080, 8); X.fillRect(0, 1468, 1080, 8);
      X.fillStyle = TINTA; X.fillRect(56, 1374, 104, 38); X.fillStyle = OURO; X.font = "400 16px PS"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("AO VIVO", 108, 1394);
      let fs = 56; const tot = () => c.reduce((a, w) => a + X.measureText(w.w.toUpperCase() + " ").width, 0); X.font = `700 ${fs}px SG`; while (tot() > 760 && fs > 30) { fs -= 2; X.font = `700 ${fs}px SG`; }
      let x = 180; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02; X.fillStyle = on && t < w.t1 + .2 ? OURO : on ? "#fff" : "rgba(255,255,255,.5)"; X.fillText(w.w.toUpperCase(), x, 1428); x += X.measureText(w.w.toUpperCase() + " ").width; } },
    transicao(lt, s) { if (!s.item || lt > .32) return; const p = eio(lt / .32), x = 1080 * (1 - p) * 1.4 - 200; // virada de página: a folha passa da direita para a esquerda
      X.save(); X.fillStyle = BRANCO; X.beginPath(); X.moveTo(x, 0); X.lineTo(x + 900, 0); X.lineTo(x + 500, 1920); X.lineTo(x - 400, 1920); X.closePath(); X.shadowColor = "rgba(0,0,0,.45)"; X.shadowBlur = 40; X.globalAlpha = 1 - p * .2; X.fill();
      X.shadowColor = "transparent"; X.strokeStyle = "rgba(215,38,46,.25)"; X.lineWidth = 3; for (let y = 120; y < 1920; y += 70) { X.beginPath(); X.moveTo(x + 900 - y * .208, y); X.lineTo(x - y * .208, y); X.stroke(); } X.restore(); },
    fechamento(lt) { // post-its na parede
      ITENS.forEach((s, i) => { const a = back(lin(lt, .1 + i * .14, .45 + i * .14)); if (a <= 0) return; const x = [230, 515, 800][i] - 10, y = 760 + (i % 2) * 50;
        X.save(); X.translate(x, y); X.rotate([-.06, .04, -.03][i]); X.scale(a, a); X.shadowColor = "rgba(0,0,0,.4)"; X.shadowBlur = 16; X.shadowOffsetY = 8; X.fillStyle = ["#ffe066", "#ff9fb2", "#ffd29a"][i]; X.fillRect(-135, -150, 270, 290); X.shadowColor = "transparent";
        X.fillStyle = VERM; X.beginPath(); X.arc(0, -134, 13, 0, 7); X.fill(); X.textAlign = "center"; X.textBaseline = "middle"; X.fillStyle = VERM; X.font = "700 58px SG"; X.fillText(s.tag, 0, -78);
        X.fillStyle = TINTA; const nm = s.item.split(" "); X.font = `700 ${cabe(nm.reduce((a, b) => a.length > b.length ? a : b), 44, 230)}px SG`; nm.length > 1 ? (X.fillText(nm.slice(0, -1).join(" "), 0, -14), X.fillText(nm[nm.length - 1], 0, 34)) : X.fillText(s.item, 0, 10);
        X.font = "700 36px SG"; X.fillStyle = "#6b3a2a"; X.fillText(fmtP(s.estrelas) + " ★", 0, 96); X.restore(); });
      const p = back(lin(lt, .55, .95)); X.save(); X.translate(515, 1290); X.rotate(-.03); X.scale(p, p); X.fillStyle = "#ffe066"; X.shadowColor = "rgba(0,0,0,.45)"; X.shadowBlur = 22; X.fillRect(-390, -120, 780, 240); X.shadowColor = "transparent";
      X.fillStyle = VERM; X.textAlign = "center"; X.textBaseline = "middle"; X.font = `700 ${cabe("COMENTA " + CHAVE, 84, 700)}px SG`; X.fillText("COMENTA " + CHAVE, 0, -38); X.fillStyle = TINTA; X.font = "700 36px SG"; X.fillText("e eu te mando as 3 + dica de tradução", 0, 40); X.fillStyle = "#6b3a2a"; X.font = "700 28px SG"; X.fillText("(os manuais estão em chinês)", 0, 86); X.restore(); },
  }; };
const cores = { LAR: VERM, VERDE: OURO, FUNDO: NOITE, CREME: BRANCO, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

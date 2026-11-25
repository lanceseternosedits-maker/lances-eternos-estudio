// Reel "3 jeitos de rodar IA gigante no seu PC" (08/11). Identidade: sala de servidores caseira num armário de lavanderia
// (máquina de lavar, PCs empilhados com LEDs, ventoinhas, roupa no varal); azul-LED + branco-azulejo + laranja-aviso.
// Elementos: etiqueta de papel rasgado com fita, nome em carimbo, placar HI-SCORE, legenda karaokê com marca-texto,
// transição de zoom atravessando uma tela de monitor, câmera em órbita, fechamento em pódio, Caveat + Space Grotesk.
// Mascote de touca de banho e chave inglesa, patinando. Gancho: a nuvem de chuva é puxada para dentro do gabinete.
// Nº 1: placas de vídeo entram em fila e acendem uma esfera gigante de pontos. Sem logos de terceiros.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const LED = "#2f9bff", AZUL2 = "#7cc8ff", AZULEJO = "#eef3f6", REJUNTE = "#c9d4dc", AVISO = "#ff7a1a", TINTA = "#14202b", METAL = "#9aa6b0";
rim.color.set(0x7cc8ff); rim.intensity = 2.2; key.color.set(0xf4f8ff); key.intensity = 100; key.position.set(-1, 8, 6); key.target.position.set(.2, 1.2, -.6);
const ledL = new THREE.PointLight(0x2f9bff, 6, 6, 1.6); ledL.position.set(2, 1.8, -.6); S.add(ledL);

// ---------- cenário: parede e piso de azulejo, máquina de lavar, torre de PCs, varal ----------
const sala = new THREE.Group(); S.add(sala); const ZW = -1.7;
const azT = ctex(512, 512, (g, w, h) => { g.fillStyle = AZULEJO; g.fillRect(0, 0, w, h); g.fillStyle = REJUNTE; for (let i = 0; i <= 8; i++) { g.fillRect(i * 64 - 2, 0, 4, h); g.fillRect(0, i * 64 - 2, w, 4); } });
azT.wrapS = azT.wrapT = THREE.RepeatWrapping; azT.repeat.set(5, 3);
const parede = mesh(new THREE.PlaneGeometry(16, 9), new THREE.MeshStandardMaterial({ map: azT, roughness: .35 }), sala, 0, 4.5, ZW);
const pisoT = ctex(512, 512, (g, w, h) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? "#d9e2e8" : "#b9c7d1"; g.fillRect(i * 64, j * 64, 64, 64); } });
pisoT.wrapS = pisoT.wrapT = THREE.RepeatWrapping; pisoT.repeat.set(4, 3);
const piso = mesh(new THREE.PlaneGeometry(16, 9), new THREE.MeshStandardMaterial({ map: pisoT, roughness: .5 }), sala, 0, 0, 2.5); piso.rotation.x = -Math.PI / 2;
// máquina de lavar (esquerda), com a água azul girando atrás da porta redonda
const lav = new THREE.Group(); lav.position.set(-2.25, 0, ZW + .55); sala.add(lav);
box(1.3, 1.45, 1.0, M("#f7f9fb", { roughness: .3 }), lav, 0, .73, 0); box(1.3, .2, 1.02, M("#e3e8ec"), lav, 0, 1.36, 0);
const tamboT = ctex(256, 256, (g, w, h, a = 0) => { g.fillStyle = "#0d3a66"; g.fillRect(0, 0, w, h); g.save(); g.translate(w / 2, h / 2); g.rotate(a);
  for (let i = 0; i < 6; i++) { g.fillStyle = ["#2f9bff", "#7cc8ff", "#ff7a1a", "#ffffff", "#ffd23f", "#2f9bff"][i]; g.beginPath(); g.ellipse(Math.cos(i) * 50, Math.sin(i) * 50, 42, 22, i, 0, 7); g.fill(); } g.restore();
  g.fillStyle = "rgba(255,255,255,.25)"; g.beginPath(); g.arc(90, 80, 40, 0, 7); g.fill(); });
const porta = mesh(new THREE.CircleGeometry(.4, 40), new THREE.MeshStandardMaterial({ map: tamboT, emissive: "#ffffff", emissiveMap: tamboT, emissiveIntensity: .35, roughness: .1 }), lav, 0, .66, .505);
mesh(new THREE.TorusGeometry(.43, .06, 10, 40), M(METAL, { metalness: .7, roughness: .3 }), lav, 0, .66, .52);
[-.38, -.2].forEach(x => mesh(new THREE.CylinderGeometry(.06, .06, .04, 16), M(AVISO), lav, x, 1.36, .5).rotation.x = Math.PI / 2);
const ledLav = mesh(new THREE.BoxGeometry(.3, .07, .02), E(LED, 2), lav, .35, 1.36, .515);
// torre de PCs empilhados (direita), com fitas de LED e ventoinhas girando
const torre = new THREE.Group(); torre.position.set(2.15, 0, ZW + .55); sala.add(torre); const fans = [], fitas = [];
for (let i = 0; i < 3; i++) { const y = .35 + i * .72; box(1.2, .66, .9, M("#20262d", { roughness: .4, metalness: .3 }), torre, 0, y, 0);
  const vid = mesh(new THREE.PlaneGeometry(.9, .5), new THREE.MeshStandardMaterial({ color: "#0b1622", roughness: .1, metalness: .3, transparent: true, opacity: .9 }), torre, -.08, y, .456); vid.castShadow = false;
  for (let k = 0; k < 2; k++) { const f = new THREE.Group(); f.position.set(-.33 + k * .4, y, .47); torre.add(f); mesh(new THREE.TorusGeometry(.15, .025, 6, 24), E(LED, 1.6), f, 0, 0, 0);
    for (let p = 0; p < 4; p++) { const pa = box(.05, .24, .01, M("#3a4652"), f, 0, 0, 0); pa.rotation.z = p * Math.PI / 4; } fans.push(f); }
  fitas.push(mesh(new THREE.BoxGeometry(.05, .5, .02), E(i === 1 ? AVISO : LED, 2.2), torre, .5, y, .46)); }
// cabos
for (let i = 0; i < 3; i++) { const c = mesh(new THREE.TorusGeometry(.5 + i * .12, .025, 6, 24, Math.PI), M(["#ff7a1a", "#2f9bff", "#111"][i]), sala, 1.1 + i * .05, .02, ZW + .3); c.rotation.x = -Math.PI / 2; c.castShadow = false; }
// varal com roupas balançando
const varal = new THREE.Group(); varal.position.set(0, 3.25, ZW + .7); sala.add(varal); box(6, .02, .02, M("#dddddd"), varal, 0, 0, 0);
const roupas = [[-2.4, "#ff7a1a", .5, .7], [-1.5, "#2f9bff", .6, .5], [-.4, "#ffffff", .45, .6], [1.3, "#ffd23f", .35, .45], [2.3, "#7cc8ff", .55, .65]].map(([x, c, w, h]) => {
  const p = new THREE.Group(); p.position.x = x; varal.add(p); const r = mesh(new THREE.PlaneGeometry(w, h), M(c, { side: THREE.DoubleSide, roughness: .9 }), p, 0, -h / 2 - .03, 0); r.castShadow = false;
  box(.04, .09, .03, M("#ff4fa0"), p, -w / 3, -.02, .02); box(.04, .09, .03, M("#ff4fa0"), p, w / 3, -.02, .02); return p; });

// ---------- mascote: touca de banho (bolinhas), chave inglesa e patins ----------
const toucaT = ctex(256, 128, (g, w, h) => { g.fillStyle = "#9fd8ff"; g.fillRect(0, 0, w, h); g.fillStyle = "#ffffff"; for (let i = 0; i < 40; i++) { g.beginPath(); g.arc((i * 47) % w, (i * 29) % h, 6, 0, 7); g.fill(); } });
const touca = mesh(new THREE.SphereGeometry(.62, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ map: toucaT, roughness: .6 }), MAS.corpo, 0, 1.47, 0); touca.scale.set(1.25, .55, .88);
const babado = mesh(new THREE.TorusGeometry(.62, .055, 8, 40), M("#ffffff", { roughness: .8 }), MAS.corpo, 0, 1.49, 0); babado.rotation.x = Math.PI / 2; babado.scale.set(1.26, .9, 1);
const chave = new THREE.Group(); chave.position.set(.42, .05, .12); MAS.bracos[1].add(chave); const aco = M("#c3ccd4", { metalness: .85, roughness: .25 });
box(.08, .55, .05, aco, chave, 0, .2, 0); const cab = mesh(new THREE.TorusGeometry(.1, .04, 8, 16, Math.PI * 1.5), aco, chave, 0, .52, 0); cab.rotation.z = Math.PI * .75;
MAS.pernas.forEach(p => { box(.24, .1, .36, M(AVISO), p, 0, -.25, .03); [-.11, .12].forEach(z => { const r = mesh(new THREE.CylinderGeometry(.05, .05, .2, 12), E(LED, 1.2), p, 0, -.33, z); r.rotation.z = Math.PI / 2; }); });
const BX = -.75, BZ = .45, SK = .13;
function patina(lt, amp = .55, vel = 1.5) { const a = lt * vel, s = Math.sin(a);
  pose(MAS, { x: BX + s * amp, z: BZ + Math.sin(a * 2) * .1, y: SK, ry: Math.cos(a) * .28, braco: [.55 - s * .4, .55 + s * .4], piscar: pisca(lt) });
  MAS.corpo.rotation.z = -Math.cos(a) * .08; MAS.corpo.rotation.x = .05; MAS.pernas.forEach((p, i) => { p.position.z = (i % 2 ? 1 : -1) * Math.sin(a * 2) * .08; p.position.y = .22; }); }
function anima(t) { fans.forEach((f, i) => f.rotation.z = t * (6 + i)); fitas.forEach((f, i) => f.material.emissiveIntensity = 1.6 + Math.sin(t * 4 + i * 2) * .8); tamboT.draw(t * 3); ledLav.material.emissiveIntensity = 1.4 + Math.sin(t * 6) * .6;
  roupas.forEach((r, i) => r.rotation.x = Math.sin(t * 1.3 + i) * .12); }

// ---------- gancho: nuvem de chuva é puxada para dentro do gabinete principal ----------
const gG = grupo("gancho"); const nuvem = new THREE.Group(); gG.add(nuvem); const cinza = M("#8592a0", { roughness: .9 });
[[0, 0, .45], [.42, .08, .38], [-.42, .05, .36], [.15, .3, .36], [-.2, .28, .3]].forEach(([x, y, r]) => mesh(new THREE.SphereGeometry(r, 16, 12), cinza, nuvem, x, y, 0));
const chuva = []; for (let i = 0; i < 16; i++) { const g = mesh(new THREE.CylinderGeometry(.025, .025, .22, 6), E(LED, 1.2), gG, 0, 0, 0); g.castShadow = false; chuva.push({ g, x: (rnd() - .5) * 1.2, z: (rnd() - .5) * .5, ph: rnd() }); }
const gab = new THREE.Group(); gab.position.set(.95, 0, -.2); gG.add(gab); box(.9, 1.5, 1.0, M("#1b2128", { metalness: .3, roughness: .4 }), gab, 0, .75, 0);
const boca = mesh(new THREE.PlaneGeometry(.66, .5), E(LED, 1.0), gab, 0, 1.2, .505); const giro = new THREE.Group(); giro.position.set(0, 1.2, .52); gab.add(giro);
for (let i = 0; i < 3; i++) { const t = mesh(new THREE.TorusGeometry(.14 + i * .07, .012, 6, 24), E("#ffffff", 1.5), giro, 0, 0, 0); t.castShadow = false; }
[.35, .55].forEach(y => mesh(new THREE.BoxGeometry(.6, .03, .02), E(AVISO, 1.6), gab, 0, y, .505));

// ---------- itens ----------
// nº 3 kapitsa (IA rápida em Mac com chip): um chip gigante sobe do chão e solta raios de velocidade
const n3 = grupo("n3"); const chip = new THREE.Group(); chip.position.set(.6, 0, .35); n3.add(chip);
const chipT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#2a3038"; g.fillRect(0, 0, w, h); g.strokeStyle = "#4b5663"; g.lineWidth = 3; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(30, 30 + i * 28); g.lineTo(226, 30 + i * 28); g.stroke(); }
  g.fillStyle = "#11161c"; g.fillRect(64, 64, 128, 128); g.fillStyle = LED; g.font = "700 44px SG"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("IA", 128, 130); });
const corpoChip = box(1.1, .16, 1.1, [M("#2a3038"), M("#2a3038"), new THREE.MeshStandardMaterial({ map: chipT, emissive: "#ffffff", emissiveMap: chipT, emissiveIntensity: .25 }), M("#2a3038"), M("#2a3038"), M("#2a3038")], chip, 0, 0, 0);
const ouro = M("#e0b54a", { metalness: .9, roughness: .25 });
for (let i = 0; i < 7; i++) for (const [dx, dz, ry] of [[-.6, 0, 0], [.6, 0, 0], [0, -.6, 1], [0, .6, 1]]) { const p = box(.16, .04, .06, ouro, chip, dx + (ry ? (i - 3) * .14 : 0), -.02, dz + (ry ? 0 : (i - 3) * .14)); if (ry) p.rotation.y = Math.PI / 2; }
const raios = []; for (let i = 0; i < 14; i++) { const r = mesh(new THREE.BoxGeometry(.6 + rnd() * .5, .035, .035), E(i % 3 ? LED : "#ffffff", 2.5), n3, 0, 0, 0); r.castShadow = false; raios.push({ r, a: i / 14 * 6.28, y: .3 + rnd() * 1.3, ph: rnd() }); }
// nº 2 PolyStrata (vários modelos com um clique): o mascote aperta o botão laranja e caixinhas de modelos saltam para a prateleira
const n2 = grupo("n2"); const botao = new THREE.Group(); botao.position.set(.15, 0, .3); n2.add(botao);
mesh(new THREE.CylinderGeometry(.18, .22, .9, 20), M("#2a3038", { metalness: .4 }), botao, 0, .45, 0); const tampa = mesh(new THREE.CylinderGeometry(.24, .24, .14, 24), E(AVISO, .8), botao, 0, .96, 0);
const prat = new THREE.Group(); prat.position.set(1.2, 0, -.6); n2.add(prat); [.5, 1.15, 1.8].forEach(y => box(1.7, .06, .6, M("#cfd8de"), prat, 0, y, 0)); [-.85, .85].forEach(x => box(.06, 2.0, .6, M("#cfd8de"), prat, x, 1.0, 0));
const NOMES = ["IA", "IA", "IA", "IA", "IA", "IA", "IA", "IA", "IA"]; const CORES = [LED, AVISO, "#ffd23f", "#7ee787", "#ff4fa0", AZUL2, "#ffffff", "#b38bff", LED];
const caixas = NOMES.map((n, i) => { const t = ctex(64, 64, g => { g.fillStyle = CORES[i]; g.fillRect(0, 0, 64, 64); g.fillStyle = TINTA; g.font = "700 26px SG"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(n, 32, 34); });
  const b = mesh(new THREE.BoxGeometry(.4, .4, .4), new THREE.MeshStandardMaterial({ map: t, roughness: .5 }), n2, 0, 0, 0); return { b, x: -.55 + (i % 3) * .55, y: .73 + Math.floor(i / 3) * .65 }; });
// nº 1 Project Maya (centenas de bilhões de parâmetros nas suas placas): placas de vídeo entram em fila e acendem uma esfera gigante
const n1 = grupo("n1"); const placas = [0, 1, 2, 3].map(i => { const p = new THREE.Group(); n1.add(p); box(1.5, .14, .5, M("#1b2128", { metalness: .5, roughness: .3 }), p, 0, 0, 0);
  for (let k = 0; k < 3; k++) { const f = new THREE.Group(); f.position.set(-.48 + k * .48, .075, 0); p.add(f); mesh(new THREE.CylinderGeometry(.18, .18, .02, 20), M("#3a4652"), f, 0, 0, 0); mesh(new THREE.TorusGeometry(.18, .02, 6, 20), E(LED, 1.8), f, 0, .015, 0).rotation.x = Math.PI / 2; }
  box(1.5, .03, .03, E(AVISO, 2), p, 0, .02, .26); return p; });
const pts = []; const esf = new THREE.Group(); esf.position.set(.6, 2.05, .1); n1.add(esf);
for (let i = 0; i < 160; i++) { const y = 1 - (i / 159) * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996; const m = mesh(new THREE.SphereGeometry(.055, 6, 4), E(i % 5 ? LED : AVISO, 2.4), esf, Math.cos(a) * r * .75, y * .75, Math.sin(a) * r * .75); m.castShadow = false; pts.push(m); }
const nucleo = mesh(new THREE.IcosahedronGeometry(.32, 1), E(LED, 1.4), esf, 0, 0, 0); nucleo.material.wireframe = true;

// ---------- fechamento: espuma de sabão subindo ----------
const cG = grupo("cta"); const bolhas = [];
for (let i = 0; i < 40; i++) { const b = mesh(new THREE.SphereGeometry(.06 + rnd() * .1, 12, 8), new THREE.MeshStandardMaterial({ color: "#eaf6ff", transparent: true, opacity: .55, roughness: .05, metalness: .2 }), cG, 0, 0, 0); b.castShadow = false; bolhas.push({ b, x: (rnd() - .5) * 6, z: -1 + rnd() * 2.5, y0: rnd() * 4, v: .4 + rnd() * .5, ph: rnd() * 6 }); }

// ---------- câmera: órbita lenta em volta do armário ----------
const SHOTS = {}; ["gancho", "n3", "n2", "n1", "cta"].forEach(n => SHOTS[n] = [[V(0, 2, 6), V(.2, 1.5, 0)], [V(0, 2, 6), V(.2, 1.5, 0)]]);
const ALVO = [.2, 1.45, -.5];
const camera = (cam, nome, lt, d, t) => { const dir = nome === "n2" ? -1 : 1, a = dir * (-.26 + (lt / d) * .52), r = nome === "cta" ? 7.6 : 7.0;
  cam.position.set(ALVO[0] + Math.sin(a) * r, 2.25 + Math.sin(t * .7) * .08, ALVO[2] + Math.cos(a) * r); cam.lookAt(ALVO[0], ALVO[1], ALVO[2]); };

const ACT = {
  gancho(lt, d) { anima(lt); const pux = eio(lin(lt, 1.6, 3.2)), ent = eo(lin(lt, 0, .6));
    patina(lt, .35 * ent, 1.8); MAS.g.position.x = -1.3 + ent * .55 + Math.sin(lt * 1.8) * .3 * ent;
    const nx = -.4 + (.95 - -.4) * pux, ny = 2.55 - (2.55 - 1.2) * pux * pux; nuvem.position.set(nx, ny + Math.sin(lt * 2) * .05 * (1 - pux), -.1 + pux * .25); nuvem.scale.setScalar(Math.max(.01, 1 - pux * .97)); nuvem.rotation.z = pux * 3;
    chuva.forEach(C => { const k = (lt * 1.8 + C.ph) % 1; C.g.visible = pux < .6; C.g.position.set(nuvem.position.x + C.x * (1 - pux), nuvem.position.y - .3 - k * 2.0, nuvem.position.z + C.z); });
    giro.rotation.z = -lt * 6; giro.scale.setScalar(.6 + pux * .8); boca.material.emissiveIntensity = .8 + pux * 1.6 + (pux > .98 ? Math.sin(lt * 20) * .5 : 0);
    return pux > .97 && pux < 1 ? .02 : lt < .3 ? .01 : 0; },
  n3(lt, d) { anima(lt); patina(lt, .5); const sobe = back(lin(lt, .2, .9)); chip.position.y = Math.max(.01, sobe) * 1.5; chip.rotation.set(.75, lt * .8, 0); chip.scale.setScalar(Math.max(.01, sobe) * 1.35);
    raios.forEach(R => { const k = (lt * 1.6 + R.ph) % 1; R.r.visible = lt > 1.0; const rr = .7 + k * 2.6; R.r.position.set(chip.position.x + Math.cos(R.a) * rr, R.y + .4, chip.position.z + Math.sin(R.a) * rr * .5); R.r.rotation.y = -R.a; R.r.scale.x = 1 - k * .6; }); },
  n2(lt, d) { anima(lt); const aperta = [1.0, 1.05].some(tt => lt > tt && lt < tt + .2); const k = lin(lt, 0, .7);
    pose(MAS, { x: -.6 - (1 - eo(k)) * .6, z: .35, y: SK, ry: .3, braco: [.3, aperta ? .1 : .9 + Math.sin(lt * 3) * .1], piscar: pisca(lt), sq: aperta ? .06 : 0 }); MAS.corpo.rotation.set(.05, 0, 0);
    tampa.position.y = aperta ? .9 : .96; tampa.material.emissiveIntensity = lt > 1.0 ? 1.6 + Math.sin(lt * 10) * .6 : .8; botao.scale.setScalar(Math.max(.01, back(lin(lt, 0, .5))));
    caixas.forEach((C, i) => { const a = eio(lin(lt, 1.2 + i * .22, 1.75 + i * .22)); const x0 = .15, y0 = 1.1, x1 = prat.position.x + C.x, y1 = C.y;
      C.b.visible = a > 0; C.b.position.set(x0 + (x1 - x0) * a, y0 + (y1 - y0) * a + Math.sin(a * Math.PI) * 1.1, .3 + (prat.position.z - .3) * a); C.b.rotation.set(0, (1 - a) * 4, (1 - a) * 2); C.b.scale.setScalar(.5 + a * .5); }); },
  n1(lt, d) { anima(lt * 2.2); patina(lt, .3, 1.2); MAS.g.position.x = -1.15 + Math.sin(lt * 1.2) * .25;
    placas.forEach((p, i) => { const a = eo(lin(lt, .2 + i * .25, .7 + i * .25)); p.position.set(.75 + (1 - a) * 4, .25 + i * .28, -.2); p.rotation.y = -.15; p.visible = a > 0;
      p.children.forEach(c => { if (c.type === "Group") c.rotation.y = lt * 12; }); });
    const acende = eio(lin(lt, 1.5, 2.6)); esf.scale.setScalar(Math.max(.01, acende * 1.25)); esf.rotation.set(lt * .2, lt * .6, 0);
    pts.forEach((m, i) => m.material.emissiveIntensity = 1.5 + Math.sin(lt * 6 + i) * 1.2); nucleo.rotation.y = -lt * 1.5; ledL.intensity = 6 + acende * 8;
    return acende > .02 && acende < .3 ? .012 : 0; },
  cta(lt, d) { anima(lt); patina(lt, .25, 1.0); MAS.g.position.x = 0 + Math.sin(lt) * .25; MAS.bracos[1].rotation.z = 2.0 + Math.sin(lt * 9) * .45;
    bolhas.forEach(B => { const y = ((B.y0 + lt * B.v) % 4); B.b.position.set(B.x + Math.sin(lt * 1.3 + B.ph) * .25, y, B.z); }); },
};

// ---------- elementos de tela (2D): tudo entre y=260 e y=1500, nada a menos de 130 px da direita ----------
const CAB = { ult: null, agora: 0 };
const ui = C => { const { X, GW, GH, ITENS, eo, lin, eio, back, blocos, SEGR, CHAVE } = C;
  const cabe = (t, f, mx, fam = "SG", w = 700) => { while (f > 18) { X.font = `${w} ${f}px ${fam}`; if (X.measureText(t).width <= mx) break; f -= 2; } return f; };
  const rasgado = (x, y, w, h, cor, sd) => { X.fillStyle = cor; X.beginPath(); X.moveTo(x, y); let s = sd; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i <= 24; i++) X.lineTo(x + w * i / 24, y + (r() - .5) * 14); for (let i = 0; i <= 16; i++) X.lineTo(x + w + (r() - .5) * 10, y + h * i / 16); for (let i = 24; i >= 0; i--) X.lineTo(x + w * i / 24, y + h + (r() - .5) * 14); X.closePath(); X.fill(); };
  const fita = (x, y, w, a) => { X.save(); X.translate(x, y); X.rotate(a); X.fillStyle = "rgba(255,226,170,.9)"; X.fillRect(-w / 2, -20, w, 40); X.fillStyle = "rgba(0,0,0,.05)"; for (let i = -w / 2; i < w / 2; i += 10) X.fillRect(i, -20, 2, 40); X.restore(); };
  const fmtP = n => Math.round(n).toLocaleString("pt-BR");
  let TMP = null;
  return {
    fundo(t) { X.fillStyle = AZULEJO; X.fillRect(0, 0, 1080, 1920); X.fillStyle = REJUNTE; for (let x = 0; x < 1080; x += 90) X.fillRect(x, 0, 3, 1920); for (let y = 0; y < 1920; y += 90) X.fillRect(0, y, 1080, 3);
      const g = X.createRadialGradient(760, 1050, 50, 760, 1050, 800); g.addColorStop(0, "rgba(47,155,255,.18)"); g.addColorStop(1, "rgba(47,155,255,0)"); X.fillStyle = g; X.fillRect(0, 0, 1080, 1920); },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta, b = nome === "gancho" ? .9 + .1 * back(lin(t, 0, .45)) : 1;
      X.save(); X.translate(520, 405); X.rotate(-.018); X.scale(b, b); X.shadowColor = "rgba(0,0,0,.22)"; X.shadowBlur = 16; X.shadowOffsetY = 7; rasgado(-440, -122, 880, 244, "#ffffff", 7); X.shadowColor = "transparent";
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(l1, 56, 820); X.fillText(l1, 0, -46);
      X.fillStyle = AVISO; cabe(l2, 76, 820, "CV"); X.fillText(l2, 0, 22); X.fillStyle = "#1677d6"; cabe(l3, 46, 820); X.fillText(l3, 0, 86); X.restore();
      fita(110, 300, 150, -.55); fita(930, 300, 150, .55); },
    cabecalho(s, lt, t) { if (!CAB.agora) { CAB.ult = [s, lt, t]; return; } // carimbo + placar HI-SCORE
      X.save(); X.textBaseline = "middle"; X.textAlign = "center";
      X.fillStyle = TINTA; X.beginPath(); X.roundRect(60, 560, 118, 96, 14); X.fill(); X.fillStyle = "#fff"; X.font = "700 62px SG"; X.fillText(s.tag, 119, 610);
      const bate = lin(lt, .2, .35), sc = lt < .2 ? 0 : 1 + (1 - eo(bate)) * .9; if (sc > 0) { const nm = s.item.toUpperCase(); const fs = cabe(nm, 64, 640); const w = X.measureText(nm).width + 56;
        X.translate(200 + w / 2, 608); X.rotate(-.045); X.scale(sc, sc); X.globalAlpha = Math.min(1, bate * 2.5); X.strokeStyle = AVISO; X.lineWidth = 7; X.strokeRect(-w / 2, -50, w, 100); X.lineWidth = 2; X.strokeRect(-w / 2 + 9, -41, w - 18, 82);
        X.fillStyle = AVISO; X.font = `700 ${fs}px SG`; X.fillText(nm, 0, 4); X.globalCompositeOperation = "destination-out"; X.globalAlpha = .25; for (let i = 0; i < 40; i++) X.fillRect(-w / 2 + (i * 53) % w, -46 + (i * 29) % 92, 6, 3); }
      X.restore(); X.globalAlpha = 1;
      const v = s.estrelas * eio(lin(lt, .35, 1.7)); X.fillStyle = "rgba(12,20,30,.9)"; X.beginPath(); X.roundRect(60, 680, 600, 92, 14); X.fill(); X.strokeStyle = LED; X.lineWidth = 3; X.stroke();
      X.fillStyle = AZUL2; X.font = "400 20px PS"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("HI-SCORE", 84, 708); X.fillStyle = "#9fb0c0"; X.font = "700 22px SG"; X.fillText("ESTRELAS NO GITHUB", 84, 746);
      X.fillStyle = lt < 1.7 || Math.floor(t * 5) % 2 ? "#ffd23f" : "#fff"; X.font = "700 70px SG"; X.textAlign = "right"; X.fillText(fmtP(v), 640, 728); },
    desenha3D(glc, nome) { const _cab = () => { if (CAB.ult) { CAB.agora = 1; this.cabecalho(...CAB.ult); CAB.agora = 0; CAB.ult = null; } }; if (!TMP) { TMP = document.createElement("canvas"); TMP.width = GW; TMP.height = GH; }
      const g = TMP.getContext("2d"); g.globalCompositeOperation = "source-over"; g.clearRect(0, 0, GW, GH); g.drawImage(glc, 0, 0); g.globalCompositeOperation = "destination-in";
      const m = g.createLinearGradient(0, 0, 0, GH); m.addColorStop(0, "rgba(0,0,0,0)"); m.addColorStop(.1, "#000"); m.addColorStop(.9, "#000"); m.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = m; g.fillRect(0, 0, GW, GH);
      if (nome === "cta") { X.save(); X.beginPath(); X.roundRect(110, 545, 820, 440, 26); X.clip(); X.drawImage(TMP, -20, 370, GW, GH); X.restore(); X.strokeStyle = LED; X.lineWidth = 6; X.beginPath(); X.roundRect(110, 545, 820, 440, 26); X.stroke(); return; }
      X.drawImage(TMP, 0, 640); _cab(); },
    legenda(seg, t) { // karaokê com marca-texto deslizando
      const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 62; X.font = `700 ${fs}px SG`; const sp = () => X.measureText(" ").width; const tot = () => c.reduce((a, w) => a + X.measureText(w.w).width, 0) + sp() * (c.length - 1); while (tot() > 820 && fs > 34) { fs -= 2; X.font = `700 ${fs}px SG`; }
      const x0 = 505 - tot() / 2, y = 1420; X.fillStyle = "rgba(255,255,255,.95)"; X.beginPath(); X.roundRect(x0 - 30, y - fs * .8, tot() + 60, fs * 1.6, 14); X.fill();
      let x = x0, hw = 0; for (const w of c) { const ww = X.measureText(w.w).width; if (t >= w.t0 - .02) { const p = Math.min(1, (t - w.t0 + .02) / Math.max(.08, w.t1 - w.t0)); hw = x - x0 + ww * p; } x += ww + sp(); }
      X.fillStyle = "rgba(255,170,60,.75)"; X.fillRect(x0 - 6, y - fs * .42, hw + 12, fs * .86);
      x = x0; X.textAlign = "left"; X.textBaseline = "middle"; for (const w of c) { X.fillStyle = TINTA; X.fillText(w.w, x, y + 2); x += X.measureText(w.w).width + sp(); } },
    transicao(lt, s) { // zoom atravessando a tela de um monitor
      if (!s.item || lt > .3) return; const p = eio(lt / .3), w = 360 + p * 2200, h = w * .62, cx = 520, cy = 1060;
      X.save(); X.fillStyle = "#0c141e"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(cx - w / 2, cy - h / 2, w, h, 16 + p * 30); X.fill("evenodd");
      X.strokeStyle = LED; X.lineWidth = 10 + p * 24; X.beginPath(); X.roundRect(cx - w / 2, cy - h / 2, w, h, 16 + p * 30); X.stroke(); X.restore(); },
    fechamento(lt) { // pódio: 2º à esquerda, 1º no meio, 3º à direita
      const ord = [ITENS[1], ITENS[2], ITENS[0]], xs = [220, 515, 810], hs = [130, 190, 95], base = 1300;
      ord.forEach((s, i) => { const a = back(lin(lt, .1 + i * .12, .5 + i * .12)); if (a <= 0) return; const h = hs[i] * a, x = xs[i];
        X.fillStyle = ["#c9d4dc", "#ffd23f", AVISO][i]; X.fillRect(x - 135, base - h, 270, h); X.fillStyle = TINTA; X.font = "700 56px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag, x, base - h + 44);
        X.font = `700 ${cabe(s.item, 40, 260)}px SG`; X.fillText(s.item, x, base - h - 64); X.fillStyle = "#1677d6"; X.font = "700 30px SG"; X.fillText(fmtP(s.estrelas) + " ★", x, base - h - 24); });
      X.save(); X.translate(515, 1340); X.rotate(-.025); X.globalAlpha = lin(lt, .7, 1.0); X.fillStyle = TINTA; X.font = "700 50px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("o nº 1 é pra quem tem máquina forte", 0, 0); X.restore(); X.globalAlpha = 1;
      const p = eo(lin(lt, .6, 1.0)); X.save(); X.translate(515, 1435); X.scale(.7 + .3 * p, .7 + .3 * p); X.globalAlpha = p; X.fillStyle = AVISO; X.beginPath(); X.roundRect(-380, -52, 760, 104, 20); X.fill();
      X.fillStyle = "#fff"; X.font = "700 70px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore(); X.globalAlpha = 1; },
  }; };
const cores = { LAR: AVISO, VERDE: LED, FUNDO: AZULEJO, CREME: "#ffffff", TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

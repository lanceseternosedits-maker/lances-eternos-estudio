// Objetos e ações dos itens n5…n1 do Reel '5 skills do Claude' (05/11). Recebe K com as ferramentas da cena.
export default function (K) {
const { THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, mascote, pisca, hop, eo, lin, eio, back, rnd, misT, caixaMisterio, LAR, CREME, aponta, V } = K;
// n5 MotionSites: telão com cena "de cinema" + claquete na mão
const n5 = grupo("n5");
const cineT = ctex(640, 360, (g, w, h, t = 0) => { const sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, "#1b1f4a"); sky.addColorStop(.55, "#e0663a"); sky.addColorStop(1, "#ffc56b"); g.fillStyle = sky; g.fillRect(0, 0, w, h);
  g.fillStyle = "#ffe7a8"; g.beginPath(); g.arc(w * .62, h * .62 - Math.sin(t * .6) * 8, 46, 0, 7); g.fill();
  g.fillStyle = "#26131a"; g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 20) g.lineTo(x, h * .72 + Math.sin(x / 70 + 1) * 26 + Math.sin(x / 23) * 6); g.lineTo(w, h); g.fill();
  const lx = ((t * 120) % (w + 300)) - 150; const lk = g.createLinearGradient(lx - 120, 0, lx + 120, 0); lk.addColorStop(0, "rgba(255,200,140,0)"); lk.addColorStop(.5, "rgba(255,200,140,.35)"); lk.addColorStop(1, "rgba(255,200,140,0)"); g.fillStyle = lk; g.fillRect(0, 0, w, h);
  g.fillStyle = "#000"; g.fillRect(0, 0, w, 40); g.fillRect(0, h - 40, w, 40); });
const telao = new THREE.Group(); telao.position.set(1.05, 0, -.6); n5.add(telao);
box(2.5, 1.5, .08, M("#0b0a0a"), telao, 0, 1.75, 0); mesh(new THREE.PlaneGeometry(2.36, 1.33), new THREE.MeshBasicMaterial({ map: cineT, toneMapped: false }), telao, 0, 1.75, .05);
for (const x of [-1.1, 1.1]) box(.07, 1.0, .07, M("#0b0a0a"), telao, x, .5, 0);
const luzTela = new THREE.PointLight(0xff9a5a, 12, 6, 1.5); luzTela.position.set(1, 1.6, .6); n5.add(luzTela);
const listra = ctex(256, 48, (g, w, h) => { g.fillStyle = "#151318"; g.fillRect(0, 0, w, h); g.fillStyle = "#f4efe6"; for (let x = -40; x < w; x += 56) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + 28, 0); g.lineTo(x + 52, 0); g.lineTo(x + 24, h); g.fill(); } });
const claq = new THREE.Group(); n5.add(claq); box(.5, .36, .05, M("#151318"), claq, 0, 0, 0);
const haste = new THREE.Group(); haste.position.set(-.25, .2, 0); claq.add(haste); mesh(new THREE.BoxGeometry(.5, .09, .05), M("#ffffff", { map: listra }), haste, .25, .045, 0);

// n4 reanimate: um "fantasma" ciano copia o mascote com atraso + tira de filme
const n4 = grupo("n4");
const FANT = mascote(new THREE.MeshStandardMaterial({ color: "#59d8ff", transparent: true, opacity: .45, emissive: "#2aa8ff", emissiveIntensity: .6, depthWrite: false }), new THREE.MeshBasicMaterial({ color: "#0b2a40", transparent: true, opacity: .6 }));
const filmeT = ctex(1024, 128, (g, w, h) => { g.fillStyle = "#0d0c0c"; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { const x = i * 128 + 10; g.fillStyle = "#2b2420"; g.fillRect(x, 22, 108, 84);
  g.fillStyle = "#D0623A"; const y = 70 - Math.abs(Math.sin(i * .8)) * 24; g.fillRect(x + 30, y - 22, 48, 34); g.fillStyle = "#141014"; g.fillRect(x + 42, y - 14, 6, 14); g.fillRect(x + 60, y - 14, 6, 14);
  g.fillStyle = "#f4ead8"; for (let k = 0; k < 4; k++) { g.fillRect(x + k * 28 + 6, 6, 14, 8); g.fillRect(x + k * 28 + 6, h - 14, 14, 8); } } });
filmeT.wrapS = THREE.RepeatWrapping; const filme = mesh(new THREE.PlaneGeometry(6.4, .8), new THREE.MeshBasicMaterial({ map: filmeT, toneMapped: false }), n4, 0, 2.75, -1.6); filmeT.repeat.set(2, 1);

// n3 pixelfx: efeitos de pixel art em placas (fogueira, portal, explosão)
const n3 = grupo("n3");
const PAL = ["#2b0f0e", "#7a1e12", "#d4411b", "#ff8a1f", "#ffd23f", "#fff6c8"];
const fogoT = ctex(32, 32, (g, w, h, t = 0) => { g.clearRect(0, 0, w, h); const k = Math.floor(t * 12);
  for (let x = 6; x < 26; x++) { const hh = 10 + Math.abs(Math.sin(x * 1.7 + k * .9)) * 12 + Math.sin(x * .9 + k * 1.3) * 3 - Math.abs(x - 16) * .6;
    for (let y = 0; y < hh; y++) { const c = Math.min(5, Math.floor((1 - y / hh) * 5 + ((x * 7 + y * 3 + k) % 3) * .4)); g.fillStyle = PAL[c]; g.fillRect(x, h - 6 - y, 1, 1); } }
  g.fillStyle = "#5a3418"; g.fillRect(6, h - 6, 20, 3); g.fillStyle = "#3d2210"; g.fillRect(9, h - 4, 14, 2); }, true);
const portalT = ctex(32, 32, (g, w, h, t = 0) => { g.clearRect(0, 0, w, h); const k = t * 3;
  for (let a = 0; a < 64; a++) { const an = a / 64 * Math.PI * 2 + k, r = 11 + Math.sin(a * .7 + k * 2) * 1.5; g.fillStyle = a % 3 ? "#9b5bff" : "#5ee7ff"; g.fillRect(Math.round(16 + Math.cos(an) * r), Math.round(16 + Math.sin(an) * r * 1.2), 2, 2); }
  for (let a = 0; a < 20; a++) { const an = a / 20 * Math.PI * 2 - k * 1.5, r = 5 + (a % 3); g.fillStyle = "#d9c2ff"; g.fillRect(Math.round(16 + Math.cos(an) * r), Math.round(16 + Math.sin(an) * r * 1.2), 1, 1); } }, true);
const boomT = ctex(32, 32, (g, w, h, t = 0) => { g.clearRect(0, 0, w, h); const p = (t % 1.1) / 1.1, r = 2 + p * 13;
  for (let a = 0; a < 40; a++) { const an = a / 40 * Math.PI * 2, rr = r * (.8 + ((a * 7) % 5) * .06); g.fillStyle = PAL[Math.max(1, 5 - Math.floor(p * 5) - (a % 2))]; g.fillRect(Math.round(16 + Math.cos(an) * rr), Math.round(16 + Math.sin(an) * rr), 2, 2); }
  if (p < .35) { g.fillStyle = "#fff6c8"; g.fillRect(13, 13, 6, 6); } }, true);
const sprites = [[fogoT, .85, .7, .5, 1.5], [portalT, 1.6, 1.75, -.5, 1.5], [boomT, -1.75, 1.9, -.4, 1.2]].map(([t, x, y, z, s]) => {
  const m = mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: t, transparent: true, toneMapped: false, side: THREE.DoubleSide }), n3, x, y, z); m.castShadow = false; return m; });
const luzFogo = new THREE.PointLight(0xff8a2a, 10, 4, 1.5); luzFogo.position.set(.85, .8, .9); n3.add(luzFogo);

// n2 unslop: painel de site; um risco varre de "antes" (cara de IA) para "depois" (desenhado)
const n2 = grupo("n2");
function siteAntes(g, w, h) { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, "#5b3df5"); gr.addColorStop(1, "#d846ef"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.shadowColor = "#ff8bff"; g.shadowBlur = 30; g.fillStyle = "#fff"; g.font = "700 44px SG"; g.textAlign = "center"; g.fillText("Bem-vindo ao Futuro", w / 2, 110); g.shadowBlur = 0;
  g.font = "500 22px IN"; g.fillStyle = "rgba(255,255,255,.8)"; g.fillText("A plataforma revolucionária que transforma tudo", w / 2, 152);
  g.fillStyle = "rgba(255,255,255,.25)"; g.beginPath(); g.roundRect(w / 2 - 110, 180, 220, 52, 26); g.fill(); g.fillStyle = "#fff"; g.font = "700 22px SG"; g.fillText("COMECE AGORA!!!", w / 2, 214);
  for (let i = 0; i < 3; i++) { const x = 40 + i * 200; g.fillStyle = "rgba(255,255,255,.16)"; g.beginPath(); g.roundRect(x, 270, 170, 150, 22); g.fill();
    const c = g.createRadialGradient(x + 85, 320, 0, x + 85, 320, 34); c.addColorStop(0, "#fff"); c.addColorStop(1, "rgba(255,120,255,0)"); g.fillStyle = c; g.beginPath(); g.arc(x + 85, 320, 34, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.font = "700 18px SG"; g.fillText("Recurso " + (i + 1), x + 85, 392); }
  for (let i = 0; i < 9; i++) { g.fillStyle = "rgba(255,255,255,.7)"; const x = (i * 97) % w, y = 30 + (i * 53) % 230; g.fillRect(x, y, 4, 4); } }
function siteDepois(g, w, h) { g.fillStyle = "#f6efe3"; g.fillRect(0, 0, w, h); g.fillStyle = "#1b1712"; g.fillRect(0, 0, w, 46); g.fillStyle = "#f6efe3"; g.font = "700 20px SG"; g.textAlign = "left"; g.fillText("Café da Vila", 30, 30);
  g.fillStyle = "#1b1712"; g.font = "700 50px SG"; g.fillText("Torra própria,", 30, 120); g.fillText("na sua porta.", 30, 176);
  g.font = "500 20px IN"; g.fillStyle = "#6a5d50"; g.fillText("Grãos do Sul de Minas, moídos na hora.", 30, 214);
  g.fillStyle = "#E8743B"; g.beginPath(); g.roundRect(30, 240, 170, 50, 10); g.fill(); g.fillStyle = "#fff"; g.font = "700 20px SG"; g.fillText("Pedir agora", 58, 272);
  g.fillStyle = "#7a4a2e"; g.beginPath(); g.roundRect(380, 70, 230, 230, 18); g.fill(); g.fillStyle = "#f6efe3"; g.beginPath(); g.ellipse(495, 200, 70, 22, 0, 0, 7); g.fill();
  g.fillStyle = "#e9dcc6"; g.fillRect(452, 140, 86, 62); g.fillStyle = "#4a2c1a"; g.beginPath(); g.ellipse(495, 142, 43, 10, 0, 0, 7); g.fill();
  for (let i = 0; i < 3; i++) { const x = 30 + i * 200; g.fillStyle = "#1b1712"; g.font = "700 22px SG"; g.fillText(["Torra média", "Entrega 24h", "Assinatura"][i], x, 350); g.font = "500 17px IN"; g.fillStyle = "#6a5d50"; g.fillText(["notas de caramelo", "na sua cidade", "todo mês, sem taxa"][i], x, 378); g.fillStyle = "#d9cbb4"; g.fillRect(x, 396, 160, 2); } }
const siteT = ctex(640, 440, (g, w, h, wipe = 0) => { siteAntes(g, w, h); if (wipe > 0) { const x = wipe * w; g.save(); g.beginPath(); g.rect(0, 0, x, h); g.clip(); siteDepois(g, w, h); g.restore();
  if (wipe < 1) { g.fillStyle = "#fff"; g.shadowColor = LAR; g.shadowBlur = 24; g.fillRect(x - 3, 0, 6, h); g.shadowBlur = 0; } } });
const painel = new THREE.Group(); painel.position.set(1.15, 0, -.5); n2.add(painel);
box(2.5, 1.78, .08, M("#0b0a0a"), painel, 0, 1.6, 0); mesh(new THREE.PlaneGeometry(2.4, 1.65), new THREE.MeshBasicMaterial({ map: siteT, toneMapped: false }), painel, 0, 1.6, .05);
const chip = ctex(256, 64, (g, w, h, depois = 0) => { g.clearRect(0, 0, w, h); g.fillStyle = depois ? LAR : "#2a2420"; g.beginPath(); g.roundRect(0, 0, w, h, 14); g.fill(); g.fillStyle = "#fff"; g.font = "700 36px SG"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(depois ? "DEPOIS" : "ANTES", w / 2, h / 2 + 2); });
mesh(new THREE.PlaneGeometry(.8, .2), new THREE.MeshBasicMaterial({ map: chip, transparent: true, toneMapped: false }), painel, -.75, 2.65, .06);

// n1 teardown: a caixa "?" explode e revela uma máquina (abelha-robô genérica) que se desmonta em peças
const n1 = grupo("n1"); const mis1 = caixaMisterio(n1);
const maq = new THREE.Group(); maq.position.set(1.1, 0, 0); n1.add(maq); const pecas = [];
function pc(m, dir) { m.userData.b = m.position.clone(); m.userData.d = new THREE.Vector3(...dir); pecas.push(m); return m; }
const AM = M("#ffc93a", { metalness: .4, roughness: .35 }), PT = M("#1d1a1a", { metalness: .5, roughness: .4 }), VID = new THREE.MeshStandardMaterial({ color: "#9fe8ff", transparent: true, opacity: .7, emissive: "#5ad0ff", emissiveIntensity: 1.2, side: THREE.DoubleSide });
pc(mesh(new THREE.SphereGeometry(.28, 24, 18), AM, maq, 0, 1.5, .55), [0, .15, 1]);
for (const s of [-1, 1]) pc(mesh(new THREE.SphereGeometry(.09, 12, 10), E("#5ad0ff", 1.5), maq, s * .14, 1.58, .78), [s * .6, .3, 1]);
const tor = pc(mesh(new THREE.CylinderGeometry(.3, .3, .5, 24), PT, maq, 0, 1.5, .1), [0, 0, 0]); tor.rotation.x = Math.PI / 2;
[[-.35, AM, .32], [-.75, PT, .3], [-1.1, AM, .22]].forEach(([z, m, r], i) => { const c = pc(mesh(new THREE.CylinderGeometry(r, r * .92, .36, 24), m, maq, 0, 1.45, z), [0, -.1, -1 - i * .4]); c.rotation.x = Math.PI / 2; });
const eng = []; for (const z of [-.05, .25]) { const e = pc(mesh(new THREE.TorusGeometry(.17, .045, 8, 18), E(LAR, .6), maq, 0, 1.5, z), [0, 1, z * 2]); eng.push(e); }
for (const s of [-1, 1]) { const w = pc(mesh(new THREE.PlaneGeometry(.9, .42), VID, maq, s * .55, 1.85, 0), [s * 1.2, .8, 0]); w.rotation.x = -Math.PI / 2 + .25; w.castShadow = false; }
for (let i = 0; i < 6; i++) { const s = i < 3 ? -1 : 1, z = .2 - (i % 3) * .3; const l = pc(mesh(new THREE.CylinderGeometry(.03, .03, .6, 8), PT, maq, s * .3, 1.15, z), [s * 1.1, -.9, z]); l.rotation.z = s * .5; }
const fagulhas = []; for (let i = 0; i < 40; i++) { const f = mesh(new THREE.BoxGeometry(.06, .06, .06), E(i % 2 ? LAR : "#ffd23f", 2), n1, 0, 0, 0); f.castShadow = false; fagulhas.push({ f, v: new THREE.Vector3(rnd() - .5, rnd() * .8 + .2, rnd() - .5).normalize().multiplyScalar(2 + rnd() * 3) }); }
n4.add(FANT.g);
const SHOTS = {
  n5: [[V(.2, 2.1, 6.4), V(.2, 1.3, 0)], [V(.3, 1.9, 5.1), V(.05, 1.5, -.2)]],
  n4: [[V(0, 2.0, 6.4), V(.1, 1.3, 0)], [V(-.6, 1.8, 4.6), V(.3, 1.2, 0)]],
  n3: [[V(.1, 2.0, 6.4), V(0, 1.3, 0)], [V(.5, 1.7, 4.9), V(.25, 1.25, .1)]],
  n2: [[V(.2, 2.0, 6.4), V(.3, 1.4, 0)], [V(.4, 1.8, 5.0), V(.15, 1.5, -.3)]],
  n1: [[V(.2, 2.1, 6.4), V(.4, 1.3, 0)], [V(.6, 2.1, 5.0), V(.2, 1.45, 0)]],
};
const ACT = {
  n5(lt, d) { cineT.draw(lt);
    pose(MAS, { x: -1.05, y: hop(lt, .7, .08), braco: [.2, .9 + Math.sin(lt * 3) * .1], ry: .5, piscar: pisca(lt) });
    const w = new THREE.Vector3(); MAS.bracos[1].getWorldPosition(w); claq.position.set(w.x + .25, w.y + .25, w.z + .25); claq.rotation.set(0, -.3, .2);
    const bate = [.6, 1.8].map(b => lt < b - .2 ? .5 : lt < b ? .5 * (1 - (lt - b + .2) / .2) : Math.min(.5, (lt - b) * 2)); haste.rotation.z = Math.min(...bate); },
  n4(lt, d) { const mv = t => ({ y: hop(t, .45, .35), braco: [.4 + Math.sin(t * 6) * .6, 1.2 + Math.sin(t * 6 + 1) * .7], ry: Math.sin(t * 2) * .4, sq: Math.max(0, Math.cos(t * Math.PI / .45)) * .08, piscar: pisca(t) });
    pose(MAS, { x: -1.15, ...mv(lt) }); pose(FANT, { x: 1.15, ...mv(Math.max(0, lt - .25)) });
    FANT.g.visible = true; filmeT.offset.x = lt * .25; },
  n3(lt, d) { fogoT.draw(lt); portalT.draw(lt); boomT.draw(lt); luzFogo.intensity = 8 + Math.sin(lt * 23) * 3;
    sprites.forEach((s, i) => s.lookAt(cam.position));
    pose(MAS, { x: -.35, y: hop(lt, .5, .18), braco: [1.3 + Math.sin(lt * 8) * .3, 1.3 + Math.sin(lt * 8 + 1) * .3], piscar: pisca(lt), sq: Math.max(0, Math.cos(lt * Math.PI / .5)) * .06 }); },
  n2(lt, d) { const wipe = eio(lin(lt, d * .38, d * .72)); siteT.draw(wipe); chip.draw(wipe > .5 ? 1 : 0);
    pose(MAS, { x: -1.05, y: wipe > .99 ? hop(lt, .4, .2) : 0, piscar: pisca(lt), ...aponta(lt) }); },
  n1(lt, d) { const k = Math.floor(lt * 14); misT.draw(k);
    const boom = lin(lt, .45, .6); mis1.visible = lt < .6; mis1.position.set(1.1, 1.4, 0); mis1.scale.setScalar(lt < .45 ? 1 + Math.sin(lt * 40) * .04 : 1 + boom * .6); mis1.rotation.y = lt;
    maq.visible = lt >= .5; maq.scale.setScalar(back(lin(lt, .5, 1.0)) * 1.1); maq.rotation.y = -.6 + lt * .35;
    const ex = .55 * eio(lin(lt, 1.6, 2.6)) + (lt > 2.6 ? .08 * Math.sin((lt - 2.6) * 2.5) : 0);
    pecas.forEach(p => p.position.copy(p.userData.b).addScaledVector(p.userData.d, ex)); eng.forEach((e, i) => e.rotation.z = lt * (i ? -4 : 4));
    fagulhas.forEach(F => { const tt = lt - .5; F.f.visible = tt > 0 && tt < 1.4; F.f.position.set(1.1 + F.v.x * tt, 1.4 + F.v.y * tt - 3 * tt * tt, F.v.z * tt); F.f.rotation.set(tt * 9, tt * 7, 0); });
    pose(MAS, { x: -1.15, y: lt < .6 ? 0 : hop(lt, .35, .12) * (lt < 1.6 ? 1 : .3), sq: lt > .45 && lt < .6 ? .15 : 0, piscar: lt > .45 && lt < 1.2 ? .4 : pisca(lt), ...aponta(lt) });
    return lt > .45 && lt < .8 ? (.8 - lt) * .15 : 0; },
};
return { SHOTS, ACT };
}

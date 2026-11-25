// Reel "3 estúdios de voz grátis com IA" (08/11 15:00). Identidade: cabine de rádio antiga, vermelho NO AR + madeira +
// verde-válvula; microfone de fita, letreiro NO AR, painel de botões, discos. Elementos: etiqueta em papel rasgado com fita,
// nome em máquina de escrever, velocímetro, legenda de uma palavra gigante com pop, transição virada de página, câmera em órbita,
// fechamento em post-its na parede, Space Grotesk. Mascote de fone gigante e gravata-borboleta, ação principal: pintar.
// Aviso no fim: só clonar a voz de quem deixou. Sem logos de terceiros.
export default function (K) {
const { rim, key, THREE, S, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const NOAR = "#e5322b", MAD = "#8a5a34", MADE = "#3a2416", VALV = "#7fe08a", CREME = "#f3e6cc", TINTA = "#1a120c", OURO = "#e8b931";

const cl0 = x => Math.max(0, Math.min(1, x));
// ---------- cenário: cabine de rádio ----------
const cab = new THREE.Group(); S.add(cab);
const tabT = ctex(512, 512, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#6e4527" : "#7d5030"; g.fillRect(0, i * 64, w, 64); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(0, i * 64, w, 3);
  for (let k = 0; k < 6; k++) { g.fillStyle = "rgba(40,20,8,.18)"; g.fillRect((k * 97 + i * 53) % w, i * 64 + 10 + (k * 7) % 40, 60, 2); } } });
tabT.wrapS = tabT.wrapT = THREE.RepeatWrapping; tabT.repeat.set(3, 2);
const piso = mesh(new THREE.PlaneGeometry(14, 10), new THREE.MeshStandardMaterial({ map: tabT, roughness: .7 }), cab, 0, 0, 0); piso.rotation.x = -Math.PI / 2;
// mesa de locução com painel
const mesaG = new THREE.Group(); mesaG.position.set(.2, 0, -1.7); cab.add(mesaG);
box(5.2, .9, 1.2, M(MAD, { roughness: .6 }), mesaG, 0, .45, 0); box(5.3, .08, 1.3, M("#a06a3e"), mesaG, 0, .92, 0);
const painel = new THREE.Group(); painel.position.set(0, 1.2, -.3); painel.rotation.x = -.5; mesaG.add(painel); box(4.2, .6, .1, M("#2b2420", { metalness: .4, roughness: .4 }), painel, 0, 0, 0);
const botoes = []; for (let i = 0; i < 10; i++) { const b = mesh(new THREE.CylinderGeometry(.07, .08, .08, 16), M(i % 3 ? "#d8d2c4" : NOAR, { metalness: .3 }), painel, -1.8 + i * .4, -.1, .08); b.rotation.x = Math.PI / 2; botoes.push(b); }
const vus = [-1.2, 1.2].map(x => { const t = ctex(200, 110, (g, w, h, v = .3) => { g.fillStyle = "#e9f7d9"; g.fillRect(0, 0, w, h); g.strokeStyle = TINTA; g.lineWidth = 3; g.beginPath(); g.arc(w / 2, h + 20, 100, Math.PI * 1.15, Math.PI * 1.85); g.stroke();
  g.strokeStyle = NOAR; g.beginPath(); g.arc(w / 2, h + 20, 100, Math.PI * 1.7, Math.PI * 1.85); g.stroke(); const a = Math.PI * (1.2 + v * .6); g.strokeStyle = TINTA; g.lineWidth = 4; g.beginPath(); g.moveTo(w / 2, h + 20); g.lineTo(w / 2 + Math.cos(a) * 110, h + 20 + Math.sin(a) * 110); g.stroke(); });
  const m = mesh(new THREE.PlaneGeometry(.6, .33), new THREE.MeshStandardMaterial({ map: t, emissive: "#9fffa8", emissiveMap: t, emissiveIntensity: .6 }), painel, x, .12, .06); return t; });
const valvulas = []; for (let i = 0; i < 4; i++) { const v = mesh(new THREE.CylinderGeometry(.09, .09, .34, 14), new THREE.MeshStandardMaterial({ color: VALV, emissive: VALV, emissiveIntensity: 1.6, transparent: true, opacity: .85 }), mesaG, -2.2 + i * .25 + (i > 1 ? 3.9 : 0), 1.13, .2); valvulas.push(v); }
// letreiro NO AR (texto em fonte clara)
const noarT = ctex(512, 192, (g, w, h, on = 1) => { g.fillStyle = on ? NOAR : "#4a1512"; g.beginPath(); g.roundRect(6, 6, w - 12, h - 12, 26); g.fill(); g.strokeStyle = "#f3e6cc"; g.lineWidth = 8; g.stroke();
  g.fillStyle = on ? "#fff4ea" : "#7a3a35"; g.font = "700 120px SG"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("NO AR", w / 2, h / 2 + 6); });
const noar = mesh(new THREE.BoxGeometry(1.6, .6, .12), [M(MADE), M(MADE), M(MADE), M(MADE), new THREE.MeshStandardMaterial({ map: noarT, emissive: "#ffffff", emissiveMap: noarT, emissiveIntensity: .9 }), M(MADE)], cab, -1.9, 2.2, -2.2);
const luzNoar = new THREE.PointLight(0xff3b30, 6, 5); luzNoar.position.set(-1.9, 2.0, -1.8); cab.add(luzNoar);
// discos encostados
const discoT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#111"; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill(); g.strokeStyle = "rgba(255,255,255,.08)"; for (let r = 40; r < 124; r += 6) { g.beginPath(); g.arc(128, 128, r, 0, 7); g.stroke(); } g.fillStyle = NOAR; g.beginPath(); g.arc(128, 128, 36, 0, 7); g.fill(); g.fillStyle = "#000"; g.beginPath(); g.arc(128, 128, 5, 0, 7); g.fill(); });
const discoMat = new THREE.MeshStandardMaterial({ map: discoT, transparent: true, roughness: .3, side: THREE.DoubleSide });
[[-3.2, -1.0, .5], [-3.0, -.8, .35], [3.4, -1.0, -.4]].forEach(([x, z, r]) => { const d = mesh(new THREE.CircleGeometry(.6, 40), discoMat, cab, x, .6, z); d.rotation.set(-.15, r + .6 * Math.sign(-x), 0); });
// microfone de fita no pedestal
function microfone(par, x, z, esc = 1) { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(esc); par.add(g); const cromo = M("#cfd3da", { metalness: .9, roughness: .2 });
  mesh(new THREE.CylinderGeometry(.35, .4, .06, 24), cromo, g, 0, .03, 0); mesh(new THREE.CylinderGeometry(.03, .03, 1.5, 10), cromo, g, 0, .78, 0);
  const cap = mesh(rgeoMic(), cromo, g, 0, 1.75, 0); const grelhaT = ctex(64, 128, (gg, w, h) => { gg.fillStyle = "#555"; gg.fillRect(0, 0, w, h); gg.fillStyle = "#222"; for (let y = 4; y < h; y += 8) gg.fillRect(4, y, w - 8, 4); });
  mesh(new THREE.PlaneGeometry(.3, .55), new THREE.MeshStandardMaterial({ map: grelhaT, metalness: .5 }), g, 0, 1.75, .13); return g; }
function rgeoMic() { return new THREE.CapsuleGeometry(.2, .45, 6, 16); }
key.color.set(0xffe3c0); key.intensity = 85; rim.color.set(0xff3b30); rim.intensity = 2.2;

// ---------- mascote: fone gigante, gravata-borboleta, pincel ----------
const fone = new THREE.Group(); MAS.corpo.add(fone); mesh(new THREE.TorusGeometry(.86, .07, 8, 30, Math.PI), M("#2a1c14"), fone, 0, 1.12, 0);
for (const s of [-1, 1]) { mesh(new THREE.CylinderGeometry(.3, .3, .22, 24), M(MAD), fone, s * .88, 1.0, 0).rotation.z = Math.PI / 2; mesh(new THREE.CylinderGeometry(.22, .22, .24, 24), M(NOAR), fone, s * .9, 1.0, 0).rotation.z = Math.PI / 2; }
const grav = new THREE.Group(); grav.position.set(0, .56, .52); MAS.corpo.add(grav); for (const s of [-1, 1]) { const c = mesh(new THREE.ConeGeometry(.12, .2, 4), M(NOAR), grav, s * .1, 0, 0); c.rotation.z = s * Math.PI / 2; } mesh(new THREE.SphereGeometry(.05, 10, 8), M("#a01d18"), grav, 0, 0, .02);
const pincel = new THREE.Group(); pincel.position.set(.34, -.05, .2); MAS.bracos[1].add(pincel); const ponta = new THREE.Group();
mesh(new THREE.CylinderGeometry(.03, .035, .55, 10), M(MAD), pincel, 0, .2, 0); mesh(new THREE.CylinderGeometry(.045, .04, .08, 10), M("#cfd3da", { metalness: .9 }), pincel, 0, .5, 0); pincel.add(ponta); ponta.position.set(0, .6, 0);
const pontaMat = M(VALV, { emissive: VALV, emissiveIntensity: .6 }); mesh(new THREE.ConeGeometry(.05, .16, 10), pontaMat, ponta, 0, 0, 0).rotation.x = Math.PI;
pincel.rotation.z = -.4;
// pintar: braço faz pinceladas em 8; o rastro pintado fica no ar
function pinta(lt, x, z = .35, ry = .3, ritmo = 2.2) { const a = lt * ritmo * Math.PI;
  pose(MAS, { x, z, ry, y: hop(lt, .8, .03), braco: [.35, 1.1 + Math.sin(a) * .45], piscar: pisca(lt) }); pincel.rotation.x = Math.sin(a * 2) * .4; }
const rastro = []; for (let i = 0; i < 26; i++) { const r = mesh(new THREE.SphereGeometry(.06, 8, 6), new THREE.MeshStandardMaterial({ color: VALV, emissive: VALV, emissiveIntensity: 1.2, transparent: true, opacity: .9 }), S, 0, 0, 0); r.castShadow = false; r.visible = false; rastro.push(r); }
function pinta3D(lt, cx, cy, cz, cor, w = 1.0, h = .3) { rastro.forEach((r, i) => { const k = i / rastro.length, p = lin(lt, .2 + k * .9, .3 + k * .9); r.visible = p > 0; r.material.color.set(cor); r.material.emissive.set(cor);
  r.position.set(cx - w / 2 + k * w, cy + Math.sin(k * Math.PI * 4) * h, cz); r.scale.setScalar(.6 + .8 * Math.abs(Math.sin(k * Math.PI * 4))); }); }
const semRastro = () => rastro.forEach(r => r.visible = false);

// ---------- gancho: microfone com etiqueta de preço; o mascote pinta por cima e vira GRÁTIS ----------
const gG = grupo("gancho"); microfone(gG, 1.1, -.2, 1.1);
const precoT = ctex(256, 160, (g, w, h, p = 0) => { g.clearRect(0, 0, w, h); g.fillStyle = CREME; g.beginPath(); g.moveTo(40, 10); g.lineTo(w - 8, 10); g.lineTo(w - 8, h - 10); g.lineTo(40, h - 10); g.lineTo(6, h / 2); g.fill();
  g.fillStyle = "#8a7a60"; g.beginPath(); g.arc(34, h / 2, 9, 0, 7); g.fill(); g.textAlign = "center"; g.textBaseline = "middle"; g.font = "700 86px SG"; g.fillStyle = NOAR; g.globalAlpha = 1 - p; g.fillText("$$$", 150, h / 2 + 6);
  g.globalAlpha = p; g.fillStyle = "#1f8a3a"; g.font = "700 58px SG"; g.fillText("GRÁTIS", 150, h / 2 + 4); g.globalAlpha = 1; });
const preco = mesh(new THREE.PlaneGeometry(.95, .6), new THREE.MeshStandardMaterial({ map: precoT, transparent: true, side: THREE.DoubleSide, roughness: .7 }), gG, 1.9, 1.6, .35); preco.scale.setScalar(1.7); preco.castShadow = false;
const fio = box(.01, .6, .01, M("#8a7a60"), gG, 1.45, 1.85, .1); fio.rotation.z = .9;

// ---------- n3 Speech Studio: monitor antigo mostra a onda virando texto; sinal de internet cortado ----------
const n3 = grupo("n3"); const mon = new THREE.Group(); mon.position.set(1.2, .0, -.5); mon.rotation.y = -.3; n3.add(mon);
box(1.9, 1.4, 1.0, M("#d6ccb5", { roughness: .6 }), mon, 0, 1.15, 0); box(.8, .45, .6, M("#cfc4aa"), mon, 0, .22, 0);
const telaT = ctex(320, 220, (g, w, h, p = 0) => { g.fillStyle = "#0e1a10"; g.fillRect(0, 0, w, h); g.strokeStyle = VALV; g.lineWidth = 3; g.beginPath(); for (let x = 0; x < w; x += 3) { const y = 60 + Math.sin(x * .09 + p * 12) * 28 * Math.sin(x * .02 + 1); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  g.fillStyle = VALV; const linhas = ["Olá, tudo bem?", "Hoje eu vou", "te mostrar..."]; g.font = "700 26px SG"; linhas.forEach((l, i) => { const n = Math.floor(cl0(p * 3 - i) * l.length); g.fillText(l.slice(0, n), 20, 140 + i * 30); }); });
mesh(new THREE.PlaneGeometry(1.5, 1.04), new THREE.MeshBasicMaterial({ map: telaT, toneMapped: false }), mon, 0, 1.18, .51);
const wifiT = ctex(200, 200, g => { g.strokeStyle = CREME; g.lineWidth = 16; g.lineCap = "round"; for (let r = 30; r <= 90; r += 30) { g.beginPath(); g.arc(100, 150, r, Math.PI * 1.25, Math.PI * 1.75); g.stroke(); } g.fillStyle = CREME; g.beginPath(); g.arc(100, 150, 10, 0, 7); g.fill();
  g.strokeStyle = NOAR; g.lineWidth = 18; g.beginPath(); g.moveTo(30, 30); g.lineTo(170, 170); g.stroke(); });
const wifi = mesh(new THREE.PlaneGeometry(.7, .7), new THREE.MeshBasicMaterial({ map: wifiT, transparent: true, toneMapped: false }), n3, 2.3, 2.3, -.3); wifi.castShadow = false;

// ---------- n2 AudioSmith: livro se abre e solta ondas de som ----------
const n2 = grupo("n2"); const livro = new THREE.Group(); livro.position.set(1.15, 1.1, -.1); livro.rotation.set(.65, -.3, 0); livro.scale.setScalar(1.4); n2.add(livro);
const capaM = M("#7a2a24", { roughness: .6 }), pagM = M("#f5eedc");
const ladoE = new THREE.Group(), ladoD = new THREE.Group(); livro.add(ladoE, ladoD); box(.9, .06, 1.2, capaM, ladoE, -.45, 0, 0); box(.86, .1, 1.14, pagM, ladoE, -.44, .07, 0); box(.9, .06, 1.2, capaM, ladoD, .45, 0, 0); box(.86, .1, 1.14, pagM, ladoD, .44, .07, 0);
const folhas = []; for (let i = 0; i < 5; i++) { const f = new THREE.Group(); livro.add(f); const m = mesh(new THREE.PlaneGeometry(.84, 1.1), M("#fbf6ea", { side: THREE.DoubleSide }), f, .42, 0, 0); m.rotation.x = -Math.PI / 2; m.castShadow = false; f.position.y = .13; folhas.push(f); }
const ondas = []; for (let i = 0; i < 6; i++) { const o = mesh(new THREE.TorusGeometry(.4, .025, 8, 40), new THREE.MeshStandardMaterial({ color: OURO, emissive: OURO, emissiveIntensity: 1.5, transparent: true }), n2, 1.15, 1.2, -.1); o.castShadow = false; ondas.push(o); }
const claq = new THREE.Group(); claq.position.set(2.4, .05, .5); claq.rotation.y = -.6; n2.add(claq); box(.6, .4, .05, M("#222"), claq, 0, .2, 0); const haste = box(.62, .1, .05, M("#eee"), claq, 0, .45, 0);

// ---------- n1 Ming: ondas saem do microfone vermelhas e viram outra voz (verde) ----------
const n1 = grupo("n1"); microfone(n1, .2, -.3, 1.0); const moldura = new THREE.Group(); moldura.position.set(1.7, 1.75, -.3); moldura.rotation.y = -Math.PI / 2 + .25; n1.add(moldura);
mesh(new THREE.TorusGeometry(.6, .05, 8, 40), M(OURO, { metalness: .8, roughness: .3 }), moldura, 0, 0, 0);
const voz1 = []; for (let i = 0; i < 9; i++) { const o = mesh(new THREE.TorusGeometry(.26, .03, 8, 32), new THREE.MeshStandardMaterial({ color: NOAR, emissive: NOAR, emissiveIntensity: 1.6, transparent: true }), n1, 0, 1.75, -.3); o.castShadow = false; o.rotation.y = Math.PI / 2; voz1.push(o); }
const cNOAR = new THREE.Color(NOAR), cVALV = new THREE.Color(VALV);

// ---------- fechamento: discos girando ----------
const cG = grupo("cta"); const giram = []; for (let i = 0; i < 7; i++) { const d = mesh(new THREE.CircleGeometry(.4, 40), discoMat, cG, 0, 0, 0); d.castShadow = false; giram.push({ d, a: i / 7 * Math.PI * 2, y: 1.0 + (i % 3) * .5 }); }

// ---------- câmera: órbita ----------
const SHOTS = {}; ["gancho", "n3", "n2", "n1", "cta"].forEach(n => SHOTS[n] = [[V(0, 2.2, 6), V(.2, 1.1, 0)], [V(0, 2.2, 6), V(.2, 1.1, 0)]]);
const alvo = { gancho: [.3, 1.35, -.2], n3: [.3, 1.25, -.3], n2: [.3, 1.1, -.2], n1: [.4, 1.4, -.2], cta: [0, 1.1, 0] };
const sentido = { gancho: -1, n3: 1, n2: -1, n1: 1, cta: -1 };
const camera = (cam, nome, lt, d) => { const [ax, ay, az] = alvo[nome] || alvo.cta, a = sentido[nome] * (-.4 + eio(lt / d) * .8), r = 6.1;
  cam.position.set(ax + Math.sin(a) * r, 2.25 + Math.sin(lt * .7) * .08, az + Math.cos(a) * r); cam.lookAt(ax, ay, az); };

const anima = (lt, nome) => { const on = nome === "gancho" && lt < .8 ? [1, 0, 1, 1, 0, 1, 1][Math.floor(lt * 9) % 7] : 1; noarT.draw(on); luzNoar.intensity = on ? 6 + Math.sin(lt * 5) : 1;
  vus.forEach((t, i) => t.draw(.3 + .35 * Math.abs(Math.sin(lt * (5 + i) + i)))); botoes.forEach((b, i) => b.rotation.y = Math.sin(lt + i) * .5); valvulas.forEach((v, i) => v.material.emissiveIntensity = 1.3 + Math.sin(lt * 7 + i) * .3); };
const ACT = {
  gancho(lt, d) { anima(lt, "gancho"); semRastro(); const corte = 3.35;
    if (lt < corte) { pose(MAS, { x: -1.0, z: .4, ry: .4, y: hop(lt, .55, .05), braco: [.3, .4 + Math.sin(lt * 3) * .1], piscar: pisca(lt) }); precoT.draw(0); preco.rotation.z = Math.sin(lt * 3) * .12; }
    else { pinta(lt - corte, -.25, .45, .45, 3); const p = eio(lin(lt, corte + .2, corte + 1.0)); precoT.draw(p); preco.rotation.z = Math.sin(lt * 3) * .12 * (1 - p); }
    return 0; },
  n3(lt, d) { anima(lt, "n3"); pinta(lt, -1.15); pinta3D(lt, -.1, 1.8, .2, VALV, 1.1, .2); telaT.draw(lin(lt, .3, 4.5)); wifi.position.y = 2.3 + Math.sin(lt * 2) * .06; wifi.scale.setScalar(Math.max(.01, back(lin(lt, 1.0, 1.5)))); wifi.lookAt(K.cam.position); },
  n2(lt, d) { anima(lt, "n2"); pinta(lt, -1.2); pinta3D(lt, -.2, 1.8, .2, OURO, 1.0, .22); const ab = eio(lin(lt, .2, 1.0));
    ladoD.rotation.z = -(1 - ab) * Math.PI * .98; folhas.forEach((f, i) => { const k = lin(lt, 1.0 + i * .5, 1.5 + i * .5); f.rotation.z = -Math.PI * .96 * eio(k); f.visible = ab > .95; });
    ondas.forEach((o, i) => { const k = ((lt * .7 + i / ondas.length) % 1); o.visible = ab > .9; o.position.set(1.15, 1.25 + k * 1.3, -.1); o.rotation.x = Math.PI / 2; o.scale.setScalar(.4 + k * 1.4); o.material.opacity = 1 - k; });
    haste.rotation.z = -Math.abs(Math.sin(lt * 3)) * .4; },
  n1(lt, d) { anima(lt, "n1"); pinta(lt, -1.3, .45, .35, 2.6); pinta3D(lt, -.6, 2.0, .3, VALV, .9, .15);
    voz1.forEach((o, i) => { const k = ((lt * .45 + i / voz1.length) % 1), x = .35 + k * 3.0, passou = cl0((x - 1.7) / .3); o.position.set(x, 1.75 + (passou > 0 ? Math.sin(lt * 6 + i) * .12 * passou : 0), -.3 + (x - .35) * -.12);
      o.material.color.copy(cNOAR).lerp(cVALV, passou); o.material.emissive.copy(o.material.color); o.scale.set(1, 1 + passou * .5, 1 + passou * .5); o.material.opacity = k < .1 ? k * 10 : k > .9 ? (1 - k) * 10 : 1; }); },
  cta(lt, d) { anima(lt, "cta"); semRastro(); pinta(lt, 0, .3, 0, 2.4); giram.forEach(G => { const a = G.a + lt * .6; G.d.position.set(Math.cos(a) * 2.2, G.y + Math.sin(lt * 2 + G.a) * .15, Math.sin(a) * 1.2 - .3); G.d.rotation.set(-.3, a, lt * 3); }); },
};

// ---------- elementos de tela (2D) ----------
const ui = C => { const { X, ITENS, SEGR, CHAVE, eo, lin, eio, back } = C; let SEG3 = null; const MAXV = 600;
  const cabe = (t, f, mx, w = 700) => { while (f > 20) { X.font = `${w} ${f}px SG`; if (X.measureText(t).width <= mx) break; f -= 2; } return f; };
  const rasgado = (x, y, w, h, cor, sd) => { let s = sd; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647); X.fillStyle = cor; X.beginPath(); X.moveTo(x, y);
    for (let i = 0; i <= 24; i++) X.lineTo(x + w * i / 24, y + (r() - .5) * 14); for (let i = 0; i <= 10; i++) X.lineTo(x + w + (r() - .5) * 12, y + h * i / 10); for (let i = 24; i >= 0; i--) X.lineTo(x + w * i / 24, y + h + (r() - .5) * 14); for (let i = 10; i >= 0; i--) X.lineTo(x + (r() - .5) * 12, y + h * i / 10); X.fill(); };
  const fita = (x, y, ang) => { X.save(); X.translate(x, y); X.rotate(ang); X.fillStyle = "rgba(235,222,180,.75)"; X.fillRect(-70, -20, 140, 40); X.restore(); };
  function header(s, lt) { // tag + nome em máquina de escrever + velocímetro
    X.font = "700 56px SG"; const wt = X.measureText(s.tag).width + 40; X.fillStyle = NOAR; X.beginPath(); X.roundRect(60, 592, wt, 82, 12); X.fill(); X.fillStyle = "#fff"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText(s.tag, 80, 635);
    const nome = s.item, fs = cabe(nome, 72, 900 - wt); const n = Math.min(nome.length, Math.floor(lin(lt, .1, .1 + nome.length * .06) * nome.length)); X.font = `700 ${fs}px SG`;
    X.fillStyle = CREME; X.shadowColor = "rgba(0,0,0,.5)"; X.shadowBlur = 10; X.fillText(nome.slice(0, n), 60 + wt + 24, 636); X.shadowBlur = 0; const wx = 60 + wt + 24 + X.measureText(nome.slice(0, n)).width + 6;
    if (n < nome.length || Math.floor(lt * 3) % 2) { X.fillStyle = NOAR; X.fillRect(wx, 600, 8, 72); }
    const v = s.estrelas * eio(lin(lt, .4, 2.0)), cx = 190, cy = 850, r = 120; X.lineCap = "round";
    X.fillStyle = "rgba(26,18,12,.85)"; X.beginPath(); X.arc(cx, cy, r + 24, Math.PI, 0); X.lineTo(cx + r + 24, cy + 16); X.lineTo(cx - r - 24, cy + 16); X.fill();
    X.lineWidth = 18; X.strokeStyle = "#4a3a2c"; X.beginPath(); X.arc(cx, cy, r, Math.PI, 0); X.stroke(); X.strokeStyle = VALV; X.beginPath(); X.arc(cx, cy, r, Math.PI, Math.PI * (1 + Math.min(1, v / MAXV))); X.stroke();
    X.lineWidth = 4; X.strokeStyle = CREME; for (let i = 0; i <= 6; i++) { const a = Math.PI * (1 + i / 6); X.beginPath(); X.moveTo(cx + Math.cos(a) * (r - 30), cy + Math.sin(a) * (r - 30)); X.lineTo(cx + Math.cos(a) * (r - 14), cy + Math.sin(a) * (r - 14)); X.stroke(); }
    const an = Math.PI * (1 + Math.min(1, v / MAXV)) + Math.sin(lt * 20) * .01; X.strokeStyle = NOAR; X.lineWidth = 8; X.beginPath(); X.moveTo(cx, cy); X.lineTo(cx + Math.cos(an) * (r - 20), cy + Math.sin(an) * (r - 20)); X.stroke(); X.fillStyle = CREME; X.beginPath(); X.arc(cx, cy, 14, 0, 7); X.fill(); X.lineCap = "butt";
    X.fillStyle = VALV; X.font = "700 110px SG"; X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillText(String(Math.round(v)), 350, 852); X.fillStyle = CREME; X.font = "700 32px SG"; X.fillText("ESTRELAS NO GITHUB", 356, 892); }
  return {
    fundo(t) { X.fillStyle = MADE; X.fillRect(0, 0, 1080, 1920); // espuma acústica em losangos
      for (let y = 0; y < 1920; y += 80) for (let x = (y / 80 % 2) * 40; x < 1120; x += 80) { X.fillStyle = (x + y) % 160 ? "#2f1d12" : "#35211a"; X.beginPath(); X.moveTo(x, y - 36); X.lineTo(x + 36, y); X.lineTo(x, y + 36); X.lineTo(x - 36, y); X.fill(); }
      const g = X.createRadialGradient(540, 1000, 100, 540, 1000, 900); g.addColorStop(0, "rgba(229,50,43,.14)"); g.addColorStop(1, "rgba(0,0,0,.25)"); X.fillStyle = g; X.fillRect(0, 0, 1080, 1920); },
    etiqueta(t) { const [l1, l2, l3] = SEGR[0].etiqueta; const e = 1;
      X.save(); X.translate(0, (1 - e) * -300); X.globalAlpha = e; X.save(); X.translate(540, 395); X.rotate(-.02); rasgado(-480, -110, 960, 210, CREME, 11);
      X.textAlign = "center"; X.textBaseline = "middle"; X.fillStyle = TINTA; cabe(l1, 66, 880); X.fillText(l1, 0, -42);
      const p = l2.split(" "), num = p.slice(0, 2).join(" "), resto = " " + p.slice(2).join(" "); cabe(l2, 52, 880); const w1 = X.measureText(num).width, w2 = X.measureText(resto).width;
      X.textAlign = "left"; X.fillStyle = NOAR; X.fillText(num, -(w1 + w2) / 2, 38); X.fillStyle = TINTA; X.fillText(resto, -(w1 + w2) / 2 + w1, 38); fita(-440, -100, -.5); fita(440, -100, .5); X.restore();
      X.save(); X.translate(560, 540); X.rotate(.025); rasgado(-380, -36, 760, 72, NOAR, 5); X.fillStyle = "#fff"; X.textAlign = "center"; X.textBaseline = "middle"; cabe(l3, 46, 700); X.fillText(l3, 0, 3); X.restore(); X.restore(); },
    cabecalho(s, lt) { SEG3 = [s, lt]; },
    desenha3D(gl, nome) { X.drawImage(gl, 0, nome === "cta" ? 880 : 720);
      const fg = X.createLinearGradient(0, 1430, 0, 1560); fg.addColorStop(0, "rgba(26,16,10,0)"); fg.addColorStop(1, "#1a100a"); X.fillStyle = fg; X.fillRect(0, 1430, 1080, 490);
      const sr = SEGR.find(x => x.cena === nome); if (sr && sr.item && SEG3) header(SEG3[0], SEG3[1]); SEG3 = null; },
    legenda(seg, t) { const ws = seg.palavras; let i = ws.findIndex(w => t < w.t1); if (i < 0) i = ws.length - 1; const w = ws[i]; if (t < ws[0].t0 - .05) return;
      const txt = w.w.replace(/[.,:;…]+$/, ""), p = back(lin(t, w.t0 - .02, w.t0 + .14)), fs = cabe(txt.toUpperCase(), 124, 900);
      X.save(); X.translate(540, 1410); X.scale(.6 + .4 * p, .6 + .4 * p); X.rotate((i % 2 ? 1 : -1) * .03); X.font = `700 ${fs}px SG`; X.textAlign = "center"; X.textBaseline = "middle";
      const dest = /^(VOZ|GRÁTIS|GRAÇA|CLONA)/i.test(txt) || txt === CHAVE; X.lineJoin = "round"; X.lineWidth = 18; X.strokeStyle = TINTA; X.strokeText(txt.toUpperCase(), 0, 0); X.fillStyle = dest ? NOAR : CREME; X.fillText(txt.toUpperCase(), 0, 0); X.restore(); },
    transicao(lt, s) { if (!s.item || lt > .45) return; const p = eio(lt / .45), w = 1080 * (1 - p); // a página do item anterior vira para a esquerda
      X.fillStyle = "rgba(0,0,0,.35)"; X.fillRect(w, 0, 60 * (1 - p), 1920); X.fillStyle = CREME; X.fillRect(0, 0, w, 1920); X.strokeStyle = "rgba(26,18,12,.12)"; X.lineWidth = 2; for (let y = 120; y < 1920; y += 64) { X.beginPath(); X.moveTo(0, y); X.lineTo(w, y); X.stroke(); }
      const cw = Math.min(140, w); const g = X.createLinearGradient(w - cw, 0, w, 0); g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(.6, "rgba(255,255,255,.5)"); g.addColorStop(1, "rgba(120,90,60,.6)"); X.fillStyle = g; X.fillRect(w - cw, 0, cw, 1920); },
    fechamento(lt) { const cores = ["#ffe066", "#ff9fb2", "#a6f0b4"]; X.textBaseline = "middle";
      ITENS.forEach((s, i) => { const a = back(lin(lt, .1 + i * .15, .4 + i * .15)); if (a <= 0) return; const x = 200 + i * 340, y = 790 + (i % 2) * 40; X.save(); X.translate(x, y); X.rotate([-.06, .05, -.03][i]); X.scale(a, a);
        X.fillStyle = "rgba(0,0,0,.35)"; X.fillRect(-140, -132, 290, 290); X.fillStyle = cores[i]; X.fillRect(-150, -145, 290, 290); X.fillStyle = NOAR; X.beginPath(); X.arc(-5, -128, 14, 0, 7); X.fill();
        X.textAlign = "center"; X.fillStyle = NOAR; X.font = "700 56px SG"; X.fillText(s.tag, -5, -60); X.fillStyle = TINTA; X.font = `700 ${cabe(s.item, 46, 250)}px SG`; X.fillText(s.item, -5, 10); X.font = "700 36px SG"; X.fillStyle = "#5a4a3a"; X.fillText(s.estrelas + " ★", -5, 80); X.restore(); });
      const p = back(lin(lt, .6, 1.0)); X.save(); X.translate(540, 1100); X.rotate(-.03); X.scale(p, p); X.font = "700 88px SG"; const w1 = X.measureText("COMENTA ").width, w2 = X.measureText(CHAVE).width;
      X.fillStyle = "rgba(0,0,0,.35)"; X.fillRect(-(w1 + w2) / 2 - 30, -60, w1 + w2 + 70, 136); X.fillStyle = NOAR; X.fillRect(-(w1 + w2) / 2 - 40, -72, w1 + w2 + 80, 140); X.textAlign = "left"; X.fillStyle = "#fff"; X.fillText("COMENTA ", -(w1 + w2) / 2, 2); X.fillStyle = "#ffe066"; X.fillText(CHAVE, -(w1 + w2) / 2 + w1, 2); X.restore();
      const q = eo(lin(lt, 1.2, 1.6)); X.globalAlpha = q; X.save(); X.translate(540, 1250); rasgado(-430, -40, 860, 80, CREME, 3); X.fillStyle = TINTA; X.font = "700 40px SG"; X.textAlign = "center"; X.fillText("SÓ CLONE A VOZ DE QUEM DEIXOU", 0, 3); X.restore(); X.globalAlpha = 1; },
  }; };
const cores = { LAR: NOAR, VERDE: VALV, FUNDO: MADE, CREME, TINTA, BRILHO: "rgba(229,50,43,.08)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

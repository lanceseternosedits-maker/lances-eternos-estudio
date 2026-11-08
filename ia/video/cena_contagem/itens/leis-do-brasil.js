// Reel 🆕 novidade "Todas as leis do Brasil num lugar só" (ctresb/leis; 10/11 10:00). Motor da cena_contagem (mesmo mascote 3D).
// Identidade: cartório antigo que vira biblioteca de luz: pilhas de processos em papel pardo com carimbo, arquivo de aço que
// se abre e solta folhas voando que viram uma tela de busca, livro gigante de leis que acende; verde-bandeira + amarelo-ouro + papel.
// Elementos: etiqueta em papel rasgado com fita, nome em máquina de escrever, pote enchendo de estrelas (número da API do GitHub),
// legenda em tarja de TV, transição zoom atravessando uma tela, câmera em órbita, fechamento com post-its + carimbo APROVADO,
// Space Grotesk (Press Start 2P só no enfeite da tarja). Mascote de viseira verde de escrivão (no topo); ação: digitar.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const VERDE = "#0f8a4a", VERDE2 = "#075c31", OURO = "#f2c230", OURO2 = "#c99a0a", PAPEL = "#f4ead2", PARDO = "#c9a26b", TINTA = "#14201a", FUNDO = "#e9e1c9";
const ESTRELAS = 2659;
rim.color.set(0xffe9a8); rim.intensity = 1.2; key.color.set(0xfff3d8); key.intensity = 140; key.position.set(1, 9, 6); key.target.position.set(0, .8, 0);
S.add(new THREE.AmbientLight(0xfff6e0, .5));
const luz = new THREE.PointLight(0xffe08a, 0, 7); luz.position.set(.9, 2.0, 1.0); S.add(luz);

// ---------- cenário: parede verde-escura com rodapé, piso de taco ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#1f5a3c"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,.05)"; for (let x = 0; x < w; x += 40) g.fillRect(x, 0, 2, h); g.fillStyle = "#123826"; g.fillRect(0, h - 30, w, 30); });
mesh(new THREE.PlaneGeometry(24, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -3).castShadow = false;
const tT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 4; x++) { g.fillStyle = (x + y) % 2 ? "#a77446" : "#b8834f"; g.fillRect(x * 64, y * 32, 64, 32); g.strokeStyle = "rgba(60,30,10,.35)"; g.strokeRect(x * 64, y * 32, 64, 32); } });
tT.wrapS = tT.wrapT = THREE.RepeatWrapping; tT.repeat.set(6, 5); const chao = mesh(new THREE.PlaneGeometry(24, 14), new THREE.MeshStandardMaterial({ map: tT, roughness: .8 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// pilhas de processos (pastas pardas com fita) dos dois lados
const pastaM = M(PARDO, { roughness: .9 }), fitaM = M("#b22222");
const pilha = (x, z, n) => { const g = new THREE.Group(); g.position.set(x, 0, z); S.add(g); for (let i = 0; i < n; i++) { const p = box(.8, .1, .6, pastaM, g, Math.sin(i * 2.3) * .05, .05 + i * .105, Math.cos(i * 1.7) * .04); p.rotation.y = Math.sin(i * 3.1) * .12; if (i % 3 === 0) box(.82, .02, .08, fitaM, g, p.position.x, p.position.y + .05, p.position.z); } return g; };
pilha(-2.6, -1.2, 14); pilha(-1.9, -1.6, 10); pilha(2.6, -1.3, 12); pilha(2.0, -1.8, 16);
// arquivo de aço (gaveta abre no s2)
const ARQ = new THREE.Group(); ARQ.position.set(1.7, 0, -.9); S.add(ARQ); const aco = M("#8d98a3", { metalness: .5, roughness: .4 }); box(.9, 1.7, .8, aco, ARQ, 0, .85, 0);
const gav = [0, 1, 2].map(i => { const g = new THREE.Group(); g.position.set(0, .35 + i * .52, .41); ARQ.add(g); box(.84, .46, .06, M("#a3aeb8", { metalness: .4, roughness: .35 }), g, 0, 0, 0); box(.3, .05, .05, M("#444"), g, 0, .08, .05); box(.8, .4, .6, M("#7a848e"), g, 0, 0, -.3); return g; });
// escrivaninha + máquina de escrever
box(1.6, .08, .8, M("#6b4426"), S, -.9, .85, -.2); for (const [x, z] of [[-1.6, -.5], [-.2, -.5], [-1.6, .1], [-.2, .1]]) box(.07, .85, .07, M("#4a2e18"), S, x, .42, z);
const MQ = new THREE.Group(); MQ.position.set(-.45, .89, -.3); MQ.rotation.y = -.5; S.add(MQ); box(.6, .18, .42, M("#1c2b23", { roughness: .4 }), MQ, 0, .09, 0); box(.66, .08, .1, M("#2b3a31"), MQ, 0, .26, -.12);
const folhaMq = box(.42, .34, .01, M(PAPEL), MQ, 0, .38, -.14); const teclas = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) teclas.push(mesh(new THREE.CylinderGeometry(.025, .025, .03, 10), M("#ddd"), MQ, -.2 + c * .08 + r * .02, .2, .05 + r * .07 - .07));
// folhas voando que viram a tela de busca
const FOLHAS = Array.from({ length: 12 }, (_, i) => { const m = box(.34, .44, .01, M(PAPEL, { side: THREE.DoubleSide }), S, 0, 0, 0); m.visible = false; return m; });
const busT = ctex(512, 320, (g, w, h, k = 0, q = "") => { g.fillStyle = "#0e2a1c"; g.fillRect(0, 0, w, h); g.fillStyle = VERDE; g.fillRect(0, 0, w, 44); g.fillStyle = "#fff"; g.font = "700 26px SG"; g.fillText("Leis", 18, 31);
  g.fillStyle = "#fff"; g.beginPath(); g.roundRect(24, 64, 464, 50, 25); g.fill(); g.fillStyle = TINTA; g.font = "700 28px SG"; g.fillText("🔍 " + q, 44, 98);
  const n = Math.floor(k * 4); for (let i = 0; i < n; i++) { g.fillStyle = "rgba(255,255,255,.1)"; g.beginPath(); g.roundRect(24, 132 + i * 44, 464, 36, 8); g.fill(); g.fillStyle = OURO; g.font = "700 22px SG"; g.fillText("Lei nº " + ["8.245", "10.406", "8.078", "13.709"][i], 40, 157 + i * 44); g.fillStyle = "#cfe8da"; g.fillRect(200, 146 + i * 44, 230 - i * 30, 8); } });
const BUSCA = mesh(new THREE.BoxGeometry(2.4, 1.5, .04), [M("#0e2a1c"), M("#0e2a1c"), M("#0e2a1c"), M("#0e2a1c"), new THREE.MeshStandardMaterial({ map: busT, emissive: "#fff", emissiveMap: busT, emissiveIntensity: .8 }), M("#0e2a1c")], S, .45, 1.9, -1.2);
let busU = ""; const busca = (k, q) => { const u = Math.round(k * 20) + q; if (u !== busU) { busU = u; busT.draw(k, q); } };
// livro gigante de leis (abre e acende)
const LIV = new THREE.Group(); LIV.position.set(.7, 0, .5); S.add(LIV); const capaM = M(VERDE2, { roughness: .6 });
const pagT = ctex(256, 320, g => { g.fillStyle = "#fffbea"; g.fillRect(0, 0, 256, 320); g.fillStyle = VERDE2; g.font = "700 30px SG"; g.textAlign = "center"; g.fillText("LEI", 128, 50); g.fillStyle = "#b8b098"; for (let i = 0; i < 9; i++) g.fillRect(28, 80 + i * 24, 200 - (i * 37) % 60, 8); });
const capaE = new THREE.Group(); capaE.position.set(0, .82, 0); LIV.add(capaE); const capaD = new THREE.Group(); capaD.position.set(0, .82, 0); LIV.add(capaD);
const pE = mesh(new THREE.BoxGeometry(.7, .04, .66), [M("#eee"), M("#eee"), new THREE.MeshStandardMaterial({ map: pagT, emissive: "#fff6c8", emissiveMap: pagT, emissiveIntensity: 0 }), M("#eee"), M("#eee"), M("#eee")], capaE, -.36, 0, 0);
const pD = mesh(new THREE.BoxGeometry(.7, .04, .66), [M("#eee"), M("#eee"), new THREE.MeshStandardMaterial({ map: pagT, emissive: "#fff6c8", emissiveMap: pagT, emissiveIntensity: 0 }), M("#eee"), M("#eee"), M("#eee")], capaD, .36, 0, 0);
box(.74, .03, .7, capaM, capaE, -.36, -.035, 0); box(.74, .03, .7, capaM, capaD, .36, -.035, 0);
const SUP = box(.5, .8, .5, M("#6b4426"), LIV, 0, .4, 0);

// ---------- mascote: viseira verde de escrivão no topo; digitar ----------
const VIS = new THREE.Group(); VIS.position.set(0, 1.5, .1); MAS.corpo.add(VIS); mesh(new THREE.CylinderGeometry(.62, .62, .06, 32, 1, true), M(VERDE, { side: THREE.DoubleSide }), VIS, 0, .04, 0);
const aba = mesh(new THREE.CylinderGeometry(.7, .7, .02, 32, 1, false, -1.1, 2.2), M(VERDE, { transparent: true, opacity: .85 }), VIS, 0, .07, .12); aba.rotation.x = .25;
const MX = -1.4, MZ = -.8;
const digita = (lt, ry = .25) => { const k = Math.sin(lt * 22); pose(MAS, { x: MX, z: MZ, y: 0, ry, braco: [.9 + k * .1, .9 - k * .1], piscar: pisca(lt) }); MAS.g.rotation.z = 0; teclas.forEach((t, i) => t.position.y = .2 - (Math.floor(lt * 11 + i * 3) % 7 === 0 ? .015 : 0)); folhaMq.position.y = .38 + Math.min(lt, 6) * .006; };
const olha = (lt, ry = .6, x = MX) => { pose(MAS, { x, z: MZ, y: hop(lt, .8, .02), ry, braco: [.3, .5 + Math.sin(lt * 2) * .1], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = (lt, x = MX) => { pose(MAS, { x, z: MZ, y: hop(lt, .35, .26), ry: .3, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], sq: Math.max(0, Math.cos(lt * Math.PI / .35)) * .06, piscar: pisca(lt) }); MAS.g.rotation.z = 0; };

grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = () => { gav.forEach(g => g.position.z = .41); FOLHAS.forEach(f => f.visible = false); BUSCA.visible = false; LIV.visible = false; capaE.rotation.z = 0; capaD.rotation.z = 0; luz.intensity = 0; pE.material[2].emissiveIntensity = 0; pD.material[2].emissiveIntensity = 0; };
const abreLivro = k => { LIV.visible = true; const a = .2 + (1 - eo(k)) * (Math.PI / 2 - .2); capaE.rotation.z = -a; capaD.rotation.z = a; pE.material[2].emissiveIntensity = k * .9; pD.material[2].emissiveIntensity = k * .9; luz.intensity = k * 14; };
const P0 = V(1.7, 1.2, -.4);
const voar = k => FOLHAS.forEach((f, i) => { const a = lin(k, i * .05, .45 + i * .05); f.visible = a > 0 && a < 1; if (!f.visible) return; const fim = V(.45 + ((i % 4) - 1.5) * .55, 1.9 + (Math.floor(i / 4) - 1) * .45, -1.15);
  const e = eio(a); f.position.lerpVectors(P0, fim, e); f.position.y += Math.sin(a * Math.PI) * .9; f.position.x += Math.sin(a * 9 + i) * .15 * (1 - e); f.rotation.set(Math.sin(a * 7 + i) * (1 - e) * 1.5, (1 - e) * 3 + i, Math.cos(a * 5 + i) * (1 - e)); });

// ---------- câmera em órbita ----------
const ORB = { gancho: [-.3, .05, 6.0, 2.0, V(-.2, 1.15, -.5)], s1: [.25, -.1, 5.9, 2.0, V(-.1, 1.15, -.5)], s2: [-.2, .25, 6.6, 2.1, V(.4, 1.5, -.6)], s3: [.25, -.05, 6.6, 2.1, V(.2, 1.3, -.5)],
  s4: [-.2, .2, 6.2, 2.1, V(.2, 1.15, -.2)], cta: [.15, -.15, 7.0, 2.1, V(0, 1.2, -.4)] };
const SHOTS = {}; Object.keys(ORB).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a0, a1, r, y, l] = ORB[nome] || ORB.cta, a = a0 + (a1 - a0) * eio(lt / d); cam.position.set(l.x + Math.sin(a) * r, y, l.z + Math.cos(a) * r); cam.lookAt(l); };

const ACT = {
  gancho(lt, d) { reset(); digita(lt); },
  s1(lt, d) { reset(); digita(lt + 3, .2); },
  s2(lt, d) { reset(); const g = eo(lin(lt, .1, .7)); gav[1].position.z = .41 + g * .5; voar(lin(lt, .5, 3.4)); const k = lin(lt, 2.6, 3.2); BUSCA.visible = k > 0; BUSCA.scale.setScalar(Math.max(.01, back(k)));
    busca(lin(lt, 3.6, d - .4), "aluguel".slice(0, Math.floor(lin(lt, 3.0, 3.6) * 7))); olha(lt, .7); },
  s3(lt, d) { reset(); BUSCA.visible = true; busca(1, "aluguel"); olha(lt, .5); },
  s4(lt, d) { reset(); BUSCA.visible = false; abreLivro(lin(lt, .2, 1.4)); const x = MX - .4; if (lt < 2) olha(lt, .9, x); else feliz(lt, x); },
  cta(lt, d) { reset(); abreLivro(1); feliz(lt, MX - .4); },
};

// ---------- elementos de tela (2D): entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 22) { X.font = `700 ${f}px SG`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const rasgado = (x, y, w, h, s) => { X.beginPath(); X.moveTo(x, y); for (let i = 0; i <= 40; i++) X.lineTo(x + w * i / 40, y + ((i * 7 + s) % 5) * 2.4 - 4); for (let i = 0; i <= 40; i++) X.lineTo(x + w - w * i / 40, y + h + ((i * 11 + s) % 6) * 2.6 - 6); X.closePath(); };
  const estrela = (x, y, r, cor) => { X.fillStyle = cor; X.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; X.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } X.closePath(); X.fill(); };
  const pote = (k, x, y) => { // pote de vidro enchendo de estrelas + número
    const w = 170, h = 200; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,253,244,.92)"; X.beginPath(); X.roundRect(-140, -h / 2 - 44, 280, h + 160, 22); X.fill(); X.fillStyle = "rgba(255,255,255,.35)"; X.strokeStyle = "#fff"; X.lineWidth = 6; X.beginPath(); X.roundRect(-w / 2, -h / 2, w, h, 26); X.fill(); X.stroke();
    X.fillStyle = OURO2; X.fillRect(-w / 2 + 14, -h / 2 - 24, w - 28, 26); X.save(); X.beginPath(); X.roundRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12, 20); X.clip();
    const n = Math.floor(k * 34); for (let i = 0; i < n; i++) { const cx = -w / 2 + 24 + (i % 6) * 25 + (Math.floor(i / 6) % 2) * 12, cy = h / 2 - 22 - Math.floor(i / 6) * 28; estrela(cx, cy, 15, i % 3 ? OURO : "#ffe27a"); } X.restore();
    X.fillStyle = TINTA; X.font = "700 52px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(Math.round(ESTRELAS * k).toLocaleString("pt-BR"), 0, h / 2 + 46); X.font = "700 24px SG"; X.fillStyle = VERDE2; X.fillText("ESTRELAS NO GITHUB", 0, h / 2 + 86); X.restore(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(233,225,201,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1" || nome === "s3") { // nome em máquina de escrever
        const alvo = "Leis · projeto aberto", k = nome === "s3" ? alvo.length : Math.floor(lin(lt, .2, 1.6) * alvo.length), txt = alvo.slice(0, k);
        X.fillStyle = PAPEL; X.beginPath(); X.roundRect(60, 610, 560, 92, 10); X.fill(); X.strokeStyle = TINTA; X.lineWidth = 3; X.stroke(); X.fillStyle = TINTA; X.font = "700 50px SG"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText(txt, 84, 658);
        if (k < alvo.length || (t * 2 % 1) < .5) { X.fillStyle = VERDE; X.fillRect(88 + X.measureText(txt).width, 632, 5, 52); } }
      if (nome === "s1" || nome === "s3") pote(nome === "s1" ? eo(lin(lt, .8, 2.6)) * .35 : .35 + .65 * eio(lin(lt, .4, 2.6)), 810, 760); },
    etiqueta(t, nome) { // papel rasgado com fita, estático
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(.015);
      X.shadowColor = "rgba(20,40,20,.25)"; X.shadowBlur = 16; X.shadowOffsetY = 6; X.fillStyle = "#fffdf4"; rasgado(-450, -120, 900, 240, 5); X.fill(); X.shadowColor = "transparent";
      X.fillStyle = "rgba(242,194,48,.75)"; for (const [x, r] of [[-410, -.5], [410, .5]]) { X.save(); X.translate(x, -112); X.rotate(r); X.fillRect(-70, -18, 140, 36); X.restore(); }
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(56, l1, 840); X.fillText(l1, 0, -30); X.fillStyle = VERDE; cabe(54, l2, 840); X.fillText(l2, 0, 32);
      if (l3) { X.fillStyle = OURO2; cabe(46, l3, 840); X.fillText(l3, 0, 90); } X.restore(); },
    cabecalho() {},
    legenda(seg, t) { // tarja de TV: faixa verde com selo amarelo
      const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 60; X.font = `700 ${fs}px SG`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 820 && fs > 36) { fs -= 2; X.font = `700 ${fs}px SG`; }
      const y = 1400; X.fillStyle = VERDE2; X.fillRect(40, y - 60, 910, 120); X.fillStyle = OURO; X.fillRect(40, y - 60, 910, 8); X.fillStyle = OURO; X.fillRect(60, y - 92, 150, 40);
      X.fillStyle = TINTA; X.font = "400 18px PS"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("LEIS", 135, y - 71);
      let x = 495 - tot() / 2; X.font = `700 ${fs}px SG`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? OURO : on ? "#fff" : "rgba(255,255,255,.4)"; X.fillText(w.w, x, y + 6); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { // zoom atravessando uma tela: moldura escura que cresce até sumir
      if (nome === "gancho" || lt > .36) return; const u = eio(lt / .36), w = 240 + u * 2200, h = w * 1.6;
      X.save(); X.fillStyle = TINTA; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 30 * (1 - u) + 4); X.fill("evenodd"); X.strokeStyle = OURO; X.lineWidth = 12; X.beginPath(); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 30 * (1 - u) + 4); X.stroke(); X.restore(); },
    fechamento(lt) { // post-its na parede + carimbo APROVADO
      const P = [["COMENTA " + CHAVE, OURO, 505, 790, -.04, 84, VERDE2, 700, 190], ["todas as leis num lugar só", "#bff0d2", 300, 1080, .05, 46, TINTA, 380, 230], ["projeto aberto e de graça", "#ffe9a8", 710, 1100, -.06, 46, TINTA, 380, 230]];
      P.forEach(([txt, cor, x, y, r, f, tc, w, h], i) => { const p = back(lin(lt, i * .2, i * .2 + .35)); if (p <= 0) return; X.save(); X.translate(x, y); X.rotate(r); X.scale(p, p);
        X.shadowColor = "rgba(20,30,20,.3)"; X.shadowBlur = 16; X.shadowOffsetY = 8; X.fillStyle = cor; X.fillRect(-w / 2, -h / 2, w, h); X.shadowColor = "transparent"; X.fillStyle = tc; X.textAlign = "center"; X.textBaseline = "middle"; X.font = `700 ${f}px SG`;
        const ws = txt.split(" "), L = []; let c = ""; for (const w2 of ws) { const tt = c ? c + " " + w2 : w2; if (X.measureText(tt).width > w - 40 && c) { L.push(c); c = w2; } else c = tt; } L.push(c);
        L.forEach((l, k) => X.fillText(l, 0, (k - (L.length - 1) / 2) * f * 1.1 + 4)); X.restore(); });
      const k = lin(lt, 1.0, 1.25); if (k > 0) { const s = 1 + (1 - eo(k)) * 1.5; X.save(); X.translate(505, 1330); X.rotate(-.12); X.scale(s, s); X.globalAlpha = Math.min(1, k * 2); X.strokeStyle = "#c0262b"; X.lineWidth = 10; X.strokeRect(-250, -60, 500, 120);
        X.fillStyle = "#c0262b"; X.font = "700 84px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("APROVADO", 0, 6); X.restore(); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: VERDE, VERDE: OURO, FUNDO, CREME: PAPEL, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

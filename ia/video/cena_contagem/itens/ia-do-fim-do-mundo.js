// Reel 🆕 "A IA que funciona sem internet" (survival-llm; 14/11 19:00). Motor da cena_contagem.
// Identidade: porão de sobrevivência à luz de lampião: prateleiras com latas e galões de água, rádio a pilha, caixa de primeiros
// socorros, um notebook velho ligado com o ícone de Wi-Fi riscado (e mesmo assim respondendo). A cada assunto um objeto acende;
// a fonte aparece como um livro aberto com marcador. Verde-oliva + caqui + laranja-lampião. Mascote remenda a mochila com agulha e linha.
// Elementos: faixa diagonal de aviso, nome em máquina de escrever, pote enchendo de estrelas, tarja de TV, zoom atravessando uma tela,
// 2 planos frontais, cartões que viram, Press Start só no enfeite + Space Grotesk. Mascote de bandana; ação principal: costurar.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const OLIVA = "#556b2f", OLIVA2 = "#36451d", CAQUI = "#c8b27a", LAMP = "#ffa53d", TINTA = "#1d1f16", FUNDO = "#f2efe4", AMAR = "#ffd23f", VERM = "#d9363e", CREME = "#fffaf0", AZ = "#3a7bd5";
rim.color.set(0xffc27a); rim.intensity = 1.6; key.color.set(0xfff0dc); key.intensity = 120; key.position.set(-2, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xffe8c8, .5)); const lampiao = new THREE.PointLight(0xffa53d, 9, 7); lampiao.position.set(.4, 2.2, -.8); S.add(lampiao);
// ---------- porão ----------
const pT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#7a7366"; g.fillRect(0, 0, w, h); for (let y = 0; y < 8; y++) for (let x = 0; x < 4; x++) { g.fillStyle = (x + y) % 2 ? "#8c8577" : "#9b9384"; g.fillRect(x * 64 + (y % 2) * 32, y * 32, 62, 30); } }); pT.wrapS = pT.wrapT = THREE.RepeatWrapping; pT.repeat.set(5, 3);
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshStandardMaterial({ map: pT, roughness: .9 }), S, 0, 4.5, -2.8).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(22, 12), M("#6b665b", { roughness: .9 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// prateleiras com latas e galões
for (const y of [.8, 1.6, 2.4]) box(2.4, .06, .5, M("#7a5232"), S, -2.0, y, -2.4); for (const x of [-3.2, -.8]) box(.06, 2.5, .5, M("#5e3f26"), S, x, 1.25, -2.4);
for (let i = 0; i < 12; i++) { const y = [.8, 1.6, 2.4][i % 3]; mesh(new THREE.CylinderGeometry(.12, .12, .28, 12), M([CAQUI, "#b0b0a8", VERM][i % 3], { metalness: .5, roughness: .4 }), S, -3.0 + Math.floor(i / 3) * .55, y + .17, -2.4); }
const GAL = [0, 1].map(i => box(.4, .55, .3, new THREE.MeshStandardMaterial({ color: "#9ccbe8", transparent: true, opacity: .8, roughness: .2 }), S, 1.9 + i * .5, .28, -2.3));
// mesa com notebook velho + rádio + caixa de primeiros socorros + lampião
box(2.4, .08, 1.0, M("#6e4a2a", { roughness: .6 }), S, .7, .85, -1.6); for (const [x, z] of [[-.4, -2.0], [1.8, -2.0], [-.4, -1.2], [1.8, -1.2]]) box(.06, .85, .06, M("#4e331c"), S, x, .42, z);
const NB = new THREE.Group(); NB.position.set(.5, .89, -1.6); S.add(NB); box(.9, .04, .6, M("#3a3a3a"), NB, 0, .02, 0); const tp = new THREE.Group(); tp.position.set(0, .04, -.28); tp.rotation.x = -.25; NB.add(tp); box(.9, .58, .04, M("#3a3a3a"), tp, 0, .29, 0);
const nbC = document.createElement("canvas"); nbC.width = 320; nbC.height = 200; const ng = nbC.getContext("2d"); const nbT = new THREE.CanvasTexture(nbC); nbT.colorSpace = THREE.SRGBColorSpace; mesh(new THREE.PlaneGeometry(.82, .5), new THREE.MeshBasicMaterial({ map: nbT }), tp, 0, .29, .025).castShadow = false;
const desNB = (txt, wifi, t) => { ng.fillStyle = "#101810"; ng.fillRect(0, 0, 320, 200); ng.fillStyle = "#9fe3b0"; ng.font = "700 22px SG"; ng.fillText("> " + txt.slice(0, Math.floor(t * 18)), 14, 110); ng.strokeStyle = wifi ? "#9fe3b0" : "#888"; ng.lineWidth = 5; for (let i = 0; i < 3; i++) { ng.beginPath(); ng.arc(280, 52, 10 + i * 10, -2.4, -.75); ng.stroke(); } if (!wifi) { ng.strokeStyle = VERM; ng.lineWidth = 6; ng.beginPath(); ng.moveTo(250, 20); ng.lineTo(310, 70); ng.stroke(); } nbT.needsUpdate = true; };
const RADIO = box(.5, .3, .2, M(OLIVA, { roughness: .5 }), S, 1.5, 1.04, -1.7); const antena = box(.02, .5, .02, M("#ccc", { metalness: .8 }), S, 1.7, 1.4, -1.7);
const KIT = new THREE.Group(); KIT.position.set(-.3, .89, -1.5); S.add(KIT); box(.45, .3, .3, M("#f2f2f2"), KIT, 0, .15, 0); box(.2, .06, .01, M(VERM), KIT, 0, .18, .16); box(.06, .2, .01, M(VERM), KIT, 0, .18, .16);
const LMP = new THREE.Group(); LMP.position.set(1.1, .89, -1.3); S.add(LMP); box(.2, .05, .2, M("#333"), LMP, 0, .03, 0); const chama = mesh(new THREE.SphereGeometry(.09, 12, 10), E(LAMP, 2.5), LMP, 0, .2, 0); box(.02, .3, .02, M("#333"), LMP, 0, .38, 0);
// livro aberto com marcador (a fonte)
const lvT = ctex(320, 200, g => { g.fillStyle = CREME; g.fillRect(0, 0, 320, 200); g.fillStyle = "#ccc"; g.fillRect(158, 0, 4, 200); g.fillStyle = TINTA; g.font = "700 18px SG"; g.fillText("Primeiros", 20, 40); g.fillText("socorros, p. 42", 20, 64); for (let i = 0; i < 6; i++) { g.fillStyle = "#bbb"; g.fillRect(20, 90 + i * 16, 120, 5); g.fillRect(180, 30 + i * 22, 120, 5); } g.fillStyle = AMAR; g.fillRect(14, 30, 140, 42); g.fillStyle = TINTA; g.fillText("Primeiros", 20, 40); g.fillText("socorros, p. 42", 20, 64); });
const LIVRO = mesh(new THREE.PlaneGeometry(.9, .56), new THREE.MeshStandardMaterial({ map: lvT, side: THREE.DoubleSide }), S, -.45, 1.75, -1.0); LIVRO.castShadow = false; const marc = box(.06, .3, .01, M(VERM), S, -.45, 1.5, -.98);
// mochila sendo remendada
const MOC = new THREE.Group(); MOC.position.set(-2.4, 0, .8); S.add(MOC); box(.6, .7, .3, M(OLIVA, { roughness: .9 }), MOC, 0, .35, 0); box(.5, .3, .1, M(OLIVA2), MOC, 0, .3, .18); const remendo = box(.2, .2, .01, M(CAQUI), MOC, .1, .5, .16);
const LINHA = box(.008, .6, .008, M(VERM), S, 0, 0, 0);
// ---------- mascote: bandana + agulha ----------
const BAN = box(1.54, .16, 1.04, M(VERM, { roughness: .7 }), MAS.corpo, 0, 1.38, 0); const nó = box(.2, .12, .12, M(VERM), MAS.corpo, .5, 1.38, -.55);
const AG = box(.02, .22, .02, M("#ddd", { metalness: .9 }), MAS.bracos[1], .38, -.05, .2);
const MX = -1.1, MZ = .9;
const costura = lt => { const s = Math.sin(lt * 5); pose(MAS, { x: MX, z: MZ, y: hop(lt, .9, .02), ry: -.5, braco: [1.0 + s * .4, .5], piscar: pisca(lt) }); MAS.g.rotation.z = 0; LINHA.visible = true; LINHA.position.set(-2.1, .65 + s * .15, .95); LINHA.rotation.z = .9 + s * .3; };
const olha = (lt, ry = -.3) => { LINHA.visible = false; pose(MAS, { x: MX + .4, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .6], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = lt => { LINHA.visible = false; pose(MAS, { x: 1.5, z: MZ + .4, y: hop(lt, .35, .22), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let POTE = 0;
const reset = (lt) => { chama.scale.setScalar(1 + Math.sin(lt * 13) * .08); lampiao.intensity = 8 + Math.sin(lt * 11) * 1.2; LIVRO.visible = false; marc.visible = false; [KIT, RADIO].forEach(o => o.scale.setScalar(1)); GAL.forEach(g => g.scale.setScalar(1)); };
const acende = (o, k) => o.scale.setScalar(1 + Math.max(0, Math.sin(k * Math.PI)) * .25);
// ---------- 2 planos frontais (aberto → fechado na metade) ----------
const PL = { gancho: [[V(0, 2.4, 7.0), V(0, 1.3, -1.0)], [V(.4, 1.9, 5.6), V(.4, 1.3, -1.4)]], s1: [[V(.3, 2.2, 6.4), V(.4, 1.2, -1.4)], [V(.5, 1.7, 4.8), V(.5, 1.1, -1.6)]], s2: [[V(0, 2.5, 7.2), V(.2, 1.3, -1.6)], [V(-.4, 2.0, 5.8), V(-.4, 1.2, -1.2)]],
  s3: [[V(-.2, 2.2, 6.4), V(-.3, 1.5, -1.0)], [V(-.3, 1.9, 5.4), V(-.4, 1.6, -1.0)]], s4: [[V(.2, 2.3, 6.6), V(.4, 1.2, -1.4)], [V(.5, 1.7, 5.0), V(.5, 1.1, -1.6)]], cta: [[V(0, 2.4, 7.4), V(0, 1.3, -.8)], [V(0, 2.4, 7.4), V(0, 1.3, -.8)]] };
const SHOTS = PL;
const camera = (cam, nome, lt, d) => { const P = PL[nome] || PL.cta, i = lt < d * .5 ? 0 : 1, [p, l] = P[i], u = (lt - (i ? d * .5 : 0)) / (d * .5); cam.position.set(p.x, p.y, p.z - u * .25); cam.lookAt(l); };
const ACT = {
  gancho(lt, d) { reset(lt); desNB("como faço um curativo?", false, lt); costura(lt); },
  s1(lt, d) { reset(lt); desNB("survival-llm pronto, sem internet", false, lt); costura(lt); },
  s2(lt, d) { reset(lt); desNB("primeiros socorros · água · comida", false, lt); acende(KIT, lin(lt, .2, .9)); GAL.forEach(g => acende(g, lin(lt, .9, 1.6))); acende(RADIO, lin(lt, 2.2, 2.9)); olha(lt, -.4); },
  s3(lt, d) { reset(lt); desNB("fonte: livro, p. 42", false, lt); LIVRO.visible = true; LIVRO.scale.setScalar(Math.max(.01, back(lin(lt, .2, .6)))); marc.visible = lt > .6; POTE = eio(lin(lt, .5, 2.2)); olha(lt, -.6); },
  s4(lt, d) { reset(lt); desNB("instalando... 100%", true, lt); feliz(lt); },
  cta(lt, d) { reset(lt); desNB("pronto pra qualquer dia", false, lt); feliz(lt); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `700 ${f}px SG`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const listras = (w, h) => { X.save(); X.beginPath(); X.rect(-w / 2, -h / 2, w, h); X.clip(); X.fillStyle = AMAR; X.fillRect(-w / 2, -h / 2, w, h); X.fillStyle = TINTA; for (let x = -w / 2 - h; x < w / 2 + h; x += 56) { X.beginPath(); X.moveTo(x, -h / 2); X.lineTo(x + 28, -h / 2); X.lineTo(x + 28 - h, h / 2); X.lineTo(x - h, h / 2); X.fill(); } X.restore(); };
  const estrela = (x, y, r, cor) => { X.fillStyle = cor; X.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; X.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } X.closePath(); X.fill(); };
  const pote = (v, x, y) => { const w = 150, h = 170; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,255,255,.93)"; X.beginPath(); X.roundRect(-110, -h / 2 - 40, 220, h + 140, 20); X.fill();
    X.fillStyle = "rgba(85,107,47,.15)"; X.strokeStyle = OLIVA; X.lineWidth = 5; X.beginPath(); X.roundRect(-w / 2, -h / 2, w, h, 22); X.fill(); X.stroke(); X.fillStyle = CAQUI; X.fillRect(-w / 2 + 12, -h / 2 - 20, w - 24, 22);
    X.save(); X.beginPath(); X.roundRect(-w / 2 + 5, -h / 2 + 5, w - 10, h - 10, 18); X.clip(); const n = Math.floor(v / 1582 * 30); for (let i = 0; i < n; i++) estrela(-w / 2 + 20 + (i % 5) * 26 + (Math.floor(i / 5) % 2) * 12, h / 2 - 18 - Math.floor(i / 5) * 24, 13, i % 3 ? LAMP : AMAR); X.restore();
    X.fillStyle = TINTA; X.font = "700 46px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(Math.round(v).toLocaleString("pt-BR") + " ★", 0, h / 2 + 36); X.font = "700 20px SG"; X.fillStyle = OLIVA; X.fillText("ESTRELAS NO GITHUB", 0, h / 2 + 68); X.restore(); };
  const maquina = (txt, x, y, lt, t0, fs) => { if (lt < t0) return; const n = Math.min(txt.length, Math.floor((lt - t0) * 14)); X.font = `700 ${fs}px SG`; X.textAlign = "left"; X.textBaseline = "middle"; const s = txt.slice(0, n), w = X.measureText(txt).width;
    X.fillStyle = "rgba(255,250,240,.95)"; X.beginPath(); X.roundRect(x - 24, y - fs * .75, w + 60, fs * 1.5, 14); X.fill(); X.fillStyle = TINTA; X.fillText(s, x, y + 3); if (n < txt.length || Math.floor(lt * 3) % 2) X.fillRect(x + X.measureText(s).width + 4, y - fs * .38, 6, fs * .76); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(242,239,228,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") maquina("survival-llm", 110, 700, lt, .4, 80);
      if (nome === "s2") { [["SOCORROS", .2], ["ÁGUA", .9], ["COMIDA", 1.5], ["CONSERTO", 2.2]].forEach(([s, t0], i) => { const k = back(lin(lt, t0, t0 + .3)); if (k <= 0) return; X.save(); X.translate(150 + i * 230, 700); X.scale(k, k); X.fillStyle = [VERM, AZ, OLIVA, LAMP][i]; X.beginPath(); X.roundRect(-105, -36, 210, 72, 36); X.fill(); X.fillStyle = "#fff"; X.font = `700 ${cabe(34, s, 180)}px SG`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s, 0, 2); X.restore(); }); }
      if (nome === "s3") pote(1582 * POTE, 830, 860);
      if (nome === "s4") maquina("enquanto a internet funciona", 110, 700, lt, .3, 54); },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(-.04); X.save(); X.translate(0, -112); listras(980, 32); X.restore(); X.save(); X.translate(0, 116); listras(980, 32); X.restore();
      X.fillStyle = TINTA; X.fillRect(-490, -96, 980, 196); X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = "#fff"; cabe(70, l1, 900); X.fillText(l1, 0, -18); X.fillStyle = AMAR; cabe(52, l2, 900); X.fillText(l2, 0, 40); X.fillStyle = "#c9e6a8"; cabe(44, l3, 900); X.fillText(l3, 0, 88);
      X.fillStyle = LAMP; X.font = "400 18px PS"; X.textAlign = "left"; X.fillText("OFFLINE", -470, -70); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 66; X.font = `700 ${fs}px SG`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 780 && fs > 38) { fs -= 2; X.font = `700 ${fs}px SG`; }
      const y = 1405, x0 = 505 - tot() / 2; X.fillStyle = OLIVA2; X.fillRect(40, y - 56, 910, 112); X.fillStyle = LAMP; X.fillRect(40, y + 48, 910, 8); X.fillStyle = LAMP; X.fillRect(60, y - 90, 270, 40); X.fillStyle = TINTA; X.font = "400 16px PS"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("RÁDIO DO PORÃO", 195, y - 70);
      let x = x0; X.font = `700 ${fs}px SG`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? AMAR : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 240 + u * 2300, h = w * .62;
      X.save(); X.fillStyle = "#101810"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 14 * (1 - u) + 4); X.fill("evenodd"); X.restore(); },
    fechamento(lt) { // cartões que viram: SEM INTERNET · MOSTRA A FONTE · NO SEU PC
      [["OFFLINE", "sem internet"], ["FONTE", "em cada resposta"], ["SEU PC", "roda local"]].forEach(([a, b], i) => { const k = lin(lt, .1 + i * .22, .55 + i * .22), sx = Math.abs(Math.cos(k * Math.PI)), frente = k > .5, x = 210 + i * 300, y = 820;
        X.save(); X.translate(x, y); X.scale(Math.max(.02, sx), 1); X.fillStyle = frente ? "#fff" : OLIVA; X.beginPath(); X.roundRect(-130, -140, 260, 280, 22); X.fill();
        if (frente) { X.fillStyle = TINTA; X.font = `700 ${cabe(52, a, 220)}px SG`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(a, 0, -20); X.fillStyle = "#6b6a5a"; X.font = "700 28px SG"; X.fillText(b, 0, 40); } else { X.fillStyle = AMAR; X.font = "400 60px PS"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("?", 0, 8); } X.restore(); });
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 1040); X.scale(p, p); X.fillStyle = LAMP; X.beginPath(); X.roundRect(-330, -62, 660, 124, 62); X.fill(); X.fillStyle = TINTA; X.font = `700 ${cabe(70, "Comenta " + CHAVE, 620)}px SG`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 4); X.restore(); },
  }; };
const cores = { LAR: OLIVA, VERDE: LAMP, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

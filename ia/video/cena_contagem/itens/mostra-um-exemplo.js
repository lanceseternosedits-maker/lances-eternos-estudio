// Reel ⚙️ como funciona "Ela nunca escreve do seu jeito? Mostra um exemplo" (10/11 12:00). Motor da cena_contagem (mesmo mascote 3D).
// Identidade: ateliê de caligrafia: prancheta inclinada, quadro na parede com o bilhete do dono (letra cursiva), papel carbono,
// carimbos e tinteiro; o mascote primeiro escreve "de robô", depois decalca a letra e no fim escreve sozinho igualzinho.
// Paleta sépia + verde-garrafa. Elementos: etiqueta em página de caderno, nome em texto embaralhado decifrando, termômetro
// ("parecido com você", sem número), legenda em bloco de 4 palavras com a atual colorida, transição glitch RGB, 2 planos frontais,
// fechamento em pódio, Archivo Black. Mascote de boina de pintor (no topo) e pena na mão (ao lado); ação: decalcar a letra.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const SEP = "#7a5232", SEP2 = "#a8784a", GAR = "#1f5e46", GAR2 = "#2f8a66", PAP = "#f6ecd6", TINTA = "#2a1b10", FUNDO = "#efe2c8", VERM = "#c0392b";
rim.color.set(0xffe2b8); rim.intensity = 1.2; key.color.set(0xfff0d8); key.intensity = 145; key.position.set(1, 9, 6); key.target.position.set(0, .9, -.2);
S.add(new THREE.AmbientLight(0xfff0dc, .55));

// ---------- cenário: parede sépia com lambri verde, piso escuro ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#d9c09a"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(122,82,50,.12)"; for (let i = 0; i < 40; i++) g.fillRect((i * 97) % w, (i * 53) % 150, 30, 2); g.fillStyle = GAR; g.fillRect(0, 170, w, h - 170); g.fillStyle = "#174a37"; for (let x = 0; x < w; x += 42) g.fillRect(x, 170, 4, h - 170); g.fillStyle = "#c9a56b"; g.fillRect(0, 166, w, 8); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.5).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(22, 12), M("#4a3020", { roughness: .85 }), S, 0, 0, 2); chao.rotation.x = -Math.PI / 2;
// quadro na parede com o bilhete do dono
const carta = (g, w, h, cor = TINTA) => { g.fillStyle = cor; g.font = "700 46px CV"; g.textAlign = "left"; ["Oi, gente! Bora", "marcar aquele", "café amanhã? ☕", "Bjs, Ana"].forEach((l, i) => g.fillText(l, 28, 70 + i * 52)); };
const qT = ctex(320, 280, (g, w, h) => { g.fillStyle = "#fbf3e2"; g.fillRect(0, 0, w, h); carta(g, w, h, "#1e3f8a"); });
const QD = new THREE.Group(); QD.position.set(1.3, 2.55, -2.4); S.add(QD); box(1.5, 1.32, .08, M("#8a5a2b"), QD, 0, 0, 0); mesh(new THREE.PlaneGeometry(1.3, 1.12), new THREE.MeshStandardMaterial({ map: qT, roughness: .8 }), QD, 0, 0, .05);
// prancheta inclinada com o papel
const PR = new THREE.Group(); PR.position.set(.45, 0, -.55); S.add(PR); const madM = M(SEP, { roughness: .6 });
for (const x of [-.85, .85]) { box(.08, 1.0, .08, madM, PR, x, .5, -.25); box(.08, .8, .08, madM, PR, x, .4, .25); }
const tampo = new THREE.Group(); tampo.position.set(0, 1.0, 0); tampo.rotation.x = .75; PR.add(tampo); box(2.0, .06, 1.2, M(SEP2), tampo, 0, 0, 0);
const papT = ctex(400, 300, (g, w, h, modo = "robo", k = 0) => { g.fillStyle = PAP; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(42,27,16,.1)"; for (let y = 40; y < h; y += 52) { g.beginPath(); g.moveTo(10, y + 22); g.lineTo(w - 10, y + 22); g.stroke(); }
  if (modo === "robo") { g.fillStyle = "#6d6d6d"; g.font = "400 30px AB"; ["PREZADO(A),", "VENHO POR MEIO", "DESTA CONVIDAR..."].forEach((l, i) => { const n = Math.floor(Math.min(1, Math.max(0, k * 3 - i)) * l.length); g.fillText(l.slice(0, n), 26, 62 + i * 52); });
    if (k > .9) { g.strokeStyle = VERM; g.lineWidth = 14; g.lineCap = "round"; g.beginPath(); g.moveTo(80, 40); g.lineTo(320, 230); g.moveTo(320, 40); g.lineTo(80, 230); g.stroke(); } return; }
  if (modo === "carbono") { g.fillStyle = "#2b2f45"; g.fillRect(0, 0, w, h); g.save(); g.beginPath(); g.rect(0, 0, w * k, h); g.clip(); g.globalAlpha = .9; carta(g, w, h, "#9fb0ff"); g.restore(); return; }
  // "dela": escreve sozinha no mesmo estilo, nova mensagem
  g.save(); g.beginPath(); g.rect(0, 0, w * k, h); g.clip(); g.fillStyle = "#1e3f8a"; g.font = "700 46px CV"; ["Oi, gente! Sábado", "tem churras aqui", "em casa? 🔥", "Bjs, Ana"].forEach((l, i) => g.fillText(l, 28, 70 + i * 52)); g.restore();
  if (k >= 1) { g.fillStyle = GAR2; g.beginPath(); g.arc(352, 250, 30, 0, 7); g.fill(); g.fillStyle = "#fff"; g.font = "400 40px AB"; g.textAlign = "center"; g.fillText("✓", 352, 264); } });
const papel = mesh(new THREE.PlaneGeometry(1.6, 1.0), new THREE.MeshStandardMaterial({ map: papT, roughness: .85 }), tampo, 0, .035, .02); papel.rotation.x = -Math.PI / 2;
let papU = ""; const papD = (m, k) => { const u = m + Math.round(k * 50); if (u !== papU) { papU = u; papT.draw(m, k); } };
// carimbos e tinteiro numa mesinha à direita
const MS = new THREE.Group(); MS.position.set(2.15, 0, -.2); S.add(MS); box(.9, .7, .6, madM, MS, 0, .35, 0);
mesh(new THREE.CylinderGeometry(.12, .14, .16, 18), M("#111"), MS, -.2, .78, 0); for (const [x, c] of [[.1, VERM], [.3, GAR2]]) { mesh(new THREE.CylinderGeometry(.04, .04, .22, 10), M("#6b4426"), MS, x, .85, .05); box(.16, .07, .16, M(c), MS, x, .74, .05); }
// 3 cartões de exemplo + 1 novo (s2)
const cartT = (n, novo) => ctex(200, 140, g => { g.fillStyle = novo ? "#dff3e8" : "#fffaf0"; g.fillRect(0, 0, 200, 140); g.strokeStyle = novo ? GAR2 : SEP2; g.lineWidth = 8; g.strokeRect(4, 4, 192, 132);
  g.fillStyle = novo ? GAR : SEP; g.font = "400 22px AB"; g.fillText(novo ? "NOVO" : "EXEMPLO " + n, 16, 34); g.fillStyle = "rgba(30,63,138,.6)"; for (let i = 0; i < 3; i++) g.fillRect(16, 56 + i * 24, 160 - i * 30, 9); });
const CARTS = [1, 2, 3, 4].map(n => { const m = mesh(new THREE.BoxGeometry(.7, .49, .02), [M("#eee"), M("#eee"), M("#eee"), M("#eee"), new THREE.MeshStandardMaterial({ map: cartT(n, n === 4), roughness: .7 }), M("#eee")], S); m.visible = false; return m; });
// pilha de manuais (s3)
const MAN = new THREE.Group(); MAN.position.set(-.1, 1.0, .2); S.add(MAN); [GAR, VERM, "#3a5fa8", SEP].forEach((c, i) => { const b = box(.9 - i * .05, .14, .62, M(c), MAN, 0, i * .15, 0); b.rotation.y = (i % 2 ? .12 : -.08); });
box(.08, .3, .02, M("#ffd23f"), MAN, .2, .62, .31);

// ---------- mascote: boina de pintor (no topo) + pena na mão direita (ao lado do corpo) ----------
const BOI = new THREE.Group(); BOI.position.set(-.1, 1.52, 0); BOI.rotation.z = .18; MAS.corpo.add(BOI); mesh(new THREE.CylinderGeometry(.6, .66, .12, 32), M("#2b2b33", { roughness: .9 }), BOI, 0, 0, 0); mesh(new THREE.SphereGeometry(.05, 8, 6), M("#2b2b33"), BOI, 0, .09, 0);
const PENA = new THREE.Group(); PENA.position.set(.4, .06, .16); MAS.bracos[1].add(PENA); const pena = mesh(new THREE.ConeGeometry(.07, .6, 8), M("#f4f0ea", { roughness: .7 }), PENA, 0, .26, 0); pena.scale.z = .3; mesh(new THREE.CylinderGeometry(.012, .012, .2, 6), M("#222"), PENA, 0, -.08, 0);
const MX = -1.45, MZ = .1;
const escreve = (lt, ry = .7) => { const k = Math.sin(lt * 14); pose(MAS, { x: MX, z: MZ, y: 0, ry, braco: [.3, .75 + k * .12], piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(lt * 7) * .02; };
const olha = (lt, ry = .4) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .02), ry, braco: [.3, .5 + Math.sin(lt * 2) * .1], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .26), ry: .3, braco: [2.0 + Math.sin(lt * 9) * .3, 1.7 + Math.sin(lt * 9 + 1) * .2], sq: Math.max(0, Math.cos(lt * Math.PI / .35)) * .06, piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
let TERM = 0;

grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = () => { CARTS.forEach(c => c.visible = false); MAN.visible = false; };
const SHOTS = { gancho: [[V(.1, 2.0, 6.4), V(.1, 1.2, -.5)], [V(.3, 1.9, 5.6), V(.2, 1.25, -.5)]], s1: [[V(.2, 1.9, 5.9), V(.2, 1.2, -.5)], [V(.0, 2.0, 6.5), V(.1, 1.25, -.5)]],
  s2: [[V(.4, 1.9, 6.3), V(.5, 1.4, -.3)], [V(.2, 2.0, 6.7), V(.3, 1.4, -.3)]], s3: [[V(-.2, 1.8, 6.1), V(-.2, 1.25, -.2)], [V(.1, 2.0, 6.6), V(0, 1.25, -.3)]],
  s4: [[V(.2, 1.9, 6.0), V(.2, 1.2, -.5)], [V(.0, 2.0, 6.5), V(.1, 1.25, -.5)]], cta: [[V(0, 2.0, 6.9), V(0, 1.2, -.4)], [V(0, 2.0, 6.9), V(0, 1.2, -.4)]] };
const ACT = {
  gancho(lt, d) { reset(); papD("robo", lin(lt, .3, d * .8)); TERM = .08; if (lt < d * .8) escreve(lt); else olha(lt, .3); },
  s1(lt, d) { reset(); const k = lin(lt, .3, d - .4); papD("carbono", k); TERM = .08 + eio(k) * .5; escreve(lt, .75); },
  s2(lt, d) { reset(); papD("carbono", 1); TERM = .58; [0, 1, 2, 3].forEach(i => { const k = lin(lt, .4 + i * .7 + (i === 3 ? .8 : 0), .9 + i * .7 + (i === 3 ? .8 : 0)); const c = CARTS[i]; c.visible = k > 0; if (!c.visible) return;
      const e = back(k); c.scale.setScalar(Math.max(.01, e) * 1.25); c.position.set(-1.05 + i * .9, 2.2 + (i === 3 ? .02 : Math.sin(lt * 2 + i) * .03), -.1); c.rotation.set(0, 0, (i - 1.5) * .04); }); olha(lt, .5); },
  s3(lt, d) { reset(); papD("carbono", 1); TERM = .6; MAN.visible = true; const k = back(lin(lt, .2, .7)); MAN.scale.setScalar(Math.max(.01, k)); olha(lt, .2); },
  s4(lt, d) { reset(); const k = lin(lt, .4, d - .5); papD("dela", k); TERM = .6 + eio(k) * .4; if (k < 1) escreve(lt, .7); else feliz(lt); },
  cta(lt, d) { reset(); papD("dela", 1); TERM = 1; feliz(lt); },
};

// ---------- elementos de tela (2D): entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos, decifra } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 22) { X.font = `400 ${f}px AB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const termometro = (k, x, y) => { const h = 300; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,250,240,.92)"; X.beginPath(); X.roundRect(-70, -h / 2 - 40, 140, h + 150, 24); X.fill();
    X.fillStyle = "#e6dccb"; X.beginPath(); X.roundRect(-18, -h / 2, 36, h, 18); X.fill(); X.beginPath(); X.arc(0, h / 2 + 22, 38, 0, 7); X.fill();
    const cor = k > .85 ? GAR2 : k > .4 ? "#e0a32c" : "#7fa6d9"; X.fillStyle = cor; X.beginPath(); X.arc(0, h / 2 + 22, 30, 0, 7); X.fill(); const hh = (h - 16) * k; X.beginPath(); X.roundRect(-11, h / 2 - hh, 22, hh + 10, 11); X.fill();
    X.fillStyle = TINTA; X.font = "400 20px AB"; X.textAlign = "center"; X.fillText("SEU", 0, -h / 2 - 12); X.fillText("JEITO", 0, h / 2 + 90); X.restore(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(239,226,200,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome !== "cta") termometro(TERM, 870, 830);
      const nm = nome === "s1" ? "EXEMPLO" : nome === "s2" ? "2020 · GPT-3" : nome === "s3" ? "MANUAL OFICIAL" : null;
      if (nm) { const p = eo(lin(lt, .1, .9)), txt = decifra(nm, p, Math.floor(t * 22)); X.font = "400 56px AB"; const w = X.measureText(nm).width + 50;
        X.fillStyle = GAR; X.beginPath(); X.roundRect(60, 612, w, 86, 14); X.fill(); X.fillStyle = "#fff"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText(txt, 85, 658); } },
    etiqueta(t, nome) { // página de caderno (estática)
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(.012); X.shadowColor = "rgba(60,30,10,.25)"; X.shadowBlur = 18; X.shadowOffsetY = 6; X.fillStyle = "#fffdf6"; X.fillRect(-445, -122, 890, 244); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(47,138,102,.3)"; X.lineWidth = 2; for (let y = -70; y < 122; y += 54) { X.beginPath(); X.moveTo(-445, y); X.lineTo(445, y); X.stroke(); } X.strokeStyle = "rgba(192,57,43,.5)"; X.beginPath(); X.moveTo(-375, -122); X.lineTo(-375, 122); X.stroke();
      for (let i = 0; i < 7; i++) { X.fillStyle = FUNDO; X.beginPath(); X.arc(-410, -98 + i * 33, 7, 0, 7); X.fill(); }
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(52, l1, 780); X.fillText(l1, -350, -30); X.fillStyle = GAR2; cabe(50, l2, 780); X.fillText(l2, -350, 32); X.fillStyle = SEP; cabe(40, l3, 780); X.fillText(l3, -350, 88); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 58; X.font = `400 ${fs}px AB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 860 && fs > 34) { fs -= 2; X.font = `400 ${fs}px AB`; }
      let x = 505 - tot() / 2; const y = 1400; X.textAlign = "left"; X.textBaseline = "middle";
      for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.lineWidth = 12; X.lineJoin = "round"; X.strokeStyle = "#fffaf0"; X.strokeText(w.w, x, y); X.fillStyle = at ? GAR2 : on ? TINTA : "rgba(42,27,16,.35)"; X.fillText(w.w, x, y); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome, t) { // glitch RGB: faixas deslocadas em vermelho/ciano por ~0,25 s
      if (nome === "gancho" || lt > .25) return; const a = 1 - lt / .25; const img = X.getImageData(0, 0, 1080, 1920);
      for (let i = 0; i < 7; i++) { const y = ((i * 271 + Math.floor(lt * 60) * 97) % 1800), h = 30 + (i * 37) % 90, dx = ((i % 2 ? 1 : -1) * (30 + i * 9)) * a; X.putImageData(img, dx, 0, 0, y, 1080, h); }
      X.globalCompositeOperation = "screen"; X.fillStyle = `rgba(255,0,60,${.25 * a})`; X.fillRect(0, 0, 1080, 1920); X.fillStyle = `rgba(0,220,255,${.18 * a})`; X.fillRect(0, (lt * 4000) % 1920, 1080, 120); X.globalCompositeOperation = "source-over"; },
    fechamento(lt) { // pódio: 1º seu exemplo, 2º seu pedido, 3º seu tom
      const P = [[1, "SEU EXEMPLO", 505, 300, GAR2], [2, "O PEDIDO", 245, 210, SEP2], [3, "O TOM", 765, 150, "#b8955f"]];
      P.forEach(([n, txt, x, h, c], i) => { const k = eo(lin(lt, .1 + i * .15, .5 + i * .15)), hh = h * k, base = 1330; X.fillStyle = c; X.fillRect(x - 125, base - hh, 250, hh); X.fillStyle = "rgba(0,0,0,.15)"; X.fillRect(x - 125, base - hh, 250, 14);
        if (k > .6) { X.fillStyle = "#fff"; X.font = "400 84px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(String(n), x, base - hh + 64); X.fillStyle = TINTA; X.font = "400 34px AB"; X.fillText(txt, x, base - hh - 30 + Math.sin(lt * 3 + i) * 3); } });
      X.fillStyle = "#3a2516"; X.fillRect(80, 1330, 850, 16);
      const p = back(lin(lt, .7, 1.1)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 760); X.scale(p, p); X.fillStyle = GAR; X.beginPath(); X.roundRect(-380, -66, 760, 132, 66); X.fill();
      X.fillStyle = "#fff"; X.font = "400 64px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore();
      if (lt > 1.1) { X.globalAlpha = eo(lin(lt, 1.1, 1.5)); X.fillStyle = TINTA; X.font = "400 40px AB"; X.textAlign = "center"; X.fillText("Vai testar com o quê?", 505, 1420); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: GAR2, VERDE: SEP2, FUNDO, CREME: PAP, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui };
}

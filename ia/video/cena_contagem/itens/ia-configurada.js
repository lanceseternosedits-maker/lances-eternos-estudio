// Reel ⚙️ como funciona "Sua IA responde igual pra todo mundo" (instruções personalizadas; 11/11 08:00). Motor da cena_contagem.
// Identidade: programa de culinária em tela dividida: duas bancadas iguais lado a lado (esquerda NORMAL, direita CONFIGURADA),
// fogão, panela, forno com lasanha de 1 hora à esquerda e prato rápido com timer de 20 min à direita; ficha de preferências
// presa na geladeira da direita (o que você contou: sem lactose, 20 min, o que tem em casa); a IA não "vê" a geladeira, lê a ficha.
// Paleta tomate + creme. Elementos: etiqueta em tela de terminal, termômetro "serve pra você", legenda uma palavra gigante por vez
// com pop, glitch RGB, 2 planos frontais, tela CONTINUE? com contagem, Space Grotesk. Mascote de chapéu de chef; ação: cozinhar.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, mascote, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const TOM = "#e8452c", TOM2 = "#b52a17", CREME = "#fff4e2", VERDE = "#3aa655", TINTA = "#231612", FUNDO = "#fbe9d2", CINZA = "#9aa0a6", AMAR = "#ffcd3c";
rim.color.set(0xffd8c0); rim.intensity = 1.2; key.color.set(0xfff4e6); key.intensity = 150; key.position.set(0, 9, 6); key.target.position.set(0, .9, -.3);
S.add(new THREE.AmbientLight(0xfff2e4, .55));

// ---------- cenário: estúdio de culinária com azulejo creme ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = CREME; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(232,69,44,.18)"; g.lineWidth = 2; for (let x = 0; x < w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.4).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(22, 12), M("#7a4a36", { roughness: .8 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
box(.06, 4, .1, M(TINTA), S, 0, 2, -2.3);   // divisória da tela dividida
const bancada = (x, cor) => { const g = new THREE.Group(); g.position.set(x, 0, -.7); S.add(g); box(2.2, .9, .8, M(cor, { roughness: .6 }), g, 0, .45, 0); box(2.3, .07, .9, M("#e9e1d4", { roughness: .3 }), g, 0, .93, 0);
  mesh(new THREE.CylinderGeometry(.22, .22, .02, 24), M("#333"), g, -.5, .97, 0); mesh(new THREE.CylinderGeometry(.22, .22, .02, 24), M("#333"), g, .1, .97, 0); return g; };
const BE = bancada(-1.35, "#c7c7c7"), BD = bancada(1.35, TOM);
// esquerda: forno com lasanha (1 hora); direita: frigideira rápida (20 min)
const forno = box(.8, .6, .1, M("#333", { roughness: .3 }), BE, .55, .45, .41); const vidroF = box(.6, .35, .02, E("#ff8a3a", 0), BE, .55, .45, .47);
const LAS = new THREE.Group(); BE.add(LAS); LAS.position.set(-.5, .99, 0); box(.5, .14, .36, M("#d9c2a3"), LAS, 0, .07, 0); box(.46, .05, .32, M(TOM), LAS, 0, .15, 0);
const PAN = new THREE.Group(); BD.add(PAN); PAN.position.set(-.5, .99, 0); mesh(new THREE.CylinderGeometry(.24, .2, .08, 24), M("#2a2a2a", { metalness: .5, roughness: .3 }), PAN, 0, .04, 0); box(.4, .03, .05, M("#2a2a2a"), PAN, .4, .06, 0);
const comida = [VERDE, AMAR, TOM, "#f2e6c9"].map((c, i) => mesh(new THREE.SphereGeometry(.06, 10, 8), M(c), PAN, Math.cos(i * 1.6) * .1, .1, Math.sin(i * 1.6) * .1));
const PRATO = new THREE.Group(); BD.add(PRATO); PRATO.position.set(.15, .99, .1); mesh(new THREE.CylinderGeometry(.26, .22, .04, 28), M("#fff"), PRATO, 0, .02, 0); [VERDE, AMAR, TOM].forEach((c, i) => mesh(new THREE.SphereGeometry(.07, 10, 8), M(c), PRATO, -.08 + i * .08, .07, 0));
// relógios: 1 HORA à esquerda, 20 MIN à direita
const relT = (txt, cor) => ctex(200, 100, g => { g.fillStyle = "#fff"; g.beginPath(); g.roundRect(0, 0, 200, 100, 18); g.fill(); g.strokeStyle = cor; g.lineWidth = 8; g.beginPath(); g.roundRect(4, 4, 192, 92, 14); g.stroke(); g.fillStyle = cor; g.font = "700 46px SG"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 100, 54); });
const RE = mesh(new THREE.PlaneGeometry(.8, .4), new THREE.MeshBasicMaterial({ map: relT("1 HORA", TOM2) }), S, -1.35, 2.7, -2.2); RE.castShadow = false;
const RD = mesh(new THREE.PlaneGeometry(.8, .4), new THREE.MeshBasicMaterial({ map: relT("20 MIN", VERDE) }), S, 1.35, 2.7, -2.2); RD.castShadow = false;
// geladeira da direita com a ficha "o que você contou"
const GEL = new THREE.Group(); GEL.position.set(2.75, 0, -1.2); S.add(GEL); box(.8, 1.9, .7, M("#f3f3f3", { roughness: .3 }), GEL, 0, .95, 0); box(.04, .5, .04, M("#bbb"), GEL, -.3, 1.3, .36);
const fichaT = ctex(220, 280, g => { g.fillStyle = "#fffbe6"; g.fillRect(0, 0, 220, 280); g.fillStyle = TOM2; g.font = "700 26px SG"; g.fillText("Sobre mim:", 16, 38); g.fillStyle = TINTA; g.font = "700 22px SG";
  ["• sem lactose", "• chego às 8", "• 20 minutos", "• tenho frango,", "  arroz e brócolis"].forEach((l, i) => g.fillText(l, 16, 80 + i * 36)); });
const FICHA = mesh(new THREE.PlaneGeometry(.55, .7), new THREE.MeshStandardMaterial({ map: fichaT }), GEL, 0, 1.15, .36); FICHA.castShadow = false;
// segundo mascote "normal" (sem chapéu, cinza) na bancada da esquerda
const CINZ = M("#9a9a9a", { roughness: .6 }); const NOR = mascote(CINZ, M("#141014", { roughness: .3 }));
// ---------- mascote: chapéu de chef (no topo); cozinhar ----------
const CH = new THREE.Group(); CH.position.set(0, 1.5, 0); MAS.corpo.add(CH); const branco = M("#ffffff", { roughness: .8 });
mesh(new THREE.CylinderGeometry(.42, .42, .3, 24), branco, CH, 0, .15, 0); [-.22, 0, .22].forEach((x, i) => mesh(new THREE.SphereGeometry(.24, 16, 12), branco, CH, x, .42 + (i === 1 ? .08 : 0), 0));
const cozinha = (m, x, lt, f = 1) => { const k = Math.sin(lt * 10 * f); pose(m, { x, z: .2, y: 0, ry: 0, braco: [.5 + k * .15, 1.0 - k * .25], piscar: pisca(lt) }); m.g.rotation.z = 0; };
const parado = (m, x, lt, ry = 0) => { pose(m, { x, z: .2, y: hop(lt, .8, .02), ry, braco: [.3, .4], piscar: pisca(lt + 1) }); m.g.rotation.z = 0; };
const feliz = (m, x, lt) => { pose(m, { x, z: .2, y: hop(lt, .35, .24), ry: 0, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], sq: Math.max(0, Math.cos(lt * Math.PI / .35)) * .06, piscar: pisca(lt) }); m.g.rotation.z = 0; };
let TERM = [.5, .5];

grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = () => { PRATO.visible = false; vidroF.material.emissiveIntensity = 0; FICHA.scale.setScalar(1); };
const SHOTS = { gancho: [[V(0, 2.1, 7.7), V(0, 1.2, -.6)], [V(0, 2.0, 7.2), V(0, 1.2, -.6)]], s1: [[V(-1.1, 1.9, 6.2), V(-1.2, 1.2, -.6)], [V(-.9, 2.0, 6.6), V(-1.1, 1.3, -.6)]],
  s2: [[V(1.3, 1.9, 6.2), V(1.5, 1.3, -.7)], [V(1.0, 2.0, 6.6), V(1.3, 1.3, -.6)]], s3: [[V(0, 2.1, 7.7), V(0, 1.2, -.6)], [V(.4, 2.0, 7.1), V(.4, 1.2, -.6)]],
  s4: [[V(1.4, 1.9, 6.1), V(1.5, 1.2, -.6)], [V(.9, 2.1, 6.9), V(1.2, 1.3, -.6)]], cta: [[V(0, 2.1, 7.9), V(0, 1.2, -.6)], [V(0, 2.1, 7.9), V(0, 1.2, -.6)]] };
const ACT = {
  gancho(lt, d) { reset(); TERM = [.5, .5]; parado(NOR, -1.4, lt, .1); parado(MAS, 1.3, lt, -.1); LAS.visible = true; },
  s1(lt, d) { reset(); vidroF.material.emissiveIntensity = 1.5 + Math.sin(lt * 4) * .3; TERM = [.5 - eo(lin(lt, .5, d)) * .35, .5]; cozinha(NOR, -1.4, lt, .6); parado(MAS, 1.3, lt, -.3); },
  s2(lt, d) { reset(); TERM = [.15, .5 + eo(lin(lt, .5, d)) * .35]; const k = Math.sin(lin(lt, .3, 1.2) * Math.PI); FICHA.scale.setScalar(1 + k * .5); cozinha(MAS, 1.3, lt); parado(NOR, -1.4, lt); comida.forEach((c, i) => c.position.y = .1 + Math.abs(Math.sin(lt * 8 + i)) * .12); },
  s3(lt, d) { reset(); TERM = [.15, .85]; cozinha(MAS, 1.3, lt); parado(NOR, -1.4, lt, .3); comida.forEach((c, i) => c.position.y = .1 + Math.abs(Math.sin(lt * 8 + i)) * .12); },
  s4(lt, d) { reset(); TERM = [.15, .85 + eo(lin(lt, .4, 1.5)) * .15]; const k = back(lin(lt, .5, 1.0)); PRATO.visible = k > .01; PRATO.scale.setScalar(Math.max(.01, k)); if (lt < 1.2) cozinha(MAS, 1.3, lt); else feliz(MAS, 1.3, lt); parado(NOR, -1.4, lt, .4); },
  cta(lt, d) { reset(); PRATO.visible = true; TERM = [.15, 1]; feliz(MAS, 1.3, lt); parado(NOR, -1.4, lt, .4); },
};

// ---------- elementos de tela (2D): entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 22) { X.font = `700 ${f}px SG`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const termo = (k, x, y, rot) => { const h = 200; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,244,226,.94)"; X.beginPath(); X.roundRect(-70, -h / 2 - 40, 140, h + 110, 20); X.fill();
    X.fillStyle = "#e3d6c4"; X.beginPath(); X.roundRect(-14, -h / 2, 28, h, 14); X.fill(); X.beginPath(); X.arc(0, h / 2 + 18, 28, 0, 7); X.fill(); const c = k > .7 ? VERDE : k > .35 ? AMAR : TOM;
    X.fillStyle = c; X.beginPath(); X.arc(0, h / 2 + 18, 21, 0, 7); X.fill(); const hh = (h - 12) * k; X.beginPath(); X.roundRect(-8, h / 2 - hh, 16, hh + 8, 8); X.fill(); X.fillStyle = TINTA; X.font = "700 20px SG"; X.textAlign = "center"; X.fillText(rot, 0, -h / 2 - 14); X.restore(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(251,233,210,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome !== "cta") { // selos das bancadas + termômetros "serve pra você"
        [["IA NORMAL", CINZA, 230], ["IA CONFIGURADA", TOM, 760]].forEach(([s, c, x]) => { X.font = "700 34px SG"; const w = X.measureText(s).width + 40; X.fillStyle = c; X.beginPath(); X.roundRect(x - w / 2, 610, w, 58, 29); X.fill(); X.fillStyle = "#fff"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s, x, 641); });
        termo(TERM[0], 90, 1110, "SERVE?"); termo(TERM[1], 870, 1110, "SERVE?"); } },
    etiqueta(t, nome) { // tela de terminal
      const [l1, l2, l3] = SEGR[0].etiqueta; X.fillStyle = "#1d1412"; X.beginPath(); X.roundRect(60, 288, 890, 270, 18); X.fill(); X.fillStyle = "#3a2622"; X.beginPath(); X.roundRect(60, 288, 890, 46, [18, 18, 0, 0]); X.fill();
      [TOM, AMAR, VERDE].forEach((c, i) => { X.fillStyle = c; X.beginPath(); X.arc(92 + i * 30, 311, 9, 0, 7); X.fill(); }); X.fillStyle = "#b39a8f"; X.font = "700 22px SG"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("chef@cozinha:~", 190, 312);
      X.textBaseline = "alphabetic"; X.fillStyle = AMAR; X.font = "700 46px SG"; X.fillText(">", 84, 402); X.fillStyle = "#fff"; cabe(50, l1, 790); X.fillText(l1, 118, 402); X.fillStyle = "#ff9a86"; cabe(48, l2, 800); X.fillText(l2, 118, 466); X.fillStyle = AMAR; cabe(44, l3, 800); X.fillText(l3, 118, 526);
      if ((t * 2) % 1 < .5) { const w = X.measureText(l3).width; X.fillRect(126 + w, 494, 22, 38); } },
    cabecalho() {},
    legenda(seg, t) { const ws = seg.palavras; let w = ws.findIndex(x => t < x.t1 + .06); if (w < 0) w = ws.length - 1; const W = ws[w]; if (t < W.t0 - .25) return;
      const p = back(lin(t, W.t0 - .04, W.t0 + .14)); const txt = W.w.replace(/[,.:]$/, "").toUpperCase(), chave = txt.replace(/[?!]/g, "") === CHAVE;
      let f = 128; X.font = `700 ${f}px SG`; while (X.measureText(txt).width > 820 && f > 50) { f -= 4; X.font = `700 ${f}px SG`; }
      X.save(); X.translate(505, 1400); X.rotate(Math.sin(W.t0 * 11) * .03); X.scale(.6 + .4 * p, .6 + .4 * p); X.textAlign = "center"; X.textBaseline = "middle"; X.lineWidth = 18; X.strokeStyle = TINTA; X.lineJoin = "round"; X.strokeText(txt, 0, 4); X.fillStyle = chave ? AMAR : "#fff"; X.fillText(txt, 0, 4); X.restore(); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .25) return; const a = 1 - lt / .25; const img = X.getImageData(0, 0, 1080, 1920);
      for (let i = 0; i < 7; i++) { const y = ((i * 271 + Math.floor(lt * 60) * 97) % 1800), h = 30 + (i * 37) % 90, dx = ((i % 2 ? 1 : -1) * (30 + i * 9)) * a; X.putImageData(img, dx, 0, 0, y, 1080, h); }
      X.globalCompositeOperation = "screen"; X.fillStyle = `rgba(255,0,60,${.25 * a})`; X.fillRect(0, 0, 1080, 1920); X.fillStyle = `rgba(0,220,255,${.18 * a})`; X.fillRect(0, (lt * 4000) % 1920, 1080, 120); X.globalCompositeOperation = "source-over"; },
    fechamento(lt) { X.fillStyle = "rgba(29,20,18,.88)"; X.fillRect(60, 620, 890, 840); X.strokeStyle = TOM; X.lineWidth = 6; X.strokeRect(70, 630, 870, 820);
      const p = back(lin(lt, 0, .4)); X.save(); X.translate(505, 760); X.scale(p, p); X.fillStyle = AMAR; X.font = "700 110px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("CONTINUE?", 0, 0); X.restore();
      const n = Math.max(0, 9 - Math.floor(lt * 2)); X.fillStyle = TOM; X.font = "700 170px SG"; X.textAlign = "center"; X.fillText(String(n), 505, 960);
      if (lt > .8) { X.globalAlpha = eo(lin(lt, .8, 1.2)); X.fillStyle = CREME; X.font = "700 52px SG"; X.fillText("Qual IA você mais usa?", 505, 1120); X.globalAlpha = 1; }
      const pul = 1 + Math.sin(lt * 7) * .03; X.save(); X.translate(505, 1300); X.scale(pul, pul); X.fillStyle = TOM; X.beginPath(); X.roundRect(-370, -62, 740, 124, 62); X.fill();
      X.fillStyle = "#fff"; X.font = "700 70px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore(); },
  }; };
const cores = { LAR: TOM, VERDE, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui };
}

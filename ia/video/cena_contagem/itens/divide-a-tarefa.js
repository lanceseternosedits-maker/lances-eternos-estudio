// Reel ⚙️ como funciona "Pediu tudo de uma vez? Errou" (quebrar a tarefa em partes; guias da OpenAI e da Anthropic; 15/11 13:00).
// Identidade: confeitaria de manhã: bancada de mármore, batedeira, forno com termômetro; primeiro uma pilha de ingredientes jogados de uma vez
// desaba; depois o bolo é montado andar por andar (cada andar = uma parte do pedido) até a cereja no topo. Rosa-glacê + menta + chocolate.
// Elementos: tela de terminal, nome escrito à mão, termômetro do forno (partes prontas, ilustrativo), uma palavra gigante por vez,
// glitch RGB, travelling lateral, página de caderno, Archivo Black. Mascote de chapéu de confeiteiro; ação: montar o bolo andar por andar.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const GLACE = "#ffc6dc", ROSA2 = "#e0558d", MENTA = "#9fe3cf", MENTA2 = "#2f9e86", CHOC = "#6b3f26", TINTA = "#241a1c", FUNDO = "#fff6f8", CREME = "#fffaf3", AMAR = "#ffd23f", VERM = "#e5484d";
rim.color.set(0xffe0ec); rim.intensity = 1.3; key.color.set(0xffffff); key.intensity = 150; key.position.set(-2, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xfff4f6, .62));
// ---------- confeitaria ----------
const pT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#e9fbf5"; g.fillRect(0, 0, w, h); g.fillStyle = MENTA; for (let x = 0; x < w; x += 32) g.fillRect(x, 0, 16, h); }); pT.wrapS = pT.wrapT = THREE.RepeatWrapping; pT.repeat.set(4, 2);
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const chT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? "#ffffff" : "#ffe3ee"; g.fillRect(x * 32, y * 32, 32, 32); } }); chT.wrapS = chT.wrapT = THREE.RepeatWrapping; chT.repeat.set(5, 3);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: chT, roughness: .5 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// bancada de mármore
const mmT = ctex(256, 128, (g, w, h) => { g.fillStyle = "#f4f4f2"; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(150,150,160,.35)"; g.lineWidth = 2; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo((i * 41) % w, 0); g.bezierCurveTo((i * 67) % w, 40, (i * 23) % w, 90, (i * 59) % w, h); g.stroke(); } });
box(4.4, .12, 1.2, new THREE.MeshStandardMaterial({ map: mmT, roughness: .3 }), S, -.2, .92, -1.4); box(4.2, .86, 1.0, M(MENTA2, { roughness: .6 }), S, -.2, .43, -1.4);
// forno com termômetro + batedeira
const FOR = new THREE.Group(); FOR.position.set(2.6, 0, -2.2); S.add(FOR); box(1.2, 1.6, .9, M("#e9e9ee", { metalness: .4, roughness: .3 }), FOR, 0, .8, 0); box(.9, .7, .02, new THREE.MeshStandardMaterial({ color: "#332", emissive: "#ff8a3d", emissiveIntensity: .25 }), FOR, 0, .7, .46);
const BAT = new THREE.Group(); BAT.position.set(-2.0, .98, -1.6); S.add(BAT); box(.35, .1, .5, M(GLACE), BAT, 0, .05, 0); box(.12, .6, .12, M(GLACE), BAT, 0, .35, -.18); box(.5, .18, .2, M(GLACE), BAT, .1, .62, -.1); mesh(new THREE.CylinderGeometry(.18, .13, .25, 18), M("#ccc", { metalness: .8 }), BAT, .1, .2, .05);
// ingredientes "tudo de uma vez" (desabam)
const ING = []; for (let i = 0; i < 12; i++) { const m = i % 3 === 0 ? mesh(new THREE.SphereGeometry(.1, 10, 8), M(i % 2 ? "#fff" : "#f2d38a"), S) : box(.18 + (i % 2) * .1, .14, .14, M(["#ffefc2", "#c89b63", "#fff", "#ffd6e6"][i % 4]), S, 0, 0, 0); ING.push(m); }
const pilha = (k, t) => ING.forEach((m, i) => { const r = Math.floor(i / 3), c = i % 3, top = V(-.4 + c * .2 - .2, 1.05 + r * .16, -1.3); const fall = Math.max(0, Math.min(1, k * 1.6 - (11 - i) * .05)); const dir = (i % 2 ? 1 : -1) * (.3 + (i % 3) * .25);
  m.visible = true; m.position.set(top.x + dir * fall, top.y - (top.y - 1.04) * eio(fall) + Math.sin(fall * Math.PI) * .2, top.z + fall * .3 * (c - 1)); m.rotation.set(fall * 3 * (i % 2 ? 1 : -1), 0, fall * 2); });
// bolo de 3 andares + cereja
const BOLO = new THREE.Group(); BOLO.position.set(-.3, .98, -1.3); S.add(BOLO);
const AND = [[.55, .3, ROSA2], [.42, .26, GLACE], [.3, .24, MENTA]].map(([r, h, c], i) => { const g = new THREE.Group(); BOLO.add(g); mesh(new THREE.CylinderGeometry(r, r, h, 32), M(c, { roughness: .6 }), g, 0, h / 2, 0); mesh(new THREE.TorusGeometry(r, .03, 8, 32), M("#fff", { roughness: .5 }), g, 0, h, 0).rotation.x = Math.PI / 2; g.userData.y = [0, .3, .56][i]; return g; });
const CER = mesh(new THREE.SphereGeometry(.09, 14, 10), M(VERM, { roughness: .3 }), BOLO, 0, .9, 0);
const monta = (k) => { AND.forEach((g, i) => { const u = Math.max(0, Math.min(1, k * 4 - i)); g.visible = u > 0; g.position.y = g.userData.y + (1 - eio(u)) * 1.2; g.scale.setScalar(Math.max(.01, .6 + .4 * eio(u))); }); const u = Math.max(0, Math.min(1, k * 4 - 3)); CER.visible = u > 0; CER.position.y = .9 + (1 - eio(u)) * .8; };
// ---------- mascote: chapéu de confeiteiro ----------
const CHP = new THREE.Group(); CHP.position.set(0, 1.5, 0); MAS.corpo.add(CHP); mesh(new THREE.CylinderGeometry(.5, .5, .3, 24), M("#fff", { roughness: .9 }), CHP, 0, .15, 0); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; mesh(new THREE.SphereGeometry(.28, 14, 10), M("#fff", { roughness: .9 }), CHP, Math.cos(a) * .25, .45, Math.sin(a) * .25); }
const MX = 1.4, MZ = .1;
const confeita = (lt, ry = -.6) => { const s = Math.sin(lt * 5); pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .02), ry, braco: [.4, 1.1 + s * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const susto = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .5, .08), ry: -.2, braco: [2.3, 2.3], piscar: 1 }); MAS.g.rotation.z = Math.sin(lt * 18) * .025; };
const feliz = (lt, x = MX, z = MZ) => { pose(MAS, { x, z, y: hop(lt, .35, .22), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let PARTES = 0;
const reset = (lt) => { ING.forEach(m => m.visible = false); monta(0); };
// ---------- travelling lateral ----------
const TR = { gancho: [-.9, .3], s1: [.8, -.2], s2: [-.6, .4], s3: [.6, -.4], s4: [-.8, .6], cta: [-.2, .3] };
const SHOTS = {}; Object.keys(TR).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a, b] = TR[nome] || TR.cta, x = a + (b - a) * eio(lt / d); cam.position.set(x, 2.4, 6.4); cam.lookAt(x * .45 - .1, 1.35, -1.2); };
const ACT = {
  gancho(lt, d) { reset(lt); pilha(lin(lt, d * .45, d * .8), lt); lt > d * .5 ? susto(lt) : confeita(lt, -.3); },
  s1(lt, d) { reset(lt); pilha(1, lt); confeita(lt, -.2); },
  s2(lt, d) { reset(lt); pilha(1 - lin(lt, .2, 1.0), lt); confeita(lt, -.4); },
  s3(lt, d) { reset(lt); monta(lin(lt, .3, d) * .5); PARTES = lin(lt, .3, d) * .5; confeita(lt); },
  s4(lt, d) { reset(lt); monta(.5 + lin(lt, 0, d * .9) * .5); PARTES = .5 + lin(lt, 0, d * .9) * .5; confeita(lt); },
  cta(lt, d) { reset(lt); monta(1); feliz(lt, 1.3, 1.1); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px AB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const mao = (txt, x, y, lt, t0, fs, cor = TINTA) => { const p = eio(lin(lt, t0, t0 + .9)); X.save(); X.font = `700 ${fs}px CV`; X.textAlign = "left"; X.textBaseline = "middle"; const w = X.measureText(txt).width; X.fillStyle = "rgba(255,255,255,.94)"; X.beginPath(); X.roundRect(x - 24, y - fs * .72, w + 48, fs * 1.44, 18); X.fill(); X.beginPath(); X.rect(x - 6, y - fs, w * p + 12, fs * 2); X.clip(); X.fillStyle = cor; X.fillText(txt, x, y + 4); X.restore(); };
  const termometro = (k, x, y) => { X.save(); X.translate(x, y); X.fillStyle = "rgba(255,255,255,.95)"; X.beginPath(); X.roundRect(-100, -165, 200, 345, 22); X.fill();
    X.fillStyle = "#eee"; X.beginPath(); X.roundRect(-20, -140, 40, 210, 20); X.fill(); X.beginPath(); X.arc(0, 90, 36, 0, 7); X.fill(); X.fillStyle = ROSA2; X.beginPath(); X.arc(0, 90, 27, 0, 7); X.fill(); const hh = 200 * Math.max(.04, k); X.fillRect(-11, 80 - hh, 22, hh + 10);
    X.fillStyle = TINTA; X.font = "400 42px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(Math.round(k * 3) + "/3", 0, 150); X.font = "400 16px AB"; X.fillStyle = "#777"; X.fillText("PARTES PRONTAS", 0, 172); X.restore(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(255,246,248,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s2") mao("OpenAI + Anthropic: quebre em partes", 80, 700, lt, 1.0, 54, MENTA2);
      if (nome === "s3" || nome === "s4") termometro(PARTES, 200, 900);
      if (nome === "s4") { [["1 · o plano", .2], ["2 · uma parte por vez", 1.6], ["3 · junta tudo", 3.2]].forEach(([s, t0], i) => { const k = back(lin(lt, t0, t0 + .3)); if (k <= 0) return; X.save(); X.translate(80, 680 + i * 72); X.scale(k, k); X.fillStyle = [ROSA2, MENTA2, CHOC][i]; X.beginPath(); X.roundRect(0, -30, 470, 60, 30); X.fill(); X.fillStyle = "#fff"; X.font = "400 36px AB"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText(s.toUpperCase(), 24, 2); X.restore(); }); } },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410);
      X.fillStyle = "#1e1a1c"; X.beginPath(); X.roundRect(-460, -140, 920, 280, 18); X.fill(); X.fillStyle = "#33292d"; X.beginPath(); X.roundRect(-460, -140, 920, 42, [18, 18, 0, 0]); X.fill();
      [VERM, AMAR, MENTA2].forEach((c, i) => { X.fillStyle = c; X.beginPath(); X.arc(-428 + i * 30, -119, 9, 0, 7); X.fill(); });
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = MENTA; X.font = "400 54px AB"; X.fillText(">", -430, -30); X.fillStyle = "#fff"; cabe(56, l1, 800); X.fillText(l1, -385, -30);
      X.fillStyle = GLACE; cabe(52, l2, 840); X.fillText(l2, -430, 38); X.fillStyle = AMAR; cabe(48, l3, 800); X.fillText(l3, -430, 100); if (Math.floor(t * 2) % 2 === 0) { const w = X.measureText(l3).width; X.fillRect(-420 + w, 66, 22, 40); } X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ws = seg.palavras; let w = ws.findIndex(x => t < x.t1 + .06); if (w < 0) w = ws.length - 1; const W = ws[w]; if (t < W.t0 - .25) return;
      const p = back(lin(t, W.t0 - .04, W.t0 + .14)); const txt = W.w.replace(/[,.:]$/, ""), chave = txt.replace(/[?!]/g, "").toUpperCase() === CHAVE;
      let f = 124; X.font = `400 ${f}px AB`; while (X.measureText(txt).width > 820 && f > 52) { f -= 4; X.font = `400 ${f}px AB`; }
      X.save(); X.translate(505, 1395); X.scale(.6 + .4 * p, .6 + .4 * p); X.textAlign = "center"; X.textBaseline = "middle"; X.lineWidth = 18; X.strokeStyle = "#fff"; X.lineJoin = "round"; X.strokeText(txt, 0, 0); X.fillStyle = chave ? ROSA2 : TINTA; X.fillText(txt, 0, 0); X.restore(); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .3) return; const k = 1 - lt / .3, cv = X.canvas; X.save(); X.globalCompositeOperation = "lighter"; X.globalAlpha = .45 * k;
      X.drawImage(cv, 22 * k, 0); X.drawImage(cv, -22 * k, 0); X.restore(); X.save(); X.globalAlpha = .7 * k; for (let i = 0; i < 10; i++) { const y = 600 + ((i * 131 + Math.floor(lt * 60) * 37) % 860); X.fillStyle = i % 2 ? "rgba(255,0,120,.5)" : "rgba(0,220,200,.5)"; X.fillRect(0, y, 1080, 6 + (i % 3) * 8); } X.restore(); },
    fechamento(lt) { X.save(); X.translate(420, 890); X.scale(.8, .8); X.rotate(-.015); X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 24; X.fillStyle = "#fffdf6"; X.fillRect(-430, -270, 860, 470); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(47,158,134,.3)"; X.lineWidth = 2; for (let y = -190; y < 200; y += 80) { X.beginPath(); X.moveTo(-430, y + 40); X.lineTo(430, y + 40); X.stroke(); } X.strokeStyle = "rgba(229,72,77,.5)"; X.beginPath(); X.moveTo(-350, -270); X.lineTo(-350, 200); X.stroke();
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = ROSA2; X.font = "400 52px AB"; X.fillText("RECEITA DO PEDIDO GRANDE:", -320, -200);
      [["1.", "PEÇA O PLANO PRIMEIRO"], ["2.", "UMA PARTE POR MENSAGEM"], ["3.", "NO FIM: \"JUNTA TUDO\""]].forEach(([n, s], i) => { const k = lin(lt, .15 + i * .2, .45 + i * .2); if (k <= 0) return; X.globalAlpha = k; const y = -110 + i * 80; X.fillStyle = MENTA2; X.font = "400 48px AB"; X.fillText(n, -320, y); X.fillStyle = TINTA; X.font = `400 ${cabe(46, s, 640)}px AB`; X.fillText(s, -265, y); X.globalAlpha = 1; });
      X.restore();
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(420, 1220); X.scale(p, p); X.fillStyle = ROSA2; X.beginPath(); X.roundRect(-290, -60, 580, 120, 60); X.fill(); X.fillStyle = "#fff"; X.font = `400 ${cabe(70, "COMENTA " + CHAVE, 540)}px AB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore(); },
  }; };
const cores = { LAR: ROSA2, VERDE: MENTA2, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

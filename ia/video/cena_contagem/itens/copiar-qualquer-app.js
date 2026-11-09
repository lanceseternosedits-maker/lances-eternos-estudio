// Reel 🆕 contagem "5 projetos pra entender qualquer programa" (eleven, Reverse Engineer Anything, Awesome Reverse Engineered,
// REA Prompts, Craft Anything; 14/11 15:00). Motor da cena_contagem.
// Identidade: bancada de conserto de eletrônicos à noite: uma CAIXA-PRETA trancada ("código fechado") no centro, lupa gigante, ferro de solda
// soltando faíscas, fios coloridos e placas de circuito; a cada item a caixa se abre um pouco mais; nº 1: uma planta azul (blueprint) se
// desenrola e vira um aparelho novo montado. Verde-placa + cobre + azul-planta. Uso legal: só com programa seu ou que a licença permite.
// Elementos: letreiro neon, nome escrito à mão, termômetro, tarja de TV, zoom atravessando uma tela, travelling lateral,
// página de caderno, Bebas Neue. Mascote de óculos de proteção; ação principal: soldar.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const PCB = "#1f7a4d", PCB2 = "#0f4a2e", COBRE = "#d98b4a", AZP = "#2457a8", NEON = "#46f2c4", TINTA = "#141a1f", FUNDO = "#eef3f1", AMAR = "#ffd23f", VERM = "#ff5a5a", CREME = "#fffaf0";
rim.color.set(0x9ff2d8); rim.intensity = 1.6; key.color.set(0xffffff); key.intensity = 140; key.position.set(-2, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xdff2ea, .55));
// ---------- oficina ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#26302c"; g.fillRect(0, 0, w, h); g.fillStyle = "#33403a"; for (let x = 0; x < w; x += 32) for (let y = 0; y < 180; y += 32) g.fillRect(x + 2, y + 2, 28, 28); g.fillStyle = "#1c2420"; for (let x = 0; x < w; x += 32) for (let y = 0; y < 180; y += 32) { g.beginPath(); g.arc(x + 16, y + 16, 3, 0, 7); g.fill(); } g.fillStyle = "#3a2a20"; g.fillRect(0, 196, w, 60); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(22, 12), M("#3b3f45", { roughness: .8 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// bancada
box(4.6, .1, 1.3, M("#7a5232", { roughness: .5 }), S, -.3, .9, -1.5); for (const x of [-2.4, 1.8]) box(.1, .9, 1.2, M("#4e3420"), S, x, .45, -1.5);
const pcbT = ctex(256, 256, (g, w, h) => { g.fillStyle = PCB; g.fillRect(0, 0, w, h); g.strokeStyle = COBRE; g.lineWidth = 4; for (let i = 0; i < 14; i++) { g.beginPath(); g.moveTo((i * 37) % w, 0); g.lineTo((i * 37) % w, 60 + (i * 23) % 120); g.lineTo((i * 61) % w, h); g.stroke(); } g.fillStyle = "#222"; for (let i = 0; i < 8; i++) g.fillRect(20 + (i * 53) % 200, 30 + (i * 71) % 190, 30, 18); });
const placa = (x, z, r) => { const m = mesh(new THREE.PlaneGeometry(.7, .5), new THREE.MeshStandardMaterial({ map: pcbT }), S, x, .96, z); m.rotation.x = -Math.PI / 2; m.rotation.z = r; m.castShadow = false; }; placa(-2.0, -1.3, .3); placa(1.3, -1.7, -.2);
// caixa-preta trancada (abre um pouco a cada item)
const CX = new THREE.Group(); CX.position.set(-.5, .95, -1.55); S.add(CX); box(1.1, .7, .8, M("#141414", { roughness: .4 }), CX, 0, .35, 0); const TAMPA = new THREE.Group(); TAMPA.position.set(0, .7, -.4); CX.add(TAMPA); box(1.12, .06, .82, M("#1d1d1d", { roughness: .4 }), TAMPA, 0, 0, .41);
const cad = new THREE.Group(); cad.position.set(0, .4, .41); CX.add(cad); box(.22, .2, .08, M(AMAR, { metalness: .8, roughness: .25 }), cad, 0, 0, 0); mesh(new THREE.TorusGeometry(.07, .02, 6, 14, Math.PI), M("#bbb", { metalness: .9 }), cad, 0, .1, 0);
const etT = ctex(256, 64, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 256, 64); g.fillStyle = VERM; g.font = "400 44px BB"; g.textAlign = "center"; g.fillText("CÓDIGO FECHADO", 128, 48); }); const ET = mesh(new THREE.PlaneGeometry(.9, .22), new THREE.MeshBasicMaterial({ map: etT }), CX, 0, .62, .41); ET.castShadow = false;
const luzCx = new THREE.PointLight(0x46f2c4, 0, 3); luzCx.position.set(0, 1.0, 0); CX.add(luzCx);
// lupa gigante (n5), robôzinhos (n4), arquivo de fichas (n3), cartas de prompt (n2), planta azul + aparelho (n1)
const LUPA = new THREE.Group(); S.add(LUPA); mesh(new THREE.TorusGeometry(.35, .05, 10, 30), M("#333", { metalness: .7 }), LUPA, 0, 0, 0); const lente = mesh(new THREE.CircleGeometry(.33, 30), new THREE.MeshStandardMaterial({ color: "#cfefff", transparent: true, opacity: .35, roughness: .05 }), LUPA, 0, 0, 0); lente.castShadow = false; box(.07, .6, .07, M(COBRE), LUPA, 0, -.6, 0);
const BOTS = [0, 1, 2].map(i => { const g = new THREE.Group(); S.add(g); box(.18, .14, .18, M(["#9fd3ff", "#ffd29f", "#c9ffb0"][i], { roughness: .4 }), g, 0, .07, 0); for (const s of [-1, 1]) box(.03, .03, .03, M("#111"), g, s * .04, .1, .1); return g; });
const ARQ = new THREE.Group(); ARQ.position.set(1.1, .95, -1.6); S.add(ARQ); box(.7, .5, .6, M("#8b8f96", { metalness: .5, roughness: .4 }), ARQ, 0, .25, 0); const FICH = []; for (let i = 0; i < 16; i++) FICH.push(box(.5, .3, .01, M(i % 3 ? "#fff" : "#ffe9a8"), ARQ, 0, .55, -.25 + i * .033));
const CART = [0, 1, 2, 3, 4].map(i => { const m = mesh(new THREE.PlaneGeometry(.36, .5), M(["#fff", "#e8f4ff", "#fff6e0", "#e9ffe9", "#fff"][i], { side: THREE.DoubleSide }), S); m.castShadow = false; return m; });
const bpT = ctex(320, 220, g => { g.fillStyle = AZP; g.fillRect(0, 0, 320, 220); g.strokeStyle = "rgba(255,255,255,.25)"; for (let x = 0; x < 320; x += 20) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 220); g.stroke(); } for (let y = 0; y < 220; y += 20) { g.beginPath(); g.moveTo(0, y); g.lineTo(320, y); g.stroke(); } g.strokeStyle = "#fff"; g.lineWidth = 3; g.strokeRect(60, 40, 200, 130); g.strokeRect(90, 70, 60, 40); g.beginPath(); g.arc(210, 105, 25, 0, 7); g.stroke(); g.fillStyle = "#fff"; g.font = "400 26px BB"; g.fillText("SEU APP", 120, 200); });
const BP = mesh(new THREE.PlaneGeometry(1.3, .9), new THREE.MeshStandardMaterial({ map: bpT, side: THREE.DoubleSide }), S, -.5, .96, -.6); BP.rotation.x = -Math.PI / 2; BP.castShadow = false;
const NOVO = new THREE.Group(); NOVO.position.set(-.5, .96, -.6); S.add(NOVO); box(.7, .45, .08, M("#f2f2f2", { roughness: .3 }), NOVO, 0, .35, 0); const telaN = box(.6, .35, .02, E(NEON, .8), NOVO, 0, .35, .05); box(.2, .1, .2, M("#ddd"), NOVO, 0, .05, 0);
// ---------- mascote: óculos de proteção + ferro de solda ----------
const OC = new THREE.Group(); OC.position.set(0, 1.18, .5); MAS.corpo.add(OC); for (const s of [-1, 1]) { const l = mesh(new THREE.CylinderGeometry(.2, .2, .06, 18), new THREE.MeshStandardMaterial({ color: "#bff3ff", transparent: true, opacity: .45 }), OC, s * .27, 0, .02); l.rotation.x = Math.PI / 2; l.castShadow = false; mesh(new THREE.TorusGeometry(.2, .03, 6, 18), M("#ff9f1a"), OC, s * .27, 0, .02); } box(1.5, .05, .05, M("#333"), OC, 0, 0, -.02);
const FERRO = new THREE.Group(); FERRO.position.set(.45, -.05, .25); MAS.bracos[1].add(FERRO); box(.08, .08, .35, M("#2d6cdf"), FERRO, 0, 0, 0); const ponta = box(.03, .03, .25, M("#ccc", { metalness: .9 }), FERRO, 0, 0, .3); FERRO.rotation.x = .5;
const FAIS = []; for (let i = 0; i < 10; i++) { const m = mesh(new THREE.SphereGeometry(.02, 6, 4), new THREE.MeshBasicMaterial({ color: AMAR }), S); m.castShadow = false; FAIS.push(m); }
const MX = .9, MZ = .1;
const solda = (lt, on = 1) => { const s = Math.sin(lt * 7); pose(MAS, { x: MX, z: MZ, y: hop(lt, .7, .02), ry: -.5, braco: [.3, .9 + s * .08], piscar: pisca(lt) }); MAS.g.rotation.z = 0;
  const px = MX - .45, py = 1.0, pz = MZ - .55; FAIS.forEach((f, i) => { const u = (lt * 2.2 + i / 10) % 1; f.visible = on > 0; f.position.set(px + Math.cos(i * 2.4) * u * .35, py + u * .25 - u * u * .5, pz + Math.sin(i * 2.4) * u * .3); f.material.opacity = 1 - u; f.material.transparent = true; }); };
const feliz = (lt, x = MX, z = MZ) => { FAIS.forEach(f => f.visible = false); pose(MAS, { x, z, y: hop(lt, .35, .22), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const NS = ["gancho", "n5", "n4", "n3", "n2", "n1", "cta"]; NS.forEach(n => grupo(n)); const ORD = ["n5", "n4", "n3", "n2", "n1"];
const reset = (lt) => { LUPA.visible = false; BOTS.forEach(b => b.visible = false); CART.forEach(c => c.visible = false); NOVO.visible = false; BP.visible = false; ARQ.visible = false; luzCx.intensity = 0; cad.visible = true; };
const abre = k => { TAMPA.rotation.x = -k * 1.5; luzCx.intensity = k * 6; cad.visible = k < .2; };
// ---------- travelling lateral ----------
const TR = { gancho: [-1.2, .2], n5: [.8, -.4], n4: [-.8, .4], n3: [1.0, -.2], n2: [-.6, .6], n1: [.4, -.6], cta: [-.4, .3] };
const SHOTS = {}; NS.forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a, b] = TR[nome] || TR.cta, x = a + (b - a) * eio(lt / d); cam.position.set(x, 2.4, 6.4); cam.lookAt(x * .45 - .2, 1.3, -1.0); };
const ACT = {
  gancho(lt) { reset(lt); abre(0); cad.rotation.z = Math.sin(lt * 9) * .1 * (lt % 1.5 < .4 ? 1 : 0); solda(lt); },
  n5(lt) { reset(lt); abre(.15); LUPA.visible = true; LUPA.position.set(-.5 + Math.sin(lt * 1.5) * .3, 1.9, -.9); LUPA.rotation.x = -.3; solda(lt); },
  n4(lt) { reset(lt); abre(.3); BOTS.forEach((b, i) => { b.visible = true; const u = Math.min(1, lin(lt, .3 + i * .3, 1.6 + i * .3)); b.position.set(-1.6 + u * 1.0 + i * .12, .95 + Math.abs(Math.sin(lt * 10 + i)) * .03, -.9 - u * .5); b.rotation.y = -1.2; }); solda(lt); },
  n3(lt) { reset(lt); abre(.45); ARQ.visible = true; FICH.forEach((f, i) => { f.position.y = .55 + Math.max(0, Math.sin(lt * 3 - i * .4)) * .2; }); solda(lt); },
  n2(lt) { reset(lt); abre(.6); CART.forEach((c, i) => { const k = back(lin(lt, .2 + i * .15, .5 + i * .15)); c.visible = k > 0; c.scale.setScalar(Math.max(.01, k)); c.position.set(-1.6 + i * .42, 1.75 + Math.sin(lt * 2 + i) * .04, -.7); c.rotation.set(0, 0, (i - 2) * .08); }); solda(lt); },
  n1(lt, d) { reset(lt); abre(1); BP.visible = true; BP.scale.set(Math.max(.01, eio(lin(lt, .2, .8))), 1, 1); NOVO.visible = lt > 1.0; NOVO.scale.setScalar(Math.max(.01, back(lin(lt, 1.0, 1.4)))); telaN.material.emissiveIntensity = .6 + Math.sin(lt * 5) * .3; lt > 1.4 ? feliz(lt) : solda(lt); },
  cta(lt) { reset(lt); abre(1); BP.visible = true; NOVO.visible = true; NOVO.scale.setScalar(1); feliz(lt, 1.3, .9); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, ITENS, MAXE } = C; const GY3 = 620; let CAB = null;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px BB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const fmtP = n => Math.round(n).toLocaleString("pt-BR");
  const termometro = (v, x, y) => { const k = Math.min(1, v / MAXE); X.save(); X.translate(x, y); X.fillStyle = "rgba(255,255,255,.95)"; X.beginPath(); X.roundRect(-170, -62, 340, 124, 20); X.fill();
    X.fillStyle = "#e8ecf0"; X.beginPath(); X.roundRect(-120, -40, 250, 30, 15); X.fill(); X.beginPath(); X.arc(-130, -25, 24, 0, 7); X.fill(); X.fillStyle = VERM; X.beginPath(); X.arc(-130, -25, 17, 0, 7); X.fill(); X.fillRect(-130, -33, 20 + 230 * Math.max(.04, k), 16);
    X.fillStyle = TINTA; X.font = "400 44px BB"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText(fmtP(v), -150, 26); X.font = "400 20px BB"; X.fillStyle = "#56606b"; X.textAlign = "right"; X.fillText("★ NO GITHUB", 160, 30); X.restore(); };
  const U = {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 60], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(238,243,241,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (CAB && nome !== "gancho" && nome !== "cta") U.cab2(...CAB); CAB = null; },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.fillStyle = "#0b1410"; X.beginPath(); X.roundRect(-465, -135, 930, 270, 26); X.fill(); X.strokeStyle = NEON; X.lineWidth = 5; X.shadowColor = NEON; X.shadowBlur = 20; X.stroke();
      const fl = Math.floor(t * 7) % 23 === 0 ? .55 : 1; X.textAlign = "center"; X.textBaseline = "middle"; X.globalAlpha = fl; X.shadowColor = NEON; X.shadowBlur = 22; X.fillStyle = "#e0fff6"; cabe(70, l1, 860); X.fillText(l1, 0, -52); X.globalAlpha = 1;
      X.shadowColor = AMAR; X.fillStyle = "#fff4c2"; cabe(76, l2, 860); X.fillText(l2, 0, 14); X.shadowColor = COBRE; X.fillStyle = "#ffe0c8"; cabe(58, l3, 860); X.fillText(l3, 0, 76); X.shadowBlur = 0; X.restore(); },
    cabecalho(s, lt, t) { CAB = [s, lt, t]; },
    cab2(s, lt, t) { const y = 680; X.fillStyle = PCB; X.beginPath(); X.arc(100, y, 44, 0, 7); X.fill(); X.fillStyle = "#fff"; X.font = "400 64px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag.replace(/\D/g, ""), 100, y + 3);
      const p = eio(lin(lt, .12, .9)); X.save(); let fn = 92; X.font = `700 ${fn}px CV`; while (X.measureText(s.item).width > 560 && fn > 46) { fn -= 4; X.font = `700 ${fn}px CV`; } X.textAlign = "left"; const w = X.measureText(s.item).width; X.fillStyle = "rgba(255,255,255,.92)"; X.beginPath(); X.roundRect(150, y - fn * .7, w + 40, fn * 1.4, 16); X.fill(); X.beginPath(); X.rect(160, y - 80, w * p + 6, 160); X.clip(); X.fillStyle = TINTA; X.fillText(s.item, 168, y + fn * .3); X.restore();
      termometro(s.estrelas * eio(lin(lt, .4, 1.9)), 770, 790); },
    legenda(seg, t) { const ch = C.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 74; X.font = `400 ${fs}px BB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 780 && fs > 40) { fs -= 2; X.font = `400 ${fs}px BB`; }
      const y = 1405, x0 = 505 - tot() / 2; X.fillStyle = PCB2; X.fillRect(40, y - 56, 910, 112); X.fillStyle = NEON; X.fillRect(40, y + 48, 910, 8); X.fillStyle = COBRE; X.fillRect(60, y - 90, 260, 40); X.fillStyle = "#fff"; X.font = "400 28px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("DIRETO DA BANCADA", 190, y - 70);
      let x = x0; X.font = `400 ${fs}px BB`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? NEON : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 240 + u * 2300, h = w * .62;
      X.save(); X.fillStyle = "#0b1410"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 14 * (1 - u) + 4); X.fill("evenodd"); X.restore(); },
    fechamento(lt) { // página de caderno com os 5
      X.save(); X.translate(420, 900); X.scale(.8, .8); X.rotate(-.015); X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 24; X.fillStyle = "#fffdf6"; X.fillRect(-430, -300, 860, 560); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(36,87,168,.3)"; X.lineWidth = 2; for (let y = -220; y < 260; y += 80) { X.beginPath(); X.moveTo(-430, y + 40); X.lineTo(430, y + 40); X.stroke(); } X.strokeStyle = "rgba(255,90,90,.5)"; X.beginPath(); X.moveTo(-350, -300); X.lineTo(-350, 260); X.stroke();
      X.fillStyle = TINTA; X.font = "400 56px BB"; X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillText("ABRE QUALQUER PROGRAMA:", -320, -240);
      ITENS.slice().reverse().forEach((s, i) => { const k = lin(lt, .15 + i * .14, .4 + i * .14); if (k <= 0) return; X.globalAlpha = k; const y = -165 + i * 80; X.fillStyle = PCB; X.font = "400 48px BB"; X.fillText((i + 1) + ".", -320, y); X.fillStyle = TINTA; X.font = `400 ${cabe(46, s.item.toUpperCase(), 440)}px BB`; X.fillText(s.item.toUpperCase(), -270, y); X.fillStyle = "#7a8596"; X.font = "400 38px BB"; X.textAlign = "right"; X.fillText(fmtP(s.estrelas) + " ★", 400, y); X.textAlign = "left"; X.globalAlpha = 1; });
      X.restore();
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(420, 1290); X.scale(p, p); X.fillStyle = PCB; X.beginPath(); X.roundRect(-290, -62, 580, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = "400 84px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 6); X.restore();
      if (lt > 1.3) { X.globalAlpha = eo(lin(lt, 1.3, 1.7)); X.fillStyle = "#56606b"; X.font = "400 34px BB"; X.textAlign = "center"; X.fillText("SÓ COM PROGRAMA SEU OU QUE A LICENÇA PERMITE", 505, 1400); X.globalAlpha = 1; } },
  }; return U; };
const cores = { LAR: PCB, VERDE: NEON, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

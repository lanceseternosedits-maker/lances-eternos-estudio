// Reel 🆕 contagem "5 projetos que turbinam seu celular" (MeshLive, Droidline, AVault, iPhone-use, Android Ad Cleaner; 12/11 10:00).
// Identidade: oficina de conserto de celular de rua: bancada preta com lupa articulada, chaves de fenda minúsculas, celular gigante
// aberto no suporte; cada item muda a tela; nº 1 = pop-ups de propaganda (sem marca) estourando como bolhas. Turquesa + laranja-solda.
// Elementos: tela de terminal, nome escrito à mão, termômetro de estrelas, tarja de TV, zoom atravessando uma tela, plongée/contra-plongée,
// cartões que viram, Archivo Black (Bebas repetiria o "Sua IA não te conhece", que sai antes). Mascote de lanterna de cabeça; ação: consertar.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const TURQ = "#17b3a6", TURQ2 = "#0c7a71", LAR = "#ff7a2f", PRETO = "#1a1d22", TINTA = "#11161a", FUNDO = "#e3f4f2", BRANCO = "#ffffff", AMAR = "#ffd23f";
rim.color.set(0xa8fff2); rim.intensity = 1.4; key.color.set(0xfff4e8); key.intensity = 145; key.position.set(1, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xeafcff, .55));
const solda = new THREE.PointLight(0xff9a40, 0, 4); solda.position.set(.4, 1.3, .2); S.add(solda);
// ---------- oficina ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#cfece8"; g.fillRect(0, 0, w, h); g.fillStyle = "#b9dfda"; for (let y = 0; y < h; y += 32) for (let x = (y / 32 % 2) * 16; x < w; x += 32) g.fillRect(x, y, 30, 30);
  g.fillStyle = "#6c757d"; g.fillRect(40, 40, 140, 90); g.fillStyle = "#fff"; for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) g.fillRect(50 + i * 32, 50 + j * 38, 26, 30); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.6).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(22, 12), M("#4a4f57", { roughness: .8 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
box(3.4, .9, 1.0, M(PRETO, { roughness: .6 }), S, .4, .45, -.6); box(3.5, .06, 1.1, M("#2c3138"), S, .4, .93, -.6); box(3.4, .1, .02, M(TURQ), S, .4, .6, -.09);
// lupa articulada
const LP = new THREE.Group(); LP.position.set(-.9, .96, -.9); S.add(LP); box(.3, .05, .3, M("#666"), LP, 0, 0, 0); const br1 = box(.05, .9, .05, M("#999", { metalness: .6 }), LP, 0, .45, 0); br1.rotation.z = .3;
const anel = mesh(new THREE.TorusGeometry(.24, .04, 8, 24), M(TURQ, { metalness: .4 }), LP, .38, .9, .2); anel.rotation.y = .6; mesh(new THREE.CircleGeometry(.22, 20), new THREE.MeshStandardMaterial({ color: "#d8fffa", transparent: true, opacity: .35 }), LP, .38, .9, .2).rotation.y = .6;
for (let i = 0; i < 4; i++) { const c = box(.04, .32, .04, M(i % 2 ? LAR : TURQ), S, 1.4 + i * .12, .98, -.35); c.rotation.z = Math.PI / 2; }
// celular gigante no suporte (tela muda por item)
const telT = ctex(256, 480, (g, w, h, modo = "rachado", k = 0) => { g.fillStyle = "#0e1418"; g.fillRect(0, 0, w, h); g.fillStyle = "#1d2a30"; g.fillRect(0, 0, w, 40);
  const ico = (cor, txt) => { g.fillStyle = cor; g.beginPath(); g.roundRect(48, 120, 160, 160, 34); g.fill(); g.fillStyle = "#fff"; g.font = "400 60px AB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 128, 204); };
  if (modo === "rachado") { g.fillStyle = "#24343a"; g.fillRect(0, 40, w, h); g.fillStyle = "#ff4d6d"; for (let i = 0; i < 5; i++) { g.beginPath(); g.roundRect(20 + (i % 2) * 30, 70 + i * 78, 200, 60, 10); g.fill(); g.fillStyle = "#fff"; g.font = "400 22px AB"; g.fillText("PROPAGANDA", 50 + (i % 2) * 30, 108 + i * 78); g.fillStyle = ["#ff4d6d", "#ffb02e", "#7c5cff"][i % 3]; }
    g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 3; g.beginPath(); g.moveTo(180, 40); g.lineTo(120, 200); g.lineTo(200, 300); g.lineTo(90, 470); g.moveTo(120, 200); g.lineTo(20, 260); g.stroke(); return; }
  if (modo === "mesh") { ico("#4da3ff", "BT"); g.fillStyle = "#cfe8ff"; g.font = "400 26px AB"; g.textAlign = "center"; g.fillText("SEM INTERNET", 128, 330); }
  if (modo === "auto") { ico(TURQ, "AUTO"); g.fillStyle = "#cff"; for (let i = 0; i < 3; i++) g.fillRect(40, 320 + i * 30, 176 * Math.min(1, k * 3 - i), 14); }
  if (modo === "cofre") { ico("#8a5cff", "REC"); g.fillStyle = "#e5dcff"; g.font = "400 24px AB"; g.textAlign = "center"; g.fillText("COFRE CRIPTOGRAFADO", 128, 330); }
  if (modo === "iphone") { ico("#ff7a2f", "IA"); g.fillStyle = "#ffe2cf"; g.font = "400 24px AB"; g.textAlign = "center"; g.fillText("PELO CABO USB", 128, 330); }
  if (modo === "limpo") { g.fillStyle = "#24343a"; g.fillRect(0, 40, w, h); const n = Math.floor((1 - k) * 5); g.fillStyle = "#ff4d6d"; for (let i = 0; i < n; i++) { g.beginPath(); g.roundRect(20 + (i % 2) * 30, 70 + i * 78, 200, 60, 10); g.fill(); }
    if (k >= 1) { g.fillStyle = "#7cf2a8"; g.font = "400 46px AB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("SEM", 128, 220); g.fillText("PROPAGANDA", 128, 280); } } });
const CEL = new THREE.Group(); CEL.position.set(.6, .96, -.7); S.add(CEL); box(.5, .06, .4, M("#333"), CEL, 0, .03, 0);
const tela = mesh(new THREE.BoxGeometry(.9, 1.68, .08), [M("#222"), M("#222"), M("#222"), M("#222"), new THREE.MeshStandardMaterial({ map: telT, emissive: "#fff", emissiveMap: telT, emissiveIntensity: .7 }), M("#222")], CEL, 0, .9, 0); tela.rotation.x = -.08;
let telU = ""; const telaD = (m, k = 0) => { const u = m + Math.round(k * 20); if (u !== telU) { telU = u; telT.draw(m, k); } };
// bolhas de propaganda (nº 1)
const BOL = Array.from({ length: 10 }, (_, i) => { const m = mesh(new THREE.SphereGeometry(.18, 14, 10), new THREE.MeshStandardMaterial({ color: ["#ff4d6d", "#ffb02e", "#7c5cff"][i % 3], transparent: true, opacity: .85, roughness: .2 }), S); m.visible = false; m.castShadow = false; return m; });
// ---------- mascote: lanterna de cabeça (faixa no topo, luz na lateral de cima); consertar ----------
const LAN = new THREE.Group(); LAN.position.set(0, 1.48, 0); MAS.corpo.add(LAN); box(1.54, .09, 1.04, M("#222"), LAN, 0, 0, 0); const luzL = box(.24, .18, .14, E("#fff6c8", 1.5), LAN, .45, .12, .5);
const CHV = new THREE.Group(); CHV.position.set(.42, 0, .16); MAS.bracos[1].add(CHV); box(.04, .4, .04, M(LAR), CHV, 0, .1, 0); box(.025, .2, .025, M("#ccc", { metalness: .8 }), CHV, 0, .38, 0);
const MX = -1.25, MZ = .3;
const conserta = lt => { const k = Math.sin(lt * 12); pose(MAS, { x: MX + .35, z: MZ, y: hop(lt, .6, .02), ry: .6, braco: [.4, 1.1 + k * .12], piscar: pisca(lt) }); MAS.g.rotation.z = 0; solda.intensity = Math.max(0, Math.sin(lt * 23)) * 6; };
const olha = (lt, ry = .4) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .5], piscar: pisca(lt) }); MAS.g.rotation.z = 0; solda.intensity = 0; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .24), ry: .3, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; solda.intensity = 0; };
grupo("gancho"); grupo("n5"); grupo("n4"); grupo("n3"); grupo("n2"); grupo("n1"); grupo("cta");
const reset = () => BOL.forEach(b => b.visible = false);
const PL = [V(.1, 3.7, 6.8), V(0, 1.1, -.8)], CP = [V(-.2, .8, 6.6), V(0, 1.7, -.8)];
const SHOTS = { gancho: [CP, PL], n5: [PL, CP], n4: [CP, PL], n3: [PL, CP], n2: [CP, PL], n1: [[V(.4, 1.8, 4.6), V(.5, 1.7, -.7)], [V(.2, 3.0, 5.6), V(.4, 1.5, -.7)]], cta: [PL, PL] };
const ACT = {
  gancho(lt) { reset(); telaD("rachado"); olha(lt, .5); },
  n5(lt) { reset(); telaD("mesh"); conserta(lt); },
  n4(lt, d) { reset(); telaD("auto", lin(lt, .3, d)); conserta(lt); },
  n3(lt) { reset(); telaD("cofre"); conserta(lt); },
  n2(lt) { reset(); telaD("iphone"); olha(lt, .6); },
  n1(lt, d) { const k = lin(lt, .8, 2.6); telaD("limpo", k); BOL.forEach((b, i) => { const t0 = .8 + i * .18, u = lin(lt, t0, t0 + .9); b.visible = u > 0 && u < 1; if (!b.visible) return; b.position.set(.6 + Math.sin(i * 2.1) * .8 * u, 1.9 + u * 1.2, -.4 + Math.cos(i) * .3); b.scale.setScalar(u < .8 ? .6 + u : (1 - u) * 7); });
    if (k < 1) conserta(lt); else feliz(lt); },
  cta(lt) { reset(); telaD("limpo", 1); pose(MAS, { x: MX, z: MZ + .9, y: hop(lt, .35, .24), ry: .3, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, ITENS, MAXE } = C; const GY3 = 620; let CAB = null;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px AB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const fmtP = n => Math.round(n).toLocaleString("pt-BR");
  const termo = (v, x, y) => { const h = 260; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,255,255,.94)"; X.beginPath(); X.roundRect(-80, -h / 2 - 30, 160, h + 150, 20); X.fill();
    X.fillStyle = "#d9e6e4"; X.beginPath(); X.roundRect(-16, -h / 2, 32, h, 16); X.fill(); X.beginPath(); X.arc(0, h / 2 + 22, 32, 0, 7); X.fill(); X.fillStyle = LAR; X.beginPath(); X.arc(0, h / 2 + 22, 24, 0, 7); X.fill();
    const hh = (h - 12) * Math.min(1, v / MAXE); X.beginPath(); X.roundRect(-9, h / 2 - hh, 18, hh + 10, 9); X.fill(); X.fillStyle = TINTA; X.font = "400 34px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(fmtP(v), 0, h / 2 + 76); X.font = "400 14px AB"; X.fillStyle = TURQ2; X.fillText("★ NO GITHUB", 0, h / 2 + 104); X.restore(); };
  const U = {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 60], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(227,244,242,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (CAB && nome !== "gancho" && nome !== "cta") U.cab2(...CAB); CAB = null; },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.fillStyle = PRETO; X.beginPath(); X.roundRect(60, 288, 890, 270, 18); X.fill(); X.fillStyle = "#2c3138"; X.beginPath(); X.roundRect(60, 288, 890, 46, [18, 18, 0, 0]); X.fill();
      ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => { X.fillStyle = c; X.beginPath(); X.arc(92 + i * 30, 311, 9, 0, 7); X.fill(); }); X.fillStyle = "#8a96a3"; X.font = "400 20px AB"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("oficina@celular:~", 190, 312);
      X.textBaseline = "alphabetic"; X.fillStyle = LAR; X.font = "400 44px AB"; X.fillText(">", 84, 402); X.fillStyle = "#fff"; cabe(46, l1, 790); X.fillText(l1, 118, 402); X.fillStyle = TURQ; cabe(46, l2, 800); X.fillText(l2, 118, 466); X.fillStyle = AMAR; cabe(36, l3, 800); X.fillText(l3, 118, 526);
      if ((t * 2) % 1 < .5) { const w = X.measureText(l3).width; X.fillRect(126 + w, 496, 20, 36); } },
    cabecalho(s, lt, t) { CAB = [s, lt, t]; },
    cab2(s, lt, t) { const y = 650; X.fillStyle = LAR; X.beginPath(); X.arc(104, y, 42, 0, 7); X.fill(); X.fillStyle = "#fff"; X.font = "400 46px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag.replace(/\D/g, ""), 104, y + 3);
      const p = eio(lin(lt, .12, .9)); X.save(); X.font = `700 ${s.item.length > 14 ? 70 : 88}px CV`; X.textAlign = "left"; const w = X.measureText(s.item).width; X.beginPath(); X.rect(160, y - 80, w * p + 6, 150); X.clip(); X.fillStyle = TINTA; X.fillText(s.item, 164, y + 22); X.restore();
      termo(s.estrelas * eio(lin(lt, .4, 1.9)), 860, 860); },
    legenda(seg, t) { const ch = C.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 54; X.font = `400 ${fs}px AB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 640 && fs > 28) { fs -= 2; X.font = `400 ${fs}px AB`; }
      const y = 1405; X.fillStyle = PRETO; X.fillRect(40, y - 56, 910, 112); X.fillStyle = TURQ; X.fillRect(40, y + 48, 910, 8); X.fillStyle = LAR; X.fillRect(60, y - 88, 170, 38); X.fillStyle = "#fff"; X.font = "400 22px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("OFICINA AO VIVO", 145, y - 68);
      let x = 505 - tot() / 2; X.font = `400 ${fs}px AB`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? TURQ : on ? "#fff" : "rgba(255,255,255,.4)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 180 + u * 2300, h = w * 1.85;
      X.save(); X.fillStyle = "#0e1418"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 40 * (1 - u) + 6); X.fill("evenodd"); X.strokeStyle = TURQ; X.lineWidth = 12; X.beginPath(); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 40 * (1 - u) + 6); X.stroke(); X.restore(); },
    fechamento(lt) { const it = ITENS.slice().reverse().slice(0, 3); it.forEach((s, i) => { const x = 210 + i * 300, y = 860, p = lin(lt, .15 + i * .22, .55 + i * .22), sx = Math.abs(Math.cos(p * Math.PI)), frente = p >= .5;
        X.save(); X.translate(x, y); X.scale(Math.max(.02, sx), 1); X.fillStyle = frente ? "#fff" : TURQ; X.beginPath(); X.roundRect(-130, -180, 260, 360, 22); X.fill(); X.textAlign = "center"; X.textBaseline = "middle";
        if (!frente) { X.fillStyle = "#fff"; X.font = "400 140px AB"; X.fillText("?", 0, 8); } else { X.fillStyle = LAR; X.font = "400 60px AB"; X.fillText("Nº " + (i + 1), 0, -100); X.fillStyle = TINTA; X.font = `400 ${cabe(40, s.item, 230)}px AB`; X.fillText(s.item, 0, -10); X.fillStyle = TURQ2; X.font = "400 40px AB"; X.fillText(fmtP(s.estrelas) + " ★", 0, 80); } X.restore(); });
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(670, 1180); X.scale(p, p); X.fillStyle = LAR; X.beginPath(); X.roundRect(-260, -54, 520, 108, 54); X.fill(); X.fillStyle = "#fff"; X.font = "400 46px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore();
      if (lt > 1.3) { X.globalAlpha = eo(lin(lt, 1.3, 1.7)); X.fillStyle = TINTA; X.font = "400 28px AB"; X.textAlign = "center"; X.fillText("Seu celular tem propaganda no sistema?", 670, 1285); X.globalAlpha = 1; } },
  }; return U; };
const cores = { LAR, VERDE: TURQ, FUNDO, CREME: BRANCO, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui };
}

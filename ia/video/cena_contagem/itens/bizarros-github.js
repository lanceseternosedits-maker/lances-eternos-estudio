// Reel 🆕 contagem "5 projetos mais bizarros da semana" (Athenaion, Qwenputer, Web Ocean, Handwired, Print My Profile Pic; 11/11 19:30).
// Identidade: gabinete de curiosidades de museu: pedestais com redomas de vidro, cada uma guardando o item (templo grego, chip,
// oceano num aquário, cérebro de fios); nº 1 = maquininha de recibo que cospe um papel com o rosto do mascote. Vinho + dourado + verde-vidro.
// Elementos (trocados na produção para não repetir o Turing): placa de museu, nome em carimbo, placar HI-SCORE, tarja de TV, zoom atravessando
// uma tela, plongée/contra-plongée, pódio, Space Grotesk. Mascote de luvas brancas de curador; ação principal: polir as redomas.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const VINHO = "#6e1630", VINHO2 = "#4a0d20", OURO = "#d9a93b", VIDRO = "#9fe3d0", CREME = "#fbf0dc", TINTA = "#1d0d12", FUNDO = "#f1e4cf";
rim.color.set(0xffd9a0); rim.intensity = 1.5; key.color.set(0xfff0d6); key.intensity = 140; key.position.set(1, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xffe8d0, .5));
// ---------- museu ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = VINHO; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(217,169,59,.12)"; for (let x = 0; x < w; x += 48) for (let y = 0; y < 160; y += 48) { g.beginPath(); g.arc(x + 24, y + 24, 10, 0, 7); g.fill(); } g.fillStyle = "#3a0a18"; g.fillRect(0, 170, w, h); g.fillStyle = OURO; g.fillRect(0, 166, w, 6); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const tT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? "#e8dcc4" : "#cdbf9f"; g.fillRect(x * 32, y * 32, 32, 32); } }); tT.wrapS = tT.wrapT = THREE.RepeatWrapping; tT.repeat.set(6, 5);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: tT, roughness: .4 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
const vidM = new THREE.MeshStandardMaterial({ color: VIDRO, transparent: true, opacity: .22, roughness: .05, metalness: .1 });
const pedestal = (x, z) => { const g = new THREE.Group(); g.position.set(x, 0, z); S.add(g); box(.9, 1.0, .9, M("#f3ead6", { roughness: .5 }), g, 0, .5, 0); box(1.0, .08, 1.0, M(OURO, { metalness: .6 }), g, 0, 1.04, 0);
  const red = mesh(new THREE.CylinderGeometry(.42, .42, 1.0, 24, 1, true), vidM, g, 0, 1.58, 0); red.castShadow = false; mesh(new THREE.SphereGeometry(.42, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2), vidM, g, 0, 2.08, 0).castShadow = false; g.userData.dentro = new THREE.Group(); g.userData.dentro.position.y = 1.1; g.add(g.userData.dentro); return g; };
const PED = { n5: pedestal(-.2, -.6), n4: pedestal(-.2, -.6), n3: pedestal(-.2, -.6), n2: pedestal(-.2, -.6) };
const G5 = grupo("n5"), G4 = grupo("n4"), G3 = grupo("n3"), G2 = grupo("n2"), G1 = grupo("n1");
G5.add(PED.n5); G4.add(PED.n4); G3.add(PED.n3); G2.add(PED.n2);
// templo grego (n5)
{ const d = PED.n5.userData.dentro, mar = M("#f7f3ea", { roughness: .4 }); box(.62, .06, .42, mar, d, 0, .03, 0); for (let i = 0; i < 4; i++) for (const z of [-.15, .15]) mesh(new THREE.CylinderGeometry(.035, .04, .4, 10), mar, d, -.24 + i * .16, .26, z); const tri = mesh(new THREE.ConeGeometry(.42, .16, 3), mar, d, 0, .55, 0); tri.rotation.set(0, Math.PI / 2, Math.PI / 2); tri.scale.set(1, 1, .55); box(.64, .05, .44, mar, d, 0, .47, 0); }
// chip dentro de um cérebro (n4)
{ const d = PED.n4.userData.dentro; const c = mesh(new THREE.SphereGeometry(.3, 20, 14), M("#ffb3c7", { roughness: .7 }), d, 0, .32, 0); c.scale.set(1.15, .9, .9); box(.24, .04, .24, M("#1b1b1b"), d, 0, .32, .24); for (let i = 0; i < 6; i++) box(.02, .02, .06, M(OURO, { metalness: .8 }), d, -.1 + i * .04, .32, .28); }
// oceano com pôr do sol num aquário (n3)
const ocT = ctex(128, 128, (g, w, h, k = 0) => { const sk = g.createLinearGradient(0, 0, 0, 60); sk.addColorStop(0, "#ff9a5a"); sk.addColorStop(1, "#ffd27a"); g.fillStyle = sk; g.fillRect(0, 0, w, 60); g.fillStyle = "#ffef9a"; g.beginPath(); g.arc(64, 58, 16, Math.PI, 0); g.fill();
  for (let y = 60; y < h; y += 6) { g.fillStyle = `rgb(${20 + y / 3},${80 + y / 4},${140 + y / 5})`; g.fillRect(0, y, w, 6); g.fillStyle = "rgba(255,240,200,.5)"; g.fillRect((Math.sin(y + k) * 30 + 64) | 0, y, 12, 2); } });
const aqua = mesh(new THREE.BoxGeometry(.6, .5, .5), [vidM, vidM, vidM, vidM, new THREE.MeshBasicMaterial({ map: ocT }), vidM], PED.n3.userData.dentro, 0, .3, 0);
// cérebro de fios/rede neural (n2)
const NOS = []; { const d = PED.n2.userData.dentro, nM = E("#7cf2c8", 1.2); for (let i = 0; i < 9; i++) NOS.push(mesh(new THREE.SphereGeometry(.05, 10, 8), nM, d, -.25 + (i % 3) * .25, .15 + Math.floor(i / 3) * .2, 0));
  for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) { const p = NOS[a + 3].position.clone(), q = NOS[b].position.clone(); const l = mesh(new THREE.CylinderGeometry(.006, .006, p.distanceTo(q), 4), M(OURO), d); l.position.copy(p.clone().add(q).multiplyScalar(.5)); l.lookAt(q); l.rotateX(Math.PI / 2); } }
// maquininha de recibo (n1) + papel com o rosto do mascote
const IMP = new THREE.Group(); G1.add(IMP); IMP.position.set(-.2, 0, -.6); box(.9, 1.0, .9, M("#f3ead6"), IMP, 0, .5, 0); box(.6, .35, .45, M("#2b2b2b", { roughness: .3 }), IMP, 0, 1.18, 0); const ledI = box(.06, .04, .02, E("#4dff9a", 3), IMP, .2, 1.25, .23);
const recT = ctex(128, 256, (g, w, h) => { g.fillStyle = "#fffdf5"; g.fillRect(0, 0, w, h); g.fillStyle = "#d0623a"; g.fillRect(24, 40, 80, 60); g.fillStyle = "#111"; g.fillRect(44, 56, 8, 22); g.fillRect(76, 56, 8, 22); for (let i = 0; i < 4; i++) g.fillRect(30 + i * 20, 100, 10, 18);
  g.fillStyle = "#555"; g.font = "700 14px SG"; g.textAlign = "center"; g.fillText("OBRIGADO", 64, 150); g.fillText("PELA ESTRELA ★", 64, 170); for (let i = 0; i < 3; i++) g.fillRect(20, 190 + i * 14, 88 - i * 18, 4); });
const REC = mesh(new THREE.PlaneGeometry(.36, .72), new THREE.MeshStandardMaterial({ map: recT, side: THREE.DoubleSide }), IMP, 0, 1.4, .1); REC.castShadow = false;
// ---------- mascote: luvas brancas (pontas dos braços); polir as redomas ----------
for (const b of MAS.bracos) { const s = b === MAS.bracos[0] ? -1 : 1; box(.2, .24, .32, M("#ffffff", { roughness: .8 }), b, s * .32, 0, 0); }
const MX = -1.35, MZ = .45;
const pole = lt => { const k = Math.sin(lt * 9); pose(MAS, { x: MX + .35, z: MZ, y: hop(lt, .5, .03), ry: .7, braco: [.5, 1.3 + k * .35], piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(lt * 4.5) * .04; };
const olha = (lt, ry = .4) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .5 + Math.sin(lt * 2) * .1], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .24), ry: .3, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
// gancho: 4 redomas enfileiradas com pano por cima (mistério) e uma placa de "NÃO SERVE PRA NADA"
const GG = grupo("gancho"); const PANOS = [-1.0, .2, 1.4].map(x => { const g = new THREE.Group(); g.position.set(x, 0, -1.2); GG.add(g); box(.8, 1.0, .8, M("#f3ead6"), g, 0, .5, 0); const p = mesh(new THREE.ConeGeometry(.55, 1.2, 4), M(VINHO, { roughness: .9 }), g, 0, 1.6, 0); p.rotation.y = Math.PI / 4; return g; });
grupo("cta");
let HS = 0;
// ---------- plongée / contra-plongée ----------
const PL = [V(.1, 3.6, 6.0), V(-.1, 1.1, -.8)], CP = [V(-.2, .8, 5.8), V(-.1, 1.7, -.8)];
const SHOTS = { gancho: [CP, PL], n5: [PL, CP], n4: [CP, PL], n3: [PL, CP], n2: [CP, PL], n1: [[V(.2, 1.7, 4.4), V(-.2, 1.4, -.6)], [V(.4, 2.6, 5.4), V(-.2, 1.2, -.6)]], cta: [PL, PL] };
const ACT = {
  gancho(lt) { PANOS.forEach((g, i) => g.children[1].rotation.z = Math.sin(lt * 2 + i) * .05); olha(lt, .3); },
  n5(lt) { PED.n5.userData.dentro.rotation.y = lt * .6; pole(lt); },
  n4(lt) { PED.n4.userData.dentro.rotation.y = lt * .6; pole(lt); },
  n3(lt) { ocT.draw(lt * 4); PED.n3.userData.dentro.rotation.y = Math.sin(lt * .6) * .5; pole(lt); },
  n2(lt) { NOS.forEach((n, i) => n.material.emissiveIntensity = .6 + Math.max(0, Math.sin(lt * 6 - i)) * 2); PED.n2.userData.dentro.rotation.y = lt * .4; pole(lt); },
  n1(lt) { const k = eo(lin(lt, .6, 2.6)); REC.position.y = 1.4 + k * .4; REC.scale.y = .2 + .8 * k; REC.position.z = .1 + k * .15; ledI.material.emissiveIntensity = 2 + Math.sin(lt * 20) * 1.5; if (lt < 2.6) olha(lt, .6); else feliz(lt); },
  cta(lt) { feliz(lt); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, ITENS } = C; const GY3 = 620; let CAB = null;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `700 ${f}px SG`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const fmtP = n => Math.round(n).toLocaleString("pt-BR");
  const carimbo = (txt, x, y, lt, cor) => { const k = lin(lt, .1, .35); if (k <= 0) return; const s = 1 + (1 - eo(k)) * 1.6; X.save(); X.translate(x, y); X.rotate(-.07); X.scale(s, s); X.globalAlpha = Math.min(1, k * 1.5);
    X.font = `700 ${cabe(62, txt, 520)}px SG`; const w = X.measureText(txt).width + 50; X.strokeStyle = cor; X.lineWidth = 8; X.strokeRect(-w / 2, -48, w, 96); X.fillStyle = cor; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(txt, 0, 4); X.restore(); X.globalAlpha = 1; };
  const U = {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 60], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(241,228,207,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (CAB && nome !== "gancho" && nome !== "cta") U.cab2(...CAB); CAB = null; },
    etiqueta(t, nome) { // placa de museu (latão com moldura)
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); const gr = X.createLinearGradient(0, -130, 0, 130); gr.addColorStop(0, "#e9c25e"); gr.addColorStop(1, "#b98a24"); X.fillStyle = gr; X.beginPath(); X.roundRect(-455, -130, 910, 260, 10); X.fill();
      X.strokeStyle = "#7a5a12"; X.lineWidth = 6; X.strokeRect(-438, -113, 876, 226); [[-425, -100], [425, -100], [-425, 100], [425, 100]].forEach(([x, y]) => { X.fillStyle = "#7a5a12"; X.beginPath(); X.arc(x, y, 8, 0, 7); X.fill(); });
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(56, l1, 820); X.fillText(l1, 0, -34); X.fillStyle = VINHO2; cabe(54, l2, 820); X.fillText(l2, 0, 30); X.fillStyle = "#3a2a10"; cabe(42, l3, 820); X.fillText(l3, 0, 88); X.restore(); },
    cabecalho(s, lt, t) { CAB = [s, lt, t]; },
    cab2(s, lt, t) { const y = 660; X.fillStyle = VINHO; X.beginPath(); X.arc(104, y, 42, 0, 7); X.fill(); X.fillStyle = "#fff"; X.font = "700 48px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag.replace(/\D/g, ""), 104, y + 3);
      carimbo(s.item.toUpperCase(), 420, y, lt, VINHO2);
      const v = s.estrelas * eio(lin(lt, .4, 1.9)); X.fillStyle = "#14080c"; X.beginPath(); X.roundRect(640, 760, 300, 140, 12); X.fill(); X.strokeStyle = OURO; X.lineWidth = 4; X.stroke(); X.fillStyle = OURO; X.font = "400 20px PS"; X.textAlign = "center"; X.fillText("HI-SCORE", 790, 792);
      X.fillStyle = "#fff"; X.font = "700 58px SG"; X.fillText(fmtP(v), 790, 842); X.fillStyle = "#d9c5a0"; X.font = "700 18px SG"; X.fillText("ESTRELAS NO GITHUB", 790, 880); },
    legenda(seg, t) { const ch = C.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 56; X.font = `700 ${fs}px SG`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 640 && fs > 28) { fs -= 2; X.font = `700 ${fs}px SG`; }
      const y = 1405; X.fillStyle = VINHO2; X.fillRect(40, y - 56, 910, 112); X.fillStyle = OURO; X.fillRect(40, y + 48, 910, 8); X.fillStyle = OURO; X.fillRect(60, y - 88, 160, 38); X.fillStyle = TINTA; X.font = "700 22px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("MUSEU AO VIVO", 140, y - 68);
      let x = 505 - tot() / 2; X.font = `700 ${fs}px SG`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? OURO : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 200 + u * 2300, h = w * 1.2;
      X.save(); X.fillStyle = "#1a080e"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 30 * (1 - u) + 6); X.fill("evenodd"); X.strokeStyle = OURO; X.lineWidth = 12; X.beginPath(); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 30 * (1 - u) + 6); X.stroke(); X.restore(); },
    fechamento(lt) { const it = ITENS.slice().reverse(), P = [[it[0], 505, 210, VINHO, 1], [it[1], 245, 140, OURO, 2], [it[2], 765, 100, "#3aa58a", 3]];
      P.forEach(([s, x, h, c, n], i) => { const k = eo(lin(lt, .1 + i * .15, .5 + i * .15)), hh = h * k, base = 1400; X.fillStyle = c; X.fillRect(x - 125, base - hh, 250, hh); X.fillStyle = "rgba(0,0,0,.15)"; X.fillRect(x - 125, base - hh, 250, 14);
        if (k > .6) { X.fillStyle = "#fff"; X.font = "700 80px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(String(n), x, base - hh + 62); X.font = `700 ${cabe(30, s.item, 250)}px SG`; X.lineWidth = 8; X.strokeStyle = TINTA; X.strokeText(s.item, x, base - hh - 30 + Math.sin(lt * 3 + i) * 3); X.fillStyle = "#fff"; X.fillText(s.item, x, base - hh - 30 + Math.sin(lt * 3 + i) * 3); } });
      X.fillStyle = "#3a0a18"; X.fillRect(80, 1400, 850, 14);
      const p = back(lin(lt, .7, 1.1)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 760); X.scale(p, p); X.fillStyle = VINHO; X.beginPath(); X.roundRect(-340, -62, 680, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = "700 64px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore();
      if (lt > 1.1) { X.globalAlpha = eo(lin(lt, 1.1, 1.5)); X.fillStyle = TINTA; X.font = "700 36px SG"; X.textAlign = "center"; X.fillText("Qual você instalaria no PC de casa?", 505, 1462); X.globalAlpha = 1; } },
  }; return U; };
const cores = { LAR: VINHO, VERDE: OURO, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui };
}

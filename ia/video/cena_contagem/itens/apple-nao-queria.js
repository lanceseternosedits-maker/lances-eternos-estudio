// Reel 🆕 contagem "5 projetos que a Apple não queria" (12/11 19:30). Motor da cena_contagem.
// Identidade: jardim murado no fim de tarde: muro alto de tijolo claro com portão trancado, cadeado e a placa "SÓ APARELHOS DA CASA";
// cada projeto é um aparelho genérico (sem logo de ninguém) que PULA O MURO por cima e cai na bancada. Céu coral + verde-placa + creme.
// Nº 1: um celular com um coração-chip brilhando dentro. No fim, os 5 aparelhos sentados em cima do muro.
// Elementos: placa de rua/aeroporto, letras caindo e encaixando, odômetro de rolinhos, tarja de TV, zoom atravessando uma tela,
// plongée/contra-plongée, página de caderno, Archivo Black. Mascote com câmera fotográfica no pescoço; ação: fotografar (flash).
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const CORAL = "#ff6b4a", CORAL2 = "#d9472b", PLACA = "#0b6b3a", PLACA2 = "#084f2b", CREME = "#fff6ea", TINTA = "#13233a", FUNDO = "#fff1e4", AMAR = "#ffc93c", AZ = "#3a7bd5", VERDE = "#3ddc84";
rim.color.set(0xffc2a0); rim.intensity = 1.6; key.color.set(0xfff0e0); key.intensity = 150; key.position.set(-3, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xffe8dc, .6));
// ---------- jardim murado ----------
const ceuT = ctex(512, 256, (g, w, h) => { const sk = g.createLinearGradient(0, 0, 0, h); sk.addColorStop(0, "#ff9a6b"); sk.addColorStop(.6, "#ffd1a3"); sk.addColorStop(1, "#ffe9cf"); g.fillStyle = sk; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,.85)"; g.beginPath(); g.arc(400, 150, 34, 0, 7); g.fill(); g.fillStyle = "#e9a07e"; for (let i = 0; i < 9; i++) g.fillRect(i * 58, 200 - (i * 37) % 60, 44, 60 + (i * 37) % 60); });
mesh(new THREE.PlaneGeometry(28, 12), new THREE.MeshBasicMaterial({ map: ceuT }), S, 0, 5, -5).castShadow = false;
const gT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#9bd67a"; g.fillRect(0, 0, w, h); for (let i = 0; i < 700; i++) { g.fillStyle = i % 2 ? "#aee08e" : "#86c466"; g.fillRect((i * 37) % w, (i * 71) % h, 2, 5); } }); gT.wrapS = gT.wrapT = THREE.RepeatWrapping; gT.repeat.set(6, 4);
const chao = mesh(new THREE.PlaneGeometry(28, 14), new THREE.MeshStandardMaterial({ map: gT, roughness: 1 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
const tijT = ctex(256, 128, (g, w, h) => { g.fillStyle = "#e9e1d6"; g.fillRect(0, 0, w, h); g.strokeStyle = "#c9bcae"; g.lineWidth = 3; for (let y = 0; y < h; y += 21) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); for (let x = (y / 21) % 2 ? 0 : 32; x < w; x += 64) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 21); g.stroke(); } } }); tijT.wrapS = tijT.wrapT = THREE.RepeatWrapping; tijT.repeat.set(3, 2);
const tijM = new THREE.MeshStandardMaterial({ map: tijT, roughness: .85 });
for (const x of [-2.35, 2.35]) box(3.1, 2.3, .4, tijM, S, x, 1.15, -1.8); box(1.6, .5, .4, tijM, S, 0, 2.05, -1.8); box(7.9, .14, .5, M("#d8cdbf"), S, 0, 2.37, -1.8);
// portão trancado + cadeado + placa
const PORT = new THREE.Group(); PORT.position.set(0, 0, -1.8); S.add(PORT); for (let i = 0; i < 7; i++) box(.06, 1.75, .06, M("#2c2c34", { metalness: .7, roughness: .3 }), PORT, -.68 + i * .226, .9, 0); for (const y of [.35, 1.55]) box(1.5, .07, .07, M("#2c2c34", { metalness: .7 }), PORT, 0, y, 0);
const CAD = new THREE.Group(); CAD.position.set(0, .95, .12); PORT.add(CAD); box(.28, .24, .1, M(AMAR, { metalness: .8, roughness: .25 }), CAD, 0, 0, 0); const arco = mesh(new THREE.TorusGeometry(.09, .025, 8, 16, Math.PI), M("#bbb", { metalness: .9 }), CAD, 0, .12, 0);
const plT = ctex(512, 160, g => { g.fillStyle = CORAL2; g.beginPath(); g.roundRect(0, 0, 512, 160, 18); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 8; g.beginPath(); g.roundRect(10, 10, 492, 140, 12); g.stroke(); g.fillStyle = "#fff"; g.font = "400 50px AB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("SÓ APARELHOS", 256, 56); g.fillText("DA CASA", 256, 110); });
const PL = mesh(new THREE.PlaneGeometry(1.5, .47), new THREE.MeshStandardMaterial({ map: plT }), S, 1.95, 1.65, -1.58); PL.castShadow = false;
// bancada onde os aparelhos caem
box(1.9, .08, .9, M("#a8754a", { roughness: .6 }), S, -1.0, .78, -.3); for (const [x, z] of [[-1.85, -.65], [-.15, -.65], [-1.85, .05], [-.15, .05]]) box(.07, .78, .07, M("#7a5232"), S, x, .39, z);
// ---------- aparelhos genéricos (sem logo) ----------
const telaT = (tipo, w = 256, h = 160) => ctex(w, h, g => { g.fillStyle = "#111822"; g.fillRect(0, 0, w, h);
  if (tipo === 5) { g.fillStyle = "#dfe7f2"; g.fillRect(0, 0, w, 14); for (let i = 0; i < 3; i++) { g.fillStyle = "#fff"; g.fillRect(20 + i * 78, 30, 64, 116); g.fillStyle = [VERDE, AZ, CORAL][i]; g.fillRect(20 + i * 78, 30, 64, 16); g.fillStyle = "#ccd"; for (let j = 0; j < 4; j++) g.fillRect(28 + i * 78, 56 + j * 20, 48, 8); } }
  if (tipo === 4) { const sk = g.createLinearGradient(0, 0, w, h); sk.addColorStop(0, "#6a5acd"); sk.addColorStop(1, "#ff8c69"); g.fillStyle = sk; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,.85)"; g.fillRect(0, 0, w, 14); g.fillStyle = "rgba(255,255,255,.6)"; g.beginPath(); g.roundRect(50, h - 30, 156, 24, 10); g.fill(); for (let i = 0; i < 6; i++) { g.fillStyle = [CORAL, AMAR, VERDE, AZ, "#c77dff", "#fff"][i]; g.fillRect(58 + i * 25, h - 26, 18, 16); } }
  if (tipo === 3) { g.fillStyle = "#2b3a67"; g.fillRect(0, 0, w, h); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { g.fillStyle = [CORAL, AMAR, VERDE, AZ, "#c77dff"][(r * 4 + c) % 5]; g.beginPath(); g.roundRect(16 + c * (w - 32) / 4 + 6, 14 + r * (h - 20) / 4, (w - 32) / 4 - 14, (h - 20) / 4 - 10, 8); g.fill(); } }
  if (tipo === 2) { g.fillStyle = "#0b0f0b"; g.fillRect(0, 0, w, h); g.fillStyle = "#3ddc84"; g.font = "700 15px monospace"; ["$ ./mac --start", "booting...", "[ok] desktop"].forEach((s, i) => g.fillText(s, 10, 22 + i * 18)); g.strokeStyle = "#3ddc84"; g.strokeRect(70, 74, 120, 76); g.fillStyle = "rgba(61,220,132,.25)"; g.fillRect(70, 74, 120, 10); g.fillRect(100, 136, 60, 8); }
  if (tipo === 1) { g.fillStyle = "#1a1030"; g.fillRect(0, 0, w, h); const gr = g.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, 80); gr.addColorStop(0, "#ffe08a"); gr.addColorStop(1, "rgba(255,107,74,0)"); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = "#fff"; g.font = "400 22px AB"; g.textAlign = "center"; g.fillText("KERNEL", w / 2, h - 18); } });
const aparelho = (tipo) => { const g = new THREE.Group(); S.add(g); const corpoM = M(tipo === 4 ? "#2b2b33" : tipo === 1 || tipo === 3 ? "#3a3f4b" : "#c7ccd6", { metalness: .5, roughness: .35 });
  if (tipo === 5 || tipo === 4) { box(1.1, .05, .72, corpoM, g, 0, .025, 0); const tp = new THREE.Group(); tp.position.set(0, .05, -.34); tp.rotation.x = -.25; g.add(tp); box(1.1, .72, .04, corpoM, tp, 0, .36, 0); mesh(new THREE.PlaneGeometry(1.0, .62), new THREE.MeshBasicMaterial({ map: telaT(tipo) }), tp, 0, .36, .025).castShadow = false; }
  if (tipo === 3) { const t = box(.86, .6, .05, corpoM, g, -.18, .32, 0); t.rotation.x = -.15; mesh(new THREE.PlaneGeometry(.78, .52), new THREE.MeshBasicMaterial({ map: telaT(3) }), g, -.18, .32, .03).rotation.x = -.15; box(.34, .64, .05, corpoM, g, .48, .34, .05); mesh(new THREE.PlaneGeometry(.29, .56), new THREE.MeshBasicMaterial({ map: telaT(3, 128, 220) }), g, .48, .34, .08).castShadow = false; }
  if (tipo === 2) { box(.95, .7, .06, M("#1d1f24", { roughness: .4 }), g, 0, .4, 0); box(.95, .07, .06, M("#3a3d45"), g, 0, .77, 0); mesh(new THREE.PlaneGeometry(.88, .58), new THREE.MeshBasicMaterial({ map: telaT(2) }), g, 0, .38, .035).castShadow = false; box(.3, .05, .3, M("#1d1f24"), g, 0, .025, .05); }
  if (tipo === 1) { box(.42, .82, .06, corpoM, g, 0, .44, 0); mesh(new THREE.PlaneGeometry(.36, .72), new THREE.MeshBasicMaterial({ map: telaT(1, 128, 256) }), g, 0, .44, .035).castShadow = false; g.userData.cor = mesh(new THREE.SphereGeometry(.09, 16, 12), E(CORAL, 2), g, 0, .48, .08); }
  g.visible = false; return g; };
const AP = { n5: aparelho(5), n4: aparelho(4), n3: aparelho(3), n2: aparelho(2), n1: aparelho(1) };
const NS = ["n5", "n4", "n3", "n2", "n1"];
// pulo por cima do muro: sai de trás (z -3), sobe acima do muro e cai na bancada
const pulaMuro = (g, k, alvo = V(-1.0, .82, -.3)) => { g.visible = k > 0; if (k <= 0) return; const e = eio(Math.min(1, k)), de = V(-1.0, .5, -3.2); g.position.set(de.x + (alvo.x - de.x) * e, de.y + (alvo.y - de.y) * e + Math.sin(Math.min(1, k) * Math.PI) * 2.6, de.z + (alvo.z - de.z) * e); g.rotation.set(0, (1 - e) * 2.5, (1 - e) * .6); const sq = k > .95 && k < 1.25 ? Math.sin((k - .95) / .3 * Math.PI) * .12 : 0; g.scale.set(1 + sq, 1 - sq, 1 + sq); };
const noMuro = (g, i) => { g.visible = true; g.scale.setScalar(.75); g.position.set(-2.6 + i * 1.3, 2.45, -1.75); g.rotation.set(0, Math.sin(i) * .2, 0); };
// ---------- mascote: câmera fotográfica no pescoço; fotografa ----------
const CAM = new THREE.Group(); CAM.position.set(.5, .05, .28); MAS.bracos[1].add(CAM); box(.36, .24, .16, M("#222", { roughness: .4 }), CAM, 0, 0, 0); mesh(new THREE.CylinderGeometry(.08, .09, .12, 16), M("#444", { metalness: .7 }), CAM, 0, 0, .12).rotation.x = Math.PI / 2;
const FLASH = new THREE.PointLight(0xffffff, 0, 6); FLASH.position.set(.4, 1.2, 1); S.add(FLASH);
const MX = 1.05, MZ = .15;
const fotografa = (lt, tFoto = 1.1) => { const u = lt - tFoto, fl = u > 0 && u < .25 ? 1 - u / .25 : 0; FLASH.intensity = fl * 40; pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .02) + (u > 0 && u < .3 ? .05 : 0), ry: -.55, braco: [.35, 1.35 + (u > 0 && u < .2 ? -.15 : 0)], sq: u > 0 && u < .15 ? .04 : 0, piscar: fl > .3 ? .15 : pisca(lt) }); MAS.g.rotation.z = 0; return fl; };
const feliz = lt => { FLASH.intensity = 0; pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .24), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const olha = lt => { FLASH.intensity = 0; pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry: -.4, braco: [.3, .6], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); NS.forEach(n => grupo(n)); grupo("cta");
let FL = 0;
const reset = (lt) => { NS.forEach(n => { AP[n].visible = false; AP[n].scale.setScalar(1); }); CAD.rotation.z = Math.sin(lt * 3) * .06; AP.n1.userData.cor.material.emissiveIntensity = 1.5 + Math.sin(lt * 7) * .8; FL = 0; };
// ---------- plongée / contra-plongée ----------
const BS = { gancho: [V(.2, 4.2, 7.0), V(0, 1.2, -1.0)], n5: [V(-.4, 1.0, 6.4), V(-.4, 1.6, -1.2)], n4: [V(.4, 4.2, 7.0), V(-.4, .8, -.6)], n3: [V(-.6, .9, 6.3), V(-.4, 1.7, -1.2)], n2: [V(.3, 4.3, 7.0), V(-.4, .8, -.6)], n1: [V(-.2, .8, 6.1), V(-.3, 1.7, -1.2)], cta: [V(0, 3.0, 7.6), V(0, 1.5, -1.2)] };
const SHOTS = {}; Object.keys(BS).forEach(n => { const s = [BS[n][0], BS[n][1]]; SHOTS[n] = [s, s]; });
const camera = (cam, nome, lt, d) => { const [p, l] = BS[nome] || BS.cta, u = eio(Math.min(1, lt / d)); cam.position.set(p.x, p.y + (p.y > 2 ? -.4 : .25) * u, p.z - u * .5); cam.lookAt(l.x, l.y, l.z); };
const item = (n, lt) => { reset(lt); pulaMuro(AP[n], lin(lt, .15, 1.05) * 1.3); FL = fotografa(lt, 1.15); };
const ACT = { gancho(lt) { reset(lt); olha(lt); }, cta(lt) { reset(lt); NS.forEach((n, i) => noMuro(AP[n], i)); feliz(lt); } };
NS.forEach(n => ACT[n] = lt => item(n, lt));
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, ITENS, MAXE } = C; const GY3 = 620; let CAB = null;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px AB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const fmtP = n => Math.round(n).toLocaleString("pt-BR");
  const odometro = (v, x, y, lt) => { v = Math.floor(v); const s = String(v).padStart(4, "0"), dw = 62, dh = 88; X.save(); X.translate(x, y); X.fillStyle = "rgba(19,35,58,.92)"; X.beginPath(); X.roundRect(-dw * 2 - 22, -dh / 2 - 46, dw * 4 + 44, dh + 112, 18); X.fill();
    X.fillStyle = "#fff"; X.font = "400 24px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("★ NO GITHUB", 0, -dh / 2 - 22);
    for (let i = 0; i < 4; i++) { const dx = -dw * 2 + i * dw, frac = (v / Math.pow(10, 3 - i)) % 1, dig = +s[i], rolando = i === 3 ? frac : 0; X.save(); X.beginPath(); X.rect(dx + 3, -dh / 2, dw - 6, dh); X.clip(); X.fillStyle = CREME; X.fillRect(dx + 3, -dh / 2, dw - 6, dh);
      X.fillStyle = TINTA; X.font = "400 66px AB"; for (const k of [-1, 0, 1]) X.fillText(String((dig + k + 10) % 10), dx + dw / 2, 4 + (k - rolando) * dh); X.restore();
      X.fillStyle = "rgba(0,0,0,.18)"; X.fillRect(dx + 3, -dh / 2, dw - 6, 12); X.fillRect(dx + 3, dh / 2 - 12, dw - 6, 12); }
    X.fillStyle = AMAR; X.fillRect(-dw * 2, dh / 2 + 14, dw * 4 * Math.min(1, v / MAXE), 10); X.restore(); };
  const cai = (txt, x0, y, lt, t0) => { X.font = `400 ${cabe(84, txt, 760)}px AB`; const fs = parseInt(X.font); let x = x0; for (let i = 0; i < txt.length; i++) { const ch = txt[i], w = X.measureText(ch).width; const k = lin(lt, t0 + i * .045, t0 + i * .045 + .32);
      if (k > 0 && ch !== " ") { X.save(); X.translate(x + w / 2, y - (1 - eo(k)) * 220); X.rotate((1 - eo(k)) * (i % 2 ? .6 : -.6)); X.globalAlpha = Math.min(1, k * 2); X.fillStyle = TINTA; X.font = `400 ${fs}px AB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(ch, 0, 0); X.restore(); } x += w; } };
  const U = {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 60], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(255,241,228,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (FL > 0) { X.fillStyle = `rgba(255,255,255,${FL * .55})`; X.fillRect(0, GY3, 1080, GH); }
      if (CAB && nome !== "gancho" && nome !== "cta") U.cab2(...CAB); CAB = null; },
    etiqueta(t, nome) { // placa de rua/rodovia verde (estática: 1º quadro legível)
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.fillStyle = "#8a8f98"; X.fillRect(-330, 118, 18, 60); X.fillRect(312, 118, 18, 60);
      X.fillStyle = PLACA; X.beginPath(); X.roundRect(-460, -132, 920, 264, 22); X.fill(); X.strokeStyle = "#fff"; X.lineWidth = 7; X.beginPath(); X.roundRect(-446, -118, 892, 236, 14); X.stroke();
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = "#fff"; cabe(60, l1, 840); X.fillText(l1, 0, -36); X.fillStyle = AMAR; cabe(54, l2, 840); X.fillText(l2, 0, 30); X.fillStyle = "#cfeedd"; cabe(46, l3, 760); X.fillText(l3, -30, 92);
      X.fillStyle = "#fff"; X.beginPath(); X.moveTo(380, 76); X.lineTo(420, 76); X.lineTo(420, 62); X.lineTo(446, 84); X.lineTo(420, 106); X.lineTo(420, 92); X.lineTo(380, 92); X.closePath(); X.fill(); X.restore(); },
    cabecalho(s, lt, t) { CAB = [s, lt, t]; },
    cab2(s, lt, t) { const y = 680; X.fillStyle = CORAL; X.beginPath(); X.arc(104, y, 44, 0, 7); X.fill(); X.fillStyle = "#fff"; X.font = "400 56px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag.replace(/\D/g, ""), 104, y + 3);
      cai(s.item, 166, y, lt, .1); odometro(s.estrelas * eio(lin(lt, .4, 1.9)), 770, 880, lt); },
    legenda(seg, t) { const ch = C.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 66; X.font = `400 ${fs}px AB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 780 && fs > 38) { fs -= 2; X.font = `400 ${fs}px AB`; }
      const y = 1405, x0 = 505 - tot() / 2; X.fillStyle = TINTA; X.fillRect(40, y - 56, 910, 112); X.fillStyle = CORAL; X.fillRect(40, y + 48, 910, 8); X.fillStyle = CORAL; X.fillRect(60, y - 90, 250, 40); X.fillStyle = "#fff"; X.font = "400 24px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("AO VIVO DO MURO", 185, y - 70);
      let x = x0; X.font = `400 ${fs}px AB`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? AMAR : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 240 + u * 2300, h = w * .62;
      X.save(); X.fillStyle = "#1d1f24"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 20 * (1 - u) + 4); X.fill("evenodd"); X.restore(); },
    fechamento(lt) { // página de caderno com os 5, riscando ✓
      X.save(); X.translate(505, 960); X.rotate(-.015); X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 24; X.fillStyle = "#fffdf6"; X.fillRect(-430, -300, 860, 560); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(58,123,213,.3)"; X.lineWidth = 2; for (let y = -220; y < 260; y += 80) { X.beginPath(); X.moveTo(-430, y + 40); X.lineTo(430, y + 40); X.stroke(); } X.strokeStyle = "rgba(232,50,60,.5)"; X.beginPath(); X.moveTo(-350, -300); X.lineTo(-350, 260); X.stroke();
      X.fillStyle = TINTA; X.font = "400 46px AB"; X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillText("PULARAM O MURO:", -320, -240);
      ITENS.slice().reverse().forEach((s, i) => { const k = lin(lt, .15 + i * .14, .4 + i * .14); if (k <= 0) return; X.globalAlpha = k; const y = -165 + i * 80; X.fillStyle = CORAL2; X.font = "400 40px AB"; X.fillText((i + 1) + ".", -320, y); X.fillStyle = TINTA; X.font = `400 ${cabe(40, s.item, 420)}px AB`; X.fillText(s.item, -270, y); X.fillStyle = "#7a8596"; X.font = "400 32px AB"; X.textAlign = "right"; X.fillText(fmtP(s.estrelas) + " ★", 400, y); X.textAlign = "left";
        X.strokeStyle = PLACA; X.lineWidth = 7; X.lineCap = "round"; const c = eo(lin(lt, .3 + i * .14, .5 + i * .14)); if (c > 0) { X.beginPath(); X.moveTo(-395, y - 18); X.lineTo(-395 + 14 * Math.min(1, c * 2), y - 18 + 14 * Math.min(1, c * 2)); if (c > .5) X.lineTo(-381 + 26 * (c - .5) * 2, y - 4 - 34 * (c - .5) * 2); X.stroke(); } X.globalAlpha = 1; });
      X.restore();
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 1300); X.scale(p, p); X.fillStyle = CORAL; X.beginPath(); X.roundRect(-300, -60, 600, 120, 60); X.fill(); X.fillStyle = "#fff"; X.font = "400 70px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore();
      if (lt > 1.3) { X.globalAlpha = eo(lin(lt, 1.3, 1.7)); X.fillStyle = "#7a8596"; X.font = "400 30px AB"; X.textAlign = "center"; X.fillText("PROJETOS EXPERIMENTAIS · USE POR SUA CONTA", 505, 1400); X.globalAlpha = 1; } },
  }; return U; };
const cores = { LAR: CORAL, VERDE: PLACA, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

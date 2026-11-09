// Reel 🆕 contagem "3 programas grátis pra fazer música" (LYNX SHARE, Lemon Studio, onkey; 13/11 06:00). Motor da cena_contagem.
// Identidade: pista de patinação retrô de manhã cedo: piso de madeira clara com faixas coloridas, globo espelhado, caixas de som gigantes,
// fitas cassete no chão. Cada item é um objeto que se monta na pista: nº 3 = mesa de pads acendendo em grade; nº 2 = mesa de som
// com faders subindo e ondas na tela; nº 1 = microfone de pedestal com notas musicais saindo em arco. Menta + rosa-chiclete + amarelo.
// Elementos: papel rasgado com fita, nome escrito à mão, placar HI-SCORE, tarja de TV, zoom atravessando uma tela, travelling lateral,
// pódio, Fraunces. Mascote de patins e munhequeira; ação principal: patinar em volta dos objetos.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const MENTA = "#3fd6b0", MENTA2 = "#169b7c", ROSA = "#ff5fa2", AMAR = "#ffd23f", TINTA = "#1d1530", FUNDO = "#f2fbf8", PAP = "#fffaf0", ROXO = "#7b4bd6";
rim.color.set(0xffd9ef); rim.intensity = 1.5; key.color.set(0xffffff); key.intensity = 150; key.position.set(2, 9, 6); key.target.position.set(0, .8, -.3);
S.add(new THREE.AmbientLight(0xf4fff9, .6));
// ---------- pista ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#e9fbf5"; g.fillRect(0, 0, w, h); ["#ff5fa2", "#ffd23f", "#3fd6b0", "#7b4bd6"].forEach((c, i) => { g.fillStyle = c; g.fillRect(0, 150 + i * 16, w, 10); }); g.fillStyle = "rgba(29,21,48,.08)"; for (let x = 0; x < w; x += 40) g.fillRect(x, 0, 2, 140); });
mesh(new THREE.PlaneGeometry(24, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -3.2).castShadow = false;
const mT = ctex(256, 256, (g, w, h) => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? "#e8c896" : "#dcb983"; g.fillRect(0, i * 16, w, 16); } g.strokeStyle = "rgba(0,0,0,.08)"; for (let i = 0; i < 16; i++) { g.beginPath(); g.moveTo((i * 73) % w, i * 16); g.lineTo((i * 73) % w, i * 16 + 16); g.stroke(); } }); mT.wrapS = mT.wrapT = THREE.RepeatWrapping; mT.repeat.set(6, 4);
const chao = mesh(new THREE.PlaneGeometry(24, 14), new THREE.MeshStandardMaterial({ map: mT, roughness: .35, metalness: .05 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
const anel = mesh(new THREE.RingGeometry(2.7, 2.85, 64), new THREE.MeshBasicMaterial({ color: ROSA }), S, 0, .006, -.2); anel.rotation.x = -Math.PI / 2; anel.castShadow = false;
// globo espelhado
const GLOBO = mesh(new THREE.IcosahedronGeometry(.45, 2), M("#e8eef6", { metalness: .35, roughness: .2, flatShading: true, emissive: "#9fb4d0", emissiveIntensity: .35 }), S, .2, 3.5, -1.2); box(.02, .9, .02, M("#888"), S, .2, 4.2, -1.2);
// caixas de som gigantes nas laterais
const CX = [-3.0, 3.0].map(x => { const g = new THREE.Group(); g.position.set(x, 0, -1.6); S.add(g); box(1.1, 2.0, .8, M(TINTA, { roughness: .6 }), g, 0, 1.0, 0); const cones = [1.45, .6].map((y, i) => mesh(new THREE.CylinderGeometry(i ? .36 : .24, i ? .36 : .24, .06, 24), M("#333", { metalness: .5 }), g, 0, y, .41)); cones.forEach(c => c.rotation.x = Math.PI / 2); return { g, cones }; });
// fitas cassete no chão
for (let i = 0; i < 5; i++) { const f = new THREE.Group(); f.position.set(-2.4 + i * 1.2, .03, 1.4 - (i % 2) * .4); f.rotation.y = i * .7; S.add(f); box(.5, .05, .32, M([ROSA, AMAR, MENTA, ROXO, "#fff"][i]), f, 0, 0, 0); box(.3, .055, .12, M("#222"), f, 0, .003, 0); }
// ---------- objetos de cada item ----------
const G3 = new THREE.Group(), G2 = new THREE.Group(), G1 = new THREE.Group(); [G3, G2, G1].forEach(g => { g.position.set(-.9, 0, -.4); S.add(g); });
// nº 3: mesa de pads 4×4
box(1.5, .8, .9, M("#2b2140"), G3, 0, .4, 0); const PADS = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) PADS.push(box(.28, .05, .16, E([ROSA, AMAR, MENTA, ROXO][(r + c) % 4], .1), G3, -.48 + c * .32, .83, -.3 + r * .2));
// nº 2: mesa de som com faders e tela de ondas
box(1.6, .75, .9, M("#3a3f4b"), G2, 0, .38, 0); const FAD = []; for (let i = 0; i < 8; i++) { box(.03, .02, .5, M("#111"), G2, -.6 + i * .17, .76, .1); FAD.push(box(.1, .06, .08, M(i % 2 ? AMAR : "#eee"), G2, -.6 + i * .17, .79, .1)); }
const ondC = document.createElement("canvas"); ondC.width = 256; ondC.height = 128; const ondG = ondC.getContext("2d"); const ondT = new THREE.CanvasTexture(ondC); ondT.colorSpace = THREE.SRGBColorSpace;
box(1.2, .62, .06, M("#111"), G2, 0, 1.15, -.38); mesh(new THREE.PlaneGeometry(1.12, .54), new THREE.MeshBasicMaterial({ map: ondT }), G2, 0, 1.15, -.345).castShadow = false;
const desOnda = t => { ondG.fillStyle = "#0e0a1c"; ondG.fillRect(0, 0, 256, 128); [MENTA, ROSA, AMAR].forEach((c, k) => { ondG.fillStyle = c; for (let x = 0; x < 256; x += 3) { const a = Math.abs(Math.sin(x * .09 + t * 4 + k) * Math.sin(x * .023 + k)) * 16 + 2; ondG.fillRect(x, 22 + k * 40 - a / 2, 2, a); } }); ondG.fillStyle = "#fff"; ondG.fillRect((t * 60) % 256, 0, 2, 128); ondT.needsUpdate = true; };
// nº 1: microfone de pedestal + notas
box(.06, 1.4, .06, M("#999", { metalness: .8 }), G1, .1, .7, 0); mesh(new THREE.CylinderGeometry(.35, .35, .04, 20), M("#444", { metalness: .6 }), G1, .1, .02, 0); const cab = mesh(new THREE.SphereGeometry(.17, 16, 12), M("#cfd6df", { metalness: .9, roughness: .3 }), G1, .1, 1.5, .05);
const notaT = ctex(64, 64, g => { g.fillStyle = ROSA; g.font = "700 56px FR"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("♪", 32, 34); });
const NOTAS = [0, 1, 2, 3, 4, 5].map(i => { const m = mesh(new THREE.PlaneGeometry(.36, .36), new THREE.MeshBasicMaterial({ map: notaT, transparent: true, side: THREE.DoubleSide, color: [ROSA, ROXO, MENTA2][i % 3] }), S); m.castShadow = false; return m; });
// ---------- mascote: patins + munhequeira; patina ----------
const PAT = MAS.pernas.map((p, i) => { const r = mesh(new THREE.CylinderGeometry(.06, .06, .05, 10), M(i % 2 ? ROSA : AMAR), MAS.g, p.position.x, .05, .1); r.rotation.z = Math.PI / 2; return r; });
const MUN = box(.08, .2, .32, M(MENTA2), MAS.bracos[1], .3, 0, 0);
const MZ = .7;
const patina = (lt, x0, x1, d = 1.4) => { const k = eio(lin(lt, 0, d)), x = x0 + (x1 - x0) * k, mov = k > 0 && k < 1; pose(MAS, { x, z: MZ + Math.sin(k * Math.PI) * .25, y: hop(lt, .5, .03), ry: mov ? Math.sign(x1 - x0) * .7 : -.3, braco: mov ? [1.0 + Math.sin(lt * 5) * .4, 1.0 - Math.sin(lt * 5) * .4] : [.4, .6], piscar: pisca(lt) }); MAS.g.rotation.z = mov ? -Math.sign(x1 - x0) * .12 : 0; };
const feliz = (lt, x) => { pose(MAS, { x, z: MZ, y: hop(lt, .35, .22), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const NS = ["gancho", "n3", "n2", "n1", "cta"]; NS.forEach(n => grupo(n));
const reset = (lt) => { [G3, G2, G1].forEach(g => g.visible = false); NOTAS.forEach(m => m.visible = false); GLOBO.rotation.y = lt * .8; CX.forEach(c => c.cones.forEach((k, i) => k.scale.setScalar(1 + Math.max(0, Math.sin(lt * 12 + i)) * .06))); };
const surge = (g, k) => { g.visible = k > .01; g.scale.setScalar(Math.max(.01, back(k))); };
// ---------- travelling lateral ----------
const TR = { gancho: [-1.4, .4], n3: [1.0, -.6], n2: [-1.0, .4], n1: [.8, -.4], cta: [-.4, .3] };
const SHOTS = {}; NS.forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a, b] = TR[nome] || TR.cta, x = a + (b - a) * eio(lt / d); cam.position.set(x, 2.2, 6.4); cam.lookAt(x * .45 - .2, 1.2, -.6); };
let HS = 0;
const ACT = {
  gancho(lt, d) { reset(lt); HS = 0; patina(lt, -2.4, .9, 1.6); },
  n3(lt, d) { reset(lt); surge(G3, lin(lt, .2, .6)); PADS.forEach((p, i) => p.material.emissiveIntensity = (Math.floor(lt * 6) + i * 5) % 7 < 2 ? 1.6 : .1); patina(lt, 1.6, .9, 1.0); },
  n2(lt, d) { reset(lt); surge(G2, lin(lt, .2, .6)); FAD.forEach((f, i) => f.position.z = .1 - Math.max(0, Math.sin(lt * 2 + i * .6)) * .2); desOnda(lt); patina(lt, -1.8, .9, 1.0); },
  n1(lt, d) { reset(lt); surge(G1, lin(lt, .2, .6)); NOTAS.forEach((m, i) => { const u = (lt * .5 + i / 6) % 1; m.visible = lt > .6; m.position.set(-.8 + u * 1.6, 1.6 + Math.sin(u * Math.PI) * .9, -.35); m.rotation.z = Math.sin(lt * 3 + i) * .3; m.material.opacity = Math.sin(u * Math.PI); m.material.transparent = true; }); cab.scale.setScalar(1 + Math.sin(lt * 10) * .04); patina(lt, 1.8, .9, 1.0); },
  cta(lt, d) { reset(lt); G1.visible = true; G1.scale.setScalar(1); feliz(lt, .9); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, ITENS, MAXE } = C; const GY3 = 620; let CAB = null;
  const cabe = (f, txt, mx, peso = 900) => { while (f > 20) { X.font = `${peso} ${f}px FR`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const fmtP = n => Math.round(n).toLocaleString("pt-BR");
  const rasgado = (x, y, w, h, s) => { X.beginPath(); X.moveTo(x, y); for (let i = 0; i <= 40; i++) X.lineTo(x + w * i / 40, y + ((i * 7 + s) % 5) * 2.4 - 4); for (let i = 0; i <= 40; i++) X.lineTo(x + w - w * i / 40, y + h + ((i * 11 + s) % 6) * 2.6 - 6); X.closePath(); };
  const U = {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 60], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(242,251,248,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (CAB && nome !== "gancho" && nome !== "cta") U.cab2(...CAB); CAB = null; },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(-.014); X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 16; X.shadowOffsetY = 6; X.fillStyle = PAP; rasgado(-450, -122, 900, 244, 5); X.fill(); X.shadowColor = "transparent";
      X.fillStyle = "rgba(255,95,162,.55)"; for (const [x, r] of [[-405, -.5], [405, .5]]) { X.save(); X.translate(x, -114); X.rotate(r); X.fillRect(-70, -18, 140, 36); X.restore(); }
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(56, l1, 840); X.fillText(l1, 0, -30); X.fillStyle = MENTA2; cabe(58, l2, 840); X.fillText(l2, 0, 34); X.fillStyle = ROSA; cabe(46, l3, 840); X.fillText(l3, 0, 92); X.restore(); },
    cabecalho(s, lt, t) { CAB = [s, lt, t]; },
    cab2(s, lt, t) { const y = 680; X.fillStyle = ROSA; X.beginPath(); X.arc(104, y, 44, 0, 7); X.fill(); X.fillStyle = "#fff"; X.font = "900 56px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag.replace(/\D/g, ""), 104, y + 3);
      const p = eio(lin(lt, .12, .9)); X.save(); let fn = 96; X.font = `700 ${fn}px CV`; while (X.measureText(s.item).width > 400 && fn > 50) { fn -= 4; X.font = `700 ${fn}px CV`; } X.textAlign = "left"; const w = X.measureText(s.item).width; X.beginPath(); X.rect(160, y - 80, w * p + 6, 150); X.clip(); X.fillStyle = TINTA; X.fillText(s.item, 164, y + 26); X.restore();
      const v = s.estrelas * eio(lin(lt, .4, 1.9)); X.fillStyle = "#120c22"; X.beginPath(); X.roundRect(600, 760, 340, 160, 14); X.fill(); X.strokeStyle = AMAR; X.lineWidth = 5; X.stroke(); X.fillStyle = AMAR; X.font = "400 24px PS"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("HI-SCORE", 770, 796);
      X.fillStyle = "#fff"; X.font = "900 70px FR"; X.fillText(fmtP(v), 770, 852); X.fillStyle = "#ffd6ea"; X.font = "700 22px FR"; X.fillText("★ ESTRELAS NO GITHUB", 770, 896); },
    legenda(seg, t) { const ch = C.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 70; X.font = `900 ${fs}px FR`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 780 && fs > 38) { fs -= 2; X.font = `900 ${fs}px FR`; }
      const y = 1405, x0 = 505 - tot() / 2; X.fillStyle = TINTA; X.fillRect(40, y - 56, 910, 112); X.fillStyle = MENTA; X.fillRect(40, y + 48, 910, 8); X.fillStyle = ROSA; X.fillRect(60, y - 90, 230, 40); X.fillStyle = "#fff"; X.font = "700 24px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("RÁDIO DA PISTA", 175, y - 70);
      let x = x0; X.font = `900 ${fs}px FR`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? AMAR : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 240 + u * 2300, h = w * .62;
      X.save(); X.fillStyle = "#120c22"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 20 * (1 - u) + 4); X.fill("evenodd"); X.restore(); },
    fechamento(lt) { // pódio dos 3 + COMENTA
      X.fillStyle = "rgba(242,251,248,.85)"; X.fillRect(0, 640, 1080, 860);
      const it = ITENS.slice().reverse(), P = [[it[0], 505, 300, ROSA, 1], [it[1], 245, 210, MENTA2, 2], [it[2], 765, 150, ROXO, 3]];
      P.forEach(([s, x, h, c, n], i) => { const k = eo(lin(lt, .1 + i * .15, .5 + i * .15)), hh = h * k, base = 1290; X.fillStyle = c; X.fillRect(x - 125, base - hh, 250, hh); X.fillStyle = "rgba(0,0,0,.2)"; X.fillRect(x - 125, base - hh, 250, 14);
        if (k > .6) { X.fillStyle = "#fff"; X.font = "900 76px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(n + "º", x, base - hh + 64); X.fillStyle = TINTA; X.font = `900 ${cabe(40, s.item, 240)}px FR`; X.fillText(s.item, x, base - hh - 70); X.fillStyle = "#6a6a80"; X.font = "700 30px FR"; X.fillText(fmtP(s.estrelas) + " ★", x, base - hh - 30); } });
      X.fillStyle = TINTA; X.fillRect(80, 1290, 850, 14);
      const p = back(lin(lt, .7, 1.1)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 760); X.scale(p, p); X.fillStyle = ROSA; X.beginPath(); X.roundRect(-320, -62, 640, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = `900 ${cabe(70, "Comenta " + CHAVE, 580)}px FR`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 4); X.restore();
      if (lt > 1.1) { X.globalAlpha = eo(lin(lt, 1.1, 1.5)); X.fillStyle = TINTA; X.font = "700 40px FR"; X.textAlign = "center"; X.fillText("Qual música você gravaria primeiro?", 505, 1360); X.globalAlpha = 1; } },
  }; return U; };
const cores = { LAR: ROSA, VERDE: MENTA2, FUNDO, CREME: PAP, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

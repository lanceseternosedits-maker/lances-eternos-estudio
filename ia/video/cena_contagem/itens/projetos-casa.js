// Reel 🆕 contagem "3 projetos que deixam sua casa esperta" (House Control, CleanFrame, Photo Frame Dashboard; 14/11 11:00).
// Identidade: sala de estar de domingo à tarde, luz de janela: sofá, mesinha de centro com uma maquete da casa (as luzinhas acendem
// quando o celular toca nela), TV-quadro na parede (a tela troca de bagunçada para limpa) e um porta-retrato digital na estante que vira
// painel com clima e agenda. O mascote empacota os controles remotos velhos numa caixa. Terracota + verde-petróleo + creme.
// Sem logo de marca. Elementos: papel rasgado com fita, nome em split-flap, velocímetro, tarja de TV, zoom atravessando uma tela,
// órbita, tela CONTINUE?, Archivo Black. Mascote de fita crepe no pulso; ação principal: empacotar.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const TERRA = "#c8643c", TERRA2 = "#8f3f22", PET = "#1f5f63", PET2 = "#123c3f", CREME = "#fff6e8", TINTA = "#1f1a17", FUNDO = "#f8f1e6", AMAR = "#ffcf5a", LUZ = "#ffe9a8";
rim.color.set(0xffe0c0); rim.intensity = 1.4; key.color.set(0xfff2e0); key.intensity = 150; key.position.set(-3, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xfff2e6, .6));
// ---------- sala ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#efe2cf"; g.fillRect(0, 0, w, h); g.fillStyle = "#d9c7ae"; g.fillRect(0, 196, w, 60); g.fillStyle = "#bfe0f0"; g.fillRect(30, 40, 110, 120); g.fillStyle = "#fff"; g.fillRect(83, 40, 4, 120); g.fillRect(30, 98, 110, 4); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const mT = ctex(256, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#b98a5e" : "#a87a50"; g.fillRect(0, i * 32, w, 32); } }); mT.wrapS = mT.wrapT = THREE.RepeatWrapping; mT.repeat.set(5, 4);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: mT, roughness: .6 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
const tap = mesh(new THREE.PlaneGeometry(4, 2.4), M("#e9d9bf", { roughness: 1 }), S, 0, .005, .1); tap.rotation.x = -Math.PI / 2; tap.castShadow = false;
// sofá
const SOF = new THREE.Group(); SOF.position.set(-2.4, 0, -1.9); S.add(SOF); box(1.8, .45, .8, M(PET, { roughness: .9 }), SOF, 0, .32, 0); box(1.8, .6, .2, M(PET, { roughness: .9 }), SOF, 0, .75, -.32); for (const s of [-1, 1]) box(.2, .55, .8, M(PET2, { roughness: .9 }), SOF, s * .9, .45, 0);
// TV-quadro na parede (CleanFrame)
const tvC = document.createElement("canvas"); tvC.width = 384; tvC.height = 216; const tg = tvC.getContext("2d"); const tvT = new THREE.CanvasTexture(tvC); tvT.colorSpace = THREE.SRGBColorSpace;
const TV = new THREE.Group(); TV.position.set(.3, 2.35, -2.74); S.add(TV); box(2.0, 1.2, .06, M("#d8c7a8", { roughness: .7 }), TV, 0, 0, 0); mesh(new THREE.PlaneGeometry(1.86, 1.05), new THREE.MeshBasicMaterial({ map: tvT }), TV, 0, 0, .035).castShadow = false;
const desTV = (k, t) => { tg.fillStyle = "#222"; tg.fillRect(0, 0, 384, 216); if (k < 1) { for (let i = 0; i < 24; i++) { tg.fillStyle = ["#e5484d", "#3a7bd5", "#ffcf5a", "#2fb36b", "#9b59b6"][i % 5]; tg.fillRect(10 + (i % 6) * 62, 14 + Math.floor(i / 6) * 50, 54, 40); } tg.fillStyle = "rgba(0,0,0,.4)"; tg.fillRect(0, 0, 384, 216); }
  if (k > 0) { tg.globalAlpha = k; const gr = tg.createLinearGradient(0, 0, 384, 216); gr.addColorStop(0, "#f5d6b3"); gr.addColorStop(1, "#c8643c"); tg.fillStyle = gr; tg.fillRect(0, 0, 384, 216); tg.fillStyle = "rgba(31,95,99,.85)"; tg.beginPath(); tg.arc(260, 90, 46, 0, 7); tg.fill(); tg.fillStyle = "#fff"; tg.font = "400 22px AB"; tg.fillText("só o que importa", 20, 196); tg.globalAlpha = 1; } tvT.needsUpdate = true; };
// estante com porta-retrato digital (nº 1)
box(1.4, .06, .4, M("#8a5a33"), S, 2.3, 1.3, -2.5); box(1.4, .06, .4, M("#8a5a33"), S, 2.3, .6, -2.5); for (const x of [1.62, 2.98]) box(.06, 1.4, .4, M("#7a4e2c"), S, x, .7, -2.5);
const pfC = document.createElement("canvas"); pfC.width = 256; pfC.height = 192; const pg = pfC.getContext("2d"); const pfT = new THREE.CanvasTexture(pfC); pfT.colorSpace = THREE.SRGBColorSpace;
const PF = new THREE.Group(); PF.position.set(2.3, 1.62, -2.45); PF.rotation.x = -.08; S.add(PF); box(.9, .66, .06, M("#2a2a2a"), PF, 0, 0, 0); mesh(new THREE.PlaneGeometry(.82, .58), new THREE.MeshBasicMaterial({ map: pfT }), PF, 0, 0, .035).castShadow = false;
const desPF = (k, t) => { pg.fillStyle = "#cfe0ea"; pg.fillRect(0, 0, 256, 192); pg.fillStyle = "#7aa36b"; pg.fillRect(0, 120, 256, 72); pg.fillStyle = "#ffe08a"; pg.beginPath(); pg.arc(200, 50, 22, 0, 7); pg.fill();
  if (k > 0) { pg.globalAlpha = k; pg.fillStyle = PET2; pg.fillRect(0, 0, 256, 192); [["24°", AMAR], ["15h dentista", "#fff"], ["mercado ✓", "#9fe3b0"], ["ônibus 6 min", "#ffd2c2"]].forEach(([s, c], i) => { pg.fillStyle = "rgba(255,255,255,.12)"; pg.fillRect(10 + (i % 2) * 124, 12 + Math.floor(i / 2) * 90, 112, 78); pg.fillStyle = c; pg.font = `400 ${i ? 18 : 40}px AB`; pg.fillText(s, 20 + (i % 2) * 124, 60 + Math.floor(i / 2) * 90); }); pg.globalAlpha = 1; } pfT.needsUpdate = true; };
// mesinha + maquete da casa (nº 3) + celular
box(1.4, .06, .8, M("#8a5a33", { roughness: .5 }), S, -.5, .5, -.4); for (const [x, z] of [[-1.1, -.7], [.1, -.7], [-1.1, -.1], [.1, -.1]]) box(.05, .5, .05, M("#6b4426"), S, x, .25, z);
const CASA = new THREE.Group(); CASA.position.set(-.6, .53, -.45); S.add(CASA); box(.6, .3, .45, M("#f4efe6"), CASA, 0, .15, 0); const tel = mesh(new THREE.ConeGeometry(.45, .25, 4), M(TERRA, { roughness: .6 }), CASA, 0, .42, 0); tel.rotation.y = Math.PI / 4;
const JAN = [[-.15, .17], [.15, .17]].map(([x, y]) => box(.1, .1, .02, E(LUZ, 0), CASA, x, y, .23));
const CEL = new THREE.Group(); S.add(CEL); box(.22, .42, .03, M("#222"), CEL, 0, 0, 0); const telaC = box(.19, .38, .01, E("#bfe8ff", .6), CEL, 0, 0, .02);
// controles remotos velhos + caixa
const CX = new THREE.Group(); CX.position.set(1.6, 0, .4); S.add(CX); const pap = M("#c89b63", { roughness: .9 }); box(.8, .45, .6, pap, CX, 0, .23, 0); const abas = [-1, 1].map(s => { const a = box(.8, .02, .3, pap, CX, 0, .46, s * .3); return a; });
const CTRLS = [0, 1, 2].map(i => box(.12, .04, .42, M(["#333", "#555", "#2b2b3b"][i]), S, 0, 0, 0));
// ---------- mascote: fita crepe no pulso; empacota ----------
const FITA = mesh(new THREE.TorusGeometry(.12, .04, 8, 16), M("#e8d9a8", { roughness: .8 }), MAS.bracos[1], .3, 0, 0); FITA.rotation.y = Math.PI / 2;
const MX = .7, MZ = .7;
const empacota = (lt, k) => { const s = Math.sin(lt * 5); pose(MAS, { x: MX + .2, z: MZ, y: hop(lt, .5, .03), ry: .55, braco: [.7 + s * .3, .9 - s * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0;
  CTRLS.forEach((c, i) => { const u = Math.max(0, Math.min(1, k * 1.5 - i * .25)); c.visible = u < 1; c.position.set(1.0 + i * .12 + (1.6 - 1.0) * eio(u), .03 + Math.sin(u * Math.PI) * .6, .9 - .5 * eio(u)); c.rotation.set(0, i * .4 + u * 2, 0); }); abas.forEach((a, i) => a.rotation.x = (i ? -1 : 1) * eio(Math.max(0, k - .8) * 5) * 1.4); };
const olha = (lt, ry = -.3) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .6], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .22), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const NS = ["gancho", "n3", "n2", "n1", "cta"]; NS.forEach(n => grupo(n));
const reset = (lt) => { CEL.visible = false; JAN.forEach(j => j.material.emissiveIntensity = 0); desTV(0, lt); desPF(0, lt); CTRLS.forEach(c => c.visible = false); abas.forEach((a, i) => a.rotation.x = 0); };
// ---------- órbita ----------
const ORB = { gancho: [-.3, .1, 7.6, 2.4, V(.4, 1.2, -.4)], n3: [.2, -.15, 6.6, 2.3, V(-.4, 1.0, -.4)], n2: [-.2, .1, 7.2, 2.6, V(.3, 1.8, -1.0)], n1: [.3, .05, 7.0, 2.4, V(1.4, 1.4, -1.0)], cta: [.05, -.1, 7.8, 2.4, V(.4, 1.3, -.6)] };
const SHOTS = {}; NS.forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a0, a1, r, y, l] = ORB[nome] || ORB.cta, a = a0 + (a1 - a0) * eio(lt / d); cam.position.set(l.x + Math.sin(a) * r, y, l.z + Math.cos(a) * r); cam.lookAt(l); };
const ACT = {
  gancho(lt, d) { reset(lt); empacota(lt, lin(lt, .2, d)); },
  n3(lt, d) { reset(lt); CEL.visible = true; const tap_ = Math.floor(lt * 1.3) % 2; CEL.position.set(-.35, 1.2 + Math.sin(lt * 2) * .04, -.15); CEL.rotation.set(-.6, .2, 0); JAN.forEach((j, i) => j.material.emissiveIntensity = (lt > .8 && (i === tap_ || lt > 2.4)) ? 2.2 : 0); telaC.material.emissiveIntensity = .6 + tap_ * .4; pose(MAS, { x: 1.1, z: .6, y: hop(lt, .8, .03), ry: -.6, braco: [.3, .6], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
  n2(lt, d) { reset(lt); JAN.forEach(j => j.material.emissiveIntensity = 2.2); desTV(eio(lin(lt, .8, 1.6)), lt); olha(lt, -.1); },
  n1(lt, d) { reset(lt); JAN.forEach(j => j.material.emissiveIntensity = 2.2); desTV(1, lt); desPF(eio(lin(lt, .8, 1.6)), lt); lt > 1.6 ? feliz(lt) : olha(lt, .4); },
  cta(lt, d) { reset(lt); JAN.forEach(j => j.material.emissiveIntensity = 2.2); desTV(1, lt); desPF(1, lt); pose(MAS, { x: .5, z: 1.6, y: hop(lt, .35, .2), ry: -.15, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, ITENS, MAXE } = C; const GY3 = 620; let CAB = null;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px AB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const fmtP = n => Math.round(n).toLocaleString("pt-BR");
  const rasgado = (x, y, w, h, s) => { X.beginPath(); X.moveTo(x, y); for (let i = 0; i <= 40; i++) X.lineTo(x + w * i / 40, y + ((i * 7 + s) % 5) * 2.4 - 4); for (let i = 0; i <= 40; i++) X.lineTo(x + w - w * i / 40, y + h + ((i * 11 + s) % 6) * 2.6 - 6); X.closePath(); };
  const CHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const flap = (alvo, x, y, tw, lt, t0) => { for (let i = 0; i < alvo.length; i++) { const c = alvo[i], k = lin(lt, t0 + i * .04, t0 + i * .04 + .45), xx = x + i * (tw + 4); X.fillStyle = "#1b1b1b"; X.beginPath(); X.roundRect(xx, y - tw * .72, tw, tw * 1.44, 5); X.fill(); if (c === " ") continue;
    X.fillStyle = k >= 1 ? AMAR : "#aaa"; X.font = `400 ${Math.round(tw * .95)}px AB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(k >= 1 ? c : CHS[(Math.floor(lt * 30) + i * 7) % CHS.length], xx + tw / 2, y + 3); X.fillStyle = "rgba(0,0,0,.5)"; X.fillRect(xx, y - 1, tw, 3); } };
  const velocimetro = (v, x, y) => { const r = 110; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,246,232,.96)"; X.beginPath(); X.roundRect(-r - 30, -r - 30, 2 * r + 60, r + 130, 22); X.fill();
    const a0 = Math.PI; X.lineWidth = 24; [[0, .33, "#9fd3c7"], [.33, .66, AMAR], [.66, 1, TERRA]].forEach(([a, b, c]) => { X.strokeStyle = c; X.beginPath(); X.arc(0, 0, r, a0 + a * Math.PI, a0 + b * Math.PI); X.stroke(); });
    const ang = a0 + Math.min(1, v / MAXE) * Math.PI; X.strokeStyle = TINTA; X.lineWidth = 8; X.lineCap = "round"; X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(ang) * (r - 18), Math.sin(ang) * (r - 18)); X.stroke(); X.lineCap = "butt"; X.fillStyle = TINTA; X.beginPath(); X.arc(0, 0, 13, 0, 7); X.fill();
    X.font = "400 50px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(fmtP(v), 0, 50); X.font = "400 20px AB"; X.fillStyle = PET; X.fillText("★ ESTRELAS NO GITHUB", 0, 86); X.restore(); };
  const U = {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 60], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(248,241,230,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (CAB && nome !== "gancho" && nome !== "cta") U.cab2(...CAB); CAB = null; },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(.012); X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 16; X.shadowOffsetY = 6; X.fillStyle = CREME; rasgado(-450, -122, 900, 244, 3); X.fill(); X.shadowColor = "transparent";
      X.fillStyle = "rgba(200,100,60,.45)"; for (const [x, r] of [[-405, -.5], [405, .5]]) { X.save(); X.translate(x, -114); X.rotate(r); X.fillRect(-70, -18, 140, 36); X.restore(); }
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(58, l1, 840); X.fillText(l1, 0, -30); X.fillStyle = TERRA; cabe(56, l2, 840); X.fillText(l2, 0, 34); X.fillStyle = PET; cabe(46, l3, 840); X.fillText(l3, 0, 92); X.restore(); },
    cabecalho(s, lt, t) { CAB = [s, lt, t]; },
    cab2(s, lt, t) { const y = 680; X.fillStyle = TERRA; X.beginPath(); X.arc(100, y, 44, 0, 7); X.fill(); X.fillStyle = "#fff"; X.font = "400 54px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag.replace(/\D/g, ""), 100, y + 3);
      const nm = s.item.toUpperCase(), tw = Math.min(46, Math.floor(760 / nm.length) - 4); X.fillStyle = "rgba(20,20,20,.85)"; X.beginPath(); X.roundRect(150, y - 50, nm.length * (tw + 4) + 30, 100, 12); X.fill(); flap(nm, 165, y, tw, lt, .1);
      velocimetro(s.estrelas * eio(lin(lt, .4, 1.9)), 230, 900); },
    legenda(seg, t) { const ch = C.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 64; X.font = `400 ${fs}px AB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 780 && fs > 36) { fs -= 2; X.font = `400 ${fs}px AB`; }
      const y = 1405, x0 = 505 - tot() / 2; X.fillStyle = PET2; X.fillRect(40, y - 56, 910, 112); X.fillStyle = TERRA; X.fillRect(40, y + 48, 910, 8); X.fillStyle = TERRA; X.fillRect(60, y - 90, 260, 40); X.fillStyle = "#fff"; X.font = "400 24px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("DIRETO DA SALA", 190, y - 70);
      let x = x0; X.font = `400 ${fs}px AB`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? AMAR : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 240 + u * 2300, h = w * .57;
      X.save(); X.fillStyle = "#2a2622"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 12 * (1 - u) + 4); X.fill("evenodd"); X.restore(); },
    fechamento(lt) { // tela CONTINUE? com contagem
      X.fillStyle = "rgba(18,60,63,.9)"; X.beginPath(); X.roundRect(90, 650, 830, 440, 30); X.fill(); X.strokeStyle = AMAR; X.lineWidth = 6; X.stroke();
      X.textAlign = "center"; X.textBaseline = "middle"; X.fillStyle = "#fff"; X.font = "400 76px AB"; X.fillText("CONTINUE?", 505, 715); const n = Math.max(0, 9 - Math.floor(lt * 1.6)); X.fillStyle = AMAR; X.font = "400 110px AB"; X.save(); X.translate(505, 830); const pp = 1 + .12 * (1 - ((lt * 1.6) % 1)); X.scale(pp, pp); X.fillText(String(n), 0, 0); X.restore();
      const p = back(lin(lt, .5, .9)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 950); X.scale(p, p); X.fillStyle = TERRA; X.beginPath(); X.roundRect(-300, -60, 600, 120, 60); X.fill(); X.fillStyle = "#fff"; X.font = `400 ${cabe(70, "COMENTA " + CHAVE, 560)}px AB`; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore();
      if (lt > 1.0) { X.globalAlpha = eo(lin(lt, 1.0, 1.4)); X.fillStyle = "#e9f2f0"; X.font = `400 ${cabe(32, "QUAL APARELHO DA SUA CASA TÁ ENCOSTADO?", 780)}px AB`; X.fillText("QUAL APARELHO DA SUA CASA TÁ ENCOSTADO?", 505, 1045); X.globalAlpha = 1; } },
  }; return U; };
const cores = { LAR: TERRA, VERDE: PET, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

// Reel 🆕 "A IA liga pro seu celular quando termina" (agentring; 16/11 17:00). Motor da cena_contagem.
// Identidade: sala de casa no fim da tarde: o notebook trabalha sozinho na mesa (barra de progresso enchendo) enquanto o mascote cochila
// numa rede; o celular na mesinha toca com a tela "SEU AGENTE LIGANDO", o mascote acorda e atende; depois ele mesmo liga de volta.
// Lilás-entardecer + laranja + verde-atender. Sem logo. Elementos: placa de rua, nome em carimbo, placar HI-SCORE, balão de fala do mascote,
// íris circular, plongée/contra-plongée, cartões que viram, Caveat. Mascote de máscara de dormir na testa; ação principal: cochilar e atender.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const LIL = "#b39ddb", LIL2 = "#5e4b8b", LAR = "#ff9a4a", VERDE = "#2fd17a", TINTA = "#231d33", FUNDO = "#f5f1fb", CREME = "#fffaf0", AMAR = "#ffd23f", VERM = "#e5484d";
rim.color.set(0xffc8a0); rim.intensity = 1.5; key.color.set(0xffe8d8); key.intensity = 140; key.position.set(3, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xf0e8ff, .6));
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#e8def5"; g.fillRect(0, 0, w, h); const sk = g.createLinearGradient(0, 30, 0, 150); sk.addColorStop(0, "#ffb38a"); sk.addColorStop(1, "#c7a6ff"); g.fillStyle = sk; g.fillRect(300, 30, 170, 120); g.fillStyle = "#fff"; g.fillRect(382, 30, 6, 120); g.fillStyle = "#d4c7ea"; g.fillRect(0, 196, w, 60); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const mT = ctex(256, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#c49a6c" : "#b48a5c"; g.fillRect(0, i * 32, w, 32); } }); mT.wrapS = mT.wrapT = THREE.RepeatWrapping; mT.repeat.set(5, 4);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: mT, roughness: .6 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// mesa + notebook com barra de progresso
box(1.6, .06, .8, M("#8a5a33"), S, 1.5, .8, -1.9); for (const [x, z] of [[.8, -2.2], [2.2, -2.2], [.8, -1.6], [2.2, -1.6]]) box(.05, .8, .05, M("#6b4426"), S, x, .4, z);
const nbC = document.createElement("canvas"); nbC.width = 320; nbC.height = 200; const ng = nbC.getContext("2d"); const nbT = new THREE.CanvasTexture(nbC); nbT.colorSpace = THREE.SRGBColorSpace;
const NB = new THREE.Group(); NB.position.set(1.5, .83, -2.0); S.add(NB); box(.9, .04, .6, M("#333"), NB, 0, .02, 0); const tp = new THREE.Group(); tp.position.set(0, .04, -.28); tp.rotation.x = -.25; NB.add(tp); box(.9, .58, .04, M("#333"), tp, 0, .29, 0); mesh(new THREE.PlaneGeometry(.82, .5), new THREE.MeshBasicMaterial({ map: nbT }), tp, 0, .29, .025).castShadow = false;
const desNB = (k, t) => { ng.fillStyle = "#16132a"; ng.fillRect(0, 0, 320, 200); ng.fillStyle = "#fff"; ng.font = "700 22px CV"; ng.fillText(k < 1 ? "agente trabalhando..." : "pronto! ligando...", 20, 60); ng.fillStyle = "#333"; ng.fillRect(20, 100, 280, 26); ng.fillStyle = k < 1 ? LAR : VERDE; ng.fillRect(20, 100, 280 * Math.min(1, k), 26); ng.fillStyle = "#aaa"; ng.font = "700 18px CV"; ng.fillText(Math.round(Math.min(1, k) * 100) + "%", 20, 160); nbT.needsUpdate = true; };
// rede
const REDE = new THREE.Group(); REDE.position.set(-1.3, 0, -.9); S.add(REDE); for (const x of [-1.4, 1.4]) box(.1, 1.8, .1, M("#6b4426"), REDE, x, .9, 0); const pano = mesh(new THREE.CylinderGeometry(.6, .6, 2.4, 20, 1, true, Math.PI * .1, Math.PI * .8), M(LAR, { side: THREE.DoubleSide, roughness: 1 }), REDE, 0, 1.25, 0); pano.rotation.z = Math.PI / 2; pano.rotation.x = Math.PI;
// mesinha + celular
box(.5, .5, .5, M("#e0d6f0"), S, .3, .25, .3); const CEL = new THREE.Group(); CEL.position.set(.3, .52, .3); S.add(CEL); box(.22, .02, .4, M("#222"), CEL, 0, 0, 0);
const celC = document.createElement("canvas"); celC.width = 128; celC.height = 232; const cg = celC.getContext("2d"); const celT = new THREE.CanvasTexture(celC); celT.colorSpace = THREE.SRGBColorSpace; const tela = mesh(new THREE.PlaneGeometry(.2, .37), new THREE.MeshBasicMaterial({ map: celT }), CEL, 0, .012, 0); tela.rotation.x = -Math.PI / 2; tela.castShadow = false;
const desCel = (on, t) => { cg.fillStyle = on ? "#1d1640" : "#111"; cg.fillRect(0, 0, 128, 232); if (on) { cg.fillStyle = "#fff"; cg.font = "700 16px CV"; cg.textAlign = "center"; cg.fillText("SEU AGENTE", 64, 60); cg.fillText("LIGANDO...", 64, 82); cg.fillStyle = VERDE; cg.beginPath(); cg.arc(88, 190, 18 + Math.sin(t * 10) * 2, 0, 7); cg.fill(); cg.fillStyle = VERM; cg.beginPath(); cg.arc(40, 190, 18, 0, 7); cg.fill(); } celT.needsUpdate = true; };
// ---------- mascote: máscara de dormir na testa ----------
const MASC = box(1.4, .16, .1, M(LIL2), MAS.corpo, 0, 1.36, .5);
const dorme = lt => { pose(MAS, { x: -1.3, z: -.9, y: .8 + Math.sin(lt * 1.2) * .03, ry: .2, sq: .05, braco: [-.2, -.2], piscar: .1 }); MAS.g.rotation.z = Math.sin(lt * .8) * .08 - .1; };
const atende = (lt, t0) => { const u = Math.max(0, Math.min(1, (lt - t0) / .8)); pose(MAS, { x: -1.3 + u * 1.2, z: -.9 + u * 1.3, y: (1 - u) * 1.0 + hop(lt, .5, .05) * u, ry: -.2, braco: [.3, .5 + u * 1.5], piscar: u > .3 ? pisca(lt) : .1 }); MAS.g.rotation.z = (1 - u) * -.1; return u >= 1; };
const feliz = (lt, x = .3, z = .5) => { pose(MAS, { x, z, y: hop(lt, .35, .22), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let HS = 0;
const reset = (lt) => { REDE.rotation.z = 0; pano.rotation.y = Math.sin(lt * 1.2) * .06; desCel(false, lt); CEL.position.y = .52; };
const toca = lt => { desCel(true, lt); CEL.position.y = .52 + Math.abs(Math.sin(lt * 40)) * .015; };
const BS = { gancho: [V(0, 4.2, 7.2), V(0, .9, -.8)], s1: [V(.6, 1.0, 6.6), V(.8, 1.4, -1.6)], s2: [V(0, 4.0, 6.8), V(-.2, .8, -.4)], s3: [V(-.2, 1.0, 6.6), V(0, 1.4, -.6)], s4: [V(.2, 4.0, 7.0), V(.2, .8, -.8)], cta: [V(0, 2.8, 7.8), V(0, 1.3, -.6)] };
const SHOTS = {}; Object.keys(BS).forEach(n => { const s = [BS[n][0], BS[n][1]]; SHOTS[n] = [s, s]; });
const camera = (cam, nome, lt, d) => { const [p, l] = BS[nome] || BS.cta, u = eio(Math.min(1, lt / d)); cam.position.set(p.x, p.y + (p.y > 2 ? -.4 : .25) * u, p.z - u * .5); cam.lookAt(l.x, l.y, l.z); };
const ACT = {
  gancho(lt, d) { reset(lt); desNB(lin(lt, 0, d) * .9, lt); if (lt > d * .7) toca(lt); dorme(lt); },
  s1(lt, d) { reset(lt); desNB(.9 + lin(lt, 0, d) * .1, lt); dorme(lt); },
  s2(lt, d) { reset(lt); desNB(1, lt); toca(lt); atende(lt, 1.2); },
  s3(lt, d) { reset(lt); desNB(1, lt); HS = eio(lin(lt, .3, 1.8)); feliz(lt); },
  s4(lt, d) { reset(lt); desNB(1, lt); pose(MAS, { x: .4, z: .5, y: hop(lt, .8, .03), ry: -.3, braco: [.3, 1.8], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
  cta(lt, d) { reset(lt); desNB(1, lt); feliz(lt, 1.4, 1.0); },
};
const ui = C => { const { X, GH, SEGR, CHAVE } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `700 ${f}px CV`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const quebra = (txt, mx) => { const ws = txt.split(" "), L = []; let cur = ""; for (const w of ws) { const tt = cur ? cur + " " + w : w; if (X.measureText(tt).width > mx && cur) { L.push(cur); cur = w; } else cur = tt; } if (cur) L.push(cur); return L; };
  const carimbo = (txt, x, y, lt, t0, cor, rot = -.08, fs = 90) => { if (lt < t0) return; const k = lin(lt, t0, t0 + .18), s = 2.4 - 1.4 * eo(k), tr = k >= 1 ? Math.max(0, 1 - (lt - t0 - .18) / .15) : 0;
    X.save(); X.translate(x + Math.sin(lt * 80) * 6 * tr, y); X.rotate(rot); X.scale(s, s); X.globalAlpha = Math.min(1, .3 + k); X.font = `700 ${fs}px CV`; const w = X.measureText(txt).width + 64;
    X.fillStyle = "rgba(255,250,240,.95)"; X.beginPath(); X.roundRect(-w / 2, -fs * .66, w, fs * 1.32, 12); X.fill(); X.strokeStyle = cor; X.lineWidth = 9; X.stroke(); X.fillStyle = cor; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(txt, 0, 4); X.restore(); X.globalAlpha = 1; };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(245,241,251,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") carimbo("agentring", 320, 700, lt, .5, LIL2, -.08, 96);
      if (nome === "s3") { const v = 317 * HS; X.fillStyle = "#16132a"; X.beginPath(); X.roundRect(600, 650, 340, 160, 14); X.fill(); X.strokeStyle = AMAR; X.lineWidth = 5; X.stroke(); X.fillStyle = AMAR; X.font = "400 24px PS"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("HI-SCORE", 770, 686); X.fillStyle = "#fff"; X.font = "700 74px CV"; X.fillText(Math.round(v), 770, 740); X.fillStyle = "#d6c8ff"; X.font = "700 24px CV"; X.fillText("★ estrelas no GitHub", 770, 784); }
      if (nome === "s4") carimbo("SEM NÚMERO PAGO", 400, 700, lt, .6, VERDE, -.06, 70); },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.fillStyle = "#7a8090"; X.fillRect(-330, 118, 18, 60); X.fillRect(312, 118, 18, 60);
      X.fillStyle = LIL2; X.beginPath(); X.roundRect(-460, -132, 920, 264, 16); X.fill(); X.strokeStyle = "#fff"; X.lineWidth = 6; X.beginPath(); X.roundRect(-447, -119, 894, 238, 10); X.stroke();
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = "#fff"; cabe(64, l1, 840); X.fillText(l1, 0, -34); X.fillStyle = AMAR; cabe(64, l2, 840); X.fillText(l2, 0, 34); X.fillStyle = "#c9ffe0"; cabe(52, l3, 840); X.fillText(l3, 0, 96); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ws = seg.palavras, ch = []; let cur = []; for (const w of ws) { cur.push(w); if (/[.,:?!]$/.test(w.w) || cur.length >= 5) { ch.push(cur); cur = []; } } if (cur.length) ch.push(cur);
      let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      X.font = "700 70px CV"; const L = quebra(c.map(w => w.w).join(" "), 740), h = 40 + L.length * 76, y0 = 1490 - h, x0 = 110, w0 = 820;
      X.save(); X.shadowColor = "rgba(0,0,0,.3)"; X.shadowBlur = 22; X.fillStyle = "#fff"; X.beginPath(); X.roundRect(x0, y0, w0, h, 40); X.fill(); X.beginPath(); X.moveTo(x0 + 330, y0 + 4); X.lineTo(x0 + 360, y0 - 56); X.lineTo(x0 + 420, y0 + 4); X.fill(); X.restore();
      X.textAlign = "left"; X.textBaseline = "middle"; let k = 0; L.forEach((l, i) => { const lw = X.measureText(l).width; let xx = x0 + (w0 - lw) / 2; for (const pw of l.split(" ")) { const wd = c[k++]; const on = wd && t >= wd.t0 - .02, atual = on && wd && t < wd.t1 + .2;
        X.fillStyle = pw.replace(/[.,!?:]/g, "").toUpperCase() === CHAVE ? VERM : atual ? LIL2 : on ? TINTA : "rgba(35,29,51,.3)"; X.fillText(pw, xx, y0 + 58 + i * 76); xx += X.measureText(pw + " ").width; } }); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .4) return; const r = eio(lt / .4) * 1300;
      X.save(); X.fillStyle = LIL2; X.beginPath(); X.rect(0, 0, 1080, 1920); X.moveTo(505 + Math.max(1, r), 1000); X.arc(505, 1000, Math.max(1, r), 0, Math.PI * 2, true); X.closePath(); X.fill(); X.strokeStyle = LAR; X.lineWidth = 14; X.beginPath(); X.arc(505, 1000, Math.max(1, r), 0, Math.PI * 2); X.stroke(); X.restore(); },
    fechamento(lt) { [["TOCA", "mesmo bloqueado"], ["EXPLICA", "o que fez"], ["SEU PC", "sem número pago"]].forEach(([a, b], i) => { const k = lin(lt, .1 + i * .22, .55 + i * .22), sx = Math.abs(Math.cos(k * Math.PI)), frente = k > .5, x = 210 + i * 300, y = 820;
        X.save(); X.translate(x, y); X.scale(Math.max(.02, sx), 1); X.fillStyle = frente ? "#fff" : LIL2; X.beginPath(); X.roundRect(-130, -140, 260, 280, 22); X.fill();
        if (frente) { X.fillStyle = TINTA; X.font = `700 ${cabe(62, a, 220)}px CV`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(a, 0, -22); X.fillStyle = "#6a5a8a"; X.font = `700 ${cabe(32, b, 220)}px CV`; X.fillText(b, 0, 40); } else { X.fillStyle = "#fff"; X.font = "700 110px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("?", 0, 8); } X.restore(); });
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(420, 1050); X.scale(p, p); X.fillStyle = LAR; X.beginPath(); X.roundRect(-280, -60, 560, 120, 60); X.fill(); X.fillStyle = "#fff"; X.font = `700 ${cabe(76, "Comenta " + CHAVE, 520)}px CV`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 4); X.restore();
      if (lt > 1.3) { X.globalAlpha = eo(lin(lt, 1.3, 1.7)); X.fillStyle = TINTA; X.font = "700 40px CV"; X.textAlign = "center"; X.fillText("Que tarefa você deixaria rodando no almoço?", 505, 1160); X.globalAlpha = 1; } },
  }; };
const cores = { LAR, VERDE: LIL2, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

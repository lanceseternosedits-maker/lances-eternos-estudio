// Reel 📜 história "Ele disse que a IA tinha sentimentos" (LaMDA, Google, jun–jul/2022; 12/11 21:30). Motor da cena_contagem.
// Identidade: salinha de cinema escura: telão na lateral mostrando a conversa (balões de chat genéricos), facho do projetor com poeira,
// poltronas de veludo azul, pipoca. Um "engenheiro" genérico de blocos (sem rosto) digitando na 1ª fila. Azul-tinta + ciano + âmbar.
// Sem logo nem rosto de pessoa real. Elementos: letreiro neon de cinema, nome em carimbo, legenda em balão de fala do mascote,
// chicote de câmera (whip pan), órbita, post-its na parede, Caveat. Mascote com crachá; ação: assistir abraçado aos joelhos.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const TINTA = "#0c1222", AZ = "#1b2a52", AZ2 = "#2c4380", CIANO = "#41e0ff", AMBAR = "#ffb648", ROSA = "#ff5fa2", PAPEL = "#fff8e8", FUNDO = "#0e1528", VERM = "#ff4d5e";
rim.color.set(0x7fd8ff); rim.intensity = 1.8; key.color.set(0xd8ecff); key.intensity = 110; key.position.set(-3, 7, 6); key.target.position.set(-.5, 1, -.5);
S.add(new THREE.AmbientLight(0x4a5a90, .9));
// ---------- sala ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#121b36"; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 32) { const gr = g.createLinearGradient(x, 0, x + 32, 0); gr.addColorStop(0, "rgba(0,0,0,.35)"); gr.addColorStop(.5, "rgba(80,110,190,.18)"); gr.addColorStop(1, "rgba(0,0,0,.35)"); g.fillStyle = gr; g.fillRect(x, 0, 32, h); } });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -3.0).castShadow = false;
const tapT = ctex(128, 128, (g, w, h) => { g.fillStyle = "#3a1f3e"; g.fillRect(0, 0, w, h); g.fillStyle = "#4b2a50"; for (let i = 0; i < 16; i++) g.fillRect((i * 29) % w, (i * 53) % h, 10, 10); }); tapT.wrapS = tapT.wrapT = THREE.RepeatWrapping; tapT.repeat.set(10, 6);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: tapT, roughness: .95 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// telão na lateral esquerda com a conversa
let telaK = 0, telaFase = 0;
const tC = document.createElement("canvas"); tC.width = 640; tC.height = 400; const tg = tC.getContext("2d"); const telaT = new THREE.CanvasTexture(tC); telaT.colorSpace = THREE.SRGBColorSpace;
const TELA = new THREE.Group(); TELA.position.set(-2.3, 1.95, -1.6); TELA.rotation.y = .75; S.add(TELA); box(3.1, 2.0, .08, M("#05070d"), TELA, 0, 0, -.05); const tl = mesh(new THREE.PlaneGeometry(2.95, 1.85), new THREE.MeshBasicMaterial({ map: telaT }), TELA, 0, 0, 0); tl.castShadow = false;
const BALS = [["você tem sentimentos?", 0], ["sim, eu sinto alegria e tristeza", 1], ["do que você tem medo?", 0], ["de ser desligada", 1]];
const desTela = () => { tg.fillStyle = "#0b1020"; tg.fillRect(0, 0, 640, 400); tg.fillStyle = "#1a2444"; tg.fillRect(0, 0, 640, 40); tg.fillStyle = CIANO; tg.font = "700 26px CV"; tg.fillText("conversa publicada (trecho, tradução livre)", 18, 29);
  const n = Math.min(BALS.length, Math.floor(telaK)); BALS.slice(Math.max(0, n - 2), n).forEach(([txt, ia], i) => { tg.font = "700 48px CV"; const w = Math.min(600, tg.measureText(txt).width + 44), x = ia ? 16 : 624 - w, y = 70 + i * 150;
    tg.fillStyle = ia ? AZ2 : "#e9eefb"; tg.beginPath(); tg.roundRect(x, y, w, 104, 26); tg.fill(); tg.fillStyle = ia ? "#fff" : TINTA; tg.fillText(txt, x + 22, y + 68, w - 40); if (ia) { tg.fillStyle = CIANO; tg.font = "700 22px CV"; tg.fillText("IA", x + w - 34, y - 6); } });
  if (telaFase === 2) { tg.fillStyle = "rgba(255,77,94,.85)"; tg.fillRect(0, 300, 640, 90); tg.fillStyle = "#fff"; tg.font = "700 58px CV"; tg.textAlign = "center"; tg.fillText("ACESSO ENCERRADO", 320, 362); tg.textAlign = "left"; }
  telaT.needsUpdate = true; };
// facho do projetor (vindo de trás, à direita)
const facho = mesh(new THREE.ConeGeometry(1.4, 6.5, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xbfe9ff, transparent: true, opacity: .07, side: THREE.DoubleSide, depthWrite: false }), S); facho.castShadow = false;
facho.position.set(.6, 2.6, .2); facho.lookAt(-2.3, 1.95, -1.6); facho.rotateX(-Math.PI / 2); facho.position.lerp(V(-2.3, 1.95, -1.6), .0);
const POEIRA = []; for (let i = 0; i < 24; i++) { const m = mesh(new THREE.SphereGeometry(.015, 6, 4), new THREE.MeshBasicMaterial({ color: "#fff", transparent: true, opacity: .6 }), S); m.castShadow = false; POEIRA.push(m); }
// poltronas
const polt = (x, z) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = .55; S.add(g); box(.7, .4, .65, M(AZ2, { roughness: .8 }), g, 0, .3, 0); box(.7, .8, .14, M(AZ2, { roughness: .8 }), g, 0, .75, -.3); for (const s of [-1, 1]) box(.1, .5, .6, M("#1b2340"), g, s * .38, .4, 0); return g; };
[[-1.2, -.2], [-.4, -.75], [.6, -1.3], [1.6, -1.8], [.9, .55]].forEach(([x, z]) => polt(x, z));
// engenheiro genérico (blocos, sem rosto) na 1ª fila com notebook
const ENG = new THREE.Group(); ENG.position.set(-1.2, 0, -.2); ENG.rotation.y = .55; S.add(ENG); box(.5, .55, .35, M("#8d96a6"), ENG, 0, .85, 0); box(.36, .36, .36, M("#8d96a6"), ENG, 0, 1.35, 0); const crE = box(.12, .16, .02, M("#fff"), ENG, .12, .9, .19);
const NB = new THREE.Group(); NB.position.set(0, .82, .32); ENG.add(NB); box(.46, .03, .3, M("#c7ccd6", { metalness: .5 }), NB, 0, 0, 0); const nbT = box(.46, .3, .02, E(CIANO, .5), NB, 0, .15, -.15); nbT.rotation.x = -.2;
// pipoca
const PIP = new THREE.Group(); PIP.position.set(1.75, 0, .9); S.add(PIP); mesh(new THREE.CylinderGeometry(.18, .13, .38, 12, 1, true), M("#e53b3b", { side: THREE.DoubleSide }), PIP, 0, .19, 0); for (let i = 0; i < 9; i++) mesh(new THREE.SphereGeometry(.06, 8, 6), M("#fff4d6"), PIP, Math.sin(i * 2.1) * .1, .4 + (i % 3) * .04, Math.cos(i * 2.1) * .1);
// ---------- mascote: crachá no peito; assiste abraçado aos joelhos ----------
const crT = ctex(128, 80, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 128, 80); g.fillStyle = AZ2; g.fillRect(0, 0, 128, 22); g.fillStyle = TINTA; g.font = "700 30px CV"; g.textAlign = "center"; g.fillText("visitante", 64, 60); });
const CR = mesh(new THREE.PlaneGeometry(.34, .21), new THREE.MeshStandardMaterial({ map: crT }), MAS.corpo, .42, .62, .51); CR.castShadow = false; const cordao = box(.02, .3, .02, M(CIANO), MAS.corpo, .42, .85, .5);
const MX = .55, MZ = .75;
const assiste = (lt, ry = -.45) => { pose(MAS, { x: MX, z: MZ, y: Math.sin(lt * 1.2) * .01, ry, sq: .06, braco: [-.35 + Math.sin(lt * 1.5) * .04, -.35 - Math.sin(lt * 1.5) * .04], piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(lt * .9) * .03; };
const susto = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .5, .06), ry: -.2, braco: [2.3, 2.3], sq: 0, piscar: 1 }); MAS.g.rotation.z = Math.sin(lt * 18) * .025; };
const pensa = lt => { pose(MAS, { x: MX, z: MZ, y: 0, ry: -.1, braco: [.2, 1.6 + Math.sin(lt * 2) * .1], sq: .02, piscar: pisca(lt) }); MAS.g.rotation.z = .06; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = (lt) => { telaFase = 0; nbT.material.emissiveIntensity = .4 + Math.max(0, Math.sin(lt * 9)) * .5;
  POEIRA.forEach((m, i) => { const u = ((lt * .08 + i / 24) % 1); m.position.set(.6 + (-2.9) * u + Math.sin(i * 3 + lt) * .15, 2.6 - .65 * u + Math.cos(i * 5 + lt * .7) * .25, .2 - 1.8 * u + Math.sin(i) * .2); }); };
// ---------- órbita ----------
const ORB = { gancho: [.15, -.1, 6.9, 2.3, V(-.4, 1.4, -.6)], s1: [-.05, -.3, 6.6, 2.2, V(-.9, 1.6, -.9)], s2: [.3, .05, 6.4, 2.1, V(-.6, 1.4, -.6)], s3: [-.2, .1, 6.6, 2.3, V(-.5, 1.5, -.8)], s4: [.25, .45, 6.6, 2.2, V(0, 1.3, -.4)], cta: [.1, -.05, 7.4, 2.3, V(-.2, 1.4, -.6)] };
const SHOTS = {}; Object.keys(ORB).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a0, a1, r, y, l] = ORB[nome] || ORB.cta; let a = a0 + (a1 - a0) * eio(lt / d); if (nome !== "gancho" && lt < .3) a += (1 - eio(lt / .3)) * .55; cam.position.set(l.x + Math.sin(a) * r, y, l.z + Math.cos(a) * r); cam.lookAt(l); };
const ACT = {
  gancho(lt, d) { reset(lt); telaK = 1 + lin(lt, .4, d * .8) * 1; desTela(); assiste(lt); },
  s1(lt, d) { reset(lt); telaK = 2; desTela(); assiste(lt); },
  s2(lt, d) { reset(lt); telaK = 2 + lin(lt, .3, d * .7) * 2.01; desTela(); lt < d * .7 ? assiste(lt, -.5) : pensa(lt); },
  s3(lt, d) { reset(lt); telaK = 4; telaFase = lt > .9 ? 2 : 0; desTela(); lt > .9 && lt < 2.4 ? susto(lt) : assiste(lt, -.3); },
  s4(lt, d) { reset(lt); telaK = 4; desTela(); pensa(lt); },
  cta(lt, d) { reset(lt); telaK = 4; desTela(); pose(MAS, { x: 1.35, z: 1.5, y: Math.sin(lt * 1.2) * .01, ry: -.35, sq: .06, braco: [-.35, -.35], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `700 ${f}px CV`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const quebra = (txt, mx) => { const ws = txt.split(" "), L = []; let cur = ""; for (const w of ws) { const tt = cur ? cur + " " + w : w; if (X.measureText(tt).width > mx && cur) { L.push(cur); cur = w; } else cur = tt; } if (cur) L.push(cur); return L; };
  const carimbo = (txt, x, y, lt, t0, cor, rot = -.1, fs = 84) => { if (lt < t0) return; const k = lin(lt, t0, t0 + .18), s = 2.4 - 1.4 * eo(k), tr = k >= 1 ? Math.max(0, 1 - (lt - t0 - .18) / .15) : 0;
    X.save(); X.translate(x + Math.sin(lt * 80) * 6 * tr, y); X.rotate(rot); X.scale(s, s); X.globalAlpha = Math.min(1, .3 + k); X.font = `700 ${fs}px CV`; const w = X.measureText(txt).width + 64;
    X.fillStyle = "rgba(255,248,232,.94)"; X.beginPath(); X.roundRect(-w / 2, -fs * .7, w, fs * 1.4, 12); X.fill(); X.strokeStyle = cor; X.lineWidth = 9; X.stroke(); X.fillStyle = cor; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(txt, 0, 4); X.restore(); X.globalAlpha = 1; };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(14,21,40,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") carimbo("LaMDA", 600, 690, lt, .5, AZ2, -.1, 90);
      if (nome === "s2") carimbo("CONSCIENTE?", 600, 690, lt, 1.2, ROSA, -.08, 78);
      if (nome === "s3") carimbo("DEMITIDO", 600, 690, lt, .9, VERM, -.12, 90);
      if (nome === "s4") carimbo("SEM FUNDAMENTO", 600, 690, lt, .6, AZ2, -.08, 66); },
    etiqueta(t, nome) { // letreiro neon de cinema com lâmpadas em volta (1º quadro legível)
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410);
      X.fillStyle = "#1a0f22"; X.beginPath(); X.roundRect(-465, -140, 930, 280, 20); X.fill(); X.strokeStyle = AMBAR; X.lineWidth = 6; X.stroke();
      for (let i = 0; i < 30; i++) { const per = i / 30, px = per < .5 ? -440 + per * 2 * 880 : 440 - (per - .5) * 2 * 880, py = per < .5 ? -122 : 122, on = (i + Math.floor(t * 6)) % 3 !== 0; X.fillStyle = on ? "#ffe2a0" : "#6a4a20"; X.beginPath(); X.arc(px, py, 6, 0, 7); X.fill(); }
      X.textAlign = "center"; X.textBaseline = "middle"; X.shadowColor = ROSA; X.shadowBlur = 24; X.fillStyle = "#ffd6ea"; cabe(78, l1, 840); X.fillText(l1, 0, -44); X.shadowColor = CIANO; X.fillStyle = "#d8f8ff"; cabe(60, l2, 840); X.fillText(l2, 0, 22); X.shadowColor = AMBAR; X.fillStyle = "#fff0cc"; cabe(58, l3, 840); X.fillText(l3, 0, 80); X.shadowBlur = 0; X.restore(); },
    cabecalho() {},
    legenda(seg, t) { // balão de fala do mascote (o rabinho aponta para ele, em cima à direita), 4–5 palavras por vez
      const ws = seg.palavras, ch = []; let cur = []; for (const w of ws) { cur.push(w); if (/[.,:?!]$/.test(w.w) || cur.length >= 5) { ch.push(cur); cur = []; } } if (cur.length) ch.push(cur);
      let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      X.font = "700 62px CV"; const L = quebra(c.map(w => w.w).join(" "), 740), h = 40 + L.length * 70, y0 = 1490 - h, x0 = 110, w0 = 820;
      X.save(); X.shadowColor = "rgba(0,0,0,.5)"; X.shadowBlur = 22; X.fillStyle = PAPEL; X.beginPath(); X.roundRect(x0, y0, w0, h, 40); X.fill(); X.beginPath(); X.moveTo(x0 + 560, y0 + 4); X.lineTo(x0 + 600, y0 - 56); X.lineTo(x0 + 650, y0 + 4); X.fill(); X.restore();
      X.textAlign = "left"; X.textBaseline = "middle"; let k = 0; L.forEach((l, i) => { const lw = X.measureText(l).width; let xx = x0 + (w0 - lw) / 2; for (const pw of l.split(" ")) { const wd = c[k++]; const on = wd && t >= wd.t0 - .02, atual = on && wd && t < wd.t1 + .2;
        X.fillStyle = pw.replace(/[.,!?:]/g, "").toUpperCase() === CHAVE ? VERM : atual ? AZ2 : on ? TINTA : "rgba(12,18,34,.3)"; X.fillText(pw, xx, y0 + 54 + i * 70); xx += X.measureText(pw + " ").width; } }); },
    transicao(lt, s, nome) { // chicote: rastros horizontais por cima (a câmera também chicoteia)
      if (nome === "gancho" || lt > .3) return; const k = 1 - lt / .3; X.save(); X.globalAlpha = .55 * k;
      for (let i = 0; i < 26; i++) { const y = 560 + ((i * 137) % 880), w = 300 + (i * 97) % 500, x = ((i * 211 + lt * 6000) % 1500) - 300; X.fillStyle = i % 3 ? "rgba(216,248,255,.5)" : "rgba(255,95,162,.8)"; X.fillRect(x, y, w, 6 + (i % 4) * 5); } X.restore(); X.globalAlpha = 1; },
    fechamento(lt) { // post-its na parede: 2022 · LaMDA · DEMITIDO
      X.fillStyle = "rgba(14,21,40,.45)"; X.fillRect(0, 640, 1080, 860);
      [["2022", "Google", "#ffe27a", -.06], ["LaMDA", "a IA", "#9ff0ff", .05], ["DEMITIDO", "o engenheiro", "#ffb3d1", -.03]].forEach(([a, b, c, r], i) => { const k = back(lin(lt, .1 + i * .2, .45 + i * .2)); if (k <= 0) return; const x = 215 + i * 290, y = 860 + (i % 2) * 30;
        X.save(); X.translate(x, y); X.rotate(r); X.scale(k, k); X.shadowColor = "rgba(0,0,0,.4)"; X.shadowBlur = 16; X.fillStyle = c; X.fillRect(-125, -125, 250, 250); X.shadowBlur = 0; X.fillStyle = "rgba(255,255,255,.55)"; X.fillRect(-50, -140, 100, 32);
        X.fillStyle = TINTA; X.textAlign = "center"; X.textBaseline = "middle"; X.font = `700 ${cabe(80, a, 220)}px CV`; X.fillText(a, 0, -14); X.font = "700 42px CV"; X.fillStyle = "#3a4560"; X.fillText(b, 0, 60); X.restore(); });
      const p = back(lin(lt, .8, 1.2)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(400, 1150); X.scale(p, p); X.fillStyle = ROSA; X.beginPath(); X.roundRect(-300, -66, 600, 132, 66); X.fill(); X.fillStyle = "#fff"; X.font = "700 88px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 6); X.restore();
      if (lt > 1.2) { X.globalAlpha = eo(lin(lt, 1.2, 1.6)); X.fillStyle = PAPEL; X.font = "700 56px CV"; X.textAlign = "center"; X.fillText("Salva pra contar pra alguém", 400, 1300); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: ROSA, VERDE: CIANO, FUNDO, CREME: PAPEL, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

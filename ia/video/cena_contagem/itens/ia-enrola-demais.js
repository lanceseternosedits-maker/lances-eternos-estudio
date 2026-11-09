// Reel ⚙️ como funciona "Sua IA enrola demais?" (dizer tamanho e formato da resposta; 13/11 12:00). Motor da cena_contagem.
// Identidade: redação de rádio antiga: um teletipo (a "IA") que cospe uma tira de papel sem parar e faz uma montanha no chão,
// relógio de parede, microfone de rádio, luz "NO AR". O mascote radialista corta a tira com uma tesoura gigante: sobra só um bilhete curto.
// Verde-redação + papel + vermelho. Elementos: placa de aeroporto, nome em carimbo, pote enchendo (de palavras), balão de fala do mascote,
// íris circular, câmera na mão, página de caderno, Bebas Neue. Mascote com fone de radialista; ação principal: cortar a fita com a tesoura.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const VERDE = "#1f6f5c", VERDE2 = "#134a3d", PAPEL = "#fbf6e9", VERM = "#d9363e", AMAR = "#ffd23f", TINTA = "#1b2420", FUNDO = "#eef5f1", CINZA = "#5b6b66";
rim.color.set(0xfff2d8); rim.intensity = 1.3; key.color.set(0xffffff); key.intensity = 145; key.position.set(-2, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xf0fff8, .6));
// ---------- redação ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#cfe3da"; g.fillRect(0, 0, w, 150); g.fillStyle = VERDE; g.fillRect(0, 150, w, h - 150); g.fillStyle = "#e9f2ee"; g.fillRect(0, 146, w, 6); g.fillStyle = "rgba(31,111,92,.12)"; for (let x = 0; x < w; x += 40) g.fillRect(x, 0, 2, 146); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const tT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? "#7a6a58" : "#8c7b67"; g.fillRect(x * 32, y * 32, 32, 32); } }); tT.wrapS = tT.wrapT = THREE.RepeatWrapping; tT.repeat.set(5, 3);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: tT, roughness: .8 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// relógio + luz NO AR
const relT = ctex(256, 256, g => { g.fillStyle = "#fff"; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill(); g.strokeStyle = TINTA; g.lineWidth = 10; g.stroke(); g.fillStyle = TINTA; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.fillRect(128 + Math.cos(a) * 96 - 4, 128 + Math.sin(a) * 96 - 4, 8, 8); } });
mesh(new THREE.CircleGeometry(.45, 32), new THREE.MeshBasicMaterial({ map: relT }), S, 2.2, 3.0, -2.75).castShadow = false; const PONT = box(.04, .36, .02, M(VERM), S, 2.2, 3.0, -2.72);
const noArT = ctex(256, 96, g => { g.fillStyle = VERM; g.beginPath(); g.roundRect(0, 0, 256, 96, 16); g.fill(); g.fillStyle = "#fff"; g.font = "400 66px BB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("NO AR", 128, 52); });
const NOAR = mesh(new THREE.PlaneGeometry(.9, .34), new THREE.MeshBasicMaterial({ map: noArT, transparent: true }), S, -.2, 3.3, -2.75); NOAR.castShadow = false;
// teletipo (a IA) numa mesa
box(1.7, .08, .9, M("#5a4636"), S, -1.5, .85, -1.3); for (const [x, z] of [[-2.25, -1.65], [-.75, -1.65], [-2.25, -.95], [-.75, -.95]]) box(.06, .85, .06, M("#3e2f24"), S, x, .42, z);
const TEL = new THREE.Group(); TEL.position.set(-1.5, .89, -1.35); S.add(TEL); box(1.1, .42, .7, M("#3d7a68", { roughness: .45 }), TEL, 0, .21, 0); box(.9, .14, .3, M("#2a2a2a"), TEL, 0, .45, -.18); box(.8, .06, .25, M("#ddd"), TEL, 0, .1, .3);
const luzTel = mesh(new THREE.SphereGeometry(.05, 10, 8), E(AMAR, 1.5), TEL, .42, .46, .1);
// tira de papel (segmentos que saem e caem em pilha)
const tirT = ctex(64, 256, g => { g.fillStyle = PAPEL; g.fillRect(0, 0, 64, 256); g.fillStyle = "#9aa"; for (let y = 8; y < 256; y += 12) g.fillRect(8, y, 20 + ((y * 7) % 30), 4); });
const NT = 40, TIRA = []; for (let i = 0; i < NT; i++) { const m = mesh(new THREE.PlaneGeometry(.5, .32), new THREE.MeshStandardMaterial({ map: tirT, side: THREE.DoubleSide, roughness: .9 }), S); m.visible = false; TIRA.push(m); }
const pilha = (k, t) => { const n = Math.floor(k * NT); TIRA.forEach((m, i) => { m.visible = i < n; if (!m.visible) return; const u = i / NT; if (i < 6) { m.position.set(-1.5, 1.42 + i * .3, -1.5); m.rotation.set(0, 0, Math.sin(t * 2 + i) * .05); } else { const a = i * 2.39, r = .15 + (i % 7) * .07; m.position.set(-1.0 + Math.cos(a) * r * 1.6, .05 + Math.floor((i - 6) / 7) * .07, -.4 + Math.sin(a) * r); m.rotation.set(-Math.PI / 2 + Math.sin(i) * .3, 0, a); } }); };
// bilhete curto (depois do corte)
const bilT = ctex(320, 160, g => { g.fillStyle = PAPEL; g.fillRect(0, 0, 320, 160); g.fillStyle = TINTA; g.font = "400 40px BB"; g.textAlign = "left"; ["1. SIM, DÁ PRA FAZER", "2. CUSTA R$ 0", "3. LEVA 5 MIN"].forEach((s, i) => g.fillText(s, 18, 48 + i * 44)); });
const BIL = mesh(new THREE.PlaneGeometry(.9, .45), new THREE.MeshStandardMaterial({ map: bilT, side: THREE.DoubleSide }), S, -1.3, 1.75, -.3); BIL.scale.setScalar(1.3); BIL.castShadow = false;
// microfone de rádio
const MIC = new THREE.Group(); MIC.position.set(1.9, 0, -.6); S.add(MIC); box(.05, 1.3, .05, M("#999", { metalness: .8 }), MIC, 0, .65, 0); mesh(new THREE.CylinderGeometry(.3, .3, .04, 20), M("#333"), MIC, 0, .02, 0); mesh(new THREE.CapsuleGeometry(.12, .22, 6, 12), M("#c9c9c9", { metalness: .8, roughness: .3 }), MIC, 0, 1.45, 0);
// ---------- mascote: fone de radialista + tesoura gigante ----------
const FONE = new THREE.Group(); FONE.position.set(0, 1.5, 0); MAS.corpo.add(FONE); const arcoF = mesh(new THREE.TorusGeometry(.78, .05, 8, 24, Math.PI), M("#222"), FONE, 0, 0, 0); for (const s of [-1, 1]) mesh(new THREE.CylinderGeometry(.2, .2, .14, 16), M(VERM), FONE, s * .78, -.05, 0).rotation.z = Math.PI / 2;
const TES = new THREE.Group(); TES.position.set(.5, -.05, .2); MAS.bracos[1].add(TES); const lam = [0, 1].map(i => { const g = new THREE.Group(); TES.add(g); box(.6, .06, .03, M("#d8dde3", { metalness: .9, roughness: .2 }), g, .3, 0, i * .03); mesh(new THREE.TorusGeometry(.08, .025, 6, 12), M(VERM), g, -.08, 0, i * .03); return g; });
const corta = (lt, t0) => { const u = Math.max(0, lt - t0), a = u < 1.2 ? Math.abs(Math.sin(u * 10)) * .5 : 0; lam[0].rotation.z = a; lam[1].rotation.z = -a; return u; };
const MX = .55, MZ = .6;
const fala = (lt, ry = -.3) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.4 + Math.sin(lt * 3) * .1, .6], piscar: pisca(lt) }); MAS.g.rotation.z = 0; corta(0, 1); };
const cortando = (lt, t0) => { const u = corta(lt, t0); pose(MAS, { x: MX - .5, z: MZ - .3, y: hop(lt, .5, .03), ry: -.6, braco: [.4, 1.2 + (u < 1.2 ? Math.sin(u * 10) * .15 : 0)], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .22), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; corta(0, 1); };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let PAL = 0;
const reset = (lt) => { BIL.visible = false; luzTel.material.emissiveIntensity = 1 + Math.sin(lt * 12); PONT.rotation.z = -lt * .6; TEL.position.y = .89 + Math.abs(Math.sin(lt * 25)) * .01; NOAR.material.opacity = .75 + .25 * Math.sin(lt * 4); };
// ---------- câmera na mão ----------
const BS = { gancho: [V(-.4, 2.5, 7.0), V(-.5, 1.4, -1.0)], s1: [V(.3, 2.3, 6.6), V(-.3, 1.3, -.8)], s2: [V(-.6, 2.6, 6.8), V(-.4, 1.7, -1.6)], s3: [V(.2, 2.3, 6.4), V(-.4, 1.4, -.8)], s4: [V(.4, 2.4, 6.4), V(0, 1.6, -.6)], cta: [V(0, 2.5, 7.4), V(-.2, 1.4, -.8)] };
const SHOTS = {}; Object.keys(BS).forEach(n => { const s = [BS[n][0], BS[n][1]]; SHOTS[n] = [s, s]; });
const camera = (cam, nome, lt, d, t) => { const [p, l] = BS[nome] || BS.cta, u = lt / d; const nx = Math.sin(t * 1.3) * .05 + Math.sin(t * 3.7) * .02, ny = Math.sin(t * 1.7 + 1) * .04 + Math.sin(t * 4.3) * .015;
  cam.position.set(p.x + nx, p.y + ny, p.z - u * .35); cam.lookAt(l.x + nx * .4, l.y + ny * .4, l.z); cam.rotateZ(Math.sin(t * 1.1) * .012); };
const ACT = {
  gancho(lt, d, t) { reset(lt); pilha(lin(lt, 0, d) * .6, t); PAL = 412 * lin(lt, 0, d); fala(lt, -.5); },
  s1(lt, d, t) { reset(lt); pilha(.6 + lin(lt, 0, d) * .4, t); PAL = 412; fala(lt); },
  s2(lt, d, t) { reset(lt); pilha(1, t); PAL = 412; fala(lt, -.4); },
  s3(lt, d, t) { reset(lt); pilha(1, t); PAL = 412; fala(lt, -.2); },
  s4(lt, d, t) { reset(lt); const u = lt - .4; pilha(u < 1.0 ? 1 : 0, t); cortando(lt, .4); BIL.visible = u > 1.0; BIL.scale.setScalar(1.3 * Math.max(.01, back(lin(lt, 1.4, 1.8)))); PAL = u < 1.0 ? 412 : 18; },
  cta(lt, d, t) { reset(lt); BIL.visible = true; BIL.scale.setScalar(1.3); PAL = 18; feliz(lt); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px BB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const quebra = (txt, mx) => { const ws = txt.split(" "), L = []; let cur = ""; for (const w of ws) { const tt = cur ? cur + " " + w : w; if (X.measureText(tt).width > mx && cur) { L.push(cur); cur = w; } else cur = tt; } if (cur) L.push(cur); return L; };
  const carimbo = (txt, x, y, lt, t0, cor, rot = -.1, fs = 84) => { if (lt < t0) return; const k = lin(lt, t0, t0 + .18), s = 2.4 - 1.4 * eo(k), tr = k >= 1 ? Math.max(0, 1 - (lt - t0 - .18) / .15) : 0;
    X.save(); X.translate(x + Math.sin(lt * 80) * 6 * tr, y); X.rotate(rot); X.scale(s, s); X.globalAlpha = Math.min(1, .3 + k); X.font = `400 ${fs}px BB`; const w = X.measureText(txt).width + 64;
    X.fillStyle = "rgba(251,246,233,.94)"; X.beginPath(); X.roundRect(-w / 2, -fs * .65, w, fs * 1.3, 12); X.fill(); X.strokeStyle = cor; X.lineWidth = 9; X.stroke(); X.fillStyle = cor; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(txt, 0, 4); X.restore(); X.globalAlpha = 1; };
  const pote = (v, x, y) => { const w = 150, h = 170; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,255,255,.93)"; X.beginPath(); X.roundRect(-115, -h / 2 - 40, 230, h + 140, 20); X.fill();
    X.fillStyle = "rgba(31,111,92,.12)"; X.strokeStyle = VERDE; X.lineWidth = 5; X.beginPath(); X.roundRect(-w / 2, -h / 2, w, h, 22); X.fill(); X.stroke(); X.fillStyle = CINZA; X.fillRect(-w / 2 + 12, -h / 2 - 20, w - 24, 22);
    X.save(); X.beginPath(); X.roundRect(-w / 2 + 5, -h / 2 + 5, w - 10, h - 10, 18); X.clip(); const n = Math.floor(v / 412 * 36); X.font = "400 26px BB"; X.textAlign = "center"; X.textBaseline = "middle"; for (let i = 0; i < n; i++) { X.fillStyle = i % 3 ? TINTA : VERM; X.fillText("ABCLMOPRS"[i % 9], -w / 2 + 20 + (i % 6) * 22, h / 2 - 16 - Math.floor(i / 6) * 26); } X.restore();
    X.fillStyle = TINTA; X.font = "400 50px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(Math.round(v) + " PALAVRAS", 0, h / 2 + 36); X.fillStyle = CINZA; X.font = "400 22px BB"; X.fillText("EXEMPLO ILUSTRATIVO", 0, h / 2 + 70); X.restore(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(238,245,241,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome !== "cta") pote(PAL, 810, 840);
      if (nome === "s2") carimbo("GUIA OFICIAL", 380, 690, lt, .9, VERDE, -.08, 80);
      if (nome === "s3") carimbo("QUALQUER IA", 380, 690, lt, .3, VERM, -.1, 84);
      if (nome === "s4") { X.save(); X.translate(330, 700); X.rotate(-.03); X.fillStyle = PAPEL; X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 14; X.fillRect(-270, -70, 540, 140); X.shadowBlur = 0; X.fillStyle = TINTA; X.font = "400 48px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(lt < 2.4 ? "\"RESPONDE EM 3 LINHAS\"" : "\"SÓ UMA LISTA DE 5\"", 0, 2); X.restore(); } },
    etiqueta(t, nome) { // placa de aeroporto amarela com seta
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.fillStyle = "#6e7a78"; X.fillRect(-330, 118, 18, 60); X.fillRect(312, 118, 18, 60);
      X.fillStyle = AMAR; X.beginPath(); X.roundRect(-460, -132, 920, 264, 16); X.fill(); X.fillStyle = TINTA; X.fillRect(-460, -132, 150, 264);
      X.fillStyle = AMAR; X.beginPath(); X.moveTo(-430, 0); X.lineTo(-370, -55); X.lineTo(-370, -22); X.lineTo(-330, -22); X.lineTo(-330, 22); X.lineTo(-370, 22); X.lineTo(-370, 55); X.closePath(); X.fill();
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(90, l1, 720); X.fillText(l1, -280, -30); cabe(58, l2, 720); X.fillText(l2, -280, 36); X.fillStyle = VERM; cabe(58, l3, 720); X.fillText(l3, -280, 100); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { // balão de fala do mascote (rabinho aponta para ele), 4–5 palavras por vez
      const ws = seg.palavras, ch = []; let cur = []; for (const w of ws) { cur.push(w); if (/[.,:?!]$/.test(w.w) || cur.length >= 5) { ch.push(cur); cur = []; } } if (cur.length) ch.push(cur);
      let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      X.font = "400 74px BB"; const L = quebra(c.map(w => w.w).join(" "), 740), h = 40 + L.length * 76, y0 = 1490 - h, x0 = 110, w0 = 820;
      X.save(); X.shadowColor = "rgba(0,0,0,.35)"; X.shadowBlur = 22; X.fillStyle = "#fff"; X.beginPath(); X.roundRect(x0, y0, w0, h, 40); X.fill(); X.beginPath(); X.moveTo(x0 + 520, y0 + 4); X.lineTo(x0 + 560, y0 - 56); X.lineTo(x0 + 610, y0 + 4); X.fill(); X.restore();
      X.textAlign = "left"; X.textBaseline = "middle"; let k = 0; L.forEach((l, i) => { const lw = X.measureText(l).width; let xx = x0 + (w0 - lw) / 2; for (const pw of l.split(" ")) { const wd = c[k++]; const on = wd && t >= wd.t0 - .02, atual = on && wd && t < wd.t1 + .2;
        X.fillStyle = pw.replace(/[.,!?:]/g, "").toUpperCase() === CHAVE ? VERM : atual ? VERDE : on ? TINTA : "rgba(27,36,32,.3)"; X.fillText(pw, xx, y0 + 58 + i * 76); xx += X.measureText(pw + " ").width; } }); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .4) return; const r = eio(lt / .4) * 1300;
      X.save(); X.fillStyle = VERDE2; X.beginPath(); X.rect(0, 0, 1080, 1920); X.moveTo(505 + Math.max(1, r), 1000); X.arc(505, 1000, Math.max(1, r), 0, Math.PI * 2, true); X.closePath(); X.fill();
      X.strokeStyle = AMAR; X.lineWidth = 14; X.beginPath(); X.arc(505, 1000, Math.max(1, r), 0, Math.PI * 2); X.stroke(); X.restore(); },
    fechamento(lt) { // página de caderno com os 2 truques
      X.save(); X.translate(505, 930); X.rotate(-.015); X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 24; X.fillStyle = "#fffdf6"; X.fillRect(-430, -270, 860, 480); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(47,111,176,.3)"; X.lineWidth = 2; for (let y = -190; y < 210; y += 80) { X.beginPath(); X.moveTo(-430, y + 40); X.lineTo(430, y + 40); X.stroke(); } X.strokeStyle = "rgba(232,50,60,.5)"; X.beginPath(); X.moveTo(-350, -270); X.lineTo(-350, 210); X.stroke();
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = VERDE; X.font = "400 62px BB"; X.fillText("PRA IA PARAR DE ENROLAR:", -320, -200);
      [["1.", "DIGA O TAMANHO: \"EM 3 LINHAS\""], ["2.", "DIGA O FORMATO: \"LISTA DE 5\""], ["3.", "PEÇA: \"SEM INTRODUÇÃO\""]].forEach(([n, s], i) => { const k = lin(lt, .15 + i * .2, .45 + i * .2); if (k <= 0) return; X.globalAlpha = k; const y = -110 + i * 80; X.fillStyle = VERM; X.font = "400 52px BB"; X.fillText(n, -320, y); X.fillStyle = TINTA; X.font = `400 ${cabe(52, s, 640)}px BB`; X.fillText(s, -270, y); X.globalAlpha = 1; });
      X.restore();
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 1250); X.scale(p, p); X.fillStyle = VERM; X.beginPath(); X.roundRect(-300, -64, 600, 128, 64); X.fill(); X.fillStyle = "#fff"; X.font = "400 92px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 6); X.restore();
      if (lt > 1.3) { X.globalAlpha = eo(lin(lt, 1.3, 1.7)); X.fillStyle = TINTA; X.font = "400 44px BB"; X.textAlign = "center"; X.fillText("E RECEBE OS PROMPTS PRONTOS", 505, 1360); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: VERDE, VERDE: AMAR, FUNDO, CREME: PAPEL, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

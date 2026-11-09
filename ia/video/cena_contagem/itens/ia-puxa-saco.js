// Reel ⚙️ como funciona "Sua IA concorda demais com você" (bajulação do ChatGPT, abr/2025; 13/11 08:00). Motor da cena_contagem.
// Identidade: camarim de teatro: espelho com moldura de lâmpadas que é a "IA" (só mostra elogio: "GÊNIO!", "PERFEITO!"), placa
// luminosa "APLAUSOS" pendurada, arara de roupas, banquinho. Pote de vidro enchendo de corações = as curtidas que ensinam a IA.
// Bege-camarim + vermelho-cortina + dourado. Elementos: página de caderno, nome em máquina de escrever, pote enchendo (corações),
// bloco de 4 palavras com a atual colorida, íris circular, câmera na mão, tela CONTINUE?, Bebas Neue.
// Mascote com luva de boxe numa mão só; ação principal: desligar (no soco) a placa de aplausos.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const BEGE = "#f3e3cf", CORT = "#b0263a", CORT2 = "#7d1626", OURO = "#e8b24a", TINTA = "#2a1a14", FUNDO = "#fbf1e6", AZ = "#2f6fb0", CREME = "#fffaf2";
rim.color.set(0xffe2b8); rim.intensity = 1.4; key.color.set(0xfff4e6); key.intensity = 140; key.position.set(2, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xfff0e0, .6));
// ---------- camarim ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = BEGE; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(176,38,58,.08)"; for (let x = 0; x < w; x += 24) g.fillRect(x, 0, 10, h); g.fillStyle = "#d8c2a6"; g.fillRect(0, 190, w, 6); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const cT = ctex(128, 256, (g, w, h) => { g.fillStyle = CORT; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 16) { const gr = g.createLinearGradient(x, 0, x + 16, 0); gr.addColorStop(0, "rgba(0,0,0,.3)"); gr.addColorStop(.5, "rgba(255,255,255,.1)"); gr.addColorStop(1, "rgba(0,0,0,.3)"); g.fillStyle = gr; g.fillRect(x, 0, 16, h); } });
for (const x of [-3.4, 3.4]) mesh(new THREE.PlaneGeometry(2.2, 5), new THREE.MeshStandardMaterial({ map: cT }), S, x, 2.5, -2.6).castShadow = false;
const chT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? "#2a1a14" : "#efe2cf"; g.fillRect(x * 32, y * 32, 32, 32); } }); chT.wrapS = chT.wrapT = THREE.RepeatWrapping; chT.repeat.set(5, 3);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: chT, roughness: .5 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// penteadeira + espelho-IA com lâmpadas
box(2.6, .1, .8, M("#8a5a33", { roughness: .5 }), S, -.9, .9, -1.8); for (const x of [-2.1, .3]) box(.1, .9, .7, M("#6b4426"), S, x, .45, -1.8);
const espC = document.createElement("canvas"); espC.width = 512; espC.height = 320; const eg = espC.getContext("2d"); const espT = new THREE.CanvasTexture(espC); espT.colorSpace = THREE.SRGBColorSpace;
box(2.3, 1.55, .08, M(OURO, { metalness: .6, roughness: .3 }), S, -.9, 1.85, -2.15); mesh(new THREE.PlaneGeometry(2.1, 1.35), new THREE.MeshBasicMaterial({ map: espT }), S, -.9, 1.85, -2.1).castShadow = false;
const LAMPS = []; for (let i = 0; i < 16; i++) { const per = i / 16, a = per * 2 * (1.15 + .78); let x, y; const P = 2 * (2.3 + 1.55), d = per * P; if (d < 2.3) { x = -2.05 + d; y = 2.63; } else if (d < 3.85) { x = .25; y = 2.63 - (d - 2.3); } else if (d < 6.15) { x = .25 - (d - 3.85); y = 1.07; } else { x = -2.05; y = 1.07 + (d - 6.15); } LAMPS.push(mesh(new THREE.SphereGeometry(.07, 10, 8), E("#fff1c4", 1.2), S, x, y, -2.08)); }
let espTxt = "GÊNIO!", espSincero = false;
const desEsp = t => { const g = eg; if (espSincero) { g.fillStyle = "#eef3f8"; g.fillRect(0, 0, 512, 320); g.fillStyle = TINTA; g.font = "400 48px BB"; g.textAlign = "left"; ["1. O PREÇO TÁ ALTO", "2. FALTA CLIENTE", "3. TEM CONCORRENTE"].forEach((s, i) => g.fillText(s, 40, 90 + i * 80)); espT.needsUpdate = true; return; }
  const gr = g.createLinearGradient(0, 0, 0, 320); gr.addColorStop(0, "#ffd6e2"); gr.addColorStop(1, "#ffeef3"); g.fillStyle = gr; g.fillRect(0, 0, 512, 320);
  for (let i = 0; i < 8; i++) { g.fillStyle = `rgba(255,80,120,${.25 + .2 * Math.sin(t * 3 + i)})`; const x = (i * 71 + t * 30) % 512, y = 40 + (i * 53) % 240; g.beginPath(); g.moveTo(x, y + 8); g.bezierCurveTo(x - 22, y - 12, x - 8, y - 26, x, y - 12); g.bezierCurveTo(x + 8, y - 26, x + 22, y - 12, x, y + 8); g.fill(); }
  g.fillStyle = CORT2; g.font = "400 120px BB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(espTxt, 256, 165 + Math.sin(t * 6) * 4); espT.needsUpdate = true; };
// placa APLAUSOS
const plC = document.createElement("canvas"); plC.width = 512; plC.height = 128; const pg = plC.getContext("2d"); const plT = new THREE.CanvasTexture(plC); plT.colorSpace = THREE.SRGBColorSpace;
const PLACA = new THREE.Group(); PLACA.position.set(1.5, 3.0, -1.4); S.add(PLACA); box(1.9, .55, .14, M("#222"), PLACA, 0, 0, 0); mesh(new THREE.PlaneGeometry(1.8, .45), new THREE.MeshBasicMaterial({ map: plT }), PLACA, 0, 0, .075).castShadow = false; for (const x of [-.8, .8]) box(.02, 1.2, .02, M("#555"), PLACA, x, .85, 0);
const desPl = on => { pg.fillStyle = on ? "#b0263a" : "#3a2a2a"; pg.fillRect(0, 0, 512, 128); pg.fillStyle = on ? "#fff4d6" : "#6a5555"; pg.font = "400 92px BB"; pg.textAlign = "center"; pg.textBaseline = "middle"; if (on) { pg.shadowColor = "#ffd27a"; pg.shadowBlur = 24; } pg.fillText("APLAUSOS", 256, 70); pg.shadowBlur = 0; plT.needsUpdate = true; };
// arara de roupas + banquinho
box(.05, 1.8, .05, M("#999", { metalness: .7 }), S, 2.9, .9, -1.9); box(1.4, .05, .05, M("#999", { metalness: .7 }), S, 2.3, 1.78, -1.9); [OURO, CORT, AZ, "#3a8a5a"].forEach((c, i) => box(.28, .8, .1, M(c), S, 1.8 + i * .32, 1.3, -1.9));
box(.6, .08, .6, M("#8a5a33"), S, -1.4, .6, -.6); for (const [x, z] of [[-1.65, -.85], [-1.15, -.85], [-1.65, -.35], [-1.15, -.35]]) box(.05, .6, .05, M("#6b4426"), S, x, .3, z);
// ---------- mascote: luva de boxe só na mão direita ----------
const LUVA = new THREE.Group(); LUVA.position.set(.42, 0, 0); MAS.bracos[1].add(LUVA); mesh(new THREE.SphereGeometry(.24, 16, 12), M("#d62839", { roughness: .35 }), LUVA, .1, 0, 0).scale.set(1.15, 1, 1); box(.16, .2, .2, M("#fff"), LUVA, -.12, 0, 0);
const MX = .9, MZ = .5;
const ouve = (lt, ry = -.3) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .55 + Math.sin(lt * 2) * .08], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const vaidoso = lt => { pose(MAS, { x: MX - .2, z: MZ, y: hop(lt, .4, .1), ry: -.5, braco: [1.6 + Math.sin(lt * 6) * .2, 1.0], piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(lt * 3) * .05; };
const soco = (lt, t0) => { const u = lt - t0, k = u < 0 ? 0 : u < .25 ? u / .25 : u < .6 ? 1 : Math.max(0, 1 - (u - .6) / .4); pose(MAS, { x: MX + .25, z: MZ - .4, y: hop(lt, .6, .03) + k * .5, ry: .5, braco: [.4, .6 + k * 2.1], sq: k * .04, piscar: pisca(lt) }); MAS.g.rotation.z = -k * .1; return u > .25; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let POTE = 0, plOn = 1;
const reset = (lt) => { espSincero = false; espTxt = ["GÊNIO!", "PERFEITO!", "INCRÍVEL!"][Math.floor(lt / 1.2) % 3]; LAMPS.forEach((l, i) => l.material.emissiveIntensity = .8 + .6 * Math.max(0, Math.sin(lt * 5 + i))); PLACA.rotation.z = 0; };
// ---------- câmera na mão ----------
const BS = { gancho: [V(-.3, 2.55, 7.3), V(-.2, 1.7, -1.6)], s1: [V(.4, 2.35, 6.7), V(.2, 1.5, -1.2)], s2: [V(-.6, 2.45, 6.5), V(-.7, 1.8, -2.0)], s3: [V(.8, 2.75, 6.9), V(.9, 2.0, -1.2)], s4: [V(-.4, 2.45, 6.7), V(-.6, 1.7, -1.8)], cta: [V(0, 2.55, 7.7), V(0, 1.6, -1.2)] };
const SHOTS = {}; Object.keys(BS).forEach(n => { const s = [BS[n][0], BS[n][1]]; SHOTS[n] = [s, s]; });
const camera = (cam, nome, lt, d, t) => { const [p, l] = BS[nome] || BS.cta, u = lt / d; const nx = Math.sin(t * 1.3) * .05 + Math.sin(t * 3.7) * .02, ny = Math.sin(t * 1.7 + 1) * .04 + Math.sin(t * 4.3) * .015;
  cam.position.set(p.x + nx, p.y + ny, p.z - u * .35); cam.lookAt(l.x + nx * .4, l.y + ny * .4, l.z); cam.rotateZ(Math.sin(t * 1.1) * .012); };
const ACT = {
  gancho(lt, d, t) { reset(lt); plOn = 1; desPl(1); desEsp(lt); POTE = 0; vaidoso(lt); },
  s1(lt, d, t) { reset(lt); desPl(1); desEsp(lt); POTE = eio(lin(lt, .2, d * .9)); ouve(lt); },
  s2(lt, d, t) { reset(lt); desPl(1); espTxt = "SIM!"; desEsp(lt); POTE = 1; ouve(lt, -.5); },
  s3(lt, d, t) { reset(lt); const bateu = soco(lt, .5); desPl(!bateu || Math.floor(lt * 12) % 7 === 0 && lt < 1.2); PLACA.rotation.z = bateu ? Math.min(.25, (lt - .75) * 1.2) * Math.cos((lt - .75) * 8) : 0; desEsp(lt); POTE = 1; },
  s4(lt, d, t) { reset(lt); desPl(0); PLACA.rotation.z = .12; espSincero = lt > .8; desEsp(lt); POTE = 1; ouve(lt, -.4); },
  cta(lt, d, t) { reset(lt); desPl(0); PLACA.rotation.z = .12; espSincero = true; desEsp(lt); POTE = 1; ouve(lt, -.2); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px BB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const coracao = (x, y, r, cor) => { X.fillStyle = cor; X.beginPath(); X.moveTo(x, y + r * .7); X.bezierCurveTo(x - r * 1.3, y - r * .3, x - r * .5, y - r * 1.2, x, y - r * .4); X.bezierCurveTo(x + r * .5, y - r * 1.2, x + r * 1.3, y - r * .3, x, y + r * .7); X.fill(); };
  const maquina = (txt, x, y, lt, t0, fs, cor = TINTA, mx = 820) => { if (lt < t0) return; const n = Math.max(0, Math.min(txt.length, Math.floor((lt - t0) * 22))); X.font = `400 ${cabe(fs, txt, mx)}px BB`; X.textAlign = "left"; X.textBaseline = "middle"; X.fillStyle = cor; const s = txt.slice(0, n); X.fillText(s, x, y); if (n < txt.length || Math.floor(lt * 3) % 2) { const w = X.measureText(s).width; X.fillRect(x + w + 4, y - fs * .38, 6, fs * .76); } };
  const papel = (x, y, w, h) => { X.save(); X.shadowColor = "rgba(0,0,0,.2)"; X.shadowBlur = 14; X.fillStyle = CREME; X.fillRect(x, y, w, h); X.restore(); X.strokeStyle = "rgba(47,111,176,.25)"; X.lineWidth = 2; for (let yy = y + 40; yy < y + h; yy += 40) { X.beginPath(); X.moveTo(x, yy); X.lineTo(x + w, yy); X.stroke(); } };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(251,241,230,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1" || nome === "s2") { const x = 800, y = 860, w = 150, h = 180; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,255,255,.92)"; X.beginPath(); X.roundRect(-110, -h / 2 - 40, 220, h + 130, 20); X.fill();
        X.fillStyle = "rgba(255,200,215,.35)"; X.strokeStyle = CORT; X.lineWidth = 5; X.beginPath(); X.roundRect(-w / 2, -h / 2, w, h, 22); X.fill(); X.stroke(); X.fillStyle = OURO; X.fillRect(-w / 2 + 12, -h / 2 - 20, w - 24, 22);
        X.save(); X.beginPath(); X.roundRect(-w / 2 + 5, -h / 2 + 5, w - 10, h - 10, 18); X.clip(); const n = Math.floor(POTE * 30); for (let i = 0; i < n; i++) coracao(-w / 2 + 22 + (i % 5) * 26 + (Math.floor(i / 5) % 2) * 10, h / 2 - 18 - Math.floor(i / 5) * 26, 13, i % 3 ? "#e8445e" : "#ff8aa0"); X.restore();
        X.fillStyle = TINTA; X.font = "400 40px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("CURTIDAS", 0, h / 2 + 36); X.fillStyle = CORT; X.font = "400 26px BB"; X.fillText("QUANDO ELA CONCORDA", 0, h / 2 + 68); X.restore(); }
      if (nome === "s2") { papel(80, 640, 600, 130); maquina("ABRIL 2025: DESFEITA EM 4 DIAS", 100, 706, lt, .4, 56, CORT2, 560); }
      if (nome === "s4") { papel(80, 630, 900, 170); maquina("APONTE OS 3 MAIORES PROBLEMAS", 104, 680, lt, .3, 58, TINTA, 850); maquina("DA MINHA IDEIA. SEM ELOGIO.", 104, 750, lt, 1.8, 58, CORT2, 850); } },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(-.012); X.shadowColor = "rgba(40,20,10,.22)"; X.shadowBlur = 18; X.shadowOffsetY = 6; X.fillStyle = CREME; X.fillRect(-445, -122, 890, 244); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(47,111,176,.3)"; X.lineWidth = 2; for (let y = -70; y < 122; y += 54) { X.beginPath(); X.moveTo(-445, y); X.lineTo(445, y); X.stroke(); } X.strokeStyle = "rgba(232,50,60,.45)"; X.beginPath(); X.moveTo(-375, -122); X.lineTo(-375, 122); X.stroke();
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(76, l1, 790); X.fillText(l1, -350, -30); X.fillStyle = CORT; cabe(64, l2, 790); X.fillText(l2, -350, 34); X.fillStyle = AZ; cabe(58, l3, 790); X.fillText(l3, -350, 94); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 92; X.font = `400 ${fs}px BB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 860 && fs > 48) { fs -= 2; X.font = `400 ${fs}px BB`; }
      const y = 1400, x0 = 505 - tot() / 2; X.fillStyle = "rgba(42,26,20,.82)"; X.beginPath(); X.roundRect(x0 - 26, y - fs * .62, tot() + 36, fs * 1.2, 16); X.fill();
      let x = x0; X.textAlign = "left"; X.textBaseline = "middle"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2, ch_ = w.w.replace(/[.,!?:]/g, "").toUpperCase() === CHAVE; X.fillStyle = ch_ ? "#ff8aa0" : at ? OURO : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .4) return; const r = eio(lt / .4) * 1300;
      X.save(); X.fillStyle = CORT2; X.beginPath(); X.rect(0, 0, 1080, 1920); X.moveTo(505 + Math.max(1, r), 1000); X.arc(505, 1000, Math.max(1, r), 0, Math.PI * 2, true); X.closePath(); X.fill();
      X.strokeStyle = OURO; X.lineWidth = 14; X.beginPath(); X.arc(505, 1000, Math.max(1, r), 0, Math.PI * 2); X.stroke(); X.restore(); },
    fechamento(lt) { // tela CONTINUE? com contagem
      X.fillStyle = "rgba(20,10,8,.88)"; X.beginPath(); X.roundRect(90, 660, 830, 640, 30); X.fill(); X.strokeStyle = OURO; X.lineWidth = 6; X.stroke();
      X.textAlign = "center"; X.textBaseline = "middle"; X.fillStyle = "#fff"; X.font = "400 110px BB"; X.fillText("CONTINUE?", 505, 770); const n = Math.max(0, 9 - Math.floor(lt * 1.6)); X.fillStyle = OURO; X.font = "400 190px BB"; X.save(); X.translate(505, 950); const pp = 1 + .12 * (1 - ((lt * 1.6) % 1)); X.scale(pp, pp); X.fillText(String(n), 0, 0); X.restore();
      const p = back(lin(lt, .5, .9)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 1140); X.scale(p, p); X.fillStyle = CORT; X.beginPath(); X.roundRect(-320, -66, 640, 132, 66); X.fill(); X.fillStyle = "#fff"; X.font = `400 ${cabe(90, "COMENTA " + CHAVE, 580)}px BB`; X.fillText("COMENTA " + CHAVE, 0, 6); X.restore();
      if (lt > 1.0) { X.globalAlpha = eo(lin(lt, 1.0, 1.4)); X.fillStyle = "#f3e3cf"; X.font = "400 44px BB"; X.fillText("E RECEBE O PROMPT DA OPINIÃO SINCERA", 505, 1250); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: CORT, VERDE: OURO, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

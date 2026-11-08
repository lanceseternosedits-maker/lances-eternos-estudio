// Reel 📜 história "Eles colaram segredo da Samsung no ChatGPT" (abril/maio de 2023; 10/11 21:30). Motor da cena_contagem.
// Identidade: fábrica de chips com luz de sala limpa (branco-gelo), bancada com wafers e um notebook com o chat (genérico,
// sem logo), pastas CONFIDENCIAL que voam para dentro da tela, giroflex vermelho e uma cancela de estacionamento que desce na
// frente do notebook. Branco-gelo + vermelho-alarme + azul-sala-limpa. Sem logo da Samsung nem da OpenAI.
// Elementos (nome trocado de carimbo para máquina de escrever, para não repetir o Internet somada que sai antes): placa de
// aviso de fábrica, nome em máquina de escrever, sem contador (história), legenda uma palavra gigante por vez com pop, flash
// branco, travelling lateral, fechamento com cartazes/post-its na parede, Fraunces. Mascote de touca de sala limpa (no topo);
// ação principal: correr atrás das pastas voando.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const GELO = "#eef4f8", AZUL = "#3d8bd9", AZUL2 = "#1f5ea8", VERM = "#e5262e", VERM2 = "#a8141a", TINTA = "#121a24", FUNDO = "#e6eef4", AMAR = "#ffd23f";
rim.color.set(0xdcecff); rim.intensity = 1.2; key.color.set(0xffffff); key.intensity = 150; key.position.set(1, 9, 6); key.target.position.set(0, .9, -.3);
S.add(new THREE.AmbientLight(0xeef6ff, .6));
const giro = new THREE.SpotLight(0xff2a2a, 0, 12, .5, .5, 1); giro.position.set(2.3, 2.9, -1.4); S.add(giro, giro.target);

// ---------- cenário: sala limpa ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#f4f8fb"; g.fillRect(0, 0, w, h); g.fillStyle = "#dbe5ee"; for (let x = 0; x < w; x += 128) g.fillRect(x, 0, 4, h); g.fillStyle = "#cfe3f7"; g.fillRect(0, 60, w, 70); g.fillStyle = "#a9c9ea"; for (let x = 12; x < w; x += 64) g.fillRect(x, 66, 50, 58); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.6).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(22, 12), M("#dfe7ee", { roughness: .4 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
const faixa = mesh(new THREE.PlaneGeometry(22, .12), M(AMAR), S, 0, .005, .1); faixa.rotation.x = -Math.PI / 2;
// bancada com wafers + notebook com o chat
box(3.0, .08, 1.0, M("#c9d3dc", { metalness: .3, roughness: .3 }), S, .6, .9, -.6); for (const x of [-.8, 2.0]) box(.08, .9, .9, M("#aab6c1", { metalness: .4 }), S, x, .45, -.6);
const wafT = ctex(128, 128, g => { const gr = g.createRadialGradient(64, 64, 10, 64, 64, 64); gr.addColorStop(0, "#c7f0ff"); gr.addColorStop(.5, "#b49cff"); gr.addColorStop(1, "#7fd6c6"); g.fillStyle = gr; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); g.strokeStyle = "rgba(255,255,255,.4)"; for (let i = 12; i < 128; i += 12) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 128); g.moveTo(0, i); g.lineTo(128, i); g.stroke(); } });
for (const [x, z] of [[-.4, -.75], [-.05, -.45], [-.45, -.3]]) { const w = mesh(new THREE.CylinderGeometry(.18, .18, .015, 32), [M("#ccc"), new THREE.MeshStandardMaterial({ map: wafT, metalness: .6, roughness: .2 }), M("#ccc")], S, x, .95, z); }
const NB = new THREE.Group(); NB.position.set(1.1, .94, -.6); NB.rotation.y = -.35; NB.scale.setScalar(1.5); S.add(NB); box(1.0, .04, .65, M("#b9bfc7"), NB, 0, .02, 0);
const telT = ctex(360, 230, (g, w, h, n = 0, bloq = 0) => { g.fillStyle = "#f7f9fc"; g.fillRect(0, 0, w, h); g.fillStyle = "#e3e9f1"; g.fillRect(0, 0, w, 34); g.fillStyle = TINTA; g.font = "700 22px FR"; g.fillText("CHAT IA", 14, 24);
  for (let i = 0; i < Math.min(4, n); i++) { const y = 44 + i * 44; g.fillStyle = "#dbe8ff"; g.beginPath(); g.roundRect(110, y, 236, 36, 12); g.fill(); g.fillStyle = VERM; g.font = "700 16px FR"; g.fillText(["</> código", "anotação da reunião", "código", "tabela"][i], 124, y + 23); }
  if (bloq) { g.fillStyle = "rgba(229,38,46,.88)"; g.fillRect(0, 0, w, h); g.fillStyle = "#fff"; g.font = "700 46px FR"; g.textAlign = "center"; g.fillText("BLOQUEADO", w / 2, h / 2 + 14); } });
const tela = mesh(new THREE.BoxGeometry(1.0, .64, .03), [M("#9aa2ad"), M("#9aa2ad"), M("#9aa2ad"), M("#9aa2ad"), new THREE.MeshStandardMaterial({ map: telT, emissive: "#fff", emissiveMap: telT, emissiveIntensity: .8 }), M("#9aa2ad")], NB, 0, .34, -.31); tela.rotation.x = -.18;
let telU = ""; const telaD = (n, b) => { const u = n + "|" + b; if (u !== telU) { telU = u; telT.draw(n, b); } };
// pastas CONFIDENCIAL
const pastaT = txt => ctex(200, 150, g => { g.fillStyle = "#f2c46d"; g.fillRect(0, 0, 200, 150); g.fillStyle = "#e3ad48"; g.fillRect(0, 0, 80, 18); g.save(); g.translate(100, 82); g.rotate(-.18); g.strokeStyle = VERM; g.lineWidth = 6; g.strokeRect(-88, -24, 176, 48);
  g.fillStyle = VERM; g.font = "700 24px FR"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("CONFIDENCIAL", 0, 2); g.restore(); g.fillStyle = TINTA; g.font = "700 20px FR"; g.textAlign = "center"; g.fillText(txt, 100, 136); });
const PASTAS = ["</> código", "reunião", "código", "tabela"].map(t => { const m = mesh(new THREE.BoxGeometry(.6, .45, .03), [M("#e3ad48"), M("#e3ad48"), M("#e3ad48"), M("#e3ad48"), new THREE.MeshStandardMaterial({ map: pastaT(t) }), M("#e3ad48")], S); m.visible = false; return m; });
// giroflex + cancela
const GF = new THREE.Group(); GF.position.set(2.3, 2.75, -2.3); S.add(GF); box(.3, .08, .3, M("#555"), GF, 0, 0, 0); const cup = mesh(new THREE.CylinderGeometry(.14, .14, .25, 16), E(VERM, .3), GF, 0, .16, 0);
const CAN = new THREE.Group(); CAN.position.set(-.1, 0, -.05); S.add(CAN); box(.25, .9, .25, M("#ddd"), CAN, 0, .45, 0); box(.3, .14, .3, M(VERM), CAN, 0, .85, 0);
const brT = ctex(256, 32, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#fff" : VERM; g.fillRect(i * 32, 0, 32, h); } });
const BRACO = new THREE.Group(); BRACO.position.set(0, .88, .16); CAN.add(BRACO); box(2.5, .1, .06, new THREE.MeshStandardMaterial({ map: brT }), BRACO, 1.25, 0, 0);

// ---------- mascote: touca de sala limpa (no topo); correr atrás das pastas ----------
const TOU = new THREE.Group(); TOU.position.set(0, 1.5, 0); MAS.corpo.add(TOU); const tM = M("#f8fbff", { roughness: .95 }); const tc = mesh(new THREE.SphereGeometry(.72, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2), tM, TOU, 0, -.02, 0); tc.scale.set(1.08, .45, .76);
mesh(new THREE.TorusGeometry(.7, .04, 8, 40), M("#dfe8f2"), TOU, 0, 0, 0).rotation.x = Math.PI / 2;
const MZ = -.05;
const corre = (lt, x, dir = 1) => { pose(MAS, { x, z: MZ, y: hop(lt, .18, .08), ry: dir > 0 ? .9 : -.9, braco: [1.6 + Math.sin(lt * 14) * .4, 1.6 - Math.sin(lt * 14) * .4], andar: lt * 3.5, piscar: pisca(lt) }); MAS.g.rotation.z = -dir * .08; };
const para = (lt, x, ry = .2, br = [.3, .5]) => { pose(MAS, { x, z: MZ, y: hop(lt, .8, .02), ry, braco: br, piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const voaPasta = (i, lt, t0, de, x0) => { const m = PASTAS[i]; const k = lin(lt, t0, t0 + 1.4); m.visible = k > 0 && k < 1; if (!m.visible) return k >= 1; const e = eio(k);
  const alvo = V(1.1, 1.45, -.75); m.position.set(x0 + (alvo.x - x0) * e, 1.0 + Math.sin(k * Math.PI) * 1.1 + (alvo.y - 1.0) * e, .4 + (alvo.z - .4) * e); m.rotation.set(Math.sin(k * 9) * .4, k * 5, Math.cos(k * 7) * .3); m.scale.setScalar(1.7 * (1 - e * .7)); return false; };
let ALARME = 0;
const alarme = (lt, on) => { ALARME = on ? 1 : 0; giro.intensity = on ? 60 : 0; cup.material.emissiveIntensity = on ? 2.5 + Math.sin(lt * 20) * 1 : .3; GF.rotation.y = lt * 8; giro.target.position.set(2.3 + Math.cos(lt * 8) * 3, 0, -1.4 + Math.sin(lt * 8) * 3); };

grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = () => { PASTAS.forEach(p => p.visible = false); BRACO.rotation.z = Math.PI / 2 * .98; CAN.visible = false; alarme(0, false); };

// ---------- travelling lateral ----------
const TR = { gancho: [-.4, .4], s1: [-.7, .1], s2: [.4, -.3], s3: [-.1, .5], s4: [.4, -.1], cta: [.1, -.1] };
const SHOTS = {}; Object.keys(TR).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a, b] = TR[nome] || TR.cta, x = a + (b - a) * eio(lt / d); cam.position.set(x, 2.0, 5.7); cam.lookAt(x * .6 + .15, 1.2, -.6); };

const ACT = {
  gancho(lt, d) { reset(); let n = 0; [0, 2].forEach((i, j) => { if (voaPasta(i, lt, 1.0 + j * 1.6, 0, -2.4)) n++; }); telaD(n, 0); alarme(lt, lt > d * .72);
    if (lt < d * .72) corre(lt, -1.45 + eio(lin(lt, .6, d * .7)) * 1.2); else para(lt, -.3, .5, [1.8 + Math.sin(lt * 10) * .3, 1.8 + Math.sin(lt * 10 + 1) * .3]); },
  s1(lt, d) { reset(); telaD(voaPasta(1, lt, .3, 0, -2.2) ? 3 : 2, 0); corre(lt, -1.5 + eio(lin(lt, 0, d)) * 1.2); PASTAS[1].visible && (PASTAS[1].visible = true); },
  s2(lt, d) { reset(); const ok = voaPasta(3, lt, .2, 0, 2.8); telaD(ok ? 4 : 3, 0); corre(lt, .3 - eio(lin(lt, 0, d)) * 1.2, -1); },
  s3(lt, d) { reset(); CAN.visible = true; const k = lin(lt, .4, 1.4); BRACO.rotation.z = Math.PI / 2 * .98 * (1 - eo(k)); alarme(lt, k > 0 && lt < d - 1); telaD(4, k >= 1 ? 1 : 0); para(lt, -1.15, .4, [.3, .4]); MAS.g.rotation.z = Math.sin(lt * 1.5) * .05; },
  s4(lt, d) { reset(); CAN.visible = true; BRACO.rotation.z = 0; telaD(4, 1); para(lt, -1.15, .2); },
  cta(lt, d) { reset(); CAN.visible = true; BRACO.rotation.z = 0; telaD(4, 1); pose(MAS, { x: -1.15, z: MZ, y: hop(lt, .4, .2), ry: .2, braco: [.3, 2.0 + Math.sin(lt * 9) * .4], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
};

// ---------- elementos de tela (2D): entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 22) { X.font = `700 ${f}px FR`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const maquina = (alvo, x, y, lt, t, cor = TINTA) => { const k = Math.floor(lin(lt, .2, .2 + alvo.length * .055) * alvo.length), txt = alvo.slice(0, k); X.font = "700 46px FR"; const w = X.measureText(alvo).width + 50;
    X.fillStyle = "rgba(255,255,255,.95)"; X.beginPath(); X.roundRect(x, y - 44, w, 88, 10); X.fill(); X.strokeStyle = TINTA; X.lineWidth = 3; X.stroke(); X.fillStyle = cor; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText(txt, x + 25, y + 2);
    if (k < alvo.length || (t * 2 % 1) < .5) { X.fillStyle = VERM; X.fillRect(x + 29 + X.measureText(txt).width, y - 24, 5, 50); } };
  const toggle = (k, x, y) => { X.fillStyle = "rgba(255,255,255,.96)"; X.beginPath(); X.roundRect(x, y - 70, 870, 140, 22); X.fill(); X.fillStyle = TINTA; X.font = "700 40px FR"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("Usar minhas conversas", x + 36, y - 18); X.fillText("pra treinar a IA", x + 36, y + 30);
    const on = 1 - eo(k), tx = x + 690, c = on > .5 ? "#2fb36b" : "#b9c3cc"; X.fillStyle = c; X.beginPath(); X.roundRect(tx, y - 38, 140, 76, 38); X.fill(); X.fillStyle = "#fff"; X.beginPath(); X.arc(tx + 38 + on * 64, y, 30, 0, 7); X.fill(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); if (ALARME) { X.fillStyle = `rgba(229,38,46,${.08 + .06 * Math.sin(t * 20)})`; X.fillRect(0, 0, 1080, 1920); } },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(230,238,244,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") maquina("abril de 2023", 60, 650, lt, t, AZUL2);
      if (nome === "s3") maquina("proibida nos aparelhos da empresa", 60, 650, lt, t, VERM2);
      if (nome === "s4") toggle(lin(lt, d4(lt) * .55, d4(lt) * .55 + .6), 70, 700); },
    etiqueta(t, nome) { // placa de aviso de fábrica
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.fillStyle = "#fff"; X.beginPath(); X.roundRect(-455, -130, 910, 260, 16); X.fill(); X.strokeStyle = VERM; X.lineWidth = 10; X.stroke();
      X.fillStyle = VERM; X.fillRect(-455, -130, 910, 66); X.fillStyle = "#fff"; X.font = "700 34px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("ÁREA RESTRITA", 0, -97);
      X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(46, l1, 860); X.fillText(l1, 0, -2); X.fillStyle = AZUL2; cabe(44, l2, 860); X.fillText(l2, 0, 52); X.fillStyle = VERM2; cabe(40, l3, 860); X.fillText(l3, 0, 102); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ws = seg.palavras; let w = ws.findIndex(x => t < x.t1 + .06); if (w < 0) w = ws.length - 1; const W = ws[w]; if (t < W.t0 - .25) return;
      const p = back(lin(t, W.t0 - .04, W.t0 + .14)); const txt = W.w.replace(/[,.:]$/, ""), chave = txt.replace(/[?!]/g, "").toUpperCase() === CHAVE;
      let f = 124; X.font = `700 ${f}px FR`; while (X.measureText(txt).width > 820 && f > 50) { f -= 4; X.font = `700 ${f}px FR`; }
      X.save(); X.translate(505, 1395); X.scale(.6 + .4 * p, .6 + .4 * p); X.textAlign = "center"; X.textBaseline = "middle"; X.lineWidth = 16; X.strokeStyle = "#fff"; X.lineJoin = "round"; X.strokeText(txt, 0, 0); X.fillStyle = chave ? VERM : TINTA; X.fillText(txt, 0, 0); X.restore(); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .14) return; X.fillStyle = `rgba(255,255,255,${.85 * (1 - lt / .14)})`; X.fillRect(0, 0, 1080, 1920); },
    fechamento(lt) { // cartazes na parede
      const P = [["COMENTA " + CHAVE, AMAR, 505, 780, -.03, 80, TINTA, 720, 170], ["desliga o uso das conversas no treino", "#cfe3f7", 290, 1060, .05, 42, TINTA, 400, 230], ["salva pra contar pra alguém", "#ffd0d2", 720, 1080, -.05, 42, VERM2, 380, 230]];
      P.forEach(([txt, cor, x, y, r, f, tc, w, h], i) => { const p = back(lin(lt, i * .2, i * .2 + .35)); if (p <= 0) return; X.save(); X.translate(x, y); X.rotate(r + Math.sin(lt * 2 + i) * .01); X.scale(p, p);
        X.shadowColor = "rgba(20,30,40,.3)"; X.shadowBlur = 16; X.shadowOffsetY = 8; X.fillStyle = cor; X.fillRect(-w / 2, -h / 2, w, h); X.shadowColor = "transparent"; X.fillStyle = "rgba(255,255,255,.6)"; X.fillRect(-50, -h / 2 - 14, 100, 28);
        X.fillStyle = tc; X.textAlign = "center"; X.textBaseline = "middle"; X.font = `700 ${f}px FR`; const ws = txt.split(" "), L = []; let c = ""; for (const w2 of ws) { const tt = c ? c + " " + w2 : w2; if (X.measureText(tt).width > w - 40 && c) { L.push(c); c = w2; } else c = tt; } L.push(c);
        L.forEach((l, k) => X.fillText(l, 0, (k - (L.length - 1) / 2) * f * 1.15 + 4)); X.restore(); });
      if (lt > 1.0) { X.globalAlpha = eo(lin(lt, 1.0, 1.4)); X.fillStyle = TINTA; X.font = "700 44px FR"; X.textAlign = "center"; X.fillText("Você já colou algo que não devia?", 505, 1320); X.globalAlpha = 1; } },
  }; };
let D4 = 5; const d4 = () => D4;
const cores = { LAR: VERM, VERDE: AZUL, FUNDO, CREME: "#ffffff", TINTA, BRILHO: "rgba(0,0,0,0)" };
const MOD = { SHOTS, ACT, cores, semPalco: true, ui, camera };
const s4 = ACT.s4; ACT.s4 = (lt, d) => { D4 = d; return s4(lt, d); };
return MOD;
}

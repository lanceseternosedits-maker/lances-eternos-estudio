// Reel ⚙️ como funciona "Para de descrever: manda print" (09/11 12:00). Motor da cena_contagem (mesmo mascote 3D).
// Identidade: assistência técnica de bairro: balcão mostarda, celular aberto no suporte com tela de erro, quadro de cortiça
// atrás onde as fotos instantâneas vão sendo presas (tela de erro, gráfico, conta de luz, cardápio); paleta mostarda + azul-elétrico.
// Elementos: etiqueta em tela de terminal, nome escrito à mão, placar 8-bit HI-SCORE (fotos tiradas), legenda em balão de fala
// do mascote, transição de virada de página, câmera plongée/contra-plongée, fechamento lista + pílulas COMENTA, Space Grotesk.
// Mascote com lupa de relojoeiro levantada na testa (nada na frente dos olhos); ação principal: tirar foto com a câmera instantânea.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const MOS = "#e9b52c", MOS2 = "#b9860f", AZ = "#1f6bff", AZ2 = "#0b3fb3", CREME = "#fff8e6", TINTA = "#141a2a", FUNDO = "#f6e7bd", VERM = "#ff4a4a", VERDE = "#22c27a";
rim.color.set(0x9fc0ff); rim.intensity = 1.3; key.color.set(0xfff1d6); key.intensity = 150; key.position.set(1.5, 9, 6); key.target.position.set(0, .9, -.3);
S.add(new THREE.AmbientLight(0xfff4e0, .5));
const flash = new THREE.PointLight(0xffffff, 0, 8); flash.position.set(-.6, 1.6, 1.2); S.add(flash);

// ---------- cenário: parede de azulejo azul, piso, balcão mostarda ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#cfe0ff"; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(31,107,255,.25)"; g.lineWidth = 2; for (let x = 0; x < w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.4).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(22, 12), M("#5b6478", { roughness: .9 }), S, 0, 0, 2); chao.rotation.x = -Math.PI / 2;
const BX = .55, BZ = -.5, TOPO = 1.0;
box(3.4, TOPO, 1.0, M(MOS, { roughness: .6 }), S, BX, TOPO / 2, BZ); box(3.55, .07, 1.1, M("#2b3247"), S, BX, TOPO + .03, BZ);
box(3.4, .12, .02, M(AZ), S, BX, .55, BZ + .51);
// quadro de cortiça com 4 vagas de foto
const cT = ctex(256, 128, (g, w, h) => { g.fillStyle = "#c99a62"; g.fillRect(0, 0, w, h); for (let i = 0; i < 500; i++) { g.fillStyle = `rgba(${90 + i % 50},${60 + i % 30},30,.3)`; g.fillRect((i * 53) % w, (i * 29) % h, 2, 2); } });
mesh(new THREE.BoxGeometry(3.1, 1.25, .06), [M("#7a5a35"), M("#7a5a35"), M("#7a5a35"), M("#7a5a35"), new THREE.MeshStandardMaterial({ map: cT, roughness: .95 }), M("#7a5a35")], S, BX, 2.45, -1.6);
const VAGA = i => V(BX - 1.08 + i * .72, 2.45 + (i % 2 ? .06 : -.04), -1.54);

// celular aberto no suporte (tela muda por cena)
const telT = ctex(256, 480, (g, w, h, modo = "erro", k = 0) => { g.fillStyle = "#0f1424"; g.fillRect(0, 0, w, h);
  if (modo === "texto") { g.fillStyle = "#1c2440"; g.fillRect(0, 0, w, 54); g.fillStyle = "#fff"; g.font = "700 26px SG"; g.fillText("Chat", 20, 36);
    const n = Math.floor(k * 9); g.fillStyle = AZ; g.beginPath(); g.roundRect(30, 70, 210, 30 + n * 34, 18); g.fill(); g.fillStyle = "rgba(255,255,255,.85)"; for (let i = 0; i < n; i++) g.fillRect(46, 92 + i * 34, 170 - (i * 37) % 60, 12); return; }
  if (modo === "passos") { g.fillStyle = "#1c2440"; g.fillRect(0, 0, w, 54); g.fillStyle = "#fff"; g.font = "700 26px SG"; g.fillText("Chat", 20, 36);
    g.fillStyle = "#fff"; g.fillRect(120, 70, 116, 120); g.fillStyle = "#e7ecff"; g.fillRect(128, 78, 100, 84); g.fillStyle = VERM; g.beginPath(); g.moveTo(178, 92); g.lineTo(204, 140); g.lineTo(152, 140); g.fill();
    const n = Math.floor(k * 4); for (let i = 0; i < n; i++) { g.fillStyle = "#26304f"; g.beginPath(); g.roundRect(20, 210 + i * 80, 216, 66, 14); g.fill(); g.fillStyle = VERDE; g.font = "700 34px SG"; g.fillText("✓", 34, 254 + i * 80); g.fillStyle = "#dfe6ff"; g.fillRect(74, 230 + i * 80, 140 - i * 20, 10); g.fillRect(74, 250 + i * 80, 100, 10); } return; }
  // tela de erro (objeto reconhecível do 1º quadro)
  g.fillStyle = "#ffffff"; g.beginPath(); g.roundRect(24, 120, 208, 240, 20); g.fill(); g.fillStyle = VERM; g.beginPath(); g.moveTo(128, 150); g.lineTo(178, 238); g.lineTo(78, 238); g.closePath(); g.fill();
  g.fillStyle = "#fff"; g.font = "700 64px SG"; g.textAlign = "center"; g.fillText("!", 128, 230); g.fillStyle = TINTA; g.font = "700 40px SG"; g.fillText("ERRO", 128, 292); g.fillStyle = "#9aa3b8"; g.fillRect(56, 312, 144, 10); g.fillRect(76, 332, 104, 10);
  if (modo === "scan") { const y = 110 + (k % 1) * 270; g.fillStyle = "rgba(31,107,255,.35)"; g.fillRect(0, y - 30, w, 30); g.fillStyle = "#5fa0ff"; g.fillRect(0, y, w, 5); } });
const CEL = new THREE.Group(); CEL.position.set(BX + .75, TOPO + .06, BZ); S.add(CEL);
box(.5, .06, .4, M("#2b3247"), CEL, 0, .03, 0); const brac = box(.06, .5, .06, M("#2b3247"), CEL, 0, .3, -.1); brac.rotation.x = -.25;
const tela = mesh(new THREE.BoxGeometry(.66, 1.2, .06), [M("#11151f"), M("#11151f"), M("#11151f"), M("#11151f"), new THREE.MeshStandardMaterial({ map: telT, emissive: "#ffffff", emissiveMap: telT, emissiveIntensity: .55, roughness: .3 }), M("#11151f")], CEL, 0, .72, 0); tela.rotation.x = -.12;
let telU = ""; const telaD = (m, k = 0) => { const u = m + Math.round(k * 40); if (u !== telU) { telU = u; telT.draw(m, k); } };

// fotos instantâneas: tela de erro, gráfico, conta de luz, cardápio
const fotoT = tipo => ctex(160, 190, g => { g.fillStyle = "#fffdf7"; g.fillRect(0, 0, 160, 190); g.fillStyle = "#e9edf5"; g.fillRect(12, 12, 136, 130); const x = 12, y = 12;
  if (tipo === 0) { g.fillStyle = "#1c2440"; g.fillRect(x, y, 136, 130); g.fillStyle = VERM; g.beginPath(); g.moveTo(80, 36); g.lineTo(112, 96); g.lineTo(48, 96); g.fill(); g.fillStyle = "#fff"; g.font = "700 40px SG"; g.textAlign = "center"; g.fillText("!", 80, 90); }
  if (tipo === 1) { [40, 70, 55, 100].forEach((v, i) => { g.fillStyle = i === 3 ? AZ : "#8fb3ff"; g.fillRect(28 + i * 28, 132 - v, 20, v); }); }
  if (tipo === 2) { g.fillStyle = "#fff"; g.fillRect(36, 20, 88, 116); g.fillStyle = MOS; g.beginPath(); g.moveTo(84, 30); g.lineTo(66, 62); g.lineTo(80, 62); g.lineTo(72, 88); g.lineTo(96, 52); g.lineTo(82, 52); g.closePath(); g.fill();
    g.fillStyle = "#9aa3b8"; for (let i = 0; i < 3; i++) g.fillRect(46, 98 + i * 11, 68 - i * 12, 6); g.fillStyle = TINTA; g.font = "700 18px SG"; g.fillText("R$", 46, 132); }
  if (tipo === 3) { g.fillStyle = "#3a2a1c"; g.fillRect(36, 18, 88, 120); g.fillStyle = MOS; g.font = "700 18px SG"; g.textAlign = "center"; g.fillText("MENU", 80, 40); g.fillStyle = "#e8d8b8"; for (let i = 0; i < 5; i++) { g.fillRect(46, 54 + i * 15, 46, 5); g.fillRect(100, 54 + i * 15, 14, 5); } }
  g.fillStyle = "rgba(0,0,0,.08)"; g.fillRect(0, 150, 160, 40); });
const geoFo = new THREE.BoxGeometry(.5, .6, .015);
const FOTOS = [0, 1, 2, 3].map(t => { const l = M("#f4f0e6"); return mesh(geoFo, [l, l, l, l, new THREE.MeshStandardMaterial({ map: fotoT(t), roughness: .6 }), l], S); });
const PIN = [0, 1, 2, 3].map(i => mesh(new THREE.SphereGeometry(.045, 12, 8), M(i % 2 ? AZ : VERM), S));

// ---------- mascote: lupa de relojoeiro levantada na testa + câmera instantânea na mão direita ----------
const LUPA = new THREE.Group(); LUPA.position.set(.27, 1.52, .38); LUPA.rotation.x = -.9; MAS.corpo.add(LUPA);
mesh(new THREE.CylinderGeometry(.13, .1, .2, 18), M("#1d2333", { roughness: .3 }), LUPA, 0, 0, 0);
const CAM = new THREE.Group(); CAM.position.set(.42, .02, .16); MAS.bracos[1].add(CAM);
box(.46, .34, .3, M("#f2f2ee", { roughness: .4 }), CAM, 0, 0, 0); box(.46, .07, .3, M(AZ), CAM, 0, .1, 0.001);
const lente = mesh(new THREE.CylinderGeometry(.09, .1, .08, 20), M("#141a2a", { roughness: .2 }), CAM, 0, -.03, .18); lente.rotation.x = Math.PI / 2;
const flashM = E("#ffffff", 0); box(.1, .06, .02, flashM, CAM, .15, .1, .16);
const MX = -1.3, MZ = .4;
const parado = (lt, ry = .4) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .7, .03), ry, braco: [.3 + Math.sin(lt * 2) * .08, .55], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const foto = (lt, tk) => { const a = lin(lt, tk - .5, tk - .15), b = lin(lt, tk + .25, tk + .7); const up = eo(a) * (1 - eo(b));
  pose(MAS, { x: MX, z: MZ, y: lt > tk && lt < tk + .2 ? .06 : 0, ry: .55, braco: [.3, .55 + up * .6], sq: lt > tk && lt < tk + .15 ? .05 : 0, piscar: pisca(lt) }); MAS.g.rotation.z = 0;
  const f = Math.max(0, 1 - Math.abs(lt - tk) / .12); flash.intensity = f * 40; flashM.emissiveIntensity = f * 6; };
const feliz = lt => { pose(MAS, { x: MX + .2, z: MZ, y: hop(lt, .35, .26), ry: .35, braco: [2.0 + Math.sin(lt * 9) * .3, 1.6 + Math.sin(lt * 9 + 1) * .2], sq: Math.max(0, Math.cos(lt * Math.PI / .35)) * .06, piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
// foto sai da câmera e voa até a vaga (ou até a tela do celular)
const camPos = () => { const v = new THREE.Vector3(); CAM.getWorldPosition(v); return v; };
function voa(i, lt, tk, alvo, rotAlvo = 0) { const m = FOTOS[i]; const k = lin(lt, tk + .05, tk + .9); if (k <= 0) { m.visible = false; return; } m.visible = true;
  MAS.g.updateMatrixWorld(true); const a = camPos(); a.y += .25; const e = eio(k); m.position.lerpVectors(a, alvo, e); m.position.y += Math.sin(k * Math.PI) * .6; m.rotation.set(0, (1 - e) * 2.5, (1 - e) * .8 + rotAlvo * e); m.scale.setScalar(.6 + .4 * e); }
const fixa = (i, alvo, r = 0) => { const m = FOTOS[i]; m.visible = true; m.position.copy(alvo); m.rotation.set(0, 0, r); m.scale.setScalar(1); };
const pinos = n => PIN.forEach((p, i) => { p.visible = i < n; p.position.copy(VAGA(i)).add(V(0, .26, .04)); });

grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = () => { FOTOS.forEach(m => m.visible = false); pinos(0); flash.intensity = 0; flashM.emissiveIntensity = 0; };
let FOTOS_N = 0;
const NO_CEL = V(BX + .75, TOPO + .8, BZ + .12);

// ---------- câmera: plongée (alta olhando para baixo) e contra-plongée (baixa olhando para cima) ----------
const PL = [V(0, 3.7, 6.3), V(0, .95, -.5)], CP = [V(-.1, .75, 6.5), V(0, 1.6, -.5)];
const SHOTS = { gancho: [PL, CP], s1: [CP, PL], s2: [PL, PL], s3: [CP, CP], s4: [PL, CP], cta: [PL, PL] };
const ACT = {
  gancho(lt, d) { reset(); const tk = d * .66; FOTOS_N = lt > tk ? 1 : 0; telaD(lt < .9 || lt > tk + .9 ? "erro" : "texto", lin(lt, 1.0, tk - .3));
    if (lt < tk - .6) parado(lt); else foto(lt, tk); if (lt >= tk) voa(0, lt, tk, NO_CEL); },
  s1(lt, d) { reset(); telaD("erro"); const tks = [.35, .55, .7, .85].map(f => f * d); let n = 0;
    tks.forEach((tk, i) => { if (lt > tk + .9) { fixa(i, VAGA(i), (i % 2 ? .06 : -.05)); n = i + 1; } else voa(i, lt, tk, VAGA(i), (i % 2 ? .06 : -.05)); if (lt > tk) FOTOS_N = Math.max(FOTOS_N, i + 2); });
    FOTOS_N = 1 + tks.filter(tk => lt > tk).length; pinos(n); const prox = tks.find(tk => lt < tk + .7); if (prox !== undefined && lt > tks[0] - .6) foto(lt, prox); else parado(lt, .5); },
  s2(lt, d) { reset(); [0, 1, 2, 3].forEach(i => fixa(i, VAGA(i), (i % 2 ? .06 : -.05))); pinos(4); FOTOS_N = 5; telaD("scan", lt * .9); parado(lt, .6); },
  s3(lt, d) { reset(); [0, 1, 2, 3].forEach(i => fixa(i, VAGA(i), (i % 2 ? .06 : -.05))); pinos(4); FOTOS_N = 5; telaD("erro");
    // a lupa desce até o lado do olho (sem cobrir) e o mascote se inclina para o celular
    const k = Math.sin(lin(lt, .2, d - .2) * Math.PI); pose(MAS, { x: MX + k * .35, z: MZ, ry: .7, braco: [.4, .55], piscar: pisca(lt) }); MAS.g.rotation.z = -k * .12; LUPA.rotation.x = -.9 + k * .5; },
  s4(lt, d) { reset(); LUPA.rotation.x = -.9; [0, 1, 2, 3].forEach(i => fixa(i, VAGA(i), (i % 2 ? .06 : -.05))); pinos(4); FOTOS_N = 5; telaD("passos", lin(lt, .4, d - .6)); if (lt < d * .6) parado(lt, .6); else feliz(lt); },
  cta(lt, d) { reset(); LUPA.rotation.x = -.9; [0, 1, 2, 3].forEach(i => fixa(i, VAGA(i), (i % 2 ? .06 : -.05))); pinos(4); telaD("passos", 1); feliz(lt); },
};

// ---------- elementos de tela (2D): entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos, pil } = C; const GY3 = 600;
  const cabe = (f, txt, mx, fam = "SG") => { while (f > 22) { X.font = `700 ${f}px ${fam}`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(246,231,189,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome !== "cta") { // placar 8-bit HI-SCORE (fotos tiradas): enfeite em Press Start, número em Space Grotesk
        X.fillStyle = TINTA; X.beginPath(); X.roundRect(690, 600, 260, 120, 12); X.fill(); X.strokeStyle = MOS; X.lineWidth = 4; X.stroke();
        X.fillStyle = MOS; X.font = "400 20px PS"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("HI-SCORE", 820, 630); X.fillStyle = "#fff"; X.font = "700 60px SG"; X.fillText(String(FOTOS_N).padStart(3, "0"), 820, 682);
        X.fillStyle = "#9aa3b8"; X.font = "700 22px SG"; X.fillText("prints", 820, 740); }
      if (nome === "s1" || nome === "s2") { // nome escrito à mão
        const p = nome === "s2" ? 1 : lin(lt, .2, 1.4); X.save(); X.beginPath(); X.rect(60, 590, 40 + p * 580, 150); X.clip(); X.translate(80, 680); X.rotate(-.04);
        X.fillStyle = AZ2; X.font = "700 96px CV"; X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillText("ela lê imagem!", 0, 0); X.restore(); } },
    etiqueta(t, nome) { // tela de terminal
      const [l1, l2, l3] = SEGR[0].etiqueta; X.fillStyle = "#0e1322"; X.beginPath(); X.roundRect(60, 288, 890, 270, 18); X.fill(); X.fillStyle = "#1c2440"; X.beginPath(); X.roundRect(60, 288, 890, 46, [18, 18, 0, 0]); X.fill();
      [VERM, MOS, VERDE].forEach((c, i) => { X.fillStyle = c; X.beginPath(); X.arc(92 + i * 30, 311, 9, 0, 7); X.fill(); }); X.fillStyle = "#8a93ad"; X.font = "700 22px SG"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("ia@balcao:~", 190, 312);
      X.textBaseline = "alphabetic"; X.fillStyle = MOS; X.font = "700 46px SG"; X.fillText(">", 84, 402); X.fillStyle = "#ffffff"; cabe(52, l1, 800); X.fillText(l1, 118, 402);
      X.fillStyle = "#6ea2ff"; cabe(48, l2, 820); X.fillText(l2, 118, 466); X.fillStyle = MOS; cabe(44, l3, 820); X.fillText(l3, 118, 526);
      if ((t * 2) % 1 < .5) { const w = X.measureText(l3).width; X.fillRect(126 + w, 494, 22, 38); } },
    cabecalho() {},
    legenda(seg, t) { // balão de fala do mascote (bloco de 4 palavras, a atual em azul)
      const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 62; X.font = `700 ${fs}px SG`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 800 && fs > 36) { fs -= 2; X.font = `700 ${fs}px SG`; }
      const W = tot(), cx = 560, y = 1390, x0 = cx - W / 2 - 34, w = W + 56, h = fs * 1.8;
      X.fillStyle = "#fff"; X.strokeStyle = TINTA; X.lineWidth = 6; X.beginPath(); X.roundRect(x0, y - h / 2, w, h, 40); X.moveTo(240, y - h / 2 + 2); X.fill(); X.stroke();
      X.beginPath(); X.moveTo(Math.max(x0 + 40, 230), y - h / 2 + 3); X.lineTo(200, y - h / 2 - 60); X.lineTo(Math.max(x0 + 40, 230) + 60, y - h / 2 + 3); X.closePath(); X.fill(); X.stroke(); X.fillRect(Math.max(x0 + 40, 230) + 4, y - h / 2 + 2, 52, 8);
      let x = cx - W / 2 + 6; X.textAlign = "left"; X.textBaseline = "middle"; for (const wd of c) { const on = t >= wd.t0 - .02, at = on && t < wd.t1 + .2; X.fillStyle = at ? AZ : on ? TINTA : "rgba(20,26,42,.3)"; X.fillText(wd.w, x, y + 2); x += X.measureText(wd.w + " ").width; } },
    transicao(lt, s, nome) { // virada de página: uma folha mostarda varre da direita pra esquerda com sombra na dobra
      if (nome === "gancho" || lt > .42) return; const u = eio(lt / .42), x = 1080 - u * 1500;
      X.save(); X.fillStyle = MOS; X.beginPath(); X.moveTo(x, 0); X.quadraticCurveTo(x - 160, 960, x, 1920); X.lineTo(x + 420, 1920); X.lineTo(x + 420, 0); X.closePath(); X.fill();
      const g = X.createLinearGradient(x - 80, 0, x + 120, 0); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(.6, "rgba(0,0,0,.25)"); g.addColorStop(1, "rgba(0,0,0,0)"); X.fillStyle = g; X.fillRect(x - 80, 0, 200, 1920); X.restore(); },
    fechamento(lt) { // lista dos prints + pílulas COMENTA
      X.fillStyle = "rgba(255,248,230,.94)"; X.beginPath(); X.roundRect(60, 640, 890, 820, 30); X.fill();
      X.fillStyle = TINTA; X.font = "700 52px SG"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("Manda print de:", 110, 720);
      ["tela de erro", "gráfico", "conta de luz", "cardápio"].forEach((s, i) => { const a = eo(lin(lt, .15 + i * .12, .5 + i * .12)); X.globalAlpha = a; const y = 815 + i * 92 + Math.sin(lt * 4 - i * .9) * 5;
        X.fillStyle = i % 2 ? AZ : MOS; X.beginPath(); X.roundRect(110 + (1 - a) * 40, y - 34, 68, 68, 14); X.fill(); X.fillStyle = "#fff"; X.font = "700 40px SG"; X.textAlign = "center"; X.fillText(String(i + 1), 144 + (1 - a) * 40, y + 2);
        X.fillStyle = TINTA; X.font = "700 50px SG"; X.textAlign = "left"; X.fillText(s, 200 + (1 - a) * 40, y + 2); X.globalAlpha = 1; });
      const p = back(lin(lt, .6, 1.0)) * (1 + Math.sin(lt * 6) * .035); X.save(); X.translate(505, 1290); X.rotate(Math.sin(lt * 3) * .015); X.scale(p, p); X.font = "700 76px SG"; const w1 = X.measureText("COMENTA").width + 70, w2 = X.measureText(CHAVE).width + 70, x0 = -(w1 + w2 + 18) / 2;
      pil("COMENTA", x0, 0, 76, AZ, "#fff", "SG", "left", .46); pil(CHAVE, x0 + w1 + 18, 0, 76, MOS, TINTA, "SG", "left", .46); X.restore();
      if (lt > 1.1) { X.globalAlpha = eo(lin(lt, 1.1, 1.5)); X.fillStyle = TINTA; X.font = "700 42px SG"; X.textAlign = "center"; X.fillText("Qual print você vai mandar primeiro?", 505, 1405); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: AZ, VERDE: MOS, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui };
}

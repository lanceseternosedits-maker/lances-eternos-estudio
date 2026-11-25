// Reel 📜 história "2017: o artigo que criou o ChatGPT" ("Attention Is All You Need", Google, 8 autores; 14/11 17:00). Motor da cena_contagem.
// Identidade: sala de pesquisa de 2017 vista como redação de jornal: mesa comprida com 8 cadeiras de escritório com rodinhas (pesquisadores
// genéricos de blocos, sem rosto), quadro branco com setas, uma rotativa que imprime o artigo; a "atenção" é uma frase de blocos-palavra
// com feixes de luz ligando cada palavra às outras. No fim as cadeiras saem rolando pra fora (cada um foi abrir a própria empresa).
// Azul-quadro + branco + amarelo-marca-texto. Sem rosto de pessoa real nem logo. Elementos: página de caderno, nome decifrando,
// sem contador (história), bloco de 4 palavras com a atual colorida, chicote de câmera, órbita, pódio, Caveat.
// Mascote de viseira de jornalista; ação principal: girar na cadeira e sair rolando.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const AZ = "#2456b8", AZ2 = "#163a80", AMAR = "#ffe14a", TINTA = "#1a2030", FUNDO = "#f1f4fa", CREME = "#fffdf6", VERDE = "#2fb36b", VERM = "#e5484d", CINZA = "#9aa3b5";
rim.color.set(0xd8e4ff); rim.intensity = 1.4; key.color.set(0xffffff); key.intensity = 145; key.position.set(2, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xeef2ff, .6));
// ---------- sala ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#e6ebf5"; g.fillRect(0, 0, w, h); g.fillStyle = "#cfd8ea"; g.fillRect(0, 190, w, 66); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(22, 12), M("#8c93a3", { roughness: .7 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// quadro branco com setas (atenção)
const qT = ctex(512, 256, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 512, 256); g.strokeStyle = "#ccd"; g.lineWidth = 10; g.strokeRect(5, 5, 502, 246); const ws = ["o", "gato", "subiu", "no", "muro"]; g.font = "700 40px CV"; g.fillStyle = TINTA; ws.forEach((w, i) => g.fillText(w, 30 + i * 96, 200));
  g.strokeStyle = AZ; g.lineWidth = 3; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) if (i !== j && (i + j) % 2) { g.beginPath(); g.moveTo(50 + i * 96, 165); g.quadraticCurveTo((i + j) * 48 + 50, 60 - Math.abs(i - j) * 10, 50 + j * 96, 165); g.stroke(); } });
mesh(new THREE.PlaneGeometry(3.2, 1.6), new THREE.MeshBasicMaterial({ map: qT }), S, -.6, 2.9, -2.75).castShadow = false;
// mesa comprida + 8 pesquisadores genéricos em cadeiras com rodinhas
box(4.6, .08, 1.0, M("#d9d2c4", { roughness: .5 }), S, 0, .8, -1.7); for (const x of [-2.2, 2.2]) box(.08, .8, .9, M("#9b9282"), S, x, .4, -1.7);
const CAD = []; for (let i = 0; i < 8; i++) { const g = new THREE.Group(); const lado = i < 4 ? -1 : 1, x = -1.8 + (i % 4) * 1.2; g.userData.base = V(x, 0, -1.7 + lado * .85); g.userData.ry = lado > 0 ? Math.PI : 0; S.add(g);
  mesh(new THREE.CylinderGeometry(.04, .04, .4, 8), M("#333"), g, 0, .2, 0); box(.5, .08, .5, M("#2f3542"), g, 0, .42, 0); box(.5, .5, .08, M("#2f3542"), g, 0, .7, -.24);
  for (let r = 0; r < 5; r++) { const a = r / 5 * Math.PI * 2; mesh(new THREE.SphereGeometry(.04, 6, 4), M("#111"), g, Math.cos(a) * .22, .04, Math.sin(a) * .22); }
  box(.36, .44, .26, M(["#a7aec0", "#8d96a6", "#b9c0cf", "#98a2b6"][i % 4]), g, 0, .7, .02); box(.28, .28, .28, M(["#a7aec0", "#8d96a6", "#b9c0cf", "#98a2b6"][i % 4]), g, 0, 1.08, .02); CAD.push(g); }
const posCad = (k, t) => CAD.forEach((g, i) => { const b = g.userData.base, u = Math.max(0, Math.min(1, k * 1.6 - i * .08)), dir = i % 2 ? 1 : -1; g.position.set(b.x + dir * eio(u) * 5, 0, b.z + (b.z > -1.7 ? 1 : -1) * eio(u) * .6); g.rotation.y = g.userData.ry + u * 6 * dir; });
// "rotativa" que imprime o artigo
const ROT = new THREE.Group(); ROT.position.set(2.6, 0, -1.0); S.add(ROT); box(.9, 1.0, .8, M("#3a4256", { metalness: .4, roughness: .5 }), ROT, 0, .5, 0); const rolo = mesh(new THREE.CylinderGeometry(.18, .18, .7, 16), M("#999", { metalness: .7 }), ROT, 0, 1.05, 0); rolo.rotation.x = Math.PI / 2;
const artT = ctex(256, 340, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 256, 340); g.fillStyle = TINTA; g.font = "700 24px CV"; g.textAlign = "center"; g.fillText("Attention Is All", 128, 44); g.fillText("You Need", 128, 72); g.fillStyle = CINZA; g.font = "700 16px CV"; g.fillText("8 autores · 2017", 128, 100); for (let i = 0; i < 12; i++) g.fillRect(24, 130 + i * 16, 208 - (i % 3) * 30, 6); });
const FOLHAS = [0, 1, 2, 3].map(i => { const m = mesh(new THREE.PlaneGeometry(.5, .66), new THREE.MeshStandardMaterial({ map: artT, side: THREE.DoubleSide }), S); m.castShadow = false; return m; });
// frase de blocos-palavra com feixes (o Transformer)
const PAL = ["a", "IA", "lê", "a", "frase", "inteira"].map((w, i) => { const tt = ctex(160, 80, g => { g.fillStyle = i === 4 ? AMAR : "#fff"; g.beginPath(); g.roundRect(0, 0, 160, 80, 14); g.fill(); g.fillStyle = TINTA; g.font = "700 46px CV"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(w, 80, 44); });
  const m = mesh(new THREE.BoxGeometry(.56, .28, .06), new THREE.MeshStandardMaterial({ map: tt }), S); m.visible = false; return m; });
const FEIXES = []; for (let i = 0; i < 6; i++) { const f = mesh(new THREE.CylinderGeometry(.012, .012, 1, 6), new THREE.MeshBasicMaterial({ color: AZ, transparent: true, opacity: .7 }), S); f.visible = false; FEIXES.push(f); }
const liga = (a, b, f, op) => { const d = new THREE.Vector3().subVectors(b, a), L = d.length(); f.visible = true; f.position.copy(a).addScaledVector(d, .5).add(V(0, .25, 0)); f.scale.set(1, L, 1); f.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); f.material.opacity = op; };
// ---------- mascote: viseira verde de jornalista + cadeira própria ----------
const VIS = new THREE.Group(); VIS.position.set(0, 1.4, .3); MAS.corpo.add(VIS); box(1.3, .05, .5, new THREE.MeshStandardMaterial({ color: "#2fb36b", transparent: true, opacity: .8 }), VIS, 0, 0, .2).rotation.x = .25; box(1.5, .1, .06, M("#1d6e45"), VIS, 0, 0, -.05);
const MCAD = new THREE.Group(); S.add(MCAD); mesh(new THREE.CylinderGeometry(.05, .05, .4, 8), M("#333"), MCAD, 0, .2, 0); box(1.0, .1, .9, M(AZ2), MCAD, 0, .42, 0); for (let r = 0; r < 5; r++) { const a = r / 5 * Math.PI * 2; mesh(new THREE.SphereGeometry(.05, 6, 4), M("#111"), MCAD, Math.cos(a) * .35, .05, Math.sin(a) * .35); }
const MX = 1.3, MZ = .1;
const sentado = (lt, x, ry, spin = 0) => { MCAD.position.set(x, 0, MZ); MCAD.rotation.y = ry + spin; pose(MAS, { x, z: MZ, y: .3, ry: ry + spin, braco: [.4 + Math.sin(lt * 2) * .1, .5], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = (lt) => { FOLHAS.forEach(f => f.visible = false); PAL.forEach(p => p.visible = false); FEIXES.forEach(f => f.visible = false); rolo.rotation.y = 0; posCad(0, lt); };
const imprime = (lt, k) => { rolo.rotation.z = lt * 6; FOLHAS.forEach((f, i) => { const u = Math.max(0, Math.min(1, k * 1.5 - i * .2)); f.visible = u > 0; f.position.set(2.6 - u * 1.4 - i * .05, 1.15 + Math.sin(u * Math.PI) * .6, -.9 + u * .9); f.rotation.set(-Math.PI / 2 + u * 1.2, 0, i * .1); }); };
const frase = (lt, k) => { PAL.forEach((p, i) => { p.visible = k > i / 8; p.position.set(-2.0 + i * .62, 2.05 + Math.sin(lt * 2 + i) * .03, .2); }); const n = Math.floor(lt * 2) % 6; FEIXES.forEach((f, i) => { if (k < .8 || i === n) { f.visible = false; return; } liga(PAL[n].position, PAL[i].position, f, .35 + .5 * Math.max(0, Math.sin(lt * 4 + i))); }); };
// ---------- órbita (com chicote no início de cada cena) ----------
const ORB = { gancho: [-.3, .05, 7.6, 2.6, V(0, 1.4, -1.0)], s1: [.2, -.1, 7.2, 2.4, V(.6, 1.3, -.8)], s2: [-.15, .15, 7.0, 2.5, V(-.4, 1.7, -.4)], s3: [.1, -.15, 7.2, 2.4, V(0, 1.5, -.6)], s4: [-.25, .2, 7.6, 2.7, V(0, 1.2, -1.0)], cta: [.05, -.05, 7.8, 2.5, V(0, 1.3, -.6)] };
const SHOTS = {}; Object.keys(ORB).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a0, a1, r, y, l] = ORB[nome] || ORB.cta; let a = a0 + (a1 - a0) * eio(lt / d); if (nome !== "gancho" && lt < .3) a -= (1 - eio(lt / .3)) * .55; cam.position.set(l.x + Math.sin(a) * r, y, l.z + Math.cos(a) * r); cam.lookAt(l); };
const ACT = {
  gancho(lt, d) { reset(lt); imprime(lt, lin(lt, .3, d)); sentado(lt, MX, -.4); },
  s1(lt, d) { reset(lt); imprime(lt, 1); sentado(lt, MX, -.2, Math.sin(lt * 1.2) * .3); },
  s2(lt, d) { reset(lt); frase(lt, lin(lt, .1, 1.4)); sentado(lt, MX + .3, -.3); },
  s3(lt, d) { reset(lt); frase(lt, 1); sentado(lt, MX + .3, -.1, lt * 4 * (lt < 1.6 ? 1 : 0)); },
  s4(lt, d) { reset(lt); posCad(lin(lt, .3, d * .85), lt); const u = lin(lt, 1.2, d); sentado(lt, MX + u * 1.2, -.2, u * 8); },
  cta(lt, d) { reset(lt); posCad(1, lt); sentado(lt, 1.5, -.3); pose(MAS, { x: 1.5, z: MZ, y: .3 + hop(lt, .35, .15), ry: -.15, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos, decifra } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `700 ${f}px CV`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const decif = (txt, x, y, lt, t0, fs, cor) => { if (lt < t0) return; const p = Math.min(1, (lt - t0) / .9), k = Math.floor(lt * 20); const s = decifra ? decifra(txt, p, k) : txt; X.font = `700 ${fs}px CV`; const w = X.measureText(txt).width; X.fillStyle = "rgba(255,255,255,.94)"; X.beginPath(); X.roundRect(x - 26, y - fs * .72, w + 52, fs * 1.44, 18); X.fill(); X.fillStyle = cor; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText(s, x, y + 4); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(241,244,250,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") decif("Attention Is All You Need", 90, 700, lt, .5, 62, AZ2);
      if (nome === "s2") decif("TRANSFORMER", 90, 700, lt, .3, 80, VERDE);
      if (nome === "s3") decif("o T de GPT = Transformer", 90, 700, lt, .3, 62, AZ2);
      if (nome === "s4") decif("8 autores · 8 caminhos", 90, 700, lt, .3, 62, VERM); },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(-.012); X.shadowColor = "rgba(20,30,60,.22)"; X.shadowBlur = 18; X.shadowOffsetY = 6; X.fillStyle = CREME; X.fillRect(-445, -122, 890, 244); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(36,86,184,.3)"; X.lineWidth = 2; for (let y = -70; y < 122; y += 54) { X.beginPath(); X.moveTo(-445, y); X.lineTo(445, y); X.stroke(); } X.strokeStyle = "rgba(229,72,77,.45)"; X.beginPath(); X.moveTo(-375, -122); X.lineTo(-375, 122); X.stroke();
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(66, l1, 790); X.fillText(l1, -350, -30); X.fillStyle = AZ; cabe(60, l2, 790); X.fillText(l2, -350, 34); X.fillStyle = VERM; cabe(56, l3, 790); X.fillText(l3, -350, 94); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 84; X.font = `700 ${fs}px CV`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 860 && fs > 46) { fs -= 2; X.font = `700 ${fs}px CV`; }
      const y = 1400, x0 = 505 - tot() / 2; X.fillStyle = "rgba(22,58,128,.88)"; X.beginPath(); X.roundRect(x0 - 26, y - fs * .62, tot() + 36, fs * 1.2, 16); X.fill();
      let x = x0; X.textAlign = "left"; X.textBaseline = "middle"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2, ch_ = w.w.replace(/[.,!?:']/g, "").toUpperCase() === CHAVE; X.fillStyle = ch_ ? "#ff9aa0" : at ? AMAR : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .3) return; const k = 1 - lt / .3; X.save(); X.globalAlpha = .55 * k;
      for (let i = 0; i < 26; i++) { const y = 560 + ((i * 137) % 880), w = 300 + (i * 97) % 500, x = ((i * 211 + lt * 6000) % 1500) - 300; X.fillStyle = i % 3 ? "rgba(255,255,255,.6)" : "rgba(36,86,184,.8)"; X.fillRect(x, y, w, 6 + (i % 4) * 5); } X.restore(); X.globalAlpha = 1; },
    fechamento(lt) { // pódio da linha do tempo
      X.fillStyle = "rgba(241,244,250,.5)"; X.fillRect(0, 640, 1080, 860);
      const P = [["2017", "o artigo", 410, 220, AZ, "1º"], ["2018", "o 1º GPT", 190, 150, VERDE, "2º"], ["2022", "o ChatGPT", 630, 120, VERM, "3º"]];
      P.forEach(([a, b, x, h, c, n], i) => { const k = eo(lin(lt, .1 + i * .15, .5 + i * .15)), hh = h * k, base = 1330; X.fillStyle = c; X.fillRect(x - 100, base - hh, 200, hh); X.fillStyle = "rgba(0,0,0,.2)"; X.fillRect(x - 100, base - hh, 200, 12);
        if (k > .6) { X.fillStyle = "#fff"; X.font = "700 64px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(a, x, base - hh + 56); X.fillStyle = TINTA; X.font = "700 44px CV"; X.fillText(b, x, base - hh - 30); } });
      X.fillStyle = TINTA; X.fillRect(70, 1330, 690, 12);
      const p = back(lin(lt, .7, 1.1)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 760); X.scale(p, p); X.fillStyle = AZ; X.beginPath(); X.roundRect(-300, -62, 600, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = `700 ${cabe(80, "Comenta " + CHAVE, 560)}px CV`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 4); X.restore();
      if (lt > 1.1) { X.globalAlpha = eo(lin(lt, 1.1, 1.5)); X.fillStyle = TINTA; X.font = "700 44px CV"; X.textAlign = "center"; X.fillText("Salva pra contar pra alguém", 505, 1410); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: AZ, VERDE: AMAR, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

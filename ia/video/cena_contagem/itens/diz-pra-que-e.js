// Reel ⚙️ como funciona "A IA é um estagiário gênio" (contexto no pedido; guia oficial de prompts do Claude; 12/11 12:00). Motor da cena_contagem.
// Identidade: primeiro dia de estágio num escritório: mesa vazia com plantinha, mural de avisos, manual gigante de boas-vindas que cai
// no colo do mascote; 3 balões de dúvida (pra quem? pra quê? que tom?) e uma ficha que se preenche. Coral + cinza-escritório.
// Elementos: papel rasgado com fita, nome em máquina de escrever, velocímetro de qualidade (ilustrativo), karaokê com marca-texto,
// chicote de câmera, órbita, CONTINUE?, Caveat. Mascote com crachá "NOVO" pendurado no braço e mochila (atrás); ação: ler o manual.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const CORAL = "#ff6f61", CORAL2 = "#d94b3f", CINZA = "#8d96a0", CINZA2 = "#5d6670", CR = "#fff8f0", TINTA = "#1f2329", FUNDO = "#eef0f2", AMAR = "#ffd23f", VERDE = "#2fb36b";
rim.color.set(0xffd6cc); rim.intensity = 1.2; key.color.set(0xffffff); key.intensity = 145; key.position.set(1, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xf4f6f8, .6));
// ---------- escritório ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#e3e6ea"; g.fillRect(0, 0, w, h); g.fillStyle = "#cfd4da"; g.fillRect(0, 180, w, h); g.fillStyle = "#9fd0ff"; g.fillRect(330, 30, 150, 110); g.fillStyle = "#fff"; g.fillRect(400, 30, 6, 110); g.fillRect(330, 82, 150, 6); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.6).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(22, 12), M("#b9bec5", { roughness: .9 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// mural de avisos
const muT = ctex(320, 200, g => { g.fillStyle = "#c99a62"; g.fillRect(0, 0, 320, 200); [["BEM-VINDO!", CORAL, 20, 20], ["café 15h", AMAR, 180, 30], ["ramal 204", "#9fe3d0", 30, 110], ["reunião 10h", "#ffd0e0", 170, 110]].forEach(([t, c, x, y]) => { g.fillStyle = c; g.fillRect(x, y, 130, 70); g.fillStyle = TINTA; g.font = "700 26px CV"; g.fillText(t, x + 10, y + 42); }); });
mesh(new THREE.PlaneGeometry(2.0, 1.25), new THREE.MeshStandardMaterial({ map: muT }), S, -1.6, 2.5, -2.5);
// mesa + plantinha + papel genérico
box(2.2, .08, .9, M("#e8e2d8"), S, .7, .82, -.7); for (const [x, z] of [[-.3, -1.05], [1.7, -1.05], [-.3, -.35], [1.7, -.35]]) box(.06, .82, .06, M("#777"), S, x, .41, z);
const vaso = mesh(new THREE.CylinderGeometry(.12, .09, .2, 14), M(CORAL), S, 1.55, .96, -.9); for (let i = 0; i < 5; i++) { const f = mesh(new THREE.SphereGeometry(.09, 8, 6), M("#4caf6a"), S, 1.55 + Math.cos(i * 1.3) * .08, 1.14 + (i % 2) * .06, -.9 + Math.sin(i * 1.3) * .08); f.scale.y = 1.4; }
const papT = ctex(200, 260, (g, w, h, modo = "generico", k = 0) => { g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); if (modo === "generico") { g.fillStyle = "#c8ccd2"; for (let i = 0; i < 8; i++) g.fillRect(16, 26 + i * 26, 168 - (i % 3) * 20, 10); g.fillStyle = CINZA2; g.font = "700 26px CV"; g.fillText("texto genérico", 26, 244); return; }
  g.fillStyle = TINTA; g.font = "700 28px CV"; const L = [["pra quem:", "minha chefe"], ["pra quê:", "pedir folga"], ["tom:", "educado e curto"]]; L.forEach(([a, b], i) => { g.fillStyle = CORAL2; g.fillText(a, 14, 50 + i * 74); g.fillStyle = TINTA; const n = Math.floor(Math.min(1, Math.max(0, k * 3 - i)) * b.length); g.fillText(b.slice(0, n), 20, 84 + i * 74); }); });
const PAP = mesh(new THREE.PlaneGeometry(.75, .98), new THREE.MeshStandardMaterial({ map: papT, side: THREE.DoubleSide }), S, .6, 1.55, -.4); PAP.rotation.x = -.15;
let papU = ""; const papel = (m, k) => { const u = m + Math.round(k * 30); if (u !== papU) { papU = u; papT.draw(m, k); } };
// manual gigante
const manT = ctex(256, 320, g => { g.fillStyle = CORAL; g.fillRect(0, 0, 256, 320); g.fillStyle = "#fff"; g.font = "700 52px CV"; g.textAlign = "center"; g.fillText("Manual", 128, 90); g.fillText("do novato", 128, 150); g.font = "700 30px CV"; g.fillText("“funcionário brilhante,", 128, 230); g.fillText("mas novo”", 128, 266); });
const MAN = mesh(new THREE.BoxGeometry(1.0, 1.25, .18), [M(CR), M(CR), M(CR), M(CR), new THREE.MeshStandardMaterial({ map: manT }), M(CORAL2)], S); MAN.visible = false;
// balões de dúvida
const duvT = txt => ctex(256, 128, g => { g.fillStyle = "#fff"; g.beginPath(); g.roundRect(4, 4, 248, 96, 26); g.fill(); g.beginPath(); g.moveTo(50, 98); g.lineTo(36, 126); g.lineTo(86, 98); g.fill(); g.fillStyle = CORAL2; g.font = "700 50px CV"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 128, 54); });
const DUV = ["pra quem?", "pra quê?", "que tom?"].map(t => { const m = mesh(new THREE.PlaneGeometry(1.1, .55), new THREE.MeshBasicMaterial({ map: duvT(t), transparent: true }), S); m.castShadow = false; m.visible = false; return m; });
// ---------- mascote: crachá NOVO pendurado no braço + mochila nas costas ----------
const crT = ctex(128, 80, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 128, 80); g.fillStyle = CORAL; g.fillRect(0, 0, 128, 24); g.fillStyle = TINTA; g.font = "700 40px CV"; g.textAlign = "center"; g.fillText("NOVO", 64, 64); });
const cr = mesh(new THREE.PlaneGeometry(.28, .18), new THREE.MeshStandardMaterial({ map: crT, side: THREE.DoubleSide }), MAS.bracos[0], -.3, -.16, .17); cr.castShadow = false;
box(1.0, .8, .3, M("#4a7bd1", { roughness: .8 }), MAS.corpo, 0, .95, -.62);
const MX = -.9, MZ = .45;
const le = (lt, ry = .3) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .9, .02), ry, braco: [1.1 + Math.sin(lt * 1.5) * .06, 1.1 - Math.sin(lt * 1.5) * .06], piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(lt * 1.2) * .03; };
const duvida = lt => { pose(MAS, { x: MX, z: MZ, y: 0, ry: .2, braco: [.9 + Math.sin(lt * 4) * .2, .9 + Math.sin(lt * 4 + 2) * .2], piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(lt * 2.4) * .1; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .24), ry: .2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let QUAL = .25;
const reset = () => { MAN.visible = false; DUV.forEach(d => d.visible = false); };
const manualNoColo = (k) => { MAN.visible = true; const e = eo(k); MAN.position.set(MX + 1.15, 3.6 - e * 2.3, MZ + .3); MAN.rotation.set(-.3 - (1 - e) * 1.5, .3, (1 - e) * .8); };
// ---------- órbita ----------
const ORB = { gancho: [-.3, .1, 6.6, 2.1, V(0, 1.4, -.5)], s1: [.3, -.05, 6.2, 2.0, V(-.6, 1.5, 0)], s2: [-.2, .2, 6.4, 2.1, V(-.4, 1.7, 0)], s3: [.25, -.15, 6.6, 2.1, V(0, 1.4, -.4)], s4: [-.25, .1, 6.0, 2.0, V(.5, 1.5, -.4)], cta: [.1, -.1, 7.0, 2.1, V(0, 1.4, -.4)] };
const SHOTS = {}; Object.keys(ORB).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a0, a1, r, y, l] = ORB[nome] || ORB.cta, a = a0 + (a1 - a0) * eio(lt / d); cam.position.set(l.x + Math.sin(a) * r, y, l.z + Math.cos(a) * r); cam.lookAt(l); };
const ACT = {
  gancho(lt) { reset(); papel("generico"); QUAL = .22; duvida(lt); },
  s1(lt) { reset(); papel("generico"); manualNoColo(lin(lt, .2, .9)); QUAL = .22; le(lt); },
  s2(lt, d) { reset(); papel("generico"); DUV.forEach((m, i) => { const k = lin(lt, .4 + i * .9, .8 + i * .9); m.visible = k > 0; m.scale.setScalar(Math.max(.01, back(k))); m.position.set(MX - .6 + i * .8, 2.6 + (i % 2) * .3 + Math.sin(lt * 2 + i) * .05, MZ); m.lookAt(cam.position); }); QUAL = .22; duvida(lt); },
  s3(lt, d) { reset(); papel("ficha", lin(lt, .3, d)); QUAL = .22 + eio(lin(lt, .3, d - .3)) * .55; le(lt, .5); },
  s4(lt, d) { reset(); papel("ficha", lin(lt, .2, d - .5)); QUAL = .77 + eio(lin(lt, 0, d)) * .18; if (lt < d * .6) le(lt, .5); else feliz(lt); },
  cta(lt) { reset(); papel("ficha", 1); QUAL = .95; pose(MAS, { x: MX, z: MZ + 1.7, y: hop(lt, .35, .24), ry: .2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `700 ${f}px CV`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const rasgado = (x, y, w, h, s) => { X.beginPath(); X.moveTo(x, y); for (let i = 0; i <= 40; i++) X.lineTo(x + w * i / 40, y + ((i * 7 + s) % 5) * 2.4 - 4); for (let i = 0; i <= 40; i++) X.lineTo(x + w - w * i / 40, y + h + ((i * 11 + s) % 6) * 2.6 - 6); X.closePath(); };
  const velo = (k, x, y) => { const r = 86; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,255,255,.94)"; X.beginPath(); X.roundRect(-r - 24, -r - 18, 2 * r + 48, r + 130, 18); X.fill();
    X.lineWidth = 18; [[0, .33, CORAL], [.33, .66, AMAR], [.66, 1, VERDE]].forEach(([a, b, c]) => { X.strokeStyle = c; X.beginPath(); X.arc(0, 0, r, Math.PI + a * Math.PI, Math.PI + b * Math.PI); X.stroke(); });
    const a = Math.PI + Math.PI * k; X.strokeStyle = TINTA; X.lineWidth = 6; X.lineCap = "round"; X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(a) * (r - 18), Math.sin(a) * (r - 18)); X.stroke();
    X.fillStyle = TINTA; X.font = "700 40px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("qualidade", 0, 34); X.fillStyle = "#eef0f2"; X.beginPath(); X.roundRect(-70, 62, 140, 30, 15); X.fill(); X.fillStyle = CINZA2; X.font = "700 20px SG"; X.fillText("ILUSTRATIVO", 0, 78); X.restore(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(238,240,242,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") { const alvo = "estagiário gênio", k = Math.floor(lin(lt, .5, 1.8) * alvo.length), txt = alvo.slice(0, k); X.fillStyle = "#fff"; X.beginPath(); X.roundRect(60, 610, 560, 96, 10); X.fill(); X.strokeStyle = TINTA; X.lineWidth = 3; X.stroke();
        X.fillStyle = TINTA; X.font = "700 62px CV"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText(txt, 86, 660); if (k < alvo.length || (t * 2 % 1) < .5) { X.fillStyle = CORAL; X.fillRect(90 + X.measureText(txt).width, 632, 5, 52); } }
      if (nome !== "cta" && nome !== "s1") velo(QUAL, 830, 760); },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(.012); X.shadowColor = "rgba(30,30,40,.22)"; X.shadowBlur = 16; X.shadowOffsetY = 6; X.fillStyle = "#fffdf8"; rasgado(-450, -122, 900, 244, 6); X.fill(); X.shadowColor = "transparent";
      X.fillStyle = "rgba(255,111,97,.6)"; for (const [x, r] of [[-405, -.5], [405, .5]]) { X.save(); X.translate(x, -114); X.rotate(r); X.fillRect(-70, -18, 140, 36); X.restore(); }
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(80, l1, 840); X.fillText(l1, 0, -26); X.fillStyle = CORAL2; cabe(60, l2, 840); X.fillText(l2, 0, 36); X.fillStyle = CINZA2; cabe(54, l3, 840); X.fillText(l3, 0, 92); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 84; X.font = `700 ${fs}px CV`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 860 && fs > 46) { fs -= 2; X.font = `700 ${fs}px CV`; }
      const W = tot(), y = 1400; let x = 505 - W / 2; const xs = c.map(w => { const r = [x, X.measureText(w.w).width]; x += X.measureText(w.w + " ").width; return r; });
      let fim = xs[0][0] - 10; c.forEach((w, i) => { const k = lin(t, w.t0, w.t1); if (k > 0) fim = xs[i][0] + xs[i][1] * k + 10; });
      X.fillStyle = "rgba(255,255,255,.9)"; X.beginPath(); X.roundRect(xs[0][0] - 24, y - fs * .6, W + 30, fs * 1.16, 14); X.fill();
      X.fillStyle = "rgba(255,111,97,.55)"; X.beginPath(); X.roundRect(xs[0][0] - 14, y - fs * .32, Math.max(0, fim - xs[0][0] + 14), fs * .62, 8); X.fill();
      X.textAlign = "left"; X.textBaseline = "middle"; c.forEach((w, i) => { X.fillStyle = TINTA; X.fillText(w.w, xs[i][0], y + 2); }); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .3) return; const k = 1 - lt / .3, cv = X.canvas; X.save(); for (let i = 1; i <= 6; i++) { X.globalAlpha = .22 * k; X.drawImage(cv, i * 70 * k, 0); X.drawImage(cv, -i * 50 * k, 0); } X.globalAlpha = .5 * k; X.fillStyle = "#fff"; for (let i = 0; i < 14; i++) X.fillRect(0, 300 + (i * 97) % 1200, 1080, 4 + (i % 3) * 3); X.restore(); },
    fechamento(lt) { X.fillStyle = "rgba(31,35,41,.9)"; X.fillRect(60, 620, 890, 500); X.strokeStyle = CORAL; X.lineWidth = 6; X.strokeRect(70, 630, 870, 480);
      const p = back(lin(lt, 0, .4)); X.save(); X.translate(505, 700); X.scale(p, p); X.fillStyle = AMAR; X.font = "700 92px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Continue?", 0, 0); X.restore();
      const n = Math.max(0, 9 - Math.floor(lt * 2)); X.fillStyle = CORAL; X.font = "700 110px CV"; X.textAlign = "center"; X.fillText(String(n), 505, 835);
      if (lt > .8) { X.globalAlpha = eo(lin(lt, .8, 1.2)); X.fillStyle = CR; X.font = "700 52px CV"; X.fillText("Qual pedido você vai refazer?", 505, 930); X.globalAlpha = 1; }
      const pul = 1 + Math.sin(lt * 7) * .03; X.save(); X.translate(505, 1030); X.scale(pul, pul); X.fillStyle = CORAL; X.beginPath(); X.roundRect(-340, -64, 680, 128, 64); X.fill(); X.fillStyle = "#fff"; X.font = "700 76px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 4); X.restore(); },
  }; };
const cores = { LAR: CORAL, VERDE, FUNDO, CREME: CR, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

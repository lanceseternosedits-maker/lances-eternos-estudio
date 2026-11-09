// Reel 🆕 contagem "3 skills que animam sem você saber animar" (claude-animation-skills, cinecode, motionmaxxing; 13/11 10:00).
// Identidade: picadeiro de circo à noite sob lona listrada azul-marinho e amarelo, serragem no chão, holofotes, bandeirinhas.
// Nº 3: seis celulares com Reels que o mascote faz malabarismo; nº 2: claquete que solta uma fita de filme e vira uma caixinha "MP4";
// nº 1: um cartaz com "cara de IA" (plástico brilhante, borrado) que gira e vira um cartaz limpo de designer. Azul + amarelo + magenta.
// Elementos: letreiro neon, nome em split-flap, velocímetro, tarja de TV, zoom atravessando uma tela, plongée/contra-plongée,
// post-its na parede, Fraunces. Mascote de cartola; ação principal: malabarismo.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const AZ = "#1c2c6b", AZ2 = "#101a45", AMAR = "#ffcc33", MAG = "#ff3fa4", CREME = "#fff7e6", TINTA = "#141a33", FUNDO = "#eef1fb", CIANO = "#4fd8ff";
rim.color.set(0xffe0a0); rim.intensity = 1.6; key.color.set(0xfff4dd); key.intensity = 150; key.position.set(0, 9, 6); key.target.position.set(0, .8, -.3);
S.add(new THREE.AmbientLight(0xdfe6ff, .55));
// ---------- picadeiro ----------
const lT = ctex(512, 256, (g, w, h) => { for (let x = 0; x < w; x += 64) { g.fillStyle = (x / 64) % 2 ? AZ : AMAR; g.beginPath(); g.moveTo(w / 2, -60); g.lineTo(x, h); g.lineTo(x + 64, h); g.closePath(); g.fill(); } g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(0, 0, w, h); });
mesh(new THREE.PlaneGeometry(24, 11), new THREE.MeshBasicMaterial({ map: lT }), S, 0, 4.5, -3.2).castShadow = false;
const sT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#c99a5b"; g.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { g.fillStyle = i % 2 ? "#d8ab6c" : "#b8894c"; g.fillRect((i * 37) % w, (i * 71) % h, 3, 2); } }); sT.wrapS = sT.wrapT = THREE.RepeatWrapping; sT.repeat.set(5, 4);
const chao = mesh(new THREE.PlaneGeometry(24, 14), new THREE.MeshStandardMaterial({ map: sT, roughness: 1 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
const borda = mesh(new THREE.TorusGeometry(3.1, .14, 10, 64), M(MAG, { roughness: .4 }), S, 0, .1, -.3); borda.rotation.x = Math.PI / 2;
for (let i = 0; i < 16; i++) { const b = mesh(new THREE.ConeGeometry(.12, .26, 3), M([MAG, AMAR, CIANO][i % 3]), S, -3.4 + i * .45, 3.4 - Math.sin(i / 15 * Math.PI) * .35, -2.0); b.rotation.z = Math.PI; b.castShadow = false; }
const HOL = [-2.6, 2.6].map(x => { const c = mesh(new THREE.ConeGeometry(1.3, 5, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff1c0, transparent: true, opacity: .06, side: THREE.DoubleSide, depthWrite: false }), S, x * .6, 2.5, -.3); c.rotation.z = x > 0 ? -.35 : .35; c.castShadow = false; return c; });
// ---------- itens ----------
const G3 = new THREE.Group(), G2 = new THREE.Group(), G1 = new THREE.Group(); [G3, G2, G1].forEach(g => S.add(g));
// nº 3: seis celulares com Reels (malabares)
const celT = i => ctex(96, 170, g => { g.fillStyle = "#111"; g.fillRect(0, 0, 96, 170); const gr = g.createLinearGradient(0, 0, 0, 170); gr.addColorStop(0, [MAG, CIANO, AMAR][i % 3]); gr.addColorStop(1, AZ); g.fillStyle = gr; g.fillRect(6, 8, 84, 154); g.fillStyle = "#fff"; g.beginPath(); g.moveTo(38, 70); g.lineTo(62, 85); g.lineTo(38, 100); g.closePath(); g.fill(); g.fillRect(14, 140, 50, 6); });
const CELS = [0, 1, 2, 3, 4, 5].map(i => { const m = mesh(new THREE.PlaneGeometry(.34, .6), new THREE.MeshBasicMaterial({ map: celT(i), side: THREE.DoubleSide }), G3); m.castShadow = false; return m; });
// nº 2: claquete + fita + caixa MP4
const CLA = new THREE.Group(); G2.add(CLA); CLA.position.set(-1.0, 1.0, -.4); box(.9, .6, .06, M("#1b1b1b"), CLA, 0, 0, 0); const haste = new THREE.Group(); haste.position.set(-.45, .32, 0); CLA.add(haste); box(.9, .14, .07, M("#fff"), haste, .45, .07, 0);
const FITA = []; for (let i = 0; i < 8; i++) FITA.push(box(.26, .2, .02, M(i % 2 ? "#2a2a2a" : "#3a3a3a"), G2, 0, 0, 0));
const mp4T = ctex(256, 256, g => { g.fillStyle = MAG; g.fillRect(0, 0, 256, 256); g.fillStyle = "#fff"; g.font = "900 80px FR"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("MP4", 128, 140); });
const MP4 = mesh(new THREE.BoxGeometry(.6, .6, .6), new THREE.MeshStandardMaterial({ map: mp4T }), G2, .9, .3, -.2);
// nº 1: cartaz "cara de IA" → cartaz de designer (dois lados)
const iaT = ctex(256, 340, g => { const gr = g.createRadialGradient(128, 150, 10, 128, 170, 220); gr.addColorStop(0, "#ffd6ff"); gr.addColorStop(.5, "#9b7bff"); gr.addColorStop(1, "#3a2a7a"); g.fillStyle = gr; g.fillRect(0, 0, 256, 340); g.filter = "blur(3px)"; g.fillStyle = "rgba(255,255,255,.7)"; for (let i = 0; i < 8; i++) { g.beginPath(); g.arc(40 + i * 25, 120 + Math.sin(i) * 40, 18, 0, 7); g.fill(); } g.filter = "none"; g.fillStyle = "#fff"; g.font = "700 30px FR"; g.textAlign = "center"; g.fillText("✨ AI ✨", 128, 300); });
const dsT = ctex(256, 340, g => { g.fillStyle = CREME; g.fillRect(0, 0, 256, 340); g.fillStyle = AZ; g.fillRect(24, 24, 208, 150); g.fillStyle = AMAR; g.beginPath(); g.arc(180, 100, 46, 0, 7); g.fill(); g.fillStyle = MAG; g.fillRect(24, 190, 120, 16); g.fillStyle = TINTA; g.font = "900 44px FR"; g.textAlign = "left"; g.fillText("Lançamento", 24, 260); g.font = "700 20px FR"; g.fillText("sexta · 19h", 24, 300); });
const CART = new THREE.Group(); G1.add(CART); CART.position.set(-.85, 1.45, -.2); CART.scale.setScalar(1.25); const fr = mesh(new THREE.PlaneGeometry(1.1, 1.46), new THREE.MeshStandardMaterial({ map: iaT, roughness: .15, metalness: .3 }), CART, 0, 0, .02); const tr = mesh(new THREE.PlaneGeometry(1.1, 1.46), new THREE.MeshStandardMaterial({ map: dsT, roughness: .8 }), CART, 0, 0, -.02); tr.rotation.y = Math.PI; box(.06, 1.0, .06, M("#666"), G1, -.85, .5, -.25);
// ---------- mascote: cartola; malabarismo ----------
const CAR = new THREE.Group(); CAR.position.set(.15, 1.52, 0); CAR.rotation.z = -.1; MAS.corpo.add(CAR); mesh(new THREE.CylinderGeometry(.62, .62, .04, 28), M(TINTA), CAR, 0, 0, 0); mesh(new THREE.CylinderGeometry(.34, .36, .5, 24), M(TINTA), CAR, 0, .26, 0); mesh(new THREE.CylinderGeometry(.365, .365, .1, 24), M(MAG), CAR, 0, .08, 0);
const MX = .9, MZ = .6;
const malabar = (lt, objs, n = objs.length) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .5, .03), ry: -.25, braco: [1.2 + Math.sin(lt * 8) * .5, 1.2 - Math.sin(lt * 8) * .5], piscar: pisca(lt) }); MAS.g.rotation.z = 0;
  objs.forEach((o, i) => { if (i >= n) { o.visible = false; return; } o.visible = true; const ph = lt * 3.2 + i * (Math.PI * 2 / n); o.position.set(MX + Math.cos(ph) * .8 - .1, 2.05 + Math.abs(Math.sin(ph)) * .7, MZ + .3); o.rotation.z = ph; }); };
const olha = (lt, ry = -.4) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .7], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .22), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const NS = ["gancho", "n3", "n2", "n1", "cta"]; NS.forEach(n => grupo(n));
const reset = (lt) => { [G3, G2, G1].forEach(g => g.visible = false); HOL.forEach((h, i) => h.rotation.z = (i ? -.35 : .35) + Math.sin(lt * .8 + i) * .12); };
// ---------- plongée / contra-plongée ----------
const BS = { gancho: [V(0, 4.3, 7.4), V(0, 1.2, -.6)], n3: [V(.3, 1.1, 7.0), V(.5, 1.9, -.6)], n2: [V(-.2, 4.2, 7.2), V(-.2, .9, -.4)], n1: [V(.2, 1.1, 6.8), V(-.1, 1.7, -.8)], cta: [V(0, 3.0, 7.8), V(0, 1.5, -.8)] };
const SHOTS = {}; Object.keys(BS).forEach(n => { const s = [BS[n][0], BS[n][1]]; SHOTS[n] = [s, s]; });
const camera = (cam, nome, lt, d) => { const [p, l] = BS[nome] || BS.cta, u = eio(Math.min(1, lt / d)); cam.position.set(p.x, p.y + (p.y > 2 ? -.4 : .25) * u, p.z - u * .5); cam.lookAt(l.x, l.y, l.z); };
const ACT = {
  gancho(lt) { reset(lt); G1.visible = true; CART.rotation.y = 0;  olha(lt); },
  n3(lt, d) { reset(lt); G3.visible = true; malabar(lt, CELS, Math.min(6, 1 + Math.floor(lt * 2.5))); },
  n2(lt, d) { reset(lt); G2.visible = true; haste.rotation.z = -.5 * Math.abs(Math.sin(Math.min(lt, .9) * 7)) * (lt < .9 ? 1 : 0); const k = lin(lt, .8, 2.4);
    FITA.forEach((f, i) => { const u = Math.max(0, Math.min(1, k * 1.3 - i * .06)); f.visible = u > 0 && u < 1; f.position.set(-.6 + u * 1.5, 1.0 + Math.sin(u * Math.PI) * .5, -.3); f.rotation.z = u * 3; });
    MP4.visible = true; MP4.scale.setScalar(Math.max(.01, back(lin(lt, 2.0, 2.5)))); MP4.rotation.y = lt * .8; olha(lt, -.5); },
  n1(lt, d) { reset(lt); G1.visible = true; CART.rotation.y = eio(lin(lt, 1.0, 1.8)) * Math.PI; fr.material.emissive = new THREE.Color(lt < 1.0 ? "#3a1a6a" : "#000"); lt > 1.8 ? feliz(lt) : olha(lt, -.6); },
  cta(lt) { reset(lt); G1.visible = true; CART.rotation.y = Math.PI; feliz(lt); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, ITENS, MAXE } = C; const GY3 = 620; let CAB = null;
  const cabe = (f, txt, mx, peso = 900) => { while (f > 20) { X.font = `${peso} ${f}px FR`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const fmtP = n => Math.round(n).toLocaleString("pt-BR");
  const CHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const flap = (alvo, x, y, tw, lt, t0) => { for (let i = 0; i < alvo.length; i++) { const c = alvo[i], k = lin(lt, t0 + i * .04, t0 + i * .04 + .45), xx = x + i * (tw + 4); X.fillStyle = "#14141c"; X.beginPath(); X.roundRect(xx, y - tw * .72, tw, tw * 1.44, 5); X.fill(); if (c === " " || c === "-") { if (c === "-") { X.fillStyle = AMAR; X.fillRect(xx + tw * .2, y - 3, tw * .6, 6); } continue; }
    X.fillStyle = k >= 1 ? AMAR : "#aaa"; X.font = `900 ${Math.round(tw * 1.05)}px FR`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(k >= 1 ? c : CHS[(Math.floor(lt * 30) + i * 7) % CHS.length], xx + tw / 2, y + 3); X.fillStyle = "rgba(0,0,0,.5)"; X.fillRect(xx, y - 1, tw, 3); } };
  const velocimetro = (v, x, y) => { const r = 110; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,247,230,.95)"; X.beginPath(); X.roundRect(-r - 30, -r - 30, 2 * r + 60, r + 130, 22); X.fill();
    const a0 = Math.PI; X.lineWidth = 24; [[0, .33, CIANO], [.33, .66, AMAR], [.66, 1, MAG]].forEach(([a, b, c]) => { X.strokeStyle = c; X.beginPath(); X.arc(0, 0, r, a0 + a * Math.PI, a0 + b * Math.PI); X.stroke(); });
    const ang = a0 + Math.min(1, v / MAXE) * Math.PI; X.strokeStyle = TINTA; X.lineWidth = 8; X.lineCap = "round"; X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(ang) * (r - 18), Math.sin(ang) * (r - 18)); X.stroke(); X.lineCap = "butt"; X.fillStyle = TINTA; X.beginPath(); X.arc(0, 0, 13, 0, 7); X.fill();
    X.font = "900 54px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(fmtP(v), 0, 50); X.font = "700 22px FR"; X.fillStyle = AZ; X.fillText("★ ESTRELAS NO GITHUB", 0, 86); X.restore(); };
  const U = {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 60], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(238,241,251,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (CAB && nome !== "gancho" && nome !== "cta") U.cab2(...CAB); CAB = null; },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.fillStyle = "#120a26"; X.beginPath(); X.roundRect(-465, -135, 930, 270, 26); X.fill(); X.strokeStyle = MAG; X.lineWidth = 5; X.shadowColor = MAG; X.shadowBlur = 20; X.stroke();
      const fl = Math.floor(t * 7) % 23 === 0 ? .55 : 1; X.textAlign = "center"; X.textBaseline = "middle"; X.globalAlpha = fl; X.shadowColor = MAG; X.shadowBlur = 22; X.fillStyle = "#ffe3f3"; cabe(58, l1, 860); X.fillText(l1, 0, -52); X.globalAlpha = 1;
      X.shadowColor = AMAR; X.fillStyle = "#fff4c2"; cabe(64, l2, 860); X.fillText(l2, 0, 14); X.shadowColor = CIANO; X.fillStyle = "#d8f7ff"; cabe(50, l3, 860); X.fillText(l3, 0, 76); X.shadowBlur = 0; X.restore(); },
    cabecalho(s, lt, t) { CAB = [s, lt, t]; },
    cab2(s, lt, t) { const y = 680; X.fillStyle = MAG; X.beginPath(); X.arc(100, y, 44, 0, 7); X.fill(); X.fillStyle = "#fff"; X.font = "900 56px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag.replace(/\D/g, ""), 100, y + 3);
      const nm = s.item.toUpperCase(), tw = Math.min(46, Math.floor(760 / nm.length) - 4); X.fillStyle = "rgba(10,10,20,.85)"; X.beginPath(); X.roundRect(150, y - 50, nm.length * (tw + 4) + 30, 100, 12); X.fill(); flap(nm, 165, y, tw, lt, .1);
      velocimetro(s.estrelas * eio(lin(lt, .4, 1.9)), 790, 900); },
    legenda(seg, t) { const ch = C.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 68; X.font = `900 ${fs}px FR`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 780 && fs > 38) { fs -= 2; X.font = `900 ${fs}px FR`; }
      const y = 1405, x0 = 505 - tot() / 2; X.fillStyle = AZ2; X.fillRect(40, y - 56, 910, 112); X.fillStyle = AMAR; X.fillRect(40, y + 48, 910, 8); X.fillStyle = MAG; X.fillRect(60, y - 90, 330, 40); X.fillStyle = "#fff"; X.font = "700 24px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("AO VIVO DO PICADEIRO", 225, y - 70);
      let x = x0; X.font = `900 ${fs}px FR`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? AMAR : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 160 + u * 2300, h = w * 1.75;
      X.save(); X.fillStyle = "#0c0c14"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 30 * (1 - u) + 4); X.fill("evenodd"); X.restore(); },
    fechamento(lt) { // post-its na parede com as 3 skills
      X.fillStyle = "rgba(238,241,251,.82)"; X.fillRect(0, 640, 1080, 860);
      ITENS.slice().reverse().forEach((s, i) => { const k = back(lin(lt, .1 + i * .2, .45 + i * .2)); if (k <= 0) return; const x = 215 + i * 290, y = 870 + (i % 2) * 30, c = [AMAR, "#9fe8ff", "#ffb3dc"][i];
        X.save(); X.translate(x, y); X.rotate([-.06, .05, -.03][i]); X.scale(k, k); X.shadowColor = "rgba(0,0,0,.3)"; X.shadowBlur = 14; X.fillStyle = c; X.fillRect(-125, -125, 250, 250); X.shadowBlur = 0; X.fillStyle = "rgba(255,255,255,.55)"; X.fillRect(-50, -140, 100, 32);
        X.fillStyle = TINTA; X.textAlign = "center"; X.textBaseline = "middle"; X.font = "900 56px FR"; X.fillText("Nº " + (i + 1), 0, -64); X.font = `900 ${cabe(40, s.item, 220)}px FR`; X.fillText(s.item, 0, 4); X.fillStyle = "#4a5070"; X.font = "700 32px FR"; X.fillText(fmtP(s.estrelas) + " ★", 0, 66); X.restore(); });
      const p = back(lin(lt, .8, 1.2)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 1160); X.scale(p, p); X.fillStyle = MAG; X.beginPath(); X.roundRect(-300, -62, 600, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = `900 ${cabe(72, "Comenta " + CHAVE, 560)}px FR`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 4); X.restore();
      if (lt > 1.2) { X.globalAlpha = eo(lin(lt, 1.2, 1.6)); X.fillStyle = TINTA; X.font = "700 40px FR"; X.textAlign = "center"; X.fillText("Qual vídeo do seu trabalho você animaria?", 505, 1290); X.globalAlpha = 1; } },
  }; return U; };
const cores = { LAR: MAG, VERDE: AMAR, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

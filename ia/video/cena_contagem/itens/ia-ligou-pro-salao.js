// Reel 📜 história "2018: a IA ligou e conversou como gente" (Google Duplex no I/O de maio/2018; 13/11 21:30). Motor da cena_contagem.
// Identidade: salão de beleza retrô: cadeira de cabeleireiro, secador de capacete, espelho redondo, balcão com telefone de disco
// tocando (o fone pula), agenda de papel aberta; balões da conversa saem do telefone. Menta-salão + rosa-chiclete + cromado.
// Sem rosto de pessoa real nem logo. Elementos: faixa diagonal de aviso, nome com letras caindo, sem contador (história), karaokê com
// marca-texto, glitch RGB, 2 planos frontais, cartões que viram, Archivo Black. Mascote com bobes no cabelo; ação: atender o telefone de disco.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const MENTA = "#8fe3cf", MENTA2 = "#2f9e86", ROSA = "#ff6fa8", ROSA2 = "#d63f7c", CROMO = "#c9d1d9", TINTA = "#1d1a24", FUNDO = "#f2fbf8", AMAR = "#ffd23f", CREME = "#fffaf3";
rim.color.set(0xffd6ea); rim.intensity = 1.4; key.color.set(0xffffff); key.intensity = 145; key.position.set(1, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xf0fff9, .6));
// ---------- salão ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = MENTA; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,.35)"; for (let y = 0; y < h; y += 24) for (let x = (y / 24) % 2 ? 12 : 0; x < w; x += 24) g.fillRect(x, y, 12, 12); g.fillStyle = ROSA; g.fillRect(0, 170, w, 10); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const chT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? "#ffffff" : "#ffd3e4"; g.fillRect(x * 32, y * 32, 32, 32); } }); chT.wrapS = chT.wrapT = THREE.RepeatWrapping; chT.repeat.set(5, 3);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: chT, roughness: .4 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// espelho redondo + cadeira + secador de capacete
mesh(new THREE.TorusGeometry(.8, .07, 10, 40), M(ROSA, { roughness: .3 }), S, -1.9, 2.3, -2.7); mesh(new THREE.CircleGeometry(.76, 40), M("#dfeef0", { metalness: .8, roughness: .1 }), S, -1.9, 2.3, -2.72).castShadow = false;
const CAD = new THREE.Group(); CAD.position.set(-1.9, 0, -1.6); S.add(CAD); mesh(new THREE.CylinderGeometry(.08, .3, .5, 16), M(CROMO, { metalness: .8, roughness: .25 }), CAD, 0, .25, 0); box(.8, .18, .7, M(ROSA2, { roughness: .5 }), CAD, 0, .6, 0); box(.8, .8, .14, M(ROSA2, { roughness: .5 }), CAD, 0, 1.05, -.3);
const SEC = new THREE.Group(); SEC.position.set(2.4, 0, -1.8); S.add(SEC); box(.06, 1.6, .06, M(CROMO, { metalness: .8 }), SEC, 0, .8, 0); const cap = mesh(new THREE.SphereGeometry(.45, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), M(MENTA2, { roughness: .4 }), SEC, 0, 1.6, .2); cap.rotation.x = Math.PI * .85;
// balcão com telefone de disco + agenda
box(2.0, .9, .8, M("#f6efe6", { roughness: .6 }), S, .2, .45, -1.4); box(2.1, .06, .9, M(ROSA, { roughness: .4 }), S, .2, .93, -1.4);
const TEL = new THREE.Group(); TEL.position.set(.1, .96, -1.3); S.add(TEL); box(.5, .18, .4, M(ROSA2, { roughness: .35 }), TEL, 0, .09, 0); const disco = mesh(new THREE.CylinderGeometry(.15, .15, .03, 20), M("#fff"), TEL, 0, .19, .05);
const FONE = new THREE.Group(); TEL.add(FONE); FONE.position.set(0, .24, -.05); box(.58, .08, .1, M(ROSA2, { roughness: .35 }), FONE, 0, 0, 0); for (const s of [-1, 1]) box(.12, .1, .14, M(ROSA2), FONE, s * .26, -.03, 0);
const agT = ctex(256, 180, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 256, 180); g.strokeStyle = "#cfd8e3"; for (let y = 30; y < 180; y += 24) { g.beginPath(); g.moveTo(10, y); g.lineTo(246, y); g.stroke(); } g.fillStyle = TINTA; g.font = "400 22px AB"; g.fillText("10:00  CORTE", 14, 76); g.fillStyle = ROSA2; g.fillText("✓", 210, 76); });
const AG = mesh(new THREE.PlaneGeometry(.7, .5), new THREE.MeshStandardMaterial({ map: agT }), S, -.3, .965, -1.3); AG.rotation.x = -Math.PI / 2; AG.castShadow = false;
// balões da conversa (saem do telefone)
const balT = (txt, ia) => ctex(420, 120, g => { g.fillStyle = ia ? MENTA2 : "#fff"; g.beginPath(); g.roundRect(4, 4, 412, 96, 30); g.fill(); g.beginPath(); g.moveTo(ia ? 50 : 370, 96); g.lineTo(ia ? 36 : 384, 120); g.lineTo(ia ? 90 : 330, 96); g.fill(); g.fillStyle = ia ? "#fff" : TINTA; g.font = "400 36px AB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 210, 54); });
const BALS = [["QUERO MARCAR UM CORTE", 1], ["PRA QUANDO?", 0], ["HUM-HUM...", 1]].map(([t, ia]) => { const m = mesh(new THREE.PlaneGeometry(1.7, .5), new THREE.MeshBasicMaterial({ map: balT(t, ia), transparent: true, side: THREE.DoubleSide }), S); m.castShadow = false; m.visible = false; return m; });
// telão do palco (s1/s3): só texto, sem logo
const tvT = ctex(512, 256, g => { g.fillStyle = "#101820"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#fff"; g.font = "400 56px AB"; g.textAlign = "center"; g.fillText("MAIO DE 2018", 256, 110); g.fillStyle = MENTA; g.font = "400 34px AB"; g.fillText("demonstração ao vivo", 256, 170); });
const TV = mesh(new THREE.PlaneGeometry(2.2, 1.1), new THREE.MeshBasicMaterial({ map: tvT }), S, .3, 3.0, -2.7); TV.castShadow = false;
// ---------- mascote: bobes no cabelo; atende o telefone ----------
const BOB = new THREE.Group(); BOB.position.set(0, 1.5, 0); MAS.corpo.add(BOB); for (let i = 0; i < 5; i++) { const b = mesh(new THREE.CylinderGeometry(.11, .11, .34, 12), M([ROSA, AMAR, MENTA2][i % 3], { roughness: .5 }), BOB, -.5 + i * .25, .1, (i % 2) * .12 - .06); b.rotation.z = Math.PI / 2; }
const MX = 1.5, MZ = .3;
const atende = (lt, t0) => { const u = lt - t0, k = eio(Math.max(0, Math.min(1, u / .5))); FONE.position.set(k * .65, .24 + k * .45, -.05 + k * 1.55); FONE.rotation.set(0, 0, k * 1.3);
  pose(MAS, { x: MX - k * .4, z: MZ, y: hop(lt, .8, .03), ry: -.5, braco: [.4, .6 + k * 1.4], piscar: pisca(lt) }); MAS.g.rotation.z = k * .06; };
const toca = lt => { FONE.position.set(0, .24 + Math.abs(Math.sin(lt * 30)) * .04 * (Math.floor(lt * 2) % 2), -.05); FONE.rotation.set(0, 0, 0); };
const feliz = lt => { pose(MAS, { x: MX - .2, z: MZ, y: hop(lt, .35, .22), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const pensa = lt => { pose(MAS, { x: MX - .2, z: MZ, y: 0, ry: -.2, braco: [.2, 1.6 + Math.sin(lt * 2) * .1], piscar: pisca(lt) }); MAS.g.rotation.z = .06; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = (lt) => { BALS.forEach(b => b.visible = false); disco.rotation.y = lt * .5; TV.visible = true; };
const bal = (b, k, x, y) => { b.visible = k > .01; b.scale.setScalar(Math.max(.01, back(k))); b.position.set(x, y, -.4); };
// ---------- 2 planos frontais (aberto → fechado na metade) ----------
const PL = { gancho: [[V(0, 2.3, 7.0), V(0, 1.6, -1.2)], [V(.5, 1.9, 5.6), V(.6, 1.6, -1.2)]], s1: [[V(0, 2.6, 7.2), V(.2, 2.2, -1.6)], [V(.2, 2.3, 6.0), V(.3, 2.4, -2.0)]], s2: [[V(.3, 2.1, 6.2), V(.5, 1.7, -1.2)], [V(.8, 1.9, 5.4), V(.9, 1.7, -1.2)]],
  s3: [[V(0, 2.5, 7.0), V(.2, 2.0, -1.6)], [V(.4, 2.0, 5.8), V(.6, 1.7, -1.2)]], s4: [[V(-.2, 2.2, 6.6), V(.2, 1.6, -1.0)], [V(.6, 1.9, 5.6), V(.8, 1.6, -1.0)]], cta: [[V(0, 2.3, 7.2), V(.2, 1.6, -1.0)], [V(0, 2.3, 7.2), V(.2, 1.6, -1.0)]] };
const SHOTS = PL;
const camera = (cam, nome, lt, d) => { const P = PL[nome] || PL.cta, i = lt < d * .5 ? 0 : 1, [p, l] = P[i], u = (lt - (i ? d * .5 : 0)) / (d * .5); cam.position.set(p.x, p.y, p.z - u * .25); cam.lookAt(l); };
const ACT = {
  gancho(lt, d) { reset(lt); if (lt < 1.2) { toca(lt); pose(MAS, { x: MX, z: MZ, y: hop(lt, .4, .08), ry: -.4, braco: [1.8, 1.8], piscar: 1 }); MAS.g.rotation.z = 0; } else atende(lt, 1.2); bal(BALS[0], lin(lt, 1.8, 2.2), -.2, 2.6); },
  s1(lt, d) { reset(lt); atende(lt, -1); },
  s2(lt, d) { reset(lt); atende(lt, -1); bal(BALS[0], 1, -.1, 2.3); bal(BALS[1], lin(lt, .8, 1.2), 1.1, 3.0); bal(BALS[2], lin(lt, 2.0, 2.4), -.1, 3.6); },
  s3(lt, d) { reset(lt); toca(0); FONE.position.set(0, .24, -.05); feliz(lt); },
  s4(lt, d) { reset(lt); toca(0); pensa(lt); },
  cta(lt, d) { reset(lt); toca(0); feliz(lt); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px AB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const listras = (w, h) => { X.save(); X.beginPath(); X.rect(-w / 2, -h / 2, w, h); X.clip(); X.fillStyle = AMAR; X.fillRect(-w / 2, -h / 2, w, h); X.fillStyle = TINTA; for (let x = -w / 2 - h; x < w / 2 + h; x += 56) { X.beginPath(); X.moveTo(x, -h / 2); X.lineTo(x + 28, -h / 2); X.lineTo(x + 28 - h, h / 2); X.lineTo(x - h, h / 2); X.fill(); } X.restore(); };
  const cai = (txt, cx, y, lt, t0, cor, tw = 96) => { const x0 = cx - (txt.length * (tw + 8) - 8) / 2; for (let i = 0; i < txt.length; i++) { if (txt[i] === " ") continue; const k = lin(lt, t0 + i * .07, t0 + i * .07 + .32); if (k <= 0) continue; const yy = y - (1 - eo(k)) * 240;
      X.save(); X.translate(x0 + i * (tw + 8) + tw / 2, yy); X.rotate((1 - eo(k)) * (i % 2 ? .5 : -.5)); X.fillStyle = cor; X.beginPath(); X.roundRect(-tw / 2, -tw / 2 - 6, tw, tw + 12, 12); X.fill(); X.fillStyle = "#fff"; X.font = `400 ${Math.round(tw * .8)}px AB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(txt[i], 0, 4); X.restore(); } };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(242,251,248,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") cai("DUPLEX", 505, 700, lt, .3, MENTA2, 100);
      if (nome === "s2") cai("HUM-HUM", 505, 700, lt, 2.0, ROSA2, 90);
      if (nome === "s3") { const n = Math.floor(lin(lt, .2, 2.0) * 9); for (let i = 0; i < n; i++) { X.font = "400 64px AB"; X.textAlign = "center"; X.fillStyle = [AMAR, ROSA, MENTA2][i % 3]; X.fillText(i % 2 ? "★" : "WOW!", 120 + (i * 103) % 820, 690 + (i % 3) * 60); } }
      if (nome === "s4") { X.save(); X.translate(505, 700); X.rotate(-.03); X.fillStyle = TINTA; X.beginPath(); X.roundRect(-440, -60, 880, 120, 16); X.fill(); X.fillStyle = AMAR; X.font = `400 ${cabe(48, "ROBÔ PODE LIGAR SEM AVISAR?", 820)}px AB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("ROBÔ PODE LIGAR SEM AVISAR?", 0, 4); X.restore(); } },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(-.045); X.save(); X.translate(0, -112); listras(980, 32); X.restore(); X.save(); X.translate(0, 116); listras(980, 32); X.restore();
      X.fillStyle = TINTA; X.fillRect(-490, -96, 980, 196); X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = "#fff"; cabe(58, l1, 900); X.fillText(l1, 0, -22); X.fillStyle = MENTA; cabe(56, l2, 900); X.fillText(l2, 0, 38); X.fillStyle = ROSA; cabe(44, l3, 900); X.fillText(l3, 0, 86); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { // karaokê: marca-texto rosa desliza por baixo
      const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 70; X.font = `400 ${fs}px AB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 840 && fs > 40) { fs -= 2; X.font = `400 ${fs}px AB`; }
      const y = 1400; let x = 505 - tot() / 2; const xs = c.map(w => { const r = [x, X.measureText(w.w).width]; x += X.measureText(w.w + " ").width; return r; });
      let fim = xs[0][0] - 10; c.forEach((w, i) => { const k = lin(t, w.t0, w.t1); if (k > 0) fim = xs[i][0] + xs[i][1] * k + 10; });
      X.fillStyle = "rgba(255,111,168,.88)"; X.beginPath(); X.roundRect(xs[0][0] - 14, y - fs * .45, Math.max(0, fim - xs[0][0] + 14), fs * .84, 8); X.fill();
      X.textAlign = "left"; X.textBaseline = "middle"; c.forEach((w, i) => { X.fillStyle = TINTA; X.lineWidth = 10; X.strokeStyle = "#fff"; X.lineJoin = "round"; X.strokeText(w.w, xs[i][0], y + 4); X.fillText(w.w, xs[i][0], y + 4); }); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .3) return; const k = 1 - lt / .3, cv = X.canvas; X.save(); X.globalCompositeOperation = "lighter"; X.globalAlpha = .45 * k;
      X.drawImage(cv, 22 * k, 0); X.drawImage(cv, -22 * k, 0); X.restore(); X.save(); X.globalAlpha = .7 * k; for (let i = 0; i < 10; i++) { const y = 600 + ((i * 131 + Math.floor(lt * 60) * 37) % 860); X.fillStyle = i % 2 ? "rgba(255,0,90,.5)" : "rgba(0,220,255,.5)"; X.fillRect(0, y, 1080, 6 + (i % 3) * 8); } X.restore(); },
    fechamento(lt) { // cartões que viram: 2018 · HUM-HUM · VAI AVISAR
      X.fillStyle = "rgba(242,251,248,.28)"; X.fillRect(0, 640, 1080, 860);
      [["2018", "o ano"], ["HUM-HUM", "o detalhe"], ["AVISAR", "a promessa"]].forEach(([a, b], i) => { const k = lin(lt, .1 + i * .22, .55 + i * .22), sx = Math.abs(Math.cos(k * Math.PI)), frente = k > .5, x = 210 + i * 300, y = 870;
        X.save(); X.translate(x, y); X.scale(Math.max(.02, sx), 1); X.fillStyle = frente ? "#fff" : ROSA; X.beginPath(); X.roundRect(-130, -170, 260, 340, 22); X.fill();
        if (frente) { X.fillStyle = MENTA2; X.font = `400 ${cabe(56, a, 220)}px AB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(a, 0, -20); X.fillStyle = "#6a6475"; X.font = "400 30px AB"; X.fillText(b, 0, 46); } else { X.fillStyle = "#fff"; X.font = "400 120px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("?", 0, 8); } X.restore(); });
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(320, 1170); X.scale(p * .8, p * .8); X.fillStyle = ROSA2; X.beginPath(); X.roundRect(-300, -62, 600, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = `400 ${cabe(72, "COMENTA " + CHAVE, 560)}px AB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore();
      if (lt > 1.3) { X.globalAlpha = eo(lin(lt, 1.3, 1.7)); X.fillStyle = TINTA; X.font = "400 40px AB"; X.textAlign = "center"; X.fillText("SALVA PRA CONTAR PRA ALGUÉM", 505, 1290); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: ROSA, VERDE: MENTA2, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

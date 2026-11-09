// Reel 🆕 novidade "11 IAs testam seu negócio antes de abrir" (Jakeschincariol/founder-skill, MIT; 12/11 14:00). Motor da cena_contagem.
// Identidade: sala de reunião de "tubarões" em miniatura: mesa comprida, cadeiras de couro com conselheiros de bloco anônimos (sem rosto
// humano, sem nomes), quadro com gráfico, uma lâmpada (a ideia) no centro da mesa; depois uma plateia de 100 compradores de mentira.
// Azul-marinho + dourado + branco. Elementos (trocados para não repetir vizinhos): página de caderno, nome em texto decifrando, pote de
// estrelas, tarja de TV, zoom atravessando uma tela, câmera na mão, post-its na parede, Space Grotesk (Press Start só em enfeite).
// Mascote com pasta executiva na mão (ao lado) e crachá no braço; ação principal: apresentar a ideia.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, mascote, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const MAR = "#14234f", MAR2 = "#22397a", OURO = "#d9a93b", BR = "#ffffff", TINTA = "#0f1630", FUNDO = "#e8ecf5", VERDE = "#2fb36b", VERM = "#e5484d";
const ESTR = 2818;
rim.color.set(0xffe6b0); rim.intensity = 1.3; key.color.set(0xffffff); key.intensity = 145; key.position.set(1, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xeef2ff, .55));
// ---------- sala ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = MAR2; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,.05)"; for (let x = 0; x < w; x += 64) g.fillRect(x, 0, 4, h); g.fillStyle = "#0b1636"; g.fillRect(0, 190, w, h); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(22, 12), M("#3a3f52", { roughness: .7 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
const grT = ctex(320, 200, (g, w, h, k = 1) => { g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); g.strokeStyle = "#ccd"; for (let y = 30; y < h; y += 34) { g.beginPath(); g.moveTo(20, y); g.lineTo(300, y); g.stroke(); } g.strokeStyle = VERM; g.lineWidth = 8; g.beginPath(); g.moveTo(30, 60); g.lineTo(110, 90); g.lineTo(190, 70); g.lineTo(290, 160); g.stroke(); g.fillStyle = MAR; g.font = "700 22px SG"; g.fillText("vendas (simuladas)", 30, 190); });
mesh(new THREE.PlaneGeometry(2.2, 1.4), new THREE.MeshStandardMaterial({ map: grT }), S, 1.6, 2.6, -2.7);
// mesa comprida + conselheiros anônimos (blocos cinza/dourados, sem rosto)
box(4.2, .1, 1.3, M("#4a2f1e", { roughness: .4 }), S, .3, .85, -1.2); for (const x of [-1.6, 2.2]) box(.12, .85, .9, M("#2a1a10"), S, x, .42, -1.2);
const CONS = []; for (let i = 0; i < 4; i++) { const g = new THREE.Group(); g.position.set(-1.0 + i * .9, 0, -2.0); S.add(g); box(.7, 1.2, .2, M("#5a1e1e", { roughness: .5 }), g, 0, 1.1, -.25); box(.6, .1, .6, M("#5a1e1e"), g, 0, .55, 0);
  const corpo = box(.5, .6, .4, M(i % 2 ? "#8d96a6" : "#a7aec0"), g, 0, .95, 0); box(.38, .38, .38, M(i % 2 ? "#8d96a6" : "#a7aec0"), g, 0, 1.45, 0); box(.1, .3, .05, M(OURO), g, 0, 1.0, .21); CONS.push(g); }
const tags = ["CONSELHO", "MARKETING", "FINANÇAS", "CLIENTE"].map((t, i) => { const tt = ctex(160, 48, g => { g.fillStyle = "#fff"; g.beginPath(); g.roundRect(0, 0, 160, 48, 10); g.fill(); g.fillStyle = MAR; g.font = "700 24px SG"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(t, 80, 26); });
  const m = mesh(new THREE.PlaneGeometry(.62, .19), new THREE.MeshBasicMaterial({ map: tt, transparent: true }), S, -1.0 + i * .9, .96, -1.0); m.rotation.x = -.6; m.castShadow = false; return m; });
// lâmpada (a ideia)
const LAMP = new THREE.Group(); LAMP.position.set(.3, .9, -.9); S.add(LAMP); const vid = mesh(new THREE.SphereGeometry(.22, 20, 16), E("#fff2a8", 1.2), LAMP, 0, .38, 0); box(.16, .14, .16, M("#aaa", { metalness: .6 }), LAMP, 0, .14, 0);
// plateia de 100 compradores (instancing)
const N = 100, IM = new THREE.InstancedMesh(new THREE.BoxGeometry(.16, .26, .12), M("#ffffff"), N); IM.castShadow = true; S.add(IM); const m4 = new THREE.Matrix4(), col = new THREE.Color();
for (let i = 0; i < N; i++) IM.setColorAt(i, col.set(["#7fb3ff", "#ffb38a", "#9fe3b0", "#e0b3ff"][i % 4]));
const plateia = (k, t) => { for (let i = 0; i < N; i++) { const r = Math.floor(i / 20), c = i % 20, on = i < k * N; const x = -2.8 + c * .3, z = .5 + r * .28, y = on ? .13 + (Math.sin(t * 6 + i) > .7 ? .06 : 0) : -1;
  m4.makeTranslation(x, y, z); IM.setMatrixAt(i, m4); IM.setColorAt(i, col.set(t > 0 && on && (i * 37) % 10 < 4 ? VERDE : i % 3 ? "#9aa6c0" : VERM)); } IM.instanceMatrix.needsUpdate = true; IM.instanceColor.needsUpdate = true; };
// ---------- mascote: pasta executiva na mão direita + crachá no braço esquerdo ----------
const PASTA = new THREE.Group(); PASTA.position.set(.45, -.1, .16); MAS.bracos[1].add(PASTA); box(.42, .3, .1, M("#3a2416", { roughness: .4 }), PASTA, 0, -.1, 0); box(.14, .05, .04, M(OURO, { metalness: .7 }), PASTA, 0, .07, 0);
const crT = ctex(128, 80, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 128, 80); g.fillStyle = OURO; g.fillRect(0, 0, 128, 22); g.fillStyle = MAR; g.font = "700 30px SG"; g.textAlign = "center"; g.fillText("FUNDADOR", 64, 60); });
const cr = mesh(new THREE.PlaneGeometry(.28, .18), new THREE.MeshStandardMaterial({ map: crT, side: THREE.DoubleSide }), MAS.bracos[0], -.3, -.16, .17); cr.castShadow = false;
const MX = -.2, MZ = .9;
const apresenta = lt => { const k = Math.sin(lt * 2.2); pose(MAS, { x: MX + k * .25, z: MZ, y: hop(lt, .7, .03), ry: k * .3, braco: [1.4 + Math.sin(lt * 4) * .2, .5], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const virado = (lt, ry = -.4) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .5], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .24), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let POTE = 0;
const reset = (lt) => { plateia(0, -1); CONS.forEach((g, i) => g.rotation.y = 0); tags.forEach(t => t.visible = false); vid.material.emissiveIntensity = 1.2 + Math.sin(lt * 4) * .3; };
// ---------- câmera na mão ----------
const BS = { gancho: [V(.2, 2.6, 6.4), V(.2, 1.1, -1.0)], s1: [V(-.4, 2.3, 5.6), V(.2, 1.3, -1.6)], s2: [V(0, 3.4, 6.6), V(-.2, .5, .6)], s3: [V(.4, 2.4, 6.2), V(.2, 1.2, -1.0)], s4: [V(-.3, 2.5, 6.4), V(.6, 1.2, -1.4)], cta: [V(0, 2.6, 7.0), V(0, 1.1, -.8)] };
const SHOTS = {}; Object.keys(BS).forEach(n => SHOTS[n] = [BS[n], BS[n]]);
const camera = (cam, nome, lt, d, t) => { const [p, l] = BS[nome] || BS.cta, u = lt / d; const nx = Math.sin(t * 1.3) * .05 + Math.sin(t * 3.7) * .02, ny = Math.sin(t * 1.7 + 1) * .04 + Math.sin(t * 4.3) * .015;
  cam.position.set(p.x + nx, p.y + ny, p.z - u * .35); cam.lookAt(l.x + nx * .4, l.y + ny * .4, l.z); cam.rotateZ(Math.sin(t * 1.1) * .012); };
const ACT = {
  gancho(lt, d) { reset(lt); CONS.forEach((g, i) => g.rotation.y = eio(lin(lt, 1.2 + i * .15, 1.7 + i * .15)) * .25 * (i < 2 ? 1 : -1)); LAMP.scale.setScalar(Math.max(.01, back(lin(lt, .2, .6)))); apresenta(lt); },
  s1(lt) { reset(lt); tags.forEach((t, i) => { const k = lin(lt, .5 + i * .35, .8 + i * .35); t.visible = k > 0; t.scale.setScalar(Math.max(.01, back(k))); }); apresenta(lt); },
  s2(lt, d) { reset(lt); plateia(eio(lin(lt, .2, d * .7)), lt); virado(lt, -.6); },
  s3(lt, d) { reset(lt); tags.forEach(t => t.visible = true); POTE = ESTR * eio(lin(lt, .3, 2.2)); feliz(lt); },
  s4(lt) { reset(lt); tags.forEach(t => t.visible = true); vid.material.emissiveIntensity = .4 + Math.max(0, Math.sin(lt * 9)) * 1.5; virado(lt, -.2); },
  cta(lt) { reset(lt); tags.forEach(t => t.visible = true); feliz(lt); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos, decifra } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `700 ${f}px SG`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const estrela = (x, y, r, cor) => { X.fillStyle = cor; X.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; X.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } X.closePath(); X.fill(); };
  const pote = (v, x, y) => { const w = 150, h = 170; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,255,255,.94)"; X.beginPath(); X.roundRect(-110, -h / 2 - 40, 220, h + 140, 20); X.fill();
    X.fillStyle = "rgba(127,179,255,.25)"; X.strokeStyle = MAR2; X.lineWidth = 5; X.beginPath(); X.roundRect(-w / 2, -h / 2, w, h, 22); X.fill(); X.stroke(); X.fillStyle = OURO; X.fillRect(-w / 2 + 12, -h / 2 - 20, w - 24, 22);
    X.save(); X.beginPath(); X.roundRect(-w / 2 + 5, -h / 2 + 5, w - 10, h - 10, 18); X.clip(); const n = Math.floor(v / ESTR * 30); for (let i = 0; i < n; i++) estrela(-w / 2 + 20 + (i % 5) * 26 + (Math.floor(i / 5) % 2) * 12, h / 2 - 18 - Math.floor(i / 5) * 24, 13, i % 3 ? OURO : "#ffe48a"); X.restore();
    X.fillStyle = TINTA; X.font = "700 46px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(Math.round(v).toLocaleString("pt-BR"), 0, h / 2 + 40); X.font = "400 14px PS"; X.fillStyle = MAR2; X.fillText("★ GITHUB", 0, h / 2 + 76); X.restore(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(232,236,245,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") { const nm = "FOUNDER-SKILL", p = eo(lin(lt, .1, .9)), txt = decifra(nm, p, Math.floor(t * 22)); X.font = "700 58px SG"; const w = X.measureText(nm).width + 50; X.fillStyle = MAR; X.beginPath(); X.roundRect(60, 612, w, 86, 14); X.fill(); X.fillStyle = "#fff"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText(txt, 85, 658); }
      if (nome === "s2") { const n = Math.round(eio(lin(lt, .2, 3)) * 100); X.fillStyle = "#fff"; X.beginPath(); X.roundRect(60, 612, 640, 90, 16); X.fill(); X.fillStyle = MAR; X.font = `700 ${cabe(46, "100 compradores de mentira", 590)}px SG`; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText(`${n} compradores de mentira`, 84, 658); }
      if (nome === "s3") pote(POTE, 840, 830);
      if (nome === "s4") { X.fillStyle = VERM; X.beginPath(); X.roundRect(60, 612, 600, 90, 16); X.fill(); X.fillStyle = "#fff"; X.font = "700 46px SG"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("não garante sucesso", 84, 658); } },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(-.012); X.shadowColor = "rgba(20,30,60,.22)"; X.shadowBlur = 18; X.shadowOffsetY = 6; X.fillStyle = "#fffdf6"; X.fillRect(-445, -122, 890, 244); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(34,57,122,.25)"; X.lineWidth = 2; for (let y = -70; y < 122; y += 54) { X.beginPath(); X.moveTo(-445, y); X.lineTo(445, y); X.stroke(); } X.strokeStyle = "rgba(229,72,77,.5)"; X.beginPath(); X.moveTo(-375, -122); X.lineTo(-375, 122); X.stroke();
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(48, l1, 780); X.fillText(l1, -350, -30); X.fillStyle = MAR2; cabe(52, l2, 780); X.fillText(l2, -350, 32); if (l3) { X.fillStyle = "#b8860b"; cabe(44, l3, 780); X.fillText(l3, -350, 90); } X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 54; X.font = `700 ${fs}px SG`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 640 && fs > 28) { fs -= 2; X.font = `700 ${fs}px SG`; }
      const y = 1405; X.fillStyle = MAR; X.fillRect(40, y - 56, 910, 112); X.fillStyle = OURO; X.fillRect(40, y + 48, 910, 8); X.fillStyle = OURO; X.fillRect(60, y - 88, 200, 38); X.fillStyle = TINTA; X.font = "400 16px PS"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("REUNIÃO", 160, y - 68);
      let x = 505 - tot() / 2; X.font = `700 ${fs}px SG`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? OURO : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 220 + u * 2300, h = w * .62;
      X.save(); X.fillStyle = "#0b1636"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 20 * (1 - u) + 6); X.fill("evenodd"); X.strokeStyle = OURO; X.lineWidth = 12; X.beginPath(); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 20 * (1 - u) + 6); X.stroke(); X.restore(); },
    fechamento(lt) { const P = [["COMENTA " + CHAVE, OURO, 505, 790, -.03, 76, MAR, 760, 170], ["11 skills grátis pro Claude", "#cfe0ff", 290, 1070, .05, 44, TINTA, 400, 230], ["mostra o furo antes de abrir", "#ffd8c2", 720, 1090, -.05, 44, TINTA, 380, 230]];
      P.forEach(([txt, cor, x, y, r, f, tc, w, h], i) => { const p = back(lin(lt, i * .2, i * .2 + .35)); if (p <= 0) return; X.save(); X.translate(x, y); X.rotate(r + Math.sin(lt * 2 + i) * .01); X.scale(p, p);
        X.shadowColor = "rgba(20,20,40,.3)"; X.shadowBlur = 16; X.shadowOffsetY = 8; X.fillStyle = cor; X.fillRect(-w / 2, -h / 2, w, h); X.shadowColor = "transparent"; X.fillStyle = "rgba(255,255,255,.6)"; X.fillRect(-50, -h / 2 - 14, 100, 28);
        X.fillStyle = tc; X.textAlign = "center"; X.textBaseline = "middle"; X.font = `700 ${f}px SG`; const ws = txt.split(" "), L = []; let c = ""; for (const w2 of ws) { const tt = c ? c + " " + w2 : w2; if (X.measureText(tt).width > w - 40 && c) { L.push(c); c = w2; } else c = tt; } L.push(c);
        L.forEach((l, k) => X.fillText(l, 0, (k - (L.length - 1) / 2) * f * 1.15 + 4)); X.restore(); });
      if (lt > 1.0) { X.globalAlpha = eo(lin(lt, 1.0, 1.4)); X.fillStyle = TINTA; X.font = "700 40px SG"; X.textAlign = "center"; X.fillText("Qual negócio você abriria?", 505, 1320); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: MAR, VERDE: OURO, FUNDO, CREME: BR, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

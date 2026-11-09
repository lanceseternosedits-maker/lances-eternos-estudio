// Reel 🆕 contagem "3 apps grátis que o Mac devia ter" (BetterWispr, Atticus, Tendedero; 11/11 10:00).
// Identidade: quintal ensolarado com varal de roupa, prendedores de madeira, lençóis que viram janelas de app, cesto de vime;
// azul-céu + branco-lençol + madeira clara. Nº 1: os prints pendurados no varal balançando ao vento. Sem logo da Apple.
// Elementos: página de caderno, nome escrito à mão, pote enchendo de estrelas (termômetro repetiria o "IA configurada", que sai antes),
// tarja de TV, zoom atravessando uma tela, órbita, cartões que viram, Bebas Neue. Mascote de chapéu de palha; ação: correr pendurando.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const CEU = "#8fd3ff", AZ = "#2f86d6", AZ2 = "#1a5a9e", MAD = "#c9995e", BRANCO = "#ffffff", TINTA = "#14222f", FUNDO = "#e6f5ff", AMAR = "#ffcf3f", VERDE = "#5bbf6a";
rim.color.set(0xfff4d8); rim.intensity = 1.3; key.color.set(0xfffaf0); key.intensity = 160; key.position.set(3, 10, 6); key.target.position.set(0, 1, 0);
S.add(new THREE.AmbientLight(0xeef8ff, .6));
// ---------- quintal ----------
const ceuT = ctex(512, 256, (g, w, h) => { const sk = g.createLinearGradient(0, 0, 0, h); sk.addColorStop(0, "#5ec0ff"); sk.addColorStop(1, "#dff3ff"); g.fillStyle = sk; g.fillRect(0, 0, w, h); g.fillStyle = "#fff";
  [[90, 60], [320, 40], [440, 90]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 20, 0, 7); g.arc(x + 22, y - 8, 24, 0, 7); g.arc(x + 46, y, 18, 0, 7); g.fill(); }); g.fillStyle = "#f2c06b"; g.fillRect(0, h - 50, w, 50); for (let x = 0; x < w; x += 24) { g.fillStyle = "#d9a24f"; g.fillRect(x, h - 50, 4, 50); } });
mesh(new THREE.PlaneGeometry(26, 12), new THREE.MeshBasicMaterial({ map: ceuT }), S, 0, 5, -4.5).castShadow = false;
const gT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#7ccf6e"; g.fillRect(0, 0, w, h); for (let i = 0; i < 800; i++) { g.fillStyle = i % 2 ? "#8edc7e" : "#62b75a"; g.fillRect((i * 37) % w, (i * 71) % h, 2, 5); } }); gT.wrapS = gT.wrapT = THREE.RepeatWrapping; gT.repeat.set(6, 4);
const chao = mesh(new THREE.PlaneGeometry(26, 14), new THREE.MeshStandardMaterial({ map: gT, roughness: 1 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// varal: 2 postes + corda
const madM = M(MAD, { roughness: .7 }); for (const x of [-2.6, 2.6]) { box(.14, 2.6, .14, madM, S, x, 1.3, -.8); box(.6, .1, .1, madM, S, x, 2.5, -.8); }
const corda = mesh(new THREE.CylinderGeometry(.015, .015, 5.2, 6), M("#f5f5f5"), S, 0, 2.45, -.8); corda.rotation.z = Math.PI / 2;
const cesto = mesh(new THREE.CylinderGeometry(.45, .35, .4, 16, 1, true), M("#b88a4e", { side: THREE.DoubleSide, roughness: .9 }), S, 2.0, .2, .6);
// lençóis-janela (cada item) e prints (nº 1)
const janT = (tipo) => ctex(256, 200, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 256, 200); g.fillStyle = "#e7ecf2"; g.fillRect(0, 0, 256, 30); ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(16 + i * 18, 15, 6, 0, 7); g.fill(); });
  g.fillStyle = TINTA; g.textAlign = "center"; g.textBaseline = "middle";
  if (tipo === 3) { g.fillStyle = AZ; g.beginPath(); g.roundRect(98, 56, 60, 80, 30); g.fill(); g.fillRect(124, 136, 8, 26); g.fillStyle = "#cfd8e3"; for (let i = 0; i < 3; i++) g.fillRect(40, 170 + i * 0, 176 - i * 30, 0); g.fillStyle = TINTA; g.font = "400 30px BB"; g.fillText("FALA → TEXTO", 128, 180); }
  if (tipo === 2) { g.fillStyle = "#d97757"; g.beginPath(); g.arc(128, 100, 42, 0, 7); g.fill(); g.strokeStyle = AZ; g.lineWidth = 6; for (let r = 55; r < 90; r += 14) { g.beginPath(); g.arc(128, 100, r, -.6, .6); g.stroke(); g.beginPath(); g.arc(128, 100, r, Math.PI - .6, Math.PI + .6); g.stroke(); } g.fillStyle = TINTA; g.font = "400 28px BB"; g.fillText("ASSISTENTE DE VOZ", 128, 180); }
  if (tipo === 1) { g.fillStyle = "#cfe6ff"; g.fillRect(16, 40, 224, 140); g.fillStyle = AZ2; g.fillRect(30, 56, 90, 50); g.fillStyle = "#ffb347"; g.fillRect(130, 70, 96, 70); g.fillStyle = TINTA; g.font = "400 26px BB"; g.fillText("PRINT", 128, 165); } });
const lencol = (tipo) => { const g = new THREE.Group(); const m = mesh(new THREE.PlaneGeometry(1.4, 1.1, 8, 4), new THREE.MeshStandardMaterial({ map: janT(tipo), side: THREE.DoubleSide, roughness: .9 }), g, 0, -.58, 0);
  for (const x of [-.55, .55]) box(.06, .16, .05, madM, g, x, -.02, 0); return { g, m }; };
const L3 = lencol(3), L2 = lencol(2); S.add(L3.g, L2.g);
const PRINTS = [0, 1, 2, 3, 4].map(i => { const p = lencol(1); p.g.scale.setScalar(.62); S.add(p.g); return p; });
const balanca = (L, t, f = 1) => { const pos = L.m.geometry.attributes.position, base = L.m.userData.base || (L.m.userData.base = pos.array.slice());
  for (let i = 0; i < pos.count; i++) { const y = base[i * 3 + 1]; pos.array[i * 3 + 2] = base[i * 3 + 2] + Math.sin(t * 3 + base[i * 3] * 2) * (.55 - y) * .18 * f; } pos.needsUpdate = true; };
const pendura = (L, x, k, t) => { L.g.visible = k > .01; L.g.position.set(x, 2.45 + (1 - eo(k)) * -1.6, -.78); L.g.rotation.z = (1 - eo(k)) * .5; L.g.scale.y = (L.g.userData.s || 1) * Math.max(.01, back(k)); balanca(L, t); };
PRINTS.forEach(p => p.g.userData.s = .62); L3.g.userData.s = L2.g.userData.s = 1;
// ---------- mascote: chapéu de palha; corre pendurando ----------
const CH = new THREE.Group(); CH.position.set(0, 1.5, 0); MAS.corpo.add(CH); const palha = M("#ecc777", { roughness: .9 });
mesh(new THREE.CylinderGeometry(.92, .92, .05, 32), palha, CH, 0, .03, 0); mesh(new THREE.CylinderGeometry(.42, .5, .36, 24), palha, CH, 0, .22, 0); mesh(new THREE.CylinderGeometry(.505, .505, .09, 24), M(AZ), CH, 0, .1, 0);
const MZ = .9;
const corre = (lt, x0, x1, d = 1.2) => { const k = eio(lin(lt, 0, d)), x = x0 + (x1 - x0) * k; pose(MAS, { x, z: MZ, y: hop(lt, .18, k < 1 ? .1 : .02), ry: k < 1 ? (x1 > x0 ? 1.1 : -1.1) * .8 : .2, braco: k < 1 ? [1.5 + Math.sin(lt * 14) * .5, 1.5 - Math.sin(lt * 14) * .5] : [.3, 2.2], andar: lt * 3 * (k < 1 ? 1 : 0), piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = (lt, x) => { pose(MAS, { x, z: MZ, y: hop(lt, .35, .24), ry: .2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("n3"); grupo("n2"); grupo("n1"); grupo("cta");
const reset = () => { [L3, L2, ...PRINTS].forEach(L => L.g.visible = false); };
// ---------- órbita ----------
const ORB = { gancho: [-.3, .1, 6.6, 2.2, V(0, 1.5, -.6)], n3: [.25, -.05, 6.2, 2.1, V(-.8, 1.7, -.6)], n2: [-.2, .15, 6.2, 2.1, V(.6, 1.7, -.6)], n1: [.3, -.25, 6.8, 2.3, V(0, 1.8, -.7)], cta: [.1, -.1, 7.0, 2.2, V(0, 1.5, -.6)] };
const SHOTS = {}; Object.keys(ORB).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a0, a1, r, y, l] = ORB[nome] || ORB.cta, a = a0 + (a1 - a0) * eio(lt / d); cam.position.set(l.x + Math.sin(a) * r, y, l.z + Math.cos(a) * r); cam.lookAt(l); };
const ACT = {
  gancho(lt, d) { reset(); [0, 1, 2].forEach(i => { const p = PRINTS[i]; p.g.visible = true; p.g.position.set(-2.0 + i * .5, .35 + i * .05, .55); p.g.rotation.set(-1.2, 0, .2 * i); }); corre(lt, -2.4, -1.2, 1.0); },
  n3(lt, d) { reset(); pendura(L3, -1.4, lin(lt, .3, .9), lt); corre(lt, .5, -1.4, 1.0); },
  n2(lt, d) { reset(); pendura(L3, -1.4, 1, lt); pendura(L2, .3, lin(lt, .3, .9), lt); corre(lt, -1.4, .3, 1.0); },
  n1(lt, d) { reset(); pendura(L3, -1.4, 1, lt); pendura(L2, .3, 1, lt); PRINTS.forEach((p, i) => pendura(p, 1.15 + (i % 3) * .5 - (i > 2 ? .25 : 0), lin(lt, .3 + i * .25, .8 + i * .25), lt + i)); if (lt < 1.5) corre(lt, .3, 1.6, 1.2); else feliz(lt, 1.6); },
  cta(lt, d) { reset(); pendura(L3, -1.4, 1, lt); pendura(L2, .3, 1, lt); PRINTS.forEach((p, i) => pendura(p, 1.15 + (i % 3) * .5 - (i > 2 ? .25 : 0), 1, lt + i)); feliz(lt, 1.6); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, ITENS, MAXE } = C; const GY3 = 620; let CAB = null;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px BB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const fmtP = n => Math.round(n).toLocaleString("pt-BR");
  const estrela = (x, y, r, cor) => { X.fillStyle = cor; X.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; X.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } X.closePath(); X.fill(); };
  const pote = (v, x, y) => { const w = 150, h = 170; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,255,255,.92)"; X.beginPath(); X.roundRect(-110, -h / 2 - 40, 220, h + 140, 20); X.fill();
    X.fillStyle = "rgba(143,211,255,.35)"; X.strokeStyle = AZ; X.lineWidth = 5; X.beginPath(); X.roundRect(-w / 2, -h / 2, w, h, 22); X.fill(); X.stroke(); X.fillStyle = MAD; X.fillRect(-w / 2 + 12, -h / 2 - 20, w - 24, 22);
    X.save(); X.beginPath(); X.roundRect(-w / 2 + 5, -h / 2 + 5, w - 10, h - 10, 18); X.clip(); const n = Math.floor(v / MAXE * 30); for (let i = 0; i < n; i++) estrela(-w / 2 + 20 + (i % 5) * 26 + (Math.floor(i / 5) % 2) * 12, h / 2 - 18 - Math.floor(i / 5) * 24, 13, i % 3 ? AMAR : "#ffe48a"); X.restore();
    X.fillStyle = TINTA; X.font = "400 50px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(fmtP(v) + " ★", 0, h / 2 + 40); X.font = "400 22px BB"; X.fillStyle = AZ2; X.fillText("ESTRELAS NO GITHUB", 0, h / 2 + 76); X.restore(); };
  const U = {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 60], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(230,245,255,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (CAB && nome !== "gancho" && nome !== "cta") U.cab2(...CAB); CAB = null; },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(-.012); X.shadowColor = "rgba(20,40,60,.22)"; X.shadowBlur = 18; X.shadowOffsetY = 6; X.fillStyle = "#fffdf6"; X.fillRect(-445, -122, 890, 244); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(47,134,214,.3)"; X.lineWidth = 2; for (let y = -70; y < 122; y += 54) { X.beginPath(); X.moveTo(-445, y); X.lineTo(445, y); X.stroke(); } X.strokeStyle = "rgba(232,50,60,.45)"; X.beginPath(); X.moveTo(-375, -122); X.lineTo(-375, 122); X.stroke();
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(64, l1, 780); X.fillText(l1, -350, -30); X.fillStyle = AZ; cabe(58, l2, 780); X.fillText(l2, -350, 34); X.fillStyle = "#e0782f"; cabe(52, l3, 780); X.fillText(l3, -350, 92); X.restore(); },
    cabecalho(s, lt, t) { CAB = [s, lt, t]; },
    cab2(s, lt, t) { const y = 650; X.fillStyle = AZ; X.beginPath(); X.arc(104, y, 42, 0, 7); X.fill(); X.fillStyle = "#fff"; X.font = "400 56px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag.replace(/\D/g, ""), 104, y + 3);
      const p = eio(lin(lt, .12, .9)); X.save(); X.font = "700 92px CV"; X.textAlign = "left"; const w = X.measureText(s.item).width; X.beginPath(); X.rect(160, y - 80, w * p + 6, 150); X.clip(); X.fillStyle = TINTA; X.fillText(s.item, 164, y + 22); X.restore();
      pote(s.estrelas * eio(lin(lt, .4, 1.9)), 820, 850); },
    legenda(seg, t) { const ch = C.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 74; X.font = `400 ${fs}px BB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 780 && fs > 40) { fs -= 2; X.font = `400 ${fs}px BB`; }
      const y = 1405; X.fillStyle = AZ2; X.fillRect(40, y - 56, 910, 112); X.fillStyle = AMAR; X.fillRect(40, y + 48, 910, 8); X.fillStyle = "#fff"; X.fillRect(60, y - 88, 120, 38); X.fillStyle = AZ2; X.font = "400 26px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("VARAL TV", 120, y - 68);
      let x = 505 - tot() / 2; X.font = `400 ${fs}px BB`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? AMAR : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 220 + u * 2300, h = w * .75;
      X.save(); X.fillStyle = "#e9eef4"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 26 * (1 - u) + 6); X.fill("evenodd"); X.fillStyle = "#c9d3de"; X.fillRect(505 - w / 2, 1000 - h / 2 - 40 * (1 - u), w, 40 * (1 - u)); X.restore(); },
    fechamento(lt) { // cartões que viram com os 3 apps
      ITENS.slice().reverse().forEach((s, i) => { const x = 210 + i * 300, y = 860, p = lin(lt, .15 + i * .22, .55 + i * .22), sx = Math.abs(Math.cos(p * Math.PI)), frente = p >= .5;
        X.save(); X.translate(x, y); X.scale(Math.max(.02, sx), 1); X.fillStyle = frente ? "#fff" : AZ; X.beginPath(); X.roundRect(-130, -180, 260, 360, 22); X.fill(); X.textAlign = "center"; X.textBaseline = "middle";
        if (!frente) { X.fillStyle = "#fff"; X.font = "400 140px BB"; X.fillText("?", 0, 8); } else { X.fillStyle = AZ; X.font = "400 64px BB"; X.fillText("Nº " + (i + 1), 0, -100); X.fillStyle = TINTA; X.font = `700 ${s.item.length > 9 ? 50 : 62}px CV`; X.fillText(s.item, 0, -10); X.fillStyle = "#e0782f"; X.font = "400 46px BB"; X.fillText(fmtP(s.estrelas) + " ★", 0, 80); } X.restore(); });
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 1210); X.scale(p, p); X.fillStyle = AZ2; X.beginPath(); X.roundRect(-300, -64, 600, 128, 64); X.fill(); X.fillStyle = "#fff"; X.font = "400 84px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 6); X.restore();
      if (lt > 1.3) { X.globalAlpha = eo(lin(lt, 1.3, 1.7)); X.fillStyle = TINTA; X.font = "400 46px BB"; X.textAlign = "center"; X.fillText("QUAL VOCÊ INSTALA PRIMEIRO NO TRABALHO?", 505, 1330); X.globalAlpha = 1; } },
  }; return U; };
const cores = { LAR: AZ, VERDE, FUNDO, CREME: BRANCO, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

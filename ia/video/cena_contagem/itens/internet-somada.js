// Reel 🆕 novidade "Soma o Wi-Fi com o 4G" (net-merge/net-merge, MIT; 10/11 19:30). Motor da cena_contagem (mesmo mascote 3D).
// Identidade: casa de máquinas de encanamento de dados: canos transparentes coloridos (Wi-Fi azul, 4G laranja, cabo verde,
// vizinho rosa) com registros, que se juntam num cano grosso e enchem uma caixa-d'água de bolinhas de luz; celular gigante
// no 1º quadro com os ícones de Wi-Fi e 4G. Azul-piscina + laranja + verde-cano. Sem logos de sistemas (nomes só em texto).
// Elementos: faixa diagonal de aviso, nome em carimbo batendo, placar HI-SCORE (estrelas da API do GitHub, número em fonte clara),
// tarja de TV, zoom atravessando uma tela, órbita, pódio, Space Grotesk + Caveat nos destaques.
// Mascote de bandana (no topo) + chave inglesa na mão (ao lado); ação principal: dançar quando a caixa enche.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const AZ = "#1fb6e8", LAR = "#ff8a1f", VD = "#2cc56f", RS = "#ff5fa8", PISC = "#0c6f8f", TINTA = "#0d1f2a", FUNDO = "#dff4fb", AMAR = "#ffd23f", BRANCO = "#ffffff";
const ESTRELAS = 2975;
rim.color.set(0xa8ecff); rim.intensity = 1.4; key.color.set(0xffffff); key.intensity = 150; key.position.set(1, 9, 6); key.target.position.set(0, .9, -.3);
S.add(new THREE.AmbientLight(0xeaf9ff, .55));

// ---------- cenário: parede de azulejo piscina, piso de borracha ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#bfe9f6"; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(12,111,143,.18)"; g.lineWidth = 2; for (let x = 0; x < w; x += 24) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(22, 12), M("#3b4a55", { roughness: .9 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// canos: 4 entradas horizontais que descem e se juntam num cano grosso até a caixa-d'água
const vidro = c => new THREE.MeshStandardMaterial({ color: c, transparent: true, opacity: .45, roughness: .1, metalness: .1 });
const CORES = [AZ, LAR, VD, RS], YS = [2.3, 1.85, 1.4, .95];
const CANOS = CORES.map((c, i) => { const g = new THREE.Group(); S.add(g); const m = vidro(c); const tubo = mesh(new THREE.CylinderGeometry(.09, .09, 2.6, 16), m, g, -1.6, YS[i], -1.2); tubo.rotation.z = Math.PI / 2;
  const desce = mesh(new THREE.CylinderGeometry(.09, .09, YS[i] - .55, 16), m, g, -.3, (YS[i] + .55) / 2, -1.2); const reg = new THREE.Group(); reg.position.set(-2.2, YS[i], -1.08); g.add(reg);
  mesh(new THREE.CylinderGeometry(.13, .13, .08, 16), M("#d33"), reg, 0, 0, 0).rotation.x = Math.PI / 2; box(.34, .05, .05, M("#d33"), reg, 0, 0, .05); g.visible = false; return { g, m, reg, i }; });
const grosso = mesh(new THREE.CylinderGeometry(.2, .2, 2.0, 20), vidro("#9feaff"), S, .7, .55, -1.2); grosso.rotation.z = Math.PI / 2;
// caixa-d'água transparente
const CX = new THREE.Group(); CX.position.set(2.1, 0, -1.0); S.add(CX); mesh(new THREE.CylinderGeometry(.75, .75, 1.6, 32, 1, true), new THREE.MeshStandardMaterial({ color: "#bdf1ff", transparent: true, opacity: .3, side: THREE.DoubleSide }), CX, 0, .8, 0);
mesh(new THREE.TorusGeometry(.75, .04, 8, 40), M(PISC), CX, 0, 1.6, 0).rotation.x = Math.PI / 2; mesh(new THREE.CylinderGeometry(.77, .77, .06, 32), M(PISC), CX, 0, .03, 0);
const NB = 90, bolM = CORES.map(c => E(c, .9)); const BOLAS = Array.from({ length: NB }, (_, i) => { const b = mesh(new THREE.SphereGeometry(.07, 10, 8), bolM[i % 4], CX); b.position.set(Math.cos(i * 2.4) * (.15 + (i % 5) * .11), .1 + Math.floor(i / 9) * .14, Math.sin(i * 2.4) * (.15 + (i % 5) * .11)); b.visible = false; return b; });
// bolinhas viajando nos canos
const VIAJ = Array.from({ length: 40 }, (_, i) => { const b = mesh(new THREE.SphereGeometry(.06, 8, 6), bolM[i % 4], S); b.visible = false; b.castShadow = false; return b; });
// celular gigante (1º quadro)
const celT = ctex(256, 480, (g, w, h) => { g.fillStyle = "#101820"; g.fillRect(0, 0, w, h); g.fillStyle = "#1c2a36"; g.fillRect(0, 0, w, 60); g.fillStyle = "#fff"; g.font = "700 30px SG"; g.fillText("9:41", 18, 42);
  g.strokeStyle = AZ; g.lineWidth = 6; g.lineCap = "round"; for (let r = 1; r <= 3; r++) { g.beginPath(); g.arc(150, 48, r * 9, -2.4, -.75); g.stroke(); } g.fillStyle = LAR; g.font = "700 26px SG"; g.fillText("4G", 192, 44);
  g.fillStyle = AZ; g.beginPath(); g.arc(128, 220, 70, 0, 7); g.fill(); g.strokeStyle = "#fff"; g.lineWidth = 10; for (let r = 1; r <= 3; r++) { g.beginPath(); g.arc(128, 250, r * 18, -2.4, -.75); g.stroke(); }
  g.fillStyle = LAR; g.beginPath(); g.roundRect(68, 320, 120, 70, 16); g.fill(); g.fillStyle = "#fff"; g.font = "700 48px SG"; g.textAlign = "center"; g.fillText("4G", 128, 372); });
const CEL = mesh(new THREE.BoxGeometry(.9, 1.7, .1), [M("#222"), M("#222"), M("#222"), M("#222"), new THREE.MeshStandardMaterial({ map: celT, emissive: "#fff", emissiveMap: celT, emissiveIntensity: .6 }), M("#222")], S, -.85, 1.15, .1);

// ---------- mascote: bandana (no topo) + chave inglesa na mão direita; dançar ----------
const BAN = new THREE.Group(); BAN.position.set(0, 1.49, 0); MAS.corpo.add(BAN); mesh(new THREE.BoxGeometry(1.54, .1, 1.04), M(RS, { roughness: .8 }), BAN, 0, 0, 0); const no = box(.2, .14, .1, M(RS), BAN, .55, .02, -.55); no.rotation.z = .5;
const CHV = new THREE.Group(); CHV.position.set(.42, .05, .15); MAS.bracos[1].add(CHV); box(.06, .45, .04, M("#aab", { metalness: .7, roughness: .3 }), CHV, 0, .18, 0); mesh(new THREE.TorusGeometry(.08, .03, 6, 12, 4.5), M("#aab", { metalness: .7, roughness: .3 }), CHV, 0, .45, 0);
const MX = .55, MZ = .55;
const gira = (lt, x = MX) => { const k = Math.sin(lt * 7); pose(MAS, { x, z: MZ, y: 0, ry: -.3, braco: [.4, 1.2 + k * .35], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const danca = (lt, x = MX) => { const b = lt * 2.2; pose(MAS, { x: x + Math.sin(b * Math.PI) * .25, z: MZ, y: hop(lt, .45, .22), ry: Math.sin(b * Math.PI) * .45, braco: [1.4 + Math.sin(b * 2 * Math.PI) * .7, 1.4 - Math.sin(b * 2 * Math.PI) * .7], andar: b, sq: Math.max(0, Math.cos(lt * Math.PI / .45)) * .05, piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(b * Math.PI) * .12; };
const olha = (lt, ry = .3) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .5 + Math.sin(lt * 2) * .1], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };

grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const canos = n => CANOS.forEach((C, i) => { C.g.visible = i < n; C.m.opacity = i < n ? .45 : .2; });
const enche = k => BOLAS.forEach((b, i) => b.visible = i < Math.floor(k * NB));
const fluxo = (lt, n) => VIAJ.forEach((b, i) => { const c = i % 4; if (c >= n) { b.visible = false; return; } b.visible = true; b.material = bolM[c]; const u = ((lt * .45 + i * .137) % 1);
  if (u < .55) b.position.set(-2.9 + u / .55 * 2.6, YS[c], -1.2); else if (u < .75) b.position.set(-.3, YS[c] - (u - .55) / .2 * (YS[c] - .55), -1.2); else b.position.set(-.3 + (u - .75) / .25 * 2.0, .55, -1.2); });
const reset = () => { CEL.visible = false; canos(0); enche(0); VIAJ.forEach(b => b.visible = false); };

// ---------- órbita ----------
const ORB = { gancho: [-.25, .1, 6.5, 1.9, V(-.1, 1.15, -.3)], s1: [.3, -.1, 7.3, 2.0, V(-.1, 1.3, -.8)], s2: [-.3, .15, 7.3, 2.1, V(-.4, 1.5, -.8)], s3: [.2, -.2, 7.3, 2.0, V(.4, 1.2, -.6)],
  s4: [-.2, .25, 7.3, 2.1, V(.4, 1.2, -.5)], cta: [.1, -.1, 7.7, 2.1, V(0, 1.2, -.5)] };
const SHOTS = {}; Object.keys(ORB).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a0, a1, r, y, l] = ORB[nome] || ORB.cta, a = a0 + (a1 - a0) * eio(lt / d); cam.position.set(l.x + Math.sin(a) * r, y, l.z + Math.cos(a) * r); cam.lookAt(l); };

let HS = 0;
const ACT = {
  gancho(lt, d) { reset(); CEL.visible = true; CEL.rotation.y = Math.sin(lt * 1.2) * .2; CEL.position.y = 1.15 + Math.sin(lt * 2) * .04; olha(lt, -.4); },
  s1(lt, d) { reset(); const n = lt < .6 ? 2 : 3; canos(n); fluxo(lt, n); enche(lin(lt, .5, d) * .25); CANOS.forEach((C, i) => C.reg.rotation.z = i < n ? lt * 3 : 0); gira(lt); },
  s2(lt, d) { reset(); const n = Math.min(4, 1 + Math.floor(lin(lt, .2, d * .85) * 4)); canos(n); fluxo(lt, n); enche(.25 + lin(lt, 0, d) * .3); CANOS.forEach((C, i) => C.reg.rotation.z = i < n ? lt * 3 : 0); gira(lt, MX - .2); },
  s3(lt, d) { reset(); canos(4); fluxo(lt, 4); enche(.55 + lin(lt, 0, d) * .25); HS = ESTRELAS * eio(lin(lt, .3, 2.6)); olha(lt, .1); },
  s4(lt, d) { reset(); canos(4); fluxo(lt, 4); enche(.8 + lin(lt, 0, 1.5) * .2); danca(lt); },
  cta(lt, d) { reset(); canos(4); fluxo(lt, 4); enche(1); danca(lt); },
};

// ---------- elementos de tela (2D): entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 22) { X.font = `700 ${f}px SG`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const listras = (w, h) => { X.save(); X.beginPath(); X.rect(-w / 2, -h / 2, w, h); X.clip(); X.fillStyle = AMAR; X.fillRect(-w / 2, -h / 2, w, h); X.fillStyle = TINTA; for (let x = -w / 2 - h; x < w / 2 + h; x += 56) { X.beginPath(); X.moveTo(x, -h / 2); X.lineTo(x + 28, -h / 2); X.lineTo(x + 28 - h, h / 2); X.lineTo(x - h, h / 2); X.fill(); } X.restore(); };
  const carimbo = (txt, x, y, lt, cor, rot = -.08) => { const k = lin(lt, .15, .4); if (k <= 0) return; const s = 1 + (1 - eo(k)) * 1.6; X.save(); X.translate(x, y); X.rotate(rot); X.scale(s, s); X.globalAlpha = Math.min(1, k * 1.5);
    X.font = "700 70px SG"; const w = X.measureText(txt).width + 60; X.strokeStyle = cor; X.lineWidth = 9; X.strokeRect(-w / 2, -55, w, 110); X.fillStyle = cor; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(txt, 0, 5); X.restore(); X.globalAlpha = 1; };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(223,244,251,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") carimbo("NET-MERGE", 330, 680, lt, PISC);
      if (nome === "s2") { const n = Math.min(4, 1 + Math.floor(lin(lt, .2, (C.SEG.find(s => s.cena === "s2").fim - C.SEG.find(s => s.cena === "s2").t0) * .85) * 4)); ["Wi-Fi", "4G", "cabo", "vizinho"].forEach((s, i) => { if (i >= n) return; const a = eo(lin(lt, .2 + i * .9, .5 + i * .9));
          X.globalAlpha = Math.max(.2, a); X.fillStyle = CORES[i]; X.beginPath(); X.roundRect(70 + i * 215, 615, 200, 74, 37); X.fill(); X.fillStyle = "#fff"; X.font = "700 58px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s, 170 + i * 215, 652); X.globalAlpha = 1; }); }
      if (nome === "s3") { X.fillStyle = TINTA; X.beginPath(); X.roundRect(560, 610, 380, 170, 14); X.fill(); X.strokeStyle = AZ; X.lineWidth = 5; X.stroke(); X.fillStyle = AZ; X.font = "400 24px PS"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("HI-SCORE", 750, 648);
        X.fillStyle = "#fff"; X.font = "700 76px SG"; X.fillText(Math.round(HS).toLocaleString("pt-BR"), 750, 712); X.fillStyle = "#9fdcef"; X.font = "700 22px SG"; X.fillText("ESTRELAS NO GITHUB", 750, 760); }
      if (nome === "s4") { ["Windows", "Mac", "Linux", "Android"].forEach((s, i) => { const a = back(lin(lt, .2 + i * .3, .5 + i * .3)); if (a <= 0) return; X.save(); X.translate(150 + i * 230, 650); X.scale(a, a); X.fillStyle = "#fff"; X.beginPath(); X.roundRect(-100, -40, 200, 80, 18); X.fill(); X.strokeStyle = PISC; X.lineWidth = 4; X.stroke();
          X.fillStyle = TINTA; X.font = "700 38px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s, 0, 2); X.restore(); }); if (lt > 1.6) carimbo("DE GRAÇA", 505, 790, lt - 1.4, VD, .06); } },
    etiqueta(t, nome) { // faixa diagonal de aviso
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(.04); X.save(); X.translate(0, -112); listras(980, 32); X.restore(); X.save(); X.translate(0, 116); listras(980, 32); X.restore();
      X.fillStyle = PISC; X.fillRect(-490, -96, 980, 196); X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = "#fff"; cabe(66, l1, 900); X.fillText(l1, 0, -18); X.fillStyle = AMAR; cabe(46, l2, 900); X.fillText(l2, 0, 38);
      if (l3) { X.fillStyle = "#bff3ff"; X.font = "700 52px CV"; X.fillText(l3, 0, 88); } X.restore(); },
    cabecalho() {},
    legenda(seg, t) { // tarja de TV azul com selo "AO VIVO"
      const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 58; X.font = `700 ${fs}px SG`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 820 && fs > 34) { fs -= 2; X.font = `700 ${fs}px SG`; }
      const y = 1400; X.fillStyle = TINTA; X.fillRect(40, y - 56, 910, 112); X.fillStyle = AZ; X.fillRect(40, y + 48, 910, 8); X.fillStyle = "#e33"; X.fillRect(60, y - 90, 170, 40); X.fillStyle = "#fff"; X.font = "700 24px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("● AO VIVO", 145, y - 69);
      let x = 495 - tot() / 2; X.font = `700 ${fs}px SG`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? AZ : on ? "#fff" : "rgba(255,255,255,.4)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 220 + u * 2300, h = w * 1.9;
      X.save(); X.fillStyle = "#101820"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 40 * (1 - u) + 6); X.fill("evenodd"); X.strokeStyle = AZ; X.lineWidth = 12; X.beginPath(); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 40 * (1 - u) + 6); X.stroke(); X.restore(); },
    fechamento(lt) { // pódio
      const P = [[1, "TUDO JUNTO", 505, 300, PISC], [2, "Wi-Fi", 245, 210, AZ], [3, "4G", 765, 150, LAR]];
      P.forEach(([n, txt, x, h, c], i) => { const k = eo(lin(lt, .1 + i * .15, .5 + i * .15)), hh = h * k, base = 1330; X.fillStyle = c; X.fillRect(x - 125, base - hh, 250, hh); X.fillStyle = "rgba(0,0,0,.15)"; X.fillRect(x - 125, base - hh, 250, 14);
        if (k > .6) { X.fillStyle = "#fff"; X.font = "700 84px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(String(n), x, base - hh + 64); X.fillStyle = TINTA; X.font = "700 52px CV"; X.fillText(txt, x, base - hh - 32 + Math.sin(lt * 3 + i) * 3); } });
      X.fillStyle = TINTA; X.fillRect(80, 1330, 850, 16);
      const p = back(lin(lt, .7, 1.1)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 760); X.scale(p, p); X.fillStyle = PISC; X.beginPath(); X.roundRect(-400, -66, 800, 132, 66); X.fill();
      X.font = "700 64px SG"; const w1 = X.measureText("COMENTA ").width, w2 = X.measureText(CHAVE).width; X.textAlign = "left"; X.textBaseline = "middle"; X.fillStyle = "#fff"; X.fillText("COMENTA ", -(w1 + w2) / 2, 4); X.fillStyle = AMAR; X.fillText(CHAVE, -(w1 + w2) / 2 + w1, 4); X.restore();
      if (lt > 1.1) { X.globalAlpha = eo(lin(lt, 1.1, 1.5)); X.fillStyle = TINTA; X.font = "700 38px SG"; X.textAlign = "center"; X.fillText("Onde sua internet mais trava?", 505, 1420); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: AZ, VERDE: VD, FUNDO, CREME: BRANCO, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

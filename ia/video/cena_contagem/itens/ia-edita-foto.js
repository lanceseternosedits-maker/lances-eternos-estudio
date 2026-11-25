// Reel 🆕 contagem "3 IAs grátis pra foto que rodam no seu PC" (kokon, Shisei, Idol; 15/11 07:00). Motor da cena_contagem.
// Identidade: estúdio de foto montado na garagem: papel de fundo amarelo, softbox, tripé, um quadro de cortiça com fotos onde o mascote
// acerta dardos; nº 3: a foto acertada troca o fundo; nº 2: um manequim de madeira de desenhista que muda de pose; nº 1: de uma foto
// de uma xícara sai uma xícara em 3D girando. Amarelo-mostarda + turquesa + preto. Sem logo de marca.
// Elementos: tela de terminal, letras caindo e encaixando, odômetro de rolinhos, tarja de TV, zoom atravessando uma tela, plongée/contra-plongée,
// página de caderno, Archivo Black. Mascote de colete de fotógrafo; ação principal: jogar dardos.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const MOST = "#e3b23c", MOST2 = "#b7861a", TURQ = "#1fb5a8", TURQ2 = "#117a71", TINTA = "#1a1a1a", FUNDO = "#fbf6e8", CREME = "#fffaf0", VERM = "#e5484d", ROSA = "#ff7aa8";
rim.color.set(0xfff0c8); rim.intensity = 1.4; key.color.set(0xffffff); key.intensity = 155; key.position.set(-2, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xfff8e8, .6));
// ---------- garagem-estúdio ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#cfc6b4"; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(0,0,0,.08)"; for (let y = 0; y < h; y += 26) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.9).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(22, 12), M("#8d8a82", { roughness: .8 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// papel de fundo curvo (amarelo)
box(3.2, 2.2, .02, M(MOST, { roughness: .9 }), S, .2, 2.3, -2.8); box(3.2, .02, 1.6, M(MOST, { roughness: .9 }), S, .2, .01, -1.7);
// softbox + tripé
const SB = new THREE.Group(); SB.position.set(2.4, 0, -1.2); S.add(SB); box(.05, 2.0, .05, M("#222"), SB, 0, 1.0, 0); const sbx = box(.8, .8, .3, E("#fff", .8), SB, 0, 2.1, 0); sbx.rotation.y = -.6;
const TRI = new THREE.Group(); TRI.position.set(-2.0, 0, .2); S.add(TRI); for (let i = 0; i < 3; i++) { const p = box(.04, 1.4, .04, M("#333"), TRI, Math.cos(i * 2.1) * .2, .65, Math.sin(i * 2.1) * .2); p.rotation.z = Math.cos(i * 2.1) * .15; p.rotation.x = -Math.sin(i * 2.1) * .15; } box(.35, .22, .2, M("#111"), TRI, 0, 1.4, 0); const lenteT = mesh(new THREE.CylinderGeometry(.08, .08, .15, 16), M("#222"), TRI, 0, 1.4, .15); lenteT.rotation.x = Math.PI / 2;
// quadro de cortiça com 6 fotos (alvo dos dardos)
const corT = ctex(256, 192, (g, w, h) => { g.fillStyle = "#c79a62"; g.fillRect(0, 0, w, h); for (let i = 0; i < 400; i++) { g.fillStyle = i % 2 ? "#b88a52" : "#d4a872"; g.fillRect((i * 37) % w, (i * 71) % h, 3, 3); } });
const QD = new THREE.Group(); QD.position.set(-1.9, 2.2, -2.75); S.add(QD); box(1.8, 1.3, .06, new THREE.MeshStandardMaterial({ map: corT }), QD, 0, 0, 0);
const fotoT = (fundo, obj) => ctex(160, 120, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 160, 120); g.fillStyle = fundo; g.fillRect(8, 8, 144, 104); g.fillStyle = obj; g.beginPath(); g.arc(80, 60, 28, 0, 7); g.fill(); });
const FOTOS = [["#7aa36b", "#d97757"], ["#9fd3ff", "#333"], ["#ffd6e6", "#2f6fd6"], ["#ccc", "#e3b23c"], ["#5b5b7a", "#fff"], ["#f0e0c0", "#1fb5a8"]].map(([a, b], i) => { const m = mesh(new THREE.PlaneGeometry(.48, .36), new THREE.MeshBasicMaterial({ map: fotoT(a, b) }), QD, -.55 + (i % 3) * .55, .3 - Math.floor(i / 3) * .55, .04); m.castShadow = false; return m; });
const FOTO_NOVA = fotoT(TURQ, "#d97757");
const DARDOS = [0, 1, 2].map(i => { const g = new THREE.Group(); S.add(g); box(.03, .03, .3, M("#ddd", { metalness: .8 }), g, 0, 0, 0); box(.12, .12, .01, M([VERM, TURQ, MOST2][i]), g, 0, 0, .16); g.visible = false; return g; });
const voaDardo = (d, k, alvo) => { d.visible = k > 0; if (k <= 0) return; const de = V(.6, 1.6, .6), e = Math.min(1, k); d.position.set(de.x + (alvo.x - de.x) * e, de.y + (alvo.y - de.y) * e + Math.sin(e * Math.PI) * .4, de.z + (alvo.z - de.z) * e); d.lookAt(alvo.x, alvo.y, alvo.z - 1); };
// manequim de madeira (nº 2)
const MANQ = new THREE.Group(); MANQ.position.set(-.5, 0, -1.4); S.add(MANQ); const mad = M("#d9b98c", { roughness: .6 }); box(.04, .5, .04, M("#6b4426"), MANQ, 0, .25, 0); box(.3, .04, .3, M("#6b4426"), MANQ, 0, .02, 0);
const tronco = box(.26, .42, .14, mad, MANQ, 0, .78, 0); const cabM = mesh(new THREE.SphereGeometry(.12, 12, 10), mad, MANQ, 0, 1.12, 0); const BR = [-1, 1].map(s => { const g = new THREE.Group(); g.position.set(s * .17, .95, 0); MANQ.add(g); box(.06, .36, .06, mad, g, 0, -.18, 0); return g; }); const PE = [-1, 1].map(s => { const g = new THREE.Group(); g.position.set(s * .08, .56, 0); MANQ.add(g); box(.07, .4, .07, mad, g, 0, -.2, 0); return g; });
const posa = (i, k) => { const P = [[.3, -.3, .1, -.1], [2.6, -.4, .3, -.3], [1.2, 2.4, -.5, .4], [-.8, 2.8, .2, .6]]; const a = P[i % 4], b = P[(i + 1) % 4], m = (x, y) => x + (y - x) * eio(k); BR[0].rotation.z = -m(a[0], b[0]); BR[1].rotation.z = m(a[1], b[1]); PE[0].rotation.z = -m(a[2], b[2]) * .5; PE[1].rotation.z = m(a[3], b[3]) * .5; };
// nº 1: foto da xícara → xícara 3D
const xcT = ctex(160, 120, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 160, 120); g.fillStyle = "#e9e1d0"; g.fillRect(8, 8, 144, 104); g.fillStyle = TURQ; g.fillRect(56, 40, 48, 50); g.strokeStyle = TURQ; g.lineWidth = 8; g.beginPath(); g.arc(108, 64, 14, -1.3, 1.3); g.stroke(); });
const FX = mesh(new THREE.PlaneGeometry(.8, .6), new THREE.MeshBasicMaterial({ map: xcT, side: THREE.DoubleSide }), S, -.5, 1.3, -1.9); FX.castShadow = false;
const XIC = new THREE.Group(); XIC.position.set(-.5, 1.3, -1.5); S.add(XIC); mesh(new THREE.CylinderGeometry(.22, .18, .4, 24), M(TURQ, { roughness: .3 }), XIC, 0, 0, 0); mesh(new THREE.TorusGeometry(.1, .03, 8, 16), M(TURQ, { roughness: .3 }), XIC, .24, 0, 0); mesh(new THREE.CylinderGeometry(.19, .19, .02, 24), M("#5a3a20"), XIC, 0, .19, 0);
// ---------- mascote: colete de fotógrafo; joga dardos ----------
const COL = box(1.54, .5, 1.04, M("#6b7a4a", { roughness: .8 }), MAS.corpo, 0, .6, 0); for (const s of [-1, 1]) box(.3, .2, .03, M("#5a6840"), MAS.corpo, s * .4, .6, .53);
const MX = 1.2, MZ = .7;
const joga = (lt, t0) => { const u = lt - t0, k = u < 0 ? 0 : u < .25 ? u / .25 : Math.max(0, 1 - (u - .25) / .4); pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .02), ry: -.4, braco: [.3, .8 + k * 1.6], sq: k * .03, piscar: pisca(lt) }); MAS.g.rotation.z = -k * .05; };
const feliz = (lt, x = MX, z = MZ) => { pose(MAS, { x, z, y: hop(lt, .35, .22), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const NS = ["gancho", "n3", "n2", "n1", "cta"]; NS.forEach(n => grupo(n));
const reset = (lt) => { DARDOS.forEach(d => d.visible = false); MANQ.visible = false; FX.visible = false; XIC.visible = false; FOTOS[1].material.map = FOTOS[1].userData.orig || (FOTOS[1].userData.orig = FOTOS[1].material.map); };
const alvoF = i => { const v = new THREE.Vector3(); FOTOS[i].getWorldPosition(v); v.z += .05; return v; };
// ---------- plongée / contra-plongée ----------
const BS = { gancho: [V(.2, 4.3, 7.2), V(-.2, 1.0, -.8)], n3: [V(-.2, 1.0, 6.6), V(-.6, 1.9, -1.6)], n2: [V(.3, 4.1, 7.0), V(.2, .9, -1.0)], n1: [V(0, 1.0, 6.4), V(.2, 1.5, -1.2)], cta: [V(0, 2.8, 7.8), V(0, 1.4, -.8)] };
const SHOTS = {}; Object.keys(BS).forEach(n => { const s = [BS[n][0], BS[n][1]]; SHOTS[n] = [s, s]; });
const camera = (cam, nome, lt, d) => { const [p, l] = BS[nome] || BS.cta, u = eio(Math.min(1, lt / d)); cam.position.set(p.x, p.y + (p.y > 2 ? -.4 : .25) * u, p.z - u * .5); cam.lookAt(l.x, l.y, l.z); };
const ACT = {
  gancho(lt, d) { reset(lt); voaDardo(DARDOS[0], lin(lt, .7, 1.1), alvoF(4)); joga(lt, .5); },
  n3(lt, d) { reset(lt); voaDardo(DARDOS[0], lin(lt, .3, .7), alvoF(1)); if (lt > 1.2) FOTOS[1].material.map = FOTO_NOVA; joga(lt, .1); },
  n2(lt, d) { reset(lt); MANQ.visible = true; posa(Math.floor(lt / .9), (lt % .9) / .9); voaDardo(DARDOS[1], lin(lt, .3, .7), alvoF(3)); joga(lt, .1); },
  n1(lt, d) { reset(lt); FX.visible = true; XIC.visible = lt > 1.0; XIC.scale.setScalar(Math.max(.01, back(lin(lt, 1.0, 1.5)))); XIC.position.z = -1.9 + eio(lin(lt, 1.0, 1.8)) * .9; XIC.rotation.y = lt * 1.5; voaDardo(DARDOS[2], lin(lt, .3, .7), alvoF(5)); lt > 1.8 ? feliz(lt) : joga(lt, .1); },
  cta(lt, d) { reset(lt); FX.visible = true; XIC.visible = true; XIC.position.z = -1.0; XIC.rotation.y = lt * 1.5; feliz(lt, 1.6, 1.2); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, ITENS, MAXE } = C; const GY3 = 620; let CAB = null;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px AB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const fmtP = n => Math.round(n).toLocaleString("pt-BR");
  const odometro = (v, x, y) => { v = Math.floor(v); const s = String(v).padStart(4, "0"), dw = 62, dh = 88; X.save(); X.translate(x, y); X.fillStyle = "rgba(26,26,26,.92)"; X.beginPath(); X.roundRect(-dw * 2 - 22, -dh / 2 - 46, dw * 4 + 44, dh + 112, 18); X.fill();
    X.fillStyle = "#fff"; X.font = "400 24px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("★ NO GITHUB", 0, -dh / 2 - 22);
    for (let i = 0; i < 4; i++) { const dx = -dw * 2 + i * dw; X.fillStyle = CREME; X.fillRect(dx + 3, -dh / 2, dw - 6, dh); X.fillStyle = TINTA; X.font = "400 66px AB"; X.fillText(s[i], dx + dw / 2, 4); X.fillStyle = "rgba(0,0,0,.18)"; X.fillRect(dx + 3, -dh / 2, dw - 6, 12); X.fillRect(dx + 3, dh / 2 - 12, dw - 6, 12); }
    X.fillStyle = MOST; X.fillRect(-dw * 2, dh / 2 + 14, dw * 4 * Math.min(1, v / MAXE), 10); X.restore(); };
  const cai = (txt, x0, y, lt, t0) => { X.font = `400 ${cabe(84, txt, 560)}px AB`; const fs = parseInt(X.font); let x = x0; for (let i = 0; i < txt.length; i++) { const ch = txt[i], w = X.measureText(ch).width; const k = lin(lt, t0 + i * .05, t0 + i * .05 + .32);
      if (k > 0 && ch !== " ") { X.save(); X.translate(x + w / 2, y - (1 - eo(k)) * 220); X.rotate((1 - eo(k)) * (i % 2 ? .6 : -.6)); X.globalAlpha = Math.min(1, k * 2); X.fillStyle = TINTA; X.font = `400 ${fs}px AB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(ch, 0, 0); X.restore(); } x += w; } };
  const U = {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 60], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(251,246,232,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (CAB && nome !== "gancho" && nome !== "cta") U.cab2(...CAB); CAB = null; },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410);
      X.fillStyle = "#151515"; X.beginPath(); X.roundRect(-460, -140, 920, 280, 18); X.fill(); X.fillStyle = "#2b2b2b"; X.beginPath(); X.roundRect(-460, -140, 920, 42, [18, 18, 0, 0]); X.fill();
      [VERM, MOST, TURQ].forEach((c, i) => { X.fillStyle = c; X.beginPath(); X.arc(-428 + i * 30, -119, 9, 0, 7); X.fill(); });
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = TURQ; X.font = "400 54px AB"; X.fillText(">", -430, -30); X.fillStyle = "#fff"; cabe(52, l1, 800); X.fillText(l1, -385, -30);
      X.fillStyle = MOST; cabe(52, l2, 840); X.fillText(l2, -430, 38); X.fillStyle = "#9ff0e6"; cabe(44, l3, 800); X.fillText(l3, -430, 100); if (Math.floor(t * 2) % 2 === 0) { const w = X.measureText(l3).width; X.fillRect(-420 + w, 66, 22, 40); } X.restore(); },
    cabecalho(s, lt, t) { CAB = [s, lt, t]; },
    cab2(s, lt, t) { const y = 680; X.fillStyle = TURQ; X.beginPath(); X.arc(100, y, 44, 0, 7); X.fill(); X.fillStyle = "#fff"; X.font = "400 56px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag.replace(/\D/g, ""), 100, y + 3);
      cai(s.item, 166, y, lt, .1); odometro(s.estrelas * eio(lin(lt, .4, 1.9)), 770, 880); },
    legenda(seg, t) { const ch = C.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 64; X.font = `400 ${fs}px AB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 780 && fs > 36) { fs -= 2; X.font = `400 ${fs}px AB`; }
      const y = 1405, x0 = 505 - tot() / 2; X.fillStyle = TINTA; X.fillRect(40, y - 56, 910, 112); X.fillStyle = MOST; X.fillRect(40, y + 48, 910, 8); X.fillStyle = TURQ; X.fillRect(60, y - 90, 250, 40); X.fillStyle = "#fff"; X.font = "400 24px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("ESTÚDIO AO VIVO", 185, y - 70);
      let x = x0; X.font = `400 ${fs}px AB`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? MOST : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 240 + u * 2300, h = w * .75;
      X.save(); X.fillStyle = "#151515"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 10 * (1 - u) + 4); X.fill("evenodd"); X.restore(); },
    fechamento(lt) { X.save(); X.translate(420, 900); X.scale(.8, .8); X.rotate(-.015); X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 24; X.fillStyle = "#fffdf6"; X.fillRect(-430, -270, 860, 470); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(31,181,168,.35)"; X.lineWidth = 2; for (let y = -190; y < 200; y += 80) { X.beginPath(); X.moveTo(-430, y + 40); X.lineTo(430, y + 40); X.stroke(); } X.strokeStyle = "rgba(229,72,77,.5)"; X.beginPath(); X.moveTo(-350, -270); X.lineTo(-350, 200); X.stroke();
      X.fillStyle = TINTA; X.font = "400 50px AB"; X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillText("RODAM NO SEU PC:", -320, -200);
      ITENS.slice().reverse().forEach((s, i) => { const k = lin(lt, .15 + i * .18, .45 + i * .18); if (k <= 0) return; X.globalAlpha = k; const y = -110 + i * 80; X.fillStyle = TURQ2; X.font = "400 48px AB"; X.fillText((i + 1) + ".", -320, y); X.fillStyle = TINTA; X.font = `400 ${cabe(48, s.item, 420)}px AB`; X.fillText(s.item, -265, y); X.fillStyle = "#7a7a7a"; X.font = "400 36px AB"; X.textAlign = "right"; X.fillText(fmtP(s.estrelas) + " ★", 400, y); X.textAlign = "left"; X.globalAlpha = 1; });
      X.restore();
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(420, 1230); X.scale(p, p); X.fillStyle = TURQ; X.beginPath(); X.roundRect(-280, -60, 560, 120, 60); X.fill(); X.fillStyle = "#fff"; X.font = "400 72px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore();
      if (lt > 1.3) { X.globalAlpha = eo(lin(lt, 1.3, 1.7)); X.fillStyle = "#555"; X.font = "400 32px AB"; X.textAlign = "center"; X.fillText("QUAL FOTO SUA VOCÊ TRANSFORMARIA EM 3D?", 505, 1350); X.globalAlpha = 1; } },
  }; return U; };
const cores = { LAR: TURQ, VERDE: MOST, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

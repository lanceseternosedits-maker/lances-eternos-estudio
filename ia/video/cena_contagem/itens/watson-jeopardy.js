// Reel 📜 história "2011: a máquina ganhou o show da TV" (Watson no Jeopardy!, fev/2011; 12/11 17:00). Motor da cena_contagem.
// Identidade: estúdio de programa de perguntas: parede de telas azuis com valores, 3 púlpitos (2 competidores genéricos de blocos,
// sem rosto, e uma máquina com tela de ondas no meio), placar no púlpito, luzes de auditório. Roxo de auditório + amarelo + azul.
// Sem logo de terceiros nem rosto de pessoa real. Elementos: etiqueta em tela de terminal, nome em split-flap, sem contador (história),
// karaokê com marca-texto, flash branco, travelling lateral, pódio, Fraunces. Mascote de gravata-borboleta; ação: apertar a campainha.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, mascote, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const ROX = "#3b1e5c", ROX2 = "#24113a", AMA = "#ffd23f", AZ = "#1f47c9", AZ2 = "#14307f", BR = "#ffffff", FUNDO = "#efe8f7", VERDE = "#38e27a", VERM = "#ff4d5e";
rim.color.set(0xd9c2ff); rim.intensity = 1.4; key.color.set(0xffffff); key.intensity = 145; key.position.set(-1, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xf0e8ff, .55));
// ---------- estúdio ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = ROX; g.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,210,63,${.15 + (i % 3) * .1})`; g.beginPath(); g.arc((i * 53) % w, 20 + (i * 31) % 120, 3, 0, 7); g.fill(); } g.fillStyle = ROX2; g.fillRect(0, 200, w, h); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -3.2).castShadow = false;
const chT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#2a1640"; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(255,210,63,.35)"; g.lineWidth = 3; for (let r = 30; r < 360; r += 40) { g.beginPath(); g.arc(128, 128, r, 0, 7); g.stroke(); } });
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: chT, roughness: .45, metalness: .2 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// parede de telas (6 × 4) com valores
const tela = (txt, aceso) => ctex(160, 110, g => { g.fillStyle = aceso ? AZ : "#0d1a4a"; g.fillRect(0, 0, 160, 110); g.strokeStyle = "#000"; g.lineWidth = 6; g.strokeRect(0, 0, 160, 110); g.fillStyle = AMA; g.font = "900 42px FR"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 80, 58); });
const TEL = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { const v = "$" + (r + 1) * 200; const m = mesh(new THREE.PlaneGeometry(.78, .54), new THREE.MeshBasicMaterial({ map: tela(v, true) }), S, -2.0 + c * .8, 1.9 + (3 - r) * .56, -3.1); m.castShadow = false; TEL.push(m); }
// 3 púlpitos: competidor · máquina · competidor
const PUL = [-1.7, 0, 1.7].map((x, i) => { const g = new THREE.Group(); g.position.set(x, 0, -1.7); S.add(g); box(1.0, 1.0, .6, M(i === 1 ? AZ2 : "#5b2d86", { roughness: .4 }), g, 0, .5, 0); box(1.06, .08, .66, M(AMA, { metalness: .5, roughness: .3 }), g, 0, 1.02, 0); return g; });
const placT = (v, cor = AMA) => ctex(256, 96, g => { g.fillStyle = "#0b0b22"; g.fillRect(0, 0, 256, 96); g.fillStyle = cor; g.font = "900 58px FR"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(v, 128, 52); });
const PLAC = PUL.map(g => { const m = mesh(new THREE.PlaneGeometry(.86, .32), new THREE.MeshBasicMaterial({ map: placT("$0") }), g, 0, .72, .31); m.castShadow = false; return m; });
const setPlac = (i, v, cor) => { const o = PLAC[i].material.map; PLAC[i].material.map = placT(v, cor); o.dispose(); PLAC[i].material.needsUpdate = true; };
// competidores genéricos (blocos cinza, sem rosto)
[-1.7, 1.7].forEach((x, i) => { const g = new THREE.Group(); g.position.set(x, 0, -2.25); S.add(g); box(.62, .8, .4, M(i ? "#8d96a6" : "#a7aec0"), g, 0, 1.4, 0); box(.42, .42, .42, M(i ? "#8d96a6" : "#a7aec0"), g, 0, 2.05, 0); });
// a máquina: tela com ondas no púlpito do meio
let ondaK = 0, ondaCor = AZ;
const ondaC = document.createElement("canvas"); ondaC.width = 256; ondaC.height = 256; const og = ondaC.getContext("2d"); const ondaT = new THREE.CanvasTexture(ondaC); ondaT.colorSpace = THREE.SRGBColorSpace;
const ONDA = mesh(new THREE.PlaneGeometry(.9, .9), new THREE.MeshBasicMaterial({ map: ondaT }), PUL[1], 0, 2.05, 0); ONDA.scale.setScalar(1.25); ONDA.castShadow = false; box(1.2, 1.2, .1, M("#111", { metalness: .5 }), PUL[1], 0, 2.05, -.06); box(.12, .6, .12, M("#111"), PUL[1], 0, 1.3, -.06);
const desOnda = t => { og.fillStyle = "#050a20"; og.fillRect(0, 0, 256, 256); og.lineWidth = 6; for (let i = 0; i < 6; i++) { og.strokeStyle = i % 2 ? ondaCor : "#7fb0ff"; og.globalAlpha = .5 + ondaK * .5; og.beginPath(); for (let a = 0; a <= 64; a++) { const an = a / 64 * Math.PI * 2, r = 50 + i * 12 + Math.sin(an * 4 + t * (3 + i) + i) * (6 + ondaK * 16); og.lineTo(128 + Math.cos(an) * r, 128 + Math.sin(an) * r); } og.closePath(); og.stroke(); } og.globalAlpha = 1; ondaT.needsUpdate = true; };
// campainha na frente do mascote
const CAMP = new THREE.Group(); CAMP.position.set(1.75, 0, 1.0); S.add(CAMP); box(.5, .8, .5, M("#5b2d86"), CAMP, 0, .4, 0); const botao = mesh(new THREE.CylinderGeometry(.17, .19, .1, 20), E(VERM, .4), CAMP, 0, .85, 0);
// luzes de auditório (lâmpadas em fila, piscam)
const LUZ = []; for (let i = 0; i < 14; i++) LUZ.push(mesh(new THREE.SphereGeometry(.07, 10, 8), E(AMA, 1), S, -3.2 + i * .5, .08, -.6));
// ---------- mascote: gravata-borboleta brilhante; aperta a campainha ----------
const GB = new THREE.Group(); GB.position.set(0, .62, .53); MAS.corpo.add(GB); for (const s of [-1, 1]) { const a = mesh(new THREE.ConeGeometry(.16, .26, 4), M(AMA, { metalness: .7, roughness: .25 }), GB, s * .13, 0, 0); a.rotation.z = s * Math.PI / 2; } mesh(new THREE.SphereGeometry(.07, 10, 8), M(AMA, { metalness: .7, roughness: .25 }), GB, 0, 0, .02);
const MX = .75, MZ = .9;
const aperta = (lt, ritmo = 1.1) => { const u = (lt % ritmo) / ritmo, b = u < .25 ? Math.sin(u / .25 * Math.PI) : 0; pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .02), ry: -.15, braco: [.4, .5 + b * .9], sq: b * .05, piscar: pisca(lt) }); MAS.g.rotation.z = 0; botao.position.y = .85 - b * .05; botao.material.emissiveIntensity = .4 + b * 2; };
const olha = (lt, ry = 0) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .5 + Math.sin(lt * 2) * .1], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const susto = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .5, .08), ry: 0, braco: [2.4, 2.4], sq: .03, piscar: 1 }); MAS.g.rotation.z = Math.sin(lt * 20) * .03; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .24), ry: 0, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let placEst = "";
const placar = (k, est) => { if (est !== placEst) placEst = est; const v = [24000, 77147, 21600].map(x => Math.round(x * k)); const f = n => "$" + n.toLocaleString("en-US"); const s = est + v.join(); if (PLAC._s === s) return; PLAC._s = s; v.forEach((n, i) => setPlac(i, f(n), i === 1 && k >= 1 ? VERDE : AMA)); };
const reset = (lt, t) => { ondaK = 0; ondaCor = AZ; LUZ.forEach((l, i) => l.material.emissiveIntensity = .3 + Math.max(0, Math.sin(lt * 6 + i)) * 1.2); TEL.forEach(m => m.visible = true); };
// ---------- travelling lateral ----------
const BS = { gancho: [V(-1.0, 2.5, 6.6), V(-.4, 1.4, -1.2), 1.4], s1: [V(-1.6, 2.4, 6.4), V(-.4, 1.6, -1.6), 1.6], s2: [V(1.4, 2.6, 6.6), V(.4, 1.6, -1.8), -1.6], s3: [V(-1.4, 2.4, 6.4), V(-.2, 1.3, -1.4), 1.8], s4: [V(1.2, 2.3, 6.2), V(.2, 1.4, -1.4), -1.4], cta: [V(0, 2.6, 7.0), V(0, 1.4, -1.0), 0] };
const SHOTS = {}; Object.keys(BS).forEach(n => { const s = [BS[n][0], BS[n][1]]; SHOTS[n] = [s, s]; });
const camera = (cam, nome, lt, d, t) => { const [p, l, dx] = BS[nome] || BS.cta, u = eio(Math.min(1, lt / d)); cam.position.set(p.x + dx * u, p.y, p.z - u * .3); cam.lookAt(l.x + dx * u * .5, l.y, l.z); cam.rotateZ(-dx * .008); };
const ACT = {
  gancho(lt, d, t) { reset(lt); placar(0, "g"); ondaK = .4; desOnda(lt); olha(lt, -.2); },
  s1(lt, d, t) { reset(lt); placar(0, "1"); ondaK = .6; desOnda(lt); aperta(lt, 1.4); },
  s2(lt, d, t) { reset(lt); TEL.forEach((m, i) => m.visible = !(i < Math.floor(lin(lt, .3, d) * 14) && (i * 7) % 3)); placar(eio(lin(lt, 0, d)) * .5, "2"); ondaK = .5 + .5 * Math.max(0, Math.sin(lt * 5)); desOnda(lt); aperta(lt, .8); },
  s3(lt, d, t) { reset(lt); TEL.forEach(m => m.visible = false); placar(eio(lin(lt, .2, 2.4)) * .5 + .5, "3"); ondaK = 1; ondaCor = VERDE; desOnda(lt); feliz(lt); },
  s4(lt, d, t) { reset(lt); TEL.forEach(m => m.visible = false); placar(1, "4"); ondaK = .3; ondaCor = VERM; desOnda(lt); lt < 1.2 ? olha(lt, .1) : susto(lt); },
  cta(lt, d, t) { reset(lt); TEL.forEach(m => m.visible = false); placar(1, "c"); ondaK = .8; ondaCor = VERDE; desOnda(lt); pose(MAS, { x: 1.8, z: 1.2, y: hop(lt, .35, .22), ry: -.3, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx, peso = 900) => { while (f > 20) { X.font = `${peso} ${f}px FR`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const CHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const flap = (alvo, x, y, tw, lt, t0, cor = AMA) => { for (let i = 0; i < alvo.length; i++) { const c = alvo[i], k = lin(lt, t0 + i * .05, t0 + i * .05 + .5), xx = x + i * (tw + 5); X.fillStyle = "#16112a"; X.beginPath(); X.roundRect(xx, y - tw * .7, tw, tw * 1.4, 5); X.fill(); if (c === " ") continue;
    X.fillStyle = k >= 1 ? cor : "#bbb"; X.font = `900 ${Math.round(tw * 1.05)}px FR`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(k >= 1 ? c : CHS[(Math.floor(lt * 30) + i * 7) % CHS.length], xx + tw / 2, y + 3); X.fillStyle = "rgba(0,0,0,.5)"; X.fillRect(xx, y - 1, tw, 3); } };
  const caixaFlap = (txt, lt, tw, cor) => { const w = txt.length * (tw + 5) + 50; X.fillStyle = "rgba(14,10,30,.88)"; X.beginPath(); X.roundRect(505 - w / 2, 620, w, 116, 16); X.fill(); flap(txt, 505 - w / 2 + 25, 678, tw, lt, .2, cor); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(239,232,247,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") caixaFlap("WATSON", lt, 62);
      if (nome === "s2") caixaFlap("JEOPARDY", lt, 58);
      if (nome === "s3" && lt > .3) { const a = eo(lin(lt, .3, .7)); X.globalAlpha = a; X.fillStyle = "rgba(14,10,30,.9)"; X.beginPath(); X.roundRect(95, 615, 820, 128, 18); X.fill(); X.textAlign = "center"; X.textBaseline = "middle";
        X.fillStyle = VERDE; X.font = "900 64px FR"; X.fillText("US$ 77 mil", 330, 680); X.fillStyle = "#cfc6e6"; X.font = "700 44px FR"; X.fillText("× 24 mil × 21 mil", 700, 682); X.globalAlpha = 1; }
      if (nome === "s4" && lt > .9) caixaFlap("TORONTO???", lt - .7, 54, VERM); },
    etiqueta(t, nome) { // tela de terminal (estática: 1º quadro legível)
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410);
      X.fillStyle = "#0e0a1e"; X.beginPath(); X.roundRect(-460, -140, 920, 280, 18); X.fill(); X.fillStyle = "#2a2140"; X.beginPath(); X.roundRect(-460, -140, 920, 42, [18, 18, 0, 0]); X.fill();
      [VERM, AMA, VERDE].forEach((c, i) => { X.fillStyle = c; X.beginPath(); X.arc(-428 + i * 30, -119, 9, 0, 7); X.fill(); });
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = VERDE; X.font = "900 54px FR"; X.fillText(">", -430, -30); X.fillStyle = "#fff"; cabe(60, l1, 800); X.fillText(l1, -385, -30);
      X.fillStyle = AMA; cabe(48, l2, 840, 700); X.fillText(l2, -430, 38); X.fillStyle = "#cdb8ff"; cabe(44, l3, 800, 700); X.fillText(l3, -430, 100); if (Math.floor(t * 2) % 2 === 0) { const w = X.measureText(l3).width; X.fillStyle = "#cdb8ff"; X.fillRect(-420 + w, 66, 22, 40); } X.restore(); },
    cabecalho() {},
    legenda(seg, t) { // karaokê: o marca-texto amarelo desliza por baixo das palavras
      const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 76; X.font = `900 ${fs}px FR`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 840 && fs > 44) { fs -= 2; X.font = `900 ${fs}px FR`; }
      const y = 1400; let x = 505 - tot() / 2; const xs = c.map(w => { const r = [x, X.measureText(w.w).width]; x += X.measureText(w.w + " ").width; return r; });
      let fim = xs[0][0] - 10; c.forEach((w, i) => { const k = lin(t, w.t0, w.t1); if (k > 0) fim = xs[i][0] + xs[i][1] * k + 10; });
      X.fillStyle = "rgba(14,10,30,.78)"; X.beginPath(); X.roundRect(xs[0][0] - 24, y - fs * .62, tot() + 30, fs * 1.2, 14); X.fill();
      const hl = () => { X.beginPath(); X.roundRect(xs[0][0] - 12, y - fs * .45, Math.max(0, fim - xs[0][0] + 12), fs * .84, 8); };
      X.fillStyle = AMA; hl(); X.fill(); X.textAlign = "left"; X.textBaseline = "middle";
      X.fillStyle = "#fff"; c.forEach((w, i) => X.fillText(w.w, xs[i][0], y + 4)); X.save(); hl(); X.clip(); X.fillStyle = ROX2; c.forEach((w, i) => X.fillText(w.w, xs[i][0], y + 4)); X.restore(); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .22) return; X.fillStyle = `rgba(255,255,255,${1 - lt / .22})`; X.fillRect(0, 0, 1080, 1920); },
    fechamento(lt) { // pódio do placar final + COMENTA
      const P = [["WATSON", "US$ 77 mil", 410, 220, AZ, 1], ["CAMPEÃO 1", "US$ 24 mil", 190, 150, "#5b2d86", 2], ["CAMPEÃO 2", "US$ 21 mil", 630, 125, "#7a4aa8", 3]];
      X.fillStyle = "rgba(239,232,247,.45)"; X.fillRect(0, 640, 1080, 860);
      P.forEach(([nm, v, x, h, c, n], i) => { const k = eo(lin(lt, .1 + i * .15, .5 + i * .15)), hh = h * k, base = 1290; X.fillStyle = c; X.fillRect(x - 100, base - hh, 200, hh); X.fillStyle = "rgba(0,0,0,.2)"; X.fillRect(x - 100, base - hh, 200, 14);
        if (k > .6) { X.fillStyle = "#fff"; X.font = "900 76px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(n + "º", x, base - hh + 64); X.fillStyle = ROX2; X.font = `900 ${cabe(40, nm, 200)}px FR`; X.fillText(nm, x, base - hh - 70); X.fillStyle = "#5b2d86"; X.font = `700 ${cabe(34, v, 200, 700)}px FR`; X.fillText(v, x, base - hh - 28); } });
      X.fillStyle = ROX2; X.fillRect(70, 1290, 690, 14);
      const p = back(lin(lt, .7, 1.1)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 760); X.scale(p, p); X.fillStyle = AZ; X.beginPath(); X.roundRect(-330, -64, 660, 128, 64); X.fill(); X.fillStyle = AMA; X.font = `900 ${cabe(72, "Comenta " + CHAVE, 600)}px FR`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 4); X.restore();
      if (lt > 1.1) { X.globalAlpha = eo(lin(lt, 1.1, 1.5)); X.fillStyle = ROX2; X.font = "700 46px FR"; X.textAlign = "center"; X.fillText("Salva pra contar pra alguém", 505, 1360); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: AZ, VERDE: AMA, FUNDO, CREME: BR, TINTA: ROX2, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

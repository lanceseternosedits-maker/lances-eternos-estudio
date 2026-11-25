// Reel 📜 história "Demitiram o chefe do ChatGPT" (OpenAI, 17–22/11/2023; 15/11 20:30). Motor da cena_contagem.
// Identidade: lobby de empresa de vidro à noite: porta giratória no meio, balcão da recepção, mesa de reunião do "conselho" com cadeiras
// vazias, e um mural onde uma carta vai se enchendo de assinaturas. O mascote (de terno) sai pela porta giratória com uma caixa de papelão
// e, no fim, volta pela mesma porta. Grafite + vidro azulado + vermelho-alerta. Sem logo nem rosto de pessoa real.
// Elementos: página de caderno, nome em split-flap, sem contador (história), karaokê com marca-texto, íris circular, câmera na mão,
// post-its na parede, Bebas Neue. Mascote de terno e gravata frouxa; ação principal: sair e voltar pela porta giratória.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const GRAF = "#2b2f3a", GRAF2 = "#1b1e26", VIDRO = "#bfe0ff", VERM = "#e5484d", AMAR = "#ffd23f", TINTA = "#1a1c22", FUNDO = "#eef0f4", CREME = "#fffaf0", VERDE = "#2fb36b", AZ = "#3a7bd5";
rim.color.set(0xbfd8ff); rim.intensity = 1.5; key.color.set(0xffffff); key.intensity = 140; key.position.set(2, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xdfe8ff, .6));
// ---------- lobby ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#3a4152"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(191,224,255,.25)"; for (let x = 0; x < w; x += 64) g.fillRect(x + 4, 10, 56, 170); g.fillStyle = "rgba(255,240,180,.7)"; for (let i = 0; i < 40; i++) g.fillRect((i * 53) % w + 8, 20 + (i * 37) % 150, 5, 7); g.fillStyle = "#2b2f3a"; g.fillRect(0, 190, w, 66); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const cT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { g.fillStyle = (x + y) % 2 ? "#cfd3db" : "#bfc4ce"; g.fillRect(x * 64, y * 64, 64, 64); } }); cT.wrapS = cT.wrapT = THREE.RepeatWrapping; cT.repeat.set(6, 3);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: cT, roughness: .2, metalness: .1 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// porta giratória
const PG = new THREE.Group(); PG.position.set(-.2, 0, -1.8); S.add(PG); mesh(new THREE.CylinderGeometry(1.0, 1.0, .1, 32), M("#888", { metalness: .8 }), PG, 0, 2.3, 0); mesh(new THREE.CylinderGeometry(1.0, 1.0, .05, 32), M("#888", { metalness: .8 }), PG, 0, .02, 0);
const ASAS = new THREE.Group(); PG.add(ASAS); for (let i = 0; i < 4; i++) { const a = new THREE.Group(); a.rotation.y = i * Math.PI / 2; ASAS.add(a); mesh(new THREE.BoxGeometry(.95, 2.2, .03), new THREE.MeshStandardMaterial({ color: VIDRO, transparent: true, opacity: .35, roughness: .05 }), a, .48, 1.15, 0).castShadow = false; box(.04, 2.2, .04, M("#999", { metalness: .8 }), a, .96, 1.15, 0); }
box(.04, 2.3, .04, M("#999", { metalness: .8 }), PG, 0, 1.15, 0);
const letT = ctex(512, 96, g => { g.fillStyle = GRAF2; g.fillRect(0, 0, 512, 96); g.fillStyle = "#fff"; g.font = "400 64px BB"; g.textAlign = "center"; g.fillText("SALA DO CONSELHO →", 256, 68); });
mesh(new THREE.PlaneGeometry(2.0, .38), new THREE.MeshBasicMaterial({ map: letT }), S, 2.1, 2.7, -2.7).castShadow = false;
// mesa do conselho (cadeiras vazias)
box(1.8, .06, .8, M("#5a3a20", { roughness: .4 }), S, 2.2, .8, -2.0); for (let i = 0; i < 4; i++) { const g = new THREE.Group(); g.position.set(1.6 + (i % 2) * 1.2, 0, -2.0 + (i < 2 ? -.6 : .6)); S.add(g); box(.45, .06, .45, M("#222"), g, 0, .48, 0); box(.45, .55, .06, M("#222"), g, 0, .75, (i < 2 ? -.22 : .22)); box(.04, .45, .04, M("#555"), g, 0, .24, 0); }
// mural com a carta e as assinaturas
const crC = document.createElement("canvas"); crC.width = 320; crC.height = 400; const cg = crC.getContext("2d"); const crT = new THREE.CanvasTexture(crC); crT.colorSpace = THREE.SRGBColorSpace;
const desCarta = k => { cg.fillStyle = "#fffdf6"; cg.fillRect(0, 0, 320, 400); cg.fillStyle = TINTA; cg.font = "400 30px BB"; cg.textAlign = "center"; cg.fillText("CARTA AO CONSELHO", 160, 40); cg.fillStyle = "#999"; for (let i = 0; i < 4; i++) cg.fillRect(30, 60 + i * 14, 260, 5);
  const n = Math.floor(k * 90); cg.strokeStyle = AZ; cg.lineWidth = 2; for (let i = 0; i < n; i++) { const x = 20 + (i % 6) * 48, y = 140 + Math.floor(i / 6) * 17; cg.beginPath(); cg.moveTo(x, y); for (let j = 1; j < 6; j++) cg.lineTo(x + j * 7, y + Math.sin(i * 3 + j * 2) * 5); cg.stroke(); } crT.needsUpdate = true; };
const CARTA = mesh(new THREE.PlaneGeometry(1.1, 1.38), new THREE.MeshStandardMaterial({ map: crT }), S, -2.3, 1.9, -2.7); CARTA.castShadow = false; desCarta(0);
// caixa de papelão que o mascote carrega
const CX = new THREE.Group(); S.add(CX); box(.55, .35, .4, M("#c89b63", { roughness: .9 }), CX, 0, 0, 0); box(.1, .25, .08, M(AMAR), CX, -.12, .2, 0); box(.14, .18, .02, M("#333"), CX, .1, .18, .05);
// ---------- mascote: terno + gravata frouxa ----------
const TER = box(1.54, .6, 1.04, M(GRAF, { roughness: .6 }), MAS.corpo, 0, .64, 0); const GRAV = box(.14, .36, .03, M(VERM), MAS.corpo, .08, .62, .54); GRAV.rotation.z = .25; box(.3, .1, .03, M("#fff"), MAS.corpo, 0, .9, .53);
const MX = .3, MZ = .7;
const anda = (lt, a, b, d) => { const k = eio(Math.max(0, Math.min(1, lt / d))); return V(a.x + (b.x - a.x) * k, 0, a.z + (b.z - a.z) * k); };
const comCaixa = (lt, p, ry) => { pose(MAS, { x: p.x, z: p.z, y: hop(lt, .4, .04), ry, braco: [.6, .6], andar: lt * 3, piscar: pisca(lt) }); MAS.g.rotation.z = 0; CX.visible = true; CX.position.set(p.x + Math.sin(ry) * .6, .7, p.z + Math.cos(ry) * .6); CX.rotation.y = ry; };
const olha = (lt, ry = -.3, x = MX, z = MZ) => { CX.visible = false; pose(MAS, { x, z, y: hop(lt, .8, .03), ry, braco: [.3, .6], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = (lt, x = MX, z = MZ) => { CX.visible = false; pose(MAS, { x, z, y: hop(lt, .35, .22), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = (lt) => { ASAS.rotation.y = lt * .5; CX.visible = false; MAS.g.visible = true; };
// ---------- câmera na mão ----------
const BS = { gancho: [V(.2, 2.5, 7.2), V(-.1, 1.4, -1.2)], s1: [V(1.0, 2.3, 6.4), V(1.6, 1.4, -1.6)], s2: [V(-.8, 2.4, 6.6), V(-1.4, 1.7, -1.8)], s3: [V(-.6, 2.4, 6.4), V(-1.6, 1.8, -2.0)], s4: [V(0, 2.4, 6.8), V(-.1, 1.4, -1.0)], cta: [V(0, 2.4, 7.4), V(0, 1.4, -1.0)] };
const SHOTS = {}; Object.keys(BS).forEach(n => { const s = [BS[n][0], BS[n][1]]; SHOTS[n] = [s, s]; });
const camera = (cam, nome, lt, d, t) => { const [p, l] = BS[nome] || BS.cta, u = lt / d; const nx = Math.sin(t * 1.3) * .05 + Math.sin(t * 3.7) * .02, ny = Math.sin(t * 1.7 + 1) * .04 + Math.sin(t * 4.3) * .015;
  cam.position.set(p.x + nx, p.y + ny, p.z - u * .35); cam.lookAt(l.x + nx * .4, l.y + ny * .4, l.z); cam.rotateZ(Math.sin(t * 1.1) * .012); };
const ACT = {
  gancho(lt, d) { reset(lt); desCarta(0); ASAS.rotation.y = lt * 1.6; if (lt < d * .55) { const p = anda(lt, V(.9, 0, .6), V(-.2, 0, -1.1), d * .5); comCaixa(lt, p, Math.PI * .85); MAS.g.visible = lt < d * .5; } else { MAS.g.visible = lt > d * .8; if (MAS.g.visible) { const p = anda(lt - d * .8, V(-.2, 0, -1.1), V(.6, 0, .6), d * .2); comCaixa(lt, p, .2); } } },
  s1(lt, d) { reset(lt); desCarta(0); olha(lt, .5, 1.0, .5); },
  s2(lt, d) { reset(lt); desCarta(lin(lt, .2, d)); olha(lt, -.5, -.6, .4); },
  s3(lt, d) { reset(lt); desCarta(1); olha(lt, -.6, -.6, .4); },
  s4(lt, d) { reset(lt); desCarta(1); ASAS.rotation.y = lt * 1.6; const p = anda(lt, V(-.2, 0, -1.1), V(.4, 0, .7), d * .5); if (lt < d * .5) comCaixa(lt, p, .1); else feliz(lt, .4, .7); },
  cta(lt, d) { reset(lt); desCarta(1); feliz(lt, 1.4, 1.1); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px BB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const CHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const flap = (alvo, x, y, tw, lt, t0, cor = AMAR) => { for (let i = 0; i < alvo.length; i++) { const c = alvo[i], k = lin(lt, t0 + i * .05, t0 + i * .05 + .5), xx = x + i * (tw + 5); X.fillStyle = "#16181e"; X.beginPath(); X.roundRect(xx, y - tw * .7, tw, tw * 1.4, 5); X.fill(); if (c === " ") continue;
    X.fillStyle = k >= 1 ? cor : "#bbb"; X.font = `400 ${Math.round(tw * 1.15)}px BB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(k >= 1 ? c : CHS[(Math.floor(lt * 30) + i * 7) % CHS.length], xx + tw / 2, y + 3); X.fillStyle = "rgba(0,0,0,.5)"; X.fillRect(xx, y - 1, tw, 3); } };
  const caixaFlap = (txt, lt, tw, cor, t0 = .2) => { const w = txt.length * (tw + 5) + 50; X.fillStyle = "rgba(14,14,20,.88)"; X.beginPath(); X.roundRect(505 - w / 2, 620, w, 116, 16); X.fill(); flap(txt, 505 - w / 2 + 25, 678, tw, lt, t0, cor); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(238,240,244,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "gancho" && lt > 2.0) caixaFlap("17 NOV 2023", lt, 50, VERM, 2.0);
      if (nome === "s1") caixaFlap("NAO FOI SINCERO", lt, 44, AMAR, .4);
      if (nome === "s3") caixaFlap("ATE O CONSELHO", lt, 46, AMAR, .4);
      if (nome === "s4") caixaFlap("22 NOV: VOLTOU", lt, 46, VERDE, .4); },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(-.012); X.shadowColor = "rgba(20,20,30,.22)"; X.shadowBlur = 18; X.shadowOffsetY = 6; X.fillStyle = CREME; X.fillRect(-445, -122, 890, 244); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(58,123,213,.3)"; X.lineWidth = 2; for (let y = -70; y < 122; y += 54) { X.beginPath(); X.moveTo(-445, y); X.lineTo(445, y); X.stroke(); } X.strokeStyle = "rgba(229,72,77,.45)"; X.beginPath(); X.moveTo(-375, -122); X.lineTo(-375, 122); X.stroke();
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(80, l1, 790); X.fillText(l1, -350, -28); X.fillStyle = AZ; cabe(62, l2, 790); X.fillText(l2, -350, 36); X.fillStyle = VERM; cabe(62, l3, 790); X.fillText(l3, -350, 98); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 84; X.font = `400 ${fs}px BB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 840 && fs > 46) { fs -= 2; X.font = `400 ${fs}px BB`; }
      const y = 1400; let x = 505 - tot() / 2; const xs = c.map(w => { const r = [x, X.measureText(w.w).width]; x += X.measureText(w.w + " ").width; return r; });
      let fim = xs[0][0] - 10; c.forEach((w, i) => { const k = lin(t, w.t0, w.t1); if (k > 0) fim = xs[i][0] + xs[i][1] * k + 10; });
      X.fillStyle = "rgba(255,210,63,.9)"; X.beginPath(); X.roundRect(xs[0][0] - 14, y - fs * .45, Math.max(0, fim - xs[0][0] + 14), fs * .84, 8); X.fill();
      X.textAlign = "left"; X.textBaseline = "middle"; c.forEach((w, i) => { X.fillStyle = TINTA; X.lineWidth = 10; X.strokeStyle = "#fff"; X.lineJoin = "round"; X.strokeText(w.w, xs[i][0], y + 4); X.fillText(w.w, xs[i][0], y + 4); }); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .4) return; const r = eio(lt / .4) * 1300;
      X.save(); X.fillStyle = GRAF2; X.beginPath(); X.rect(0, 0, 1080, 1920); X.moveTo(505 + Math.max(1, r), 1000); X.arc(505, 1000, Math.max(1, r), 0, Math.PI * 2, true); X.closePath(); X.fill();
      X.strokeStyle = VERM; X.lineWidth = 14; X.beginPath(); X.arc(505, 1000, Math.max(1, r), 0, Math.PI * 2); X.stroke(); X.restore(); },
    fechamento(lt) { [["17/11", "demitido", "#ffe27a", -.06], ["CARTA", "centenas assinaram", "#cfe0ff", .05], ["22/11", "de volta", "#c4f0cf", -.03]].forEach(([a, b, c, r], i) => { const k = back(lin(lt, .1 + i * .2, .45 + i * .2)); if (k <= 0) return; const x = 215 + i * 290, y = 830 + (i % 2) * 30;
        X.save(); X.translate(x, y); X.rotate(r); X.scale(k, k); X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 14; X.fillStyle = c; X.fillRect(-125, -115, 250, 230); X.shadowBlur = 0; X.fillStyle = "rgba(255,255,255,.55)"; X.fillRect(-50, -130, 100, 32);
        X.fillStyle = TINTA; X.textAlign = "center"; X.textBaseline = "middle"; X.font = `400 ${cabe(84, a, 220)}px BB`; X.fillText(a, 0, -16); X.fillStyle = "#4a4f5c"; X.font = `400 ${cabe(36, b, 220)}px BB`; X.fillText(b, 0, 52); X.restore(); });
      const p = back(lin(lt, .8, 1.2)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(420, 1070); X.scale(p, p); X.fillStyle = VERM; X.beginPath(); X.roundRect(-300, -62, 600, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = `400 ${cabe(88, "COMENTA " + CHAVE, 560)}px BB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 6); X.restore();
      if (lt > 1.2) { X.globalAlpha = eo(lin(lt, 1.2, 1.6)); X.fillStyle = TINTA; X.font = "400 50px BB"; X.textAlign = "center"; X.fillText("SALVA PRA CONTAR PRA ALGUÉM", 420, 1185); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: VERM, VERDE: AZ, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

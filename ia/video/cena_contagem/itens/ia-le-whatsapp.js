// Reel 🆕 novidade "A IA acha aquela mensagem no seu WhatsApp" (finereli/whatsapp-mcp, MIT, só leitura; 12/11 06:00). Motor da cena_contagem.
// Identidade: agência de correio antiga: escaninhos de madeira cheios de envelopes verdes, carimbos, balcão e uma lupa enorme;
// verde-garrafa + creme + marrom. Sem logo do WhatsApp. Elementos (etiqueta trocada: faixa de aviso repetiria o Carro por 1 dólar, que
// sai antes): papel rasgado com fita, nome em split-flap, velocímetro de estrelas, tarja de TV, zoom atravessando uma tela, órbita,
// CONTINUE?, Fraunces. Mascote de quepe de carteiro e lupa na mão (ao lado); ação principal: procurar o envelope certo.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const VG = "#1f7a4d", VG2 = "#0f4d30", CR = "#fbf3df", MAR = "#7a4f2a", TINTA = "#1b140c", FUNDO = "#efe5cc", OURO = "#d9a93b", VERM = "#c0392b";
const ESTR = 411;
rim.color.set(0xffe6b0); rim.intensity = 1.3; key.color.set(0xfff0d6); key.intensity = 145; key.position.set(1, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xfff0dc, .55));
// ---------- correio ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#e3d4ae"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(122,79,42,.1)"; for (let x = 0; x < w; x += 40) g.fillRect(x, 0, 3, h); g.fillStyle = VG2; g.fillRect(0, 175, w, h); g.fillStyle = MAR; g.fillRect(0, 170, w, 7); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const tT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? "#cfbf98" : "#b9a77e"; g.fillRect(x * 32, y * 32, 32, 32); } }); tT.wrapS = tT.wrapT = THREE.RepeatWrapping; tT.repeat.set(6, 5);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: tT, roughness: .6 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// escaninhos 6×5 com envelopes verdes
const ESC = new THREE.Group(); ESC.position.set(.6, 0, -1.8); S.add(ESC); box(3.8, 3.0, .6, M(MAR, { roughness: .7 }), ESC, 0, 1.5, 0);
const envT = (k) => ctex(96, 64, g => { g.fillStyle = k ? "#ffe9a0" : "#9fd8b3"; g.fillRect(0, 0, 96, 64); g.strokeStyle = "rgba(0,0,0,.25)"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(48, 34); g.lineTo(96, 0); g.stroke(); g.fillStyle = VG2; g.fillRect(70, 6, 18, 14); });
const envM = new THREE.MeshStandardMaterial({ map: envT(0) }), envAchado = new THREE.MeshStandardMaterial({ map: envT(1), emissive: "#ffd23f", emissiveIntensity: 0 });
const NICHO = []; for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) { const x = -1.55 + c * .62, y = .45 + r * .55; box(.56, .48, .05, M("#5a3a1e"), ESC, x, y, .29); const e = mesh(new THREE.BoxGeometry(.4, .26, .02), [M("#9fd8b3"), M("#9fd8b3"), M("#9fd8b3"), M("#9fd8b3"), envM, M("#9fd8b3")], ESC, x, y - .02, .33); e.rotation.x = -.2; NICHO.push(e); }
const ALVO = NICHO[22]; ALVO.material = [M("#ffe9a0"), M("#ffe9a0"), M("#ffe9a0"), M("#ffe9a0"), envAchado, M("#ffe9a0")];
// balcão + carimbo
box(2.0, .9, .7, M("#8a5a33"), S, -1.8, .45, .1); box(2.1, .06, .8, M("#a8743e"), S, -1.8, .93, .1); const CARIMBO = new THREE.Group(); CARIMBO.position.set(-1.4, .96, .1); S.add(CARIMBO); box(.2, .08, .2, M(VERM), CARIMBO, 0, .04, 0); mesh(new THREE.CylinderGeometry(.04, .04, .22, 10), M("#6b4426"), CARIMBO, 0, .19, 0);
// envelope gigante achado + cartão com a resposta
const RESP = ctex(320, 160, g => { g.fillStyle = "#fff"; g.beginPath(); g.roundRect(4, 4, 312, 152, 20); g.fill(); g.fillStyle = VG; g.font = "700 26px FR"; g.fillText("Ana · 14 de out", 20, 40); g.fillStyle = TINTA; g.font = "700 30px FR"; g.fillText("Rua das Flores, 120", 20, 92); g.fillStyle = "#888"; g.font = "700 22px FR"; g.fillText("achado em 2 s", 20, 132); });
const CART = mesh(new THREE.PlaneGeometry(1.6, .8), new THREE.MeshBasicMaterial({ map: RESP, transparent: true }), S, .7, 2.2, .3); CART.castShadow = false;
// "nuvem/servidor" pequeno (s4): caixa com luz e um cadeado de "sua cópia"
const SRV = new THREE.Group(); SRV.position.set(2.4, 0, -.2); S.add(SRV); box(.7, 1.3, .6, M("#2b3a33", { metalness: .3 }), SRV, 0, .65, 0); const ledS = [0, 1, 2].map(i => box(.4, .05, .02, E("#7cf2a8", 1), SRV, 0, .5 + i * .3, .31));
// ---------- mascote: quepe de carteiro (no topo) + lupa na mão direita (ao lado) ----------
const QP = new THREE.Group(); QP.position.set(0, 1.5, 0); MAS.corpo.add(QP); mesh(new THREE.CylinderGeometry(.58, .62, .26, 28), M(VG2), QP, 0, .13, 0); mesh(new THREE.CylinderGeometry(.6, .6, .04, 28, 1, false, -.9, 1.8), M("#111"), QP, 0, .02, .18); box(.3, .06, .02, M(OURO), QP, 0, .18, .6);
const LUPA = new THREE.Group(); LUPA.position.set(.46, .1, .18); MAS.bracos[1].add(LUPA); mesh(new THREE.TorusGeometry(.18, .03, 8, 24), M(OURO, { metalness: .7 }), LUPA, 0, .25, 0); mesh(new THREE.CircleGeometry(.17, 20), new THREE.MeshStandardMaterial({ color: "#cfefff", transparent: true, opacity: .35 }), LUPA, 0, .25, 0); box(.05, .25, .05, M("#5a3a1e"), LUPA, 0, 0, 0);
const MX = -1.0, MZ = .3;
const procura = lt => { const k = Math.sin(lt * 1.8); pose(MAS, { x: MX + k * .4, z: MZ, y: hop(lt, .6, .03), ry: -.4 + k * .2, braco: [.3, 1.3 + Math.sin(lt * 3) * .2], andar: lt * 1.2, piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const olha = (lt, ry = .3) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .6], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .24), ry: .2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let VEL = 0;
const reset = () => { CART.visible = false; SRV.visible = false; ALVO.position.z = .33; envAchado.emissiveIntensity = 0; CARIMBO.position.y = .96; };
// ---------- órbita ----------
const ORB = { gancho: [-.3, .1, 7.5, 2.1, V(0, 1.5, -1.2)], s1: [.3, -.05, 7.3, 2.1, V(.3, 1.6, -1.4)], s2: [-.2, .2, 7.1, 2.0, V(-.8, 1.3, -.4)], s3: [.25, -.15, 7.3, 2.2, V(.6, 1.9, -1.0)], s4: [-.25, .1, 7.3, 2.0, V(1.2, 1.2, -.6)], cta: [.1, -.1, 7.9, 2.2, V(0, 1.5, -1.0)] };
const SHOTS = {}; Object.keys(ORB).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a0, a1, r, y, l] = ORB[nome] || ORB.cta, a = a0 + (a1 - a0) * eio(lt / d); cam.position.set(l.x + Math.sin(a) * r, y, l.z + Math.cos(a) * r); cam.lookAt(l); };
const ACT = {
  gancho(lt) { reset(); procura(lt); },
  s1(lt, d) { reset(); const k = lin(lt, .8, 1.6); ALVO.position.z = .33 + eo(k) * .4; envAchado.emissiveIntensity = k * 1.2; procura(lt); },
  s2(lt) { reset(); CARIMBO.position.y = .96 + Math.abs(Math.sin(lt * 4)) * .25; olha(lt, .6); },
  s3(lt, d) { reset(); ALVO.position.z = .73; envAchado.emissiveIntensity = 1.2; const k = lin(lt, 1.2, 1.6); CART.visible = k > 0; CART.scale.setScalar(Math.max(.01, back(k))); VEL = ESTR * eio(lin(lt, .3, 1.8)); feliz(lt); },
  s4(lt) { reset(); SRV.visible = true; ledS.forEach((l, i) => l.material.emissiveIntensity = .6 + Math.max(0, Math.sin(lt * 6 - i)) * 1.5); olha(lt, -.2); },
  cta(lt) { reset(); CART.visible = true; feliz(lt); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `700 ${f}px FR`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const rasgado = (x, y, w, h, s) => { X.beginPath(); X.moveTo(x, y); for (let i = 0; i <= 40; i++) X.lineTo(x + w * i / 40, y + ((i * 7 + s) % 5) * 2.4 - 4); for (let i = 0; i <= 40; i++) X.lineTo(x + w - w * i / 40, y + h + ((i * 11 + s) % 6) * 2.6 - 6); X.closePath(); };
  const CHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const flap = (alvo, x, y, tw, lt) => { for (let i = 0; i < alvo.length; i++) { const c = alvo[i], k = lin(lt, .2 + i * .05, .7 + i * .05), xx = x + i * (tw + 4); X.fillStyle = "#151515"; X.beginPath(); X.roundRect(xx, y - tw * .7, tw, tw * 1.4, 5); X.fill(); if (c === " ") continue;
    X.fillStyle = k >= 1 ? "#ffe9a0" : "#ccc"; X.font = `700 ${Math.round(tw * 1.05)}px SG`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(k >= 1 ? c : CHS[(Math.floor(lt * 30) + i * 7) % 26], xx + tw / 2, y + 3); X.fillStyle = "rgba(0,0,0,.5)"; X.fillRect(xx, y - 1, tw, 3); } };
  const velo = (v, x, y) => { const r = 86; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,250,240,.94)"; X.beginPath(); X.roundRect(-r - 24, -r - 18, 2 * r + 48, r + 108, 18); X.fill();
    X.lineWidth = 16; X.strokeStyle = "#d8ccb0"; X.beginPath(); X.arc(0, 0, r, Math.PI, 2 * Math.PI); X.stroke(); X.strokeStyle = VG; X.beginPath(); X.arc(0, 0, r, Math.PI, Math.PI + Math.PI * Math.min(1, v / 500)); X.stroke();
    const a = Math.PI + Math.PI * Math.min(1, v / 500); X.strokeStyle = TINTA; X.lineWidth = 6; X.lineCap = "round"; X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(a) * (r - 16), Math.sin(a) * (r - 16)); X.stroke();
    X.fillStyle = TINTA; X.font = "700 40px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(Math.round(v) + " ★", 0, 32); X.font = "700 18px FR"; X.fillStyle = VG; X.fillText("ESTRELAS NO GITHUB", 0, 68); X.restore(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(239,229,204,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") { X.fillStyle = "rgba(20,20,20,.85)"; X.beginPath(); X.roundRect(110, 612, 790, 110, 14); X.fill(); flap("WHATSAPP-MCP", 140, 667, 56, lt); }
      if (nome === "s2") { X.fillStyle = "#fff"; X.beginPath(); X.roundRect(60, 612, 520, 90, 16); X.fill(); X.fillStyle = VG; X.font = "700 52px FR"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("✓ só lê   ✗ não apaga", 84, 658); }
      if (nome === "s3") velo(VEL, 830, 820);
      if (nome === "s4") { X.fillStyle = "#fff"; X.beginPath(); X.roundRect(60, 612, 640, 90, 16); X.fill(); X.fillStyle = TINTA; X.font = "700 44px FR"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("ou rode a sua própria cópia", 84, 658); } },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(-.012); X.shadowColor = "rgba(30,20,10,.25)"; X.shadowBlur = 16; X.shadowOffsetY = 6; X.fillStyle = "#fffdf6"; rasgado(-450, -122, 900, 244, 4); X.fill(); X.shadowColor = "transparent";
      X.fillStyle = "rgba(217,169,59,.75)"; for (const [x, r] of [[-405, -.5], [405, .5]]) { X.save(); X.translate(x, -114); X.rotate(r); X.fillRect(-70, -18, 140, 36); X.restore(); }
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(54, l1, 840); X.fillText(l1, 0, -30); X.fillStyle = VG; cabe(52, l2, 840); X.fillText(l2, 0, 32); X.fillStyle = VERM; cabe(40, l3, 840); X.fillText(l3, 0, 88); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = C.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 56; X.font = `700 ${fs}px FR`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 620 && fs > 28) { fs -= 2; X.font = `700 ${fs}px FR`; }
      const y = 1405; X.fillStyle = VG2; X.fillRect(40, y - 56, 910, 112); X.fillStyle = OURO; X.fillRect(40, y + 48, 910, 8); X.fillStyle = "#fff"; X.fillRect(60, y - 88, 170, 38); X.fillStyle = VG2; X.font = "700 22px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("CORREIO AO VIVO", 145, y - 68);
      let x = 505 - tot() / 2; X.font = `700 ${fs}px FR`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? "#ffe9a0" : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 200 + u * 2300, h = w * 1.85;
      X.save(); X.fillStyle = "#0d1a12"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 40 * (1 - u) + 6); X.fill("evenodd"); X.strokeStyle = VG; X.lineWidth = 12; X.beginPath(); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 40 * (1 - u) + 6); X.stroke(); X.restore(); },
    fechamento(lt) { X.fillStyle = "rgba(15,40,25,.9)"; X.fillRect(60, 620, 890, 840); X.strokeStyle = OURO; X.lineWidth = 6; X.strokeRect(70, 630, 870, 820);
      const p = back(lin(lt, 0, .4)); X.save(); X.translate(505, 760); X.scale(p, p); X.fillStyle = "#ffe9a0"; X.font = "700 100px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("CONTINUE?", 0, 0); X.restore();
      const n = Math.max(0, 9 - Math.floor(lt * 2)); X.fillStyle = "#7cf2a8"; X.font = "700 160px FR"; X.textAlign = "center"; X.fillText(String(n), 505, 960);
      if (lt > .8) { X.globalAlpha = eo(lin(lt, .8, 1.2)); X.fillStyle = CR; X.font = "700 46px FR"; X.fillText("Que mensagem você nunca acha?", 505, 1110); X.globalAlpha = 1; }
      const pul = 1 + Math.sin(lt * 7) * .03; X.save(); X.translate(505, 1300); X.scale(pul, pul); X.fillStyle = VG; X.beginPath(); X.roundRect(-280, -62, 560, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = "700 70px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore(); },
  }; };
const cores = { LAR: VG, VERDE: OURO, FUNDO, CREME: CR, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

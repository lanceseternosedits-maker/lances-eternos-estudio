// Reel 🆕 novidade "A IA chinesa que controla seu PC pelo celular" (ccch1mneyyy/dsh-Go, AGPL-3.0; 11/11 14:00). Motor da cena_contagem.
// Identidade: mercado noturno genérico (sem marcas nem texto legível): lanternas de papel vermelhas, barracas com vapor, letreiros de
// luz; um celular gigante flutua e puxa fios de luz até um PC numa barraca; no fim, cadeado + placa "PC DE TESTE" (segurança, sem medo).
// Vermelho-lanterna + dourado + verde-jade. Elementos: papel rasgado com fita, nome com letras caindo, placar HI-SCORE (estrelas),
// tarja de TV, zoom atravessando uma tela, órbita, página de caderno, Archivo Black. Mascote de capa de chuva transparente (capuz no topo);
// ação principal: pilotar o PC com um controle remoto.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const VERM = "#e0312b", VERM2 = "#9e1b17", OURO = "#f2c14e", JADE = "#2fb38a", TINTA = "#1b0f0e", FUNDO = "#20100f", PAP = "#fbf2e2";
rim.color.set(0xff8a5a); rim.intensity = 2; key.color.set(0xffe2c4); key.intensity = 100; key.position.set(1, 8, 6); key.target.position.set(0, .9, -.3);
S.add(new THREE.AmbientLight(0x6a3a2a, .8));
// ---------- mercado noturno ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#2a1412"; g.fillRect(0, 0, w, h); for (let i = 0; i < 9; i++) { g.fillStyle = ["#5a1e18", "#3d2a12", "#1e3a30"][i % 3]; g.fillRect(i * 58, 90 + (i % 3) * 20, 50, h); g.fillStyle = "rgba(255,200,120,.35)"; for (let k = 0; k < 6; k++) g.fillRect(i * 58 + 8 + (k % 2) * 20, 110 + (i % 3) * 20 + Math.floor(k / 2) * 30, 12, 14); } });
mesh(new THREE.PlaneGeometry(24, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -5).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(24, 12), M("#3a2420", { roughness: .4, metalness: .2 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// lanternas
const lantM = E(VERM, 1.4); const LANT = []; for (let i = 0; i < 9; i++) { const g = new THREE.Group(); g.position.set(-3.6 + i * .9, 3.1 + Math.sin(i) * .15, -1.8 + (i % 2) * .5); S.add(g);
  const b = mesh(new THREE.SphereGeometry(.24, 16, 12), lantM, g, 0, 0, 0); b.scale.y = 1.25; b.castShadow = false; box(.12, .05, .12, M(OURO), g, 0, .3, 0); box(.12, .05, .12, M(OURO), g, 0, -.3, 0); LANT.push(g); }
const fio = mesh(new THREE.CylinderGeometry(.01, .01, 8.5, 4), M("#222"), S, 0, 3.4, -1.55); fio.rotation.z = Math.PI / 2;
// barracas com vapor
const barraca = (x, cor) => { const g = new THREE.Group(); g.position.set(x, 0, -1.2); S.add(g); box(1.6, .9, .8, M("#5a3a24"), g, 0, .45, 0); const t = box(1.8, .08, 1.0, M(cor), g, 0, 2.0, 0); t.rotation.x = .15; for (const xx of [-.8, .8]) box(.06, 2.0, .06, M("#2a1a10"), g, xx, 1.0, .35); return g; };
const B1 = barraca(-2.6, VERM), B2 = barraca(2.6, JADE);
const VAP = Array.from({ length: 10 }, (_, i) => { const m = mesh(new THREE.SphereGeometry(.12, 8, 6), new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: .25 }), S); m.castShadow = false; return { m, i }; });
// PC numa barraca do meio + celular gigante flutuando
const PCG = new THREE.Group(); PCG.position.set(.9, .9, -1.0); S.add(PCG); box(1.3, .06, .7, M("#4a2a1a"), PCG, 0, 0, 0);
const telaT = ctex(256, 160, (g, w, h, k = 0, txt = "") => { g.fillStyle = "#0d1a16"; g.fillRect(0, 0, w, h); g.fillStyle = JADE; g.font = "400 18px AB"; g.fillText("PC", 12, 22); g.fillStyle = "#c9f2e3"; g.font = "400 20px AB";
  const L = ["> abrir planilha", "> organizar pastas", "> resumir pdf"]; L.forEach((l, i) => { const n = Math.floor(Math.min(1, Math.max(0, k * 3 - i)) * l.length); g.fillText(l.slice(0, n), 12, 58 + i * 30); }); });
const mon = mesh(new THREE.BoxGeometry(1.0, .65, .05), [M("#222"), M("#222"), M("#222"), M("#222"), new THREE.MeshStandardMaterial({ map: telaT, emissive: "#fff", emissiveMap: telaT, emissiveIntensity: .7 }), M("#222")], PCG, 0, .45, -.1); box(.08, .2, .08, M("#222"), PCG, 0, .1, -.1);
let telU = ""; const telaD = k => { const u = Math.round(k * 30); if (u + "" !== telU) { telU = u + ""; telaT.draw(k); } };
const celT = ctex(160, 300, g => { g.fillStyle = "#0e1418"; g.fillRect(0, 0, 160, 300); g.fillStyle = JADE; g.beginPath(); g.roundRect(20, 90, 120, 120, 26); g.fill(); g.fillStyle = "#fff"; g.font = "400 56px AB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("IA", 80, 152); g.fillStyle = "#9fdcc9"; g.fillRect(30, 230, 100, 10); g.fillRect(40, 250, 80, 10); });
const CEL = mesh(new THREE.BoxGeometry(.7, 1.3, .08), [M("#111"), M("#111"), M("#111"), M("#111"), new THREE.MeshStandardMaterial({ map: celT, emissive: "#fff", emissiveMap: celT, emissiveIntensity: .7 }), M("#111")], S, -.9, 2.1, .1);
// fios de luz do celular até o PC (pontinhos viajando)
const PTS = Array.from({ length: 16 }, () => { const m = mesh(new THREE.SphereGeometry(.05, 8, 6), E(OURO, 3), S); m.castShadow = false; m.visible = false; return m; });
const fluxo = (lt, on) => PTS.forEach((p, i) => { p.visible = on; if (!on) return; const u = (lt * .6 + i / 16) % 1; const a = CEL.position, b = V(.9, 1.55, -1.0); p.position.lerpVectors(a, b, u); p.position.y += Math.sin(u * Math.PI) * .6; });
// cadeado + placa PC DE TESTE (s4)
const CAD = new THREE.Group(); S.add(CAD); CAD.position.set(1.9, 0, .2); mesh(new THREE.TorusGeometry(.22, .06, 10, 24, Math.PI), M("#c9c9c9", { metalness: .8, roughness: .3 }), CAD, 0, 1.3, 0); box(.6, .5, .25, M(OURO, { metalness: .6, roughness: .3 }), CAD, 0, 1.05, 0);
const plT = ctex(256, 96, g => { g.fillStyle = OURO; g.fillRect(0, 0, 256, 96); g.fillStyle = TINTA; g.font = "400 34px AB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("PC DE TESTE", 128, 50); });
const PLACA = mesh(new THREE.PlaneGeometry(1.2, .45), new THREE.MeshStandardMaterial({ map: plT }), S, .9, 2.0, -.95);
// ---------- mascote: capa de chuva transparente (capuz no topo) + controle remoto na mão (ao lado) ----------
const CAPA = mesh(new THREE.SphereGeometry(.8, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: "#cfe9ff", transparent: true, opacity: .35, roughness: .1 }), MAS.corpo, 0, 1.42, -.05); CAPA.scale.set(1.0, .45, .75);
const CTRL = new THREE.Group(); CTRL.position.set(.42, .02, .16); MAS.bracos[1].add(CTRL); box(.18, .36, .08, M("#222"), CTRL, 0, .1, 0); const ledC = box(.06, .04, .02, E(VERM, 3), CTRL, 0, .22, .05);
const MX = -1.5, MZ = .1;
const pilota = lt => { const k = Math.sin(lt * 6); pose(MAS, { x: MX, z: MZ, y: hop(lt, .7, .03), ry: .55, braco: [.4, .9 + k * .15], piscar: pisca(lt) }); MAS.g.rotation.z = 0; ledC.material.emissiveIntensity = 2 + Math.sin(lt * 15) * 1.5; };
const olha = (lt, ry = .4) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .5], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .24), ry: .3, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let HS = 0;
const reset = (lt) => { CAD.visible = false; PLACA.visible = false; LANT.forEach((g, i) => g.rotation.z = Math.sin(lt * 1.2 + i) * .08); VAP.forEach(({ m, i }) => { const u = (lt * .3 + i / 10) % 1; m.position.set((i % 2 ? 2.6 : -2.6) + Math.sin(u * 6 + i) * .2, 1.0 + u * 1.6, -1.2); m.material.opacity = .3 * (1 - u); m.scale.setScalar(1 + u * 2); });
  CEL.position.y = 2.1 + Math.sin(lt * 2) * .08; CEL.rotation.y = .4 + Math.sin(lt) * .1; };
// ---------- órbita ----------
const ORB = { gancho: [-.25, .1, 7.8, 2.0, V(-.1, 1.4, -.5)], s1: [.3, -.05, 7.6, 2.0, V(0, 1.5, -.6)], s2: [-.2, .2, 7.2, 1.9, V(.3, 1.4, -.7)], s3: [.25, -.15, 7.8, 2.1, V(0, 1.6, -.6)], s4: [-.25, .1, 7.4, 2.0, V(.6, 1.4, -.5)], cta: [.1, -.1, 8.2, 2.1, V(0, 1.4, -.5)] };
const SHOTS = {}; Object.keys(ORB).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a0, a1, r, y, l] = ORB[nome] || ORB.cta, a = a0 + (a1 - a0) * eio(lt / d); cam.position.set(l.x + Math.sin(a) * r, y, l.z + Math.cos(a) * r); cam.lookAt(l); };
const ACT = {
  gancho(lt, d) { reset(lt); fluxo(lt, lt > 1.2); telaD(lin(lt, 1.6, d)); pilota(lt); },
  s1(lt, d) { reset(lt); fluxo(lt, true); telaD(.33); olha(lt); },
  s2(lt, d) { reset(lt); fluxo(lt, true); telaD(lin(lt, .2, d - .2)); pilota(lt); },
  s3(lt, d) { reset(lt); fluxo(lt, true); telaD(1); HS = 16666 * eio(lin(lt, .3, 2.4)); feliz(lt); },
  s4(lt, d) { reset(lt); fluxo(lt, false); telaD(1); CAD.visible = true; CAD.scale.setScalar(Math.max(.01, back(lin(lt, .2, .6)))); PLACA.visible = lt > 1.0; PLACA.scale.setScalar(Math.max(.01, back(lin(lt, 1.0, 1.4)))); olha(lt, .6); },
  cta(lt, d) { reset(lt); fluxo(lt, true); telaD(1); CAD.visible = true; PLACA.visible = true; pose(MAS, { x: MX, z: MZ + 1.2, y: hop(lt, .35, .24), ry: .3, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px AB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const rasgado = (x, y, w, h, s) => { X.beginPath(); X.moveTo(x, y); for (let i = 0; i <= 40; i++) X.lineTo(x + w * i / 40, y + ((i * 7 + s) % 5) * 2.4 - 4); for (let i = 0; i <= 40; i++) X.lineTo(x + w - w * i / 40, y + h + ((i * 11 + s) % 6) * 2.6 - 6); X.closePath(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(32,16,15,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1" || nome === "s2") { const txt = "DSH-GO", tw = 92, x0 = 505 - (txt.length * (tw + 10) - 10) / 2, t0 = nome === "s2" ? -9 : .3;
        for (let i = 0; i < txt.length; i++) { const k = lin(lt, t0 + i * .1, t0 + i * .1 + .35); if (k <= 0) continue; const y = 680 - (1 - eo(k)) * 260; X.save(); X.translate(x0 + i * (tw + 10) + tw / 2, y); X.rotate((1 - eo(k)) * (i % 2 ? .5 : -.5));
          X.fillStyle = i % 2 ? JADE : VERM; X.beginPath(); X.roundRect(-tw / 2, -tw / 2 - 6, tw, tw + 12, 12); X.fill(); X.fillStyle = "#fff"; X.font = "400 76px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(txt[i], 0, 4); X.restore(); } }
      if (nome === "s3") { X.fillStyle = "#0a0505"; X.beginPath(); X.roundRect(560, 610, 380, 170, 14); X.fill(); X.strokeStyle = OURO; X.lineWidth = 5; X.stroke(); X.fillStyle = OURO; X.font = "400 24px PS"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("HI-SCORE", 750, 648);
        X.fillStyle = "#fff"; X.font = "400 72px AB"; X.fillText(Math.round(HS).toLocaleString("pt-BR"), 750, 710); X.fillStyle = "#f5d9a8"; X.font = "400 20px AB"; X.fillText("ESTRELAS NO GITHUB", 750, 758); } },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(.012); X.shadowColor = "rgba(0,0,0,.35)"; X.shadowBlur = 16; X.shadowOffsetY = 6; X.fillStyle = PAP; rasgado(-450, -122, 900, 244, 9); X.fill(); X.shadowColor = "transparent";
      X.fillStyle = "rgba(242,193,78,.75)"; for (const [x, r] of [[-405, -.5], [405, .5]]) { X.save(); X.translate(x, -114); X.rotate(r); X.fillRect(-70, -18, 140, 36); X.restore(); }
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(50, l1, 840); X.fillText(l1, 0, -30); X.fillStyle = VERM; cabe(54, l2, 840); X.fillText(l2, 0, 32); X.fillStyle = "#1f7a5c"; cabe(42, l3, 840); X.fillText(l3, 0, 88); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = C.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 56; X.font = `400 ${fs}px AB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 700 && fs > 30) { fs -= 2; X.font = `400 ${fs}px AB`; }
      const y = 1405; X.fillStyle = VERM2; X.fillRect(40, y - 56, 910, 112); X.fillStyle = OURO; X.fillRect(40, y - 56, 910, 8); X.fillStyle = OURO; X.fillRect(60, y - 88, 170, 38); X.fillStyle = TINTA; X.font = "400 22px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("AO VIVO · CHINA", 145, y - 68);
      let x = 505 - tot() / 2; X.font = `400 ${fs}px AB`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? OURO : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 180 + u * 2300, h = w * 1.85;
      X.save(); X.fillStyle = "#0e0707"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 40 * (1 - u) + 6); X.fill("evenodd"); X.strokeStyle = JADE; X.lineWidth = 12; X.beginPath(); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 40 * (1 - u) + 6); X.stroke(); X.restore(); },
    fechamento(lt) { X.save(); X.translate(620, 900); X.scale(.72, .72); X.rotate(-.01); X.fillStyle = "#fffdf6"; X.shadowColor = "rgba(0,0,0,.3)"; X.shadowBlur = 20; X.fillRect(-440, -320, 880, 640); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(224,49,43,.2)"; X.lineWidth = 2; for (let y = -250; y < 320; y += 64) { X.beginPath(); X.moveTo(-440, y); X.lineTo(440, y); X.stroke(); }
      X.fillStyle = VERM; X.font = "400 48px AB"; X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillText("ANTES DE INSTALAR:", -390, -200);
      ["leia o README todo", "use num PC de teste", "não deixe senha aberta"].forEach((l, i) => { const a = eo(lin(lt, .15 + i * .2, .5 + i * .2)); X.globalAlpha = a; X.fillStyle = TINTA; X.font = "400 44px AB"; X.fillText("✓ " + l, -380 + (1 - a) * 30, -122 + i * 64); });
      X.globalAlpha = 1; const p = back(lin(lt, .8, 1.2)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(0, 150); X.scale(p, p); X.fillStyle = VERM; X.beginPath(); X.roundRect(-350, -62, 700, 124, 62); X.fill();
      X.fillStyle = "#fff"; X.font = "400 64px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore();
      if (lt > 1.2) { X.globalAlpha = eo(lin(lt, 1.2, 1.6)); X.fillStyle = "#1f7a5c"; X.font = "400 36px AB"; X.textAlign = "center"; X.fillText("No seu PC do trabalho, você deixaria?", 0, 268); X.globalAlpha = 1; } X.restore(); },
  }; };
const cores = { LAR: VERM, VERDE: JADE, FUNDO, CREME: PAP, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

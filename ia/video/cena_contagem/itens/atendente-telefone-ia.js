// Reel 🆕 "Crie um atendente de telefone com IA" (Lampline; 16/11 06:00). Motor da cena_contagem.
// Identidade: padaria de bairro de manhã: balcão com vitrine de pães, telefone fixo tocando sem parar e o mascote correndo de um lado pro
// outro; aí um atendente-robô de headset (genérico) aparece no balcão e atende; depois um segundo robô liga pra ele pra testar.
// Creme-padaria + marrom-pão + vermelho-telefone. Elementos: papel rasgado com fita, nome escrito à mão, termômetro, tarja de TV,
// zoom atravessando uma tela, órbita, cartões que viram, Archivo Black. Mascote de avental de padeiro; ação principal: correr.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const CRE = "#f6e7c8", PAO = "#c98a4b", PAO2 = "#8a5a2b", VERM = "#e5484d", TINTA = "#2a1c12", FUNDO = "#fbf4e6", AZ = "#3a7bd5", VERDE = "#2fb36b", AMAR = "#ffd23f";
rim.color.set(0xfff0d0); rim.intensity = 1.3; key.color.set(0xfff6e8); key.intensity = 150; key.position.set(-2, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xfff2e0, .62));
// ---------- padaria ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = CRE; g.fillRect(0, 0, w, h); g.fillStyle = "#e9d3a8"; for (let y = 0; y < 170; y += 24) for (let x = (y / 24) % 2 ? 12 : 0; x < w; x += 24) g.fillRect(x + 1, y + 1, 22, 22); g.fillStyle = PAO2; g.fillRect(0, 170, w, 86); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const chT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? "#7a2e2e" : "#efe3cf"; g.fillRect(x * 32, y * 32, 32, 32); } }); chT.wrapS = chT.wrapT = THREE.RepeatWrapping; chT.repeat.set(5, 3);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: chT, roughness: .6 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// prateleiras com pães
for (const y of [1.8, 2.5]) box(4.0, .06, .4, M(PAO2), S, 0, y, -2.6); for (let i = 0; i < 14; i++) { const p = mesh(new THREE.CapsuleGeometry(.1, .25, 4, 10), M(PAO, { roughness: .8 }), S, -1.8 + (i % 7) * .6, i < 7 ? 1.92 : 2.62, -2.55); p.rotation.z = Math.PI / 2; }
// balcão-vitrine
box(3.6, 1.0, .8, M("#f2ece0", { roughness: .4 }), S, -.2, .5, -1.4); box(3.6, .5, .78, new THREE.MeshStandardMaterial({ color: "#dff2ff", transparent: true, opacity: .3, roughness: .05 }), S, -.2, 1.25, -1.4); box(3.7, .05, .85, M(PAO2), S, -.2, 1.0, -1.4);
for (let i = 0; i < 6; i++) mesh(new THREE.SphereGeometry(.12, 12, 10), M(i % 2 ? PAO : "#e8b06a", { roughness: .8 }), S, -1.6 + i * .5, 1.12, -1.4).scale.y = .7;
// telefone fixo tocando
const TEL = new THREE.Group(); TEL.position.set(1.3, 1.5, -1.4); S.add(TEL); box(.4, .14, .3, M(VERM, { roughness: .35 }), TEL, 0, .07, 0); const FONE = box(.44, .07, .1, M(VERM, { roughness: .35 }), TEL, 0, .17, 0);
const somT = ctex(96, 96, g => { g.strokeStyle = VERM; g.lineWidth = 7; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(48, 48, 14 + i * 13, -.7, .7); g.stroke(); } });
const SOM = [-1, 1].map(s => { const m = mesh(new THREE.PlaneGeometry(.35, .35), new THREE.MeshBasicMaterial({ map: somT, transparent: true, side: THREE.DoubleSide }), TEL, s * .35, .2, 0); m.rotation.y = s > 0 ? 0 : Math.PI; m.castShadow = false; return m; });
// robôs atendentes (headset)
const robo = (cor) => { const g = new THREE.Group(); S.add(g); box(.36, .32, .26, M(cor, { roughness: .4 }), g, 0, .16, 0); for (const s of [-1, 1]) box(.06, .1, .02, M("#111"), g, s * .08, .2, .14); mesh(new THREE.TorusGeometry(.2, .02, 6, 18, Math.PI), M("#222"), g, 0, .32, 0); const mic = box(.14, .02, .02, M("#222"), g, .14, .12, .14); g.visible = false; return g; };
const AT = robo("#9fd3ff"), TESTE = robo("#ffd29f");
const balT = (txt, cor) => ctex(320, 100, g => { g.fillStyle = cor; g.beginPath(); g.roundRect(4, 4, 312, 80, 22); g.fill(); g.fillStyle = "#fff"; g.font = "400 34px AB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 160, 46); });
const B1 = mesh(new THREE.PlaneGeometry(1.3, .4), new THREE.MeshBasicMaterial({ map: balT("PADARIA, BOM DIA!", AZ), transparent: true }), S, .2, 2.0, -1.1), B2 = mesh(new THREE.PlaneGeometry(1.3, .4), new THREE.MeshBasicMaterial({ map: balT("TEM PÃO DE QUEIJO?", PAO2), transparent: true }), S, -1.2, 2.5, -1.1); [B1, B2].forEach(b => b.castShadow = false);
// ---------- mascote: avental de padeiro + touca ----------
const AV = box(1.0, .6, .05, M("#ffffff", { roughness: .8 }), MAS.corpo, 0, .6, .52); const TOU = mesh(new THREE.CylinderGeometry(.5, .5, .22, 24), M("#fff", { roughness: .9 }), MAS.corpo, 0, 1.62, 0);
const MZ = .6;
const corre = (lt, a, b, per = 1.4) => { const u = (lt % per) / per, ida = u < .5, k = eio(ida ? u * 2 : (1 - u) * 2), x = a + (b - a) * k; pose(MAS, { x, z: MZ, y: hop(lt, .18, .08), ry: (ida ? 1 : -1) * Math.sign(b - a) * 1.1 * .8, braco: [1.5 + Math.sin(lt * 14) * .5, 1.5 - Math.sin(lt * 14) * .5], andar: lt * 3, piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const olha = (lt, x, ry = -.3) => { pose(MAS, { x, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .6], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = (lt, x = 1.2, z = MZ) => { pose(MAS, { x, z, y: hop(lt, .35, .22), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let TERM = 0;
const reset = (lt) => { AT.visible = false; TESTE.visible = false; B1.visible = false; B2.visible = false; SOM.forEach(s => s.visible = false); FONE.position.y = .17; TEL.rotation.z = 0; };
const toca = lt => { SOM.forEach(s => { s.visible = Math.floor(lt * 3) % 2 === 0; }); TEL.rotation.z = Math.sin(lt * 40) * .04; FONE.position.y = .17 + Math.abs(Math.sin(lt * 30)) * .03; };
const atendente = (lt, k) => { AT.visible = k > 0; AT.position.set(.6, 1.03, -1.35); AT.scale.setScalar(Math.max(.01, back(k))); AT.rotation.y = Math.sin(lt * 2) * .2; };
// ---------- órbita ----------
const ORB = { gancho: [-.3, .1, 7.6, 2.5, V(.1, 1.3, -.8)], s1: [.25, -.05, 7.0, 2.4, V(.4, 1.3, -1.0)], s2: [-.2, .15, 7.2, 2.6, V(-.2, 1.6, -1.0)], s3: [.25, -.1, 7.0, 2.4, V(.3, 1.3, -.8)], s4: [-.25, .1, 7.4, 2.5, V(.2, 1.3, -1.0)], cta: [.05, -.08, 8.0, 2.5, V(0, 1.3, -.6)] };
const SHOTS = {}; Object.keys(ORB).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a0, a1, r, y, l] = ORB[nome] || ORB.cta, a = a0 + (a1 - a0) * eio(lt / d); cam.position.set(l.x + Math.sin(a) * r, y, l.z + Math.cos(a) * r); cam.lookAt(l); };
const ACT = {
  gancho(lt, d) { reset(lt); toca(lt); corre(lt, -1.6, 1.4); },
  s1(lt, d) { reset(lt); atendente(lt, lin(lt, .3, .7)); B1.visible = lt > 1.0; olha(lt, 1.5, -.5); },
  s2(lt, d) { reset(lt); atendente(lt, 1); TESTE.visible = true; TESTE.position.set(-1.2, 1.03, -1.35); TESTE.scale.setScalar(Math.max(.01, back(lin(lt, .2, .6)))); B2.visible = lt > .8; B1.visible = lt > 1.8; olha(lt, 1.5, -.3); },
  s3(lt, d) { reset(lt); atendente(lt, 1); TERM = eio(lin(lt, .3, 1.8)); feliz(lt, 1.5); },
  s4(lt, d) { reset(lt); atendente(lt, 1); B1.visible = true; olha(lt, 1.5, -.2); },
  cta(lt, d) { reset(lt); atendente(lt, 1); feliz(lt, 1.4, 1.2); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px AB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const rasgado = (x, y, w, h, s) => { X.beginPath(); X.moveTo(x, y); for (let i = 0; i <= 40; i++) X.lineTo(x + w * i / 40, y + ((i * 7 + s) % 5) * 2.4 - 4); for (let i = 0; i <= 40; i++) X.lineTo(x + w - w * i / 40, y + h + ((i * 11 + s) % 6) * 2.6 - 6); X.closePath(); };
  const mao = (txt, x, y, lt, t0, fs) => { const p = eio(lin(lt, t0, t0 + .8)); X.save(); X.font = `700 ${fs}px CV`; X.textAlign = "left"; X.textBaseline = "middle"; const w = X.measureText(txt).width; X.fillStyle = "rgba(255,255,255,.93)"; X.beginPath(); X.roundRect(x - 24, y - fs * .72, w + 48, fs * 1.44, 18); X.fill(); X.beginPath(); X.rect(x - 6, y - fs, w * p + 12, fs * 2); X.clip(); X.fillStyle = TINTA; X.fillText(txt, x, y + 4); X.restore(); };
  const termometro = (k, x, y) => { const v = Math.round(456 * k); X.save(); X.translate(x, y); X.fillStyle = "rgba(255,255,255,.95)"; X.beginPath(); X.roundRect(-100, -165, 200, 345, 22); X.fill();
    X.fillStyle = "#eee"; X.beginPath(); X.roundRect(-20, -140, 40, 210, 20); X.fill(); X.beginPath(); X.arc(0, 90, 36, 0, 7); X.fill(); X.fillStyle = VERM; X.beginPath(); X.arc(0, 90, 27, 0, 7); X.fill(); const hh = 200 * Math.max(.04, k); X.fillRect(-11, 80 - hh, 22, hh + 10);
    X.fillStyle = TINTA; X.font = "400 46px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(v, 0, 150); X.font = "400 16px AB"; X.fillStyle = "#777"; X.fillText("★ ESTRELAS NO GITHUB", 0, 172); X.restore(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(251,244,230,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") mao("Lampline", 100, 700, lt, .3, 96);
      if (nome === "s3") termometro(TERM, 200, 880);
      if (nome === "s4") mao("centavos por ligação", 100, 700, lt, .4, 70); },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(.012); X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 16; X.shadowOffsetY = 6; X.fillStyle = "#fffaf0"; rasgado(-450, -122, 900, 244, 4); X.fill(); X.shadowColor = "transparent";
      X.fillStyle = "rgba(229,72,77,.4)"; for (const [x, r] of [[-405, -.5], [405, .5]]) { X.save(); X.translate(x, -114); X.rotate(r); X.fillRect(-70, -18, 140, 36); X.restore(); }
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(58, l1, 840); X.fillText(l1, 0, -30); X.fillStyle = VERM; cabe(58, l2, 840); X.fillText(l2, 0, 34); X.fillStyle = AZ; cabe(46, l3, 840); X.fillText(l3, 0, 92); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 64; X.font = `400 ${fs}px AB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 780 && fs > 36) { fs -= 2; X.font = `400 ${fs}px AB`; }
      const y = 1405, x0 = 505 - tot() / 2; X.fillStyle = PAO2; X.fillRect(40, y - 56, 910, 112); X.fillStyle = VERM; X.fillRect(40, y + 48, 910, 8); X.fillStyle = VERM; X.fillRect(60, y - 90, 290, 40); X.fillStyle = "#fff"; X.font = "400 24px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("DIRETO DA PADARIA", 205, y - 70);
      let x = x0; X.font = `400 ${fs}px AB`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? AMAR : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 240 + u * 2300, h = w * .62;
      X.save(); X.fillStyle = "#2a1c12"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 14 * (1 - u) + 4); X.fill("evenodd"); X.restore(); },
    fechamento(lt) { [["GRÁTIS", "sem chave"], ["TESTA", "com outra IA"], ["CENTAVOS", "por ligação"]].forEach(([a, b], i) => { const k = lin(lt, .1 + i * .22, .55 + i * .22), sx = Math.abs(Math.cos(k * Math.PI)), frente = k > .5, x = 210 + i * 300, y = 820;
        X.save(); X.translate(x, y); X.scale(Math.max(.02, sx), 1); X.fillStyle = frente ? "#fff" : VERM; X.beginPath(); X.roundRect(-130, -140, 260, 280, 22); X.fill();
        if (frente) { X.fillStyle = TINTA; X.font = `400 ${cabe(52, a, 220)}px AB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(a, 0, -22); X.fillStyle = "#7a5a3a"; X.font = "400 28px AB"; X.fillText(b, 0, 40); } else { X.fillStyle = "#fff"; X.font = "400 110px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("?", 0, 8); } X.restore(); });
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(420, 1050); X.scale(p, p); X.fillStyle = VERM; X.beginPath(); X.roundRect(-270, -58, 540, 116, 58); X.fill(); X.fillStyle = "#fff"; X.font = `400 ${cabe(70, "COMENTA " + CHAVE, 500)}px AB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore();
      if (lt > 1.3) { X.globalAlpha = eo(lin(lt, 1.3, 1.7)); X.fillStyle = TINTA; X.font = "400 30px AB"; X.textAlign = "center"; X.fillText("QUANTA LIGAÇÃO SEU NEGÓCIO PERDE POR DIA?", 420, 1150); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: VERM, VERDE: PAO, FUNDO, CREME: CRE, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

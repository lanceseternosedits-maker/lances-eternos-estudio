// Reel ⚙️ como funciona "4 palavras que fazem a IA errar menos" (Kojima et al., 2022: MultiArith 17,7% → 78,7%; 10/11 08:00).
// Identidade: canteiro de obra num fim de tarde: escada gigante de 4 blocos de madeira (cada degrau é um passo da conta),
// calculadora gigante no topo que acende, cavaletes listrados e cones; laranja-tijolo + azul-petróleo.
// Elementos (trocados na produção: o roteiro repetia a combinação inteira do "Manda print"): etiqueta em placa de obra,
// nome escrito à mão nos blocos, velocímetro de acerto (17% → 78%, número do artigo), legenda uma palavra gigante por vez com pop,
// flash branco, câmera na mão, fechamento lista + pílulas COMENTA, Archivo Black. Mascote de capacete de obra; ação: subir degrau por degrau.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const TIJ = "#d2572b", TIJ2 = "#a33d18", PET = "#0f5560", PET2 = "#1b7f8c", AMAR = "#ffc531", MAD = "#c99158", TINTA = "#14211f", FUNDO = "#f3e6d6", BRANCO = "#fffaf2";
rim.color.set(0xffb27a); rim.intensity = 1.6; key.color.set(0xffeedd); key.intensity = 150; key.position.set(2, 9, 6); key.target.position.set(0, 1, 0);
S.add(new THREE.AmbientLight(0xffeedd, .5));

// ---------- cenário ----------
const ceuT = ctex(512, 256, (g, w, h) => { const sk = g.createLinearGradient(0, 0, 0, h); sk.addColorStop(0, "#5aa7b3"); sk.addColorStop(1, "#ffd3a8"); g.fillStyle = sk; g.fillRect(0, 0, w, h);
  g.fillStyle = "rgba(15,85,96,.55)"; [[30, 120, 60], [120, 90, 50], [380, 100, 70], [460, 130, 40]].forEach(([x, y, w2]) => g.fillRect(x, y, w2, h - y)); });
mesh(new THREE.PlaneGeometry(24, 12), new THREE.MeshBasicMaterial({ map: ceuT }), S, 0, 5, -4.5).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(24, 12), M("#b9a48a", { roughness: 1 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
const listT = ctex(128, 32, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#fff" : TIJ; g.fillRect(i * 16, 0, 16, h); } });
const cavalete = (x, z) => { const g = new THREE.Group(); g.position.set(x, 0, z); S.add(g); box(1.0, .16, .05, new THREE.MeshStandardMaterial({ map: listT }), g, 0, .62, 0); for (const s of [-.4, .4]) box(.05, .62, .05, M("#ddd"), g, s, .31, 0); };
cavalete(-2.6, -1.4); cavalete(2.8, -1.0);
const cone = (x, z) => { mesh(new THREE.ConeGeometry(.16, .45, 16), M(TIJ), S, x, .23, z); box(.36, .03, .36, M("#222"), S, x, .015, z); };
cone(-2.2, .6); cone(2.4, .5); cone(2.0, .9);
// escada de 4 blocos (cada um com uma palavra escrita à mão)
const PAL = ["pense", "passo", "a", "passo"];
const blocoT = (i, k = 0, aceso = 0) => ctex(256, 160, (g, w, h) => { g.fillStyle = aceso ? "#ffe39a" : MAD; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(90,50,20,.35)"; for (let y = 10; y < h; y += 18) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + 4); g.stroke(); }
  g.save(); g.beginPath(); g.rect(0, 0, w * k, h); g.clip(); g.fillStyle = TINTA; g.font = "700 78px CV"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(PAL[i], w / 2, h / 2 + 6); g.restore();
  if (k <= 0) { g.fillStyle = "rgba(20,33,31,.35)"; g.font = "400 70px AB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("?", w / 2, h / 2 + 4); } });
const DEG = PAL.map((p, i) => { const t = [blocoT(i, 0), blocoT(i, 1), blocoT(i, 1, 1)]; const frente = new THREE.MeshStandardMaterial({ map: t[0], roughness: .7 }); const lado = M(MAD, { roughness: .7 });
  const h = .45 * (i + 1); const m = mesh(new THREE.BoxGeometry(.85, h, .9), [lado, lado, lado, lado, frente, lado], S, -.55 + i * .86, h / 2, -.4); return { m, frente, t, i, h, x: -.55 + i * .86 }; });
const escreve = (D, k) => { if (k <= 0) { D.frente.map = D.t[0]; } else if (k >= 1) D.frente.map = D.t[1]; else { const tt = D.tk || (D.tk = blocoT(D.i, 0)); D.tk.draw = D.tk.draw; blocoParcial(D, k); return; } D.frente.needsUpdate = true; };
const parciais = PAL.map((p, i) => ctex(256, 160, (g, w, h, k = 0) => { g.fillStyle = MAD; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(90,50,20,.35)"; for (let y = 10; y < h; y += 18) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + 4); g.stroke(); }
  g.save(); g.beginPath(); g.rect(0, 0, w * k, h); g.clip(); g.fillStyle = TINTA; g.font = "700 78px CV"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(PAL[i], w / 2, h / 2 + 6); g.restore(); }));
function blocoParcial(D, k) { const t = parciais[D.i]; t.draw(k); D.frente.map = t; D.frente.needsUpdate = true; }
const acende = (D, on) => { D.frente.map = on ? D.t[2] : D.t[1]; D.frente.emissive = new THREE.Color(on ? "#ffb04a" : "#000"); D.frente.emissiveIntensity = on ? .25 : 0; D.frente.needsUpdate = true; };
// calculadora gigante no topo
const calcT = ctex(256, 128, (g, w, h, txt = "") => { g.fillStyle = "#16302c"; g.fillRect(0, 0, w, h); g.fillStyle = txt === "ERRO" ? "#ff5b4a" : "#7dffb2"; g.font = "400 70px AB"; g.textAlign = "right"; g.textBaseline = "middle"; g.fillText(txt, w - 18, h / 2 + 4); });
const CALC = new THREE.Group(); CALC.position.set(2.05, 1.8, -.55); CALC.rotation.y = -.25; S.add(CALC); box(.9, 1.1, .2, M(PET, { roughness: .4 }), CALC, 0, .55, 0);
const visor = mesh(new THREE.PlaneGeometry(.74, .34), new THREE.MeshStandardMaterial({ map: calcT, emissive: "#fff", emissiveMap: calcT, emissiveIntensity: .6 }), CALC, 0, .85, .11);
for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) box(.18, .12, .05, M(r === 2 && c === 2 ? AMAR : "#d9e6e4"), CALC, -.24 + c * .24, .55 - r * .17, .11);
let calU = null; const calc = txt => { if (txt !== calU) { calU = txt; calcT.draw(txt); } };

// ---------- mascote: capacete de obra; subir degrau por degrau ----------
const CAP = new THREE.Group(); CAP.position.set(0, 1.5, 0); MAS.corpo.add(CAP); mesh(new THREE.SphereGeometry(.6, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), M(AMAR, { roughness: .35 }), CAP, 0, 0, 0).scale.y = .55;
mesh(new THREE.CylinderGeometry(.74, .74, .04, 32, 1, false, -1.3, 2.6), M(AMAR, { roughness: .35 }), CAP, 0, .01, .05);
const BASE = V(-1.65, 0, .1);
const degY = i => i < 0 ? 0 : .45 * (i + 1);
const naEscada = (pos, lt) => { const i = Math.floor(pos), f = pos - i, x0 = i < 0 ? BASE.x : DEG[i].x, x1 = DEG[Math.min(3, i + 1)].x, y0 = degY(i), y1 = degY(Math.min(3, i + 1));
  const x = f > 0 ? x0 + (x1 - x0) * eio(f) : x0, y = f > 0 ? y0 + (y1 - y0) * eio(f) + Math.sin(f * Math.PI) * .35 : y0;
  pose(MAS, { x, z: -.25, y, ry: .25, braco: [.8 + Math.sin(f * Math.PI) * .9, .8 + Math.sin(f * Math.PI) * .9], andar: f * 2, sq: f > 0 && f < .12 ? .05 : 0, piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const noChao = (lt, ry = .3) => { pose(MAS, { x: BASE.x, z: BASE.z, y: hop(lt, .9, .03), ry, braco: [.3, .5 + Math.sin(lt * 2) * .1], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
let ACERTO = 0, MOSTRA_V = false;

grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = (k = 0) => { DEG.forEach(D => { if (k >= 1) acende(D, false); else escreve(D, k); }); MOSTRA_V = false; };

// ---------- câmera na mão ----------
const BS = { gancho: [V(.2, 2.2, 6.6), V(.3, 1.2, -.4)], s1: [V(-.3, 2.0, 6.2), V(.2, 1.3, -.4)], s2: [V(.5, 2.3, 6.8), V(.4, 1.4, -.4)], s3: [V(.0, 2.2, 6.4), V(.3, 1.4, -.4)],
  s4: [V(.6, 2.9, 7.4), V(.7, 2.0, -.4)], cta: [V(0, 2.9, 7.6), V(.4, 1.9, -.4)] };
const SHOTS = {}; Object.keys(BS).forEach(n => SHOTS[n] = [BS[n], BS[n]]);
const camera = (cam, nome, lt, d, t) => { const [p, l] = BS[nome] || BS.cta, u = lt / d; const nx = Math.sin(t * 1.3) * .05 + Math.sin(t * 3.7) * .02, ny = Math.sin(t * 1.7 + 1) * .04 + Math.sin(t * 4.3) * .015;
  cam.position.set(p.x + nx, p.y + ny, p.z - u * .35); cam.lookAt(l.x + nx * .4, l.y + ny * .4, l.z); cam.rotateZ(Math.sin(t * 1.1) * .012); };

const ACT = {
  gancho(lt, d) { reset(0); calc(""); noChao(lt, .35); },
  s1(lt, d) { reset(0); // pula direto pro topo e quica de volta (chute)
    const k = lin(lt, .3, 1.4); if (k > 0 && k < 1) { const x = BASE.x + (DEG[3].x - BASE.x) * k * .7, y = Math.sin(k * Math.PI) * 2.2; pose(MAS, { x, z: -.25 + k * .5, y, ry: .2, braco: [2, 2], piscar: pisca(lt) }); MAS.g.rotation.z = -k * 6.283; }
    else noChao(lt, .2); if (k >= 1) { MAS.g.rotation.z = Math.sin(lt * 9) * .06 * Math.max(0, 1 - (lt - 1.4)); } calc(k > .55 ? "ERRO" : "?"); },
  s2(lt, d) { DEG.forEach((D, i) => { const k = lin(lt, .4 + i * .55, .9 + i * .55); if (k >= 1) { D.frente.map = D.t[1]; D.frente.needsUpdate = true; } else blocoParcial(D, k); }); calc(""); MOSTRA_V = lt > d * .45; ACERTO = 17.7 + (78.7 - 17.7) * eio(lin(lt, d * .62, d - .6)); noChao(lt, .5); },
  s3(lt, d) { MOSTRA_V = false; const pos = -1 + eio(lin(lt, .2, d - .6)) * 4; DEG.forEach((D, i) => acende(D, pos >= i)); naEscada(Math.min(3, pos), lt); calc(""); },
  s4(lt, d) { MOSTRA_V = false; DEG.forEach(D => acende(D, true)); const k = lin(lt, .2, .6); calc(k > 0 ? "✓" : ""); pose(MAS, { x: DEG[3].x, z: -.25, y: degY(3) + hop(lt, .35, .25), ry: .2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
  cta(lt, d) { MOSTRA_V = false; DEG.forEach(D => acende(D, true)); calc("✓"); pose(MAS, { x: DEG[3].x, z: -.25, y: degY(3) + hop(lt, .4, .2), ry: .2, braco: [.3, 2.0 + Math.sin(lt * 9) * .4], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
};

// ---------- elementos de tela (2D): entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, pil } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 22) { X.font = `400 ${f}px AB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const velocimetro = (v, x, y) => { const r = 120; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,250,242,.94)"; X.beginPath(); X.roundRect(-r - 30, -r - 30, 2 * r + 60, r + 130, 22); X.fill();
    const a0 = Math.PI, a1 = 2 * Math.PI; X.lineWidth = 26; X.lineCap = "butt"; [[0, .33, "#e4573d"], [.33, .66, AMAR], [.66, 1, "#2fb36b"]].forEach(([a, b, c]) => { X.strokeStyle = c; X.beginPath(); X.arc(0, 0, r, a0 + a * Math.PI, a0 + b * Math.PI); X.stroke(); });
    const ang = a0 + (v / 100) * Math.PI; X.strokeStyle = TINTA; X.lineWidth = 8; X.lineCap = "round"; X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(ang) * (r - 20), Math.sin(ang) * (r - 20)); X.stroke(); X.fillStyle = TINTA; X.beginPath(); X.arc(0, 0, 14, 0, 7); X.fill();
    X.font = "400 56px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(Math.floor(v) + "%", 0, 52); X.font = "400 22px AB"; X.fillStyle = PET; X.fillText("ACERTO EM MATEMÁTICA", 0, 90); X.restore(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(243,230,214,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (MOSTRA_V) velocimetro(ACERTO, 790, 760);
      if (nome === "s2" && lt > 4.2) { const a = eo(lin(lt, 4.2, 4.6)); X.globalAlpha = a; X.fillStyle = PET; X.beginPath(); X.roundRect(60, 612, 470, 80, 14); X.fill(); X.fillStyle = "#fff"; X.font = "400 40px AB"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("estudo de 2022", 86, 654); X.globalAlpha = 1; } },
    etiqueta(t, nome) { // placa de obra amarela com faixa preta
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.fillStyle = "#5c4a35"; X.fillRect(-300, 110, 16, 70); X.fillRect(284, 110, 16, 70);
      X.fillStyle = AMAR; X.beginPath(); X.roundRect(-455, -128, 910, 256, 14); X.fill(); X.strokeStyle = TINTA; X.lineWidth = 8; X.beginPath(); X.roundRect(-440, -113, 880, 226, 8); X.stroke();
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(52, l1, 830); X.fillText(l1, 0, -34); X.fillStyle = TIJ2; cabe(54, l2, 830); X.fillText(l2, 0, 30); X.fillStyle = PET; cabe(40, l3, 830); X.fillText(l3, 0, 86); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ws = seg.palavras; let w = ws.findIndex(x => t < x.t1 + .06); if (w < 0) w = ws.length - 1; const W = ws[w]; if (t < W.t0 - .25) return;
      const p = back(lin(t, W.t0 - .04, W.t0 + .14)); const txt = W.w.replace(/[,.:;']+$/, "").replace(/^'/, "").toUpperCase(), chave = txt.replace(/[?!]/g, "") === CHAVE;
      let f = 130; X.font = `400 ${f}px AB`; while (X.measureText(txt).width > 820 && f > 50) { f -= 4; X.font = `400 ${f}px AB`; }
      X.save(); X.translate(505, 1400); X.rotate(Math.sin(W.t0 * 13) * .03); X.scale(.6 + .4 * p, .6 + .4 * p); X.textAlign = "center"; X.textBaseline = "middle"; X.lineWidth = 18; X.strokeStyle = TINTA; X.lineJoin = "round"; X.strokeText(txt, 0, 4);
      X.fillStyle = chave ? AMAR : /\d/.test(txt) ? "#7fe3ef" : BRANCO; X.fillText(txt, 0, 4); X.restore(); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .14) return; X.fillStyle = `rgba(255,255,255,${.85 * (1 - lt / .14)})`; X.fillRect(0, 0, 1080, 1920); },
    fechamento(lt) { X.fillStyle = "rgba(255,250,242,.94)"; X.beginPath(); X.roundRect(60, 640, 890, 800, 30); X.fill();
      X.fillStyle = TINTA; X.font = "400 50px AB"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("Escreve no fim do pedido:", 110, 720);
      X.fillStyle = TIJ2; X.font = "700 76px CV"; X.fillText("“pense passo a passo”", 110, 810);
      ["na conta", "no orçamento", "na decisão difícil"].forEach((s, i) => { const a = eo(lin(lt, .2 + i * .15, .55 + i * .15)); X.globalAlpha = a; const y = 920 + i * 86 + Math.sin(lt * 4 - i) * 4;
        X.fillStyle = [TIJ, PET2, AMAR][i]; X.beginPath(); X.roundRect(110 + (1 - a) * 40, y - 32, 64, 64, 14); X.fill(); X.fillStyle = "#fff"; X.font = "400 36px AB"; X.textAlign = "center"; X.fillText("✓", 142 + (1 - a) * 40, y + 2);
        X.fillStyle = TINTA; X.font = "400 46px AB"; X.textAlign = "left"; X.fillText(s, 196 + (1 - a) * 40, y + 2); X.globalAlpha = 1; });
      const p = back(lin(lt, .7, 1.1)) * (1 + Math.sin(lt * 6) * .035); X.save(); X.translate(505, 1250); X.scale(p, p); X.font = "400 70px AB"; const w1 = X.measureText("COMENTA").width + 64, w2 = X.measureText(CHAVE).width + 64, x0 = -(w1 + w2 + 18) / 2;
      pil("COMENTA", x0, 0, 70, PET, "#fff", "AB", "left", .46); pil(CHAVE, x0 + w1 + 18, 0, 70, AMAR, TINTA, "AB", "left", .46); X.restore();
      if (lt > 1.1) { X.globalAlpha = eo(lin(lt, 1.1, 1.5)); X.fillStyle = TINTA; X.font = "400 40px AB"; X.textAlign = "center"; X.fillText("Vai testar hoje?", 505, 1375); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: TIJ, VERDE: PET2, FUNDO, CREME: BRANCO, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

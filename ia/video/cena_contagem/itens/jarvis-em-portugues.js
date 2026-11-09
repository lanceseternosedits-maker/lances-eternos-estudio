// Reel 🆕 "Um JARVIS em português no seu PC" (jarvis-opensource, feito por um brasileiro; 15/11 15:00). Motor da cena_contagem.
// Identidade: home office numa varanda brasileira de tarde: mesa com PC, rede pendurada, vasos e uma hortinha onde o mascote planta mudas;
// o assistente é uma bolinha verde de ondas de som (genérica, nada de filme) que flutua e, quando ouve, abre janelas no PC e marca tarefas.
// Verde-folha + amarelo-sol + azul. Elementos: letreiro neon, nome em máquina de escrever, pote enchendo de estrelas, tarja de TV,
// zoom atravessando uma tela, plongée/contra-plongée, post-its na parede, Press Start só no enfeite + Space Grotesk.
// Mascote de chapéu de palha de jardineiro; ação principal: plantar.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const FOLHA = "#3aa655", FOLHA2 = "#1f6e35", SOL = "#ffc93c", AZ = "#2f6fd6", TINTA = "#1a2420", FUNDO = "#f2f8ef", CREME = "#fffaf0", NEON = "#5dff9a", TERRA = "#8a5a33", ROSA = "#ff6f8f";
rim.color.set(0xffe2b0); rim.intensity = 1.4; key.color.set(0xfff4e0); key.intensity = 150; key.position.set(3, 10, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xf4fff0, .6));
// ---------- varanda ----------
const ceuT = ctex(512, 256, (g, w, h) => { const sk = g.createLinearGradient(0, 0, 0, h); sk.addColorStop(0, "#8fd0ff"); sk.addColorStop(1, "#fff1cf"); g.fillStyle = sk; g.fillRect(0, 0, w, h); g.fillStyle = "#6fae6a"; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(i * 64, 230, 50 + (i % 3) * 14, 0, 7); g.fill(); } g.fillStyle = "#f0e2c8"; g.fillRect(0, 150, w, 10); for (let x = 0; x < w; x += 22) g.fillRect(x, 150, 6, 106); });
mesh(new THREE.PlaneGeometry(26, 12), new THREE.MeshBasicMaterial({ map: ceuT }), S, 0, 5, -4.5).castShadow = false;
const cT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { g.fillStyle = (x + y) % 2 ? "#d27a4a" : "#c46a3c"; g.fillRect(x * 64 + 2, y * 64 + 2, 60, 60); } }); cT.wrapS = cT.wrapT = THREE.RepeatWrapping; cT.repeat.set(6, 3);
const chao = mesh(new THREE.PlaneGeometry(26, 14), new THREE.MeshStandardMaterial({ map: cT, roughness: .8 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// mesa + PC
box(2.0, .08, .9, M("#a87a50", { roughness: .5 }), S, .9, .85, -1.7); for (const [x, z] of [[0, -2.1], [1.8, -2.1], [0, -1.3], [1.8, -1.3]]) box(.06, .85, .06, M("#7a5232"), S, x, .42, z);
const pcC = document.createElement("canvas"); pcC.width = 320; pcC.height = 200; const pg = pcC.getContext("2d"); const pcT = new THREE.CanvasTexture(pcC); pcT.colorSpace = THREE.SRGBColorSpace;
const PC = new THREE.Group(); PC.position.set(.9, .89, -1.9); S.add(PC); box(1.2, .75, .06, M("#222"), PC, 0, .6, 0); mesh(new THREE.PlaneGeometry(1.12, .67), new THREE.MeshBasicMaterial({ map: pcT }), PC, 0, .6, .035).castShadow = false; box(.08, .25, .08, M("#222"), PC, 0, .12, 0);
const desPC = (k, t) => { pg.fillStyle = "#1c2a3a"; pg.fillRect(0, 0, 320, 200); const J = [["NAVEGADOR", AZ], ["AGENDA", FOLHA], ["MÚSICA", ROSA]]; J.forEach(([s, c], i) => { const u = Math.max(0, Math.min(1, k * 3 - i)); if (u <= 0) return; const w = 150 * eo(u), h = 90 * eo(u); pg.fillStyle = "#fff"; pg.fillRect(20 + i * 60, 20 + i * 30, w, h); pg.fillStyle = c; pg.fillRect(20 + i * 60, 20 + i * 30, w, 16); if (u > .8) { pg.fillStyle = TINTA; pg.font = "700 14px SG"; pg.fillText(s, 28 + i * 60, 58 + i * 30); } });
  if (k >= 1) { pg.fillStyle = "rgba(93,255,154,.9)"; pg.font = "700 18px SG"; pg.fillText("✓ tarefa organizada", 150, 186); } pcT.needsUpdate = true; };
// rede pendurada + vasos + horta
const REDE = mesh(new THREE.CylinderGeometry(.5, .5, 2.0, 16, 1, true, 0, Math.PI), M("#ff9f43", { side: THREE.DoubleSide, roughness: 1 }), S, -2.6, 1.0, -2.2); REDE.rotation.z = Math.PI / 2; REDE.rotation.x = Math.PI;
const vaso = (x, z, h) => { mesh(new THREE.CylinderGeometry(.2, .15, .3, 14), M(TERRA), S, x, .15, z); for (let i = 0; i < 4; i++) { const f = mesh(new THREE.ConeGeometry(.08, h, 6), M(FOLHA), S, x + Math.cos(i * 1.6) * .07, .3 + h / 2, z + Math.sin(i * 1.6) * .07); f.rotation.z = Math.cos(i * 1.6) * .3; } }; vaso(2.4, -1.6, .6); vaso(-1.3, -2.3, .5);
const CANT = box(2.2, .25, .6, M(TERRA, { roughness: .9 }), S, -1.4, .12, .4); const terra = box(2.1, .04, .5, M("#5a3a20", { roughness: 1 }), S, -1.4, .26, .4);
const MUDAS = [0, 1, 2, 3, 4].map(i => { const g = new THREE.Group(); g.position.set(-2.2 + i * .4, .28, .4); S.add(g); for (let j = 0; j < 2; j++) { const f = mesh(new THREE.SphereGeometry(.07, 8, 6), M(FOLHA), g, (j ? 1 : -1) * .05, .1, 0); f.scale.set(1, .5, .6); } box(.015, .1, .015, M(FOLHA2), g, 0, .05, 0); g.visible = false; return g; });
// bolinha de som (o assistente)
const ORB = new THREE.Group(); S.add(ORB); const nucleo = mesh(new THREE.SphereGeometry(.18, 20, 14), E(NEON, 1.2), ORB, 0, 0, 0); const AN = [0, 1, 2].map(i => { const m = mesh(new THREE.TorusGeometry(.26 + i * .1, .012, 6, 32), new THREE.MeshBasicMaterial({ color: NEON, transparent: true, opacity: .6 }), ORB, 0, 0, 0); m.castShadow = false; return m; });
const orb = (lt, ouvindo) => { ORB.position.set(-.1 + Math.sin(lt * .8) * .2, 2.0 + Math.sin(lt * 1.6) * .1, -1.0); AN.forEach((a, i) => { a.rotation.set(lt * (1 + i * .4), lt * .7, 0); a.scale.setScalar(1 + (ouvindo ? Math.max(0, Math.sin(lt * 9 + i)) * .3 : 0)); }); nucleo.material.emissiveIntensity = 1 + (ouvindo ? Math.max(0, Math.sin(lt * 12)) : 0); };
// ---------- mascote: chapéu de palha; planta ----------
const CHP = new THREE.Group(); CHP.position.set(0, 1.5, -.12); MAS.corpo.add(CHP); const palha = M("#e6c36a", { roughness: .9 }); mesh(new THREE.CylinderGeometry(.66, .66, .05, 32), palha, CHP, 0, .03, 0); mesh(new THREE.CylinderGeometry(.42, .5, .34, 24), palha, CHP, 0, .21, 0); mesh(new THREE.CylinderGeometry(.505, .505, .08, 24), M(FOLHA2), CHP, 0, .09, 0);
const PA = box(.08, .5, .08, M("#888", { metalness: .7 }), MAS.bracos[1], .45, -.25, .15);
const MX = -1.2, MZ = .95;
const planta = (lt, n) => { const s = Math.sin(lt * 4); pose(MAS, { x: MX - .2 + n * .15, z: MZ, y: hop(lt, 1.0, .02), ry: .4, sq: .04 + Math.max(0, s) * .04, braco: [.4, .5 + Math.max(0, s) * .7], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const olha = (lt, ry = .2) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .6], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = (lt, x = MX, z = MZ) => { pose(MAS, { x, z, y: hop(lt, .35, .22), ry: .2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let POTE = 0;
const reset = (lt) => { REDE.rotation.y = Math.sin(lt * .8) * .05; desPC(0, lt); };
const mudas = n => MUDAS.forEach((m, i) => { m.visible = i < n; m.scale.setScalar(i < n ? Math.min(1, n - i) : .01); });
// ---------- plongée / contra-plongée ----------
const BS = { gancho: [V(0, 4.2, 7.2), V(0, 1.0, -.8)], s1: [V(-.2, 1.0, 6.6), V(.1, 1.8, -1.2)], s2: [V(.2, 4.1, 7.0), V(.4, 1.0, -1.2)], s3: [V(-.3, 1.0, 6.6), V(-.2, 1.6, -.8)], s4: [V(.1, 4.0, 7.2), V(.2, 1.0, -1.0)], cta: [V(0, 2.8, 7.8), V(0, 1.4, -.8)] };
const SHOTS = {}; Object.keys(BS).forEach(n => { const s = [BS[n][0], BS[n][1]]; SHOTS[n] = [s, s]; });
const camera = (cam, nome, lt, d) => { const [p, l] = BS[nome] || BS.cta, u = eio(Math.min(1, lt / d)); cam.position.set(p.x, p.y + (p.y > 2 ? -.4 : .25) * u, p.z - u * .5); cam.lookAt(l.x, l.y, l.z); };
const ACT = {
  gancho(lt, d) { reset(lt); orb(lt, lt > 1.0); desPC(lin(lt, 1.4, d), lt); mudas(lin(lt, 0, d) * 1.5); planta(lt, 0); },
  s1(lt, d) { reset(lt); orb(lt, true); desPC(lin(lt, .5, d), lt); mudas(1.5 + lin(lt, 0, d)); planta(lt, 1); },
  s2(lt, d) { reset(lt); orb(lt, true); desPC(1, lt); mudas(2.5 + lin(lt, 0, d)); planta(lt, 2); },
  s3(lt, d) { reset(lt); orb(lt, false); desPC(1, lt); mudas(3.5); POTE = eio(lin(lt, .3, 2.0)); olha(lt, .3); },
  s4(lt, d) { reset(lt); orb(lt, false); desPC(1, lt); mudas(3.5 + lin(lt, 0, d) * 1.5); planta(lt, 3); },
  cta(lt, d) { reset(lt); orb(lt, true); desPC(1, lt); mudas(5); feliz(lt, -1.0, 1.4); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `700 ${f}px SG`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const estrela = (x, y, r, cor) => { X.fillStyle = cor; X.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; X.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } X.closePath(); X.fill(); };
  const pote = (v, x, y) => { const w = 150, h = 170; X.save(); X.translate(x, y); X.fillStyle = "rgba(255,255,255,.93)"; X.beginPath(); X.roundRect(-110, -h / 2 - 40, 220, h + 140, 20); X.fill();
    X.fillStyle = "rgba(58,166,85,.15)"; X.strokeStyle = FOLHA; X.lineWidth = 5; X.beginPath(); X.roundRect(-w / 2, -h / 2, w, h, 22); X.fill(); X.stroke(); X.fillStyle = TERRA; X.fillRect(-w / 2 + 12, -h / 2 - 20, w - 24, 22);
    X.save(); X.beginPath(); X.roundRect(-w / 2 + 5, -h / 2 + 5, w - 10, h - 10, 18); X.clip(); const n = Math.floor(v / 579 * 30); for (let i = 0; i < n; i++) estrela(-w / 2 + 20 + (i % 5) * 26 + (Math.floor(i / 5) % 2) * 12, h / 2 - 18 - Math.floor(i / 5) * 24, 13, i % 3 ? SOL : "#ffe48a"); X.restore();
    X.fillStyle = TINTA; X.font = "700 46px SG"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(Math.round(v) + " ★", 0, h / 2 + 36); X.font = "700 20px SG"; X.fillStyle = FOLHA2; X.fillText("ESTRELAS NO GITHUB", 0, h / 2 + 68); X.restore(); };
  const maquina = (txt, x, y, lt, t0, fs) => { if (lt < t0) return; const n = Math.min(txt.length, Math.floor((lt - t0) * 14)); X.font = `700 ${fs}px SG`; X.textAlign = "left"; X.textBaseline = "middle"; const s = txt.slice(0, n), w = X.measureText(txt).width;
    X.fillStyle = "rgba(255,250,240,.95)"; X.beginPath(); X.roundRect(x - 24, y - fs * .75, w + 60, fs * 1.5, 14); X.fill(); X.fillStyle = TINTA; X.fillText(s, x, y + 3); if (n < txt.length || Math.floor(lt * 3) % 2) X.fillRect(x + X.measureText(s).width + 4, y - fs * .38, 6, fs * .76); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(242,248,239,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") maquina("jarvis-opensource", 90, 700, lt, .3, 64);
      if (nome === "s2") { [["ABRE PROGRAMA", .2], ["ORGANIZA TAREFA", 1.0], ["CONVERSA", 1.9]].forEach(([s, t0], i) => { const k = back(lin(lt, t0, t0 + .3)); if (k <= 0) return; X.save(); X.translate(80, 680 + i * 72); X.scale(k, k); X.fillStyle = [AZ, FOLHA, ROSA][i]; X.beginPath(); X.roundRect(0, -30, 440, 60, 30); X.fill(); X.fillStyle = "#fff"; X.font = "700 34px SG"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("✓ " + s, 24, 2); X.restore(); }); }
      if (nome === "s3") pote(579 * POTE, 830, 860);
      if (nome === "s4") maquina("chave de IA: tem opção grátis", 90, 700, lt, .3, 52); },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.fillStyle = "#0d1a12"; X.beginPath(); X.roundRect(-465, -135, 930, 270, 26); X.fill(); X.strokeStyle = NEON; X.lineWidth = 5; X.shadowColor = NEON; X.shadowBlur = 20; X.stroke();
      const fl = Math.floor(t * 7) % 23 === 0 ? .55 : 1; X.textAlign = "center"; X.textBaseline = "middle"; X.globalAlpha = fl; X.shadowColor = NEON; X.shadowBlur = 22; X.fillStyle = "#e6ffef"; cabe(66, l1, 860); X.fillText(l1, 0, -52); X.globalAlpha = 1;
      X.shadowColor = SOL; X.fillStyle = "#fff4c2"; cabe(64, l2, 860); X.fillText(l2, 0, 14); X.shadowColor = "#7fb8ff"; X.fillStyle = "#dceaff"; cabe(52, l3, 860); X.fillText(l3, 0, 76); X.shadowBlur = 0; X.fillStyle = NEON; X.font = "400 16px PS"; X.textAlign = "left"; X.fillText("FEITO NO BRASIL", -440, -112); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 66; X.font = `700 ${fs}px SG`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 780 && fs > 38) { fs -= 2; X.font = `700 ${fs}px SG`; }
      const y = 1405, x0 = 505 - tot() / 2; X.fillStyle = FOLHA2; X.fillRect(40, y - 56, 910, 112); X.fillStyle = SOL; X.fillRect(40, y + 48, 910, 8); X.fillStyle = SOL; X.fillRect(60, y - 90, 290, 40); X.fillStyle = TINTA; X.font = "400 16px PS"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("RÁDIO DA VARANDA", 205, y - 70);
      let x = x0; X.font = `700 ${fs}px SG`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? SOL : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 240 + u * 2300, h = w * .62;
      X.save(); X.fillStyle = "#1c2a3a"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 14 * (1 - u) + 4); X.fill("evenodd"); X.restore(); },
    fechamento(lt) { [["DE GRAÇA", "e aberto", "#ffe27a", -.06], ["FALA", "em português", "#bff0c9", .05], ["MEXE", "no seu PC", "#cfe0ff", -.03]].forEach(([a, b, c, r], i) => { const k = back(lin(lt, .1 + i * .2, .45 + i * .2)); if (k <= 0) return; const x = 215 + i * 290, y = 830 + (i % 2) * 30;
        X.save(); X.translate(x, y); X.rotate(r); X.scale(k, k); X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 14; X.fillStyle = c; X.fillRect(-125, -115, 250, 230); X.shadowBlur = 0; X.fillStyle = "rgba(255,255,255,.55)"; X.fillRect(-50, -130, 100, 32);
        X.fillStyle = TINTA; X.textAlign = "center"; X.textBaseline = "middle"; X.font = `700 ${cabe(56, a, 220)}px SG`; X.fillText(a, 0, -14); X.fillStyle = "#4a5a50"; X.font = "700 32px SG"; X.fillText(b, 0, 46); X.restore(); });
      const p = back(lin(lt, .8, 1.2)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(620, 1070); X.scale(p, p); X.fillStyle = FOLHA2; X.beginPath(); X.roundRect(-270, -60, 540, 120, 60); X.fill(); X.fillStyle = "#fff"; X.font = `700 ${cabe(66, "Comenta " + CHAVE, 500)}px SG`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 4); X.restore(); },
  }; };
const cores = { LAR: FOLHA, VERDE: SOL, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

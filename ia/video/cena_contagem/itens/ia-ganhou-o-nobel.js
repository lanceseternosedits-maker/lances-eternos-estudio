// Reel 📜 história "A IA que ganhou um Nobel" (AlphaFold, Nobel de Química 2024; 15/11 17:00). Motor da cena_contagem.
// Identidade: laboratório claro de biologia: bancada branca, microscópio, frascos coloridos, um quadro com a fita de uma proteína;
// a proteína é um colar de contas coloridas que o mascote dobra até virar uma forma 3D; no fim uma medalha dourada genérica (sem logo)
// desce girando e uma prateleira se enche de mini-proteínas (os 200 milhões). Branco-lab + verde-água + dourado.
// Sem rosto de pessoa real. Elementos: faixa diagonal de aviso, letras caindo e encaixando, sem contador (história), karaokê com
// marca-texto, chicote de câmera, travelling lateral, cartões que viram, Fraunces. Mascote de jaleco e óculos de laboratório; ação: dobrar o colar.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const AGUA = "#5fd3c4", AGUA2 = "#1f8f84", OURO = "#e8b23a", TINTA = "#16222a", FUNDO = "#f1f7f7", CREME = "#fffdf6", ROSA = "#ff6f91", AZ = "#3a7bd5", AMAR = "#ffd23f";
rim.color.set(0xe0fff8); rim.intensity = 1.3; key.color.set(0xffffff); key.intensity = 150; key.position.set(2, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xf0ffff, .65));
// ---------- laboratório ----------
const pT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#e9f4f3"; g.fillRect(0, 0, w, h); g.strokeStyle = "#d3e6e4"; g.lineWidth = 3; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, h); g.stroke(); g.beginPath(); g.moveTo(0, i * 32); g.lineTo(w, i * 32); g.stroke(); } }); pT.wrapS = pT.wrapT = THREE.RepeatWrapping; pT.repeat.set(5, 2);
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshStandardMaterial({ map: pT, roughness: .5 }), S, 0, 4.5, -2.8).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(22, 12), M("#cfdedd", { roughness: .4 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// quadro com fita de proteína
const qT = ctex(384, 256, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 384, 256); g.lineWidth = 14; g.lineCap = "round"; const C = [AZ, AGUA2, ROSA, OURO]; for (let i = 0; i < 4; i++) { g.strokeStyle = C[i]; g.beginPath(); for (let a = 0; a < 40; a++) { const x = 40 + a * 8, y = 128 + Math.sin(a * .5 + i) * (30 + i * 12); a ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } });
mesh(new THREE.PlaneGeometry(1.8, 1.2), new THREE.MeshBasicMaterial({ map: qT }), S, -2.0, 2.6, -2.75).castShadow = false;
// bancada + microscópio + frascos
box(4.4, .1, 1.1, M("#f8fbfb", { roughness: .3 }), S, -.1, .9, -1.6); box(4.2, .85, 1.0, M("#d9e8e7", { roughness: .5 }), S, -.1, .43, -1.6);
const MIC = new THREE.Group(); MIC.position.set(1.5, .95, -1.7); S.add(MIC); box(.4, .06, .35, M("#333"), MIC, 0, .03, 0); box(.08, .6, .08, M("#333"), MIC, -.12, .33, -.1); const tubo = mesh(new THREE.CylinderGeometry(.07, .07, .45, 14), M("#eee", { metalness: .5 }), MIC, .02, .55, 0); tubo.rotation.z = .5;
[[AGUA, -1.8], [ROSA, -1.5], [AMAR, -1.2], [AZ, 2.0]].forEach(([c, x]) => { mesh(new THREE.CylinderGeometry(.09, .12, .3, 14), new THREE.MeshStandardMaterial({ color: c, transparent: true, opacity: .75, roughness: .1 }), S, x, 1.1, -1.8); });
// colar de contas → proteína dobrada
const NC = 22, CONTAS = []; const corC = [AZ, AGUA2, ROSA, OURO]; for (let i = 0; i < NC; i++) CONTAS.push(mesh(new THREE.SphereGeometry(.075, 12, 10), M(corC[Math.floor(i / 6) % 4], { roughness: .3 }), S));
const reto = i => V(-1.6 + i * .15, 1.15, -1.2), dobra = i => { const a = i * .55; return V(-.1 + Math.cos(a) * (.18 + i * .012), 1.35 + Math.sin(i * .9) * .25 + i * .015, -1.2 + Math.sin(a) * (.18 + i * .012)); };
const colar = (k, t) => CONTAS.forEach((c, i) => { const a = reto(i), b = dobra(i), u = eio(Math.max(0, Math.min(1, k * 1.5 - i * .02))); c.position.lerpVectors(a, b, u); c.position.y += Math.sin(t * 2 + i * .4) * .01; });
// medalha dourada genérica
const MED = new THREE.Group(); S.add(MED); const medT = ctex(256, 256, g => { g.fillStyle = OURO; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill(); g.strokeStyle = "#b8862a"; g.lineWidth = 10; g.beginPath(); g.arc(128, 128, 104, 0, 7); g.stroke(); g.fillStyle = "#7a5a12"; g.font = "900 64px FR"; g.textAlign = "center"; g.fillText("2024", 128, 150); });
mesh(new THREE.CylinderGeometry(.35, .35, .05, 32), new THREE.MeshStandardMaterial({ map: medT, metalness: .7, roughness: .3 }), MED, 0, 0, 0).rotation.x = Math.PI / 2; for (const s of [-1, 1]) { const f = box(.08, .5, .01, M(s > 0 ? AZ : ROSA), MED, s * .1, .4, -.03); f.rotation.z = s * .25; }
// prateleira de mini-proteínas (200 milhões) — instancing
const N = 120, IM = new THREE.InstancedMesh(new THREE.TorusKnotGeometry(.05, .016, 40, 6, 2, 3), M("#ffffff", { roughness: .4 }), N); S.add(IM); const m4 = new THREE.Matrix4(), col = new THREE.Color();
const minis = (k) => { for (let i = 0; i < N; i++) { const r = Math.floor(i / 20), c = i % 20, on = i < k * N; m4.makeScale(on ? 1 : .001, on ? 1 : .001, on ? 1 : .001); m4.setPosition(-2.2 + c * .23, 1.95 + r * .2, -2.5); IM.setMatrixAt(i, m4); IM.setColorAt(i, col.set(corC[i % 4])); } IM.instanceMatrix.needsUpdate = true; IM.instanceColor.needsUpdate = true; };
for (let r = 0; r < 6; r++) box(4.8, .03, .25, M("#d7e2e1"), S, -.0, 1.88 + r * .2, -2.5);
// ---------- mascote: jaleco + óculos de laboratório ----------
const JAL = box(1.54, .62, 1.04, M("#ffffff", { roughness: .8 }), MAS.corpo, 0, .64, 0); box(.04, .6, .02, M("#ccc"), MAS.corpo, 0, .64, .53);
const OC = new THREE.Group(); OC.position.set(0, 1.18, .51); MAS.corpo.add(OC); for (const s of [-1, 1]) { const l = mesh(new THREE.CylinderGeometry(.19, .19, .05, 18), new THREE.MeshStandardMaterial({ color: "#c9fff4", transparent: true, opacity: .4 }), OC, s * .27, 0, 0); l.rotation.x = Math.PI / 2; l.castShadow = false; mesh(new THREE.TorusGeometry(.19, .025, 6, 18), M(AGUA2), OC, s * .27, 0, 0); }
const MX = 1.3, MZ = .6;
const dobrando = (lt, ry = -.5) => { const s = Math.sin(lt * 4); pose(MAS, { x: MX, z: MZ, y: hop(lt, .9, .02), ry, braco: [.5 + s * .2, 1.2 - s * .2], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const olha = (lt, ry = -.3) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .6], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = (lt, x = MX, z = MZ) => { pose(MAS, { x, z, y: hop(lt, .35, .22), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = (lt) => { MED.visible = false; minis(0); };
const medalha = (lt, k) => { MED.visible = k > 0; MED.position.set(.1, 3.2 - eio(k) * 1.0, -.6); MED.rotation.y = lt * 1.5; };
// ---------- travelling lateral (com chicote no início das cenas) ----------
const TR = { gancho: [-1.0, .3], s1: [.8, -.2], s2: [-.6, .5], s3: [.7, -.3], s4: [-.8, .6], cta: [-.2, .3] };
const SHOTS = {}; Object.keys(TR).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a, b] = TR[nome] || TR.cta; let x = a + (b - a) * eio(lt / d); if (nome !== "gancho" && lt < .3) x += (1 - eio(lt / .3)) * 2.2; cam.position.set(x, 2.4, 6.4); cam.lookAt(x * .45 - .1, 1.45, -1.3); };
const ACT = {
  gancho(lt, d) { reset(lt); colar(0, lt); medalha(lt, lin(lt, d * .5, d)); olha(lt, -.2); },
  s1(lt, d) { reset(lt); colar(0, lt); medalha(lt, 1); MED.position.set(-2.2, 2.0, -1.4); dobrando(lt); },
  s2(lt, d) { reset(lt); colar(lin(lt, .3, d * .9), lt); dobrando(lt); },
  s3(lt, d) { reset(lt); colar(1, lt); dobrando(lt, -.3); },
  s4(lt, d) { reset(lt); colar(1, lt); minis(lin(lt, .3, d * .85)); feliz(lt); },
  cta(lt, d) { reset(lt); colar(1, lt); minis(1); feliz(lt, 1.4, 1.2); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx, peso = 900) => { while (f > 20) { X.font = `${peso} ${f}px FR`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const listras = (w, h) => { X.save(); X.beginPath(); X.rect(-w / 2, -h / 2, w, h); X.clip(); X.fillStyle = AMAR; X.fillRect(-w / 2, -h / 2, w, h); X.fillStyle = TINTA; for (let x = -w / 2 - h; x < w / 2 + h; x += 56) { X.beginPath(); X.moveTo(x, -h / 2); X.lineTo(x + 28, -h / 2); X.lineTo(x + 28 - h, h / 2); X.lineTo(x - h, h / 2); X.fill(); } X.restore(); };
  const cai = (txt, cx, y, lt, t0, cor, tw = 84) => { const x0 = cx - (txt.length * (tw + 6) - 6) / 2; for (let i = 0; i < txt.length; i++) { if (txt[i] === " ") continue; const k = lin(lt, t0 + i * .06, t0 + i * .06 + .32); if (k <= 0) continue; const yy = y - (1 - eo(k)) * 240;
      X.save(); X.translate(x0 + i * (tw + 6) + tw / 2, yy); X.rotate((1 - eo(k)) * (i % 2 ? .5 : -.5)); X.fillStyle = cor; X.beginPath(); X.roundRect(-tw / 2, -tw / 2 - 6, tw, tw + 12, 12); X.fill(); X.fillStyle = "#fff"; X.font = `900 ${Math.round(tw * .74)}px FR`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(txt[i], 0, 4); X.restore(); } };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(241,247,247,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1") cai("ALPHAFOLD", 505, 700, lt, 1.6, AGUA2, 84);
      if (nome === "s3") cai("ANOS", 505, 700, lt, .4, ROSA, 96);
      if (nome === "s4") cai("200 MILHÕES", 505, 700, lt, 1.6, OURO, 74); },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(-.04); X.save(); X.translate(0, -112); listras(980, 32); X.restore(); X.save(); X.translate(0, 116); listras(980, 32); X.restore();
      X.fillStyle = TINTA; X.fillRect(-490, -96, 980, 196); X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = "#fff"; cabe(72, l1, 900); X.fillText(l1, 0, -18); X.fillStyle = OURO; cabe(46, l2, 900); X.fillText(l2, 0, 40); X.fillStyle = AGUA; cabe(46, l3, 900); X.fillText(l3, 0, 88); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 74; X.font = `900 ${fs}px FR`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 840 && fs > 42) { fs -= 2; X.font = `900 ${fs}px FR`; }
      const y = 1400; let x = 505 - tot() / 2; const xs = c.map(w => { const r = [x, X.measureText(w.w).width]; x += X.measureText(w.w + " ").width; return r; });
      let fim = xs[0][0] - 10; c.forEach((w, i) => { const k = lin(t, w.t0, w.t1); if (k > 0) fim = xs[i][0] + xs[i][1] * k + 10; });
      X.fillStyle = "rgba(95,211,196,.85)"; X.beginPath(); X.roundRect(xs[0][0] - 14, y - fs * .45, Math.max(0, fim - xs[0][0] + 14), fs * .84, 8); X.fill();
      X.textAlign = "left"; X.textBaseline = "middle"; c.forEach((w, i) => { X.fillStyle = TINTA; X.lineWidth = 10; X.strokeStyle = "#fff"; X.lineJoin = "round"; X.strokeText(w.w, xs[i][0], y + 4); X.fillText(w.w, xs[i][0], y + 4); }); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .3) return; const k = 1 - lt / .3; X.save(); X.globalAlpha = .55 * k;
      for (let i = 0; i < 26; i++) { const y = 560 + ((i * 137) % 880), w = 300 + (i * 97) % 500, x = ((i * 211 + lt * 6000) % 1500) - 300; X.fillStyle = i % 3 ? "rgba(255,255,255,.6)" : "rgba(31,143,132,.8)"; X.fillRect(x, y, w, 6 + (i % 4) * 5); } X.restore(); X.globalAlpha = 1; },
    fechamento(lt) { [["2024", "Nobel de Química"], ["ALPHAFOLD", "a IA"], ["200 MI", "proteínas"]].forEach(([a, b], i) => { const k = lin(lt, .1 + i * .22, .55 + i * .22), sx = Math.abs(Math.cos(k * Math.PI)), frente = k > .5, x = 210 + i * 300, y = 820;
        X.save(); X.translate(x, y); X.scale(Math.max(.02, sx), 1); X.fillStyle = frente ? "#fff" : AGUA2; X.beginPath(); X.roundRect(-130, -140, 260, 280, 22); X.fill();
        if (frente) { X.fillStyle = TINTA; X.font = `900 ${cabe(60, a, 220)}px FR`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(a, 0, -22); X.fillStyle = "#4a6a6a"; X.font = `700 ${cabe(30, b, 220, 700)}px FR`; X.fillText(b, 0, 40); } else { X.fillStyle = "#fff"; X.font = "900 110px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("?", 0, 8); } X.restore(); });
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(420, 1050); X.scale(p, p); X.fillStyle = AGUA2; X.beginPath(); X.roundRect(-280, -60, 560, 120, 60); X.fill(); X.fillStyle = "#fff"; X.font = `900 ${cabe(72, "Comenta " + CHAVE, 520)}px FR`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 4); X.restore();
      if (lt > 1.3) { X.globalAlpha = eo(lin(lt, 1.3, 1.7)); X.fillStyle = TINTA; X.font = "700 40px FR"; X.textAlign = "center"; X.fillText("Salva pra contar pra alguém", 420, 1160); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: AGUA2, VERDE: OURO, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

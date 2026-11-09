// Reel ⚙️ como funciona "1 palavra que trava o golpe da voz" (clonagem de voz + palavra-código da família; 14/11 09:00). Motor da cena_contagem.
// Identidade: cozinha de casa à noite: geladeira com ímãs e desenhos, telefone fixo de parede com fio enrolado tocando, um gravador de
// fita que "copia" ondas de voz e solta uma voz falsa em balão; no fim o mascote cola na geladeira o bilhete com a palavra secreta (tapada).
// Amarelo-cozinha + azul-azulejo + vermelho-alerta. Elementos: tela de terminal, nome escrito à mão, odômetro (cronômetro da ligação),
// balão de fala do mascote, flash branco, travelling lateral, página de caderno, Fraunces. Mascote de avental; ação: colar o bilhete na geladeira.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const AMAR = "#ffd75e", AZ = "#3b78c4", AZ2 = "#1f4a85", VERM = "#e5484d", TINTA = "#1d2433", FUNDO = "#f6f3ea", CREME = "#fffaf0", VERDE = "#2fb36b";
rim.color.set(0xffe2a8); rim.intensity = 1.3; key.color.set(0xfff6e6); key.intensity = 140; key.position.set(1, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xfff4e0, .58));
// ---------- cozinha ----------
const azT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#e8f0fa"; g.fillRect(0, 0, w, h); g.strokeStyle = "#b7cbe6"; g.lineWidth = 3; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, h); g.stroke(); g.beginPath(); g.moveTo(0, i * 32); g.lineTo(w, i * 32); g.stroke(); } g.fillStyle = AZ; for (let i = 0; i < 8; i++) g.fillRect(12 + (i % 4) * 64, 12 + Math.floor(i / 4) * 128, 8, 8); }); azT.wrapS = azT.wrapT = THREE.RepeatWrapping; azT.repeat.set(5, 2);
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshStandardMaterial({ map: azT, roughness: .5 }), S, 0, 4.5, -2.8).castShadow = false;
const chT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { g.fillStyle = (x + y) % 2 ? "#d9c7a4" : "#efe3c8"; g.fillRect(x * 64, y * 64, 64, 64); } }); chT.wrapS = chT.wrapT = THREE.RepeatWrapping; chT.repeat.set(6, 3);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: chT, roughness: .7 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// geladeira com ímãs
const GEL = new THREE.Group(); GEL.position.set(-1.9, 0, -2.1); S.add(GEL); box(1.3, 2.6, .9, M("#f2f2ef", { roughness: .3 }), GEL, 0, 1.3, 0); box(1.28, .03, .05, M("#ccc"), GEL, 0, 1.75, .46); box(.05, .5, .06, M("#bbb", { metalness: .7 }), GEL, .5, 2.1, .48); box(.05, .6, .06, M("#bbb", { metalness: .7 }), GEL, .5, 1.2, .48);
const desT = ctex(128, 128, g => { g.fillStyle = "#fff"; g.fillRect(0, 0, 128, 128); g.strokeStyle = VERM; g.lineWidth = 6; g.beginPath(); g.arc(64, 60, 30, 0, 7); g.stroke(); g.fillStyle = AZ; g.fillRect(30, 100, 70, 8); });
mesh(new THREE.PlaneGeometry(.45, .45), new THREE.MeshStandardMaterial({ map: desT }), GEL, -.25, 2.15, .46).castShadow = false; [VERM, AZ, VERDE].forEach((c, i) => mesh(new THREE.CylinderGeometry(.05, .05, .03, 12), M(c), GEL, -.45 + i * .2, 1.55, .47).rotation.x = Math.PI / 2);
// bilhete secreto (vai pra geladeira)
const bilT = ctex(256, 200, g => { g.fillStyle = "#fff59d"; g.fillRect(0, 0, 256, 200); g.fillStyle = TINTA; g.font = "700 30px FR"; g.textAlign = "center"; g.fillText("PALAVRA DA FAMÍLIA:", 128, 50); g.fillStyle = TINTA; g.fillRect(40, 92, 176, 52); g.fillStyle = "#fff59d"; g.font = "700 26px FR"; g.fillText("só nós sabemos", 128, 178); });
const BIL = mesh(new THREE.PlaneGeometry(.6, .47), new THREE.MeshStandardMaterial({ map: bilT, side: THREE.DoubleSide }), S); BIL.castShadow = false;
// telefone de parede
const TEL = new THREE.Group(); TEL.position.set(.9, 1.7, -2.72); S.add(TEL); box(.4, .7, .14, M(AMAR, { roughness: .4 }), TEL, 0, 0, 0); const FONE = box(.12, .62, .12, M(AMAR, { roughness: .4 }), TEL, -.24, 0, .1);
const fio = []; for (let i = 0; i < 14; i++) fio.push(mesh(new THREE.TorusGeometry(.04, .01, 6, 10), M(AMAR), TEL, -.24, -.35 - i * .05, .12));
// balcão + gravador que copia a voz
box(2.2, .9, .8, M("#c9a679", { roughness: .6 }), S, 1.6, .45, -2.2); box(2.3, .06, .9, M("#f6f0e2"), S, 1.6, .92, -2.2);
const GRV = new THREE.Group(); GRV.position.set(1.7, .95, -2.1); S.add(GRV); box(.8, .32, .3, M("#2b2b33", { roughness: .4 }), GRV, 0, .16, 0); const rolos = [-.18, .18].map(x => { const r = mesh(new THREE.CylinderGeometry(.09, .09, .04, 16), M("#ddd"), GRV, x, .2, .16); r.rotation.x = Math.PI / 2; return r; }); const luzG = mesh(new THREE.SphereGeometry(.04, 8, 6), E(VERM, 1.5), GRV, .32, .28, .16);
// ondas de voz (anéis que saem do telefone e entram no gravador)
const ONDAS = [0, 1, 2, 3, 4].map(i => { const m = mesh(new THREE.TorusGeometry(.18, .02, 6, 24), new THREE.MeshBasicMaterial({ color: AZ, transparent: true }), S); m.castShadow = false; return m; });
// ---------- mascote: avental de cozinha ----------
const AV = box(1.0, .7, .05, M("#ffffff", { roughness: .8 }), MAS.corpo, 0, .62, .52); const bolso = box(.4, .2, .02, M(VERM), AV, 0, -.15, .03);
const MX = .55, MZ = .7;
const ouve = (lt, ry = -.3) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .55 + Math.sin(lt * 2) * .08], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const susto = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .5, .08), ry: .1, braco: [2.3, 2.3], piscar: 1 }); MAS.g.rotation.z = Math.sin(lt * 18) * .025; };
const cola = (lt, t0) => { const u = lt - t0, k = eio(Math.max(0, Math.min(1, u / 1.0))); pose(MAS, { x: MX + (-1.0 - MX) * k, z: MZ - .7 * k, y: hop(lt, .4, .04), ry: -.2 - .5 * k, braco: [.4, .6 + k * 1.5], piscar: pisca(lt) }); MAS.g.rotation.z = 0;
  BIL.visible = true; if (u < 1.0) { BIL.position.set(MAS.g.position.x + .3, 1.5, MAS.g.position.z + .4); BIL.rotation.set(0, -.5, 0); } else { BIL.position.set(-1.65, 1.95, -1.64); BIL.rotation.set(0, 0, .04); } };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let SEG = 0;
const reset = (lt) => { BIL.visible = false; ONDAS.forEach(o => o.visible = false); FONE.position.set(-.24, 0, .1); luzG.material.emissiveIntensity = .3; };
const toca = (lt, on = 1) => { TEL.rotation.z = on ? Math.sin(lt * 40) * .03 * (Math.floor(lt * 2) % 2) : 0; };
const ondas = (lt, cor) => ONDAS.forEach((o, i) => { const u = (lt * .6 + i / 5) % 1; o.visible = true; o.material.color.set(cor); o.material.opacity = Math.sin(u * Math.PI); o.position.set(.9 + (1.7 - .9) * u, 1.7 - .55 * u + Math.sin(u * Math.PI) * .3, -2.6 + .4 * u); o.rotation.y = 1.2; o.scale.setScalar(1 + u); });
// ---------- travelling lateral ----------
const TR = { gancho: [.9, .1], s1: [1.2, .6], s2: [-.2, .6], s3: [.4, -.4], s4: [-.6, -1.0], cta: [-.4, .2] };
const SHOTS = {}; Object.keys(TR).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a, b] = TR[nome] || TR.cta, x = a + (b - a) * eio(lt / d); cam.position.set(x, 2.3, 6.6); cam.lookAt(x * .5 - .1, 1.45, -1.2); };
const ACT = {
  gancho(lt, d) { reset(lt); toca(lt); SEG = 0; lt < 1.5 ? ouve(lt, .2) : susto(lt); },
  s1(lt, d) { reset(lt); toca(lt, 0); ondas(lt, AZ); luzG.material.emissiveIntensity = 1 + Math.sin(lt * 10); rolos.forEach(r => r.rotation.y = lt * 6); SEG = lt; ouve(lt, .3); },
  s2(lt, d) { reset(lt); toca(lt); ondas(lt, VERM); SEG = 4 + lt; susto(lt); },
  s3(lt, d) { reset(lt); SEG = 0; cola(lt, .6); },
  s4(lt, d) { reset(lt); BIL.visible = true; BIL.position.set(-1.65, 1.95, -1.64); BIL.rotation.set(0, 0, .04); FONE.position.set(-.24, 0, .1); pose(MAS, { x: -.2, z: .5, y: hop(lt, .8, .03), ry: -.3, braco: [.3, lt > 1.5 ? 1.8 : .6], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
  cta(lt, d) { reset(lt); BIL.visible = true; BIL.position.set(-1.65, 1.95, -1.64); pose(MAS, { x: 1.35, z: .6, y: hop(lt, .35, .22), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C; const GY3 = 600;
  const cabe = (f, txt, mx, peso = 900) => { while (f > 20) { X.font = `${peso} ${f}px FR`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const quebra = (txt, mx) => { const ws = txt.split(" "), L = []; let cur = ""; for (const w of ws) { const tt = cur ? cur + " " + w : w; if (X.measureText(tt).width > mx && cur) { L.push(cur); cur = w; } else cur = tt; } if (cur) L.push(cur); return L; };
  const mao = (txt, x, y, lt, t0, fs, cor = TINTA) => { const p = eio(lin(lt, t0, t0 + .8)); X.save(); X.font = `700 ${fs}px CV`; X.textAlign = "left"; X.textBaseline = "middle"; const w = X.measureText(txt).width; X.fillStyle = "rgba(255,255,255,.93)"; X.beginPath(); X.roundRect(x - 24, y - fs * .72, w + 48, fs * 1.44, 18); X.fill(); X.beginPath(); X.rect(x - 6, y - fs, w * p + 12, fs * 2); X.clip(); X.fillStyle = cor; X.fillText(txt, x, y + 4); X.restore(); };
  const odometro = (seg, x, y) => { const mm = Math.floor(seg / 60), ss = Math.floor(seg % 60), s = String(mm).padStart(2, "0") + String(ss).padStart(2, "0"), frac = seg % 1, dw = 58, dh = 82; X.save(); X.translate(x, y); X.fillStyle = "rgba(29,36,51,.93)"; X.beginPath(); X.roundRect(-dw * 2 - 40, -dh / 2 - 46, dw * 4 + 80, dh + 104, 18); X.fill();
    X.fillStyle = "#fff"; X.font = "700 22px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("☎ LIGAÇÃO EM ANDAMENTO", 0, -dh / 2 - 22);
    for (let i = 0; i < 4; i++) { const dx = -dw * 2 - 10 + i * dw + (i > 1 ? 20 : 0), dig = +s[i], rol = i === 3 ? frac : 0; X.save(); X.beginPath(); X.rect(dx + 3, -dh / 2, dw - 6, dh); X.clip(); X.fillStyle = CREME; X.fillRect(dx + 3, -dh / 2, dw - 6, dh); X.fillStyle = TINTA; X.font = "900 60px FR"; for (const k of [0, 1]) X.fillText(String((dig + k) % 10), dx + dw / 2, 4 + (k - rol) * dh); X.restore(); }
    X.fillStyle = "#fff"; X.font = "900 56px FR"; X.fillText(":", 0, 0); X.fillStyle = "#c9d3e6"; X.font = "700 20px FR"; X.fillText("exemplo ilustrativo", 0, dh / 2 + 22); X.restore(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(246,243,234,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1" || nome === "s2") odometro(SEG, 760, 760);
      if (nome === "s1") mao("voz clonada", 90, 700, lt, 1.4, 72, AZ2);
      if (nome === "s2") mao("emergência + dinheiro", 90, 700, lt, 1.0, 62, VERM);
      if (nome === "s3") mao("palavra secreta", 90, 700, lt, 1.6, 76, VERDE); },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410);
      X.fillStyle = "#121826"; X.beginPath(); X.roundRect(-460, -140, 920, 280, 18); X.fill(); X.fillStyle = "#283247"; X.beginPath(); X.roundRect(-460, -140, 920, 42, [18, 18, 0, 0]); X.fill();
      [VERM, AMAR, VERDE].forEach((c, i) => { X.fillStyle = c; X.beginPath(); X.arc(-428 + i * 30, -119, 9, 0, 7); X.fill(); });
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = VERDE; X.font = "900 54px FR"; X.fillText(">", -430, -30); X.fillStyle = "#fff"; cabe(60, l1, 800); X.fillText(l1, -385, -30);
      X.fillStyle = AMAR; cabe(48, l2, 840, 700); X.fillText(l2, -430, 38); X.fillStyle = "#b9d4ff"; cabe(44, l3, 800, 700); X.fillText(l3, -430, 100); if (Math.floor(t * 2) % 2 === 0) { const w = X.measureText(l3).width; X.fillRect(-420 + w, 66, 22, 40); } X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ws = seg.palavras, ch = []; let cur = []; for (const w of ws) { cur.push(w); if (/[.,:?!]$/.test(w.w) || cur.length >= 5) { ch.push(cur); cur = []; } } if (cur.length) ch.push(cur);
      let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      X.font = "900 62px FR"; const L = quebra(c.map(w => w.w).join(" "), 740), h = 40 + L.length * 72, y0 = 1490 - h, x0 = 110, w0 = 820;
      X.save(); X.shadowColor = "rgba(0,0,0,.3)"; X.shadowBlur = 22; X.fillStyle = "#fff"; X.beginPath(); X.roundRect(x0, y0, w0, h, 40); X.fill(); X.beginPath(); X.moveTo(x0 + 330, y0 + 4); X.lineTo(x0 + 360, y0 - 56); X.lineTo(x0 + 420, y0 + 4); X.fill(); X.restore();
      X.textAlign = "left"; X.textBaseline = "middle"; let k = 0; L.forEach((l, i) => { const lw = X.measureText(l).width; let xx = x0 + (w0 - lw) / 2; for (const pw of l.split(" ")) { const wd = c[k++]; const on = wd && t >= wd.t0 - .02, atual = on && wd && t < wd.t1 + .2;
        X.fillStyle = pw.replace(/[.,!?:]/g, "").toUpperCase() === CHAVE ? VERM : atual ? AZ : on ? TINTA : "rgba(29,36,51,.3)"; X.fillText(pw, xx, y0 + 56 + i * 72); xx += X.measureText(pw + " ").width; } }); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .22) return; X.fillStyle = `rgba(255,255,255,${1 - lt / .22})`; X.fillRect(0, 0, 1080, 1920); },
    fechamento(lt) { X.save(); X.translate(505, 880); X.scale(.85, .85); X.rotate(-.015); X.shadowColor = "rgba(0,0,0,.25)"; X.shadowBlur = 24; X.fillStyle = "#fffdf6"; X.fillRect(-430, -270, 860, 470); X.shadowColor = "transparent";
      X.strokeStyle = "rgba(59,120,196,.3)"; X.lineWidth = 2; for (let y = -190; y < 200; y += 80) { X.beginPath(); X.moveTo(-430, y + 40); X.lineTo(430, y + 40); X.stroke(); } X.strokeStyle = "rgba(229,72,77,.5)"; X.beginPath(); X.moveTo(-350, -270); X.lineTo(-350, 200); X.stroke();
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = AZ2; X.font = "900 54px FR"; X.fillText("Palavra-código da família:", -320, -200);
      [["1.", "combina hoje, ao vivo"], ["2.", "nunca põe na internet"], ["3.", "não sabe? desliga e liga você"]].forEach(([n, s], i) => { const k = lin(lt, .15 + i * .2, .45 + i * .2); if (k <= 0) return; X.globalAlpha = k; const y = -110 + i * 80; X.fillStyle = VERM; X.font = "900 48px FR"; X.fillText(n, -320, y); X.fillStyle = TINTA; X.font = `700 ${cabe(46, s, 640, 700)}px FR`; X.fillText(s, -265, y); X.globalAlpha = 1; });
      X.restore();
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(400, 1180); X.scale(p, p); X.fillStyle = VERM; X.beginPath(); X.roundRect(-300, -62, 600, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = "900 76px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 4); X.restore();
      if (lt > 1.3) { X.globalAlpha = eo(lin(lt, 1.3, 1.7)); X.fillStyle = TINTA; X.font = "700 42px FR"; X.textAlign = "center"; X.fillText("Manda pra sua família hoje", 400, 1290); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: AZ, VERDE: AMAR, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

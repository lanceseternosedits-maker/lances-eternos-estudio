// Reel "3 skills que fazem design de agência" (08/11 11:00). Identidade: mesa de luz de designer gráfico vista de frente,
// azul-klein + laranja + branco-papel; réguas, leque de cores, recortes de papel, estilete. Elementos: faixa diagonal de aviso,
// nome com letras caindo e encaixando, odômetro, legenda em balão de fala do mascote, transição em íris, câmera em órbita,
// fechamento em página de caderno, Archivo Black. Mascote de boina, ação principal: carimbar. Sem logos de terceiros.
export default function (K) {
const { rim, key, THREE, S, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const KLEIN = "#1f3fd6", KESC = "#0c1a66", LAR = "#ff6a1a", PAPEL = "#f5f1e8", TINTA = "#101425", AMAR = "#ffd23f";

// ---------- cenário: mesa de luz ----------
const mesa = new THREE.Group(); S.add(mesa);
const gradeT = ctex(512, 512, (g, w, h) => { g.fillStyle = "#fbfbff"; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(31,63,214,.18)"; g.lineWidth = 2;
  for (let i = 0; i <= w; i += 32) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); } });
gradeT.wrapS = gradeT.wrapT = THREE.RepeatWrapping; gradeT.repeat.set(4, 2.4);
const tampo = mesh(new THREE.BoxGeometry(9, .25, 5.2), [M("#d9d9e6"), M("#d9d9e6"), new THREE.MeshStandardMaterial({ map: gradeT, emissive: "#ffffff", emissiveMap: gradeT, emissiveIntensity: .35, roughness: .6 }), M("#d9d9e6"), M(LAR), M("#d9d9e6")], mesa, 0, -.125, 0);
box(9.04, .06, .08, E(LAR, .8), mesa, 0, -.02, 2.6);
// régua com marquinhas
const reguaT = ctex(512, 48, (g, w, h) => { g.fillStyle = PAPEL; g.fillRect(0, 0, w, h); g.fillStyle = TINTA; for (let i = 0; i < 64; i++) g.fillRect(i * 8, 0, 2, i % 5 ? 12 : 24); });
const regua = (x, z, ry, L = 3) => { const r = mesh(new THREE.BoxGeometry(L, .03, .32), [M(PAPEL), M(PAPEL), new THREE.MeshStandardMaterial({ map: reguaT, roughness: .5 }), M(PAPEL), M(PAPEL), M(PAPEL)], mesa, x, .015, z); r.rotation.y = ry; return r; };
regua(-2.6, 1.6, .25); regua(2.9, 1.9, -.4, 2.2); regua(3.4, -1.6, 1.2, 2.6);
// leque de cores (chips genéricos, sem marca)
const leque = new THREE.Group(); leque.position.set(-3.4, .03, -.9); mesa.add(leque); const chips = [];
["#ff6a1a", "#ffd23f", "#2ec27e", "#1f3fd6", "#8a3ffc", "#ff3d7f", "#101425"].forEach((c, i) => { const p = new THREE.Group(); leque.add(p); mesh(new THREE.BoxGeometry(.32, .015, 1.5), M(c, { roughness: .5 }), p, 0, i * .016, .7); chips.push(p); });
// recortes de papel colorido deitados na mesa
const recortes = [];
for (let i = 0; i < 9; i++) { const forma = i % 3 === 0 ? new THREE.CircleGeometry(.22, 24) : i % 3 === 1 ? new THREE.CircleGeometry(.26, 3) : new THREE.PlaneGeometry(.38, .26);
  const m = mesh(forma, M([LAR, KLEIN, AMAR, "#ff3d7f"][i % 4], { side: THREE.DoubleSide }), mesa, -4 + (i * 1.13) % 8, .012 + i * .001, -2 + (i * .71) % 1.4); m.rotation.set(-Math.PI / 2, 0, i * .9); m.castShadow = false; recortes.push(m); }
// estilete
const est = new THREE.Group(); est.position.set(2.2, .05, 1.4); est.rotation.y = .6; mesa.add(est); box(.9, .09, .16, M(AMAR), est, 0, 0, 0); box(.3, .03, .1, M("#d8dde8", { metalness: .9, roughness: .2 }), est, .58, 0, 0);
key.color.set(0xffffff); key.intensity = 95; rim.color.set(0xff6a1a); rim.intensity = 2.0;

// ---------- mascote: boina + carimbo ----------
const boina = new THREE.Group(); boina.position.set(.12, 1.56, 0); boina.rotation.z = -.18; MAS.corpo.add(boina);
mesh(new THREE.CylinderGeometry(.55, .5, .12, 28), M(KESC, { roughness: .8 }), boina, 0, 0, 0); mesh(new THREE.CylinderGeometry(.04, .04, .1, 8), M(KESC), boina, 0, .1, 0);
const carimbo = new THREE.Group(); carimbo.position.set(.36, -.22, .15); MAS.bracos[1].add(carimbo);
mesh(new THREE.CylinderGeometry(.07, .09, .32, 14), M("#8a5a34", { roughness: .7 }), carimbo, 0, .1, 0); mesh(new THREE.SphereGeometry(.1, 14, 10), M("#8a5a34"), carimbo, 0, .3, 0);
box(.3, .08, .22, M("#2a2a33"), carimbo, 0, -.08, 0); box(.28, .04, .2, M(LAR, { roughness: .9 }), carimbo, 0, -.14, 0);
// carimbar: braço sobe e desce; "bate" devolve true no instante do impacto
function carimba(lt, x, per = .7, z = .3, ry = .25) { const f = (lt % per) / per, alto = f < .55 ? eo(f / .55) : 1 - eio((f - .55) / .45);
  pose(MAS, { x, z, ry, y: hop(lt, per, .03), braco: [.3, .1 + alto * 1.1], sq: f > .95 || f < .04 ? .08 : 0, piscar: pisca(lt) }); return f > .95 || f < .04; }

// cavalete (moldura em pé) reaproveitável
function cavalete(par, x, z, w, h, ry) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; par.add(g);
  for (const s of [-1, 1]) { const p = box(.06, h + .5, .06, M("#8a5a34"), g, s * (w / 2 - .1), (h + .5) / 2, -.25); p.rotation.x = -.12; } return g; }

// ---------- gancho: orçamento caro na mesa, o mascote carimba "EM MINUTOS" ----------
const gG = grupo("gancho");
const orcT = ctex(512, 640, (g, w, h, ok = 0) => { g.fillStyle = PAPEL; g.fillRect(0, 0, w, h); g.fillStyle = TINTA; g.font = "400 56px AB"; g.textAlign = "center"; g.fillText("ORÇAMENTO", w / 2, 96);
  g.fillStyle = "#c9c2b2"; for (let i = 0; i < 5; i++) g.fillRect(60, 150 + i * 44, 300 - (i % 2) * 90, 16); g.fillStyle = "#d33"; g.font = "400 150px AB"; g.fillText("$$$$", w / 2, 520);
  if (ok) { g.save(); g.translate(w / 2, 300); g.rotate(-.22); g.globalAlpha = .92; g.strokeStyle = LAR; g.lineWidth = 14; g.strokeRect(-220, -80, 440, 160); g.fillStyle = LAR; g.font = "400 76px AB"; g.fillText("MINUTOS", 0, 28); g.restore(); } });
const cavG = cavalete(gG, 1.15, -.2, 1.6, 2.0, -.2); const orc = mesh(new THREE.BoxGeometry(1.6, 2.0, .04), [M(PAPEL), M(PAPEL), M(PAPEL), M(PAPEL), new THREE.MeshStandardMaterial({ map: orcT, roughness: .7 }), M(PAPEL)], cavG, 0, 1.3, 0); orc.rotation.x = -.12;

// ---------- n3 Aixio Layer: arte pronta se separa em 3 camadas ----------
const n3 = grupo("n3"); const cav3 = cavalete(n3, 1.15, -.3, 1.7, 2.1, -.35);
const cam3 = [0, 1, 2].map(k => ctex(400, 500, (g, w, h) => { g.clearRect(0, 0, w, h);
  if (k === 0) { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#ffb37a"); gr.addColorStop(1, "#ff6a1a"); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
  if (k === 1) { g.fillStyle = AMAR; g.beginPath(); g.arc(200, 190, 90, 0, 7); g.fill(); g.fillStyle = KLEIN; g.beginPath(); g.moveTo(0, h); g.lineTo(140, 300); g.lineTo(240, 380); g.lineTo(330, 280); g.lineTo(w, 360); g.lineTo(w, h); g.fill(); }
  if (k === 2) { g.fillStyle = PAPEL; g.font = "400 64px AB"; g.textAlign = "center"; g.fillText("VERÃO", 200, 90); g.fillStyle = TINTA; g.fillRect(110, 440, 180, 30); } }));
const camadas3 = cam3.map((t, k) => { const m = mesh(new THREE.PlaneGeometry(1.6, 2.0), new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: .6, side: THREE.DoubleSide }), cav3, 0, 1.35, 0); m.castShadow = k === 0; return m; });
const etq3 = ["FUNDO", "FORMAS", "TEXTO"].map(s => ctex(160, 48, (g, w, h) => { g.fillStyle = TINTA; g.beginPath(); g.roundRect(0, 0, w, h, 10); g.fill(); g.fillStyle = PAPEL; g.font = "400 28px AB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(s, w / 2, h / 2 + 2); }));
const placas3 = etq3.map(t => { const m = mesh(new THREE.PlaneGeometry(.9, .27), new THREE.MeshBasicMaterial({ map: t, transparent: true }), cav3, 0, 0, 0); m.castShadow = false; return m; });

// ---------- n2 skill de site premiado: janela de navegador se monta e ganha uma medalha ----------
const n2 = grupo("n2"); const nav = new THREE.Group(); nav.position.set(1.15, 1.35, -.3); nav.rotation.y = -.3; n2.add(nav);
box(2.1, 1.5, .06, M("#e9e9f2"), nav, 0, 0, 0); box(2.1, .16, .07, M(TINTA), nav, 0, .67, .005); [-.92, -.8, -.68].forEach((x, i) => mesh(new THREE.CircleGeometry(.035, 12), M(["#ff5f57", "#febc2e", "#28c840"][i]), nav, x, .67, .045));
const secoes = [[2.0, .5, 0, .28, KLEIN], [.62, .4, -.66, -.27, LAR], [.62, .4, 0, -.27, AMAR], [.62, .4, .66, -.27, "#ff3d7f"]].map(([w, h, x, y, c]) => { const m = box(w, h, .05, M(c, { roughness: .4 }), nav, x, y, .06); return m; });
const tituloT = ctex(512, 96, g => { g.fillStyle = PAPEL; g.font = "400 60px AB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("ESTÚDIO NOVA", 256, 52); });
const titulo = mesh(new THREE.PlaneGeometry(1.5, .28), new THREE.MeshBasicMaterial({ map: tituloT, transparent: true }), nav, 0, .28, .09); titulo.castShadow = false;
const medalha = new THREE.Group(); nav.add(medalha); medalha.position.set(.95, .62, .25);
mesh(new THREE.CylinderGeometry(.26, .26, .06, 32), M("#e8b931", { metalness: .85, roughness: .25 }), medalha, 0, 0, 0).rotation.x = Math.PI / 2;
const estrelaT = ctex(128, 128, g => { g.fillStyle = "#fff6d0"; g.font = "400 96px AB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("★", 64, 70); });
mesh(new THREE.CircleGeometry(.2, 24), new THREE.MeshBasicMaterial({ map: estrelaT, transparent: true }), medalha, 0, 0, .035);
for (const s of [-1, 1]) box(.1, .3, .02, M(s < 0 ? KLEIN : LAR), medalha, s * .09, -.3, -.02).rotation.z = s * .3;

// ---------- n1 Dimensional Drawing: tela de app se ergue em camadas 3D flutuantes ----------
const n1 = grupo("n1"); const app = new THREE.Group(); app.position.set(1.0, 1.35, -.2); app.scale.setScalar(1.35); n1.add(app);
const vidro = (c, o = .85) => new THREE.MeshPhysicalMaterial({ color: c, roughness: .18, metalness: 0, clearcoat: 1, transparent: true, opacity: o });
const k1 = []; const add1 = (o, base) => { o.userData.b = base; k1.push(o); return o; };
add1(box(1.2, 2.2, .06, vidro("#f4f6fb", .95), app, 0, 0, 0), 0);
add1(box(1.0, .5, .05, vidro("#7fa6ff"), app, 0, .65, 0), 1);
add1(box(.44, .44, .05, vidro("#ffab7a"), app, -.25, 0, 0), 2); add1(box(.44, .44, .05, vidro("#6fdcaa"), app, .25, 0, 0), 2);
add1(box(.9, .22, .05, M(LAR, { roughness: .3 }), app, 0, -.7, 0), 3);
const icT = ctex(128, 128, g => { g.fillStyle = KLEIN; g.beginPath(); g.roundRect(8, 8, 112, 112, 30); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(64, 64, 26, 0, 7); g.fill(); });
add1(mesh(new THREE.PlaneGeometry(.36, .36), new THREE.MeshBasicMaterial({ map: icT, transparent: true }), app, 0, .65, 0), 4);
const brilhos = []; for (let i = 0; i < 18; i++) { const b = mesh(new THREE.OctahedronGeometry(.05), E(i % 2 ? AMAR : "#ffffff", 2.5), n1, 0, 0, 0); b.castShadow = false; brilhos.push({ b, a: rnd() * 6, r: 1.1 + rnd() * .6, y: .4 + rnd() * 2.2, v: .4 + rnd() * .6 }); }

// ---------- fechamento: recortes de papel caindo ----------
const cG = grupo("cta"); const queda = [];
for (let i = 0; i < 40; i++) { const g = i % 3 === 0 ? new THREE.CircleGeometry(.1, 16) : i % 3 === 1 ? new THREE.CircleGeometry(.12, 3) : new THREE.PlaneGeometry(.16, .11);
  const m = mesh(g, M([LAR, KLEIN, AMAR, "#ff3d7f", PAPEL][i % 5], { side: THREE.DoubleSide }), cG, 0, 0, 0); m.castShadow = false; queda.push({ m, x: (rnd() - .5) * 6, z: -1.5 + rnd() * 2.5, y0: 3 + rnd() * 4, v: .5 + rnd() * .5, w: 1 + rnd() * 4 }); }

// ---------- câmera: órbita ----------
const SHOTS = {}; ["gancho", "n3", "n2", "n1", "cta"].forEach(n => SHOTS[n] = [[V(0, 2.2, 6), V(.2, 1.1, 0)], [V(0, 2.2, 6), V(.2, 1.1, 0)]]);
const alvo = { gancho: [.1, 1.05, 0], n3: [.2, 1.15, -.2], n2: [.2, 1.15, -.2], n1: [.2, 1.25, -.1], cta: [0, 1.0, 0] };
const sentido = { gancho: 1, n3: -1, n2: 1, n1: -1, cta: 1 };
const camera = (cam, nome, lt, d) => { const [ax, ay, az] = alvo[nome] || alvo.cta, a = sentido[nome] * (-.42 + eio(lt / d) * .84), r = nome === "n1" ? 6.3 : 6.0;
  cam.position.set(ax + Math.sin(a) * r, 2.15 + Math.sin(lt * .8) * .08, az + Math.cos(a) * r); cam.lookAt(ax, ay, az); };

const anima = lt => { chips.forEach((p, i) => p.rotation.y = -.2 + i * (.16 + Math.sin(lt * 1.3) * .03)); };
const ACT = {
  gancho(lt, d) { anima(lt); carimbo.visible = true; const corte = 2.95; // 2ª frase começa ~2 s: carimbo bate
    if (lt < corte) { pose(MAS, { x: -1.1, z: .4, ry: .45, y: hop(lt, .5, .05), braco: [.3, .3 + Math.sin(lt * 3) * .1], piscar: pisca(lt) }); orcT.draw(0); }
    else { const bate = carimba(lt - corte + .35, -.35, .7, .55, .55); if (lt > corte + .35) orcT.draw(1); }
    return lt > corte + .3 && lt < corte + .45 ? .03 : 0; },
  n3(lt, d) { anima(lt); carimba(lt, -1.15); const p = eio(lin(lt, .4, 1.4));
    camadas3.forEach((m, k) => { m.position.set(p * (k - 1) * .25, 1.35 + p * (k - 1) * .05, k * .03 + p * k * .55); m.rotation.y = p * .35; });
    placas3.forEach((m, k) => { const a = eo(lin(lt, 1.2 + k * .2, 1.6 + k * .2)); m.visible = a > 0; m.position.set(-1.25 + p * (k - 1) * .25, .55 + k * .6, k * .03 + p * k * .55 + .02); m.scale.setScalar(Math.max(.01, a)); m.rotation.y = .35; }); },
  n2(lt, d) { anima(lt); carimba(lt, -1.2);
    secoes.forEach((m, i) => { const s = back(lin(lt, .3 + i * .25, .7 + i * .25)); m.scale.set(Math.max(.01, s), Math.max(.01, s), 1); }); titulo.scale.setScalar(Math.max(.01, back(lin(lt, .5, .9))));
    const md = back(lin(lt, 1.6, 2.1)); medalha.scale.setScalar(Math.max(.01, md)); medalha.rotation.y = Math.sin(lt * 2) * .4; },
  n1(lt, d) { anima(lt); carimbo.visible = true; const p = eio(lin(lt, .3, 1.5));
    app.rotation.set(-.15 - p * .35, -.5 + p * .25 + Math.sin(lt * .8) * .05, -p * .12); app.position.y = 1.35 + Math.sin(lt * 1.5) * .05 + p * .15;
    k1.forEach(o => o.position.z = o.userData.b * p * .5);
    brilhos.forEach(B => { const a = B.a + lt * B.v; B.b.position.set(1.0 + Math.cos(a) * B.r, B.y + Math.sin(lt * 2 + B.a) * .1, -.2 + Math.sin(a) * B.r * .6); B.b.rotation.y = lt * 3; B.b.scale.setScalar(p); });
    pose(MAS, { x: -1.35, z: .4, ry: .45, y: lt > .4 ? hop(lt, .4, .22) : 0, braco: lt > .4 ? [1.3 + Math.sin(lt * 9) * .3, 1.3 + Math.sin(lt * 9 + 1) * .3] : [.3, .3], piscar: lt > .4 && lt < 1.0 ? .35 : pisca(lt) });
    return lt > .4 && lt < .6 ? .025 : 0; },
  cta(lt, d) { carimba(lt, .9, .6, .6, -.35); queda.forEach(P => { const y = ((P.y0 - lt * P.v * 2) % 5 + 5) % 5; P.m.position.set(P.x + Math.sin(lt + P.w) * .3, y, P.z); P.m.rotation.set(lt * P.w, lt * 2, P.w); }); },
};

// ---------- elementos de tela (2D) ----------
const ui = C => { const { X, ITENS, SEGR, CHAVE, eo, lin, eio, back, blocos } = C; let SEG3 = null;
  const cabe = (t, f, mx, fam = "AB") => { while (f > 20) { X.font = `400 ${f}px ${fam}`; if (X.measureText(t).width <= mx) break; f -= 2; } return f; };
  const listras = (x, y, w, h) => { X.save(); X.beginPath(); X.rect(x, y, w, h); X.clip(); X.fillStyle = TINTA; X.fillRect(x, y, w, h); X.fillStyle = AMAR; for (let i = -h; i < w; i += 36) { X.beginPath(); X.moveTo(x + i, y + h); X.lineTo(x + i + 18, y + h); X.lineTo(x + i + 18 + h, y); X.lineTo(x + i + h, y); X.fill(); } X.restore(); };
  function header(s, lt) { // tag + nome com letras caindo + odômetro
    X.font = "400 58px AB"; const wt = X.measureText(s.tag).width + 44; X.fillStyle = LAR; X.beginPath(); X.roundRect(60, 590, wt, 84, 14); X.fill(); X.fillStyle = TINTA; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText(s.tag, 82, 634);
    const nome = s.item.toUpperCase(), fs = cabe(nome, 70, 1000 - 60 - wt - 24); X.font = `400 ${fs}px AB`; let x = 60 + wt + 24;
    for (let i = 0; i < nome.length; i++) { const ch = nome[i], w = X.measureText(ch).width, p = lin(lt, .08 + i * .045, .42 + i * .045); if (p > 0) {
      X.save(); X.translate(x + w / 2, 636 - (1 - back(p)) * 260); X.rotate((1 - eo(p)) * (i % 2 ? .5 : -.5)); X.globalAlpha = Math.min(1, p * 3); X.fillStyle = PAPEL; X.shadowColor = "rgba(0,0,0,.35)"; X.shadowBlur = 10; X.fillText(ch, -w / 2, 0); X.restore(); } x += w; }
    // odômetro: 4 rolinhos
    const v = s.estrelas * eio(lin(lt, .4, 2.0)), dw = 74, dh = 104, ox = 60, oy = 712;
    const nd = String(s.estrelas).length, sep = nd === 4 ? 18 : 0; X.fillStyle = TINTA; X.beginPath(); X.roundRect(ox - 10, oy - 10, dw * nd + sep + 40, dh + 20, 16); X.fill();
    for (let i = 0; i < nd; i++) { const pw = Math.pow(10, nd - 1 - i), base = Math.floor(v / pw) % 10, resto = v % pw, fr = pw === 1 ? v % 1 : Math.max(0, resto - (pw - 1)); const xx = ox + i * dw + (i > 0 ? sep : 0);
      X.save(); X.beginPath(); X.roundRect(xx, oy, dw - 8, dh, 8); X.clip(); X.fillStyle = PAPEL; X.fillRect(xx, oy, dw - 8, dh); X.fillStyle = TINTA; X.font = "400 76px AB"; X.textAlign = "center"; X.textBaseline = "middle";
      for (const k of [0, 1]) X.fillText(String((base + k) % 10), xx + (dw - 8) / 2, oy + dh / 2 + 4 + (k - fr) * dh);
      const sg = X.createLinearGradient(0, oy, 0, oy + dh); sg.addColorStop(0, "rgba(0,0,0,.35)"); sg.addColorStop(.25, "rgba(0,0,0,0)"); sg.addColorStop(.75, "rgba(0,0,0,0)"); sg.addColorStop(1, "rgba(0,0,0,.35)"); X.fillStyle = sg; X.fillRect(xx, oy, dw, dh); X.restore();
      if (i === 0 && nd === 4) { X.fillStyle = PAPEL; X.beginPath(); X.arc(ox + dw + 4, oy + dh - 14, 6, 0, 7); X.fill(); } }
    X.fillStyle = PAPEL; X.font = "400 30px AB"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("ESTRELAS", ox + dw * nd + sep + 54, oy + 34); X.fillText("NO GITHUB", ox + dw * nd + sep + 54, oy + 72);
  }
  return {
    fundo(t) { const g = X.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, KLEIN); g.addColorStop(.7, "#1a33b0"); g.addColorStop(1, KESC); X.fillStyle = g; X.fillRect(0, 0, 1080, 1920);
      // tiras de cor e folhas presas na parede, ao fundo
      [[80, 900, LAR], [930, 860, AMAR], [860, 1000, "#ff3d7f"]].forEach(([x, y, c], i) => { X.save(); X.translate(x, y); X.rotate(.1 * (i - 1)); X.fillStyle = "rgba(245,241,232,.18)"; X.fillRect(-60, -80, 120, 160); X.fillStyle = c; X.globalAlpha = .35; X.fillRect(-60, -80, 120, 40); X.restore(); });
      X.strokeStyle = "rgba(245,241,232,.07)"; X.lineWidth = 2; for (let x = 0; x < 1080; x += 90) { X.beginPath(); X.moveTo(x, 0); X.lineTo(x, 1920); X.stroke(); } },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; const ent = 1;
      X.save(); X.translate(540 + (1 - ent) * -1200, 385); X.rotate(-.045); X.fillStyle = LAR; X.fillRect(-640, -92, 1280, 184); listras(-640, -92, 1280, 18); listras(-640, 74, 1280, 18);
      X.textAlign = "center"; X.textBaseline = "middle"; X.fillStyle = TINTA; cabe(l1, 64, 960); X.fillText(l1, 0, -24);
      const p = l2.split(" "), num = p.slice(0, 2).join(" "), resto = " " + p.slice(2).join(" "); const f2 = cabe(l2, 52, 940); const w1 = X.measureText(num).width, w2 = X.measureText(resto).width;
      X.textAlign = "left"; X.fillStyle = PAPEL; X.fillText(num, -(w1 + w2) / 2, 40); X.fillStyle = TINTA; X.fillText(resto, -(w1 + w2) / 2 + w1, 40); X.restore();
      const e2 = 1; X.save(); X.translate(540 + (1 - e2) * 1200, 520); X.rotate(.03); X.fillStyle = PAPEL; X.fillRect(-470, -36, 940, 72); X.fillStyle = KLEIN; X.textAlign = "center"; X.textBaseline = "middle"; cabe(l3, 46, 900); X.fillText(l3, 0, 3); X.restore(); },
    cabecalho(s, lt) { SEG3 = [s, lt]; },
    desenha3D(gl, nome, lt, t) { if (nome === "cta") { X.drawImage(gl, 0, 860); } else X.drawImage(gl, 0, 660);
      const fg = X.createLinearGradient(0, 1430, 0, 1560); fg.addColorStop(0, "rgba(12,26,102,0)"); fg.addColorStop(1, KESC); X.fillStyle = fg; X.fillRect(0, 1430, 1080, 490);
      const sr = SEGR.find(x => x.cena === nome); if (sr && sr.item && SEG3) header(SEG3[0], SEG3[1]); SEG3 = null; },
    legenda(seg, t) { const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 56; X.font = `400 ${fs}px AB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0) - X.measureText(" ").width; while (tot() > 820 && fs > 34) { fs -= 2; X.font = `400 ${fs}px AB`; }
      const bw = tot() + 90, bx = 540 - bw / 2, by = 1360, bh = 118; const pop = back(lin(t - c[0].t0, 0, .18));
      X.save(); X.translate(540, by + bh / 2); X.scale(.85 + .15 * pop, .85 + .15 * pop); X.translate(-540, -(by + bh / 2));
      X.fillStyle = "rgba(0,0,0,.25)"; X.beginPath(); X.roundRect(bx + 8, by + 10, bw, bh, 40); X.fill();
      X.fillStyle = PAPEL; X.beginPath(); X.roundRect(bx, by, bw, bh, 40); X.fill(); X.beginPath(); X.moveTo(Math.max(bx + 50, 300), by + 2); X.lineTo(Math.max(bx + 50, 300) + 70, by + 2); X.lineTo(Math.max(bx + 50, 300) - 20, by - 50); X.fill();
      let x = bx + 45; X.textAlign = "left"; X.textBaseline = "middle"; for (const w of c) { const on = t >= w.t0 - .02; X.fillStyle = on && t < w.t1 + .2 ? LAR : on ? TINTA : "rgba(16,20,37,.3)"; X.fillText(w.w, x, by + bh / 2 + 3); x += X.measureText(w.w + " ").width; } X.restore(); },
    transicao(lt, s, nome) { if (!s.item || lt > .4) return; const r = eio(lt / .4) * 1250; X.save(); X.beginPath(); X.rect(0, 0, 1080, 1920); X.arc(540, 1080, Math.max(1, r), 0, Math.PI * 2, true); X.fillStyle = TINTA; X.fill("evenodd");
      X.strokeStyle = LAR; X.lineWidth = 18; X.beginPath(); X.arc(540, 1080, Math.max(1, r), 0, 7); X.stroke(); X.restore(); },
    fechamento(lt) { const e = eo(lin(lt, 0, .4)); X.save(); X.translate(0, (1 - e) * 300); X.globalAlpha = e;
      X.save(); X.translate(540, 905); X.rotate(-.02); X.fillStyle = "rgba(0,0,0,.3)"; X.fillRect(-440, -300, 900, 630); X.fillStyle = "#fffdf6"; X.fillRect(-450, -315, 900, 630);
      X.strokeStyle = "rgba(31,63,214,.25)"; X.lineWidth = 2; for (let y = -235; y < 315; y += 70) { X.beginPath(); X.moveTo(-450, y); X.lineTo(450, y); X.stroke(); } X.strokeStyle = "rgba(220,40,40,.5)"; X.beginPath(); X.moveTo(-340, -315); X.lineTo(-340, 315); X.stroke();
      X.fillStyle = KESC; for (let i = 0; i < 4; i++) { X.beginPath(); X.arc(-405, -230 + i * 150, 14, 0, 7); X.fill(); }
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = KLEIN; X.font = "400 50px AB"; X.fillText("AS 3 SKILLS", -310, -250);
      ITENS.forEach((s, i) => { const a = lin(lt, .3 + i * .15, .5 + i * .15); X.globalAlpha = e * a; const y = -170 + i * 70; X.fillStyle = LAR; X.font = "400 42px AB"; X.fillText(s.tag, -310, y); X.fillStyle = TINTA; X.font = `400 ${cabe(s.item, 42, 470)}px AB`; X.fillText(s.item, -230, y);
        X.textAlign = "right"; X.fillStyle = KLEIN; X.font = "400 34px AB"; X.fillText(s.estrelas.toLocaleString("pt-BR") + " ★", 420, y); X.textAlign = "left"; });
      X.globalAlpha = e; const p = back(lin(lt, .8, 1.2)); X.save(); X.translate(60, 175); X.rotate(-.05); X.scale(p, p); X.font = "400 68px AB"; const w1 = X.measureText("COMENTA ").width, w2 = X.measureText(CHAVE).width;
      X.fillStyle = LAR; X.beginPath(); X.roundRect(-(w1 + w2) / 2 - 30, -55, w1 + w2 + 60, 110, 20); X.fill(); X.textBaseline = "middle"; X.fillStyle = "#fff"; X.fillText("COMENTA ", -(w1 + w2) / 2, 4); X.fillStyle = TINTA; X.fillText(CHAVE, -(w1 + w2) / 2 + w1, 4); X.restore();
      X.restore(); X.restore(); },
  }; };
const cores = { LAR, VERDE: AMAR, FUNDO: KESC, CREME: PAPEL, TINTA, BRILHO: "rgba(255,106,26,.08)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

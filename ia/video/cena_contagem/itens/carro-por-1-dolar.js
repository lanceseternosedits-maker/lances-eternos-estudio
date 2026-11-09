// Reel 📜 história "O robô que vendeu um carro por 1 dólar" (concessionária na Califórnia, dez/2023; 11/11 21:30). Motor da cena_contagem.
// Identidade: pátio de concessionária à noite com bandeirolas e postes de luz; um SUV de blocos (genérico, sem logo) com etiqueta de
// preço gigante que despenca até "US$ 1"; totem de atendimento com cara de robô e balões de chat. Azul-noite + verde-dólar.
// Elementos (trocados na produção para não repetir o Bizarros): faixa diagonal de aviso, nome com letras caindo (US$ 1), sem contador
// (história), legenda em bloco de 4 palavras com a atual colorida, virada de página, travelling lateral, cartões que viram, Bebas Neue.
// Mascote com a chave do carro pendurada no braço (fora do rosto); ação principal: pular de alegria em cima do capô.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const NOITE = "#0f1a3a", NOITE2 = "#1b2c5e", DOLAR = "#2ecc71", DOLAR2 = "#1e9e55", AMAR = "#ffd23f", BRANCO = "#ffffff", TINTA = "#0b1124", FUNDO = "#0d1630", VERM = "#ff4d4d";
rim.color.set(0x7fa8ff); rim.intensity = 1.8; key.color.set(0xeaf1ff); key.intensity = 130; key.position.set(1, 9, 6); key.target.position.set(0, .8, -.3);
S.add(new THREE.AmbientLight(0x3a4a8a, .8));
// ---------- pátio ----------
const ceuT = ctex(512, 256, (g, w, h) => { const sk = g.createLinearGradient(0, 0, 0, h); sk.addColorStop(0, "#0a1230"); sk.addColorStop(1, "#24366e"); g.fillStyle = sk; g.fillRect(0, 0, w, h); g.fillStyle = "#fff"; for (let i = 0; i < 60; i++) g.fillRect((i * 97) % w, (i * 53) % 150, 2, 2);
  g.fillStyle = "#1a2448"; g.fillRect(0, 170, w, h); g.fillStyle = "rgba(255,230,150,.6)"; for (let x = 10; x < w; x += 36) g.fillRect(x, 190, 18, 12); });
mesh(new THREE.PlaneGeometry(26, 12), new THREE.MeshBasicMaterial({ map: ceuT }), S, 0, 5, -5).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(26, 14), M("#2a3040", { roughness: .5, metalness: .2 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
for (let i = -3; i <= 3; i++) { const f = box(.08, .01, 1.6, M("#e8e8e8"), S, i * 1.6, .006, .4); }
// bandeirolas
const cores = [VERM, AMAR, DOLAR, "#4da3ff"]; for (let i = 0; i < 14; i++) { const b = mesh(new THREE.ConeGeometry(.12, .26, 3), M(cores[i % 4]), S, -3.4 + i * .52, 3.0 - Math.sin(i / 13 * Math.PI) * .3, -1.8); b.rotation.z = Math.PI; b.castShadow = false; }
for (const x of [-3.6, 3.6]) { box(.1, 3.2, .1, M("#888"), S, x, 1.6, -1.8); const l = mesh(new THREE.SphereGeometry(.18, 12, 8), E("#fff3c4", 2), S, x, 3.25, -1.8); l.castShadow = false; }
// SUV de blocos (genérico)
const CAR = new THREE.Group(); CAR.position.set(.6, 0, -.6); S.add(CAR); const lat = M("#d9dee8", { metalness: .5, roughness: .3 });
box(2.6, .8, 1.3, lat, CAR, 0, .7, 0); box(1.7, .6, 1.2, lat, CAR, -.25, 1.4, 0); box(1.6, .48, 1.22, M("#1d2a44", { roughness: .1, metalness: .6 }), CAR, -.25, 1.42, 0);
for (const [x, z] of [[-.85, .62], [.85, .62], [-.85, -.62], [.85, -.62]]) mesh(new THREE.CylinderGeometry(.32, .32, .25, 18), M("#111"), CAR, x, .32, z).rotation.x = Math.PI / 2;
const farol = [-0.4, 0.4].map(z => box(.04, .14, .3, E("#fffbe0", 2), CAR, 1.31, .85, z));
// etiqueta de preço gigante
const precoT = ctex(256, 128, (g, w, h, k = 0) => { g.fillStyle = AMAR; g.beginPath(); g.moveTo(30, 0); g.lineTo(w, 0); g.lineTo(w, h); g.lineTo(30, h); g.lineTo(0, h / 2); g.closePath(); g.fill(); g.fillStyle = TINTA; g.beginPath(); g.arc(28, h / 2, 9, 0, 7); g.fill();
  g.fillStyle = TINTA; g.textAlign = "center"; g.textBaseline = "middle"; if (k < 1) { g.font = "400 62px BB"; g.fillText("PREÇO CHEIO", 148, 66); if (k > 0) { g.strokeStyle = VERM; g.lineWidth = 10; g.beginPath(); g.moveTo(50, 70); g.lineTo(50 + 200 * k, 60); g.stroke(); } } else { g.fillStyle = DOLAR2; g.font = "400 96px BB"; g.fillText("US$ 1", 148, 70); } });
const TAG = mesh(new THREE.PlaneGeometry(1.5, .75), new THREE.MeshStandardMaterial({ map: precoT, side: THREE.DoubleSide }), S, .5, 2.45, -.5); const fioT = box(.02, .5, .02, M("#ddd"), S, .5, 2.1, -.5);
let precoU = -1; const preco = k => { const u = Math.round(k * 10); if (u !== precoU) { precoU = u; precoT.draw(k); } };
// totem com cara de robô + balões de chat
const TOT = new THREE.Group(); TOT.position.set(-1.9, 0, -.9); S.add(TOT); box(.7, 1.9, .4, M("#2b3b6b"), TOT, 0, .95, 0); const telaTot = box(.56, .5, .02, E("#7fd0ff", .6), TOT, 0, 1.45, .21);
for (const x of [-.12, .12]) box(.07, .14, .01, M("#0b1124"), TOT, x, 1.48, .225);
const balT = (txt, cor) => ctex(320, 120, g => { g.fillStyle = cor; g.beginPath(); g.roundRect(4, 4, 312, 96, 24); g.fill(); g.beginPath(); g.moveTo(40, 96); g.lineTo(26, 120); g.lineTo(76, 96); g.fill(); g.fillStyle = cor === BRANCO ? TINTA : BRANCO; g.font = "400 40px BB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 160, 54); });
const BALS = [["CONCORDO COM TUDO ✓", BRANCO], ["OFERTA COM VALOR LEGAL", DOLAR2], ["NEGÓCIO FECHADO!", DOLAR2]].map(([t, c]) => { const m = mesh(new THREE.PlaneGeometry(1.6, .6), new THREE.MeshBasicMaterial({ map: balT(t, c), transparent: true, side: THREE.DoubleSide }), S); m.castShadow = false; m.visible = false; return m; });
// ---------- mascote: chave do carro pendurada no braço direito (fora do rosto) ----------
const CH = new THREE.Group(); CH.position.set(.42, -.12, .16); MAS.bracos[1].add(CH); mesh(new THREE.TorusGeometry(.07, .015, 6, 16), M("#ccc", { metalness: .8 }), CH, 0, 0, 0); box(.14, .2, .05, M("#222"), CH, 0, -.14, 0);
const MZ = .6;
const chao2 = (lt, x, ry = .3) => { pose(MAS, { x, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .5], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const pula = lt => { pose(MAS, { x: .4, z: -.6, y: 1.1 + hop(lt, .35, .4), ry: .2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], sq: Math.max(0, Math.cos(lt * Math.PI / .35)) * .07, piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
const reset = (lt) => { BALS.forEach(b => b.visible = false); telaTot.material.emissiveIntensity = .5 + .2 * Math.sin(lt * 4); TAG.rotation.z = Math.sin(lt * 1.5) * .05; };
const bal = (b, k, y) => { b.visible = k > .01; b.scale.setScalar(Math.max(.01, back(k))); b.position.set(-1.0, y, -.4); };
// ---------- travelling lateral ----------
const TR = { gancho: [-.2, .6], s1: [-1.0, -.4], s2: [-.8, -.2], s3: [.2, .8], s4: [.7, .1], cta: [.2, -.1] };
const SHOTS = {}; Object.keys(TR).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a, b] = TR[nome] || TR.cta, x = a + (b - a) * eio(lt / d); cam.position.set(x, 2.1, 6.3); cam.lookAt(x * .5 + .1, 1.4, -.8); };
const ACT = {
  gancho(lt, d) { reset(lt); preco(Math.min(1, lin(lt, d * .5, d * .9) * 1.0001)); TAG.position.y = 2.4 - (lt > d * .9 ? Math.min(.2, (lt - d * .9) * .8) : 0); chao2(lt, 1.85, -.3); },
  s1(lt, d) { reset(lt); preco(0); telaTot.material.emissiveIntensity = 1.5 + Math.sin(lt * 8) * .5; chao2(lt, -1.0, -.4); },
  s2(lt, d) { reset(lt); preco(0); bal(BALS[0], lin(lt, .8, 1.2), 2.3); bal(BALS[1], lin(lt, 2.2, 2.6), 3.0); chao2(lt, -.9, -.5); },
  s3(lt, d) { reset(lt); const k = lin(lt, 1.0, 2.2); preco(k < 1 ? k * .99 : 1); bal(BALS[2], lin(lt, 2.4, 2.8), 2.6); if (lt < 2.4) chao2(lt, 1.85, -.3); else pula(lt); },
  s4(lt, d) { reset(lt); preco(1); const b = lin(lt, 1.2, 1.8); TAG.rotation.z = b * .6; chao2(lt, 1.85, -.2); },
  cta(lt, d) { reset(lt); preco(1); pula(lt); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px BB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const listras = (w, h) => { X.save(); X.beginPath(); X.rect(-w / 2, -h / 2, w, h); X.clip(); X.fillStyle = AMAR; X.fillRect(-w / 2, -h / 2, w, h); X.fillStyle = TINTA; for (let x = -w / 2 - h; x < w / 2 + h; x += 56) { X.beginPath(); X.moveTo(x, -h / 2); X.lineTo(x + 28, -h / 2); X.lineTo(x + 28 - h, h / 2); X.lineTo(x - h, h / 2); X.fill(); } X.restore(); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(13,22,48,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s3" || nome === "s4") { const txt = "US$ 1", tw = 110, x0 = 505 - (txt.length * (tw + 10) - 10) / 2, t0 = nome === "s4" ? -9 : 1.8;
        for (let i = 0; i < txt.length; i++) { if (txt[i] === " ") continue; const k = lin(lt, t0 + i * .1, t0 + i * .1 + .35); if (k <= 0) continue; const y = 690 - (1 - eo(k)) * 260; X.save(); X.translate(x0 + i * (tw + 10) + tw / 2, y); X.rotate((1 - eo(k)) * (i % 2 ? .5 : -.5));
          X.fillStyle = DOLAR2; X.beginPath(); X.roundRect(-tw / 2, -tw / 2 - 8, tw, tw + 16, 14); X.fill(); X.fillStyle = "#fff"; X.font = "400 110px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(txt[i], 0, 6); X.restore(); } }
      if (nome === "s1") { const a = eo(lin(lt, .3, .7)); X.globalAlpha = a; X.fillStyle = "rgba(255,255,255,.92)"; X.beginPath(); X.roundRect(60, 612, 560, 90, 16); X.fill(); X.fillStyle = TINTA; X.font = "400 52px BB"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("CHAT COM O CHATGPT POR TRÁS", 84, 660); X.globalAlpha = 1; } },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.rotate(.04); X.save(); X.translate(0, -112); listras(980, 32); X.restore(); X.save(); X.translate(0, 116); listras(980, 32); X.restore();
      X.fillStyle = TINTA; X.fillRect(-490, -96, 980, 196); X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = "#fff"; cabe(78, l1, 900); X.fillText(l1, 0, -18); X.fillStyle = DOLAR; cabe(54, l2, 900); X.fillText(l2, 0, 40); X.fillStyle = AMAR; cabe(46, l3, 900); X.fillText(l3, 0, 88); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 80; X.font = `400 ${fs}px BB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 840 && fs > 44) { fs -= 2; X.font = `400 ${fs}px BB`; }
      let x = 505 - tot() / 2; const y = 1400; X.textAlign = "left"; X.textBaseline = "middle";
      for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.lineWidth = 12; X.lineJoin = "round"; X.strokeStyle = TINTA; X.strokeText(w.w, x, y); X.fillStyle = at ? DOLAR : on ? "#fff" : "rgba(255,255,255,.4)"; X.fillText(w.w, x, y); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .42) return; const u = eio(lt / .42), x = 1080 - u * 1500;
      X.save(); X.fillStyle = DOLAR2; X.beginPath(); X.moveTo(x, 0); X.quadraticCurveTo(x - 160, 960, x, 1920); X.lineTo(x + 420, 1920); X.lineTo(x + 420, 0); X.closePath(); X.fill();
      const g = X.createLinearGradient(x - 80, 0, x + 120, 0); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(.6, "rgba(0,0,0,.25)"); g.addColorStop(1, "rgba(0,0,0,0)"); X.fillStyle = g; X.fillRect(x - 80, 0, 200, 1920); X.restore(); },
    fechamento(lt) { [["DEZ 2023", "o caso"], ["US$ 1", "a oferta"], ["NÃO VENDEU", "a loja"]].forEach(([a, b], i) => { const k = lin(lt, .1 + i * .22, .55 + i * .22), sx = Math.abs(Math.cos(k * Math.PI)), frente = k > .5, x = 210 + i * 300, y = 860;
        X.save(); X.translate(x, y); X.scale(Math.max(.02, sx), 1); X.fillStyle = frente ? "#fff" : DOLAR2; X.beginPath(); X.roundRect(-130, -170, 260, 340, 22); X.fill();
        if (frente) { X.fillStyle = DOLAR2; X.font = `400 ${a.length > 7 ? 58 : 76}px BB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(a, 0, -20); X.fillStyle = "#5a6a8a"; X.font = "400 40px BB"; X.fillText(b, 0, 50); } else { X.fillStyle = "#fff"; X.font = "400 140px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("$", 0, 8); } X.restore(); });
      const p = back(lin(lt, .9, 1.3)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 1170); X.scale(p, p); X.fillStyle = DOLAR2; X.beginPath(); X.roundRect(-300, -66, 600, 132, 66); X.fill(); X.fillStyle = "#fff"; X.font = "400 92px BB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 6); X.restore();
      if (lt > 1.3) { X.globalAlpha = eo(lin(lt, 1.3, 1.7)); X.fillStyle = "#fff"; X.font = "400 56px BB"; X.textAlign = "center"; X.fillText("SALVA PRA CONTAR PRA ALGUÉM", 505, 1330); X.globalAlpha = 1; } },
  }; };
const coresM = { LAR: DOLAR, VERDE: AMAR, FUNDO, CREME: BRANCO, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores: coresM, semPalco: true, ui, camera };
}

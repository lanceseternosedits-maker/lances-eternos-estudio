// Reel ⚙️ como funciona "Por que a IA esquece o que você falou" (09/11 08:00). Motor da cena_contagem (mesmo mascote 3D).
// Identidade: escrivaninha de manhã numa parede azul-clara com janela; a mesa tem 6 vagas (a janela de contexto) e cada mensagem
// é uma folha com balão de conversa que entra pela direita; as do começo são empurradas pela borda e caem no chão, as do meio
// ficam cinzas (Lost in the Middle); lousa branca escreve RESUMO e as folhas viram um post-it amarelo numa mesa nova.
// Elementos: etiqueta em papel rasgado com fita, nome em máquina de escrever, odômetro de rolinhos (mensagens na mesa),
// legenda em bloco de 4 palavras com a atual colorida, flash branco, travelling lateral, tela CONTINUE? com contagem, Fraunces.
// Mascote de óculos redondos (aro fino, olhos à mostra); ação principal: catar as folhas que caem da mesa.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const AZUL = "#2f7fd8", AZUL2 = "#1d5fae", CEU = "#cfe6f7", POST = "#ffd84a", POST2 = "#e0a800", CREME = "#fffaf0", TINTA = "#17202e", FUNDO = "#dcecf7", CINZA = "#b9c2cc";
rim.color.set(0xcfe6ff); rim.intensity = 1.1; key.color.set(0xfff6e6); key.intensity = 150; key.position.set(1, 9, 6); key.target.position.set(.3, .9, -.3);
S.add(new THREE.AmbientLight(0xf4f8ff, .55));

// ---------- cenário: parede azul com janela, piso de madeira clara ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#bcdaf0"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,.18)"; for (let x = 0; x < w; x += 32) g.fillRect(x, 0, 14, h);
  g.fillStyle = "#fff"; g.fillRect(300, 30, 150, 120); g.fillStyle = "#9fd3ff"; g.fillRect(308, 38, 64, 50); g.fillRect(378, 38, 64, 50); g.fillRect(308, 94, 64, 50); g.fillRect(378, 94, 64, 50);
  g.fillStyle = "#ffe48a"; g.beginPath(); g.arc(420, 60, 14, 0, 7); g.fill(); g.fillStyle = "#e9eef3"; g.fillRect(0, h - 22, w, 22); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.6).castShadow = false;
const chT = ctex(256, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#d9b88c" : "#cfac7d"; g.fillRect(0, i * 32, w, 32); g.fillStyle = "rgba(120,80,40,.25)"; g.fillRect(0, i * 32 + 31, w, 1); g.fillRect((i * 97) % w, i * 32, 1, 32); } });
chT.wrapS = chT.wrapT = THREE.RepeatWrapping; chT.repeat.set(5, 4);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: chT, roughness: .8 }), S, 0, 0, 2); chao.rotation.x = -Math.PI / 2;

// ---------- a mesa (6 vagas = janela de contexto) ----------
const N = 6, PASSO = .5, SX0 = -.3, TOPO = .95, DZ = -.45;
const slotX = i => SX0 + i * PASSO;
const mad = M("#b07a45", { roughness: .6 });
const MESA = new THREE.Group(); S.add(MESA); box(3.4, .1, 1.1, mad, MESA, slotX(2.5), TOPO - .05, DZ); for (const x of [slotX(0) - .3, slotX(5) + .3]) box(.12, TOPO - .1, .9, M("#8a5c30"), MESA, x, (TOPO - .1) / 2, DZ);
// moldura azul que acende (tamanho fixo)
const molM = E(AZUL, 0); molM.transparent = true; molM.opacity = 0;
const MOL = new THREE.Group(); S.add(MOL); const mw = N * PASSO + .14, mh = .92, mcx = slotX(2.5), mcy = TOPO + .46;
for (const [w, h, x, y] of [[mw, .05, 0, mh / 2], [mw, .05, 0, -mh / 2], [.05, mh, -mw / 2, 0], [.05, mh, mw / 2, 0]]) box(w, h, .05, molM, MOL, mcx + x, mcy + y, DZ + .2);
MOL.children.forEach(o => o.castShadow = false);

// folhas com balão de conversa (a nº 0 tem a estrela: a coisa importante dita no começo)
const folhaT = (j, cinza) => ctex(128, 168, g => { g.fillStyle = cinza ? "#e6e9ec" : CREME; g.fillRect(0, 0, 128, 168); g.strokeStyle = "rgba(0,0,0,.12)"; g.lineWidth = 3; g.strokeRect(1, 1, 126, 166);
  const eu = j % 2 === 0; g.fillStyle = cinza ? CINZA : eu ? AZUL : "#ffffff"; g.beginPath(); g.roundRect(eu ? 26 : 12, 26, 90, 64, 16); g.fill(); if (!eu && !cinza) { g.strokeStyle = "#c9d3de"; g.stroke(); }
  g.fillStyle = cinza ? "#d7dce1" : eu ? "rgba(255,255,255,.85)" : "#9aa7b5"; for (let k = 0; k < 3; k++) g.fillRect((eu ? 38 : 24), 40 + k * 15, 66 - k * 14, 7);
  g.fillStyle = cinza ? CINZA : "#c4ccd5"; for (let k = 0; k < 3; k++) g.fillRect(16, 108 + k * 15, 96 - (k * 23) % 40, 6);
  if (j === 0) { g.fillStyle = POST2; g.font = "700 44px FR"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("★", 106, 22); }
  if (cinza) { g.fillStyle = "#7d8792"; g.font = "700 70px FR"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("?", 64, 92); } });
const NF = 15; const geoF = new THREE.BoxGeometry(.42, .58, .02);
const F = Array.from({ length: NF }, (_, j) => { const n = new THREE.MeshStandardMaterial({ map: folhaT(j, false), roughness: .7 }), c = new THREE.MeshStandardMaterial({ map: folhaT(j, true), roughness: .8 });
  const lado = M("#f2efe6"); const m = mesh(geoF, [lado, lado, lado, lado, n, lado], S); return { m, n, c, j, mats: [lado, lado, lado, lado, n, lado], matsC: [lado, lado, lado, lado, c, lado] }; });
// posição de cada folha para "c" mensagens já chegadas (a mais nova na vaga 5); as empurradas caem pela borda e ficam no chão
function folhas(c, cinzaMeio = 0, junta = 0, alvo = null) {
  F.forEach(f => { const s = (N - 1) - (c - f.j); const m = f.m; m.visible = s <= N - .02 + .9; m.material = f.mats;
    if (s > N - 1) { const u = s - (N - 1); m.position.set(slotX(N - 1) + u * 1.2, TOPO + .32 + u * .4, DZ); m.rotation.set(0, 0, -u * .5); m.visible = u < .95; }
    else if (s >= 0) { m.position.set(slotX(s), TOPO + .31, DZ); m.rotation.set(-.08, 0, 0);
      if (cinzaMeio > 0 && s >= 1.5 && s <= 3.5) { m.material = f.matsC; m.position.y -= cinzaMeio * .04; m.rotation.x = -.08 - cinzaMeio * .25; } }
    else { const u = -s; const x = slotX(0) - Math.min(u, .55) * 1.1, cai = Math.max(0, u - .45);
      const yy = TOPO + .31 - cai * cai * 5.5; const no = yy <= .02; m.position.set(x - cai * .4 - (f.j % 3) * .12, no ? .02 + f.j * .004 : yy, DZ + .25 + (no ? (f.j % 2) * .22 : 0));
      m.rotation.set(no ? -Math.PI / 2 : -cai * 2.2, (f.j * 1.3) % 1, no ? (f.j % 4) * .4 : u * 1.4); }
    if (junta > 0 && m.visible && s >= 0 && s <= N - 1) { const k = eio(junta); m.position.lerp(alvo, k); m.scale.setScalar(1 - k * .9); } else m.scale.setScalar(1); });
}
// post-it amarelo do resumo
const pitT = ctex(256, 256, g => { g.fillStyle = POST; g.fillRect(0, 0, 256, 256); g.fillStyle = "rgba(0,0,0,.06)"; g.fillRect(0, 210, 256, 46); g.fillStyle = TINTA; g.font = "700 46px FR"; g.textAlign = "center"; g.fillText("RESUMO", 128, 70);
  g.fillStyle = "rgba(23,32,46,.55)"; for (let k = 0; k < 5; k++) g.fillRect(40, 102 + k * 24, 176 - (k * 31) % 60, 8); });
const PIT = mesh(new THREE.BoxGeometry(.7, .7, .03), [M(POST), M(POST), M(POST), M(POST), new THREE.MeshStandardMaterial({ map: pitT, roughness: .7 }), M(POST)], S);
// lousa branca atrás da mesa (escreve RESUMO à máquina)
const lsT = ctex(512, 256, (g, w, h, txt = "", sub = "") => { g.fillStyle = "#fbfdff"; g.fillRect(0, 0, w, h); g.strokeStyle = "#9aa7b5"; g.lineWidth = 14; g.strokeRect(7, 7, w - 14, h - 14);
  g.fillStyle = AZUL2; g.font = "700 104px FR"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, w / 2, 110); g.fillStyle = TINTA; g.font = "700 44px FR"; g.fillText(sub, w / 2, 200); });
const LOUSA = mesh(new THREE.BoxGeometry(2.4, 1.2, .06), [M("#9aa7b5"), M("#9aa7b5"), M("#9aa7b5"), M("#9aa7b5"), new THREE.MeshStandardMaterial({ map: lsT, roughness: .5 }), M("#9aa7b5")], S, slotX(2.5) + .2, 2.55, -1.9);
let lsU = ""; const lousa = (txt, sub) => { const u = txt + "|" + sub; if (u !== lsU) { lsU = u; lsT.draw(txt, sub); } };

// ---------- mascote: óculos redondos de aro fino (olhos visíveis); catar folhas ----------
const ocM = M("#2a2f38", { roughness: .3 }); const OC = new THREE.Group(); OC.position.set(0, 1.0, .53); MAS.corpo.add(OC);
for (const x of [-.27, .27]) mesh(new THREE.TorusGeometry(.2, .022, 8, 32), ocM, OC, x, 0, 0); box(.15, .03, .03, ocM, OC, 0, .05, 0);
const MX = -1.4, MZ = .45; const pisca = t => K.pisca(t + .6);
const cata = (lt, f = 1) => { const reach = Math.sin(lt * 5.5) * .35; pose(MAS, { x: MX + Math.sin(lt * 2.2) * .12 * f, z: MZ, y: hop(lt, .4, .04), ry: .45, braco: [1.0 + reach * .5, 1.9 + reach], andar: lt * 1.5 * f, piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const olha = (lt, ry = .5) => { pose(MAS, { x: MX, z: MZ, y: 0, ry, braco: [.35, .5 + Math.sin(lt * 2) * .1], piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(lt * 1.6) * .05; };
const feliz = lt => { pose(MAS, { x: MX + .3, z: MZ, y: hop(lt, .35, .28), ry: .35, braco: [2.1 + Math.sin(lt * 9) * .3, 2.1 + Math.sin(lt * 9 + 1) * .3], sq: Math.max(0, Math.cos(lt * Math.PI / .35)) * .06, piscar: pisca(lt) }); MAS.g.rotation.z = 0; };

grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let C_ATUAL = 5;
const reset = () => { molM.opacity = 0; molM.emissiveIntensity = 0; PIT.visible = false; lousa("", ""); LOUSA.scale.setScalar(.001); };

// ---------- câmera: travelling lateral (desliza em x durante a cena) ----------
const TR = { gancho: [-.35, .3], s1: [.4, -.1], s2: [-.2, .45], s3: [.5, .1], s4: [-.1, .5], cta: [.2, -.1] };
const SHOTS = {}; Object.keys(TR).forEach(n => SHOTS[n] = [[V(0, 2, 6.6), V(.3, 1.2, -.3)], [V(0, 2, 6.6), V(.3, 1.2, -.3)]]);
const camera = (cam, nome, lt, d) => { const [a, b] = TR[nome] || TR.cta, u = eio(lt / d), x = a + (b - a) * u;
  const z = nome === "s3" || nome === "s4" ? 6.0 : 5.4, ly = nome === "s3" || nome === "s4" ? 1.5 : 1.1; cam.position.set(x, 1.9, z); cam.lookAt(x * .55 - .05, ly, -.4); };

const ACT = {
  gancho(lt, d) { reset(); const c = 5 + eio(lin(lt, .4, d - .2)) * 3.4; C_ATUAL = c; folhas(c); if (lt < .6) olha(lt, .3); else cata(lt); },
  s1(lt, d) { reset(); const c = 8.4 + eo(lin(lt, 0, d)) * .6; C_ATUAL = c; folhas(c); const k = eo(lin(lt, .3, 1.0)); molM.opacity = k * .9; molM.emissiveIntensity = k * (1.4 + Math.sin(lt * 6) * .4); olha(lt, .55); },
  s2(lt, d) { reset(); const c = 9 + eio(lin(lt, .2, d * .55)) * 4.5; C_ATUAL = c; const cz = eo(lin(lt, d * .58, d * .58 + .6)); folhas(c, cz); molM.opacity = .5; molM.emissiveIntensity = .8;
    if (lt < d * .55) cata(lt); else olha(lt, .6); },
  s3(lt, d) { reset(); C_ATUAL = 13.5; folhas(13.5, 1); LOUSA.scale.setScalar(Math.max(.001, back(lin(lt, .2, .6)))); const n = Math.floor(lin(lt, 1.4, 2.4) * 6); lousa("RESUMO".slice(0, n), ""); olha(lt, .7); },
  s4(lt, d) { reset(); LOUSA.scale.setScalar(1); lousa("RESUMO", "em 10 linhas"); const j = lin(lt, .3, 1.5), alvo = V(slotX(2.5), TOPO + .5, DZ + .1); folhas(13.5, 1, j, alvo);
    // depois de juntar, as folhas do chão somem e o post-it vai pra mesa nova (limpa)
    const v = lin(lt, 1.4, 1.7); PIT.visible = j > .85; PIT.scale.setScalar(back(v)); const lev = eo(lin(lt, 2.0, 3.0));
    PIT.position.set(slotX(2.5) - lev * 1.4, TOPO + .5 - lev * .12, DZ + .1); PIT.rotation.set(-.08, 0, Math.sin(lt * 2) * .04 - lev * .06);
    if (lev > 0) F.forEach(f => { if (f.m.visible && f.m.position.y < .1) f.m.position.y -= lev * .6; });
    if (lt < 1.5) olha(lt, .6); else feliz(lt); },
  cta(lt, d) { reset(); LOUSA.scale.setScalar(1); lousa("RESUMO", "em 10 linhas"); F.forEach(f => f.m.visible = false); PIT.visible = true; PIT.scale.setScalar(1); PIT.position.set(slotX(2.5) - 1.4, TOPO + .38, DZ + .1); PIT.rotation.set(-.08, 0, -.06); feliz(lt); },
};

// ---------- elementos de tela (2D): tudo entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, blocos } = C; const GY3 = 600;
  const cabe = (f, txt, mx, peso = 700) => { while (f > 22) { X.font = `${peso} ${f}px FR`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const rasgado = (x, y, w, h, s) => { X.beginPath(); X.moveTo(x, y); for (let i = 0; i <= 40; i++) X.lineTo(x + w * i / 40, y + ((i * 7 + s) % 5) * 2.4 - 4); for (let i = 0; i <= 40; i++) X.lineTo(x + w - w * i / 40, y + h + ((i * 11 + s) % 6) * 2.6 - 6); X.closePath(); };
  const odometro = (v, x, y) => { const dig = 2, w = 74, h = 100; X.fillStyle = TINTA; X.beginPath(); X.roundRect(x - 12, y - h / 2 - 12, dig * (w + 8) + 16, h + 24, 16); X.fill();
    for (let i = 0; i < dig; i++) { const un = Math.floor(v) % 10, base = i ? un : Math.floor(v / 10) % 10, fr = i ? v % 1 : (un === 9 ? v % 1 : 0);
      const xx = x + i * (w + 8); X.save(); X.beginPath(); X.roundRect(xx, y - h / 2, w, h, 8); X.clip(); X.fillStyle = "#fffaf0"; X.fillRect(xx, y - h / 2, w, h);
      X.fillStyle = TINTA; X.font = "700 76px FR"; X.textAlign = "center"; X.textBaseline = "middle"; const off = eio(fr) * h;
      X.fillText(String(base), xx + w / 2, y + 4 - off); X.fillText(String((base + 1) % 10), xx + w / 2, y + 4 + h - off);
      const sh = X.createLinearGradient(0, y - h / 2, 0, y + h / 2); sh.addColorStop(0, "rgba(0,0,0,.35)"); sh.addColorStop(.25, "rgba(0,0,0,0)"); sh.addColorStop(.75, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(0,0,0,.35)"); X.fillStyle = sh; X.fillRect(xx, y - h / 2, w, h); X.restore(); }
    X.fillStyle = TINTA; X.font = "700 30px FR"; X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillText("mensagens", x + dig * (w + 8) / 2 - 4, y + h / 2 + 50); };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(220,236,247,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome === "s1" || nome === "s2") { // nome em máquina de escrever + odômetro
        const alvo = "janela de contexto", k = nome === "s2" ? alvo.length : Math.floor(lin(lt, .4, 1.9) * alvo.length), txt = alvo.slice(0, k);
        X.fillStyle = "rgba(255,250,240,.95)"; X.beginPath(); X.roundRect(60, 600, 600, 96, 14); X.fill(); X.strokeStyle = TINTA; X.lineWidth = 4; X.stroke();
        X.fillStyle = TINTA; X.font = "700 54px FR"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText(txt, 86, 650); if (k < alvo.length || (t * 2 % 1) < .5) { const w = X.measureText(txt).width; X.fillStyle = AZUL; X.fillRect(90 + w, 622, 6, 56); } }
      if (nome !== "cta" && nome !== "s3" && nome !== "s4") odometro(Math.min(99, C_ATUAL + 1), 740, 650); },
    etiqueta(t, nome) { // papel rasgado com 2 tiras de fita (sem entrada animada: 1º quadro legível)
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(510, 418); X.rotate(-.018);
      X.shadowColor = "rgba(20,40,70,.25)"; X.shadowBlur = 16; X.shadowOffsetY = 6; X.fillStyle = "#fffdf7"; rasgado(-450, -128, 900, 256, 3); X.fill(); X.shadowColor = "transparent";
      X.fillStyle = "rgba(255,216,74,.7)"; for (const [x, r] of [[-400, -.6], [400, .55]]) { X.save(); X.translate(x, -118); X.rotate(r); X.fillRect(-70, -18, 140, 36); X.restore(); }
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = TINTA; cabe(60, l1, 830); X.fillText(l1, 0, -38);
      X.fillStyle = AZUL2; cabe(56, l2, 830); X.fillText(l2, 0, 30); X.fillStyle = POST2; cabe(46, l3, 830); X.fillText(l3, 0, 92); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { // bloco de 4 palavras, a atual em azul sobre faixa creme
      const ch = blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 64; X.font = `700 ${fs}px FR`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 860 && fs > 38) { fs -= 2; X.font = `700 ${fs}px FR`; }
      const W = tot(); let x = 510 - W / 2; const y = 1405; X.fillStyle = "rgba(255,250,240,.94)"; X.beginPath(); X.roundRect(x - 30, y - fs * .85, W + 44, fs * 1.7, 22); X.fill();
      X.textAlign = "left"; X.textBaseline = "middle"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2;
        const ww = X.measureText(w.w).width; if (at) { X.fillStyle = POST; X.beginPath(); X.roundRect(x - 8, y - fs * .62, ww + 16, fs * 1.24, 10); X.fill(); }
        X.fillStyle = at ? AZUL2 : on ? TINTA : "rgba(23,32,46,.35)"; X.fillText(w.w, x, y + 2); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .14) return; X.fillStyle = `rgba(255,255,255,${.85 * (1 - lt / .14)})`; X.fillRect(0, 0, 1080, 1920); },
    fechamento(lt) { // tela CONTINUE? com contagem num anel azul
      X.fillStyle = "rgba(255,250,240,.93)"; X.beginPath(); X.roundRect(70, 640, 880, 820, 34); X.fill(); X.strokeStyle = AZUL; X.lineWidth = 8; X.stroke();
      const p = back(lin(lt, 0, .4)); X.save(); X.translate(510, 760); X.scale(p, p); X.fillStyle = AZUL2; X.font = "700 104px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("CONTINUE?", 0, 0); X.restore();
      const n = Math.max(0, 9 - Math.floor(lt * 2)), fr = (lt * 2) % 1; X.strokeStyle = "#d6e4f2"; X.lineWidth = 16; X.beginPath(); X.arc(510, 950, 96, 0, 7); X.stroke();
      X.strokeStyle = POST2; X.beginPath(); X.arc(510, 950, 96, -Math.PI / 2, -Math.PI / 2 + (1 - fr) * Math.PI * 2); X.stroke(); X.fillStyle = TINTA; X.font = "700 120px FR"; X.textAlign = "center"; X.fillText(String(n), 510, 960);
      if (lt > .7) { const a = eo(lin(lt, .7, 1.1)); X.globalAlpha = a; X.fillStyle = TINTA; X.font = "700 56px FR"; X.fillText("Ela já esqueceu", 510, 1130); X.fillText("algo importante seu?", 510, 1195); X.globalAlpha = 1; }
      const pul = 1 + Math.sin(lt * 7) * .03; X.save(); X.translate(510, 1340); X.scale(pul, pul); X.fillStyle = POST; X.beginPath(); X.roundRect(-380, -64, 760, 128, 64); X.fill(); X.strokeStyle = TINTA; X.lineWidth = 5; X.stroke();
      X.fillStyle = TINTA; X.font = "700 66px FR"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore(); },
  }; };
const cores = { LAR: AZUL, VERDE: POST, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

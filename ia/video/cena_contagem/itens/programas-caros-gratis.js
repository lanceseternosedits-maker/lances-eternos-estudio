// Reel 🆕 contagem "5 programas caros refeitos de graça" (VibeOffice, FigCraft, GridCraft, CADCraft, WordCraft; 10/11 14:00).
// Identidade: loja de software dos anos 90 em liquidação: prateleiras de caixas de CD com preço riscado, esteira de caixa
// registradora cujo visor mostra R$ 0,00, caixa com cadeado aberta a marteladas no gancho e, na nº 1, uma folha gigante que
// sai da caixa e se escreve sozinha; vermelho-liquidação + amarelo + cinza-loja. Sem logos nem telas das empresas citadas.
// Elementos: letreiro neon (piscando só o contorno, texto sempre legível), nome com letras caindo e encaixando, odômetro de
// estrelas, legenda em tarja de oferta, zoom atravessando uma tela, plongée/contra-plongée, fechamento em nota fiscal (página),
// Archivo Black. Mascote de óculos de leitura levantados no topo da cabeça + martelo na mão (ao lado); ação: ler as etiquetas.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const VERM = "#e0262e", VERM2 = "#a3141b", AMAR = "#ffd21f", CINZA = "#c9ced6", CINZA2 = "#8b939e", TINTA = "#16181d", FUNDO = "#eef0f3", BRANCO = "#ffffff", VERDE = "#1fa35b";
rim.color.set(0xffe0e0); rim.intensity = 1.2; key.color.set(0xffffff); key.intensity = 150; key.position.set(1, 9, 6); key.target.position.set(0, .9, -.3);
S.add(new THREE.AmbientLight(0xf4f6ff, .55));

// ---------- cenário: loja com prateleiras e piso quadriculado ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#dfe3ea"; g.fillRect(0, 0, w, h); g.fillStyle = VERM; g.fillRect(0, 20, w, 26); g.fillStyle = "#fff"; g.font = "400 18px AB"; for (let x = 10; x < w; x += 128) g.fillText("LIQUIDAÇÃO", x, 40); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.2, -2.9).castShadow = false;
const qT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? "#f2f2f2" : "#c9ced6"; g.fillRect(x * 32, y * 32, 32, 32); } });
qT.wrapS = qT.wrapT = THREE.RepeatWrapping; qT.repeat.set(6, 4); const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: qT, roughness: .5 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
const caixaT = (cor, ico, preco) => ctex(128, 160, g => { g.fillStyle = cor; g.fillRect(0, 0, 128, 160); g.fillStyle = "rgba(255,255,255,.85)"; g.fillRect(14, 20, 100, 80); g.fillStyle = cor; g.font = "400 56px AB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(ico, 64, 62);
  if (preco) { g.fillStyle = AMAR; g.fillRect(10, 112, 108, 38); g.fillStyle = TINTA; g.font = "400 22px AB"; g.fillText(preco, 64, 132); g.strokeStyle = VERM; g.lineWidth = 5; g.beginPath(); g.moveTo(14, 140); g.lineTo(114, 122); g.stroke(); } });
const caixaGeo = new THREE.BoxGeometry(.42, .54, .12);
const caixa = (par, cor, ico, preco, x, y, z) => { const lado = M(cor); return mesh(caixaGeo, [lado, lado, lado, lado, new THREE.MeshStandardMaterial({ map: caixaT(cor, ico, preco), roughness: .5 }), lado], par, x, y, z); };
// prateleiras do fundo
const PRAT = new THREE.Group(); PRAT.position.set(0, 0, -2.3); S.add(PRAT); const metal = M("#9aa3ad", { metalness: .4, roughness: .5 });
const cs = ["#3a6fd8", "#7a3ad8", "#1fa35b", "#e07b1f", "#d83a7a", "#2bb3c0"];
for (let r = 0; r < 3; r++) { box(6.4, .05, .5, metal, PRAT, 0, .6 + r * .72, 0); for (let i = 0; i < 12; i++) caixa(PRAT, cs[(i + r) % 6], "▣", "R$ " + (199 + ((i * 37 + r * 11) % 7) * 100), -2.9 + i * .52, .9 + r * .72, .05); }
// balcão com esteira e caixa registradora
const BAL = new THREE.Group(); BAL.position.set(.7, 0, -.3); S.add(BAL); box(3.0, .9, .9, M(CINZA2), BAL, 0, .45, 0); const est = box(2.6, .05, .6, M("#2a2d33", { roughness: .9 }), BAL, -.1, .93, 0);
const estT = ctex(64, 64, (g, w, h) => { g.fillStyle = "#2a2d33"; g.fillRect(0, 0, w, h); g.fillStyle = "#3a3e46"; for (let x = 0; x < w; x += 16) g.fillRect(x, 0, 6, h); }); estT.wrapS = THREE.RepeatWrapping; estT.repeat.set(10, 1); est.material = new THREE.MeshStandardMaterial({ map: estT, roughness: .9 });
const REG = new THREE.Group(); REG.position.set(1.25, .93, 0); BAL.add(REG); box(.6, .35, .5, M("#d9dde3", { roughness: .4 }), REG, 0, .17, 0); const tecR = box(.5, .06, .3, M("#666"), REG, 0, .37, .08); tecR.rotation.x = .3;
const visT = ctex(256, 96, (g, w, h, txt = "R$ 0,00") => { g.fillStyle = "#0c2a12"; g.fillRect(0, 0, w, h); g.fillStyle = "#5dff8a"; g.font = "400 56px AB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, w / 2, h / 2 + 4); });
const VIS = mesh(new THREE.BoxGeometry(.55, .2, .05), [M("#333"), M("#333"), M("#333"), M("#333"), new THREE.MeshStandardMaterial({ map: visT, emissive: "#fff", emissiveMap: visT, emissiveIntensity: .7 }), M("#333")], REG, 0, .62, -.05);
box(.06, .25, .06, M("#555"), REG, 0, .45, -.05);
let visU = ""; const visor = txt => { if (txt !== visU) { visU = txt; visT.draw(txt); } };
// as 5 caixas dos itens (ícones genéricos, nada de logo)
const ITEM = { n5: ["#3a6fd8", "▤"], n4: ["#d83a7a", "✎"], n3: ["#1fa35b", "▦"], n2: ["#e07b1f", "⌖"], n1: ["#2b4bd8", "¶"] };
const CX = {}; for (const n in ITEM) { CX[n] = caixa(S, ITEM[n][0], ITEM[n][1], "R$ 999", 0, 0, 0); CX[n].scale.setScalar(2.3); CX[n].visible = false; }
// gancho: caixa com cadeado
const GG = new THREE.Group(); S.add(GG); const cxG = caixa(GG, VERM2, "?", "R$ 2.999", 0, .27 * 2, 0); cxG.scale.setScalar(2);
const cad = new THREE.Group(); GG.add(cad); cad.position.set(0, .5, .16); mesh(new THREE.TorusGeometry(.1, .025, 8, 20, Math.PI), M("#bbb", { metalness: .7, roughness: .3 }), cad, 0, .08, 0); box(.22, .18, .07, M(AMAR, { metalness: .5, roughness: .3 }), cad, 0, -.03, 0);
// nº 1: folha gigante que se escreve sozinha
const folT = ctex(300, 400, (g, w, h, k = 0) => { g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); g.fillStyle = "#2b4bd8"; g.fillRect(0, 0, w, 30); const n = Math.floor(k * 13); g.fillStyle = TINTA; g.font = "400 26px AB"; if (n > 0) g.fillText("Relatório", 24, 72);
  g.fillStyle = "#9aa3ad"; for (let i = 1; i < n; i++) g.fillRect(24, 90 + i * 22, 250 - (i * 47) % 90, 9); });
const FOL = mesh(new THREE.PlaneGeometry(1.0, 1.33), new THREE.MeshStandardMaterial({ map: folT, side: THREE.DoubleSide, roughness: .7 }), S); FOL.visible = false;
let folU = -1; const folha = k => { const u = Math.round(k * 13); if (u !== folU) { folU = u; folT.draw(k); } };

// ---------- mascote: óculos de leitura levantados no topo + martelo na mão direita (ao lado) ----------
const OC = new THREE.Group(); OC.position.set(0, 1.52, .15); OC.rotation.x = -1.2; MAS.corpo.add(OC); const ocM = M("#1d1d24", { roughness: .3 });
for (const x of [-.27, .27]) mesh(new THREE.TorusGeometry(.17, .025, 8, 28), ocM, OC, x, 0, 0); box(.14, .03, .03, ocM, OC, 0, 0, 0);
const MART = new THREE.Group(); MART.position.set(.45, .05, .15); MAS.bracos[1].add(MART); box(.05, .5, .05, M("#8a5a33"), MART, 0, .2, 0); box(.24, .12, .12, M("#777", { metalness: .7, roughness: .3 }), MART, 0, .47, 0);
const MX = -1.75, MZ = .3;
const le = (lt, ry = .55) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .9, .03), ry, braco: [1.0 + Math.sin(lt * 1.7) * .08, .45], piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(lt * 1.3) * .05; MART.visible = false; };
const martela = (lt, f) => { const k = Math.abs(Math.sin(lt * Math.PI * f)); pose(MAS, { x: MX + .45, z: MZ, y: 0, ry: .6, braco: [.3, .4 + k * 1.6], sq: k < .15 ? .04 : 0, piscar: pisca(lt) }); MAS.g.rotation.z = 0; MART.visible = true; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .26), ry: .3, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], sq: Math.max(0, Math.cos(lt * Math.PI / .35)) * .06, piscar: pisca(lt) }); MAS.g.rotation.z = 0; MART.visible = false; };

grupo("gancho"); grupo("n5"); grupo("n4"); grupo("n3"); grupo("n2"); grupo("n1"); grupo("cta");
const reset = () => { for (const n in CX) CX[n].visible = false; GG.visible = false; FOL.visible = false; estT.offset.x = 0; };
// a caixa do item entra pela esteira e para no caixa; o visor marca R$ 0,00
const passa = (n, lt) => { const c = CX[n]; c.visible = true; const k = eio(lin(lt, .1, 1.3)); c.position.set(-.5 + k * 1.1, .93 + .62, -.3); c.rotation.set(0, -.15 + Math.sin(lt * 2) * .04, 0); estT.offset.x = -lt * 1.5 * (k < 1 ? 1 : .1);
  visor(lt < 1.3 ? "R$ 999" : "R$ 0,00"); };

// ---------- plongée (alta) e contra-plongée (baixa) ----------
const PL = [V(0, 3.6, 7.0), V(0, 1.0, -.4)], CP = [V(-.1, .85, 7.0), V(0, 1.6, -.4)];
const SHOTS = { gancho: [CP, PL], n5: [PL, CP], n4: [CP, PL], n3: [PL, PL], n2: [CP, CP], n1: [CP, PL], cta: [PL, PL] };
const ACT = {
  gancho(lt, d) { reset(); visor("R$ 2.999"); GG.visible = true; GG.position.set(.15, 0, .55); GG.scale.setScalar(1.35); const quebra = lt > 2.4; cad.visible = !quebra || lt < 2.6; if (lt > 2.4) { const k = lin(lt, 2.4, 3.0); cad.position.set(k * .8, .5 - k * k * 1.2, .16 + k * .4); cad.rotation.z = k * 4; }
    cxG.rotation.y = Math.sin(lt * 1.5) * .15; if (lt > 1.0 && lt < 2.7) martela(lt - 1.0, 2.2); else if (lt >= 2.7) le(lt, .4); else le(lt, .5);
    if (lt > 2.4 && lt < 2.55) return .04; },
  n5(lt, d) { reset(); passa("n5", lt); le(lt); },
  n4(lt, d) { reset(); passa("n4", lt); le(lt); },
  n3(lt, d) { reset(); passa("n3", lt); le(lt); },
  n2(lt, d) { reset(); passa("n2", lt); le(lt, .7); },
  n1(lt, d) { reset(); passa("n1", lt); const k = lin(lt, 1.4, 2.4); FOL.visible = k > 0; if (k > 0) { const e = eio(k); FOL.position.set(.1 + e * .1, 1.5 + e * .75, -.2 + e * .6); FOL.rotation.set(-.1, (1 - e) * 3, Math.sin(lt * 2) * .03); FOL.scale.setScalar(.3 + .7 * e); folha(lin(lt, 2.2, d - .3)); }
    if (lt < 2.4) le(lt, .7); else feliz(lt); },
  cta(lt, d) { reset(); visor("R$ 0,00"); feliz(lt); },
};

// ---------- elementos de tela (2D): entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, ITENS, MAXE } = C; const GY3 = 620; let CAB = null;
  const cabe = (f, txt, mx) => { while (f > 22) { X.font = `400 ${f}px AB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const fmtP = n => Math.round(n).toLocaleString("pt-BR");
  const odometro = (v, x, y) => { const s = String(Math.floor(v)).padStart(5, "0"), w = 58, h = 84; X.fillStyle = TINTA; X.beginPath(); X.roundRect(x - 10, y - h / 2 - 10, 5 * (w + 6) + 14, h + 20, 12); X.fill();
    for (let i = 0; i < 5; i++) { const xx = x + i * (w + 6), d = +s[i], fr = i === 4 ? v % 1 : 0; X.save(); X.beginPath(); X.roundRect(xx, y - h / 2, w, h, 6); X.clip(); X.fillStyle = "#fff"; X.fillRect(xx, y - h / 2, w, h);
      X.fillStyle = TINTA; X.font = "400 60px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(String(d), xx + w / 2, y + 3 - fr * h); X.fillText(String((d + 1) % 10), xx + w / 2, y + 3 + h - fr * h);
      const sh = X.createLinearGradient(0, y - h / 2, 0, y + h / 2); sh.addColorStop(0, "rgba(0,0,0,.3)"); sh.addColorStop(.3, "rgba(0,0,0,0)"); sh.addColorStop(.7, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(0,0,0,.3)"); X.fillStyle = sh; X.fillRect(xx, y - h / 2, w, h); X.restore(); }
    X.fillStyle = TINTA; X.font = "400 24px AB"; X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillText("★ ESTRELAS NO GITHUB", x, y + h / 2 + 40); };
  const U = {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 60], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(238,240,243,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (CAB && nome !== "gancho" && nome !== "cta") U.cab2(...CAB); CAB = null; },
    etiqueta(t, nome) { // letreiro neon: contorno pisca, texto fixo e legível
      const [l1, l2, l3] = SEGR[0].etiqueta, on = (Math.floor(t * 3) % 7) !== 0; X.save(); X.translate(505, 410);
      X.fillStyle = "#1b1d24"; X.beginPath(); X.roundRect(-455, -130, 910, 260, 26); X.fill(); X.shadowColor = VERM; X.shadowBlur = on ? 30 : 8; X.strokeStyle = on ? "#ff4a52" : "#7a2a2e"; X.lineWidth = 8; X.beginPath(); X.roundRect(-438, -113, 876, 226, 18); X.stroke(); X.shadowBlur = 0;
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.shadowColor = "#ffffff"; X.shadowBlur = 12; X.fillStyle = "#fff"; cabe(56, l1, 820); X.fillText(l1, 0, -34); X.shadowColor = AMAR; X.fillStyle = AMAR; cabe(54, l2, 820); X.fillText(l2, 0, 30);
      X.shadowColor = "#ff8a8f"; X.fillStyle = "#ff8a8f"; cabe(40, l3, 820); X.fillText(l3, 0, 88); X.restore(); },
    cabecalho(s, lt, t) { CAB = [s, lt, t]; },
    cab2(s, lt, t) { // nº + letras caindo e encaixando + odômetro
      const y = 600; X.fillStyle = VERM; X.beginPath(); X.arc(105, y, 46, 0, 7); X.fill(); X.fillStyle = "#fff"; X.font = "400 50px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag.replace(/\D/g, ""), 105, y + 3);
      const nm = s.item.toUpperCase(), tw = Math.min(56, 520 / nm.length - 6); for (let i = 0; i < nm.length; i++) { const k = lin(lt, .1 + i * .06, .4 + i * .06); if (k <= 0) continue; const yy = y - (1 - eo(k)) * 220;
        X.save(); X.translate(170 + i * (tw + 6) + tw / 2, yy); X.rotate((1 - eo(k)) * (i % 2 ? .5 : -.5)); X.fillStyle = TINTA; X.beginPath(); X.roundRect(-tw / 2, -tw * .62, tw, tw * 1.24, 8); X.fill();
        X.fillStyle = AMAR; X.font = `400 ${Math.round(tw * .9)}px AB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(nm[i], 0, 3); X.restore(); }
      odometro(s.estrelas * eio(lin(lt, .4, 1.9)), 620, 700); },
    legenda(seg, t) { // tarja de oferta
      const ch = C.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 56; X.font = `400 ${fs}px AB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 640 && fs > 30) { fs -= 2; X.font = `400 ${fs}px AB`; }
      const y = 1405; X.fillStyle = VERM; X.fillRect(40, y - 58, 910, 116); X.fillStyle = AMAR; X.beginPath(); X.moveTo(40, y - 58); X.lineTo(200, y - 58); X.lineTo(170, y + 58); X.lineTo(40, y + 58); X.fill();
      X.fillStyle = TINTA; X.font = "400 30px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("R$ 0", 112, y + 2);
      let x = 565 - tot() / 2; X.font = `400 ${fs}px AB`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? AMAR : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 220 + u * 2300, h = w * 1.7;
      X.save(); X.fillStyle = "#1b1d24"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 24 * (1 - u) + 4); X.fill("evenodd"); X.strokeStyle = VERM; X.lineWidth = 12; X.beginPath(); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 24 * (1 - u) + 4); X.stroke(); X.restore(); },
    fechamento(lt) { // nota fiscal comprida com os 5 itens a R$ 0,00
      const p = eo(lin(lt, 0, .6)), H = 760 * p; X.save(); X.translate(505, 620); X.fillStyle = "#fffef8"; X.shadowColor = "rgba(0,0,0,.2)"; X.shadowBlur = 20; X.beginPath(); X.moveTo(-330, 0); X.lineTo(330, 0); X.lineTo(330, H);
      for (let x = 330; x > -330; x -= 30) X.lineTo(x - 15, H + 14), X.lineTo(x - 30, H); X.closePath(); X.fill(); X.shadowColor = "transparent"; X.beginPath(); X.rect(-330, 0, 660, H); X.clip();
      X.fillStyle = TINTA; X.font = "400 36px AB"; X.textAlign = "center"; X.fillText("NOTA FISCAL", 0, 60); X.fillStyle = CINZA2; X.fillRect(-290, 84, 580, 3);
      ITENS.slice().reverse().forEach((s, i) => { const y = 140 + i * 66; X.textAlign = "left"; X.fillStyle = TINTA; X.font = "400 34px AB"; X.fillText(s.item, -290, y); X.textAlign = "right"; X.fillStyle = CINZA2; X.font = "400 26px AB"; X.fillText("R$ 999", 150, y);
        X.strokeStyle = VERM; X.lineWidth = 4; X.beginPath(); X.moveTo(58, y - 8); X.lineTo(152, y - 12); X.stroke(); X.fillStyle = VERDE; X.font = "400 32px AB"; X.fillText("R$ 0,00", 290, y); });
      X.fillStyle = CINZA2; X.fillRect(-290, 470, 580, 3); X.textAlign = "left"; X.fillStyle = TINTA; X.font = "400 40px AB"; X.fillText("TOTAL", -290, 530); X.textAlign = "right"; X.fillStyle = VERDE; X.fillText("R$ 0,00", 290, 530); X.restore();
      const q = back(lin(lt, .8, 1.2)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 1290); X.scale(q, q); X.fillStyle = VERM; X.beginPath(); X.roundRect(-350, -66, 700, 132, 66); X.fill();
      X.fillStyle = "#fff"; X.font = "400 66px AB"; X.textAlign = "center"; X.textBaseline = "middle"; const w1 = X.measureText("COMENTA ").width, w2 = X.measureText(CHAVE).width; X.textAlign = "left"; X.fillText("COMENTA ", -(w1 + w2) / 2, 4); X.fillStyle = AMAR; X.fillText(CHAVE, -(w1 + w2) / 2 + w1, 4); X.restore(); },
  }; return U; };
const cores = { LAR: VERM, VERDE: AMAR, FUNDO, CREME: BRANCO, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui };
}

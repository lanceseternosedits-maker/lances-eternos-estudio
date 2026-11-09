// Reel 🆕 contagem "5 jogos de PlayStation rodando no PC" (ports feitos por fãs, sempre com o seu próprio jogo; 11/11 06:00).
// Identidade: corredor de locadora de videogame abandonada à noite, fita de "proibido" rasgada, TVs de tubo com chiado, caixas de
// jogo genéricas (sem arte nem logo), console genérico de blocos que se abre no gancho e de dentro sai um gabinete de PC; nº 1 =
// corredor escuro com uma luz piscando no fim (terror leve, sem susto). Anil + vermelho + verde-fósforo. Sem logos/personagens da Sony.
// Elementos: etiqueta em tela de terminal, nome em letreiro split-flap, contador em velocímetro (estrelas da API do GitHub), legenda em
// tarja de TV, transição zoom atravessando uma tela, plongée/contra-plongée, fechamento CONTINUE?, Archivo Black (Fraunces repetiria o
// Samsung, que sai antes). Mascote de capuz (no topo) se escondendo atrás das prateleiras.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const ANIL = "#3b3fd8", ANIL2 = "#1f2280", VERM = "#e8323c", FOSF = "#4dff9a", CREME = "#f4f1ff", TINTA = "#0b0b1a", FUNDO = "#14152e";
rim.color.set(0x6f74ff); rim.intensity = 1.8; key.color.set(0xd8dcff); key.intensity = 110; key.position.set(1, 8, 6); key.target.position.set(0, .9, -.3);
S.add(new THREE.AmbientLight(0x4a4f9a, .7));
const luzFim = new THREE.PointLight(0xfff2c0, 0, 9); luzFim.position.set(0, 2.2, -6.5); S.add(luzFim);

// ---------- cenário: corredor de locadora ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#23255a"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,.04)"; for (let x = 0; x < w; x += 40) g.fillRect(x, 0, 2, h); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -8).castShadow = false;
const pisoT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? "#2b2d52" : "#3a3c6b"; g.fillRect(x * 32, y * 32, 32, 32); } }); pisoT.wrapS = pisoT.wrapT = THREE.RepeatWrapping; pisoT.repeat.set(5, 8);
const chao = mesh(new THREE.PlaneGeometry(12, 22), new THREE.MeshStandardMaterial({ map: pisoT, roughness: .5 }), S, 0, 0, -3); chao.rotation.x = -Math.PI / 2;
const cxCores = [VERM, ANIL, "#2bb37a", "#f2b632", "#a03bd8", "#3bb6d8"];
const caixaT = c => ctex(64, 90, g => { g.fillStyle = c; g.fillRect(0, 0, 64, 90); g.fillStyle = "rgba(255,255,255,.85)"; g.fillRect(6, 8, 52, 10); g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(6, 24, 52, 52); });
const cxMats = cxCores.map(c => new THREE.MeshStandardMaterial({ map: caixaT(c), roughness: .6 }));
for (const lado of [-1, 1]) for (let i = 0; i < 6; i++) { const z = -1 - i * 1.4, x = lado * 2.6; box(.5, 2.6, 1.3, M("#3a2e5c"), S, x, 1.3, z);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const b = mesh(new THREE.BoxGeometry(.06, .4, .28), cxMats[(i + r + c) % 6], S, x - lado * .27, .45 + r * .55, z - .45 + c * .3); b.rotation.y = lado * .02; } }
// TVs de tubo com chiado (canvas atualizado)
const chiT = ctex(128, 96, (g, w, h, k = 0) => { for (let i = 0; i < 900; i++) { const v = (Math.sin(i * 91.7 + k * 13.1) * 43758.5453) % 1; const c = Math.floor(Math.abs(v) * 255); g.fillStyle = `rgb(${c},${c},${c})`; g.fillRect((i * 7) % w, Math.floor(i * 7 / w) * 6 % h, 6, 6); } });
const tvs = [[-1.6, -1.2], [1.6, -2.6], [-1.5, -4.0]].map(([x, z]) => { const g = new THREE.Group(); g.position.set(x, 0, z); S.add(g); box(.9, .7, .7, M("#2a2a2e"), g, 0, .35, 0); mesh(new THREE.PlaneGeometry(.66, .5), new THREE.MeshStandardMaterial({ map: chiT, emissive: "#fff", emissiveMap: chiT, emissiveIntensity: .7 }), g, 0, .38, .36); g.rotation.y = x < 0 ? .5 : -.5; return g; });
// fita de "proibido" rasgada no fundo do corredor
const fitaT = ctex(256, 32, (g, w, h) => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? "#ffd23f" : "#111"; g.fillRect(i * 16, 0, 16, h); } g.fillStyle = "#111"; g.font = "400 18px AB"; });
const fita = mesh(new THREE.PlaneGeometry(3.4, .22), new THREE.MeshBasicMaterial({ map: fitaT, side: THREE.DoubleSide }), S, -.6, 1.5, -6.2); fita.rotation.z = .25;
const fita2 = mesh(new THREE.PlaneGeometry(2.2, .22), new THREE.MeshBasicMaterial({ map: fitaT, side: THREE.DoubleSide }), S, 1.1, 1.1, -6.25); fita2.rotation.z = -.4;
// console genérico de blocos que se abre e solta um gabinete de PC (gancho)
const CON = new THREE.Group(); CON.position.set(.5, 0, .3); S.add(CON); const conM = M("#e9e9f2", { roughness: .3 });
const tampa = new THREE.Group(); tampa.position.set(0, .5, -.3); CON.add(tampa); box(1.3, .14, .9, conM, tampa, 0, 0, .3); box(1.3, .5, .9, M("#16173a", { roughness: .3 }), CON, 0, .25, 0); const ledC = box(.2, .03, .02, E(ANIL, 3), CON, 0, .3, .46);
const PC = new THREE.Group(); CON.add(PC); box(.6, 1.0, .7, M("#202238", { metalness: .4, roughness: .3 }), PC, 0, .5, 0); const ledPC = box(.03, .6, .02, E(FOSF, 3), PC, -.2, .55, .36); mesh(new THREE.CylinderGeometry(.14, .14, .02, 20), M("#2c2f5a"), PC, .1, .65, .36).rotation.x = Math.PI / 2;
// objetos de cada item (genéricos, nada de personagem): kart (n5), raio de neon (n4), estátua gigante de pedra (n3), mapa de tesouro (n2), corredor + luz (n1)
const G5 = grupo("n5"), G4 = grupo("n4"), G3 = grupo("n3"), G2 = grupo("n2"), G1 = grupo("n1");
const kart = new THREE.Group(); G5.add(kart); kart.position.set(.6, 0, .4); box(1.0, .25, .6, M(VERM), kart, 0, .3, 0); box(.3, .3, .3, M("#ffd23f"), kart, -.15, .55, 0); for (const [x, z] of [[-.35, .33], [.35, .33], [-.35, -.33], [.35, -.33]]) mesh(new THREE.CylinderGeometry(.14, .14, .12, 14), M("#111"), kart, x, .14, z).rotation.x = Math.PI / 2;
const raio = new THREE.Group(); G4.add(raio); raio.position.set(.6, 1.2, .2); const raioM = E("#ff4fd8", 2.5); [[0, .5, .4], [-.15, 0, -.4], [.12, -.45, .4]].forEach(([x, y, r]) => { const b = box(.14, .6, .08, raioM, raio, x, y, 0); b.rotation.z = r; });
const est = new THREE.Group(); G3.add(est); est.position.set(.7, 0, -1.2); const pedra = M("#8b8e9e", { roughness: .95 }); box(1.2, 1.4, .8, pedra, est, 0, .9, 0); box(.7, .6, .6, pedra, est, 0, 1.9, 0); box(.3, 1.0, .3, pedra, est, -.75, .7, 0); box(.3, 1.0, .3, pedra, est, .75, .7, 0); box(.35, .8, .35, pedra, est, -.3, .2, 0); box(.35, .8, .35, pedra, est, .3, .2, 0);
const olhoE = box(.1, .06, .02, E(FOSF, 2), est, -.15, 1.95, .31), olhoD = box(.1, .06, .02, E(FOSF, 2), est, .15, 1.95, .31);
const mapaT = ctex(256, 180, g => { g.fillStyle = "#e8d4a2"; g.fillRect(0, 0, 256, 180); g.strokeStyle = "#8a5a2b"; g.lineWidth = 4; g.setLineDash([10, 8]); g.beginPath(); g.moveTo(20, 150); g.bezierCurveTo(80, 40, 160, 160, 220, 40); g.stroke(); g.setLineDash([]); g.strokeStyle = VERM; g.lineWidth = 8; g.beginPath(); g.moveTo(205, 25); g.lineTo(235, 55); g.moveTo(235, 25); g.lineTo(205, 55); g.stroke(); });
const mapa = mesh(new THREE.PlaneGeometry(1.4, 1.0), new THREE.MeshStandardMaterial({ map: mapaT, side: THREE.DoubleSide }), G2, .6, 1.3, .2);
const porta = box(1.2, 2.2, .1, M("#0d0d18"), G1, 0, 1.1, -6.4); const lampada = mesh(new THREE.SphereGeometry(.12, 12, 8), E("#fff2c0", 0), G1, 0, 2.3, -6.3);

// ---------- mascote: capuz (no topo, aba pra trás; nada nos olhos); se esconder atrás da prateleira ----------
const CAP = new THREE.Group(); CAP.position.set(0, 1.45, -.12); MAS.corpo.add(CAP); const capM = M("#2a2d6e", { roughness: .9 });
const cc = mesh(new THREE.SphereGeometry(.78, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), capM, CAP, 0, 0, 0); cc.scale.set(1.0, .5, .8);
const MX = -1.4, MZ = .4;
const esconde = (lt, k) => { const sai = Math.sin(lt * 1.3) > .2 ? 1 : 0; pose(MAS, { x: MX - k * .7 + sai * .35, z: MZ, y: 0, ry: .5 - k * .3, braco: [1.6, .4], sq: k * .1, piscar: pisca(lt) }); MAS.g.rotation.z = -sai * .12; };
const olha = (lt, ry = .4) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .5 + Math.sin(lt * 2) * .1], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .24), ry: .3, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const gG = grupo("gancho"); grupo("cta");
let VEL = 0;
const reset = (t) => { chiT.draw(Math.floor(t * 12)); tvs.forEach((g, i) => g.children[1].material.emissiveIntensity = .6 + .2 * Math.sin(t * 20 + i)); luzFim.intensity = 0; lampada.material.emissiveIntensity = 0; CON.visible = false; };
const PL = [V(.2, 3.8, 6.2), V(0, .9, -1.2)], CP = [V(-.2, .7, 6.0), V(0, 1.7, -1.6)];
const SHOTS = { gancho: [CP, PL], n5: [PL, CP], n4: [CP, PL], n3: [CP, CP], n2: [PL, PL], n1: [[V(0, 1.6, 4.5), V(0, 1.6, -6)], [V(0, 1.5, 2.2), V(0, 1.7, -6)]], cta: [PL, PL] };
const ACT = {
  gancho(lt, d, t) { reset(lt); CON.visible = true; const k = eo(lin(lt, 1.0, 1.8)); tampa.rotation.x = -k * 1.9; PC.position.y = k * .55 + (k > .9 ? Math.sin(lt * 3) * .03 : 0); PC.visible = k > .02; ledPC.material.emissiveIntensity = 2 + Math.sin(lt * 8);
    if (lt < 2) esconde(lt, 1); else olha(lt, .5); return lt > 1 && lt < 1.15 ? .03 : 0; },
  n5(lt) { reset(lt); kart.position.x = .6 + Math.sin(lt * 1.2) * .5; kart.rotation.y = Math.sin(lt * 1.2) * .3; olha(lt); },
  n4(lt) { reset(lt); raio.rotation.y = lt * 1.2; raioM.emissiveIntensity = 2 + Math.sin(lt * 12) * .8; olha(lt, .6); },
  n3(lt) { reset(lt); est.position.y = Math.max(0, 1 - lt * .8) * -.3; olhoE.material.emissiveIntensity = olhoD.material.emissiveIntensity = 1 + Math.sin(lt * 3); esconde(lt, .6); },
  n2(lt) { reset(lt); mapa.rotation.y = Math.sin(lt * 1.5) * .3; mapa.position.y = 1.3 + Math.sin(lt * 2) * .05; olha(lt, .5); },
  n1(lt, d) { reset(lt); const f = (Math.floor(lt * 7) % 5 === 0 || Math.sin(lt * 23) > .85) ? 0 : 1; luzFim.intensity = 14 * f; lampada.material.emissiveIntensity = 3 * f; esconde(lt, .9); },
  cta(lt) { reset(lt); feliz(lt); },
};

// ---------- elementos de tela (2D): entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, ITENS, MAXE } = C; const GY3 = 620; let CAB = null;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px AB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const fmtP = n => Math.round(n).toLocaleString("pt-BR");
  const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const flap = (alvo, x, y, tw, lt) => { for (let i = 0; i < alvo.length; i++) { const c = alvo[i], k = lin(lt, .1 + i * .04, .5 + i * .04), xx = x + i * (tw + 4); X.fillStyle = "#101020"; X.beginPath(); X.roundRect(xx, y - tw * .7, tw, tw * 1.4, 5); X.fill(); if (c === " ") continue;
    X.fillStyle = k >= 1 ? "#ffd23f" : "#ccc"; X.font = `400 ${Math.round(tw * .95)}px AB`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(k >= 1 ? c : CH[(Math.floor(lt * 30) + i * 7) % CH.length], xx + tw / 2, y + 3); X.fillStyle = "rgba(0,0,0,.5)"; X.fillRect(xx, y - 1, tw, 3); } };
  const velo = (v, x, y) => { const r = 92; X.save(); X.translate(x, y); X.fillStyle = "rgba(11,11,26,.85)"; X.beginPath(); X.roundRect(-r - 24, -r - 18, 2 * r + 48, r + 112, 18); X.fill();
    X.lineWidth = 18; X.strokeStyle = "#2c2e5a"; X.beginPath(); X.arc(0, 0, r, Math.PI, 2 * Math.PI); X.stroke(); X.strokeStyle = FOSF; X.beginPath(); X.arc(0, 0, r, Math.PI, Math.PI + Math.PI * v / MAXE); X.stroke();
    const a = Math.PI + Math.PI * v / MAXE; X.strokeStyle = "#fff"; X.lineWidth = 6; X.lineCap = "round"; X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(a) * (r - 18), Math.sin(a) * (r - 18)); X.stroke();
    X.fillStyle = "#fff"; X.font = "400 42px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(fmtP(v), 0, 34); X.font = "400 18px AB"; X.fillStyle = "#a9adff"; X.fillText("★ ESTRELAS NO GITHUB", 0, 72); X.restore(); };
  const U = {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 60], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(20,21,46,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (CAB && nome !== "gancho" && nome !== "cta") U.cab2(...CAB); CAB = null; },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.fillStyle = "#0b0b1a"; X.beginPath(); X.roundRect(60, 288, 890, 270, 18); X.fill(); X.strokeStyle = ANIL; X.lineWidth = 3; X.stroke();
      X.fillStyle = "#1c1d3d"; X.beginPath(); X.roundRect(60, 288, 890, 46, [18, 18, 0, 0]); X.fill(); [VERM, "#ffd23f", FOSF].forEach((c, i) => { X.fillStyle = c; X.beginPath(); X.arc(92 + i * 30, 311, 9, 0, 7); X.fill(); });
      X.fillStyle = "#8d90c9"; X.font = "400 20px AB"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText("locadora@noite:~", 190, 312);
      X.textBaseline = "alphabetic"; X.fillStyle = FOSF; X.font = "400 44px AB"; X.fillText(">", 84, 402); X.fillStyle = "#fff"; cabe(48, l1, 790); X.fillText(l1, 118, 402); X.fillStyle = FOSF; cabe(46, l2, 800); X.fillText(l2, 118, 466); X.fillStyle = "#ff7a82"; cabe(40, l3, 800); X.fillText(l3, 118, 526);
      if ((t * 2) % 1 < .5) { const w = X.measureText(l3).width; X.fillRect(126 + w, 494, 22, 38); } },
    cabecalho(s, lt, t) { CAB = [s, lt, t]; },
    cab2(s, lt, t) { const y = 640; X.fillStyle = VERM; X.beginPath(); X.arc(104, y, 42, 0, 7); X.fill(); X.fillStyle = "#fff"; X.font = "400 46px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag.replace(/\D/g, ""), 104, y + 3);
      const nm = s.item.toUpperCase(), tw = Math.min(42, 560 / nm.length - 4); flap(nm, 160, y, tw, lt); velo(s.estrelas * eio(lin(lt, .4, 1.9)), 820, 820); },
    legenda(seg, t) { const ch = C.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 56; X.font = `400 ${fs}px AB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 760 && fs > 32) { fs -= 2; X.font = `400 ${fs}px AB`; }
      const y = 1405; X.fillStyle = "rgba(11,11,26,.92)"; X.fillRect(40, y - 56, 910, 112); X.fillStyle = ANIL; X.fillRect(40, y - 56, 12, 112); X.fillStyle = VERM; X.fillRect(60, y - 88, 150, 38); X.fillStyle = "#fff"; X.font = "400 22px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("● REC", 135, y - 68);
      let x = 505 - tot() / 2; X.font = `400 ${fs}px AB`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? FOSF : on ? "#fff" : "rgba(255,255,255,.4)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 220 + u * 2300, h = w * .8;
      X.save(); X.fillStyle = "#07070f"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 60 * (1 - u) + 6); X.fill("evenodd"); X.strokeStyle = "#3a3d6a"; X.lineWidth = 16; X.beginPath(); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 60 * (1 - u) + 6); X.stroke(); X.restore(); },
    fechamento(lt) { X.fillStyle = "rgba(7,7,15,.88)"; X.fillRect(60, 620, 890, 840); X.strokeStyle = ANIL; X.lineWidth = 6; X.strokeRect(70, 630, 870, 820);
      const p = back(lin(lt, 0, .4)); X.save(); X.translate(505, 740); X.scale(p, p); X.fillStyle = "#ffd23f"; X.font = "400 100px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("CONTINUE?", 0, 0); X.restore();
      const n = Math.max(0, 9 - Math.floor(lt * 2)); X.fillStyle = VERM; X.font = "400 130px AB"; X.textAlign = "center"; X.fillText(String(n), 505, 900);
      ITENS.slice().reverse().forEach((s, i) => { const a = eo(lin(lt, .3 + i * .1, .6 + i * .1)); X.globalAlpha = a; X.fillStyle = "#e8e9ff"; X.font = "400 36px AB"; X.fillText(`${i + 1}. ${s.item}`, 505, 1010 + i * 50); X.globalAlpha = 1; });
      const pul = 1 + Math.sin(lt * 7) * .03; X.save(); X.translate(505, 1330); X.scale(pul, pul); X.fillStyle = VERM; X.beginPath(); X.roundRect(-300, -60, 600, 120, 60); X.fill(); X.fillStyle = "#fff"; X.font = "400 70px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("COMENTA " + CHAVE, 0, 4); X.restore(); },
  }; return U; };
const cores = { LAR: VERM, VERDE: FOSF, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui };
}

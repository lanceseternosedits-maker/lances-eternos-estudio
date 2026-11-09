// Reel ⚙️ como funciona "O ChatGPT lembra de você" (memória do ChatGPT; 11/11 12:00). Motor da cena_contagem.
// Identidade: arquivo antigo de biblioteca: gaveteiro gigante de fichas com a etiqueta "VOCÊ", escada de rodinha, carimbo de data,
// uma borracha enorme apagando o balão da conversa (mas a ficha continua na gaveta). Madeira-mel + azul-marinho.
// Elementos: etiqueta em placa de rua, nome em carimbo batendo (MEMÓRIA), odômetro de fichas guardadas (ilustrativo), legenda uma
// palavra gigante por vez com pop, flash branco, travelling lateral, cartazes/post-its na parede, Fraunces.
// Mascote de óculos redondos (aro fino) e lápis atrás da "orelha" (na lateral); ação principal: abrir gavetas de fichas.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const MEL = "#c98a3d", MEL2 = "#9a6224", MAR = "#1d2d5c", MAR2 = "#2e4a8f", PAP = "#fbf3e2", TINTA = "#1a1410", FUNDO = "#f3e7d2", VERM = "#c0392b", VERDE = "#2f9e5b";
rim.color.set(0xffe2b0); rim.intensity = 1.3; key.color.set(0xfff1dc); key.intensity = 140; key.position.set(1, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xfff0dc, .55));
// ---------- cenário ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = MAR; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(255,255,255,.05)"; for (let x = 0; x < w; x += 22) g.fillRect(x, 0, 2, h); g.fillStyle = MEL2; g.fillRect(0, h - 40, w, 40); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const tT = ctex(256, 256, (g, w, h) => { for (let y = 0; y < 8; y++) { g.fillStyle = y % 2 ? "#a8743a" : "#b8813f"; g.fillRect(0, y * 32, w, 32); g.fillStyle = "rgba(60,30,10,.3)"; g.fillRect(0, y * 32 + 31, w, 1); } }); tT.wrapS = tT.wrapT = THREE.RepeatWrapping; tT.repeat.set(6, 4);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: tT, roughness: .7 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
// gaveteiro gigante 4×3 com gavetas "VOCÊ"
const GV = new THREE.Group(); GV.position.set(.7, 0, -1.4); S.add(GV); const madM = M(MEL, { roughness: .6 }); box(3.4, 2.9, 1.0, madM, GV, 0, 1.45, 0);
const etT = (txt) => ctex(128, 48, g => { g.fillStyle = PAP; g.fillRect(0, 0, 128, 48); g.strokeStyle = MEL2; g.lineWidth = 3; g.strokeRect(2, 2, 124, 44); g.fillStyle = TINTA; g.font = "700 26px FR"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 64, 26); });
const NOMES = ["VOCÊ", "GOSTOS", "TRABALHO", "FAMÍLIA", "CIDADE", "PLANOS", "COMIDA", "PETS", "HORÁRIO", "ESTUDO", "SAÚDE", "VIAGEM"];
const GAV = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const g = new THREE.Group(); g.position.set(-1.1 + c * 1.1, .45 + r * .68, .5); GV.add(g); const fr = box(1.0, .6, .06, M("#d9a05a", { roughness: .5 }), g, 0, 0, .03);
  box(.98, .55, .8, M("#a8743a"), g, 0, 0, -.38); mesh(new THREE.PlaneGeometry(.5, .19), new THREE.MeshStandardMaterial({ map: etT(NOMES[r * 3 + c]) }), g, 0, .14, .065); box(.22, .05, .05, M("#c9b28a", { metalness: .6 }), g, 0, -.1, .08); GAV.push(g); }
// fichas que voam pra dentro das gavetas
const fichaT = (i) => ctex(160, 100, g => { g.fillStyle = "#fffaf0"; g.fillRect(0, 0, 160, 100); g.fillStyle = "#e85a5a"; g.fillRect(0, 18, 160, 3); g.fillStyle = "#8aa0c8"; for (let k = 0; k < 4; k++) g.fillRect(12, 34 + k * 16, 136 - (k * 29 + i * 13) % 50, 5); g.fillStyle = TINTA; g.font = "700 16px FR"; g.fillText(["sou professora", "tenho 2 gatos", "moro em BH", "odeio coentro", "acordo às 6"][i % 5], 10, 14); });
const FICHAS = [0, 1, 2, 3, 4].map(i => { const m = mesh(new THREE.PlaneGeometry(.6, .38), new THREE.MeshStandardMaterial({ map: fichaT(i), side: THREE.DoubleSide }), S); m.visible = false; return m; });
// balão de conversa + borracha gigante
const balT = ctex(256, 160, g => { g.fillStyle = "#fff"; g.beginPath(); g.roundRect(6, 6, 244, 120, 26); g.fill(); g.beginPath(); g.moveTo(40, 120); g.lineTo(24, 156); g.lineTo(84, 120); g.fill(); g.fillStyle = "#9aa7c0"; for (let k = 0; k < 3; k++) g.fillRect(28, 32 + k * 28, 200 - k * 40, 12); });
const BAL = mesh(new THREE.PlaneGeometry(1.5, .95), new THREE.MeshBasicMaterial({ map: balT, transparent: true, side: THREE.DoubleSide }), S, -1.6, 2.4, -.2); BAL.castShadow = false;
const BOR = new THREE.Group(); S.add(BOR); box(.9, .35, .45, M("#ff8fa3", { roughness: .8 }), BOR, 0, 0, 0); box(.9, .12, .46, M(MAR2), BOR, 0, .2, 0);
// escada de rodinha
const ESC = new THREE.Group(); ESC.position.set(-1.0, 0, -.6); S.add(ESC); for (const x of [-.3, .3]) { const p = box(.06, 2.2, .06, M("#7a5232"), ESC, x, 1.1, 0); p.rotation.x = .15; } for (let i = 0; i < 6; i++) box(.6, .04, .06, M("#7a5232"), ESC, 0, .3 + i * .35, -.05 + i * .05);
// ---------- mascote: óculos de aro fino + lápis atrás da "orelha" (na lateral) ----------
const ocM = M("#2a2f38", { roughness: .3 }); const OC = new THREE.Group(); OC.position.set(0, 1.04, .53); MAS.corpo.add(OC); for (const x of [-.27, .27]) mesh(new THREE.TorusGeometry(.21, .02, 8, 32), ocM, OC, x, 0, 0); box(.14, .03, .03, ocM, OC, 0, .02, 0);
const lapis = box(.06, .06, .5, M("#ffcf3f"), MAS.corpo, .78, 1.3, .05); lapis.rotation.y = .4;
const MX = -.4, MZ = .45;
const abre = (lt, alvo) => { const k = Math.sin(lt * 3); pose(MAS, { x: MX + .2, z: MZ, y: hop(lt, .5, .04), ry: -.3, braco: [.6, 1.2 + k * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const olha = (lt, ry = .2) => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .8, .03), ry, braco: [.3, .5 + Math.sin(lt * 2) * .1], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const feliz = lt => { pose(MAS, { x: MX, z: MZ, y: hop(lt, .35, .24), ry: .1, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
grupo("gancho"); grupo("s1"); grupo("s2"); grupo("s3"); grupo("s4"); grupo("cta");
let FICH = 0;
const reset = () => { GAV.forEach(g => g.position.z = .5); FICHAS.forEach(f => f.visible = false); BAL.visible = false; BOR.visible = false; };
const abreGav = (i, k) => { GAV[i].position.z = .5 + eo(k) * .55; };
const voa = (f, i, k) => { f.visible = k > 0 && k < 1; const e = eio(k), alvo = new THREE.Vector3(); GAV[i].getWorldPosition(alvo); alvo.z += .3; f.position.set(-2.4 + (alvo.x + 2.4) * e, 2.6 + Math.sin(k * Math.PI) * .8 + (alvo.y - 2.6) * e, .6 + (alvo.z - .6) * e); f.rotation.set(0, (1 - e) * 2, (1 - e) * .6); };
// ---------- travelling lateral ----------
const TR = { gancho: [-.5, .4], s1: [.5, -.3], s2: [-.8, -.1], s3: [.3, -.3], s4: [-.3, .6], cta: [.1, -.1] };
const SHOTS = {}; Object.keys(TR).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [a, b] = TR[nome] || TR.cta, x = a + (b - a) * eio(lt / d); cam.position.set(x, 2.2, 6.6); cam.lookAt(x * .6 + .2, 1.4, -.8); };
const ACT = {
  gancho(lt, d) { reset(); abreGav(0, lin(lt, 1.0, 1.6)); FICH = 47; olha(lt, -.2); },
  s1(lt, d) { reset(); abreGav(0, 1); FICHAS.forEach((f, i) => voa(f, [0, 1, 3, 6, 8][i], lin(lt, .3 + i * .45, 1.1 + i * .45))); [1, 3, 6, 8].forEach((g, i) => abreGav(g, Math.sin(lin(lt, .7 + i * .45, 1.6 + i * .45) * Math.PI)));
    FICH = 47 + Math.floor(lin(lt, .3, d) * 5) + lin(lt, .3, d) * 5 % 1; abre(lt); },
  s2(lt, d) { reset(); abreGav(0, 1); BAL.visible = true; const k = lin(lt, .6, d * .7); BAL.material.opacity = 1 - k; BAL.material.transparent = true; BOR.visible = true; BOR.position.set(-1.6 + Math.sin(lt * 9) * .5 * (k < 1 ? 1 : 0), 2.4 + (1 - k) * .1, .1); BOR.rotation.z = Math.sin(lt * 9) * .3;
    FICH = 52; olha(lt, -.5); },
  s3(lt, d) { reset(); abreGav(0, 1); FICH = 52; abre(lt); },
  s4(lt, d) { reset(); abreGav(0, 1); abreGav(4, Math.min(1, lt)); const k = lin(lt, 1.5, 2.6); BOR.visible = k > 0 && k < 1; const al = new THREE.Vector3(); GAV[4].getWorldPosition(al); BOR.position.set(al.x + Math.sin(lt * 10) * .25, al.y + .45, al.z + .5); FICH = 52 - (k >= 1 ? 1 : 0); abre(lt); },
  cta(lt, d) { reset(); abreGav(0, 1); FICH = 51; feliz(lt); },
};
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C; const GY3 = 600;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `700 ${f}px FR`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const odo = (v, x, y) => { const s = String(Math.floor(v)).padStart(3, "0"), w = 58, h = 84; X.fillStyle = MAR; X.beginPath(); X.roundRect(x - 10, y - h / 2 - 10, 3 * (w + 6) + 14, h + 20, 12); X.fill();
    for (let i = 0; i < 3; i++) { const xx = x + i * (w + 6), d = +s[i], fr = i === 2 ? v % 1 : 0; X.save(); X.beginPath(); X.roundRect(xx, y - h / 2, w, h, 6); X.clip(); X.fillStyle = PAP; X.fillRect(xx, y - h / 2, w, h); X.fillStyle = TINTA; X.font = "700 60px FR"; X.textAlign = "center"; X.textBaseline = "middle";
      X.fillText(String(d), xx + w / 2, y + 3 - fr * h); X.fillText(String((d + 1) % 10), xx + w / 2, y + 3 + h - fr * h); X.restore(); }
    X.fillStyle = TINTA; X.font = "700 24px FR"; X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillText("fichas sobre você", x, y + h / 2 + 34); X.fillStyle = "#fff"; X.beginPath(); X.roundRect(x, y + h / 2 + 46, 150, 32, 16); X.fill(); X.fillStyle = MAR; X.font = "700 18px FR"; X.textAlign = "center"; X.fillText("ILUSTRATIVO", x + 75, y + h / 2 + 68); };
  const carimbo = (txt, x, y, lt, cor) => { const k = lin(lt, .2, .45); if (k <= 0) return; const s = 1 + (1 - eo(k)) * 1.6; X.save(); X.translate(x, y); X.rotate(-.08); X.scale(s, s); X.globalAlpha = Math.min(1, k * 1.5);
    X.font = "700 66px FR"; const w = X.measureText(txt).width + 56; X.strokeStyle = cor; X.lineWidth = 8; X.strokeRect(-w / 2, -50, w, 100); X.fillStyle = cor; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(txt, 0, 4); X.restore(); X.globalAlpha = 1; };
  return {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 70], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(243,231,210,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (nome !== "cta") odo(FICH, 700, 660);
      if (nome === "s1") carimbo("MEMÓRIA", 300, 680, lt, VERM);
      if (nome === "s2" && lt > 1.6) carimbo("CONTINUA AQUI", 330, 700, lt - 1.4, VERDE);
      if (nome === "s4") { const n = Math.floor(lin(lt, .2, 1.6) * 3); ["Configurações", "Personalização", "Memórias"].slice(0, n + 1).forEach((s, i) => { X.fillStyle = i === n ? MAR : "rgba(29,45,92,.75)"; X.beginPath(); X.roundRect(60, 612 + i * 70, 440, 58, 14); X.fill(); X.fillStyle = "#fff"; X.font = "700 34px FR"; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText((i ? "› " : "") + s, 84, 642 + i * 70); }); } },
    etiqueta(t, nome) { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.fillStyle = "#5c4a35"; X.fillRect(-300, 110, 16, 70); X.fillRect(284, 110, 16, 70);
      X.fillStyle = MAR; X.beginPath(); X.roundRect(-455, -128, 910, 256, 14); X.fill(); X.strokeStyle = "#fff"; X.lineWidth = 6; X.beginPath(); X.roundRect(-440, -113, 880, 226, 8); X.stroke();
      X.textAlign = "center"; X.textBaseline = "alphabetic"; X.fillStyle = "#fff"; cabe(66, l1, 830); X.fillText(l1, 0, -30); X.fillStyle = "#ffcf3f"; cabe(50, l2, 830); X.fillText(l2, 0, 30); X.fillStyle = "#b9c8ee"; cabe(42, l3, 830); X.fillText(l3, 0, 86); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { const ws = seg.palavras; let w = ws.findIndex(x => t < x.t1 + .06); if (w < 0) w = ws.length - 1; const W = ws[w]; if (t < W.t0 - .25) return;
      const p = back(lin(t, W.t0 - .04, W.t0 + .14)); const txt = W.w.replace(/[,.:]$/, ""), chave = txt.replace(/[?!]/g, "").toUpperCase() === CHAVE;
      let f = 124; X.font = `700 ${f}px FR`; while (X.measureText(txt).width > 820 && f > 50) { f -= 4; X.font = `700 ${f}px FR`; }
      X.save(); X.translate(505, 1395); X.scale(.6 + .4 * p, .6 + .4 * p); X.textAlign = "center"; X.textBaseline = "middle"; X.lineWidth = 16; X.strokeStyle = "#fff"; X.lineJoin = "round"; X.strokeText(txt, 0, 0); X.fillStyle = chave ? VERM : MAR; X.fillText(txt, 0, 0); X.restore(); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .14) return; X.fillStyle = `rgba(255,255,255,${.85 * (1 - lt / .14)})`; X.fillRect(0, 0, 1080, 1920); },
    fechamento(lt) { const P = [["COMENTA " + CHAVE, "#ffcf3f", 505, 780, -.03, 80, MAR, 720, 170], ["Configurações › Personalização › Memórias", "#cfe0ff", 290, 1070, .05, 38, TINTA, 400, 240], ["apaga o que não quer, deixa o que ajuda", "#ffd8c2", 720, 1090, -.05, 38, TINTA, 380, 240]];
      P.forEach(([txt, cor, x, y, r, f, tc, w, h], i) => { const p = back(lin(lt, i * .2, i * .2 + .35)); if (p <= 0) return; X.save(); X.translate(x, y); X.rotate(r + Math.sin(lt * 2 + i) * .01); X.scale(p, p);
        X.shadowColor = "rgba(20,20,40,.3)"; X.shadowBlur = 16; X.shadowOffsetY = 8; X.fillStyle = cor; X.fillRect(-w / 2, -h / 2, w, h); X.shadowColor = "transparent"; X.fillStyle = "rgba(255,255,255,.6)"; X.fillRect(-50, -h / 2 - 14, 100, 28);
        X.fillStyle = tc; X.textAlign = "center"; X.textBaseline = "middle"; X.font = `700 ${f}px FR`; const ws = txt.split(" "), L = []; let c = ""; for (const w2 of ws) { const tt = c ? c + " " + w2 : w2; if (X.measureText(tt).width > w - 40 && c) { L.push(c); c = w2; } else c = tt; } L.push(c);
        L.forEach((l, k) => X.fillText(l, 0, (k - (L.length - 1) / 2) * f * 1.15 + 4)); X.restore(); });
      if (lt > 1.0) { X.globalAlpha = eo(lin(lt, 1.0, 1.4)); X.fillStyle = MAR; X.font = "700 44px FR"; X.textAlign = "center"; X.fillText("Você sabia que ele guardava isso?", 505, 1320); X.globalAlpha = 1; } },
  }; };
const cores = { LAR: MAR, VERDE, FUNDO, CREME: PAP, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

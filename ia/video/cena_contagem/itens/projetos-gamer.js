// Reel 🆕 contagem "5 projetos que todo gamer queria" (BCD, Steam Stash, Autopilot, Bridgeplay, Co-op Anything; 14/11 07:00).
// Identidade: lan house depois do campeonato, de manhã: bancadas com monitores, cadeiras gamer, latas e caixa de pizza no chão,
// fita de LED roxa. O mascote varre a bagunça enquanto cada projeto acende num monitor; nº 1: dois controles ligados por um cabo
// que vira um coração de co-op na TV grande. Roxo-LED + ciano + laranja-pizza. Sem logo de loja, console ou jogo.
// Elementos: placa de aeroporto azul, nome em carimbo, placar HI-SCORE, tarja de TV, zoom atravessando uma tela, plongée/contra-plongée,
// pódio, Caveat. Mascote de boné virado; ação principal: varrer.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const ROXO = "#7b3cff", ROXO2 = "#2a1452", CIANO = "#33e0ff", LAR = "#ff8a3d", TINTA = "#171326", FUNDO = "#f3f0fb", AZS = "#1557c0", AMAR = "#ffd23f", CREME = "#fffaf2";
rim.color.set(0xb79cff); rim.intensity = 1.8; key.color.set(0xffffff); key.intensity = 140; key.position.set(2, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xe8e0ff, .6));
// ---------- lan house ----------
const pT = ctex(512, 256, (g, w, h) => { g.fillStyle = "#2b2440"; g.fillRect(0, 0, w, h); g.fillStyle = ROXO; g.fillRect(0, 60, w, 6); g.fillStyle = "rgba(51,224,255,.12)"; for (let x = 0; x < w; x += 48) g.fillRect(x, 0, 2, h); g.fillStyle = "#3a3256"; g.fillRect(0, 200, w, h); });
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshBasicMaterial({ map: pT }), S, 0, 4.5, -2.8).castShadow = false;
const cT = ctex(256, 256, (g, w, h) => { g.fillStyle = "#4a4a5a"; g.fillRect(0, 0, w, h); for (let i = 0; i < 500; i++) { g.fillStyle = i % 2 ? "#525264" : "#444452"; g.fillRect((i * 37) % w, (i * 71) % h, 4, 4); } }); cT.wrapS = cT.wrapT = THREE.RepeatWrapping; cT.repeat.set(5, 3);
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: cT, roughness: .8 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
const led = box(9, .04, .04, E(ROXO, 2), S, 0, .9, -2.75);
// bancada com 4 monitores
box(5.2, .08, .9, M("#22202c", { roughness: .4 }), S, -.2, .85, -1.9); for (const x of [-2.7, 2.3]) box(.08, .85, .8, M("#18161f"), S, x, .42, -1.9);
const telaC = (desenho) => ctex(256, 160, g => { g.fillStyle = "#0b0a14"; g.fillRect(0, 0, 256, 160); desenho(g); });
const MONS = [
  ["n5", telaC(g => { g.fillStyle = "#222"; g.fillRect(96, 20, 64, 120); g.fillStyle = CIANO; g.fillRect(100, 28, 56, 104); g.fillStyle = "#0b0a14"; g.font = "700 22px CV"; g.textAlign = "center"; g.font = "700 18px CV"; g.fillText("PC NO", 128, 76); g.fillText("CELULAR", 128, 98); })],
  ["n4", telaC(g => { g.fillStyle = AMAR; g.font = "700 64px CV"; g.textAlign = "center"; g.fillText("R$ ???", 128, 96); g.fillStyle = "#fff"; g.font = "700 22px CV"; g.fillText("sua biblioteca vale", 128, 136); })],
  ["n3", telaC(g => { g.strokeStyle = CIANO; g.lineWidth = 4; g.strokeRect(60, 40, 136, 80); g.fillStyle = CIANO; g.font = "700 30px CV"; g.textAlign = "center"; g.fillText("IA jogando", 128, 90); g.fillStyle = LAR; g.beginPath(); g.arc(200, 40, 8, 0, 7); g.fill(); })],
  ["n2", telaC(g => { g.fillStyle = "#e9edf2"; g.fillRect(20, 20, 216, 120); g.fillStyle = "#c8ced6"; g.fillRect(20, 20, 216, 14); g.fillStyle = ROXO; g.fillRect(40, 50, 176, 74); g.fillStyle = "#fff"; g.font = "700 26px CV"; g.textAlign = "center"; g.fillText("jogo de PC", 128, 96); })]];
const MON = {}; MONS.forEach(([n, t], i) => { const g = new THREE.Group(); g.position.set(-2.1 + i * 1.3, .89, -2.0); S.add(g); box(1.0, .62, .06, M("#111"), g, 0, .55, 0); const tela = mesh(new THREE.PlaneGeometry(.92, .54), new THREE.MeshBasicMaterial({ map: t, color: "#333" }), g, 0, .55, .035); tela.castShadow = false; box(.06, .25, .06, M("#111"), g, 0, .12, 0); MON[n] = tela; });
// TV grande (nº 1) com coração de co-op e dois controles ligados por cabo
const tvC = document.createElement("canvas"); tvC.width = 512; tvC.height = 288; const tg = tvC.getContext("2d"); const tvT = new THREE.CanvasTexture(tvC); tvT.colorSpace = THREE.SRGBColorSpace;
const TV = new THREE.Group(); TV.position.set(-.2, 1.25, -2.55); S.add(TV); box(2.4, 1.4, .1, M("#111"), TV, 0, 1.0, 0); const tvTela = mesh(new THREE.PlaneGeometry(2.28, 1.28), new THREE.MeshBasicMaterial({ map: tvT }), TV, 0, 1.0, .055); tvTela.castShadow = false;
const desTV = (k, t) => { tg.fillStyle = "#0b0a14"; tg.fillRect(0, 0, 512, 288); if (k <= 0) return; tg.fillStyle = ROXO2; tg.fillRect(0, 0, 255, 288); tg.fillStyle = "#123a52"; tg.fillRect(257, 0, 255, 288); tg.fillStyle = "#fff"; tg.fillRect(255, 0, 2, 288);
  tg.fillStyle = LAR; tg.font = "700 40px CV"; tg.textAlign = "center"; tg.fillText("JOGADOR 1", 128, 60); tg.fillStyle = CIANO; tg.fillText("JOGADOR 2", 384, 60); const s = 1 + Math.sin(t * 6) * .08 * k; tg.save(); tg.translate(256, 170); tg.scale(s * k, s * k); tg.fillStyle = "#ff4d8d"; tg.beginPath(); tg.moveTo(0, 40); tg.bezierCurveTo(-70, -10, -40, -70, 0, -30); tg.bezierCurveTo(40, -70, 70, -10, 0, 40); tg.fill(); tg.restore(); tvT.needsUpdate = true; };
const ctrl = (cor) => { const g = new THREE.Group(); S.add(g); box(.5, .12, .26, M(cor, { roughness: .4 }), g, 0, 0, 0); for (const s of [-1, 1]) box(.16, .12, .26, M(cor), g, s * .26, -.03, .06); return g; };
const C1 = ctrl(LAR), C2 = ctrl(CIANO); const CABO = mesh(new THREE.CylinderGeometry(.015, .015, 1, 6), M("#fff"), S); CABO.rotation.z = Math.PI / 2;
// bagunça: latas, caixa de pizza, lixo que vai sendo varrido
const LIXO = []; for (let i = 0; i < 10; i++) { const l = i % 3 ? mesh(new THREE.CylinderGeometry(.07, .07, .22, 10), M([LAR, CIANO, ROXO][i % 3], { metalness: .5 }), S) : box(.6, .06, .6, M("#d9b98c"), S, 0, 0, 0); l.userData.p = V(-1.6 + (i * .53) % 3.4, i % 3 ? .07 : .03, .2 + (i * .37) % 1.0); if (i % 3) l.rotation.z = Math.PI / 2; LIXO.push(l); }
const varre = k => LIXO.forEach((l, i) => { const p = l.userData.p, u = Math.max(0, Math.min(1, k * 1.4 - i * .04)); l.position.set(p.x + (2.6 - p.x) * eio(u), p.y, p.z + (1.1 - p.z) * eio(u) * .6); l.rotation.y = u * 3; });
// ---------- mascote: boné virado + vassoura; varre ----------
const BON = new THREE.Group(); BON.position.set(0, 1.5, 0); BON.rotation.y = Math.PI; MAS.corpo.add(BON); mesh(new THREE.SphereGeometry(.56, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M(ROXO, { roughness: .5 }), BON, 0, -.05, 0).scale.set(1.2, .55, 1); box(.6, .04, .4, M(ROXO), BON, 0, -.02, .6);
const VAS = new THREE.Group(); VAS.position.set(.45, -.1, .2); MAS.bracos[1].add(VAS); const cabo = box(.05, 1.4, .05, M("#c89b63"), VAS, .1, -.4, 0); cabo.rotation.z = .5; box(.5, .18, .14, M(AMAR, { roughness: .9 }), VAS, .45, -1.05, 0).rotation.z = .5;
const MZ = .9;
const varrendo = (lt, x) => { const s = Math.sin(lt * 6); pose(MAS, { x: x + s * .08, z: MZ, y: hop(lt, .5, .02), ry: -.25, braco: [.4, .8 + s * .3], piscar: pisca(lt) }); MAS.g.rotation.z = s * .04; VAS.rotation.z = s * .25; };
const feliz = (lt, x) => { VAS.rotation.z = 0; pose(MAS, { x, z: MZ, y: hop(lt, .35, .22), ry: -.2, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; };
const NS = ["gancho", "n5", "n4", "n3", "n2", "n1", "cta"]; NS.forEach(n => grupo(n));
const ORD = ["n5", "n4", "n3", "n2", "n1"];
const reset = (lt, nome) => { const i = ORD.indexOf(nome); Object.entries(MON).forEach(([n, m]) => { const j = ORD.indexOf(n); m.material.color.set(j === i ? "#ffffff" : j < i || nome === "cta" ? "#888" : "#333"); }); C1.visible = C2.visible = CABO.visible = false; desTV(0, lt); led.material.emissiveIntensity = 1.5 + Math.sin(lt * 3); };
const ctrls = (k, t) => { C1.visible = C2.visible = CABO.visible = k > 0; const a = 1 - eio(k); C1.position.set(-.6 - a * .8, 1.2 + Math.sin(t * 3) * .05, -.6); C2.position.set(.6 + a * .8, 1.2 + Math.cos(t * 3) * .05, -.6); C1.rotation.y = .3; C2.rotation.y = -.3; CABO.position.set(0, 1.2, -.6); CABO.scale.y = Math.max(.01, 1.2 * (1 - a)); };
// ---------- plongée / contra-plongée ----------
const BS = { gancho: [V(.2, 4.4, 7.2), V(-.2, .8, -.6)], n5: [V(-.4, 1.0, 6.6), V(-.6, 1.6, -1.6)], n4: [V(.2, 4.2, 7.0), V(-.6, 1.0, -1.2)], n3: [V(.3, 1.0, 6.6), V(.3, 1.6, -1.6)], n2: [V(.4, 4.2, 7.0), V(.6, 1.0, -1.2)], n1: [V(0, 1.0, 6.8), V(-.1, 1.9, -1.8)], cta: [V(0, 3.0, 7.8), V(0, 1.5, -1.0)] };
const SHOTS = {}; Object.keys(BS).forEach(n => { const s = [BS[n][0], BS[n][1]]; SHOTS[n] = [s, s]; });
const camera = (cam, nome, lt, d) => { const [p, l] = BS[nome] || BS.cta, u = eio(Math.min(1, lt / d)); cam.position.set(p.x, p.y + (p.y > 2 ? -.4 : .25) * u, p.z - u * .5); cam.lookAt(l.x, l.y, l.z); };
const ACT = { gancho(lt, d) { reset(lt, "gancho"); varre(0); varrendo(lt, .9); }, cta(lt) { reset(lt, "cta"); varre(1); desTV(1, lt); ctrls(1, lt); feliz(lt, 2.1); } };
ORD.forEach((n, i) => ACT[n] = (lt, d) => { reset(lt, n); varre((i + lin(lt, 0, d)) / 5); if (n === "n1") { desTV(eio(lin(lt, .8, 1.6)), lt); ctrls(lin(lt, .2, 1.0), lt); lt > 1.6 ? feliz(lt, 1.7) : varrendo(lt, 1.7); } else varrendo(lt, 1.6); });
// ---------- 2D: entre y=260 e y=1500, a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE, ITENS } = C; const GY3 = 620; let CAB = null;
  const cabe = (f, txt, mx, fam = "CV", peso = 700) => { while (f > 20) { X.font = `${peso} ${f}px ${fam}`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const fmtP = n => Math.round(n).toLocaleString("pt-BR");
  const carimbo = (txt, x, y, lt, t0, cor, rot = -.08) => { if (lt < t0) return; const k = lin(lt, t0, t0 + .18), s = 2.4 - 1.4 * eo(k), tr = k >= 1 ? Math.max(0, 1 - (lt - t0 - .18) / .15) : 0; const fs = cabe(84, txt, 560);
    X.save(); X.translate(x + Math.sin(lt * 80) * 6 * tr, y); X.rotate(rot); X.scale(s, s); X.globalAlpha = Math.min(1, .3 + k); X.font = `700 ${fs}px CV`; const w = X.measureText(txt).width + 60;
    X.fillStyle = "rgba(255,250,242,.94)"; X.beginPath(); X.roundRect(0, -fs * .7, w, fs * 1.4, 12); X.fill(); X.strokeStyle = cor; X.lineWidth = 8; X.stroke(); X.fillStyle = cor; X.textAlign = "left"; X.textBaseline = "middle"; X.fillText(txt, 30, 4); X.restore(); X.globalAlpha = 1; };
  const U = {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 60], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(243,240,251,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (CAB && nome !== "gancho" && nome !== "cta") U.cab2(...CAB); CAB = null; },
    etiqueta(t, nome) { // placa azul de aeroporto
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(505, 410); X.fillStyle = "#7a8090"; X.fillRect(-330, 118, 18, 60); X.fillRect(312, 118, 18, 60);
      X.fillStyle = AZS; X.beginPath(); X.roundRect(-460, -132, 920, 264, 14); X.fill(); X.strokeStyle = "#fff"; X.lineWidth = 5; X.beginPath(); X.roundRect(-448, -120, 896, 240, 10); X.stroke();
      X.fillStyle = "#fff"; X.beginPath(); X.arc(-385, -40, 42, 0, 7); X.fill(); X.fillStyle = AZS; X.font = "700 52px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("GG", -385, -36);
      X.textAlign = "left"; X.textBaseline = "alphabetic"; X.fillStyle = "#fff"; cabe(64, l1, 760); X.fillText(l1, -320, -30); X.fillStyle = AMAR; cabe(58, l2, 760); X.fillText(l2, -320, 34); X.fillStyle = "#bfe8ff"; cabe(46, l3, 880); X.fillText(l3, -430, 98); X.restore(); },
    cabecalho(s, lt, t) { CAB = [s, lt, t]; },
    cab2(s, lt, t) { const y = 680; X.fillStyle = ROXO; X.beginPath(); X.arc(100, y, 44, 0, 7); X.fill(); X.fillStyle = "#fff"; X.font = "700 60px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(s.tag.replace(/\D/g, ""), 100, y + 3);
      carimbo(s.item, 160, y, lt, .15, ROXO);
      const v = s.estrelas * eio(lin(lt, .4, 1.9)); X.fillStyle = "#120c22"; X.beginPath(); X.roundRect(600, 770, 340, 160, 14); X.fill(); X.strokeStyle = CIANO; X.lineWidth = 5; X.stroke(); X.fillStyle = CIANO; X.font = "400 24px PS"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("HI-SCORE", 770, 806);
      X.fillStyle = "#fff"; X.font = "700 74px CV"; X.fillText(fmtP(v), 770, 860); X.fillStyle = "#cfc6ff"; X.font = "700 24px CV"; X.fillText("★ estrelas no GitHub", 770, 904); },
    legenda(seg, t) { const ch = C.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 74; X.font = `700 ${fs}px CV`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 780 && fs > 40) { fs -= 2; X.font = `700 ${fs}px CV`; }
      const y = 1405, x0 = 505 - tot() / 2; X.fillStyle = ROXO2; X.fillRect(40, y - 56, 910, 112); X.fillStyle = CIANO; X.fillRect(40, y + 48, 910, 8); X.fillStyle = ROXO; X.fillRect(60, y - 90, 280, 40); X.fillStyle = "#fff"; X.font = "700 28px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("LAN HOUSE AO VIVO", 200, y - 70);
      let x = x0; X.font = `700 ${fs}px CV`; X.textAlign = "left"; for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; X.fillStyle = at ? AMAR : on ? "#fff" : "rgba(255,255,255,.45)"; X.fillText(w.w, x, y + 4); x += X.measureText(w.w + " ").width; } },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .34) return; const u = eio(lt / .34), w = 240 + u * 2300, h = w * .6;
      X.save(); X.fillStyle = "#0b0a14"; X.beginPath(); X.rect(0, 0, 1080, 1920); X.roundRect(505 - w / 2, 1000 - h / 2, w, h, 16 * (1 - u) + 4); X.fill("evenodd"); X.restore(); },
    fechamento(lt) { X.fillStyle = "rgba(243,240,251,.5)"; X.fillRect(0, 640, 1080, 860);
      const it = ITENS.slice().reverse(), P = [[it[0], 410, 210, ROXO, 1], [it[1], 190, 150, AZS, 2], [it[2], 630, 110, LAR, 3]];
      P.forEach(([s, x, h, c, n], i) => { const k = eo(lin(lt, .1 + i * .15, .5 + i * .15)), hh = h * k, base = 1330; X.fillStyle = c; X.fillRect(x - 100, base - hh, 200, hh); X.fillStyle = "rgba(0,0,0,.2)"; X.fillRect(x - 100, base - hh, 200, 12);
        if (k > .6) { X.fillStyle = "#fff"; X.font = "700 70px CV"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(n + "º", x, base - hh + 56); X.fillStyle = TINTA; X.font = `700 ${cabe(44, s.item, 200)}px CV`; X.fillText(s.item, x, base - hh - 66); X.fillStyle = "#6a6480"; X.font = "700 30px CV"; X.fillText(fmtP(s.estrelas) + " ★", x, base - hh - 28); } });
      X.fillStyle = TINTA; X.fillRect(70, 1330, 690, 12);
      const p = back(lin(lt, .7, 1.1)) * (1 + Math.sin(lt * 6) * .03); X.save(); X.translate(505, 760); X.scale(p, p); X.fillStyle = ROXO; X.beginPath(); X.roundRect(-300, -62, 600, 124, 62); X.fill(); X.fillStyle = "#fff"; X.font = `700 ${cabe(80, "Comenta " + CHAVE, 560)}px CV`; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("Comenta " + CHAVE, 0, 4); X.restore();
      if (lt > 1.1) { X.globalAlpha = eo(lin(lt, 1.1, 1.5)); X.fillStyle = TINTA; X.font = "700 42px CV"; X.textAlign = "center"; X.fillText("Com qual amigo você jogaria primeiro?", 505, 1410); X.globalAlpha = 1; } },
  }; return U; };
const cores = { LAR: ROXO, VERDE: CIANO, FUNDO, CREME, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

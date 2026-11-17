// Base da contagem no Visual clean (Vitor, 14/11 e 17/11: "um formato só, no nível do 5 projetos pra TV").
// Mesma estrutura do campeão (gancho, n5…n1, cta), com a linguagem clean: Archivo Black (AB), branco + dourado,
// sombra suave, 1 objeto por cena, fundo limpo. Cada vídeo passa só o cenário (cfg.cenario), as telas e as cores.
export default function make(K, cfg) {
const { rim, key, THREE, S, box, mesh, M, E, ctex, grupo, pose, MAS, hop, eo, lin, eio, back, V } = K;
const pisca = t => K.pisca(t + .6);
const C = Object.assign({ fundo: "#0f1218", parede: "#2a2f3a", piso: "#3a3f4a", destaque: "#ff7a1a", escuro: "#141821", ouro: "#ffc93c", selo: "MÃO NA MASSA" }, cfg.cores || {});
rim.color.set(0xffffff); rim.intensity = 1.4; key.color.set(0xfff4e6); key.intensity = 150; key.position.set(2.5, 9, 6); key.target.position.set(0, 1, -.3);
S.add(new THREE.AmbientLight(0xffffff, .75));
// ---------- cenário limpo: parede, piso, bancada ----------
mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshStandardMaterial({ color: C.parede, roughness: .9 }), S, 0, 4.5, -2.8).castShadow = false;
const chao = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ color: C.piso, roughness: .7 }), S, 0, 0, 1); chao.rotation.x = -Math.PI / 2;
box(5.4, .08, .9, M("#2a2d36", { roughness: .4 }), S, -.2, .85, -1.9); for (const x of [-2.8, 2.4]) box(.08, .85, .8, M("#1d2028"), S, x, .42, -1.9);
const fita = box(9, .04, .04, E(C.destaque, 1.2), S, 0, .9, -2.75);
if (cfg.cenario) cfg.cenario(K, C);
// ---------- 1 tela grande à direita: muda a cada item (como a TV do campeão) ----------
const cv = document.createElement("canvas"); cv.width = 640; cv.height = 400; const gx = cv.getContext("2d"); const tt = new THREE.CanvasTexture(cv); tt.colorSpace = THREE.SRGBColorSpace;
const TELA = new THREE.Group(); TELA.position.set(.95, 1.55, -.3); TELA.rotation.y = -.22; S.add(TELA);
box(2.5, 1.6, .1, M("#0c0d10", { roughness: .35 }), TELA, 0, 0, 0); mesh(new THREE.PlaneGeometry(2.36, 1.47), new THREE.MeshBasicMaterial({ map: tt }), TELA, 0, 0, .056).castShadow = false;
box(.1, 1.0, .1, M("#0c0d10"), TELA, 0, -1.25, -.05); box(.9, .06, .5, M("#0c0d10"), TELA, 0, -1.75, 0);
const desenha = (nome, k, t) => { gx.save(); gx.fillStyle = C.escuro; gx.fillRect(0, 0, 640, 400); gx.textAlign = "center"; gx.textBaseline = "middle";
  const f = (cfg.telas || {})[nome]; if (f) { gx.scale(2.5, 2.5); f(gx, C, k, t); } gx.restore(); tt.needsUpdate = true; };
// ---------- mascote com o acessório do vídeo ----------
if (cfg.acessorio) cfg.acessorio(K, C);
const MZ = .4;
const anda = (lt, x) => { const s = Math.sin(lt * 5); pose(MAS, { x: x + s * .05, z: MZ, y: hop(lt, .5, .03), ry: .35, braco: [.5, .9 + s * .3], piscar: pisca(lt) }); };
const feliz = (lt, x) => pose(MAS, { x, z: MZ, y: hop(lt, .35, .2), ry: .35, braco: [2.0 + Math.sin(lt * 9) * .3, 2.0 + Math.sin(lt * 9 + 1) * .3], piscar: pisca(lt) });
const NS = ["gancho", "n5", "n4", "n3", "n2", "n1", "cta"]; NS.forEach(n => grupo(n));
const ORD = ["n5", "n4", "n3", "n2", "n1"];
const reset = (lt, nome) => { fita.material.emissiveIntensity = 1 + Math.sin(lt * 3) * .4; };
// câmera: travelling lateral suave (cada item numa altura), sem plano parado
const BS = { gancho: [V(-.6, 2.4, 6.4), V(-.1, 1.2, -.6)], n5: [V(-.9, 1.7, 5.4), V(-.1, 1.3, -.5)], n4: [V(.5, 1.5, 5.4), V(-.1, 1.3, -.5)], n3: [V(-.9, 1.9, 5.3), V(-.1, 1.3, -.5)], n2: [V(.6, 1.7, 5.4), V(-.1, 1.3, -.5)], n1: [V(-.2, 1.6, 5.0), V(-.1, 1.35, -.5)], cta: [V(0, 2.6, 6.6), V(0, 1.3, -.6)] };
const SHOTS = {}; Object.keys(BS).forEach(n => { const s = [BS[n][0], BS[n][1]]; SHOTS[n] = [s, s]; });
const camera = (cam, nome, lt, d) => { const [p, l] = BS[nome] || BS.cta, u = eio(Math.min(1, lt / d)); cam.position.set(p.x + u * .5, p.y + .15 * u, p.z - u * .6); cam.lookAt(l.x + u * .2, l.y, l.z); };
const MX = -1.05;
const ACT = { gancho(lt, d) { reset(lt); desenha("gancho", eio(lin(lt, 0, d)), lt); anda(lt, MX); }, cta(lt) { reset(lt); desenha("n1", 1, lt); feliz(lt, MX); } };
ORD.forEach(n => ACT[n] = (lt, d) => { reset(lt); desenha(n, eio(lin(lt, .2, Math.min(d, 2.2))), lt); n === "n1" && lt > 1.6 ? feliz(lt, MX) : anda(lt, MX); });
// ---------- 2D clean: Archivo Black, branco + dourado, sombra suave; entre y=260 e y=1500, 130 px da direita ----------
const ui = Cx => { const { X, GH, SEGR, CHAVE, ITENS } = Cx; const GY3 = 620; let CAB = null;
  const cabe = (f, txt, mx) => { while (f > 20) { X.font = `400 ${f}px AB`; if (X.measureText(txt).width <= mx) break; f -= 2; } return f; };
  const fmtP = n => Math.round(n).toLocaleString("pt-BR");
  const sombra = (on) => { X.shadowColor = on ? "rgba(0,0,0,.35)" : "transparent"; X.shadowBlur = on ? 18 : 0; X.shadowOffsetY = on ? 4 : 0; };
  const txt = (s, x, y, f, cor, al = "center") => { X.font = `400 ${f}px AB`; X.textAlign = al; X.textBaseline = "middle"; X.fillStyle = cor; X.fillText(s, x, y); };
  const U = {
    fundo() { X.fillStyle = C.fundo; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome) { X.drawImage(g, 0, GY3); for (const [y0, y1] of [[GY3, GY3 + 60], [GY3 + GH, GY3 + GH - 80]]) { const fg = X.createLinearGradient(0, y0, 0, y1); fg.addColorStop(0, C.fundo); fg.addColorStop(1, "rgba(0,0,0,0)"); X.fillStyle = fg; X.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
      if (CAB && nome !== "gancho" && nome !== "cta") U.cab2(...CAB); CAB = null; },
    etiqueta() { const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.fillStyle = "#1b202a"; X.beginPath(); X.roundRect(70, 290, 870, 270, 28); X.fill();
      X.fillStyle = C.ouro; X.beginPath(); X.roundRect(110, 262, 0 + (X.font = "400 30px AB", X.measureText(C.selo).width + 48), 54, 27); X.fill(); txt(C.selo, 134, 290, 30, C.escuro, "left");
      sombra(true); txt(l1, 505, 370, cabe(62, l1, 800), "#ffffff"); txt(l2, 505, 445, cabe(56, l2, 800), C.ouro); txt(l3, 505, 512, cabe(40, l3, 800), "#d9dde6"); sombra(false); X.restore(); },
    cabecalho(s, lt, t) { CAB = [s, lt, t]; },
    cab2(s, lt) { const y = 690, k = eo(lin(lt, .1, .4)); X.save(); X.globalAlpha = k;
      X.fillStyle = C.destaque; X.beginPath(); X.roundRect(70, y - 52, 104, 104, 22); X.fill(); txt("#" + s.tag.replace(/\D/g, ""), 122, y + 2, 48, C.escuro);
      const nm = s.item, f = cabe(78, nm, 560); X.translate(0, 18 * (1 - k)); txt(nm, 200, y, f, "#ffffff", "left");
      const v = s.estrelas * eio(lin(lt, .4, 1.8)); X.fillStyle = "#ffffff"; X.beginPath(); X.roundRect(70, 760, 340, 120, 22); X.fill();
      txt(fmtP(v), 240, 806, cabe(62, fmtP(s.estrelas), 300), C.escuro); txt("★ estrelas no GitHub", 240, 852, 22, "#7a7f8c"); X.restore(); },
    legenda(seg, t) { const ch = Cx.blocos(seg); let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      let fs = 76; X.font = `400 ${fs}px AB`; const tot = () => c.reduce((a, w) => a + X.measureText(w.w + " ").width, 0); while (tot() > 820 && fs > 40) { fs -= 2; X.font = `400 ${fs}px AB`; }
      const y = 1400, x0 = 505 - tot() / 2; let x = x0; X.textAlign = "left"; X.textBaseline = "middle";
      for (const w of c) { const on = t >= w.t0 - .02, at = on && t < w.t1 + .2; if (!on) { x += X.measureText(w.w + " ").width; continue; } X.fillStyle = at ? C.ouro : "#ffffff"; X.fillText(w.w, x, y); x += X.measureText(w.w + " ").width; } sombra(false); },
    transicao(lt, s, nome) { if (nome === "gancho" || lt > .3) return; const u = eio(lt / .3); X.fillStyle = `rgba(20,24,33,${(1 - u) * .85})`; X.fillRect(0, 0, 1080, 1920); },
    fechamento(lt) { X.fillStyle = "rgba(15,18,24,.82)"; X.fillRect(0, 640, 1080, 860);
      const it = ITENS.slice().reverse(); it.slice(0, 5).forEach((s, i) => { const k = eo(lin(lt, .1 + i * .1, .45 + i * .1)), y = 760 + i * 104; X.save(); X.globalAlpha = k; X.translate(40 * (1 - k), 0);
        X.fillStyle = i === 0 ? C.ouro : "#ffffff"; X.beginPath(); X.roundRect(90, y - 42, 830, 84, 20); X.fill(); txt((i + 1) + "º", 140, y + 2, 40, i === 0 ? C.escuro : C.destaque); txt(s.item, 200, y + 2, cabe(44, s.item, 460), C.escuro, "left"); txt(fmtP(s.estrelas) + " ★", 900, y + 2, 30, i === 0 ? C.escuro : "#7a7f8c", "right"); X.restore(); });
      const p = back(lin(lt, .7, 1.1)) * (1 + Math.sin(lt * 6) * .02); X.save(); X.translate(505, 1340); X.scale(p, p); X.fillStyle = C.destaque; X.beginPath(); X.roundRect(-290, -58, 580, 116, 58); X.fill(); txt("Comenta " + CHAVE, 0, 3, cabe(66, "Comenta " + CHAVE, 520), C.escuro); X.restore(); },
  }; return U; };
const cores = { LAR: C.destaque, VERDE: C.ouro, FUNDO: C.fundo, CREME: "#ffffff", TINTA: C.escuro, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

// Objetos e ações dos itens n5…n1 do Reel "5 skills pra editar vídeo" (05/11). Recebe K com as ferramentas da cena.
export default function (K) {
const { THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, misT, caixaMisterio, LAR, CREME, aponta, V } = K;
const CORES = ["#ff5a5f", "#ffd23f", "#3bceac", "#5b8cff", "#c86bff", "#ff9f1c"];
function moldura(par, tex, x, y, z, w, h) { const g = new THREE.Group(); g.position.set(x, y, z); par.add(g);
  box(w + .1, h + .1, .08, M("#0d0c0e", { metalness: .4, roughness: .35 }), g, 0, 0, 0);
  mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }), g, 0, 0, .05); return g; }
function paisagem(g, w, h, i, t = 0) { const P = [["#ffb36b", "#ff6f61", "#3b2a4a"], ["#7fd3ff", "#bde7c9", "#2f6b4a"], ["#2b2d6e", "#c86bff", "#141433"], ["#ffe08a", "#f7a072", "#7a4a2e"]][i % 4];
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, P[0]); gr.addColorStop(1, P[1]); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = "rgba(255,255,255,.8)"; g.beginPath(); g.arc(w * (.25 + .5 * ((i * .37) % 1)), h * .35, h * .1, 0, 7); g.fill();
  g.fillStyle = P[2]; g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 16) g.lineTo(x, h * .68 + Math.sin(x / 50 + i * 2) * h * .07 + Math.sin(x / 17 + i) * h * .02); g.lineTo(w, h); g.fill(); }

// n5 VVV: um modelo de vídeo; fotos entram como cartas e o vídeo recomeça com elas
const n5 = grupo("n5");
const vvvT = ctex(640, 360, (g, w, h, i = 0, t = 0) => { paisagem(g, w, h, i); g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(0, h - 70, w, 70);
  g.fillStyle = "#fff"; g.font = "700 34px SG"; g.textAlign = "left"; g.fillText(["Nossa viagem", "Aniversário da Bia", "Loja nova!", "Fim de semana"][i % 4], 24, h - 24);
  g.fillStyle = LAR; g.fillRect(0, h - 6, w * (t % 1), 6); });
const tela5 = moldura(n5, vvvT, 1.0, 1.75, -.5, 2.4, 1.35);
const cartas = [0, 1, 2, 3].map(i => { const t = ctex(256, 180, (g, w, h) => { g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); g.save(); g.translate(10, 10); paisagem(g, w - 20, h - 40, i); g.restore(); });
  const m = mesh(new THREE.PlaneGeometry(.62, .44), new THREE.MeshBasicMaterial({ map: t, toneMapped: false, side: THREE.DoubleSide }), n5, 0, 0, 0); m.castShadow = false; return m; });

// n4 Rossark Motion: um desenho na prancheta ganha vida (respira, pisca, olha em volta)
const n4 = grupo("n4");
const bichoT = ctex(512, 640, (g, w, h, t = 0) => { g.fillStyle = "#fbf6ec"; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(0,0,0,.06)"; for (let y = 30; y < h; y += 34) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  const vivo = Math.min(1, t / .9), resp = 1 + Math.sin(t * 3.2) * .05 * vivo, olhar = Math.sin(t * 1.3) * 14 * vivo, pisc = vivo && (t % 1.9) < .12 ? .15 : 1;
  g.save(); g.translate(w / 2, h * .62); g.scale(1 / resp * 1.02, resp); g.lineWidth = 9; g.strokeStyle = "#1b1712"; g.fillStyle = "#ffd6a8";
  g.beginPath(); g.ellipse(0, -110, 150, 130, 0, 0, 7); g.fill(); g.stroke();
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 120, -200); g.lineTo(s * 150, -290 - (vivo ? Math.sin(t * 4 + s) * 12 : 0)); g.lineTo(s * 70, -230); g.closePath(); g.fill(); g.stroke(); }
  g.fillStyle = "#1b1712"; for (const s of [-1, 1]) { g.save(); g.translate(s * 50 + olhar, -130); g.scale(1, pisc); g.beginPath(); g.ellipse(0, 0, 16, 24, 0, 0, 7); g.fill(); g.restore(); }
  g.beginPath(); g.arc(olhar * .6, -80, 26, .2, Math.PI - .2); g.stroke();
  g.fillStyle = "#ffd6a8"; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * 70, 20 + (vivo ? Math.abs(Math.sin(t * 3.2 + s)) * -6 : 0), 34, 22, 0, 0, 7); g.fill(); g.stroke(); }
  g.restore(); if (vivo > 0) { g.strokeStyle = `rgba(232,116,59,${.5 * vivo})`; g.lineWidth = 6; for (let k = 0; k < 3; k++) { const a = t * 2 + k * 2.1; g.beginPath(); g.arc(w / 2 + Math.cos(a) * 200, h * .3 + Math.sin(a) * 60, 6, 0, 7); g.stroke(); } } });
const prancheta = new THREE.Group(); prancheta.position.set(1.0, 0, -.4); n4.add(prancheta);
for (const x of [-.6, .6]) { const l = box(.08, 2.7, .08, M("#8a5a35"), prancheta, x, 1.35, -.15); l.rotation.x = .1; }
mesh(new THREE.PlaneGeometry(1.4, 1.75), M("#ffffff", { map: bichoT, roughness: .8 }), prancheta, 0, 1.85, .01);
const lapis4 = new THREE.Group(); n4.add(lapis4); mesh(new THREE.CylinderGeometry(.05, .05, .7, 6), M("#ffd23f"), lapis4, 0, 0, 0); mesh(new THREE.ConeGeometry(.05, .14, 6), M("#f1d3a6"), lapis4, 0, -.42, 0).rotation.x = Math.PI;

// n3 Video Effects: um vídeo do mascote ganha efeitos a cada comando /effects
const n3 = grupo("n3");
const EFX = ["orbit", "glow", "zoom", "glitch"];
const vfxT = ctex(640, 360, (g, w, h, t = 0, e = 0) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, "#241a2e"); gr.addColorStop(1, "#3a1f1a"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  const z = e === 2 ? 1 + .25 * Math.abs(Math.sin(t * 3)) : 1; g.save(); g.translate(w / 2, h * .55); g.scale(z, z);
  if (e === 1) { g.shadowColor = "#ffb36b"; g.shadowBlur = 50; } g.fillStyle = "#D0623A"; g.beginPath(); g.roundRect(-110, -80, 220, 150, 18); g.fill(); g.shadowBlur = 0;
  g.fillStyle = "#141014"; g.fillRect(-45, -45, 18, 50); g.fillRect(27, -45, 18, 50); for (let i = 0; i < 4; i++) { g.fillStyle = "#b9502e"; g.fillRect(-80 + i * 46, 70, 26, 34); } g.restore();
  if (e === 3) { for (let k = 0; k < 6; k++) { const y = ((k * 61 + Math.floor(t * 20) * 37) % h); g.drawImage(g.canvas, 0, y, w, 14, (k % 2 ? 18 : -18), y, w, 14); } }
  g.fillStyle = "rgba(0,0,0,.5)"; g.beginPath(); g.roundRect(18, 18, 300, 54, 12); g.fill(); g.fillStyle = "#5fe0b2"; g.font = "500 30px JB"; g.textAlign = "left"; g.textBaseline = "middle";
  const cmd = "/effects " + EFX[e]; g.fillText(cmd.slice(0, Math.min(cmd.length, Math.floor((t % .9) / .9 * 40))), 32, 46); });
const tela3 = moldura(n3, vfxT, .95, 1.75, -.4, 2.8, 1.58);
const aneis = [0, 1].map(i => { const a = mesh(new THREE.TorusGeometry(1.25 + i * .2, .025, 8, 80), E(i ? "#5fe0b2" : LAR, 2), n3, 1.0, 1.7, -.45); a.castShadow = false; return a; });

// n2 editonny: linha do tempo; os silêncios somem, as legendas aparecem e o áudio fica limpo
const n2 = grupo("n2");
const trilho = new THREE.Group(); trilho.position.set(.75, 1.2, .2); trilho.scale.setScalar(1.25); n2.add(trilho);
box(2.9, .06, .5, M("#1f1b18"), trilho, 0, -.08, 0);
const CL = [[.55, LAR], [.4, "#5b8cff"], [.6, "#3bceac"], [.35, "#c86bff"], [.45, "#ffd23f"]], GAP = .32;
const clipes = CL.map(([w, c], i) => { const m = box(w, .2, .36, M(c, { roughness: .4 }), trilho, 0, .06, 0); return { m, w }; });
const vazios = CL.slice(0, -1).map(() => { const m = box(GAP - .04, .12, .3, M("#2c2724", { transparent: true, opacity: .9 }), trilho, 0, .02, 0); return m; });
const ondaT = ctex(640, 120, (g, w, h, limpo = 0) => { g.clearRect(0, 0, w, h); for (let x = 0; x < w; x += 8) { const ruido = (1 - limpo) * Math.abs(Math.sin(x * 1.7) * Math.cos(x * .31)) * 40, a = 14 + Math.abs(Math.sin(x / 40)) * 30 + ruido; g.fillStyle = limpo > .5 ? "#5fe0b2" : "#ff8a6b"; g.fillRect(x, h / 2 - a / 2, 5, a); } });
const onda = mesh(new THREE.PlaneGeometry(2.9, .5), new THREE.MeshBasicMaterial({ map: ondaT, transparent: true, toneMapped: false }), trilho, 0, .55, -.1); onda.castShadow = false;
const legT = ctex(512, 96, (g, w, h, k = 0) => { g.clearRect(0, 0, w, h); if (k < 0) return; g.fillStyle = "rgba(244,234,216,.96)"; g.beginPath(); g.roundRect(0, 0, w, h, 16); g.fill(); g.fillStyle = "#1b1712"; g.font = "700 40px SG"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(["oi, gente!", "hoje eu vou", "mostrar 3 dicas"][k % 3], w / 2, h / 2 + 2); });
const leg = mesh(new THREE.PlaneGeometry(1.5, .28), new THREE.MeshBasicMaterial({ map: legT, transparent: true, toneMapped: false }), trilho, 0, 1.05, 0); leg.castShadow = false;

// n1 rea-video: a caixa "?" explode; um vídeo se separa em quadros, cada um com o selo de como foi feito
const n1 = grupo("n1"); const mis1 = caixaMisterio(n1);
const SELOS = [["FILMADO", "#3bceac"], ["IA", "#ff5a5f"], ["CÓDIGO", "#5b8cff"], ["IA", "#ff5a5f"], ["FILMADO", "#3bceac"]];
const quadros = SELOS.map(([s, c], i) => { const t = ctex(320, 220, (g, w, h) => { g.fillStyle = "#0d0c0e"; g.fillRect(0, 0, w, h); g.save(); g.translate(10, 10); paisagem(g, w - 20, h - 20, i); g.restore();
    g.fillStyle = c; g.beginPath(); g.roundRect(14, h - 62, g.measureText ? 160 : 160, 46, 10); g.fill(); g.fillStyle = "#fff"; g.font = "700 30px SG"; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText(s, 26, h - 38); });
  const m = mesh(new THREE.PlaneGeometry(1.3, .9), new THREE.MeshBasicMaterial({ map: t, toneMapped: false, side: THREE.DoubleSide }), n1, 0, 0, 0); m.castShadow = false; return m; });
const lente = new THREE.Group(); n1.add(lente); mesh(new THREE.TorusGeometry(.3, .045, 10, 30), E(LAR, 1.2), lente, 0, 0, 0);
mesh(new THREE.CylinderGeometry(.045, .05, .5, 10), M("#2a2420"), lente, .3, -.32, 0).rotation.z = .7;

const SHOTS = {
  n5: [[V(.2, 2.1, 6.4), V(.3, 1.5, -.2)], [V(.4, 1.9, 5.0), V(.3, 1.6, -.3)]],
  n4: [[V(.1, 2.1, 6.4), V(.2, 1.5, 0)], [V(.4, 2.0, 5.0), V(.4, 1.75, -.3)]],
  n3: [[V(.2, 2.1, 6.4), V(.3, 1.5, -.2)], [V(.4, 1.9, 5.0), V(.35, 1.6, -.3)]],
  n2: [[V(.1, 2.1, 6.4), V(.2, 1.3, 0)], [V(.4, 1.9, 4.9), V(.35, 1.45, 0)]],
  n1: [[V(.2, 2.2, 6.6), V(.4, 1.5, 0)], [V(.5, 2.0, 5.2), V(.4, 1.6, 0)]],
};
const ACT = {
  n5(lt, d) { const per = (d - .4) / 4, i = Math.min(3, Math.floor(lt / per)), f = (lt % per) / per; vvvT.draw(i, f);
    cartas.forEach((c, k) => { const ent = k === i ? eio(lin(f, 0, .3)) : k < i ? 1 : 0; c.visible = k <= i && !(k < i);
      c.position.set(2.6 - ent * 1.6, 1.75 + (1 - ent) * .8, .2 + (1 - ent) * .4); c.rotation.set(0, -.3 * (1 - ent), (1 - ent) * .6); c.scale.setScalar(1 - ent * .7); c.visible = k === i && ent < .99; });
    pose(MAS, { x: -1.1, y: hop(lt, .7, .06), piscar: pisca(lt), ...aponta(lt) }); },
  n4(lt, d) { bichoT.draw(Math.max(0, lt - .4));
    pose(MAS, { x: -1.15, y: 0, braco: [.2, .9 + Math.sin(lt * 9) * .15 * (lt < 1 ? 1 : 0)], ry: .5, piscar: pisca(lt) });
    const w = new THREE.Vector3(); MAS.bracos[1].getWorldPosition(w); lapis4.position.set(w.x + .25, w.y + .15, w.z + .15); lapis4.rotation.set(0, 0, -.6 + Math.sin(lt * 12) * .2 * (lt < 1 ? 1 : 0)); },
  n3(lt, d) { const e = Math.min(3, Math.floor(lt / (d / 4))); vfxT.draw(lt, e);
    aneis.forEach((a, i) => { a.visible = e === 0; a.rotation.set(Math.PI / 2 + Math.sin(lt * 2 + i) * .5, lt * (i ? -1.5 : 1.5), 0); a.scale.setScalar(.9 + .1 * Math.sin(lt * 4)); });
    tela3.rotation.y = e === 2 ? Math.sin(lt * 3) * .05 : 0;
    pose(MAS, { x: -1.15, y: hop(lt, .5, .15), braco: [.3, 1.3 + Math.sin(lt * 8) * .3], piscar: pisca(lt) }); },
  n2(lt, d) { const fecha = eio(lin(lt, .5, 1.6)); let x = 0; const tot = CL.reduce((a, [w]) => a + w, 0) + GAP * (CL.length - 1) * (1 - fecha); x = -tot / 2;
    clipes.forEach((c, i) => { c.m.position.x = x + c.w / 2; x += c.w; if (i < vazios.length) { vazios[i].position.x = x + GAP * (1 - fecha) / 2; vazios[i].scale.x = Math.max(.01, 1 - fecha); vazios[i].visible = fecha < .98; x += GAP * (1 - fecha); } });
    ondaT.draw(eio(lin(lt, 2.0, 2.8))); const k = lt < 1.4 ? -1 : Math.floor((lt - 1.4) / .8); legT.draw(k); leg.scale.setScalar(k < 0 ? .01 : back(lin(lt % .8, 0, .25)));
    pose(MAS, { x: -1.35, y: fecha > .99 ? hop(lt, .45, .15) : 0, piscar: pisca(lt), ...aponta(lt) }); },
  n1(lt, d) { const k = Math.floor(lt * 14); misT.draw(k);
    const boom = lin(lt, .45, .6); mis1.visible = lt < .6; mis1.position.set(1.0, 1.5, .2); mis1.scale.setScalar(lt < .45 ? 1 + Math.sin(lt * 40) * .04 : 1 + boom * .6); mis1.rotation.y = lt;
    quadros.forEach((q, i) => { const sai = eio(lin(lt, .55 + i * .12, 1.3 + i * .12)), a = (i - 2) * .42; q.visible = lt >= .55;
      q.position.set(.9 + Math.sin(a) * 1.5 * sai, 1.75 + Math.cos(a) * .6 * sai - .35 + Math.sin(lt * 2 + i) * .04, -.2 - Math.abs(i - 2) * .25 * sai); q.rotation.set(0, -a * .8 * sai, 0); q.scale.setScalar(.4 + .6 * sai); });
    const alvo = Math.min(4, Math.max(0, Math.floor((lt - 1.6) / .9))), qa = quadros[alvo].position;
    lente.visible = lt > 1.4; lente.position.set(qa.x + .1 + Math.sin(lt * 3) * .05, qa.y + .05, qa.z + .35); lente.rotation.set(0, -.2, Math.sin(lt) * .2);
    pose(MAS, { x: -1.3, y: lt < .6 ? 0 : hop(lt, .35, .12) * (lt < 1.6 ? 1 : .3), sq: lt > .45 && lt < .6 ? .15 : 0, piscar: lt > .45 && lt < 1.2 ? .4 : pisca(lt), ...aponta(lt) });
    return lt > .45 && lt < .8 ? (.8 - lt) * .15 : 0; },
};
return { SHOTS, ACT };
}

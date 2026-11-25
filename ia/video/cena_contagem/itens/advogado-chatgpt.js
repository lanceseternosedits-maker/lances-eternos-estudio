// Reel ⚙️ como funciona "O advogado que confiou no ChatGPT" (08/11 09:00). Motor da cena_contagem (mesmo mascote 3D), cenas gancho, s1–s4, cta.
// Identidade: tribunal de papelão: bancada de juiz de papelão ondulado, martelo gigante, pilha de processos que voa e recebe carimbo
// vermelho FALSO; no truque, uma lupa revela a fonte com link. Paleta vinho + madeira + papel. Sem logos, sem pessoa real, sem nome.
// Elementos: etiqueta em faixa diagonal de aviso, nome em carimbo batendo, legenda em balão de fala do mascote, transição chicote
// (whip pan), câmera plongée/contra-plongée, fechamento com cartões que viram, Archivo Black. Mascote de "terno" só nas mangas
// (bracinhos azul-marinho) e óculos redondos de aro dourado em volta dos olhos: nada escuro ou retangular abaixo dos olhos
// (o Vitor negou um vídeo pela "boca bugada"); ação principal: folhear processos.
export default function (K) {
const { rim, key, THREE, S, cam, mesh, box, M, E, ctex, grupo, pose, MAS, pisca, hop, eo, lin, eio, back, rnd, V } = K;
const VINHO = "#6e1a2b", VINHO2 = "#8f2a3d", MAD = "#9a6a3c", PAPEL = "#f6efdf", TINTA = "#231a17", OURO = "#e2b04a", VERM = "#d8323a", VERDE = "#2f9e5b", FUNDO = "#2a0e15", AZULT = "#1f2b4d";
rim.color.set(0xffc9a0); rim.intensity = 1.3; key.color.set(0xfff0dc); key.intensity = 150; key.position.set(1, 9, 6); key.target.position.set(0, .8, 0);
S.add(new THREE.AmbientLight(0xffe8d8, .35));

// ---------- cenário: tribunal de papelão ----------
const tri = new THREE.Group(); S.add(tri);
const papelaoT = (base, w = 256, h = 256) => ctex(w, h, g => { g.fillStyle = base; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 10) { g.fillStyle = "rgba(0,0,0,.10)"; g.fillRect(x, 0, 4, h); g.fillStyle = "rgba(255,255,255,.05)"; g.fillRect(x + 5, 0, 2, h); } });
const paredeT = ctex(512, 256, (g, w, h) => { g.fillStyle = VINHO; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 64) { g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(x, 0, 6, h); }
  g.fillStyle = "#7a4a26"; g.fillRect(0, h * .62, w, h * .38); for (let x = 0; x < w; x += 48) { g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(x, h * .62, 3, h * .38); } g.fillStyle = OURO; g.fillRect(0, h * .62, w, 4); });
paredeT.wrapS = THREE.RepeatWrapping; paredeT.repeat.set(3, 1);
mesh(new THREE.PlaneGeometry(22, 9), new THREE.MeshStandardMaterial({ map: paredeT, roughness: .9 }), tri, 0, 3.6, -3.4);
// balança da justiça dourada na parede (símbolo genérico)
const bal = new THREE.Group(); bal.position.set(1.4, 3.55, -3.3); tri.add(bal); const ouroM = M(OURO, { metalness: .6, roughness: .3 });
box(.08, 1.0, .08, ouroM, bal, 0, 0, 0); box(1.3, .06, .06, ouroM, bal, 0, .45, 0);
for (const s of [-1, 1]) { mesh(new THREE.CylinderGeometry(.24, .14, .06, 20), ouroM, bal, s * .62, .05, 0); box(.02, .4, .02, ouroM, bal, s * .62, .25, 0); }
const pisoT = ctex(256, 256, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#5a3820" : "#674127"; g.fillRect(0, i * 32, w, 32); g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(0, i * 32, w, 2); } });
pisoT.wrapS = pisoT.wrapT = THREE.RepeatWrapping; pisoT.repeat.set(6, 5);
const piso = mesh(new THREE.PlaneGeometry(22, 12), new THREE.MeshStandardMaterial({ map: pisoT, roughness: .75 }), tri, 0, 0, 1); piso.rotation.x = -Math.PI / 2;
// bancada do juiz (papelão vinho) com cadeira alta vazia e martelo gigante
const banc = new THREE.Group(); banc.position.set(1.35, 0, -1.9); tri.add(banc);
const papV = new THREE.MeshStandardMaterial({ map: papelaoT(VINHO2), roughness: .9 }), papM = new THREE.MeshStandardMaterial({ map: papelaoT("#b98a55"), roughness: .9 });
box(2.9, 1.75, .9, papV, banc, 0, .875, 0); box(3.1, .1, 1.05, papM, banc, 0, 1.8, .05);
box(1.0, 2.6, .2, M("#3d1018", { roughness: .8 }), banc, 0, 1.3, -.7);
const placaT = ctex(256, 64, (g, w, h) => { g.fillStyle = OURO; g.fillRect(0, 0, w, h); g.fillStyle = TINTA; g.font = "400 34px AB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("TRIBUNAL", w / 2, h / 2 + 2); });
mesh(new THREE.PlaneGeometry(1.1, .28), new THREE.MeshStandardMaterial({ map: placaT, roughness: .4 }), banc, 0, 1.25, .46).castShadow = false;
const mart = new THREE.Group(); mart.position.set(.95, 1.85, .2); banc.add(mart); const madM = M("#7a4a26", { roughness: .5 });
const cabo = box(.09, .09, 1.0, madM, mart, 0, .08, .35); const cabeca = new THREE.Group(); mart.add(cabeca);
mesh(new THREE.CylinderGeometry(.2, .2, .62, 20), madM, cabeca, 0, .08, -.1).rotation.z = Math.PI / 2;
for (const x of [-.25, .25]) mesh(new THREE.CylinderGeometry(.215, .215, .06, 20), ouroM, cabeca, x, .08, -.1).rotation.z = Math.PI / 2;
const base = mesh(new THREE.CylinderGeometry(.26, .3, .08, 24), madM, banc, .95, 1.89, .1);
const bate = k => { mart.rotation.x = -.9 * (1 - k); };   // k=1 encostado na base
// mesa do advogado (madeira) à direita do mascote com a pilha de processos
const MESA = V(.15, 0, .55), TOPO = .9; const mesa = new THREE.Group(); mesa.position.copy(MESA); tri.add(mesa);
box(1.9, .08, .9, M(MAD, { roughness: .55 }), mesa, 0, TOPO, 0); for (const [x, z] of [[-.85, -.35], [.85, -.35], [-.85, .35], [.85, .35]]) box(.08, TOPO, .08, M("#6b4423"), mesa, x, TOPO / 2, z);
// textura de processo: k=0 em branco, 1 carimbado FALSO, 2 com fonte (link + VERIFICADO), p = linhas preenchidas (0–1)
function procT() { return ctex(256, 340, (g, w, h, k = 0, p = 1) => { g.fillStyle = PAPEL; g.fillRect(0, 0, w, h); g.fillStyle = TINTA; g.font = "400 26px AB"; g.textAlign = "left"; g.textBaseline = "alphabetic"; g.fillText("PROCESSO", 22, 44);
  g.fillStyle = "rgba(35,26,23,.55)"; const n = Math.floor(11 * p); for (let i = 0; i < n; i++) g.fillRect(22, 70 + i * 22, 140 + ((i * 53) % 70), 8);
  if (k === 2) { g.fillStyle = "#2b5fd0"; g.font = "700 22px IN"; g.fillText("fonte: link oficial", 22, 318); g.fillRect(22, 323, 190, 3); }
  if (k === 1 || k === 2) { g.save(); g.translate(w / 2, h * .52); g.rotate(-.32); g.strokeStyle = k === 1 ? VERM : VERDE; g.fillStyle = g.strokeStyle; g.lineWidth = 8; g.beginPath(); g.roundRect(-112, -38, 224, 76, 10); g.stroke();
    g.font = `400 ${k === 1 ? 50 : 36}px AB`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(k === 1 ? "FALSO" : "COM FONTE", 0, 3); g.restore(); } }); }
const pilha = []; for (let i = 0; i < 7; i++) { const t = procT(); const m = mesh(new THREE.PlaneGeometry(.5, .66), new THREE.MeshStandardMaterial({ map: t, side: THREE.DoubleSide, roughness: .85 }), tri); m.castShadow = false; m.userData.t = t; pilha.push(m); }
const PILHA = V(MESA.x - .1, TOPO + .05, MESA.z);
const folha = new THREE.Group(); tri.add(folha); folha.position.set(PILHA.x - .25, PILHA.y + .1, PILHA.z);   // página que o mascote vira (dobradiça à esquerda)
const folhaM = mesh(new THREE.PlaneGeometry(.5, .66), new THREE.MeshStandardMaterial({ map: procT(), side: THREE.DoubleSide, roughness: .85 }), folha, .25, 0, 0); folhaM.rotation.x = -Math.PI / 2; folhaM.castShadow = false;
const blocoP = box(.52, .1, .68, M(PAPEL, { roughness: .9 }), tri, PILHA.x, TOPO + .09, PILHA.z);
// colunas "VERDADE" × "PROVÁVEL" (s2): blocos de papel empilhados, a IA escolhe a mais alta
const colT = (txt, cor) => ctex(256, 96, (g, w, h) => { g.fillStyle = cor; g.fillRect(0, 0, w, h); g.fillStyle = "#fff"; g.font = "400 40px AB"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, w / 2, h / 2 + 2); });
const COLS = [["VERDADE", AZULT, .55, -.45], ["PROVÁVEL", VERM, 1.35, .45]].map(([txt, cor, alt, x]) => { const g = new THREE.Group(); g.position.set(MESA.x + x, TOPO + .04, MESA.z - .05); tri.add(g);
  const pilar = box(.8, 1, .55, M(PAPEL, { roughness: .9 }), g, 0, .5, 0); const rot = mesh(new THREE.PlaneGeometry(.86, .32), new THREE.MeshStandardMaterial({ map: colT(txt, cor), roughness: .5 }), g, 0, 0, .3); rot.castShadow = false; return { g, pilar, rot, alt }; });
const coluna = (c, k, brilho) => { const a = Math.max(.02, c.alt * k); c.pilar.scale.y = a; c.pilar.position.y = a / 2; c.rot.position.y = a + .16; c.pilar.material.emissive.set(brilho ? "#ffcc66" : "#000"); c.pilar.material.emissiveIntensity = brilho ? .35 : 0; };
// processo grande que se monta sozinho (s3) e lupa (s4)
const bigT = procT(); const big = mesh(new THREE.PlaneGeometry(1.05, 1.4), new THREE.MeshStandardMaterial({ map: bigT, side: THREE.DoubleSide, roughness: .8 }), tri, MESA.x + .35, 1.75, MESA.z - .15); big.castShadow = false;
const lupa = new THREE.Group(); S.add(lupa); mesh(new THREE.TorusGeometry(.34, .05, 12, 40), ouroM, lupa, 0, 0, 0);
mesh(new THREE.CircleGeometry(.32, 40), new THREE.MeshStandardMaterial({ color: "#d9ecff", transparent: true, opacity: .25, roughness: .05 }), lupa, 0, 0, 0).castShadow = false;
mesh(new THREE.CylinderGeometry(.05, .06, .6, 12), M("#4a2f18"), lupa, .42, -.42, 0).rotation.z = Math.PI / 4;

// ---------- mascote: mangas de terno + óculos redondos dourados (em volta dos olhos, nada abaixo deles) ----------
const terno = M(AZULT, { roughness: .6 }); MAS.bracos.forEach(b => b.children.forEach(c => c.material = terno));
const oc = new THREE.Group(); MAS.corpo.add(oc); for (const x of [-.27, .27]) mesh(new THREE.TorusGeometry(.2, .022, 10, 32), ouroM, oc, x, 1.04, .52).castShadow = false;
box(.14, .025, .025, ouroM, oc, 0, 1.14, .52).castShadow = false; for (const s of [-1, 1]) box(.03, .025, .5, ouroM, oc, s * .47, 1.1, .28).castShadow = false;
const suor = [0, 1, 2].map(() => mesh(new THREE.SphereGeometry(.06, 12, 10), new THREE.MeshStandardMaterial({ color: "#9fd8ff", roughness: .1, transparent: true, opacity: .9 }), S));
const MX = -1.35, MZ = .45;
const sua = (lt, on) => suor.forEach((s, i) => { const u = ((lt * .9 + i * .33) % 1); s.visible = on; s.position.set(MX + (i === 1 ? .86 : -.86), 1.55 - u * .7, MZ + .1); s.scale.set(1, 1.3, 1).multiplyScalar(on ? .8 + .4 * (1 - u) : .01); });
function folheia(lt) { pose(MAS, { x: MX, z: MZ, y: hop(lt, .7, .03), ry: .42, braco: [.3, .7 + Math.sin(lt * 5) * .25], piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(lt * 1.4) * .04;
  const u = (lt % 1.1) / 1.1; folha.visible = true; folha.rotation.z = Math.PI * eio(lin(u, .1, .7)); }
function fala(lt, ry = .42) { pose(MAS, { x: MX, z: MZ, y: hop(lt, .5, .05), ry, braco: [.35 + Math.sin(lt * 4) * .12, .5 + Math.sin(lt * 5) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; }

const G0 = grupo("gancho"), G1 = grupo("s1"), G2 = grupo("s2"), G3 = grupo("s3"), G4 = grupo("s4"), GC = grupo("cta");
const repoe = () => { pilha.forEach((p, i) => { p.visible = false; p.userData.t.draw(0, 1); }); folha.visible = false; folha.rotation.z = 0; blocoP.visible = true; COLS.forEach(c => c.g.visible = false); big.visible = false; lupa.visible = false; sua(0, false); bate(0); };
// 6 processos voam da pilha e ficam pendurados no ar em leque, cada um leva FALSO
const LEQUE = i => V(MESA.x - .9 + (i % 3) * .75, 1.95 + Math.floor(i / 3) * .78, MESA.z - .5 - Math.floor(i / 3) * .15);
function voa(lt, t0, carimbo) { for (let i = 0; i < 6; i++) { const p = pilha[i], k = eo(lin(lt, t0 + i * .12, t0 + i * .12 + .6)); p.visible = k > 0; if (!p.visible) continue;
  const a = LEQUE(i); p.position.copy(PILHA.clone().lerp(a, k)); p.position.y += Math.sin(k * Math.PI) * .35; p.rotation.set(-Math.PI / 2 * (1 - k), 0, (i - 2.5) * .06 * k + Math.sin(lt * 2 + i) * .03 * k);
  p.userData.t.draw(lt > carimbo + i * .14 ? 1 : 0, 1); } }

// ---------- câmera: plongée (de cima) e contra-plongée (de baixo), alternando por cena; whip pan na entrada ----------
const PL = { gancho: [[-.3, 4.2, 6.6, 1.0], [.2, 3.6, 6.0, 1.1]], s1: [[.2, .55, 6.2, 1.7], [.4, .7, 5.9, 1.6]], s2: [[-.2, 4.0, 6.3, 1.1], [.1, 3.6, 6.0, 1.2]],
  s3: [[-.1, .6, 6.4, 1.6], [.2, .75, 6.0, 1.6]], s4: [[-.4, 3.9, 6.2, 1.1], [-.1, 3.5, 5.8, 1.2]], cta: [[-.2, 2.2, 7.2, 1.2], [-.2, 2.2, 7.2, 1.2]] };
const SHOTS = {}; Object.keys(PL).forEach(n => SHOTS[n] = [[V(0, 2, 6), V(0, 1, 0)], [V(0, 2, 6), V(0, 1, 0)]]);
const camera = (cam, nome, lt, d) => { const [A, B] = PL[nome] || PL.cta, f = lt < d / 2 ? A : B, u = eio((lt < d / 2 ? lt : lt - d / 2) / (d / 2));
  const whip = nome !== "gancho" ? (1 - eo(lin(lt, 0, .3))) * 3.2 : 0;
  cam.position.set(f[0] + u * .15 + whip, f[1], f[2] - u * .25); cam.lookAt(-.25 + whip * .9, f[3], -.2); };

const ACT = {
  gancho(lt, d) { repoe(); // folheando os processos; na 2ª frase os 6 casos voam e levam FALSO
    if (lt < 3.3) { folheia(lt); } else { folha.visible = false; pose(MAS, { x: MX, z: MZ, y: Math.max(0, Math.sin(lin(lt, 3.3, 3.8) * Math.PI) * .35), ry: .5, braco: [1.6, 1.8], piscar: lt > 3.3 && lt < 3.6 ? 1.15 : pisca(lt) }); MAS.g.rotation.z = 0; }
    voa(lt, 3.3, 4.6); return lt > 4.6 && lt < 5.5 && Math.floor((lt - 4.6) / .14) !== Math.floor((lt - 4.62) / .14) ? .03 : 0; },
  s1(lt, d) { repoe(); voa(9, 0, 0); // o martelo bate 2×, o mascote sua
    const b1 = lin(lt, .25, .5), b2 = lin(lt, 1.6, 1.85); bate(lt < 1.2 ? eo(b1) * (lt < .9 ? 1 : 1 - lin(lt, .9, 1.2)) : eo(b2));
    pose(MAS, { x: MX, z: MZ, y: lt > .5 && lt < .62 ? .12 : 0, sq: lt > .48 && lt < .6 ? .1 : 0, ry: .7, braco: [.15, .15 + Math.sin(lt * 6) * .05], piscar: pisca(lt) }); MAS.g.rotation.z = Math.sin(lt * 9) * .025; sua(lt, true);
    return (lt > .5 && lt < .7) || (lt > 1.85 && lt < 2.05) ? .05 : 0; },
  s2(lt, d) { repoe(); blocoP.visible = false; COLS.forEach((c, i) => { c.g.visible = true; coluna(c, eo(lin(lt, .4 + i * .5, 1.6 + i * .6)), i === 1 && lt > 2.3); });
    fala(lt, .5); if (lt > 2.4) { MAS.g.position.y = hop(lt - 2.4, .35, .12); } },
  s3(lt, d) { repoe(); big.visible = true; const p = lin(lt, .2, 2.6); bigT.draw(lt > 2.9 ? 1 : 0, p); big.rotation.y = -.2 + Math.sin(lt) * .03; big.position.y = 1.75 + Math.sin(lt * 1.5) * .03;
    if (lt < 2.9) fala(lt); else { pose(MAS, { x: MX, z: MZ, y: Math.max(0, Math.sin(lin(lt, 2.9, 3.3) * Math.PI) * .3), ry: .55, braco: [1.7, 1.7], piscar: pisca(lt) }); MAS.g.rotation.z = 0; }
    return lt > 2.9 && lt < 3.1 ? .04 : 0; },
  s4(lt, d) { repoe(); big.visible = true; bigT.draw(lt > 3.0 ? 2 : 0, 1); big.rotation.y = -.2; // a lupa passa e revela a fonte com link
    lupa.visible = true; const a = back(lin(lt, .2, .7)); const k = eio(lin(lt, .6, 2.8)); lupa.position.set(big.position.x - .3 + k * .45, big.position.y - .1 - k * .45, big.position.z + .45); lupa.rotation.set(0, -.2, Math.sin(lt * 2) * .08); lupa.scale.setScalar(Math.max(.01, a));
    if (lt < 3.0) folheia(lt); else { folha.visible = false; pose(MAS, { x: MX, z: MZ, y: hop(lt, .4, .18), ry: .45, braco: [2.2, 2.2 + Math.sin(lt * 8) * .3], piscar: pisca(lt) }); MAS.g.rotation.z = 0; } },
  cta(lt, d) { repoe(); voa(9, 0, 99); pilha.forEach(p => p.userData.t.draw(2, 1)); fala(lt, .3); MAS.g.position.x = -1.1; },
};

// ---------- elementos de tela (2D), tudo entre y=260 e y=1500 e a 130 px da direita ----------
const ui = C => { const { X, GH, SEGR, CHAVE } = C;
  const GY3 = 560, U = {};
  const quebra = (txt, mx) => { const ws = txt.split(" "), L = []; let cur = ""; for (const w of ws) { const tt = cur ? cur + " " + w : w; if (X.measureText(tt).width > mx && cur) { L.push(cur); cur = w; } else cur = tt; } if (cur) L.push(cur); return L; };
  // carimbo batendo: cai grande, encolhe com tranco, tinta levemente falhada nas bordas (texto sempre legível)
  const carimbo = (txt, x, y, lt, t0, cor, rot = -.12, fs = 76) => { if (lt < t0) return; const k = lin(lt, t0, t0 + .18), s = 2.4 - 1.4 * eo(k), tr = k >= 1 ? Math.max(0, 1 - (lt - t0 - .18) / .15) : 0;
    X.save(); X.translate(x + Math.sin(lt * 80) * 6 * tr, y); X.rotate(rot); X.scale(s, s); X.globalAlpha = Math.min(1, .3 + k); X.font = `400 ${fs}px AB`; const w = X.measureText(txt).width + 60;
    X.fillStyle = "rgba(246,239,223,.92)"; X.beginPath(); X.roundRect(-w / 2, -fs * .75, w, fs * 1.5, 12); X.fill(); X.strokeStyle = cor; X.lineWidth = 9; X.stroke();
    X.fillStyle = cor; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText(txt, 0, 4); X.restore(); X.globalAlpha = 1; };
  return Object.assign(U, {
    fundo(t) { X.fillStyle = FUNDO; X.fillRect(0, 0, 1080, 1920); const v = X.createRadialGradient(540, 1000, 60, 540, 1000, 820); v.addColorStop(0, "rgba(226,176,74,.12)"); v.addColorStop(1, "rgba(0,0,0,0)"); X.fillStyle = v; X.fillRect(0, 0, 1080, 1920); },
    desenha3D(g, nome, lt, t) { X.drawImage(g, 0, GY3); const fg = X.createLinearGradient(0, GY3, 0, GY3 + 80); fg.addColorStop(0, FUNDO); fg.addColorStop(1, "rgba(42,14,21,0)"); X.fillStyle = fg; X.fillRect(0, GY3, 1080, 80);
      const fb = X.createLinearGradient(0, GY3 + GH, 0, GY3 + GH - 100); fb.addColorStop(0, FUNDO); fb.addColorStop(1, "rgba(42,14,21,0)"); X.fillStyle = fb; X.fillRect(0, GY3 + GH - 100, 1080, 100);
      if (nome === "gancho") carimbo("6 CASOS FALSOS", 560, 700, lt, 5.2, VERM, -.08, 64);
      if (nome === "s1") carimbo("MULTA: US$ 5 MIL", 540, 700, lt, .5, VERM, -.1, 66);
      if (nome === "s3") carimbo("PARECE CERTO...", 560, 690, lt, 2.9, VERM, -.08, 60);
      if (nome === "s4") { carimbo("PEÇA A FONTE", 560, 690, lt, .3, VERDE, -.08, 60); } },
    etiqueta(t, nome) { // faixa diagonal de aviso (listras amarelo/preto) com a tese, e faixa vinho com o número real; estática (1º quadro legível)
      const [l1, l2, l3] = SEGR[0].etiqueta; X.save(); X.translate(510, 380); X.rotate(-.045);
      X.shadowColor = "rgba(0,0,0,.5)"; X.shadowBlur = 24; X.fillStyle = "#ffd23f"; X.fillRect(-440, -92, 880, 150); X.shadowColor = "transparent";
      X.save(); X.beginPath(); X.rect(-440, -92, 880, 150); X.clip(); X.fillStyle = "#1a1410"; for (let x = -560; x < 480; x += 56) { X.beginPath(); X.moveTo(x, -92); X.lineTo(x + 28, -92); X.lineTo(x - 2, -70); X.lineTo(x - 30, -70); X.fill(); X.beginPath(); X.moveTo(x, 36); X.lineTo(x + 28, 36); X.lineTo(x - 2, 58); X.lineTo(x - 30, 58); X.fill(); } X.restore();
      X.fillStyle = "#1a1410"; X.textAlign = "center"; X.textBaseline = "middle"; let f = 54; X.font = `400 ${f}px AB`; const L = quebra(l1, 820); if (L.length > 1) { f = 46; X.font = `400 ${f}px AB`; }
      const L2 = quebra(l1, 820); L2.slice(0, 2).forEach((l, i) => X.fillText(l, 0, -18 + (i - (L2.length - 1) / 2) * 50));
      X.fillStyle = VINHO; X.fillRect(-400, 74, 800, 76); X.fillStyle = "#fff"; X.font = "400 33px AB"; X.fillText(`${l2}  ·  ${l3.replace(/^E /, "")}`, 0, 114); X.restore(); },
    cabecalho() {},
    legenda(seg, t) { // balão de fala do mascote (o rabinho aponta para ele, à esquerda), 4–5 palavras por vez
      const ws = seg.palavras, ch = []; let cur = []; for (const w of ws) { cur.push(w); if (/[.,:?!]$/.test(w.w) || cur.length >= 5) { ch.push(cur); cur = []; } } if (cur.length) ch.push(cur);
      let b = ch.findIndex(c => t < c[c.length - 1].t1 + .05); if (b < 0) b = ch.length - 1; const c = ch[b];
      X.font = "400 52px AB"; const L = quebra(c.map(w => w.w).join(" "), 760), h = 44 + L.length * 62, y0 = 1488 - h, x0 = 130, w0 = 820;
      X.save(); X.shadowColor = "rgba(0,0,0,.45)"; X.shadowBlur = 22; X.fillStyle = PAPEL; X.beginPath(); X.roundRect(x0, y0, w0, h, 40); X.fill();
      X.beginPath(); X.moveTo(x0 + 90, y0 + 4); X.lineTo(x0 + 60, y0 - 54); X.lineTo(x0 + 170, y0 + 4); X.fill(); X.restore();
      X.textAlign = "left"; X.textBaseline = "middle"; let k = 0; L.forEach((l, i) => { const lw = X.measureText(l).width; let xx = x0 + (w0 - lw) / 2; for (const pw of l.split(" ")) { const wd = c[k++]; const on = wd && t >= wd.t0 - .02, atual = on && wd && t < wd.t1 + .2;
        X.fillStyle = pw.replace(/[.,!?:]/g, "") === CHAVE ? VERM : atual ? VINHO2 : on ? TINTA : "rgba(35,26,23,.3)"; X.fillText(pw, xx, y0 + 52 + i * 62); xx += X.measureText(pw + " ").width; } }); },
    transicao(lt, s, nome) { // chicote: rastros horizontais de movimento por cima (a câmera também chicoteia)
      if (nome === "gancho" || lt > .3) return; const k = 1 - lt / .3; X.save(); X.globalAlpha = .55 * k;
      for (let i = 0; i < 26; i++) { const y = 560 + ((i * 137) % 880), w = 300 + (i * 97) % 500, x = ((i * 211 + lt * 6000) % 1500) - 300; X.fillStyle = i % 3 ? "rgba(246,239,223,.5)" : "rgba(143,42,61,.8)"; X.fillRect(x, y, w, 6 + (i % 4) * 5); } X.restore(); X.globalAlpha = 1; },
    fechamento(lt) { // cartões que viram: 2 dicas e o COMENTA
      X.fillStyle = "rgba(42,14,21,.55)"; X.fillRect(0, 560, 1080, 900);
      const CART = [["1", "PEÇA A FONTE COM LINK", AZULT], ["2", "SE NÃO SOUBER, DIGA QUE NÃO SABE", AZULT], ["", "COMENTA " + CHAVE, VERM]];
      CART.forEach(([n, txt, cor], i) => { const y = 720 + i * 250, k = eio(lin(lt, .1 + i * .45, .55 + i * .45)), sx = Math.abs(Math.cos(k * Math.PI)), frente = k > .5;
        X.save(); X.translate(540, y); X.scale(Math.max(.02, sx) * (i === 2 && frente ? 1 + Math.sin(lt * 7) * .025 : 1), 1); X.shadowColor = "rgba(0,0,0,.5)"; X.shadowBlur = 26;
        X.fillStyle = frente ? (i === 2 ? VERM : PAPEL) : VINHO2; X.beginPath(); X.roundRect(-410, -100, 820, 200, 26); X.fill(); X.shadowColor = "transparent";
        if (!frente) { X.strokeStyle = OURO; X.lineWidth = 4; X.beginPath(); X.roundRect(-390, -80, 780, 160, 18); X.stroke(); X.fillStyle = OURO; X.font = "400 70px AB"; X.textAlign = "center"; X.textBaseline = "middle"; X.fillText("?", 0, 4); }
        else { X.textBaseline = "middle"; if (n) { X.fillStyle = cor; X.beginPath(); X.arc(-320, 0, 52, 0, 7); X.fill(); X.fillStyle = "#fff"; X.font = "400 56px AB"; X.textAlign = "center"; X.fillText(n, -320, 4);
            X.fillStyle = TINTA; X.font = "400 44px AB"; X.textAlign = "left"; const L = quebra(txt, 600); L.forEach((l, j) => X.fillText(l, -240, 4 + (j - (L.length - 1) / 2) * 52)); }
          else { X.fillStyle = "#fff"; X.font = "400 78px AB"; X.textAlign = "center"; X.fillText(txt, 0, 6); } }
        X.restore(); }); },
  }); };
const cores = { LAR: VERM, VERDE: OURO, FUNDO, CREME: PAPEL, TINTA, BRILHO: "rgba(0,0,0,0)" };
return { SHOTS, ACT, cores, semPalco: true, ui, camera };
}

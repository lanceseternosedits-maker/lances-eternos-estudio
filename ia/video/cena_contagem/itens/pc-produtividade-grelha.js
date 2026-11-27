// Reel 🆕 contagem "5 programas grátis pro PC (produtividade)" (Flameshot, ShareX, Logseq, Joplin, AppFlowy; molde campeão clean, 23/11).
// Identidade: escritório com planta e pilha de papéis, tela grande com janela genérica (sem logo); ciano + dourado sobre azul-petróleo. Mascote de fone de ouvido.
import make from "./_clean.js";
const T = (g, s, x, y, f, c) => { g.font = `900 ${f}px sans-serif`; g.fillStyle = c; g.fillText(s, x, y); };
const jan = (g, t) => { g.fillStyle = "#e8f4f7"; g.fillRect(14, 14, 228, 132); g.fillStyle = "#c3dde4"; g.fillRect(14, 14, 228, 16); g.fillStyle = "#12262d"; g.font = "bold 11px sans-serif"; g.textAlign = "left"; g.fillText(t, 20, 23); g.textAlign = "center"; };
export default function (K) {
  const { THREE, S, box, mesh, M, MAS } = K;
  return make(K, {
    cores: { parede: "#1c2c35", piso: "#26383f", destaque: "#22d3ee", escuro: "#0d1a20", ouro: "#ffc93c", selo: "PRODUTIVIDADE" },
    cenario: () => { const g = new THREE.Group(); g.position.set(-2.6, .9, -1.7); S.add(g); mesh(new THREE.CylinderGeometry(.16, .12, .22, 14), M("#b86b3a", { roughness: .8 }), g, 0, .11, 0); mesh(new THREE.SphereGeometry(.26, 14, 10), M("#3fae6b", { roughness: .8 }), g, 0, .42, 0);
      box(.5, .14, .36, M("#f4f1ea"), S, -1.7, .97, -1.9); box(.5, .12, .36, M("#e2ddd1"), S, -1.7, 1.09, -1.9); },
    telas: {
      gancho: (g, C, k, t) => { T(g, "PROGRAMA PAGO?", 146, 52, 21, "#fff"); g.fillStyle = "#ff4d4d"; g.fillRect(54, 50, 180 * Math.min(1, k * 1.5), 5); T(g, "5 GRÁTIS", 146, 108, 34 * (0.6 + 0.4 * k), "#ffc93c"); },
      n5: (g, C, k) => { jan(g, "Flameshot"); g.fillStyle = "#cfe3ea"; g.fillRect(28, 40, 200, 96); g.fillStyle = "#9cc3d0"; g.fillRect(40, 52, 80, 50); g.fillRect(132, 52, 84, 20);
        g.setLineDash([5, 3]); g.strokeStyle = "#22d3ee"; g.lineWidth = 3; g.strokeRect(36, 46, 190 * Math.min(1, k * 2), 84 * Math.min(1, k * 2)); g.setLineDash([]);
        if (k > .5) { const u = Math.min(1, (k - .5) * 2.4); g.strokeStyle = "#ff3b5c"; g.lineWidth = 4; g.beginPath(); g.moveTo(200, 120); g.lineTo(200 - 70 * u, 120 - 40 * u); g.stroke(); g.beginPath(); g.arc(120, 78, 22 * u, 0, 7); g.stroke(); } },
      n4: (g, C, k, t) => { jan(g, "ShareX"); g.fillStyle = "#10252c"; g.fillRect(28, 38, 200, 76); g.fillStyle = Math.sin(t * 6) > 0 ? "#ff3b5c" : "#7a2b3a"; g.beginPath(); g.arc(46, 52, 7, 0, 7); g.fill(); T(g, "REC 00:0" + Math.min(9, Math.floor(k * 9)), 116, 52, 14, "#fff");
        g.fillStyle = "#22d3ee"; g.fillRect(40, 70, 176 * k, 8); g.fillStyle = "#1c4450"; g.fillRect(40, 88, 60, 18); if (k > .6) T(g, "print enviado ✓", 172, 128, 13, "#0d6b7d"); },
      n3: (g, C, k) => { jan(g, "Logseq"); const P = [[60, 60], [128, 48], [196, 66], [90, 106], [170, 112]]; const E = [[0, 1], [1, 2], [0, 3], [1, 4], [3, 4], [2, 4]]; g.strokeStyle = "#7fb6c4"; g.lineWidth = 2;
        E.forEach(([a, b], i) => { if (k > i / 8) { g.beginPath(); g.moveTo(...P[a]); g.lineTo(...P[b]); g.stroke(); } }); P.forEach(([x, y], i) => { g.fillStyle = i === 1 ? "#ffc93c" : "#22d3ee"; g.beginPath(); g.arc(x, y, 9 * Math.max(0, Math.min(1, k * 3 - i * .2 + .2)), 0, 7); g.fill(); }); },
      n2: (g, C, k, t) => { jan(g, "Joplin"); g.fillStyle = "#fff"; g.fillRect(24, 40, 120, 90); for (let i = 0; i < 4; i++) { g.fillStyle = "#b9d3da"; g.fillRect(32, 50 + i * 18, (i === 3 ? 60 : 100) * Math.min(1, k * 3 - i * .5), 8); }
        g.fillStyle = "#16313a"; g.fillRect(176, 40, 44, 84); g.fillStyle = "#fff"; g.fillRect(180, 48, 36, 66); for (let i = 0; i < 3; i++) { g.fillStyle = "#b9d3da"; g.fillRect(184, 54 + i * 14, 28 * (k > .5 ? 1 : 0), 6); }
        g.fillStyle = "#22d3ee"; const p = (t * 1.6) % 1; g.beginPath(); g.arc(148 + p * 24, 85, 5, 0, 7); g.fill(); T(g, "⇄", 160, 106, 18, "#0d6b7d"); },
      n1: (g, C, k) => { T(g, "APPFLOWY", 128, 22, 20, "#ffc93c"); ["A FAZER", "FAZENDO", "PRONTO"].forEach((t, i) => { g.fillStyle = "#1a3039"; g.fillRect(14 + i * 82, 38, 76, 112); T(g, t, 52 + i * 82, 50, 10, "#9ad7e4"); });
        [[0, 0], [0, 1], [1, 0], [2, 0]].forEach(([c, r], i) => { const v = Math.max(0, Math.min(1, k * 5 - i)); g.globalAlpha = v; const mv = i === 1 ? Math.min(1, Math.max(0, (k - .6) * 3)) : 0; g.fillStyle = i === 1 ? "#22d3ee" : "#fff"; g.fillRect(20 + (c + mv) * 82, 62 + r * 34, 64, 26); g.globalAlpha = 1; }); },
    },
    acessorio: () => { const B = new THREE.Group(); MAS.corpo.add(B); const m = M("#161d24", { roughness: .5 }); const banda = new THREE.Mesh(new THREE.TorusGeometry(.68, .05, 8, 28, Math.PI), m); banda.position.set(0, 1.46, 0); B.add(banda);
      for (const s of [-1, 1]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .16, 18), M("#22d3ee", { roughness: .4 })); c.rotation.z = Math.PI / 2; c.position.set(s * .8, 1.1, 0); B.add(c); } },
  });
}

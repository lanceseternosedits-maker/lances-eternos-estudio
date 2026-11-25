// Reel 🆕 contagem "5 programas grátis pro seu Windows" (Rufus, Flow Launcher, Files, ShareX, PowerToys; molde campeão clean, 21/11).
// Identidade: escritório em casa à noite, tela grande com uma janela genérica (sem logo) mostrando cada programa; nº 1: caixa de ferramentas
// que abre e solta vários atalhos. Azul + dourado sobre grafite. Mascote de crachá; ação: digitar.
import make from "./_clean.js";
const T = (g, s, x, y, f, c, fam = "sans-serif") => { g.font = `900 ${f}px ${fam}`; g.fillStyle = c; g.fillText(s, x, y); };
const jan = (g, t) => { g.fillStyle = "#e9edf3"; g.fillRect(14, 14, 228, 132); g.fillStyle = "#c9d1dc"; g.fillRect(14, 14, 228, 16); g.fillStyle = "#1b1f27"; g.font = "bold 11px sans-serif"; g.textAlign = "left"; g.fillText(t, 20, 23); g.textAlign = "center"; };
export default function (K) {
  const { THREE, S, box, mesh, M, MAS, ctex } = K;
  return make(K, {
    cores: { parede: "#232a38", piso: "#313a4a", destaque: "#3b82f6", escuro: "#111521", ouro: "#ffc93c", selo: "WINDOWS" },
    telas: {
      gancho: (g, C, k) => { T(g, "SEU WINDOWS", 128, 60, 30, "#fff"); T(g, "+ 5 GRÁTIS", 128, 104, 32 * (0.6 + 0.4 * k), "#ffc93c"); },
      n5: (g, C, k) => { jan(g, "Rufus"); g.fillStyle = "#1b1f27"; g.fillRect(40, 56, 60, 30); g.fillStyle = "#3b82f6"; g.fillRect(100, 64, 24, 14); g.fillStyle = "#cfd6e0"; g.fillRect(140, 66, 80, 12); g.fillStyle = "#3b82f6"; g.fillRect(140, 66, 80 * k, 12); T(g, "PENDRIVE DE INSTALAÇÃO", 128, 120, 13, "#1b1f27"); },
      n4: (g, C, k) => { jan(g, "Flow Launcher"); g.fillStyle = "#fff"; g.fillRect(30, 50, 196, 28); g.strokeStyle = "#3b82f6"; g.lineWidth = 2; g.strokeRect(30, 50, 196, 28); const q = "planilha"; g.fillStyle = "#1b1f27"; g.font = "bold 16px sans-serif"; g.textAlign = "left"; g.fillText(q.slice(0, Math.round(q.length * Math.min(1, k * 1.5))), 40, 69); g.textAlign = "center"; if (k > .6) { g.fillStyle = "#dbe7ff"; g.fillRect(30, 84, 196, 22); T(g, "▸ planilha.xlsx", 128, 99, 13, "#1b1f27"); } },
      n3: (g, C, k) => { jan(g, "Files"); ["Fotos", "Trabalho", "Downloads"].forEach((t, i) => { g.fillStyle = i === Math.min(2, Math.floor(k * 3)) ? "#fff" : "#d3dae5"; g.fillRect(20 + i * 74, 36, 70, 18); T(g, t, 55 + i * 74, 49, 10, "#1b1f27"); }); for (let i = 0; i < 6; i++) { g.fillStyle = "#ffc93c"; g.fillRect(30 + (i % 3) * 66, 66 + Math.floor(i / 3) * 36, 40, 26); } },
      n2: (g, C, k) => { jan(g, "ShareX"); g.strokeStyle = "#ff3b5c"; g.setLineDash([6, 4]); g.lineWidth = 3; g.strokeRect(50, 50, 156 * Math.max(.2, k), 70 * Math.max(.2, k)); g.setLineDash([]); if (k > .8) T(g, "PRINT SALVO ✓", 128, 136, 14, "#1b1f27"); },
      n1: (g, C, k) => { T(g, "POWERTOYS", 128, 34, 22, "#ffc93c"); ["Fixar janela", "Redimensionar fotos", "Texto da imagem", "Atalhos"].forEach((t, i) => { const v = Math.max(0, Math.min(1, k * 4 - i)); g.globalAlpha = v; g.fillStyle = "#1e2636"; g.fillRect(28, 50 + i * 26, 200, 22); T(g, "✓ " + t, 128, 66 + i * 26, 13, "#fff"); g.globalAlpha = 1; }); },
    },
    acessorio: () => { const c = ctex(128, 160, x => { x.fillStyle = "#fff"; x.fillRect(0, 0, 128, 160); x.fillStyle = "#3b82f6"; x.fillRect(0, 0, 128, 40); x.fillStyle = "#111521"; x.font = "bold 26px sans-serif"; x.textAlign = "center"; x.fillText("PC", 64, 110); });
      mesh(new THREE.PlaneGeometry(.26, .32), new THREE.MeshBasicMaterial({ map: c }), MAS.corpo, .35, .55, .52); },
  });
}

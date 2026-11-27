// Reel 🆕 contagem "5 skills grátis do Claude Code que fazem trabalho de agência" (Skills da Anthropic, Marketing Skills, ComposioHQ, UI UX Pro Max, Superpowers; molde campeão clean, 23/11).
// Identidade: estúdio de agência com quadro de ideias; telas genéricas (sem logo); magenta + dourado sobre ameixa. Mascote de boina.
import make from "./_clean.js";
const T = (g, s, x, y, f, c) => { g.font = `900 ${f}px sans-serif`; g.fillStyle = c; g.fillText(s, x, y); };
const jan = (g, t) => { g.fillStyle = "#f3e9f6"; g.fillRect(14, 14, 228, 132); g.fillStyle = "#dcc9e4"; g.fillRect(14, 14, 228, 16); g.fillStyle = "#24122b"; g.font = "bold 11px sans-serif"; g.textAlign = "left"; g.fillText(t, 20, 23); g.textAlign = "center"; };
export default function (K) {
  const { THREE, S, box, mesh, M, MAS } = K;
  return make(K, {
    cores: { parede: "#2c1d35", piso: "#3a2a45", destaque: "#d946ef", escuro: "#160d1c", ouro: "#ffc93c", selo: "CLAUDE CODE" },
    cenario: () => { box(1.5, 1.0, .06, M("#efe7f2"), S, -2.3, 2.1, -2.74); ["#ffc93c", "#d946ef", "#7dd3fc", "#fb7185"].forEach((c, i) => box(.28, .28, .02, M(c), S, -2.8 + (i % 2) * .45 + (i > 1 ? .2 : 0), 2.3 - Math.floor(i / 2) * .4, -2.7)); },
    telas: {
      gancho: (g, C, k) => { T(g, "CLAUDE CODE", 128, 44, 28, "#fff"); T(g, "TRABALHO", 128, 84, 26 * (0.6 + 0.4 * k), "#ffc93c"); T(g, "DE AGÊNCIA", 128, 116, 26 * (0.6 + 0.4 * k), "#ffc93c"); },
      n5: (g, C, k) => { jan(g, "Documentos"); [["DOC", "#3b82f6"], ["XLS", "#22c55e"], ["PDF", "#ef4444"]].forEach(([t, c], i) => { const v = Math.max(0, Math.min(1, k * 3.2 - i)); const y = 40 + (1 - v) * 20; g.globalAlpha = v; g.fillStyle = "#fff"; g.fillRect(26 + i * 74, y, 62, 84); g.fillStyle = c; g.fillRect(26 + i * 74, y, 62, 22); T(g, t, 57 + i * 74, y + 11, 13, "#fff"); g.fillStyle = "#d8cbe0"; for (let j = 0; j < 4; j++) g.fillRect(34 + i * 74, y + 32 + j * 12, 46, 5); g.globalAlpha = 1; }); },
      n4: (g, C, k) => { jan(g, "Campanha"); g.fillStyle = "#fff"; g.fillRect(24, 38, 100, 96); g.fillStyle = "#d946ef"; g.fillRect(24, 38, 100, 36 * Math.min(1, k * 2)); T(g, "OFERTA", 74, 56, 15, "#fff"); g.fillStyle = "#dcc9e4"; g.fillRect(34, 84, 80, 6); g.fillRect(34, 98, 60 * Math.min(1, k * 1.6), 6);
        g.fillStyle = "#fff"; g.fillRect(136, 52, 94, 56); g.strokeStyle = "#d946ef"; g.lineWidth = 2; g.beginPath(); g.moveTo(136, 52); g.lineTo(183, 82); g.lineTo(230, 52); g.stroke(); if (k > .6) T(g, "ENVIADO ✓", 183, 124, 12, "#24122b"); },
      n3: (g, C, k) => { jan(g, "Biblioteca de skills"); for (let i = 0; i < 24; i++) { const v = Math.max(0, Math.min(1, k * 30 - i)); g.globalAlpha = v; g.fillStyle = i % 5 === 0 ? "#ffc93c" : "#d946ef"; g.fillRect(24 + (i % 8) * 27, 40 + Math.floor(i / 8) * 34, 22, 28); g.globalAlpha = 1; } T(g, "CENTENAS PRONTAS", 128, 144, 12, "#24122b"); },
      n2: (g, C, k) => { jan(g, "Tela do app"); g.fillStyle = "#fff"; g.fillRect(24, 38, 208, 98); const B = [[30, 44, 196, 14], [30, 64, 60, 62], [96, 64, 130, 28], [96, 98, 62, 28], [164, 98, 62, 28]]; B.forEach(([x, y, w, h], i) => { const v = Math.max(0, Math.min(1, k * 6 - i)); g.fillStyle = i === 0 ? "#d946ef" : i === 3 ? "#ffc93c" : "#e9d9f0"; g.fillRect(x, y, w * v, h); }); },
      n1: (g, C, k) => { T(g, "SUPERPOWERS", 128, 24, 20, "#ffc93c"); ["1  PLANEJA", "2  TESTA", "3  ENTREGA"].forEach((t, i) => { const v = Math.max(0, Math.min(1, k * 3.6 - i)); g.globalAlpha = v; g.fillStyle = "#2a1a33"; g.fillRect(24, 44 + i * 36, 208, 30); g.textAlign = "left"; T(g, t, 36, 59 + i * 36, 16, "#fff"); g.textAlign = "right"; T(g, "✓", 218, 59 + i * 36, 20, "#ffc93c"); g.textAlign = "center"; g.globalAlpha = 1; }); },
    },
    acessorio: () => { const B = new THREE.Group(); B.position.set(.1, 1.52, 0); MAS.corpo.add(B); const b = mesh(new THREE.SphereGeometry(.6, 22, 10), M("#d946ef", { roughness: .8 }), B, 0, 0, 0); b.scale.set(1.15, .38, 1); b.rotation.z = -.12; mesh(new THREE.CylinderGeometry(.04, .05, .12, 8), M("#a21caf"), B, .0, .2, 0); },
  });
}

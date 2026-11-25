// Reel 🆕 contagem "5 programas grátis pra começar a segunda mais rápido" (Notepad++, Files, Flow Launcher, Stirling PDF, PowerToys; molde campeão clean, 21/11).
// Identidade: mesa de segunda de manhã, caneca de café e relógio; tela grande mostra cada programa; nº 1: relógio que volta horas.
// Roxo + dourado sobre grafite. Mascote de boné; ação: tomar café e digitar.
import make from "./_clean.js";
const T = (g, s, x, y, f, c) => { g.font = `900 ${f}px sans-serif`; g.fillStyle = c; g.fillText(s, x, y); };
const jan = (g, t) => { g.fillStyle = "#eeeaf6"; g.fillRect(14, 14, 228, 132); g.fillStyle = "#d4cde6"; g.fillRect(14, 14, 228, 16); g.fillStyle = "#1b1726"; g.font = "bold 11px sans-serif"; g.textAlign = "left"; g.fillText(t, 20, 23); g.textAlign = "center"; };
export default function (K) {
  const { THREE, S, box, mesh, M, MAS } = K;
  return make(K, {
    cores: { parede: "#2a2338", piso: "#382f4a", destaque: "#8b5cf6", escuro: "#141020", ouro: "#ffc93c", selo: "SEGUNDA-FEIRA" },
    cenario: () => { const g = new THREE.Group(); g.position.set(-2.6, .9, -1.7); S.add(g); mesh(new THREE.CylinderGeometry(.14, .12, .3, 16), M("#f2f2f2", { roughness: .3 }), g, 0, .15, 0); },
    telas: {
      gancho: (g, C, k) => { T(g, "SEGUNDA", 128, 54, 34, "#fff"); T(g, "08:00 → 08:" + String(Math.round(47 * k)).padStart(2, "0"), 128, 100, 26, "#ff5a5a"); },
      n5: (g, C, k) => { jan(g, "Notepad++"); ["1  reunião 9h", "2  enviar relatório", "3  pagar boleto"].forEach((t, i) => { const v = Math.max(0, Math.min(1, k * 3 - i)); g.globalAlpha = v; g.textAlign = "left"; T(g, t, 26, 52 + i * 26, 14, i === 0 ? "#8b5cf6" : "#1b1726"); g.globalAlpha = 1; g.textAlign = "center"; }); },
      n4: (g, C, k) => { jan(g, "Files"); ["Docs", "Notas", "Fotos"].forEach((t, i) => { g.fillStyle = i === Math.min(2, Math.floor(k * 3)) ? "#fff" : "#d8d1e8"; g.fillRect(20 + i * 74, 36, 70, 18); T(g, t, 55 + i * 74, 49, 10, "#1b1726"); }); for (let i = 0; i < 6; i++) { g.fillStyle = "#ffc93c"; g.fillRect(30 + (i % 3) * 66, 66 + Math.floor(i / 3) * 36, 40, 26); } },
      n3: (g, C, k) => { jan(g, "Flow Launcher"); g.fillStyle = "#fff"; g.fillRect(30, 50, 196, 28); g.strokeStyle = "#8b5cf6"; g.lineWidth = 2; g.strokeRect(30, 50, 196, 28); const q = "relatório"; g.textAlign = "left"; T(g, q.slice(0, Math.round(q.length * Math.min(1, k * 1.5))), 40, 69, 16, "#1b1726"); g.textAlign = "center"; if (k > .6) { g.fillStyle = "#e6dcff"; g.fillRect(30, 84, 196, 22); T(g, "▸ relatório.docx", 128, 99, 13, "#1b1726"); } },
      n2: (g, C, k) => { [0, 1, 2].forEach(i => { const x = 40 + i * 60 + (128 - 40 - i * 60 - 30) * k * (i === 1 ? 0 : 1) * 0.6; g.fillStyle = "#fff"; g.fillRect(x, 40, 52, 66); g.fillStyle = "#ff5a5a"; g.fillRect(x, 40, 52, 14); T(g, "PDF", x + 26, 51, 10, "#fff"); }); T(g, k > .7 ? "JUNTOU ✓" : "juntando…", 128, 134, 16, k > .7 ? "#ffc93c" : "#fff"); },
      n1: (g, C, k) => { g.strokeStyle = "#fff"; g.lineWidth = 5; g.beginPath(); g.arc(80, 80, 44, 0, 7); g.stroke(); const a = -Math.PI / 2 - k * 4 * Math.PI; g.beginPath(); g.moveTo(80, 80); g.lineTo(80 + Math.cos(a) * 34, 80 + Math.sin(a) * 34); g.stroke(); T(g, "POWERTOYS", 186, 64, 18, "#ffc93c"); T(g, "+ horas", 186, 100, 22, "#fff"); },
    },
    acessorio: () => { const B = new THREE.Group(); B.position.set(0, 1.5, 0); B.rotation.y = Math.PI; MAS.corpo.add(B); mesh(new THREE.SphereGeometry(.56, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M("#8b5cf6", { roughness: .5 }), B, 0, -.05, 0).scale.set(1.2, .55, 1); box(.6, .04, .4, M("#8b5cf6"), B, 0, -.02, .6); },
  });
}

// Reel 🆕 contagem "5 programas grátis que substituem apps do Google" (Aegis, Organic Maps, KeePassXC, Syncthing, Immich; molde campeão clean, 27/11).
// Identidade: mesa clara de manhã com planta; tela mostra cada programa em janela genérica (sem logo); nº 1: grade de fotos que se salvam.
// Vermelho + dourado sobre grafite. Mascote de gravata-borboleta; ação: digitar e se afastar do Google.
import make from "./_clean.js";
import { T, R, jan, cl, barra } from "./_t.js";
export default function (K) {
  const { THREE, S, box, mesh, M, MAS } = K;
  return make(K, {
    cores: { parede: "#2d2a2e", piso: "#3d383c", destaque: "#ef4444", escuro: "#17120f", ouro: "#ffc93c", selo: "ALTERNATIVAS" },
    cenario: () => { const g = new THREE.Group(); g.position.set(-2.6, .9, -1.7); S.add(g); mesh(new THREE.CylinderGeometry(.16, .12, .22, 14), M("#d9d4cf"), g, 0, .11, 0); mesh(new THREE.SphereGeometry(.22, 12, 10), M("#3f8f4f"), g, 0, .38, 0); },
    telas: {
      gancho: (g, C, k) => { T(g, "APPS DO GOOGLE", 128, 46, 26, "#fff"); R(g, 40, 70, 176, 6, "#ef4444"); T(g, "5 TROCAS GRÁTIS", 128, 104, 22 * (.7 + .3 * k), "#ffc93c"); },
      n5: (g, C, k) => { jan(g, "Aegis", C.destaque); const n = Math.floor(k * 900 + 100); T(g, String(n % 1000).padStart(3, "0") + " " + String((n * 7) % 1000).padStart(3, "0"), 128, 74, 34, "#1b1f27"); barra(g, 50, 104, 156, 8, 1 - (k * 3 % 1), C.destaque); T(g, "CÓDIGO DE VERIFICAÇÃO", 128, 128, 11, "#5a6270"); },
      n4: (g, C, k) => { jan(g, "Organic Maps", C.destaque, "#dfe9d8"); g.strokeStyle = "#fff"; g.lineWidth = 6; g.beginPath(); g.moveTo(14, 110); g.lineTo(120, 70); g.lineTo(242, 100); g.moveTo(90, 30); g.lineTo(120, 70); g.lineTo(150, 150); g.stroke(); g.strokeStyle = C.destaque; g.lineWidth = 3; g.beginPath(); g.moveTo(30, 104); g.lineTo(120, 70); g.lineTo(120 + 70 * cl(k), 70 + 18 * cl(k)); g.stroke(); R(g, 150, 36, 84, 18, "#1b1f27", 9); T(g, "SEM INTERNET", 192, 45, 10, "#ffc93c"); g.fillStyle = C.destaque; g.beginPath(); g.arc(120, 70, 7, 0, 7); g.fill(); },
      n3: (g, C, k) => { jan(g, "KeePassXC", C.destaque); ["e-mail", "banco", "streaming"].forEach((s, i) => { R(g, 28, 40 + i * 30, 200, 24, "#fff", 5); T(g, s, 38, 52 + i * 30, 12, "#1b1f27", "left"); T(g, "••••••••", 218, 52 + i * 30, 12, cl(k * 3 - i) > .5 ? C.destaque : "#9aa3b2", "right"); }); T(g, "🔒", 232, 20, 11, "#1b1f27"); },
      n2: (g, C, k) => { jan(g, "Syncthing", C.destaque); R(g, 34, 56, 56, 40, "#1b1f27", 5); R(g, 166, 56, 56, 40, "#1b1f27", 5); T(g, "PC", 62, 76, 14, "#fff"); T(g, "CEL", 194, 76, 14, "#fff"); for (let i = 0; i < 3; i++) { const u = (k * 2 + i / 3) % 1; R(g, 96 + u * 56, 70, 12, 12, C.destaque, 3); } barra(g, 50, 116, 156, 8, k, C.destaque); T(g, "SEM NUVEM", 128, 136, 11, "#5a6270"); },
      n1: (g, C, k) => { jan(g, "Immich", C.destaque); const cs = ["#f59e0b", "#38bdf8", "#34d399", "#f472b6", "#a78bfa", "#fb7185", "#facc15", "#60a5fa"]; for (let i = 0; i < 8; i++) { const v = cl(k * 9 - i); if (v <= 0) continue; const x = 26 + (i % 4) * 54, y = 38 + Math.floor(i / 4) * 46; g.globalAlpha = v; R(g, x, y, 48, 40, cs[i], 5); g.globalAlpha = 1; } T(g, "FOTOS DO CELULAR SALVAS", 128, 136, 11, "#1b1f27"); },
    },
    acessorio: () => { const m = M("#ef4444"); box(.16, .2, .06, m, MAS.corpo, -.14, .56, .52); box(.16, .2, .06, m, MAS.corpo, .14, .56, .52); box(.1, .1, .08, M("#b91c1c"), MAS.corpo, 0, .56, .53); },
  });
}

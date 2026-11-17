// Reel 🆕 contagem "5 programas grátis pra editar o vídeo do seu jogo" (Shotcut, HandBrake, LosslessCut, OBS, auto-editor; Visual clean, 17/11).
// Identidade: quarto gamer à noite, uma tela grande que mostra cada programa trabalhando; nº 1: a fita do vídeo se corta sozinha.
// Laranja + dourado sobre grafite. Mascote de fone; ação: segurar o controle.
import make from "./_clean.js";
const CL = ["#ff7a1a", "#3aa0ff", "#ffc93c"];
const T = (g, s, x, y, f, c) => { g.font = `900 ${f}px sans-serif`; g.fillStyle = c; g.fillText(s, x, y); };
export default function (K) {
  const { THREE, S, box, mesh, M, MAS } = K;
  return make(K, {
    cores: { parede: "#2b2733", piso: "#3b3542", destaque: "#ff7a1a", escuro: "#14161c", ouro: "#ffc93c", selo: "GTA 6 · 19/11" },
    cenario: () => { box(1.4, .3, .9, M("#f2f2f2", { roughness: .3 }), S, -3.0, .15, -1.6); },
    telas: {
      gancho: (g, C, k) => { T(g, "R$ / mês", 128, 60, 34, "#ff5a5a"); T(g, "EDITOR?", 128, 104, 30, "#fff"); g.strokeStyle = "#ff5a5a"; g.lineWidth = 5; g.beginPath(); g.moveTo(40, 40); g.lineTo(40 + 176 * k, 124); g.stroke(); },
      n5: (g, C, k) => { g.fillStyle = "#2b2f3a"; g.fillRect(16, 96, 224, 44); CL.forEach((c, i) => { g.fillStyle = c; g.fillRect(22 + i * 74, 102, 66 * Math.min(1, k * 3 - i), 32); }); T(g, "EDITOR COMPLETO", 128, 52, 22, "#fff"); },
      n4: (g, C, k) => { const v = 8 - 7.1 * k; T(g, v.toFixed(1).replace(".", ",") + " GB", 128, 70, 44, k > .9 ? "#ffc93c" : "#fff"); g.fillStyle = "#2b2f3a"; g.fillRect(28, 108, 200, 18); g.fillStyle = "#ffc93c"; g.fillRect(28, 108, 200 * (1 - .89 * k), 18); },
      n3: (g, C, k) => { g.fillStyle = "#3aa0ff"; g.fillRect(20, 60, 216, 50); g.fillStyle = "#14161c"; g.fillRect(20 + 216 * .35, 56, 4, 58); g.fillRect(20 + 216 * .65, 56, 4, 58); if (k > .5) { g.fillStyle = "#ff7a1a"; g.fillRect(20 + 216 * .35 + 4, 60, 216 * .3 - 4, 50); } T(g, "SEM PERDER QUALIDADE", 128, 136, 15, "#fff"); },
      n2: (g, C, k, t) => { if (Math.sin(t * 6) > 0) { g.fillStyle = "#ff3b3b"; g.beginPath(); g.arc(78, 80, 16, 0, 7); g.fill(); } T(g, "REC", 150, 82, 40, "#fff"); T(g, "PC  ·  VIDEOGAME", 128, 130, 16, "#ffc93c"); },
      n1: (g, C, k) => { const W = 22, parado = [1, 4, 6]; let j = 0; for (let i = 0; i < 9; i++) { const p = parado.includes(i), u = Math.max(0, Math.min(1, k * 2 - 1));
          if (p) { const y = 60 + 90 * Math.max(0, Math.min(1, k * 2 - .6)); g.globalAlpha = 1 - u * .8; g.fillStyle = "#7a7f8c"; g.fillRect(14 + i * 25, y, W, 40); g.globalAlpha = 1; }
          else { const x0 = 14 + i * 25, x1 = 52 + j * 25; g.fillStyle = CL[i % 3]; g.fillRect(x0 + (x1 - x0) * u, 60, W, 40); j++; } }
        g.fillStyle = "#fff"; g.fillRect(10 + 236 * Math.min(1, k * 1.6), 50, 3, 60); T(g, k > .95 ? "PARTES PARADAS: FORA" : "cortando…", 128, 136, 17, k > .95 ? "#ffc93c" : "#fff"); },
    },
    acessorio: () => { const F = new THREE.Group(); F.position.set(0, 1.35, 0); MAS.corpo.add(F); mesh(new THREE.TorusGeometry(.62, .05, 8, 24, Math.PI), M("#16181f"), F); for (const s of [-1, 1]) box(.12, .28, .22, M("#ff7a1a"), F, s * .62, -.05, 0); },
  });
}

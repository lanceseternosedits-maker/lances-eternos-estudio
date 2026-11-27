// Reel 🆕 contagem "você paga pra editar vídeo e foto? 5 programas grátis" (darktable, Shotcut, HandBrake, LosslessCut, OBS Studio; molde campeão clean, 27/11).
// Identidade: ilha de edição à noite, tela mostra cada programa em janela genérica; nº 1: botão REC piscando.
// Magenta + dourado sobre grafite. Mascote de boina; ação: editar.
import make from "./_clean.js";
import { T, R, jan, cl, barra, onda } from "./_t.js";
export default function (K) {
  const { THREE, S, box, mesh, M, MAS } = K;
  return make(K, {
    cores: { parede: "#2c2433", piso: "#3a3040", destaque: "#d946ef", escuro: "#150f1a", ouro: "#ffc93c", selo: "EDIÇÃO GRÁTIS" },
    cenario: () => { const g = new THREE.Group(); g.position.set(-2.6, .9, -1.7); S.add(g); box(.5, .05, .4, M("#1b1b22"), g, 0, .03, 0); mesh(new THREE.CylinderGeometry(.14, .14, .08, 16), M("#d946ef"), g, 0, .1, 0); },
    telas: {
      gancho: (g, C, k) => { T(g, "VÍDEO + FOTO", 128, 46, 26, "#fff"); T(g, "R$ 0", 128, 96, 40 * (.6 + .4 * k), "#ffc93c"); g.strokeStyle = "#ef4444"; g.lineWidth = 4; g.beginPath(); g.moveTo(60, 120); g.lineTo(196, 120); g.stroke(); T(g, "mensalidade", 128, 132, 11, "#9aa3b2"); },
      n5: (g, C, k) => { jan(g, "darktable", C.destaque, "#2a2a30"); const b = 60 + 140 * cl(k); R(g, 24, 36, 130, 100, `rgb(${b},${b * .85},${b * .7})`, 4); R(g, 24, 100, 130, 36, `rgb(${b * .5},${b * .45},${b * .35})`); ["#f59e0b", "#38bdf8", "#34d399"].forEach((c, i) => { R(g, 166, 46 + i * 28, 66, 6, "#555a66", 3); R(g, 166 + 66 * cl(k * (1 + i * .2)) - 5, 43 + i * 28, 10, 12, c, 5); }); },
      n4: (g, C, k) => { jan(g, "Shotcut", C.destaque, "#23232a"); R(g, 70, 34, 116, 56, "#0d0d12", 3); R(g, 96, 46, 64, 32, C.destaque, 3); [0, 1].forEach(r => ["#38bdf8", "#f59e0b", "#34d399"].forEach((c, i) => R(g, 24 + i * 70 + r * 14, 100 + r * 22, 64, 18, c, 3))); R(g, 24 + 190 * cl(k), 96, 3, 50, "#fff"); },
      n3: (g, C, k) => { jan(g, "HandBrake", C.destaque); T(g, "clipe.mkv", 60, 56, 13, "#1b1f27"); T(g, "→", 128, 56, 22, C.destaque); R(g, 168, 40, 36, 32, "#1b1f27", 6); T(g, "MP4", 186, 56, 12, "#fff"); barra(g, 34, 100, 188, 10, k, C.destaque); T(g, Math.round(cl(k) * 100) + "%", 128, 126, 14, "#1b1f27"); },
      n2: (g, C, k) => { jan(g, "LosslessCut", C.destaque, "#23232a"); const gap = 14 * cl(k * 2 - .6); R(g, 24, 70, 90 - gap / 2 + 20, 26, "#38bdf8", 3); R(g, 134 + gap, 70, 98 - gap, 26, "#38bdf8", 3); if (k > .3) R(g, 124 + gap / 2, 56, 3, 54, "#ef4444"); T(g, "SEM PERDER QUALIDADE", 128, 128, 11, "#fff"); },
      n1: (g, C, k) => { jan(g, "OBS Studio", C.destaque, "#23232a"); R(g, 28, 38, 200, 88, "#0d0d12", 4); R(g, 44, 50, 100, 62, "#38bdf8", 3); R(g, 154, 50, 60, 62, "#34d399", 3); const on = Math.sin(k * 20) > -.3; g.fillStyle = on ? "#ef4444" : "#7a2323"; g.beginPath(); g.arc(46, 140, 5, 0, 7); g.fill(); T(g, "GRAVANDO  00:" + String(Math.floor(k * 40)).padStart(2, "0"), 128, 140, 11, "#fff"); },
    },
    acessorio: () => { const B = new THREE.Group(); B.position.set(.1, 1.52, 0); B.rotation.z = -.12; MAS.corpo.add(B); mesh(new THREE.CylinderGeometry(.5, .5, .1, 24), M("#d946ef", { roughness: .6 }), B, 0, 0, 0); mesh(new THREE.SphereGeometry(.05, 8, 8), M("#d946ef"), B, 0, .1, 0); },
  });
}

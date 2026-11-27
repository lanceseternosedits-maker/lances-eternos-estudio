// Reel 🆕 contagem "editar clipe do GTA 6 no seu computador, de graça" (HandBrake, PySceneDetect, LosslessCut, FunClip, Whisper; molde campeão clean, 27/11).
// Identidade: quarto gamer à noite, controle no tapete; tela mostra cada programa; nº 1: legenda automática aparecendo no clipe.
// Teal + dourado sobre grafite. Mascote de correntão dourado; ação: cortar o clipe.
import make from "./_clean.js";
import { T, R, jan, cl, barra, digita } from "./_t.js";
export default function (K) {
  const { THREE, S, box, mesh, M, MAS } = K;
  const tela = (g, x, y, w, h, k) => { const gr = g.createLinearGradient(x, y, x, y + h); gr.addColorStop(0, "#f59e0b"); gr.addColorStop(1, "#7c3aed"); g.fillStyle = gr; g.fillRect(x, y, w, h); R(g, x + w * .15, y + h * .55, w * .7, h * .45, "#1b1f27"); };
  return make(K, {
    cores: { parede: "#1c2a2c", piso: "#273a3c", destaque: "#14b8a6", escuro: "#0a1415", ouro: "#ffc93c", selo: "CLIPE DO GTA 6" },
    cenario: () => { const g = new THREE.Group(); g.position.set(-2.6, .9, -1.7); S.add(g); box(.36, .08, .22, M("#1b1b22"), g, 0, .04, 0); box(.1, .06, .1, M("#14b8a6"), g, -.1, .1, .06); box(.1, .06, .1, M("#ffc93c"), g, .1, .1, .06); },
    telas: {
      gancho: (g, C, k) => { tela(g, 56, 24, 144, 86, k); const on = Math.sin(k * 20) > -.3; g.fillStyle = on ? "#ef4444" : "#7a2323"; g.beginPath(); g.arc(70, 36, 5, 0, 7); g.fill(); T(g, "SEU CLIPE", 128, 130, 18, "#ffc93c"); },
      n5: (g, C, k) => { jan(g, "HandBrake", C.destaque); R(g, 30, 38, 80, 48, "#1b1f27", 4); tela(g, 34, 42, 72, 40, k); T(g, "→", 128, 62, 22, C.destaque); R(g, 150, 34, 38, 60, "#1b1f27", 7); tela(g, 154, 42, 30, 44, k); barra(g, 34, 108, 188, 10, k, C.destaque); T(g, "PRO CELULAR", 128, 134, 11, "#5a6270"); },
      n4: (g, C, k) => { jan(g, "PySceneDetect", C.destaque, "#23232a"); const cs = ["#38bdf8", "#f59e0b", "#34d399", "#a78bfa"]; for (let i = 0; i < 4; i++) R(g, 24 + i * 52, 60, 50, 36, cs[i], 3); [1, 2, 3].forEach(i => { if (k * 4 > i) R(g, 24 + i * 52 - 2, 52, 3, 52, "#ef4444"); }); T(g, "ACHA CADA CENA", 128, 124, 12, "#fff"); },
      n3: (g, C, k) => { jan(g, "LosslessCut", C.destaque, "#23232a"); const gap = 14 * cl(k * 2 - .6); R(g, 24, 64, 86 - gap / 2 + 20, 28, "#38bdf8", 3); R(g, 134 + gap, 64, 98 - gap, 28, "#38bdf8", 3); if (k > .3) R(g, 124 + gap / 2, 50, 3, 58, "#ef4444"); T(g, "CORTA SEM PERDER QUALIDADE", 128, 128, 11, "#fff"); },
      n2: (g, C, k) => { jan(g, "FunClip", C.destaque); ["a gente chegou na cidade", "olha esse tiro incrível", "agora vamos fugir"].forEach((s, i) => { const on = cl(k * 2) > .5 && i === 1; R(g, 24, 38 + i * 26, 208, 22, on ? "#fde68a" : "#fff", 4); T(g, s, 32, 49 + i * 26, 11, "#1b1f27", "left"); }); if (k > .6) { R(g, 150, 118, 82, 24, C.destaque, 12); T(g, "ACHOU ✓", 191, 130, 10, "#fff"); } },
      n1: (g, C, k) => { jan(g, "Whisper", C.destaque); tela(g, 40, 36, 176, 80, k); R(g, 60, 92, 136, 20, "rgba(0,0,0,.7)", 4); digita(g, "olha esse tiro!", 128, 102, 12, "#fff", k * 1.6, "center"); T(g, "LEGENDA AUTOMÁTICA", 128, 134, 11, "#1b1f27"); },
    },
    acessorio: () => { const c = new THREE.Group(); c.position.set(0, .7, .54); MAS.corpo.add(c); mesh(new THREE.TorusGeometry(.3, .05, 8, 24), M("#ffc93c", { metalness: .7, roughness: .3 }), c, 0, .05, 0).scale.set(1.7, 1, 1); mesh(new THREE.SphereGeometry(.1, 10, 10), M("#ffc93c", { metalness: .7, roughness: .3 }), c, 0, -.28, .02); },
  });
}

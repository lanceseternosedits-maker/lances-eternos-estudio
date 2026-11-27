// Reel 🆕 contagem "um estúdio de voz grátis no seu computador" (Piper, Kokoro, whisper.cpp, Handy, Whisper; molde campeão clean, 27/11).
// Identidade: cabine de gravação azul-petróleo; tela mostra cada programa; nº 1: áudio que vira texto em português.
// Ciano + dourado sobre grafite. Mascote de fones + microfone; ação: narrar.
import make from "./_clean.js";
import { T, R, jan, cl, barra, onda, digita } from "./_t.js";
export default function (K) {
  const { THREE, S, box, mesh, M, MAS } = K;
  return make(K, {
    cores: { parede: "#1f2d33", piso: "#2a3a42", destaque: "#06b6d4", escuro: "#0b151a", ouro: "#ffc93c", selo: "ESTÚDIO DE VOZ" },
    cenario: () => { const g = new THREE.Group(); g.position.set(-2.6, .9, -1.7); S.add(g); mesh(new THREE.CylinderGeometry(.03, .03, .5, 8), M("#222"), g, 0, .25, 0); mesh(new THREE.SphereGeometry(.12, 12, 10), M("#06b6d4"), g, 0, .56, 0); mesh(new THREE.CylinderGeometry(.14, .16, .04, 14), M("#222"), g, 0, .02, 0); },
    telas: {
      gancho: (g, C, k) => { T(g, "VOCÊ PAGA LOCUTOR?", 128, 40, 20, "#fff"); onda(g, 40, 90, 176, 50, k * 1.2, "#06b6d4", 22); T(g, "GRÁTIS NO SEU PC", 128, 134, 16, "#ffc93c"); },
      n5: (g, C, k) => { jan(g, "Piper", C.destaque); R(g, 28, 38, 200, 46, "#fff", 5); digita(g, "Olá, bem-vindo ao canal!", 36, 62, 12, "#1b1f27", k * 1.5); onda(g, 60, 112, 136, 34, k, C.destaque, 20); T(g, "LENDO EM VOZ ALTA", 128, 138, 10, "#5a6270"); },
      n4: (g, C, k) => { jan(g, "Kokoro", C.destaque); T(g, "VOZ NATURAL", 128, 48, 16, "#1b1f27"); onda(g, 30, 92, 196, 56, k * 1.4, C.destaque, 26); ["voz 1", "voz 2", "voz 3"].forEach((s, i) => { R(g, 40 + i * 62, 126, 54, 16, i === 1 ? C.destaque : "#d3d9e3", 8); T(g, s, 67 + i * 62, 134, 10, i === 1 ? "#fff" : "#1b1f27"); }); },
      n3: (g, C, k) => { jan(g, "whisper.cpp", C.destaque); onda(g, 28, 80, 80, 44, k, "#5a6270", 10); T(g, "→", 124, 80, 22, C.destaque); ["olá, pessoal", "hoje eu vou", "mostrar um"].forEach((s, i) => digita(g, s, 144, 54 + i * 24, 12, "#1b1f27", k * 3 - i * .7)); T(g, "NO SEU PC", 128, 138, 11, "#5a6270"); },
      n2: (g, C, k) => { jan(g, "Handy", C.destaque); R(g, 70, 36, 116, 28, "#1b1f27", 6); T(g, "Ctrl + Espaço", 128, 50, 14, "#ffc93c"); R(g, 28, 76, 200, 46, "#fff", 5); digita(g, "Reunião às 15h, levar o relatório.", 36, 100, 11, "#1b1f27", (k - .25) * 1.6); T(g, "VOCÊ FALA, O TEXTO APARECE", 128, 138, 10, "#5a6270"); },
      n1: (g, C, k) => { jan(g, "Whisper", C.destaque); R(g, 24, 40, 70, 34, C.destaque, 17); onda(g, 32, 57, 54, 20, k, "#fff", 8); T(g, "→", 112, 57, 20, "#1b1f27"); R(g, 128, 38, 104, 38, "#fff", 6); digita(g, "Oi, tudo bem?", 134, 57, 12, "#1b1f27", k * 1.8); T(g, "PORTUGUÊS ✓", 128, 112, 20 * (.7 + .3 * cl(k * 2)), C.destaque); T(g, "ÁUDIO VIRA TEXTO", 128, 136, 11, "#5a6270"); },
    },
    acessorio: () => { const F = new THREE.Group(); F.position.set(0, 1.35, 0); MAS.corpo.add(F); mesh(new THREE.TorusGeometry(.62, .05, 8, 24, Math.PI), M("#16181f"), F); for (const s of [-1, 1]) box(.12, .28, .22, M("#06b6d4"), F, s * .62, -.05, 0); mesh(new THREE.CylinderGeometry(.015, .015, .5, 6), M("#16181f"), F, .66, -.3, .2).rotation.z = .8; mesh(new THREE.SphereGeometry(.06, 8, 8), M("#16181f"), F, .52, -.5, .42); },
  });
}

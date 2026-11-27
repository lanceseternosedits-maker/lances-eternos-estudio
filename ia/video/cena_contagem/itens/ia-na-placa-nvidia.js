// Reel 🆕 contagem "5 projetos grátis rodam IA no seu PC com placa Nvidia" (whisper.cpp, Open WebUI, llama.cpp, Kokoro, Ollama; molde campeão clean, 27/11).
// Identidade: bancada gamer com PC aberto; tela mostra cada programa; nº 1: terminal que instala a IA com um comando.
// Lima + dourado sobre grafite. Mascote de chip na cabeça; ação: ligar o PC.
import make from "./_clean.js";
import { T, R, jan, cl, barra, digita, chat, onda, term, placa } from "./_t.js";
export default function (K) {
  const { THREE, S, box, mesh, M, MAS } = K;
  return make(K, {
    cores: { parede: "#1f2a1c", piso: "#2c3a28", destaque: "#84cc16", escuro: "#0d140a", ouro: "#ffc93c", selo: "IA NO SEU PC" },
    cenario: () => { const g = new THREE.Group(); g.position.set(-2.6, .9, -1.7); S.add(g); box(.4, .6, .5, M("#14161a"), g, 0, .3, 0); box(.3, .04, .02, M("#84cc16", { emissive: "#84cc16", emissiveIntensity: .8 }), g, 0, .45, .26); },
    telas: {
      gancho: (g, C, k) => { placa(g, 64, 20, k, C.destaque); T(g, "IA NO SEU PC", 128, 106, 22, "#fff"); T(g, "SEM MENSALIDADE", 128, 134, 14, "#ffc93c"); },
      n5: (g, C, k) => { jan(g, "whisper.cpp", C.destaque); onda(g, 28, 80, 80, 44, k, "#5a6270", 10); T(g, "→", 124, 80, 22, C.destaque); ["olá, pessoal", "hoje eu vou", "mostrar um"].forEach((s, i) => digita(g, s, 144, 54 + i * 24, 12, "#1b1f27", k * 3 - i * .7)); T(g, "ÁUDIO VIRA TEXTO NO PC", 128, 138, 10, "#5a6270"); },
      n4: (g, C, k) => { jan(g, "Open WebUI", C.destaque); chat(g, C.destaque, "resuma esse texto", "Pronto! Aqui vai|o resumo em 3 linhas.", k); },
      n3: (g, C, k) => { jan(g, "llama.cpp", C.destaque, "#23232a"); placa(g, 62, 36, k, C.destaque); T(g, "MEMÓRIA DA PLACA", 128, 112, 10, "#fff"); barra(g, 40, 122, 176, 10, k * .9, C.destaque, "#3a3f4a"); },
      n2: (g, C, k) => { jan(g, "Kokoro", C.destaque); R(g, 28, 38, 200, 34, "#fff", 5); digita(g, "Bom dia! Tudo pronto.", 36, 55, 12, "#1b1f27", k * 1.6); onda(g, 50, 110, 156, 40, k, C.destaque, 22); T(g, "VOZ NATURAL NO PC", 128, 138, 10, "#5a6270"); },
      n1: (g, C, k) => { term(g, ["> ollama run llama3", "baixando modelo...", "pronto! pergunte algo", ">"], k, C.destaque); barra(g, 24, 126, 208, 8, k, C.destaque, "#2a313c"); },
    },
    acessorio: () => { const B = new THREE.Group(); B.position.set(0, 1.55, 0); MAS.corpo.add(B); box(.5, .1, .5, M("#1b1f27"), B, 0, 0, 0); box(.3, .03, .3, M("#84cc16"), B, 0, .07, 0); for (let i = -2; i <= 2; i++) { box(.03, .06, .06, M("#c9ccd2"), B, i * .09, 0, .28); box(.03, .06, .06, M("#c9ccd2"), B, i * .09, 0, -.28); } },
  });
}

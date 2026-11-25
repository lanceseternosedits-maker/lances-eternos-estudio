// Reel 🆕 contagem "IA no PC sem placa da Nvidia" (Jan, GPT4All, ZLUDA, llama.cpp, Ollama; Visual clean, 17/11).
// Identidade: bancada de montagem de PC; gabinete aberto com o slot da placa VAZIO e plaquinha "SEM PLACA"; a tela grande mostra cada IA
// rodando; nº 1: terminal digita "ollama run" e a barra enche. Verde + dourado sobre grafite. Mascote de crachá; ação: digitar.
import make from "./_clean.js";
const T = (g, s, x, y, f, c, fam = "sans-serif") => { g.font = `900 ${f}px ${fam}`; g.fillStyle = c; g.fillText(s, x, y); };
export default function (K) {
  const { THREE, S, box, mesh, M, MAS, ctex } = K;
  return make(K, {
    cores: { parede: "#26302e", piso: "#34403d", destaque: "#3ddc84", escuro: "#101418", ouro: "#ffc93c", selo: "SEM NVIDIA" },
    cenario: () => { const g = new THREE.Group(); g.position.set(-3.1, 0, -1.4); S.add(g); box(.9, 1.9, 1.6, M("#1b1f24", { roughness: .4 }), g, 0, .95, 0);
      const placa = ctex(256, 96, x => { x.fillStyle = "#ffc93c"; x.fillRect(0, 0, 256, 96); x.fillStyle = "#12161a"; x.font = "bold 40px sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("SEM PLACA", 128, 50); });
      mesh(new THREE.PlaneGeometry(.9, .34), new THREE.MeshBasicMaterial({ map: placa }), g, .48, 1.45, 0).rotation.y = Math.PI / 2; },
    telas: {
      gancho: (g, C, k) => { T(g, "IA NO PC?", 128, 58, 36, "#fff"); T(g, "SÓ COM NVIDIA", 128, 102, 26, "#ff5a5a"); if (k > .6) { g.strokeStyle = "#3ddc84"; g.lineWidth = 6; g.beginPath(); g.moveTo(30, 102); g.lineTo(226, 102); g.stroke(); } },
      n5: (g, C, k) => { g.fillStyle = "#2a3038"; g.beginPath(); g.roundRect(24, 30, 150, 34, 10); g.fill(); g.fillStyle = "#3ddc84"; g.beginPath(); g.roundRect(82, 76 , 150 * Math.min(1, k * 1.5), 34, 10); g.fill(); T(g, "SEM INTERNET", 128, 136, 18, "#ffc93c"); },
      n4: (g, C, k) => { T(g, "CHAT NO SEU PC", 128, 60, 26, "#fff"); T(g, "sem placa cara", 128, 102, 22, "#ffc93c"); },
      n3: (g, C, k) => { T(g, "NVIDIA", 70, 76, 26, "#3ddc84"); T(g, "→", 128, 76, 30, "#fff"); T(g, "AMD", 196, 76, 30, "#ff5a5a"); T(g, "tenta traduzir", 128, 126, 18, "#ffc93c"); },
      n2: (g, C, k) => { T(g, "PC", 70, 70, 40, "#fff"); T(g, "MAC", 186, 70, 40, "#fff"); g.fillStyle = "#3ddc84"; g.fillRect(30, 104, 196 * k, 16); T(g, "IA rodando nos dois", 128, 140, 16, "#ffc93c"); },
      n1: (g, C, k) => { g.textAlign = "left"; const cmd = "$ ollama run llama3"; T(g, cmd.slice(0, Math.round(cmd.length * Math.min(1, k * 1.7))), 16, 48, 20, "#3ddc84", "monospace");
        if (k > .6) { const b = Math.min(1, (k - .6) / .38); g.fillStyle = "#2a3038"; g.fillRect(16, 78, 224, 20); g.fillStyle = "#ffc93c"; g.fillRect(16, 78, 224 * b, 20); T(g, b >= .99 ? "IA rodando no seu PC ✓" : "carregando…", 16, 124, 18, "#fff"); } g.textAlign = "center"; },
    },
    acessorio: () => { const c = ctex(128, 160, x => { x.fillStyle = "#fff"; x.fillRect(0, 0, 128, 160); x.fillStyle = "#3ddc84"; x.fillRect(0, 0, 128, 40); x.fillStyle = "#12161a"; x.font = "bold 26px sans-serif"; x.textAlign = "center"; x.fillText("DEV", 64, 110); });
      mesh(new THREE.PlaneGeometry(.26, .32), new THREE.MeshBasicMaterial({ map: c }), MAS.corpo, .35, .55, .52); },
  });
}

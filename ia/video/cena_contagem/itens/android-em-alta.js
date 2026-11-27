// Reel 🆕 contagem "5 projetos em alta pro Android" (NewPipe, Termux, Syncthing, Immich, scrcpy; molde campeão clean, 23/11).
// Identidade: sala de estar com sofá e abajur, tela grande mostrando cada projeto em celular genérico (sem logo); âmbar + dourado sobre marrom escuro. Mascote de cachecol.
import make from "./_clean.js";
const T = (g, s, x, y, f, c) => { g.font = `900 ${f}px sans-serif`; g.fillStyle = c; g.fillText(s, x, y); };
const fone = (g, x, y, w, h, c = "#f6f0e4") => { g.fillStyle = "#15110a"; g.beginPath(); g.roundRect(x - 3, y - 3, w + 6, h + 6, 8); g.fill(); g.fillStyle = c; g.fillRect(x, y, w, h); };
export default function (K) {
  const { THREE, S, box, mesh, M, MAS } = K;
  return make(K, {
    cores: { parede: "#2d2418", piso: "#3d3022", destaque: "#f59e0b", escuro: "#16100a", ouro: "#ffc93c", selo: "ANDROID" },
    cenario: () => { box(1.6, .5, .8, M("#6b4a2a", { roughness: .9 }), S, 3.4, .45, -1.9); const g = new THREE.Group(); g.position.set(-2.7, .9, -1.8); S.add(g); mesh(new THREE.CylinderGeometry(.03, .03, .7, 8), M("#222"), g, 0, .35, 0); mesh(new THREE.ConeGeometry(.28, .3, 16, 1, true), new THREE.MeshBasicMaterial({ color: "#ffd98a", side: THREE.DoubleSide }), g, 0, .8, 0); },
    telas: {
      gancho: (g, C, k) => { fone(g, 98, 12, 60, 120, "#16100a"); g.fillStyle = "#f59e0b"; g.fillRect(104, 20, 48, 6 + 90 * k); T(g, "ANDROID", 52, 50, 18, "#fff"); T(g, "5 GRÁTIS", 204, 80, 22 * (0.6 + 0.4 * k), "#ffc93c"); },
      n5: (g, C, k) => { fone(g, 60, 12, 136, 120, "#1f1a12"); g.fillStyle = "#2b2418"; g.fillRect(62, 14, 132, 76); g.fillStyle = "#f59e0b"; g.beginPath(); g.moveTo(110, 36); g.lineTo(110, 70); g.lineTo(142, 53); g.fill(); g.fillStyle = "#4a4030"; g.fillRect(70, 100, 116, 6); g.fillStyle = "#f59e0b"; g.fillRect(70, 100, 116 * k, 6);
        g.fillStyle = "#6a3030"; g.fillRect(70, 112, 116, 14); T(g, "ANÚNCIO", 128, 120, 9, "#fff"); if (k > .4) { g.strokeStyle = "#ff3b5c"; g.lineWidth = 3; g.beginPath(); g.moveTo(66, 126); g.lineTo(66 + 124 * Math.min(1, (k - .4) * 2), 108); g.stroke(); } },
      n4: (g, C, k) => { g.fillStyle = "#0a0a0a"; g.fillRect(24, 14, 208, 132); g.fillStyle = "#2a2a2a"; g.fillRect(24, 14, 208, 14); T(g, "TERMUX", 128, 21, 10, "#9a9a9a"); g.textAlign = "left"; const L = ["$ pkg install python", "$ python app.py", "ola, mundo ✓"]; L.forEach((s, i) => { const v = Math.max(0, Math.min(1, k * 3.2 - i)); T(g, s.slice(0, Math.round(s.length * v)), 34, 48 + i * 28, 15, i === 2 ? "#ffc93c" : "#7CFC7C"); }); g.textAlign = "center"; },
      n3: (g, C, k, t) => { fone(g, 20, 40, 40, 74, "#16100a"); g.fillStyle = "#f59e0b"; g.fillRect(25, 50, 30, 50); g.fillStyle = "#cfd6e0"; g.fillRect(150, 44, 84, 56); g.fillStyle = "#f59e0b"; g.fillRect(156, 50, 72, 42); g.fillStyle = "#cfd6e0"; g.fillRect(180, 100, 24, 8); g.fillRect(168, 106, 48, 5);
        for (let i = 0; i < 4; i++) { const p = (t * 1.2 + i * .25) % 1; g.fillStyle = "#ffc93c"; g.beginPath(); g.arc(70 + p * 74, 77, 5, 0, 7); g.fill(); } T(g, "SEM NUVEM", 128, 134, 16, "#fff"); },
      n2: (g, C, k) => { fone(g, 56, 8, 144, 144, "#1f1a12"); const cs = ["#f59e0b", "#ffc93c", "#d97706", "#fde68a", "#b45309", "#fbbf24", "#92400e", "#f59e0b", "#fcd34d"]; cs.forEach((c, i) => { const v = Math.max(0, Math.min(1, k * 11 - i)); g.fillStyle = c; const s = 38 * v; g.fillRect(64 + (i % 3) * 44 + (38 - s) / 2, 18 + Math.floor(i / 3) * 44 + (38 - s) / 2, s, s); }); },
      n1: (g, C, k) => { g.fillStyle = "#15110a"; g.fillRect(20, 16, 130, 84); g.fillStyle = "#2b2418"; g.fillRect(24, 20, 122, 76); g.fillStyle = "#cfd6e0"; g.fillRect(76, 100, 18, 10); g.fillRect(60, 108, 50, 5);
        fone(g, 168, 28, 60, 108, "#1f1a12"); g.fillStyle = "#f59e0b"; g.fillRect(172, 34, 52, 8 + 62 * k); g.fillStyle = "#ffc93c"; g.fillRect(34, 30, 100 * k, 30); T(g, "→ PC", 84, 80, 14, "#fff"); g.fillStyle = "#fff"; g.beginPath(); g.moveTo(190 + 20 * k, 90); g.lineTo(190 + 20 * k, 104); g.lineTo(199 + 20 * k, 99); g.fill(); },
    },
    acessorio: () => { const B = new THREE.Group(); MAS.corpo.add(B); B.add(Object.assign(box(1.56, .17, 1.06, M("#f59e0b", { roughness: .9 }), B, 0, .58, 0))); box(.22, .6, .1, M("#d97706", { roughness: .9 }), B, .45, .3, .56); },
  });
}

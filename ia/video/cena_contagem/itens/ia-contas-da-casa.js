// Reel 🆕 contagem "5 coisas que a IA faz por você no computador" (Syncthing, Immich, Whisper, Ollama + Assistente de contas da casa do kit; molde campeão clean, 23/11).
// Identidade: cozinha-escritório com calendário na parede; telas genéricas (sem logo); vermelho + dourado sobre grafite. Mascote de sininho. Nº 1 (kit) sem contagem de estrelas.
import make from "./_clean.js";
const T = (g, s, x, y, f, c) => { g.font = `900 ${f}px sans-serif`; g.fillStyle = c; g.fillText(s, x, y); };
const jan = (g, t) => { g.fillStyle = "#f4eaea"; g.fillRect(14, 14, 228, 132); g.fillStyle = "#e3cfcf"; g.fillRect(14, 14, 228, 16); g.fillStyle = "#2a1212"; g.font = "bold 11px sans-serif"; g.textAlign = "left"; g.fillText(t, 20, 23); g.textAlign = "center"; };
export default function (K) {
  const { THREE, S, box, mesh, M, MAS } = K;
  const R = make(K, {
    cores: { parede: "#2b2024", piso: "#3a2c30", destaque: "#ef4444", escuro: "#160d0f", ouro: "#ffc93c", selo: "IA NO PC" },
    cenario: () => { box(.8, .95, .05, M("#f5efe6"), S, -2.5, 2.1, -2.74); box(.8, .2, .06, M("#ef4444"), S, -2.5, 2.48, -2.72); for (let i = 0; i < 12; i++) box(.1, .1, .02, M(i === 9 ? "#ef4444" : "#d8cfc2"), S, -2.78 + (i % 4) * .185, 2.18 - Math.floor(i / 4) * .19, -2.71); },
    telas: {
      gancho: (g, C, k, t) => { g.fillStyle = "#f4eaea"; g.fillRect(70, 22, 116, 100); g.fillStyle = "#ef4444"; g.fillRect(70, 22, 116, 24); T(g, "DIA 10", 128, 34, 14, "#fff"); T(g, "CONTA", 128, 70, 20, "#2a1212"); T(g, "VENCENDO!", 128, 96, 17, "#ef4444"); T(g, "5 COISAS PRA ISSO", 128, 140, 14 * (0.7 + 0.3 * k), "#ffc93c"); },
      n5: (g, C, k, t) => { jan(g, "Syncthing"); g.fillStyle = "#ffc93c"; g.fillRect(30, 56, 70, 50); g.fillRect(156, 56, 70, 50); T(g, "PC", 65, 82, 16, "#2a1212"); T(g, "BACKUP", 191, 82, 14, "#2a1212"); const p = (t * 1.4) % 1; g.fillStyle = "#ef4444"; g.beginPath(); g.arc(106 + p * 44, 81, 6, 0, 7); g.fill(); if (k > .6) T(g, "2 LUGARES ✓", 128, 128, 13, "#2a1212"); },
      n4: (g, C, k) => { jan(g, "Immich"); const A = ["#ef4444", "#ffc93c", "#60a5fa"]; for (let i = 0; i < 9; i++) { const a = i % 3, v = Math.max(0, Math.min(1, k * 11 - i)); g.globalAlpha = v; g.fillStyle = A[a]; g.fillRect(24 + a * 74 + (i > 5 ? 22 : i > 2 ? 0 : 0), 40 + Math.floor(i / 3) * 30 + 0, 32, 24); g.globalAlpha = 1; } ["VIAGEM", "CASA", "FAMÍLIA"].forEach((t, i) => T(g, t, 40 + i * 74, 134, 11, "#2a1212")); },
      n3: (g, C, k) => { jan(g, "Whisper"); g.fillStyle = "#ef4444"; for (let i = 0; i < 26; i++) { const h = 6 + 24 * Math.abs(Math.sin(i * 1.3 + k * 6)); g.fillRect(24 + i * 8, 62 - h / 2, 5, h); } const q = "Pagar a luz até dia 10"; g.textAlign = "left"; T(g, q.slice(0, Math.round(q.length * Math.max(0, Math.min(1, k * 1.6 - .4)))), 28, 112, 15, "#2a1212"); g.textAlign = "center"; },
      n2: (g, C, k) => { jan(g, "Ollama"); g.fillStyle = "#fff"; g.fillRect(24, 38, 208, 70); g.fillStyle = "#e3cfcf"; g.fillRect(34, 46, 110 * Math.min(1, k * 2), 10); g.fillStyle = "#ef4444"; g.fillRect(34, 64, 150 * Math.min(1, Math.max(0, k * 2 - .4)), 10); g.fillRect(34, 82, 90 * Math.min(1, Math.max(0, k * 2 - .8)), 10); T(g, "NO SEU PC", 100, 128, 14, "#2a1212"); T(g, "R$ 0 / mês", 190, 128, 14, "#b91c1c"); },
      n1: (g, C, k, t) => { T(g, "CONTAS DA CASA", 128, 22, 19, "#ffc93c"); [["Luz", "VENCE EM 3 DIAS"], ["Internet", "VENCE EM 7 DIAS"], ["Água", "PAGA ✓"]].forEach(([n, s], i) => { const v = Math.max(0, Math.min(1, k * 3.4 - i)); g.globalAlpha = v; g.fillStyle = "#2c1a1e"; g.fillRect(20, 40 + i * 36, 216, 30); g.textAlign = "left"; T(g, n, 30, 55 + i * 36, 15, "#fff"); g.textAlign = "right"; T(g, s, 226, 55 + i * 36, 11, i === 0 && Math.sin(t * 6) > 0 ? "#ff6b6b" : i === 2 ? "#7CFC7C" : "#ffc93c"); g.textAlign = "center"; g.globalAlpha = 1; }); },
    },
    acessorio: () => { const B = new THREE.Group(); B.position.set(0, 1.5, 0); MAS.corpo.add(B); mesh(new THREE.SphereGeometry(.26, 18, 10, 0, Math.PI * 2, 0, Math.PI * .72), M("#ffc93c", { metalness: .3, roughness: .35 }), B, 0, .14, 0); mesh(new THREE.SphereGeometry(.07, 10, 8), M("#b45309"), B, 0, -.05, 0); mesh(new THREE.TorusGeometry(.07, .02, 6, 12), M("#ef4444"), B, 0, .42, 0); },
  });
  // o nº 1 é um assistente do kit (sem estrelas no GitHub): troca o contador por um selo "ASSISTENTE DO KIT" e a lista final mostra "KIT".
  const ui0 = R.ui; const D = "#ef4444";
  R.ui = Cx => { const U = ui0(Cx); const { X } = Cx; const o2 = U.cab2, of = U.fechamento;
    const txt = (s, x, y, f, c, al = "center") => { X.font = `400 ${f}px AB`; X.textAlign = al; X.textBaseline = "middle"; X.fillStyle = c; X.fillText(s, x, y); };
    U.cab2 = (s, lt) => { if (!s.kit) return o2(s, lt); const y = 690, k = K.eo(K.lin(lt, .1, .4)); X.save(); X.globalAlpha = k; X.fillStyle = D; X.beginPath(); X.roundRect(70, y - 52, 104, 104, 22); X.fill(); txt("#1", 122, y + 2, 48, "#160d0f");
      let f = 66; X.font = `400 ${f}px AB`; while (X.measureText(s.item).width > 800 && f > 30) { f -= 2; X.font = `400 ${f}px AB`; } X.translate(0, 18 * (1 - k)); txt(s.item, 200, y, f, "#ffffff", "left");
      X.fillStyle = "#ffc93c"; X.beginPath(); X.roundRect(70, 760, 400, 90, 22); X.fill(); txt("ASSISTENTE DO KIT", 270, 806, 32, "#160d0f"); X.restore(); };
    U.fechamento = lt => { const real = Cx.ITENS.map(s => s.estrelas); Cx.ITENS.forEach(s => { if (s.kit) s.estrelas = NaN; }); const fm = Number.prototype.toLocaleString; Number.prototype.toLocaleString = function (...a) { return Number.isNaN(this.valueOf()) ? "KIT" : fm.apply(this, a); }; try { of(lt); } finally { Number.prototype.toLocaleString = fm; Cx.ITENS.forEach((s, i) => s.estrelas = real[i]); } };
    return U; };
  return R;
}

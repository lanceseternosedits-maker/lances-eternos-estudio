// Reel 🆕 contagem "5 coisas em alta que a IA faz por você" (Handy, Open WebUI, Home Assistant, Jellyfin + Assistente de cardápio; molde campeão clean, 27/11).
// Identidade: cozinha clara, tábua e panela; tela mostra cada programa; nº 1 (assistente do kit, sem estrelas): cardápio da semana + lista do mercado.
// Coral + dourado sobre grafite. Mascote de chapéu de cozinheiro; ação: mexer a panela.
import make from "./_clean.js";
import { T, R, jan, cl, barra, digita, chat } from "./_t.js";
export default function (K) {
  const { THREE, S, box, mesh, M, MAS } = K;
  const base = make(K, {
    cores: { parede: "#332a2b", piso: "#453a3a", destaque: "#fb7185", escuro: "#1a1113", ouro: "#ffc93c", selo: "A IA FAZ POR VOCÊ" },
    cenario: () => { const g = new THREE.Group(); g.position.set(-2.6, .9, -1.7); S.add(g); mesh(new THREE.CylinderGeometry(.22, .2, .2, 16), M("#9aa0a8", { metalness: .5, roughness: .4 }), g, 0, .1, 0); box(.5, .03, .06, M("#9aa0a8"), g, .35, .16, 0); },
    telas: {
      gancho: (g, C, k) => { T(g, "O QUE TEM", 128, 44, 22, "#fff"); T(g, "PRA JANTAR?", 128, 78, 28, "#ffc93c"); T(g, "?".repeat(1 + Math.floor(k * 3)), 128, 124, 30 + 6 * Math.sin(k * 9), "#fb7185"); },
      n5: (g, C, k) => { jan(g, "Handy", C.destaque); R(g, 100, 36, 56, 28, "#1b1f27", 14); T(g, "🎤", 128, 50, 14, "#fff"); R(g, 28, 76, 200, 50, "#fff", 5); digita(g, "comprar arroz e feijão", 38, 101, 13, "#1b1f27", (k - .2) * 1.6); T(g, "VOCÊ FALA, O TEXTO APARECE", 128, 138, 10, "#5a6270"); },
      n4: (g, C, k) => { jan(g, "Open WebUI", C.destaque); chat(g, C.destaque, "o que faço de janta?", "Que tal um|risoto de frango?", k); },
      n3: (g, C, k) => { jan(g, "Home Assistant", C.destaque); R(g, 30, 74, 90, 62, "#fff", 4); g.fillStyle = "#5a6270"; g.beginPath(); g.moveTo(24, 76); g.lineTo(75, 38); g.lineTo(126, 76); g.fill(); R(g, 54, 94, 22, 26, k > .4 ? "#ffc93c" : "#cbd2dd", 3); [["luz", .4], ["porta", .7]].forEach(([s, lim], i) => { const on = k > lim; T(g, s, 148, 56 + i * 34, 12, "#1b1f27", "left"); R(g, 190, 48 + i * 34, 36, 16, on ? C.destaque : "#9aa3b2", 8); g.fillStyle = "#fff"; g.beginPath(); g.arc(on ? 218 : 198, 56 + i * 34, 6, 0, 7); g.fill(); }); },
      n2: (g, C, k) => { jan(g, "Jellyfin", C.destaque, "#23232a"); const cs = ["#f59e0b", "#38bdf8", "#34d399", "#a78bfa", "#fb7185", "#facc15"]; for (let i = 0; i < 6; i++) { const v = cl(k * 8 - i * .6); g.globalAlpha = v; R(g, 24 + (i % 3) * 74, 38 + Math.floor(i / 3) * 52, 66, 46, cs[i], 4); T(g, "▶", 57 + (i % 3) * 74, 61 + Math.floor(i / 3) * 52, 16, "#fff"); g.globalAlpha = 1; } T(g, "A SUA BIBLIOTECA", 128, 142, 10, "#fff"); },
      n1: (g, C, k) => { jan(g, "Cardápio da semana", C.destaque); ["SEG  macarrão", "TER  frango", "QUA  omelete", "QUI  risoto"].forEach((s, i) => { const v = cl(k * 5 - i * .8); g.globalAlpha = v; R(g, 24, 36 + i * 22, 130, 18, "#fff", 4); T(g, s, 30, 45 + i * 22, 11, "#1b1f27", "left"); g.globalAlpha = 1; }); R(g, 164, 36, 70, 94, "#fff7d6", 4); T(g, "MERCADO", 199, 46, 10, "#1b1f27"); ["ovo", "arroz", "frango"].forEach((s, i) => { const v = cl(k * 5 - 2 - i * .7); g.globalAlpha = v; T(g, "✓ " + s, 174, 66 + i * 20, 11, "#1b1f27", "left"); g.globalAlpha = 1; }); },
    },
    acessorio: () => { const B = new THREE.Group(); B.position.set(0, 1.5, 0); MAS.corpo.add(B); mesh(new THREE.CylinderGeometry(.38, .34, .3, 20), M("#ffffff"), B, 0, .15, 0); mesh(new THREE.SphereGeometry(.4, 16, 12), M("#ffffff"), B, 0, .38, 0).scale.set(1.1, .8, 1); },
  });
  // nº 1 é o assistente do kit (sem estrelas): troca o contador "0 ★" por "DO KIT" no cabeçalho e na lista final
  const ui0 = base.ui, { eo, lin } = K;
  base.ui = Cx => { const U = ui0(Cx), X = Cx.X, cab0 = U.cab2, fim0 = U.fechamento;
    U.cab2 = (s, lt) => { cab0(s, lt); if (s.estrelas) return; const k = eo(lin(lt, .1, .4)); if (k < .5) return; X.save(); X.translate(0, 18 * (1 - k)); X.fillStyle = "#ffffff"; X.beginPath(); X.roundRect(70, 760, 340, 120, 22); X.fill();
      X.textAlign = "center"; X.textBaseline = "middle"; X.fillStyle = "#1a1113"; X.font = "400 56px AB"; X.fillText("DO KIT", 240, 806); X.fillStyle = "#7a7f8c"; X.font = "400 22px AB"; X.fillText("Super Assistente de IA", 240, 852); X.restore(); };
    U.fechamento = lt => { fim0(lt); const k = eo(lin(lt, .1, .45)); X.save(); X.globalAlpha = k; X.translate(40 * (1 - k), 0); X.fillStyle = "#ffc93c"; X.fillRect(790, 722, 120, 76); X.textAlign = "right"; X.textBaseline = "middle"; X.fillStyle = "#1a1113"; X.font = "400 30px AB"; X.fillText("DO KIT", 900, 762); X.restore(); };
    return U; };
  return base;
}

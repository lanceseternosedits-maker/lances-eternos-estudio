// Peças de desenho 2D para as telas dos módulos de contagem (canvas lógico 256x160; sem logo de marca nem rosto).
export const cl = k => Math.max(0, Math.min(1, k));
export const T = (g, s, x, y, f, c, al = "center") => { g.font = `900 ${f}px sans-serif`; g.textAlign = al; g.textBaseline = "middle"; g.fillStyle = c; g.fillText(s, x, y); };
export const R = (g, x, y, w, h, c, r = 0) => { g.fillStyle = c; if (r) { g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); } else g.fillRect(x, y, w, h); };
// janela genérica com barra de título e a cor de destaque
export const jan = (g, t, cor, fundo = "#eceff4") => { R(g, 14, 12, 228, 138, fundo, 5); R(g, 14, 12, 228, 18, "#d3d9e3", 5); R(g, 14, 22, 228, 8, "#d3d9e3"); R(g, 20, 17, 7, 7, cor, 4); T(g, t, 36, 21, 11, "#1b1f27", "left"); };
export const onda = (g, x, y, w, h, k, cor, n = 24) => { for (let i = 0; i < n; i++) { const a = Math.abs(Math.sin(i * 1.7 + k * 9)) * .8 + .2, hh = h * a * cl(k * 3 - i / n); R(g, x + i * (w / n), y - hh / 2, w / n - 2, hh, cor, 1); } };
export const digita = (g, s, x, y, f, c, k, al = "left") => T(g, s.slice(0, Math.round(s.length * cl(k))), x, y, f, c, al);
export const barra = (g, x, y, w, h, k, cor, fundo = "#c5ccd8") => { R(g, x, y, w, h, fundo, h / 2); R(g, x, y, Math.max(h, w * cl(k)), h, cor, h / 2); };
export const chat = (g, cor, perg, resp, k) => { R(g, 70, 38, 160, 24, "#d9dfe9", 8); T(g, perg, 150, 50, 11, "#1b1f27"); if (k > .35) { R(g, 26, 72, 190, 54, cor, 8); const l = resp.split("|"); l.forEach((s, i) => digita(g, s, 34, 86 + i * 16, 12, "#fff", (k - .35) * 2.2 - i * .5)); } };
export const term = (g, linhas, k, cor) => { R(g, 14, 12, 228, 138, "#0d1117", 5); R(g, 14, 12, 228, 16, "#1c232d", 5); R(g, 14, 22, 228, 6, "#1c232d"); linhas.forEach((s, i) => { const v = cl(k * linhas.length * 1.1 - i); T(g, s.slice(0, Math.round(s.length * v)), 24, 42 + i * 20, 12, i === 0 ? cor : "#e6edf3", "left"); }); };
export const placa = (g, x, y, k, cor) => { R(g, x, y, 130, 60, "#23282f", 6); R(g, x + 4, y + 4, 122, 52, "#14181d", 4); for (const cx of [x + 36, x + 94]) { g.save(); g.translate(cx, y + 30); g.rotate(k * 14); g.fillStyle = "#2c333c"; g.beginPath(); g.arc(0, 0, 22, 0, 7); g.fill(); g.fillStyle = cor; for (let i = 0; i < 5; i++) { g.rotate(Math.PI * 2 / 5); g.beginPath(); g.ellipse(10, 0, 10, 4, 0, 0, 7); g.fill(); } g.restore(); } };

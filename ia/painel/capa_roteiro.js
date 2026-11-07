// Capa estilo thumb de YouTube para roteiros sem vídeo: mascote grande reagindo, texto gigante com contorno,
// seta vermelha e selo com o número (Vitor, 07/11: "bem chamativo, igual thumb do YouTube").
// Uso (de dentro de ia/): node painel/capa_roteiro.js [--todas]  -> painel/capas/roteiro-<pasta>.jpg
// Texto: roteiro.capa = {"texto": "...", "destaque": "..."} se existir; senão a etiqueta do gancho.
// O mascote é o do manual (bloco laranja-terracota, olhos pretos verticais, bracinhos, perninhas), sem logo de ninguém.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const IA = path.resolve(__dirname, "..");
const POSTS = path.join(IA, "posts");
const CAPAS = path.join(__dirname, "capas");
const FONTES = path.join(IA, "video", "cena_contagem", "f");
const TODAS = process.argv.includes("--todas");
// [fundo1, fundo2, raios]
const FUNDOS = [["#ffcf1f", "#ff7a00", "#fff3a0"], ["#00d4ff", "#0047ff", "#9ff0ff"], ["#ff3fa4", "#7a00ff", "#ffb3e0"],
  ["#7dff3a", "#00a86b", "#d9ffb0"], ["#ff4040", "#a3001b", "#ffb0b0"], ["#b44dff", "#2a00a8", "#e3c2ff"]];

const esc = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const b64 = (n) => "data:font/woff2;base64," + fs.readFileSync(path.join(FONTES, n)).toString("base64");
const FONTE_A = b64("archivo-black-latin-400-normal.woff2");

function mascote(pose) {
  // pose 0: chocado com os braços pra cima · 1: apontando pro selo · 2: chocado com as mãos no rosto
  // braços: bloco de 26×56 girado a partir do ombro
  const braco = (x, y, ang) => `<rect x="${x - 13}" y="${y - 52}" width="26" height="56" rx="7" transform="rotate(${ang} ${x} ${y})"/>`;
  const bracoE = pose === 2 ? "" : braco(36, 60, -40);
  const bracoD = pose === 1 ? braco(168, 84, 75) : pose === 2 ? "" : braco(164, 60, 40);
  // pose 2: mãos nas bochechas, na frente do corpo
  const maos = pose === 2 ? `<g fill="url(#l)" stroke="#2a1208" stroke-width="5">${braco(40, 150, 28)}${braco(160, 150, -28)}</g>` : "";
  return `<svg viewBox="-10 -30 230 230" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e58a60"/><stop offset="1" stop-color="#b8532f"/></linearGradient>
<linearGradient id="l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c8653f"/><stop offset="1" stop-color="#9e4626"/></linearGradient></defs>
<ellipse cx="100" cy="186" rx="80" ry="10" fill="#0004"/>
<g fill="url(#l)" stroke="#2a1208" stroke-width="5">${bracoE}${bracoD}
<rect x="48" y="138" width="20" height="42" rx="4"/><rect x="76" y="138" width="20" height="42" rx="4"/><rect x="104" y="138" width="20" height="42" rx="4"/><rect x="132" y="138" width="20" height="42" rx="4"/></g>
<rect x="30" y="20" width="140" height="124" rx="18" fill="url(#c)" stroke="#2a1208" stroke-width="6"/>
<rect x="42" y="28" width="116" height="16" rx="8" fill="#fff" opacity=".25"/>
<rect x="66" y="52" width="18" height="${pose === 1 ? 34 : 42}" rx="3" fill="#111"/><rect x="116" y="52" width="18" height="${pose === 1 ? 34 : 42}" rx="3" fill="#111"/>
<rect x="69" y="55" width="6" height="9" fill="#fff"/><rect x="119" y="55" width="6" height="9" fill="#fff"/>
${maos}
${pose === 1 ? '<path d="M82 112 Q100 126 118 112" fill="none" stroke="#111" stroke-width="7" stroke-linecap="round"/>'
    : '<ellipse cx="100" cy="116" rx="15" ry="18" fill="#111"/><ellipse cx="100" cy="124" rx="9" ry="7" fill="#e24a4a"/>'}
${pose !== 1 ? '<path d="M176 6 q8 14 0 20 q-8 -6 0 -20z" fill="#5fd3ff" stroke="#0a3b55" stroke-width="2"/><text x="-4" y="30" font-family="A" font-size="44" fill="#ffe600" stroke="#000" stroke-width="5" paint-order="stroke" transform="rotate(-14 10 20)">!</text>' : ""}
</svg>`;
}

function pagina(rot, pasta) {
  const g = (rot.segmentos || [])[0] || {};
  const et = g.etiqueta || [g.tag || rot.tese || pasta, "", ""];
  const capa = rot.capa || {};
  const texto = (capa.texto || et[0] || "").toUpperCase().replace(/-/g, "\u2011");
  const palavras = texto.split(/\s+/);
  const destaque = (capa.destaque || palavras.slice(-2).join(" ")).toUpperCase();
  const corpo = texto.endsWith(destaque) ? texto.slice(0, texto.length - destaque.length).trim() : texto;
  const numero = (et[1] || "").replace(/\s+ESTRELAS.*$/i, " ★").replace(/^NOVIDADE.*/i, "NOVO!").trim();
  const isca = (et[2] || "").toUpperCase();
  const h = hash(pasta);
  const [f1, f2, raio] = FUNDOS[h % FUNDOS.length];
  const pose = h % 3;
  const tam = texto.length > 42 ? 27 : texto.length > 30 ? 31 : texto.length > 20 ? 36 : 42;
  return `<html><head><style>
@font-face{font-family:A;src:url(${FONTE_A})}
*{box-sizing:border-box}body{margin:0;width:270px;height:480px;overflow:hidden;position:relative;font-family:A,sans-serif;
 background:radial-gradient(circle at 50% 62%,${f1} 0,${f2} 75%)}
.raios{position:absolute;inset:-40%;background:repeating-conic-gradient(from 0deg at 50% 62%,${raio}55 0 9deg,transparent 9deg 22deg)}
.txt{position:absolute;top:26px;left:12px;right:12px;word-break:keep-all;overflow-wrap:normal;transform:rotate(-3deg);text-align:left;line-height:.98;font-size:${tam}px;color:#fff;
 -webkit-text-stroke:7px #000;paint-order:stroke fill;text-shadow:0 5px 0 #000}
.txt b{color:#ffe600;font-weight:400;display:block}
.selo{position:absolute;right:12px;top:${tam > 35 ? 196 : 182}px;transform:rotate(8deg);background:#ff1a1a;color:#fff;font-size:24px;padding:7px 12px;
 border:4px solid #fff;border-radius:12px;box-shadow:0 5px 0 #000;-webkit-text-stroke:0;white-space:nowrap;text-align:center;line-height:1.05}
.mascote{position:absolute;left:-14px;bottom:44px;width:228px;filter:drop-shadow(0 6px 0 #0006)}
.seta{position:absolute;left:186px;top:318px;width:80px;transform:rotate(180deg);filter:drop-shadow(0 4px 0 #0008)}
.isca{position:absolute;left:0;right:0;bottom:0;background:#000;color:#ffe600;font-size:14px;padding:10px 12px 12px;text-align:center;letter-spacing:.02em}
</style></head><body><div class="raios"></div>
<div class="txt">${esc(corpo)}<b>${esc(destaque)}</b></div>
${numero ? `<div class="selo">${esc(numero)}</div>` : ""}
<div class="mascote">${mascote(pose)}</div>
<svg class="seta" viewBox="-4 -4 108 58"><path d="M2 14 H62 V0 L98 25 L62 50 V36 H2 Z" fill="#ff1a1a" stroke="#fff" stroke-width="5" stroke-linejoin="round"/></svg>
<div class="isca">${esc(isca || "COMENTA " + (rot.chave || "").toUpperCase())}</div>
</body></html>`;
}

(async () => {
  fs.mkdirSync(CAPAS, { recursive: true });
  const pastas = fs.readdirSync(POSTS).filter((p) => !p.startsWith("_") && fs.existsSync(path.join(POSTS, p, "roteiro.json")));
  const faltam = pastas.filter((p) => {
    const d = path.join(POSTS, p);
    const temMidia = ["reel.mp4", "short.mp4", "capa.jpg", "slides"].some((n) => fs.existsSync(path.join(d, n)));
    return !temMidia && (TODAS || !fs.existsSync(path.join(CAPAS, `roteiro-${p}.jpg`)));
  });
  if (!faltam.length) return console.log("capas de roteiro: nada a fazer");
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 270, height: 480 }, deviceScaleFactor: 2 });
  for (const p of faltam) {
    const rot = JSON.parse(fs.readFileSync(path.join(POSTS, p, "roteiro.json"), "utf8"));
    await pg.setContent(pagina(rot, p), { waitUntil: "load" });
    await pg.evaluate(async () => {
      await document.fonts.ready;
      // encolhe o título até caber acima do selo e dentro da largura
      const tx = document.querySelector(".txt"), selo = document.querySelector(".selo");
      const limite = (selo ? selo.offsetTop : 230) - 34;
      let f = parseFloat(getComputedStyle(tx).fontSize);
      while (f > 16 && (tx.offsetHeight > limite || tx.scrollWidth > tx.clientWidth + 1)) { f -= 1; tx.style.fontSize = f + "px"; }
    });
    await pg.screenshot({ path: path.join(CAPAS, `roteiro-${p}.jpg`), type: "jpeg", quality: 70 });
  }
  await b.close();
  console.log(`capas de roteiro: ${faltam.length} criada(s)`);
})();

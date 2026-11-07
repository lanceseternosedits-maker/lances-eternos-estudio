// Capa de prévia para roteiros que ainda não têm vídeo: etiqueta do gancho (3 camadas) + CTA, no formato 9:16.
// Uso (de dentro de ia/): node painel/capa_roteiro.js   -> grava painel/capas/roteiro-<pasta>.jpg (só as que faltam)
// Quando o vídeo existir, o painel troca sozinho pela capa do 1º quadro do vídeo.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const IA = path.resolve(__dirname, "..");
const POSTS = path.join(IA, "posts");
const CAPAS = path.join(__dirname, "capas");
const FONTES = path.join(IA, "video", "cena_contagem", "f");
const PALETAS = [["#ff8a3d", "#1a1020"], ["#5ce1ff", "#0d1626"], ["#ff4fd8", "#1c0f22"], ["#b6f24a", "#101a12"], ["#ffd23f", "#1d1708"], ["#7c8cff", "#10122a"]];

const esc = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

function pagina(rot, pasta) {
  const g = (rot.segmentos || [])[0] || {};
  const [assunto, numero, promessa] = g.etiqueta || [g.tag || rot.tese || pasta, "", ""];
  const [cor, fundo] = PALETAS[hash(pasta) % PALETAS.length];
  const fonte = (n) => "data:font/woff2;base64," + fs.readFileSync(path.join(FONTES, n)).toString("base64");
  return `<html><head><style>
@font-face{font-family:A;src:url(${fonte("archivo-black-latin-400-normal.woff2")})}
@font-face{font-family:I;src:url(${fonte("inter-latin-500-normal.woff2")})}
body{margin:0;width:270px;height:480px;background:radial-gradient(120% 80% at 50% 0%,${cor}33,${fundo} 60%),${fundo};
 font-family:I,sans-serif;color:#fff;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden}
.top{padding:18px 16px 0;display:flex;justify-content:space-between;font-size:10px;letter-spacing:.08em;color:#ffffffaa}
.selo{border:1px solid #ffffff55;border-radius:10px;padding:2px 8px}
.et{padding:0 18px}
.a{font-family:A;font-size:25px;line-height:1.08;text-transform:uppercase}
.n{font-family:A;font-size:19px;color:${cor};margin-top:10px;text-transform:uppercase}
.p{font-size:13px;margin-top:8px;color:#f3ead7;text-transform:uppercase;letter-spacing:.04em}
.cta{margin:0 18px 26px;align-self:flex-start;background:${cor};color:#111;font-family:A;font-size:13px;padding:7px 12px;border-radius:999px}
.marca{position:absolute;bottom:30px;right:16px;font-size:10px;color:#ffffff88}
</style></head><body>
<div class="top"><span class="selo">ROTEIRO</span><span>${esc((rot.agenda || "").toString().slice(0, 16))}</span></div>
<div class="et"><div class="a">${esc(assunto)}</div>${numero ? `<div class="n">${esc(numero)}</div>` : ""}${promessa ? `<div class="p">${esc(promessa)}</div>` : ""}</div>
<div class="cta">COMENTA ${esc((rot.chave || "").toUpperCase())}</div><div class="marca">@iaem60s</div>
</body></html>`;
}

(async () => {
  fs.mkdirSync(CAPAS, { recursive: true });
  const pastas = fs.readdirSync(POSTS).filter((p) => !p.startsWith("_") && fs.existsSync(path.join(POSTS, p, "roteiro.json")));
  const faltam = pastas.filter((p) => {
    const d = path.join(POSTS, p);
    const temMidia = ["reel.mp4", "short.mp4", "capa.jpg", "slides"].some((n) => fs.existsSync(path.join(d, n)));
    return !temMidia && !fs.existsSync(path.join(CAPAS, `roteiro-${p}.jpg`));
  });
  if (!faltam.length) return console.log("capas de roteiro: nada a fazer");
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 270, height: 480 }, deviceScaleFactor: 1.5 });
  for (const p of faltam) {
    const rot = JSON.parse(fs.readFileSync(path.join(POSTS, p, "roteiro.json"), "utf8"));
    await pg.setContent(pagina(rot, p), { waitUntil: "load" });
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(CAPAS, `roteiro-${p}.jpg`), type: "jpeg", quality: 72 });
  }
  await b.close();
  console.log(`capas de roteiro: ${faltam.length} criada(s)`);
})();

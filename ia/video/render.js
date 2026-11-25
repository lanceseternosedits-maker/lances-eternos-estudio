// Renderiza a cena quadro a quadro. Uso: node render.js [--teste t1,t2,...]
// PALETTE=n (1–4). Saída: out/frames/NNNNN.jpg (ou out/teste_*.jpg)
const { chromium } = require("playwright");
const fs = require("fs"), http = require("http"), path = require("path");
const PALS = {
  1: { bg: "#0B0820", ink: "#F5F3FF", soft: "#B9B3D9", mute: "#6B6590", c1: "#5CE1FF", c2: "#FF4FD8", line: "#221C48", card: "#130F2E" },
  2: { bg: "#06110F", ink: "#F2FFF8", soft: "#A9C7BC", mute: "#5E7A72", c1: "#C8FF2E", c2: "#2EE6FF", line: "#14302A", card: "#0B1C18" },
  3: { bg: "#170A14", ink: "#FFF4F0", soft: "#D8B5BE", mute: "#8A6470", c1: "#FFB13B", c2: "#FF3D8B", line: "#36182B", card: "#22101D" },
  4: { bg: "#080B24", ink: "#F3F4FF", soft: "#B3B6DD", mute: "#61659A", c1: "#B26BFF", c2: "#3D7BFF", line: "#1A1F4D", card: "#0F1336" },
};
const rot = JSON.parse(fs.readFileSync("" + (process.env.ROT || "roteiro.json") + "")), tl = JSON.parse(fs.readFileSync(process.env.TL || "out/timeline.json"));
const WWW = path.join(__dirname, process.env.WWW || "www"); const OUT = process.env.OUT || "out";
const CFGJ = JSON.stringify({ pal: PALS[process.env.PALETTE || 4], titulo: rot.titulo, chave: rot.chave || "EQUIPE", segs: rot.segmentos, timeline: tl }); fs.writeFileSync(path.join(WWW, "cfg.json"), CFGJ); // o servidor responde o cfg desta execução (renders em paralelo não se misturam)
const types = { html: "text/html", js: "text/javascript", json: "application/json", svg: "image/svg+xml", woff2: "font/woff2" };
const srv = http.createServer((q, r) => { if (q.url.split("?")[0] === "/cfg.json") { r.writeHead(200, { "Content-Type": "application/json" }); return r.end(CFGJ); } const f = path.join(WWW, decodeURIComponent(q.url.split("?")[0])); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { "Content-Type": types[f.split(".").pop()] || "application/octet-stream" }); fs.createReadStream(f).pipe(r); }).listen(+(process.env.PORT || 8765));
(async () => {
  const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on("console", m => m.type() === "error" && console.log("ERR", m.text())); p.on("pageerror", e => console.log("PAGEERR", e.message));
  await p.goto(`http://127.0.0.1:${process.env.PORT || 8765}/index.html`); await p.waitForFunction("window.READY", null, { timeout: 60000 });
  const ti = process.argv.indexOf("--teste");
  if (ti > 0) {
    for (const t of process.argv[ti + 1].split(",").map(Number)) { await p.evaluate(t => setT(t), t); await p.screenshot({ path: `${OUT}/teste_${t}.jpg`, type: "jpeg", quality: 85 }); }
  } else {
    fs.mkdirSync(OUT + "/frames", { recursive: true }); const FPS = 30, N = Math.ceil(tl.total * FPS); const t0 = Date.now();
    const DE = +(process.env.DE || 0), ATE = +(process.env.ATE || 1e9);
    for (let i = Math.floor(DE * FPS); i < Math.min(N, Math.ceil(ATE * FPS)); i++) {
      await p.evaluate(t => setT(t), i / FPS);
      await p.screenshot({ path: `${OUT}/frames/${String(i).padStart(5, "0")}.jpg`, type: "jpeg", quality: 90 });
      if (i % 150 === 0) console.log(i, "/", N, ((Date.now() - t0) / 1000).toFixed(0) + "s");
    }
  }
  await b.close(); srv.close();
})();

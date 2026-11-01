// Carrossel em formato LISTA (capa de impacto + itens numerados com imagem real + selos de dados + CTA "comenta").
// Identidade: IA em 60s. Uso: CONTENT=posts/AAAA-MM-DD-slug/post.json PALETTE=1..4 node lista.js  -> <pasta do post>/slides/*.jpg
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const POST = JSON.parse(fs.readFileSync(process.env.CONTENT, "utf8"));
const IMG = path.dirname(path.resolve(process.env.CONTENT));
const data = (f) => { const ext = path.extname(f).slice(1).replace("jpg", "jpeg"); return `data:image/${ext};base64,` + fs.readFileSync(path.join(IMG, f)).toString("base64"); };
const font = (pkg, file) => "data:font/woff2;base64," + fs.readFileSync(path.join(__dirname, "node_modules/@fontsource", pkg, "files", file)).toString("base64");
const ff = (fam, pkg, file, w) => `@font-face{font-family:${fam};font-weight:${w};src:url(${font(pkg, file)})}`;
const fonts = ff("Head", "space-grotesk", "space-grotesk-latin-700-normal.woff2", 700) + ff("Inter", "inter", "inter-latin-400-normal.woff2", 400) +
  ff("Inter", "inter", "inter-latin-600-normal.woff2", 600) + ff("Mono", "jetbrains-mono", "jetbrains-mono-latin-500-normal.woff2", 500);

// Paletas em rodízio: cada post usa a próxima (1→2→3→4→1...). PALETTE=1..4; padrão 1 (a da logo).
const PALETTES = {
  1: { bg: "#0B0820", ink: "#F5F3FF", soft: "#B9B3D9", mute: "#6B6590", c1: "#5CE1FF", c2: "#FF4FD8", line: "#221C48", card: "#130F2E" }, // ciano / magenta
  2: { bg: "#06110F", ink: "#F2FFF8", soft: "#A9C7BC", mute: "#5E7A72", c1: "#C8FF2E", c2: "#2EE6FF", line: "#14302A", card: "#0B1C18" }, // lima / ciano
  3: { bg: "#170A14", ink: "#FFF4F0", soft: "#D8B5BE", mute: "#8A6470", c1: "#FFB13B", c2: "#FF3D8B", line: "#36182B", card: "#22101D" }, // laranja / rosa
  4: { bg: "#080B24", ink: "#F3F4FF", soft: "#B3B6DD", mute: "#61659A", c1: "#B26BFF", c2: "#3D7BFF", line: "#1A1F4D", card: "#0F1336" }, // violeta / azul elétrico
};
const C = PALETTES[process.env.PALETTE || 1];
const GRAD = `linear-gradient(90deg,${C.c1},${C.c2})`;
const HANDLE = "@iaem60s";
const KEY = POST.cta.key;

const ITEMS = POST.items;
const N = ITEMS.length + 2;

const css = `${fonts}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:${C.bg};color:${C.ink};font-family:Inter;overflow:hidden;position:relative}
.bg{position:absolute;inset:0;background-image:linear-gradient(${C.line} 1px,transparent 1px),linear-gradient(90deg,${C.line} 1px,transparent 1px);background-size:60px 60px;opacity:.55}
.glow{position:absolute;width:900px;height:900px;border-radius:50%;pointer-events:none}
.wrap{position:absolute;inset:0;padding:70px 80px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:center}
.logo{display:flex;align-items:center;gap:12px;font-family:Head;font-weight:700;font-size:34px;letter-spacing:-1px}
.g{background:${GRAD};-webkit-background-clip:text;background-clip:text;color:transparent}
.count{font-family:Mono;font-size:24px;color:${C.mute};border:2px solid ${C.line};padding:7px 16px;border-radius:40px}
.head{display:flex;gap:28px;margin-top:70px;align-items:flex-start}
.num{font-family:Head;font-weight:700;font-size:150px;line-height:.82;letter-spacing:-8px}
.kick{display:flex;align-items:center;gap:12px;font-family:Mono;font-size:23px;color:${C.soft};margin-bottom:16px}
.play{width:34px;height:34px;border-radius:50%;background:${GRAD};display:flex;align-items:center;justify-content:center}
h2{font-family:Head;font-weight:700;font-size:66px;line-height:1;letter-spacing:-2.5px}
p.body{font-size:35px;line-height:1.36;color:${C.soft};margin-top:34px}
.media{margin-top:38px;height:560px;border-radius:26px;overflow:hidden;border:2px solid ${C.line};box-shadow:0 0 0 1px rgba(255,255,255,.04),0 30px 80px rgba(255,79,216,.18);background:${C.card};position:relative}
.media img{width:100%;height:100%;display:block}
.credit{position:absolute;right:14px;bottom:12px;font-family:Mono;font-size:17px;color:#fff;background:rgba(11,8,32,.75);padding:5px 10px;border-radius:8px}
.code{padding:44px 44px;font-family:Mono;font-size:31px;line-height:72px;color:${C.soft};columns:2;column-gap:40px}
.code b{color:${C.c1};font-weight:500}
.chips{display:flex;gap:14px;margin-top:auto}
.chip{display:flex;align-items:center;gap:16px;background:${C.card};border:2px solid ${C.line};border-radius:40px;padding:14px 26px}
.chip span{font-family:Mono;font-size:19px;color:${C.mute};text-transform:uppercase;letter-spacing:1.5px}
.chip b{font-family:Head;font-size:36px;letter-spacing:-1px}
.foot{display:flex;justify-content:space-between;font-family:Mono;font-size:22px;color:${C.mute};margin-top:26px;letter-spacing:2px}`;

// Logo oficial (rede neural + selo 60s), recolorida na paleta do post. ids únicos por tamanho.
const LOGO = fs.readFileSync(path.join(__dirname, "logo.svg"), "utf8");
const mark = (s) => LOGO.replace(/#5CE1FF/g, C.c1).replace(/#FF4FD8/g, C.c2).replace(/#0B0820/g, C.bg)
  .replace(/id="g"/g, `id="g${s}"`).replace(/url\(#g\)/g, `url(#g${s})`).replace(/id="glow"/g, `id="gl${s}"`).replace(/url\(#glow\)/g, `url(#gl${s})`)
  .replace('width="1080" height="1080"', `width="${s}" height="${s}"`);
const top = (i) => `<div class="top"><div class="logo">${mark(48)}<span>IA em <span class="g">60s</span></span></div><span class="count">${String(i).padStart(2, "0")} / ${String(N).padStart(2, "0")}</span></div>`;
const page = (inner, glows = "") => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div class="bg"></div>${glows}<div class="wrap">${inner}</div></body></html>`;
const glow = (x, y, c, a = .28) => `<div class="glow" style="left:${x}px;top:${y}px;background:radial-gradient(closest-side,${c}${Math.round(a * 255).toString(16)},transparent)"></div>`;

function cover() {
  const imgs = (POST.cover.imgs || []).slice(0, 3);
  const tilt = [[-9, 20, 90], [6, 360, 40], [-3, 190, 270]];
  const cards = !imgs.length ? `<div style="display:flex;justify-content:center;padding-top:120px">${mark(440)}</div>` : imgs.map((f, k) => `<div style="position:absolute;left:${tilt[k][1]}px;top:${tilt[k][2]}px;width:560px;height:360px;border-radius:24px;overflow:hidden;transform:rotate(${tilt[k][0]}deg);border:3px solid rgba(255,255,255,.12);box-shadow:0 40px 90px rgba(0,0,0,.6),0 0 60px rgba(255,79,216,.25)"><img src="${data(f)}" style="width:100%;height:100%;object-fit:cover"></div>`).join("");
  return page(`${top(1)}
  <div style="position:relative;height:700px;margin-top:10px">${cards}</div>
  <div style="margin-top:30px;text-align:center">
    <div style="font-family:Head;font-weight:700;font-size:96px;line-height:.98;letter-spacing:-4px">${POST.cover.title_html}</div>
    <div style="font-family:Head;font-weight:700;font-size:44px;letter-spacing:-1.5px;margin-top:26px">${POST.cover.sub}</div>
  </div>
  <div class="foot" style="margin-top:auto"><span>${HANDLE.toUpperCase()}</span><span>SALVA PRA DEPOIS →</span></div>`,
  glow(-300, 700, C.c2, .35) + glow(500, -300, C.c1, .22));
}

function item(it, i) {
  const media = it.prompt
    ? `<div class="media" style="display:flex;flex-direction:column;justify-content:center;padding:44px 48px"><div style="font-family:Mono;font-size:22px;color:${C.mute};letter-spacing:2px;margin-bottom:22px">${it.prompt_label || "PROMPT · COPIE E COLE"}</div><div style="font-family:Mono;font-size:31px;line-height:1.45;color:${C.ink}">${it.prompt}</div><span class="credit">${it.repo}</span></div>`
    : !it.code && !it.img
    ? `<div class="media" style="display:flex;align-items:center;padding:50px"><div style="font-family:Head;font-size:58px;line-height:1.1;letter-spacing:-2px" class="g">${it.quote || it.title}</div><span class="credit">fonte: ${it.repo}</span></div>`
    : it.code
    ? `<div class="media"><div class="code">${it.code.map((c) => `<b>/</b>${c}`).join("<br>")}</div><span class="credit">${it.repo}</span></div>`
    : `<div class="media"><img src="${data(it.img)}" style="object-fit:${it.fit};object-position:${it.pos}"><span class="credit">${it.credit || "imagem: " + it.repo}</span></div>`;
  return page(`${top(i)}
  <div class="head"><div class="num g">${it.n}</div>
    <div><div class="kick"><span class="play"><svg width="14" height="14" viewBox="0 0 10 10"><path d="M2 1l7 4-7 4z" fill="${C.bg}"/></svg></span>${it.kick}</div><h2>${it.title}</h2></div></div>
  <p class="body">${it.body}</p>${media}
  <div class="chips">${it.chips.map(([a, b]) => `<div class="chip"><span>${a}</span><b>${b}</b></div>`).join("")}</div>`,
  glow(-400, 900, C.c2, .22) + glow(600, -400, C.c1, .14));
}

function cta() {
  return page(`${top(N)}
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;text-align:center">
    ${mark(150).replace("<svg", '<svg style="margin:0 auto 50px"')}
    <div style="font-family:Head;font-weight:700;font-size:118px;line-height:.95;letter-spacing:-5px">COMENTA<br>“${KEY}”</div>
    <div class="g" style="font-family:Head;font-weight:700;font-size:96px;line-height:1.05;letter-spacing:-4px;margin-top:10px">QUE EU TE MANDO.</div>
    <div style="font-size:40px;line-height:1.35;color:${C.soft};margin:60px 40px 0">${POST.cta.promise}</div>
  </div>
  <div class="foot"><span>${HANDLE.toUpperCase()}</span><span>SEGUE PRA PRÓXIMA LISTA →</span></div>`,
  glow(-200, 500, C.c2, .3) + glow(400, -300, C.c1, .2));
}

(async () => {
  const out = path.join(IMG, "slides"); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const pages = [cover(), ...ITEMS.map((it, k) => item(it, k + 2)), cta()];
  for (let i = 0; i < pages.length; i++) {
    await pg.setContent(pages[i], { waitUntil: "load" }); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(out, `${String(i + 1).padStart(2, "0")}.jpg`), type: "jpeg", quality: 92 });
  }
  await b.close(); console.log("ok", pages.length);
})();

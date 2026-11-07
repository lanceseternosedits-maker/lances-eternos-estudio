// Capas estilo thumb de YouTube para TODOS os posts (roteiros e já publicados): mascote reagindo, título gigante
// com contorno, selo, seta e um objeto ligado ao tema. Vitor, 07/11: "bem chamativo, igual thumb do YouTube",
// "variado e com elementos diversificados". Cada capa combina 12 elementos; capas vizinhas nunca repetem um elemento.
// Uso (de dentro de ia/): node painel/capas.js [--todas]   -> painel/capas/thumb-<pasta>.jpg
// Texto: roteiro.capa = {"texto": "...", "destaque": "...", "selo": "...", "isca": "..."} manda; senão etiqueta do gancho,
// capa do carrossel ou 1ª frase da legenda. Mascote do manual (sem logo de ninguém); fatos só os do post.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const IA = path.resolve(__dirname, "..");
const POSTS = path.join(IA, "posts");
const CAPAS = path.join(__dirname, "capas");
const F = path.join(IA, "video", "cena_contagem", "f");
const TODAS = process.argv.includes("--todas");
// --instagram pasta1,pasta2  -> posts/<pasta>/capa_instagram.jpg em 1080×1920, com tudo dentro do recorte 3:4 da grade
const IG = (process.argv.find((a) => a.startsWith("--instagram=")) || "").split("=")[1];
const b64 = (n) => "data:font/woff2;base64," + fs.readFileSync(path.join(F, n)).toString("base64");
const FONTES = [
  { nome: "Archivo", url: b64("archivo-black-latin-400-normal.woff2"), escala: 1, peso: 400 },
  { nome: "Bebas", url: b64("bebas-neue-latin-400-normal.woff2"), escala: 1.35, peso: 400 },
  { nome: "Space", url: b64("space-grotesk-latin-700-normal.woff2"), escala: 1.05, peso: 700 },
];
const esc = (s) => String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ler = (p) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; } };
const lerTxt = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return ""; } };

// ---------------------------------------------------------------- cardápio de elementos
const PALETAS = [ // [claro, escuro, detalhe, texto destaque]
  ["#ffcf1f", "#ff6a00", "#fff3a0", "#ffffff"], ["#00d4ff", "#0039d6", "#9ff0ff", "#ffe600"], ["#ff3fa4", "#6a00ff", "#ffb3e0", "#ffe600"],
  ["#7dff3a", "#008f5a", "#d9ffb0", "#ffe600"], ["#ff4b4b", "#8f0016", "#ffb0b0", "#ffe600"], ["#b44dff", "#24009e", "#e3c2ff", "#7dff3a"],
  ["#2b2b2b", "#000000", "#ff2d55", "#ff2d55"], ["#00f5c4", "#006a7a", "#c9fff3", "#ffe600"],
];
const FUNDOS = ["raios", "bolinhas", "listras", "xadrez", "explosao", "holofote"];
const LAYOUTS = ["topo", "base", "faixas"];
const POSES = ["bracos", "aponta", "rosto", "segura"];
const OLHOS = ["normal", "estrela", "fechado"];
const BOCAS = ["o", "sorriso", "riso", "nervoso"];
const ACESSORIOS = ["", "oculos", "bone", "fone", "coroa"];
const SELOS = ["etiqueta", "explosao", "preco", "carimbo"];
const SETAS = ["reta", "curva", "circulo"];

const PROPS = [ // palavras -> objeto
  [/whats|zap|celular|iphone|android|telefone|liga pra/, "celular"], [/playstation|nintendo|jogo|game|console|gamer|fps|oblivion|npc/, "controle"],
  [/\btv\b|televis/, "tv"], [/foto|c[âa]mera|imagem|sony/, "camera"], [/m[úu]sica|cantar|trilha|voz|[áa]udio/, "nota"],
  [/v[íi]deo|anima|desenho|3d|blender|edita|filme|cinema/, "claquete"], [/senha|segur|backdoor|falsa|hack|golpe|v[íi]rus/, "cadeado"],
  [/estud|aprend|livro|curso|aula|prova/, "livro"], [/internet|wi-?fi|4g|rede/, "wifi"], [/gr[áa]tis|caro|dinheiro|ipo|bilh|renda|pre[çc]o/, "dinheiro"],
  [/\bpc\b|windows|mac\b|computador|programa|linux|software|app/, "monitor"], [/mensagem|chat|prompt|claude|chatgpt|gemini|ia\b/, "balao"],
];

function prop(nome) {
  const S = 'stroke="#000" stroke-width="5" stroke-linejoin="round"';
  const d = {
    celular: `<rect x="25" y="5" width="50" height="90" rx="10" fill="#222" ${S}/><rect x="31" y="15" width="38" height="66" rx="3" fill="#5ce1ff"/><rect x="38" y="30" width="24" height="10" rx="5" fill="#25d366"/><rect x="38" y="46" width="18" height="10" rx="5" fill="#fff"/>`,
    controle: `<path d="M10 45 Q10 20 35 22 H65 Q90 20 90 45 Q92 80 75 78 Q65 76 60 62 H40 Q35 76 25 78 Q8 80 10 45Z" fill="#3b3b5c" ${S}/><path d="M24 44 h16 M32 36 v16" stroke="#fff" stroke-width="6"/><circle cx="66" cy="38" r="5" fill="#ff4b4b"/><circle cx="76" cy="48" r="5" fill="#7dff3a"/>`,
    tv: `<rect x="8" y="22" width="84" height="62" rx="8" fill="#6b4a2b" ${S}/><rect x="16" y="30" width="56" height="46" rx="6" fill="#9ff0ff"/><circle cx="82" cy="40" r="4" fill="#000"/><path d="M35 22 L25 5 M60 22 L72 5" ${S}/>`,
    camera: `<rect x="8" y="28" width="84" height="58" rx="8" fill="#333" ${S}/><rect x="30" y="18" width="30" height="14" fill="#333" ${S}/><circle cx="50" cy="57" r="20" fill="#5ce1ff" ${S}/><circle cx="50" cy="57" r="8" fill="#000"/>`,
    nota: `<path d="M38 20 L80 10 V64" fill="none" ${S} stroke-width="9"/><path d="M38 20 V74" ${S} stroke-width="9"/><ellipse cx="28" cy="76" rx="14" ry="11" fill="#ff3fa4" ${S}/><ellipse cx="70" cy="66" rx="14" ry="11" fill="#ff3fa4" ${S}/>`,
    claquete: `<rect x="10" y="38" width="80" height="50" rx="4" fill="#222" ${S}/><path d="M10 38 L86 18 L90 32 L14 52Z" fill="#fff" ${S}/><path d="M26 34 l8 12 M46 29 l8 12 M66 24 l8 12" stroke="#000" stroke-width="7"/>`,
    cadeado: `<path d="M30 45 V30 Q30 10 50 10 Q70 10 70 30 V45" fill="none" ${S} stroke-width="10"/><rect x="18" y="42" width="64" height="48" rx="8" fill="#ffcf1f" ${S}/><circle cx="50" cy="62" r="7" fill="#000"/><rect x="47" y="62" width="6" height="14" fill="#000"/>`,
    livro: `<path d="M10 20 Q30 12 50 22 Q70 12 90 20 V82 Q70 74 50 84 Q30 74 10 82Z" fill="#fff" ${S}/><path d="M50 22 V84" ${S}/><path d="M20 34 h20 M20 46 h20 M60 34 h20 M60 46 h20" stroke="#999" stroke-width="4"/>`,
    wifi: `<path d="M10 40 Q50 5 90 40" fill="none" ${S} stroke-width="10"/><path d="M24 54 Q50 30 76 54" fill="none" ${S} stroke-width="10"/><circle cx="50" cy="72" r="9" fill="#000"/>`,
    dinheiro: `<path d="M30 30 Q20 92 50 92 Q80 92 70 30Z" fill="#2fbf4f" ${S}/><path d="M35 30 L42 14 H58 L65 30" fill="#2fbf4f" ${S}/><text x="50" y="76" font-size="34" text-anchor="middle" font-family="Archivo" fill="#fff" stroke="#000" stroke-width="3" paint-order="stroke">$</text>`,
    monitor: `<rect x="6" y="12" width="88" height="58" rx="6" fill="#222" ${S}/><rect x="13" y="19" width="74" height="44" fill="#3a7bff"/><path d="M40 70 L34 88 H66 L60 70" fill="#555" ${S}/><path d="M20 30 h30 M20 40 h44 M20 50 h22" stroke="#fff" stroke-width="5"/>`,
    balao: `<path d="M10 20 Q10 8 22 8 H78 Q90 8 90 20 V56 Q90 68 78 68 H40 L22 86 V68 Q10 68 10 56Z" fill="#fff" ${S}/><circle cx="32" cy="38" r="6"/><circle cx="50" cy="38" r="6"/><circle cx="68" cy="38" r="6"/>`,
    raio: `<path d="M58 4 L20 54 H46 L36 96 L80 38 H54Z" fill="#ffe600" ${S}/>`,
  }[nome] || "";
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${d}</svg>`;
}

// Personagens: o bloquinho laranja do manual e outros bonecos de tecnologia originais (nenhum logo ou personagem de marca).
// Cada um desenha o próprio corpo e diz onde fica a "cabeça" (caixa onde entram olhos, boca e acessório).
const PERSONAGENS = {
  clawd: { cabeca: [30, 20, 140, 124], braco: ["#c8653f", "#9e4626", "#2a1208"], olho: "#111", ombro: 0,
    corpo: `<g fill="url(#l)" stroke="#2a1208" stroke-width="5"><rect x="48" y="138" width="20" height="42" rx="4"/><rect x="76" y="138" width="20" height="42" rx="4"/><rect x="104" y="138" width="20" height="42" rx="4"/><rect x="132" y="138" width="20" height="42" rx="4"/></g>
<rect x="30" y="20" width="140" height="124" rx="18" fill="url(#c)" stroke="#2a1208" stroke-width="6"/><rect x="42" y="28" width="116" height="16" rx="8" fill="#fff" opacity=".25"/>`,
    grad: ["#e58a60", "#b8532f"] },
  robo: { cabeca: [46, 12, 108, 88], braco: ["#c9d3e0", "#8794a8", "#1d2635"], olho: "#5ce1ff", ombro: 4,
    corpo: `<g stroke="#1d2635" stroke-width="5"><rect x="70" y="146" width="20" height="36" rx="4" fill="#8794a8"/><rect x="110" y="146" width="20" height="36" rx="4" fill="#8794a8"/>
<rect x="62" y="108" width="76" height="44" rx="8" fill="url(#c)"/><circle cx="100" cy="130" r="8" fill="#ff4b4b"/>
<path d="M100 0 V-20" stroke-width="6"/><circle cx="100" cy="-24" r="8" fill="#ff4b4b"/>
<rect x="34" y="0" width="132" height="112" rx="16" fill="url(#c)"/><rect x="22" y="40" width="14" height="30" rx="4" fill="#8794a8"/><rect x="164" y="40" width="14" height="30" rx="4" fill="#8794a8"/></g>
<rect x="46" y="12" width="108" height="88" rx="10" fill="#13233a" stroke="#1d2635" stroke-width="4"/>`, grad: ["#e6edf6", "#9aa7bb"] },
  celular: { cabeca: [58, 6, 84, 112], braco: ["#3a3a46", "#22222a", "#000"], olho: "#fff", ombro: 18,
    corpo: `<g stroke="#000" stroke-width="5"><rect x="74" y="160" width="18" height="24" rx="4" fill="#22222a"/><rect x="108" y="160" width="18" height="24" rx="4" fill="#22222a"/>
<rect x="52" y="-22" width="96" height="186" rx="20" fill="#22222a"/></g><rect x="60" y="-8" width="80" height="160" rx="10" fill="url(#c)"/>
<rect x="86" y="-16" width="28" height="6" rx="3" fill="#000"/>`, grad: ["#4f8bff", "#7b3dff"] },
  notebook: { cabeca: [42, 8, 116, 96], braco: ["#c3cad6", "#8b94a3", "#1d2635"], olho: "#5ce1ff", ombro: 8,
    corpo: `<g stroke="#1d2635" stroke-width="5"><rect x="66" y="132" width="18" height="50" rx="4" fill="#8b94a3"/><rect x="116" y="132" width="18" height="50" rx="4" fill="#8b94a3"/>
<rect x="30" y="-4" width="140" height="120" rx="12" fill="url(#c)"/><path d="M14 116 H186 L176 138 H24Z" fill="#aab3c2"/></g>
<rect x="42" y="8" width="116" height="96" rx="6" fill="#16223a"/><path d="M84 124 h32" stroke="#1d2635" stroke-width="4"/>`, grad: ["#dfe5ee", "#a9b2c0"] },
  nuvem: { cabeca: [40, 34, 120, 108], braco: ["#cfe6ff", "#8db8ea", "#173a66"], olho: "#111", ombro: 0,
    corpo: `<g stroke="#173a66" stroke-width="5"><rect x="74" y="140" width="18" height="42" rx="4" fill="#8db8ea"/><rect x="108" y="140" width="18" height="42" rx="4" fill="#8db8ea"/>
<path d="M40 150 Q8 150 10 118 Q12 92 40 92 Q38 48 82 44 Q104 8 140 30 Q176 30 176 72 Q198 84 192 114 Q188 150 156 150Z" fill="url(#c)"/></g>`, grad: ["#ffffff", "#bcd9ff"] },
  balao: { cabeca: [40, 18, 120, 108], braco: ["#8f78ff", "#5a3be0", "#1c0b5c"], olho: "#fff", ombro: 2,
    corpo: `<g stroke="#1c0b5c" stroke-width="6"><path d="M60 138 L40 178 L92 140Z" fill="#5a3be0"/><rect x="28" y="6" width="144" height="136" rx="44" fill="url(#c)"/></g>
<circle cx="180" cy="-6" r="7" fill="#ffe600"/><circle cx="196" cy="12" r="4" fill="#ffe600"/>`, grad: ["#9b85ff", "#4f2fd6"] },
  chip: { cabeca: [48, 34, 104, 100], braco: ["#ffd25a", "#c99a1c", "#4a3500"], olho: "#fff", ombro: 6,
    corpo: `<g fill="#ffd25a" stroke="#4a3500" stroke-width="4">${[0, 1, 2, 3].map((i) => `<rect x="${58 + i * 24}" y="8" width="12" height="20"/><rect x="${58 + i * 24}" y="146" width="12" height="36"/>`).join("")}</g>
<rect x="40" y="24" width="120" height="124" rx="12" fill="url(#c)" stroke="#06331c" stroke-width="6"/><rect x="50" y="34" width="100" height="104" rx="6" fill="none" stroke="#7dffb0" stroke-width="2" opacity=".5"/>`,
    grad: ["#2bbf6a", "#0b6b3a"] },
};

function mascote(e) {
  const P = PERSONAGENS[e.personagem] || PERSONAGENS.clawd;
  const [hx, hy, hw] = P.cabeca;
  const s = hw / 140;
  const rosto = `translate(${(hx - 30 * s).toFixed(1)} ${(hy - 20 * s).toFixed(1)}) scale(${s.toFixed(3)})`;
  const tela = P.olho !== "#111"; // personagens de tela: olhos e boca claros
  const braco = (x, y, ang) => `<rect x="${x - 13}" y="${y - 52}" width="26" height="56" rx="7" transform="rotate(${ang} ${x} ${y})"/>`;
  const o = P.ombro;
  const atras = { bracos: braco(36 + o, 60, -40) + braco(164 - o, 60, 40), aponta: braco(36 + o, 60, -40) + braco(168 - o, 84, 75), rosto: "", segura: "" }[e.pose];
  const frente = e.pose === "rosto" ? braco(40, 150, 28) + braco(160, 150, -28)
    : e.pose === "segura" ? `<rect x="22" y="128" width="58" height="24" rx="8" transform="rotate(-25 30 140)"/><rect x="120" y="128" width="58" height="24" rx="8" transform="rotate(25 170 140)"/>` : "";
  const cor = P.olho;
  const olho = (x) => e.olhos === "estrela"
    ? `<path transform="translate(${x + 9} 72) scale(1.25)" d="M0 -14 L4 -4 L14 -4 L6 3 L9 13 L0 7 L-9 13 L-6 3 L-14 -4 L-4 -4Z" fill="#ffe600" stroke="#000" stroke-width="3"/>`
    : e.olhos === "fechado" ? `<path d="M${x - 2} 74 l12 -8 l12 8" fill="none" stroke="${cor}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<rect x="${x}" y="52" width="18" height="42" rx="3" fill="${cor}"/><rect x="${x + 3}" y="55" width="6" height="9" fill="${tela ? "#13233a" : "#fff"}"/>`;
  const boca = { o: `<ellipse cx="100" cy="118" rx="14" ry="17" fill="${tela ? cor : "#111"}"/><ellipse cx="100" cy="126" rx="8" ry="6" fill="#e24a4a"/>`,
    sorriso: `<path d="M80 110 Q100 128 120 110" fill="none" stroke="${cor}" stroke-width="7" stroke-linecap="round"/>`,
    riso: `<path d="M78 106 H122 Q118 134 100 134 Q82 134 78 106Z" fill="${tela ? cor : "#111"}"/><path d="M84 106 H116 V114 H84Z" fill="${tela ? "#13233a" : "#fff"}"/>`,
    nervoso: `<path d="M78 118 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l6 4" fill="none" stroke="${cor}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` }[e.boca];
  const acessorio = tela && e.acessorio === "oculos" ? "bone" : e.acessorio; // óculos escuros somem numa tela escura
  const acc = { "": "",
    oculos: '<path d="M52 62 H148 V70 H52Z" fill="#111"/><rect x="56" y="58" width="40" height="28" rx="8" fill="#111"/><rect x="104" y="58" width="40" height="28" rx="8" fill="#111"/><path d="M62 64 l10 0" stroke="#fff" stroke-width="4"/>',
    bone: '<path d="M38 30 Q40 -6 100 -6 Q160 -6 162 30Z" fill="#ff3b3b" stroke="#2a1208" stroke-width="5"/><path d="M150 26 Q190 22 200 34 L156 36Z" fill="#ff3b3b" stroke="#2a1208" stroke-width="5"/><circle cx="100" cy="-6" r="6" fill="#ff3b3b" stroke="#2a1208" stroke-width="4"/>',
    fone: '<path d="M26 70 Q26 -10 100 -10 Q174 -10 174 70" fill="none" stroke="#222" stroke-width="10"/><rect x="14" y="58" width="24" height="40" rx="8" fill="#5ce1ff" stroke="#000" stroke-width="5"/><rect x="162" y="58" width="24" height="40" rx="8" fill="#5ce1ff" stroke="#000" stroke-width="5"/>',
    coroa: '<path d="M60 22 L64 -12 L82 8 L100 -18 L118 8 L136 -12 L140 22Z" fill="#ffd21f" stroke="#7a5200" stroke-width="5"/><circle cx="100" cy="6" r="6" fill="#ff3fa4"/>' }[acessorio];
  const pingos = e.boca === "nervoso" || e.pose === "rosto"
    ? '<path d="M178 6 q9 15 0 21 q-9 -6 0 -21z" fill="#5fd3ff" stroke="#0a3b55" stroke-width="2"/><path d="M14 30 q7 12 0 17 q-7 -5 0 -17z" fill="#5fd3ff" stroke="#0a3b55" stroke-width="2"/>' : "";
  const [b1, b2, bs] = P.braco;
  const id = e.personagem || "clawd"; // ids únicos por personagem
  const corpo = P.corpo.replace(/url\(#c\)/g, `url(#c-${id})`).replace(/url\(#l\)/g, `url(#l-${id})`);
  return `<svg viewBox="-12 -40 224 240" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="c-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.grad[0]}"/><stop offset="1" stop-color="${P.grad[1]}"/></linearGradient>
<linearGradient id="l-${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${b1}"/><stop offset="1" stop-color="${b2}"/></linearGradient></defs>
<ellipse cx="100" cy="186" rx="80" ry="10" fill="#0005"/>
<g fill="url(#l-${id})" stroke="${bs}" stroke-width="5">${atras}</g>
${corpo}
<g transform="${rosto}">${acessorio === "oculos" ? "" : olho(66) + olho(116)}${boca}${acc}</g>${pingos}
<g fill="url(#l-${id})" stroke="${bs}" stroke-width="5" transform="${rosto}">${frente}</g></svg>`;
}

function fundo(tipo, [c1, c2, c3]) {
  const base = `radial-gradient(circle at 50% 60%,${c1} 0,${c2} 78%)`;
  return {
    raios: `repeating-conic-gradient(from 0deg at 50% 60%,${c3}55 0 9deg,transparent 9deg 22deg),${base}`,
    bolinhas: `radial-gradient(${c3}66 22%,transparent 24%) 0 0/18px 18px,${base}`,
    listras: `repeating-linear-gradient(-35deg,${c3}40 0 16px,transparent 16px 40px),${base}`,
    xadrez: `conic-gradient(${c3}33 25%,transparent 0 50%,${c3}33 0 75%,transparent 0) 0 0/44px 44px,${base}`,
    explosao: `repeating-conic-gradient(from 5deg at 50% 45%,${c3}70 0 5deg,transparent 5deg 12deg),radial-gradient(circle at 50% 45%,#fff8 0,transparent 35%),${base}`,
    holofote: `radial-gradient(ellipse 60% 45% at 50% 62%,${c3}aa 0,transparent 70%),linear-gradient(${c2},${c1})`,
  }[tipo];
}

function selo(tipo, txt) {
  if (!txt) return "";
  if (tipo === "explosao" && txt.length > 8) tipo = "etiqueta"; // a explosão só comporta texto curto
  const s = { etiqueta: "background:#ff1a1a;color:#fff;border:4px solid #fff;border-radius:12px;padding:7px 12px;transform:rotate(7deg)",
    explosao: "background:#ffe600;color:#000;clip-path:polygon(50% 0,61% 18%,82% 8%,80% 30%,100% 38%,84% 54%,96% 74%,74% 76%,68% 98%,50% 84%,32% 98%,26% 76%,4% 74%,16% 54%,0 38%,20% 30%,18% 8%,39% 18%);padding:30px 22px;transform:rotate(-8deg)",
    preco: "background:#1f6bff;color:#fff;border:4px solid #fff;border-radius:6px 22px 22px 6px;padding:7px 14px 7px 18px;transform:rotate(-6deg)",
    carimbo: "background:#fff;color:#e3001b;border:5px solid #e3001b;border-radius:8px;padding:5px 10px;transform:rotate(-12deg);outline:3px solid #e3001b;outline-offset:3px" }[tipo];
  return `<div class="selo" style="${s}">${esc(txt)}</div>`;
}

function seta(tipo) {
  if (tipo === "curva") return '<svg class="seta" viewBox="0 0 120 120"><path d="M110 10 Q20 10 30 92" fill="none" stroke="#000" stroke-width="18" stroke-linecap="round"/><path d="M110 10 Q20 10 30 92" fill="none" stroke="#ffe600" stroke-width="10" stroke-linecap="round"/><path d="M8 78 L30 112 L52 80Z" fill="#ffe600" stroke="#000" stroke-width="5" stroke-linejoin="round"/></svg>';
  if (tipo === "circulo") return "";
  return '<svg class="seta" viewBox="-4 -4 108 58"><path d="M2 14 H62 V0 L98 25 L62 50 V36 H2 Z" fill="#ff1a1a" stroke="#fff" stroke-width="5" stroke-linejoin="round"/></svg>';
}

// ---------------------------------------------------------------- texto de cada post
function limpar(t) {
  return String(t || "").replace(/<[^>]+>/g, " ").replace(/[\u{1F000}-\u{1FFFF}☀-➿️]/gu, "").replace(/\s+/g, " ").trim();
}
const SOLTAS = new Set(["com", "um", "uma", "de", "da", "do", "das", "dos", "no", "na", "nos", "nas", "que", "e", "a", "o", "as", "os", "pra", "para", "em", "por", "sem", "ao"]);
function curto(t, max = 12) {
  let f = limpar(t).split(/(?<=[.!?:])\s/)[0].replace(/[.!:]$/, "");
  if (f.split(" ").length > 8) f = f.replace(/,\s[^,]{3,40},\s/, " "); // tira o aposto: "A Anthropic, criadora do Claude, pediu" -> "A Anthropic pediu"
  let w = f.split(" ");
  if (w.length > max) w = w.slice(0, max);
  while (w.length > 3 && SOLTAS.has(w[w.length - 1].toLowerCase().replace(/[,;]$/, ""))) w.pop();
  return w.join(" ").replace(/[,;]$/, "");
}
function dados(pasta) {
  const d = path.join(POSTS, pasta);
  const rot = ler(path.join(d, "roteiro.json")) || {}, meta = ler(path.join(d, "meta.json")) || {}, post = ler(path.join(d, "post.json")) || {};
  const capa = rot.capa || meta.capa || {};
  const et = ((rot.segmentos || [])[0] || {}).etiqueta || [];
  const irma = path.join(POSTS, pasta.replace(/-p\d+$/, ""));
  const legenda = [d, irma].map((x) => lerTxt(path.join(x, "legenda_reel_instagram.txt")) || lerTxt(path.join(x, "legenda_instagram.txt"))).find(Boolean) || "";
  const cands = [capa.texto, et[0], post.cover && post.cover.title_html, (rot.tese || "").split("·")[0], legenda, ((rot.segmentos || [])[0] || {}).fala];
  const texto = curto(cands.find((c) => limpar(c).split(" ").length >= 3) || pasta.slice(11).replace(/-/g, " ")).toUpperCase();
  const tudo = (texto + " " + limpar(legenda) + " " + (meta.temas || []).join(" ") + " " + pasta).toLowerCase();
  let num = capa.selo || (et[1] || "").replace(/\s+ESTRELAS.*$/i, " ★").replace(/^NOVIDADE.*/i, "NOVO!");
  if (!num) {
    const m = tudo.match(/\+\s?(\d[\d.,]*)\s?mil/) || tudo.match(/(\d+)\s?%/) || tudo.match(/us\$\s?([\d.,]+)\s?bi/);
    num = m ? (m[0].includes("%") ? m[1] + "%" : m[0].startsWith("us") ? "US$ " + m[1] + " BI" : "+" + m[1] + " MIL") : "";
    if (!num) num = /^\d+\s(?!DE\s|EM\s|A\s)/.test(texto) ? "TOP " + texto.split(" ")[0] : { novidade: "NOVO!", em_alta: "EM ALTA", tutorial: "PASSO A PASSO", recomendacao: "DICA" }[meta.pilar] || "";
  }
  const isca = (capa.isca || et[2] || (meta.cta || rot.chave ? "COMENTA " + (meta.cta || rot.chave) : "IA EM 60S")).toUpperCase();
  const objeto = (PROPS.find(([re]) => re.test(tudo)) || [0, "raio"])[1];
  return { texto, destaque: (capa.destaque || "").toUpperCase(), num: String(num).toUpperCase(), isca, objeto };
}

// ---------------------------------------------------------------- página
function pagina(info, e, ig = false) {
  const fonte = FONTES[e.fonte];
  const txt = info.texto.replace(/-/g, "‑");
  const palavras = txt.split(" ");
  const dest = info.destaque || palavras.slice(-2).join(" ");
  const corpo = txt.endsWith(dest) ? txt.slice(0, txt.length - dest.length).trim() : txt;
  const P = e.paleta;
  const L = {
    topo: { txt: "top:22px;left:12px;right:12px;height:170px;transform:rotate(-3deg)", selo: "right:10px;top:196px", masc: "left:-12px;bottom:46px;width:226px",
      prop: "right:8px;bottom:70px;width:96px;transform:rotate(10deg)", seta: "left:178px;top:250px;width:70px;transform:rotate(200deg)" },
    base: { txt: "left:12px;right:12px;bottom:52px;height:150px;transform:rotate(-2deg)", selo: "left:10px;top:16px", masc: "right:-4px;top:36px;width:186px",
      prop: "left:14px;top:120px;width:92px;transform:rotate(-12deg)", seta: "left:92px;top:96px;width:60px;transform:rotate(-20deg) scaleX(-1)" },
    faixas: { txt: "top:16px;left:0;right:0;height:120px", selo: "right:8px;top:150px", masc: "left:4px;bottom:50px;width:216px",
      prop: "right:6px;bottom:62px;width:84px;transform:rotate(8deg)", seta: "left:10px;top:150px;width:64px;transform:rotate(70deg)" },
  }[e.layout];
  const titulo = e.layout === "faixas"
    ? `<span class="fx1">${esc(corpo)}</span><span class="fx2">${esc(dest)}</span>`
    : `${esc(corpo)}<b>${esc(dest)}</b>`;
  const circulo = e.seta === "circulo" ? `<svg class="circ" viewBox="0 0 120 100" style="position:absolute;${L.prop.replace(/width:\d+px/, "width:130px").replace(/(right|left):(\d+)px/, (m, k, v) => `${k}:${Math.max(0, v - 17)}px`)};margin:-14px 0">
<ellipse cx="60" cy="50" rx="54" ry="42" fill="none" stroke="#ff1a1a" stroke-width="7" transform="rotate(-8 60 50)"/></svg>` : "";
  return `<html><head><style>
@font-face{font-family:${fonte.nome};src:url(${fonte.url});font-weight:${fonte.peso}}
@font-face{font-family:Archivo;src:url(${FONTES[0].url})}
*{box-sizing:border-box}body{margin:0;width:270px;height:480px;overflow:hidden;position:relative;background:${fundo(e.fundo, P)}}
.q{position:absolute;inset:0}${ig ? ".q{inset:auto;left:33.75px;top:60px;width:270px;height:480px;transform:scale(.75);transform-origin:0 0}" : ""}
.t{position:absolute;${L.txt};font-family:${fonte.nome};font-weight:${fonte.peso};line-height:${fonte.nome === "Bebas" ? 0.9 : 0.98};color:#fff;
 -webkit-text-stroke:7px #000;paint-order:stroke fill;text-shadow:0 5px 0 #000;word-break:keep-all;display:flex;flex-direction:column;justify-content:${e.layout === "base" ? "flex-end" : "flex-start"}}
.t b{color:${P[3]};font-weight:inherit}
.fx1,.fx2{display:block;align-self:flex-start;padding:4px 10px;-webkit-text-stroke:0;text-shadow:none}
.fx1{background:#fff;color:#000;transform:rotate(-3deg);margin-left:8px}.fx2{background:${P[3] === "#ffffff" ? "#ffe600" : P[3]};color:#000;transform:rotate(2deg);margin:6px 0 0 18px}
.selo{position:absolute;${L.selo};font-family:Archivo;font-size:22px;line-height:1;white-space:nowrap;box-shadow:0 5px 0 #0009;z-index:3}
.m{position:absolute;${L.masc};filter:drop-shadow(0 6px 0 #0006);z-index:1}
.p{position:absolute;${L.prop};filter:drop-shadow(0 5px 0 #0007);z-index:${e.pose === "segura" ? 2 : 1}}
.pm{position:absolute;left:50%;top:97%;width:33%;transform:translate(-50%,-50%) rotate(-6deg);filter:drop-shadow(0 5px 0 #0007)}
.seta{position:absolute;${L.seta};z-index:3;filter:drop-shadow(0 4px 0 #0008)}.circ{z-index:2}
.isca{position:absolute;left:0;right:0;bottom:0;background:#000;color:#ffe600;font-family:Archivo;font-size:13px;padding:10px 12px 12px;text-align:center;z-index:4}
</style></head><body><div class="q">
<div class="m">${mascote(e)}${e.pose === "segura" ? `<div class="pm">${prop(info.objeto)}</div>` : ""}</div>${e.pose === "segura" ? "" : `<div class="p">${prop(info.objeto)}</div>${circulo}`}${seta(e.seta)}
<div class="t">${titulo}</div>${selo(e.selo, info.num)}<div class="isca">${esc(info.isca)}</div>
</div></body></html>`;
}

// capas vizinhas (por data) nunca repetem um elemento: cada eixo anda com passo próprio
function elementos(i) {
  const eixo = (lista, passo, desl = 0) => lista[(i * passo + desl) % lista.length];
  return { personagem: eixo(Object.keys(PERSONAGENS), 4, 3), layout: eixo(LAYOUTS, 1), fundo: eixo(FUNDOS, 5, 2), paleta: eixo(PALETAS, 3, 1), pose: eixo(POSES, 3),
    olhos: eixo(OLHOS, 2, 1), boca: eixo(BOCAS, 1, 2), acessorio: eixo(ACESSORIOS, 2), selo: eixo(SELOS, 3, 1),
    seta: eixo(SETAS, 2, 2), fonte: (i * 2 + 1) % FONTES.length };
}

(async () => {
  fs.mkdirSync(CAPAS, { recursive: true });
  const pastas = fs.readdirSync(POSTS).filter((p) => !p.startsWith("_") && /^\d{4}-/.test(p) && fs.statSync(path.join(POSTS, p)).isDirectory()).sort();
  const alvo = pastas.map((p, i) => [p, i]).filter(([p]) => IG ? IG.split(",").includes(p) : TODAS || !fs.existsSync(path.join(CAPAS, `thumb-${p}.jpg`)));
  if (!alvo.length) return console.log("capas: nada a fazer");
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 270, height: 480 }, deviceScaleFactor: IG ? 4 : 2 });
  for (const [p, i] of alvo) {
    await pg.setContent(pagina(dados(p), elementos(i), !!IG), { waitUntil: "load" });
    await pg.evaluate(async () => {
      await document.fonts.ready;
      const t = document.querySelector(".t");
      let f = 44; t.style.fontSize = f + "px";
      const cabe = () => t.scrollHeight <= t.clientHeight + 1 && [...t.querySelectorAll("*"), t].every((x) => x.scrollWidth <= t.clientWidth + 2);
      while (f > 15 && !cabe()) { f -= 1; t.style.fontSize = f + "px"; }
    });
    const saida = IG ? path.join(POSTS, p, "capa_instagram.jpg") : path.join(CAPAS, `thumb-${p}.jpg`);
    await pg.screenshot({ path: saida, type: "jpeg", quality: IG ? 88 : 72 });
  }
  await b.close();
  console.log(`capas: ${alvo.length} criada(s)`);
})();

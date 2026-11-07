// Worker "painel-iaem60s": serve o painel do IA em 60s (ia/painel/ do ramo midia-ia) como app no celular.
// Lê os arquivos direto do GitHub a cada acesso (cache de 2 min), então todo commit no painel já aparece no app.
const BASE = "https://raw.githubusercontent.com/lanceseternosedits-maker/lances-eternos-estudio/midia-ia/ia/painel/";
const TIPOS = { html: "text/html; charset=utf-8", json: "application/manifest+json", png: "image/png", jpg: "image/jpeg" };

export default {
  async fetch(req) {
    const url = new URL(req.url);
    let caminho = url.pathname.replace(/^\/+/, "") || "index.html";
    if (!/^(index\.html|manifest\.json|icone-(180|512)\.png|capas\/[\w.-]+\.jpg)$/.test(caminho)) {
      return new Response("não encontrado", { status: 404 });
    }
    const r = await fetch(BASE + caminho, { cf: { cacheTtl: 120, cacheEverything: true } });
    if (!r.ok) return new Response("painel indisponível (" + r.status + ")", { status: 502 });
    const ext = caminho.split(".").pop();
    return new Response(r.body, {
      headers: { "content-type": TIPOS[ext], "cache-control": ext === "html" ? "no-cache" : "public, max-age=3600" },
    });
  },
};

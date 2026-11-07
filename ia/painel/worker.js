// Worker "painel-iaem60s": serve o painel do IA em 60s (ia/painel/ do ramo midia-ia) como app no celular
// e grava as decisões do Vitor (aprovar/negar) no D1 "iaem60s-painel" (binding DB), protegidas por PIN (secret PIN).
// Os arquivos vêm do GitHub a cada acesso (cache de 2 min), então todo commit no painel já aparece no app.
const BASE = "https://raw.githubusercontent.com/lanceseternosedits-maker/lances-eternos-estudio/midia-ia/ia/painel/";
const TIPOS = { html: "text/html; charset=utf-8", json: "application/manifest+json", png: "image/png", jpg: "image/jpeg" };
const json = (dados, status = 200) =>
  new Response(JSON.stringify(dados), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

async function api(req, env, rota) {
  if (rota === "decisoes" && req.method === "GET") {
    const { results } = await env.DB.prepare("SELECT pasta, etapa, decisao, nota, em, aplicada FROM decisoes").all();
    return json(Object.fromEntries(results.map((r) => [r.pasta, r])));
  }
  if (rota === "decisao" && req.method === "POST") {
    if (!env.PIN || req.headers.get("x-pin") !== env.PIN) return json({ erro: "pin" }, 401);
    let b;
    try { b = await req.json(); } catch { return json({ erro: "json" }, 400); }
    const pasta = String(b.pasta || ""), etapa = String(b.etapa || ""), decisao = String(b.decisao || "");
    if (!/^\d{4}-\d{2}-\d{2}-[\w-]{1,80}$/.test(pasta) || !["roteiro", "vídeo"].includes(etapa)) return json({ erro: "dados" }, 400);
    if (decisao === "desfazer") {
      await env.DB.prepare("DELETE FROM decisoes WHERE pasta = ?").bind(pasta).run();
      return json({ ok: true });
    }
    if (!["aprovado", "negado"].includes(decisao)) return json({ erro: "decisao" }, 400);
    const em = new Date().toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" }).slice(0, 16);
    await env.DB.prepare(
      "INSERT INTO decisoes (pasta, etapa, decisao, nota, em, aplicada) VALUES (?, ?, ?, ?, ?, 0) " +
      "ON CONFLICT(pasta) DO UPDATE SET etapa = excluded.etapa, decisao = excluded.decisao, nota = excluded.nota, em = excluded.em, aplicada = 0"
    ).bind(pasta, etapa, decisao, String(b.nota || "").slice(0, 300), em).run();
    return json({ ok: true, em });
  }
  return json({ erro: "rota" }, 404);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const caminho = url.pathname.replace(/^\/+/, "") || "index.html";
    if (caminho.startsWith("api/")) return api(req, env, caminho.slice(4));
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

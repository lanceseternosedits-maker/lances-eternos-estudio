// Worker "painel-iaem60s": serve o painel do IA em 60s (ia/painel/ do ramo midia-ia) como app no celular,
// grava as decisões do Vitor (aprovar/negar) no D1 "iaem60s-painel" (binding DB). Sem PIN (Vitor, 07/11).
// Notificações (Vitor, 07/11: "o app precisa me mandar notificação quando tiver vídeo pra aprovação"):
// Web Push padrão (VAPID + aes128gcm, RFC 8291/8292). A cada 5 min (cron) lê painel/pendentes.json e avisa
// cada vídeo novo em "vídeo aguardando aprovação". Segredo VAPID_PRIVADA (JWK) e VAPID_PUBLICA ficam só no Worker.
const BASE = "https://raw.githubusercontent.com/lanceseternosedits-maker/lances-eternos-estudio/midia-ia/ia/painel/";
const SITE = "https://painel-iaem60s.vgofredousa.workers.dev";
const TIPOS = { html: "text/html; charset=utf-8", json: "application/manifest+json", png: "image/png", jpg: "image/jpeg" };
const json = (dados, status = 200) =>
  new Response(JSON.stringify(dados), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const agoraBR = () => new Date().toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" }).slice(0, 16);

// service worker do app: mostra a notificação e abre o painel ao tocar
const SW = `self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('push', (e) => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { corpo: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'IA em 60s', {
    body: d.corpo || 'Tem vídeo esperando sua aprovação.', icon: '/icone-180.png', badge: '/icone-180.png',
    tag: d.tag || 'iaem60s', data: { url: d.url || '/' } }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then((cs) => {
    for (const c of cs) { if ('focus' in c) { c.navigate(e.notification.data.url); return c.focus(); } }
    return self.clients.openWindow(e.notification.data.url);
  }));
});`;

// ---------------------------------------------------------------- Web Push (RFC 8291 + VAPID)
const b64u = {
  enc: (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  dec: (s) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), (c) => c.charCodeAt(0)),
};
const junta = (...partes) => {
  const out = new Uint8Array(partes.reduce((n, p) => n + p.length, 0));
  let i = 0;
  for (const p of partes) { out.set(p, i); i += p.length; }
  return out;
};
const txt = (s) => new TextEncoder().encode(s);

async function hkdf(salt, ikm, info, tamanho) {
  const k = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, k, tamanho * 8));
}

export async function cifrar(payload, p256dh, auth) {
  const uaPub = b64u.dec(p256dh), segredo = b64u.dec(auth);
  const par = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const asPub = new Uint8Array(await crypto.subtle.exportKey("raw", par.publicKey));
  const uaKey = await crypto.subtle.importKey("raw", uaPub, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const compartilhado = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: uaKey }, par.privateKey, 256));
  const ikm = await hkdf(segredo, compartilhado, junta(txt("WebPush: info\0"), uaPub, asPub), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, txt("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(salt, ikm, txt("Content-Encoding: nonce\0"), 12);
  const chave = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const cifrado = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, chave, junta(txt(payload), new Uint8Array([2]))));
  const rs = new Uint8Array([0, 0, 16, 0]); // 4096
  return junta(salt, rs, new Uint8Array([asPub.length]), asPub, cifrado);
}

export async function vapid(endpoint, env) {
  const aud = new URL(endpoint).origin;
  const cab = b64u.enc(txt(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const corpo = b64u.enc(txt(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: SITE })));
  const chave = await crypto.subtle.importKey("jwk", JSON.parse(env.VAPID_PRIVADA), { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const ass = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, chave, txt(`${cab}.${corpo}`));
  return `vapid t=${cab}.${corpo}.${b64u.enc(ass)}, k=${env.VAPID_PUBLICA}`;
}

async function enviar(env, insc, msg) {
  const corpo = await cifrar(JSON.stringify(msg), insc.p256dh, insc.auth);
  const r = await fetch(insc.endpoint, { method: "POST", body: corpo, headers: {
    Authorization: await vapid(insc.endpoint, env), "Content-Encoding": "aes128gcm", "Content-Type": "application/octet-stream",
    TTL: "86400", Urgency: "high" } });
  if (r.status === 404 || r.status === 410) await env.DB.prepare("DELETE FROM inscricoes WHERE endpoint = ?").bind(insc.endpoint).run();
  return r.status;
}

async function avisarTodos(env, msg) {
  const { results } = await env.DB.prepare("SELECT endpoint, p256dh, auth FROM inscricoes").all();
  return Promise.all(results.map((i) => enviar(env, i, msg).catch((e) => "erro: " + e.message)));
}

// confere os vídeos aguardando aprovação e avisa os novos
async function conferir(env) {
  const r = await fetch(BASE + "pendentes.json?t=" + Date.now(), { cf: { cacheTtl: 0 } });
  if (!r.ok) return;
  const { videos = [] } = await r.json();
  const { results } = await env.DB.prepare("SELECT pasta FROM notificados").all();
  const ja = new Set(results.map((x) => x.pasta));
  const novos = videos.filter((v) => !ja.has(v.pasta));
  if (!novos.length) return;
  const titulo = novos.length === 1 ? "🎬 Vídeo pra aprovar" : `🎬 ${novos.length} vídeos pra aprovar`;
  const corpo = novos.slice(0, 3).map((v) => `${v.quando ? v.quando.slice(8, 10) + "/" + v.quando.slice(5, 7) + " " + v.quando.slice(11) + " · " : ""}${v.titulo}`).join("\n");
  await avisarTodos(env, { titulo, corpo, url: "/#pendentes", tag: "video-" + novos[0].pasta });
  for (const v of novos) await env.DB.prepare("INSERT OR IGNORE INTO notificados (pasta, em) VALUES (?, ?)").bind(v.pasta, agoraBR()).run();
}

// ---------------------------------------------------------------- API
async function api(req, env, rota) {
  if (rota === "decisoes" && req.method === "GET") {
    const { results } = await env.DB.prepare("SELECT pasta, etapa, decisao, nota, em, aplicada FROM decisoes").all();
    return json(Object.fromEntries(results.map((r) => [r.pasta, r])));
  }
  if (rota === "decisao" && req.method === "POST") {
    let b;
    try { b = await req.json(); } catch { return json({ erro: "json" }, 400); }
    const pasta = String(b.pasta || ""), etapa = String(b.etapa || ""), decisao = String(b.decisao || "");
    if (!/^\d{4}-\d{2}-\d{2}-[\w-]{1,80}$/.test(pasta) || !["roteiro", "vídeo"].includes(etapa)) return json({ erro: "dados" }, 400);
    if (decisao === "desfazer") {
      await env.DB.prepare("DELETE FROM decisoes WHERE pasta = ?").bind(pasta).run();
      return json({ ok: true });
    }
    if (!["aprovado", "negado"].includes(decisao)) return json({ erro: "decisao" }, 400);
    const em = agoraBR();
    await env.DB.prepare(
      "INSERT INTO decisoes (pasta, etapa, decisao, nota, em, aplicada) VALUES (?, ?, ?, ?, ?, 0) " +
      "ON CONFLICT(pasta) DO UPDATE SET etapa = excluded.etapa, decisao = excluded.decisao, nota = excluded.nota, em = excluded.em, aplicada = 0"
    ).bind(pasta, etapa, decisao, String(b.nota || "").slice(0, 300), em).run();
    return json({ ok: true, em });
  }
  if (rota === "vapid" && req.method === "GET") return json({ chave: env.VAPID_PUBLICA });
  if (rota === "inscrever" && req.method === "POST") {
    let s;
    try { s = await req.json(); } catch { return json({ erro: "json" }, 400); }
    const ep = String(s.endpoint || ""), k = s.keys || {};
    if (!/^https:\/\//.test(ep) || !k.p256dh || !k.auth) return json({ erro: "inscricao" }, 400);
    await env.DB.prepare("INSERT OR REPLACE INTO inscricoes (endpoint, p256dh, auth, em) VALUES (?, ?, ?, ?)").bind(ep, k.p256dh, k.auth, agoraBR()).run();
    const st = await enviar(env, { endpoint: ep, p256dh: k.p256dh, auth: k.auth },
      { titulo: "🔔 Notificações ligadas", corpo: "Vou te avisar aqui quando tiver vídeo pra aprovar.", url: "/" });
    return json({ ok: true, teste: st });
  }
  return json({ erro: "rota" }, 404);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const caminho = url.pathname.replace(/^\/+/, "") || "index.html";
    if (caminho.startsWith("api/")) return api(req, env, caminho.slice(4));
    // vídeo do post para assistir no app antes de aprovar (repassa Range para o player do iPhone)
    const mv = caminho.match(/^videos\/(\d{4}-\d{2}-\d{2}-[\w-]{1,80})\.mp4$/);
    if (mv) {
      const POSTS = BASE.replace("/painel/", "/posts/");
      const h = {};
      if (req.headers.get("range")) h.range = req.headers.get("range");
      const r = await fetch(`${POSTS}${mv[1]}/reel.mp4`, { headers: h, cf: { cacheTtl: 3600, cacheEverything: true } });
      if (!r.ok && r.status !== 206) return new Response("vídeo não encontrado", { status: 404 });
      const out = new Headers({ "content-type": "video/mp4", "accept-ranges": "bytes", "cache-control": "public, max-age=3600" });
      for (const k of ["content-length", "content-range"]) if (r.headers.get(k)) out.set(k, r.headers.get(k));
      return new Response(r.body, { status: r.status, headers: out });
    }
    if (caminho === "sw.js") return new Response(SW, { headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "no-cache" } });
    if (!/^(index\.html|manifest\.json|icone-(180|512)\.png|capas\/[\w.-]+\.jpg)$/.test(caminho)) {
      return new Response("não encontrado", { status: 404 });
    }
    const html = caminho.endsWith(".html");
    // a página vem sempre fresca do GitHub (?t= fura o cache); imagens podem ficar em cache
    const r = await fetch(BASE + caminho + (html ? "?t=" + Date.now() : ""), { cf: html ? { cacheTtl: 0 } : { cacheTtl: 120, cacheEverything: true } });
    if (!r.ok) return new Response("painel indisponível (" + r.status + ")", { status: 502 });
    const ext = caminho.split(".").pop();
    return new Response(r.body, {
      headers: { "content-type": TIPOS[ext], "cache-control": ext === "html" ? "no-cache" : "public, max-age=3600" },
    });
  },
  async scheduled(evento, env, ctx) {
    ctx.waitUntil(conferir(env));
  },
};

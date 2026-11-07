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


// ---------------------------------------------------------------- robô de comentários do Instagram (Vitor, 07/11)
// Instagram API com login do Instagram. Credenciais e token ficam só no D1 (tabela config); o token se renova sozinho.
const IG = "https://graph.instagram.com/v23.0";
const CALLBACK = SITE + "/ig/callback";
const ESCOPOS = "instagram_business_basic,instagram_business_manage_comments,instagram_business_manage_messages";
const sem = (t) => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
const escH = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

async function prepararTabelas(env) {
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS config (nome TEXT PRIMARY KEY, valor TEXT, em TEXT)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS comentarios (id TEXT PRIMARY KEY, media_id TEXT, usuario TEXT, texto TEXT, palavra TEXT, pasta TEXT, acao TEXT, erro TEXT, em TEXT)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS midias (id TEXT PRIMARY KEY, n INTEGER, em TEXT)"),
  ]);
}
async function cfg(env) {
  const { results } = await env.DB.prepare("SELECT nome, valor FROM config").all();
  return Object.fromEntries(results.map((r) => [r.nome, r.valor]));
}
async function setCfg(env, pares) {
  const em = agoraBR();
  await env.DB.batch(Object.entries(pares).map(([k, v]) =>
    env.DB.prepare("INSERT INTO config (nome, valor, em) VALUES (?, ?, ?) ON CONFLICT(nome) DO UPDATE SET valor = excluded.valor, em = excluded.em").bind(k, String(v), em)));
}
async function respostas() {
  const r = await fetch(BASE + "respostas.json?t=" + Date.now(), { cf: { cacheTtl: 0 } });
  return r.ok ? r.json() : { posts: [], respostas_publicas: [] };
}
// a palavra do post: "Comenta PALAVRA" na legenda; se a palavra se repete, vale o post com data mais perto
function acharPost(midia, lista) {
  const legenda = sem(midia.caption);
  const ms = [...legenda.matchAll(/COMENT[AE]\s+["“']?([A-Z0-9]{2,20})/g)].map((m) => m[1]);
  const cands = lista.filter((p) => ms.includes(sem(p.palavra)));
  if (!cands.length) return null;
  const t = Date.parse(midia.timestamp);
  const quando = (p) => Date.parse(p.quando.replace(" ", "T") + ":00-03:00") || Date.parse(p.quando) || 0;
  return cands.sort((a, b) => Math.abs(quando(a) - t) - Math.abs(quando(b) - t))[0];
}

const FB = "https://graph.facebook.com/v23.0";
let GASTO = 0; const TETO = 38; // o plano grátis do Cloudflare corta em 50 chamadas por execução: para antes e continua na próxima rodada
let HOST = IG; // trocado para FB quando a conexão é pelo login unificado (token de usuário do sistema)
async function igFetch(caminho, token, opcoes = {}) {
  GASTO++;
  const r = await fetch(caminho.startsWith("http") ? caminho : HOST + caminho, {
    ...opcoes, headers: { authorization: "Bearer " + token, ...(opcoes.body ? { "content-type": "application/json" } : {}) },
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(JSON.stringify(j.error || { status: r.status }).slice(0, 300));
  return j;
}

async function renovarToken(env, c) {
  if (c.modo === "suat") return c.token; // token de usuário do sistema não vence
  if (!c.token || Number(c.expira || 0) - Date.now() > 10 * 864e5) return c.token;
  const r = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(c.token)}`);
  const j = await r.json().catch(() => ({}));
  if (!j.access_token) { await setCfg(env, { erro_token: JSON.stringify(j).slice(0, 300) }); return c.token; }
  await setCfg(env, { token: j.access_token, expira: Date.now() + (j.expires_in || 5184000) * 1000 });
  return j.access_token;
}

async function responderComentarios(env) {
  await prepararTabelas(env);
  const c = await cfg(env);
  if (!c.token || c.pausado === "1") return { ok: false, motivo: c.token ? "pausado" : "não conectado" };
  GASTO = 1; // respostas.json
  const token = await renovarToken(env, c);
  HOST = c.modo === "suat" ? FB : IG;
  const EU = c.modo === "suat" ? c.ig_id : "me";
  const R = await respostas();
  const frases = R.respostas_publicas?.length ? R.respostas_publicas : ["Te respondi! 📩"];
  const dmAtivo = c.dm !== "0";
  const { data: midias = [] } = await igFetch(`/${EU}/media?fields=id,caption,timestamp,comments_count&limit=40`, token);
  const limite = Date.now() - 7 * 864e5;
  const vistos = Object.fromEntries((await env.DB.prepare("SELECT id, n FROM midias").all()).results.map((r) => [r.id, r.n]));
  let feitos = 0, n = Number(c.contador || 0);
  for (const m of midias) {
    if (Date.parse(m.timestamp) < limite || !m.comments_count || vistos[m.id] === m.comments_count) continue;
    if (GASTO > TETO - 4) break;
    let incompleto = false;
    const post = acharPost(m, R.posts || []);
    const { data: coms = [] } = await igFetch(`/${m.id}/comments?fields=id,text,username,timestamp&limit=50`, token);
    const ja = new Set((await env.DB.prepare("SELECT id FROM comentarios WHERE media_id = ?").bind(m.id).all()).results.map((r) => r.id));
    for (const co of coms) {
      if (ja.has(co.id) || (c.usuario && co.username === c.usuario)) continue;
      if (GASTO > TETO - 3) { incompleto = true; break; }
      const tem = post && new RegExp(`(^|[^A-Z0-9])${sem(post.palavra)}([^A-Z0-9]|$)`).test(sem(co.text));
      let acao = tem ? "" : "sem palavra", erro = "";
      if (tem) {
        const linkBio = `${SITE}/links#${encodeURIComponent(sem(post.palavra))}`;
        // 1) DM (resposta privada; precisa do acesso avançado da Meta)
        if (dmAtivo) {
          const dm = post.dm.length > 990 ? post.dm.slice(0, post.dm.lastIndexOf("\n", 850)) + `\n\nO resto tá aqui: ${linkBio}` : post.dm;
          const corpoDM = JSON.stringify({ recipient: { comment_id: co.id }, message: { text: dm } });
          try { await igFetch(`/${EU}/messages`, token, { method: "POST", body: corpoDM }); acao = "dm"; }
          catch (e) {
            erro = "dm: " + e.message;
            if (c.modo === "suat") try { await igFetch("/me/messages", token, { method: "POST", body: corpoDM }); acao = "dm"; erro = ""; } catch {}
          }
        }
        // 2) resposta pública (varia a frase; sem DM, aponta para o link da bio)
        const frase = acao === "dm" ? frases[n % frases.length] : `${["Tá no link da bio", "Deixei no link da bio", "Coloquei no link da bio"][n % 3]}, procura ${post.palavra} 📌 (@${co.username})`;
        n++;
        try { await igFetch(`/${co.id}/replies`, token, { method: "POST", body: JSON.stringify({ message: frase }) }); acao = acao ? acao + "+resposta" : "resposta"; }
        catch (e) { erro += (erro ? " | " : "") + "resposta: " + e.message; }
        if (!acao) acao = "erro";
        if (acao === "erro" && /subrequests/i.test(erro)) { incompleto = true; break; } // não grava: tenta de novo na próxima rodada
        feitos++;
      }
      await env.DB.prepare("INSERT OR IGNORE INTO comentarios (id, media_id, usuario, texto, palavra, pasta, acao, erro, em) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .bind(co.id, m.id, co.username || "", String(co.text || "").slice(0, 300), post?.palavra || "", post?.pasta || "", acao, erro.slice(0, 500), agoraBR()).run();
    }
    if (incompleto) break;
    await env.DB.prepare("INSERT INTO midias (id, n, em) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET n = excluded.n, em = excluded.em").bind(m.id, m.comments_count, agoraBR()).run();
  }
  await setCfg(env, { contador: n, ultima_rodada: agoraBR() });
  return { ok: true, respondidos: feitos };
}

const PAGINA = (titulo, corpo) => new Response(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${titulo}</title>
<style>body{font-family:system-ui,sans-serif;background:#0f1117;color:#e8e8ef;max-width:560px;margin:0 auto;padding:18px;line-height:1.45}a{color:#f0a070}
input,button{font:inherit;width:100%;box-sizing:border-box;padding:11px;border-radius:10px;border:1px solid #333;margin:6px 0;background:#1a1d27;color:#fff}button{background:#e8834a;border:0;font-weight:700}
.b{background:#1a1d27;border:1px solid #2a2e3b;border-radius:14px;padding:12px 14px;margin:10px 0}.b h2{margin:0 0 6px;font-size:18px}pre{white-space:pre-wrap;font:inherit;margin:0}small{color:#9aa}</style></head><body>${corpo}</body></html>`,
  { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });

async function paginaLinks() {
  const R = await respostas();
  const agora = agoraBR();
  const vivos = (R.posts || []).filter((p) => p.quando <= agora).sort((a, b) => (a.quando < b.quando ? 1 : -1));
  const linkar = (t) => escH(t).replace(/https?:\/\/[^\s<]+/g, (u) => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);
  return PAGINA("IA em 60s · links", `<h1>IA em 60s 🤖</h1><p>Comentou a palavra num vídeo? O link tá aqui. Procure a palavra 👇</p>` +
    vivos.map((p) => `<div class="b" id="${escH(sem(p.palavra))}"><h2>💬 ${escH(p.palavra)}</h2><small>${escH(p.quando.slice(8, 10) + "/" + p.quando.slice(5, 7))}</small><pre>${linkar(p.dm)}</pre></div>`).join("") +
    `<p><small>Perfil independente, sem ligação com as empresas citadas.</small></p>`);
}

async function paginaConectar(env, url) {
  await prepararTabelas(env);
  const c = await cfg(env);
  const msg = url.searchParams.get("ok") ? "<p>✅ Instagram conectado.</p>" : url.searchParams.get("erro") ? `<p>⚠️ ${escH(url.searchParams.get("erro"))}</p>` : "";
  if (c.token) {
    const { results } = await env.DB.prepare("SELECT acao, COUNT(*) n FROM comentarios GROUP BY acao").all();
    return PAGINA("Robô de comentários", `<h1>🤖 Robô de comentários</h1>${msg}<div class="b">Conectado como <b>@${escH(c.usuario)}</b><br>Última rodada: ${escH(c.ultima_rodada || "ainda não rodou")}<br>` +
      results.map((r) => `${escH(r.acao)}: <b>${r.n}</b>`).join(" · ") + `</div><p><small>${c.modo === "suat" ? "Token de usuário do sistema (não vence)." : "Token renova sozinho (vence em " + new Date(Number(c.expira)).toLocaleDateString("pt-BR") + ")."}${c.ultimo_erro ? "<br>Último erro: " + escH(c.ultimo_erro) : ""}</small></p>`);
  }
  const unificado = `<div class="b"><h2>Login unificado (apps novos)</h2><small>Cole o token gerado em "Gerar tokens de acesso" e o ID da conta do Instagram que aparece ao lado dela.</small>
<form method="post" action="/api/ig-suat"><input name="ig_id" placeholder="ID da conta do Instagram (só números)" required><input name="token" type="password" placeholder="Token de acesso" required><button>Conectar</button></form></div>`;
  const passo2 = c.app_id ? `<div class="b"><h2>2. Autorizar</h2><a href="https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${encodeURIComponent(c.app_id)}&redirect_uri=${encodeURIComponent(CALLBACK)}&response_type=code&scope=${ESCOPOS}"><button>Entrar com o Instagram do perfil</button></a></div>` : "";
  return PAGINA("Conectar Instagram", `<h1>🤖 Conectar o Instagram</h1>${msg}${unificado}<p><small>Ou, em apps antigos, pelo login do Instagram:</small></p><div class="b"><h2>1. Dados do app da Meta</h2><small>Ficam guardados só no banco do painel (nunca no GitHub).</small>
<form method="post" action="/api/ig-app"><input name="app_id" placeholder="ID do app do Instagram" value="${escH(c.app_id || "")}" required><input name="app_secret" type="password" placeholder="Chave secreta do app do Instagram" required><button>Salvar</button></form></div>${passo2}
<p><small>URL de redirecionamento para colocar no app da Meta: <b>${CALLBACK}</b></small></p>`);
}

async function callback(env, url) {
  const c = await cfg(env);
  const code = url.searchParams.get("code");
  if (!code || !c.app_id || !c.app_secret) return Response.redirect(SITE + "/conectar?erro=" + encodeURIComponent(url.searchParams.get("error_description") || "faltou o código"), 302);
  const f = new FormData();
  for (const [k, v] of Object.entries({ client_id: c.app_id, client_secret: c.app_secret, grant_type: "authorization_code", redirect_uri: CALLBACK, code: code.replace(/#_$/, "") })) f.append(k, v);
  const r1 = await (await fetch("https://api.instagram.com/oauth/access_token", { method: "POST", body: f })).json().catch(() => ({}));
  const curto = r1.access_token || r1.data?.[0]?.access_token;
  if (!curto) return Response.redirect(SITE + "/conectar?erro=" + encodeURIComponent("troca do código: " + JSON.stringify(r1).slice(0, 200)), 302);
  const r2 = await (await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${encodeURIComponent(c.app_secret)}&access_token=${encodeURIComponent(curto)}`)).json().catch(() => ({}));
  if (!r2.access_token) return Response.redirect(SITE + "/conectar?erro=" + encodeURIComponent("token longo: " + JSON.stringify(r2).slice(0, 200)), 302);
  const eu = await igFetch("/me?fields=user_id,username", r2.access_token).catch(() => ({}));
  await setCfg(env, { token: r2.access_token, expira: Date.now() + (r2.expires_in || 5184000) * 1000, usuario: eu.username || "", ig_id: eu.user_id || "" });
  return Response.redirect(SITE + "/conectar?ok=1", 302);
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
  if (rota === "ig-app" && req.method === "POST") {
    await prepararTabelas(env);
    if ((await cfg(env)).token) return json({ erro: "já conectado" }, 409);
    const f = await req.formData();
    const id = String(f.get("app_id") || "").trim(), seg = String(f.get("app_secret") || "").trim();
    if (!/^\d{5,25}$/.test(id) || !/^[0-9a-f]{20,64}$/i.test(seg)) return Response.redirect(SITE + "/conectar?erro=" + encodeURIComponent("ID ou chave em formato estranho"), 302);
    await setCfg(env, { app_id: id, app_secret: seg });
    return Response.redirect(SITE + "/conectar", 302);
  }
  if (rota === "ig-suat" && req.method === "POST") {
    await prepararTabelas(env);
    if ((await cfg(env)).token) return json({ erro: "já conectado" }, 409);
    const f = await req.formData();
    const id = String(f.get("ig_id") || "").trim(), tk = String(f.get("token") || "").trim();
    if (!/^\d{5,25}$/.test(id) || tk.length < 40) return Response.redirect(SITE + "/conectar?erro=" + encodeURIComponent("ID ou token em formato estranho"), 302);
    HOST = FB;
    try {
      const eu = await igFetch(`/${id}?fields=username`, tk);
      await setCfg(env, { modo: "suat", token: tk, ig_id: id, usuario: eu.username || "", expira: "" });
    } catch (e) { return Response.redirect(SITE + "/conectar?erro=" + encodeURIComponent("a Meta recusou: " + e.message.slice(0, 200)), 302); }
    return Response.redirect(SITE + "/conectar?ok=1", 302);
  }
  if (rota === "ig-status" && req.method === "GET") {
    await prepararTabelas(env);
    const c = await cfg(env);
    const { results } = await env.DB.prepare("SELECT usuario, texto, palavra, acao, erro, em FROM comentarios WHERE acao != 'sem palavra' ORDER BY em DESC LIMIT 15").all();
    const tot = (await env.DB.prepare("SELECT acao, COUNT(*) n FROM comentarios GROUP BY acao").all()).results;
    return json({ conectado: !!c.token, usuario: c.usuario || "", ultima: c.ultima_rodada || "", pausado: c.pausado === "1", totais: tot, recentes: results });
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
    if (caminho === "links") return paginaLinks();
    if (caminho === "conectar") return paginaConectar(env, url);
    if (caminho === "ig/callback") return callback(env, url);
    if (caminho === "privacidade") return PAGINA("Privacidade", "<h1>Política de privacidade · IA em 60s</h1><p>Este app responde automaticamente a comentários feitos nos Reels do perfil IA em 60s no Instagram, com o link prometido no vídeo. Guardamos só o ID do comentário, o nome de usuário público e o texto do comentário, para não responder duas vezes. Não vendemos nem compartilhamos dados. Para pedir a exclusão, mande uma DM para o perfil com a palavra EXCLUIR e apagamos em até 7 dias.</p>");
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
    if (new Date(evento.scheduledTime).getUTCMinutes() % 10 < 5) ctx.waitUntil(responderComentarios(env).catch(async (e) => {
      try { await setCfg(env, { ultimo_erro: agoraBR() + " " + String(e.message).slice(0, 400) }); } catch {}
    }));
  },
};

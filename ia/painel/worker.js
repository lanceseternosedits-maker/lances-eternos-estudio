// Worker "painel-iaem60s": serve o painel do IA em 60s (ia/painel/ do ramo midia-ia) como app no celular,
// grava as decisões do Vitor (aprovar/negar) no D1 "iaem60s-painel" (binding DB). Sem PIN (Vitor, 07/11).
// Notificações (Vitor, 07/11: "o app precisa me mandar notificação quando tiver vídeo pra aprovação"):
// Web Push padrão (VAPID + aes128gcm, RFC 8291/8292). A cada 5 min (cron) lê painel/pendentes.json e avisa
// cada vídeo novo em "vídeo aguardando aprovação". Segredo VAPID_PRIVADA (JWK) e VAPID_PUBLICA ficam só no Worker.
const BASE = "https://raw.githubusercontent.com/lanceseternosedits-maker/lances-eternos-estudio/midia-ia/ia/painel/";
const SITE = "https://iaem60s.com"; // domínio próprio (08/11); o painel-iaem60s.vgofredousa.workers.dev continua funcionando
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
  if (c.webhook_ok === "1" && c.inscrito !== "1") { // liga o envio dos toques de DM para o webhook (1 vez)
    try { await igFetch(`/${EU}/subscribed_apps?subscribed_fields=messages,messaging_postbacks`, token, { method: "POST" }); await setCfg(env, { inscrito: "1" }); }
    catch (e) { await setCfg(env, { erro_inscricao: e.message.slice(0, 300) }); }
  }
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
      const casa = (pal) => new RegExp(`(^|[^A-Z0-9])${sem(pal)}([^A-Z0-9]|$)`).test(sem(co.text));
      let alvo = post;
      if (!(post && casa(post.palavra))) alvo = (R.globais || []).find((g) => casa(g.palavra)) || post; // KIT vale em qualquer Reel
      const tem = alvo && casa(alvo.palavra);
      let acao = tem ? "" : "sem palavra", erro = "";
      if (tem) {
        const linkBio = `${SITE}/links#${encodeURIComponent(sem(alvo.palavra))}`;
        // 1) DM (resposta privada; precisa do acesso avançado da Meta)
        if (dmAtivo) {
          const dm = alvo.dm.length > 990 ? alvo.dm.slice(0, alvo.dm.lastIndexOf("\n", 850)) + `\n\nO resto tá aqui: ${linkBio}` : alvo.dm;
          // formato "Me Envie" (Vitor, 08/11): 1ª DM só com o botão; o material sai quando a pessoa toca (webhook) e se ela segue o perfil
          const corpoDM = JSON.stringify({ recipient: { comment_id: co.id },
            message: c.webhook_ok === "1" ? cartaoMeEnvie(alvo, co.username)
              : { text: sem(alvo.palavra) === "KIT" ? dm : (dm + "\n\n🔥 Quer 10 assistentes de IA prontos? Super Assistente de IA: https://iaem60s.com/kit?o=dm").slice(0, 1000) } });
          try { await igFetch(`/${EU}/messages`, token, { method: "POST", body: corpoDM }); acao = "dm"; }
          catch (e) {
            erro = "dm: " + e.message;
            if (c.modo === "suat") try { await igFetch("/me/messages", token, { method: "POST", body: corpoDM }); acao = "dm"; erro = ""; } catch {}
          }
        }
        // 2) resposta pública (varia a frase; sem DM, aponta para o link da bio)
        const frase = acao === "dm" ? frases[n % frases.length] : `${["Tá no link da bio", "Deixei no link da bio", "Coloquei no link da bio"][n % 3]}, procura ${alvo.palavra} 📌 (@${co.username})`;
        n++;
        try { await igFetch(`/${co.id}/replies`, token, { method: "POST", body: JSON.stringify({ message: frase }) }); acao = acao ? acao + "+resposta" : "resposta"; }
        catch (e) { erro += (erro ? " | " : "") + "resposta: " + e.message; }
        if (!acao) acao = "erro";
        if (acao === "erro" && /subrequests/i.test(erro)) { incompleto = true; break; } // não grava: tenta de novo na próxima rodada
        feitos++;
      }
      if (acao.startsWith("dm") && c.webhook_ok === "1") acao = acao.replace("dm", "botao");
      await env.DB.prepare("INSERT OR IGNORE INTO comentarios (id, media_id, usuario, texto, palavra, pasta, acao, erro, em) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .bind(co.id, m.id, co.username || "", String(co.text || "").slice(0, 300), (tem ? alvo : post)?.palavra || "", (tem ? alvo : post)?.pasta || "", acao, erro.slice(0, 500), agoraBR()).run();
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
  const P = R.produto || {};
  const vivos = (R.posts || []).filter((p) => p.quando <= agora).sort((a, b) => (a.quando < b.quando ? 1 : -1));
  const ultimos = vivos.filter((p) => p.thumb && p.quando.length > 10 && p.titulo).slice(0, 3);
  const linkar = (t) => escH(t).replace(/https?:\/\/[^\s<]+/g, (u) => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);
  const card = (href, img, titulo, desc, selo = "", ext = false) => `<a class="card" href="${escH(href)}"${ext ? ' target="_blank" rel="noopener"' : ""}>
<div class="im">${img}${selo ? `<span class="selo">${selo}</span>` : ""}</div><div class="tx"><b>${titulo}</b><p>${desc}</p></div></a>`;
  const cards = [];
  if (P.nome) cards.push(card("/kit?o=bio", `<img src="${escH(P.capa || "/capas/kit-p1.jpg")}" alt="">`, `${escH(P.nome)}${P.preco ? " — R$ " + escH(P.preco) + " 🔥" : ""}`,
    "10 assistentes prontos pra ChatGPT, Claude ou Gemini. Configure em 1 tarde.", "à venda"));
  cards.push(card("#brindes", `<div class="ico" style="background:linear-gradient(135deg,#ffb347,#ff7a3d)">🎁</div>`, "Brindes grátis dos vídeos",
    "Comentou uma palavra num Reel? Pegue o seu link aqui."));
  for (const p of ultimos) cards.push(card(p.url || PERFIL, `<img src="${escH(p.thumb)}" alt="">`, escH(p.titulo),
    `Vídeo de ${escH(p.quando.slice(8, 10) + "/" + p.quando.slice(5, 7))} · comenta ${escH(p.palavra)} e receba na DM`, "", true));
  cards.push(card(PERFIL, `<div class="ico" style="background:linear-gradient(135deg,#6a4cff,#d14cff)">📲</div>`, "Siga o @iaem60s",
    "A IA que trabalha por você, explicada em 60 segundos. Todo dia.", "", true));
  return new Response(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>@iaem60s · links</title><meta name="theme-color" content="#f6f4f1"><meta property="og:image" content="/capas/kit-p1.jpg"><style>
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;background:#f6f4f1;color:#16141f;line-height:1.4}
.w{max-width:560px;margin:0 auto;padding:34px 16px 50px}.topo{text-align:center;margin-bottom:26px}
.av{width:104px;height:104px;border-radius:50%;margin:0 auto 12px;background:linear-gradient(135deg,#ff7a3d,#ffb347);display:grid;place-items:center;font-size:52px;box-shadow:0 8px 24px #ff7a3d44;border:4px solid #fff}
.topo b{font-size:21px}.topo small{display:block;color:#7b7690;margin-top:4px;font-size:14.5px}
.card{display:flex;min-height:132px;background:#fff;border-radius:22px;overflow:hidden;text-decoration:none;color:inherit;margin-bottom:14px;box-shadow:0 2px 10px #0000000f,0 10px 30px #00000008;transition:transform .15s}
.card:active{transform:scale(.98)}.im{position:relative;width:38%;max-width:180px;flex:none;background:#eee}.im img{width:100%;height:100%;object-fit:cover;display:block;position:absolute;inset:0}
.ico{position:absolute;inset:0;display:grid;place-items:center;font-size:52px}
.selo{position:absolute;left:8px;top:8px;background:#ff3d3d;color:#fff;font-weight:800;font-size:12.5px;padding:4px 10px;border-radius:8px;text-transform:lowercase}
.tx{padding:16px 16px 16px 18px;display:flex;flex-direction:column;justify-content:center}.tx b{font-size:17.5px;line-height:1.25}.tx p{margin:6px 0 0;color:#6d6880;font-size:14.5px}
h3{margin:34px 4px 4px;font-size:19px}.dica{color:#7b7690;font-size:14px;margin:0 4px 12px}
input{width:100%;padding:14px 16px;border-radius:16px;border:1px solid #e3ded6;background:#fff;color:#16141f;font-size:16px;margin-bottom:10px}
details{background:#fff;border-radius:16px;margin:8px 0;padding:0 16px;box-shadow:0 1px 6px #0000000d}summary{padding:15px 0;font-weight:800;cursor:pointer;display:flex;justify-content:space-between}
summary small{color:#9a96ad;font-weight:500}pre{white-space:pre-wrap;font:14.5px/1.5 system-ui,sans-serif;margin:0 0 15px;color:#33304a}pre a{color:#d4571d;word-break:break-all}
footer{text-align:center;color:#a19cb3;font-size:12px;margin-top:30px}
</style></head><body><div class="w"><div class="topo"><div class="av">🤖</div><b>@iaem60s</b><small>IA que trabalha por você, explicada em 60 segundos</small></div>
${cards.join("")}
<h3 id="brindes">🎁 Brindes grátis dos vídeos</h3><p class="dica">Digite a palavra que você comentou e pegue o seu link.</p>
<input id="q" placeholder="Digite a palavra (ex.: TV, VOZ, DESIGN)" autocomplete="off">
${vivos.map((p) => `<details id="${escH(sem(p.palavra))}" data-p="${escH(sem(p.palavra))}"><summary>💬 ${escH(p.palavra)} <small>${escH(p.quando.slice(8, 10) + "/" + p.quando.slice(5, 7))}</small></summary><pre>${linkar(p.dm)}</pre></details>`).join("")}
<footer>Perfil independente, sem ligação com as empresas citadas.</footer></div>
<script>const q=document.getElementById('q'),ds=[...document.querySelectorAll('details')];
q.oninput=()=>{const v=q.value.normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase().trim();ds.forEach(d=>{const ok=!v||d.dataset.p.includes(v);d.style.display=ok?'':'none';d.open=!!v&&d.dataset.p===v})};
const h=decodeURIComponent(location.hash.slice(1));if(h&&h!=='brindes'){const d=document.getElementById(h);if(d){d.open=true;setTimeout(()=>d.scrollIntoView({behavior:'smooth',block:'center'}),200)}}</script>
</body></html>`, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });
}

async function paginaConectar(env, url) {
  await prepararTabelas(env);
  const c = await cfg(env);
  const msg = url.searchParams.get("ok") ? "<p>✅ Instagram conectado.</p>" : url.searchParams.get("erro") ? `<p>⚠️ ${escH(url.searchParams.get("erro"))}</p>` : "";
  if (c.token) {
    const { results } = await env.DB.prepare("SELECT acao, COUNT(*) n FROM comentarios GROUP BY acao").all();
    if (!c.webhook_token) { c.webhook_token = aleatorio(12); await setCfg(env, { webhook_token: c.webhook_token }); }
    const wh = `<div class="b"><h2>DM com botão "Me Envie"</h2>${c.webhook_ok === "1" ? "✅ Webhook ativo (" + escH(c.webhook_em || "") + ")" : "⏳ Falta configurar o webhook no app da Meta:"}<br>
URL de callback: <b>https://iaem60s.com/ig/webhook</b><br>Token de verificação: <b>${escH(c.webhook_token)}</b><br><small>Campos: messages e messaging_postbacks.</small></div>`;
    return PAGINA("Robô de comentários", `<h1>🤖 Robô de comentários</h1>${msg}${wh}<div class="b">Conectado como <b>@${escH(c.usuario)}</b><br>Última rodada: ${escH(c.ultima_rodada || "ainda não rodou")}<br>` +
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



// ---------------------------------------------------------------- DM em etapas (formato "Me Envie" → segue? → material)
const PERFIL = "https://www.instagram.com/iaem60s/";
function cartaoMeEnvie(alvo, usuario) {
  return { attachment: { type: "template", payload: { template_type: "generic", elements: [{
    title: "Opa! Separei pra você 🤖",
    subtitle: `Toca aqui embaixo que eu já te mando o de ${alvo.palavra}.`.slice(0, 80),
    buttons: [{ type: "postback", title: "Me Envie 📩", payload: `ENVIAR|${alvo.palavra}|${alvo.pasta || ""}` }],
  }] } } };
}
function cartaoSegue(palavra, pasta) {
  return { attachment: { type: "template", payload: { template_type: "generic", elements: [{
    title: "O material é pra seguidores 💜",
    subtitle: "Segue a @iaem60s e toca em «Já te sigo».",
    buttons: [{ type: "postback", title: "Já te sigo ✅", payload: `CONFERIR|${palavra}|${pasta}` },
              { type: "web_url", title: "Abrir perfil", url: PERFIL }],
  }] } } };
}
function cartaoProduto(P) {
  const botoes = [];
  if (P.checkout) botoes.push({ type: "web_url", title: "Quero o meu 🔥", url: "https://iaem60s.com/comprar?o=dm" });
  botoes.push({ type: "web_url", title: "Ver o que vem", url: "https://iaem60s.com/kit?o=dm" });
  return { attachment: { type: "template", payload: { template_type: "generic", elements: [{
    title: `Gostou? Tem o Super Assistente de IA${P.preco ? " por R$ " + P.preco : ""}`.slice(0, 80),
    subtitle: "10 assistentes prontos pra ChatGPT, Claude ou Gemini. Garantia de 7 dias.",
    image_url: "https://iaem60s.com/capas/kit-p1.jpg", buttons: botoes,
  }] } } };
}
async function enviarDM(c, token, igsid, message) {
  const EU = c.modo === "suat" ? c.ig_id : "me";
  const corpo = JSON.stringify({ recipient: { id: igsid }, message });
  // 09/11: o fallback para /me escondia o erro real ("Object with ID 'me' does not exist"). Agora tenta 2x no ig_id e grava o 1º erro.
  try { return await igFetch(`/${EU}/messages`, token, { method: "POST", body: corpo }); }
  catch (e) {
    await new Promise((r) => setTimeout(r, 1500));
    try { return await igFetch(`/${EU}/messages`, token, { method: "POST", body: corpo }); }
    catch (e2) { throw new Error("1ª: " + e.message.slice(0, 220) + " | 2ª: " + e2.message.slice(0, 220)); }
  }
}
async function tratarToque(env, ev) {
  const igsid = ev.sender && ev.sender.id;
  const payload = (ev.postback && ev.postback.payload) || (ev.message && ev.message.quick_reply && ev.message.quick_reply.payload) || "";
  const [tipo, palavra, pasta] = payload.split("|");
  if (!igsid || !["ENVIAR", "CONFERIR"].includes(tipo)) return;
  const c = await cfg(env);
  if (!c.token || igsid === c.ig_id) return;
  HOST = c.modo === "suat" ? FB : IG;
  const R = await respostas();
  const item = (R.posts || []).find((p) => p.pasta === pasta && sem(p.palavra) === sem(palavra))
    || (R.globais || []).find((g) => sem(g.palavra) === sem(palavra)) || (R.posts || []).find((p) => sem(p.palavra) === sem(palavra));
  if (!item) return;
  let segue = true; // se a API não responder, entrega mesmo assim
  try { const u = await igFetch(`/${igsid}?fields=is_user_follow_business,username`, c.token); if (u.is_user_follow_business === false) segue = false; } catch {}
  let acao = "", erro = "";
  try {
    if (segue) {
      await enviarDM(c, c.token, igsid, { text: item.dm.slice(0, 990) }); acao = "material";
      // depois do brinde, oferece o produto (Vitor, 08/11); no KIT não repete
      const P = R.produto || {};
      if (P.nome && sem(palavra) !== "KIT") {
        try { await enviarDM(c, c.token, igsid, cartaoProduto(P)); acao = "material+oferta"; } catch (e) { erro = "oferta: " + e.message.slice(0, 200); }
      }
    }
    else { await enviarDM(c, c.token, igsid, cartaoSegue(palavra, pasta || "")); acao = "pediu_seguir"; }
  } catch (e) { erro = e.message.slice(0, 480); acao = "erro"; }
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS dm_eventos (em TEXT, igsid TEXT, tipo TEXT, palavra TEXT, acao TEXT, erro TEXT)").run();
  await env.DB.prepare("INSERT INTO dm_eventos VALUES (?, ?, ?, ?, ?, ?)").bind(agoraBR(), igsid, tipo, palavra || "", acao, erro).run();
}
async function webhook(req, env, ctx, url) {
  const c = await cfg(env).catch(() => ({}));
  if (req.method === "GET") {
    if (url.searchParams.get("hub.mode") === "subscribe" && c.webhook_token && url.searchParams.get("hub.verify_token") === c.webhook_token) {
      await setCfg(env, { webhook_ok: "1", webhook_em: agoraBR() });
      return new Response(url.searchParams.get("hub.challenge") || "", { status: 200 });
    }
    return new Response("token inválido", { status: 403 });
  }
  let b = {};
  try { b = await req.json(); } catch {}
  for (const en of b.entry || []) for (const ev of en.messaging || []) ctx.waitUntil(tratarToque(env, ev).catch(() => {}));
  return new Response("ok");
}

// ---------------------------------------------------------------- acesso ao painel (Vitor, 08/11: "painel não pode ficar aberto ao público")
// Sem senha: o código de acesso chega por notificação no celular do Vitor (só quem tem o 🔔 ativado recebe).
// Sessão em cookie HttpOnly por 1 ano; no D1 só fica o hash do token.
const DOMINIO = "iaem60s.com", PAINEL = "painel.iaem60s.com";
async function sha(t) { return [...new Uint8Array(await crypto.subtle.digest("SHA-256", txt(t)))].map((b) => b.toString(16).padStart(2, "0")).join(""); }
const aleatorio = (n) => [...crypto.getRandomValues(new Uint8Array(n))].map((b) => b.toString(16).padStart(2, "0")).join("");
async function tabelasAcesso(env) {
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS sessoes (hash TEXT PRIMARY KEY, criada TEXT, expira INTEGER, origem TEXT)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS acessos (hash TEXT PRIMARY KEY, expira INTEGER, tentativas INTEGER DEFAULT 0, criado INTEGER)"),
  ]);
}
function cookie(req, nome) {
  const m = (req.headers.get("cookie") || "").match(new RegExp("(?:^|;\\s*)" + nome + "=([^;]+)"));
  return m ? m[1] : "";
}
async function logado(req, env) {
  const t = cookie(req, "s");
  if (!t) return false;
  try {
    const r = await env.DB.prepare("SELECT expira FROM sessoes WHERE hash = ?").bind(await sha(t)).first();
    return !!r && r.expira > Date.now();
  } catch { return false; }
}
async function criarSessao(env, req) {
  const t = aleatorio(32);
  await env.DB.prepare("INSERT INTO sessoes (hash, criada, expira, origem) VALUES (?, ?, ?, ?)")
    .bind(await sha(t), agoraBR(), Date.now() + 365 * 864e5, (req.headers.get("user-agent") || "").slice(0, 120)).run();
  return `s=${t}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`;
}
async function pedirAcesso(env, url) {
  await tabelasAcesso(env);
  const ult = await env.DB.prepare("SELECT MAX(criado) m FROM acessos").first();
  if (ult && ult.m && Date.now() - ult.m < 60e3) return json({ erro: "espere 1 minuto para pedir outro código" }, 429);
  const codigo = String(100000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900000));
  const link = aleatorio(16);
  await env.DB.prepare("DELETE FROM acessos WHERE expira < ?").bind(Date.now()).run();
  await env.DB.batch([
    env.DB.prepare("INSERT INTO acessos (hash, expira, tentativas, criado) VALUES (?, ?, 0, ?)").bind(await sha("c:" + codigo), Date.now() + 10 * 6e4, Date.now()),
    env.DB.prepare("INSERT INTO acessos (hash, expira, tentativas, criado) VALUES (?, ?, 0, ?)").bind(await sha("l:" + link), Date.now() + 10 * 6e4, Date.now()),
  ]);
  const { results } = await env.DB.prepare("SELECT COUNT(*) n FROM inscricoes").all();
  if (!results[0].n) return json({ erro: "nenhum celular com o 🔔 ativado" }, 409);
  await avisarTodos(env, { titulo: `🔐 Código do painel: ${codigo}`, corpo: "Toque aqui para entrar, ou digite o código. Vale 10 minutos. Não pediu? Ignore.", url: "/entrar?l=" + link, tag: "acesso" });
  return json({ ok: true });
}
async function usarAcesso(env, tipo, valor) {
  await tabelasAcesso(env);
  const h = await sha(tipo + ":" + valor);
  const r = await env.DB.prepare("SELECT expira, tentativas FROM acessos WHERE hash = ?").bind(h).first();
  if (!r || r.expira < Date.now()) {
    if (tipo === "c") await env.DB.prepare("UPDATE acessos SET tentativas = tentativas + 1").run(); // erra demais → todos os códigos caem
    await env.DB.prepare("DELETE FROM acessos WHERE tentativas >= 5").run();
    return false;
  }
  await env.DB.prepare("DELETE FROM acessos WHERE hash = ?").bind(h).run();
  return true;
}
function paginaEntrar(msg = "") {
  return PAGINA("Entrar no painel", `<h1>🔐 Painel IA em 60s</h1>${msg ? `<p>⚠️ ${escH(msg)}</p>` : ""}
<div class="b"><p>O código de acesso chega por notificação no seu celular (o que tem o 🔔 ativado no app).</p>
<button id="pedir">📲 Mandar código pro meu celular</button><p id="st"></p>
<form method="post" action="/entrar"><input name="codigo" inputmode="numeric" autocomplete="one-time-code" placeholder="Código de 6 números" maxlength="6" required><button>Entrar</button></form></div>
<script>document.getElementById('pedir').onclick=async()=>{const st=document.getElementById('st');st.textContent='Enviando…';
const r=await fetch('/api/acesso',{method:'POST'});const j=await r.json().catch(()=>({}));st.textContent=r.ok?'✅ Enviado! Veja a notificação no celular.':'⚠️ '+(j.erro||'não deu certo')}</script>`);
}
const LIVRE_PAINEL = /^(ig\/webhook|comprar|kiwify\/webhook|entrar|sw\.js|manifest\.json|icone-(180|512)\.png|links|kit|estudio|estudio\/[\w-]+\.(?:mp4|jpg)|privacidade|ig\/callback|capas\/(kit|thumb)-[\w.-]+\.jpg)$/;
const LIVRE_DOMINIO = /^(ig\/webhook|comprar|kiwify\/webhook|links|kit|estudio|estudio\/[\w-]+\.(?:mp4|jpg)|privacidade|ig\/callback|capas\/(kit|thumb)-[\w.-]+\.jpg|icone-(180|512)\.png)$/;

// ---------------------------------------------------------------- API
// ---------- 💵 Financeiro (Vitor, 08/11): vendas da Kiwify (webhook) + funil (visitas ao /kit, cliques em comprar, comentários KIT, cartões de oferta na DM)
const CHECKOUT = "https://pay.kiwify.com.br/sV3FJ2D";
async function tabelasVendas(env) {
  await env.DB.batch([
    env.DB.prepare("CREATE TABLE IF NOT EXISTS vendas (id TEXT PRIMARY KEY, evento TEXT, status TEXT, valor INTEGER, liquido INTEGER, metodo TEXT, produto TEXT, cliente TEXT, em TEXT, bruto TEXT)"),
    env.DB.prepare("CREATE TABLE IF NOT EXISTS funil (dia TEXT, tipo TEXT, origem TEXT, n INTEGER, PRIMARY KEY (dia, tipo, origem))"),
  ]);
}
async function contaFunil(env, tipo, origem) {
  try { await tabelasVendas(env); await env.DB.prepare("INSERT INTO funil (dia, tipo, origem, n) VALUES (?, ?, ?, 1) ON CONFLICT(dia, tipo, origem) DO UPDATE SET n = n + 1").bind(agoraBR().slice(0, 10), tipo, String(origem).replace(/[^\w-]/g, "").slice(0, 30) || "direto").run(); } catch {}
}
// valor em centavos: inteiro >= 100 já vem em centavos; número com casas decimais vem em reais
const centavos = (v) => { if (v == null || v === "") return null; const n = Number(String(v).replace(",", ".")); if (isNaN(n)) return null; return Number.isInteger(n) && n >= 100 ? n : Math.round(n * 100); };
const APROVADA = /paid|approved|aprovad|complete/i, ESTORNO = /refund|reembols|chargeback|estorn/i;
async function kiwify(req, env, ctx, url) {
  const c = await cfg(env);
  if (!c.kiwify_token || url.searchParams.get("t") !== c.kiwify_token) return new Response("token inválido", { status: 401 });
  let b; try { b = await req.json(); } catch { return new Response("json inválido", { status: 400 }); }
  await tabelasVendas(env);
  const pega = (...ks) => { for (const k of ks) { const v = k.split(".").reduce((o, q) => (o == null ? o : o[q]), b); if (v != null && v !== "") return v; } return null; };
  const id = String(pega("order_id", "order_ref", "sale_id", "id") || crypto.randomUUID());
  const evento = String(pega("webhook_event_type", "event", "trigger", "type") || "");
  const status = String(pega("order_status", "status", "sale_status") || evento);
  const valor = centavos(pega("Commissions.charge_amount", "Commissions.product_base_price", "charge_amount", "amount", "price", "total"));
  const liquido = centavos(pega("Commissions.my_commission", "my_commission", "net_amount", "commission"));
  const metodo = String(pega("payment_method", "Payment.method", "payment_type") || "");
  const produto = String(pega("Product.product_name", "product_name", "Product.name", "product") || "");
  const email = String(pega("Customer.email", "customer.email", "email") || "");
  const cliente = email ? email.replace(/^(.).*(@.*)$/, "$1***$2") : ""; // nunca guarda o e-mail inteiro
  const limpo = { ...b }; delete limpo.Customer; delete limpo.customer; delete limpo.email; // sem dados pessoais no banco
  await env.DB.prepare("INSERT INTO vendas (id, evento, status, valor, liquido, metodo, produto, cliente, em, bruto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET evento = excluded.evento, status = excluded.status, valor = COALESCE(excluded.valor, vendas.valor), liquido = COALESCE(excluded.liquido, vendas.liquido), em = excluded.em, bruto = excluded.bruto")
    .bind(id, evento, status, valor, liquido, metodo, produto, cliente, agoraBR(), JSON.stringify(limpo).slice(0, 4000)).run();
  const txt = status + " " + evento;
  if (APROVADA.test(txt) && !ESTORNO.test(txt)) ctx.waitUntil(avisarTodos(env, { titulo: "💰 Venda! " + (produto || "Super Assistente de IA"), corpo: (valor ? "R$ " + (valor / 100).toFixed(2).replace(".", ",") : "") + (metodo ? " · " + metodo : "") + " · toque para ver o caixa", url: "/#gastos", tag: "venda-" + id }));
  return json({ ok: true });
}
async function api(req, env, rota) {
  if (rota === "financeiro" && req.method === "GET") {
    await tabelasVendas(env);
    const c = await cfg(env);
    const v = (await env.DB.prepare("SELECT evento, status, valor, liquido, metodo, produto, em FROM vendas ORDER BY em DESC LIMIT 300").all()).results;
    const ok = v.filter((x) => APROVADA.test(x.status + " " + x.evento) && !ESTORNO.test(x.status + " " + x.evento));
    const est = v.filter((x) => ESTORNO.test(x.status + " " + x.evento));
    const desde = new Date(Date.now() - 30 * 864e5).toLocaleString("sv-SE", { timeZone: "America/Sao_Paulo" }).slice(0, 10);
    const funil = (await env.DB.prepare("SELECT dia, tipo, origem, n FROM funil WHERE dia >= ? ORDER BY dia").bind(desde).all()).results;
    let kit = 0, ofertas = 0;
    try { kit = (await env.DB.prepare("SELECT COUNT(*) AS n FROM comentarios WHERE palavra = 'KIT'").first())?.n || 0; } catch {}
    try { ofertas = (await env.DB.prepare("SELECT COUNT(*) AS n FROM dm_eventos WHERE acao = 'material+oferta'").first())?.n || 0; } catch {}
    const soma = (l, k) => l.reduce((t, x) => t + (x[k] || 0), 0);
    return json({ agora: agoraBR(), conectado: !!c.kiwify_token, vendas: ok.length, estornos: est.length, bruto: soma(ok, "valor"), liquido: soma(ok, "liquido"),
      ultimas: v.slice(0, 15), funil, comentarios_kit: kit, ofertas_dm: ofertas });
  }
  if (rota === "atividade" && req.method === "GET") { // aba 🏢 Equipe: o que cada agente está fazendo agora
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS atividade (agente TEXT PRIMARY KEY, estado TEXT, detalhe TEXT, progresso TEXT, em TEXT)").run();
    const { results } = await env.DB.prepare("SELECT agente, estado, detalhe, progresso, em FROM atividade").all();
    const c = await cfg(env);
    const hoje = agoraBR().slice(0, 10);
    let n = 0;
    try { n = (await env.DB.prepare("SELECT COUNT(*) AS n FROM comentarios WHERE em >= ?").bind(hoje).first())?.n || 0; } catch {}
    const ag = Object.fromEntries(results.map((r) => [r.agente, r]));
    ag.robo = { agente: "robo", estado: c.token && c.pausado !== "1" ? "trabalhando" : "livre",
      detalhe: c.token ? (c.pausado === "1" ? "pausado" : `de plantão nos comentários · ${n} hoje`) : "Instagram desconectado", progresso: "", em: c.ultima_rodada || "" };
    return json({ agora: agoraBR(), agentes: ag });
  }
  if (rota === "publicados" && req.method === "GET") { // ✅ da Agenda: o que já foi ao ar no Instagram (2 chamadas à API)
    const c = await cfg(env);
    if (!c.token) return json({ erro: "não conectado", itens: [] });
    const token = await renovarToken(env, c);
    HOST = c.modo === "suat" ? FB : IG;
    const EU = c.modo === "suat" ? c.ig_id : "me";
    const iso = (t) => String(t || "").replace(/([+-]\d{2})(\d{2})$/, "$1:$2");
    const itens = [];
    try {
      const { data = [] } = await igFetch(`/${EU}/media?fields=timestamp,media_type,media_product_type,permalink&limit=40`, token);
      for (const m of data) itens.push({ t: iso(m.timestamp), tipo: m.media_product_type === "REELS" ? "REEL" : "POST", url: m.permalink || "" });
    } catch (e) { return json({ erro: String(e.message).slice(0, 200), itens }); }
    try {
      const { data = [] } = await igFetch(`/${EU}/stories?fields=timestamp`, token);
      for (const m of data) itens.push({ t: iso(m.timestamp), tipo: "STORY", url: "" });
    } catch {}
    return json({ itens, em: agoraBR() });
  }
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
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    // iaem60s.com = público (bio e venda); painel.iaem60s.com e o workers.dev = painel com acesso
    if (url.hostname === "www." + DOMINIO) return Response.redirect("https://" + DOMINIO + url.pathname + url.search, 301);
    const publico = url.hostname === DOMINIO;
    const caminho = url.pathname.replace(/^\/+/, "") || (publico ? "links" : "index.html");
    if (publico) {
      if (caminho === "painel") return Response.redirect("https://" + PAINEL + "/", 302);
      if (!LIVRE_DOMINIO.test(caminho)) return Response.redirect("https://" + DOMINIO + "/", 302);
    } else if (!LIVRE_PAINEL.test(caminho) && caminho !== "api/acesso") {
      if (!(await logado(req, env))) {
        if (caminho.startsWith("api/") || caminho.startsWith("videos/")) return json({ erro: "login" }, 401);
        return Response.redirect(url.origin + "/entrar", 302);
      }
    }
    if (caminho === "api/acesso" && req.method === "POST") return pedirAcesso(env, url);
    if (caminho === "ig/webhook") return webhook(req, env, ctx, url);
    if (caminho === "entrar") {
      await tabelasAcesso(env);
      let ok = false;
      if (req.method === "POST") ok = await usarAcesso(env, "c", String((await req.formData()).get("codigo") || "").trim());
      else if (url.searchParams.get("l")) ok = await usarAcesso(env, "l", url.searchParams.get("l"));
      else if (await logado(req, env)) return Response.redirect(url.origin + "/", 302);
      else return paginaEntrar();
      if (!ok) return paginaEntrar("Código inválido ou vencido. Peça outro.");
      return new Response(null, { status: 302, headers: { location: url.origin + "/", "set-cookie": await criarSessao(env, req) } });
    }
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
    if (caminho === "comprar") { ctx.waitUntil(contaFunil(env, "clique", url.searchParams.get("o") || "direto")); return Response.redirect(CHECKOUT, 302); }
    if (caminho === "kiwify/webhook" && req.method === "POST") return kiwify(req, env, ctx, url);
    // Estúdio de Reels (Vitor, 09/11): landing em /estudio e mídia em /estudio/<arquivo> (vídeo/imagem do repositório com o tipo certo)
    if (caminho === "estudio") { ctx.waitUntil(contaFunil(env, "visita-estudio", url.searchParams.get("o") || "direto"));
      return fetch(BASE + "estudio.html?t=" + Date.now(), { cf: { cacheTtl: 0 } }).then((r) => new Response(r.body, { status: r.ok ? 200 : 502, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } })); }
    { const m = caminho.match(/^estudio\/([\w-]+)\.(mp4|jpg)$/);
      if (m) return fetch(BASE + "estudio/" + m[1] + "." + m[2], { cf: { cacheTtl: 3600 } }).then((r) => new Response(r.body, { status: r.ok ? 200 : 404,
        headers: { "content-type": m[2] === "mp4" ? "video/mp4" : "image/jpeg", "cache-control": "public, max-age=3600", "accept-ranges": "bytes" } })); }
    if (caminho === "kit") ctx.waitUntil(contaFunil(env, "visita", url.searchParams.get("o") || "direto"));
    if (caminho === "kit") return fetch(BASE + "kit.html?t=" + Date.now(), { cf: { cacheTtl: 0 } }).then((r) => new Response(r.body, { status: r.ok ? 200 : 502, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } }));
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

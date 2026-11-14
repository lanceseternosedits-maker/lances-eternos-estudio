// uso (de ia/): python3 -m http.server 8792 &  e  node painel/capa_clean/render.js <saida.jpg> '<json: cor,titulo,etiqueta,objeto,sub>'
const { chromium } = require('playwright'); const [out, js] = process.argv.slice(2);
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('ERR', e.message)); await p.goto(`http://localhost:${process.env.PORT || 8792}/painel/capa_clean/index.html`); await p.waitForFunction(() => window.pronto, null, { timeout: 60000 });
  await p.evaluate(a => capa(a), JSON.parse(js)); await p.screenshot({ path: out, type: 'jpeg', quality: 92 }); await b.close(); })();

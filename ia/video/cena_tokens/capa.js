const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('ERR', e.message)); await p.goto('http://localhost:8790/cena_tokens/index.html'); await p.waitForFunction(() => window.pronto);
  await p.evaluate(() => { setTL({ total: 10, segmentos: [{ cena: 'gancho', t0: 0, fim: 10, palavras: [] }] }); capa(); });
  await p.screenshot({ path: process.argv[2], type: 'jpeg', quality: 92 }); await b.close(); })();

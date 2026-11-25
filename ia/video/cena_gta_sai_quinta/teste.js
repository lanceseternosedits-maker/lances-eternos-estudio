// uso (de ia/video, http.server na PORT): PORT=8791 node cena_gta_sai_quinta/teste.js <timeline.json> <prefixo> t1,t2,...   (ou "capa" como t)
const { chromium } = require('playwright'); const fs = require('fs');
const [tlf, pre, ts] = process.argv.slice(2); const TL = JSON.parse(fs.readFileSync(tlf));
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => m.type() === 'error' && console.log('ERR', m.text()));
  await p.goto(`http://localhost:${process.env.PORT || 8791}/cena_gta_sai_quinta/index.html`); await p.waitForFunction(() => window.pronto, null, { timeout: 60000 }); await p.evaluate(x => setTL(x), TL);
  if (ts === 'capa') { await p.evaluate(() => capa()); await p.screenshot({ path: pre, type: 'jpeg', quality: 92 }); await b.close(); return; }
  const L = ts.split(',').map(Number); for (const [i, x] of L.entries()) { await p.evaluate(x => setT(x), x); await p.screenshot({ path: `${pre}_${i}.jpg`, type: 'jpeg', quality: 80 }); } await b.close(); })();

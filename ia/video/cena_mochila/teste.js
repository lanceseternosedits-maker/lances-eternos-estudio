// Folha de teste com a timeline real: PORT=8793 node cena_mochila/teste.js <timeline.json> <saida.jpg> t1,t2,...
const { chromium } = require('playwright'); const fs = require('fs'); const { execSync } = require('child_process');
const [tl, saida, ts] = process.argv.slice(2); const TL = JSON.parse(fs.readFileSync(tl)); const L = ts.split(',').map(Number);
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => m.type() === 'error' && console.log('ERR', m.text()));
  await p.goto(`http://localhost:${process.env.PORT || 8793}/cena_mochila/index.html`); await p.waitForFunction(() => window.pronto, null, { timeout: 60000 }); await p.evaluate(x => setTL(x), TL);
  const dir = process.env.TMPDIR || '/tmp'; const fl = [];
  for (const [i, x] of L.entries()) { await p.evaluate(x => setT(x), x); const f = `${saida}_${i}.jpg`; await p.screenshot({ path: f, type: 'jpeg', quality: 80 }); fl.push(f); }
  await b.close(); console.log(fl.join(' ')); })();

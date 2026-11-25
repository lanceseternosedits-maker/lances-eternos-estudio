const { chromium } = require('playwright'); const fs = require('fs');
const [tlf, out, capa] = process.argv.slice(2); const TL = JSON.parse(fs.readFileSync(tlf));
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('http://localhost:8791/cena_voos/index.html'); await p.waitForFunction(() => window.pronto, null, { timeout: 60000 }); await p.evaluate(x => setTL(x), TL);
  fs.writeFileSync(out, JSON.stringify(await p.evaluate(() => eventos())));
  await p.evaluate(() => capa()); await p.screenshot({ path: capa, type: 'jpeg', quality: 92 }); await b.close(); })();

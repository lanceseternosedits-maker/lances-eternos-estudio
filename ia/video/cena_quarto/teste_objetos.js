// Fotografa cada uma das 15 etapas logo depois de o objeto surgir. Uso: node teste_objetos.js <timeline.json> <pasta_saida>
const { chromium } = require('playwright'); const fs = require('fs');
const [tlArq, out] = process.argv.slice(2); const TL = JSON.parse(fs.readFileSync(tlArq));
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', (e) => console.log('ERR', e.message)); p.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
  await p.goto('http://localhost:8765/cena_quarto/index.html'); await p.waitForFunction(() => window.pronto, null, { timeout: 20000 }); await p.evaluate((t) => setTL(t), TL);
  const pop = (await p.evaluate(() => eventos())).filter((e) => e.som === 'pop').map((e) => e.t);
  for (const [i, t] of pop.entries()) { await p.evaluate((t) => setT(t), t + 1.3); await p.screenshot({ path: `${out}/o${String(i + 1).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 80 }); }
  await b.close();
})();

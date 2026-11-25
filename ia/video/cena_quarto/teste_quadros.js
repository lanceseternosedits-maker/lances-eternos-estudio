// Testa quadros soltos da cena_quarto e grava os eventos de som. Uso: node teste_quadros.js <timeline.json> <pasta_saida>
const { chromium } = require('playwright'); const fs = require('fs');
const [tlArq, out] = process.argv.slice(2); const TL = JSON.parse(fs.readFileSync(tlArq));
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', (e) => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/cena_quarto/index.html'); await p.waitForFunction(() => window.pronto, null, { timeout: 20000 }); await p.evaluate((t) => setTL(t), TL);
  const ev = await p.evaluate(() => eventos()); fs.writeFileSync(tlArq.replace('timeline.json', 'eventos.json'), JSON.stringify(ev)); console.log('eventos', ev.length);
  const S = TL.segmentos; const at = (c) => S.find((s) => s.cena === c).t0; const pop = ev.filter((e) => e.som === 'pop').map((e) => e.t);
  const ts = [1, at('p04') + 0.5, pop[3] + 0.12, pop[3] + 1.5, pop[7] + 0.6, at('cta') + 2.6];
  for (const [i, t] of ts.entries()) { await p.evaluate((t) => setT(t), t); await p.screenshot({ path: `${out}/k${i}.jpg`, type: 'jpeg' }); }
  await b.close();
})();

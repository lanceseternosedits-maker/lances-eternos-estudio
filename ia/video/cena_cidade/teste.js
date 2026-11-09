// Folha de teste da cena_cidade sem voz: timeline estimada do roteiro (2,8 palavras/s). Uso (de ia/video, com http.server na PORT):
// PORT=8790 node cena_cidade/teste.js <roteiro.json> <módulo> <saida.jpg> [t1,t2,...]
const { chromium } = require('playwright'); const fs = require('fs');
const [rot, mod, saida, ts] = process.argv.slice(2); const R = JSON.parse(fs.readFileSync(rot)); let t = .25; const segs = [];
for (const s of R.segmentos) { const ws = s.legenda.split(' '); const d = ws.length / 2.8; let x = t; const pal = ws.map(w => { const e = d / ws.length; const o = { w, t0: +x.toFixed(3), t1: +(x + e).toFixed(3) }; x += e; return o; });
  segs.push({ ...s, t0: t, t1: t + d, palavras: pal }); t += d + .12; }
segs[0].t0 = 0; for (let i = 0; i < segs.length - 1; i++) segs[i].fim = segs[i + 1].t0; const total = t + .8; segs[segs.length - 1].fim = total; const TL = { total, segmentos: segs };
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => m.type() === 'error' && console.log('ERR', m.text()));
  await p.goto(`http://localhost:${process.env.PORT || 8790}/cena_cidade/index.html?m=${mod}`); await p.waitForFunction(() => window.pronto, null, { timeout: 60000 }); await p.evaluate(x => setTL(x), TL);
  const L = ts ? ts.split(',').map(Number) : segs.map(s => s.t0 + Math.min(1.2, (s.fim - s.t0) / 2)).concat([total - .05]); const fs2 = [];
  for (const [i, x] of L.entries()) { await p.evaluate(x => setT(x), x); const f = `/tmp/cid_${i}.jpg`; await p.screenshot({ path: f, type: 'jpeg', quality: 80 }); fs2.push(f); }
  await b.close(); fs.writeFileSync(saida + '.lista', fs2.join('\n')); console.log('total', total.toFixed(1), 's', L.length, 'quadros');
})();

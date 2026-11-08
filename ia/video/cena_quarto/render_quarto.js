// Renderiza a cena_fluxo (3D, precisa de http): node render_fluxo.js <timeline.json> <saida.mp4>   (servidor: python3 -m http.server 8765 em ia/video)
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs');
const [tlArq, saida] = process.argv.slice(2); const TL = JSON.parse(fs.readFileSync(tlArq)); const FPS = 30, fim = TL.total + 0.8;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('http://localhost:8765/cena_quarto/index.html'); await p.waitForFunction(() => window.pronto, null, { timeout: 30000 }); await p.evaluate((t) => setTL(t), TL);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'veryfast', saida]);
  const n = Math.round(fim * FPS);
  for (let i = 0; i < n; i++) { await p.evaluate((t) => setT(t), i / FPS); const buf = await p.screenshot({ type: 'jpeg', quality: 90 }); if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r)); if (i % 600 === 0) console.log('quadro', i, '/', n); }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await b.close(); console.log('ok', saida);
})();

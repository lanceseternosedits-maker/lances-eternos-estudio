// Renderiza a cena_app quadro a quadro e manda direto para o ffmpeg (30 fps).
// Uso: node render_app.js <timeline.json> <saida.mp4> [inicio_s fim_s]
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path');
const [tlArq, saida, ini = 0, fimArg] = process.argv.slice(2); const TL = JSON.parse(fs.readFileSync(tlArq)); const FPS = 30;
const fim = fimArg ? +fimArg : TL.total + 0.6;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(__dirname, 'index.html')); await p.waitForTimeout(800); await p.evaluate((t) => setTL(t), TL);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'veryfast', saida]);
  const n = Math.round((fim - ini) * FPS);
  for (let i = 0; i < n; i++) { await p.evaluate((t) => setT(t), +ini + i / FPS); const buf = await p.screenshot({ type: 'jpeg', quality: 90 }); if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r)); if (i % 300 === 0) console.log('quadro', i, '/', n); }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await b.close(); console.log('ok', saida);
})();

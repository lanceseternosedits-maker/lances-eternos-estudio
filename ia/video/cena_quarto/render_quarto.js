// Renderiza a cena_quarto (3D, precisa de http): [INI=quadro FIM=quadro] node render_quarto.js <timeline.json> <saida.mp4>   (servidor: python3 -m http.server 8765 em ia/video)
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const fs = require('fs');
const [tlArq, saida] = process.argv.slice(2); const TL = JSON.parse(fs.readFileSync(tlArq)); const FPS = 30, fim = TL.total + 0.8;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('http://localhost:8765/cena_quarto/index.html'); await p.waitForFunction(() => window.pronto, null, { timeout: 30000 }); await p.evaluate((t) => setTL(t), TL);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'veryfast', saida]);
  const n = Math.round(fim * FPS), ini = +(process.env.INI || 0), ate = Math.min(n, +(process.env.FIM || n)); let ref = 0, refeitos = 0;
  // o SwiftShader às vezes devolve o canvas 3D vazio (quadro preto só com a legenda): JPEG bem menor que o anterior = refaz o quadro
  for (let i = ini; i < ate; i++) { let buf;
    for (let k = 0; k < 6; k++) { await p.evaluate((t) => setT(t), i / FPS); if (k) await p.waitForTimeout(80 * k); buf = await p.screenshot({ type: 'jpeg', quality: 90 }); if (!ref || buf.length > ref * 0.45) break; refeitos++; }
    ref = buf.length; if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r)); if (i % 600 === 0) console.log('quadro', i, '/', n); }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r)); await b.close(); console.log('refeitos', refeitos); console.log('ok', saida);
})();

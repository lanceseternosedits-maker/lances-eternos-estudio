// Configuração do Remotion. No seu computador, o Remotion baixa o navegador sozinho na 1ª vez.
// Se você já tem um Chrome/Chromium e não quer baixar outro: NAVEGADOR=/caminho/do/chrome npx remotion render ...
const { Config } = require('@remotion/cli/config');
if (process.env.NAVEGADOR) Config.setBrowserExecutable(process.env.NAVEGADOR);
Config.setChromiumOpenGlRenderer(process.env.GL || 'angle'); // cenas 3D (three.js) precisam de WebGL
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(process.env.NUCLEOS ? Number(process.env.NUCLEOS) : null);

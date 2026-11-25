// Remotion (instalado 08/11): usa o Chromium que já vem no ambiente (não baixa outro; remotion.media é bloqueado na rede)
const { Config } = require('@remotion/cli/config');
Config.setBrowserExecutable('/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell');
Config.setVideoImageFormat('jpeg'); Config.setJpegQuality(95);

#!/usr/bin/env bash
# Faz o Reel inteiro: checa o roteiro, prepara tempos/voz/trilha, renderiza, acerta o volume, checa o vídeo e gera a folha de miniaturas.
# Uso: bash scripts/fazer.sh roteiros/meu.json [nenhuma|minha|gemini] [pasta_das_gravacoes]
set -e
cd "$(dirname "$0")/.."
rot="$1"; voz="${2:-nenhuma}"; grav="$3"
nome=$(basename "$rot" .json)
formato=$(python3 -c "import json,sys; f=json.load(open('$rot')).get('formato','contagem'); print({'contagem':'Contagem','cidade':'Cidade'}[f])")

python3 scripts/checar.py "$rot" || { echo "Arrume o roteiro antes de renderizar."; exit 1; }
if [ "$voz" = "minha" ]; then python3 scripts/preparar.py "$rot" --voz minha --gravacoes "$grav"; else python3 scripts/preparar.py "$rot" --voz "$voz"; fi
mkdir -p saida
${REMOTION:-npx remotion} render src/index.jsx "$formato" "saida/$nome.bruto.mp4" --props="projetos/$nome.json"
# volume padrão das redes (-14 LUFS) sem mexer no vídeo
ffmpeg -y -loglevel error -i "saida/$nome.bruto.mp4" -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -movflags +faststart "saida/$nome.mp4"
rm -f "saida/$nome.bruto.mp4"
python3 scripts/checar.py "$rot" "saida/$nome.mp4" || true
bash scripts/miniaturas.sh "saida/$nome.mp4"
echo "Pronto: saida/$nome.mp4 (olhe a folha de miniaturas antes de postar)"

#!/bin/bash
# Produz um Reel do formato 3 de ponta a ponta: clipes, trilha (variações via MUS="MUS_TOM=.. MUS_BATIDA=.. MUS_PROG=menor MUS_CHIP=1 MUS_SEM_PALMA=1"), efeitos, render, montagem e folha.
# Antes: voz pronta (tts_frases.py + acelera.py) e módulo itens/<nome>.js. Use PORT=876x para rodar vários em paralelo.
# uso: produz.sh <pasta do post> <trilha opcional>
set -e
cd /home/user/lances-eternos-estudio/ia
P=posts/$1
python3 - "$P" <<'PY'
import json,os,sys
P=sys.argv[1]; t=json.load(open(P+'/out/timeline.json')); b=os.path.abspath(P+'/out3d/base.mp4')
json.dump({s['cena']:{'arquivo':b,'ini':s['t0']} for s in t['segmentos']},open(P+'/out3d/clipes.json','w'),indent=1)
PY
(cd $P && eval "$MUS" python3 ../../video/musica.py out >/dev/null && python3 ../../video/sfx_mix.py roteiro.json out >/dev/null)
cd video && rm -rf ../$P/out3d/frames ../$P/out3d/teste_*
WWW=cena_contagem OUT=../$P/out3d TL=../$P/out/timeline.json ROT=../$P/roteiro.json node render.js > ../$P/out3d/render.log 2>&1
ffmpeg -loglevel error -y -framerate 30 -i ../$P/out3d/frames/%05d.jpg -c:v libx264 -pix_fmt yuv420p -crf 16 ../$P/out3d/base.mp4
cd ../$P && SEM_OVERLAY=1 VBR=8M python3 ../../video/compor.py roteiro.json out out3d/clipes.json && cp out/reel.mp4 reel.mp4
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 reel.mp4); ffmpeg -loglevel error -y -i reel.mp4 -vf "fps=14/$D,scale=216:-1,tile=7x2" -frames:v 1 folha_reel.jpg
echo "FEITO $1"

#!/bin/bash
# Re-renderiza só um trecho de um Reel do motor cena_contagem (ex.: o fechamento) e remonta o reel.mp4 sem refazer tudo.
# Uso (de ia/): PORT=8775 bash video/refaz_trecho.sh <pasta> <de_s> [ate_s]   (precisa de out3d/frames do render completo)
set -e
cd "$(dirname "$0")/.."; P=posts/$1
cd video && DE=$2 ATE=${3:-1e9} WWW=cena_contagem OUT=../$P/out3d TL=../$P/out/timeline.json ROT=../$P/roteiro.json node render.js > ../$P/out3d/render_trecho.log 2>&1
ffmpeg -loglevel error -y -framerate 30 -i ../$P/out3d/frames/%05d.jpg -c:v libx264 -pix_fmt yuv420p -crf 16 ../$P/out3d/base.mp4
cd ../$P && SEM_OVERLAY=1 VBR=8M python3 ../../video/compor.py roteiro.json out out3d/clipes.json && cp out/reel.mp4 reel.mp4
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 reel.mp4); ffmpeg -loglevel error -y -i reel.mp4 -vf "fps=14/$D,scale=216:-1,tile=7x2" -frames:v 1 folha_reel.jpg
echo "REFEITO $1 de $2 s"

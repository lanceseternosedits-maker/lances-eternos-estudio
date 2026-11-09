#!/usr/bin/env bash
# Folha de miniaturas para revisar o vídeo com os olhos (1 quadro a cada ~2,5 s numa grade 6×2).
# Uso: bash scripts/miniaturas.sh saida/meu.mp4  ->  saida/meu_miniaturas.jpg
set -e
v="$1"; out="${v%.mp4}_miniaturas.jpg"
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$v")
fps=$(python3 -c "print(12/$dur)")
ffmpeg -y -loglevel error -i "$v" -vf "fps=$fps,scale=270:480,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6,tile=6x2:padding=6:color=white" -frames:v 1 "$out"
echo "$out"

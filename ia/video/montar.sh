#!/bin/bash
# Monta o Reel final: quadros + narração + trilha (abaixa sob a voz) a -14 LUFS.
# Uso: bash montar.sh pasta_saida   (precisa de pasta/frames, pasta/voz.wav, pasta/trilha.wav)
set -e; D=$1
ffmpeg -y -loglevel error -framerate 30 -i $D/frames/%05d.jpg -i $D/voz.wav -i $D/trilha.wav -filter_complex "[1:a]aresample=48000,highpass=f=80,acompressor=threshold=-20dB:ratio=3,volume=2,asplit=2[v][vs];[2:a]volume=0.2[m];[m][vs]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=300[md];[v][md]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5[a]" -map 0:v -map "[a]" -c:v libx264 -preset veryfast -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $D/reel.mp4
echo "ok $D/reel.mp4"

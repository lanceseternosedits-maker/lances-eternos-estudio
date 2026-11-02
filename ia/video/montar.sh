#!/bin/bash
# Monta o Reel final: quadros + narração + trilha (abaixa sob a voz) + efeitos sonoros, a -14 LUFS.
# Uso: bash montar.sh pasta_saida   (precisa de pasta/frames, pasta/voz.wav, pasta/trilha.wav; pasta/sfx.wav é opcional)
set -e; D=$1
if [ -f $D/sfx.wav ]; then
  ffmpeg -y -loglevel error -framerate 30 -i $D/frames/%05d.jpg -i $D/voz.wav -i $D/trilha.wav -i $D/sfx.wav -filter_complex "[1:a]aresample=48000,highpass=f=80,acompressor=threshold=-20dB:ratio=3,volume=2,asplit=2[v][vs];[2:a]volume=0.18[m];[m][vs]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=300[md];[3:a]volume=0.55[fx];[v][md][fx]amix=inputs=3:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5[a]" -map 0:v -map "[a]" -c:v libx264 -preset veryfast -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $D/reel.mp4
else
  ffmpeg -y -loglevel error -framerate 30 -i $D/frames/%05d.jpg -i $D/voz.wav -i $D/trilha.wav -filter_complex "[1:a]aresample=48000,highpass=f=80,acompressor=threshold=-20dB:ratio=3,volume=2,asplit=2[v][vs];[2:a]volume=0.2[m];[m][vs]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=300[md];[v][md]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5[a]" -map 0:v -map "[a]" -c:v libx264 -preset veryfast -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest $D/reel.mp4
fi
echo "ok $D/reel.mp4"

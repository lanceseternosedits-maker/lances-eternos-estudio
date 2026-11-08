#!/bin/bash
# Checagem automática (skill claude-animated-shorts): quadros pretos, brancos e congelados. Uso: bash video/qa_video.sh reel.mp4
V="$1"
echo "pretos:";   ffmpeg -v info -i "$V" -vf "blackdetect=d=0.3:pix_th=0.08" -an -f null - 2>&1 | grep -o "black_start:[0-9.]* black_end:[0-9.]*" | head
echo "congelados (>= 2 s):"; ffmpeg -v info -i "$V" -vf "freezedetect=n=0.002:d=2" -an -f null - 2>&1 | grep -o "freeze_start: [0-9.]*\|freeze_duration: [0-9.]*" | paste - - | head
echo "fim da checagem"

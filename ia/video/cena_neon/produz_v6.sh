#!/bin/bash
# Render v6 completo de um post: 2 processos em paralelo (--faixa), junta, trilha + voz e grava <post>/reel.mp4.
# Uso (de ia/): bash video/cena_neon/produz_v6.sh posts/<pasta>   (precisa de out/timeline.json, out/voz.wav e v6.json)
set -e
P=$(realpath "$1"); D=$(dirname "$(realpath "$0")"); R=$P/out/v6; mkdir -p "$R"
export DISPLAY=${DISPLAY:-:99} POST=$P
pgrep Xvfb >/dev/null || (Xvfb :99 -screen 0 1280x1024x24 >/dev/null 2>&1 &); sleep 1
NQ=$(cd "$D" && python3 -c "import json;print(int(round(json.load(open('$P/out/timeline.json'))['total']*30)))")
M=$((NQ/2)); ini=$(date +%s)
(cd "$D" && python3 video6.py "$R/a.mp4" --faixa 0:$M > "$R/a.log" 2>&1) &
(cd "$D" && python3 video6.py "$R/b.mp4" --faixa $M:$NQ > "$R/b.log" 2>&1) &
wait
printf "file '%s'\nfile '%s'\n" "$R/a.mp4" "$R/b.mp4" > "$R/lista.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$R/lista.txt" -c copy "$R/video.mp4"
eval "$(python3 -c "import json;[print(f'export {k}={v}') for k,v in json.load(open('$P/v6.json')).get('musica',{}).items()]")"
python3 "$D/../musica.py" "$P/out"
ffmpeg -v error -y -i "$P/out/voz.wav" -i "$P/out/trilha.wav" -filter_complex \
 "[0:a]aresample=48000,pan=stereo|c0=c0|c1=c0,highpass=f=70,acompressor=threshold=-20dB:ratio=3,asplit=2[v1][vs];[1:a]aresample=48000,volume=0.16[m];[m][vs]sidechaincompress=threshold=0.05:ratio=4[md];[md][v1]amix=inputs=2:normalize=0[x];[x]loudnorm=I=-14:TP=-1.5:LRA=11[o]" \
 -map "[o]" -ar 48000 "$P/out/mix.wav"
ffmpeg -v error -y -i "$R/video.mp4" -i "$P/out/mix.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$P/reel.mp4"
echo "pronto $P/reel.mp4 em $(( ($(date +%s)-ini)/60 )) min"

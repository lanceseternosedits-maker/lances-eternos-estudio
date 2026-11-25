#!/bin/bash
# Baixa o Kokoro (voz reserva) para ~/.cache/kokoro
set -e; D=~/.cache/kokoro; mkdir -p $D; cd $D
pip install --break-system-packages -q kokoro-onnx soundfile
R=https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main
[ -f kokoro.onnx ] || curl -sSL -o kokoro.onnx $R/onnx/model.onnx
for v in pm_santa; do [ -f $v.bin ] || curl -sSL -o $v.bin $R/voices/$v.bin; done
python3 -c "import numpy as np;np.savez('voices_pt.npz',pm_santa=np.fromfile('pm_santa.bin',np.float32).reshape(-1,1,256))"
echo ok

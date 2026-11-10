#!/bin/bash
# Pricedown (Typodermic, licença Desktop: uso comercial em imagem e vídeo permitido, MAS o arquivo da fonte não pode ser
# redistribuído). Por isso ela fica fora do git (cena_gta/fontes/ está no .gitignore). Rode isto numa sessão nova antes de renderizar.
set -e; cd "$(dirname "$0")"; mkdir -p cena_gta/fontes; [ -f cena_gta/fontes/pricedown.otf ] && exit 0
t=$(mktemp -d); curl -sL -A "Mozilla/5.0" -o $t/f.zip "https://dl.dafont.com/dl/?f=pricedown"; unzip -q -o $t/f.zip -d $t; cp "$t/Pricedown Bl.otf" cena_gta/fontes/pricedown.otf; echo "pricedown ok"

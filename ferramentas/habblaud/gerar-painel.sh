#!/usr/bin/env bash
# Gera o Habblaud da aba 🏢 Equipe do painel (ia/painel/habblaud/ no branch midia-ia).
#
#   bash ferramentas/habblaud/gerar-painel.sh <pasta do midia-ia>
#
# Baixa o Habblaud, aplica a ponte (equipe-iaem60s.patch), gera o cliente para morar em /habblaud/ e substitui
# <pasta do midia-ia>/ia/painel/habblaud. No painel ele abre com ?equipe=1 e lê /api/atividade (mesma origem).
set -euo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIDIA="${1:?passe a pasta do branch midia-ia (onde fica ia/painel)}"
[ -d "$MIDIA/ia/painel" ] || { echo "⚠️  $MIDIA/ia/painel não existe."; exit 1; }
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

bash "$AQUI/instalar.sh" "$TMP/habblaud" >/dev/null
cd "$TMP/habblaud"
HABBLAUD_BASE=/habblaud/ npx vite build --config vite.config.ts --logLevel error
rm -rf "$MIDIA/ia/painel/habblaud"
cp -r dist/client "$MIDIA/ia/painel/habblaud"
cp LICENSE "$MIDIA/ia/painel/habblaud/LICENSE-habblaud.txt"
echo "✅ $MIDIA/ia/painel/habblaud atualizado ($(du -sh "$MIDIA/ia/painel/habblaud" | cut -f1))."

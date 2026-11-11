#!/usr/bin/env bash
# Instala o Habblaud com a equipe IA em 60s no escritório.
#
#   bash ferramentas/habblaud/instalar.sh            # instala em ~/habblaud
#   bash ferramentas/habblaud/instalar.sh ~/outro    # em outra pasta
#
# Baixa o Habblaud oficial na versão testada, aplica a ponte da equipe (equipe-iaem60s.patch) e instala as
# dependências. Depois: `npm run equipe:login` (código no celular) e `npm run build && npm start`.
set -euo pipefail

VERSAO=faa1a012b5fbf632c66dc6801c5383e53a542406   # Habblaud 1.0.3 (16/10/2026), onde a ponte foi testada
AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DESTINO="${1:-$HOME/habblaud}"

command -v git >/dev/null || { echo "⚠️  Precisa do git."; exit 1; }
command -v node >/dev/null || { echo "⚠️  Precisa do Node.js 22.12 ou mais novo (https://nodejs.org)."; exit 1; }
node -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>22||(a===22&&b>=12)?0:1)' \
  || { echo "⚠️  O Node.js é $(node -v); o Habblaud precisa do 22.12 ou mais novo."; exit 1; }

if [ -d "$DESTINO/.git" ]; then
  echo "📁 $DESTINO já existe; usando essa cópia."
else
  echo "⬇️  Baixando o Habblaud em $DESTINO…"
  git clone -q https://github.com/marmottajr/habblaud.git "$DESTINO"
fi
cd "$DESTINO"

if git log --format=%s -20 | grep -q "^Equipe IA em 60s"; then
  echo "✅ A ponte da equipe já está aplicada."
else
  if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  $DESTINO tem mudanças não salvas. Guarde ou descarte antes de instalar."; exit 1
  fi
  git fetch -q origin "$VERSAO" 2>/dev/null || true
  git checkout -q -B equipe-iaem60s "$VERSAO"
  git -c user.name="IA em 60s" -c user.email="equipe@iaem60s.com" am -q "$AQUI/equipe-iaem60s.patch"
  echo "✅ Ponte da equipe aplicada (branch equipe-iaem60s)."
fi

echo "📦 Instalando dependências…"
npm install --no-audit --no-fund --loglevel=error

cat <<FIM

Pronto. Próximos passos, dentro de $DESTINO:

  1. npm run equipe:login       # manda o código pro celular (🔔) e conecta ao painel
  2. npm run build && npm start # abre em http://localhost:4747

Recomendado: npm run mod:install (uso das contas e status ao vivo das suas sessões locais do Claude Code).
FIM

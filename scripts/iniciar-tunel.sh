#!/usr/bin/env bash
# ==============================================================================
# 🐝 BeeHost - Inicializador de Túnel TCP Leve (Bore) para Daytona
# ==============================================================================
# Permite conexão externa direta de jogadores de Minecraft sem precisar de
# privilégios TUN/TAP ou pacotes UDP bloqueados pelo Daytona.
# ==============================================================================

set -e

PORTA_LOCAL=${1:-25565}
PORTA_DESEJADA=${2:-""}

echo "=========================================================="
echo "🐝 BeeHost - Iniciando Túnel TCP para porta $PORTA_LOCAL"
echo "=========================================================="

# 1. Instalar o binário do Bore se não existir
if ! command -v bore >/dev/null 2>&1; then
    echo "⬇️ Baixando cliente leve do Bore (Rust)..."
    curl -sSL https://github.com/ekzhang/bore/releases/download/v0.5.1/bore-v0.5.1-x86_64-unknown-linux-musl.tar.gz | sudo tar -xz -C /usr/local/bin
    sudo chmod +x /usr/local/bin/bore
fi

# 2. Montar comando
CMD="bore local $PORTA_LOCAL --to bore.pub"
if [ -n "$PORTA_DESEJADA" ]; then
    CMD="$CMD --port $PORTA_DESEJADA"
fi

# 3. Executar em background via tmux
tmux kill-session -t bore 2>/dev/null || true
tmux new-session -d -s bore "$CMD"

sleep 3

echo "✅ Túnel ativo em segundo plano!"
echo "Para verificar a porta pública gerada, execute:"
echo "   tmux attach -t bore"
echo "   (Para sair sem desligar: Ctrl+B e depois D)"
echo "=========================================================="

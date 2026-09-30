#!/usr/bin/env bash
# ==============================================================================
# 🐝 BeeHost - Inicializador de Túnel TCP Leve (Bore) para Daytona
# ==============================================================================
set -e
PORTA_LOCAL=${1:-25565}
PORTA_DESEJADA=${2:-""}

if ! command -v bore >/dev/null 2>&1; then
    curl -sSL https://github.com/ekzhang/bore/releases/download/v0.5.1/bore-v0.5.1-x86_64-unknown-linux-musl.tar.gz | sudo tar -xz -C /usr/local/bin
    sudo chmod +x /usr/local/bin/bore
fi

CMD="bore local $PORTA_LOCAL --to bore.pub"
if [ -n "$PORTA_DESEJADA" ]; then
    CMD="$CMD --port $PORTA_DESEJADA"
fi

tmux kill-session -t bore 2>/dev/null || true
tmux new-session -d -s bore "$CMD"

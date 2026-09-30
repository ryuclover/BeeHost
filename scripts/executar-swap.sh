#!/usr/bin/env bash
# ==============================================================================
# 🐝 BeeHost - Script de Swap Rápido entre Containers Daytona ($90 Consumidos)
# ==============================================================================
# Executado no NOVO container puxando os dados do ANTIGO diretamente pela rede
# do datacenter, em menos de 1 minuto sem precisar de armazenamento externo.
#
# Uso:
#   ./executar-swap.sh <SSH_TOKEN_CONTAINER_ANTIGO>
# Exemplo:
#   ./executar-swap.sh dtn_token_exemplo_antigo
# ==============================================================================

set -e

TOKEN_ANTIGO="$1"

if [ -z "$TOKEN_ANTIGO" ]; then
    echo "❌ Erro: Informe o token SSH do container antigo."
    echo "Uso: ./executar-swap.sh <TOKEN_SSH_ANTIGO>"
    exit 1
fi

echo "=========================================================="
echo "🐝 BeeHost - Iniciando Migração Direta Máquina a Máquina"
echo "=========================================================="

DESTINO_MC="/home/daytona/minecraft"
DESTINO_CRAFTY="/home/daytona/crafty"

mkdir -p "$DESTINO_MC"

echo "📦 [1/3] Sincronizando pasta do Minecraft (Mundos, Plugins, Configs)..."
rsync -avz --progress -e "ssh -o StrictHostKeyChecking=no" \
    "${TOKEN_ANTIGO}@ssh.app.daytona.io:/home/daytona/minecraft/" \
    "$DESTINO_MC/"

echo "🎮 [2/3] Sincronizando dados do Crafty Controller se houver..."
if ssh -o StrictHostKeyChecking=no "${TOKEN_ANTIGO}@ssh.app.daytona.io" "[ -d /home/daytona/crafty ]"; then
    mkdir -p "$DESTINO_CRAFTY"
    rsync -avz --progress -e "ssh -o StrictHostKeyChecking=no" \
        "${TOKEN_ANTIGO}@ssh.app.daytona.io:/home/daytona/crafty/" \
        "$DESTINO_CRAFTY/"
fi

echo "🚀 [3/3] Reiniciando servidores no novo container..."
cd "$DESTINO_MC"
chmod +x start.sh 2>/dev/null || true
tmux kill-session -t minecraft 2>/dev/null || true
tmux new-session -d -s minecraft './start.sh'

echo "=========================================================="
echo "✅ Migração Swap concluída com sucesso em menos de 1 minuto!"
echo "O novo container está ativo e rodando. Agora você pode desligar o antigo."
echo "=========================================================="

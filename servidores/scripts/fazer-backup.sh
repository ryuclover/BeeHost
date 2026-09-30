#!/usr/bin/env bash
# ==============================================================================
# BeeHost - Backup & Sync para Cloudflare R2 / S3
# ==============================================================================
# Permite migrar servidores de Minecraft entre contas Daytona sem perder nada.
# Uso:
#   ./daytona-sync.sh backup <nome-do-servidor>
#   ./daytona-sync.sh restore <nome-do-servidor>
# ==============================================================================

ACTION=$1
SERVER_NAME=${2:-"cliente-default"}
SERVER_DIR="/home/daytona/minecraft"
BACKUP_DIR="/home/daytona/backups"

mkdir -p "$BACKUP_DIR"

if [ "$ACTION" == "backup" ]; then
    echo "📦 Criando snapshot do servidor $SERVER_NAME..."
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    ARCHIVE="$BACKUP_DIR/${SERVER_NAME}_${TIMESTAMP}.tar.gz"

    # Avisa o servidor e força gravação no disco se estiver rodando
    if tmux has-session -t minecraft 2>/dev/null; then
        echo "Salvando o mundo no Minecraft..."
        tmux send-keys -t minecraft "say [BeeHost] Iniciando backup automático..." ENTER
        tmux send-keys -t minecraft "save-all" ENTER
        sleep 3
    fi

    echo "Compactando dados do mundo, plugins e configs..."
    tar --exclude='paper.jar' \
        --exclude='*.log.gz' \
        --exclude='cache' \
        -czf "$ARCHIVE" -C "$SERVER_DIR" .

    echo "Snapshot gerado: $ARCHIVE"

    # Se rclone estiver configurado com Cloudflare R2 / AWS S3
    if command -v rclone >/dev/null 2>&1; then
        echo "Enviando para o Cloudflare R2..."
        rclone copy "$ARCHIVE" r2:beehost-backups/$SERVER_NAME/
        echo "✅ Backup enviado para a nuvem com sucesso!"
    else
        echo "ℹ️ Dica: configure 'rclone config' para envio automático ao Cloudflare R2 / S3."
    fi

elif [ "$ACTION" == "restore" ]; then
    echo "⬇️ Restaurando servidor $SERVER_NAME..."
    mkdir -p "$SERVER_DIR"

    if command -v rclone >/dev/null 2>&1; then
        echo "Baixando snapshot mais recente do Cloudflare R2..."
        rclone copy "r2:beehost-backups/$SERVER_NAME/" "$BACKUP_DIR/"
    fi

    LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/${SERVER_NAME}_*.tar.gz 2>/dev/null | head -n 1)

    if [ -n "$LATEST_BACKUP" ] && [ -f "$LATEST_BACKUP" ]; then
        echo "Extraindo $LATEST_BACKUP para $SERVER_DIR..."
        tar -xzf "$LATEST_BACKUP" -C "$SERVER_DIR"
        echo "✅ Restauração concluída com sucesso! Inicie o servidor com ./start.sh"
    else
        echo "⚠️ Nenhum arquivo de backup encontrado para $SERVER_NAME em $BACKUP_DIR."
        exit 1
    fi
else
    echo "Uso: $0 {backup|restore} [nome-do-servidor]"
    exit 1
fi

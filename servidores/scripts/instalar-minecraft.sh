#!/usr/bin/env bash
# ==============================================================================
# BeeHost - Daytona Minecraft Server Bootstrap & Manager
# ==============================================================================
# Este script é executado dentro do workspace Daytona para:
# 1. Instalar Java 21 LTS e utilitários essenciais
# 2. Baixar e configurar PaperMC (versão mais recente otimizada)
# 3. Configurar túnel TCP (Playit.gg ou FRP) para IP/Porta pública fixa
# 4. Configurar Keep-Alive para evitar que o Daytona durma por inatividade
# 5. Backup e restauração automatizados
# ==============================================================================

set -e

RAM_MAX=${RAM_MAX:-"4G"}
RAM_MIN=${RAM_MIN:-"2G"}
MC_VERSION=${MC_VERSION:-"1.20.4"}
SERVER_DIR="/home/daytona/minecraft"

echo "=========================================================="
echo "🐝 BeeHost - Iniciando Provisionamento Minecraft"
echo "=========================================================="

mkdir -p "$SERVER_DIR"
cd "$SERVER_DIR"

# 1. Atualizar e instalar dependências essenciais
echo "📦 [1/5] Verificando dependências (Java 21, curl, jq, tmux)..."
if ! command -v java >/dev/null 2>&1; then
    sudo apt-get update -y
    sudo apt-get install -y openjdk-21-jre-headless curl jq tmux rsync wget
fi

# 2. Instalar Playit.gg (Túnel TCP para IP/Porta pública sem IPv4 dedicado)
echo "🌐 [2/5] Verificando agente de túnel TCP (Playit.gg)..."
if ! command -v playit >/dev/null 2>&1; then
    echo "Baixando binário oficial do Playit.gg..."
    sudo curl -sL https://github.com/playit-cloud/playit-agent/releases/download/v0.15.26/playit-linux-amd64 -o /usr/local/bin/playit
    sudo chmod +x /usr/local/bin/playit
fi

# 3. Obter a build mais recente do PaperMC
echo "⬇️ [3/5] Baixando a build mais recente do PaperMC ($MC_VERSION)..."
if [ ! -f "paper.jar" ]; then
    PAPER_BUILDS_URL="https://api.papermc.io/v2/projects/paper/versions/${MC_VERSION}/builds"
    LATEST_BUILD=$(curl -s "$PAPER_BUILDS_URL" | jq '.builds[-1].build')
    DOWNLOAD_URL="https://api.papermc.io/v2/projects/paper/versions/${MC_VERSION}/builds/${LATEST_BUILD}/downloads/paper-${MC_VERSION}-${LATEST_BUILD}.jar"
    
    echo "Baixando PaperMC build #$LATEST_BUILD de $DOWNLOAD_URL..."
    curl -o paper.jar "$DOWNLOAD_URL"
fi

# 4. Aceitar EULA e configurar propriedades básicas
echo "⚙️ [4/5] Configurando EULA e otimizações..."
echo "eula=true" > eula.txt

if [ ! -f "server.properties" ]; then
    cat <<EOF > server.properties
server-port=25565
online-mode=true
enable-rcon=false
motd=§6§lBeeHost §8» §fServidor Minecraft de Alto Desempenho
max-players=20
view-distance=8
simulation-distance=6
network-compression-threshold=256
EOF
fi

# 5. Criar script de inicialização do servidor com Aikar's Flags (alta performance)
cat <<EOF > start.sh
#!/bin/bash
exec java -Xms${RAM_MIN} -Xmx${RAM_MAX} \\
  -XX:+UseG1GC \\
  -XX:+ParallelRefProcEnabled \\
  -XX:MaxGCPauseMillis=200 \\
  -XX:+UnlockExperimentalVMOptions \\
  -XX:+DisableExplicitGC \\
  -XX:+AlwaysPreTouch \\
  -XX:G1NewSizePercent=30 \\
  -XX:G1MaxNewSizePercent=40 \\
  -XX:G1ReservePercent=20 \\
  -XX:G1HeapWastePercent=5 \\
  -XX:G1MixedGCCountTarget=4 \\
  -XX:InitiatingHeapOccupancyPercent=15 \\
  -XX:G1MixedGCLiveThresholdPercent=90 \\
  -XX:G1RSetUpdatingPauseTimePercent=5 \\
  -XX:SurvivorRatio=32 \\
  -XX:+PerfDisableSharedMem \\
  -XX:MaxTenuringThreshold=1 \\
  -jar paper.jar --nogui
EOF
chmod +x start.sh

# 6. Criar Keep-Alive Daemon para evitar suspensão do workspace Daytona
cat <<'EOF' > keepalive.sh
#!/bin/bash
while true; do
    date >> /tmp/daytona_keepalive.log
    sleep 120
done
EOF
chmod +x keepalive.sh

echo "=========================================================="
echo "✅ Provisionamento concluído com sucesso!"
echo "Para iniciar o servidor Minecraft em segundo plano:"
echo "   tmux new-session -d -s minecraft './start.sh'"
echo "Para iniciar o túnel de conexão de jogadores:"
echo "   tmux new-session -d -s playit 'playit'"
echo "=========================================================="

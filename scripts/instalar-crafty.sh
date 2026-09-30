#!/usr/bin/env bash
# ==============================================================================
# 🐝 BeeHost - Automação de Instalação do Crafty Controller v4 (Daytona)
# ==============================================================================
# Este script automatiza 100% da instalação e execução do Crafty Controller
# no container Daytona do cliente, liberando o painel web na porta 8443.
# ==============================================================================

set -e

CRAFTY_DIR="/home/daytona/crafty"
MINECRAFT_DIR="/home/daytona/minecraft"

echo "=========================================================="
echo "🐝 BeeHost - Instalando Crafty Controller (Painel do Cliente)"
echo "=========================================================="

# 1. Instalar dependências essenciais do sistema
echo "📦 [1/4] Instalando dependências de sistema (Python3, Venv, Git, Tmux)..."
sudo apt-get update -y
sudo apt-get install -y python3 python3-pip python3-venv git curl tmux jq

# 2. Clonar ou atualizar o repositório do Crafty 4
echo "📥 [2/4] Baixando repositório oficial do Crafty 4..."
mkdir -p /home/daytona
if [ ! -d "$CRAFTY_DIR" ]; then
    git clone https://gitlab.com/crafty-controller/crafty-4.git "$CRAFTY_DIR"
else
    echo "Diretório do Crafty já existe. Atualizando repositório..."
    cd "$CRAFTY_DIR" && git pull || true
fi

cd "$CRAFTY_DIR"

# 3. Configurar ambiente virtual Python e dependências
echo "🐍 [3/4] Configurando ambiente virtual Python e pacotes..."
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi

source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Criar script de inicialização padrão
cat <<'EOF' > "$CRAFTY_DIR/start.sh"
#!/usr/bin/env bash
cd /home/daytona/crafty
source .venv/bin/activate
exec python3 crafty.py
EOF
chmod +x "$CRAFTY_DIR/start.sh"

# 4. Iniciar o Crafty Controller em background via Tmux
echo "🚀 [4/4] Iniciando Crafty Controller em segundo plano (porta 8443)..."
tmux kill-session -t crafty 2>/dev/null || true
tmux new-session -d -s crafty '/home/daytona/crafty/start.sh'

sleep 5

echo "=========================================================="
echo "✅ Crafty Controller instalado e iniciado com sucesso!"
echo "=========================================================="
echo "🌐 Acesso ao Painel:"
echo "   - Abra a porta 8443 no dashboard do Daytona (app.daytona.io > Ports > 8443)"
echo "   - Endereço web: https://<workspace-port-8443>.app.daytona.io"
echo ""
echo "🔑 Obter usuário e senha inicial de administrador:"
echo "   Execute o comando:"
echo "   tmux attach -t crafty"
echo "   (Para sair da tela sem desligar, aperte: Ctrl+B e depois D)"
echo ""
echo "📂 Para importar o Minecraft do cliente no painel:"
echo "   - No Crafty, clique em 'Servers' > 'Import Existing Server'"
echo "   - Aponte para a pasta: $MINECRAFT_DIR"
echo "=========================================================="

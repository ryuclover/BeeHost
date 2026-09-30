# 🎮 Passo C: Painel Web do Cliente com Crafty Controller

> **Objetivo:** Dar ao cliente um painel web completo no navegador para ele ver o console do Minecraft, dar `/op`, colocar plugins, reiniciar o servidor e fazer downloads sem acessar seu SSH.

---

## 1. Por que o Crafty Controller?
* **Ultraleve:** Desenvolvido em Python, consome apenas ~150MB a 200MB de RAM (contra mais de 500MB do Pterodactyl).
* **100% Compatível com o Daytona:** Não exige Docker-in-Docker nem MySQL externo.
* **Interface Moderna:** Tema escuro, gráficos em tempo real de uso de memória e CPU, e gerenciador de arquivos web.

---

## 2. Instalação no Container do Daytona

### ⚡ Opção Rápida (1 Comando Automatizado - Recomendado)
No terminal do container Daytona, basta executar:
```bash
curl -sSL https://raw.githubusercontent.com/.../scripts/instalar-crafty.sh | bash
# Ou copie e cole o conteúdo de scripts/instalar-crafty.sh
```
O script instala dependências, baixa o Crafty, configura o `.venv`, cria o serviço e inicia na porta `8443` em segundo plano!

---

### 🛠️ Opção Manual (Passo a Passo)

No terminal do container Daytona:

### 🔹 Passo 1: Instalar dependências Python
```bash
sudo apt-get update
sudo apt-get install -y python3 python3-pip python3-venv git
```

### 🔹 Passo 2: Clonar o Crafty Controller
```bash
cd /home/daytona
git clone https://gitlab.com/crafty-controller/crafty-4.git crafty
cd crafty
```

### 🔹 Passo 3: Configurar o Ambiente Virtual e Dependências
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 🔹 Passo 4: Executar o Assistente Inicial
```bash
python3 crafty.py
```
O Crafty criará as configurações iniciais e exibirá o usuário administrador padrão (`admin`) e uma senha temporária.

### 🔹 Passo 5: Rodar o Crafty em Segundo Plano
Para mantê-lo rodando sempre:
```bash
tmux new-session -d -s crafty 'source /home/daytona/crafty/.venv/bin/activate && python3 /home/daytona/crafty/crafty.py'
```

---

## 3. Acessando o Painel Web
O Crafty escuta por padrão na porta `8443` (HTTPS).
* **Pelo Daytona:** No dashboard `app.daytona.io`, clique no seu workspace > **Ports** e abra a porta `8443` no navegador.
* **Importar o PaperMC já existente:**
  No painel do Crafty, clique em **Servers** > **Import Existing Server** e aponte para a pasta `/home/daytona/minecraft`.
  Pronto! O servidor que já configuramos passa a ser gerenciado pelo painel com console ao vivo!

---

## 4. Criar o Acesso do Cliente
1. No menu lateral do Crafty, vá em **Users** > **Create User**.
2. Crie o login para o cliente (ex: `joaozinho`).
3. Dê permissão apenas para o servidor dele.
4. Entregue o link e a senha para o cliente. Ele terá a experiência completa de uma hospedagem profissional!

---

✅ **Terminou este passo?** Avance para o [05-PASSO-D-WHATSAPP-E-SWAP-90.md](file:///c:/Users/gabri/Documentos/Pessoal/BeeHost/docs/05-PASSO-D-WHATSAPP-E-SWAP-90.md).

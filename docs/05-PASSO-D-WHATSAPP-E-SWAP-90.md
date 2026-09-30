# 📲 Passo D: WhatsApp e Swap aos $90 (Sem Nuvem Externa)

> **Objetivo:** Receber avisos automáticos no seu celular quando a conta atingir $90 de consumo (sobrando $10) e realizar a migração direta do container antigo para o novo em menos de 1 minuto, sem perder dados e sem gastar com backup pago.

---

## 1. Como Funciona a Evolution API
A Evolution API é uma aplicação que conecta ao seu WhatsApp via QR Code e fornece uma API REST simples para disparar mensagens.

### 🔹 Subindo a Evolution API via Docker
Na sua máquina ou VPS:
```bash
docker run -d \
  --name evolution-api \
  -p 8080:8080 \
  -e AUTHENTICATION_API_KEY=beehost_chave_secreta_123 \
  atendai/evolution-api:v2.1.1
```
1. Acesse `http://localhost:8080` (ou o IP da sua VPS).
2. Crie a instância chamada `beehost-alertas`.
3. Escaneie o QR Code no seu WhatsApp.

### 🔹 Ativar no Backend da BeeHost
No arquivo `.env` ou em [backend/dados/alertas.json](file:///c:/Users/gabri/Documentos/Pessoal/BeeHost/backend/dados/alertas.json):
```json
{
  "numeroDestino": "5511999999999",
  "saldoMinimoAlertaUSD": 10.0,
  "diasMinimosAlerta": 5,
  "webhookUrl": "http://localhost:8080",
  "apiKeyWhatsApp": "beehost_chave_secreta_123",
  "alertasAtivos": true
}
```

---

## 2. O Processo de Swap aos $90 Consumidos

Quando o saldo do Daytona chegar a **$10 restantes** ($90 consumidos), o WhatsApp apita com a mensagem:
> `🚨 ATENÇÃO: CRÉDITOS QUASE NO FIM! Saldo Restante: $10.00`

### 🔹 Passo 1: Criar o Novo Container Daytona
Com uma nova conta do Daytona (com novos $100 promocionais):
1. Crie o workspace `cliente-minecraft`.
2. Pegue o token SSH do novo workspace.

### 🔹 Passo 2: Migração Direta Máquina-a-Máquina
Como o container antigo **ainda está ligado e tem $10 de crédito**, não precisamos de storage externo!

No terminal do **container novo**, basta rodar o script automatizado da BeeHost:
```bash
./scripts/executar-swap.sh <TOKEN_SSH_ANTIGO>
```
*(O script sincroniza toda a pasta do Minecraft, mundos, configs do Crafty e sobe o servidor automaticamente em alta velocidade pela rede interna).*

### 🔹 Passo 3: Migrar o Túnel do Playit.gg
1. Copie o arquivo de identidade do Playit:
   ```bash
   scp daytona@<ssh-antigo>.app.daytona.io:/etc/playit/playit.toml /etc/playit/playit.toml
   ```
2. Inicie o Playit no novo container:
   ```bash
   tmux new-session -d -s playit 'playit'
   ```
3. Inicie o PaperMC no novo container:
   ```bash
   cd /home/daytona/minecraft
   tmux new-session -d -s minecraft './start.sh'
   ```

### 🔹 Passo 4: Desligar o Container Antigo
Depois de conferir que o novo está funcionando e que o IP é o mesmo, pode encerrar o workspace antigo com segurança.

---

✅ **Terminou este passo?** Avance para o [06-PASSO-E-ASAAS-PIX-AUTOMATICO.md](file:///c:/Users/gabri/Documentos/Pessoal/BeeHost/docs/06-PASSO-E-ASAAS-PIX-AUTOMATICO.md).

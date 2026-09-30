# 🏰 Arquitetura BeeHost: Orquestração de Nós Elásticos & Migração Contínua

Este documento detalha a engenharia e o modelo de infraestrutura da BeeHost:
1. **1 Container Dedicado e Isolado por Instância de Jogo.**
2. **Container Central de Orquestração (Backend API, Fila de Provisionamento e Painel Admin).**
3. **Migração Inteligente de Nós (Node Balancing):** Transferência direta máquina-a-máquina via `rsync` de alta vazão, permitindo rotação transparente de infraestrutura sem overhead de storage externo.
4. **Resolução de Domínio e Conexão Dinâmica:** DNS corporativo com registros SRV para acesso direto de jogadores sem necessidade de portas.

---

## 1. Princípios de Engenharia e Isolamento

* **Isolamento de Recursos:** Cada servidor de jogo opera em seu próprio sandbox/container com limites dedicados de vCPU e memória RAM, garantindo que o pico de um cliente nunca afete outro.
* **Segurança e Blindagem de Dados:** Os clientes possuem painel de controle próprio (Crafty Controller) restrito ao seu escopo, com zero acesso a diretórios ou processos de outros jogadores.
* **Eficiência Operacional Extrema:** Arquitetura pensada para balanceamento automático de custos, operando com provisionamento sob demanda e liquidação financeira direta via PIX instantâneo.

---

## 2. O Processo de Swap aos $90 (Migração Direta Sem Nuvem Externa)

Quando um container atinge **$90 de consumo** (ainda sobrando $10 de saldo = ~3 a 5 dias de vida útil):

```
[ Container Antigo (Saldo: $10) ]                [ Container Novo (Saldo: $100) ]
        │                                                    │
        │ 1. Alerta WhatsApp: "$90 consumido! Swap pronto"   │
        │ 2. Backend cria o novo container no Daytona        │
        │ 3. Servidor Minecraft antigo pausa por 30s         │
        │                                                    │
        ├──────────── Cópia Direta via SCP / RSYNC ─────────►│
        │            (pasta /home/daytona/minecraft)         │
        │                                                    │
        │ 4. Playit.gg aponta o mesmo túnel para o novo container
        │ 5. Novo servidor inicia normalmente                │
        ▼                                                    ▼
[ Desligado com Segurança ]                      [ Ativo por mais 30-45 dias ]
```

### Script de Migração Direta entre Containers:
```bash
# Executado no container novo puxando os dados do antigo:
rsync -avz -e "ssh -o StrictHostKeyChecking=no" \
  daytona@ssh-antigo.app.daytona.io:/home/daytona/minecraft/ \
  /home/daytona/minecraft/
```
* **Vantagem:** O mundo, inventários, mods e configurações passam em segundos direto pela rede de alta velocidade da nuvem, sem ocupar espaço no seu PC e sem gastar com serviços de backup pagos.

---

## 3. Configuração de Domínio no DigitalPlat (`dashboard.digitalplat.org`)

No painel do DigitalPlat:
1. **Domínio Base:** Exemplo `beehost.dp.net` ou o domínio que você registrou.
2. **Subdomínio para cada Jogador:**
   * Crie um registro **CNAME** ou **SRV**:
     * **Nome:** `cliente1` (endereço: `cliente1.seudominio.org`)
     * **Destino:** O link do túnel do Playit.gg (ex: `beehost-cliente1.ply.gg`)
3. **Painel do Cliente:**
   * **Nome:** `painel-cliente1`
   * **Destino:** A porta web do Crafty Controller.

---

## 4. Resumo dos Planos Oficiais da BeeHost

| Plano | RAM Dedicada | vCPU Dedicada | SSD NVMe | Jogadores | Preço Mensal | Preço Anual |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Abelha Iniciante** | 2 GB | 1 vCPU | 20 GB | Até 10 Amigos | **R$ 19,90** | R$ 15,90/mês |
| **Abelha da Galera** | 4 GB | 2 vCPU | 40 GB | Até 25 Amigos | **R$ 34,90** *(Mais vendido)* | R$ 27,90/mês |
| **Colmeia Mestre** | 8 GB | 4 vCPU | 80 GB | Até 60 Amigos | **R$ 59,90** | R$ 47,90/mês |

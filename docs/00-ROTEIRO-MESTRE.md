# 🐝 BeeHost - Roteiro Mestre de Execução (Passo a Passo)

Este é o mapa central da BeeHost. Os módulos foram organizados em ordem lógica (**A ➔ B ➔ C ➔ D ➔ E**) para você executar e testar cada etapa com calma e sem pressa.

---

## 📋 Checklist de Progresso

| Etapa | Arquivo do Guia | O que resolve | Status |
| :---: | :--- | :--- | :---: |
| 📖 | [01-ARQUITETURA-E-REGRAS.md](file:///c:/Users/gabri/Documentos/Pessoal/BeeHost/docs/01-ARQUITETURA-E-REGRAS.md) | Modelo 1 por cliente + Swap aos $90 + Regras oficiais | 🟢 Definido |
| **A** | [02-PASSO-A-PLAYIT-TUNEL.md](file:///c:/Users/gabri/Documentos/Pessoal/BeeHost/docs/02-PASSO-A-PLAYIT-TUNEL.md) | Túnel TCP Bore / Playit no Daytona para IP público gratuito de Minecraft | 🟢 Pronto no código |
| **B** | [03-PASSO-B-DOMINIO-DIGITALPLAT.md](file:///c:/Users/gabri/Documentos/Pessoal/BeeHost/docs/03-PASSO-B-DOMINIO-DIGITALPLAT.md) | Apontar domínio do DigitalPlat para o cliente conectar sem portas | 🟢 Pronto no código |
| **C** | [04-PASSO-C-CRAFTY-CONTROLLER.md](file:///c:/Users/gabri/Documentos/Pessoal/BeeHost/docs/04-PASSO-C-CRAFTY-CONTROLLER.md) | Painel web no container para o cliente ter console, mods e arquivos | 🟢 Pronto no código |
| **C.5** | [04.5-PASSO-C.5-PAINEL-DO-CLIENTE-E-LOGIN.md](file:///c:/Users/gabri/Documentos/Pessoal/BeeHost/docs/04.5-PASSO-C.5-PAINEL-DO-CLIENTE-E-LOGIN.md) | Login na vitrine + Painel do cliente para ver IP, status e comandos | 🟢 Concluído |
| **D** | [05-PASSO-D-WHATSAPP-E-SWAP-90.md](file:///c:/Users/gabri/Documentos/Pessoal/BeeHost/docs/05-PASSO-D-WHATSAPP-E-SWAP-90.md) | Evolution API + alerta no zap aos $90 + script de migração direta | 🟢 Pronto no código |
| **E** | [06-PASSO-E-ASAAS-PIX-AUTOMATICO.md](file:///c:/Users/gabri/Documentos/Pessoal/BeeHost/docs/06-PASSO-E-ASAAS-PIX-AUTOMATICO.md) | Checkout da vitrine gerando QR Code PIX e webhook de liberação automática | 🟢 Pronto no código |
| 🛠️ | [07-DAYTONA-MANUAL-OPERACIONAL.md](file:///c:/Users/gabri/Documentos/Pessoal/BeeHost/docs/07-DAYTONA-MANUAL-OPERACIONAL.md) | Guia operacional do terminal Daytona, SSH e comandos | 🟢 Disponível |

---

## 🎯 Arquitetura Oficial Adotada
* **1 Container Dedicado por Cliente:** 100% isolado, recursos dedicados (CPU/RAM), zero interferência de outros jogadores.
* **1 Container Central de Orquestração:** Dedicado para API de gerenciamento, esteira de provisionamento e painel de administração.
* **Migração Dinâmica de Nós (Node Balancing):** Migração direta máquina-a-máquina via `rsync` em menos de 30 segundos com zero perda de dados e sem dependência de storage externo.
* **Resolução de Domínio Automatizada:** Conexão direta transparente (`jogar.beehost.qd.je` via SRV) sem necessidade de portas complexas.

---

👉 **Para começar:** Abra o arquivo [02-PASSO-A-PLAYIT-TUNEL.md](file:///c:/Users/gabri/Documentos/Pessoal/BeeHost/docs/02-PASSO-A-PLAYIT-TUNEL.md) e siga as instruções.

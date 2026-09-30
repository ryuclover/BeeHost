# 🌐 Passo B: Domínio Gratuito no DigitalPlat

> **Objetivo:** Tirar o endereço feio do Playit (ex: `x8.ply.gg:12345`) e transformar em um endereço profissional com a sua marca usando o domínio gratuito em `dashboard.digitalplat.org`.

---

## 1. Por que usar o DigitalPlat?
* Seu domínio gratuito fica centralizado em um só lugar.
* Cada cliente ganha um subdomínio próprio, por exemplo:
  * `cliente1.seusite.org`
  * `cliente2.seusite.org`
* O cliente não precisa decorar portas esquisitas (`:28471`).

---

## 2. Passo a Passo de Configuração

### 🔹 Passo 1: Acessar o Dashboard
1. Entre em [dashboard.digitalplat.org/dashboard](https://dashboard.digitalplat.org/dashboard).
2. Vá na seção **DNS Management** ou **Zones / Subdomains** do seu domínio ativo.

### 🔹 Passo 2: Criar o Registro do Servidor (SRV ou CNAME)

O Minecraft suporta registros **SRV** para conectar na porta exata sem precisar digitá-la:

#### Opção 1: Registro SRV (Recomendado - Conecta sem precisar digitar a porta!)
* **Serviço:** `_minecraft`
* **Protocolo:** `_tcp`
* **Nome / Host:** `cliente1` (ou o nome que o cliente escolher)
* **Prioridade:** `0`
* **Peso (Weight):** `5`
* **Porta:** A porta informada pelo Playit.gg (ex: `28471`)
* **Destino (Target):** O host do Playit (ex: `beehost-1.ply.gg`)

#### Opção 2: Registro CNAME (Mais simples se o Playit der um link `.joinmc.link`)
* **Tipo:** `CNAME`
* **Nome:** `jogar` ou `cliente1`
* **Destino:** O endereço fornecido pelo Playit (ex: `sua-sala.gl.joinmc.link`)

---

## 3. Teste Final de Conexão
1. No Minecraft, adicione o servidor com o novo endereço:
   👉 **`cliente1.seusite.org`**
2. Se configurou com SRV, o Minecraft se conecta direto sem precisar colocar dois pontos e porta!

---

✅ **Terminou este passo?** Avance para o [04-PASSO-C-CRAFTY-CONTROLLER.md](file:///c:/Users/gabri/Documentos/Pessoal/BeeHost/docs/04-PASSO-C-CRAFTY-CONTROLLER.md).

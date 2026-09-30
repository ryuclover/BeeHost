# 🌐 Passo A: Conexão e IP Gratuito com Playit.gg

> **Objetivo:** Fazer o servidor de Minecraft que já está rodando no Daytona ficar acessível publicamente para qualquer jogador entrar, sem pagar por IP fixo ou VPS.

---

## 1. Por que usar o Playit.gg?
* **100% Gratuito:** Não cobra nada e não tem limite de dados transferidos.
* **Proteção DDoS Embutida:** Ataques no servidor são filtrados pela rede global do Playit antes de chegar no seu container do Daytona.
* **IP Persistente:** O endereço público gerado pode ser mantido quando fizermos o Swap de conta do Daytona aos $90.

---

## 2. Passo a Passo de Execução

### 🔹 Passo 1: Entrar no Terminal do Container Daytona
Abra o **Terminal Web** no painel da Daytona (`app.daytona.io`) ou conecte via SSH:
```bash
ssh <seu-token-ssh>@ssh.app.daytona.io
```

### 🔹 Passo 2: Baixar o Agente Playit
Cole o comando abaixo para baixar e dar permissão de execução:
```bash
curl -SsL -o /usr/local/bin/playit https://github.com/playit-cloud/playit-agent/releases/latest/download/playit-linux-amd64
chmod +x /usr/local/bin/playit
```

### 🔹 Passo 3: Iniciar o Playit em Background com `tmux`
```bash
tmux new-session -d -s playit 'playit'
```

### 🔹 Passo 4: Obter o Link de Reivindicação (Claim)
Veja a tela do Playit rodando com o comando:
```bash
tmux attach -t playit
```
Ele vai imprimir uma mensagem parecida com:
```text
Visit https://playit.gg/claim/abc1-def2 to claim this agent
```
1. Segure `Ctrl` e clique no link, ou copie e abra no seu navegador.
2. No site do Playit.gg:
   * Clique em **Add Tunnel**.
   * Selecione **Minecraft Java**.
   * Deixe a porta local em `127.0.0.1:25565`.
3. O Playit vai gerar o seu endereço público, por exemplo:
   👉 **`sua-sala.gl.joinmc.link`** ou **`beehost-1.ply.gg:28471`**

### 🔹 Passo 5: Testar no Minecraft!
1. Abra seu Minecraft (versão 1.20.4).
2. Vá em **Multiplayer** > **Direct Connection** (ou Adicionar Servidor).
3. Cole o endereço gerado pelo Playit.
4. **Pronto! Você entrará no servidor.**

Para sair da tela do `tmux` sem fechar o Playit, aperte:
`Ctrl + B` e depois solte e aperte a letra `D` (detach).

---

## 3. O que salvar para o Swap dos $90?
O Playit salva a identidade da sua máquina no arquivo `/etc/playit/playit.toml`.  
Quando for migrar para uma nova conta Daytona, basta manter o mesmo arquivo e o IP dos jogadores continua idêntico!

---

✅ **Terminou este passo?** Avance para o [03-PASSO-B-DOMINIO-DIGITALPLAT.md](file:///c:/Users/gabri/Documentos/Pessoal/BeeHost/docs/03-PASSO-B-DOMINIO-DIGITALPLAT.md).

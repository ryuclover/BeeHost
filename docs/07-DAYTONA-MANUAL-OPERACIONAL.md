# 🐝 BeeHost - Guia Operacional de Hospedagem Daytona

Manual prático para operar e revender servidores de jogos (iniciando com Minecraft) utilizando o crédito de $100 do Daytona Cloud, com rotação de contas a cada 1-2 meses.

---

## 1. Como Conectar ao Workspace Daytona

O Daytona fornece acesso via token SSH pelo gateway `ssh.app.daytona.io`.

### Comando de Conexão:
```bash
ssh <token>@ssh.app.daytona.io
```
*Exemplo com o token da sessão:*
```bash
ssh dtn_seu_token_aqui@ssh.app.daytona.io
```

> **Atenção:**
> - O workspace deve estar **Running** (ativo) no dashboard `app.daytona.io`. Se estiver *Stopped*, o gateway recusa a conexão imediatamente.
> - Os tokens SSH temporários têm validade padrão de 60 minutos. É possível gerar novos tokens pelo botão **SSH** no painel do Daytona.
> - Caso prefira, você também pode abrir o **Terminal Web** diretamente pelo navegador no dashboard do Daytona!

---

## 2. Passo a Passo: Provisionar Servidor Minecraft Novo

Assim que estiver conectado ao terminal do workspace (via SSH ou Web Terminal do Daytona):

### Passo 1: Executar o Bootstrap
```bash
curl -sSL https://raw.githubusercontent.com/.../daytona-minecraft.sh | bash
# Ou cole o conteúdo do script scripts/daytona-minecraft.sh
```
O script irá:
1. Instalar Java 21 LTS e utilitários.
2. Baixar a última versão do PaperMC.
3. Configurar flags de alta performance de memória (GC G1).
4. Instalar o **Playit.gg** para gerar um IP/Porta pública sem precisar de IPv4 fixo.

### Passo 2: Iniciar o Servidor
```bash
cd /home/daytona/minecraft
tmux new-session -d -s minecraft './start.sh'
```

### Passo 3: Iniciar o Túnel para os Jogadores Conectarem
```bash
tmux new-session -d -s playit 'playit'
```
- No primeiro uso, o Playit vai gerar um link de ativação no terminal (`https://playit.gg/claim/...`).
- Acesse o link no navegador para atribuir um domínio gratuito (ex: `cliente.beehost.ply.gg` ou seu domínio próprio `jogar.beehost.com.br`).
- **Pronto!** Os jogadores agora conectam diretamente por esse endereço no cliente Minecraft.

---

## 3. Roteiro de Migração de Contas (A cada 1-2 Meses)

Quando o saldo de $100 da conta estiver acabando ou a promoção expirar:

### 1. Na Conta Antiga:
1. Conecte ao workspace.
2. Execute o backup:
   ```bash
   /home/daytona/minecraft/daytona-sync.sh backup cliente-nome
   ```
   *Isso força o salvamento do mundo e gera o snapshot compactado.*

### 2. Na Nova Conta do Daytona:
1. Crie a nova conta e resgate os novos $100.
2. Inicie um novo workspace.
3. No terminal do novo workspace, rode o script de bootstrap.
4. Restaure o backup:
   ```bash
   /home/daytona/minecraft/daytona-sync.sh restore cliente-nome
   ```
5. No Playit.gg, aponte o mesmo túnel/domínio para o novo agente.
6. Inicie o servidor:
   ```bash
   tmux new-session -d -s minecraft './start.sh'
   ```

**Duração total da migração:** Menos de 3 minutos. Nenhum bloco ou progresso de jogador é perdido.

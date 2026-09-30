# 💰 Passo E: Cobrança Automática via PIX com Asaas

> **Objetivo:** Permitir que o cliente compre o plano de R$ 19,90, pague no PIX do banco dele e o backend libere o servidor no Daytona automaticamente assim que o pagamento for confirmado.

---

## 1. Como Criar sua Conta no Asaas
1. Acesse [asaas.com](https://www.asaas.com/) e crie uma conta gratuita (Pessoa Física ou Jurídica).
2. Para testar sem dinheiro real, você pode usar o ambiente de testes em [sandbox.asaas.com](https://sandbox.asaas.com/).
3. No painel do Asaas:
   * Vá em **Configurações da Conta** > **Integrações**.
   * Clique em **Gerar Chave de API** e copie o token gerado.

---

## 2. Configurando no Backend da BeeHost

Copie o arquivo [.env.example](file:///c:/Users/gabri/Documentos/Pessoal/BeeHost/.env.example) para `.env` na raiz do projeto:
```env
ASAAS_API_KEY=seu_token_da_api_asaas_aqui
ASAAS_AMBIENTE=sandbox   # Mude para 'producao' quando for vender de verdade
PORT=3001
ADMIN_TOKEN=beehost123
```
*(Se você ainda não tiver a chave de API cadastrada, o sistema ativa automaticamente o modo de simulação inteligente para testes sem quebrar nada).*

---

## 3. O Fluxo de Venda Integrado

```
1. Cliente clica em "Escolher Plano" no site
   │
2. Abre modal de Checkout pedindo Nome, E-mail e WhatsApp
   │
3. Frontend chama POST /api/publico/pedidos
   │
4. Backend chama Asaas API:
   POST https://api.asaas.com/v3/payments
   Body: { billingType: "PIX", value: 19.90, customer: "..." }
   │
5. Asaas devolve:
   - QR Code em imagem Base64
   - Chave Copia e Cola
   │
6. Modal exibe o QR Code na tela do cliente com contador de expiração
   │
7. Cliente paga no app do banco (Nubank, Inter, Itaú, etc.)
   │
8. Asaas avisa nosso backend via Webhook:
   POST /api/webhooks/asaas (PAYMENT_RECEIVED)
   │
9. Backend cria o workspace no Daytona e envia os acessos para o cliente!
```

---

## 4. Testando o Webhook Localmente
Para testar o webhook na sua máquina local antes de colocar em produção na nuvem, você pode usar o **ngrok** ou **localtunnel**:
```bash
npx localtunnel --port 3001
```
Cole a URL gerada nas configurações de Webhooks do painel do Asaas para o evento **Pagamento Recebido**.

---

🏁 **Com os 5 passos concluídos, a BeeHost opera como uma empresa de hospedagem 100% autônoma e profissional!**

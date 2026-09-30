/**
 * BeeHost - Esqueleto de Notificações via WhatsApp
 * -------------------------------------------------------------
 * Este módulo é responsável por:
 * 1. Calcular o consumo dos $100 da chave ativa e quanto falta para acabar.
 * 2. Formatar mensagens automáticas prontas para WhatsApp.
 * 3. Enviar para a API de WhatsApp da sua escolha (Evolution API, Z-API, Baileys ou Webhook).
 */

export class NotificadorWhatsApp {
  constructor(config = {}) {
    this.numeroDestino = config.numeroDestino || '5511999999999'; // Seu WhatsApp
    this.saldoMinimoAlertaUSD = config.saldoMinimoAlertaUSD || 10.00; // Alerta aos $90 consumidos (sobrando $10)
    this.diasMinimosAlerta = config.diasMinimosAlerta || 5; // Alerta quando faltar menos de 5 dias
    this.webhookUrl = config.webhookUrl || ''; // URL do seu serviço de WhatsApp (opcional)
    this.apiKeyWhatsApp = config.apiKeyWhatsApp || ''; // Chave do seu provedor de WhatsApp (opcional)
  }

  /**
   * Monta o texto bonito e formatado da mensagem para o WhatsApp
   */
  gerarMensagemConsumo({
    nomeConta,
    saldoTotalUSD = 100.00,
    saldoRestanteUSD,
    diasRestantesEstimados = 40,
    proximaChavePronta = false,
  }) {
    const valorConsumido = (saldoTotalUSD - saldoRestanteUSD).toFixed(2);
    const porcentagemConsumida = (((saldoTotalUSD - saldoRestanteUSD) / saldoTotalUSD) * 100).toFixed(0);
    const porcentagemRestante = (100 - parseFloat(porcentagemConsumida)).toFixed(0);

    const statusAlerta = saldoRestanteUSD <= this.saldoMinimoAlertaUSD
      ? '🚨 *ATENÇÃO: CRÉDITOS QUASE NO FIM!*'
      : '📊 *RELATÓRIO DE CONSUMO - BEEHOST*';

    return `${statusAlerta}
---------------------------------
🐝 *Conta Atual:* ${nomeConta}

💰 *Saldo Inicial:* $${saldoTotalUSD.toFixed(2)}
📉 *Já Consumido:* $${valorConsumido} (${porcentagemConsumida}%)
💵 *Saldo Restante:* $${saldoRestanteUSD.toFixed(2)} (${porcentagemRestante}%)

⏳ *Previsão de Duração:* ~${diasRestantesEstimados} dias restantes
---------------------------------
${
  proximaChavePronta
    ? '✅ *Fila de Swap:* Já tem uma nova chave de $100 engatilhada para troca rápida!'
    : '⚠️ *Fila de Swap Vazia:* Cadastre uma nova conta Daytona no painel para garantir a troca!'
}

_Acesse seu Painel Admin para fazer o Swap quando desejar._`;
  }

  /**
   * Checa se a conta atingiu a condição de disparo de alerta
   */
  deveDispararAlerta(saldoRestanteUSD, diasRestantes) {
    return saldoRestanteUSD <= this.saldoMinimoAlertaUSD || diasRestantes <= this.diasMinimosAlerta;
  }

  /**
   * Função para enviar a mensagem
   * (Aqui você pode conectar com Evolution API, Z-API ou disparar via Webhook)
   */
  async enviarMensagem(textoMensagem) {
    console.log('----------------------------------------------------');
    console.log(`📲 [WhatsApp Simulator] Enviando para: ${this.numeroDestino}`);
    console.log(textoMensagem);
    console.log('----------------------------------------------------');

    // SE você tiver uma URL de Webhook real (ex: Evolution API ou Z-API):
    if (this.webhookUrl) {
      try {
        const resposta = await fetch(this.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.apiKeyWhatsApp,
          },
          body: JSON.stringify({
            number: this.numeroDestino,
            text: textoMensagem,
          }),
        });
        return { enviado: true, respostaStatus: resposta.status };
      } catch (erro) {
        console.error('Erro ao conectar na API do WhatsApp:', erro);
        return { enviado: false, erro: erro.message };
      }
    }

    // Retorno simulado caso ainda não tenha contratado uma API de WhatsApp
    return {
      enviado: true,
      simulado: true,
      mensagem: 'Mensagem gerada com sucesso! Configure a URL do webhook para envio real.',
      conteudo: textoMensagem,
    };
  }
}

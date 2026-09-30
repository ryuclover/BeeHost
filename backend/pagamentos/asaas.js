// ==============================================================================
// 🐝 BeeHost - Integração Asaas API v3 (Cobrança Automática PIX + Webhook)
// ==============================================================================

export class AsaasApi {
  constructor(apiKey, ambiente = 'sandbox') {
    this.apiKey = apiKey || process.env.ASAAS_API_KEY || '';
    this.ambiente = ambiente || process.env.ASAAS_AMBIENTE || 'sandbox';
    this.baseUrl = this.ambiente === 'producao'
      ? 'https://api.asaas.com/v3'
      : 'https://sandbox.asaas.com/api/v3';
  }

  estaConfigurado() {
    return Boolean(this.apiKey && this.apiKey.length > 10);
  }

  async request(endpoint, method = 'GET', body = null) {
    if (!this.estaConfigurado()) {
      return null;
    }

    const headers = {
      'Content-Type': 'application/json',
      'access_token': this.apiKey,
    };

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return await res.json();
  }

  /**
   * Cria ou busca um cliente no Asaas
   */
  async obterOuCriarCliente({ nome, email, telefone, cpfCnpj }) {
    if (!this.estaConfigurado()) {
      return { id: `cus_simulado_${Date.now()}`, name: nome, email };
    }

    // Busca cliente por email
    const busca = await this.request(`/customers?email=${encodeURIComponent(email)}`);
    if (busca?.data?.length > 0) {
      return busca.data[0];
    }

    // Cria novo cliente
    const novo = await this.request('/customers', 'POST', {
      name: nome,
      email,
      mobilePhone: telefone || undefined,
      cpfCnpj: cpfCnpj || undefined,
      notificationDisabled: false,
    });

    return novo;
  }

  /**
   * Gera uma cobrança via PIX
   */
  async criarCobrancaPix({ clienteId, valor, descricao, pedidoId }) {
    if (!this.estaConfigurado()) {
      // Modo Mock Simulado para testes rápidos
      const agora = new Date();
      const expira = new Date(agora.getTime() + 15 * 60 * 1000); // 15 minutos
      return {
        sucesso: true,
        modo: 'simulado',
        cobrancaId: `pay_sim_${Date.now()}`,
        status: 'PENDING',
        valor,
        descricao,
        copiaECola: `00020126580014br.gov.bcb.pix0136beehost-${pedidoId}-pix520400005303986540${valor.toFixed(2)}5802BR5915BeeHost Cloud6009Sao Paulo62070503***6304ABCD`,
        qrCodeBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        expiraEm: expira.toISOString(),
      };
    }

    // Chamada real ao Asaas
    const dataVencimento = new Date();
    dataVencimento.setDate(dataVencimento.getDate() + 1);
    const vencimentoStr = dataVencimento.toISOString().split('T')[0];

    const cobranca = await this.request('/payments', 'POST', {
      customer: clienteId,
      billingType: 'PIX',
      value: valor,
      dueDate: vencimentoStr,
      description: descricao || 'Assinatura BeeHost Servidor de Jogos',
      externalReference: pedidoId,
    });

    if (!cobranca?.id) {
      throw new Error(cobranca?.errors?.[0]?.description || 'Erro ao criar cobrança no Asaas');
    }

    // Buscar QR Code e Código Pix Copia e Cola
    const pixData = await this.request(`/payments/${cobranca.id}/pixQrCode`);

    return {
      sucesso: true,
      modo: 'real',
      cobrancaId: cobranca.id,
      status: cobranca.status,
      valor: cobranca.value,
      descricao: cobranca.description,
      copiaECola: pixData?.payload || '',
      qrCodeBase64: pixData?.encodedImage || '',
      expiraEm: pixData?.expirationDate || '',
    };
  }

  /**
   * Consulta o status de um pagamento
   */
  async consultarStatus(cobrancaId) {
    if (!this.estaConfigurado() || cobrancaId.startsWith('pay_sim_')) {
      return { status: 'RECEIVED', pago: true };
    }

    const cobranca = await this.request(`/payments/${cobrancaId}`);
    return {
      status: cobranca?.status,
      pago: ['RECEIVED', 'CONFIRMED', 'DUNNING_RECEIVED'].includes(cobranca?.status),
    };
  }
}

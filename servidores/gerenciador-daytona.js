/**
 * BeeHost - Orquestrador de Nós em Nuvem (Cloud Node Manager)
 * Gerencia a alocação de nós dedicados, monitoramento de instâncias e balanceamento de recursos.
 */

import https from 'https';

export class GerenciadorDaytona {
  constructor(chaveApi) {
    this.chaveApi = chaveApi || process.env.DAYTONA_API_KEY || '';
    this.urlBase = 'https://app.daytona.io/api';
  }

  trocarConta(novaChave) {
    this.chaveApi = novaChave;
  }

  async fazerRequisicao(caminho, metodo = 'GET', dados = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.urlBase}${caminho}`);
      const requisicao = https.request({
        hostname: url.hostname,
        port: 443,
        path: url.pathname + url.search,
        method: metodo,
        headers: {
          'Authorization': `Bearer ${this.chaveApi}`,
          'Content-Type': 'application/json',
        }
      }, (resposta) => {
        let texto = '';
        resposta.on('data', pedaco => texto += pedaco);
        resposta.on('end', () => {
          try {
            resolve({ status: resposta.statusCode, dados: JSON.parse(texto) });
          } catch {
            resolve({ status: resposta.statusCode, respostaBruta: texto });
          }
        });
      });

      requisicao.on('error', reject);
      if (dados) requisicao.write(JSON.stringify(dados));
      requisicao.end();
    });
  }

  async listarMaquinas() {
    return this.fazerRequisicao('/sandbox');
  }

  async criarNovaMaquina(nome = 'beehost-minecraft') {
    return this.fazerRequisicao('/sandbox', 'POST', { name: nome });
  }

  async pegarComandoAcesso(idDaMaquina) {
    const res = await this.fazerRequisicao(`/sandbox/${idDaMaquina}/ssh-access`, 'POST', {});
    return res.dados?.sshCommand || null;
  }

  async apagarMaquina(idDaMaquina) {
    return this.fazerRequisicao(`/sandbox/${idDaMaquina}`, 'DELETE');
  }
}

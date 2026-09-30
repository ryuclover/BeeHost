import https from 'https';

export class DaytonaApi {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://app.daytona.io/api';
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  async request(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.baseUrl}${path}`);
      const req = https.request({
        hostname: url.hostname,
        port: 443,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });

      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }

  async listarMaquinas() {
    return this.request('/sandbox');
  }

  async criarMaquina(nome = 'beehost-minecraft') {
    return this.request('/sandbox', 'POST', { name });
  }

  async gerarAcessoSSH(sandboxId) {
    const res = await this.request(`/sandbox/${sandboxId}/ssh-access`, 'POST', {});
    return res.data?.sshCommand || null;
  }

  async apagarMaquina(sandboxId) {
    return this.request(`/sandbox/${sandboxId}`, 'DELETE');
  }

  async testarChave() {
    const res = await this.request('/sandbox');
    return res.status === 200;
  }
}

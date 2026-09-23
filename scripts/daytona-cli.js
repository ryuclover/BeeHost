#!/usr/bin/env node
import https from 'https';
import fs from 'fs';

const API_KEY = process.env.DAYTONA_API_KEY || 'dtn_e239e571ca9535afdc7945d7671275c86cfe84bda0dd7aebad5b9e38ac3245a9';
const BASE_URL = 'https://app.daytona.io/api';

function request(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function main() {
  const [,, cmd, ...args] = process.argv;

  if (cmd === 'list') {
    const res = await request('/sandbox');
    console.log(JSON.stringify(res.data, null, 2));
  } else if (cmd === 'create') {
    const name = args[0] || 'beehost-minecraft';
    const cpu = parseInt(args[1] || '2', 10);
    const memory = parseInt(args[2] || '4', 10);
    const disk = parseInt(args[3] || '20', 10);

    console.log(`🐝 Criando Sandbox "${name}" (${cpu} vCPU, ${memory} GiB RAM, ${disk} GiB Disco)...`);
    const res = await request('/sandbox', 'POST', {
      name,
      cpu,
      memory,
      disk,
    });
    console.log('Resultado da criação:');
    console.log(JSON.stringify(res.data, null, 2));
  } else if (cmd === 'ssh') {
    const sandboxId = args[0];
    if (!sandboxId) {
      console.error('Informe o sandboxId');
      process.exit(1);
    }
    const res = await request(`/sandbox/${sandboxId}/ssh-access`, 'POST', {});
    console.log('Comando SSH gerado:');
    console.log(res.data?.sshCommand || JSON.stringify(res.data, null, 2));
  } else if (cmd === 'delete') {
    const sandboxId = args[0];
    if (!sandboxId) {
      console.error('Informe o sandboxId');
      process.exit(1);
    }
    const res = await request(`/sandbox/${sandboxId}`, 'DELETE');
    console.log(`Sandbox ${sandboxId} removido:`, res.status);
  } else {
    console.log(`Uso:
  node scripts/daytona-cli.js list
  node scripts/daytona-cli.js create [nome] [cpu] [memory_gb] [disk_gb]
  node scripts/daytona-cli.js ssh <sandboxId>
  node scripts/daytona-cli.js delete <sandboxId>
`);
  }
}

main().catch(console.error);

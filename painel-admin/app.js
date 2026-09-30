const API_URL = window.location.origin;

let adminToken = sessionStorage.getItem('beehost-admin-token');

// Elementos
const telaLogin = document.getElementById('tela-login');
const painelPrincipal = document.getElementById('painel-principal');
const formLogin = document.getElementById('form-login');
const erroLogin = document.getElementById('erro-login');
const btnSair = document.getElementById('btn-sair');

// Início
if (adminToken) {
  mostrarPainel();
} else {
  mostrarLogin();
}

// ---------------------------------------------
// Autenticação
// ---------------------------------------------
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  const senha = document.getElementById('senha-admin').value;

  try {
    const res = await fetch(`${API_URL}/api/admin/resumo`, {
      headers: { 'x-admin-token': senha }
    });

    if (res.ok) {
      adminToken = senha;
      sessionStorage.setItem('beehost-admin-token', senha);
      erroLogin.classList.add('escondido');
      mostrarPainel();
    } else {
      erroLogin.classList.remove('escondido');
    }
  } catch (err) {
    erroLogin.textContent = 'Erro ao conectar à API. O backend está rodando?';
    erroLogin.classList.remove('escondido');
  }
});

btnSair.addEventListener('click', () => {
  sessionStorage.removeItem('beehost-admin-token');
  adminToken = null;
  mostrarLogin();
});

function mostrarLogin() {
  telaLogin.classList.remove('escondido');
  painelPrincipal.classList.add('escondido');
}

function mostrarPainel() {
  telaLogin.classList.add('escondido');
  painelPrincipal.classList.remove('escondido');
  carregarTudo();
}

// ---------------------------------------------
// Helper de Requisição Segura à API
// ---------------------------------------------
async function fetchAdmin(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'x-admin-token': adminToken,
    ...options.headers,
  };
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (res.status === 401) {
    btnSair.click();
    throw new Error('Não autorizado');
  }
  return res.json();
}

async function carregarTudo() {
  await Promise.all([
    carregarResumo(),
    carregarFila(),
    carregarWhatsApp(),
    carregarContas(),
    carregarServidores(),
  ]);
}

// 1. Resumo do Negócio
async function carregarResumo() {
  try {
    const data = await fetchAdmin('/api/admin/resumo');
    if (data.sucesso) {
      document.getElementById('metrica-servidores').textContent = `${data.servidoresAtivos} Servidor${data.servidoresAtivos > 1 ? 'es' : ''}`;
      document.getElementById('metrica-saldo').textContent = `~ $${data.saldoEstimadoUSD.toFixed(2)}`;
      document.getElementById('metrica-dias').textContent = `~ ${data.diasRestantesEstimados} dias`;
      document.getElementById('conta-ativa-nome').textContent = data.contaAtivaNome;
    }
  } catch (e) {
    console.error('Erro ao carregar resumo:', e);
  }
}

// 2. Fila de Swap & Reabastecimento
async function carregarFila() {
  try {
    const data = await fetchAdmin('/api/admin/fila');
    if (!data.sucesso) return;

    const { esteira, historicoSwaps } = data;
    const chaveAtual = esteira.chaveEmUso;
    const proxima = esteira.proximaDaFila;

    // Atualiza Chave Atual & Barra de Progresso
    if (chaveAtual) {
      const saldoTotal = 100.00;
      const saldoRestante = chaveAtual.saldoEstimadoUSD || 98.50;
      const consumido = (saldoTotal - saldoRestante).toFixed(2);
      const pctConsumida = (((saldoTotal - saldoRestante) / saldoTotal) * 100).toFixed(0);

      document.getElementById('fila-atual-subtitulo').textContent = `${chaveAtual.nome} (Adicionada em ${chaveAtual.dataAdicao})`;
      document.getElementById('fila-consumo-txt').textContent = `$${consumido} (${pctConsumida}%)`;
      document.getElementById('fila-restante-txt').textContent = `$${saldoRestante.toFixed(2)} (${100 - pctConsumida}%)`;
      document.getElementById('barra-progresso').style.width = `${Math.max(2, pctConsumida)}%`;
    }

    // Atualiza Próxima na Fila
    const proximaBox = document.getElementById('fila-proxima-box');
    const btnSwap = document.getElementById('btn-executar-swap');

    if (proxima) {
      btnSwap.disabled = false;
      proximaBox.innerHTML = `
        <div class="flex-entre">
          <div>
            <h4 style="font-weight: 700; color: #fde68a;">${proxima.nome}</h4>
            <p style="font-size: 0.75rem; color: #94a3b8; font-family: monospace; margin-top: 0.25rem;">
              Chave: ${proxima.chaveApi.slice(0, 10)}...${proxima.chaveApi.slice(-6)} · Status: Pronta para entrar
            </p>
          </div>
          <span class="badge badge-ativa">Pronta na Fila</span>
        </div>
      `;
    } else {
      btnSwap.disabled = true;
      proximaBox.innerHTML = `
        <p style="color: #94a3b8; font-size: 0.8125rem;">
          ⚠️ Nenhuma chave na fila de reserva no momento. Cadastre uma nova chave abaixo para deixar o swap engatilhado!
        </p>
      `;
    }

    // Histórico de Swaps
    const historicoBox = document.getElementById('fila-historico');
    if (historicoSwaps && historicoSwaps.length > 0) {
      historicoBox.innerHTML = historicoSwaps.map(h => `
        <div class="item-linha">
          <div class="item-info">
            <h4>Swap realizado em ${h.dataHora}</h4>
            <p>Conta anterior: <code>${h.contaAntiga}</code> ➔ Nova conta ativa: <strong style="color: #10b981;">${h.contaNova}</strong></p>
          </div>
        </div>
      `).join('');
    } else {
      historicoBox.innerHTML = '<p class="carregando">Nenhum swap realizado recentemente.</p>';
    }

  } catch (e) {
    console.error('Erro ao carregar fila:', e);
  }
}

// Executar Swap
document.getElementById('btn-executar-swap').addEventListener('click', async () => {
  if (!confirm('Deseja executar o Swap agora?\n\nA conta atual será arquivada como esgotada e a próxima conta da fila assumirá o comando imediatamente.')) return;

  try {
    const res = await fetchAdmin('/api/admin/fila/swap', { method: 'POST' });
    if (res.sucesso) {
      alert(`⚡ ${res.mensagem}`);
      await carregarTudo();
    } else {
      alert(res.erro || 'Erro ao fazer swap.');
    }
  } catch (e) {
    alert('Erro ao executar swap.');
  }
});

// Adicionar à Fila (Reabastecer)
document.getElementById('form-reabastecer-fila').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('fila-nome').value;
  const chaveApi = document.getElementById('fila-chave').value;

  try {
    const res = await fetchAdmin('/api/admin/contas', {
      method: 'POST',
      body: JSON.stringify({ nome, chaveApi }),
    });

    if (res.sucesso) {
      document.getElementById('fila-nome').value = '';
      document.getElementById('fila-chave').value = '';
      await carregarFila();
      await carregarContas();
      alert('Nova chave adicionada ao estoque da fila!');
    }
  } catch (e) {
    alert('Erro ao adicionar chave.');
  }
});

// 3. Alertas WhatsApp
async function carregarWhatsApp() {
  try {
    const data = await fetchAdmin('/api/admin/alertas/whatsapp');
    if (data.sucesso && data.config) {
      document.getElementById('zap-numero').value = data.config.numeroDestino || '';
      document.getElementById('zap-saldo-minimo').value = String(data.config.saldoMinimoAlertaUSD || '15');
      document.getElementById('zap-dias-minimos').value = String(data.config.diasMinimosAlerta || '5');
      document.getElementById('zap-webhook-url').value = data.config.webhookUrl || '';
    }
    // Gera pré-visualização automática
    await simularMensagemWhatsApp();
  } catch (e) {
    console.error('Erro ao carregar configurações de WhatsApp:', e);
  }
}

// Salvar Configurações de WhatsApp
document.getElementById('form-config-whatsapp').addEventListener('submit', async (e) => {
  e.preventDefault();
  const numeroDestino = document.getElementById('zap-numero').value;
  const saldoMinimoAlertaUSD = parseFloat(document.getElementById('zap-saldo-minimo').value);
  const diasMinimosAlerta = parseInt(document.getElementById('zap-dias-minimos').value, 10);
  const webhookUrl = document.getElementById('zap-webhook-url').value;

  try {
    const res = await fetchAdmin('/api/admin/alertas/whatsapp', {
      method: 'POST',
      body: JSON.stringify({
        numeroDestino,
        saldoMinimoAlertaUSD,
        diasMinimosAlerta,
        webhookUrl,
      }),
    });

    if (res.sucesso) {
      alert('Configurações de alerta salvas com sucesso!');
      await simularMensagemWhatsApp();
    }
  } catch (e) {
    alert('Erro ao salvar configurações.');
  }
});

// Testar/Simular Mensagem
document.getElementById('btn-testar-zap').addEventListener('click', simularMensagemWhatsApp);

async function simularMensagemWhatsApp() {
  try {
    const res = await fetchAdmin('/api/admin/alertas/whatsapp/teste', { method: 'POST' });
    if (res.sucesso) {
      document.getElementById('zap-preview-texto').textContent = res.mensagemGerada;
    }
  } catch (e) {
    console.error('Erro ao simular mensagem:', e);
  }
}

// 4. Todas as Contas Daytona
async function carregarContas() {
  const container = document.getElementById('lista-contas');
  try {
    const data = await fetchAdmin('/api/admin/contas');
    if (!data.sucesso) return;

    document.getElementById('contas-qtd').textContent = data.contas.length;

    if (data.contas.length === 0) {
      container.innerHTML = '<p class="carregando">Nenhuma conta cadastrada.</p>';
      return;
    }

    container.innerHTML = data.contas.map(c => `
      <div class="item-linha">
        <div class="item-info">
          <h4>
            ${c.nome}
            <span class="badge ${c.estaAtiva ? 'badge-ativa' : (c.situacao === 'esgotada' ? 'badge-reserva' : 'badge-ativa')}">
              ${c.estaAtiva ? 'Em Uso Agora' : (c.situacao === 'esgotada' ? 'Esgotada / Arquivada' : 'Na Fila de Espera')}
            </span>
          </h4>
          <p>Chave: <code>${c.chaveMascarada}</code> · Adicionada em ${c.dataAdicao}</p>
        </div>
        <div class="item-acoes">
          ${!c.estaAtiva ? `
            <button class="btn btn-primario sm" onclick="ativarConta('${c.id}')">Tornar Principal</button>
          ` : ''}
          <button class="btn btn-secundario sm" onclick="apagarConta('${c.id}')">Excluir</button>
        </div>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = '<p class="erro">Erro ao carregar contas.</p>';
  }
}

window.ativarConta = async function(id) {
  try {
    await fetchAdmin(`/api/admin/contas/${id}/ativar`, { method: 'PUT' });
    await carregarTudo();
  } catch (e) {
    alert('Erro ao ativar conta.');
  }
};

window.apagarConta = async function(id) {
  if (!confirm('Tem certeza que deseja apagar essa conta?')) return;
  try {
    const res = await fetchAdmin(`/api/admin/contas/${id}`, { method: 'DELETE' });
    if (res.sucesso) {
      await carregarTudo();
    } else {
      alert(res.erro || 'Erro ao apagar.');
    }
  } catch (e) {
    alert('Erro ao apagar conta.');
  }
};

// 5. Servidores Daytona
async function carregarServidores() {
  const container = document.getElementById('lista-servidores');
  try {
    const data = await fetchAdmin('/api/admin/servidores');
    if (!data.sucesso) return;

    const lista = data.servidores || [];
    document.getElementById('servidores-qtd').textContent = lista.length;

    if (lista.length === 0) {
      container.innerHTML = '<p class="carregando">Nenhum servidor criado nesta conta ainda.</p>';
      return;
    }

    container.innerHTML = lista.map(s => `
      <div class="item-linha">
        <div class="item-info">
          <h4>
            ${s.name}
            <span class="badge badge-ativa">${s.state === 'started' ? 'Online (Porta 25565)' : s.state}</span>
          </h4>
          <p>ID: <code>${s.id}</code> · Região: ${s.target || 'Padrão'} · Criado em: ${new Date(s.createdAt).toLocaleDateString('pt-BR')}</p>
        </div>
        <div class="item-acoes">
          <button class="btn btn-secundario sm" onclick="pegarSSH('${s.id}')">Pegar Acesso SSH</button>
          <button class="btn btn-primario sm" onclick="abrirModal()">Trocar de Conta</button>
        </div>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = '<p class="erro">Erro ao buscar servidores na conta ativa.</p>';
  }
}

document.getElementById('btn-criar-servidor').addEventListener('click', async () => {
  const nome = prompt('Nome do novo servidor:', 'beehost-minecraft-2');
  if (!nome) return;

  try {
    const res = await fetchAdmin('/api/admin/servidores/criar', {
      method: 'POST',
      body: JSON.stringify({ nome }),
    });

    if (res.sucesso) {
      alert('Servidor criado no Daytona com sucesso!');
      await carregarServidores();
      await carregarResumo();
    }
  } catch (e) {
    alert('Erro ao criar servidor.');
  }
});

window.pegarSSH = async function(id) {
  try {
    const res = await fetchAdmin(`/api/admin/servidores/${id}/ssh`, { method: 'POST' });
    if (res.comandoSSH) {
      navigator.clipboard.writeText(res.comandoSSH);
      alert(`Comando copiado para sua área de transferência:\n\n${res.comandoSSH}`);
    } else {
      alert('Não foi possível gerar o comando SSH no momento.');
    }
  } catch (e) {
    alert('Erro ao obter acesso SSH.');
  }
};

// ---------------------------------------------
// Controle de Abas
// ---------------------------------------------
document.querySelectorAll('.aba-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.aba-btn').forEach(b => b.classList.remove('ativa'));
    document.querySelectorAll('.conteudo-aba').forEach(c => c.classList.add('escondido'));

    btn.classList.add('ativa');
    const alvo = btn.dataset.aba;
    document.getElementById(`aba-${alvo}`).classList.remove('escondido');
  });
});

// ---------------------------------------------
// Modal de Migração
// ---------------------------------------------
const modal = document.getElementById('modal-migracao');
document.getElementById('btn-abrir-migracao').addEventListener('click', abrirModal);
document.getElementById('btn-fechar-modal').addEventListener('click', fecharModal);

function abrirModal() {
  modal.classList.remove('escondido');
}

function fecharModal() {
  modal.classList.add('escondido');
}

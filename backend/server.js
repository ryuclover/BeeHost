import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DaytonaApi } from './gerenciador.js';
import { NotificadorWhatsApp } from './notificacoes/whatsapp.js';
import { GerenciadorFilaChaves } from './gerenciador-fila.js';
import { AsaasApi } from './pagamentos/asaas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'beehost123';
const ARQUIVO_CONTAS = path.join(__dirname, 'dados', 'contas.json');
const ARQUIVO_ALERTAS = path.join(__dirname, 'dados', 'alertas.json');
const ARQUIVO_CLIENTES = path.join(__dirname, 'dados', 'clientes.json');
const ARQUIVO_PEDIDOS = path.join(__dirname, 'dados', 'pedidos.json');

const filaChaves = new GerenciadorFilaChaves();
const asaas = new AsaasApi();

function lerPedidos() {
  try {
    if (!fs.existsSync(ARQUIVO_PEDIDOS)) return [];
    return JSON.parse(fs.readFileSync(ARQUIVO_PEDIDOS, 'utf-8'));
  } catch (e) {
    console.error('Erro ao ler pedidos:', e);
    return [];
  }
}

function salvarPedidos(pedidos) {
  try {
    fs.writeFileSync(ARQUIVO_PEDIDOS, JSON.stringify(pedidos, null, 2), 'utf-8');
  } catch (e) {
    console.error('Erro ao salvar pedidos:', e);
  }
}

function lerClientes() {
  try {
    if (!fs.existsSync(ARQUIVO_CLIENTES)) return [];
    return JSON.parse(fs.readFileSync(ARQUIVO_CLIENTES, 'utf-8'));
  } catch (e) {
    console.error('Erro ao ler clientes:', e);
    return [];
  }
}

function salvarClientes(clientes) {
  try {
    fs.writeFileSync(ARQUIVO_CLIENTES, JSON.stringify(clientes, null, 2), 'utf-8');
  } catch (e) {
    console.error('Erro ao salvar clientes:', e);
  }
}

function lerConfigAlertas() {
  try {
    if (!fs.existsSync(ARQUIVO_ALERTAS)) {
      return {
        numeroDestino: '5511999999999',
        saldoMinimoAlertaUSD: 15.0,
        diasMinimosAlerta: 5,
        webhookUrl: '',
        apiKeyWhatsApp: '',
        alertasAtivos: true
      };
    }
    return JSON.parse(fs.readFileSync(ARQUIVO_ALERTAS, 'utf-8'));
  } catch {
    return { numeroDestino: '5511999999999', saldoMinimoAlertaUSD: 15.0, diasMinimosAlerta: 5, alertasAtivos: true };
  }
}

function salvarConfigAlertas(config) {
  try {
    fs.writeFileSync(ARQUIVO_ALERTAS, JSON.stringify(config, null, 2), 'utf-8');
  } catch (e) {
    console.error('Erro ao salvar alertas:', e);
  }
}

// Carrega as contas salvas
function lerContas() {
  try {
    if (!fs.existsSync(ARQUIVO_CONTAS)) return [];
    return JSON.parse(fs.readFileSync(ARQUIVO_CONTAS, 'utf-8'));
  } catch (e) {
    console.error('Erro ao ler contas:', e);
    return [];
  }
}

function salvarContas(contas) {
  try {
    fs.writeFileSync(ARQUIVO_CONTAS, JSON.stringify(contas, null, 2), 'utf-8');
  } catch (e) {
    console.error('Erro ao salvar contas:', e);
  }
}

function getContaAtiva() {
  const contas = lerContas();
  return contas.find(c => c.estaAtiva) || contas[0] || null;
}

// Planos da loja pública
const PLANOS_LOJA = [
  {
    id: 'plano-iniciante',
    nome: 'Abelha Iniciante',
    precoMensal: 19.90,
    precoAnual: 15.90,
    memoriaRam: '2 GB RAM',
    processador: '2 vCPU',
    armazenamento: '25 GB SSD',
    jogadores: '1 - 10 Amigos',
    jogo: 'Minecraft',
  },
  {
    id: 'plano-turma',
    nome: 'Abelha da Galera',
    precoMensal: 34.90,
    precoAnual: 27.90,
    memoriaRam: '4 GB RAM',
    processador: '3 vCPU',
    armazenamento: '50 GB SSD',
    jogadores: '10 - 25 Amigos',
    jogo: 'Minecraft',
    maisVendido: true,
  },
  {
    id: 'plano-colmeia',
    nome: 'Colmeia Mestre',
    precoMensal: 59.90,
    precoAnual: 47.90,
    memoriaRam: '8 GB RAM',
    processador: '4 vCPU',
    armazenamento: '100 GB SSD',
    jogadores: '25 - 60 Amigos',
    jogo: 'Minecraft',
  },
];

// Helper para ler body JSON
function lerBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function responderJson(res, statusCode, dados) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-token',
  });
  res.end(JSON.stringify(dados));
}

// Servidor HTTP
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Lidar com CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-token',
    });
    return res.end();
  }

  // ==========================================
  // ROTAS PÚBLICAS (Para a loja dos clientes)
  // ==========================================
  if (pathname === '/api/publico/planos' && req.method === 'GET') {
    return responderJson(res, 200, { sucesso: true, planos: PLANOS_LOJA });
  }

  if (pathname === '/api/publico/pedidos' && req.method === 'POST') {
    const body = await lerBody(req);
    console.log('📦 Novo pedido recebido da loja:', body);
    return responderJson(res, 201, {
      sucesso: true,
      mensagem: 'Pedido recebido com sucesso!',
      pedido: body,
    });
  }

  // 1. Criar Cobrança PIX
  if (pathname === '/api/publico/checkout/pix' && req.method === 'POST') {
    const body = await lerBody(req);
    const { planoId, periodo = 'mensal', nome, email, telefone, cpf } = body;

    const plano = PLANOS_LOJA.find(p => p.id === planoId) || PLANOS_LOJA[1];
    const valor = periodo === 'anual' ? plano.precoAnual * 12 : plano.precoMensal;
    const pedidoId = `ped-${Date.now()}`;

    try {
      const clienteAsaas = await asaas.obterOuCriarCliente({ nome, email, telefone, cpfCnpj: cpf });
      const pix = await asaas.criarCobrancaPix({
        clienteId: clienteAsaas.id,
        valor,
        descricao: `BeeHost - Plano ${plano.nome} (${periodo === 'anual' ? 'Anual' : 'Mensal'})`,
        pedidoId,
      });

      const pedidos = lerPedidos();
      const novoPedido = {
        id: pedidoId,
        cobrancaId: pix.cobrancaId,
        planoId: plano.id,
        planoNome: plano.nome,
        valor,
        periodo,
        status: 'pendente',
        cliente: { nome, email, telefone },
        copiaECola: pix.copiaECola,
        criadoEm: new Date().toISOString(),
      };
      pedidos.push(novoPedido);
      salvarPedidos(pedidos);

      return responderJson(res, 201, {
        sucesso: true,
        pedidoId,
        cobrancaId: pix.cobrancaId,
        valor,
        copiaECola: pix.copiaECola,
        qrCodeBase64: pix.qrCodeBase64,
        expiraEm: pix.expiraEm,
      });
    } catch (e) {
      console.error('Erro ao gerar PIX:', e);
      return responderJson(res, 500, { erro: e.message || 'Erro ao gerar cobrança PIX' });
    }
  }

  // 2. Consultar Status do Pedido / PIX
  const matchStatusPedido = pathname.match(/^\/api\/publico\/pedidos\/([^/]+)\/status$/);
  if (matchStatusPedido && req.method === 'GET') {
    const pedidoId = matchStatusPedido[1];
    const pedidos = lerPedidos();
    const pedido = pedidos.find(p => p.id === pedidoId);

    if (!pedido) {
      return responderJson(res, 404, { erro: 'Pedido não encontrado' });
    }

    return responderJson(res, 200, {
      sucesso: true,
      status: pedido.status,
      pago: pedido.status === 'pago',
    });
  }

  // 3. Simular Pagamento Imediato (Para testes rápidos de desenvolvimento)
  const matchSimular = pathname.match(/^\/api\/publico\/pedidos\/([^/]+)\/simular-pagamento$/);
  if (matchSimular && req.method === 'POST') {
    const pedidoId = matchSimular[1];
    const pedidos = lerPedidos();
    const pedido = pedidos.find(p => p.id === pedidoId);

    if (!pedido) {
      return responderJson(res, 404, { erro: 'Pedido não encontrado' });
    }

    pedido.status = 'pago';
    salvarPedidos(pedidos);

    // Provisiona cliente automaticamente
    const clientes = lerClientes();
    let cliente = clientes.find(c => c.email?.toLowerCase() === pedido.cliente.email?.toLowerCase());

    if (!cliente) {
      cliente = {
        id: `cli-${Date.now()}`,
        nome: pedido.cliente.nome,
        email: pedido.cliente.email,
        senha: '123',
        tokenSessao: `token-${Date.now()}`,
        planoId: pedido.planoId,
        planoNome: pedido.planoNome,
        jogo: 'Minecraft PaperMC 1.20.4',
        servidorId: `servidor-${pedidoId}`,
        ipConexao: 'jogar.beehost.qd.je',
        portaConexao: 38450,
        status: 'online',
        jogadoresOnline: '0 / 25',
        usoRam: '1.2 GB / 4.0 GB',
        usoCpu: '5%',
        craftyUrl: 'https://painel.beehost.qd.je:8443',
        craftyUser: pedido.cliente.email.split('@')[0],
        craftyPass: 'beeCrafty2026!',
        motd: `Servidor de ${pedido.cliente.nome}`,
        whitelist: false,
        vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        pagamentoStatus: 'ativo',
      };
      clientes.push(cliente);
      salvarClientes(clientes);
    }

    return responderJson(res, 200, {
      sucesso: true,
      mensagem: 'Pagamento aprovado e servidor provisionado!',
      cliente,
    });
  }

  // 4. Webhook Oficial do Asaas
  if (pathname === '/api/webhooks/asaas' && req.method === 'POST') {
    const evento = await lerBody(req);
    console.log('🔔 Webhook Asaas Recebido:', evento.event);

    if (['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED'].includes(evento.event)) {
      const cobrancaId = evento.payment?.id;
      const pedidos = lerPedidos();
      const pedido = pedidos.find(p => p.cobrancaId === cobrancaId);

      if (pedido) {
        pedido.status = 'pago';
        salvarPedidos(pedidos);

        // Auto-provisionamento de conta do cliente
        const clientes = lerClientes();
        const existe = clientes.some(c => c.email?.toLowerCase() === pedido.cliente.email?.toLowerCase());

        if (!existe) {
          clientes.push({
            id: `cli-${Date.now()}`,
            nome: pedido.cliente.nome,
            email: pedido.cliente.email,
            senha: '123',
            tokenSessao: `token-${Date.now()}`,
            planoId: pedido.planoId,
            planoNome: pedido.planoNome,
            jogo: 'Minecraft PaperMC 1.20.4',
            servidorId: `servidor-${pedido.id}`,
            ipConexao: 'jogar.beehost.qd.je',
            portaConexao: 38450,
            status: 'online',
            jogadoresOnline: '0 / 25',
            usoRam: '1.2 GB / 4.0 GB',
            usoCpu: '5%',
            craftyUrl: 'https://painel.beehost.qd.je:8443',
            motd: `Servidor de ${pedido.cliente.nome}`,
            whitelist: false,
            vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
            pagamentoStatus: 'ativo',
          });
          salvarClientes(clientes);
        }
      }
    }

    return responderJson(res, 200, { recebido: true });
  }

  // ==========================================
  // ROTAS DA ÁREA DO CLIENTE (/api/cliente/*)
  // ==========================================
  if (pathname === '/api/cliente/login' && req.method === 'POST') {
    const body = await lerBody(req);
    const { email, senha } = body;
    const clientes = lerClientes();
    const cliente = clientes.find(c => c.email?.toLowerCase() === email?.toLowerCase().trim());

    if (!cliente || cliente.senha !== senha) {
      return responderJson(res, 401, {
        erro: 'Credenciais inválidas',
        mensagem: 'E-mail ou senha incorretos. Dica de teste: demo@beehost.com / 123',
      });
    }

    const { senha: _, ...dadosPublicos } = cliente;
    return responderJson(res, 200, {
      sucesso: true,
      mensagem: `Bem-vindo de volta, ${cliente.nome}!`,
      token: cliente.tokenSessao,
      cliente: dadosPublicos,
    });
  }

  if (pathname.startsWith('/api/cliente/')) {
    const authHeader = req.headers['authorization'] || '';
    const tokenHeader = req.headers['x-cliente-token'];
    const token = tokenHeader || (authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null);

    const clientes = lerClientes();
    const clienteIndex = clientes.findIndex(c => c.tokenSessao === token);

    if (clienteIndex === -1) {
      return responderJson(res, 401, {
        erro: 'Não autorizado',
        mensagem: 'Sessão expirada ou token de cliente inválido. Faça login novamente.',
      });
    }

    const cliente = clientes[clienteIndex];

    // Obter dados do servidor do cliente
    if (pathname === '/api/cliente/servidor' && req.method === 'GET') {
      const { senha: _, ...dadosServidor } = cliente;
      return responderJson(res, 200, { sucesso: true, servidor: dadosServidor });
    }

    // Comandos rápidos: iniciar, parar, reiniciar
    if (pathname === '/api/cliente/servidor/comando' && req.method === 'POST') {
      const body = await lerBody(req);
      const acao = body.acao; // 'iniciar' | 'parar' | 'reiniciar'

      if (acao === 'iniciar') {
        cliente.status = 'online';
      } else if (acao === 'parar') {
        cliente.status = 'offline';
      } else if (acao === 'reiniciar') {
        cliente.status = 'reiniciando';
        setTimeout(() => {
          const cls = lerClientes();
          const idx = cls.findIndex(c => c.id === cliente.id);
          if (idx !== -1) {
            cls[idx].status = 'online';
            salvarClientes(cls);
          }
        }, 4000);
      } else {
        return responderJson(res, 400, { erro: 'Ação inválida. Use iniciar, parar ou reiniciar.' });
      }

      clientes[clienteIndex] = cliente;
      salvarClientes(clientes);

      return responderJson(res, 200, {
        sucesso: true,
        mensagem: `Comando '${acao}' executado com sucesso!`,
        novoStatus: cliente.status,
      });
    }

    // Configurações básicas (MOTD, Whitelist)
    if (pathname === '/api/cliente/servidor/config' && req.method === 'POST') {
      const body = await lerBody(req);
      if (body.motd !== undefined) cliente.motd = body.motd.trim();
      if (body.whitelist !== undefined) cliente.whitelist = Boolean(body.whitelist);

      clientes[clienteIndex] = cliente;
      salvarClientes(clientes);

      return responderJson(res, 200, {
        sucesso: true,
        mensagem: 'Configurações do servidor salvas com sucesso!',
        config: { motd: cliente.motd, whitelist: cliente.whitelist },
      });
    }
  }

  // ==========================================
  // VERIFICAÇÃO DE SEGURANÇA (Rotas do Admin)
  // ==========================================
  if (pathname.startsWith('/api/admin/')) {
    const token = req.headers['x-admin-token'];
    if (token !== ADMIN_TOKEN) {
      return responderJson(res, 401, {
        erro: 'Não autorizado',
        mensagem: 'Token de administrador incorreto ou ausente.',
      });
    }

    // 1. Resumo do Negócio (Métricas)
    if (pathname === '/api/admin/resumo' && req.method === 'GET') {
      const contaAtiva = getContaAtiva();
      let servidoresAtivos = 0;

      if (contaAtiva) {
        try {
          const api = new DaytonaApi(contaAtiva.chaveApi);
          const list = await api.listarMaquinas();
          servidoresAtivos = list.dados?.items?.length || 0;
        } catch {}
      }

      return responderJson(res, 200, {
        sucesso: true,
        servidoresAtivos,
        saldoEstimadoUSD: contaAtiva?.saldoEstimadoUSD || 98.50,
        diasRestantesEstimados: 40,
        custoVPS: 'R$ 0,00',
        contaAtivaNome: contaAtiva?.nome || 'Nenhuma',
      });
    }

    // 2. Listar Contas
    if (pathname === '/api/admin/contas' && req.method === 'GET') {
      const contas = lerContas().map(c => ({
        id: c.id,
        nome: c.nome,
        chaveMascarada: `${c.chaveApi.slice(0, 10)}...${c.chaveApi.slice(-6)}`,
        dataAdicao: c.dataAdicao,
        estaAtiva: c.estaAtiva,
        situacao: c.situacao,
      }));
      return responderJson(res, 200, { sucesso: true, contas });
    }

    // 3. Cadastrar Nova Conta ($100)
    if (pathname === '/api/admin/contas' && req.method === 'POST') {
      const body = await lerBody(req);
      if (!body.chaveApi) {
        return responderJson(res, 400, { erro: 'Chave de API obrigatória.' });
      }

      const contas = lerContas();
      const nova = {
        id: `conta-${Date.now()}`,
        nome: body.nome?.trim() || `Conta Daytona #${contas.length + 1}`,
        chaveApi: body.chaveApi.trim(),
        dataAdicao: new Date().toLocaleDateString('pt-BR'),
        estaAtiva: contas.length === 0,
        saldoEstimadoUSD: 100.00,
        situacao: contas.length === 0 ? 'ativa' : 'reserva',
      };

      contas.push(nova);
      salvarContas(contas);

      return responderJson(res, 201, { sucesso: true, mensagem: 'Conta cadastrada com sucesso!', conta: nova });
    }

    // 4. Ativar Conta
    const matchAtivar = pathname.match(/^\/api\/admin\/contas\/([^/]+)\/ativar$/);
    if (matchAtivar && req.method === 'PUT') {
      const id = matchAtivar[1];
      const contas = lerContas().map(c => ({
        ...c,
        estaAtiva: c.id === id,
        situacao: c.id === id ? 'ativa' : 'reserva',
      }));
      salvarContas(contas);
      return responderJson(res, 200, { sucesso: true, mensagem: 'Conta ativada com sucesso!' });
    }

    // 5. Deletar Conta
    const matchDeletar = pathname.match(/^\/api\/admin\/contas\/([^/]+)$/);
    if (matchDeletar && req.method === 'DELETE') {
      const id = matchDeletar[1];
      let contas = lerContas();
      if (contas.length <= 1) {
        return responderJson(res, 400, { erro: 'Você não pode apagar a única conta registrada.' });
      }
      contas = contas.filter(c => c.id !== id);
      if (!contas.some(c => c.estaAtiva) && contas.length > 0) {
        contas[0].estaAtiva = true;
        contas[0].situacao = 'ativa';
      }
      salvarContas(contas);
      return responderJson(res, 200, { sucesso: true, mensagem: 'Conta removida com sucesso!' });
    }

    // 6. Listar Servidores ao Vivo da Conta Ativa
    if (pathname === '/api/admin/servidores' && req.method === 'GET') {
      const conta = getContaAtiva();
      if (!conta) {
        return responderJson(res, 400, { erro: 'Nenhuma conta Daytona ativa.' });
      }

      const api = new DaytonaApi(conta.chaveApi);
      const resApi = await api.listarMaquinas();

      return responderJson(res, 200, {
        sucesso: true,
        conta: conta.nome,
        servidores: resApi.dados?.items || [],
      });
    }

    // 7. Criar Servidor na Conta Ativa
    if (pathname === '/api/admin/servidores/criar' && req.method === 'POST') {
      const conta = getContaAtiva();
      if (!conta) return responderJson(res, 400, { erro: 'Nenhuma conta ativa.' });

      const body = await lerBody(req);
      const nome = body.nome || 'beehost-minecraft';

      const api = new DaytonaApi(conta.chaveApi);
      const resApi = await api.criarMaquina(nome);

      return responderJson(res, 201, { sucesso: true, dados: resApi.dados });
    }

    // 8. Obter Comando SSH do Servidor
    const matchSSH = pathname.match(/^\/api\/admin\/servidores\/([^/]+)\/ssh$/);
    if (matchSSH && req.method === 'POST') {
      const id = matchSSH[1];
      const conta = getContaAtiva();
      if (!conta) return responderJson(res, 400, { erro: 'Nenhuma conta ativa.' });

      const api = new DaytonaApi(conta.chaveApi);
      const comando = await api.gerarAcessoSSH(id);

      return responderJson(res, 200, { sucesso: true, comandoSSH: comando });
    }

    // 9. Webhook de Notificação (Simulação / Discord)
    if (pathname === '/api/admin/webhook/notificar' && req.method === 'POST') {
      const body = await lerBody(req);
      console.log('📢 Notificação Webhook disparada:', body.mensagem);
      return responderJson(res, 200, { sucesso: true, mensagem: 'Webhook disparado!' });
    }

    // 10. Alertas WhatsApp - Obter Configuração
    if (pathname === '/api/admin/alertas/whatsapp' && req.method === 'GET') {
      const config = lerConfigAlertas();
      return responderJson(res, 200, { sucesso: true, config });
    }

    // 11. Alertas WhatsApp - Salvar Configuração
    if (pathname === '/api/admin/alertas/whatsapp' && req.method === 'POST') {
      const body = await lerBody(req);
      const atual = lerConfigAlertas();
      const novo = { ...atual, ...body };
      salvarConfigAlertas(novo);
      return responderJson(res, 200, { sucesso: true, mensagem: 'Configurações de alerta salvas!', config: novo });
    }

    // 12. Alertas WhatsApp - Testar Envio / Gerar Mensagem de Consumo
    if (pathname === '/api/admin/alertas/whatsapp/teste' && req.method === 'POST') {
      const config = lerConfigAlertas();
      const contaAtiva = getContaAtiva();
      const todas = lerContas();
      const esteira = filaChaves.organizarEsteira(todas);

      const notificador = new NotificadorWhatsApp(config);
      const texto = notificador.gerarMensagemConsumo({
        nomeConta: contaAtiva?.nome || 'Conta 01',
        saldoTotalUSD: 100.00,
        saldoRestanteUSD: contaAtiva?.saldoEstimadoUSD || 98.50,
        diasRestantesEstimados: 40,
        proximaChavePronta: esteira.podeFazerSwap,
      });

      const resultadoEnvio = await notificador.enviarMensagem(texto);
      return responderJson(res, 200, {
        sucesso: true,
        mensagemGerada: texto,
        resultado: resultadoEnvio,
      });
    }

    // 13. Fila de Swap de Chaves - Obter Esteira Completa
    if (pathname === '/api/admin/fila' && req.method === 'GET') {
      const todas = lerContas();
      const esteira = filaChaves.organizarEsteira(todas);
      return responderJson(res, 200, {
        sucesso: true,
        esteira,
        historicoSwaps: filaChaves.dados.historicoSwaps || [],
      });
    }

    // 14. Fila de Swap de Chaves - Executar Swap Imediato
    if (pathname === '/api/admin/fila/swap' && req.method === 'POST') {
      const todas = lerContas();
      const resultadoSwap = filaChaves.executarSwap(todas);

      if (!resultadoSwap.sucesso) {
        return responderJson(res, 400, { erro: resultadoSwap.erro });
      }

      salvarContas(resultadoSwap.contasAtualizadas);
      return responderJson(res, 200, {
        sucesso: true,
        mensagem: resultadoSwap.mensagem,
        registro: resultadoSwap.registroSwap,
      });
    }
  }

  // ==========================================
  // ARQUIVOS ESTÁTICOS DO PAINEL ADMIN
  // ==========================================
  const caminhoPainel = path.join(__dirname, '..', 'painel-admin');
  let arquivoAlvo = path.join(caminhoPainel, pathname === '/' ? 'index.html' : pathname);

  if (fs.existsSync(arquivoAlvo) && fs.statSync(arquivoAlvo).isFile()) {
    const ext = path.extname(arquivoAlvo);
    const tipos = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.svg': 'image/svg+xml',
      '.json': 'application/json',
    };
    res.writeHead(200, { 'Content-Type': tipos[ext] || 'text/plain' });
    return res.end(fs.readFileSync(arquivoAlvo));
  }

  // 404
  responderJson(res, 404, { erro: 'Não encontrado' });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🛡️  BeeHost Backend Seguro rodando em http://localhost:${PORT}`);
  console.log(`📊 Painel Admin dedicado: http://localhost:${PORT}/`);
  console.log(`🔑 Token de Admin: ${ADMIN_TOKEN}`);
  console.log(`=======================================================`);
});

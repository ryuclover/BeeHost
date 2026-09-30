/**
 * BeeHost - Gerenciador da Fila de Chaves Daytona (Esteira de Swap)
 * -----------------------------------------------------------------
 * Permite cadastrar várias contas com antecedência e fazer swap rápido
 * quando a conta atual estiver acabando o saldo de $100.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ARQUIVO_FILA = path.join(__dirname, 'dados', 'fila-chaves.json');

export class GerenciadorFilaChaves {
  constructor() {
    this.carregarDados();
  }

  carregarDados() {
    try {
      if (!fs.existsSync(ARQUIVO_FILA)) {
        this.dados = {
          chaveAtualId: 'conta-1',
          historicoSwaps: [],
        };
        this.salvarDados();
      } else {
        this.dados = JSON.parse(fs.readFileSync(ARQUIVO_FILA, 'utf-8'));
      }
    } catch {
      this.dados = { chaveAtualId: 'conta-1', historicoSwaps: [] };
    }
  }

  salvarDados() {
    try {
      fs.writeFileSync(ARQUIVO_FILA, JSON.stringify(this.dados, null, 2), 'utf-8');
    } catch (e) {
      console.error('Erro ao salvar fila:', e);
    }
  }

  /**
   * Retorna a esteira completa:
   * - Chave em Uso Agora
   * - Próxima Engatilhada (Pronta pro Swap)
   * - Chaves em Estoque/Reserva
   * - Histórico de Chaves Esgotadas
   */
  organizarEsteira(todasAsContas) {
    const ativa = todasAsContas.find(c => c.estaAtiva) || todasAsContas[0] || null;
    const outras = todasAsContas.filter(c => c.id !== ativa?.id && c.situacao !== 'esgotada');
    const proxima = outras.length > 0 ? outras[0] : null;
    const estoque = outras.slice(1);
    const esgotadas = todasAsContas.filter(c => c.situacao === 'esgotada');

    return {
      chaveEmUso: ativa,
      proximaDaFila: proxima,
      estoqueReserva: estoque,
      chavesEsgotadas: esgotadas,
      totalEstoqueDisponivel: outras.length,
      podeFazerSwap: proxima !== null,
    };
  }

  /**
   * Executa o Swap:
   * 1. A chave atual vira 'esgotada'.
   * 2. A próxima chave engatilhada vira 'ativa'.
   * 3. Registra o histórico com data/hora.
   */
  executarSwap(todasAsContas) {
    const esteira = this.organizarEsteira(todasAsContas);

    if (!esteira.proximaDaFila) {
      return {
        sucesso: false,
        erro: 'Não há nenhuma chave na fila de reserva para assumir o lugar da atual.',
      };
    }

    const contaAnterior = esteira.chaveEmUso;
    const novaContaAtiva = esteira.proximaDaFila;

    const contasAtualizadas = todasAsContas.map(conta => {
      if (conta.id === contaAnterior?.id) {
        return { ...conta, estaAtiva: false, situacao: 'esgotada' };
      }
      if (conta.id === novaContaAtiva.id) {
        return { ...conta, estaAtiva: true, situacao: 'ativa' };
      }
      return conta;
    });

    const registroSwap = {
      dataHora: new Date().toLocaleString('pt-BR'),
      contaAntiga: contaAnterior?.nome,
      contaNova: novaContaAtiva.nome,
    };

    this.dados.historicoSwaps.unshift(registroSwap);
    this.dados.chaveAtualId = novaContaAtiva.id;
    this.salvarDados();

    return {
      sucesso: true,
      mensagem: `Swap concluído! A conta "${novaContaAtiva.nome}" agora é a principal.`,
      contasAtualizadas,
      registroSwap,
    };
  }
}

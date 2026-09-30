/**
 * Modelos de dados para a área de vendas da BeeHost.
 */

export interface PlanoJogo {
  id: string;
  nome: string;
  precoMensal: number;
  precoAnual: number;
  memoriaRam: string;
  processador: string;
  armazenamento: string;
  vagasJogadores: string;
  vantagens: string[];
  maisVendido?: boolean;
  jogo: string;
}

export interface PedidoCliente {
  planoId: string;
  jogoId: string;
  periodo: 'mensal' | 'anual';
  nomeCliente?: string;
  contatoWhatsapp?: string;
  valorTotal: number;
}

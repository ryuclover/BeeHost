import type { PlanoJogo } from './tipos';

/**
 * Cria o link do WhatsApp para o cliente clicar e já mandar a mensagem pronta para você fechar a venda!
 */
export function criarLinkWhatsApp(opcoes: {
  telefone?: string;
  plano: PlanoJogo;
  periodo: 'mensal' | 'anual';
}) {
  const { telefone = '5511999999999', plano, periodo } = opcoes;
  const valor = periodo === 'anual' ? plano.precoAnual * 12 : plano.precoMensal;
  const textoPeriodo = periodo === 'anual' ? 'Anual' : 'Mensal';

  const mensagem = encodeURIComponent(
    `🐝 Olá BeeHost! Quero contratar um servidor de ${plano.jogo.toUpperCase()}:\n\n` +
    `• Plano: ${plano.nome} (${plano.memoriaRam})\n` +
    `• Período: ${textoPeriodo}\n` +
    `• Valor: R$ ${valor.toFixed(2).replace('.', ',')}\n\n` +
    `Como faço para pagar e ativar agora?`
  );

  return `https://wa.me/${telefone}?text=${mensagem}`;
}

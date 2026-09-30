import type { PlanoJogo } from './tipos';

/**
 * Planos em Reais (R$) para você vender barato e lucrar 100%.
 */
export const PLANOS_MINECRAFT: PlanoJogo[] = [
  {
    id: 'plano-iniciante',
    nome: 'Abelha Iniciante (Dedicado)',
    precoMensal: 19.90,
    precoAnual: 15.90,
    memoriaRam: '2 GB RAM Dedicada',
    processador: '1 vCPU Dedicada',
    armazenamento: '20 GB SSD NVMe',
    vagasJogadores: 'Até 10 Amigos',
    jogo: 'minecraft',
    vantagens: [
      'Container 100% Isolado e Dedicado',
      'Zero interferência de outros jogadores',
      'Painel Web Crafty Controller incluso',
      'Subdomínio gratuito pelo DigitalPlat',
      'Troca inteligente sem perda de mapa',
      'Suporta PaperMC e Spigot',
    ],
  },
  {
    id: 'plano-turma',
    nome: 'Abelha da Galera (Dedicado)',
    precoMensal: 34.90,
    precoAnual: 27.90,
    memoriaRam: '4 GB RAM Dedicada',
    processador: '2 vCPU Dedicada',
    armazenamento: '40 GB SSD NVMe',
    vagasJogadores: 'Até 25 Amigos',
    jogo: 'minecraft',
    maisVendido: true,
    vantagens: [
      'Nosso plano mais vendido',
      'Container 100% Isolado e Dedicado',
      'Aguenta plugins e mods com folga',
      'Painel Web Crafty com console ao vivo',
      'Subdomínio rápido personalizado',
      'Suporte prioritário via WhatsApp',
    ],
  },
  {
    id: 'plano-colmeia',
    nome: 'Colmeia Mestre (Dedicado)',
    precoMensal: 59.90,
    precoAnual: 47.90,
    memoriaRam: '8 GB RAM Dedicada',
    processador: '4 vCPU Dedicada',
    armazenamento: '80 GB SSD NVMe',
    vagasJogadores: 'Até 60 Amigos',
    jogo: 'minecraft',
    vantagens: [
      'Para servidores médios e modpacks pesados',
      'Container Ultra Performance Dedicado',
      'Suporta Forge, Fabric e Purpur',
      'Controle total de arquivos e mods',
      'Migração direta sem downtime',
      'Ativação rápida via PIX',
    ],
  },
];

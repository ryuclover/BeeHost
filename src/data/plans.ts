export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  ram: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  cpu: string;
  storage: string;
  slots: string;
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Abelha Iniciante',
    monthlyPrice: 19.90,
    yearlyPrice: 15.90,
    ram: '2 GB RAM Dedicada',
    cpu: '1 vCPU Dedicada',
    storage: '20 GB SSD NVMe',
    slots: 'Até 10 Amigos',
    features: [
      'Container 100% Isolado (Daytona)',
      'Painel Crafty Controller Incluso',
      'Endereço DigitalPlat Gratuito',
      'Zero Lag e Proteção DDoS',
      'Migração Direta sem Perda',
    ],
    ctaText: 'Escolher Plano',
  },
  {
    id: 'explorer',
    name: 'Abelha da Galera',
    monthlyPrice: 34.90,
    yearlyPrice: 27.90,
    ram: '4 GB RAM Dedicada',
    cpu: '2 vCPU Dedicada',
    storage: '40 GB SSD NVMe',
    slots: 'Até 25 Amigos',
    isPopular: true,
    features: [
      'Container 100% Isolado e Dedicado',
      'Aguenta Mods e Plugins com Folga',
      'Painel Crafty com Console ao Vivo',
      'Subdomínio Próprio sem Portas',
      'Suporte Prioritário no WhatsApp',
    ],
    ctaText: 'Mais Vendido',
  },
  {
    id: 'builder',
    name: 'Colmeia Mestre',
    monthlyPrice: 59.90,
    yearlyPrice: 47.90,
    ram: '8 GB RAM Dedicada',
    cpu: '4 vCPU Dedicada',
    storage: '80 GB SSD NVMe',
    slots: 'Até 60 Amigos',
    features: [
      'Container Ultra Performance',
      'Suporte a Forge, Fabric e Purpur',
      'Acesso Completo a Arquivos e Mods',
      'Migração Rápida Direta',
      'Ativação Imediata via PIX',
    ],
    ctaText: 'Escolher Plano',
  },
];

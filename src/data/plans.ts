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
    name: 'Starter',
    monthlyPrice: 4.99,
    yearlyPrice: 3.99,
    ram: '2 GB RAM',
    cpu: '2 vCPU Ryzen 9',
    storage: '30 GB NVMe Gen4',
    slots: '1 - 10 Players',
    features: [
      '2 GB RAM',
      'Great for small groups',
      'All game types',
      'Easy setup',
      'DDoS Protection 3.2 Tbps',
      'Subdomain included',
    ],
    ctaText: 'Get Started',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    monthlyPrice: 9.99,
    yearlyPrice: 7.99,
    ram: '4 GB RAM',
    cpu: '3 vCPU Ryzen 9',
    storage: '60 GB NVMe Gen4',
    slots: '10 - 25 Players',
    isPopular: true,
    features: [
      '4 GB RAM',
      'Perfect for friends',
      'Mod & plugin support',
      'Daily backups',
      'Instant 60s provisioning',
      'Discord bot integrations',
    ],
    ctaText: 'Get Started',
  },
  {
    id: 'builder',
    name: 'Builder',
    monthlyPrice: 16.99,
    yearlyPrice: 13.59,
    ram: '8 GB RAM',
    cpu: '4 vCPU Ryzen 9',
    storage: '120 GB NVMe Gen4',
    slots: '25 - 50 Players',
    features: [
      '8 GB RAM',
      'For bigger worlds',
      'Advanced controls',
      'Priority support',
      'Automatic crash recovery',
      'Full SFTP & MySQL access',
    ],
    ctaText: 'Get Started',
  },
  {
    id: 'empire',
    name: 'Empire',
    monthlyPrice: 29.99,
    yearlyPrice: 23.99,
    ram: '16 GB RAM',
    cpu: '8 vCPU Ryzen 9 Extreme',
    storage: '250 GB NVMe Gen4',
    slots: 'Unlimited Players',
    features: [
      '16 GB RAM',
      'High performance',
      'Multiple game servers',
      'Dedicated resources',
      'Dedicated IP address',
      '24/7 VIP Discord channel',
    ],
    ctaText: 'Get Started',
  },
];

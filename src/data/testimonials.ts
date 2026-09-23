export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarImg: string;
  avatarColor: string;
  rating: number;
  text: string;
  verifiedGame: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'alex',
    name: 'AlexRPG',
    role: 'Guild Master',
    avatarImg: '/assets/avatar_alex.png',
    avatarColor: '#168CFF',
    rating: 5,
    text: '“Super easy to set up, and our RPG group has been online non-stop. Beehost just works!”',
    verifiedGame: 'Valheim & Terraria',
  },
  {
    id: 'nomad',
    name: 'PixelNomad',
    role: 'Modded Server Host',
    avatarImg: '/assets/avatar_nomad.png',
    avatarColor: '#35D56F',
    rating: 5,
    text: '“Reliable, fast, and amazing support. We’ve hosted multiple games here. Highly recommend!”',
    verifiedGame: 'Survival MMO / Rust',
  },
  {
    id: 'luna',
    name: 'LunaCraft',
    role: 'Community Lead',
    avatarImg: '/assets/avatar_luna.png',
    avatarColor: '#7447E8',
    rating: 5,
    text: '“Our community has grown so much thanks to Beehost. Great tools and an even greater team!”',
    verifiedGame: 'Sandbox & Co-op Games',
  },
];

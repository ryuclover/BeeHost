export interface GameCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconType: 'rpg' | 'sandbox' | 'survival' | 'strategy' | 'coop' | 'more';
  popularGames: string[];
  serverCount: string;
  badge?: string;
}

export const GAME_CATEGORIES: GameCategory[] = [
  {
    id: 'rpg',
    title: 'RPG',
    subtitle: 'Adventure',
    description: 'Immersive fantasy realms, boss dungeons, and persistent quest servers.',
    iconType: 'rpg',
    popularGames: ['Elden Worlds', 'Valheim', 'Terraria RPG', 'V Rising'],
    serverCount: '4,280+ active',
  },
  {
    id: 'sandbox',
    title: 'Sandbox',
    subtitle: '& Creative',
    description: 'Infinite world generation, voxel building, and custom community plugins.',
    iconType: 'sandbox',
    popularGames: ['Voxel Craft', 'Vintage Story', 'Starbound', 'Space Engineers'],
    serverCount: '12,940+ active',
  },
  {
    id: 'survival',
    title: 'Survival',
    subtitle: '',
    description: 'Hardcore wilderness, hunger, crafting, base building, and hostile nights.',
    iconType: 'survival',
    popularGames: ['Rust', 'ARK: Ascended', '7 Days to Die', 'The Forest'],
    serverCount: '8,150+ active',
  },
  {
    id: 'strategy',
    title: 'Strategy',
    subtitle: '',
    description: 'Grand empire conquest, tactical warfare, and real-time multiplayer campaigns.',
    iconType: 'strategy',
    popularGames: ['Civ Battles', 'Factorio MMO', 'Hearts of Iron', 'Stellaris'],
    serverCount: '3,410+ active',
  },
  {
    id: 'coop',
    title: 'Co-op',
    subtitle: '& Social',
    description: 'Chill multiplayer lounges, party games, and cooperative story sessions.',
    iconType: 'coop',
    popularGames: ['Lethal Co', 'Overcooked Party', 'Phasmo Crew', 'Project Z'],
    serverCount: '6,720+ active',
  },
  {
    id: 'more',
    title: 'And More',
    subtitle: '',
    description: 'One-click custom Docker containers, node wrappers, and open-source game engines.',
    iconType: 'more',
    popularGames: ['Custom Engine', 'Godot Server', 'Unity Netcode', 'Custom JAR'],
    serverCount: '500+ engines',
  },
];

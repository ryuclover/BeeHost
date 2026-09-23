export interface NavItem {
  id: string;
  label: string;
  iconName: 'home' | 'gamepad' | 'layers' | 'settings' | 'users' | 'heart' | 'message-square';
  badge?: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', iconName: 'home', href: '#home' },
  { id: 'games', label: 'Games', iconName: 'gamepad', href: '#games' },
  { id: 'plans', label: 'Plans', iconName: 'layers', href: '#plans' },
  { id: 'features', label: 'Features', iconName: 'settings', href: '#features' },
  { id: 'community', label: 'Community', iconName: 'users', href: '#community' },
  { id: 'about', label: 'About', iconName: 'heart', href: '#about' },
  { id: 'support', label: 'Support', iconName: 'message-square', href: '#support' },
];

export const HEADER_LINKS = [
  { label: 'Games', href: '#games' },
  { label: 'Plans', href: '#plans' },
  { label: 'Features', href: '#features' },
  { label: 'Community', href: '#community' },
  { label: 'Support', href: '#support' },
];

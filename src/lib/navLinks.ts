export interface NavLinkItem {
  id: number;
  name: string;
  link: string;
}

const navLinks: NavLinkItem[] = [
  { id: 0, name: 'Home', link: '/' },
  { id: 1, name: 'Quran', link: '/quran' },
  { id: 2, name: 'Hadith', link: '/hadith' },
  { id: 3, name: 'About', link: '/about' },
  { id: 4, name: 'Settings', link: '/settings' },
  { id: 5, name: 'Admin', link: '/admin' },
];

export default navLinks;

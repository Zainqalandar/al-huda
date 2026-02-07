export interface NavLinkItem {
  id: number;
  name: string;
  link: string;
}

const navLinks: NavLinkItem[] = [
  { id: 0, name: 'Home', link: '/' },
  { id: 1, name: 'Quran', link: '/quran' },
  { id: 2, name: 'Quotes', link: '/quotes' },
  { id: 3, name: 'Hadith', link: '/hadith' },
  { id: 4, name: 'Duas', link: '/duas' },
  { id: 5, name: 'About', link: '/about' },
  { id: 6, name: 'Settings', link: '/settings' },
];

export default navLinks;

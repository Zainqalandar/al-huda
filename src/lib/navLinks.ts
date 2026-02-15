export interface NavLinkItem {
  id: number;
  name: string;
  link: string;
}

const navLinks: NavLinkItem[] = [
  { id: 0, name: 'Home', link: '/' },
  { id: 1, name: 'Quran', link: '/surah' },
  { id: 2, name: 'About', link: '/about' },
  { id: 3, name: 'Admin', link: '/admin' },
];

export default navLinks;

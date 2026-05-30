import type { Metadata } from 'next';

import AboutRoot from '@/components/about';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'About Al-Huda Quran – Our Mission & Vision',
  description:
    'Learn about Al-Huda Quran platform. Our mission is to provide the most accessible, user-friendly Quran reading experience with Arabic text, Urdu & English translations, audio recitation, tafseer, and offline support for Islamic learning.',
  path: '/about',
  keywords: [
    'about al-huda quran',
    'quran platform mission',
    'islamic learning platform',
    'quran reader mission',
    'free quran app',
    'quran learning mission',
  ],
});

export default function About() {
  return (
    <>
      <AboutRoot />
    </>
  );
}

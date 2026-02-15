import type { Metadata } from 'next';

import HomeRoot from '@/components/home';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Read Quran with focused recitation, resume from last ayah, and continue your learning with audio and bookmarks.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <>
      <HomeRoot />
    </>
  );
}

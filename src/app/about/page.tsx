import type { Metadata } from 'next';

import AboutRoot from '@/components/about';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn the mission, values, and vision behind the Al-Huda Quran platform.',
  alternates: {
    canonical: '/about',
  },
};

export default function About() {
  return (
    <>
      <AboutRoot />
    </>
  );
}

import type { MetadataRoute } from 'next';

const defaultSiteUrl = 'https://al-huda.vercel.app';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Al-Huda Quran',
    short_name: 'Al-Huda',
    description:
      'Quran-first app for reading, listening, Urdu translation, bookmarks, and progress tracking.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#071610',
    theme_color: '#0f8a6f',
    lang: 'en',
    id: siteUrl,
    icons: [
      {
        src: '/logos/logo1.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logos/1.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

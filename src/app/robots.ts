import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://al-huda.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/surah', '/surah/', '/tafsir', '/tafsir/', '/about'],
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/signin',
          '/signup',
          '/settings',
          '/practice',
          '/hadith',
          '/quran',
          '/quran/',
          '/*?*search=*',
          '/*?*q=*',
          '/*?*filter=*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

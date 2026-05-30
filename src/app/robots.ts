import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://al-huda.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
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
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
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
        ],
        crawlDelay: 1,
      },
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
        crawlDelay: 2,
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemaps/surah`,
      `${baseUrl}/sitemaps/ayah-1`,
    ],
    host: baseUrl,
  };
}

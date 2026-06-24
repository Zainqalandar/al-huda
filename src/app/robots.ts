import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readalquran.online';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/', '/surah', '/surah/', '/tafsir', '/tafsir/', '/about', '/contact', '/cities', '/voice-search', '/hadith', '/hadith/'],
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/signin',
          '/signup',
          '/settings',
          '/practice',
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
        allow: ['/', '/surah', '/surah/', '/tafsir', '/tafsir/', '/about', '/contact', '/cities', '/voice-search', '/hadith', '/hadith/'],
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/signin',
          '/signup',
          '/settings',
          '/practice',
          '/quran',
          '/quran/',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: '*',
        allow: ['/', '/surah', '/surah/', '/tafsir', '/tafsir/', '/about', '/contact', '/cities', '/voice-search', '/hadith', '/hadith/'],
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/signin',
          '/signup',
          '/settings',
          '/practice',
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
      `${baseUrl}/sitemaps/surah.xml`,
      `${baseUrl}/sitemaps/ayah-1.xml`,
      `${baseUrl}/local-sitemap.xml`,
      `${baseUrl}/voice-sitemap.xml`,
      `${baseUrl}/hadith/sitemap.xml`,
    ],
    host: baseUrl,
  };
}

import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://al-huda.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/quran', '/hadith', '/about', '/settings'];

  const now = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '/quran' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));
}

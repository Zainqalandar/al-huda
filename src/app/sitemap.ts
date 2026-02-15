import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://al-huda.vercel.app';
const TOTAL_SURAHS = 114;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/quran`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.65,
    },
  ];

  const surahRoutes: MetadataRoute.Sitemap = Array.from(
    { length: TOTAL_SURAHS },
    (_, index) => ({
      url: `${baseUrl}/quran/${index + 1}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  );

  return [...staticRoutes, ...surahRoutes];
}

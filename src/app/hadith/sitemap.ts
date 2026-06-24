import type { MetadataRoute } from 'next';
import { getAllCollections } from '@/lib/hadith/collections.service';

const BASE_URL = 'https://readalquran.online';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const collections = await getAllCollections();

  const collectionUrls: MetadataRoute.Sitemap = collections.map((col) => ({
    url: `${BASE_URL}/hadith/${col.bookSlug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${BASE_URL}/hadith`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/hadith/collections`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    ...collectionUrls,
  ];
}

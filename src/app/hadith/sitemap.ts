import type { MetadataRoute } from 'next';
import { getAllCollections } from '@/lib/hadith/collections.service';

const BASE_URL = 'https://readalquran.online';
const DEFAULT_CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly';

function buildCollectionUrl(collectionSlug: string) {
  return `${BASE_URL}/hadith/${collectionSlug}`;
}

function buildBookUrl(collectionSlug: string) {
  return `${BASE_URL}/hadith/${collectionSlug}/books/${collectionSlug}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/hadith`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  try {
    const collections = await getAllCollections();

    for (const collection of collections) {
      sitemapUrls.push({
        url: buildCollectionUrl(collection.bookSlug),
        lastModified: new Date(),
        changeFrequency: DEFAULT_CHANGE_FREQUENCY,
        priority: 0.9,
      });

      sitemapUrls.push({
        url: buildBookUrl(collection.bookSlug),
        lastModified: new Date(),
        changeFrequency: DEFAULT_CHANGE_FREQUENCY,
        priority: 0.85,
      });
    }
  } catch (error) {
    console.warn(
      'Hadith sitemap generation will return only the root hadith URL because Hadith API failed or timed out:',
      error
    );
  }

  return sitemapUrls;
}

import type { MetadataRoute } from 'next';
import { getAllCollections, getCollectionBySlug } from '@/lib/hadith/collections.service';
import { getHadiths } from '@/lib/hadith/hadith.service';

const BASE_URL = 'https://readalquran.online';
const DEFAULT_CHANGE_FREQUENCY: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly';
const DEFAULT_PRIORITY = 0.8;
const PAGINATION_SIZE = 100;

function buildCollectionUrl(collectionSlug: string) {
  return `${BASE_URL}/hadith/${collectionSlug}`;
}

function buildBookUrl(collectionSlug: string) {
  return `${BASE_URL}/hadith/${collectionSlug}/books/${collectionSlug}`;
}

function buildHadithUrl(collectionSlug: string, hadithNumber: string) {
  return `${BASE_URL}/hadith/${collectionSlug}/books/${collectionSlug}/${encodeURIComponent(hadithNumber)}`;
}

async function buildHadithUrlsForCollection(collectionSlug: string): Promise<MetadataRoute.Sitemap> {
  const hadithUrls: MetadataRoute.Sitemap = [];
  const firstPage = await getHadiths({ bookSlug: collectionSlug, page: 1, perPage: PAGINATION_SIZE });

  if (firstPage.hadiths.data.length === 0) {
    return hadithUrls;
  }

  const lastPage = firstPage.hadiths.last_page;
  const addPageUrls = (pageData: typeof firstPage) => {
    pageData.hadiths.data.forEach((hadith) => {
      hadithUrls.push({
        url: buildHadithUrl(collectionSlug, hadith.hadithNumber),
        lastModified: new Date(),
        changeFrequency: DEFAULT_CHANGE_FREQUENCY,
        priority: 0.5,
      });
    });
  };

  addPageUrls(firstPage);

  for (let page = 2; page <= lastPage; page += 1) {
    const pageData = await getHadiths({ bookSlug: collectionSlug, page, perPage: PAGINATION_SIZE });
    addPageUrls(pageData);
  }

  return hadithUrls;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const collections = await getAllCollections();

  const sitemapUrls: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/hadith`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

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

    const hadithUrls = await buildHadithUrlsForCollection(collection.bookSlug);
    sitemapUrls.push(...hadithUrls);
  }

  return sitemapUrls;
}

import { getAllCollections } from './collections.service';

export const HADITH_SITEMAP_CHUNK_SIZE = 1000;

const MAX_HADITHS_PER_COLLECTION = 50_000;

export interface HadithRef {
  collectionSlug: string;
  hadithNumber: string;
}

// Fallback collections to guarantee sitemap generation if API fails or rate-limits
const FALLBACK_COLLECTIONS = [
  { bookSlug: 'sahih-bukhari', hadiths_count: 7276 },
  { bookSlug: 'sahih-muslim', hadiths_count: 7564 },
  { bookSlug: 'al-tirmidhi', hadiths_count: 3956 },
  { bookSlug: 'abu-dawood', hadiths_count: 5274 },
  { bookSlug: 'ibn-e-majah', hadiths_count: 4341 },
  { bookSlug: 'sunan-nasai', hadiths_count: 5761 },
  { bookSlug: 'mishkat', hadiths_count: 6293 },
];

function normalizeHadithCount(count: unknown): number {
  const parsed = Math.floor(Number(count));
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return Math.min(parsed, MAX_HADITHS_PER_COLLECTION);
}

export async function getAllHadithRefs(): Promise<HadithRef[]> {
  let collections = await getAllCollections();
  
  if (!collections || collections.length === 0) {
    console.warn('[hadith-index] getAllHadithRefs API returned empty. Using fallback collections data.');
    collections = FALLBACK_COLLECTIONS as any;
  }

  const refs: HadithRef[] = [];

  for (const collection of collections) {
    const hadithCount = normalizeHadithCount(collection.hadiths_count);
    for (let number = 1; number <= hadithCount; number += 1) {
      refs.push({
        collectionSlug: collection.bookSlug,
        hadithNumber: String(number),
      });
    }
  }

  return refs;
}

export async function getHadithSitemapChunkCount(): Promise<number> {
  let collections = await getAllCollections();
  
  if (!collections || collections.length === 0) {
    console.warn('[hadith-index] getHadithSitemapChunkCount API returned empty. Using fallback collections data.');
    collections = FALLBACK_COLLECTIONS as any;
  }

  const total = collections.reduce(
    (sum, collection) => sum + normalizeHadithCount(collection.hadiths_count),
    0
  );

  if (total <= 0) {
    return 41; // Fallback chunk count (40,465 hadiths / 1,000)
  }

  const chunkCount = Math.ceil(total / HADITH_SITEMAP_CHUNK_SIZE);
  return Number.isFinite(chunkCount) && chunkCount > 0 ? chunkCount : 41;
}

export function getHadithChunkNumber(name: string) {
  const match = /^hadith-(\d+)$/.exec(name);
  if (!match) {
    return null;
  }

  const page = Number(match[1]);
  if (!Number.isInteger(page) || page < 1) {
    return null;
  }

  return page;
}

import { getAllCollections } from './collections.service';

export const HADITH_SITEMAP_CHUNK_SIZE = 1000;

const MAX_HADITHS_PER_COLLECTION = 50_000;

export interface HadithRef {
  collectionSlug: string;
  hadithNumber: string;
}

function normalizeHadithCount(count: unknown): number {
  const parsed = Math.floor(Number(count));
  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return Math.min(parsed, MAX_HADITHS_PER_COLLECTION);
}

export async function getAllHadithRefs(): Promise<HadithRef[]> {
  const collections = await getAllCollections();
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
  const collections = await getAllCollections();
  const total = collections.reduce(
    (sum, collection) => sum + normalizeHadithCount(collection.hadiths_count),
    0
  );

  if (total <= 0) {
    return 1;
  }

  const chunkCount = Math.ceil(total / HADITH_SITEMAP_CHUNK_SIZE);
  return Number.isFinite(chunkCount) && chunkCount > 0 ? chunkCount : 1;
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

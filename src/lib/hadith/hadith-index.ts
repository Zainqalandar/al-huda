import { getAllCollections } from './collections.service';

export const HADITH_SITEMAP_CHUNK_SIZE = 1000;

export interface HadithRef {
  collectionSlug: string;
  hadithNumber: string;
}

export async function getAllHadithRefs(): Promise<HadithRef[]> {
  const collections = await getAllCollections();
  const refs: HadithRef[] = [];

  for (const collection of collections) {
    for (let number = 1; number <= collection.hadiths_count; number += 1) {
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
  const total = collections.reduce((sum, collection) => sum + collection.hadiths_count, 0);
  return Math.max(1, Math.ceil(total / HADITH_SITEMAP_CHUNK_SIZE));
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

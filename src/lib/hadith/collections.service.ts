import { hadithFetch } from './api-client';
import type {
  HadithApiBookResponse,
  HadithApiChapterResponse,
  HadithBook,
  HadithChapter,
} from './types/hadith.types';

export async function getAllCollections(): Promise<HadithBook[]> {
  try {
    const data = await hadithFetch<HadithApiBookResponse>('/books', {
      revalidate: 86400,
      tags: ['hadith-collections'],
    });
    if (!Array.isArray(data.books)) {
      return [];
    }
    return data.books
      .map((b) => ({
        ...b,
        hadiths_count: Number(b.hadiths_count) || 0,
      }))
      .filter((b) => b.hadiths_count > 0);
  } catch (error) {
    console.warn('[hadith] Unable to load collections:', error);
    return [];
  }
}

export async function getCollectionBySlug(slug: string): Promise<HadithBook | null> {
  const books = await getAllCollections();
  return books.find((b) => b.bookSlug === slug) ?? null;
}

export async function getChaptersByCollection(bookSlug: string): Promise<HadithChapter[]> {
  try {
    const data = await hadithFetch<HadithApiChapterResponse>(`/${bookSlug}/chapters`, {
      revalidate: 86400,
      tags: [`hadith-chapters-${bookSlug}`],
    });
    return Array.isArray(data.chapters) ? data.chapters : [];
  } catch (error) {
    console.warn(`[hadith] Unable to load chapters for ${bookSlug}:`, error);
    return [];
  }
}

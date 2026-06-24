import { hadithFetch } from './api-client';
import type {
  HadithApiBookResponse,
  HadithApiChapterResponse,
  HadithBook,
  HadithChapter,
} from './types/hadith.types';

export async function getAllCollections(): Promise<HadithBook[]> {
  const data = await hadithFetch<HadithApiBookResponse>('/books', {
    revalidate: 86400,
    tags: ['hadith-collections'],
  });
  return data.books;
}

export async function getCollectionBySlug(slug: string): Promise<HadithBook | null> {
  const books = await getAllCollections();
  return books.find((b) => b.bookSlug === slug) ?? null;
}

export async function getChaptersByCollection(bookSlug: string): Promise<HadithChapter[]> {
  const data = await hadithFetch<HadithApiChapterResponse>(`/${bookSlug}/chapters`, {
    revalidate: 86400,
    tags: [`hadith-chapters-${bookSlug}`],
  });
  return data.chapters;
}

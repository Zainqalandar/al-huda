import { hadithFetch } from './api-client';
import type { HadithApiHadithsResponse, HadithItem } from './types/hadith.types';

interface GetHadithsParams {
  bookSlug: string;
  chapterId?: string;
  page?: number;
  perPage?: number;
}

export async function getHadiths({
  bookSlug,
  chapterId,
  page = 1,
  perPage = 50,
}: GetHadithsParams): Promise<HadithApiHadithsResponse> {
  let endpoint = `/hadiths/?book=${bookSlug}&paginate=${perPage}&page=${page}`;
  if (chapterId) {
    endpoint += `&chapter=${chapterId}`;
  }

  return hadithFetch<HadithApiHadithsResponse>(endpoint, {
    revalidate: 3600,
    tags: [`hadith-list-${bookSlug}-${chapterId ?? 'all'}-${page}`],
  });
}

export async function getHadithByNumber(
  bookSlug: string,
  hadithNumber: string
): Promise<HadithItem | null> {
  const data = await hadithFetch<HadithApiHadithsResponse>(
    `/hadiths/?book=${bookSlug}&hadithNumber=${hadithNumber}`,
    {
      revalidate: false,
      tags: [`hadith-${bookSlug}-${hadithNumber}`],
    }
  );
  return data.hadiths.data[0] ?? null;
}

export async function searchHadiths(
  query: string,
  page = 1
): Promise<HadithApiHadithsResponse> {
  return hadithFetch<HadithApiHadithsResponse>(
    `/hadiths/?paginate=20&page=${page}&query=${encodeURIComponent(query)}`,
    {
      cache: 'no-store',
    }
  );
}

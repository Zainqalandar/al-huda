import { HadithApiError, hadithFetch } from './api-client';
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

function resolveHadithSearchParams(query: string): URLSearchParams {
  const trimmed = query.trim();
  const params = new URLSearchParams({
    paginate: '20',
  });

  if (!trimmed) {
    return params;
  }

  // Hadith API filters by field-specific params, not `query`.
  const hasArabicScript = /[\u0600-\u06FF]/.test(trimmed);
  if (hasArabicScript) {
    params.set('hadithUrdu', trimmed);
  } else {
    params.set('hadithEnglish', trimmed);
  }

  return params;
}

function createEmptyHadithSearchResponse(
  page: number,
  perPage: number
): HadithApiHadithsResponse {
  return {
    status: 200,
    hadiths: {
      current_page: page,
      data: [],
      first_page_url: '',
      last_page: 1,
      last_page_url: '',
      next_page_url: null,
      prev_page_url: null,
      per_page: perPage,
      total: 0,
      from: 0,
      to: 0,
    },
    book: {
      id: 0,
      bookName: '',
      slug: '',
      writerName: '',
      aboutWriter: null,
      writerDeath: null,
      bookSlug: '',
      status: '',
      hadiths_count: 0,
      volumes: null,
    },
  };
}

export async function searchHadiths(
  query: string,
  page = 1
): Promise<HadithApiHadithsResponse> {
  const params = resolveHadithSearchParams(query);
  params.set('page', String(page));
  const perPage = Number(params.get('paginate') ?? 20);

  try {
    return await hadithFetch<HadithApiHadithsResponse>(`/hadiths/?${params.toString()}`, {
      cache: 'no-store',
    });
  } catch (error) {
    if (error instanceof HadithApiError && error.status === 404) {
      return createEmptyHadithSearchResponse(page, perPage);
    }

    throw error;
  }
}

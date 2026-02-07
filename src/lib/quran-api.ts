import type { SurahDetail, SurahMeta } from '@/types/quran';
import { isValidSurahId } from '@/lib/quran-utils';

const SURAH_META_CACHE_PREFIX = 'alhuda.surah.meta.v1.';
const SURAH_DETAIL_CACHE_PREFIX = 'alhuda.surah.detail.v1.';

function getCached<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function setCached<T>(key: string, value: T) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export async function fetchSurahMeta(surahId: number, signal?: AbortSignal): Promise<SurahMeta> {
  if (!isValidSurahId(surahId)) {
    throw new Error('Invalid surah number');
  }

  const cacheKey = `${SURAH_META_CACHE_PREFIX}${surahId}`;
  const cached = getCached<SurahMeta>(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetch(`https://quranapi.pages.dev/api/${surahId}.json`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Unable to load surah meta (${response.status})`);
  }

  const payload = (await response.json()) as SurahMeta;
  setCached(cacheKey, payload);
  return payload;
}

export async function fetchSurahDetail(
  surahId: number,
  signal?: AbortSignal
): Promise<SurahDetail> {
  if (!isValidSurahId(surahId)) {
    throw new Error('Invalid surah number');
  }

  const cacheKey = `${SURAH_DETAIL_CACHE_PREFIX}${surahId}`;
  const cached = getCached<SurahDetail>(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Unable to load surah ayahs (${response.status})`);
  }

  const payload = (await response.json()) as { data: SurahDetail };

  if (!payload?.data?.ayahs) {
    throw new Error('Invalid surah details payload');
  }

  setCached(cacheKey, payload.data);
  return payload.data;
}

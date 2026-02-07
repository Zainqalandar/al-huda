import type { SurahDetail, SurahMeta, UrduTafsirEntry } from '@/types/quran';
import { isValidSurahId } from '@/lib/quran-utils';

const SURAH_META_CACHE_PREFIX = 'alhuda.surah.meta.v1.';
const SURAH_DETAIL_CACHE_PREFIX = 'alhuda.surah.detail.v1.';
const TAFSIR_URDU_CACHE_PREFIX = 'alhuda.tafsir.ur.v1.';

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

export async function fetchUrduTafsirByAyah(
  surahId: number,
  ayahNumber: number,
  signal?: AbortSignal
): Promise<UrduTafsirEntry> {
  if (!isValidSurahId(surahId)) {
    throw new Error('Invalid surah number');
  }

  if (!Number.isInteger(ayahNumber) || ayahNumber < 1 || ayahNumber > 286) {
    throw new Error('Invalid ayah number');
  }

  const cacheKey = `${TAFSIR_URDU_CACHE_PREFIX}${surahId}:${ayahNumber}`;
  const cached = getCached<UrduTafsirEntry>(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await fetch(`/api/tafsir/ur?surah=${surahId}&ayah=${ayahNumber}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Unable to load Urdu tafsir (${response.status})`);
  }

  const payload = (await response.json()) as UrduTafsirEntry;
  if (!payload?.textHtml) {
    throw new Error('Invalid Urdu tafsir payload');
  }

  setCached(cacheKey, payload);
  return payload;
}

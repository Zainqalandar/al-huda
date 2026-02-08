import type { SurahDetail, SurahMeta, UrduTafsirEntry } from '@/types/quran';
import { isValidSurahId } from '@/lib/quran-utils';

const surahMetaCache = new Map<number, SurahMeta>();
const surahDetailCache = new Map<number, SurahDetail>();
const urduTafsirCache = new Map<string, UrduTafsirEntry>();

export async function fetchSurahMeta(surahId: number, signal?: AbortSignal): Promise<SurahMeta> {
  if (!isValidSurahId(surahId)) {
    throw new Error('Invalid surah number');
  }

  const cached = surahMetaCache.get(surahId);
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
  surahMetaCache.set(surahId, payload);
  return payload;
}

export async function fetchSurahDetail(
  surahId: number,
  signal?: AbortSignal
): Promise<SurahDetail> {
  if (!isValidSurahId(surahId)) {
    throw new Error('Invalid surah number');
  }

  const cached = surahDetailCache.get(surahId);
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

  surahDetailCache.set(surahId, payload.data);
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

  const cacheKey = `${surahId}:${ayahNumber}`;
  const cached = urduTafsirCache.get(cacheKey);
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

  urduTafsirCache.set(cacheKey, payload);
  return payload;
}

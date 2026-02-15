import type { SurahDetail, SurahMeta, UrduTafsirEntry } from '@/types/quran';
import { isValidSurahId } from '@/lib/quran-utils';

const surahMetaCache = new Map<number, SurahMeta>();
const surahDetailCache = new Map<number, SurahDetail>();
const urduTafsirCache = new Map<string, UrduTafsirEntry>();
const surahMetaInFlight = new Map<number, Promise<SurahMeta>>();
const surahDetailInFlight = new Map<number, Promise<SurahDetail>>();
const urduTafsirInFlight = new Map<string, Promise<UrduTafsirEntry>>();

export async function fetchSurahMeta(surahId: number, signal?: AbortSignal): Promise<SurahMeta> {
  if (!isValidSurahId(surahId)) {
    throw new Error('Invalid surah number');
  }

  const cached = surahMetaCache.get(surahId);
  if (cached) {
    return cached;
  }

  const inFlight = surahMetaInFlight.get(surahId);
  if (inFlight) {
    return inFlight;
  }

  const request = fetch(`https://quranapi.pages.dev/api/${surahId}.json`, {
    signal,
    cache: 'force-cache',
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Unable to load surah meta (${response.status})`);
      }

      const payload = (await response.json()) as SurahMeta;
      surahMetaCache.set(surahId, payload);
      return payload;
    })
    .finally(() => {
      surahMetaInFlight.delete(surahId);
    });

  surahMetaInFlight.set(surahId, request);
  return request;
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

  const inFlight = surahDetailInFlight.get(surahId);
  if (inFlight) {
    return inFlight;
  }

  const request = fetch(`https://api.alquran.cloud/v1/surah/${surahId}`, {
    signal,
    cache: 'force-cache',
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Unable to load surah ayahs (${response.status})`);
      }

      const payload = (await response.json()) as { data: SurahDetail };

      if (!payload?.data?.ayahs) {
        throw new Error('Invalid surah details payload');
      }

      surahDetailCache.set(surahId, payload.data);
      return payload.data;
    })
    .finally(() => {
      surahDetailInFlight.delete(surahId);
    });

  surahDetailInFlight.set(surahId, request);
  return request;
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

  const inFlight = urduTafsirInFlight.get(cacheKey);
  if (inFlight) {
    return inFlight;
  }

  const request = fetch(`/api/tafsir/ur?surah=${surahId}&ayah=${ayahNumber}`, {
    signal,
    cache: 'force-cache',
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Unable to load Urdu tafsir (${response.status})`);
      }

      const payload = (await response.json()) as UrduTafsirEntry;
      if (!payload?.textHtml) {
        throw new Error('Invalid Urdu tafsir payload');
      }

      urduTafsirCache.set(cacheKey, payload);
      return payload;
    })
    .finally(() => {
      urduTafsirInFlight.delete(cacheKey);
    });

  urduTafsirInFlight.set(cacheKey, request);
  return request;
}

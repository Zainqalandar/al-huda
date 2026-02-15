import 'server-only';

import { cache } from 'react';

import type { SurahMeta, UrduTafsirEntry } from '@/types/quran';

const QURAN_COM_TAFSIR_IDS = [160, 159, 818, 157] as const;

export interface AyahContentEntry {
  ayahNumber: number;
  arabicText: string;
  urduTranslation: string;
}

interface AlQuranAyahResponse {
  data?: {
    audio?: string;
  };
}

interface QuranComTafsirPayload {
  tafsir?: {
    resource_name?: string;
    text?: string;
  };
}

export const getSurahMetaById = cache(async (surahId: number): Promise<SurahMeta> => {
  const response = await fetch(`https://quranapi.pages.dev/api/${surahId}.json`, {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    throw new Error(`Unable to load surah metadata (${response.status})`);
  }

  return (await response.json()) as SurahMeta;
});

export const getAyahRowsForSurah = cache(async (surahId: number): Promise<AyahContentEntry[]> => {
  const surahMeta = await getSurahMetaById(surahId);
  const totalAyahs = Math.max(0, Number(surahMeta.totalAyah ?? 0));
  const arabic = Array.isArray(surahMeta.arabic1) ? surahMeta.arabic1 : [];
  const urdu = Array.isArray(surahMeta.urdu) ? surahMeta.urdu : [];

  return Array.from({ length: totalAyahs }, (_, index) => ({
    ayahNumber: index + 1,
    arabicText: String(arabic[index] ?? '').trim(),
    urduTranslation: String(urdu[index] ?? '').trim(),
  }));
});

export const getAyahContent = cache(async (surahId: number, ayahNumber: number) => {
  const ayahs = await getAyahRowsForSurah(surahId);
  const match = ayahs.find((entry) => entry.ayahNumber === ayahNumber);

  return match ?? null;
});

export const getAyahAudioUrls = cache(async (surahId: number, ayahNumber: number) => {
  const [arabicResponse, urduResponse] = await Promise.all([
    fetch(`https://api.alquran.cloud/v1/ayah/${surahId}:${ayahNumber}/ar.alafasy`, {
      next: { revalidate: 60 * 60 * 24 },
    }),
    fetch(`https://api.alquran.cloud/v1/ayah/${surahId}:${ayahNumber}/ur.khan`, {
      next: { revalidate: 60 * 60 * 24 },
    }),
  ]);

  const arabicPayload = arabicResponse.ok
    ? ((await arabicResponse.json()) as AlQuranAyahResponse)
    : null;
  const urduPayload = urduResponse.ok
    ? ((await urduResponse.json()) as AlQuranAyahResponse)
    : null;

  return {
    arabic: String(arabicPayload?.data?.audio ?? '').trim() || null,
    urdu: String(urduPayload?.data?.audio ?? '').trim() || null,
  };
});

export const getUrduTafsirByAyah = cache(
  async (surahId: number, ayahNumber: number): Promise<UrduTafsirEntry | null> => {
    for (const sourceId of QURAN_COM_TAFSIR_IDS) {
      const response = await fetch(
        `https://api.quran.com/api/v4/tafsirs/${sourceId}/by_ayah/${surahId}:${ayahNumber}`,
        {
          headers: {
            Accept: 'application/json',
          },
          next: { revalidate: 60 * 60 * 24 },
        }
      );

      if (!response.ok) {
        continue;
      }

      const payload = (await response.json()) as QuranComTafsirPayload;
      const textHtml = String(payload.tafsir?.text ?? '').trim();
      if (!textHtml) {
        continue;
      }

      return {
        surahId,
        ayahNumber,
        sourceId,
        sourceName: String(payload.tafsir?.resource_name ?? 'Urdu Tafseer'),
        textHtml,
      };
    }

    return null;
  }
);

export function sanitizeTafsirHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\sstyle='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

export function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

'use client';

import { useEffect, useState } from 'react';

import type { SurahListItem } from '@/types/quran';

let cachedSurahs: SurahListItem[] | null = null;

interface UseSurahListResult {
  surahList: SurahListItem[];
  loading: boolean;
  error: string | null;
}

function normalizeSurahList(input: unknown): SurahListItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.reduce<SurahListItem[]>((acc, surah, index) => {
    if (!surah || typeof surah !== 'object') {
      return acc;
    }

    const item = surah as Record<string, unknown>;
    const rawId = Number(item.id ?? item.surahNo ?? index + 1);
    const id = Number.isFinite(rawId) ? rawId : index + 1;

    acc.push({
      id,
      surahName: String(item.surahName ?? ''),
      surahNameArabic: String(item.surahNameArabic ?? ''),
      surahNameArabicLong:
        item.surahNameArabicLong !== undefined
          ? String(item.surahNameArabicLong)
          : undefined,
      surahNameTranslation: String(item.surahNameTranslation ?? ''),
      revelationPlace: String(item.revelationPlace ?? ''),
      totalAyah: Number(item.totalAyah ?? 0),
      surahNo: Number(item.surahNo ?? id),
      audio:
        typeof item.audio === 'object' && item.audio !== null
          ? (item.audio as SurahListItem['audio'])
          : undefined,
    });

    return acc;
  }, []);
}

export default function useSurahList(): UseSurahListResult {
  const [surahList, setSurahList] = useState<SurahListItem[]>(cachedSurahs ?? []);
  const [loading, setLoading] = useState<boolean>(cachedSurahs === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedSurahs !== null) {
      setSurahList(cachedSurahs);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://quranapi.pages.dev/api/surah.json', {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Surah list request failed (${res.status})`);
        }

        const payload = (await res.json()) as unknown;
        const normalized = normalizeSurahList(payload);

        cachedSurahs = normalized;
        setSurahList(normalized);
        setError(null);
      } catch (fetchError) {
        if ((fetchError as Error).name === 'AbortError') {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Unable to load Surah list.'
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  return { surahList, loading, error };
}

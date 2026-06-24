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
      surahName: String(item.surahName ?? item.name_simple ?? ''),
      surahNameArabic: String(item.surahNameArabic ?? item.name_arabic ?? ''),
      surahNameArabicLong:
        item.surahNameArabicLong !== undefined
          ? String(item.surahNameArabicLong)
          : undefined,
      surahNameTranslation: String(
        item.surahNameTranslation ??
          (item.translated_name && typeof item.translated_name === 'object'
            ? String((item.translated_name as Record<string, unknown>).name ?? '')
            : '')
      ),
      revelationPlace: String(item.revelationPlace ?? item.revelation_place ?? ''),
      totalAyah: Number(item.totalAyah ?? item.verses_count ?? 0),
      surahNo: Number(item.surahNo ?? item.chapter_number ?? id),
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
        const res = await fetch('https://api.quran.com/api/v4/chapters?language=en', {
          signal: controller.signal,
          cache: 'force-cache',
        });

        if (!res.ok) {
          throw new Error(`Surah list request failed (${res.status})`);
        }

        const payload = (await res.json()) as { chapters?: unknown };
        const normalized = normalizeSurahList(
          Array.isArray(payload.chapters) ? payload.chapters : []
        );

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

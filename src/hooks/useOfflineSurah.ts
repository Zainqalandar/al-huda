'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  isSurahOfflineAvailable,
  OFFLINE_SURAH_CHANGED_EVENT,
} from '@/lib/offline-surah-store';

export function useOfflineSurahStatus(surahId: number | null | undefined) {
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const refresh = useCallback(async () => {
    if (!surahId || !Number.isInteger(surahId)) {
      setIsOfflineReady(false);
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    const available = await isSurahOfflineAvailable(surahId);
    setIsOfflineReady(available);
    setIsChecking(false);
  }, [surahId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onChanged = () => {
      void refresh();
    };

    window.addEventListener(OFFLINE_SURAH_CHANGED_EVENT, onChanged);
    return () => window.removeEventListener(OFFLINE_SURAH_CHANGED_EVENT, onChanged);
  }, [refresh]);

  return {
    isOfflineReady,
    isChecking,
    refresh,
  };
}

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type PropsWithChildren,
} from 'react';

import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import type { AppSettings, ArabicFont, AudioPreference, ReadingMode } from '@/types/settings';

const APP_SETTINGS_STORAGE_KEY = 'alhuda:app-settings';

const DEFAULT_SETTINGS: AppSettings = {
  readingMode: 'ayah',
  arabicFont: 'amiriQuran',
  arabicFontScale: 1.1,
  audioPreference: 'ar',
  autoPlayAudio: false,
};

interface AppSettingsContextValue {
  settings: AppSettings;
  isLoaded: boolean;
  setReadingMode: (mode: ReadingMode) => void;
  setArabicFont: (font: ArabicFont) => void;
  setArabicFontScale: (value: number) => void;
  setAudioPreference: (value: AudioPreference) => void;
  setAutoPlayAudio: (value: boolean) => void;
  resetSettings: () => void;
}

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

function clampScale(value: number): number {
  return Math.max(0.9, Math.min(1.9, Number.isFinite(value) ? value : 1.1));
}

function normalizeSettings(input: Partial<AppSettings>): AppSettings {
  return {
    readingMode: input.readingMode === 'continuous' ? 'continuous' : 'ayah',
    arabicFont:
      input.arabicFont === 'notoNaskh' || input.arabicFont === 'scheherazade'
        ? input.arabicFont
        : 'amiriQuran',
    arabicFontScale: clampScale(Number(input.arabicFontScale ?? DEFAULT_SETTINGS.arabicFontScale)),
    audioPreference: input.audioPreference === 'tr' ? 'tr' : 'ar',
    autoPlayAudio: Boolean(input.autoPlayAudio),
  };
}

export function AppSettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings, isLoaded] = useLocalStorageState<AppSettings>(
    APP_SETTINGS_STORAGE_KEY,
    DEFAULT_SETTINGS
  );

  useEffect(() => {
    if (!isLoaded) return;
    const root = document.documentElement;
    const normalized = normalizeSettings(settings);
    root.dataset.arabicFont = normalized.arabicFont;
    root.style.setProperty('--arabic-font-scale', String(normalized.arabicFontScale));
  }, [isLoaded, settings.arabicFont, settings.arabicFontScale]);

  const updateSettings = useCallback(
    (updater: (prev: AppSettings) => AppSettings) => {
      setSettings((prev) => normalizeSettings(updater(normalizeSettings(prev))));
    },
    [setSettings]
  );

  const setReadingMode = useCallback(
    (mode: ReadingMode) => {
      updateSettings((prev) => ({ ...prev, readingMode: mode }));
    },
    [updateSettings]
  );

  const setArabicFont = useCallback(
    (font: ArabicFont) => {
      updateSettings((prev) => ({ ...prev, arabicFont: font }));
    },
    [updateSettings]
  );

  const setArabicFontScale = useCallback(
    (value: number) => {
      updateSettings((prev) => ({ ...prev, arabicFontScale: clampScale(value) }));
    },
    [updateSettings]
  );

  const setAudioPreference = useCallback(
    (value: AudioPreference) => {
      updateSettings((prev) => ({ ...prev, audioPreference: value }));
    },
    [updateSettings]
  );

  const setAutoPlayAudio = useCallback(
    (value: boolean) => {
      updateSettings((prev) => ({ ...prev, autoPlayAudio: value }));
    },
    [updateSettings]
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  const normalizedSettings = useMemo(() => normalizeSettings(settings), [settings]);

  const value = useMemo(
    () => ({
      settings: normalizedSettings,
      isLoaded,
      setReadingMode,
      setArabicFont,
      setArabicFontScale,
      setAudioPreference,
      setAutoPlayAudio,
      resetSettings,
    }),
    [
      normalizedSettings,
      isLoaded,
      setReadingMode,
      setArabicFont,
      setArabicFontScale,
      setAudioPreference,
      setAutoPlayAudio,
      resetSettings,
    ]
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }
  return context;
}

export { DEFAULT_SETTINGS };

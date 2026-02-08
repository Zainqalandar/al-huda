'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import type { AppSettings, ArabicFont, AudioPreference, ReadingMode } from '@/types/settings';

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

export function AppSettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const isLoaded = true;

  useEffect(() => {
    if (!isLoaded) return;
    const root = document.documentElement;
    root.dataset.arabicFont = settings.arabicFont;
    root.style.setProperty('--arabic-font-scale', String(clampScale(settings.arabicFontScale)));
  }, [isLoaded, settings.arabicFont, settings.arabicFontScale]);

  const setReadingMode = useCallback((mode: ReadingMode) => {
    setSettings((prev) => ({ ...prev, readingMode: mode }));
  }, [setSettings]);

  const setArabicFont = useCallback((font: ArabicFont) => {
    setSettings((prev) => ({ ...prev, arabicFont: font }));
  }, [setSettings]);

  const setArabicFontScale = useCallback((value: number) => {
    setSettings((prev) => ({ ...prev, arabicFontScale: clampScale(value) }));
  }, [setSettings]);

  const setAudioPreference = useCallback((value: AudioPreference) => {
    setSettings((prev) => ({ ...prev, audioPreference: value }));
  }, [setSettings]);

  const setAutoPlayAudio = useCallback((value: boolean) => {
    setSettings((prev) => ({ ...prev, autoPlayAudio: value }));
  }, [setSettings]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  const value = useMemo(
    () => ({
      settings,
      isLoaded,
      setReadingMode,
      setArabicFont,
      setArabicFontScale,
      setAudioPreference,
      setAutoPlayAudio,
      resetSettings,
    }),
    [
      settings,
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

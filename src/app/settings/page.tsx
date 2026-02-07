'use client';

import { useTheme } from 'next-themes';
import { ChevronDown, Trash2 } from 'lucide-react';

import { useAppSettings } from '@/components/providers/app-settings-provider';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AyahBookmark } from '@/types/quran';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const {
    settings,
    setReadingMode,
    setArabicFont,
    setArabicFontScale,
    setAudioPreference,
    setAutoPlayAudio,
    resetSettings,
  } = useAppSettings();

  const [bookmarks, setBookmarks] = useLocalStorageState<AyahBookmark[]>(
    'alhuda.quran.bookmarks.v1',
    []
  );
  const [favorites] = useLocalStorageState<number[]>(
    'alhuda.quran.favorites.v1',
    []
  );

  const removeBookmark = (bookmarkId: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId));
  };

  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <div className="mb-6">
        <Badge className="mb-2">Personalization</Badge>
        <h1 className="font-display text-4xl text-[var(--color-heading)]">Settings</h1>
        <p className="mt-2 text-sm text-[var(--color-muted-text)]">
          Control theme, Quran reading behavior, typography, and audio defaults.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Theme and typography preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                Theme
              </p>
              <div className="flex flex-wrap gap-2">
                {(['light', 'dark', 'system'] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={theme === mode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme(mode)}
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                Arabic Font
              </p>
              <div className="relative">
                <select
                  className="app-select h-10 w-full appearance-none rounded-xl px-3 pr-9 text-sm font-medium"
                  value={settings.arabicFont}
                  onChange={(event) =>
                    setArabicFont(event.target.value as typeof settings.arabicFont)
                  }
                >
                  <option value="amiriQuran">Amiri Quran</option>
                  <option value="notoNaskh">Noto Naskh</option>
                  <option value="scheherazade">Scheherazade</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted-text)]" />
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                <span>Arabic Font Size</span>
                <span>{Math.round(settings.arabicFontScale * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.9}
                max={1.9}
                step={0.05}
                value={settings.arabicFontScale}
                onChange={(event) => setArabicFontScale(Number(event.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quran Reading</CardTitle>
            <CardDescription>Reading mode and audio behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                Default Reading Mode
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={settings.readingMode === 'ayah' ? 'default' : 'outline'}
                  onClick={() => setReadingMode('ayah')}
                >
                  Ayah by Ayah
                </Button>
                <Button
                  size="sm"
                  variant={settings.readingMode === 'continuous' ? 'default' : 'outline'}
                  onClick={() => setReadingMode('continuous')}
                >
                  Continuous
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                Audio Default
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={settings.audioPreference === 'ar' ? 'default' : 'outline'}
                  onClick={() => setAudioPreference('ar')}
                >
                  Arabic Recitation
                </Button>
                <Button
                  size="sm"
                  variant={settings.audioPreference === 'tr' ? 'default' : 'outline'}
                  onClick={() => setAudioPreference('tr')}
                >
                  Urdu Translation
                </Button>
              </div>
            </div>

            <label className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
              <span className="text-sm text-[var(--color-text)]">Autoplay when Surah changes</span>
              <input
                type="checkbox"
                checked={settings.autoPlayAudio}
                onChange={(event) => setAutoPlayAudio(event.target.checked)}
                className="size-4 accent-[var(--color-accent)]"
                aria-label="Toggle autoplay audio"
              />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Data</CardTitle>
            <CardDescription>
              {bookmarks.length} bookmarks and {favorites.length} favorite surahs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {bookmarks.length > 0 ? (
              bookmarks.slice(0, 8).map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm"
                >
                  <span>Surah {bookmark.surahId} • Ayah {bookmark.ayahNumber}</span>
                  <button
                    onClick={() => removeBookmark(bookmark.id)}
                    className="text-[var(--color-muted-text)] hover:text-[var(--color-danger)]"
                    aria-label={`Remove bookmark ${bookmark.surahId}:${bookmark.ayahNumber}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--color-muted-text)]">No bookmarks saved yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reset</CardTitle>
            <CardDescription>
              Restore app preferences to recommended defaults.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="danger" onClick={resetSettings}>
              Reset Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

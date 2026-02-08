'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { ChevronDown, Settings2, Trash2, X } from 'lucide-react';

import { useAppSettings } from '@/components/providers/app-settings-provider';
import { useSurahContext } from '@/hooks/useSurahContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function QuranSettingsPanel() {
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

  const { bookmarks, favorites, removeBookmark } = useSurahContext();
  const [open, setOpen] = useState(false);
  const currentTheme = theme ?? 'system';

  useEffect(() => {
    if (window.location.hash === '#quran-settings') {
      setOpen(true);
    }
  }, []);

  return (
    <div className="mt-4" id="quran-settings-trigger">
      <div className="flex justify-end">
        <Button
          type="button"
          size="icon"
          variant={open ? 'default' : 'outline'}
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="quran-settings"
          aria-label={open ? 'Close Quran settings' : 'Open Quran settings'}
          title="Quran Settings"
        >
          <Settings2 className="size-4" />
        </Button>
      </div>

      {open ? (
        <Card id="quran-settings" className="mt-3 border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_56%)]">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge className="mb-2">Quran</Badge>
                <CardTitle>Quran Settings</CardTitle>
                <CardDescription>
                  Theme, reading mode, typography, audio, and saved bookmarks.
                </CardDescription>
              </div>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => setOpen(false)}
                aria-label="Close settings panel"
              >
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-4 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Theme and Arabic typography</CardDescription>
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
                          variant={currentTheme === mode ? 'default' : 'outline'}
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
                  <CardDescription>Reading and audio defaults</CardDescription>
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
                    <span className="text-sm text-[var(--color-text)]">
                      Autoplay when Surah changes
                    </span>
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
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
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
                        <span>
                          Surah {bookmark.surahId} • Ayah {bookmark.ayahNumber}
                        </span>
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
                  <CardDescription>Restore Quran preferences to default values.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="danger" onClick={resetSettings}>
                    Reset Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

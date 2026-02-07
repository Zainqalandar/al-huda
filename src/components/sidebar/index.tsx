'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BookCheck,
  Bookmark,
  BookmarkCheck,
  Heart,
  Minus,
  Plus,
  Search,
  Sparkles,
} from 'lucide-react';
import { useParams } from 'next/navigation';

import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useSurahContext } from '@/hooks/useSurahContext';
import { fetchSurahDetail, fetchSurahMeta } from '@/lib/quran-api';
import type { SurahAyah, SurahDetail, SurahMeta } from '@/types/quran';
import { useAppSettings } from '@/components/providers/app-settings-provider';
import { clampRange, isValidSurahId } from '@/lib/quran-utils';

interface AyahWithTranslation {
  ayah: SurahAyah;
  translation?: string;
}

function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function HighlightText({ text, query }: { text: string; query: string }) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${escapeRegExp(normalizedQuery)})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === normalizedQuery.toLowerCase() ? (
          <mark
            key={`${part}-${index}`}
            className="rounded bg-[color-mix(in_oklab,var(--color-accent),white_72%)] px-0.5 text-[var(--color-heading)]"
          >
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      )}
    </>
  );
}

export default function QuranReaderPage() {
  const params = useParams<{ id?: string | string[] }>();
  const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const surahId = Number(idParam ?? 1);

  const {
    setPageNo,
    toggleFavoriteSurah,
    isFavoriteSurah,
    bookmarks,
    toggleBookmark,
    isBookmarked,
    lastRead,
    setLastRead,
  } = useSurahContext();

  const {
    settings,
    setReadingMode,
    setArabicFontScale,
    setArabicFont,
  } = useAppSettings();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [surahMeta, setSurahMeta] = useState<SurahMeta | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [didAutoResume, setDidAutoResume] = useState(false);

  const debouncedSearch = useDebouncedValue(searchInput, 280);
  const resumeTargetRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isValidSurahId(surahId)) {
      setError('Invalid surah id in route.');
      setLoading(false);
      return;
    }

    setPageNo(surahId);

    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [detail, meta] = await Promise.all([
          fetchSurahDetail(surahId, controller.signal),
          fetchSurahMeta(surahId, controller.signal),
        ]);
        setSurahDetail(detail);
        setSurahMeta(meta);
      } catch (loadError) {
        const errorObject = loadError as { name?: string; message?: string };
        if (errorObject.name === 'AbortError') {
          return;
        }

        setError(errorObject.message ?? 'Unable to load Surah details.');
      } finally {
        setLoading(false);
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, [setPageNo, surahId]);

  const ayahs = useMemo<AyahWithTranslation[]>(() => {
    if (!surahDetail) {
      return [];
    }

    return surahDetail.ayahs.map((ayah, index) => ({
      ayah,
      translation: surahMeta?.english?.[index],
    }));
  }, [surahDetail, surahMeta?.english]);

  const filteredAyahs = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) {
      return ayahs;
    }

    return ayahs.filter(({ ayah, translation }) => {
      return (
        ayah.text.toLowerCase().includes(query) ||
        (translation ?? '').toLowerCase().includes(query) ||
        String(ayah.numberInSurah).includes(query)
      );
    });
  }, [ayahs, debouncedSearch]);

  const surahBookmarks = useMemo(
    () => bookmarks.filter((item) => item.surahId === surahId),
    [bookmarks, surahId]
  );

  const currentLastRead =
    lastRead?.surahId === surahId ? lastRead : null;

  useEffect(() => {
    if (!currentLastRead || didAutoResume) {
      return;
    }

    const element = document.getElementById(`ayah-${currentLastRead.ayahNumber}`);
    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setDidAutoResume(true);
  }, [currentLastRead, didAutoResume]);

  const highlightQuery = debouncedSearch.trim();
  const favorite = isFavoriteSurah(surahId);

  if (loading) {
    return <Loading label="Loading Surah..." />;
  }

  if (error || !surahDetail) {
    return (
      <Error
        message={error ?? 'Surah could not be loaded.'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const showWordByWord = false;

  return (
    <div className="pb-44 pt-6 sm:pt-8" data-slot="page-shell">
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-5">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Badge className="mb-2">Surah {surahDetail.number}</Badge>
                  <CardTitle className="font-display text-4xl text-[var(--color-heading)]">
                    {surahDetail.englishName}
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm">
                    {surahDetail.englishNameTranslation} • {surahDetail.revelationType} •{' '}
                    {surahDetail.numberOfAyahs} ayahs
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="arabic-font text-3xl text-[var(--color-heading)]">
                    {surahDetail.name}
                  </p>
                  <Button
                    variant={favorite ? 'default' : 'outline'}
                    size="sm"
                    className="mt-3"
                    onClick={() => toggleFavoriteSurah(surahId)}
                  >
                    <Heart className={`size-4 ${favorite ? 'fill-current' : ''}`} />
                    {favorite ? 'Favorited' : 'Favorite Surah'}
                  </Button>
                </div>
              </div>

              {currentLastRead ? (
                <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-sm text-[var(--color-muted-text)]">
                  Last read: Ayah {currentLastRead.ayahNumber}
                  <Button
                    ref={resumeTargetRef}
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() => {
                      const target = document.getElementById(`ayah-${currentLastRead.ayahNumber}`);
                      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                  >
                    Resume
                  </Button>
                </div>
              ) : null}
            </CardHeader>
          </Card>

          <Card className=" z-20 border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_50%)] bg-[color-mix(in_oklab,var(--color-surface),transparent_12%)] backdrop-blur">
            <CardContent className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                  Read mode
                </label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={settings.readingMode === 'ayah' ? 'default' : 'outline'}
                    onClick={() => setReadingMode('ayah')}
                  >
                    Ayah by ayah
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
                <label htmlFor="reader-search" className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                  Search ayah
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted-text)]" />
                  <Input
                    id="reader-search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Arabic / translation"
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="arabic-font" className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                  Arabic font
                </label>
                <select
                  id="arabic-font"
                  className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm"
                  value={settings.arabicFont}
                  onChange={(event) =>
                    setArabicFont(event.target.value as typeof settings.arabicFont)
                  }
                >
                  <option value="amiriQuran">Amiri Quran</option>
                  <option value="notoNaskh">Noto Naskh</option>
                  <option value="scheherazade">Scheherazade</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                  Font size
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setArabicFontScale(
                        clampRange(settings.arabicFontScale - 0.05, 0.9, 1.9)
                      )
                    }
                    aria-label="Decrease font size"
                  >
                    <Minus className="size-4" />
                  </Button>
                  <span className="min-w-[4rem] text-center text-sm font-semibold text-[var(--color-heading)]">
                    {Math.round(settings.arabicFontScale * 100)}%
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setArabicFontScale(
                        clampRange(settings.arabicFontScale + 0.05, 0.9, 1.9)
                      )
                    }
                    aria-label="Increase font size"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            {!showWordByWord ? (
              <p className="px-4 pb-3 text-xs text-[var(--color-muted-text)]">
                Word-by-word mode will be enabled when tokenized ayah data is available.
              </p>
            ) : null}
          </Card>

          {settings.readingMode === 'continuous' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="size-5 text-[var(--color-accent)]" />
                  Continuous Reading
                </CardTitle>
                <CardDescription>
                  Flow mode for uninterrupted recitation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="arabic-font arabic-reading text-right text-[var(--color-heading)]">
                  {filteredAyahs.map(({ ayah }, index) => (
                    <span key={ayah.number}>
                      <span id={`ayah-${ayah.numberInSurah}`}>
                        {ayah.text}
                      </span>{' '}
                      <span className="mx-1 text-sm text-[var(--color-accent)]">
                        ({ayah.numberInSurah})
                      </span>{' '}
                      {index === filteredAyahs.length - 1 ? '' : ' '}
                    </span>
                  ))}
                </p>
              </CardContent>
            </Card>
          ) : (
            <section className="space-y-3" aria-label="Ayah list">
              {filteredAyahs.map(({ ayah, translation }) => {
                const bookmarked = isBookmarked(surahId, ayah.numberInSurah);
                const isLastRead = currentLastRead?.ayahNumber === ayah.numberInSurah;

                return (
                  <Card
                    id={`ayah-${ayah.numberInSurah}`}
                    key={ayah.number}
                    className={isLastRead ? 'border-[var(--color-accent-soft)] ring-2 ring-[var(--color-accent)]/20' : ''}
                  >
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Badge variant="secondary">Ayah {ayah.numberInSurah}</Badge>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            variant={bookmarked ? 'default' : 'outline'}
                            size="sm"
                            onClick={() =>
                              toggleBookmark({
                                surahId,
                                ayahNumber: ayah.numberInSurah,
                                text: ayah.text,
                              })
                            }
                          >
                            {bookmarked ? (
                              <BookmarkCheck className="size-4" />
                            ) : (
                              <Bookmark className="size-4" />
                            )}
                            {bookmarked ? 'Saved' : 'Bookmark'}
                          </Button>
                          <Button
                            variant={isLastRead ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() =>
                              setLastRead({
                                surahId,
                                ayahNumber: ayah.numberInSurah,
                                updatedAt: new Date().toISOString(),
                              })
                            }
                          >
                            <BookCheck className="size-4" />
                            {isLastRead ? 'Last Read' : 'Mark Last'}
                          </Button>
                        </div>
                      </div>

                      <p className="arabic-font arabic-reading mt-4 text-right text-[var(--color-heading)]">
                        <HighlightText text={ayah.text} query={highlightQuery} />
                      </p>

                      {translation ? (
                        <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-text)]">
                          <HighlightText text={translation} query={highlightQuery} />
                        </p>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })}

              {filteredAyahs.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-sm text-[var(--color-muted-text)]">
                    No ayah matched your search query.
                  </CardContent>
                </Card>
              ) : null}
            </section>
          )}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[5rem] xl:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Bookmarks</CardTitle>
              <CardDescription>
                {surahBookmarks.length} saved ayah{surahBookmarks.length === 1 ? '' : 's'} in this surah
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {surahBookmarks.length > 0 ? (
                surahBookmarks.map((bookmark) => (
                  <Link
                    key={bookmark.id}
                    href={`#ayah-${bookmark.ayahNumber}`}
                    className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-text)] transition hover:border-[var(--color-accent-soft)]"
                  >
                    Ayah {bookmark.ayahNumber}
                  </Link>
                ))
              ) : (
                <p className="text-sm text-[var(--color-muted-text)]">
                  No bookmarks yet. Save ayahs for quick revisit.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Word-by-word</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--color-muted-text)]">
              Structured placeholder is ready. Once token-level data is available, each
              word can show translation and transliteration here.
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

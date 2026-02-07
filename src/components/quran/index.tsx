'use client';

import Link from 'next/link';
import { BookmarkPlus, Clock3, Heart } from 'lucide-react';

import Error from '@/components/ui/Error';
import Loading from '@/components/ui/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSurahContext } from '@/hooks/useSurahContext';

export default function SurahList() {
  const {
    loading,
    error,
    filterSurahs,
    favorites,
    toggleFavoriteSurah,
    getSurahLikesCount,
    lastRead,
  } = useSurahContext();

  if (loading) {
    return <Loading label="Loading Surah list..." />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (filterSurahs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-[var(--color-muted-text)]">
          No surah matched your search. Try a different keyword.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {filterSurahs.map((surah) => {
        const isFavorite = favorites.includes(surah.id);
        const likesCount = getSurahLikesCount(surah.id);
        const hasLastRead = lastRead?.surahId === surah.id;

        return (
          <Card
            key={surah.id}
            className="group transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted-text)]">
                    Surah {surah.id}
                  </p>
                  <h2 className="mt-1 font-display text-2xl text-[var(--color-heading)]">
                    {surah.surahName}
                  </h2>
                  <p className="text-sm text-[var(--color-muted-text)]">
                    {surah.surahNameTranslation}
                  </p>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => toggleFavoriteSurah(surah.id)}
                    className="rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-muted-text)] transition-colors hover:border-[var(--color-accent-soft)] hover:text-[var(--color-accent)]"
                    aria-label={isFavorite ? 'Remove favorite' : 'Mark as favorite'}
                  >
                    <Heart className={`size-4 ${isFavorite ? 'fill-current text-[var(--color-accent)]' : ''}`} />
                  </button>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted-text)]">
                    {likesCount} likes
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                <p className="arabic-font text-xl text-[var(--color-heading)]" dir="rtl">
                  {surah.surahNameArabic}
                </p>
                <Badge variant="secondary">Ayahs {surah.totalAyah}</Badge>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Button asChild className="flex-1 min-w-[8.5rem]">
                  <Link href={`/quran/${surah.id}`}>
                    <BookmarkPlus className="size-4" />
                    Read now
                  </Link>
                </Button>
                {hasLastRead ? (
                  <Button asChild variant="outline" className="min-w-[8.5rem] flex-1">
                    <Link href={`/quran/${surah.id}#ayah-${lastRead.ayahNumber}`}>
                      <Clock3 className="size-4" />
                      Resume {lastRead.ayahNumber}
                    </Link>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

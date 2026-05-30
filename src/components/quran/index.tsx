'use client';

import Link from 'next/link';
import { BookmarkPlus, Clock3, Heart, Sparkles } from 'lucide-react';

import Error from '@/components/ui/Error';
import Loading from '@/components/ui/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSurahContext } from '@/hooks/useSurahContext';
import { buildSurahPath } from '@/lib/quran-routing';

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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filterSurahs.map((surah, index) => {
        const isFavorite = favorites.includes(surah.id);
        const likesCount = getSurahLikesCount(surah.id);
        const hasLastRead = lastRead?.surahId === surah.id;
        const surahPath = buildSurahPath(surah.id, surah.surahName);

        return (
          <Card
            key={surah.id}
            className="group animate-fade-up border-2 border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_68%)] bg-gradient-to-br from-[color-mix(in_oklab,var(--color-surface),white_6%)] to-[color-mix(in_oklab,var(--color-highlight),var(--color-surface)_92%)] transition-all hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-glow)]"
            style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
          >
            <CardContent className="h-full p-5 flex flex-col space-y-4">
              {/* Header with number and favorite button */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-accent)]/15 to-[var(--color-accent-soft)]/15 border border-[var(--color-accent)]/25">
                    <span className="font-bold text-xs text-[var(--color-accent)]">
                      {surah.id}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xs uppercase tracking-wider text-[var(--color-muted-text)] font-semibold leading-none">
                      Surah
                    </p>
                    <p className="text-xs text-[var(--color-muted-text)]">
                      {surah.totalAyah} Ayahs
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFavoriteSurah(surah.id)}
                  className="flex flex-col items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-2 text-[var(--color-muted-text)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[color-mix(in_oklab,var(--color-accent),transparent_92%)]"
                  aria-label={isFavorite ? 'Remove favorite' : 'Mark as favorite'}
                >
                  <Heart className={`size-4 transition-all ${isFavorite ? 'fill-current text-[var(--color-accent)]' : ''}`} />
                  <p className="text-xs font-bold leading-none text-[var(--color-accent)]">
                    {likesCount}
                  </p>
                </button>
              </div>

              {/* Title section */}
              <div className="flex-1">
                <h2 className="font-display text-xl font-bold text-[var(--color-heading)] mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                  {surah.surahName}
                </h2>
                <p className="text-sm text-[var(--color-muted-text)] mb-2">
                  {surah.surahNameTranslation}
                </p>
                <p className="arabic-font text-base text-[var(--color-heading)] text-right font-semibold group-hover:text-[var(--color-accent)] transition-colors">
                  {surah.surahNameArabic}
                </p>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-[var(--color-border)] flex flex-col gap-2">
                <Button asChild className="w-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-soft)] hover:shadow-lg transition-all">
                  <Link href={surahPath} className="flex items-center gap-2">
                    <BookmarkPlus className="size-4" />
                    Read Now
                  </Link>
                </Button>
                {hasLastRead ? (
                  <Button asChild variant="outline" className="w-full border-2 border-[var(--color-accent)]/30 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5">
                    <Link href={`${surahPath}#ayah-${lastRead.ayahNumber}`} className="flex items-center gap-2">
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

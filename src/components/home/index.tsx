'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookMarked,
  BookOpenText,
  Heart,
  Headphones,
  Languages,
  Settings2,
  Sparkles,
  Star,
  Timer,
} from 'lucide-react';

import type { AyahBookmark, LastReadEntry } from '@/types/quran';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSurahById } from '@/lib/quran-index';
import { buildSurahPath } from '@/lib/quran-routing';

function resolveSurahPath(surahId: number | null | undefined) {
  if (!surahId || !Number.isInteger(surahId)) {
    return '/surah';
  }

  const surah = getSurahById(surahId);
  if (!surah) {
    return `/surah/${surahId}`;
  }

  return buildSurahPath(surah.id, surah.surahName);
}

export default function HomeRoot() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [bookmarks, setBookmarks] = useState<AyahBookmark[]>([]);
  const [lastRead, setLastRead] = useState<LastReadEntry | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadQuranState = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/session', {
          cache: 'no-store',
        });

        if (!sessionResponse.ok) {
          if (!ignore) {
            setFavorites([]);
            setBookmarks([]);
            setLastRead(null);
          }
          return;
        }

        const sessionPayload = (await sessionResponse.json()) as {
          user?: { id?: string | null } | null;
        };

        if (!sessionPayload.user?.id) {
          if (!ignore) {
            setFavorites([]);
            setBookmarks([]);
            setLastRead(null);
          }
          return;
        }

        const quranStateResponse = await fetch('/api/auth/quran-state', {
          cache: 'no-store',
        });

        if (!quranStateResponse.ok) {
          if (!ignore) {
            setFavorites([]);
            setBookmarks([]);
            setLastRead(null);
          }
          return;
        }

        const quranStatePayload = (await quranStateResponse.json()) as {
          favoriteSurahIds?: number[];
          bookmarkedAyahs?: AyahBookmark[];
          lastRead?: LastReadEntry | null;
        };

        if (!ignore) {
          setFavorites(
            Array.isArray(quranStatePayload.favoriteSurahIds)
              ? quranStatePayload.favoriteSurahIds
              : []
          );
          setBookmarks(
            Array.isArray(quranStatePayload.bookmarkedAyahs)
              ? quranStatePayload.bookmarkedAyahs
              : []
          );
          setLastRead(quranStatePayload.lastRead ?? null);
        }
      } catch {
        if (!ignore) {
          setFavorites([]);
          setBookmarks([]);
          setLastRead(null);
        }
      } finally {
        if (!ignore) {
          setIsLoaded(true);
        }
      }
    };

    void loadQuranState();

    return () => {
      ignore = true;
    };
  }, []);

  const hasLastRead = Boolean(lastRead?.surahId && lastRead?.ayahNumber);
  const firstFavoriteSurahId = favorites[0] ?? null;
  const latestBookmark = bookmarks[0] ?? null;
  const lastReadPath = hasLastRead
    ? `${resolveSurahPath(lastRead.surahId)}#ayah-${lastRead.ayahNumber}`
    : '/surah';
  const firstFavoritePath = resolveSurahPath(firstFavoriteSurahId);
  const latestBookmarkPath = latestBookmark
    ? `${resolveSurahPath(latestBookmark.surahId)}#ayah-${latestBookmark.ayahNumber}`
    : '/surah';

  return (
    <div className="pb-20 pt-10 sm:pt-14">
      <section className="relative overflow-hidden" data-slot="page-shell">
        <div className="pointer-events-none absolute -top-16 right-[-10%] size-60 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-accent),transparent_64%)_0%,transparent_72%)] opacity-35 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-16 left-[-8%] size-64 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-highlight),transparent_70%)_0%,transparent_72%)] opacity-35 blur-3xl animate-float" />

        <Card className="relative overflow-hidden border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_54%)] bg-[linear-gradient(130deg,color-mix(in_oklab,var(--color-surface),white_18%),color-mix(in_oklab,var(--color-highlight),var(--color-surface)_93%),color-mix(in_oklab,var(--color-accent),var(--color-surface)_92%))] animate-fade-up">
          <CardContent className="p-6 sm:p-10 lg:p-14">
            <Badge className="mb-4 w-fit">
              <Sparkles className="mr-1 size-3.5" />
              Quran First
            </Badge>
            <h1 className="font-display text-4xl leading-tight text-[var(--color-heading)] sm:text-5xl lg:text-6xl">
              Read Quran with focus, resume fast, and stay consistent.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-[var(--color-muted-text)] sm:text-lg">
              Start recitation quickly, continue from your last ayah, and keep your
              favorite surahs and bookmarks organized in one place.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link
                  href={lastReadPath}
                >
                  {hasLastRead ? 'Continue Reading' : 'Open Quran'}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/surah">
                  <Settings2 className="size-4" />
                  Quran Settings
                </Link>
              </Button>
            </div>

            <dl className="mt-8 grid gap-3 text-sm sm:grid-cols-4">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 shadow-[var(--shadow-soft)] animate-fade-up-delay-1">
                <dt className="inline-flex items-center gap-1 text-[var(--color-muted-text)]">
                  <BookOpenText className="size-3.5 text-[var(--color-accent)]" />
                  Surahs
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-[var(--color-heading)]">114</dd>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 shadow-[var(--shadow-soft)] animate-fade-up-delay-1">
                <dt className="inline-flex items-center gap-1 text-[var(--color-muted-text)]">
                  <Star className="size-3.5 text-[var(--color-highlight)]" />
                  Favorites
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-[var(--color-heading)]">
                  {isLoaded ? favorites.length : '...'}
                </dd>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 shadow-[var(--shadow-soft)] animate-fade-up-delay-2">
                <dt className="inline-flex items-center gap-1 text-[var(--color-muted-text)]">
                  <BookMarked className="size-3.5 text-[var(--color-accent)]" />
                  Bookmarks
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-[var(--color-heading)]">
                  {isLoaded ? bookmarks.length : '...'}
                </dd>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 shadow-[var(--shadow-soft)] animate-fade-up-delay-2">
                <dt className="inline-flex items-center gap-1 text-[var(--color-muted-text)]">
                  <Headphones className="size-3.5 text-[var(--color-info)]" />
                  Audio
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-[var(--color-heading)]">Ready</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10" data-slot="page-shell">
        <h2 className="mb-4 font-display text-3xl text-[var(--color-heading)]">
          Quick Quran Actions
        </h2>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="animate-fade-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpenText className="size-5 text-[var(--color-accent)]" /> Last Read
              </CardTitle>
              <CardDescription>
                {hasLastRead
                  ? `Surah ${lastRead.surahId}, Ayah ${lastRead.ayahNumber}`
                  : 'No last read found yet.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full"
                variant={hasLastRead ? 'default' : 'outline'}
              >
                <Link href={lastReadPath}>
                  {hasLastRead ? 'Resume Now' : 'Start Reading'}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="animate-fade-up-delay-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Heart className="size-5 text-[var(--color-highlight)]" /> Favorite Surah
              </CardTitle>
              <CardDescription>
                {firstFavoriteSurahId
                  ? `Open favorite Surah ${firstFavoriteSurahId}`
                  : 'Mark a surah as favorite to access quickly.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full"
                variant={firstFavoriteSurahId ? 'default' : 'outline'}
              >
                <Link href={firstFavoritePath}>
                  {firstFavoriteSurahId ? 'Open Favorite' : 'Pick Favorite'}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="animate-fade-up-delay-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookMarked className="size-5 text-[var(--color-accent)]" /> Latest Bookmark
              </CardTitle>
              <CardDescription>
                {latestBookmark
                  ? `Surah ${latestBookmark.surahId}, Ayah ${latestBookmark.ayahNumber}`
                  : 'Save bookmarks from Quran reader.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant={latestBookmark ? 'default' : 'outline'}>
                <Link href={latestBookmarkPath}>
                  {latestBookmark ? 'Open Bookmark' : 'Create Bookmark'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-10" data-slot="page-shell">
        <h2 className="mb-4 font-display text-3xl text-[var(--color-heading)]">Core Quran Tools</h2>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="animate-fade-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Headphones className="size-5 text-[var(--color-info)]" /> Recitation Audio
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--color-muted-text)]">
              Play/Pause, range seek, voice selection, and ayah highlight with scrolling.
            </CardContent>
          </Card>

          <Card className="animate-fade-up-delay-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Languages className="size-5 text-[var(--color-accent)]" /> Translation & Tafseer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--color-muted-text)]">
              Urdu translation toggle aur ayah-wise tafseer panel Quran reader ke andar.
            </CardContent>
          </Card>

          <Card className="animate-fade-up-delay-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Timer className="size-5 text-[var(--color-highlight)]" /> Learning Flow
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--color-muted-text)]">
              Resume markers, bookmark list, and session continuity for better daily routine.
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

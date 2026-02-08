'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookMarked,
  BookOpenText,
  Heart,
  Headphones,
  Languages,
  Settings2,
} from 'lucide-react';

import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import type { AyahBookmark, LastReadEntry } from '@/types/quran';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FAVORITES_STORAGE_KEY = 'alhuda.quran.favorites.v1';
const BOOKMARKS_STORAGE_KEY = 'alhuda.quran.bookmarks.v1';
const LAST_READ_STORAGE_KEY = 'alhuda.quran.last-read.v1';

export default function HomeRoot() {
  const [favorites, , favoritesLoaded] = useLocalStorageState<number[]>(
    FAVORITES_STORAGE_KEY,
    []
  );
  const [bookmarks, , bookmarksLoaded] = useLocalStorageState<AyahBookmark[]>(
    BOOKMARKS_STORAGE_KEY,
    []
  );
  const [lastRead, , lastReadLoaded] = useLocalStorageState<LastReadEntry | null>(
    LAST_READ_STORAGE_KEY,
    null
  );

  const isLoaded = favoritesLoaded && bookmarksLoaded && lastReadLoaded;
  const hasLastRead = Boolean(lastRead?.surahId && lastRead?.ayahNumber);
  const firstFavoriteSurahId = favorites[0] ?? null;
  const latestBookmark = bookmarks[0] ?? null;

  return (
    <div className="pb-20 pt-10 sm:pt-14">
      <section className="relative overflow-hidden" data-slot="page-shell">
        <div className="pointer-events-none absolute -top-14 right-[-10%] size-56 rounded-full bg-[radial-gradient(circle,var(--color-accent)_0%,transparent_68%)] opacity-20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-[-5%] size-64 rounded-full bg-[radial-gradient(circle,#c79a42_0%,transparent_70%)] opacity-20 blur-2xl" />

        <Card className="relative overflow-hidden border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_60%)] bg-[linear-gradient(130deg,color-mix(in_oklab,var(--color-surface),white_18%),var(--color-surface))]">
          <CardContent className="p-6 sm:p-10 lg:p-14">
            <Badge className="mb-4 w-fit">Quran First</Badge>
            <h1 className="font-display text-4xl leading-tight text-[var(--color-heading)] sm:text-5xl lg:text-6xl">
              Read Quran with focus, resume fast, and stay consistent.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-[var(--color-muted-text)] sm:text-lg">
              Start recitation quickly, continue from your last ayah, and keep your
              favorite surahs and bookmarks organized in one place.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href={hasLastRead ? `/quran/${lastRead.surahId}#ayah-${lastRead.ayahNumber}` : '/quran'}>
                  {hasLastRead ? 'Continue Reading' : 'Open Quran'}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/quran#quran-settings">
                  <Settings2 className="size-4" />
                  Quran Settings
                </Link>
              </Button>
            </div>

            <dl className="mt-8 grid gap-3 text-sm sm:grid-cols-4">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <dt className="text-[var(--color-muted-text)]">Surahs</dt>
                <dd className="mt-1 text-2xl font-semibold text-[var(--color-heading)]">114</dd>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <dt className="text-[var(--color-muted-text)]">Favorites</dt>
                <dd className="mt-1 text-2xl font-semibold text-[var(--color-heading)]">
                  {isLoaded ? favorites.length : '...'}
                </dd>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <dt className="text-[var(--color-muted-text)]">Bookmarks</dt>
                <dd className="mt-1 text-2xl font-semibold text-[var(--color-heading)]">
                  {isLoaded ? bookmarks.length : '...'}
                </dd>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <dt className="text-[var(--color-muted-text)]">Audio</dt>
                <dd className="mt-1 text-2xl font-semibold text-[var(--color-heading)]">Ready</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10" data-slot="page-shell">
        <h2 className="mb-4 font-display text-3xl text-[var(--color-heading)]">Quick Quran Actions</h2>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
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
              <Button asChild className="w-full" variant={hasLastRead ? 'default' : 'outline'}>
                <Link href={hasLastRead ? `/quran/${lastRead.surahId}#ayah-${lastRead.ayahNumber}` : '/quran'}>
                  {hasLastRead ? 'Resume Now' : 'Start Reading'}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Heart className="size-5 text-[var(--color-accent)]" /> Favorite Surah
              </CardTitle>
              <CardDescription>
                {firstFavoriteSurahId
                  ? `Open favorite Surah ${firstFavoriteSurahId}`
                  : 'Mark a surah as favorite to access quickly.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant={firstFavoriteSurahId ? 'default' : 'outline'}>
                <Link href={firstFavoriteSurahId ? `/quran/${firstFavoriteSurahId}` : '/quran'}>
                  {firstFavoriteSurahId ? 'Open Favorite' : 'Pick Favorite'}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
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
                <Link
                  href={
                    latestBookmark
                      ? `/quran/${latestBookmark.surahId}#ayah-${latestBookmark.ayahNumber}`
                      : '/quran'
                  }
                >
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Headphones className="size-5 text-[var(--color-accent)]" /> Recitation Audio
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--color-muted-text)]">
              Play/Pause, seek range, voice selection, and ayah highlight with scrolling.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Languages className="size-5 text-[var(--color-accent)]" /> Translation & Tafseer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--color-muted-text)]">
              Urdu translation toggle aur ayah-wise tafseer panel Quran reader ke andar.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Settings2 className="size-5 text-[var(--color-accent)]" /> Quran Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--color-muted-text)]">
              Theme, reading mode, Arabic font, audio defaults, bookmarks, and reset controls.
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

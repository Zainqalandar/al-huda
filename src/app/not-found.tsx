import Link from 'next/link';
import { BookMarked, BookOpenText, Home, Search, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildHadithSearchPath } from '@/lib/hadith/hadith-routing';
import { buildSurahPath } from '@/lib/quran-routing';

const POPULAR_SURAH_LINKS = [
  { label: 'Surah Yaseen', surahId: 36, surahName: 'Yaseen' },
  { label: 'Surah Ar-Rahmaan', surahId: 55, surahName: 'Ar-Rahmaan' },
  { label: 'Surah Al-Kahf', surahId: 18, surahName: 'Al-Kahf' },
];

export default function NotFound() {
  return (
    <div className="pb-24 pt-12 sm:pt-16" data-slot="page-shell">
      <div className="pointer-events-none absolute inset-x-0 top-24 -z-10 h-64 bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-accent),transparent_88%)_0%,transparent_72%)] opacity-40 blur-3xl" />

      <Card className="relative overflow-hidden border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_35%)] bg-[linear-gradient(135deg,var(--color-surface),color-mix(in_oklab,var(--color-accent),var(--color-surface)_94%))] shadow-[var(--shadow-glow)] animate-fade-up">
        <CardContent className="p-8 sm:p-12 text-center">
          <Badge className="mb-4">
            <Sparkles className="mr-1 size-3.5" />
            404
          </Badge>

          <p className="arabic-font text-3xl text-[var(--color-heading)] sm:text-4xl">
            إِنَّ مَعَ الْعُسْرِ يُسْرًا
          </p>
          <p className="mt-2 text-sm text-[var(--color-muted-text)]">
            With hardship comes ease — Quran 94:6
          </p>

          <h1 className="mt-6 font-display text-4xl tracking-tight text-[var(--color-heading)] sm:text-5xl">
            This page could not be found
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--color-muted-text)] sm:text-lg">
            The link may be broken or the page may have moved. Continue your Quran journey
            from one of these trusted paths.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="size-4" />
                Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/surah">
                <BookOpenText className="size-4" />
                Surah Index
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={buildHadithSearchPath()}>
                <Search className="size-4" />
                Hadith Search
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-2xl text-[var(--color-heading)]">
          Popular Surahs
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {POPULAR_SURAH_LINKS.map((item) => (
            <Card key={item.surahId} className="animate-fade-up">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookMarked className="size-5 text-[var(--color-accent)]" />
                  {item.label}
                </CardTitle>
                <CardDescription>Read with Arabic, translation, and audio</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link href={buildSurahPath(item.surahId, item.surahName)}>Open Surah</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';
import { BookOpenText, ChevronRight, Headphones } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getAllSurahs } from '@/lib/quran-index';
import { buildSurahPath } from '@/lib/quran-routing';
import { buildPageMetadata } from '@/lib/seo';

interface SurahIndexPageProps {
  searchParams: Promise<{
    search?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SurahIndexPageProps): Promise<Metadata> {
  const query = String((await searchParams).search ?? '').trim();

  if (!query) {
    return buildPageMetadata({
      title: 'Surah Index – Read Quran by Surah',
      description:
        'Browse all 114 surahs with Arabic text, Urdu and English translation, ayah links, tafseer access, and recitation audio.',
      path: '/surah',
      ogType: 'website',
      imageUrl: '/og?kind=surah-index',
    });
  }

  return buildPageMetadata({
    title: `Search Surah: ${query}`,
    description: `Surah search results for "${query}" with direct links to Surah, Ayah, and Tafseer pages.`,
    path: '/surah',
    index: false,
    ogType: 'website',
    imageUrl: '/og?kind=surah-index',
  });
}

export default async function SurahIndexPage({
  searchParams,
}: SurahIndexPageProps) {
  const query = String((await searchParams).search ?? '').trim().toLowerCase();
  const surahs = getAllSurahs().filter((surah) => {
    if (!query) {
      return true;
    }

    return (
      surah.surahName.toLowerCase().includes(query) ||
      surah.surahNameArabic.toLowerCase().includes(query) ||
      surah.surahNameTranslation.toLowerCase().includes(query) ||
      String(surah.id).includes(query)
    );
  });

  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <section className="mb-6 animate-fade-up">
        <Badge className="mb-2">Al-Quran</Badge>
        <h1 className="font-display text-4xl text-[var(--color-heading)] sm:text-5xl">
          Surah Index
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-muted-text)] sm:text-base">
          Har surah ke dedicated page par Arabic text, Urdu tarjuma, ayah links, tafseer
          links, aur audio options available hain.
        </p>
        <form className="mt-4 max-w-md">
          <label htmlFor="surah-search" className="sr-only">
            Search Surah
          </label>
          <input
            id="surah-search"
            type="search"
            name="search"
            defaultValue={query}
            placeholder="Search surah by name, Arabic, or number"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]/40"
          />
        </form>
        {query ? (
          <p className="mt-2 text-xs text-[var(--color-muted-text)]">
            Showing {surahs.length} result{surahs.length === 1 ? '' : 's'} for &quot;
            {query}
            &quot;.
          </p>
        ) : null}
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {surahs.map((surah, index) => {
          const surahPath = buildSurahPath(surah.id, surah.surahName);

          return (
            <Card
              key={surah.id}
              className="animate-fade-up border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_62%)] bg-[linear-gradient(145deg,color-mix(in_oklab,var(--color-surface),white_14%),color-mix(in_oklab,var(--color-highlight),var(--color-surface)_96%))]"
              style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
            >
              <CardContent className="space-y-4 p-5">
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
                  <p className="arabic-font mt-2 text-right text-xl text-[var(--color-heading)]">
                    {surah.surahNameArabic}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm text-[var(--color-muted-text)]">
                  <p className="inline-flex items-center gap-1.5">
                    <BookOpenText className="size-4 text-[var(--color-accent)]" />
                    {surah.totalAyah} Ayahs
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1.5">
                    <Headphones className="size-4 text-[var(--color-info)]" />
                    Arabic + Urdu audio
                  </p>
                </div>

                <Link
                  href={surahPath}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-soft)]"
                >
                  Open Surah Page
                  <ChevronRight className="size-4" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

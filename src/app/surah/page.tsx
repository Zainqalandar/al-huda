import Link from 'next/link';
import type { Metadata } from 'next';
import { BookOpenText, ChevronRight, Headphones, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import StickyScrollNav from '@/components/ui/StickyScrollNav';
import { getAllSurahs } from '@/lib/quran-index';
import { buildSurahPath } from '@/lib/quran-routing';
import { buildPageMetadata } from '@/lib/seo';
import { CORE_QURAN_KEYWORDS, SURAH_AYAH_KEYWORDS } from '@/lib/seo-keywords';

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
      title: 'Surah Index – Read All 114 Surahs with Arabic Text & Urdu Translation',
      description:
        'Browse all 114 surahs of the Quran with Arabic text, Urdu and English translation, ayah links, tafseer access, recitation audio, bookmarks, and likes. Find popular surahs like Yaseen, Rahman, Kahf, Mulk, Waqiah, and more.',
      path: '/surah',
      ogType: 'website',
      imageUrl: '/og?kind=surah-index',
      keywords: [
        ...CORE_QURAN_KEYWORDS,
        ...SURAH_AYAH_KEYWORDS,
        'surah list',
        '114 surahs',
        'quran chapters',
        'all surahs quran',
        'surah index',
        'quran surah directory',
      ],
    });
  }

  return buildPageMetadata({
    title: `Search Surah: ${query} – Read al Quran`,
    description: `Search results for "${query}" with direct links to Surah, Ayah, and Tafseer pages. Find all matching Surahs with Arabic text and Urdu translation.`,
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
    <div className="pb-20 pt-8 md:pt-12" data-slot="page-shell">
      <section className="mb-10 animate-fade-up">
        {/* Header Section with Enhanced Design */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Badge className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-soft)]">
              Al-Quran Al-Kareem
            </Badge>
            <Badge variant="secondary" className="text-xs">
              114 Surahs
            </Badge>
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl font-bold bg-gradient-to-r from-[var(--color-heading)] to-[var(--color-accent)] bg-clip-text text-transparent mb-4">
            Surah Index
          </h1>
          
          <p className="text-base md:text-lg leading-relaxed text-[var(--color-muted-text)] max-w-2xl">
            Complete collection of all 114 surahs with Arabic text, Urdu & English translations, audio recitations, tafseer, and more.
          </p>
        </div>

        {/* Enhanced Search Section */}
        <div className="space-y-3">
          <form className="relative">
            <label htmlFor="surah-search" className="sr-only">
              Search Surah
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[var(--color-muted-text)] pointer-events-none" />
              <input
                id="surah-search"
                type="search"
                name="search"
                defaultValue={query}
                placeholder="Search by name, Arabic, or number..."
                className="w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface-elevated)] pl-11 pr-4 py-3 text-sm md:text-base outline-none transition-all hover:border-[var(--color-accent)]/30 focus-visible:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/20"
              />
            </div>
          </form>
          
          {query ? (
            <div className="flex items-center gap-2 text-sm text-[var(--color-muted-text)]">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-semibold text-xs">
                {surahs.length}
              </span>
              Result{surahs.length === 1 ? '' : 's'} for &quot;{query}&quot;
            </div>
          ) : (
            <p className="text-xs text-[var(--color-muted-text)]">
              Showing all 114 surahs
            </p>
          )}
        </div>
      </section>

      {/* Surahs Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {surahs.map((surah, index) => {
          const surahPath = buildSurahPath(surah.id, surah.surahName);
          const isEarlyMakka = surah.id <= 15;
          const isMadina = surah.id > 92;

          return (
            <Link
              key={surah.id}
              href={surahPath}
              className="group animate-fade-up transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${Math.min(index, 12) * 25}ms` }}
            >
              <Card 
                className="h-full border-2 border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_72%)] bg-gradient-to-br from-[color-mix(in_oklab,var(--color-surface),white_8%)] to-[color-mix(in_oklab,var(--color-highlight),var(--color-surface)_94%)] transition-all duration-300 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-glow)] dark:hover:shadow-[var(--shadow-glow)]"
              >
                <CardContent className="h-full flex flex-col p-6 space-y-4">
                  {/* Top Section - Number and Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent-soft)]/20 border border-[var(--color-accent)]/30">
                        <span className="font-bold text-sm text-[var(--color-accent)]">
                          {surah.id}
                        </span>
                      </div>
                      <div className="text-xs uppercase tracking-wider text-[var(--color-muted-text)] font-semibold">
                        Surah
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      {isEarlyMakka && (
                        <Badge variant="secondary" className="text-xs bg-[var(--color-info)]/10 text-[var(--color-info)] border-[var(--color-info)]/20">
                          Makka
                        </Badge>
                      )}
                      {isMadina && (
                        <Badge variant="secondary" className="text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/20">
                          Madina
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Title Section */}
                  <div className="flex-1">
                    <h2 className="font-display text-xl md:text-2xl font-bold text-[var(--color-heading)] mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                      {surah.surahName}
                    </h2>
                    <p className="text-sm text-[var(--color-muted-text)] mb-3">
                      {surah.surahNameTranslation}
                    </p>
                    <p className="arabic-font text-lg md:text-xl text-[var(--color-heading)] text-right font-semibold group-hover:text-[var(--color-accent)] transition-colors">
                      {surah.surahNameArabic}
                    </p>
                  </div>

                  {/* Info Section */}
                  <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-muted-text)]">
                      <BookOpenText className="size-4 text-[var(--color-accent)] flex-shrink-0" />
                      <span className="font-medium">{surah.totalAyah} Ayahs</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-muted-text)]">
                      <Headphones className="size-4 text-[var(--color-info)] flex-shrink-0" />
                      <span className="font-medium">Full Audio</span>
                    </div>
                  </div>

                  {/* Footer - Read Button Indicator */}
                  <div className="pt-2 flex items-center justify-between group-hover:gap-3 transition-all">
                    <span className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider">
                      Read Now
                    </span>
                    <ChevronRight className="size-4 text-[var(--color-accent)] group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      <StickyScrollNav />
    </div>
  );
}

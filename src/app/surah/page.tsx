import type { Metadata } from 'next';

import { Badge } from '@/components/ui/badge';
import StickyScrollNav from '@/components/ui/StickyScrollNav';
import { getAllSurahs } from '@/lib/quran-index';
import { buildPageMetadata } from '@/lib/seo';
import { CORE_QURAN_KEYWORDS, SURAH_AYAH_KEYWORDS } from '@/lib/seo-keywords';
import SurahIndexClient from '@/components/quran/SurahIndexClient';

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
  const query = String((await searchParams).search ?? '').trim();
  const allSurahs = getAllSurahs();

  return (
    <div className="pb-20 pt-8 md:pt-12" data-slot="page-shell">
      <section className="mb-10">
        {/* Header Section with Enhanced Design */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Badge className="bg-gradient-to-r text-white from-[var(--color-accent)] to-[var(--color-accent-soft)]">
              Al-Quran Al-Kareem
            </Badge>
            <Badge variant="secondary" className="text-xs">
              114 Surahs
            </Badge>
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-bold text-[var(--color-heading)] mb-4">
            Surah Index
          </h1>
          
          <p className="text-base md:text-lg leading-relaxed text-[var(--color-muted-text)] max-w-2xl">
            Complete collection of all 114 surahs with Arabic text, Urdu & English translations, audio recitations, tafseer, and more.
          </p>
        </div>

        {/* Dynamic client-side search and filters */}
        <SurahIndexClient initialSurahs={allSurahs} initialSearchQuery={query} />
      </section>

      <StickyScrollNav />
    </div>
  );
}

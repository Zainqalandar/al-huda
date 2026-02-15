import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import QuranReaderPage from '@/components/sidebar';
import { getAllSurahs, resolveSurahParam } from '@/lib/quran-index';
import { buildSurahPath, buildSurahSlug } from '@/lib/quran-routing';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';

interface SurahPageProps {
  params: Promise<{
    surah: string;
  }>;
}

export const revalidate = 86400;

export function generateStaticParams() {
  return getAllSurahs().map((surah) => ({
    surah: buildSurahSlug(surah.id, surah.surahName),
  }));
}

export async function generateMetadata({ params }: SurahPageProps): Promise<Metadata> {
  const { surah: surahParam } = await params;
  const resolved = resolveSurahParam(surahParam);

  if (!resolved) {
    return buildPageMetadata({
      title: 'Surah Not Found',
      description: 'Requested surah was not found.',
      path: '/surah',
      index: false,
    });
  }

  const surah = resolved.surah;
  const title = `Surah ${surah.surahName} (${surah.surahNameArabic}) – Urdu Tarjuma, Tilawat Audio`;
  const description = `Surah ${surah.surahName} (${surah.surahNameTranslation}) read karein: Arabic text, Urdu/English translation tabs, tafseer panel, bookmarks, likes, aur audio playback/download options.`;
  const canonicalPath = buildSurahPath(surah.id, surah.surahName);

  return buildPageMetadata({
    title,
    description,
    path: canonicalPath,
    ogType: 'article',
    imageUrl: `/og?kind=surah&surah=${surah.id}`,
  });
}

export default async function SurahDetailPage({ params }: SurahPageProps) {
  const { surah: surahParam } = await params;
  const resolved = resolveSurahParam(surahParam);

  if (!resolved) {
    notFound();
  }

  const { surah, isCanonicalSlug } = resolved;
  if (!isCanonicalSlug) {
    permanentRedirect(buildSurahPath(surah.id, surah.surahName));
  }

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', item: '/' },
    { name: 'Surah Index', item: '/surah' },
    { name: `Surah ${surah.id} ${surah.surahName}`, item: buildSurahPath(surah.id, surah.surahName) },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <QuranReaderPage />
    </>
  );
}

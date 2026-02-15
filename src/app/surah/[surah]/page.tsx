import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import QuranReaderPage from '@/components/sidebar';
import { getAllSurahs, resolveSurahParam } from '@/lib/quran-index';
import { buildAyahPath, buildSurahPath, buildSurahSlug } from '@/lib/quran-routing';
import { buildBreadcrumbJsonLd, buildPageMetadata, getSiteOrigin } from '@/lib/seo';

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
  const title = `Surah ${surah.surahName} (${surah.surahNameArabic}) – Urdu & English Translation, Tilawat Audio`;
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
    {
      name: `Surah ${surah.id} ${surah.surahName}`,
      item: buildSurahPath(surah.id, surah.surahName),
    },
  ]);
  const canonicalPath = buildSurahPath(surah.id, surah.surahName);
  const surahJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `Surah ${surah.surahName}`,
    alternateName: [surah.surahNameArabic, surah.surahNameTranslation],
    inLanguage: ['ar', 'ur', 'en'],
    url: `${getSiteOrigin()}${canonicalPath}`,
    about: `Quran Surah ${surah.id}`,
  };
  const firstAyahPath = buildAyahPath(surah.id, surah.surahName, 1);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(surahJsonLd) }}
      />
      <section className="sr-only">
        <h1>{`Surah ${surah.surahName} (${surah.surahNameArabic})`}</h1>
        <p>
          Surah page with Arabic text, Urdu and English translation, ayah links, audio
          recitation, bookmarks, likes, and Urdu tafseer access.
        </p>
      </section>
      <noscript>
        <section className="pb-2 pt-6" data-slot="page-shell">
          <h1 className="font-display text-3xl text-[var(--color-heading)] sm:text-4xl">
            {`Surah ${surah.surahName} (${surah.surahNameArabic})`}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--color-muted-text)] sm:text-base">
            {`Surah ${surah.surahNameTranslation} with Arabic text, Urdu and English translations, audio, and tafseer.`}
          </p>
          <p className="mt-2 text-sm text-[var(--color-muted-text)]">
            <a href={firstAyahPath}>Open Ayah 1</a>
          </p>
        </section>
      </noscript>
      <QuranReaderPage />
    </>
  );
}

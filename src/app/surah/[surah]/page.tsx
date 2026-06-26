import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import BreadcrumbNav from '@/components/ui/breadcrumb-nav';

import QuranReaderPage from '@/components/sidebar';
import { getAllSurahs, resolveSurahParam } from '@/lib/quran-index';
import { getAyahRowsForSurah } from '@/lib/quran-server';
import { buildAyahPath, buildSurahPath, buildSurahSlug } from '@/lib/quran-routing';
import { buildSurahPageKeywords } from '@/lib/seo-keywords';
import { buildBreadcrumbJsonLd, buildPageMetadata, toAbsoluteUrl } from '@/lib/seo';

interface SurahPageProps {
  params: Promise<{
    surah: string;
  }>;
}

export const revalidate = 86400;

const SEO_AYAH_PREVIEW_COUNT = 5;

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
  const description = `Read Surah ${surah.surahName} (${surah.surahNameTranslation}) with Arabic text, Urdu/English translation tabs, tafseer panel, bookmarks, likes, and audio playback/download options.`;
  const canonicalPath = buildSurahPath(surah.id, surah.surahName);

  return buildPageMetadata({
    title,
    description,
    path: canonicalPath,
    ogType: 'article',
    imageUrl: `/og?kind=surah&surah=${surah.id}`,
    keywords: buildSurahPageKeywords({
      surahId: surah.id,
      surahName: surah.surahName,
      surahNameArabic: surah.surahNameArabic,
      surahNameTranslation: surah.surahNameTranslation,
    }),
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

  let previewAyahs: Awaited<ReturnType<typeof getAyahRowsForSurah>> = [];
  try {
    const ayahRows = await getAyahRowsForSurah(surah.id);
    previewAyahs = ayahRows.slice(0, SEO_AYAH_PREVIEW_COUNT);
  } catch {
    previewAyahs = [];
  }

  const surahPath = buildSurahPath(surah.id, surah.surahName);
  const surahBreadcrumbLabel = `Surah ${surah.surahName}`;

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', item: '/' },
    { name: surahBreadcrumbLabel, item: surahPath },
  ]);
  const canonicalPath = surahPath;
  const surahJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `Surah ${surah.surahName}`,
    alternateName: [surah.surahNameArabic, surah.surahNameTranslation],
    inLanguage: ['ar', 'ur', 'en'],
    url: toAbsoluteUrl(canonicalPath),
    about: `Quran Surah ${surah.id}`,
    numberOfPages: surah.totalAyah,
  };

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

      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <BreadcrumbNav
            items={[
              { label: 'Home', href: '/' },
              { label: surahBreadcrumbLabel, href: surahPath },
            ]}
            includeSchema={false}
          />
          <h1 className="font-display text-3xl text-[var(--color-heading)] sm:text-4xl">
            {`Surah ${surah.surahName} (${surah.surahNameArabic})`}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--color-muted-text)] sm:text-base">
            {`Surah ${surah.surahNameTranslation} — ${surah.totalAyah} ayahs with Arabic text, Urdu and English translation, audio recitation, bookmarks, and Urdu tafseer.`}
          </p>

          {previewAyahs.length > 0 ? (
            <article className="mt-6 space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 sm:p-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                Surah Text Preview
              </h2>
              {previewAyahs.map((ayah) => {
                const ayahPath = buildAyahPath(surah.id, surah.surahName, ayah.ayahNumber);

                return (
                  <div key={ayah.ayahNumber} className="space-y-2 border-b border-[var(--color-border)] pb-4 last:border-b-0 last:pb-0">
                    <p className="text-xs font-semibold text-[var(--color-muted-text)]">
                      <Link href={ayahPath} className="hover:text-[var(--color-accent)]">
                        Ayah {surah.id}:{ayah.ayahNumber}
                      </Link>
                    </p>
                    {ayah.arabicText ? (
                      <p className="arabic-font text-right text-xl leading-relaxed text-[var(--color-heading)]">
                        {ayah.arabicText}
                      </p>
                    ) : null}
                    {ayah.urduTranslation ? (
                      <p className="text-sm leading-relaxed text-[var(--color-text)]">{ayah.urduTranslation}</p>
                    ) : null}
                    {ayah.englishTranslation ? (
                      <p className="text-sm leading-relaxed text-[var(--color-muted-text)]">{ayah.englishTranslation}</p>
                    ) : null}
                  </div>
                );
              })}
              <p className="text-xs text-[var(--color-muted-text)]">
                <Link href={buildAyahPath(surah.id, surah.surahName, 1)} className="font-semibold text-[var(--color-accent)] hover:underline">
                  Read all {surah.totalAyah} ayahs of Surah {surah.surahName}
                </Link>
              </p>
            </article>
          ) : null}
        </div>
      </section>

      <QuranReaderPage />
    </>
  );
}

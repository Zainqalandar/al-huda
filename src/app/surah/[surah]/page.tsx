import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { Download, FileText, Headphones } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSurahMetaById } from '@/lib/quran-server';
import { getAllSurahs, resolveSurahParam } from '@/lib/quran-index';
import {
  buildAyahPath,
  buildSurahSlug,
  buildSurahPath,
  buildTafsirPath,
  buildUrduTranslationAudioUrl,
} from '@/lib/quran-routing';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import { hasTafsirForAyah } from '@/lib/tafsir-index';

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

function getArabicSurahAudioUrl(audio: Record<string, { url?: string }> | undefined) {
  if (!audio) {
    return null;
  }

  const available = Object.values(audio)
    .map((entry) => String(entry?.url ?? '').trim())
    .filter(Boolean);

  return available[0] ?? null;
}

export async function generateMetadata({
  params,
}: SurahPageProps): Promise<Metadata> {
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
  const description = `Surah ${surah.surahName} (${surah.surahNameTranslation}) read karein: Arabic text, Urdu tarjuma, ayah links, tafseer links, aur audio playback/download options.`;
  const canonicalPath = buildSurahPath(surah.id, surah.surahName);

  return buildPageMetadata({
    title,
    description,
    path: canonicalPath,
    ogType: 'article',
    imageUrl: `/og?kind=surah&surah=${surah.id}`,
  });
}

export default async function SurahDetailPage({
  params,
}: SurahPageProps) {
  const { surah: surahParam } = await params;
  const resolved = resolveSurahParam(surahParam);

  if (!resolved) {
    notFound();
  }

  const { surah, isCanonicalSlug } = resolved;

  if (!isCanonicalSlug) {
    permanentRedirect(buildSurahPath(surah.id, surah.surahName));
  }

  const surahMeta = await getSurahMetaById(surah.id);
  const totalAyah = Math.max(0, Number(surahMeta.totalAyah ?? surah.totalAyah));
  const arabicAyahs = Array.isArray(surahMeta.arabic1) ? surahMeta.arabic1 : [];
  const urduAyahs = Array.isArray(surahMeta.urdu) ? surahMeta.urdu : [];
  const arabicAudioUrl = getArabicSurahAudioUrl(surahMeta.audio);
  const urduAudioUrl = buildUrduTranslationAudioUrl(surah.id);

  if (totalAyah <= 0) {
    notFound();
  }

  const canonicalPath = buildSurahPath(surah.id, surah.surahName);
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', item: '/' },
    { name: 'Surah Index', item: '/surah' },
    { name: `Surah ${surah.id}`, item: canonicalPath },
  ]);

  const audioJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AudioObject',
    name: `Surah ${surah.surahName} Audio`,
    inLanguage: ['ar', 'ur'],
    encodingFormat: 'audio/mpeg',
    contentUrl: arabicAudioUrl || urduAudioUrl,
  };

  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(audioJsonLd) }}
      />

      <section className="mb-6 animate-fade-up">
        <Badge className="mb-2">Surah {surah.id}</Badge>
        <h1 className="font-display text-4xl text-[var(--color-heading)] sm:text-5xl">
          Surah {surah.surahName}
        </h1>
        <p className="arabic-font mt-2 text-right text-3xl text-[var(--color-heading)]">
          {surah.surahNameArabic}
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-muted-text)] sm:text-base">
          {surah.surahNameTranslation} • {surah.revelationPlace} • {totalAyah} Ayahs. Is
          page par Arabic text, Urdu tarjuma, ayah pages, tafseer pages, aur audio
          downloads available hain.
        </p>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-xl">
              <Headphones className="size-5 text-[var(--color-accent)]" />
              Arabic Tilawat Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {arabicAudioUrl ? (
              <>
                <audio controls preload="none" className="w-full">
                  <source src={arabicAudioUrl} />
                </audio>
                <a
                  href={arabicAudioUrl}
                  download
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-soft)]"
                >
                  <Download className="size-4" />
                  Download Arabic Audio
                </a>
              </>
            ) : (
              <p className="text-sm text-[var(--color-muted-text)]">
                Arabic audio source unavailable.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-xl">
              <Headphones className="size-5 text-[var(--color-info)]" />
              Urdu Voice Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <audio controls preload="none" className="w-full">
              <source src={urduAudioUrl} />
            </audio>
            <a
              href={urduAudioUrl}
              download
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-soft)]"
            >
              <Download className="size-4" />
              Download Urdu Audio
            </a>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-4 font-display text-3xl text-[var(--color-heading)]">Ayahs</h2>
        <div className="space-y-4">
          {Array.from({ length: totalAyah }, (_, index) => {
            const ayahNumber = index + 1;
            const arabicText = String(arabicAyahs[index] ?? '').trim();
            const urduText = String(urduAyahs[index] ?? '').trim();
            const ayahPath = buildAyahPath(surah.id, surah.surahName, ayahNumber);
            const tafsirPath = buildTafsirPath(surah.id, surah.surahName, ayahNumber);
            const canOpenTafsir = hasTafsirForAyah(surah.id, ayahNumber);

            return (
              <Card key={ayahNumber} id={`ayah-${ayahNumber}`}>
                <CardContent className="space-y-3 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-[var(--color-heading)]">
                      Ayah {surah.id}:{ayahNumber}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <Link
                        href={ayahPath}
                        className="inline-flex items-center gap-1 text-[var(--color-accent)] hover:text-[var(--color-accent-soft)]"
                      >
                        <FileText className="size-4" />
                        Ayah Page
                      </Link>
                      {canOpenTafsir ? (
                        <Link
                          href={tafsirPath}
                          className="text-[var(--color-accent)] hover:text-[var(--color-accent-soft)]"
                        >
                          Urdu Tafseer
                        </Link>
                      ) : (
                        <span className="text-[var(--color-muted-text)]">Tafseer unavailable</span>
                      )}
                    </div>
                  </div>

                  <p lang="ar" dir="rtl" className="arabic-font text-right text-[var(--color-heading)]">
                    {arabicText || 'Arabic text unavailable.'}
                  </p>

                  <p lang="ur" dir="rtl" className="urdu-font text-right text-[var(--color-text)]">
                    {urduText || 'Urdu translation unavailable.'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

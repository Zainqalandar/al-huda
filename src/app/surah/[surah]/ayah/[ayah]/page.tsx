import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { ChevronLeft, ChevronRight, Download, FileText, Headphones } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getAyahAudioUrls,
  getAyahContent,
  getUrduTafsirByAyah,
  stripHtml,
} from '@/lib/quran-server';
import { resolveSurahParam } from '@/lib/quran-index';
import { buildAyahPath, buildSurahPath, buildTafsirPath } from '@/lib/quran-routing';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import { hasTafsirForAyah } from '@/lib/tafsir-index';

interface AyahPageProps {
  params: Promise<{
    surah: string;
    ayah: string;
  }>;
}

export const revalidate = 86400;

function parseAyahNumber(value: string) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
}

export async function generateMetadata({
  params,
}: AyahPageProps): Promise<Metadata> {
  const { surah: surahParam, ayah: ayahParam } = await params;
  const resolved = resolveSurahParam(surahParam);
  const ayahNumber = parseAyahNumber(ayahParam);

  if (!resolved || !ayahNumber || ayahNumber > resolved.surah.totalAyah) {
    return buildPageMetadata({
      title: 'Ayah Not Found',
      description: 'Requested ayah was not found.',
      path: '/surah',
      index: false,
    });
  }

  const surah = resolved.surah;
  const ayah = await getAyahContent(surah.id, ayahNumber);
  const canOpenTafsir = hasTafsirForAyah(surah.id, ayahNumber);
  const tafsir = canOpenTafsir
    ? await getUrduTafsirByAyah(surah.id, ayahNumber)
    : null;
  const canonicalPath = buildAyahPath(surah.id, surah.surahName, ayahNumber);

  const title = canOpenTafsir
    ? `Ayah ${surah.id}:${ayahNumber} (${surah.surahName}) – Arabic, Urdu & English Translation, Audio, Tafseer`
    : `Ayah ${surah.id}:${ayahNumber} (${surah.surahName}) – Arabic, Urdu & English Translation, Audio`;
  const fallbackDescription = canOpenTafsir
    ? `Ayah ${surah.id}:${ayahNumber} ka Arabic text, Urdu aur English translation, Arabic + Urdu audio, aur tafseer link.`
    : `Ayah ${surah.id}:${ayahNumber} ka Arabic text, Urdu aur English translation, aur Arabic + Urdu audio.`;
  const translationSnippet = [ayah?.urduTranslation, ayah?.englishTranslation]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .join(' ');
  const normalizedTranslationSnippet =
    translationSnippet.length > 170
      ? `${translationSnippet.slice(0, 167).trim()}...`
      : translationSnippet;
  const description = tafsir
    ? `${stripHtml(tafsir.textHtml).slice(0, 150)}...`
    : normalizedTranslationSnippet || fallbackDescription;

  return buildPageMetadata({
    title,
    description,
    path: canonicalPath,
    ogType: 'article',
    imageUrl: `/og?kind=ayah&surah=${surah.id}&ayah=${ayahNumber}`,
  });
}

export default async function AyahDetailPage({
  params,
}: AyahPageProps) {
  const { surah: surahParam, ayah: ayahParam } = await params;
  const resolved = resolveSurahParam(surahParam);
  const ayahNumber = parseAyahNumber(ayahParam);

  if (!resolved || !ayahNumber) {
    notFound();
  }

  const { surah, isCanonicalSlug } = resolved;

  if (ayahNumber > surah.totalAyah) {
    notFound();
  }

  if (!isCanonicalSlug) {
    permanentRedirect(buildAyahPath(surah.id, surah.surahName, ayahNumber));
  }

  const ayah = await getAyahContent(surah.id, ayahNumber);
  if (!ayah) {
    notFound();
  }

  const canOpenTafsir = hasTafsirForAyah(surah.id, ayahNumber);
  const [audioUrls, tafsir] = await Promise.all([
    getAyahAudioUrls(surah.id, ayahNumber),
    canOpenTafsir ? getUrduTafsirByAyah(surah.id, ayahNumber) : Promise.resolve(null),
  ]);

  const surahPath = buildSurahPath(surah.id, surah.surahName);
  const tafsirPath = buildTafsirPath(surah.id, surah.surahName, ayahNumber);
  const canonicalPath = buildAyahPath(surah.id, surah.surahName, ayahNumber);
  const prevAyahPath =
    ayahNumber > 1 ? buildAyahPath(surah.id, surah.surahName, ayahNumber - 1) : null;
  const nextAyahPath =
    ayahNumber < surah.totalAyah
      ? buildAyahPath(surah.id, surah.surahName, ayahNumber + 1)
      : null;

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', item: '/' },
    { name: 'Surah Index', item: '/surah' },
    { name: `Surah ${surah.id}`, item: surahPath },
    { name: `Ayah ${surah.id}:${ayahNumber}`, item: canonicalPath },
  ]);

  const audioJsonLd = [
    audioUrls.arabic
      ? {
          '@context': 'https://schema.org',
          '@type': 'AudioObject',
          name: `Ayah ${surah.id}:${ayahNumber} Arabic Audio`,
          inLanguage: 'ar',
          contentUrl: audioUrls.arabic,
        }
      : null,
    audioUrls.urdu
      ? {
          '@context': 'https://schema.org',
          '@type': 'AudioObject',
          name: `Ayah ${surah.id}:${ayahNumber} Urdu Audio`,
          inLanguage: 'ur',
          contentUrl: audioUrls.urdu,
        }
      : null,
  ].filter(Boolean);

  const tafsirSnippet = tafsir ? stripHtml(tafsir.textHtml).slice(0, 280) : null;

  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {audioJsonLd.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(audioJsonLd) }}
        />
      ) : null}

      <nav className="mb-3 text-xs text-[var(--color-muted-text)]">
        <Link href="/">Home</Link> / <Link href="/surah">Surah</Link> /{' '}
        <Link href={surahPath}>Surah {surah.id}</Link> / Ayah {ayahNumber}
      </nav>

      <section className="mb-6">
        <Badge className="mb-2">Ayah {surah.id}:{ayahNumber}</Badge>
        <h1 className="font-display text-4xl text-[var(--color-heading)] sm:text-5xl">
          Ayah {surah.id}:{ayahNumber} • Surah {surah.surahName}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-muted-text)] sm:text-base">
          Arabic matn, Urdu aur English translation, downloadable audio, aur tafseer link
          is page par available hai.
        </p>
      </section>

      <Card className="mb-6">
        <CardContent className="space-y-4 p-5">
          <p lang="ar" dir="rtl" className="arabic-font text-right text-[var(--color-heading)]">
            {ayah.arabicText || 'Arabic text unavailable.'}
          </p>
          <p lang="ur" dir="rtl" className="urdu-font text-right text-[var(--color-text)]">
            {ayah.urduTranslation || 'Urdu translation unavailable.'}
          </p>
          <p lang="en" dir="ltr" className="text-left text-[var(--color-text)]">
            {ayah.englishTranslation || 'English translation unavailable.'}
          </p>
        </CardContent>
      </Card>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-lg">
              <Headphones className="size-5 text-[var(--color-accent)]" />
              Arabic Ayah Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {audioUrls.arabic ? (
              <>
                <audio controls preload="none" className="w-full">
                  <source src={audioUrls.arabic} />
                </audio>
                <a
                  href={audioUrls.arabic}
                  download
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-soft)]"
                >
                  <Download className="size-4" />
                  Download Arabic Audio
                </a>
              </>
            ) : (
              <p className="text-sm text-[var(--color-muted-text)]">Audio unavailable.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-lg">
              <Headphones className="size-5 text-[var(--color-info)]" />
              Urdu Ayah Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {audioUrls.urdu ? (
              <>
                <audio controls preload="none" className="w-full">
                  <source src={audioUrls.urdu} />
                </audio>
                <a
                  href={audioUrls.urdu}
                  download
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-soft)]"
                >
                  <Download className="size-4" />
                  Download Urdu Audio
                </a>
              </>
            ) : (
              <p className="text-sm text-[var(--color-muted-text)]">Audio unavailable.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 font-display text-2xl text-[var(--color-heading)]">Urdu Tafseer</h2>
        {tafsir ? (
          <Card>
            <CardContent className="space-y-3 p-5">
              <p className="text-sm leading-relaxed text-[var(--color-text)]" lang="ur" dir="rtl">
                {tafsirSnippet}
                {tafsirSnippet && tafsirSnippet.length >= 280 ? '...' : ''}
              </p>
              <Link
                href={tafsirPath}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-soft)]"
              >
                <FileText className="size-4" />
                Open Complete Urdu Tafseer
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-5 text-sm text-[var(--color-muted-text)]">
              Is ayah ke liye tafseer abhi available nahi hai.
            </CardContent>
          </Card>
        )}
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {prevAyahPath ? (
            <Link
              href={prevAyahPath}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-accent-soft)]"
            >
              <ChevronLeft className="size-4" />
              Previous Ayah
            </Link>
          ) : null}
          {nextAyahPath ? (
            <Link
              href={nextAyahPath}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-accent-soft)]"
            >
              Next Ayah
              <ChevronRight className="size-4" />
            </Link>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={surahPath}
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-accent-soft)]"
          >
            Back to Surah
          </Link>
          {canOpenTafsir ? (
            <Link
              href={tafsirPath}
              className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-accent-soft)]"
            >
              Tafseer Page
            </Link>
          ) : (
            <span className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-muted-text)]">
              Tafseer unavailable
            </span>
          )}
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { ChevronLeft, Download, Headphones } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getAyahAudioUrls,
  getAyahContent,
  getUrduTafsirByAyah,
  sanitizeTafsirHtml,
  stripHtml,
} from '@/lib/quran-server';
import { resolveSurahParam } from '@/lib/quran-index';
import { buildAyahPath, buildSurahPath, buildTafsirPath } from '@/lib/quran-routing';
import { buildBreadcrumbJsonLd, buildPageMetadata, getSiteOrigin } from '@/lib/seo';
import { hasTafsirForAyah } from '@/lib/tafsir-index';

interface TafsirPageProps {
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
}: TafsirPageProps): Promise<Metadata> {
  const { surah: surahParam, ayah: ayahParam } = await params;
  const resolved = resolveSurahParam(surahParam);
  const ayahNumber = parseAyahNumber(ayahParam);

  if (!resolved || !ayahNumber || ayahNumber > resolved.surah.totalAyah) {
    return buildPageMetadata({
      title: 'Tafseer Not Found',
      description: 'Requested tafseer page was not found.',
      path: '/surah',
      index: false,
    });
  }

  const surah = resolved.surah;
  if (!hasTafsirForAyah(surah.id, ayahNumber)) {
    return buildPageMetadata({
      title: `Tafseer ${surah.id}:${ayahNumber} Not Available`,
      description: 'Requested tafseer content is unavailable.',
      path: buildAyahPath(surah.id, surah.surahName, ayahNumber),
      index: false,
    });
  }

  const tafsir = await getUrduTafsirByAyah(surah.id, ayahNumber);
  if (!tafsir) {
    return buildPageMetadata({
      title: `Tafseer ${surah.id}:${ayahNumber} Not Available`,
      description: 'Requested tafseer content is unavailable.',
      path: buildAyahPath(surah.id, surah.surahName, ayahNumber),
      index: false,
    });
  }

  const canonicalPath = buildTafsirPath(surah.id, surah.surahName, ayahNumber);
  const title = `Tafseer of Ayah ${surah.id}:${ayahNumber} – Urdu Tafseer, Arabic Text, Audio`;
  const description = stripHtml(tafsir.textHtml).slice(0, 155);

  return buildPageMetadata({
    title,
    description,
    path: canonicalPath,
    ogType: 'article',
    imageUrl: `/og?kind=tafsir&surah=${surah.id}&ayah=${ayahNumber}`,
  });
}

export default async function TafsirDetailPage({
  params,
}: TafsirPageProps) {
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
    permanentRedirect(buildTafsirPath(surah.id, surah.surahName, ayahNumber));
  }

  if (!hasTafsirForAyah(surah.id, ayahNumber)) {
    notFound();
  }

  const [ayah, tafsir, audioUrls] = await Promise.all([
    getAyahContent(surah.id, ayahNumber),
    getUrduTafsirByAyah(surah.id, ayahNumber),
    getAyahAudioUrls(surah.id, ayahNumber),
  ]);

  if (!ayah || !tafsir) {
    notFound();
  }

  const safeTafsirHtml = sanitizeTafsirHtml(tafsir.textHtml);
  const surahPath = buildSurahPath(surah.id, surah.surahName);
  const ayahPath = buildAyahPath(surah.id, surah.surahName, ayahNumber);
  const canonicalPath = buildTafsirPath(surah.id, surah.surahName, ayahNumber);

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', item: '/' },
    { name: 'Surah Index', item: '/surah' },
    { name: `Surah ${surah.id}`, item: surahPath },
    { name: `Ayah ${surah.id}:${ayahNumber}`, item: ayahPath },
    { name: 'Urdu Tafseer', item: canonicalPath },
  ]);

  const creativeWorkJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `Urdu Tafseer - Surah ${surah.id} Ayah ${ayahNumber}`,
    inLanguage: 'ur',
    isPartOf: {
      '@type': 'CreativeWork',
      name: `Surah ${surah.surahName}`,
    },
    url: `${getSiteOrigin()}${canonicalPath}`,
    about: `Quran ayah ${surah.id}:${ayahNumber}`,
    text: stripHtml(tafsir.textHtml).slice(0, 300),
  };

  const audioJsonLd = [
    audioUrls.arabic
      ? {
          '@context': 'https://schema.org',
          '@type': 'AudioObject',
          name: `Arabic Audio - Surah ${surah.id} Ayah ${ayahNumber}`,
          inLanguage: 'ar',
          contentUrl: audioUrls.arabic,
        }
      : null,
    audioUrls.urdu
      ? {
          '@context': 'https://schema.org',
          '@type': 'AudioObject',
          name: `Urdu Audio - Surah ${surah.id} Ayah ${ayahNumber}`,
          inLanguage: 'ur',
          contentUrl: audioUrls.urdu,
        }
      : null,
  ].filter(Boolean);

  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
      {audioJsonLd.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(audioJsonLd) }}
        />
      ) : null}

      <nav className="mb-3 text-xs text-[var(--color-muted-text)]">
        <Link href="/">Home</Link> / <Link href="/surah">Surah</Link> /{' '}
        <Link href={surahPath}>Surah {surah.id}</Link> /{' '}
        <Link href={ayahPath}>Ayah {ayahNumber}</Link> / Tafseer
      </nav>

      <section className="mb-6">
        <Badge className="mb-2">Urdu Tafseer</Badge>
        <h1 className="font-display text-4xl text-[var(--color-heading)] sm:text-5xl">
          Tafseer of Ayah {surah.id}:{ayahNumber}
        </h1>
      </section>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-[var(--color-heading)]">
            Arabic + Urdu Reference
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          <p lang="ar" dir="rtl" className="arabic-font text-right text-[var(--color-heading)]">
            {ayah.arabicText}
          </p>
          <p lang="ur" dir="rtl" className="urdu-font text-right text-[var(--color-text)]">
            {ayah.urduTranslation}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-[var(--color-heading)]">Urdu Tafseer</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div
            className="tafseer-rich urdu-font space-y-4 text-right text-[var(--color-text)]"
            lang="ur"
            dir="rtl"
            dangerouslySetInnerHTML={{ __html: safeTafsirHtml }}
          />
        </CardContent>
      </Card>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 text-lg">
              <Headphones className="size-5 text-[var(--color-accent)]" />
              Arabic Audio
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
              Urdu Audio
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

      <section className="flex flex-wrap items-center gap-2">
        <Link
          href={ayahPath}
          className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-accent-soft)]"
        >
          <ChevronLeft className="size-4" />
          Back to Ayah Page
        </Link>
        <Link
          href={surahPath}
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm hover:border-[var(--color-accent-soft)]"
        >
          Back to Surah
        </Link>
      </section>
    </div>
  );
}

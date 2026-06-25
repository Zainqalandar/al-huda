import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArabicText from '@/components/hadith/ArabicText';
import HadithGrade from '@/components/hadith/HadithGrade';
import HadithActions from '@/components/hadith/HadithActions';
import HadithNavigation from '@/components/hadith/HadithNavigation';
import BreadcrumbNav from '@/components/hadith/BreadcrumbNav';
import { getCollectionBySlug } from '@/lib/hadith/collections.service';
import { getHadithByNumber } from '@/lib/hadith/hadith.service';
import {
  buildHadithCollectionPath,
  buildHadithDetailPath,
  buildHadithOgImagePath,
} from '@/lib/hadith/hadith-routing';
import { buildHadithDetailKeywords } from '@/lib/seo-keywords';
import {
  buildBreadcrumbJsonLd,
  buildHadithArticleJsonLd,
  buildPageMetadata,
} from '@/lib/seo';

export const revalidate = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string; book: string; hadithNumber: string }>;
}): Promise<Metadata> {
  const { collection, hadithNumber } = await params;
  const hadith = await getHadithByNumber(collection, hadithNumber);
  if (!hadith) return {};

  const description = hadith.hadithEnglish.slice(0, 155).trim();
  const path = buildHadithDetailPath(collection, hadithNumber);
  const title = `Hadith ${hadithNumber} – ${hadith.book.bookName}`;

  return buildPageMetadata({
    title,
    description,
    path,
    ogType: 'article',
    keywords: buildHadithDetailKeywords({
      bookName: hadith.book.bookName,
      writerName: hadith.book.writerName,
      hadithNumber,
      chapterEnglish: hadith.chapter.chapterEnglish,
      grade: hadith.status,
    }),
    author: hadith.englishNarrator || hadith.book.writerName,
    imageUrl: buildHadithOgImagePath({
      variant: 'detail',
      bookName: hadith.book.bookName,
      hadithNumber,
    }),
  });
}

export default async function HadithDetailPage({
  params,
}: {
  params: Promise<{ collection: string; book: string; hadithNumber: string }>;
}) {
  const { collection, hadithNumber } = await params;

  const [hadith, bookData] = await Promise.all([
    getHadithByNumber(collection, hadithNumber),
    getCollectionBySlug(collection),
  ]);

  if (!hadith || !bookData) notFound();

  const detailPath = buildHadithDetailPath(collection, hadithNumber);
  const collectionPath = buildHadithCollectionPath(collection);
  const title = `Hadith ${hadithNumber} – ${hadith.book.bookName}`;
  const description = hadith.hadithEnglish.slice(0, 155).trim();
  const keywords = buildHadithDetailKeywords({
    bookName: hadith.book.bookName,
    writerName: hadith.book.writerName,
    hadithNumber,
    chapterEnglish: hadith.chapter.chapterEnglish,
    grade: hadith.status,
  });

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', item: '/' },
    { name: 'Hadith', item: '/hadith' },
    { name: bookData.bookName, item: collectionPath },
    { name: `Hadith ${hadithNumber}`, item: detailPath },
  ]);

  const articleJsonLd = buildHadithArticleJsonLd({
    title,
    description,
    content: hadith.hadithEnglish,
    path: detailPath,
    author: hadith.englishNarrator || undefined,
    bookName: hadith.book.bookName,
    bookAuthor: hadith.book.writerName,
    keywords,
    inLanguage: ['en', 'ar', 'ur'],
    imageUrl: buildHadithOgImagePath({
      variant: 'detail',
      bookName: hadith.book.bookName,
      hadithNumber,
    }),
  });

  const navBreadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Hadith', href: '/hadith' },
    { label: bookData.bookName, href: collectionPath },
    { label: `Hadith ${hadithNumber}`, href: detailPath },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="space-y-6 max-w-3xl">
        <BreadcrumbNav items={navBreadcrumbs} includeSchema={false} />

        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-heading)]">
              Hadith #{hadithNumber}
            </h1>
            <p className="mt-1 text-[var(--color-muted-text)]">
              {hadith.book.bookName} · {hadith.chapter.chapterEnglish}
            </p>
          </div>
          <HadithGrade grade={hadith.status} />
        </header>

        {hadith.englishNarrator && (
          <p className="font-medium text-[var(--color-accent-soft)]">
            {hadith.englishNarrator}
          </p>
        )}

        {hadith.hadithArabic && (
          <div className="rounded-xl border-r-4 border-[var(--color-accent)] bg-[color-mix(in_oklab,var(--color-accent),var(--color-surface)_92%)] p-6">
            <ArabicText text={hadith.hadithArabic} size="lg" className="text-[var(--color-heading)]" />
          </div>
        )}

        <div className="max-w-none">
          <p className="text-lg leading-relaxed text-[var(--color-text)]">
            {hadith.hadithEnglish}
          </p>
        </div>

        {hadith.hadithUrdu && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
            <p
              dir="rtl"
              lang="ur"
              className="text-right font-urdu-nastaliq text-lg leading-loose text-[var(--color-text)]"
            >
              {hadith.hadithUrdu}
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 border-t border-[var(--color-border)] pt-4">
          <HadithActions hadith={hadith} />
        </div>

        <HadithNavigation
          bookSlug={collection}
          currentNumber={parseInt(hadithNumber, 10)}
          totalHadiths={bookData.hadiths_count}
        />
      </div>
    </>
  );
}

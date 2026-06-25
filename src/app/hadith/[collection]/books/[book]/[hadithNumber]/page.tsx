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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Hadith #{hadithNumber}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {hadith.book.bookName} · {hadith.chapter.chapterEnglish}
            </p>
          </div>
          <HadithGrade grade={hadith.status} />
        </header>

        {hadith.englishNarrator && (
          <p className="text-emerald-700 dark:text-emerald-400 font-medium">
            {hadith.englishNarrator}
          </p>
        )}

        {hadith.hadithArabic && (
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-6 border-r-4 border-amber-400">
            <ArabicText text={hadith.hadithArabic} size="lg" />
          </div>
        )}

        <div className="prose dark:prose-invert prose-emerald max-w-none">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg">
            {hadith.hadithEnglish}
          </p>
        </div>

        {hadith.hadithUrdu && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5">
            <p
              dir="rtl"
              lang="ur"
              className="text-gray-700 dark:text-gray-300 leading-loose text-right font-urdu-nastaliq text-lg"
            >
              {hadith.hadithUrdu}
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
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

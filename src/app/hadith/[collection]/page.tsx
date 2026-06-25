import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BreadcrumbNav from '@/components/hadith/BreadcrumbNav';
import {
  getAllCollections,
  getCollectionBySlug,
  getChaptersByCollection,
} from '@/lib/hadith/collections.service';
import {
  buildHadithCollectionPath,
  buildHadithBookPath,
  buildHadithOgImagePath,
} from '@/lib/hadith/hadith-routing';
import { buildHadithCollectionKeywords } from '@/lib/seo-keywords';
import {
  buildBookJsonLd,
  buildBreadcrumbJsonLd,
  buildPageMetadata,
} from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  const collections = await getAllCollections();
  return collections.map((c) => ({ collection: c.bookSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection } = await params;
  const book = await getCollectionBySlug(collection);
  if (!book) return {};

  const path = buildHadithCollectionPath(collection);
  const title = `${book.bookName} – Read Online (English & Urdu)`;
  const description = `Browse all chapters and hadiths from ${book.bookName} by ${book.writerName}. ${book.hadiths_count.toLocaleString()} hadiths with Arabic, English and Urdu translations.`;

  return buildPageMetadata({
    title,
    description,
    path,
    ogType: 'article',
    keywords: buildHadithCollectionKeywords(book.bookName, book.writerName),
    imageUrl: buildHadithOgImagePath({ variant: 'collection', bookName: book.bookName }),
  });
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const [book, chapters] = await Promise.all([
    getCollectionBySlug(collection),
    getChaptersByCollection(collection),
  ]);

  if (!book) notFound();

  const collectionPath = buildHadithCollectionPath(collection);
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', item: '/' },
    { name: 'Hadith', item: '/hadith' },
    { name: book.bookName, item: collectionPath },
  ]);
  const bookJsonLd = buildBookJsonLd({
    name: book.bookName,
    description: `Authentic hadith collection compiled by ${book.writerName}.`,
    path: collectionPath,
    author: book.writerName,
    numberOfPages: book.hadiths_count,
    inLanguage: ['ar', 'en', 'ur'],
  });

  const navBreadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Hadith', href: '/hadith' },
    { label: book.bookName, href: collectionPath },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />

      <div className="space-y-6">
        <BreadcrumbNav items={navBreadcrumbs} includeSchema={false} />

        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{book.bookName}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            By {book.writerName} ·{' '}
            <span className="font-medium">{book.hadiths_count.toLocaleString()} hadiths</span> ·{' '}
            {chapters.length} chapters
          </p>
        </header>

        <section aria-labelledby="chapters-heading">
          <h2 id="chapters-heading" className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Chapters
          </h2>
          <div className="space-y-1">
            {chapters.map((chapter) => (
              <Link
                key={chapter.id}
                href={buildHadithBookPath(collection, {
                  chapter: chapter.chapterNumber,
                  page: 1,
                })}
                className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white dark:hover:bg-gray-900 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-all group"
              >
                <span className="text-sm font-mono text-gray-400 w-8 shrink-0">
                  {chapter.chapterNumber}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {chapter.chapterEnglish}
                  </p>
                  {chapter.chapterArabic && (
                    <p dir="rtl" lang="ar" className="text-sm text-gray-400 mt-0.5 font-arabic-amiri">
                      {chapter.chapterArabic}
                    </p>
                  )}
                </div>
                <svg className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 transition-colors shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

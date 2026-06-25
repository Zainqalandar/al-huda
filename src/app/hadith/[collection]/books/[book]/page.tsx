import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HadithCard from '@/components/hadith/HadithCard';
import HadithPagination from '@/components/hadith/HadithPagination';
import BreadcrumbNav from '@/components/hadith/BreadcrumbNav';
import { getCollectionBySlug, getChaptersByCollection } from '@/lib/hadith/collections.service';
import { getHadiths } from '@/lib/hadith/hadith.service';
import {
  buildHadithBookPath,
  buildHadithCollectionPath,
  buildHadithOgImagePath,
} from '@/lib/hadith/hadith-routing';
import { buildHadithCollectionKeywords } from '@/lib/seo-keywords';
import { buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string; book: string }>;
  searchParams: Promise<{ page?: string; chapter?: string }>;
}): Promise<Metadata> {
  const { collection } = await params;
  const { page = '1', chapter } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10));

  const [bookData, chapters] = await Promise.all([
    getCollectionBySlug(collection),
    chapter ? getChaptersByCollection(collection) : Promise.resolve([]),
  ]);

  if (!bookData) return {};

  const chapterMeta = chapter
    ? chapters.find((entry) => entry.chapterNumber === chapter)
    : undefined;

  const path = buildHadithBookPath(collection, { chapter, page: currentPage });
  const title = chapterMeta
    ? `${bookData.bookName} – ${chapterMeta.chapterEnglish}${currentPage > 1 ? ` (Page ${currentPage})` : ''}`
    : `${bookData.bookName} – All Hadiths${currentPage > 1 ? ` (Page ${currentPage})` : ''}`;
  const description = chapterMeta
    ? `Read hadiths from ${chapterMeta.chapterEnglish} in ${bookData.bookName} with Arabic, English and Urdu translations.`
    : `Read hadiths from ${bookData.bookName} by ${bookData.writerName} with Arabic, English and Urdu translations.`;

  return buildPageMetadata({
    title,
    description,
    path,
    ogType: 'article',
    keywords: buildHadithCollectionKeywords(bookData.bookName, bookData.writerName),
    imageUrl: buildHadithOgImagePath({ variant: 'collection', bookName: bookData.bookName }),
  });
}

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string; book: string }>;
  searchParams: Promise<{ page?: string; chapter?: string }>;
}) {
  const { collection } = await params;
  const { page = '1', chapter } = await searchParams;

  const currentPage = Math.max(1, parseInt(page, 10));

  const [bookData, hadithsData, chapters] = await Promise.all([
    getCollectionBySlug(collection),
    getHadiths({ bookSlug: collection, chapterId: chapter, page: currentPage }),
    chapter ? getChaptersByCollection(collection) : Promise.resolve([]),
  ]);

  if (!bookData) notFound();

  const chapterMeta = chapter
    ? chapters.find((entry) => entry.chapterNumber === chapter)
    : undefined;
  const collectionPath = buildHadithCollectionPath(collection);
  const bookPath = buildHadithBookPath(collection, { chapter, page: currentPage });

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: 'Home', item: '/' },
    { name: 'Hadith', item: '/hadith' },
    { name: bookData.bookName, item: collectionPath },
    {
      name: chapterMeta ? chapterMeta.chapterEnglish : 'Hadiths',
      item: bookPath,
    },
  ]);

  const navBreadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Hadith', href: '/hadith' },
    { label: bookData.bookName, href: collectionPath },
    {
      label: chapterMeta ? chapterMeta.chapterEnglish : 'Hadiths',
      href: bookPath,
    },
  ];

  const baseUrl = buildHadithBookPath(collection, { chapter });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="space-y-6">
        <BreadcrumbNav items={navBreadcrumbs} includeSchema={false} />

        <header>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {chapterMeta ? chapterMeta.chapterEnglish : bookData.bookName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {chapterMeta ? `${bookData.bookName} · ` : ''}
            Showing {hadithsData.hadiths.from}–{hadithsData.hadiths.to} of{' '}
            {hadithsData.hadiths.total.toLocaleString()} hadiths
          </p>
        </header>

        <div className="space-y-4">
          {hadithsData.hadiths.data.map((hadith) => (
            <HadithCard key={hadith.id} hadith={hadith} />
          ))}
        </div>

        <HadithPagination
          currentPage={currentPage}
          totalPages={hadithsData.hadiths.last_page}
          baseUrl={baseUrl}
        />
      </div>
    </>
  );
}

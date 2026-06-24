import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HadithCard from '@/components/hadith/HadithCard';
import HadithPagination from '@/components/hadith/HadithPagination';
import BreadcrumbNav from '@/components/hadith/BreadcrumbNav';
import { getCollectionBySlug } from '@/lib/hadith/collections.service';
import { getHadiths } from '@/lib/hadith/hadith.service';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string; book: string }>;
}): Promise<Metadata> {
  const { collection } = await params;
  const bookData = await getCollectionBySlug(collection);
  if (!bookData) return {};

  return {
    title: `${bookData.bookName} | Hadith | ReadAlQuran`,
    description: `Read hadiths from ${bookData.bookName} with Arabic, English and Urdu translations.`,
    alternates: {
      canonical: `https://readalquran.online/hadith/${collection}/books/${collection}`,
    },
  };
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

  const [bookData, hadithsData] = await Promise.all([
    getCollectionBySlug(collection),
    getHadiths({ bookSlug: collection, chapterId: chapter, page: currentPage }),
  ]);

  if (!bookData) notFound();

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Hadith', href: '/hadith' },
    { label: bookData.bookName, href: `/hadith/${collection}` },
    { label: 'Hadiths', href: `/hadith/${collection}/books/${collection}` },
  ];

  const baseUrl = `/hadith/${collection}/books/${collection}`;

  return (
    <div className="space-y-6">
      <BreadcrumbNav items={breadcrumbs} />

      <header>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{bookData.bookName}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
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
  );
}

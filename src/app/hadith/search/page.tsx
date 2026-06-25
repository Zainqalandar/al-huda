import type { Metadata } from 'next';
import { Suspense } from 'react';
import HadithCard from '@/components/hadith/HadithCard';
import HadithPagination from '@/components/hadith/HadithPagination';
import { searchHadiths } from '@/lib/hadith/hadith.service';
import { buildHadithSearchPath } from '@/lib/hadith/hadith-routing';
import { HADITH_SEARCH_KEYWORDS } from '@/lib/seo-keywords';
import { buildPageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;

  return buildPageMetadata({
    title: q ? `"${q}" – Hadith Search` : 'Search Hadiths Online',
    description: q
      ? `Search results for "${q}" across authentic Hadith collections with English and Urdu translations.`
      : 'Search thousands of authentic hadiths by keyword across Sahih Bukhari, Sahih Muslim, and the six major books.',
    path: q ? `${buildHadithSearchPath()}?q=${encodeURIComponent(q)}` : buildHadithSearchPath(),
    index: false,
    keywords: HADITH_SEARCH_KEYWORDS,
  });
}

async function SearchResults({ query, page }: { query: string; page: number }) {
  if (!query) {
    return (
      <div className="text-center py-16 text-[var(--color-muted-text)]">
        <p className="text-lg">Type a keyword above to search hadiths</p>
      </div>
    );
  }

  const results = await searchHadiths(query, page);

  if (results.hadiths.data.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">No hadiths found for "{query}"</p>
        <p className="text-sm mt-2">Try different keywords</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-muted-text)]">
        {results.hadiths.total.toLocaleString()} results for "{query}"
      </p>
      {results.hadiths.data.map((hadith) => (
        <HadithCard key={hadith.id} hadith={hadith} showBook />
      ))}
      <HadithPagination
        currentPage={page}
        totalPages={results.hadiths.last_page}
        baseUrl={buildHadithSearchPath()}
      />
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = '', page = '1' } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-heading)]">Search Hadiths</h1>
      <Suspense fallback={<div className="text-[var(--color-muted-text)] text-sm">Searching...</div>}>
        <SearchResults query={q} page={currentPage} />
      </Suspense>
    </div>
  );
}

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function HadithSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
      params.delete('page');
    } else {
      params.delete('q');
    }
    startTransition(() => {
      router.push(`/hadith/search?${params.toString()}`);
    });
  }, 400);

  return (
    <div className="relative">
      <label htmlFor="hadith-search" className="sr-only">Search Hadiths</label>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        <input
          id="hadith-search"
          type="search"
          placeholder="Search hadiths in English..."
          defaultValue={searchParams.get('q') ?? ''}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          aria-label="Search hadiths"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true">
            <div className="h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

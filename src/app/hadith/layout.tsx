import type { Metadata } from 'next';
import Link from 'next/link';
import HadithSearch from '@/components/hadith/HadithSearch';
import { getAllCollections } from '@/lib/hadith/collections.service';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: {
    template: '%s | Hadith | ReadAlQuran',
    default: 'Hadith Collections | ReadAlQuran',
  },
};

export default async function HadithLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collections = await getAllCollections();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <Suspense>
            <HadithSearch />
          </Suspense>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex gap-0 lg:gap-8 px-4 py-6">
        <aside
          className="hidden lg:block w-64 shrink-0"
          aria-label="Hadith collections navigation"
        >
          <nav className="sticky top-20 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
              Collections
            </p>
            {collections.map((col) => (
              <Link
                key={col.bookSlug}
                href={`/hadith/${col.bookSlug}`}
                className="block px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                {col.bookName}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

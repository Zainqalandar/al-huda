import type { Metadata } from 'next';
import Link from 'next/link';
import HadithSearch from '@/components/hadith/HadithSearch';
import { getAllCollections } from '@/lib/hadith/collections.service';
import { getSiteName } from '@/lib/seo';
import { Suspense } from 'react';

const siteName = getSiteName();

export const metadata: Metadata = {
  title: {
    template: `%s | Hadith | ${siteName}`,
    default: `Hadith Collections | ${siteName}`,
  },
};

export default async function HadithLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collections = await getAllCollections();

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="sticky top-0 z-10 bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 py-3">
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
            <p className="text-xs font-semibold text-[var(--color-muted-text)] uppercase tracking-wider mb-3 px-3">
              Collections
            </p>
            {collections.map((col) => (
              <Link
                key={col.bookSlug}
                href={`/hadith/${col.bookSlug}`}
                className="block px-3 py-2 rounded-lg text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-accent)] dark:hover:text-[var(--color-accent-soft)] transition-colors"
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

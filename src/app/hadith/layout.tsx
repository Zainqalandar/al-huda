import type { Metadata } from 'next';
import { Suspense } from 'react';

import HadithSearch from '@/components/hadith/HadithSearch';
import HadithSidebarNav from '@/components/hadith/HadithSidebarNav';
import HadithMobileNav from '@/components/hadith/HadithMobileNav';
import { getAllCollections } from '@/lib/hadith/collections.service';
import { getSiteName } from '@/lib/seo';

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
  const totalHadiths = collections.reduce((sum, col) => sum + col.hadiths_count, 0);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" data-slot="page-shell">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl space-y-3 px-4 py-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Hadith Library
            </p>
            <p className="text-xs text-[var(--color-muted-text)]">
              {collections.length} collections · {totalHadiths.toLocaleString()} hadiths
            </p>
          </div>
          <Suspense>
            <HadithSearch />
          </Suspense>
          <HadithMobileNav collections={collections} />
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-0 px-4 py-6 lg:gap-8 lg:py-8">
        <aside className="hidden w-64 shrink-0 lg:block" aria-label="Hadith collections sidebar">
          <div className="sticky top-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-soft)]">
            <HadithSidebarNav collections={collections} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-16" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

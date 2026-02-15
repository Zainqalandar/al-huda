import { Compass, Search, SlidersHorizontal } from 'lucide-react';
import type { Metadata } from 'next';

import SurahList from '@/components/quran';
import QuranSettingsPanel from '@/components/quran/quran-settings-panel';
import Filter from '@/components/ui/Filter';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Quran Directory',
  description:
    'Browse all 114 surahs, search quickly, change reading settings, and continue from your saved progress.',
  alternates: {
    canonical: '/quran',
  },
};

export default function QuranPage() {
  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <section className="mb-6 animate-fade-up">
        <Badge className="mb-2">Al-Quran</Badge>
        <h1 className="font-display text-4xl text-[var(--color-heading)] sm:text-5xl">
          Surah Directory
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted-text)] sm:text-base">
          Search and sort all surahs, continue from your last read ayah, and keep your
          favorites in one place. Settings icon se yahin se reading preferences control karein.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm text-[var(--color-muted-text)]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-heading)]">
              <Compass className="size-4 text-[var(--color-accent)]" />
              Complete Surah Index
            </span>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm text-[var(--color-muted-text)]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-heading)]">
              <Search className="size-4 text-[var(--color-info)]" />
              Fast Search & Filter
            </span>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2 text-sm text-[var(--color-muted-text)]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-heading)]">
              <SlidersHorizontal className="size-4 text-[var(--color-highlight)]" />
              Reader Preferences
            </span>
          </div>
        </div>

        <QuranSettingsPanel />
      </section>

      <Filter />
      <SurahList />
    </div>
  );
}

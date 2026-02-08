import Link from 'next/link';
import { BookMarked, Compass, HeartHandshake, Sparkles } from 'lucide-react';

import navLinks from '@/lib/navLinks';

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_65%)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-surface),white_8%),var(--color-surface))]">
      <div className="pointer-events-none absolute -left-16 top-4 size-56 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-accent),transparent_78%)_0%,transparent_72%)] blur-2xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 size-64 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-highlight),transparent_84%)_0%,transparent_74%)] blur-2xl" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2">
        <div className="space-y-3">
          <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.28em] text-[var(--color-muted-text)]">
            <Sparkles className="size-4 text-[var(--color-accent)]" />
            Quranic Reflection
          </p>
          <h2 className="font-display text-2xl text-[var(--color-heading)]">
            Read with Khushu, Learn with Clarity
          </h2>
          <p className="max-w-md text-sm text-[var(--color-muted-text)]">
            Al-Huda provides Quran reading, recitation audio, and study tools in a
            focused and respectful interface.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[var(--color-muted-text)]">
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2.5 py-1">
              <BookMarked className="size-3.5 text-[var(--color-accent)]" />
              Bookmark Ayahs
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2.5 py-1">
              <Compass className="size-3.5 text-[var(--color-info)]" />
              Surah Navigator
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2.5 py-1">
              <HeartHandshake className="size-3.5 text-[var(--color-highlight)]" />
              Daily Reflection
            </span>
          </div>
        </div>

        <div className="space-y-3 md:justify-self-end md:text-right">
          <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-muted-text)]">
            Explore
          </h3>
          <div className="flex flex-wrap gap-2 md:justify-end">
            {navLinks.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-1 text-xs font-semibold text-[var(--color-muted-text)] transition-all duration-200 hover:-translate-y-px hover:border-[var(--color-accent-soft)] hover:text-[var(--color-heading)]"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <p className="text-xs text-[var(--color-muted-text)]">
            © {new Date().getFullYear()} Al-Huda. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

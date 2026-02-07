import Link from 'next/link';

import navLinks from '@/lib/navLinks';

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-muted-text)]">
            Quranic Reflection
          </p>
          <h2 className="font-display text-2xl text-[var(--color-heading)]">
            Read with Khushu, Learn with Clarity
          </h2>
          <p className="max-w-md text-sm text-[var(--color-muted-text)]">
            Al-Huda provides Quran reading, recitation audio, and study tools in a
            focused and respectful interface.
          </p>
        </div>

        <div className="space-y-3 md:justify-self-end md:text-right">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-muted-text)]">
            Explore
          </h3>
          <div className="flex flex-wrap gap-2 md:justify-end">
            {navLinks.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-muted-text)] transition-colors hover:border-[var(--color-accent-soft)] hover:text-[var(--color-accent)]"
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

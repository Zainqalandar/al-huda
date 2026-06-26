'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, ChevronRight } from 'lucide-react';

import type { HadithBook } from '@/lib/hadith/types/hadith.types';
import { cn } from '@/lib/utils';

interface HadithSidebarNavProps {
  collections: HadithBook[];
  className?: string;
}

export default function HadithSidebarNav({ collections, className }: HadithSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('space-y-1', className)} aria-label="Hadith collections navigation">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-text)]">
        Collections
      </p>
      {collections.map((col) => {
        const href = `/hadith/${col.bookSlug}`;
        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={col.bookSlug}
            href={href}
            className={cn(
              'group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-all',
              isActive
                ? 'bg-[color-mix(in_oklab,var(--color-accent),var(--color-surface)_88%)] font-semibold text-[var(--color-accent-soft)] shadow-[var(--shadow-soft)]'
                : 'text-[var(--color-text)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-accent-soft)]'
            )}
          >
            <BookOpen
              className={cn(
                'size-4 shrink-0',
                isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted-text)]'
              )}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate">{col.bookName}</span>
            <ChevronRight
              className={cn(
                'size-3.5 shrink-0 opacity-0 transition-all group-hover:opacity-100',
                isActive && 'opacity-100 text-[var(--color-accent)]'
              )}
              aria-hidden="true"
            />
          </Link>
        );
      })}
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { buildHadithBookPath, buildHadithCollectionPath } from '@/lib/hadith/hadith-routing';
import type { HadithChapter } from '@/lib/hadith/types/hadith.types';
import { cn } from '@/lib/utils';

interface ChapterFilterBarProps {
  collectionSlug: string;
  chapters: HadithChapter[];
  activeChapter?: string;
}

export default function ChapterFilterBar({
  collectionSlug,
  chapters,
  activeChapter,
}: ChapterFilterBarProps) {
  const pathname = usePathname();
  const isBookListPage = pathname.includes('/books/');

  if (!isBookListPage || chapters.length === 0) return null;

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max gap-2" role="tablist" aria-label="Filter by chapter">
        <Link
          href={buildHadithBookPath(collectionSlug)}
          role="tab"
          aria-selected={!activeChapter}
          className={cn(
            'rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
            !activeChapter
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-foreground)]'
              : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-accent-soft)]'
          )}
        >
          All chapters
        </Link>
        {chapters.slice(0, 12).map((chapter) => {
          const isActive = activeChapter === chapter.chapterNumber;
          return (
            <Link
              key={chapter.id}
              href={buildHadithBookPath(collectionSlug, {
                chapter: chapter.chapterNumber,
                page: 1,
              })}
              role="tab"
              aria-selected={isActive}
              title={chapter.chapterEnglish}
              className={cn(
                'max-w-[12rem] truncate rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
                isActive
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-foreground)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-accent-soft)]'
              )}
            >
              {chapter.chapterNumber}. {chapter.chapterEnglish}
            </Link>
          );
        })}
        {chapters.length > 12 ? (
          <Link
            href={buildHadithCollectionPath(collectionSlug)}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-accent-soft)] hover:border-[var(--color-accent-soft)]"
          >
            +{chapters.length - 12} more
          </Link>
        ) : null}
      </div>
    </div>
  );
}

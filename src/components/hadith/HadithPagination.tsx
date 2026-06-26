import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { PaginationProps } from '@/lib/hadith/types/hadith.types';

export default function HadithPagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}page=${page}`;
  };

  const pages: (number | 'ellipsis')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
    >
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          aria-label="Previous page"
          className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-[var(--color-muted-text)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-heading)]"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          Previous
        </Link>
      ) : null}

      {pages.map((page, index) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-[var(--color-muted-text)]">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`flex size-9 items-center justify-center rounded-xl text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] shadow-[var(--shadow-soft)]'
                : 'text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-heading)]'
            }`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          aria-label="Next page"
          className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-[var(--color-muted-text)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-heading)]"
        >
          Next
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : null}
    </nav>
  );
}

import Link from 'next/link';
import type { PaginationProps } from '@/lib/hadith/types/hadith.types';

export default function HadithPagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => `${baseUrl}?page=${page}`;

  const pages: (number | 'ellipsis')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          aria-label="Previous page"
          className="px-3 py-2 rounded-lg text-sm text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] dark:hover:bg-[var(--color-surface-3)] transition-colors"
        >
          ← Previous
        </Link>
      )}

      {pages.map((page, i) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-[var(--color-muted-text)]">…</span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${
              page === currentPage
                ? 'bg-[var(--color-accent)] font-medium text-[var(--color-accent-foreground)]'
                : 'text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] dark:hover:bg-[var(--color-surface-3)]'
            }`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          aria-label="Next page"
          className="px-3 py-2 rounded-lg text-sm text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] dark:hover:bg-[var(--color-surface-3)] transition-colors"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}

import Link from 'next/link';
import type { HadithBook } from '@/lib/hadith/types/hadith.types';

interface CollectionGridProps {
  collections: HadithBook[];
}

export default function CollectionGrid({ collections }: CollectionGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => (
        <Link
          key={collection.bookSlug}
          href={`/hadith/${collection.bookSlug}`}
          className="group block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-soft)]"
        >
          <div className="mb-3 flex items-start justify-between">
            <h2 className="font-semibold text-[var(--color-heading)] transition-colors group-hover:text-[var(--color-accent-soft)]">
              {collection.bookName}
            </h2>
            <span className="ml-2 shrink-0 rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-xs text-[var(--color-muted-text)]">
              {collection.hadiths_count.toLocaleString()}
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-[var(--color-muted-text)]">
            {collection.writerName}
          </p>
          <p className="mt-3 inline-block text-xs font-medium text-[var(--color-accent-soft)] transition-transform group-hover:translate-x-1">
            Browse collection →
          </p>
        </Link>
      ))}
    </div>
  );
}

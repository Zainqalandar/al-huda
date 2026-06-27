import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { HadithBook } from '@/lib/hadith/types/hadith.types';

interface CollectionGridProps {
  collections: HadithBook[];
}

const FEATURED_SLUGS = new Set([
  'sahih-bukhari',
  'sahih-muslim',
  'abu-dawood',
  'al-tirmidhi',
  'sunan-nasai',
  'ibn-e-majah',
]);

export default function CollectionGrid({ collections }: CollectionGridProps) {
  const sorted = [...collections].sort((a, b) => {
    const aFeatured = FEATURED_SLUGS.has(a.bookSlug) ? 0 : 1;
    const bFeatured = FEATURED_SLUGS.has(b.bookSlug) ? 0 : 1;
    return aFeatured - bFeatured || a.bookName.localeCompare(b.bookName);
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {sorted.map((collection) => {
        const isFeatured = FEATURED_SLUGS.has(collection.bookSlug);

        return (
          <Link
            key={collection.bookSlug}
            href={`/hadith/${collection.bookSlug}`}
            className="group block"
          >
            <Card className="h-full border-[var(--color-border)] transition-all duration-300 group-hover:border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_40%)] group-hover:shadow-[var(--shadow-card)]">
              <CardContent className="flex h-full flex-col p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_oklab,var(--color-accent),var(--color-surface)_88%)] text-[var(--color-accent-soft)] transition-colors group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-accent-foreground)]">
                    <BookOpen className="size-5" aria-hidden="true" />
                  </div>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {isFeatured ? (
                      <Badge variant="secondary" className="text-[10px]">
                        Major Book
                      </Badge>
                    ) : null}
                    <Badge variant="outline" className="text-[10px]">
                      {collection.hadiths_count.toLocaleString()} hadiths
                    </Badge>
                  </div>
                </div>

                <h2 className="font-display text-xl font-bold text-[var(--color-heading)] transition-colors group-hover:text-[var(--color-accent-soft)]">
                  {collection.bookName}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-[var(--color-muted-text)]">
                  {collection.writerName}
                </p>

                {collection.volumes ? (
                  <p className="mt-2 text-xs text-[var(--color-muted-text)]">
                    {collection.volumes} volume{collection.volumes !== 1 ? 's' : ''}
                  </p>
                ) : null}

                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-[var(--color-accent-soft)] transition-all group-hover:gap-2">
                  Browse collection
                  <ChevronRight className="size-4" aria-hidden="true" />
                </span>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

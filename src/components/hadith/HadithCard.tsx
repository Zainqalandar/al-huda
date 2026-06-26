import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import ArabicText from './ArabicText';
import HadithGrade from './HadithGrade';
import HadithActions from './HadithActions';
import { Card, CardContent } from '@/components/ui/card';
import { buildHadithDetailPath } from '@/lib/hadith/hadith-routing';
import type { HadithItem } from '@/lib/hadith/types/hadith.types';

interface HadithCardProps {
  hadith: HadithItem;
  showBook?: boolean;
}

export default function HadithCard({ hadith, showBook = false }: HadithCardProps) {
  const detailUrl = buildHadithDetailPath(hadith.book.bookSlug, hadith.hadithNumber);

  return (
    <Card
      className="overflow-hidden border-[var(--color-border)] transition-shadow hover:shadow-[var(--shadow-card)]"
      id={`hadith-${hadith.hadithNumber}`}
    >
      <CardContent className="space-y-4 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-lg bg-[var(--color-surface-2)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--color-heading)]">
              #{hadith.hadithNumber}
            </span>
            {showBook ? (
              <span className="text-sm text-[var(--color-muted-text)]">{hadith.book.bookName}</span>
            ) : (
              <span className="text-xs text-[var(--color-muted-text)]">
                {hadith.chapter.chapterEnglish}
              </span>
            )}
          </div>
          <HadithGrade grade={hadith.status} />
        </div>

        {hadith.englishNarrator ? (
          <p className="text-sm font-medium text-[var(--color-accent-soft)]">
            {hadith.englishNarrator}
          </p>
        ) : null}

        {hadith.hadithArabic ? (
          <div className="rounded-2xl border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_40%)] border-r-4 border-r-[var(--color-accent)] bg-[color-mix(in_oklab,var(--color-accent),var(--color-surface)_94%)] px-4 py-3">
            <ArabicText text={hadith.hadithArabic} size="md" className="text-[var(--color-heading)]" />
          </div>
        ) : null}

        <p className="line-clamp-4 text-base leading-relaxed text-[var(--color-text)]">
          {hadith.hadithEnglish}
        </p>

        {hadith.hadithUrdu ? (
          <p
            dir="rtl"
            lang="ur"
            className="line-clamp-3 text-right font-urdu-nastaliq text-base leading-loose text-[var(--color-muted-text)]"
          >
            {hadith.hadithUrdu}
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
          <Link
            href={detailUrl}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-accent-soft)] transition-colors hover:text-[var(--color-accent)]"
          >
            Read full hadith
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </Link>
          <HadithActions hadith={hadith} shareUrl={detailUrl} />
        </div>
      </CardContent>
    </Card>
  );
}

import Link from 'next/link';
import ArabicText from './ArabicText';
import HadithGrade from './HadithGrade';
import HadithActions from './HadithActions';
import type { HadithItem } from '@/lib/hadith/types/hadith.types';

interface HadithCardProps {
  hadith: HadithItem;
  showBook?: boolean;
}

export default function HadithCard({ hadith, showBook = false }: HadithCardProps) {
  const detailUrl = `/hadith/${hadith.book.bookSlug}/books/${hadith.book.bookSlug}/${hadith.hadithNumber}`;

  return (
    <article
      className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
      id={`hadith-${hadith.hadithNumber}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-[var(--color-muted-text)]">
            #{hadith.hadithNumber}
          </span>
          {showBook && (
            <span className="text-sm text-[var(--color-muted-text)]">
              · {hadith.book.bookName}
            </span>
          )}
        </div>
        <HadithGrade grade={hadith.status} />
      </div>

      {hadith.englishNarrator && (
        <p className="text-sm font-medium text-[var(--color-accent-soft)]">
          {hadith.englishNarrator}
        </p>
      )}

      {hadith.hadithArabic && (
        <div className="rounded-xl border-r-4 border-[var(--color-accent)] bg-[color-mix(in_oklab,var(--color-accent),var(--color-surface)_92%)] py-2 pr-4">
          <ArabicText text={hadith.hadithArabic} size="md" className="text-[var(--color-heading)]" />
        </div>
      )}

      <p className="text-base leading-relaxed text-[var(--color-text)]">
        {hadith.hadithEnglish}
      </p>

      {hadith.hadithUrdu && (
        <p
          dir="rtl"
          lang="ur"
          className="text-right font-urdu-nastaliq leading-loose text-[var(--color-text)]"
        >
          {hadith.hadithUrdu}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-2">
        <Link
          href={detailUrl}
          className="text-sm font-medium text-[var(--color-accent-soft)] transition-colors hover:text-[var(--color-accent)]"
        >
          View details →
        </Link>
        <HadithActions hadith={hadith} />
      </div>
    </article>
  );
}

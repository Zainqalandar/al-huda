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
      className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 space-y-4"
      id={`hadith-${hadith.hadithNumber}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-[var(--color-muted-text)]">
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
        <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
          {hadith.englishNarrator}
        </p>
      )}

      {hadith.hadithArabic && (
        <div className="border-r-4 border-emerald-500 pr-4 py-2">
          <ArabicText text={hadith.hadithArabic} size="md" />
        </div>
      )}

      <p className="text-[var(--color-text)] leading-relaxed text-base">
        {hadith.hadithEnglish}
      </p>

      {hadith.hadithUrdu && (
        <p
          dir="rtl"
          lang="ur"
          className="text-[var(--color-text)] leading-loose text-right font-urdu-nastaliq"
        >
          {hadith.hadithUrdu}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
        <Link
          href={detailUrl}
          className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium"
        >
          View details →
        </Link>
        <HadithActions hadith={hadith} />
      </div>
    </article>
  );
}

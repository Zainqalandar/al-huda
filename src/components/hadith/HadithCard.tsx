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
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4"
      id={`hadith-${hadith.hadithNumber}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
            #{hadith.hadithNumber}
          </span>
          {showBook && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
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

      <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base">
        {hadith.hadithEnglish}
      </p>

      {hadith.hadithUrdu && (
        <p
          dir="rtl"
          lang="ur"
          className="text-gray-700 dark:text-gray-300 leading-loose text-right font-urdu-nastaliq"
        >
          {hadith.hadithUrdu}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
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

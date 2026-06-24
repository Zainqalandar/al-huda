interface HadithNavigationProps {
  bookSlug: string;
  currentNumber: number;
  totalHadiths: number;
}

export default function HadithNavigation({
  bookSlug,
  currentNumber,
  totalHadiths,
}: HadithNavigationProps) {
  const baseUrl = `/hadith/${bookSlug}/books/${bookSlug}`;

  return (
    <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-800 mt-8">
      {currentNumber > 1 ? (
        <a
          href={`${baseUrl}/${currentNumber - 1}`}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous Hadith
        </a>
      ) : (
        <div />
      )}

      <span className="text-sm text-gray-400">
        {currentNumber} / {totalHadiths}
      </span>

      {currentNumber < totalHadiths ? (
        <a
          href={`${baseUrl}/${currentNumber + 1}`}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          Next Hadith
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      ) : (
        <div />
      )}
    </div>
  );
}

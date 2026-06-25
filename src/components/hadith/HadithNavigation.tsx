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
    <div className="mt-8 flex items-center justify-between border-t border-[var(--color-border)] py-4">
      {currentNumber > 1 ? (
        <a
          href={`${baseUrl}/${currentNumber - 1}`}
          className="flex items-center gap-2 text-sm text-[var(--color-muted-text)] transition-colors hover:text-[var(--color-accent-soft)]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous Hadith
        </a>
      ) : (
        <div />
      )}

      <span className="text-sm text-[var(--color-muted-text)]">
        {currentNumber} / {totalHadiths}
      </span>

      {currentNumber < totalHadiths ? (
        <a
          href={`${baseUrl}/${currentNumber + 1}`}
          className="flex items-center gap-2 text-sm text-[var(--color-muted-text)] transition-colors hover:text-[var(--color-accent-soft)]"
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

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { buildHadithDetailPath } from '@/lib/hadith/hadith-routing';

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
  const prevUrl =
    currentNumber > 1 ? buildHadithDetailPath(bookSlug, currentNumber - 1) : null;
  const nextUrl =
    currentNumber < totalHadiths
      ? buildHadithDetailPath(bookSlug, currentNumber + 1)
      : null;

  return (
    <nav
      aria-label="Hadith navigation"
      className="mt-8 flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      {prevUrl ? (
        <Button asChild variant="outline" size="sm" className="justify-start">
          <Link href={prevUrl}>
            <ChevronLeft className="size-4" aria-hidden="true" />
            Hadith #{currentNumber - 1}
          </Link>
        </Button>
      ) : (
        <div className="hidden sm:block" />
      )}

      <p className="text-center text-sm font-medium text-[var(--color-muted-text)]">
        Hadith {currentNumber} of {totalHadiths.toLocaleString()}
      </p>

      {nextUrl ? (
        <Button asChild variant="outline" size="sm" className="justify-end sm:ml-auto">
          <Link href={nextUrl}>
            Hadith #{currentNumber + 1}
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  );
}

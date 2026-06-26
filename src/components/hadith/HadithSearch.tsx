'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { Search } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

import { buildHadithSearchPath } from '@/lib/hadith/hadith-routing';

export default function HadithSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const isSearchPage = pathname.startsWith(buildHadithSearchPath());
  const currentQuery = searchParams.get('q') ?? '';

  const navigateToSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams();
      const trimmed = term.trim();

      if (trimmed) {
        params.set('q', trimmed);
      }

      startTransition(() => {
        router.push(`${buildHadithSearchPath()}?${params.toString()}`);
      });
    },
    [router]
  );

  const handleLiveSearch = useDebouncedCallback((term: string) => {
    if (isSearchPage) {
      navigateToSearch(term);
    }
  }, 400);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const term = String(formData.get('q') ?? '');
    navigateToSearch(term);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <label htmlFor="hadith-search" className="sr-only">
        Search Hadiths
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted-text)]"
          aria-hidden="true"
        />
        <input
          id="hadith-search"
          name="q"
          type="search"
          placeholder="Search hadiths in English or Urdu…"
          defaultValue={currentQuery}
          onChange={(event) => handleLiveSearch(event.target.value)}
          className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-11 pr-24 text-sm text-[var(--color-text)] shadow-[var(--shadow-soft)] outline-none transition-all focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          aria-label="Search hadiths"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-2">
          {isPending ? (
            <div
              className="size-4 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent"
              aria-hidden="true"
            />
          ) : null}
          <button
            type="submit"
            className="rounded-xl bg-[var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-[var(--color-accent-foreground)] transition-opacity hover:opacity-90"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

'use client';

import { ArrowUpDown, RotateCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useSurahContext } from '@/hooks/useSurahContext';
import type { SurahSortBy } from '@/types/quran';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function Filter() {
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    order,
    setOrder,
    resetFilters,
    filterSurahs,
  } = useSurahContext();

  const [queryInput, setQueryInput] = useState(searchQuery);
const debouncedQuery = useDebouncedValue(queryInput, 300);

useEffect(() => {
  if (debouncedQuery !== searchQuery) {
    setSearchQuery(debouncedQuery);
  }
}, [debouncedQuery, searchQuery, setSearchQuery]);

useEffect(() => {
  setQueryInput(searchQuery);
}, [searchQuery]);

const handleReset = () => {
  resetFilters();
  setQueryInput('');
};

  console.log('FilterSurahs:', filterSurahs);

  return (
    <Card className="mb-6">
      <CardContent className="p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1.3fr_auto_auto_auto] lg:items-end">
          <div className="space-y-1">
            <label htmlFor="surah-search" className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted-text)]">
              Search Surah
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted-text)]" />
              <Input
                id="surah-search"
                placeholder="Name, translation, or number"
                value={queryInput}
                onChange={(event) => setQueryInput(event.target.value)}
                className="pl-9"
                aria-label="Search Surahs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="surah-sort" className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-muted-text)]">
              Sort by
            </label>
            <select
              id="surah-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SurahSortBy)}
              className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm font-medium text-[var(--color-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            >
              <option value="id">Number</option>
              <option value="surahName">Name</option>
              <option value="totalAyah">Ayah count</option>
            </select>
          </div>

          <Button
            type="button"
            variant="outline"
            className="lg:mb-px"
            onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
            aria-label="Toggle sort direction"
          >
            <ArrowUpDown className="size-4" />
            {order === 'asc' ? 'Ascending' : 'Descending'}
          </Button>

          <Button type="button" variant="secondary" className="lg:mb-px" onClick={handleReset}>
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>

        <p className="mt-3 text-xs text-[var(--color-muted-text)]">
          Showing {filterSurahs.length} surah{filterSurahs.length === 1 ? '' : 's'}.
        </p>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { Loader2, Search } from 'lucide-react';

interface SearchResult {
  surahId: number;
  surahName: string;
  surahNameArabic?: string;
  surahNameTranslation?: string;
  similarity: number;
  relevance: string;
}

const inputClassName =
  'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-muted-text)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]';

const primaryButtonClassName =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_40%)] bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] px-6 py-3 font-semibold text-[var(--color-accent-foreground)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50';

export function SemanticSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchType, setSearchType] = useState<'surahs' | 'ayahs'>('surahs');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/vector/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          searchType,
          limit: 8,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Search failed';
      setError(errorMsg);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-heading)]">Semantic Search</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-text)]">
          Find Surahs by meaning and theme, not just keywords
        </p>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="e.g., Surahs about patience, guidance, healing..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={inputClassName}
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading || !query.trim()} className={primaryButtonClassName}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Search
              </>
            )}
          </button>
        </div>

        <div className="flex gap-4 text-sm text-[var(--color-text)]">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="searchType"
              value="surahs"
              checked={searchType === 'surahs'}
              onChange={(e) => setSearchType(e.target.value as 'surahs' | 'ayahs')}
              className="h-4 w-4 accent-[var(--color-accent)]"
            />
            <span>Search Surahs</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="searchType"
              value="ayahs"
              checked={searchType === 'ayahs'}
              onChange={(e) => setSearchType(e.target.value as 'surahs' | 'ayahs')}
              className="h-4 w-4 accent-[var(--color-accent)]"
            />
            <span>Search Ayahs</span>
          </label>
        </div>
      </form>

      {error && (
        <div className="rounded-xl border border-[color-mix(in_oklab,var(--color-danger),var(--color-border)_65%)] bg-[color-mix(in_oklab,var(--color-danger),var(--color-surface)_90%)] p-4 text-[var(--color-danger)]">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[var(--color-muted-text)]">
            Found {results.length} results
          </p>
          {results.map((result, idx) => (
            <div
              key={`${result.surahId}-${idx}`}
              className="rounded-xl border border-[var(--color-border)] p-4 transition-colors hover:bg-[var(--color-surface-2)]"
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <p className="font-semibold text-[var(--color-heading)]">{result.surahName}</p>
                  {result.surahNameArabic && (
                    <p className="mb-1 text-right text-lg font-arabic-amiri text-[var(--color-heading)]">
                      {result.surahNameArabic}
                    </p>
                  )}
                  {result.surahNameTranslation && (
                    <p className="text-sm text-[var(--color-muted-text)]">{result.surahNameTranslation}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold text-[var(--color-accent-soft)]">
                    {(result.similarity * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs capitalize text-[var(--color-muted-text)]">{result.relevance}</p>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--color-surface-3)]">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,var(--color-accent-soft),var(--color-accent))] transition-all"
                  style={{ width: `${result.similarity * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && !error && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 text-center text-[var(--color-muted-text)]">
          No results found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}

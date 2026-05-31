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
    <div className="w-full space-y-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div>
        <h2 className="text-2xl font-bold">Semantic Search</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </button>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="searchType"
              value="surahs"
              checked={searchType === 'surahs'}
              onChange={(e) => setSearchType(e.target.value as 'surahs' | 'ayahs')}
              className="w-4 h-4"
            />
            <span className="text-sm">Search Surahs</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="searchType"
              value="ayahs"
              checked={searchType === 'ayahs'}
              onChange={(e) => setSearchType(e.target.value as 'surahs' | 'ayahs')}
              className="w-4 h-4"
            />
            <span className="text-sm">Search Ayahs</span>
          </label>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-100">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            Found {results.length} results
          </p>
          {results.map((result, idx) => (
            <div
              key={`${result.surahId}-${idx}`}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {result.surahName}
                  </p>
                  {result.surahNameArabic && (
                    <p className="text-lg text-right mb-1">{result.surahNameArabic}</p>
                  )}
                  {result.surahNameTranslation && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {result.surahNameTranslation}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
                    {(result.similarity * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                    {result.relevance}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${result.similarity * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && !error && (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
}

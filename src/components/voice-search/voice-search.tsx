'use client';

import { useState, useRef } from 'react';

interface VoiceSearchResult {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  relevance: number;
  category: 'faq' | 'search';
}

interface VoiceSearchResponse {
  success: boolean;
  query: string;
  results?: VoiceSearchResult[];
  suggestedQuestions?: string[];
  error?: string;
}

const inputClassName =
  'flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-muted-text)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]';

const primaryButtonClassName =
  'rounded-xl border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_40%)] bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] px-6 py-2.5 font-semibold text-[var(--color-accent-foreground)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50';

export function VoiceSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VoiceSearchResult[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/voice/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, language: 'en' }),
      });

      const data = (await response.json()) as VoiceSearchResponse;
      setResults(data.results || []);
      setSuggestedQuestions(data.suggestedQuestions || []);
    } catch (error) {
      console.error('Voice search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition not supported in your browser');
      return;
    }

    const SpeechRecognitionCtor =
      (window as Window & { webkitSpeechRecognition?: new () => {
        onstart: (() => void) | null;
        onend: (() => void) | null;
        onresult: ((event: { results: Iterable<{ 0: { transcript: string } }> }) => void) | null;
        start: () => void;
        stop: () => void;
      } }).webkitSpeechRecognition ||
      (window as Window & { SpeechRecognition?: new () => {
        onstart: (() => void) | null;
        onend: (() => void) | null;
        onresult: ((event: { results: Iterable<{ 0: { transcript: string } }> }) => void) | null;
        start: () => void;
        stop: () => void;
      } }).SpeechRecognition;

    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      setQuery(transcript);
      handleSearch(transcript);
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]">
        <h1 className="mb-2 font-display text-3xl font-bold text-[var(--color-heading)]">Voice Search</h1>
        <p className="mb-6 text-sm text-[var(--color-muted-text)]">
          Ask questions about the Quran using text or your voice
        </p>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="Ask a question about the Quran..."
              className={inputClassName}
            />
            <button
              type="button"
              onClick={() => handleSearch(query)}
              disabled={loading}
              className={primaryButtonClassName}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <button
            type="button"
            onClick={listening ? stopListening : startListening}
            className={`w-full rounded-xl py-3 font-semibold transition-colors ${
              listening
                ? 'bg-[var(--color-danger)] text-white'
                : 'border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_40%)] bg-[color-mix(in_oklab,var(--color-accent),var(--color-surface)_88%)] text-[var(--color-accent-soft)] hover:brightness-105'
            }`}
          >
            {listening ? 'Stop Listening' : 'Start Voice Search'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-[var(--color-heading)]">Results</h2>
            {results.map((result) => (
              <div
                key={result.id}
                className="rounded-xl border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_45%)] border-l-4 border-l-[var(--color-accent)] bg-[color-mix(in_oklab,var(--color-accent),var(--color-surface)_92%)] p-4"
              >
                <h3 className="mb-2 text-lg font-semibold text-[var(--color-heading)]">{result.question}</h3>
                <p className="mb-3 text-[var(--color-text)]">{result.answer}</p>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_45%)] bg-[var(--color-surface)] px-2 py-1 text-xs text-[var(--color-accent-soft)]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-sm text-[var(--color-muted-text)]">
                  Relevance: {(result.relevance * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        )}

        {suggestedQuestions.length > 0 && results.length === 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-[var(--color-heading)]">Popular Questions</h2>
            <div className="grid gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    setQuery(q);
                    handleSearch(q);
                  }}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-left text-[var(--color-text)] transition-colors hover:border-[var(--color-accent-soft)] hover:bg-[color-mix(in_oklab,var(--color-accent),var(--color-surface)_92%)]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

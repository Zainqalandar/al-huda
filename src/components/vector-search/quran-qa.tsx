'use client';

import { useState } from 'react';
import { Loader2, Send, AlertCircle } from 'lucide-react';

interface QAResponse {
  question: string;
  answer: string;
  sources: Array<{
    surahId: number;
    ayahNumber: number;
    ayahText: string;
  }>;
  confidence: number;
}

const inputClassName =
  'min-h-[100px] w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-muted-text)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]';

const primaryButtonClassName =
  'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_40%)] bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] px-4 py-3 font-semibold text-[var(--color-accent-foreground)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50';

export function QuranQA() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<QAResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<QAResponse[]>([]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/vector/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, useCache: true }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to get answer');
      }

      const data = await res.json();
      setResponse(data);
      setHistory([data, ...history.slice(0, 4)]);
      setQuestion('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to get answer';
      setError(errorMsg);
      console.error('QA error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]">
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-heading)]">Ask the Quran</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-text)]">
          Ask questions about Quran meanings, Tafseer, and Islamic knowledge
        </p>
      </div>

      <form onSubmit={handleAsk} className="space-y-4">
        <textarea
          placeholder="Ask anything about the Quran... e.g., 'What does Ayat ul Kursi mean?' or 'What does Islam teach about patience?'"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
          className={inputClassName}
        />

        <button type="submit" disabled={loading || !question.trim()} className={primaryButtonClassName}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Ask AI Scholar
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="flex gap-3 rounded-xl border border-[color-mix(in_oklab,var(--color-danger),var(--color-border)_65%)] bg-[color-mix(in_oklab,var(--color-danger),var(--color-surface)_90%)] p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-danger)]" />
          <p className="text-[var(--color-danger)]">{error}</p>
        </div>
      )}

      {response && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_45%)] bg-[color-mix(in_oklab,var(--color-accent),var(--color-surface)_92%)] p-6">
            <p className="whitespace-pre-wrap leading-relaxed text-[var(--color-text)]">{response.answer}</p>

            {response.sources && response.sources.length > 0 && (
              <div className="mt-4 border-t border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_45%)] pt-4">
                <p className="mb-2 text-sm font-semibold text-[var(--color-heading)]">Sources:</p>
                <ul className="space-y-1">
                  {response.sources.map((source, idx) => (
                    <li key={idx} className="text-sm text-[var(--color-muted-text)]">
                      • Surah {source.surahId}, Ayah {source.ayahNumber}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {response.confidence && (
              <div className="mt-3 text-xs text-[var(--color-muted-text)]">
                Confidence: {(response.confidence * 100).toFixed(0)}%
              </div>
            )}
          </div>
        </div>
      )}

      {history.length > 1 && (
        <div className="space-y-2 border-t border-[var(--color-border)] pt-4">
          <p className="text-sm font-semibold text-[var(--color-muted-text)]">Recent Questions</p>
          <div className="max-h-[300px] space-y-2 overflow-y-auto">
            {history.slice(1).map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuestion(item.question)}
                className="w-full truncate rounded-lg p-2 text-left text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
              >
                &quot;{item.question.substring(0, 50)}...&quot;
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

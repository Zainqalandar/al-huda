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
      setHistory([data, ...history.slice(0, 4)]); // Keep last 5 questions
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
    <div className="w-full space-y-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div>
        <h2 className="text-2xl font-bold">Ask the Quran</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Ask questions about Quran meanings, Tafseer, and Islamic knowledge
        </p>
      </div>

      <form onSubmit={handleAsk} className="space-y-4">
        <div className="space-y-2">
          <textarea
            placeholder="Ask anything about the Quran... e.g., 'What does Ayat ul Kursi mean?' or 'What does Islam teach about patience?'"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Ask AI Scholar
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 dark:bg-red-900 dark:border-red-700">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 dark:text-red-100">{error}</p>
        </div>
      )}

      {response && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 p-6 rounded-lg border border-green-200 dark:border-green-700">
            <p className="text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
              {response.answer}
            </p>

            {response.sources && response.sources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📖 Sources:
                </p>
                <ul className="space-y-1">
                  {response.sources.map((source, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 dark:text-gray-400"
                    >
                      • Surah {source.surahId}, Ayah {source.ayahNumber}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {response.confidence && (
              <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                Confidence: {(response.confidence * 100).toFixed(0)}%
              </div>
            )}
          </div>
        </div>
      )}

      {history.length > 1 && (
        <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            💬 Recent Questions
          </p>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {history.slice(1).map((item, idx) => (
              <button
                key={idx}
                onClick={() => setQuestion(item.question)}
                className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300 truncate"
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

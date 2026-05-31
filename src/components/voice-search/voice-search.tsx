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

export function VoiceSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VoiceSearchResult[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

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

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.onstart = () => setListening(true);
    recognitionRef.current.onend = () => setListening(false);
    recognitionRef.current.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setQuery(transcript);
      handleSearch(transcript);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-amber-700 mb-6">🎤 Voice Search</h1>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="Ask a question about the Quran..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={() => handleSearch(query)}
              disabled={loading}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-400"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <button
            onClick={listening ? stopListening : startListening}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              listening ? 'bg-red-500 text-white' : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            {listening ? '⏹️ Stop Listening' : '🎤 Start Voice Search'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Results</h2>
            {results.map((result) => (
              <div key={result.id} className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{result.question}</h3>
                <p className="text-gray-700 mb-3">{result.answer}</p>
                <div className="flex gap-2 flex-wrap">
                  {result.keywords.map((kw) => (
                    <span key={kw} className="text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded">
                      {kw}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">Relevance: {(result.relevance * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        )}

        {suggestedQuestions.length > 0 && results.length === 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Popular Questions</h2>
            <div className="grid gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setQuery(q);
                    handleSearch(q);
                  }}
                  className="text-left p-3 bg-gray-100 hover:bg-amber-100 rounded-lg transition-colors"
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

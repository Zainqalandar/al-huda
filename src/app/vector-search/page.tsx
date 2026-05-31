import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VectorSearchTools } from '@/components/vector-search';

export const metadata: Metadata = {
  title: 'AI-Powered Quran Search - Al-Huda',
  description: 'Search the Quran by meaning and ask AI questions about Islamic knowledge',
  robots: {
    index: false, // Don't index demo page
  },
};

export default function VectorSearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Quran Explorer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Discover the Quran through semantic search and AI-powered insights
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🔍 Semantic Search
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Find Surahs and Ayahs by meaning, not just keywords
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                🤖 AI Scholar
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Ask questions and get AI-powered answers with Quranic sources
              </p>
            </div>
          </div>
        </div>

        {/* Tools */}
        <Suspense
          fallback={
            <div className="space-y-6 animate-pulse">
              <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </div>
          }
        >
          <VectorSearchTools />
        </Suspense>

        {/* Info Section */}
        <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Example Searches
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                📚 Semantic Search Examples:
              </h3>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• "Surahs about patience and perseverance"</li>
                <li>• "Verses on the Day of Judgment"</li>
                <li>• "Guidance and wisdom"</li>
                <li>• "Protection and seeking refuge"</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                ❓ Q&A Examples:
              </h3>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• "What does Ayat ul Kursi mean?"</li>
                <li>• "What are the benefits of Surah Yasin?"</li>
                <li>• "How does Islam teach compassion?"</li>
                <li>• "What is the significance of Surah Al-Fatiha?"</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>💡 Tip:</strong> The more specific your question, the better the AI responses will be.
              Try rephrasing your question to get more relevant results.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-8">
          <p>
            Powered by OpenAI embeddings and MongoDB Vector Search. All content from the Quran.
          </p>
        </div>
      </main>
    </div>
  );
}

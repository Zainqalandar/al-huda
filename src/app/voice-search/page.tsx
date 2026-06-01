import type { Metadata } from 'next';
import { VoiceSearch } from '@/components/voice-search';
import {
  buildPageMetadata,
  buildFaqJsonLd,
  buildSearchActionJsonLd,
  toAbsoluteUrl,
} from '@/lib/seo';
import { VOICE_SEARCH_KEYWORDS, VOICE_SEARCH_QUESTIONS } from '@/lib/seo-keywords';

export const metadata: Metadata = buildPageMetadata({
  title: 'Voice Search - Ask Questions About the Quran',
  description:
    'Use voice search to ask questions about the Quran. Al-Huda provides instant answers using AI and schema-optimized content for voice assistants.',
  path: '/voice-search',
  keywords: [...VOICE_SEARCH_KEYWORDS, 'voice search', 'voice assistant', 'ask quran questions'],
});

export default function VoiceSearchPage() {
  const faqSchema = buildFaqJsonLd(VOICE_SEARCH_QUESTIONS);
  const searchActionSchema = buildSearchActionJsonLd();

  return (
    <main className="min-h-screen bg-(--color-bg)">
      <div className="container mx-auto px-4 py-16 text-(--color-text)">
        <div className="max-w-4xl mx-auto">
          <VoiceSearch />

          <section className="mt-16">
            <h2 className="text-3xl font-bold text-(--color-heading) mb-8">Frequently Asked Questions</h2>
            <div className="grid gap-6">
              {VOICE_SEARCH_QUESTIONS.map((item) => (
                <details
                  key={item.question}
                  className="group border rounded-lg p-4 border-(--color-border) hover:border-(--color-accent) transition-colors"
                >
                  <summary className="cursor-pointer font-semibold text-(--color-heading) group-open:text-(--color-accent)">
                    {item.question}
                  </summary>
                  <p className="mt-4 leading-relaxed text-(--color-text)">{item.answer}</p>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {item.keywords.map((kw) => (
                      <span key={kw} className="text-xs bg-(--color-accent-soft) text-(--color-heading) px-2 py-1 rounded">
                        {kw}
                      </span>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-16 bg-(--color-surface) rounded-lg p-8 border border-(--color-border)">
            <h2 className="text-2xl font-bold text-(--color-heading) mb-4">🎤 Voice Search Benefits</h2>
            <ul className="space-y-3 text-(--color-text)">
              <li>✓ Ask questions naturally in conversational language</li>
              <li>✓ Get instant answers about Quranic verses and concepts</li>
              <li>✓ Compatible with Google Assistant, Alexa, and Siri</li>
              <li>✓ Optimized for all voice search devices</li>
              <li>✓ Multi-language support (English, Urdu, Arabic)</li>
              <li>✓ FAQ schema for better voice search indexing</li>
            </ul>
          </section>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(searchActionSchema) }} />
    </main>
  );
}

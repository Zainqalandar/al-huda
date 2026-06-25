import type { Metadata } from 'next';

import HomeRoot from '@/components/home';
import { MASTER_SEO_KEYWORDS, VOICE_SEARCH_QUESTIONS } from '@/lib/seo-keywords';
import { buildFaqJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Read Quran Online Free – Quran Pak with Urdu & English Translation, Audio, Tafseer',
  description:
    'Read al Quran: Read Quran online free with Arabic text, Urdu and English translation, ayah-wise tafseer, tilawat audio, bookmarks, and progress tracking. Open Surah Yaseen, Rahman, Kahf, Mulk, Waqiah, Ayat ul Kursi, and explore 114 Surahs with offline access.',
  path: '/',
  keywords: MASTER_SEO_KEYWORDS,
  imageUrl: '/og?kind=surah-index',
});

const faqJsonLd = buildFaqJsonLd([
  {
    question: 'How can I read Quran online with Urdu translation?',
    answer:
      'Open the Surah reader, switch to Arabic plus Urdu translation mode, and read ayah by ayah with synchronized highlighting. Read al Quran provides authentic Urdu translation alongside Arabic text for easy understanding.',
  },
  {
    question: 'Can I listen to Quran audio online and download audio?',
    answer:
      'Yes. Each surah and ayah includes online audio playback with multiple Arabic and Urdu voice options, and downloadable audio where available for offline listening.',
  },
  {
    question: 'Do ayah pages include tafseer in Urdu?',
    answer:
      'Yes. Ayah pages link directly to comprehensive Urdu tafseer pages when tafseer data is available for that ayah. You can explore the meaning and interpretation of each verse.',
  },
  {
    question: 'Can I open popular surahs like Yaseen, Rahman, Kahf, and Mulk?',
    answer:
      'Yes. All 114 surahs are available with Arabic text, Urdu and English translation, tafseer, and recitation audio. You can easily search and access popular surahs.',
  },
  {
    question: 'Is Read al Quran app available offline?',
    answer:
      'Yes, Read al Quran is a Progressive Web App (PWA) that works offline. Once loaded, you can continue reading the Quran without an internet connection.',
  },
  {
    question: 'Does Read al Quran track my reading progress?',
    answer:
      'Yes, Read al Quran automatically tracks your reading and listening progress, bookmarks, and liked verses so you can resume from where you left off.',
  },
  {
    question: 'How do I search for specific surahs or verses?',
    answer:
      'Use the search feature on the Surah Index page to find surahs by name, Arabic name, or verse number. The search includes all 114 surahs with instant results.',
  },
  {
    question: 'Can I use Read al Quran on mobile devices?',
    answer:
      'Yes, Read al Quran works on all devices - mobile phones, tablets, and desktops. It provides a responsive design that adapts to any screen size.',
  },
  ...VOICE_SEARCH_QUESTIONS.slice(0, 3).map((item) => ({
    question: item.question,
    answer: item.answer,
  })),
]);

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeRoot />
    </>
  );
}

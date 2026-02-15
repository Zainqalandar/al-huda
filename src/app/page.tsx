import type { Metadata } from 'next';

import HomeRoot from '@/components/home';
import {
  AUDIO_KEYWORDS,
  CORE_QURAN_KEYWORDS,
  SURAH_AYAH_KEYWORDS,
  URDU_TRANSLATION_KEYWORDS,
} from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title:
    'Read Quran Online – Quran Pak with Urdu & English Translation, Audio, Tafseer',
  description:
    'Read Quran online with Arabic text, Urdu and English translation, ayah-wise tafseer, tilawat audio, and bookmarks. Open Surah Yaseen, Rahman, Kahf, Mulk, Waqiah, Ayat ul Kursi, and more.',
  keywords: [
    ...CORE_QURAN_KEYWORDS,
    ...URDU_TRANSLATION_KEYWORDS,
    ...AUDIO_KEYWORDS,
    ...SURAH_AYAH_KEYWORDS,
  ],
  alternates: {
    canonical: '/',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How can I read Quran online with Urdu translation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Open the Surah reader, switch to Arabic plus Urdu translation mode, and read ayah by ayah with synchronized highlighting.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I listen to Quran audio online and download audio?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Each surah and ayah includes online audio playback with Arabic and Urdu voice options, and downloadable audio where available.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do ayah pages include tafseer in Urdu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Ayah pages link directly to Urdu tafseer pages when tafseer data is available for that ayah.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I open popular surahs like Yaseen, Rahman, Kahf, and Mulk?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Popular surahs are available with Arabic text, Urdu and English translation, and recitation audio.',
      },
    },
  ],
};

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

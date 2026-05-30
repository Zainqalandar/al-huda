import type { Metadata } from 'next';

import HomeRoot from '@/components/home';
import {
  AUDIO_KEYWORDS,
  CORE_QURAN_KEYWORDS,
  SURAH_AYAH_KEYWORDS,
  URDU_TRANSLATION_KEYWORDS,
  TAFSEER_LEARNING_KEYWORDS,
  ISLAMIC_LEARNING_KEYWORDS,
  ACCESSIBILITY_KEYWORDS,
} from '@/lib/seo-keywords';
import { buildWebsiteJsonLd, buildOrganizationJsonLd, buildFaqJsonLd, getSiteOrigin } from '@/lib/seo';

export const metadata: Metadata = {
  title:
    'Read Quran Online Free – Quran Pak with Urdu & English Translation, Audio, Tafseer',
  description:
    'Al-Huda: Read Quran online free with Arabic text, Urdu and English translation, ayah-wise tafseer, tilawat audio, bookmarks, and progress tracking. Open Surah Yaseen, Rahman, Kahf, Mulk, Waqiah, Ayat ul Kursi, and explore 114 Surahs with offline access.',
  keywords: [
    ...CORE_QURAN_KEYWORDS,
    ...URDU_TRANSLATION_KEYWORDS,
    ...AUDIO_KEYWORDS,
    ...SURAH_AYAH_KEYWORDS,
    ...TAFSEER_LEARNING_KEYWORDS,
    ...ISLAMIC_LEARNING_KEYWORDS,
    ...ACCESSIBILITY_KEYWORDS,
  ],
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      'ur-PK': '/',
      ar: '/',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'Read Quran Online Free – Al-Huda Quran',
    description: 'Al-Huda: The most accessible Quran reader with Arabic text, Urdu/English translations, audio, tafseer, and offline access.',
    url: getSiteOrigin(),
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: `${getSiteOrigin()}/logos/logo3.png`,
        width: 1200,
        height: 630,
        alt: 'Al-Huda Quran - Read, Listen, Learn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Read Quran Online Free – Al-Huda Quran',
    description: 'Accessible Quran reader with Arabic text, Urdu/English translations, audio, tafseer & offline access.',
  },
};

const faqJsonLd = buildFaqJsonLd([
  {
    question: 'How can I read Quran online with Urdu translation?',
    answer: 'Open the Surah reader, switch to Arabic plus Urdu translation mode, and read ayah by ayah with synchronized highlighting. Al-Huda provides authentic Urdu translation alongside Arabic text for easy understanding.',
  },
  {
    question: 'Can I listen to Quran audio online and download audio?',
    answer: 'Yes. Each surah and ayah includes online audio playback with multiple Arabic and Urdu voice options, and downloadable audio where available for offline listening.',
  },
  {
    question: 'Do ayah pages include tafseer in Urdu?',
    answer: 'Yes. Ayah pages link directly to comprehensive Urdu tafseer pages when tafseer data is available for that ayah. You can explore the meaning and interpretation of each verse.',
  },
  {
    question: 'Can I open popular surahs like Yaseen, Rahman, Kahf, and Mulk?',
    answer: 'Yes. All 114 surahs are available with Arabic text, Urdu and English translation, tafseer, and recitation audio. You can easily search and access popular surahs.',
  },
  {
    question: 'Is Al-Huda Quran app available offline?',
    answer: 'Yes, Al-Huda is a Progressive Web App (PWA) that works offline. Once loaded, you can continue reading the Quran without an internet connection.',
  },
  {
    question: 'Does Al-Huda track my reading progress?',
    answer: 'Yes, Al-Huda automatically tracks your reading and listening progress, bookmarks, and liked verses so you can resume from where you left off.',
  },
  {
    question: 'How do I search for specific surahs or verses?',
    answer: 'Use the search feature on the Surah Index page to find surahs by name, Arabic name, or verse number. The search includes all 114 surahs with instant results.',
  },
  {
    question: 'Can I use Al-Huda on mobile devices?',
    answer: 'Yes, Al-Huda works on all devices - mobile phones, tablets, and desktops. It provides a responsive design that adapts to any screen size.',
  },
]);

const websiteJsonLd = buildWebsiteJsonLd();
const organizationJsonLd = buildOrganizationJsonLd();

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HomeRoot />
    </>
  );
}

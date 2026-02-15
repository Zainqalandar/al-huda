import QuranReaderPage from '@/components/sidebar';
import type { Metadata } from 'next';

const MIN_SURAH_ID = 1;
const MAX_SURAH_ID = 114;

function normalizeSurahId(value: string) {
  const surahNumber = Number(value);
  if (!Number.isInteger(surahNumber)) {
    return MIN_SURAH_ID;
  }

  if (surahNumber < MIN_SURAH_ID || surahNumber > MAX_SURAH_ID) {
    return MIN_SURAH_ID;
  }

  return surahNumber;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: MAX_SURAH_ID }, (_, index) => ({
    id: String(index + 1),
  }));
}

export default function QuranChildPage() {
  return <QuranReaderPage />;
}

interface QuranChildPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: QuranChildPageProps): Promise<Metadata> {
  const { id } = await params;
  const normalized = normalizeSurahId(id);
  const title = `Surah ${normalized} Reader`;
  const description = `Read Surah ${normalized} with ayah-by-ayah navigation, audio recitation, Urdu translation, tafseer, and bookmarks.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/quran/${normalized}`,
    },
    openGraph: {
      title: `${title} | Al-Huda Quran`,
      description,
      url: `/quran/${normalized}`,
      type: 'article',
    },
    twitter: {
      title: `${title} | Al-Huda Quran`,
      description,
    },
  };
}

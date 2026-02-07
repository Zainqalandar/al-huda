import QuranReaderPage from '@/components/sidebar';
import type { Metadata } from 'next';

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
  const surahNumber = Number(id);
  const normalized = Number.isInteger(surahNumber) ? surahNumber : 1;

  return {
    title: `Surah ${normalized} Reader`,
    description: `Read Surah ${normalized} with responsive ayah view, bookmarks, and resume mode.`,
  };
}

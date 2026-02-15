import { permanentRedirect } from 'next/navigation';

import { getCanonicalSurahPathById } from '@/lib/quran-index';
import { parseSurahIdFromParam } from '@/lib/quran-routing';

interface LegacyQuranSurahPageProps {
  params: Promise<{ id: string }>;
}

export default async function LegacyQuranSurahPage({
  params,
}: LegacyQuranSurahPageProps) {
  const { id } = await params;
  const surahId = parseSurahIdFromParam(id);

  if (surahId) {
    const canonicalPath = getCanonicalSurahPathById(surahId);
    if (canonicalPath) {
      permanentRedirect(canonicalPath);
    }
  }

  permanentRedirect('/surah');
}

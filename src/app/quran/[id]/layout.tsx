'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import QuranAudioBottomBar from '@/components/ui/QuranAudioUI';

export default function QuranChildPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const initialSurah = useMemo(() => {
    const parsed = Number(rawId ?? 1);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 114) {
      return 1;
    }
    return parsed;
  }, [rawId]);

  return (
    <div className="relative bg-[var(--color-bg)]">
      {children}
      <QuranAudioBottomBar initialSurah={initialSurah} />
    </div>
  );
}

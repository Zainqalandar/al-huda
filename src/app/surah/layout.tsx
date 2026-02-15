import type { ReactNode } from 'react';

import { SurhasListProvider } from '@/context/SurhasListProvider';

interface SurahLayoutProps {
  children: ReactNode;
}

export default function SurahLayout({ children }: SurahLayoutProps) {
  return <SurhasListProvider>{children}</SurhasListProvider>;
}

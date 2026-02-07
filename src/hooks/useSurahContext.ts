'use client';

import { useContext } from 'react';

import { SurhasList } from '@/context/SurhasListProvider';

export function useSurahContext() {
  const context = useContext(SurhasList);
  if (!context) {
    throw new Error('useSurahContext must be used inside SurhasListProvider');
  }
  return context;
}

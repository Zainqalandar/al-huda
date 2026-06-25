import type { FeatureTourStep } from '@/lib/feature-tour-types';

export const HOME_TOUR_STORAGE_KEY = 'readalquran-home-tour-completed';

export const HOME_TOUR_STEPS: FeatureTourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Read al Quran',
    description:
      'Let us walk you through the main features — Quran reading, settings, and the online reader buttons highlighted on this page.',
  },
  {
    id: 'primary-cta',
    targetId: 'home-tour-primary-cta',
    title: 'Open / Continue Reading',
    description:
      'Open the Quran from here. If you were reading before, you will resume directly at your last read ayah.',
    placement: 'bottom',
  },
  {
    id: 'quran-settings',
    targetId: 'home-tour-quran-settings',
    title: 'Quran Settings',
    description:
      'Surah index, reading mode, audio preference, and bookmarks — manage all settings from here.',
    placement: 'bottom',
  },
  {
    id: 'read-online',
    targetId: 'home-tour-read-online',
    title: 'Read Quran Online',
    description:
      'Full online Quran reader: Arabic text, Urdu/English translation, audio playback, and tafseer access.',
    placement: 'bottom',
  },
];

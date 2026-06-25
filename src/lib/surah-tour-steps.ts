import type { FeatureTourStep } from '@/lib/feature-tour-types';

export const SURAH_TOUR_STORAGE_KEY = 'readalquran-surah-tour-completed';

export const SURAH_TOUR_STEPS: FeatureTourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Surah Index',
    description:
      'This page lists all 114 surahs. Let us show you how to search, filter, and open any surah quickly.',
  },
  {
    id: 'search',
    targetId: 'surah-tour-search',
    title: 'Search Surahs',
    description:
      'Find any surah by English name, translation, Arabic name, or surah number — for example Yaseen, Rahman, or 36.',
    placement: 'bottom',
  },
  {
    id: 'quick-tabs',
    targetId: 'surah-tour-quick-tabs',
    title: 'Quick Chapter Filters',
    description:
      'Switch between all chapters, Meccan (Makki), Medinan (Madani), and popular surahs like Yaseen, Kahf, and Mulk.',
    placement: 'bottom',
  },
  {
    id: 'filters',
    targetId: 'surah-tour-filters',
    title: 'Advanced Filters',
    description:
      'Open Filters to narrow by surah length, custom ayah range, and sort by number, name, or ayah count.',
    placement: 'bottom',
  },
];

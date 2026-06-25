'use client';

import FeatureTour from '@/components/ui/feature-tour';
import { HOME_TOUR_STEPS, HOME_TOUR_STORAGE_KEY } from '@/lib/home-tour-steps';

export default function HomeFeatureTour() {
  return (
    <FeatureTour
      steps={HOME_TOUR_STEPS}
      storageKey={HOME_TOUR_STORAGE_KEY}
      titleId="home-tour-title"
      finishLabel="Start Reading"
    />
  );
}

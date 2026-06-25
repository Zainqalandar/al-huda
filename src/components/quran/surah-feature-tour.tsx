'use client';

import FeatureTour from '@/components/ui/feature-tour';
import { SURAH_TOUR_STEPS, SURAH_TOUR_STORAGE_KEY } from '@/lib/surah-tour-steps';

export default function SurahFeatureTour({
  onStepChange,
  onClose,
}: {
  onStepChange?: (stepId: string) => void;
  onClose?: () => void;
}) {
  return (
    <FeatureTour
      steps={SURAH_TOUR_STEPS}
      storageKey={SURAH_TOUR_STORAGE_KEY}
      titleId="surah-tour-title"
      finishLabel="Browse Surahs"
      onStepChange={(step) => onStepChange?.(step.id)}
      onClose={onClose}
    />
  );
}

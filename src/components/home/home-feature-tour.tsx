'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  HOME_TOUR_STEPS,
  HOME_TOUR_STORAGE_KEY,
  type HomeTourStep,
} from '@/lib/home-tour-steps';
import { cn } from '@/lib/utils';

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface PopupPosition {
  top: number;
  left: number;
  placement: 'bottom' | 'top';
}

const POPUP_WIDTH = 320;
const POPUP_GAP = 14;
const SPOTLIGHT_PADDING = 8;

function getSpotlightRect(targetId: string): SpotlightRect | null {
  const element = document.getElementById(targetId);
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  return {
    top: rect.top - SPOTLIGHT_PADDING,
    left: rect.left - SPOTLIGHT_PADDING,
    width: rect.width + SPOTLIGHT_PADDING * 2,
    height: rect.height + SPOTLIGHT_PADDING * 2,
  };
}

function getPopupPosition(
  spotlight: SpotlightRect,
  placement: 'bottom' | 'top'
): PopupPosition {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const popupHeightEstimate = 220;

  let top =
    placement === 'bottom'
      ? spotlight.top + spotlight.height + POPUP_GAP
      : spotlight.top - popupHeightEstimate - POPUP_GAP;

  if (top + popupHeightEstimate > viewportHeight - 12) {
    top = spotlight.top - popupHeightEstimate - POPUP_GAP;
    placement = 'top';
  }

  if (top < 12) {
    top = spotlight.top + spotlight.height + POPUP_GAP;
    placement = 'bottom';
  }

  let left = spotlight.left + spotlight.width / 2 - POPUP_WIDTH / 2;
  left = Math.max(12, Math.min(left, viewportWidth - POPUP_WIDTH - 12));

  return { top, left, placement };
}

export default function HomeFeatureTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null);

  const step = HOME_TOUR_STEPS[stepIndex];
  const isLastStep = stepIndex === HOME_TOUR_STEPS.length - 1;
  const isWelcomeStep = !step.targetId;

  const closeTour = useCallback((persist = true) => {
    setIsOpen(false);
    if (persist) {
      try {
        localStorage.setItem(HOME_TOUR_STORAGE_KEY, '1');
      } catch {
        // ignore storage errors
      }
    }
  }, []);

  const updateLayout = useCallback(() => {
    if (!step.targetId) {
      setSpotlight(null);
      setPopupPosition(null);
      return;
    }

    const nextSpotlight = getSpotlightRect(step.targetId);
    if (!nextSpotlight) {
      setSpotlight(null);
      setPopupPosition(null);
      return;
    }

    setSpotlight(nextSpotlight);
    setPopupPosition(
      getPopupPosition(nextSpotlight, step.placement ?? 'bottom')
    );
  }, [step]);

  useEffect(() => {
    try {
      const completed = localStorage.getItem(HOME_TOUR_STORAGE_KEY) === '1';
      if (!completed) {
        const timer = window.setTimeout(() => setIsOpen(true), 700);
        return () => window.clearTimeout(timer);
      }
    } catch {
      const timer = window.setTimeout(() => setIsOpen(true), 700);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (step.targetId) {
      const element = document.getElementById(step.targetId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }

    const frame = window.requestAnimationFrame(() => {
      updateLayout();
    });

    const handleLayoutChange = () => updateLayout();
    window.addEventListener('resize', handleLayoutChange);
    window.addEventListener('scroll', handleLayoutChange, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleLayoutChange);
      window.removeEventListener('scroll', handleLayoutChange, true);
    };
  }, [isOpen, stepIndex, step, updateLayout]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const goNext = () => {
    if (isLastStep) {
      closeTour(true);
      return;
    }

    setStepIndex((current) => current + 1);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-labelledby="home-tour-title">
      {!isWelcomeStep && spotlight ? (
        <div
          className="pointer-events-none fixed rounded-xl border-2 border-[var(--color-accent)] transition-all duration-300 ease-out"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.68)',
          }}
        />
      ) : (
        <div
          className="fixed inset-0 bg-[color-mix(in_oklab,var(--color-bg)_72%,black_28%)] backdrop-blur-[1px]"
          aria-hidden="true"
        />
      )}

      {isWelcomeStep ? (
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div
            className="w-full max-w-md rounded-2xl border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_40%)] bg-[var(--color-surface)] p-6 shadow-2xl animate-fade-up"
          >
            <TourPopupContent
              step={step}
              stepIndex={stepIndex}
              totalSteps={HOME_TOUR_STEPS.length}
              isLastStep={isLastStep}
              onSkip={() => closeTour(true)}
              onNext={goNext}
            />
          </div>
        </div>
      ) : popupPosition ? (
        <div
          className="fixed w-[min(320px,calc(100vw-24px))] rounded-2xl border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_40%)] bg-[var(--color-surface)] p-5 shadow-2xl animate-fade-up transition-all duration-300"
          style={{ top: popupPosition.top, left: popupPosition.left }}
        >
          <div
            className={cn(
              'absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_40%)] bg-[var(--color-surface)]',
              popupPosition.placement === 'bottom'
                ? '-top-1.5 border-b-0 border-r-0'
                : '-bottom-1.5 border-l-0 border-t-0'
            )}
            aria-hidden="true"
          />
          <TourPopupContent
            step={step}
            stepIndex={stepIndex}
            totalSteps={HOME_TOUR_STEPS.length}
            isLastStep={isLastStep}
            onSkip={() => closeTour(true)}
            onNext={goNext}
          />
        </div>
      ) : null}
    </div>
  );
}

function TourPopupContent({
  step,
  stepIndex,
  totalSteps,
  isLastStep,
  onSkip,
  onNext,
}: {
  step: HomeTourStep;
  stepIndex: number;
  totalSteps: number;
  isLastStep: boolean;
  onSkip: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_45%)] bg-[color-mix(in_oklab,var(--color-accent),var(--color-surface)_92%)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
          <Sparkles className="size-3" />
          Feature {stepIndex + 1} / {totalSteps}
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-text)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-heading)]"
          aria-label="Close tour"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <h2 id="home-tour-title" className="font-display text-xl text-[var(--color-heading)]">
        {step.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-text)]">
        {step.description}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onSkip}
          className="text-sm font-medium text-[var(--color-muted-text)] transition hover:text-[var(--color-heading)]"
        >
          Skip tour
        </button>
        <Button type="button" size="sm" onClick={onNext}>
          {isLastStep ? 'Start Reading' : 'Next'}
          {!isLastStep ? <ArrowRight className="size-3.5" /> : null}
        </Button>
      </div>
    </>
  );
}

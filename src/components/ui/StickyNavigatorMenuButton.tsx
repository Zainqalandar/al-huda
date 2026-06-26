'use client';

import { useEffect, useState, type RefObject } from 'react';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useSiteHeaderHeight } from '@/hooks/useSiteHeaderHeight';

interface StickyNavigatorMenuButtonProps {
  targetRef: RefObject<HTMLElement | null>;
  onOpen: () => void;
  isNavigatorOpen?: boolean;
}

export default function StickyNavigatorMenuButton({
  targetRef,
  onOpen,
  isNavigatorOpen = false,
}: StickyNavigatorMenuButtonProps) {
  const [showSticky, setShowSticky] = useState(false);
  const headerHeight = useSiteHeaderHeight();

  useEffect(() => {
    const target = targetRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSticky(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: `-${headerHeight + 8}px 0px 0px 0px`,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [headerHeight, targetRef]);

  if (!showSticky || isNavigatorOpen) {
    return null;
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      onClick={onOpen}
      aria-label="Open Surah navigator"
      title="Surah navigator"
      style={{ top: `calc(var(--site-header-height, ${headerHeight}px) + 0.75rem)` }}
      className="animate-pulse-border fixed left-3 z-[101] border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_35%)] bg-[color-mix(in_oklab,var(--color-surface-2),var(--color-accent)_8%)] shadow-[var(--shadow-glow)] backdrop-blur-sm transition-all duration-200 sm:left-4"
    >
      <Menu className="size-4" />
    </Button>
  );
}

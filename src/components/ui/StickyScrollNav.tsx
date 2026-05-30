'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StickyScrollNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollPosition(currentScroll);
      
      // Show when scrolled down more than 400px
      setIsVisible(currentScroll > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-8 right-8 z-50 flex flex-col gap-2"
      aria-label="Scroll navigation"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={scrollToTop}
        className="h-10 w-10 rounded-full bg-[color-mix(in_oklab,var(--color-surface-2),var(--color-accent)_8%)] border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_35%)] text-[var(--color-accent)] shadow-lg hover:bg-[color-mix(in_oklab,var(--color-surface-2),var(--color-accent)_15%)] hover:text-[color-mix(in_oklab,var(--color-accent),white_15%)] transition-all duration-200"
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        <ArrowUp className="size-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={scrollToBottom}
        className="h-10 w-10 rounded-full bg-[color-mix(in_oklab,var(--color-surface-2),var(--color-accent)_8%)] border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_35%)] text-[var(--color-accent)] shadow-lg hover:bg-[color-mix(in_oklab,var(--color-surface-2),var(--color-accent)_15%)] hover:text-[color-mix(in_oklab,var(--color-accent),white_15%)] transition-all duration-200"
        aria-label="Scroll to bottom"
        title="Scroll to bottom"
      >
        <ArrowDown className="size-5" />
      </Button>
    </div>
  );
}

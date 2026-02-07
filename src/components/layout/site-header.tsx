'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import navLinks from '@/lib/navLinks';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/layout/theme-toggle';

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg),transparent_10%)] backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[var(--color-accent)] text-[var(--color-accent-foreground)] shadow-[var(--shadow-soft)]">
            ۞
          </span>
          <span className="font-display text-xl font-semibold tracking-wide text-[var(--color-heading)]">
            Al-Huda
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.link;
            return (
              <Link
                key={link.id}
                href={link.link}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                    : 'text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          'grid overflow-hidden border-t border-[var(--color-border)] transition-[grid-template-rows] duration-300 md:hidden',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <nav className="min-h-0 bg-[var(--color-bg)]" aria-label="Mobile">
          <ul className="space-y-1 px-4 py-3">
            {navLinks.map((link) => {
              const active = pathname === link.link;
              return (
                <li key={link.id}>
                  <Link
                    href={link.link}
                    className={cn(
                      'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                        : 'text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]'
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

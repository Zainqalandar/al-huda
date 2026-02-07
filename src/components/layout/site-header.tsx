'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import navLinks from '@/lib/navLinks';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/layout/theme-toggle';

interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    let ignore = false;

    const loadSession = async () => {
      try {
        setAuthLoading(true);
        const response = await fetch('/api/auth/session', {
          cache: 'no-store',
        });

        if (!response.ok) {
          if (!ignore) {
            setSessionUser(null);
          }
          return;
        }

        const payload = (await response.json()) as { user: SessionUser | null };
        if (!ignore) {
          setSessionUser(payload.user ?? null);
        }
      } catch {
        if (!ignore) {
          setSessionUser(null);
        }
      } finally {
        if (!ignore) {
          setAuthLoading(false);
        }
      }
    };

    void loadSession();

    return () => {
      ignore = true;
    };
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
      });
    } finally {
      setSessionUser(null);
      setOpen(false);
    }
  };

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
          <div className="hidden items-center gap-2 md:flex">
            {authLoading ? (
              <span className="text-xs text-[var(--color-muted-text)]">Checking...</span>
            ) : sessionUser ? (
              <>
                <span className="max-w-[10rem] truncate text-sm text-[var(--color-muted-text)]">
                  {sessionUser.name}
                </span>
                <Button size="sm" variant="outline" onClick={handleSignOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="sm" variant="outline">
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
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
        aria-hidden={!open}
        className={cn(
          'grid overflow-hidden border-t border-[var(--color-border)] transition-[grid-template-rows] duration-300 md:hidden',
          open ? 'pointer-events-auto grid-rows-[1fr]' : 'pointer-events-none grid-rows-[0fr]'
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
          <div className="border-t border-[var(--color-border)] px-4 py-3">
            {authLoading ? (
              <p className="text-xs text-[var(--color-muted-text)]">Checking session...</p>
            ) : sessionUser ? (
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm text-[var(--color-muted-text)]">
                  {sessionUser.name}
                </p>
                <Button size="sm" variant="outline" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpenText,
  Home,
  Info,
  KeyRound,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Sparkles,
  UserPlus,
  UserRound,
  X,
} from 'lucide-react';
import { type FormEvent, useCallback, useEffect, useState } from 'react';

import navLinks from '@/lib/navLinks';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeToggle from '@/components/layout/theme-toggle';

interface SessionUser {
  id: string;
  name: string;
  email: string;
}

interface AuthPayload {
  user?: SessionUser;
  message?: string;
}

type AuthTab = 'signin' | 'signup';
const OPEN_AUTH_MODAL_EVENT = 'alhuda:open-auth-modal';

interface OpenAuthModalDetail {
  tab?: AuthTab;
  reason?: string;
}

function getNavIcon(linkName: string) {
  const normalized = linkName.toLowerCase();
  if (normalized === 'home') {
    return Home;
  }

  if (normalized === 'quran') {
    return BookOpenText;
  }

  if (normalized === 'about') {
    return Info;
  }

  if (normalized === 'admin') {
    return LayoutDashboard;
  }

  return Sparkles;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>('signin');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authReason, setAuthReason] = useState<string | null>(null);

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

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

  useEffect(() => {
    if (!authModalOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAuthModalOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [authModalOpen]);

  const openAuthModal = useCallback((tab: AuthTab, reason?: string) => {
    setAuthTab(tab);
    setAuthError(null);
    setAuthReason(reason ?? null);
    setAuthModalOpen(true);
    setOpen(false);
  }, []);

  const closeAuthModal = () => {
    if (authSubmitting) {
      return;
    }

    setAuthModalOpen(false);
    setAuthError(null);
    setAuthReason(null);
  };

  useEffect(() => {
    const onOpenAuthModal = (event: Event) => {
      const customEvent = event as CustomEvent<OpenAuthModalDetail>;
      const requestedTab = customEvent.detail?.tab;
      const nextTab = requestedTab === 'signup' ? 'signup' : 'signin';
      openAuthModal(nextTab, customEvent.detail?.reason);
    };

    window.addEventListener(OPEN_AUTH_MODAL_EVENT, onOpenAuthModal as EventListener);
    return () => {
      window.removeEventListener(OPEN_AUTH_MODAL_EVENT, onOpenAuthModal as EventListener);
    };
  }, [openAuthModal]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
      });
    } finally {
      setSessionUser(null);
      setOpen(false);
      setAuthModalOpen(false);
    }
  };

  const handleSignInSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthSubmitting(true);
    setAuthError(null);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signInEmail,
          password: signInPassword,
        }),
      });

      const payload = (await response.json()) as AuthPayload;
      if (!response.ok) {
        setAuthError(payload.message ?? 'Unable to sign in right now.');
        return;
      }

      setSessionUser(payload.user ?? null);
      setAuthModalOpen(false);
      setOpen(false);
      window.location.reload();
    } catch {
      setAuthError('Unable to sign in right now.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthSubmitting(true);
    setAuthError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signUpName,
          email: signUpEmail,
          password: signUpPassword,
        }),
      });

      const payload = (await response.json()) as AuthPayload;
      if (!response.ok) {
        setAuthError(payload.message ?? 'Unable to create account right now.');
        return;
      }

      setSessionUser(payload.user ?? null);
      setAuthModalOpen(false);
      setOpen(false);
      window.location.reload();
    } catch {
      setAuthError('Unable to create account right now.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const isActiveLink = (targetHref: string) => {
    if (targetHref === '/') {
      return pathname === '/';
    }

    return pathname === targetHref || pathname.startsWith(`${targetHref}/`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_68%)] bg-[color-mix(in_oklab,var(--color-bg),transparent_12%)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--color-accent),white_45%),transparent)]" />
        <div className="mx-auto flex h-[4.2rem] max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="relative inline-flex size-9 items-center justify-center overflow-hidden rounded-xl border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_56%)] bg-[linear-gradient(140deg,color-mix(in_oklab,var(--color-accent),white_12%),color-mix(in_oklab,var(--color-highlight),var(--color-accent)_82%))] text-[var(--color-accent-foreground)] shadow-[var(--shadow-soft)] transition-transform duration-300 group-hover:-translate-y-px">
              <Sparkles className="size-4" />
              <span className="absolute -bottom-4 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-white/30 blur-sm" />
            </span>
            <span className="font-display text-[1.37rem] font-semibold tracking-wide text-[var(--color-heading)]">
              Al-Huda
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = isActiveLink(link.link);
              const NavIcon = getNavIcon(link.name);
              return (
                <Link
                  key={link.id}
                  href={link.link}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all',
                    active
                      ? 'border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_50%)] bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-accent),white_68%),color-mix(in_oklab,var(--color-highlight),white_78%))] text-[var(--color-heading)] shadow-[var(--shadow-soft)] dark:border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_40%)] dark:bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-accent),black_22%),color-mix(in_oklab,var(--color-highlight),var(--color-accent)_86%))] dark:text-[var(--color-accent-foreground)]'
                      : 'text-[var(--color-muted-text)] hover:bg-[color-mix(in_oklab,var(--color-surface-2),white_12%)] hover:text-[var(--color-text)]'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <NavIcon className="size-4" />
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
                    <LogOut className="size-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => openAuthModal('signin')}>
                  <LogIn className="size-4" />
                  Sign In
                </Button>
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
            'grid overflow-hidden border-t border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_68%)] transition-[grid-template-rows] duration-300 md:hidden',
            open ? 'pointer-events-auto grid-rows-[1fr]' : 'pointer-events-none grid-rows-[0fr]'
          )}
        >
          <nav
            className="min-h-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-bg),white_6%),var(--color-bg))]"
            aria-label="Mobile"
          >
            <ul className="space-y-1 px-4 py-3">
              {navLinks.map((link, index) => {
                const active = isActiveLink(link.link);
                const NavIcon = getNavIcon(link.name);
                return (
                  <li key={link.id} className={cn(open ? 'animate-fade-up' : '')} style={{ animationDelay: `${index * 40}ms` }}>
                    <Link
                      href={link.link}
                      className={cn(
                        'inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all',
                        active
                          ? 'border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_52%)] bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-accent),white_68%),color-mix(in_oklab,var(--color-highlight),white_80%))] text-[var(--color-heading)] dark:border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_40%)] dark:bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-accent),black_20%),color-mix(in_oklab,var(--color-highlight),var(--color-accent)_88%))] dark:text-[var(--color-accent-foreground)]'
                          : 'text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]'
                      )}
                    >
                      <NavIcon className="size-4" />
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
                    <LogOut className="size-4" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => openAuthModal('signin')}
                >
                  <LogIn className="size-4" />
                  Sign In
                </Button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {authModalOpen ? (
        <div className="fixed inset-0 z-[130]">
          <button
            type="button"
            className="absolute inset-0 bg-black/58 backdrop-blur-[2px]"
            onClick={closeAuthModal}
            aria-label="Close authentication dialog"
          />

          <div className="absolute inset-0 grid place-items-center p-4">
            <div className="w-full max-w-md animate-fade-up rounded-2xl border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_56%)] bg-[linear-gradient(145deg,color-mix(in_oklab,var(--color-surface),white_14%),color-mix(in_oklab,var(--color-highlight),var(--color-surface)_95%))] p-5 shadow-[var(--shadow-card)] sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                    Account Access
                  </p>
                  <h3 className="mt-1 font-display text-2xl text-[var(--color-heading)]">
                    Welcome to Al-Huda
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-muted-text)]">
                    {authReason
                      ? `Please sign in to ${authReason}.`
                      : 'Sign in or create account to continue.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-2 text-[var(--color-muted-text)] transition hover:border-[var(--color-accent-soft)] hover:text-[var(--color-heading)]"
                  aria-label="Close authentication dialog"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="mb-4 grid grid-cols-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('signin');
                    setAuthError(null);
                  }}
                  className={cn(
                    'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition-all',
                    authTab === 'signin'
                      ? 'border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_52%)] bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-accent),white_70%),color-mix(in_oklab,var(--color-highlight),white_82%))] text-[var(--color-heading)] shadow-[var(--shadow-soft)] dark:border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_38%)] dark:bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-accent),black_22%),color-mix(in_oklab,var(--color-highlight),var(--color-accent)_86%))] dark:text-[var(--color-accent-foreground)]'
                      : 'text-[var(--color-muted-text)] hover:bg-[color-mix(in_oklab,var(--color-surface-2),white_10%)] hover:text-[var(--color-text)] dark:hover:bg-[color-mix(in_oklab,var(--color-surface-2),black_14%)]'
                  )}
                >
                  <LogIn className="size-4" />
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('signup');
                    setAuthError(null);
                  }}
                  className={cn(
                    'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold transition-all',
                    authTab === 'signup'
                      ? 'border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_52%)] bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-accent),white_70%),color-mix(in_oklab,var(--color-highlight),white_82%))] text-[var(--color-heading)] shadow-[var(--shadow-soft)] dark:border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_38%)] dark:bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-accent),black_22%),color-mix(in_oklab,var(--color-highlight),var(--color-accent)_86%))] dark:text-[var(--color-accent-foreground)]'
                      : 'text-[var(--color-muted-text)] hover:bg-[color-mix(in_oklab,var(--color-surface-2),white_10%)] hover:text-[var(--color-text)] dark:hover:bg-[color-mix(in_oklab,var(--color-surface-2),black_14%)]'
                  )}
                >
                  <UserPlus className="size-4" />
                  Sign Up
                </button>
              </div>

              {authError ? (
                <p className="mb-3 rounded-lg border border-[color-mix(in_oklab,var(--color-danger),var(--color-border)_65%)] bg-[color-mix(in_oklab,var(--color-surface),white_8%)] px-3 py-2 text-sm text-[var(--color-danger)]">
                  {authError}
                </p>
              ) : null}

              {authTab === 'signin' ? (
                <form className="space-y-3" onSubmit={handleSignInSubmit}>
                  <div>
                    <label
                      htmlFor="navbar-signin-email"
                      className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted-text)]" />
                      <Input
                        id="navbar-signin-email"
                        type="email"
                        value={signInEmail}
                        onChange={(event) => setSignInEmail(event.target.value)}
                        className="pl-9"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="navbar-signin-password"
                      className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted-text)]" />
                      <Input
                        id="navbar-signin-password"
                        type="password"
                        value={signInPassword}
                        onChange={(event) => setSignInPassword(event.target.value)}
                        className="pl-9"
                        autoComplete="current-password"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={authSubmitting}>
                    {authSubmitting ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              ) : (
                <form className="space-y-3" onSubmit={handleSignUpSubmit}>
                  <div>
                    <label
                      htmlFor="navbar-signup-name"
                      className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]"
                    >
                      Name
                    </label>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted-text)]" />
                      <Input
                        id="navbar-signup-name"
                        type="text"
                        value={signUpName}
                        onChange={(event) => setSignUpName(event.target.value)}
                        className="pl-9"
                        autoComplete="name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="navbar-signup-email"
                      className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted-text)]" />
                      <Input
                        id="navbar-signup-email"
                        type="email"
                        value={signUpEmail}
                        onChange={(event) => setSignUpEmail(event.target.value)}
                        className="pl-9"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="navbar-signup-password"
                      className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted-text)]" />
                      <Input
                        id="navbar-signup-password"
                        type="password"
                        value={signUpPassword}
                        onChange={(event) => setSignUpPassword(event.target.value)}
                        className="pl-9"
                        autoComplete="new-password"
                        minLength={8}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={authSubmitting}>
                    {authSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

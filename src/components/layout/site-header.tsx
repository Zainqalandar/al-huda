'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookMarked,
  BookOpenText,
  BrainCircuit,
  ChevronDown,
  Home,
  Info,
  KeyRound,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Mic,
  Moon,
  Star,
  Sun,
  UserPlus,
  UserRound,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

/* ─── Types ─────────────────────────────────────────────────────────────── */

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

/* ─── Nav structure ─────────────────────────────────────────────────────── */

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
}

interface NavGroup {
  label: string;
  icon: React.ElementType;
  items: NavItem[];
}

type NavEntry = NavItem | NavGroup;

function isNavGroup(entry: NavEntry): entry is NavGroup {
  return 'items' in entry;
}

const NAV: NavEntry[] = [
  { label: 'Home',    href: '/',       icon: Home,        exact: true },
  {
    label: 'Quran',
    icon: BookOpenText,
    items: [
      { label: 'Surah Index',  href: '/surah',             icon: BookOpenText },
      { label: 'Read Online',  href: '/read-quran-online', icon: BookMarked   },
      { label: 'AI Search',    href: '/vector-search',     icon: BrainCircuit },
      { label: 'Voice Search', href: '/voice-search',      icon: Mic          },
    ],
  },
  { label: 'About',   href: '/about',   icon: Info           },
  { label: 'Contact', href: '/contact', icon: MessageSquare  },
];

/* ─── Shared btn style ───────────────────────────────────────────────────── */

const NAV_LINK_BASE =
  'inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]';

const NAV_LINK_INACTIVE =
  'text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]';

const NAV_LINK_ACTIVE =
  'border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_40%)] bg-[color-mix(in_oklab,var(--color-accent),var(--color-surface)_88%)] text-[var(--color-accent-soft)] shadow-[var(--shadow-soft)]';

/* ─── Theme Button ───────────────────────────────────────────────────────── */

function ThemeBtn() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      onClick={() => mounted && setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label={mounted && resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.25rem',
        height: '2.25rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--color-border)',
        background: 'transparent',
        color: 'var(--color-muted-text)',
        cursor: 'pointer',
        transition: 'border-color 0.2s, color 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-accent-soft)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-heading)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted-text)';
      }}
    >
      {mounted && resolvedTheme === 'dark'
        ? <Sun style={{ width: '1rem', height: '1rem' }} />
        : <Moon style={{ width: '1rem', height: '1rem' }} />
      }
    </button>
  );
}

/* ─── Dropdown ───────────────────────────────────────────────────────────── */

function DropdownMenu({ group, isAnyChildActive }: { group: NavGroup; isAnyChildActive: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const GroupIcon = group.icon;

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey   = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(NAV_LINK_BASE, isAnyChildActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE)}
      >
        <GroupIcon style={{ width: '1rem', height: '1rem' }} />
        {group.label}
        <ChevronDown style={{
          width: '0.875rem',
          height: '0.875rem',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }} />
      </button>

      {open && (
        <div
          className="animate-fade-up"
          style={{
            position: 'absolute',
            left: 0,
            top: 'calc(100% + 0.5rem)',
            zIndex: 200,
            minWidth: '13rem',
            borderRadius: '1rem',
            border: '1px solid color-mix(in oklab, var(--color-accent), var(--color-border) 50%)',
            background: 'color-mix(in oklab, var(--color-surface), white 6%)',
            boxShadow: 'var(--shadow-card)',
            backdropFilter: 'blur(16px)',
            overflow: 'hidden',
          }}
        >
          {/* glow top line */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
            opacity: 0.4,
          }} />
          <ul style={{ padding: '0.375rem', margin: 0, listStyle: 'none' }}>
            {group.items.map(item => {
              const ItemIcon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      borderRadius: '0.75rem',
                      padding: '0.625rem 0.75rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'background 0.15s, color 0.15s',
                      background: active
                        ? 'color-mix(in oklab, var(--color-accent), var(--color-surface) 84%)'
                        : 'transparent',
                      color: active
                        ? 'var(--color-accent-soft)'
                        : 'var(--color-text)',
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-surface-2)';
                        (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-heading)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                        (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text)';
                      }
                    }}
                  >
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '1.75rem',
                      height: '1.75rem',
                      borderRadius: '0.5rem',
                      border: `1px solid ${active ? 'color-mix(in oklab, var(--color-accent), var(--color-border) 40%)' : 'var(--color-border)'}`,
                      background: active
                        ? 'color-mix(in oklab, var(--color-accent), var(--color-surface) 78%)'
                        : 'var(--color-surface-elevated)',
                      color: active ? 'var(--color-accent)' : 'var(--color-muted-text)',
                      flexShrink: 0,
                    }}>
                      <ItemIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [authModalOpen, setAuthModalOpen]     = useState(false);
  const [authTab, setAuthTab]                 = useState<AuthTab>('signin');
  const [authSubmitting, setAuthSubmitting]   = useState(false);
  const [authError, setAuthError]             = useState<string | null>(null);
  const [authReason, setAuthReason]           = useState<string | null>(null);
  const [googleReady, setGoogleReady]         = useState(false);
  const [googleLoading, setGoogleLoading]     = useState(false);

  const [signInEmail, setSignInEmail]         = useState('');
  const [signInPassword, setSignInPassword]   = useState('');
  const [signUpName, setSignUpName]           = useState('');
  const [signUpEmail, setSignUpEmail]         = useState('');
  const [signUpPassword, setSignUpPassword]   = useState('');
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  console.log('Google Client ID:', googleClientId ? 'Loaded' : 'Not set');

  console.log('Client ID:', googleClientId);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  /* load session */
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setAuthLoading(true);
        const res = await fetch('/api/auth/session', { cache: 'no-store' });
        if (!res.ok) { if (!ignore) setSessionUser(null); return; }
        const data = (await res.json()) as { user: SessionUser | null };
        if (!ignore) setSessionUser(data.user ?? null);
      } catch { if (!ignore) setSessionUser(null); }
      finally   { if (!ignore) setAuthLoading(false); }
    };
    void load();
    return () => { ignore = true; };
  }, []);

  /* scroll lock when modal open */
  useEffect(() => {
    if (!authModalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setAuthModalOpen(false); };
    const prev  = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [authModalOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  const openAuthModal = useCallback((tab: AuthTab, reason?: string) => {
    setAuthTab(tab);
    setAuthError(null);
    setAuthReason(reason ?? null);
    setAuthModalOpen(true);
    setMobileOpen(false);
  }, []);

  const closeAuthModal = () => { if (authSubmitting) return; setAuthModalOpen(false); setAuthError(null); setAuthReason(null); };

  useEffect(() => {
    const onOpen = (e: Event) => {
      const ce = e as CustomEvent<OpenAuthModalDetail>;
      openAuthModal(ce.detail?.tab === 'signup' ? 'signup' : 'signin', ce.detail?.reason);
    };
    window.addEventListener(OPEN_AUTH_MODAL_EVENT, onOpen as EventListener);
    return () => window.removeEventListener(OPEN_AUTH_MODAL_EVENT, onOpen as EventListener);
  }, [openAuthModal]);

  const handleSignOut = async () => {
    try { await fetch('/api/auth/signout', { method: 'POST' }); }
    finally { setSessionUser(null); setMobileOpen(false); setAuthModalOpen(false); }
  };

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthSubmitting(true); setAuthError(null);
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signInEmail, password: signInPassword }),
      });
      const data = (await res.json()) as AuthPayload;
      if (!res.ok) { setAuthError(data.message ?? 'Unable to sign in.'); return; }
      setSessionUser(data.user ?? null);
      setAuthModalOpen(false);
      window.location.reload();
    } catch { setAuthError('Unable to sign in right now.'); }
    finally   { setAuthSubmitting(false); }
  };

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthSubmitting(true); setAuthError(null);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signUpName, email: signUpEmail, password: signUpPassword }),
      });
      const data = (await res.json()) as AuthPayload;
      if (!res.ok) { setAuthError(data.message ?? 'Unable to create account.'); return; }
      setSessionUser(data.user ?? null);
      setAuthModalOpen(false);
      window.location.reload();
    } catch { setAuthError('Unable to create account right now.'); }
    finally   { setAuthSubmitting(false); }
  };

  const handleGoogleCredentialResponse = useCallback(async (response: { credential?: string }) => {
    if (!response.credential) {
      setAuthError('Google sign-in failed.');
      setGoogleLoading(false);
      return;
    }

    setAuthSubmitting(true);
    setGoogleLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: response.credential }),
      });
      const data = (await res.json()) as AuthPayload;
      if (!res.ok) {
        setAuthError(data.message ?? 'Unable to sign in with Google.');
        return;
      }
      setSessionUser(data.user ?? null);
      setAuthModalOpen(false);
      window.location.reload();
    } catch {
      setAuthError('Unable to sign in with Google right now.');
    } finally {
      setAuthSubmitting(false);
      setGoogleLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!googleClientId) return;
    if (typeof window === 'undefined') return;

    const initializeGoogle = () => {
      const google = (window as any).google;
      if (!google?.accounts?.id) {
        return;
      }

      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
        ux_mode: 'popup',
      });

      setGoogleReady(true);
    };

    if ((window as any).google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    const existingScript = document.getElementById('google-identity-service');
    if (existingScript) {
      existingScript.addEventListener('load', initializeGoogle);
      return () => existingScript.removeEventListener('load', initializeGoogle);
    }

    const script = document.createElement('script');
    script.id = 'google-identity-service';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    script.onerror = () => {
      setAuthError('Unable to load Google sign-in.');
    };
    document.body.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, [googleClientId, handleGoogleCredentialResponse]);

  const handleGoogleSignIn = () => {
    if (!googleClientId) {
      setAuthError('Google sign-in is not configured.');
      return;
    }
    if (!googleReady) {
      setAuthError('Google sign-in is still loading.');
      return;
    }

    setAuthError(null);
    setGoogleLoading(true);

    try {
      (window as any).google.accounts.id.prompt();
      window.setTimeout(() => {
        if (googleLoading) {
          setGoogleLoading(false);
        }
      }, 4500);
    } catch {
      setAuthError('Unable to start Google sign-in.');
      setGoogleLoading(false);
    }
  };

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const isGroupActive = (group: NavGroup) => group.items.some(i => isActive(i.href));

  const allMobileItems: NavItem[] = NAV.flatMap(e => isNavGroup(e) ? e.items : [e]);

  /* ─── icon btn style helper ─── */
  const iconBtnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: '0.75rem',
    border: '1px solid var(--color-border)',
    background: 'transparent',
    color: 'var(--color-muted-text)',
    cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s',
    flexShrink: 0,
  };

  return (
    <>
      {/* ══════════════ HEADER ══════════════ */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid var(--color-border)',
        background: 'color-mix(in oklab, var(--color-bg), transparent 6%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        {/* top accent line */}
        <div style={{
          position: 'absolute',
          inset: '0 0 auto 0',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
          opacity: 0.45,
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: '78rem',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.2rem',
          gap: '1rem',
        }}>

          {/* ── Logo ── */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', flexShrink: 0 }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '0.75rem',
              border: '1px solid color-mix(in oklab, var(--color-accent), var(--color-border) 40%)',
              background: 'linear-gradient(140deg, var(--color-accent-soft), var(--color-accent))',
              color: 'var(--color-accent-foreground)',
              boxShadow: 'var(--shadow-soft)',
              flexShrink: 0,
            }}>
              <Star style={{ width: '1rem', height: '1rem' }} />
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{
                fontFamily: 'var(--font-display), serif',
                fontSize: '1.15rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                color: 'var(--color-heading)',
              }}>Read Al Quran</span>
              <span style={{
                fontSize: '0.6rem',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-accent-soft)',
                marginTop: '0.15rem',
              }}>Recite · Learn · Reflect</span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav aria-label="Primary navigation" style={{ display: 'none', alignItems: 'center', gap: '0.125rem' }}
            className="lg:!flex">
            {NAV.map(entry => {
              if (isNavGroup(entry)) {
                return <DropdownMenu key={entry.label} group={entry} isAnyChildActive={isGroupActive(entry)} />;
              }
              const EntryIcon = entry.icon;
              const active = isActive(entry.href, entry.exact);
              return (
                <Link
                  key={entry.href}
                  href={entry.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(NAV_LINK_BASE, active ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE)}
                >
                  <EntryIcon style={{ width: '1rem', height: '1rem' }} />
                  {entry.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Right side ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

            {/* Desktop auth */}
            <div style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }} className="lg:!flex">
              {authLoading ? (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-text)' }}>...</span>
              ) : sessionUser ? (
                <>
                  {/* user chip */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface-elevated)',
                  }}>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '0.5rem',
                      background: 'color-mix(in oklab, var(--color-accent), var(--color-surface) 80%)',
                      color: 'var(--color-accent-soft)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                    }}>
                      {sessionUser.name.charAt(0).toUpperCase()}
                    </span>
                    <span style={{
                      maxWidth: '8rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem',
                      color: 'var(--color-muted-text)',
                    }}>{sessionUser.name}</span>
                  </div>

                  {/* Admin link */}
                  <Link
                    href="/admin"
                    aria-current={isActive('/admin') ? 'page' : undefined}
                    className={cn(NAV_LINK_BASE, isActive('/admin') ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE)}
                  >
                    <LayoutDashboard style={{ width: '1rem', height: '1rem' }} />
                    Admin
                  </Link>

                  {/* Sign out */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0.75rem',
                      border: '1px solid var(--color-border)',
                      background: 'transparent',
                      color: 'var(--color-muted-text)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'border-color 0.15s, background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget;
                      el.style.borderColor = 'var(--color-accent-soft)';
                      el.style.background  = 'var(--color-surface-2)';
                      el.style.color       = 'var(--color-text)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget;
                      el.style.borderColor = 'var(--color-border)';
                      el.style.background  = 'transparent';
                      el.style.color       = 'var(--color-muted-text)';
                    }}
                  >
                    <LogOut style={{ width: '1rem', height: '1rem' }} />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  {/* Sign in */}
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.375rem 0.875rem',
                      borderRadius: '0.75rem',
                      border: '1px solid var(--color-border)',
                      background: 'transparent',
                      color: 'var(--color-muted-text)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'border-color 0.15s, background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget;
                      el.style.borderColor = 'var(--color-accent-soft)';
                      el.style.background  = 'var(--color-surface-2)';
                      el.style.color       = 'var(--color-text)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget;
                      el.style.borderColor = 'var(--color-border)';
                      el.style.background  = 'transparent';
                      el.style.color       = 'var(--color-muted-text)';
                    }}
                  >
                    <LogIn style={{ width: '1rem', height: '1rem' }} />
                    Sign In
                  </button>

                  {/* Sign up — accent filled */}
                  <button
                    type="button"
                    onClick={() => openAuthModal('signup')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.375rem 0.875rem',
                      borderRadius: '0.75rem',
                      border: '1px solid color-mix(in oklab, var(--color-accent), var(--color-border) 40%)',
                      background: 'linear-gradient(135deg, var(--color-accent-soft), var(--color-accent))',
                      color: 'var(--color-accent-foreground)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px -6px color-mix(in oklab, var(--color-accent), transparent 30%)',
                      transition: 'filter 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
                  >
                    <UserPlus style={{ width: '1rem', height: '1rem' }} />
                    Sign Up
                  </button>
                </>
              )}
            </div>

            <ThemeBtn />

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(p => !p)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              style={{ ...iconBtnStyle }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.borderColor = 'var(--color-accent-soft)';
                el.style.color       = 'var(--color-heading)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.borderColor = 'var(--color-border)';
                el.style.color       = 'var(--color-muted-text)';
              }}
              className="lg:!hidden"
            >
              {mobileOpen
                ? <X style={{ width: '1rem', height: '1rem' }} />
                : <Menu style={{ width: '1rem', height: '1rem' }} />
              }
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════ MOBILE DRAWER ══════════════ */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110 }} className="lg:hidden">
          {/* backdrop */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(2px)',
              cursor: 'pointer',
              border: 'none',
              width: '100%',
              height: '100%',
            }}
          />

          {/* panel */}
          <aside
            className="animate-fade-up"
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              height: '100%',
              width: '100%',
              maxWidth: '20rem',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid color-mix(in oklab, var(--color-accent), var(--color-border) 50%)',
              background: 'var(--color-bg)',
              boxShadow: '0 0 60px rgba(0,0,0,0.4)',
            }}
          >
            {/* drawer header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--color-border)',
            }}>
              <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '2rem', height: '2rem', borderRadius: '0.625rem',
                  border: '1px solid color-mix(in oklab, var(--color-accent), var(--color-border) 40%)',
                  background: 'linear-gradient(140deg, var(--color-accent-soft), var(--color-accent))',
                  color: 'var(--color-accent-foreground)',
                }}>
                  <Star style={{ width: '0.875rem', height: '0.875rem' }} />
                </span>
                <span style={{ fontFamily: 'var(--font-display), serif', fontSize: '1rem', fontWeight: 600, color: 'var(--color-heading)' }}>
                  Read Al Quran
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                style={{ ...iconBtnStyle, width: '2rem', height: '2rem' }}
              >
                <X style={{ width: '1rem', height: '1rem' }} />
              </button>
            </div>

            {/* nav links */}
            <nav style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }} aria-label="Mobile navigation">
              <p style={{
                padding: '0 0.5rem',
                marginBottom: '0.5rem',
                fontSize: '0.625rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-muted-text)',
              }}>Navigation</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                {allMobileItems.map((item, i) => {
                  const ItemIcon = item.icon;
                  const active = isActive(item.href, item.exact);
                  return (
                    <li key={item.href} className="animate-fade-up" style={{ animationDelay: `${i * 35}ms` }}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.625rem 0.75rem',
                          borderRadius: '0.75rem',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          transition: 'background 0.15s, color 0.15s',
                          border: active ? '1px solid color-mix(in oklab, var(--color-accent), var(--color-border) 40%)' : '1px solid transparent',
                          background: active ? 'color-mix(in oklab, var(--color-accent), var(--color-surface) 88%)' : 'transparent',
                          color: active ? 'var(--color-accent-soft)' : 'var(--color-text)',
                          boxShadow: active ? 'var(--shadow-soft)' : 'none',
                        }}
                      >
                        <span style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: '1.75rem', height: '1.75rem', borderRadius: '0.5rem', flexShrink: 0,
                          border: `1px solid ${active ? 'color-mix(in oklab, var(--color-accent), var(--color-border) 40%)' : 'var(--color-border)'}`,
                          background: active ? 'color-mix(in oklab, var(--color-accent), var(--color-surface) 78%)' : 'var(--color-surface-elevated)',
                          color: active ? 'var(--color-accent)' : 'var(--color-muted-text)',
                        }}>
                          <ItemIcon style={{ width: '0.875rem', height: '0.875rem' }} />
                        </span>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
                {sessionUser && (
                  <li className="animate-fade-up" style={{ animationDelay: `${allMobileItems.length * 35}ms` }}>
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive('/admin') ? 'page' : undefined}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.625rem 0.75rem', borderRadius: '0.75rem', textDecoration: 'none',
                        fontSize: '0.875rem', fontWeight: 500,
                        border: isActive('/admin') ? '1px solid color-mix(in oklab, var(--color-accent), var(--color-border) 40%)' : '1px solid transparent',
                        background: isActive('/admin') ? 'color-mix(in oklab, var(--color-accent), var(--color-surface) 88%)' : 'transparent',
                        color: isActive('/admin') ? 'var(--color-accent-soft)' : 'var(--color-text)',
                      }}
                    >
                      <span style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '1.75rem', height: '1.75rem', borderRadius: '0.5rem',
                        border: '1px solid var(--color-border)', background: 'var(--color-surface-elevated)',
                        color: 'var(--color-muted-text)', flexShrink: 0,
                      }}>
                        <LayoutDashboard style={{ width: '0.875rem', height: '0.875rem' }} />
                      </span>
                      Admin
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            {/* drawer footer */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)' }}>
              {authLoading ? (
                <p style={{ fontSize: '0.75rem', color: 'var(--color-muted-text)' }}>Checking session...</p>
              ) : sessionUser ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    padding: '0.625rem 0.75rem', borderRadius: '0.75rem',
                    border: '1px solid var(--color-border)', background: 'var(--color-surface-elevated)',
                  }}>
                    <span style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '1.75rem', height: '1.75rem', borderRadius: '0.5rem',
                      background: 'color-mix(in oklab, var(--color-accent), var(--color-surface) 80%)',
                      color: 'var(--color-accent-soft)', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0,
                    }}>
                      {sessionUser.name.charAt(0).toUpperCase()}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-heading)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sessionUser.name}</p>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-muted-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sessionUser.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      width: '100%', padding: '0.5rem', borderRadius: '0.75rem',
                      border: '1px solid var(--color-border)', background: 'transparent',
                      color: 'var(--color-muted-text)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    <LogOut style={{ width: '1rem', height: '1rem' }} />
                    Sign out
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                      padding: '0.5rem', borderRadius: '0.75rem',
                      border: '1px solid var(--color-border)', background: 'transparent',
                      color: 'var(--color-muted-text)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    <LogIn style={{ width: '1rem', height: '1rem' }} />
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthModal('signup')}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                      padding: '0.5rem', borderRadius: '0.75rem',
                      border: '1px solid color-mix(in oklab, var(--color-accent), var(--color-border) 40%)',
                      background: 'linear-gradient(135deg, var(--color-accent-soft), var(--color-accent))',
                      color: 'var(--color-accent-foreground)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    <UserPlus style={{ width: '1rem', height: '1rem' }} />
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* ══════════════ AUTH MODAL ══════════════ */}
      {authModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 130 }}>
          <button
            type="button"
            onClick={closeAuthModal}
            aria-label="Close authentication dialog"
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.58)',
              backdropFilter: 'blur(2px)',
              border: 'none', cursor: 'pointer', width: '100%', height: '100%',
            }}
          />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'grid', placeItems: 'center', padding: '1rem',
          }}>
            <div
              className="animate-fade-up"
              style={{
                width: '100%', maxWidth: '28rem',
                borderRadius: '1.25rem',
                border: '1px solid color-mix(in oklab, var(--color-accent), var(--color-border) 42%)',
                background: 'var(--color-surface)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* modal header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted-text)' }}>
                    Account Access
                  </p>
                  <h3 style={{ margin: '0.25rem 0 0', fontFamily: 'var(--font-display), serif', fontSize: '1.5rem', color: 'var(--color-heading)' }}>
                    Welcome to Read Al Quran
                  </h3>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--color-muted-text)' }}>
                    {authReason ? `Please sign in to ${authReason}.` : 'Sign in or create an account to continue.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeAuthModal}
                  style={{ ...iconBtnStyle, flexShrink: 0, marginTop: '0.125rem' }}
                >
                  <X style={{ width: '1rem', height: '1rem' }} />
                </button>
              </div>

              {/* tabs */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem',
                padding: '0.25rem', borderRadius: '0.875rem',
                border: '1px solid var(--color-border)', background: 'var(--color-surface-elevated)',
                marginBottom: '1rem',
              }}>
                {(['signin', 'signup'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => { setAuthTab(tab); setAuthError(null); }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      gap: '0.375rem', height: '2.25rem', borderRadius: '0.625rem',
                      border: authTab === tab ? '1px solid color-mix(in oklab, var(--color-accent), var(--color-border) 40%)' : '1px solid transparent',
                      background: authTab === tab ? 'color-mix(in oklab, var(--color-accent), var(--color-surface) 88%)' : 'transparent',
                      color: authTab === tab ? 'var(--color-accent-soft)' : 'var(--color-muted-text)',
                      boxShadow: authTab === tab ? 'var(--shadow-soft)' : 'none',
                      fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    {tab === 'signin' ? <LogIn style={{ width: '1rem', height: '1rem' }} /> : <UserPlus style={{ width: '1rem', height: '1rem' }} />}
                    {tab === 'signin' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={!googleReady || authSubmitting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.75rem',
                  marginBottom: '0.75rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--color-border)',
                  background: googleReady ? 'var(--color-surface-elevated)' : 'var(--color-surface)',
                  color: googleReady ? 'var(--color-text)' : 'var(--color-muted-text)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: !googleReady || authSubmitting ? 'not-allowed' : 'pointer',
                  opacity: !googleReady || authSubmitting ? 0.65 : 1,
                }}
              >
                <Mail style={{ width: '1.1rem', height: '1.1rem' }} />
                {googleLoading ? 'Opening Google...' : 'Continue with Google'}
              </button>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                color: 'var(--color-muted-text)',
                fontSize: '0.8rem',
              }}>
                <span style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                <span>or</span>
                <span style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
              </div>
              {/* error */}
              {authError && (
                <div style={{
                  marginBottom: '0.75rem', padding: '0.625rem 0.875rem',
                  borderRadius: '0.75rem',
                  border: '1px solid color-mix(in oklab, var(--color-danger), var(--color-border) 65%)',
                  background: 'color-mix(in oklab, var(--color-surface), white 8%)',
                  color: 'var(--color-danger)', fontSize: '0.875rem',
                }}>
                  {authError}
                </div>
              )}

              {/* forms */}
              {authTab === 'signin' ? (
                <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label htmlFor="m-si-email" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted-text)' }}>Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--color-muted-text)', pointerEvents: 'none' }} />
                      <Input id="m-si-email" type="email" value={signInEmail} onChange={e => setSignInEmail(e.target.value)} autoComplete="email" required style={{ paddingLeft: '2.25rem' }} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="m-si-pass" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted-text)' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <KeyRound style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--color-muted-text)', pointerEvents: 'none' }} />
                      <Input id="m-si-pass" type="password" value={signInPassword} onChange={e => setSignInPassword(e.target.value)} autoComplete="current-password" required style={{ paddingLeft: '2.25rem' }} />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={authSubmitting}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '100%', padding: '0.625rem', borderRadius: '0.75rem',
                      border: '1px solid color-mix(in oklab, var(--color-accent), var(--color-border) 40%)',
                      background: 'linear-gradient(135deg, var(--color-accent-soft), var(--color-accent))',
                      color: 'var(--color-accent-foreground)', fontSize: '0.875rem', fontWeight: 600,
                      cursor: authSubmitting ? 'not-allowed' : 'pointer',
                      opacity: authSubmitting ? 0.7 : 1,
                      boxShadow: '0 4px 14px -6px color-mix(in oklab, var(--color-accent), transparent 30%)',
                    }}
                  >
                    {authSubmitting ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label htmlFor="m-su-name" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted-text)' }}>Name</label>
                    <div style={{ position: 'relative' }}>
                      <UserRound style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--color-muted-text)', pointerEvents: 'none' }} />
                      <Input id="m-su-name" type="text" value={signUpName} onChange={e => setSignUpName(e.target.value)} autoComplete="name" required style={{ paddingLeft: '2.25rem' }} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="m-su-email" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted-text)' }}>Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--color-muted-text)', pointerEvents: 'none' }} />
                      <Input id="m-su-email" type="email" value={signUpEmail} onChange={e => setSignUpEmail(e.target.value)} autoComplete="email" required style={{ paddingLeft: '2.25rem' }} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="m-su-pass" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted-text)' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <KeyRound style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'var(--color-muted-text)', pointerEvents: 'none' }} />
                      <Input id="m-su-pass" type="password" value={signUpPassword} onChange={e => setSignUpPassword(e.target.value)} autoComplete="new-password" minLength={8} required style={{ paddingLeft: '2.25rem' }} />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={authSubmitting}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '100%', padding: '0.625rem', borderRadius: '0.75rem',
                      border: '1px solid color-mix(in oklab, var(--color-accent), var(--color-border) 40%)',
                      background: 'linear-gradient(135deg, var(--color-accent-soft), var(--color-accent))',
                      color: 'var(--color-accent-foreground)', fontSize: '0.875rem', fontWeight: 600,
                      cursor: authSubmitting ? 'not-allowed' : 'pointer',
                      opacity: authSubmitting ? 0.7 : 1,
                      boxShadow: '0 4px 14px -6px color-mix(in oklab, var(--color-accent), transparent 30%)',
                    }}
                  >
                    {authSubmitting ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
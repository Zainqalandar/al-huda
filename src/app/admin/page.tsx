'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Activity,
  BookOpen,
  Globe,
  LayoutDashboard,
  Search,
  Settings2,
  ShieldCheck,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface TrackPageItem {
  name: string;
  path: string;
  category: 'Core' | 'Quran' | 'System';
  purpose: string;
}

const TRACK_PAGES: TrackPageItem[] = [
  {
    name: 'Home',
    path: '/',
    category: 'Core',
    purpose: 'Landing page and primary entry flow.',
  },
  {
    name: 'Quran Directory',
    path: '/quran',
    category: 'Quran',
    purpose: 'Surah listing, filtering, and quick start.',
  },
  {
    name: 'Quran Reader',
    path: '/quran/[id]',
    category: 'Quran',
    purpose: 'Ayah reading, audio, bookmarks, tafseer, and navigator.',
  },
  {
    name: 'Hadith',
    path: '/hadith',
    category: 'Core',
    purpose: 'Hadith browsing and reading experience.',
  },
  {
    name: 'Practice',
    path: '/practice',
    category: 'Core',
    purpose: 'User practice flow and learning activity.',
  },
  {
    name: 'About',
    path: '/about',
    category: 'Core',
    purpose: 'Product and mission information.',
  },
  {
    name: 'Settings',
    path: '/settings',
    category: 'System',
    purpose: 'Theme, reading, audio, and data preferences.',
  },
  {
    name: 'Sign In',
    path: '/signin',
    category: 'System',
    purpose: 'User login page for existing accounts.',
  },
  {
    name: 'Sign Up',
    path: '/signup',
    category: 'System',
    purpose: 'User registration page with unique email validation.',
  },
  {
    name: 'Admin',
    path: '/admin',
    category: 'System',
    purpose: 'Website tracking dashboard.',
  },
  {
    name: 'Urdu Tafseer API',
    path: '/api/tafsir/ur',
    category: 'System',
    purpose: 'Backend endpoint used by reader tafseer panel.',
  },
];

const CATEGORY_META = {
  Core: {
    icon: Globe,
    heading: 'Core Pages',
    description: 'Main user-facing pages that define site journey.',
  },
  Quran: {
    icon: BookOpen,
    heading: 'Quran Pages',
    description: 'Surah reading, navigation, and recitation workflows.',
  },
  System: {
    icon: Settings2,
    heading: 'System & Admin',
    description: 'Platform settings and API-level tracking points.',
  },
} as const;

export default function AdminPage() {
  const [query, setQuery] = useState('');

  const filteredPages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return TRACK_PAGES;
    }

    return TRACK_PAGES.filter((item) => {
      return (
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.path.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery) ||
        item.purpose.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query]);

  const grouped = useMemo(() => {
    return {
      Core: filteredPages.filter((item) => item.category === 'Core'),
      Quran: filteredPages.filter((item) => item.category === 'Quran'),
      System: filteredPages.filter((item) => item.category === 'System'),
    };
  }, [filteredPages]);

  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <section className="mb-6">
        <Badge className="mb-2">Admin</Badge>
        <h1 className="font-display text-4xl text-[var(--color-heading)]">Tracking Dashboard</h1>
        <p className="mt-2 text-sm text-[var(--color-muted-text)]">
          Website pages, routes, and system endpoints ko ek jagah track karein.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-[290px_1fr]">
        <aside className="lg:sticky lg:top-[5rem] lg:h-fit">
          <Card className="border-[color-mix(in_oklab,var(--color-accent),#c79a42_52%)] bg-[linear-gradient(145deg,color-mix(in_oklab,var(--color-surface),white_12%),color-mix(in_oklab,#c79a42,var(--color-surface)_94%))]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <LayoutDashboard className="size-5 text-[var(--color-accent)]" />
                Sidebar Tracking
              </CardTitle>
              <CardDescription>
                Saare pages yahan se monitor aur open karein.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="admin-page-search"
                  className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]"
                >
                  Search Page
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted-text)]" />
                  <Input
                    id="admin-page-search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Page name or route"
                    className="border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_65%)] bg-[color-mix(in_oklab,var(--color-surface),white_24%)] pl-9"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {(['Core', 'Quran', 'System'] as const).map((category) => {
                  const Icon = CATEGORY_META[category].icon;
                  const items = grouped[category];

                  return (
                    <div
                      key={category}
                      className="rounded-xl border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_65%)] bg-[color-mix(in_oklab,var(--color-surface),white_18%)] p-2"
                    >
                      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                        <Icon className="size-3.5" />
                        {CATEGORY_META[category].heading}
                        <span className="ml-auto rounded-full bg-[color-mix(in_oklab,var(--color-accent),white_70%)] px-1.5 py-0.5 text-[10px] tracking-normal text-[var(--color-heading)]">
                          {items.length}
                        </span>
                      </p>
                      <div className="space-y-1">
                        {items.length > 0 ? (
                          items.map((item) => (
                            <Link
                              key={`${item.path}-${item.name}`}
                              href={item.path.includes('[') ? '/quran/1' : item.path}
                              className="block rounded-lg px-2 py-1.5 text-sm text-[var(--color-text)] transition hover:bg-[color-mix(in_oklab,var(--color-surface-2),white_12%)] hover:text-[var(--color-heading)]"
                            >
                              {item.name}
                            </Link>
                          ))
                        ) : (
                          <p className="px-2 py-1 text-xs text-[var(--color-muted-text)]">
                            No match
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                    Total Track Points
                  </p>
                  <p className="mt-1 font-display text-3xl text-[var(--color-heading)]">
                    {filteredPages.length}
                  </p>
                </div>
                <Activity className="size-5 text-[var(--color-accent)]" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                    Category Coverage
                  </p>
                  <p className="mt-1 font-display text-3xl text-[var(--color-heading)]">3</p>
                </div>
                <ShieldCheck className="size-5 text-[var(--color-accent)]" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                  Last Review
                </p>
                <p className="mt-1 text-sm text-[var(--color-text)]">
                  {new Date().toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {(['Core', 'Quran', 'System'] as const).map((category) => {
            const items = grouped[category];
            const meta = CATEGORY_META[category];
            const Icon = meta.icon;

            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Icon className="size-5 text-[var(--color-accent)]" />
                    {meta.heading}
                  </CardTitle>
                  <CardDescription>{meta.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <div
                        key={`${category}-${item.path}-${item.name}`}
                        className="rounded-xl border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_66%)] bg-[color-mix(in_oklab,var(--color-surface),white_16%)] p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-[var(--color-heading)]">{item.name}</p>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        <p className="mt-1 text-xs font-mono text-[var(--color-muted-text)]">
                          {item.path}
                        </p>
                        <p className="mt-2 text-sm text-[var(--color-text)]">{item.purpose}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--color-muted-text)]">
                      Is category me search ke mutabiq koi page nahi mila.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
}

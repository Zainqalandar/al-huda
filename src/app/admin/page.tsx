'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Clock3,
  Headphones,
  LayoutDashboard,
  RefreshCcw,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminUsageSummary {
  totalUsers: number;
  totalSessionSeconds: number;
  totalAudioSeconds: number;
}

interface AdminUserRecord {
  totalSessionSeconds: number;
  totalAudioSeconds: number;
}

interface AdminUsersPayload {
  users?: AdminUserRecord[];
  summary?: AdminUsageSummary;
  message?: string;
}

const EMPTY_SUMMARY: AdminUsageSummary = {
  totalUsers: 0,
  totalSessionSeconds: 0,
  totalAudioSeconds: 0,
};

function formatDuration(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

function normalizeSummary(payload: AdminUsersPayload): AdminUsageSummary {
  if (payload.summary) {
    return {
      totalUsers: Math.max(0, Number(payload.summary.totalUsers) || 0),
      totalSessionSeconds: Math.max(
        0,
        Number(payload.summary.totalSessionSeconds) || 0
      ),
      totalAudioSeconds: Math.max(
        0,
        Number(payload.summary.totalAudioSeconds) || 0
      ),
    };
  }

  const users = Array.isArray(payload.users) ? payload.users : [];
  return users.reduce<AdminUsageSummary>(
    (acc, user) => {
      acc.totalUsers += 1;
      acc.totalSessionSeconds += Math.max(0, Number(user.totalSessionSeconds) || 0);
      acc.totalAudioSeconds += Math.max(0, Number(user.totalAudioSeconds) || 0);
      return acc;
    },
    { ...EMPTY_SUMMARY }
  );
}

export default function AdminPage() {
  const [summary, setSummary] = useState<AdminUsageSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/users', {
        cache: 'no-store',
      });

      const payload = (await response.json()) as AdminUsersPayload;

      if (!response.ok) {
        setError(payload.message ?? 'Unable to load dashboard data.');
        return;
      }

      setSummary(normalizeSummary(payload));
      setLastUpdatedAt(new Date().toISOString());
    } catch {
      setError('Unable to load dashboard data right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSummary();
  }, []);

  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <section className="mb-6">
        <Badge className="mb-2">Admin</Badge>
        <h1 className="font-display text-4xl text-[var(--color-heading)]">Tracking Dashboard</h1>
        <p className="mt-2 text-sm text-[var(--color-muted-text)]">
          Sirf logged-in users ka website usage aur audio watch time tracking.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-[5rem] lg:h-fit">
          <Card className="border-[color-mix(in_oklab,var(--color-accent),#c79a42_52%)] bg-[linear-gradient(145deg,color-mix(in_oklab,var(--color-surface),white_12%),color-mix(in_oklab,#c79a42,var(--color-surface)_94%))]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <LayoutDashboard className="size-5 text-[var(--color-accent)]" />
                Admin Sidebar
              </CardTitle>
              <CardDescription>Admin sections yahan se open karein.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/admin"
                className="block rounded-lg border border-[color-mix(in_oklab,var(--color-accent),#c79a42_52%)] bg-[color-mix(in_oklab,var(--color-surface-2),white_8%)] px-3 py-2 text-sm font-semibold text-[var(--color-heading)]"
              >
                Tracking Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="block rounded-lg border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_65%)] px-3 py-2 text-sm transition hover:bg-[color-mix(in_oklab,var(--color-surface-2),white_10%)]"
              >
                Users Table
              </Link>
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-4">
          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <p className="text-sm text-[var(--color-muted-text)]">
                Last Updated:{' '}
                <span className="font-semibold text-[var(--color-text)]">
                  {lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleString() : 'Not synced yet'}
                </span>
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void loadSummary()}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCcw className="size-4" />
                Refresh
              </Button>
            </CardContent>
          </Card>

          {error ? (
            <Card>
              <CardContent className="p-4 text-sm text-[var(--color-danger)]">{error}</CardContent>
            </Card>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                    Logged-in Users
                  </p>
                  <p className="mt-1 font-display text-3xl text-[var(--color-heading)]">
                    {loading ? '...' : summary.totalUsers}
                  </p>
                </div>
                <Users className="size-5 text-[var(--color-accent)]" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                    Website Time
                  </p>
                  <p className="mt-1 font-display text-xl text-[var(--color-heading)]">
                    {loading ? '...' : formatDuration(summary.totalSessionSeconds)}
                  </p>
                </div>
                <Clock3 className="size-5 text-[var(--color-accent)]" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]">
                    Audio Watch Time
                  </p>
                  <p className="mt-1 font-display text-xl text-[var(--color-heading)]">
                    {loading ? '...' : formatDuration(summary.totalAudioSeconds)}
                  </p>
                </div>
                <Headphones className="size-5 text-[var(--color-accent)]" />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

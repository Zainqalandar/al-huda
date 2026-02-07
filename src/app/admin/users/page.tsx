'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LayoutDashboard, RefreshCcw, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  loginCount: number;
  lastLoginAt: string | null;
  totalSessionSeconds: number;
  totalAudioSeconds: number;
}

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

function formatDate(value: string | null) {
  if (!value) {
    return 'Never';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid';
  }

  return date.toLocaleString();
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/users', {
        cache: 'no-store',
      });

      const payload = (await response.json()) as {
        users?: AdminUserRecord[];
        message?: string;
      };

      if (!response.ok) {
        setError(payload.message ?? 'Unable to load users.');
        return;
      }

      setUsers(Array.isArray(payload.users) ? payload.users : []);
    } catch {
      setError('Unable to load users right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, users]);

  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <section className="mb-6">
        <Badge className="mb-2">Admin</Badge>
        <h1 className="font-display text-4xl text-[var(--color-heading)]">Users Table</h1>
        <p className="mt-2 text-sm text-[var(--color-muted-text)]">
          Login users, total time spent, aur audio watch time tracking.
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
                className="block rounded-lg border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_65%)] px-3 py-2 text-sm transition hover:bg-[color-mix(in_oklab,var(--color-surface-2),white_10%)]"
              >
                Tracking Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="block rounded-lg border border-[color-mix(in_oklab,var(--color-accent),#c79a42_52%)] bg-[color-mix(in_oklab,var(--color-surface-2),white_8%)] px-3 py-2 text-sm font-semibold text-[var(--color-heading)]"
              >
                Users Table
              </Link>
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-4">
          <Card>
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Users className="size-5 text-[var(--color-accent)]" />
                <p className="text-sm text-[var(--color-text)]">
                  Total Users: <span className="font-semibold">{users.length}</span>
                </p>
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search user name or email"
                  className="sm:min-w-[16rem]"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => void loadUsers()}
                  aria-label="Refresh users"
                >
                  <RefreshCcw className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {error ? (
            <Card>
              <CardContent className="p-4 text-sm text-[var(--color-danger)]">{error}</CardContent>
            </Card>
          ) : null}

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[color-mix(in_oklab,var(--color-surface-2),white_8%)] text-xs uppercase tracking-[0.16em] text-[var(--color-muted-text)]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold">Logins</th>
                      <th className="px-4 py-3 font-semibold">Time Spent</th>
                      <th className="px-4 py-3 font-semibold">Audio Time</th>
                      <th className="px-4 py-3 font-semibold">Last Login</th>
                      <th className="px-4 py-3 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-5 text-center text-[var(--color-muted-text)]"
                        >
                          Users loading...
                        </td>
                      </tr>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-t border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_74%)]"
                        >
                          <td className="px-4 py-3 font-semibold text-[var(--color-heading)]">
                            {user.name}
                          </td>
                          <td className="px-4 py-3 text-[var(--color-text)]">{user.email}</td>
                          <td className="px-4 py-3 text-[var(--color-text)]">{user.loginCount}</td>
                          <td className="px-4 py-3 text-[var(--color-text)]">
                            {formatDuration(user.totalSessionSeconds)}
                          </td>
                          <td className="px-4 py-3 text-[var(--color-text)]">
                            {formatDuration(user.totalAudioSeconds)}
                          </td>
                          <td className="px-4 py-3 text-[var(--color-text)]">
                            {formatDate(user.lastLoginAt)}
                          </td>
                          <td className="px-4 py-3 text-[var(--color-text)]">
                            {formatDate(user.createdAt)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-5 text-center text-[var(--color-muted-text)]"
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

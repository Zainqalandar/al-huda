'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(payload.message ?? 'Unable to sign in.');
        return;
      }

      router.push('/quran');
      router.refresh();
    } catch {
      setError('Unable to sign in right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <div className="mx-auto w-full max-w-lg">
        <Badge className="mb-2">Account</Badge>
        <h1 className="font-display text-4xl text-[var(--color-heading)]">Sign In</h1>
        <p className="mt-2 text-sm text-[var(--color-muted-text)]">
          Apne account me login karein.
        </p>

        <Card className="mt-5">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Email aur password enter karein.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="signin-email"
                  className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]"
                >
                  Email
                </label>
                <Input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="signin-password"
                  className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-text)]"
                >
                  Password
                </label>
                <Input
                  id="signin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              {error ? (
                <p className="rounded-lg border border-[color-mix(in_oklab,var(--color-danger),var(--color-border)_65%)] bg-[color-mix(in_oklab,var(--color-surface),white_8%)] px-3 py-2 text-sm text-[var(--color-danger)]">
                  {error}
                </p>
              ) : null}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <p className="mt-4 text-sm text-[var(--color-muted-text)]">
              New user?{' '}
              <Link href="/signup" className="font-semibold text-[var(--color-accent)] hover:underline">
                Create account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

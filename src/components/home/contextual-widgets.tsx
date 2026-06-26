'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getHomeContextualWidgets } from '@/lib/home-contextual-widgets';

export default function HomeContextualWidgets() {
  const sections = useMemo(() => getHomeContextualWidgets(), []);

  return (
    <section className="mt-12" data-slot="page-shell">
      <h2 className="mb-5 font-display text-3xl tracking-tight text-[var(--color-heading)]">
        For You Today
      </h2>

      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((section, index) => (
          <Card
            key={section.id}
            className={
              index === 0
                ? 'animate-fade-up'
                : index === 1
                  ? 'animate-fade-up-delay-1'
                  : 'animate-fade-up-delay-2'
            }
          >
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="size-5 text-[var(--color-accent)]" />
                  {section.title}
                </CardTitle>
                {section.badge ? <Badge>{section.badge}</Badge> : null}
              </div>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-2.5 text-sm text-[var(--color-text)] transition-colors hover:border-[var(--color-accent-soft)]"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--color-heading)]">{link.label}</p>
                    {link.description ? (
                      <p className="text-xs text-[var(--color-muted-text)]">{link.description}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {link.badge ? (
                      <Badge variant="secondary" className="text-[10px]">
                        {link.badge}
                      </Badge>
                    ) : null}
                    <ChevronRight className="size-4 text-[var(--color-muted-text)]" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

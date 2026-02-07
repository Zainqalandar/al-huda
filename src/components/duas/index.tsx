'use client';

import { ClipboardCopy, Check } from 'lucide-react';
import { useState } from 'react';

import duas from '@/data/duas.json';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Dua {
  id: number;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

export function DuaRoot() {
  const [copied, setCopied] = useState<number | null>(null);

  const onCopy = async (dua: Dua) => {
    const value = `${dua.arabic}\n${dua.transliteration}\n${dua.translation}`;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(dua.id);
      window.setTimeout(() => setCopied(null), 1200);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <div className="mb-6">
        <Badge className="mb-2">Supplication</Badge>
        <h1 className="font-display text-4xl text-[var(--color-heading)]">Daily Duas</h1>
        <p className="mt-2 text-sm text-[var(--color-muted-text)]">
          Keep a practical list of duas for knowledge, forgiveness, and protection.
        </p>
      </div>

      <div className="space-y-4">
        {duas.map((dua, index) => (
          <Card key={dua.id} className="animate-fade-up" style={{ animationDelay: `${index * 40}ms` }}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{dua.title}</CardTitle>
                  <CardDescription>{dua.reference}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => void onCopy(dua)}>
                  {copied === dua.id ? <Check className="size-4" /> : <ClipboardCopy className="size-4" />}
                  {copied === dua.id ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="arabic-font arabic-reading rounded-xl bg-[var(--color-surface-2)] p-4 text-right">
                {dua.arabic}
              </p>
              <p className="text-sm text-[var(--color-muted-text)]">
                <span className="font-semibold text-[var(--color-text)]">Transliteration:</span>{' '}
                {dua.transliteration}
              </p>
              <p className="text-sm text-[var(--color-text)]">{dua.translation}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

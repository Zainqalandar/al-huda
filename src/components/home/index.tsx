import Link from 'next/link';
import { ArrowRight, AudioLines, BookOpenText, Compass, Sparkles } from 'lucide-react';

import hadith from '@/data/hadith.json';
import faqs from '@/data/faqs.json';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomeRoot() {
  const featuredHadith = hadith.slice(0, 2);

  return (
    <div className="pb-20 pt-10 sm:pt-14">
      <section className="relative overflow-hidden" data-slot="page-shell">
        <div className="pointer-events-none absolute -top-14 right-[-10%] size-56 rounded-full bg-[radial-gradient(circle,var(--color-accent)_0%,transparent_68%)] opacity-20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-[-5%] size-64 rounded-full bg-[radial-gradient(circle,#c79a42_0%,transparent_70%)] opacity-20 blur-2xl" />

        <Card className="relative overflow-hidden border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_60%)] bg-[linear-gradient(130deg,color-mix(in_oklab,var(--color-surface),white_18%),var(--color-surface))]">
          <CardContent className="p-6 sm:p-10 lg:p-14">
            <Badge className="mb-4 w-fit">Quran Learning</Badge>
            <h1 className="font-display text-4xl leading-tight text-[var(--color-heading)] sm:text-5xl lg:text-6xl">
              Build a daily Quran learning habit with clarity.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-[var(--color-muted-text)] sm:text-lg">
              Read ayah by ayah, continue from last read, bookmark key verses, and
              learn with an uninterrupted recitation experience.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/quran">
                  Open Quran
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/settings">Customize Reading</Link>
              </Button>
            </div>
            <dl className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <dt className="text-[var(--color-muted-text)]">Quran Surahs</dt>
                <dd className="mt-1 text-2xl font-semibold text-[var(--color-heading)]">114</dd>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <dt className="text-[var(--color-muted-text)]">Reading Modes</dt>
                <dd className="mt-1 text-2xl font-semibold text-[var(--color-heading)]">2</dd>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <dt className="text-[var(--color-muted-text)]">Audio Recitation</dt>
                <dd className="mt-1 text-2xl font-semibold text-[var(--color-heading)]">Live</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10" data-slot="page-shell">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl text-[var(--color-heading)]">Why this app</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="animate-fade-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Compass className="size-5 text-[var(--color-accent)]" /> Focused Reader
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--color-muted-text)]">
              Dedicated Quran-first layout with search, bookmarks, last-read resume,
              and mobile-friendly typography.
            </CardContent>
          </Card>

          <Card className="animate-fade-up" style={{ animationDelay: '80ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <AudioLines className="size-5 text-[var(--color-accent)]" /> Continuous Audio
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--color-muted-text)]">
              Spotify-style bottom mini-player with progress, seek, reciter selection,
              and route-persistent playback state.
            </CardContent>
          </Card>

          <Card className="animate-fade-up" style={{ animationDelay: '160ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="size-5 text-[var(--color-accent)]" /> Learning Flow
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[var(--color-muted-text)]">
              Switch reading mode, adjust Arabic font size, and keep your daily
              recitation consistent with minimal friction.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-10" data-slot="page-shell">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl text-[var(--color-heading)]">Hadith reflection</h2>
          <Button variant="ghost" asChild>
            <Link href="/hadith">Open Hadith</Link>
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {featuredHadith.map((item, index) => (
            <Card key={`${item.reference}-${index}`} className="animate-fade-up" style={{ animationDelay: `${index * 80}ms` }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BookOpenText className="size-5 text-[var(--color-accent)]" /> {item.reference}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="arabic-font arabic-reading text-right">{item.arabic}</p>
                <p className="text-sm text-[var(--color-muted-text)]">{item.translation}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10" data-slot="page-shell">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Common Questions</CardTitle>
            <CardDescription>Quick Islamic reminders and guidance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4"
                open={index === 0}
              >
                <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--color-heading)]">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm text-[var(--color-muted-text)]">{faq.answer}</p>
              </details>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

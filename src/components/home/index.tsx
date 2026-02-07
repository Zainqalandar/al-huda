import Link from 'next/link';
import { ArrowRight, BookOpenText, MessageCircleHeart, MoonStar, Sparkles } from 'lucide-react';

import quotes from '@/data/quotes.json';
import hadith from '@/data/hadith.json';
import duas from '@/data/duas.json';
import faqs from '@/data/faqs.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomeRoot() {
  const featuredQuotes = quotes.slice(0, 3);
  const featuredHadith = hadith.slice(0, 2);
  const featuredDuas = duas.slice(0, 3);

  return (
    <div className="pb-20 pt-10 sm:pt-14">
      <section className="relative overflow-hidden" data-slot="page-shell">
        <div className="pointer-events-none absolute -top-14 right-[-10%] size-56 rounded-full bg-[radial-gradient(circle,var(--color-accent)_0%,transparent_68%)] opacity-20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-[-5%] size-64 rounded-full bg-[radial-gradient(circle,#c79a42_0%,transparent_70%)] opacity-20 blur-2xl" />

        <Card className="relative overflow-hidden border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_60%)] bg-[linear-gradient(130deg,color-mix(in_oklab,var(--color-surface),white_18%),var(--color-surface))]">
          <CardContent className="p-6 sm:p-10 lg:p-14">
            <Badge className="mb-4 w-fit">Bismillah</Badge>
            <h1 className="font-display text-4xl leading-tight text-[var(--color-heading)] sm:text-5xl lg:text-6xl">
              A calm, modern place for daily Islamic reflection.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-[var(--color-muted-text)] sm:text-lg">
              Explore Quran reading, trusted hadith, and meaningful duas in a focused
              interface built for mobile and desktop.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/quran">
                  Start Quran Reading
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/settings">Personalize Experience</Link>
              </Button>
            </div>
            <dl className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <dt className="text-[var(--color-muted-text)]">Quran Surahs</dt>
                <dd className="mt-1 text-2xl font-semibold text-[var(--color-heading)]">114</dd>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <dt className="text-[var(--color-muted-text)]">Featured Duas</dt>
                <dd className="mt-1 text-2xl font-semibold text-[var(--color-heading)]">{duas.length}</dd>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <dt className="text-[var(--color-muted-text)]">Daily Hadith</dt>
                <dd className="mt-1 text-2xl font-semibold text-[var(--color-heading)]">{hadith.length}+</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10" data-slot="page-shell">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl text-[var(--color-heading)]">Daily Inspirations</h2>
          <Button variant="ghost" asChild>
            <Link href="/quotes">View All Quotes</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredQuotes.map((quote, index) => (
            <Card key={quote.id} className="animate-fade-up" style={{ animationDelay: `${index * 80}ms` }}>
              <CardHeader>
                <CardTitle className="text-base">
                  <Sparkles className="mr-2 inline size-4 text-[var(--color-accent)]" /> Reflection
                </CardTitle>
                <CardDescription>{quote.reference}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-[var(--color-text)]">“{quote.text}”</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10" data-slot="page-shell">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl text-[var(--color-heading)]">Hadith & Duas</h2>
          <Badge variant="secondary">Authentic reminders</Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BookOpenText className="size-5 text-[var(--color-accent)]" /> Hadith Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredHadith.map((item, index) => (
                <article key={index} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
                  <p className="arabic-font arabic-reading text-right">{item.arabic}</p>
                  <p className="mt-3 text-sm text-[var(--color-muted-text)]">{item.translation}</p>
                  <p className="mt-2 text-xs font-semibold text-[var(--color-accent)]">{item.reference}</p>
                </article>
              ))}
              <Button variant="outline" asChild>
                <Link href="/hadith">Open Hadith Collection</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MoonStar className="size-5 text-[var(--color-accent)]" /> Daily Duas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredDuas.map((dua) => (
                <article key={dua.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
                  <p className="font-semibold text-[var(--color-heading)]">{dua.title}</p>
                  <p className="arabic-font arabic-reading mt-2 text-right">{dua.arabic}</p>
                  <p className="mt-2 text-sm text-[var(--color-muted-text)]">{dua.translation}</p>
                </article>
              ))}
              <Button variant="outline" asChild>
                <Link href="/duas">Open Dua Collection</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-10" data-slot="page-shell">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MessageCircleHeart className="size-5 text-[var(--color-accent)]" /> Common Questions
            </CardTitle>
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

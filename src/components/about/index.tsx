import { BookHeart, BookOpenText, HandHeart, ShieldCheck, Sparkles } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const values = [
  {
    title: 'Faith (Iman)',
    description: 'Living with belief in Allah and following the Prophetic way with sincerity.',
    icon: ShieldCheck,
    color: 'text-[var(--color-accent)]',
  },
  {
    title: 'Knowledge (Ilm)',
    description: 'Sharing clear and authentic Islamic learning in simple, practical language.',
    icon: BookOpenText,
    color: 'text-[var(--color-info)]',
  },
  {
    title: 'Compassion (Rahmah)',
    description: 'Encouraging gentleness, care, and good character in every interaction.',
    icon: HandHeart,
    color: 'text-[var(--color-highlight)]',
  },
  {
    title: 'Consistency (Istiqamah)',
    description: 'Building habits of remembrance, recitation, and reflection over time.',
    icon: BookHeart,
    color: 'text-[var(--color-accent)]',
  },
];

export default function AboutRoot() {
  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <section className="mb-8 animate-fade-up">
        <Badge className="mb-2">
          <Sparkles className="mr-1 size-3.5" />
          About Al-Huda
        </Badge>
        <h1 className="font-display text-4xl text-[var(--color-heading)]">Our Mission & Vision</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-muted-text)] sm:text-base">
          Al-Huda is built to make authentic Islamic content easier to read and revisit.
          We focus on a respectful user experience so Quran recitation and reflection stay
          accessible on every device.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="animate-fade-up border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_62%)] bg-[linear-gradient(140deg,color-mix(in_oklab,var(--color-surface),white_16%),color-mix(in_oklab,var(--color-highlight),var(--color-surface)_95%))]">
          <CardHeader>
            <CardTitle className="text-2xl">Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-[var(--color-muted-text)] sm:text-base">
            Provide a clean and practical Islamic app where users can read Quran with focus,
            save progress, and access authentic reminders without clutter.
          </CardContent>
        </Card>
        <Card className="animate-fade-up-delay-1 border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_62%)] bg-[linear-gradient(140deg,color-mix(in_oklab,var(--color-surface),white_14%),color-mix(in_oklab,var(--color-accent),var(--color-surface)_95%))]">
          <CardHeader>
            <CardTitle className="text-2xl">Vision</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-[var(--color-muted-text)] sm:text-base">
            Become a trusted companion for Muslims worldwide by combining sound content,
            thoughtful design, and strong accessibility across devices.
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-3xl text-[var(--color-heading)]">Core Values</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card
                key={value.title}
                className="animate-fade-up border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_64%)] bg-[linear-gradient(155deg,color-mix(in_oklab,var(--color-surface),white_14%),color-mix(in_oklab,var(--color-highlight),var(--color-surface)_96%))]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader>
                  <CardTitle className="inline-flex items-center gap-2 text-lg">
                    <Icon className={`size-5 ${value.color}`} />
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-[var(--color-muted-text)]">
                  {value.description}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

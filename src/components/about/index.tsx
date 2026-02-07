import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const values = [
  {
    title: 'Faith (Iman)',
    description: 'Living with belief in Allah and following the Prophetic way with sincerity.',
  },
  {
    title: 'Knowledge (Ilm)',
    description: 'Sharing clear and authentic Islamic learning in simple, practical language.',
  },
  {
    title: 'Compassion (Rahmah)',
    description: 'Encouraging gentleness, care, and good character in every interaction.',
  },
  {
    title: 'Consistency (Istiqamah)',
    description: 'Building habits of remembrance, recitation, and reflection over time.',
  },
];

export default function AboutRoot() {
  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <section className="mb-8">
        <Badge className="mb-2">About Al-Huda</Badge>
        <h1 className="font-display text-4xl text-[var(--color-heading)]">Our Mission & Vision</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-muted-text)] sm:text-base">
          Al-Huda is built to make authentic Islamic content easier to read and revisit.
          We focus on a respectful user experience so Quran recitation and hadith stay
          accessible on every device.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-[var(--color-muted-text)] sm:text-base">
            Provide a clean and practical Islamic app where users can read Quran with focus,
            save progress, and access authentic reminders without clutter.
          </CardContent>
        </Card>
        <Card>
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
          {values.map((value) => (
            <Card key={value.title}>
              <CardHeader>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[var(--color-muted-text)]">{value.description}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

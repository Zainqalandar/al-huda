import quotes from '@/data/quotes.json';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuotesSectionProps {
  total?: number;
}

export default function QuotesSection({ total = quotes.length }: QuotesSectionProps) {
  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge className="mb-2">Collection</Badge>
          <h1 className="font-display text-4xl text-[var(--color-heading)]">Islamic Quotes</h1>
          <p className="mt-2 text-sm text-[var(--color-muted-text)]">
            Brief reminders from the Quran and Sunnah for everyday reflection.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quotes.slice(0, total).map((quote, index) => (
          <Card key={quote.id} className="animate-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
            <CardHeader>
              <CardTitle className="text-lg">“{quote.text}”</CardTitle>
              <CardDescription>{quote.reference}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Keep reflecting
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import hadith from '@/data/hadith.json';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HadithCard() {
  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <div className="mb-6">
        <Badge className="mb-2">Sunnah</Badge>
        <h1 className="font-display text-4xl text-[var(--color-heading)]">Hadith Collection</h1>
        <p className="mt-2 text-sm text-[var(--color-muted-text)]">
          Selected narrations to strengthen character, sincerity, and compassion.
        </p>
      </div>

      <div className="space-y-4">
        {hadith.map((item, index) => (
          <Card key={`${item.reference}-${index}`} className="animate-fade-up" style={{ animationDelay: `${index * 40}ms` }}>
            <CardHeader>
              <CardTitle className="arabic-font arabic-reading text-right">{item.arabic}</CardTitle>
              <CardDescription>{item.reference}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-[var(--color-text)]">{item.translation}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

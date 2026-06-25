import Link from 'next/link';
import type { Metadata } from 'next';
import { buildCityPageSchema, buildPageMetadata } from '@/lib/seo';
import { CITY_KEYWORDS, GENERATED_CITY_KEYWORDS } from '@/lib/seo-keywords';

type CityType = 'karachi' | 'islamabad' | 'lahore' | 'rawalpindi' | 'multan';

interface CityPageProps {
  params: Promise<{
    city: CityType;
  }>;
}

const cityInfo: Record<CityType, { name: string; fullName: string; population: string }> = {
  karachi: { name: 'Karachi', fullName: 'Karachi, Sindh', population: '16+ million' },
  islamabad: { name: 'Islamabad', fullName: 'Islamabad, Federal Territory', population: '2+ million' },
  lahore: { name: 'Lahore', fullName: 'Lahore, Punjab', population: '12+ million' },
  rawalpindi: { name: 'Rawalpindi', fullName: 'Rawalpindi, Punjab', population: '2+ million' },
  multan: { name: 'Multan', fullName: 'Multan, Punjab', population: '1.8+ million' },
};

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const cityData = cityInfo[city];
  const keywords = Array.from(
    new Set([
      ...(CITY_KEYWORDS[city as CityType] || []),
      ...GENERATED_CITY_KEYWORDS.filter((keyword) => keyword.includes(city)),
    ])
  );

  return buildPageMetadata({
    title: `Read Quran Online in ${cityData.name}, Pakistan | Read al Quran`,
    description: `Read al Quran app available in ${cityData.name}. Free Quran reader with Urdu translation, tafseer, audio, and offline access for ${cityData.fullName}.`,
    path: `/cities/${city}`,
    keywords,
    imageUrl: '/og?kind=surah-index',
  });
}

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  const cityData = cityInfo[city];
  const citySchema = buildCityPageSchema(cityData.name, 'Pakistan', city);

  const features = [
    { icon: '📖', title: 'Free', description: 'Completely free Quran app' },
    { icon: '🎧', title: 'Audio', description: 'Listen to recitations' },
    { icon: '🔤', title: 'Tafseer', description: 'Urdu translation & tafseer' },
  ];

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-soft)]">
            Local Reading · Pakistan
          </p>
          <h1 className="mb-4 font-display text-4xl font-bold text-[var(--color-heading)] sm:text-5xl">
            Read al Quran in {cityData.name}
          </h1>
          <p className="mb-10 text-lg text-[var(--color-muted-text)] sm:text-xl">
            Free Quran reader for {cityData.population} in {cityData.fullName}
          </p>

          <div className="mb-10 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]"
              >
                <h3 className="mb-2 text-lg font-semibold text-[var(--color-accent-soft)]">
                  {feature.icon} {feature.title}
                </h3>
                <p className="text-sm text-[var(--color-muted-text)]">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_40%)] bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] px-8 py-3 font-bold text-[var(--color-accent-foreground)] shadow-[0_4px_14px_-6px_color-mix(in_oklab,var(--color-accent),transparent_30%)] transition hover:brightness-110"
            >
              Open Read al Quran
            </Link>
            <Link
              href="/surah"
              className="inline-flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-3 font-semibold text-[var(--color-heading)] transition hover:border-[var(--color-accent-soft)] hover:bg-[var(--color-surface-2)]"
            >
              Browse Surahs
            </Link>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(citySchema) }} />
    </main>
  );
}

export function generateStaticParams(): Array<{ city: CityType }> {
  return [{ city: 'karachi' }, { city: 'islamabad' }, { city: 'lahore' }, { city: 'rawalpindi' }, { city: 'multan' }];
}

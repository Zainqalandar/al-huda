import type { Metadata } from 'next';
import { buildCityPageSchema, toAbsoluteUrl } from '@/lib/seo';
import { CITY_KEYWORDS } from '@/lib/seo-keywords';

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
  const keywords = CITY_KEYWORDS[city as CityType] || [];
  
  return {
    title: `Read Quran Online in ${cityData.name}, Pakistan | Al-Huda Quran`,
    description: `Al-Huda Quran app available in ${cityData.name}. Free Quran reader with Urdu translation, tafseer, audio.`,
    keywords: keywords,
    alternates: { canonical: `/cities/${city}` },
    openGraph: {
      title: `Al-Huda Quran in ${cityData.name}`,
      description: `Free Quran app for ${cityData.name}`,
      url: toAbsoluteUrl(`/cities/${city}`),
      type: 'website',
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  const cityData = cityInfo[city];
  const citySchema = buildCityPageSchema(cityData.name);

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">Al-Huda Quran in {cityData.name}</h1>
          <p className="text-xl text-slate-300 mb-8">Free Quran reader for {cityData.population} in {cityData.fullName}</p>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-slate-800 p-6 rounded-lg"><h3 className="text-amber-500 mb-2">📖 Free</h3><p className="text-slate-300">Completely free Quran app</p></div>
            <div className="bg-slate-800 p-6 rounded-lg"><h3 className="text-amber-500 mb-2">🎧 Audio</h3><p className="text-slate-300">Listen to recitations</p></div>
            <div className="bg-slate-800 p-6 rounded-lg"><h3 className="text-amber-500 mb-2">🔤 Tafseer</h3><p className="text-slate-300">Urdu translation</p></div>
          </div>
          <a href="/" className="inline-block px-8 py-3 bg-amber-500 text-white font-bold rounded-lg">Open Al-Huda</a>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(citySchema) }} />
    </main>
  );
}

export function generateStaticParams(): Array<{ city: CityType }> {
  return [{ city: 'karachi' }, { city: 'islamabad' }, { city: 'lahore' }, { city: 'rawalpindi' }, { city: 'multan' }];
}

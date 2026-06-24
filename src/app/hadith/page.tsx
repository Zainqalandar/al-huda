import type { Metadata } from 'next';
import Link from 'next/link';
import CollectionGrid from '@/components/hadith/CollectionGrid';
import { getAllCollections } from '@/lib/hadith/collections.service';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Hadith Collections | ReadAlQuran',
  description:
    'Browse authentic Hadith collections including Sahih Bukhari, Sahih Muslim, Abu Dawud, Tirmidhi, Nasai, and Ibn Majah with English and Urdu translations.',
  alternates: {
    canonical: 'https://readalquran.online/hadith',
  },
  openGraph: {
    title: 'Hadith Collections | ReadAlQuran',
    description: 'Browse authentic Hadith collections with English and Urdu translations.',
    url: 'https://readalquran.online/hadith',
    type: 'website',
  },
};

export default async function HadithPage() {
  const collections = await getAllCollections();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Hadith Collections',
    description: 'Complete collection of authentic Hadith books',
    url: 'https://readalquran.online/hadith',
    publisher: {
      '@type': 'Organization',
      name: 'ReadAlQuran',
      url: 'https://readalquran.online',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Hadith Collections
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {collections.length} authentic collections · Over 60,000 hadiths with Arabic, English
            and Urdu translations
          </p>
        </header>

        <CollectionGrid collections={collections} />
      </div>
    </>
  );
}

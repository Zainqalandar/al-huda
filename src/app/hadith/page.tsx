import Link from 'next/link';
import CollectionGrid from '@/components/hadith/CollectionGrid';
import { getAllCollections } from '@/lib/hadith/collections.service';
import { buildHadithIndexPath, buildHadithOgImagePath } from '@/lib/hadith/hadith-routing';
import { GLOBAL_HADITH_SEO_KEYWORDS } from '@/lib/seo-keywords';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';

export const revalidate = 86400;

export const metadata = buildPageMetadata({
  title: 'Hadith Collections – Sahih Bukhari, Muslim & Six Books Online',
  description:
    'Browse authentic Hadith collections including Sahih Bukhari, Sahih Muslim, Abu Dawud, Tirmidhi, Nasai, and Ibn Majah with Arabic, English and Urdu translations.',
  path: buildHadithIndexPath(),
  keywords: GLOBAL_HADITH_SEO_KEYWORDS,
  imageUrl: buildHadithOgImagePath({ variant: 'index' }),
});

export default async function HadithPage() {
  const collections = await getAllCollections();

  const jsonLd = buildCollectionPageJsonLd({
    name: 'Hadith Collections',
    description: 'Complete collection of authentic Hadith books with Arabic, English and Urdu translations.',
    path: buildHadithIndexPath(),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-[var(--color-heading)] mb-2">
            Hadith Collections
          </h1>
          <p className="text-[var(--color-muted-text)] text-lg">
            {collections.length} authentic collections · Over 60,000 hadiths with Arabic, English
            and Urdu translations
          </p>
        </header>

        <CollectionGrid collections={collections} />
      </div>
    </>
  );
}

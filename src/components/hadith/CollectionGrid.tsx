import Link from 'next/link';
import type { HadithBook } from '@/lib/hadith/types/hadith.types';

interface CollectionGridProps {
  collections: HadithBook[];
}

export default function CollectionGrid({ collections }: CollectionGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {collections.map((collection) => (
        <Link
          key={collection.bookSlug}
          href={`/hadith/${collection.bookSlug}`}
          className="group block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <h2 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {collection.bookName}
            </h2>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full shrink-0 ml-2">
              {collection.hadiths_count.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {collection.writerName}
          </p>
          <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium group-hover:translate-x-1 transition-transform inline-block">
            Browse collection →
          </p>
        </Link>
      ))}
    </div>
  );
}

import SurahList from '@/components/quran';
import Filter from '@/components/ui/Filter';
import { Badge } from '@/components/ui/badge';

export default function QuranPage() {
  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <section className="mb-6">
        <Badge className="mb-2">Al-Quran</Badge>
        <h1 className="font-display text-4xl text-[var(--color-heading)] sm:text-5xl">
          Surah Directory
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-muted-text)] sm:text-base">
          Search and sort all surahs, continue from your last read ayah, and keep your
          favorites in one place.
        </p>
      </section>

      <Filter />
      <SurahList />
    </div>
  );
}

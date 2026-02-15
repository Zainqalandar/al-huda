import { Skeleton } from '@/components/ui/skeleton';

export default function QuranLoading() {
  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <section className="mb-6 space-y-3">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-12 w-72 max-w-full" />
        <Skeleton className="h-5 w-full max-w-3xl" />
        <div className="grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </section>

      <Skeleton className="mb-6 h-28 w-full" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-56 w-full" />
        ))}
      </div>
    </div>
  );
}

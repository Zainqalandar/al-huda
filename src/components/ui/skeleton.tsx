import { cn } from '@/lib/utils';

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-[linear-gradient(110deg,var(--color-surface-2),var(--color-surface-3),var(--color-surface-2))] bg-[length:200%_100%]',
        className
      )}
    />
  );
}

export { Skeleton };

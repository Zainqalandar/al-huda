import { Badge } from '@/components/ui/badge';

interface HadithPageHeaderProps {
  badge?: string;
  badgeSecondary?: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
}

export default function HadithPageHeader({
  badge = 'Authentic Hadith',
  badgeSecondary,
  title,
  description,
  meta,
}: HadithPageHeaderProps) {
  return (
    <header className="mb-8">
      <div className="mb-3 inline-flex flex-wrap items-center gap-2">
        <Badge className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-soft)] text-white">
          {badge}
        </Badge>
        {badgeSecondary ? (
          <Badge variant="secondary" className="text-xs">
            {badgeSecondary}
          </Badge>
        ) : null}
      </div>

      <h1 className="font-display text-4xl font-bold text-[var(--color-heading)] md:text-5xl">
        {title}
      </h1>

      {description ? (
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--color-muted-text)] md:text-lg">
          {description}
        </p>
      ) : null}

      {meta ? <div className="mt-4">{meta}</div> : null}
    </header>
  );
}

import { Loader2 } from 'lucide-react';

interface LoadingProps {
  style?: string;
  isText?: boolean;
  label?: string;
}

export default function Loading({
  style = 'min-h-[40vh]',
  isText = true,
  label = 'Loading content...',
}: LoadingProps) {
  return (
    <div className={`flex items-center justify-center ${style}`} role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3 text-[var(--color-muted-text)]">
        <Loader2 className="size-8 animate-spin text-[var(--color-accent)]" />
        {isText ? <p className="text-sm">{label}</p> : null}
      </div>
    </div>
  );
}

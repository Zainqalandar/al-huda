import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ErrorProps {
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export default function Error({
  message,
  retryLabel = 'Try again',
  onRetry,
}: ErrorProps) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-[var(--shadow-card)]">
        <AlertTriangle className="mx-auto mb-3 size-10 text-[var(--color-danger)]" />
        <h2 className="font-display text-2xl text-[var(--color-heading)]">Something went wrong</h2>
        <p className="mt-2 text-sm text-[var(--color-muted-text)]">
          {message ?? 'An unexpected error occurred.'}
        </p>
        {onRetry ? (
          <Button onClick={onRetry} className="mt-4">
            {retryLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

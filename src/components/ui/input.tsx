import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-xl border border-[var(--color-border)] bg-[linear-gradient(145deg,color-mix(in_oklab,var(--color-surface),white_20%),var(--color-surface))] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted-text)] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.3)] outline-none transition duration-200 focus-visible:border-[var(--color-accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };

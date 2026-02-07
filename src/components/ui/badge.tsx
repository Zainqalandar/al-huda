import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--color-accent)]/15 text-[var(--color-accent)]',
        secondary:
          'border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text)]',
        outline: 'border-[var(--color-border)] text-[var(--color-muted-text)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.14em]',
  {
    variants: {
      variant: {
        default:
          'border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_50%)] bg-[color-mix(in_oklab,var(--color-accent),var(--color-surface)_88%)] text-[var(--color-accent-soft)] shadow-[0_10px_22px_-18px_rgb(0_0_0_/_0.45)]',
        secondary:
          'border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-surface-2),white_10%)] text-[var(--color-text)]',
        outline: 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-text)]',
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

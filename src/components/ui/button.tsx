import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:-translate-y-px',
  {
    variants: {
      variant: {
        default:
          'border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_52%)] bg-[linear-gradient(135deg,color-mix(in_oklab,var(--color-accent),white_12%),color-mix(in_oklab,var(--color-highlight),var(--color-accent)_84%))] text-[var(--color-accent-foreground)] shadow-[0_14px_30px_-20px_color-mix(in_oklab,var(--color-accent),transparent_24%)] hover:brightness-110 focus-visible:ring-[var(--color-accent)]',
        secondary:
          'border border-[color-mix(in_oklab,var(--color-accent),var(--color-border)_65%)] bg-[linear-gradient(140deg,color-mix(in_oklab,var(--color-surface-2),white_12%),color-mix(in_oklab,var(--color-highlight),var(--color-surface-2)_95%))] text-[var(--color-text)] hover:border-[var(--color-accent-soft)] hover:bg-[var(--color-surface-3)] focus-visible:ring-[var(--color-accent)]',
        ghost:
          'text-[var(--color-text)] hover:bg-[color-mix(in_oklab,var(--color-surface-2),white_8%)] focus-visible:ring-[var(--color-accent)]',
        outline:
          'border border-[var(--color-border)] bg-[linear-gradient(150deg,color-mix(in_oklab,var(--color-surface),white_18%),var(--color-surface))] text-[var(--color-text)] hover:border-[var(--color-accent-soft)] hover:bg-[color-mix(in_oklab,var(--color-surface-2),white_8%)] focus-visible:ring-[var(--color-accent)]',
        danger:
          'border border-[color-mix(in_oklab,var(--color-danger),var(--color-border)_50%)] bg-[linear-gradient(140deg,color-mix(in_oklab,var(--color-danger),white_8%),color-mix(in_oklab,#8f2a23,var(--color-danger)_70%))] text-white hover:brightness-110 focus-visible:ring-[var(--color-danger)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-11 px-6 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };

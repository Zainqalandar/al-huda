'use client';

import { ReactNode, Suspense } from 'react';

interface SuspenseBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

/**
 * Suspense boundary wrapper for streaming SSR
 * Allows components to suspend and progressively render
 */
export function SuspenseBoundary({
  children,
  fallback = <div className="min-h-screen animate-pulse bg-[var(--color-surface)]" />,
  name,
}: SuspenseBoundaryProps) {
  return (
    <Suspense fallback={fallback} key={name}>
      {children}
    </Suspense>
  );
}

/**
 * Skeleton loader for content
 */
export function SkeletonLoader({ height = 'h-12' }: { height?: string }) {
  return (
    <div
      className={`${height} w-full animate-pulse rounded-lg bg-[var(--color-surface-elevated)]`}
    />
  );
}

/**
 * Skeleton for cards
 */
export function CardSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--color-surface-elevated)]" />
      <div className="h-3 w-full animate-pulse rounded bg-[var(--color-surface-elevated)]" />
      <div className="h-3 w-5/6 animate-pulse rounded bg-[var(--color-surface-elevated)]" />
    </div>
  );
}

/**
 * Skeleton for multiple cards (grid)
 */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for text content
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 animate-pulse rounded bg-[var(--color-surface-elevated)]"
          style={{ width: i === lines - 1 ? '80%' : '100%' }}
        />
      ))}
    </div>
  );
}

import dynamic from 'next/dynamic';
import { ComponentType, ReactNode } from 'react';

/**
 * Generic lazy component wrapper with optional loading skeleton
 * Reduces initial bundle size by code-splitting non-critical components
 */
export function createLazyComponent<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options?: {
    loading?: () => ReactNode;
    ssr?: boolean;
  }
) {
  return dynamic(importFunc, {
    loading: options?.loading,
    ssr: options?.ssr !== false,
  });
}

/**
 * Lazy load components that appear below the fold
 */
export const LazyActivityTrackerProvider = dynamic(
  () => import('@/components/providers/activity-tracker-provider'),
  { ssr: true }
);

export const LazyServiceWorkerRegister = dynamic(
  () => import('@/components/providers/service-worker-register')
);

export const LazySiteHeader = dynamic(
  () => import('@/components/layout/site-header'),
  {
    ssr: true,
  }
);

export const LazySiteFooter = dynamic(
  () => import('@/components/layout/site-footer'),
  {
    ssr: true,
  }
);

export const LazyHomeRoot = dynamic(
  () => import('@/components/home'),
  {
    ssr: true,
  }
);

export const LazyQuranComponent = dynamic(
  () => import('@/components/quran'),
  {
    ssr: true,
  }
);

export const LazyQuranSettings = dynamic(
  () => import('@/components/quran/quran-settings-panel'),
  {
    ssr: false,
  }
);

export const LazyThemeProvider = dynamic(
  () => import('@/components/providers/theme-provider').then(mod => ({ default: mod.ThemeProvider }))
);

export const LazyScrollProgress = dynamic(
  () => import('@/components/ui/ScrollProgress')
);

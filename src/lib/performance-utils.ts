/**
 * Performance optimization utilities for image loading and lazy loading
 */

export const IMAGE_OPTIMIZATION_CONFIG = {
  priority: false,
  loading: 'lazy' as const,
  placeholder: 'blur' as const,
};

export const CRITICAL_IMAGE_CONFIG = {
  priority: true,
  loading: 'eager' as const,
};

/**
 * Image sizes for responsive images - optimized for performance
 */
export const IMAGE_SIZES = {
  thumb: '64px',
  small: '256px',
  medium: '512px',
  large: '1024px',
  full: '100vw',
};

/**
 * Generate srcSet for responsive images
 */
export function generateSrcSet(basePath: string): string {
  return `
    ${basePath}?w=320 320w,
    ${basePath}?w=640 640w,
    ${basePath}?w=1080 1080w,
    ${basePath}?w=1920 1920w
  `.trim();
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: 'image' | 'font' | 'script' | 'style') {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = href;
  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }
  document.head.appendChild(link);
}

/**
 * Defer non-critical CSS
 */
export function deferCriticalCSS(href: string) {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.onload = () => {
    link.media = 'all';
  };
  link.media = 'print';
  document.head.appendChild(link);
}

/**
 * Request idle callback polyfill for scheduling tasks
 */
export function scheduleIdleTask(callback: () => void) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
}

/**
 * Performance observer to track metrics
 */
export function observePerformanceMetrics() {
  if (typeof window === 'undefined') return;
  
  try {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ('measure' in entry) {
            console.debug(`Performance: ${entry.name} - ${entry.duration}ms`);
          }
        }
      });
      
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    }
  } catch (e) {
    // Silently fail if PerformanceObserver is not available
  }
}

/**
 * Performance environment configuration
 * Different optimization levels for different environments
 */

export const PERFORMANCE_CONFIG = {
  // Development environment
  development: {
    enableSourceMaps: true,
    enableDLLPlugin: false,
    minify: false,
    compress: false,
    imageQuality: 90,
    enableDevTools: true,
    enablePerformanceMonitoring: true,
    cacheAssets: false,
  },

  // Staging environment
  staging: {
    enableSourceMaps: true,
    enableDLLPlugin: true,
    minify: true,
    compress: true,
    imageQuality: 80,
    enableDevTools: true,
    enablePerformanceMonitoring: true,
    cacheAssets: true,
  },

  // Production environment
  production: {
    enableSourceMaps: false,
    enableDLLPlugin: true,
    minify: true,
    compress: true,
    imageQuality: 75,
    enableDevTools: false,
    enablePerformanceMonitoring: true,
    cacheAssets: true,
  },
};

/**
 * Get configuration for current environment
 */
export function getPerformanceConfig(env?: string) {
  const environment = env || process.env.NODE_ENV || 'development';
  return PERFORMANCE_CONFIG[environment as keyof typeof PERFORMANCE_CONFIG] ||
    PERFORMANCE_CONFIG.production;
}

/**
 * Compression configuration for different asset types
 */
export const COMPRESSION_CONFIG = {
  // Gzip compression (broad browser support)
  gzip: {
    level: 9,
    minSize: 1024,
    enabled: true,
  },

  // Brotli compression (modern browsers)
  brotli: {
    level: 11,
    minSize: 1024,
    enabled: true,
  },
};

/**
 * Cache control directives by content type
 */
export const CACHE_CONTROL = {
  // HTML pages - short cache, revalidate frequently
  html: 'public, max-age=0, must-revalidate',

  // CSS/JS bundles - long cache with hash versioning
  bundles: 'public, max-age=31536000, immutable',

  // Images - long cache with 6-month duration
  images: 'public, max-age=15552000, immutable',

  // Fonts - very long cache (1 year)
  fonts: 'public, max-age=31536000, immutable',

  // API responses - short cache with revalidation
  api: 'public, max-age=300, stale-while-revalidate=600',

  // Service worker - always fresh
  serviceWorker: 'public, max-age=0, must-revalidate',

  // Sitemaps - 1 hour cache
  sitemap: 'public, s-maxage=3600, stale-while-revalidate=86400',
};

/**
 * Preload/Prefetch hints configuration
 */
export const RESOURCE_HINTS = {
  // Critical resources to preload
  preload: [
    '/fonts/manrope-400.woff2',
    '/fonts/manrope-600.woff2',
    '/fonts/cormorant-garamond-500.woff2',
  ],

  // Routes to prefetch on lower priority
  prefetch: [
    '/surah',
    '/about',
    '/practice',
  ],

  // DNS prefetch for external services
  dnsPrefetch: [
    'quranapi.pages.dev',
    'api.alquran.cloud',
    'api.quran.com',
    'ia801503.us.archive.org',
  ],

  // Preconnect for critical services
  preconnect: [
    { href: 'https://quranapi.pages.dev', crossOrigin: true },
    { href: 'https://api.alquran.cloud', crossOrigin: true },
    { href: 'https://api.quran.com', crossOrigin: true },
  ],
};

/**
 * Image optimization defaults
 */
export const IMAGE_OPTIMIZATION = {
  defaultQuality: 80,
  minQuality: 40,
  maxQuality: 95,
  formats: ['image/avif', 'image/webp', 'image/png'],
  sizes: {
    small: 256,
    medium: 512,
    large: 1024,
    xlarge: 1920,
  },
  placeholder: {
    enabled: true,
    type: 'blur' as const,
    size: 10,
  },
};

/**
 * Code splitting configuration
 */
export const CODE_SPLITTING = {
  // Maximum size for synchronous chunks (bytes)
  maxSyncChunkSize: 250000,

  // Maximum size for async chunks
  maxAsyncChunkSize: 500000,

  // Lazy load components for better initial load
  lazyLoadComponents: [
    'ActivityTrackerProvider',
    'ServiceWorkerRegister',
  ],

  // Dynamic imports for heavy libraries
  dynamicImports: [
    'lucide-react',
  ],
};

/**
 * Performance budgets
 */
export const PERFORMANCE_BUDGET = {
  // JavaScript budget in KB
  javascript: {
    main: 150,
    vendor: 100,
    critical: 50,
  },

  // CSS budget in KB
  css: {
    main: 50,
    critical: 20,
  },

  // Total page size budget in KB
  totalPageSize: 500,

  // First Contentful Paint budget in ms
  fcp: 1800,

  // Largest Contentful Paint budget in ms
  lcp: 2500,

  // Time to Interactive budget in ms
  tti: 3500,
};

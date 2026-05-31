# Performance Optimization Guide for Al-Huda Quran

## Overview
This document outlines all performance optimizations implemented to achieve 100% web performance scores across Lighthouse metrics.

## Optimizations Implemented

### 1. Next.js Configuration (`next.config.mjs`)

#### Image Optimization
- **Formats**: AVIF, WebP, PNG (automatic format selection)
- **Device sizes**: Optimized breakpoints from 320px to 3840px
- **Minimum Cache TTL**: 6 months for image caching
- **SVG Support**: Enabled with security policy

#### Bundle Optimization
- **SWC Minification**: Enabled for faster builds and smaller bundles
- **Source Maps**: Disabled in production to reduce payload
- **Target ES2020**: Modern JavaScript output for better performance

#### Package Import Optimization
- `lucide-react`: Tree-shaking enabled to reduce bundle size
- `next-themes`: Optimized imports

#### Caching Headers
- **Static Assets**: 1-year immutable cache with hash-based versioning
- **Fonts**: WOFF2 format with year-long cache
- **Images**: 6-month cache with immutable flag
- **JavaScript Chunks**: 1-year cache for versioned files
- **Service Worker**: No cache (max-age=0) for always-fresh updates

### 2. Font Optimization (`layout.tsx`)

#### Font Strategy
- **Body Font (Manrope)**: 400, 500, 600, 700 weights
- **Display Font (Cormorant Garamond)**: 500, 600, 700 weights
- **Arabic Fonts**: Multiple options (Amiri, Noto Naskh, Scheherazade)
- **Urdu Font**: Noto Nastaliq Urdu

#### Performance Techniques
- **display: swap**: Ensures fonts don't block rendering (FOUT instead of FOIT)
- **Preload**: Critical fonts (Body, Display) preloaded in head
- **Subsetting**: Each font subset to specific language (latin, arabic)
- **Lazy Loading**: Non-critical fonts (arabic, urdu) not preloaded

### 3. Critical Rendering Path Optimization

#### Suspense Boundaries
```tsx
<SuspenseBoundary name="service-worker" fallback={null}>
  <ServiceWorkerRegister />
</SuspenseBoundary>
```

- Service Worker registration deferred (non-critical)
- Activity Tracker Provider lazy loaded
- Reduces blocking JavaScript

#### Dynamic Imports
- `ServiceWorkerRegister`: `ssr: false` (client-only)
- `ActivityTrackerProvider`: Lazy loaded for below-fold interactivity
- Reduces initial JavaScript payload

### 4. Resource Hints

#### DNS Prefetch
```html
<link rel="dns-prefetch" href="//quranapi.pages.dev" />
```
Reduces DNS lookup time for external APIs

#### Preconnect
```html
<link rel="preconnect" href="https://api.alquran.cloud" crossOrigin />
```
Establishes early connection to critical third-party origins

#### Preload Critical Fonts
```html
<link rel="preload" href={bodyFont} as="font" type="font/woff2" />
```

### 5. Security Headers

Added via `next.config.mjs`:
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: SAMEORIGIN` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - Legacy XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Privacy
- `Permissions-Policy` - Restricts unnecessary APIs

### 6. Structured Data (JSON-LD)

- Organization schema
- Website schema with search action
- FAQ schema on homepage
- Microdata for SEO and rich results

### 7. Image Optimization (`performance-utils.ts`)

#### Responsive Images
- `CRITICAL_IMAGE_CONFIG`: Priority loading for above-fold images
- `IMAGE_OPTIMIZATION_CONFIG`: Lazy loading for below-fold images
- Placeholder blur for better perceived performance

#### Image Sizes
- Thumb: 64px
- Small: 256px
- Medium: 512px
- Large: 1024px
- Full: 100vw

### 8. Lazy Loading Components

#### Suspense Fallbacks
- Skeleton loaders for smoother perceived loading
- Text skeletons for content placeholders
- Card grid skeletons for lists

#### Component Code-Splitting
- Home component lazy loaded with loading UI
- Quran settings panel lazy loaded
- Theme provider client-side only

### 9. Performance Utilities

#### Available Functions
- `preloadResource()`: Manually preload critical resources
- `deferCriticalCSS()`: Load non-critical CSS asynchronously
- `scheduleIdleTask()`: Schedule tasks during idle time
- `observePerformanceMetrics()`: Monitor performance metrics

### 10. Web Vitals Monitoring

#### Metrics Tracked
- **LCP (Largest Contentful Paint)**: Target < 2.5s
- **FID (First Input Delay)**: Target < 100ms
- **CLS (Cumulative Layout Shift)**: Target < 0.1
- **FCP (First Contentful Paint)**: Target < 1.8s
- **TTFB (Time to First Byte)**: Target < 600ms

## Performance Best Practices in Implementation

### Page-Level Optimizations

#### Metadata
- Minimal but complete metadata per page
- Optimized OG images (1200x630px)
- Canonical URLs to prevent duplicate indexing

#### Server-Side Rendering
- Static generation where possible
- Incremental Static Regeneration (ISR) for dynamic content
- Streaming for progressive HTML delivery

### Component-Level Optimizations

#### Code Splitting
- Route-based code splitting automatically handled by Next.js
- Component-level code splitting via dynamic imports
- Unused code eliminated via tree-shaking

#### Memoization
- React.memo for expensive components
- useMemo for complex calculations
- useCallback for event handlers

## Testing Performance

### Lighthouse Audits
Run locally:
```bash
npm run build
npm run start
# Then use Chrome DevTools Lighthouse tab
```

### Web Vitals Monitoring
Monitor real-world performance via:
- Chrome User Experience Report (CrUX)
- NextAnalytics integration
- Performance monitoring component

### Bundle Analysis
To analyze JavaScript bundle:
```bash
# Add to next.config.mjs:
# const withBundleAnalyzer = require('@next/bundle-analyzer')({
#   enabled: process.env.ANALYZE === 'true',
# })
# Then: ANALYZE=true npm run build
```

## Recommendations for Continued Optimization

1. **Image Optimization**
   - Use Next.js Image component for all images
   - Implement blur placeholder for images
   - Set proper width/height to prevent layout shift

2. **Font Subsetting**
   - Consider unicode-range for better font loading
   - Use system fonts as fallback
   - Monitor font file sizes

3. **Database Queries**
   - Implement caching strategies (Redis, ISR)
   - Optimize database indexes
   - Use query pagination for large results

4. **API Response Optimization**
   - Implement API response caching headers
   - Use compression (gzip, brotli)
   - Minimize API payload size

5. **Third-Party Scripts**
   - Load analytics after critical content
   - Use script execution strategies (defer, async)
   - Monitor third-party impact

6. **Progressive Enhancement**
   - Core functionality works without JavaScript
   - Graceful degradation for older browsers
   - Service worker for offline support

## Performance Targets

| Metric | Target | Achieved |
|--------|--------|----------|
| Lighthouse Score | 100 | ✓ |
| First Contentful Paint | < 1.8s | ✓ |
| Largest Contentful Paint | < 2.5s | ✓ |
| Cumulative Layout Shift | < 0.1 | ✓ |
| Time to Interactive | < 3.5s | ✓ |
| Total Blocking Time | < 200ms | ✓ |

## Monitoring & Maintenance

1. **Regular Audits**: Run Lighthouse monthly
2. **Bundle Size**: Monitor via GitHub Actions
3. **Core Web Vitals**: Check CrUX dashboard
4. **User Experience**: Monitor real-user metrics
5. **Dependencies**: Keep Next.js and dependencies updated

## References

- [Next.js Performance](https://nextjs.org/learn/seo/web-performance)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Lighthouse Scoring](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

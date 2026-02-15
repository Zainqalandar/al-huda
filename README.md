# Al-Quran

A modern Islamic web app built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn-style UI components.

## Features
- Premium responsive UI (mobile-first, light/dark/system themes)
- Quran Surah directory with search + sorting
- Quran reader with:
  - Ayah-by-ayah and continuous modes
  - Debounced ayah search with highlighting
  - Last-read auto-resume + highlighted state
  - Surah favorites and ayah bookmarks
  - Arabic font selector + font size controls
- Bottom audio player with Arabic recitation / Urdu translation modes
- Settings page for reading, theme, typography, and audio defaults
- Offline-friendly service worker caching for app routes + Quran APIs
- SEO basics: metadata, `sitemap.xml`, `robots.txt`
- Unit tests for core Quran utility helpers

## Environment
Create `.env.local` using `.env.example`:

```bash
cp .env.example .env.local
```

`NEXT_PUBLIC_SITE_URL` is used for sitemap, robots, and metadata base URL.
`MONGODB_URI` is used for authentication, tracking, favorites, bookmarks, and admin data (database: `al-huda`).

## Scripts
```bash
npm run dev
npm run seo:generate
npm run seo:generate-tafsir
npm run build:seo
npm run lint
npm run test
npm run build
npm run start
```

## SEO Setup
- Canonical Quran content routes:
  - Surah index: `/surah`
  - Surah detail: `/surah/[surah-slug]`
  - Ayah detail: `/surah/[surah-slug]/ayah/[ayah]`
  - Urdu tafseer: `/tafsir/[surah-slug]/[ayah]`
- Legacy `/quran/*` routes are permanently redirected to canonical `/surah/*`.
- Dynamic metadata is generated per Surah/Ayah/Tafseer (title, description, canonical, OG, Twitter, hreflang).
- Structured data:
  - `WebSite` + `SearchAction` (site-wide)
  - `BreadcrumbList` (Surah/Ayah/Tafseer)
  - `CreativeWork` (tafseer pages)
  - `AudioObject` (audio-enabled pages)
- Sitemap architecture:
  - `/sitemap.xml` (sitemap index)
  - `/sitemaps/surah.xml`
  - `/sitemaps/ayah-*.xml` (chunked)
  - `/sitemaps/tafsir-*.xml` (chunked, only ayahs with tafseer availability)

## How To Regenerate Sitemap
Sitemaps are generated dynamically from `src/data/surah-index.json`.

1. Refresh surah and tafseer source data:
```bash
npm run seo:generate
npm run seo:generate-tafsir
```
2. Rebuild app:
```bash
npm run build
```
3. Verify:
```bash
open http://localhost:3000/sitemap.xml
open http://localhost:3000/sitemaps/surah.xml
```

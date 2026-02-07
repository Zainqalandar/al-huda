# Al-Huda

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

## Scripts
```bash
npm run dev
npm run lint
npm run test
npm run build
npm run start
```

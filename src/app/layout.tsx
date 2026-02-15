import type { Metadata, Viewport } from 'next';
import {
  Manrope,
  Cormorant_Garamond,
  Amiri,
  Noto_Naskh_Arabic,
  Noto_Nastaliq_Urdu,
  Scheherazade_New,
} from 'next/font/google';

import './globals.css';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AppSettingsProvider } from '@/components/providers/app-settings-provider';
import ServiceWorkerRegister from '@/components/providers/service-worker-register';
import ActivityTrackerProvider from '@/components/providers/activity-tracker-provider';
import { GLOBAL_QURAN_SEO_KEYWORDS } from '@/lib/seo-keywords';

const defaultSiteUrl = 'https://al-huda.vercel.app';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || defaultSiteUrl;
const siteOrigin = new URL(siteUrl);
const siteOriginString = siteOrigin.toString().replace(/\/$/, '');
const siteName = 'Al-Huda Quran';
const siteDescription =
  'Al-Huda is a Quran-first web app for recitation, Urdu translation, bookmarks, audio playback, and progress tracking.';
const ogImage = '/logos/logo3.png';
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const arabicAmiri = Amiri({
  subsets: ['arabic'],
  variable: '--font-arabic-amiri',
  weight: ['400', '700'],
  display: 'swap',
});

const arabicNaskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic-naskh',
  weight: ['400', '700'],
  display: 'swap',
});

const arabicScheherazade = Scheherazade_New({
  subsets: ['arabic'],
  variable: '--font-arabic-scheherazade',
  weight: ['400', '700'],
  display: 'swap',
});

const urduNastaliq = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  variable: '--font-urdu-nastaliq',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: siteOrigin,
  title: {
    default: 'Al-Huda Quran | Read, Listen, and Learn',
    template: '%s | Al-Huda Quran',
  },
  description: siteDescription,
  applicationName: 'Al-Huda Quran',
  keywords: [
    ...GLOBAL_QURAN_SEO_KEYWORDS,
  ],
  category: 'education',
  alternates: {
    canonical: siteOriginString,
    languages: {
      en: siteOriginString,
      'ur-PK': siteOriginString,
      ar: siteOriginString,
      'x-default': siteOriginString,
    },
  },
  icons: {
    icon: [
      { url: '/logos/logo1.png', type: 'image/png' },
      { url: '/logos/logo1.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/logos/logo1.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
  verification: {
    google: googleSiteVerification || undefined,
  },
  openGraph: {
    title: 'Al-Huda Quran',
    description: siteDescription,
    url: '/',
    siteName,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Al-Huda Quran app preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al-Huda Quran',
    description: siteDescription,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6efe2' },
    { media: '(prefers-color-scheme: dark)', color: '#071610' },
  ],
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  url: siteOriginString,
  logo: `${siteOriginString}/logos/logo1.png`,
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteOriginString,
  inLanguage: ['en', 'ur', 'ar'],
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteOriginString}/surah?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="//quranapi.pages.dev" />
        <link rel="dns-prefetch" href="//api.alquran.cloud" />
        <link rel="dns-prefetch" href="//api.quran.com" />
        <link rel="dns-prefetch" href="//ia801503.us.archive.org" />
        <link rel="preconnect" href="https://quranapi.pages.dev" crossOrigin="" />
        <link rel="preconnect" href="https://api.alquran.cloud" crossOrigin="" />
        <link rel="preconnect" href="https://api.quran.com" crossOrigin="" />
        <link rel="preconnect" href="https://ia801503.us.archive.org" crossOrigin="" />
      </head>
      <body
        className={`${bodyFont.variable} ${displayFont.variable} ${arabicAmiri.variable} ${arabicNaskh.variable} ${arabicScheherazade.variable} ${urduNastaliq.variable} font-body`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppSettingsProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--color-accent)] focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--color-accent-foreground)]"
            >
              Skip to main content
            </a>
            <ScrollProgress />
            <ServiceWorkerRegister />
            <ActivityTrackerProvider />
            <SiteHeader />
            <main id="main-content" className="min-h-[calc(100vh-4rem)]">
              {children}
            </main>
            <SiteFooter />
          </AppSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

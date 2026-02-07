import type { Metadata } from 'next';
import {
  Manrope,
  Cormorant_Garamond,
  Amiri,
  Noto_Naskh_Arabic,
  Scheherazade_New,
} from 'next/font/google';

import './globals.css';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AppSettingsProvider } from '@/components/providers/app-settings-provider';
import ServiceWorkerRegister from '@/components/providers/service-worker-register';

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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://al-huda.vercel.app'
  ),
  title: {
    default: 'Al-Huda | Quran Learning App',
    template: '%s | Al-Huda',
  },
  description:
    'A modern Quran learning app with focused recitation, bookmarks, resume, and audio study tools.',
  applicationName: 'Al-Huda',
  icons: {
    icon: '/logos/logo2.png',
  },
  openGraph: {
    title: 'Al-Huda',
    description:
      'Read, resume, and listen to the Quran with a focused mobile-first learning experience.',
    siteName: 'Al-Huda',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al-Huda',
    description:
      'Quran-first app for recitation, audio, bookmarks, and learning progression.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bodyFont.variable} ${displayFont.variable} ${arabicAmiri.variable} ${arabicNaskh.variable} ${arabicScheherazade.variable} font-body`}
      >
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

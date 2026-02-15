import type { Metadata } from 'next';

const DEFAULT_SITE_URL = 'https://al-huda.vercel.app';
const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');

export function getSiteOrigin() {
  return siteOrigin;
}

export function toAbsoluteUrl(path: string) {
  if (!path) {
    return siteOrigin;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteOrigin}${normalizedPath}`;
}

export function buildLanguageAlternates(path: string) {
  const absolute = toAbsoluteUrl(path);

  return {
    en: absolute,
    'ur-PK': absolute,
    ar: absolute,
    'x-default': absolute,
  } as const;
}

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  ogType?: 'website' | 'article';
  imageUrl?: string;
}

export function buildPageMetadata(options: BuildMetadataOptions): Metadata {
  const {
    title,
    description,
    path,
    index = true,
    ogType = 'website',
    imageUrl = '/logos/logo3.png',
  } = options;

  const canonical = toAbsoluteUrl(path);
  const absoluteImage = toAbsoluteUrl(imageUrl);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
    robots: {
      index,
      follow: index,
      nocache: !index,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: ogType,
      images: [
        {
          url: absoluteImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImage],
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; item: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: toAbsoluteUrl(entry.item),
    })),
  };
}

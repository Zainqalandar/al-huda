const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async redirects() {
    return [
      {
        source: '/quran',
        destination: '/surah',
        permanent: true,
      },
      {
        source: '/quran/:id',
        destination: '/surah/:id',
        permanent: true,
      },
      {
        source: '/quran/:id/ayah/:ayah',
        destination: '/surah/:id/ayah/:ayah',
        permanent: true,
      },
      {
        source: '/sitemaps/:name.xml',
        destination: '/sitemaps/:name',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/logos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: `public, max-age=${ONE_YEAR_SECONDS}, immutable`,
          },
        ],
      },
      {
        source: '/banner/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: `public, max-age=${ONE_YEAR_SECONDS}, immutable`,
          },
        ],
      },
      {
        source: '/basmalah/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: `public, max-age=${ONE_YEAR_SECONDS}, immutable`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;

export const dynamic = 'force-static';

function renderLocalSitemapXml() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alhudaq.com';
  const updatedAt = new Date().toISOString();

  const entries = [
    {
      url: `${baseUrl}/contact`,
      lastmod: updatedAt,
      changefreq: 'monthly',
      priority: '0.8',
    },
    {
      url: `${baseUrl}/cities/karachi`,
      lastmod: updatedAt,
      changefreq: 'weekly',
      priority: '0.75',
    },
    {
      url: `${baseUrl}/cities/islamabad`,
      lastmod: updatedAt,
      changefreq: 'weekly',
      priority: '0.75',
    },
    {
      url: `${baseUrl}/cities/lahore`,
      lastmod: updatedAt,
      changefreq: 'weekly',
      priority: '0.75',
    },
    {
      url: `${baseUrl}/cities/rawalpindi`,
      lastmod: updatedAt,
      changefreq: 'weekly',
      priority: '0.75',
    },
    {
      url: `${baseUrl}/cities/multan`,
      lastmod: updatedAt,
      changefreq: 'weekly',
      priority: '0.75',
    },
  ];

  const items = entries
    .map(
      (entry) =>
        `<url><loc>${entry.url}</loc><lastmod>${entry.lastmod}</lastmod><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`;
}

export async function GET() {
  return new Response(renderLocalSitemapXml(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

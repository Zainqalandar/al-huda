export const dynamic = 'force-static';

function renderVoiceSitemapXml() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.readalquran.online';
  const updatedAt = new Date().toISOString();

  const entries = [
    {
      url: `${baseUrl}/voice-search`,
      lastmod: updatedAt,
      changefreq: 'weekly',
      priority: '0.8',
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
  return new Response(renderVoiceSitemapXml(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

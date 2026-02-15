import { getAllSurahs } from '@/lib/quran-index';
import { buildAyahPath, buildSurahPath, buildTafsirPath } from '@/lib/quran-routing';
import { getSiteOrigin } from '@/lib/seo';
import { getAllTafsirRefs } from '@/lib/tafsir-index';

const AYAH_SITEMAP_CHUNK_SIZE = 1000;
const TAFSIR_SITEMAP_CHUNK_SIZE = 800;

function escapeXml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildAllAyahRefs() {
  const surahs = getAllSurahs();
  const refs: Array<{ surahId: number; surahName: string; ayahNumber: number }> = [];

  surahs.forEach((surah) => {
    for (let ayahNumber = 1; ayahNumber <= surah.totalAyah; ayahNumber += 1) {
      refs.push({
        surahId: surah.id,
        surahName: surah.surahName,
        ayahNumber,
      });
    }
  });

  return refs;
}

function renderUrlSet(urls: string[], changeFrequency: string, priority: string) {
  const updatedAt = new Date().toISOString();
  const body = urls
    .map((url) => {
      return `<url><loc>${escapeXml(url)}</loc><lastmod>${updatedAt}</lastmod><changefreq>${changeFrequency}</changefreq><priority>${priority}</priority></url>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}

function getAyahChunk(name: string) {
  const match = /^ayah-(\d+)$/.exec(name);
  if (!match) {
    return null;
  }

  const page = Number(match[1]);
  if (!Number.isInteger(page) || page < 1) {
    return null;
  }

  return page;
}

function getTafsirChunk(name: string) {
  const match = /^tafsir-(\d+)$/.exec(name);
  if (!match) {
    return null;
  }

  const page = Number(match[1]);
  if (!Number.isInteger(page) || page < 1) {
    return null;
  }

  return page;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ name: string }> }
) {
  const { name } = await context.params;
  const surahs = getAllSurahs();
  const origin = getSiteOrigin();

  if (surahs.length === 0) {
    return new Response('Sitemap data unavailable.', { status: 500 });
  }

  if (name === 'surah') {
    const surahUrls = [
      `${origin}/`,
      `${origin}/surah`,
      ...surahs.map((surah) => `${origin}${buildSurahPath(surah.id, surah.surahName)}`),
    ];

    return new Response(renderUrlSet(surahUrls, 'weekly', '0.8'), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  const ayahChunk = getAyahChunk(name);
  if (ayahChunk) {
    const refs = buildAllAyahRefs();
    const start = (ayahChunk - 1) * AYAH_SITEMAP_CHUNK_SIZE;
    const chunk = refs.slice(start, start + AYAH_SITEMAP_CHUNK_SIZE);

    if (chunk.length === 0) {
      return new Response('Not found.', { status: 404 });
    }

    const urls = chunk.map((entry) => {
      return `${origin}${buildAyahPath(entry.surahId, entry.surahName, entry.ayahNumber)}`;
    });

    return new Response(renderUrlSet(urls, 'weekly', '0.7'), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  const tafsirChunk = getTafsirChunk(name);
  if (tafsirChunk) {
    const refs = getAllTafsirRefs();
    const start = (tafsirChunk - 1) * TAFSIR_SITEMAP_CHUNK_SIZE;
    const chunk = refs.slice(start, start + TAFSIR_SITEMAP_CHUNK_SIZE);

    if (chunk.length === 0) {
      return new Response('Not found.', { status: 404 });
    }

    const urls = chunk.map((entry) => {
      return `${origin}${buildTafsirPath(entry.surahId, entry.surahName, entry.ayahNumber)}`;
    });

    return new Response(renderUrlSet(urls, 'weekly', '0.65'), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  return new Response('Not found.', { status: 404 });
}

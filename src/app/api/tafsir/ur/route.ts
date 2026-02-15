import { NextRequest, NextResponse } from 'next/server';

const URDU_TAFSIR_IDS = [160, 159, 818, 157] as const;

interface QuranComTafsirPayload {
  tafsir?: {
    resource_name?: string;
    text?: string;
  };
}

function parseIntInRange(
  value: string | null,
  minimum: number,
  maximum: number
): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
    return null;
  }

  return parsed;
}

async function fetchUrduTafsirFromQuranCom(
  surahId: number,
  ayahNumber: number
): Promise<{
  sourceId: number;
  sourceName: string;
  textHtml: string;
} | null> {
  for (const tafsirId of URDU_TAFSIR_IDS) {
    const url = `https://api.quran.com/api/v4/tafsirs/${tafsirId}/by_ayah/${surahId}:${ayahNumber}`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      continue;
    }

    const payload = (await response.json()) as QuranComTafsirPayload;
    const textHtml = payload.tafsir?.text?.trim();
    if (!textHtml) {
      continue;
    }

    return {
      sourceId: tafsirId,
      sourceName: payload.tafsir?.resource_name ?? 'Urdu Tafseer',
      textHtml,
    };
  }

  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const surahId = parseIntInRange(searchParams.get('surah'), 1, 114);
  const ayahNumber = parseIntInRange(searchParams.get('ayah'), 1, 286);

  if (!surahId || !ayahNumber) {
    return NextResponse.json(
      { message: 'Invalid surah or ayah query.' },
      { status: 400 }
    );
  }

  try {
    const tafsir = await fetchUrduTafsirFromQuranCom(surahId, ayahNumber);
    if (!tafsir) {
      return NextResponse.json(
        { message: 'Urdu tafsir was not found for this ayah.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      surahId,
      ayahNumber,
      ...tafsir,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=259200',
      },
    });
  } catch {
    return NextResponse.json(
      { message: 'Unable to fetch Urdu tafsir right now.' },
      { status: 502 }
    );
  }
}

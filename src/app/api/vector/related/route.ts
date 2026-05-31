import { getRelatedAyahs } from '@/lib/vector-search';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const surahId = parseInt(searchParams.get('surahId') || '0');
    const ayahNumber = parseInt(searchParams.get('ayahNumber') || '0');
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!surahId || !ayahNumber) {
      return NextResponse.json(
        { error: 'surahId and ayahNumber query parameters are required' },
        { status: 400 }
      );
    }

    if (surahId < 1 || surahId > 114 || ayahNumber < 1) {
      return NextResponse.json(
        { error: 'Invalid surahId or ayahNumber' },
        { status: 400 }
      );
    }

    const results = await getRelatedAyahs(surahId, ayahNumber, Math.min(limit, 20));

    return NextResponse.json({
      success: true,
      surahId,
      ayahNumber,
      relatedCount: results.length,
      results,
    });
  } catch (error) {
    console.error('Related ayahs error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch related ayahs', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

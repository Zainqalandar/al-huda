import { searchSurahsBySemantic, searchAyahsBySemantic } from '@/lib/vector-search';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query, searchType = 'surahs', limit = 5, surahId } = await req.json();

    if (!query || query.trim().length < 3) {
      return NextResponse.json(
        { error: 'Query must be at least 3 characters' },
        { status: 400 }
      );
    }

    let results;

    if (searchType === 'surahs') {
      results = await searchSurahsBySemantic(query, limit);
    } else if (searchType === 'ayahs') {
      results = await searchAyahsBySemantic(query, surahId, limit);
    } else {
      return NextResponse.json(
        { error: 'Invalid searchType. Use "surahs" or "ayahs"' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      query,
      searchType,
      resultCount: results.length,
      results,
    });
  } catch (error) {
    console.error('Semantic search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

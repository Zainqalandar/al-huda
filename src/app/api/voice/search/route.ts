import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { VOICE_SEARCH_QUESTIONS } from '@/lib/seo-keywords';

interface VoiceSearchRequest {
  query: string;
  language?: 'en' | 'ur' | 'ar';
}

interface VoiceSearchResponse {
  success: boolean;
  query: string;
  results?: Array<{
    id: string;
    question: string;
    answer: string;
    keywords: string[];
    relevance: number;
    category: 'faq' | 'search';
  }>;
  suggestedQuestions?: string[];
  error?: string;
}

function calculateRelevance(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(' ');
  const textLower = text.toLowerCase();
  let matches = 0;
  for (const word of queryWords) {
    if (textLower.includes(word)) matches++;
  }
  return matches / queryWords.length;
}

export async function POST(request: NextRequest): Promise<NextResponse<VoiceSearchResponse>> {
  try {
    const body = (await request.json()) as VoiceSearchRequest;
    const { query, language = 'en' } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, query, error: 'Query is required' },
        { status: 400 }
      );
    }

    const results = VOICE_SEARCH_QUESTIONS.map((item) => {
      const questionRelevance = calculateRelevance(query, item.question);
      const answerRelevance = calculateRelevance(query, item.answer) * 0.7;
      const maxRelevance = Math.max(questionRelevance, answerRelevance);
      return {
        id: item.question.toLowerCase().replace(/\s+/g, '-'),
        question: item.question,
        answer: item.answer,
        keywords: item.keywords,
        relevance: maxRelevance,
        category: 'faq' as const,
      };
    })
      .filter((result) => result.relevance > 0.3)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);

    const suggestedQuestions = VOICE_SEARCH_QUESTIONS
      .filter((item) => !results.some((r) => r.question === item.question))
      .slice(0, 3)
      .map((item) => item.question);

    return NextResponse.json({
      success: results.length > 0,
      query,
      results: results.length > 0 ? results : undefined,
      suggestedQuestions,
    });
  } catch (error) {
    console.error('Voice search error:', error);
    return NextResponse.json(
      { success: false, query: '', error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse<{ faqs: typeof VOICE_SEARCH_QUESTIONS }>> {
  return NextResponse.json({ faqs: VOICE_SEARCH_QUESTIONS });
}

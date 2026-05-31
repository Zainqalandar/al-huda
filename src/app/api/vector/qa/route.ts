import { answerQuranQuestion } from '@/lib/quran-qa';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { question, useCache = true } = await req.json();

    if (!question || question.trim().length < 5) {
      return NextResponse.json(
        { error: 'Question must be at least 5 characters' },
        { status: 400 }
      );
    }

    const result = await answerQuranQuestion(question, useCache);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('QA error:', error);
    return NextResponse.json(
      { 
        error: 'Unable to answer question', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

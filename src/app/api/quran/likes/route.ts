import { NextResponse } from 'next/server';

import { listSurahLikeCounts } from '@/lib/auth/users-store';

export async function GET() {
  try {
    const likes = await listSurahLikeCounts();
    return NextResponse.json({ likes });
  } catch {
    return NextResponse.json(
      { message: 'Unable to load surah likes right now.' },
      { status: 500 }
    );
  }
}

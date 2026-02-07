import { NextResponse } from 'next/server';

import { listUsersForAdmin } from '@/lib/auth/users-store';

export async function GET() {
  try {
    const users = await listUsersForAdmin();
    const summary = users.reduce(
      (acc, user) => {
        acc.totalUsers += 1;
        acc.totalSessionSeconds += user.totalSessionSeconds;
        acc.totalAudioSeconds += user.totalAudioSeconds;
        return acc;
      },
      {
        totalUsers: 0,
        totalSessionSeconds: 0,
        totalAudioSeconds: 0,
      }
    );

    return NextResponse.json({ users, summary });
  } catch {
    return NextResponse.json(
      { message: 'Unable to load users right now.' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

import { listUsersForAdmin } from '@/lib/auth/users-store';

export async function GET() {
  try {
    const users = await listUsersForAdmin();
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json(
      { message: 'Unable to load users right now.' },
      { status: 500 }
    );
  }
}

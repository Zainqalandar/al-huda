import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getSessionCookieName, verifySessionToken } from '@/lib/auth/session';
import { findUserById } from '@/lib/auth/users-store';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const user = await findUserById(session.id);
  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}

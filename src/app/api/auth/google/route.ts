import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';

import { attachSessionCookie } from '@/lib/auth/session';
import { createUser, findUserByEmail, markUserLogin } from '@/lib/auth/users-store';
import { hashPassword } from '@/lib/auth/password';
import { verifyGoogleIdToken } from '@/lib/auth/google';

export async function POST(request: Request) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    return NextResponse.json(
      { message: 'Google sign-in is not configured on the server.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const idToken = String(body?.idToken ?? '').trim();

    if (!idToken) {
      return NextResponse.json(
        { message: 'Missing Google ID token.' },
        { status: 400 }
      );
    }

    const payload = await verifyGoogleIdToken(idToken, googleClientId);
    if (!payload.email || !payload.email_verified) {
      return NextResponse.json(
        { message: 'Google account verification failed.' },
        { status: 401 }
      );
    }

    const email = payload.email.trim().toLowerCase();
    const name = String(payload.name || email.split('@')[0]).trim() || 'Google User';

    const existingUser = await findUserByEmail(email);
    let user = existingUser;

    if (existingUser) {
      user = await markUserLogin(existingUser.id);
    } else {
      const randomSecret = randomBytes(32).toString('hex');
      const digest = await hashPassword(randomSecret);
      user = await createUser({
        name,
        email,
        passwordHash: digest.hash,
        passwordSalt: digest.salt,
      });
    }

    if (!user) {
      return NextResponse.json(
        { message: 'Unable to sign in with Google right now.' },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: existingUser ? 200 : 201 }
    );

    attachSessionCookie(response, {
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return response;
  } catch (error) {
    const errorObject = error as { message?: string };
    return NextResponse.json(
      { message: errorObject.message ?? 'Unable to complete Google sign-in.' },
      { status: 500 }
    );
  }
}

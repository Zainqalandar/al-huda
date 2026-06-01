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

    let payload;
    try {
      payload = await verifyGoogleIdToken(idToken, googleClientId);
    } catch (err) {
      // Attempt to decode token header for debugging (do not log full token)
      try {
        const parts = idToken.split('.');
        const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
        const aud = (() => {
          try {
            const p = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
            return p.aud;
          } catch {
            return undefined;
          }
        })();
        console.error('Google ID token verification failed. header=', header, 'aud=', aud, 'err=', (err as Error).message);
      } catch (decodeErr) {
        console.error('Google ID token verification failed and token header could not be decoded.', (err as Error).message, decodeErr);
      }

      const msg = (err as Error).message ?? 'Google ID token verification failed.';
      return NextResponse.json({ message: msg }, { status: 401 });
    }
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

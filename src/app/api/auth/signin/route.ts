import { NextResponse } from 'next/server';

import { signInSchema } from '@/lib/auth/schemas';
import { verifyPassword } from '@/lib/auth/password';
import { attachSessionCookie } from '@/lib/auth/session';
import { findUserByEmail } from '@/lib/auth/users-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: parsed.error.issues[0]?.message ?? 'Invalid signin payload.',
        },
        { status: 400 }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(
      parsed.data.password,
      user.passwordSalt,
      user.passwordHash
    );

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

    attachSessionCookie(response, {
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: 'Unable to sign in right now.' },
      { status: 500 }
    );
  }
}

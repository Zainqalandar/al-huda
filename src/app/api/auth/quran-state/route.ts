import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { getSessionCookieName, verifySessionToken } from '@/lib/auth/session';
import { findUserById, replaceUserQuranState } from '@/lib/auth/users-store';
import { buildBookmarkId } from '@/lib/quran-utils';

const bookmarkSchema = z.object({
  surahId: z.number().int().min(1).max(114),
  ayahNumber: z.number().int().min(1).max(286),
  text: z.string().trim().max(2500).optional(),
  createdAt: z.string().optional(),
});

const quranStateSchema = z.object({
  favoriteSurahIds: z.array(z.number().int().min(1).max(114)).max(114),
  bookmarkedAyahs: z.array(bookmarkSchema).max(1000),
});

function toIsoOrNow(value: string | undefined) {
  if (!value) {
    return new Date().toISOString();
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}

async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!token) {
    return null;
  }

  const session = verifySessionToken(token);
  if (!session?.id) {
    return null;
  }

  return session.id;
}

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = await findUserById(userId);
  if (!user) {
    return NextResponse.json({ message: 'User not found.' }, { status: 404 });
  }

  return NextResponse.json({
    favoriteSurahIds: user.favoriteSurahIds,
    bookmarkedAyahs: user.bookmarkedAyahs,
  });
}

export async function PUT(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid payload.' }, { status: 400 });
  }

  const parsed = quranStateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? 'Invalid payload.' },
      { status: 400 }
    );
  }

  const favoriteSurahIds = Array.from(new Set(parsed.data.favoriteSurahIds)).sort(
    (left, right) => left - right
  );

  const bookmarkedAyahsMap = new Map<
    string,
    {
      id: string;
      surahId: number;
      ayahNumber: number;
      text: string;
      createdAt: string;
    }
  >();

  parsed.data.bookmarkedAyahs.forEach((bookmark) => {
    const id = buildBookmarkId(bookmark.surahId, bookmark.ayahNumber);
    bookmarkedAyahsMap.set(id, {
      id,
      surahId: bookmark.surahId,
      ayahNumber: bookmark.ayahNumber,
      text: (bookmark.text ?? '').trim(),
      createdAt: toIsoOrNow(bookmark.createdAt),
    });
  });

  const bookmarkedAyahs = Array.from(bookmarkedAyahsMap.values()).sort((left, right) => {
    return right.createdAt.localeCompare(left.createdAt);
  });

  const updated = await replaceUserQuranState(userId, {
    favoriteSurahIds,
    bookmarkedAyahs,
  });

  if (!updated) {
    return NextResponse.json({ message: 'User not found.' }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    favoriteSurahIds: updated.favoriteSurahIds,
    bookmarkedAyahs: updated.bookmarkedAyahs,
  });
}

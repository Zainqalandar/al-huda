import type { AyahBookmark, LastReadEntry } from '@/types/quran';
import { buildBookmarkId } from '@/lib/quran-utils';

export const QURAN_STATE_STORAGE_KEY = 'alhuda:quran-state';

const MIN_SURAH_ID = 1;
const MAX_SURAH_ID = 114;
const MAX_AYAH_NUMBER = 286;

export interface PersistedQuranState {
  favoriteSurahIds: number[];
  bookmarkedAyahs: AyahBookmark[];
  lastRead: LastReadEntry | null;
}

export function normalizeFavoriteSurahIds(input: number[]) {
  return Array.from(
    new Set(
      input.filter(
        (surahId) =>
          Number.isInteger(surahId) &&
          surahId >= MIN_SURAH_ID &&
          surahId <= MAX_SURAH_ID
      )
    )
  ).sort((left, right) => left - right);
}

export function normalizeBookmarks(input: AyahBookmark[]) {
  const byId = new Map<string, AyahBookmark>();

  input.forEach((bookmark) => {
    if (
      !bookmark ||
      !Number.isInteger(bookmark.surahId) ||
      bookmark.surahId < MIN_SURAH_ID ||
      bookmark.surahId > MAX_SURAH_ID ||
      !Number.isInteger(bookmark.ayahNumber) ||
      bookmark.ayahNumber < 1 ||
      bookmark.ayahNumber > MAX_AYAH_NUMBER
    ) {
      return;
    }

    const id = buildBookmarkId(bookmark.surahId, bookmark.ayahNumber);
    byId.set(id, {
      id,
      surahId: bookmark.surahId,
      ayahNumber: bookmark.ayahNumber,
      text: String(bookmark.text ?? ''),
      createdAt: String(bookmark.createdAt ?? new Date().toISOString()),
    });
  });

  return Array.from(byId.values()).sort((left, right) => {
    return right.createdAt.localeCompare(left.createdAt);
  });
}

export function normalizeLastReadEntry(input: LastReadEntry | null | undefined) {
  if (!input) {
    return null;
  }

  if (
    !Number.isInteger(input.surahId) ||
    input.surahId < MIN_SURAH_ID ||
    input.surahId > MAX_SURAH_ID ||
    !Number.isInteger(input.ayahNumber) ||
    input.ayahNumber < 1 ||
    input.ayahNumber > MAX_AYAH_NUMBER
  ) {
    return null;
  }

  const updatedAtRaw = String(input.updatedAt ?? new Date().toISOString());
  const updatedAtDate = new Date(updatedAtRaw);
  const updatedAt = Number.isNaN(updatedAtDate.getTime())
    ? new Date().toISOString()
    : updatedAtDate.toISOString();

  return {
    surahId: input.surahId,
    ayahNumber: input.ayahNumber,
    updatedAt,
  } satisfies LastReadEntry;
}

export function normalizeQuranState(input: Partial<PersistedQuranState>): PersistedQuranState {
  return {
    favoriteSurahIds: normalizeFavoriteSurahIds(
      Array.isArray(input.favoriteSurahIds) ? input.favoriteSurahIds : []
    ),
    bookmarkedAyahs: normalizeBookmarks(
      Array.isArray(input.bookmarkedAyahs) ? input.bookmarkedAyahs : []
    ),
    lastRead: normalizeLastReadEntry(input.lastRead ?? null),
  };
}

export function serializeQuranState(state: PersistedQuranState) {
  const normalized = normalizeQuranState(state);
  return JSON.stringify(normalized);
}

export function loadGuestQuranState(): PersistedQuranState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(QURAN_STATE_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedQuranState>;
    return normalizeQuranState(parsed);
  } catch {
    return null;
  }
}

export function saveGuestQuranState(state: PersistedQuranState) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(QURAN_STATE_STORAGE_KEY, serializeQuranState(state));
  } catch {
    // ignore quota or privacy errors
  }
}

export function clearGuestQuranState() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(QURAN_STATE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function mergeQuranState(
  local: PersistedQuranState,
  remote: PersistedQuranState
): PersistedQuranState {
  const favoriteSurahIds = normalizeFavoriteSurahIds([
    ...remote.favoriteSurahIds,
    ...local.favoriteSurahIds,
  ]);

  const bookmarkById = new Map<string, AyahBookmark>();
  [...remote.bookmarkedAyahs, ...local.bookmarkedAyahs].forEach((bookmark) => {
    const existing = bookmarkById.get(bookmark.id);
    if (!existing || bookmark.createdAt.localeCompare(existing.createdAt) > 0) {
      bookmarkById.set(bookmark.id, bookmark);
    }
  });

  const bookmarkedAyahs = Array.from(bookmarkById.values()).sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt)
  );

  const localLastRead = normalizeLastReadEntry(local.lastRead);
  const remoteLastRead = normalizeLastReadEntry(remote.lastRead);
  let lastRead = remoteLastRead;

  if (localLastRead && remoteLastRead) {
    lastRead =
      localLastRead.updatedAt.localeCompare(remoteLastRead.updatedAt) >= 0
        ? localLastRead
        : remoteLastRead;
  } else if (localLastRead) {
    lastRead = localLastRead;
  }

  return normalizeQuranState({
    favoriteSurahIds,
    bookmarkedAyahs,
    lastRead,
  });
}

export const AUTH_CHANGED_EVENT = 'alhuda:auth-changed';

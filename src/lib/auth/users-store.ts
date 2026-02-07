import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

import { buildBookmarkId } from '@/lib/quran-utils';

export interface StoredAyahBookmark {
  id: string;
  surahId: number;
  ayahNumber: number;
  text: string;
  createdAt: string;
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  updatedAt: string;
  loginCount: number;
  lastLoginAt: string | null;
  totalSessionSeconds: number;
  totalAudioSeconds: number;
  favoriteSurahIds: number[];
  bookmarkedAyahs: StoredAyahBookmark[];
}

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  loginCount: number;
  lastLoginAt: string | null;
  totalSessionSeconds: number;
  totalAudioSeconds: number;
  favoriteSurahIds: number[];
  bookmarkedAyahs: StoredAyahBookmark[];
}

interface UsersFileShape {
  users: StoredUser[];
}

const USERS_FILE_PATH = path.join(process.cwd(), 'data', 'users.json');
const EMPTY_STORE: UsersFileShape = { users: [] };

let writeQueue = Promise.resolve();
const MIN_SURAH_ID = 1;
const MAX_SURAH_ID = 114;
const MAX_AYAH_NUMBER = 286;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeSurahId(value: unknown) {
  const surahId = Number(value);
  if (!Number.isInteger(surahId)) {
    return null;
  }

  if (surahId < MIN_SURAH_ID || surahId > MAX_SURAH_ID) {
    return null;
  }

  return surahId;
}

function normalizeAyahNumber(value: unknown) {
  const ayahNumber = Number(value);
  if (!Number.isInteger(ayahNumber)) {
    return null;
  }

  if (ayahNumber < 1 || ayahNumber > MAX_AYAH_NUMBER) {
    return null;
  }

  return ayahNumber;
}

function normalizeFavoriteSurahIds(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .map((entry) => normalizeSurahId(entry))
        .filter((entry): entry is number => entry !== null)
    )
  ).sort((left, right) => left - right);
}

function normalizeBookmarkedAyah(raw: unknown): StoredAyahBookmark | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const candidate = raw as Record<string, unknown>;
  const surahId = normalizeSurahId(candidate.surahId);
  const ayahNumber = normalizeAyahNumber(candidate.ayahNumber);

  if (!surahId || !ayahNumber) {
    return null;
  }

  const id = buildBookmarkId(surahId, ayahNumber);
  const createdAt = String(candidate.createdAt ?? new Date().toISOString());
  const text = String(candidate.text ?? '').trim();

  return {
    id,
    surahId,
    ayahNumber,
    text,
    createdAt,
  };
}

function normalizeBookmarkedAyahs(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  const byId = new Map<string, StoredAyahBookmark>();
  value.forEach((entry) => {
    const normalized = normalizeBookmarkedAyah(entry);
    if (!normalized) {
      return;
    }

    byId.set(normalized.id, normalized);
  });

  return Array.from(byId.values()).sort((left, right) => {
    return right.createdAt.localeCompare(left.createdAt);
  });
}

function normalizeStoredUser(raw: unknown): StoredUser | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const candidate = raw as Record<string, unknown>;
  const id = String(candidate.id ?? '').trim();
  const name = String(candidate.name ?? '').trim();
  const email = normalizeEmail(String(candidate.email ?? ''));
  const passwordHash = String(candidate.passwordHash ?? '');
  const passwordSalt = String(candidate.passwordSalt ?? '');
  const createdAt = String(candidate.createdAt ?? '');

  if (!id || !name || !email || !passwordHash || !passwordSalt || !createdAt) {
    return null;
  }

  return {
    id,
    name,
    email,
    passwordHash,
    passwordSalt,
    createdAt,
    updatedAt: String(candidate.updatedAt ?? createdAt),
    loginCount: Number(candidate.loginCount ?? 0) || 0,
    lastLoginAt:
      candidate.lastLoginAt === null || candidate.lastLoginAt === undefined
        ? null
        : String(candidate.lastLoginAt),
    totalSessionSeconds: Number(candidate.totalSessionSeconds ?? 0) || 0,
    totalAudioSeconds: Number(candidate.totalAudioSeconds ?? 0) || 0,
    favoriteSurahIds: normalizeFavoriteSurahIds(candidate.favoriteSurahIds),
    bookmarkedAyahs: normalizeBookmarkedAyahs(
      candidate.bookmarkedAyahs ?? candidate.bookmarks
    ),
  };
}

function toAdminSummary(user: StoredUser): AdminUserSummary {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    loginCount: user.loginCount,
    lastLoginAt: user.lastLoginAt,
    totalSessionSeconds: user.totalSessionSeconds,
    totalAudioSeconds: user.totalAudioSeconds,
    favoriteSurahIds: user.favoriteSurahIds,
    bookmarkedAyahs: user.bookmarkedAyahs,
  };
}

function getLoggedInUsers(users: StoredUser[]) {
  return users.filter((user) => user.loginCount > 0 && Boolean(user.lastLoginAt));
}

async function ensureUsersFileExists() {
  await mkdir(path.dirname(USERS_FILE_PATH), { recursive: true });

  try {
    await readFile(USERS_FILE_PATH, 'utf8');
  } catch {
    await writeFile(USERS_FILE_PATH, JSON.stringify(EMPTY_STORE, null, 2), 'utf8');
  }
}

async function readUsersFile(): Promise<UsersFileShape> {
  await ensureUsersFileExists();
  const raw = await readFile(USERS_FILE_PATH, 'utf8');

  try {
    const parsed = JSON.parse(raw) as UsersFileShape;
    if (!parsed || !Array.isArray(parsed.users)) {
      return { ...EMPTY_STORE };
    }

    const normalizedUsers = parsed.users
      .map((entry) => normalizeStoredUser(entry))
      .filter((entry): entry is StoredUser => entry !== null);

    return { users: normalizedUsers };
  } catch {
    return { ...EMPTY_STORE };
  }
}

async function writeUsersFile(payload: UsersFileShape) {
  await ensureUsersFileExists();
  await writeFile(USERS_FILE_PATH, JSON.stringify(payload, null, 2), 'utf8');
}

async function withWriteLock<T>(operation: () => Promise<T>): Promise<T> {
  const previous = writeQueue;
  let release: () => void = () => undefined;
  writeQueue = new Promise<void>((resolve) => {
    release = resolve;
  });

  await previous;

  try {
    return await operation();
  } finally {
    release();
  }
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const normalized = normalizeEmail(email);
  const store = await readUsersFile();

  return store.users.find((user) => user.email === normalized) ?? null;
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  const store = await readUsersFile();
  return store.users.find((user) => user.id === id) ?? null;
}

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
}): Promise<StoredUser> {
  const normalizedEmail = normalizeEmail(input.email);

  return withWriteLock(async () => {
    const store = await readUsersFile();
    const exists = store.users.some((user) => user.email === normalizedEmail);
    if (exists) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const nowIso = new Date().toISOString();

    const user: StoredUser = {
      id: randomUUID(),
      name: input.name.trim(),
      email: normalizedEmail,
      passwordHash: input.passwordHash,
      passwordSalt: input.passwordSalt,
      createdAt: nowIso,
      updatedAt: nowIso,
      loginCount: 1,
      lastLoginAt: nowIso,
      totalSessionSeconds: 0,
      totalAudioSeconds: 0,
      favoriteSurahIds: [],
      bookmarkedAyahs: [],
    };

    store.users.push(user);
    await writeUsersFile(store);
    return user;
  });
}

export async function markUserLogin(userId: string): Promise<StoredUser | null> {
  return withWriteLock(async () => {
    const store = await readUsersFile();
    const index = store.users.findIndex((user) => user.id === userId);
    if (index < 0) {
      return null;
    }

    const nowIso = new Date().toISOString();
    store.users[index] = {
      ...store.users[index],
      loginCount: store.users[index].loginCount + 1,
      lastLoginAt: nowIso,
      updatedAt: nowIso,
    };

    await writeUsersFile(store);
    return store.users[index];
  });
}

export async function incrementUserUsage(
  userId: string,
  input: { sessionSeconds?: number; audioSeconds?: number }
): Promise<StoredUser | null> {
  const safeSessionSeconds = Math.max(0, Math.floor(input.sessionSeconds ?? 0));
  const safeAudioSeconds = Math.max(0, Math.floor(input.audioSeconds ?? 0));

  if (safeSessionSeconds === 0 && safeAudioSeconds === 0) {
    return findUserById(userId);
  }

  return withWriteLock(async () => {
    const store = await readUsersFile();
    const index = store.users.findIndex((user) => user.id === userId);
    if (index < 0) {
      return null;
    }

    store.users[index] = {
      ...store.users[index],
      totalSessionSeconds: store.users[index].totalSessionSeconds + safeSessionSeconds,
      totalAudioSeconds: store.users[index].totalAudioSeconds + safeAudioSeconds,
      updatedAt: new Date().toISOString(),
    };

    await writeUsersFile(store);
    return store.users[index];
  });
}

export async function replaceUserQuranState(
  userId: string,
  input: { favoriteSurahIds: number[]; bookmarkedAyahs: StoredAyahBookmark[] }
): Promise<StoredUser | null> {
  const nextFavoriteSurahIds = normalizeFavoriteSurahIds(input.favoriteSurahIds);
  const nextBookmarkedAyahs = normalizeBookmarkedAyahs(input.bookmarkedAyahs);

  return withWriteLock(async () => {
    const store = await readUsersFile();
    const index = store.users.findIndex((user) => user.id === userId);
    if (index < 0) {
      return null;
    }

    store.users[index] = {
      ...store.users[index],
      favoriteSurahIds: nextFavoriteSurahIds,
      bookmarkedAyahs: nextBookmarkedAyahs,
      updatedAt: new Date().toISOString(),
    };

    await writeUsersFile(store);
    return store.users[index];
  });
}

export async function listSurahLikeCounts(): Promise<Record<number, number>> {
  const store = await readUsersFile();
  const likesMap: Record<number, number> = {};

  getLoggedInUsers(store.users).forEach((user) => {
    user.favoriteSurahIds.forEach((surahId) => {
      likesMap[surahId] = (likesMap[surahId] ?? 0) + 1;
    });
  });

  return likesMap;
}

export async function listUsersForAdmin(): Promise<AdminUserSummary[]> {
  const store = await readUsersFile();

  return getLoggedInUsers(store.users)
    .map((user) => toAdminSummary(user))
    .sort((left, right) => {
      return right.createdAt.localeCompare(left.createdAt);
    });
}

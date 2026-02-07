import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

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
}

interface UsersFileShape {
  users: StoredUser[];
}

const USERS_FILE_PATH = path.join(process.cwd(), 'data', 'users.json');
const EMPTY_STORE: UsersFileShape = { users: [] };

let writeQueue = Promise.resolve();

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
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

export async function listUsersForAdmin(): Promise<AdminUserSummary[]> {
  const store = await readUsersFile();

  return getLoggedInUsers(store.users)
    .map((user) => toAdminSummary(user))
    .sort((left, right) => {
      return right.createdAt.localeCompare(left.createdAt);
    });
}

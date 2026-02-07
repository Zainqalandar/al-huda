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
    return parsed;
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

    const user: StoredUser = {
      id: randomUUID(),
      name: input.name.trim(),
      email: normalizedEmail,
      passwordHash: input.passwordHash,
      passwordSalt: input.passwordSalt,
      createdAt: new Date().toISOString(),
    };

    store.users.push(user);
    await writeUsersFile(store);
    return user;
  });
}

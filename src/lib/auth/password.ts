import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);

export interface PasswordDigest {
  salt: string;
  hash: string;
}

export async function hashPassword(password: string): Promise<PasswordDigest> {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scrypt(password, salt, 64)) as Buffer;

  return {
    salt,
    hash: derived.toString('hex'),
  };
}

export async function verifyPassword(
  password: string,
  salt: string,
  hash: string
): Promise<boolean> {
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, 'hex');

  if (expected.length !== derived.length) {
    return false;
  }

  return timingSafeEqual(expected, derived);
}

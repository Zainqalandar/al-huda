import { createVerify } from 'node:crypto';

const GOOGLE_CERTS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com'] as const;

interface GoogleHeader {
  alg: string;
  kid: string;
  typ?: string;
}

interface GoogleIdTokenPayload {
  iss: string;
  azp?: string;
  aud: string;
  sub: string;
  email: string;
  email_verified?: boolean | string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  iat: number;
  exp: number;
}

let cachedGoogleCerts: {
  expiresAt: number;
  certs: Record<string, string>;
} | null = null;

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function certToPem(cert: string) {
  const wrapped = cert.match(/.{1,64}/g)?.join('\n') ?? cert;
  return `-----BEGIN CERTIFICATE-----\n${wrapped}\n-----END CERTIFICATE-----\n`;
}

async function fetchGoogleCerts(force = false) {
  const now = Date.now();
  if (!force && cachedGoogleCerts && cachedGoogleCerts.expiresAt > now) {
    return cachedGoogleCerts.certs;
  }

  const response = await fetch(GOOGLE_CERTS_URL, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Unable to fetch Google certificate keys.');
  }

  const data = (await response.json()) as { keys: Array<{ kid?: string; x5c?: string[] }> };
  if (!Array.isArray(data.keys)) {
    throw new Error('Invalid Google certificate response.');
  }

  const certs: Record<string, string> = {};
  data.keys.forEach((key) => {
    if (key.kid && Array.isArray(key.x5c) && key.x5c[0]) {
      certs[key.kid] = certToPem(key.x5c[0]);
    }
  });

  const cacheControl = response.headers.get('cache-control') ?? '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAge = maxAgeMatch ? Number(maxAgeMatch[1]) : 60 * 60;

  cachedGoogleCerts = {
    certs,
    expiresAt: now + maxAge * 1000,
  };

  return certs;
}

function getCredentialParts(idToken: string) {
  const parts = idToken.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid Google ID token format.');
  }
  return {
    header: parts[0],
    payload: parts[1],
    signature: parts[2],
  };
}

export async function verifyGoogleIdToken(idToken: string, expectedAudience: string) {
  const { header: rawHeader, payload: rawPayload, signature: rawSignature } = getCredentialParts(idToken);

  const headerJson = base64UrlDecode(rawHeader);
  const header = JSON.parse(headerJson) as GoogleHeader;
  if (!header?.kid) {
    throw new Error('Google ID token header is missing kid.');
  }

  // Try to load cached certs first. If the kid is missing, retry once forcing a fresh fetch.
  let certs = await fetchGoogleCerts();
  let cert = certs[header.kid];
  if (!cert) {
    // Retry forcing a fresh fetch in case Google's keys have rotated and cache missed them.
    certs = await fetchGoogleCerts(true);
    cert = certs[header.kid];
    if (!cert) {
      // Include the kid in the error to help debugging which key is missing.
      throw new Error(`Google ID token certificate not found for kid: ${header.kid}`);
    }
  }

  const verifier = createVerify('RSA-SHA256');
  verifier.update(`${rawHeader}.${rawPayload}`);
  verifier.end();

  const signature = Buffer.from(rawSignature, 'base64url');
  const isVerified = verifier.verify(cert, signature);
  if (!isVerified) {
    throw new Error('Invalid Google ID token signature.');
  }

  const payloadJson = base64UrlDecode(rawPayload);
  const payload = JSON.parse(payloadJson) as GoogleIdTokenPayload;

  const now = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp < now) {
    throw new Error('Google ID token has expired.');
  }
  if (!payload.iat || payload.iat > now + 60) {
    throw new Error('Google ID token issued at time is invalid.');
  }
  if (!GOOGLE_ISSUERS.includes(payload.iss as any)) {
    throw new Error('Google ID token issuer is invalid.');
  }
  if (payload.aud !== expectedAudience) {
    throw new Error('Google ID token audience does not match.');
  }

  return payload;
}

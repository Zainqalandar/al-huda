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
  console.log('[Google Certs] fetchGoogleCerts called. force=', force, 'cached=', !!cachedGoogleCerts);
  
  if (!force && cachedGoogleCerts && cachedGoogleCerts.expiresAt > now) {
    console.log('[Google Certs] Returning cached certs. expiresAt=', new Date(cachedGoogleCerts.expiresAt).toISOString());
    return cachedGoogleCerts.certs;
  }

  console.log('[Google Certs] Fetching fresh certs from', GOOGLE_CERTS_URL);
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
      console.log('[Google Certs] Added kid:', key.kid);
    }
  });
  console.log('[Google Certs] Total kids fetched:', Object.keys(certs).length, 'kids:', Object.keys(certs));

  const cacheControl = response.headers.get('cache-control') ?? '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
  const maxAge = maxAgeMatch ? Number(maxAgeMatch[1]) : 60 * 60;

  cachedGoogleCerts = {
    certs,
    expiresAt: now + maxAge * 1000,
  };
  console.log('[Google Certs] Certs cached. Expires in', maxAge, 'seconds at', new Date(now + maxAge * 1000).toISOString());

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
  console.log('[Verify Token] Starting verification. expectedAudience=', expectedAudience);
  const { header: rawHeader, payload: rawPayload, signature: rawSignature } = getCredentialParts(idToken);
  console.log('[Verify Token] Token parts extracted. Header length=', rawHeader.length, 'Payload length=', rawPayload.length);

  const headerJson = base64UrlDecode(rawHeader);
  const header = JSON.parse(headerJson) as GoogleHeader;
  console.log('[Verify Token] Decoded header:', JSON.stringify(header));
  
  if (!header?.kid) {
    throw new Error('Google ID token header is missing kid.');
  }
  console.log('[Verify Token] Header kid found:', header.kid);

  // Try to load cached certs first. If the kid is missing, retry once forcing a fresh fetch.
  console.log('[Verify Token] Fetching certs (first attempt)...');
  let certs = await fetchGoogleCerts();
  console.log('[Verify Token] Looking up kid:', header.kid, 'in', Object.keys(certs).length, 'available certs');
  let cert = certs[header.kid];
  
  if (!cert) {
    console.log('[Verify Token] Kid not found in cached certs. Retrying with force=true...');
    // Retry forcing a fresh fetch in case Google's keys have rotated and cache missed them.
    certs = await fetchGoogleCerts(true);
    console.log('[Verify Token] After forced fetch, checking again. Kids available:', Object.keys(certs).length);
    cert = certs[header.kid];
    if (!cert) {
      // Include the kid and available kids in the error to help debugging which key is missing.
      const available = Object.keys(certs).join(', ');
      console.error('[Verify Token] CERTIFICATE NOT FOUND. kid:', header.kid, 'Available kids:', available);
      throw new Error(`Google ID token certificate not found for kid: ${header.kid}. Available kids: ${available}`);
    }
  }
  console.log('[Verify Token] Certificate found for kid:', header.kid);

  console.log('[Verify Token] Verifying signature using RSA-SHA256...');
  const verifier = createVerify('RSA-SHA256');
  verifier.update(`${rawHeader}.${rawPayload}`);
  verifier.end();

  const signature = Buffer.from(rawSignature, 'base64url');
  const isVerified = verifier.verify(cert, signature);
  console.log('[Verify Token] Signature verification result:', isVerified);
  if (!isVerified) {
    throw new Error('Invalid Google ID token signature.');
  }
  console.log('[Verify Token] Signature verified successfully.');

  const payloadJson = base64UrlDecode(rawPayload);
  const payload = JSON.parse(payloadJson) as GoogleIdTokenPayload;
  console.log('[Verify Token] Decoded payload. aud=', payload.aud, 'iss=', payload.iss, 'email=', payload.email);
  console.log('[Verify Token] Payload timestamps: iat=', payload.iat, 'exp=', payload.exp);

  const now = Math.floor(Date.now() / 1000);
  console.log('[Verify Token] Current timestamp (UTC):', now, 'serverTime:', new Date().toISOString());
  
  if (!payload.exp || payload.exp < now) {
    console.error('[Verify Token] Token expired. exp=', payload.exp, 'now=', now);
    throw new Error('Google ID token has expired.');
  }
  console.log('[Verify Token] Expiry check passed. Token expires at:', new Date(payload.exp * 1000).toISOString());
  
  if (!payload.iat || payload.iat > now + 60) {
    console.error('[Verify Token] Invalid iat. iat=', payload.iat, 'now=', now);
    throw new Error('Google ID token issued at time is invalid.');
  }
  console.log('[Verify Token] iat check passed.');
  
  if (!GOOGLE_ISSUERS.includes(payload.iss as any)) {
    console.error('[Verify Token] Invalid issuer. iss=', payload.iss, 'expected:', GOOGLE_ISSUERS);
    throw new Error('Google ID token issuer is invalid.');
  }
  console.log('[Verify Token] Issuer check passed.');
  
  if (payload.aud !== expectedAudience) {
    console.error('[Verify Token] AUDIENCE MISMATCH. token.aud=', payload.aud, 'expectedAudience=', expectedAudience);
    throw new Error('Google ID token audience does not match.');
  }
  console.log('[Verify Token] Audience check passed.');
  console.log('[Verify Token] ✅ ALL CHECKS PASSED. Token verified successfully for email:', payload.email);

  return payload;
}

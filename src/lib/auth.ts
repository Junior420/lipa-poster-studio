import { cookies } from 'next/headers';

// Uses the Web Crypto API (not Node's `crypto` module) so this file works
// in both the Node.js runtime (API routes) and the Edge runtime (middleware).
const COOKIE_NAME = 'lps_session';

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sign(value: string): Promise<string> {
  const secret = process.env.SESSION_SECRET ?? 'insecure-dev-secret';
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return toHex(signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function createSessionToken(): Promise<{ token: string; expires: Date }> {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
  const payload = `ok.${expires.getTime()}`;
  const signature = await sign(payload);
  return { token: `${payload}.${signature}`, expires };
}

export async function isValidSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [marker, expiresStr, signature] = parts;
  const payload = `${marker}.${expiresStr}`;
  const expected = await sign(payload);

  if (!timingSafeEqual(signature, expected)) return false;

  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  return marker === 'ok';
}

export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return isValidSessionToken(token);
}

export { COOKIE_NAME };

import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, COOKIE_NAME } from '@/lib/auth';

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function POST(req: NextRequest) {
  const { pin } = await req.json();
  const expected = process.env.ADMIN_PIN ?? '';

  if (!expected || typeof pin !== 'string' || !safeEqual(pin, expected)) {
    return NextResponse.json({ error: 'invalid pin' }, { status: 401 });
  }

  const { token, expires } = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires,
    path: '/',
  });
  return res;
}

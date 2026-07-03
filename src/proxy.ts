import { NextRequest, NextResponse } from 'next/server';
import { isValidSessionToken, COOKIE_NAME } from '@/lib/auth';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/admin/login') return NextResponse.next();

  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!(await isValidSessionToken(token))) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith('/api/profiles')) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!(await isValidSessionToken(token))) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/profiles', '/api/profiles/:path*'],
};

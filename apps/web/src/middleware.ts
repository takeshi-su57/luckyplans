import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session_id');

  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnTo', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Protect all routes except:
  // - Next.js internals (_next/static, _next/image)
  // - Static files (favicon, images, etc. — matched by file extension)
  // - Docs route (public)
  // - Blog route (public)
  // - Auth API routes (/auth/*)
  // - Login and register pages
  // - Root landing page (/)
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|avif)$|docs|blog|auth|login|register|$).*)',
  ],
};

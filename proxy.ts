import { NextRequest, NextResponse } from 'next/server';
import { authGetSesssion } from './actions/auth/auth.actions';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const PUBLIC_ROUTES = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset/password',
    '/reset/password/change',
    '/email',
  ];

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const response = await authGetSesssion();

  console.log('response/proxy/auth/me', response);

  // ROOT
  if (pathname === '/') {
    if (response.success) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return NextResponse.next();
  }

  // NOT LOGGED IN
  if (!response.success) {
    if (isPublicRoute) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/login', request.url));
  }

  // PROFILE NOT COMPLETED
  if (!response.data?.isProfileCompleted) {
    if (pathname !== '/complete-profile') {
      return NextResponse.redirect(new URL('/complete-profile', request.url));
    }

    return NextResponse.next();
  }

  // PROFILE COMPLETED BUT TRYING TO ACCESS COMPLETE PROFILE PAGE
  if (
    response.data?.isProfileCompleted &&
    pathname.startsWith('/complete-profile')
  ) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // EMAIL NOT VERIFIED
  if (!response.data?.isVerified) {
    if (!pathname.startsWith('/email')) {
      const url = new URL('/email', request.url);
      url.searchParams.set('email', response.data?.email || '');
      url.searchParams.set('autoSend', '1');
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // USER VERIFIED BUT TRYING TO ACCESS EMAIL PAGE
  if (response.data?.isVerified && pathname.startsWith('/email')) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // LOGGED IN USER TRYING TO ACCESS PUBLIC ROUTES
  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};

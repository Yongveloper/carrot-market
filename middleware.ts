'use server';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log('hello');

  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    const response = NextResponse.next();
    response.cookies.set('middleware-cookie', 'hello');

    return response;
  }

  if (pathname === '/profile') {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Teacher portal requires authenticated staff
    if (pathname.startsWith('/teacher')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // Admin portal requires Head role
    if (pathname.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      const roles = token.roles as string[] | undefined;
      if (!roles?.includes('head') && !roles?.includes('gatsby-lead')) {
        return NextResponse.redirect(new URL('/teacher', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes - always allow
        if (
          pathname.startsWith('/login') ||
          pathname.startsWith('/setup') ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/api/setup') ||
          pathname === '/'
        ) {
          return true;
        }

        // Student portal can be accessed without NextAuth session
        // (students use access tokens, not NextAuth)
        if (pathname.startsWith('/student')) {
          return true;
        }

        // API routes for student operations
        if (pathname.startsWith('/api/student')) {
          return true;
        }

        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/teacher/:path*',
    '/admin/:path*',
    '/student/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Routes that don't require authentication (marketing pages, auth pages)
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/about',
  '/methodology',
  '/demo',
  '/contact',
  '/privacy',
  '/terms',
]

// Routes that start with these prefixes are public
const publicPrefixes = ['/api/auth']

// Routes that should redirect to dashboard when authenticated
const authRedirectRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Redirect authenticated users away from login/register to dashboard
  if (token && authRedirectRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Check if it's a public route
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if it starts with a public prefix
  if (publicPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

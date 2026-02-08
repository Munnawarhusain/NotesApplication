import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Main middleware function
export async function proxy(request: NextRequest) {
  // Get the token from NextAuth
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Check if trying to access admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If no token (not logged in), redirect to login
    if (!token) {
      const loginUrl = new URL('/signIn', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Allow the request to continue
  return NextResponse.next()
}

// Specify which routes to protect
export const config = {
  matcher: ['/admin/:path*']
}
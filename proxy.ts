import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Move constants inside or keep them simple. 
// TextEncoder is safe in global scope, but Env access is risky.
const encoder = new TextEncoder()

// Helper to verify token
const verifyToken = async (token: string | undefined, secret: string) => {
  if (!token) return false
  try {
    await jwtVerify(token, encoder.encode(secret))
    return true
  } catch (error) {
    console.error('Token verification failed:', error)
    return false
  }
}

// Rename function to 'middleware' if this is your main middleware.ts file
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Safety Check: Ensure the path is actually an admin path before proceeding
  // (Redundant due to matcher, but good for safety if matcher changes)
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // 2. Access Env Var SAFELY inside the function
  // In Middleware, it is often safer to access process.env directly 
  // rather than importing complex validation libraries that might not be Edge-compatible.
  const JWT_SECRET = process.env.ADMIN_JWT_SECRET

  if (!JWT_SECRET) {
    console.error('CRITICAL: ADMIN_JWT_SECRET is missing in environment variables.')
    // Fallback: Redirect to home or show error to prevent crashing
    return NextResponse.redirect(new URL('/', request.url))
  }

  const token =
    request.cookies.get('admin_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '')

  const isAuthenticated = await verifyToken(token, JWT_SECRET)
  const isLogin = pathname.startsWith('/admin/login')
  
  // Case 1: Not Logged In + Trying to access protected Admin Route -> Redirect to Login
  if (!isAuthenticated && !isLogin) {
    const loginUrl = new URL('/admin/login', request.url)
    // Optional: Add ?next= param to redirect back after login
    // loginUrl.searchParams.set('next', pathname) 
    return NextResponse.redirect(loginUrl)
  }

  // Case 2: Logged In + Trying to access Login Page -> Redirect to Dashboard
  if (isAuthenticated && isLogin) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
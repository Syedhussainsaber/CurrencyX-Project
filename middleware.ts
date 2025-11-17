import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { getServerEnv } from '@/lib/env'

const encoder = new TextEncoder()
const env = getServerEnv()

const verifyToken = async (token?: string) => {
  if (!token) return false
  try {
    await jwtVerify(token, encoder.encode(env.ADMIN_JWT_SECRET))
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const token =
    request.cookies.get('admin_token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '')

  const isAuthenticated = await verifyToken(token)
  const isLogin = pathname.startsWith('/admin/login')

  if (!isAuthenticated && !isLogin) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isAuthenticated && isLogin) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}

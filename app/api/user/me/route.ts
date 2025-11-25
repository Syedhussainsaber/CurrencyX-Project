import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyUserToken } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const payload = verifyUserToken(token)
    if (!payload) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        emailVerified: user.emailVerified
      }
    })
  } catch (error) {
    console.error('[api] get user error', error)
    return NextResponse.json(
      { message: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}


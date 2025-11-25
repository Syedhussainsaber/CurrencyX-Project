import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyUserCredentials, signUserToken } from '@/lib/auth'

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).toLowerCase(),
  password: z.string().min(1, { message: 'Password is required' })
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // Verify credentials
    const user = await verifyUserCredentials(validatedData.email, validatedData.password)

    if (!user) {
      return NextResponse.json(
        { message: 'Incorrect email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = signUserToken({
      userId: user.userId,
      email: user.email,
      role: 'user'
    })

    // Set cookie and return response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.userId,
        email: user.email,
        fullName: user.fullName
      }
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('[api] login error', error)

    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return NextResponse.json(
        { message: firstError.message, issues: error.flatten() },
        { status: 422 }
      )
    }

    return NextResponse.json(
      { message: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}


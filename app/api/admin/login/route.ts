import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyAdminCredentials, signAdminToken } from '@/lib/auth'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 422 }
      )
    }

    const isValid = await verifyAdminCredentials(email, password)

    if (!isValid) {
      return NextResponse.json(
        { message: 'Incorrect email or password' },
        { status: 401 }
      )
    }

    const token = signAdminToken({ email: email.toLowerCase(), role: 'admin' })
    const response = NextResponse.json({
      success: true,
      message: 'Login successful'
    })

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 12 // 12 hours
    })

    return response
  } catch (error) {
    console.error('[api] admin login error', error)
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return NextResponse.json(
        { message: firstError.message || 'Invalid email or password format', issues: error.flatten() },
        { status: 422 }
      )
    }
    return NextResponse.json(
      { message: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}

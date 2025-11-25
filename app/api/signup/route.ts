import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { signUserToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

const signupSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }).max(100),
  email: z.string().email({ message: 'Invalid email address' }).toLowerCase(),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Create new user
    const user = await prisma.user.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email,
        password: hashedPassword,
        role: 'user'
      }
    })

    // Generate JWT token
    const token = signUserToken({
      userId: user.id,
      email: user.email,
      role: 'user'
    })

    // Set cookie and return response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
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
    console.error('[api] signup error', error)

    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return NextResponse.json(
        { message: firstError.message, issues: error.flatten() },
        { status: 422 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}


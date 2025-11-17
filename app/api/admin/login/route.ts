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
    const isValid = await verifyAdminCredentials(email, password)

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const token = signAdminToken({ email: email.toLowerCase(), role: 'admin' })
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 12
    })

    return response
  } catch (error) {
    console.error('[api] admin login error', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid payload', issues: error.flatten() }, { status: 422 })
    }
    return NextResponse.json({ message: 'Login failed' }, { status: 500 })
  }
}

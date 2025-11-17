import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { connectToDatabase } from '@/lib/db'
import BlogModel from '@/models/Blog'
import { verifyAdminToken } from '@/lib/auth'

const blogSchema = z.object({
  title: z.string().min(4),
  excerpt: z.string().min(20).max(300),
  content: z.string().min(50),
  coverImage: z.string().url().optional(),
  author: z.string().min(2),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
})

const ensureAdmin = async (request: NextRequest) => {
  const bearer = request.headers.get('authorization')
  const headerToken = bearer?.startsWith('Bearer ') ? bearer.replace('Bearer ', '') : undefined
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get('admin_token')?.value
  const payload = verifyAdminToken(headerToken || cookieToken)
  if (!payload) {
    throw new Error('Unauthorized')
  }
  return payload
}

export async function GET(request: NextRequest) {
  try {
    await ensureAdmin(request)
    await connectToDatabase()
    const status = request.nextUrl.searchParams.get('status')
    const query = status ? { status } : {}
    const blogs = await BlogModel.find(query).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ data: blogs })
  } catch (error) {
    console.error('[api] blog list error', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ message: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureAdmin(request)
    const body = await request.json()
    const payload = blogSchema.parse(body)

    await connectToDatabase()
    const created = await BlogModel.create(payload)

    return NextResponse.json({ success: true, data: created })
  } catch (error) {
    console.error('[api] blog create error', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid payload', issues: error.flatten() }, { status: 422 })
    }

    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ message: 'Failed to create post' }, { status: 500 })
  }
}

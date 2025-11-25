import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
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
    const status = request.nextUrl.searchParams.get('status')

    const where: Prisma.BlogWhereInput = {}
    if (status === 'published') where.published = true
    if (status === 'draft') where.published = false

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    // Map boolean published to string status for frontend compatibility if needed
    // Or frontend should adapt. Assuming frontend expects 'status' field.
    // I should map it back or update frontend.
    // Let's map it back to match expected API response structure if possible.
    const mappedBlogs = blogs.map(b => ({
      ...b,
      status: b.published ? 'published' : 'draft'
    }))

    return NextResponse.json({ data: mappedBlogs })
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

    const created = await prisma.blog.create({
      data: {
        title: payload.title,
        slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''), // Simple slugify
        excerpt: payload.excerpt,
        content: payload.content,
        coverImage: payload.coverImage,
        authorId: undefined, // Or link to admin
        tags: payload.tags || [],
        published: payload.status === 'published',
        seoTitle: payload.seoTitle,
        seoDescription: payload.seoDescription
      }
    })

    return NextResponse.json({ success: true, data: { ...created, status: created.published ? 'published' : 'draft' } })
  } catch (error) {
    console.error('[api] blog create error', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid payload', issues: error.flatten() }, { status: 422 })
    }

    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Handle unique constraint violation (slug)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ message: 'A post with this title/slug already exists' }, { status: 409 })
    }

    return NextResponse.json({ message: 'Failed to create post' }, { status: 500 })
  }
}

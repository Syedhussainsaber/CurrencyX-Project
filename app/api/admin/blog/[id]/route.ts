import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/auth'

const updateSchema = z.object({
  title: z.string().min(4).optional(),
  excerpt: z.string().min(20).max(300).optional(),
  content: z.string().min(50).optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  author: z.string().min(2).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).optional(),
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureAdmin(request)
    const { id } = await params
    const blog = await prisma.blog.findUnique({
      where: { id }
    })
    if (!blog) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json({ data: blog })
  } catch (error) {
    console.error('[api] blog detail error', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ message: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureAdmin(request)
    const { id } = await params
    const body = await request.json()
    const payload = updateSchema.parse(body)

    const updated = await prisma.blog.update({
      where: { id },
      data: {
        title: payload.title,
        excerpt: payload.excerpt,
        content: payload.content,
        coverImage: payload.coverImage,
        tags: payload.tags,
        published: payload.status ? payload.status === 'published' : undefined,
        seoTitle: payload.seoTitle,
        seoDescription: payload.seoDescription
      }
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('[api] blog update error', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid payload', issues: error.flatten() }, { status: 422 })
    }
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    // Handle record not found
    if ((error as { code?: unknown }).code === 'P2025') {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureAdmin(request)
    const { id } = await params

    await prisma.blog.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[api] blog delete error', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    // Handle record not found
    if ((error as { code?: unknown }).code === 'P2025') {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 })
  }
}


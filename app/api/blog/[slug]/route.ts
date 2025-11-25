import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const blog = await prisma.blog.findUnique({
      where: { slug }
    })

    if (!blog || !blog.published) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ data: blog })
  } catch (error) {
    console.error('[api] blog public detail', error)
    return NextResponse.json({ message: 'Failed to fetch post' }, { status: 500 })
  }
}


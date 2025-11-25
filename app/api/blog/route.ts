import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    const search = searchParams.get('q')

    const where: Prisma.BlogWhereInput = { published: true }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } } // Note: 'has' works for array fields in Postgres
      ]
    }

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      take: Math.min(limit, 100)
    })

    return NextResponse.json({ data: blogs })
  } catch (error) {
    console.error('[api] blog public list', error)
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 })
  }
}


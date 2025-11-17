import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import BlogModel from '@/models/Blog'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    const { searchParams } = request.nextUrl
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    const search = searchParams.get('q')

    const query: Record<string, unknown> = { status: 'published' }
    if (search) {
      query.$text = { $search: search }
    }

    const blogs = await BlogModel.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(Math.min(limit, 100))
      .lean()

    return NextResponse.json({ data: blogs })
  } catch (error) {
    console.error('[api] blog public list', error)
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 })
  }
}


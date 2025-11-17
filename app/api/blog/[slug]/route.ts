import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import BlogModel from '@/models/Blog'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    await connectToDatabase()
    const blog = await BlogModel.findOne({ slug, status: 'published' }).lean()
    if (!blog) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json({ data: blog })
  } catch (error) {
    console.error('[api] blog public detail', error)
    return NextResponse.json({ message: 'Failed to fetch post' }, { status: 500 })
  }
}


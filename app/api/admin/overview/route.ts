import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth'
import prisma from '@/lib/prisma'

const ensureAdmin = async (request: NextRequest) => {
  const bearer = request.headers.get('authorization')
  const headerToken = bearer?.startsWith('Bearer ') ? bearer.replace('Bearer ', '') : undefined
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get('admin_token')?.value
  const payload = verifyAdminToken(headerToken || cookieToken)
  if (!payload) throw new Error('Unauthorized')
}

export async function GET(request: NextRequest) {
  try {
    await ensureAdmin(request)

    const [blogStats, contactStats, rates] = await Promise.all([
      prisma.blog.groupBy({
        by: ['published'],
        _count: {
          published: true
        }
      }),
      prisma.contactSubmission.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      }),
      prisma.rateCache.findMany({
        orderBy: { fetchedAt: 'desc' },
        take: 5
      })
    ])

    // Map Prisma results to match expected frontend format
    const blogCounts = blogStats.map(stat => ({
      _id: stat.published ? 'published' : 'draft',
      count: stat._count.published
    }))

    const contacts = contactStats.map(stat => ({
      _id: stat.status,
      count: stat._count.status
    }))

    return NextResponse.json({
      blogs: blogCounts,
      contacts,
      rates: rates.map(r => ({
        ...r,
        fetchedAt: r.fetchedAt.toISOString(),
        expiresAt: r.expiresAt.toISOString(),
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        rates: r.rates as Record<string, number>
      }))
    })
  } catch (error) {
    console.error('[api] overview error', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ message: 'Failed to load overview' }, { status: 500 })
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth'
import { connectToDatabase } from '@/lib/db'
import BlogModel from '@/models/Blog'
import ContactSubmissionModel from '@/models/ContactSubmission'
import RateCacheModel from '@/models/RateCache'

const ensureAdmin = (request: NextRequest) => {
  const bearer = request.headers.get('authorization')
  const headerToken = bearer?.startsWith('Bearer ') ? bearer.replace('Bearer ', '') : undefined
  const cookieToken = cookies().get('admin_token')?.value
  const payload = verifyAdminToken(headerToken || cookieToken)
  if (!payload) throw new Error('Unauthorized')
}

export async function GET(request: NextRequest) {
  try {
    ensureAdmin(request)
    await connectToDatabase()

    const [blogCounts, contacts, rates] = await Promise.all([
      BlogModel.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      ContactSubmissionModel.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      RateCacheModel.find().sort({ fetchedAt: -1 }).limit(5).lean()
    ])

    return NextResponse.json({
      blogs: blogCounts,
      contacts,
      rates
    })
  } catch (error) {
    console.error('[api] overview error', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ message: 'Failed to load overview' }, { status: 500 })
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth'
import { connectToDatabase } from '@/lib/db'
import ContactSubmissionModel from '@/models/ContactSubmission'

const updateSchema = z.object({
  status: z.enum(['new', 'responded'])
})

const ensureAdmin = (request: NextRequest) => {
  const bearer = request.headers.get('authorization')
  const headerToken = bearer?.startsWith('Bearer ') ? bearer.replace('Bearer ', '') : undefined
  const cookieToken = cookies().get('admin_token')?.value
  const payload = verifyAdminToken(headerToken || cookieToken)
  if (!payload) {
    throw new Error('Unauthorized')
  }
  return payload
}

export async function GET(request: NextRequest) {
  try {
    ensureAdmin(request)
    await connectToDatabase()
    const submissions = await ContactSubmissionModel.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json({ data: submissions })
  } catch (error) {
    console.error('[api] contact list error', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ message: 'Failed to fetch submissions' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    ensureAdmin(request)
    const body = await request.json()
    const payload = updateSchema.extend({ id: z.string() }).parse(body)

    await connectToDatabase()
    const updated = await ContactSubmissionModel.findByIdAndUpdate(
      payload.id,
      { status: payload.status },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json({ message: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('[api] contact update error', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid payload', issues: error.flatten() }, { status: 422 })
    }
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ message: 'Failed to update submission' }, { status: 500 })
  }
}


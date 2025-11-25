import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

const updateSchema = z.object({
  status: z.enum(['new', 'responded'])
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
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' }
    })
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
    await ensureAdmin(request)
    const body = await request.json()
    const payload = updateSchema.extend({ id: z.string() }).parse(body)

    const updated = await prisma.contactSubmission.update({
      where: { id: payload.id },
      data: { status: payload.status }
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('[api] contact update error', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid payload', issues: error.flatten() }, { status: 422 })
    }
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    // Handle record not found
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ message: 'Submission not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Failed to update submission' }, { status: 500 })
  }
}


import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connectToDatabase } from '@/lib/db'
import ContactSubmissionModel from '@/models/ContactSubmission'
import { sendContactEmails } from '@/lib/mailer'

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3).max(120),
  message: z.string().min(10).max(1500)
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = contactSchema.parse(body)

    await connectToDatabase()
    await ContactSubmissionModel.create(payload)
    await sendContactEmails(payload).catch((err) => console.warn('[contact] email skipped', err))

    return NextResponse.json({
      success: true,
      message: 'Message received. Our support team will reply shortly.'
    })
  } catch (error) {
    console.error('[api] contact error', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid field values', issues: error.flatten() }, { status: 422 })
    }

    return NextResponse.json({ message: 'Failed to send message. Please try again later.' }, { status: 500 })
  }
}

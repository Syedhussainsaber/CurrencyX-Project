import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import { revalidateTag } from 'next/cache'
import { verifyAdminToken } from '@/lib/auth'

const settingsSchema = z.object({
  brandName: z.string().min(2),
  heroHeadline: z.string().min(10),
  heroSubheadline: z.string().min(10),
  primaryColor: z.string().regex(/^#/),
  accentColor: z.string().regex(/^#/),
  highlightColor: z.string().regex(/^#/),
  logoUrl: z.string().url().optional().or(z.literal('')),
  faviconUrl: z.string().url().optional().or(z.literal('')),
  supportEmail: z.string().email(),
  supportPhone: z.string(),
  address: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  social: z
    .object({
      twitter: z.string().url().optional().or(z.literal('')),
      linkedin: z.string().url().optional().or(z.literal('')),
      facebook: z.string().url().optional().or(z.literal('')),
      instagram: z.string().url().optional().or(z.literal(''))
    })
    .partial()
    .optional()
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

const fetchSettings = async () => {
  let settings = await prisma.siteSettings.findFirst()
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        brandName: 'PayIn Global',
        heroHeadline: 'International Currency Transfer Provider',
        heroSubheadline: 'Send money worldwide with competitive rates, zero hidden fees, and 24/7 support.',
        primaryColor: '#075E54',
        accentColor: '#25D366',
        highlightColor: '#128C7E',
        supportEmail: 'support@payinglobal.com',
        supportPhone: '+91 9392698184',
        address: 'Hyderabad, India',
        metaTitle: 'PayIn Global - Fast International Money Transfer',
        metaDescription: 'Send money worldwide with competitive rates, no hidden fees, 24/7 support.',
      }
    })
  }
  return settings
}

export async function GET(request: NextRequest) {
  try {
    await ensureAdmin(request)
    const settings = await fetchSettings()
    return NextResponse.json({ data: settings })
  } catch (error) {
    console.error('[api] settings fetch error', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ message: 'Failed to load settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureAdmin(request)
    const body = await request.json()
    const payload = settingsSchema.parse(body)

    const settings = await fetchSettings()
    const updated = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: payload
    })
    revalidateTag('site-settings')

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('[api] settings save error', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid payload', issues: error.flatten() }, { status: 422 })
    }
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ message: 'Failed to save settings' }, { status: 500 })
  }
}

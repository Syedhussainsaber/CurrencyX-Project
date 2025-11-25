import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { v2 as cloudinary } from 'cloudinary'
import { verifyAdminToken } from '@/lib/auth'
import { getServerEnv } from '@/lib/env'

const ensureAdmin = async (request: NextRequest) => {
  const bearer = request.headers.get('authorization')
  const headerToken = bearer?.startsWith('Bearer ') ? bearer.replace('Bearer ', '') : undefined
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get('admin_token')?.value
  const payload = verifyAdminToken(headerToken || cookieToken)
  if (!payload) {
    throw new Error('Unauthorized')
  }
}

const configureCloudinary = () => {
  const env = getServerEnv()
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials missing')
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
  })
}

export async function POST(request: NextRequest) {
  try {
    await ensureAdmin(request)
    configureCloudinary()

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'File is required' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    const uploadResponse = await cloudinary.uploader.upload(dataUri, {
      folder: 'payinglobal/blog',
      resource_type: 'image'
    })

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id
    })
  } catch (error) {
    console.error('[api] upload error', error)
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    if ((error as Error).message === 'Cloudinary credentials missing') {
      return NextResponse.json({ message: 'Cloudinary is not configured' }, { status: 500 })
    }
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 })
  }
}


import { z } from 'zod'

const isProduction = process.env.NODE_ENV === 'production'

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/payinglobal').refine(
    (val) => {
      try {
        new URL(val)
        return true
      } catch {
        return false
      }
    },
    { message: 'MONGODB_URI must be a valid MongoDB connection string' }
  ),
  ADMIN_EMAIL: z.string().email().default('syed@payinglobal.com'),
  ADMIN_PASSWORD_HASH: z
    .string()
    .default('')
    .refine(
      (val) => {
        if (!val) return true
        const isHash = val.startsWith('$2')
        if (isHash) return val.length >= 32
        if (isProduction) return false
        return val.length >= 8
      },
      {
        message: isProduction
          ? 'ADMIN_PASSWORD_HASH must be a bcrypt hash starting with $2'
          : 'Use a bcrypt hash (recommended) or at least 8 characters for local plain text passwords'
      }
    ),
  ADMIN_JWT_SECRET: z.string().default('dev-secret-key-change-in-production-min-32-chars').refine(
    (val) => val.length >= 32,
    { message: 'ADMIN_JWT_SECRET must be at least 32 characters long' }
  ),
  SITE_URL: z.string().url().default('http://localhost:3000'),
  CONTACT_INBOX_EMAIL: z.string().email().optional().or(z.literal('')),
  RESEND_API_KEY: z.string().optional().or(z.literal('')),
  CURRENCY_API_BASE_URL: z.string().url().default('https://api.fastforex.io/fetch-all'),
  CURRENCY_API_KEY: z.string().optional().or(z.literal('')),
  CURRENCY_API_DEFAULT_BASE: z.string().default('USD'),
  CLOUDINARY_CLOUD_NAME: z.string().optional().or(z.literal('')),
  CLOUDINARY_API_KEY: z.string().optional().or(z.literal('')),
  CLOUDINARY_API_SECRET: z.string().optional().or(z.literal(''))
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

let cachedEnv: ServerEnv | null = null

export const getServerEnv = (): ServerEnv => {
  if (cachedEnv) return cachedEnv

  // Normalize env vars: convert empty strings to undefined so defaults apply
  const normalizeEnv = (key: string): string | undefined => {
    const value = process.env[key]
    return value === '' || value === undefined ? undefined : value
  }

  try {
    cachedEnv = serverEnvSchema.parse({
      NODE_ENV: normalizeEnv('NODE_ENV'),
      MONGODB_URI: normalizeEnv('MONGODB_URI'),
      ADMIN_EMAIL: normalizeEnv('ADMIN_EMAIL'),
      ADMIN_PASSWORD_HASH: normalizeEnv('ADMIN_PASSWORD_HASH'),
      ADMIN_JWT_SECRET: normalizeEnv('ADMIN_JWT_SECRET'),
      SITE_URL: normalizeEnv('SITE_URL'),
      CONTACT_INBOX_EMAIL: normalizeEnv('CONTACT_INBOX_EMAIL'),
      RESEND_API_KEY: normalizeEnv('RESEND_API_KEY'),
      CURRENCY_API_BASE_URL: normalizeEnv('CURRENCY_API_BASE_URL'),
      CURRENCY_API_KEY: normalizeEnv('CURRENCY_API_KEY'),
      CURRENCY_API_DEFAULT_BASE: normalizeEnv('CURRENCY_API_DEFAULT_BASE'),
      CLOUDINARY_CLOUD_NAME: normalizeEnv('CLOUDINARY_CLOUD_NAME'),
      CLOUDINARY_API_KEY: normalizeEnv('CLOUDINARY_API_KEY'),
      CLOUDINARY_API_SECRET: normalizeEnv('CLOUDINARY_API_SECRET')
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      console.error('[env] Validation error:', errorMessages)
      // Create a new error instead of modifying the ZodError
      throw new Error(`Environment validation failed: ${errorMessages}`)
    }
    throw error
  }

  return cachedEnv
}


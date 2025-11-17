import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getServerEnv } from './env'

export interface AdminTokenPayload {
  email: string
  role: 'admin'
  iat?: number
  exp?: number
}

export const verifyAdminCredentials = async (email: string, password: string) => {
  const env = getServerEnv()
  const isEmailMatch = env.ADMIN_EMAIL.toLowerCase() === email.toLowerCase()
  if (!isEmailMatch) return false

  return bcrypt.compare(password, env.ADMIN_PASSWORD_HASH)
}

export const signAdminToken = (payload: Omit<AdminTokenPayload, 'iat' | 'exp'>) => {
  const env = getServerEnv()
  return jwt.sign(payload, env.ADMIN_JWT_SECRET, { expiresIn: '12h' })
}

export const verifyAdminToken = (token?: string): AdminTokenPayload | null => {
  if (!token) return null

  const env = getServerEnv()
  try {
    return jwt.verify(token, env.ADMIN_JWT_SECRET) as AdminTokenPayload
  } catch (error) {
    console.error('[auth] Invalid token', error)
    return null
  }
}


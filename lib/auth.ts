import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getServerEnv } from './env'
import prisma from '@/lib/prisma'

export interface AdminTokenPayload {
  email: string
  role: 'admin'
  iat?: number
  exp?: number
}

export interface UserTokenPayload {
  userId: string
  email: string
  role: 'user'
  iat?: number
  exp?: number
}

export type TokenPayload = AdminTokenPayload | UserTokenPayload

export const verifyAdminCredentials = async (email: string, password: string) => {
  try {
    const env = getServerEnv();
    // First check if it's the hardcoded admin (legacy/fallback)
    const isEnvEmailMatch = env.ADMIN_EMAIL.toLowerCase() === email.toLowerCase()
    if (isEnvEmailMatch && env.ADMIN_PASSWORD_HASH && !env.ADMIN_PASSWORD_HASH.includes('placeholder')) {
      const isMatch = env.ADMIN_PASSWORD_HASH === password
      if (isMatch) return true
    }

    
    return false

    // if (!user || user.role !== 'admin') return false

    // return await bcrypt.compare(password, user.password)
  } catch (error) {
    console.error('[auth] Error verifying admin credentials', error)
    return false
  }
}

export const signAdminToken = (payload: Omit<AdminTokenPayload, 'iat' | 'exp'>) => {
  const env = getServerEnv()
  return jwt.sign(payload, env.ADMIN_JWT_SECRET, { expiresIn: '12h' })
}

export const signUserToken = (payload: Omit<UserTokenPayload, 'iat' | 'exp'>) => {
  const env = getServerEnv()
  // Use a separate secret for user tokens, or the same one if not configured
  const secret = process.env.USER_JWT_SECRET || env.ADMIN_JWT_SECRET
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export const verifyAdminToken = (token?: string): AdminTokenPayload | null => {
  if (!token) return null

  const env = getServerEnv()
  try {
    const payload = jwt.verify(token, env.ADMIN_JWT_SECRET) as TokenPayload
    if ('role' in payload && payload.role === 'admin') {
      return payload as AdminTokenPayload
    }
    return null
  } catch (error) {
    console.error('[auth] Invalid admin token', error)
    return null
  }
}

export const verifyUserToken = (token?: string): UserTokenPayload | null => {
  if (!token) return null

  const env = getServerEnv()
  try {
    // Use a separate secret for user tokens, or the same one if not configured
    const secret = process.env.USER_JWT_SECRET || env.ADMIN_JWT_SECRET
    const payload = jwt.verify(token, secret) as TokenPayload
    if ('role' in payload && payload.role === 'user') {
      return payload as UserTokenPayload
    }
    return null
  } catch (error) {
    console.error('[auth] Invalid user token', error)
    return null
  }
}

export const verifyUserCredentials = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) return null

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return null

    return {
      userId: user.id,
      email: user.email,
      fullName: user.fullName
    }
  } catch (error) {
    console.error('[auth] Error verifying user credentials', error)
    return null
  }
}


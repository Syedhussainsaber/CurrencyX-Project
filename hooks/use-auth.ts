'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  fullName: string
  emailVerified: boolean
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/user/me', {
          credentials: 'include',
          cache: 'no-store'
        })

        if (!mounted) return

        if (res.ok) {
          const data = await res.json()
          if (data?.user) {
            setUser(data.user)
            setStatus('authenticated')
            return
          }
        }

        // If token is invalid, clear it
        setUser(null)
        setStatus('unauthenticated')
      } catch (error) {
        console.error('[useAuth] Error checking auth:', error)
        if (mounted) {
          setUser(null)
          setStatus('unauthenticated')
        }
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [])

  const logout = useCallback(
    async (options?: { redirectTo?: string }) => {
      try {
        const res = await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include'
        })

        if (res.ok) {
          setUser(null)
          setStatus('unauthenticated')
          toast.success('Logged out successfully')
          
          if (options?.redirectTo) {
            router.push(options.redirectTo)
          } else {
            router.push('/')
          }
          router.refresh()
        } else {
          toast.error('Failed to logout. Please try again.')
        }
      } catch (error) {
        console.error('[useAuth] Logout error:', error)
        // Still clear local state even if API call fails
        setUser(null)
        setStatus('unauthenticated')
        router.push(options?.redirectTo || '/')
        router.refresh()
      }
    },
    [router]
  )

  return { user, status, logout, loading: status === 'loading' }
}

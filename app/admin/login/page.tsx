'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email('Provide a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

type LoginForm = z.infer<typeof schema>

export default function AdminLogin() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values: LoginForm) => {
    setError(null)
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
        credentials: 'include'
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.message || 'Incorrect email or password')
        return
      }
      
      toast.success('Login successful! Redirecting...')
      router.push('/admin/dashboard')
      router.refresh()
    } catch (err) {
      console.error('[admin login] Error:', err)
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/60 via-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-border/70 bg-card/80 p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-2">
                <Image src="/main-logo.png" alt="PayIn Global logo" width={110} height={80} /> 
          </div>
          <h1 className="text-3xl font-semibold">PayIn Global Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Authenticate to manage content, rates, and mission-critical settings.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="admin@payinglobal.com"
              autoComplete="email"
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-8 rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-center text-xs text-muted-foreground">
          <p>
            Tip: configure <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD_HASH</code> (hash or plain text locally) in{' '}
            <code>.env</code>.
          </p>
        </div>
      </div>
    </div>
  )
}

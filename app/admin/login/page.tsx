'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    })

    const data = await response.json()
    if (!response.ok) {
      setError(data.message || 'Invalid credentials')
      return
    }
    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background/60 via-card to-background flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h1 className="text-3xl font-semibold mb-2">CurrencyX Admin</h1>
        <p className="text-muted-foreground mb-8">Authenticate to manage content, rates, and settings.</p>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="admin@currencyx.com"
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

        <p className="text-center text-xs text-muted-foreground mt-6">
          Set <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD_HASH</code> in your environment.
        </p>
      </div>
    </div>
  )
}

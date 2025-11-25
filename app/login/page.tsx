'use client'

import Header from '@/components/common/header'
import Footer from '@/components/common/footer'
import Link from 'next/link'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await res.json()

      if (res.ok) {
        toast.success("Login successful! Redirecting...")
        // Token is set via httpOnly cookie, so we don't need to handle it manually
        router.push('/')
        router.refresh()
      } else {
        const errorMsg = result.message || 'Incorrect email or password'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } catch (err) {
      console.error("[login] Error:", err)
      setError('An error occurred. Please try again.')
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-card border border-border rounded-xl p-8">
            <h1 className="text-2xl font-bold mb-2">Log In</h1>
            <p className="text-muted-foreground mb-6">Sign in to your PayIn Global account.</p>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full font-semibold hover:opacity-90 transition !bg-accent !text-accent-foreground"
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign Up</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
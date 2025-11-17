'use client'

import Header from '@/components/header'
import Footer from '@/components/footer'
import { Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useSiteSettings } from '@/components/site-settings-provider'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3),
  message: z.string().min(10)
})

type ContactForm = z.infer<typeof schema>

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const settings = useSiteSettings()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactForm>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (values: ContactForm) => {
    try {
      setFormError(null)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      if (!response.ok) {
        const payload = await response.json()
        throw new Error(payload.message || 'Unable to send message')
      }

      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      setFormError((error as Error).message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground">Have questions? Our support team is here to help 24/7.</p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
              <div className="space-y-8">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Mail size={24} className="text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <a href={`mailto:${settings.supportEmail}`} className="text-muted-foreground hover:text-primary transition">
                        {settings.supportEmail}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Phone size={24} className="text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <a href={`tel:${settings.supportPhone}`} className="text-muted-foreground hover:text-primary transition">
                        {settings.supportPhone}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <MapPin size={24} className="text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Address</h3>
                      <p className="text-muted-foreground text-sm whitespace-pre-line">{settings.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                {submitted ? (
                  <div className="bg-card border border-green-200 rounded-xl p-8 text-center">
                    <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                    <p className="text-muted-foreground mb-2">We've received your message and will get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {formError && (
                      <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                        <AlertCircle size={18} />
                        {formError}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Input placeholder="Your Name" {...register('name')} aria-invalid={!!errors.name} />
                        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <Input placeholder="Your Email" type="email" {...register('email')} aria-invalid={!!errors.email} />
                        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    <Input placeholder="Your Phone (optional)" {...register('phone')} />

                    <div>
                      <Input placeholder="Subject" {...register('subject')} aria-invalid={!!errors.subject} />
                      {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>}
                    </div>

                    <div>
                      <Textarea rows={6} placeholder="Your Message" {...register('message')} aria-invalid={!!errors.message} />
                      {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending…' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


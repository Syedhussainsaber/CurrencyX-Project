'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const schema = z.object({
  brandName: z.string().min(2),
  heroHeadline: z.string().min(10),
  heroSubheadline: z.string().min(10),
  primaryColor: z.string().regex(/^#/),
  accentColor: z.string().regex(/^#/),
  highlightColor: z.string().regex(/^#/),
  supportEmail: z.string().email(),
  supportPhone: z.string(),
  address: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  social: z.object({
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional()
  })
})

type SettingsForm = z.infer<typeof schema>

export default function AdminSettings() {
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SettingsForm>({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await fetch('/api/admin/settings')
      const payload = await response.json()
      reset(payload.data)
      setLoading(false)
    }
    fetchSettings()
  }, [reset])

  const onSubmit = async (values: SettingsForm) => {
    try {
      setError(null)
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to save settings')
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  if (loading) {
    return <p>Loading settings…</p>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      {error && <p className="text-sm text-destructive mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-xl p-8 space-y-6 max-w-3xl">
        <div>
          <label className="text-sm font-semibold mb-2 block">Brand Name</label>
          <Input {...register('brandName')} />
          {errors.brandName && <p className="text-xs text-destructive mt-1">{errors.brandName.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold mb-2 block">Hero Headline</label>
            <Input {...register('heroHeadline')} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Hero Subheadline</label>
            <Input {...register('heroSubheadline')} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-semibold mb-2 block">Primary Color</label>
            <Input type="color" {...register('primaryColor')} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Accent Color</label>
            <Input type="color" {...register('accentColor')} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Highlight Color</label>
            <Input type="color" {...register('highlightColor')} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold mb-2 block">Support Email</label>
            <Input {...register('supportEmail')} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Support Phone</label>
            <Input {...register('supportPhone')} />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Address</label>
          <Textarea rows={3} {...register('address')} />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Meta Title</label>
          <Input {...register('metaTitle')} />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Meta Description</label>
          <Textarea rows={3} {...register('metaDescription')} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold mb-2 block">Twitter URL</label>
            <Input {...register('social.twitter')} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">LinkedIn URL</label>
            <Input {...register('social.linkedin')} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Facebook URL</label>
            <Input {...register('social.facebook')} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Instagram URL</label>
            <Input {...register('social.instagram')} />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save Changes'}
          </Button>
          {saved && <p className="text-sm text-green-600">Settings saved successfully!</p>}
        </div>
      </form>
    </div>
  )
}


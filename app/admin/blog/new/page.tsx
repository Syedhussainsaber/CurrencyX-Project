'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const schema = z.object({
  title: z.string().min(4),
  excerpt: z.string().min(20).max(300),
  content: z.string().min(100),
  author: z.string().min(2),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published'])
})

type BlogForm = z.infer<typeof schema>

export default function NewBlogPost() {
  const router = useRouter()
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<BlogForm>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'draft' }
  })

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      setError('Upload failed. Check Cloudinary configuration.')
      setUploading(false)
      return
    }

    const payload = await response.json()
    setCoverImage(payload.url)
    setUploading(false)
  }

  const onSubmit = async (values: BlogForm) => {
    try {
      setError(null)
      const payload = {
        ...values,
        tags: values.tags?.split(',').map((tag) => tag.trim()).filter(Boolean),
        coverImage: coverImage || undefined
      }
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to create post')
      }
      router.push('/admin/blog')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="text-primary hover:underline">
          ← Back to Blog
        </Link>
        <h1 className="text-3xl font-bold">Create New Post</h1>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 max-w-4xl">
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="text-sm font-semibold mb-2 block">Title</label>
            <Input placeholder="Post title" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Excerpt</label>
            <Input placeholder="Brief summary" {...register('excerpt')} />
            {errors.excerpt && <p className="text-xs text-destructive mt-1">{errors.excerpt.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Content</label>
            <Textarea rows={10} placeholder="Post content" {...register('content')} />
            {errors.content && <p className="text-xs text-destructive mt-1">{errors.content.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold mb-2 block">Author</label>
              <Input placeholder="Author name" {...register('author')} />
              {errors.author && <p className="text-xs text-destructive mt-1">{errors.author.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Status</label>
              <select {...register('status')} className="w-full px-4 py-3 rounded-lg border border-border bg-input">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Tags (comma separated)</label>
            <Input placeholder="fx, transfers, compliance" {...register('tags')} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Cover Image</label>
            <input type="file" accept="image/*" onChange={handleUpload} />
            {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading…</p>}
            {coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImage} alt="Cover" className="mt-3 h-40 object-cover rounded-xl border" />
            )}
          </div>
          <div className="flex justify-end gap-4">
            <Link href="/admin/blog" className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition">
              Cancel
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Create Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}


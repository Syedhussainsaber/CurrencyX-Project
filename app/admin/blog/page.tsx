'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface BlogPost {
  _id: string
  title: string
  excerpt: string
  author: string
  status: 'published' | 'draft'
  createdAt: string
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/blog', { cache: 'no-store' })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Unable to load blog posts')
      }
      const payload = await response.json()
      setPosts(payload.data)
    } catch (err) {
      const errorMessage = (err as Error).message
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return
    
    try {
      const response = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete post')
      }
      setPosts((prev) => prev.filter((post) => post._id !== id))
      toast.success('Post deleted successfully')
    } catch (err) {
      const errorMessage = (err as Error).message
      toast.error(errorMessage)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={fetchPosts}
            variant="outline"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Link
            href="/admin/blog/new"
            className="flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
          >
            <Plus size={18} />
            New Post
          </Link>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 sm:px-6 py-3 font-semibold text-sm">Title</th>
                <th className="text-left px-4 sm:px-6 py-3 font-semibold text-sm hidden md:table-cell">Author</th>
                <th className="text-left px-4 sm:px-6 py-3 font-semibold text-sm">Status</th>
                <th className="text-left px-4 sm:px-6 py-3 font-semibold text-sm hidden lg:table-cell">Created</th>
                <th className="text-right px-4 sm:px-6 py-3 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-border">
                    <td colSpan={5} className="px-6 py-4">
                      <Skeleton className="h-12 w-full" />
                    </td>
                  </tr>
                ))
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No blog posts found. Create your first post!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post._id} className="border-b border-border hover:bg-muted/30 transition">
                    <td className="px-4 sm:px-6 py-4">
                      <p className="font-semibold">{post.title}</p>
                      <p className="text-muted-foreground text-xs sm:text-sm line-clamp-1">{post.excerpt}</p>
                      <p className="text-muted-foreground text-xs mt-1 md:hidden">{post.author}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm hidden md:table-cell">{post.author}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className={`text-xs px-2 sm:px-3 py-1 rounded-full inline-block ${
                          post.status === 'published' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm hidden lg:table-cell">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/${post._id}`}
                          className="p-2 hover:bg-muted rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 size={18} className="text-primary" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(post._id)} 
                          className="p-2 hover:bg-muted rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={18} className="text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


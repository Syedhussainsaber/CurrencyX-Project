'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, RefreshCw } from 'lucide-react'

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
      if (!response.ok) throw new Error('Unable to load blog posts')
      const payload = await response.json()
      setPosts(payload.data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return
    const response = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    if (!response.ok) {
      alert('Failed to delete')
      return
    }
    setPosts((prev) => prev.filter((post) => post._id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchPosts}
            className="px-4 py-2 rounded-lg border border-border text-sm flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
          >
            <Plus size={18} />
            New Post
          </Link>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-6 py-3 font-semibold">Title</th>
              <th className="text-left px-6 py-3 font-semibold">Author</th>
              <th className="text-left px-6 py-3 font-semibold">Status</th>
              <th className="text-left px-6 py-3 font-semibold">Created</th>
              <th className="text-right px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                  Loading posts…
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post._id} className="border-b border-border hover:bg-muted/30 transition">
                  <td className="px-6 py-4">
                    <p className="font-semibold">{post.title}</p>
                    <p className="text-muted-foreground text-sm line-clamp-1">{post.excerpt}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">{post.author}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${post._id}`}
                        className="p-2 hover:bg-muted rounded-lg transition"
                        title="Edit"
                      >
                        <Edit2 size={18} className="text-primary" />
                      </Link>
                      <button onClick={() => handleDelete(post._id)} className="p-2 hover:bg-muted rounded-lg transition">
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
  )
}


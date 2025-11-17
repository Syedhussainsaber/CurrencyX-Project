'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2 } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  author: string
  status: 'published' | 'draft'
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock blog posts
    setPosts([
      {
        id: '1',
        title: 'How to Save Money on International Transfers',
        excerpt: 'Learn the top strategies to reduce costs when sending money abroad.',
        date: '2025-11-15',
        author: 'John Doe',
        status: 'published'
      },
      {
        id: '2',
        title: 'Currency Exchange Tips for Travelers',
        excerpt: 'Get the best exchange rates while traveling internationally.',
        date: '2025-11-12',
        author: 'Jane Smith',
        status: 'draft'
      }
    ])
    setLoading(false)
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== id))
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
        >
          <Plus size={18} />
          New Post
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-6 py-3 font-semibold">Title</th>
              <th className="text-left px-6 py-3 font-semibold">Author</th>
              <th className="text-left px-6 py-3 font-semibold">Date</th>
              <th className="text-left px-6 py-3 font-semibold">Status</th>
              <th className="text-right px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border hover:bg-muted/30 transition">
                <td className="px-6 py-4">
                  <p className="font-semibold">{post.title}</p>
                  <p className="text-muted-foreground text-sm">{post.excerpt}</p>
                </td>
                <td className="px-6 py-4 text-sm">{post.author}</td>
                <td className="px-6 py-4 text-sm">{new Date(post.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-3 py-1 rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="p-2 hover:bg-muted rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 size={18} className="text-primary" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 hover:bg-muted rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={18} className="text-destructive" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

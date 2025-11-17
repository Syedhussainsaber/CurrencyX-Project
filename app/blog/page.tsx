'use client'

import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  author: string
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    // Mock blog posts - in production these would come from a database
    setPosts([
      {
        id: '1',
        title: 'How to Save Money on International Transfers',
        excerpt: 'Learn the top strategies to reduce costs when sending money abroad.',
        date: '2025-11-15',
        author: 'John Doe'
      },
      {
        id: '2',
        title: 'Currency Exchange Tips for Travelers',
        excerpt: 'Get the best exchange rates while traveling internationally.',
        date: '2025-11-12',
        author: 'Jane Smith'
      },
      {
        id: '3',
        title: 'Understanding Currency Markets',
        excerpt: 'A beginner\'s guide to currency movements and forex basics.',
        date: '2025-11-10',
        author: 'Mike Johnson'
      }
    ])
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Currency Blog</h1>
            <p className="text-xl text-muted-foreground">Tips, insights, and news about international money transfer.</p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-card border border-border rounded-xl p-8 hover:border-primary transition">
                  <h2 className="text-2xl font-bold mb-3 hover:text-primary transition">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>By {post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <Link href={`/blog/${post.id}`} className="inline-block mt-4 text-primary hover:text-accent font-semibold transition">
                    Read More →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

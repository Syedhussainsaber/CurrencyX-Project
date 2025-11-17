'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

export interface BlogSummary {
  _id: string
  title: string
  excerpt: string
  slug: string
  coverImage?: string
  author: string
  tags?: string[]
  publishedAt?: string
  createdAt: string
}

interface BlogExplorerProps {
  posts: BlogSummary[]
}

const defaultCategories = ['All', 'Announcements', 'Product', 'Markets', 'Compliance', 'Stories']

export const BlogExplorer = ({ posts }: BlogExplorerProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [query, setQuery] = useState('')

  const computedCategories = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach((post) => post.tags?.forEach((tag) => tagSet.add(tag)))
    return ['All', ...Array.from(tagSet), ...defaultCategories.filter((tag) => !tagSet.has(tag))]
  }, [posts])

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' || post.tags?.map((tag) => tag.toLowerCase()).includes(selectedCategory.toLowerCase())
      const matchesQuery =
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [posts, query, selectedCategory])

  if (!posts.length) {
    return (
      <div className="text-center py-12 border border-dashed rounded-2xl">
        <p className="font-semibold mb-2">No articles published yet</p>
        <p className="text-muted-foreground text-sm">Sign in to the admin dashboard to publish your first story.</p>
      </div>
    )
  }

  const [featured, ...rest] = filtered.length ? filtered : posts

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-3 flex-wrap">
          {computedCategories.slice(0, 6).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <Input
          placeholder="Search insights..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full md:w-64"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {featured && (
          <article className="rounded-3xl border border-border bg-card overflow-hidden grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr]">
            <div className="p-8 space-y-4">
              <Badge className="bg-secondary text-secondary-foreground w-fit">Featured</Badge>
              <h2 className="text-3xl font-semibold">{featured.title}</h2>
              <p className="text-muted-foreground">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{featured.author}</span>
                <span>•</span>
                <span>{formatDate(featured.publishedAt || featured.createdAt)}</span>
              </div>
              <Link href={`/blog/${featured.slug}`} className="inline-flex items-center gap-2 font-semibold text-primary">
                Read article
                <span>↗</span>
              </Link>
            </div>
            <div className="relative min-h-[240px]">
              {featured.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30" />
              )}
            </div>
          </article>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rest.map((post) => (
            <article key={post._id} className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary">
                  {formatDate(post.publishedAt || post.createdAt)}
                </div>
                <Link href={`/blog/${post.slug}`} className="text-xl font-semibold hover:text-primary transition">
                  {post.title}
                </Link>
                <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{post.author}</span>
                <div className="flex gap-2 flex-wrap">
                  {post.tags?.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}


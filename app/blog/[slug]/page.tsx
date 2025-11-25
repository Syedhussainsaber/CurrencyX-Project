import Header from '@/components/common/header'
import Footer from '@/components/common/footer'
import { getBlogBySlug } from '@/lib/blog'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogBySlug(slug)
  if (!post) {
    return { title: 'Post not found — PayIn Global Blog' }
  }

  return {
    title: `${post.title} — PayIn Global Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `https://payinglobal.com/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImage ? [{ url: post.coverImage }] : undefined
    }
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params
  const post = await getBlogBySlug(slug)
  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-to-b from-muted/40 to-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Insights</p>
            <h1 className="text-4xl md:text-5xl font-semibold mt-4">{post.title}</h1>
            <div className="mt-4 text-sm text-muted-foreground flex flex-wrap gap-4">
              <span>{post.author?.fullName ?? 'Admin'}</span>
              <span>•</span>
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>
            {post.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.coverImage}
                alt={post.title}
                className="mt-8 rounded-3xl border border-border object-cover max-h-[460px] w-full"
              />
            )}
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="prose prose-lg max-w-none dark:prose-invert">
              {post.content.split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

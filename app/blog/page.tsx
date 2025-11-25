import Header from '@/components/common/header'
import Footer from '@/components/common/footer'
import { BlogExplorer } from '@/components/blog/blog-explorer'
import { getPublishedBlogs } from '@/lib/blog'

export const metadata = {
  title: 'PayIn Global Blog — FX Research & Platform Updates',
  description: 'Read thought leadership on currency markets, compliance, and platform releases from the PayIn Global team.'
}

export const revalidate = 60

export default async function Blog() {
  const posts = await getPublishedBlogs(24)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-white to-muted/30">
        <section className="py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Knowledge base</p>
            <h1 className="text-4xl md:text-5xl font-semibold">Navigate global currencies with expert intel</h1>
            <p className="text-lg text-muted-foreground">
              Weekly FX signals, product launches, and compliance guidance curated by PayIn Global researchers.
            </p>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <BlogExplorer
              posts={posts.map((post) => ({
                _id: post.id,
                title: post.title,
                excerpt: post.excerpt,
                slug: post.slug,
                coverImage: post.coverImage ?? undefined,
                author: post.author?.fullName ?? 'Admin',
                tags: post.tags,
                publishedAt: post.publishedAt?.toISOString(),
                createdAt: post.createdAt.toISOString()
              }))}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

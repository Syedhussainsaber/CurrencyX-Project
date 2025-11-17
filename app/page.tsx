import Header from '@/components/header'
import Footer from '@/components/footer'
import CurrencyConverter from '@/components/currency-converter'
import { getSiteSettings } from '@/lib/site'
import { getPublishedBlogs } from '@/lib/blog'
import { Globe, Lock, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 60

export const metadata = {
  title: 'Global CurrencyX — Real-Time Currency Converter & FX Intelligence',
  description:
    'Convert any currency in real-time, monitor multi-country FX rates, read expert insights, and manage your brand with Global CurrencyX.',
  alternates: {
    canonical: 'https://currencyx.com'
  }
}

const steps = [
  {
    title: 'Create your secure profile',
    detail: 'KYC-backed onboarding with biometric security.'
  },
  {
    title: 'Pick currencies & send instantly',
    detail: '300+ corridors with transparent FX spreads.'
  },
  {
    title: 'Track & reconcile in real-time',
    detail: 'Live notifications, smart alerts, and automated compliance.'
  }
]

const whyUs = [
  {
    title: 'Live interbank rates',
    detail: 'Direct connections to tier-1 liquidity pools with <0.25% spread.',
    icon: TrendingUp
  },
  {
    title: 'Global coverage',
    detail: 'Support for every ISO-4217 currency and local payout rails in 150+ countries.',
    icon: Globe
  },
  {
    title: 'Enterprise security',
    detail: 'Zero-trust infrastructure, SOC2 controls, and audited smart routing.',
    icon: Lock
  }
]

const testimonials = [
  {
    name: 'Keisha Adeyemi',
    role: 'FinOps Lead, Remitly Africa',
    text: 'CurrencyX reduced our payout latency from 2 days to 12 minutes. The admin dashboard gives crystal clear visibility across markets.'
  },
  {
    name: 'Marco Silva',
    role: 'Founder, Atlas Payments',
    text: 'The converter widget and blog CMS let our marketing team ship campaigns without engineering support.'
  },
  {
    name: 'Sofia Kramer',
    role: 'VP Finance, AeroLogistics',
    text: 'We trust CurrencyX for treasury hedging because of their live pricing, audit logs, and automated alerts.'
  }
]

export default async function Home() {
  const settings = await getSiteSettings()
  const blogs = await getPublishedBlogs(3)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: settings.brandName,
    description: settings.metaDescription,
    url: 'https://currencyx.com',
    telephone: settings.supportPhone,
    email: settings.supportEmail,
    areaServed: 'Worldwide',
    currenciesAccepted: 'ALL',
    priceRange: '$$'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F4FFF9] via-white to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden py-16 md:py-28">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 bg-accent/20 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 blur-3xl rounded-full" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Real-time currency fabric
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-balance leading-tight">
                  {settings.heroHeadline}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">{settings.heroSubheadline}</p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Currencies tracked', value: '180+' },
                    { label: 'Avg settlement speed', value: '8 min' },
                    { label: 'SLA uptime', value: '99.995%' },
                    { label: 'Banks connected', value: '42' }
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
                      <p className="text-2xl font-semibold text-primary">{stat.value}</p>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/signup"
                    className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:scale-[1.01] transition"
                  >
                    Launch Converter
                  </Link>
                  <Link
                    href="/features"
                    className="px-8 py-3 rounded-full border border-primary text-primary font-semibold hover:bg-primary/10 transition"
                  >
                    Explore Platform
                  </Link>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-primary to-secondary"
                      />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold">Trusted by 75k+ growth teams</p>
                    <p className="text-xs text-muted-foreground">From fintech scale-ups to Fortune 500 treasury ops</p>
                  </div>
                </div>
              </div>

              <div id="converter" className="relative">
                <div className="absolute -inset-6 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl rounded-3xl" />
                <div className="relative">
                  <CurrencyConverter />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={step.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <span className="absolute -top-5 left-6 text-6xl font-black text-primary/10">{index + 1}</span>
                  <div className="relative">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Enterprise-grade</p>
              <h2 className="text-3xl md:text-4xl font-semibold mt-3">Why choose Global CurrencyX?</h2>
              <p className="text-muted-foreground mt-3">
                Reliability, accuracy, and narrative-driven insights for your treasury, product, and marketing teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {whyUs.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:-translate-y-1 transition">
                  <item.icon className="text-primary" size={32} />
                  <h3 className="text-lg font-semibold mt-4">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-primary">Insights hub</p>
                <h2 className="text-3xl font-semibold mt-2">Latest from the CurrencyX blog</h2>
                <p className="text-muted-foreground mt-2">
                  Research-backed stories and regulatory updates curated by our FX desk.
                </p>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-semibold">
                Browse all posts
                <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.length === 0
                ? Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="rounded-2xl border border-dashed border-border p-6">
                      <Sparkles className="text-primary" />
                      <p className="text-muted-foreground mt-4">Publish your first blog post to see it here.</p>
                    </div>
                  ))
                : blogs.map((blog) => (
                    <article key={blog._id} className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
                      <div className="p-6 flex-1 space-y-3">
                        <p className="text-xs uppercase tracking-[0.25em] text-primary">
                          {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                        </p>
                        <h3 className="text-xl font-semibold leading-snug">{blog.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-3">{blog.excerpt}</p>
                      </div>
                      <div className="p-6 pt-0">
                        <Link href={`/blog/${blog.slug}`} className="inline-flex items-center gap-2 text-primary font-bold">
                          Read article
                          <span>↗</span>
                        </Link>
                      </div>
                    </article>
                  ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-secondary text-secondary-foreground">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="bg-white/10 rounded-2xl p-6 shadow-lg border border-white/20">
                  <p className="text-base leading-relaxed">{testimonial.text}</p>
                  <div className="mt-6">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm opacity-80">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Launch in days</p>
            <h2 className="text-3xl md:text-4xl font-semibold mt-4">
              Ready to deploy a real-time converter, blog, and admin console?
            </h2>
            <p className="text-muted-foreground mt-4">
              Deploy to Vercel, connect MongoDB Atlas, and invite your team. Your brand, colors, and metadata are configurable from the dashboard.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/signup" className="px-10 py-3 rounded-full bg-primary text-primary-foreground font-semibold">
                Create free account
              </Link>
              <Link href="/about" className="px-10 py-3 rounded-full border border-primary text-primary font-semibold">
                Learn about us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

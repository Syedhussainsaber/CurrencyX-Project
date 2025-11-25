import Header from '@/components/common/header'
import Footer from '@/components/common/footer'
import { Shield, Zap, Globe, Layers, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Real-time updates',
    detail: 'Stream rates every few minutes using provider caching and automated refresh windows.'
  },
  {
    icon: Shield,
    title: 'Accurate data',
    detail: 'Backed by FastForex/OpenExchange integrations, persisted in MongoDB, and validated on access.'
  },
  {
    icon: Globe,
    title: 'Multi-currency support',
    detail: 'Every ISO-4217 currency is searchable with flags, names, and conversion metadata.'
  },
  {
    icon: Layers,
    title: 'Secure & fast',
    detail: 'Edge middleware, JWT auth, hashed credentials, and Cloudinary uploads keep the stack production-ready.'
  },
  {
    icon: BarChart3,
    title: 'Global coverage',
    detail: 'Admin dashboard insights highlight rate pulls, contact funnels, and publishing cadence.'
  }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Feature set</p>
            <h1 className="text-4xl md:text-5xl font-semibold">Everything you need to ship currency experiences</h1>
            <p className="text-muted-foreground">
              From rate fetching to CMS publishing to admin controls, PayIn Global is an end-to-end Next.js stack.
            </p>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-3">
                <feature.icon className="text-primary" size={28} />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}


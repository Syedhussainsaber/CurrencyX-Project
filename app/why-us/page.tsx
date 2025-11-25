import Header from '@/components/common/header'
import Footer from '@/components/common/footer'
import { ShieldCheck, Gauge, Sparkles, LineChart } from 'lucide-react'

const reasons = [
  { title: 'Reliability', description: 'Mongo-backed caching + rate fallbacks guarantee responses even if providers fail.', icon: ShieldCheck },
  {
    title: 'Accuracy',
    description: 'Rates are normalized, stored with timestamps, and surfaced with context (provider, updated time).',
    icon: LineChart
  },
  {
    title: 'Ease of use',
    description: 'React Hook Form, Zod, and shadcn UI accelerate form UX while keeping validation tight.',
    icon: Sparkles
  },
  { title: 'Performance', description: 'Next.js App Router, streaming, and edge middleware keep everything snappy.', icon: Gauge }
]

export default function WhyUsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 gradient-primary text-white text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
            <p className="text-xs uppercase tracking-[0.3em]">Why choose us</p>
            <h1 className="text-4xl md:text-5xl font-semibold">Reliable currency infrastructure out of the box</h1>
            <p className="text-white/80">
              Build trust with compliant authentication, resilient rate caching, and editorial workflows.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {reasons.map((reason) => (
              <div key={reason.title} className="bg-card border border-border rounded-2xl p-6 space-y-3">
                <reason.icon className="text-primary" size={32} />
                <h3 className="text-xl font-semibold">{reason.title}</h3>
                <p className="text-muted-foreground">{reason.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}


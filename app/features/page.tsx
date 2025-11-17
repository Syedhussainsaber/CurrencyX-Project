import Header from '@/components/header'
import Footer from '@/components/footer'
import { AlertCircle, TrendingUp, Shield, MessageSquare } from 'lucide-react'

export default function Features() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features</h1>
            <p className="text-xl text-muted-foreground">Everything you need for international money transfers.</p>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {[
              {
                icon: TrendingUp,
                title: 'Real-Time Exchange Rates',
                desc: 'Always get the best rates with our live currency converter. No surprises, no hidden markups.'
              },
              {
                icon: AlertCircle,
                title: 'Rate Alerts',
                desc: 'Get notified when your target currency reaches your desired rate.'
              },
              {
                icon: Shield,
                title: 'Bank-Level Security',
                desc: 'Your money is protected with 256-bit encryption and regulatory compliance.'
              },
              {
                icon: MessageSquare,
                title: '24/7 Customer Support',
                desc: 'Our expert team is always available to help you with any questions.'
              }
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="flex gap-8 items-start">
                  <Icon size={40} className="text-primary flex-shrink-0 mt-2" />
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-lg">{feature.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

import Header from '@/components/header'
import Footer from '@/components/footer'
import { Award, Globe, Users, Zap } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About CurrencyX</h1>
            <p className="text-xl text-muted-foreground">Making international money transfer faster, easier, and more affordable for everyone.</p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground mb-4">We believe international money transfer should be simple, fast, and affordable. Our mission is to remove the barriers to cross-border payments and empower people to send money to their loved ones around the world.</p>
                <p className="text-muted-foreground">With CurrencyX, you get competitive rates, transparent pricing, and 24/7 support whenever you need us.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-8">
                <div className="space-y-6">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">10M+</div>
                    <p className="text-muted-foreground">Users Worldwide</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">$50B+</div>
                    <p className="text-muted-foreground">Transferred Annually</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">150+</div>
                    <p className="text-muted-foreground">Countries Supported</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 bg-card border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Core Values</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Globe, title: 'Global', desc: 'Connecting people across borders' },
                { icon: Zap, title: 'Fast', desc: 'Speed matters in finance' },
                { icon: Award, title: 'Reliable', desc: 'Trust is everything' },
                { icon: Users, title: 'Customer-First', desc: 'Your success is our success' }
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="text-center">
                    <Icon size={40} className="text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

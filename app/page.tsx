import Header from '@/components/header'
import Footer from '@/components/footer'
import CurrencyConverter from '@/components/currency-converter'
import { CheckCircle2, TrendingUp, Lock, Zap, Globe, Users } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'CurrencyX - International Money Transfer | Competitive Rates',
  description: 'Fast, secure money transfers to 150+ countries. Best exchange rates, no hidden fees, 24/7 support.',
  alternates: {
    canonical: 'https://currencyx.com'
  }
}

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: 'CurrencyX',
    description: 'International money transfer service with competitive exchange rates',
    url: 'https://currencyx.com',
    telephone: '+1-800-123-4567',
    email: 'support@currencyx.com',
    serviceType: 'MoneyTransfer',
    areaServed: 'Worldwide',
    priceRange: '$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '2500'
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
                International <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-primary via-[oklch(0.65_0.25_18)] to-[oklch(0.7_0.22_25)] bg-clip-text text-transparent">Currency Transfer</span> <br className="hidden sm:block" />
                Provider
              </h1>

              <p className="text-lg text-muted-foreground mb-6">Send money worldwide with competitive rates, zero hidden fees, and 24/7 support.</p>

              {/* Features List */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-primary flex-shrink-0" />
                  <span className="text-sm">Great exchange rates</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-primary flex-shrink-0" />
                  <span className="text-sm">No hidden fees</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-primary flex-shrink-0" />
                  <span className="text-sm">24/7 Transfers</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-primary flex-shrink-0" />
                  <span className="text-sm">5-star customer rating</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-primary flex-shrink-0" />
                  <span className="text-sm">Award-winning service</span>
                </div>
              </div>

              <Link href="#converter" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition">
                <span>Get Started</span>
              </Link>
            </div>

            {/* Right - Currency Converter */}
            <div id="converter" className="flex justify-center md:justify-end">
              <CurrencyConverter />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How Money Transfer Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Simple, secure, and transparent. Three steps to send money anywhere in the world.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up in seconds with your email and basic information.' },
              { step: '02', title: 'Send Funds', desc: 'Enter recipient details and the amount you want to transfer.' },
              { step: '03', title: 'Track Transfer', desc: 'Monitor your transfer in real-time with live notifications.' }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-bold text-primary opacity-20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Choose CurrencyX</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Experience the best in international money transfer with our premium services.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: TrendingUp, title: 'Bank-Beating Rates', desc: 'We are fast' },
              { icon: Zap, title: 'Instant Transfers', desc: 'Money arrives in minutes' },
              { icon: Lock, title: 'Secure & Safe', desc: 'Bank-level security for your money' },
              { icon: Globe, title: '150+ Countries', desc: 'Send to virtually anywhere' },
              { icon: Users, title: 'Expert Support', desc: '24/7 customer service team' },
              { icon: CheckCircle2, title: 'Easy to Use', desc: 'Simple interface for everyone' }
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="bg-card border border-border rounded-xl p-6 hover:border-primary transition">
                  <Icon size={32} className="text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Send Money?</h2>
          <p className="text-lg opacity-90 mb-8">Join millions of users who trust CurrencyX for international transfers.</p>
          <Link href="/signup" className="inline-flex px-8 py-3 bg-white text-primary rounded-full font-semibold hover:opacity-90 transition">
            Get Started Today
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

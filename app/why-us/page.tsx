import Header from '@/components/header'
import Footer from '@/components/footer'
import { CheckCircle2, Star, Lock, Clock } from 'lucide-react'

export default function WhyUs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 gradient-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Why Choose CurrencyX?</h1>
            <p className="text-xl opacity-90">The best choice for international money transfers.</p>
          </div>
        </section>

        {/* Reasons */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: CheckCircle2,
                  title: 'Best Exchange Rates',
                  desc: 'Our rates are consistently 3-5% better than banks.'
                },
                {
                  icon: Lock,
                  title: 'Maximum Security',
                  desc: 'Bank-level encryption and compliance with all regulations.'
                },
                {
                  icon: Clock,
                  title: 'Fast Transfers',
                  desc: 'Money arrives within minutes, not days.'
                },
                {
                  icon: Star,
                  title: '5-Star Reviews',
                  desc: 'Trusted by millions with an average rating of 4.8 stars.'
                }
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="bg-card border border-border rounded-xl p-8">
                    <Icon size={40} className="text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 md:py-24 bg-card border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How We Compare</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold">CurrencyX</th>
                    <th className="text-center py-4 px-4 font-semibold">Banks</th>
                    <th className="text-center py-4 px-4 font-semibold">Competitors</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Exchange Rates', currencyx: 'Best', banks: 'Poor', competitors: 'Good' },
                    { feature: 'Transfer Speed', currencyx: 'Minutes', banks: 'Days', competitors: 'Hours' },
                    { feature: 'Fees', currencyx: 'Low', banks: 'High', competitors: 'Medium' },
                    { feature: '24/7 Support', currencyx: '✓', banks: 'Limited', competitors: 'Limited' },
                    { feature: 'Mobile App', currencyx: '✓', banks: '✓', competitors: '✓' }
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="py-4 px-4 font-medium">{row.feature}</td>
                      <td className="py-4 px-4 text-center text-primary font-semibold">{row.currencyx}</td>
                      <td className="py-4 px-4 text-center text-muted-foreground">{row.banks}</td>
                      <td className="py-4 px-4 text-center text-muted-foreground">{row.competitors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

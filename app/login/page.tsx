import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-card border border-border rounded-xl p-8">
            <h1 className="text-2xl font-bold mb-2">Log In</h1>
            <p className="text-muted-foreground mb-6">Sign in to your CurrencyX account.</p>

            <form className="space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button className="w-full py-3 bg-gradient-to-r from-primary via-[oklch(0.65_0.25_18)] to-[oklch(0.7_0.22_25)] text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition">
                Log In
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign Up</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

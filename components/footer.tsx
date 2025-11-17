import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CurrencyX</span>
            </h3>
            <p className="text-sm text-muted-foreground">International money transfer made simple, fast, and secure.</p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition">About Us</Link></li>
              <li><Link href="/features" className="text-muted-foreground hover:text-foreground transition">Features</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground transition">Blog</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition">FAQ</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition">Terms & Conditions</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground transition">Security</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <a href="mailto:info@currencyx.com" className="text-muted-foreground hover:text-foreground transition">info@currencyx.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span className="text-muted-foreground">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-primary mt-0.5" />
                <span className="text-muted-foreground">123 Finance St, New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2025 CurrencyX. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

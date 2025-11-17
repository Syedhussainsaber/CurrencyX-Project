'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useSiteSettings } from '@/components/site-settings-provider'
import { cn } from '@/lib/utils'

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/features', label: 'Features' },
  { href: '/why-us', label: 'Why Us' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' }
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const settings = useSiteSettings()

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold text-lg text-foreground">
          {settings.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logoUrl} alt={settings.brandName} className="h-8 w-auto" />
          ) : (
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {settings.brandName}
            </span>
          )}
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-primary transition">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition">
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition"
          >
            Sign Up
          </Link>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-4">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="block text-sm text-muted-foreground hover:text-primary transition">
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-border/60">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition">
                Login
              </Link>
              <Link
                href="/signup"
                className={cn(
                  'block px-6 py-2 rounded-full text-sm font-semibold text-center',
                  'bg-primary text-primary-foreground'
                )}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}


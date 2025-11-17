'use client'

import Link from 'next/link'
import { Facebook, Linkedin, Twitter, Instagram } from 'lucide-react'
import { useSiteSettings } from '@/components/site-settings-provider'

const socials = [
  { icon: Twitter, key: 'twitter' as const },
  { icon: Linkedin, key: 'linkedin' as const },
  { icon: Facebook, key: 'facebook' as const },
  { icon: Instagram, key: 'instagram' as const }
]

export default function Footer() {
  const settings = useSiteSettings()

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <p className="text-lg font-semibold">{settings.brandName}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {settings.metaDescription}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/about">About</Link>
              <Link href="/features">Features</Link>
              <Link href="/why-us">Why Us</Link>
              <Link href="/blog">Blog</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href={`mailto:${settings.supportEmail}`}>{settings.supportEmail}</a>
              <a href={`tel:${settings.supportPhone}`}>{settings.supportPhone}</a>
              <p>{settings.address}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Social</h4>
            <div className="flex gap-4">
              {socials.map(({ icon: Icon, key }) => {
                const href = settings.social?.[key]
                if (!href) return null
                return (
                  <a key={key} href={href} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition">
                    <Icon size={20} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row md:items-center md:justify-between text-sm text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} {settings.brandName}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}


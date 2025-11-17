'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-2xl">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CurrencyX</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm hover:text-primary transition">Home</Link>
          <Link href="/about" className="text-sm hover:text-primary transition">About Us</Link>
          <Link href="/features" className="text-sm hover:text-primary transition">Features</Link>
          <Link href="/why-us" className="text-sm hover:text-primary transition">Why Choose Us</Link>
          <Link href="/blog" className="text-sm hover:text-primary transition">Blog</Link>
          <Link href="/contact" className="text-sm hover:text-primary transition">Contact</Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm hover:text-primary transition">Login</Link>
          <Link href="/signup" className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition">Sign Up</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-4">
            <Link href="/" className="block text-sm hover:text-primary transition">Home</Link>
            <Link href="/about" className="block text-sm hover:text-primary transition">About Us</Link>
            <Link href="/features" className="block text-sm hover:text-primary transition">Features</Link>
            <Link href="/why-us" className="block text-sm hover:text-primary transition">Why Choose Us</Link>
            <Link href="/blog" className="block text-sm hover:text-primary transition">Blog</Link>
            <Link href="/contact" className="block text-sm hover:text-primary transition">Contact</Link>
            <Link href="/login" className="block text-sm hover:text-primary transition">Login</Link>
            <Link href="/signup" className="block px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium">Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  )
}

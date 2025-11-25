'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Menu, X, Home, FileText, BarChart3, Settings, Mail } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { 
        method: 'POST',
        credentials: 'include'
      })
      toast.success('Logged out successfully')
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('[admin] Logout error:', error)
      toast.error('Failed to logout. Please try again.')
      // Still redirect even if API call fails
      router.push('/admin/login')
      router.refresh()
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-card border-r border-border transition-all duration-300 hidden md:block`}>
        <div className="p-4 border-b border-border">
          <Link href="/admin/dashboard" className="font-bold text-xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {sidebarOpen ? 'PayIn Global' : 'PG'}
            </span>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
            { href: '/admin/blog', icon: FileText, label: 'Blog' },
            { href: '/admin/contact-submissions', icon: Mail, label: 'Contact' },
            { href: '/admin/transfers', icon: BarChart3, label: 'Transfers' },
            { href: '/admin/settings', icon: Settings, label: 'Settings' }
          ].map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 hover:bg-primary/10 rounded-lg transition text-foreground hover:text-primary"
              >
                <Icon size={20} />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-card border-b border-border p-4 flex items-center justify-between md:justify-end">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted rounded-lg transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

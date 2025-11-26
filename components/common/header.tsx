'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from 'next-themes'
import {
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Sun,
  Moon
} from 'lucide-react'

import { useSiteSettings } from '@/components/site-settings-provider'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/features', label: 'Features' },
  { href: '/why-us', label: 'Why Us' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' }
]

// User dashboard/profile pages can be added later if needed
// const userShortcuts = [
//   { href: '/profile', label: 'Profile', icon: IdCard },
//   { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }
// ]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const settings = useSiteSettings()
  const { user, status, logout } = useAuth()
  const loading = status === 'loading'
  const { resolvedTheme, setTheme } = useTheme()
  const applyTheme = (v?: string) => {
    if (!v) return
    const root = document.documentElement
    root.classList.add('theme-transition')
    setTheme(v)
    window.setTimeout(() => root.classList.remove('theme-transition'), 300)
  }

  const handleMobileToggle = () => setIsOpen((prev) => !prev)
  const closeMobileMenu = () => setIsOpen(false)

  const handleLogout = async () => {
    await logout({ redirectTo: '/' })
    closeMobileMenu()
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-3 font-semibold text-lg text-foreground"
          aria-label={`${settings.brandName} home`}
        >
        <Image src="/main-logo.png" alt="PayIn Global logo" width={110} height={80} /> 
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-primary transition"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={resolvedTheme === 'dark' ? 'dark' : 'light'}
              onValueChange={(v) => applyTheme(v as string)}
              variant="outline"
              size="sm"
            >
              <ToggleGroupItem value="light" aria-label="Light mode">
                <Sun className="size-4" />
                Light
              </ToggleGroupItem>
              <ToggleGroupItem value="dark" aria-label="Dark mode">
                <Moon className="size-4" />
                Dark
              </ToggleGroupItem>
            </ToggleGroup>
            {/* <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {resolvedTheme === 'dark' ? 'Dark' : 'Light'}
            </span> */}
          </div>
          
          {loading ? (
            <div className="w-24 h-9 bg-muted animate-pulse rounded" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <UserIcon size={16} />
                  <span className="max-w-[140px] truncate">{user.fullName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm">
                  <div className="font-medium">{user.fullName}</div>
                  <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut size={14} className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition">
                Login
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:opacity-90 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button onClick={handleMobileToggle} className="md:hidden p-2" aria-label="Toggle navigation">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm text-muted-foreground hover:text-primary transition"
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex flex-col gap-3 pt-4 border-t border-border/60">
              <div className="flex items-center gap-2">
                <ToggleGroup
                  type="single"
                  value={resolvedTheme === 'dark' ? 'dark' : 'light'}
                  onValueChange={(v) => applyTheme(v as string)}
                  variant="outline"
                  size="sm"
                >
                  <ToggleGroupItem value="light" aria-label="Light mode">
                    <Sun className="size-4" />
                    Light
                  </ToggleGroupItem>
                  <ToggleGroupItem value="dark" aria-label="Dark mode">
                    <Moon className="size-4" />
                    Dark
                  </ToggleGroupItem>
                </ToggleGroup>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {resolvedTheme === 'dark' ? 'Dark' : 'Light'}
                </span>
              </div>
              {loading ? (
                <div className="h-9 bg-muted animate-pulse rounded" />
              ) : user ? (
                <>
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full justify-start text-destructive"
                  >
                    <LogOut size={14} className="mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-muted-foreground hover:text-primary transition"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className={cn(
                      'block px-6 py-2 rounded-full text-sm font-semibold text-center',
                      'bg-primary text-primary-foreground'
                    )}
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}



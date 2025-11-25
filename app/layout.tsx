import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { getSiteSettings } from '@/lib/site'
import { SiteSettingsProvider } from '@/components/site-settings-provider'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'PayIn Global — Real-Time Currency Converter & Insights',
  description:
    'Operate a production-ready currency experience with converter, blog, admin console, and SEO-ready pages powered by PayIn Global.',
  keywords: 'currency converter, forex api, exchange rates, remittance dashboard, admin cms',
  authors: [{ name: 'PayIn Global' }],
  creator: 'PayIn Global',
  publisher: 'PayIn Global',
  openGraph: {
    title: 'PayIn Global — Real-Time Currency Converter & Insights',
    description: 'Launch live FX widgets, publish blogs, and manage data from one dashboard.',
    url: 'https://payinglobal.com',
    siteName: 'PayIn Global',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PayIn Global — Real-Time FX Stack',
    description: 'Live FX rates, CMS, and admin tools for global teams.'
  },
  alternates: { canonical: 'https://payinglobal.com' }
}

export const viewport = {
  themeColor: '#25D366',
  colorScheme: 'light dark'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSiteSettings()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content={settings.primaryColor} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        {settings.faviconUrl && <link rel="icon" href={settings.faviconUrl} />}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteSettingsProvider settings={settings}>
            {children}
            <Toaster />
            <Analytics />
          </SiteSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'CurrencyX - Fast International Money Transfer | Best Exchange Rates',
  description: 'Send money worldwide with CurrencyX. Get competitive exchange rates, no hidden fees, 24/7 support. Transfer to 150+ countries instantly.',
  keywords: 'international money transfer, currency exchange, forex, send money abroad, international payments, remittance service',
  authors: [{ name: 'CurrencyX' }],
  creator: 'CurrencyX',
  publisher: 'CurrencyX',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  openGraph: {
    title: 'CurrencyX - Fast International Money Transfer',
    description: 'Send money worldwide with competitive rates, no hidden fees, 24/7 support.',
    url: 'https://currencyx.com',
    siteName: 'CurrencyX',
    images: [
      {
        url: 'https://currencyx.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CurrencyX - International Money Transfer'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CurrencyX - Fast International Money Transfer',
    description: 'Send money worldwide with the best exchange rates',
    creator: '@currencyx',
    images: ['https://currencyx.com/og-image.png']
  },
  alternates: {
    canonical: 'https://currencyx.com'
  },
  verification: {
    google: 'your-google-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code'
    }
  },
    generator: 'v0.app'
}

export const viewport = {
  themeColor: 'oklch(0.6 0.22 15)',
  colorScheme: 'light dark'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#9B4DCA" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

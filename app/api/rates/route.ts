import { NextRequest, NextResponse } from 'next/server'
import { getRates } from '@/lib/currency'
import { currencies } from '@/data/currencies'
import { getServerEnv } from '@/lib/env'

export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const env = getServerEnv()
    const { searchParams } = new URL(request.url)
    const base = (searchParams.get('base') || env.CURRENCY_API_DEFAULT_BASE || 'USD').toUpperCase()

    const rates = await getRates(base)

    return NextResponse.json({
      ...rates,
      supportedCurrencies: currencies,
      timestamp: rates.fetchedAt
    })
  } catch (error) {
    console.error('[api] rates error', error)
    // Even if there's an error, try to get fallback rates
    try {
      const base = (new URL(request.url).searchParams.get('base') || 'USD').toUpperCase()
      const fallbackRates = await getRates(base)
      return NextResponse.json({
        ...fallbackRates,
        supportedCurrencies: currencies,
        timestamp: fallbackRates.fetchedAt,
        warning: 'Using fallback rates due to service interruption'
      })
    } catch (fallbackError) {
      // Last resort: return a basic response with error info
      console.error('[api] fallback rates also failed', fallbackError)
      return NextResponse.json(
        { 
          message: 'Service temporarily unavailable',
          error: 'Unable to fetch currency rates at this time. Please try again later.',
          base: 'USD',
          rates: {},
          supportedCurrencies: currencies,
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      )
    }
  }
}

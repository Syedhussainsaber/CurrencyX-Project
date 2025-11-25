import NodeCache from 'node-cache'
import { getServerEnv } from './env'
import prisma from '@/lib/prisma'

const memoryCache = new NodeCache({ stdTTL: 60 * 5 }) // 5 minutes

export interface CurrencyRatesPayload {
  base: string
  rates: Record<string, number>
  fetchedAt: string
  provider: string
}

const normalizeRates = (rates: Record<string, number>) => {
  const normalized: Record<string, number> = {}
  Object.entries(rates).forEach(([key, value]) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
      normalized[key.toUpperCase()] = value
    }
  })
  return normalized
}

// Try free exchangerate-api.io first (no API key required)
const fetchFromFreeAPI = async (base: string): Promise<CurrencyRatesPayload | null> => {
  try {
    const url = `https://open.er-api.com/v6/latest/${base}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout

    const response = await fetch(url, {
      cache: 'no-store',
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const rates = normalizeRates(data?.rates || {})

    if (!Object.keys(rates).length) {
      return null
    }

    return {
      base: base.toUpperCase(),
      rates,
      fetchedAt: new Date().toISOString(),
      provider: 'exchangerate-api'
    }
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.warn('[currency] Free API error:', error instanceof Error ? error.message : String(error))
    }
    return null
  }
}

const fetchFromRemote = async (base: string): Promise<CurrencyRatesPayload | null> => {
  const env = getServerEnv()

  // First, try free API (exchangerate-api.io)
  const freeRates = await fetchFromFreeAPI(base)
  if (freeRates) {
    return freeRates
  }

  // Fall back to configured API if key is provided
  if (!env.CURRENCY_API_KEY) {
    console.warn('[currency] CURRENCY_API_KEY missing, free API failed, cannot fetch remote rates')
    return null
  }

  try {
    const url = new URL(env.CURRENCY_API_BASE_URL)
    url.searchParams.set('from', base)
    url.searchParams.set('api_key', env.CURRENCY_API_KEY)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const response = await fetch(url.toString(), {
      cache: 'no-store',
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[currency] Configured API error:', errorText)
      return null
    }

    const data = await response.json()
    const rates = normalizeRates(data?.results || data?.rates || {})

    if (!Object.keys(rates).length) {
      console.error('[currency] Configured API returned empty rates payload')
      return null
    }

    return {
      base: base.toUpperCase(),
      rates,
      fetchedAt: new Date().toISOString(),
      provider: data?.provider || 'fastforex'
    }
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      console.error('[currency] Configured API fetch error:', error instanceof Error ? error.message : String(error))
    }
    return null
  }
}

// Mock rates fallback when API/database is unavailable
// Uses realistic base rates for major currencies, then generates cross-rates
const getMockRates = (base: string): CurrencyRatesPayload => {
  // Base rates against USD (realistic approximations)
  const usdRates: Record<string, number> = {
    EUR: 0.92, GBP: 0.79, JPY: 149.5, CAD: 1.36, AUD: 1.53, CHF: 0.88, CNY: 7.24,
    INR: 83.1, MXN: 17.2, NGN: 1500, ZAR: 18.5, AED: 3.67, SAR: 3.75, SGD: 1.35,
    HKD: 7.83, NZD: 1.65, SEK: 10.5, NOK: 10.8, DKK: 6.85, PLN: 4.02, THB: 35.5,
    IDR: 15600, PHP: 56.2, KRW: 1320, TRY: 32.5, BRL: 4.95, ARS: 850, CLP: 950,
    COP: 4100, PEN: 3.75, PKR: 278, BDT: 110, LKR: 325, VND: 24500, MYR: 4.68,
    TWD: 31.5, ILS: 3.65, EGP: 31.0, KES: 130, GHS: 12.5, ETB: 56.5, UGX: 3700,
    TZS: 2300, RWF: 1200, XOF: 600, XAF: 600, MAD: 10.0, TND: 3.1, DZD: 134,
    LBP: 15000, JOD: 0.71, KWD: 0.31, BHD: 0.38, OMR: 0.38, QAR: 3.64, ISK: 138,
    CZK: 22.8, HUF: 360, RON: 4.58, BGN: 1.80, HRK: 6.95, RSD: 108, BAM: 1.80,
    MKD: 56.5, ALL: 94.5, UAH: 36.5, BYN: 3.25, MDL: 18.0, GEL: 2.65, AMD: 400,
    AZN: 1.70, KZT: 450, UZS: 12300, KGS: 89.5, TJS: 10.9, TMT: 3.5, MNT: 3400,
    MOP: 8.05, BND: 1.35, KHR: 4100, LAK: 21000, MMK: 2100, NPR: 133,
    BTN: 83.1, AFN: 70.5, IQD: 1310, IRR: 42000, YER: 250, SYP: 13000, JMD: 155,
    BBD: 2.0, BZD: 2.0, XCD: 2.7, BSD: 1.0, BMD: 1.0, KYD: 0.83, AWG: 1.8,
    ANG: 1.8, SRD: 38.5, GYD: 209, TTD: 6.78, BOB: 6.91, PYG: 7300, UYU: 39.5,
    VES: 36.0, CRC: 520, GTQ: 7.85, HNL: 24.7, NIO: 36.8, PAB: 1.0, DOP: 56.5,
    HTG: 132, CUP: 24.0, XPF: 110, FJD: 2.25, PGK: 3.75, SBD: 8.4, VUV: 119,
    WST: 2.7, TOP: 2.35, SZL: 18.5, LSL: 18.5, BWP: 13.6, MWK: 1700, ZMW: 24.5,
    MZN: 64.0, AOA: 830, CDF: 2800, BIF: 2850, DJF: 178, ERN: 15.0,
    SOS: 570, SSP: 1300, SDG: 600, LYD: 4.85,
    MRU: 40.0, GNF: 8600, SLL: 22000, LRD: 190,
    CVE: 101, STN: 22.5, ZWL: 36000, XDR: 0.75, BTC: 0.000023, ETH: 0.00038
  }

  const baseUpper = base.toUpperCase()
  const allRates: Record<string, number> = {}

  // If base is USD, use rates directly
  if (baseUpper === 'USD') {
    Object.entries(usdRates).forEach(([code, rate]) => {
      allRates[code] = rate
    })
    allRates['USD'] = 1
  } else {
    // Get base currency rate against USD
    const baseToUsd = usdRates[baseUpper] || 1
    const usdToBase = baseToUsd > 0 ? 1 / baseToUsd : 1

    // Convert all USD rates to base currency rates
    Object.entries(usdRates).forEach(([code, usdRate]) => {
      if (code === baseUpper) {
        allRates[code] = 1
      } else {
        // Convert: base -> USD -> target
        allRates[code] = usdToBase * usdRate
      }
    })

    // Add USD rate
    allRates['USD'] = baseToUsd > 0 ? baseToUsd : 1
    allRates[baseUpper] = 1
  }

  return {
    base: baseUpper,
    rates: allRates,
    fetchedAt: new Date().toISOString(),
    provider: 'mock'
  }
}

export const getRates = async (baseCurrency: string): Promise<CurrencyRatesPayload> => {
  const base = baseCurrency.toUpperCase()
  const cacheKey = `rates:${base}`

  // Check memory cache first (performance optimization)
  const cached = memoryCache.get<CurrencyRatesPayload>(cacheKey)
  if (cached) {
    return cached
  }

  try {
    // Check database for existing rates
    const dbRecord = await prisma.rateCache.findUnique({
      where: { base }
    })

    // If we have valid rates in database, use them
    if (dbRecord && new Date(dbRecord.expiresAt) > new Date()) {
      const payload: CurrencyRatesPayload = {
        base,
        rates: dbRecord.rates as Record<string, number>,
        fetchedAt: dbRecord.fetchedAt.toISOString(),
        provider: dbRecord.provider || 'database'
      }
      // Cache in memory for faster subsequent access
      memoryCache.set(cacheKey, payload)
      return payload
    }

    // If database rates expired or don't exist, fetch from API
    const remote = await fetchFromRemote(base)
    if (remote) {
      const expiresAt = new Date(Date.now() + 1000 * 60 * 10) // 10 minutes TTL

      // Always persist to Postgres - this is the source of truth
      try {
        await prisma.rateCache.upsert({
          where: { base },
          update: {
            rates: remote.rates,
            fetchedAt: new Date(remote.fetchedAt),
            expiresAt,
            provider: remote.provider
          },
          create: {
            base,
            rates: remote.rates,
            fetchedAt: new Date(remote.fetchedAt),
            expiresAt,
            provider: remote.provider
          }
        })
      } catch (dbError) {
        console.error('[currency] Failed to save rates to Postgres:', dbError)
      }

      // Cache in memory for performance
      memoryCache.set(cacheKey, remote)
      return remote
    }

    // If API failed but we have database record (even if expired), use it
    if (dbRecord) {
      const fallback: CurrencyRatesPayload = {
        base,
        rates: dbRecord.rates as Record<string, number>,
        fetchedAt: dbRecord.fetchedAt.toISOString(),
        provider: dbRecord.provider || 'database'
      }
      memoryCache.set(cacheKey, fallback)
      return fallback
    }

    // Only use mock rates if database is completely unavailable
    console.warn('[currency] No database or API rates available, using mock rates as last resort')
    const mockRates = getMockRates(base)

    // Try to save mock rates to database for future use
    try {
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour for mock data
      await prisma.rateCache.upsert({
        where: { base },
        update: {
          rates: mockRates.rates,
          fetchedAt: new Date(mockRates.fetchedAt),
          expiresAt,
          provider: 'mock'
        },
        create: {
          base,
          rates: mockRates.rates,
          fetchedAt: new Date(mockRates.fetchedAt),
          expiresAt,
          provider: 'mock'
        }
      })
    } catch (dbError) {
      console.error('[currency] Failed to save mock rates to Postgres:', dbError)
    }

    memoryCache.set(cacheKey, mockRates)
    return mockRates
  } catch (error) {
    console.error('[currency] Database connection error:', error instanceof Error ? error.message : String(error))

    // Absolute last resort: mock rates
    const mockRates = getMockRates(base)
    memoryCache.set(cacheKey, mockRates)
    return mockRates
  }
}


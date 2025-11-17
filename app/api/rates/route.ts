export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const base = searchParams.get('base') || 'USD'

  try {
    // Mock exchange rates - in production, use ExchangeRate-API or similar
    const mockRates: { [key: string]: { [key: string]: number } } = {
      USD: { EUR: 0.92, GBP: 0.79, JPY: 149.5, CAD: 1.36, AUD: 1.53, CHF: 0.88, CNY: 7.24, INR: 83.1, MXN: 17.2 },
      EUR: { USD: 1.09, GBP: 0.86, JPY: 162.8, CAD: 1.48, AUD: 1.67, CHF: 0.96, CNY: 7.88, INR: 90.5, MXN: 18.7 },
      GBP: { USD: 1.27, EUR: 1.16, JPY: 189.5, CAD: 1.72, AUD: 1.94, CHF: 1.12, CNY: 9.17, INR: 105.2, MXN: 21.8 },
      JPY: { USD: 0.0067, EUR: 0.0061, GBP: 0.0053, CAD: 0.0091, AUD: 0.0102, CHF: 0.0059, CNY: 0.048, INR: 0.556, MXN: 0.115 },
      CAD: { USD: 0.74, EUR: 0.68, GBP: 0.58, JPY: 110, AUD: 1.13, CHF: 0.65, CNY: 5.33, INR: 61.2, MXN: 12.7 },
      AUD: { USD: 0.65, EUR: 0.60, GBP: 0.51, JPY: 98, CAD: 0.88, CHF: 0.57, CNY: 4.73, INR: 54.2, MXN: 11.2 },
      CHF: { USD: 1.14, EUR: 1.05, GBP: 0.90, JPY: 170, CAD: 1.54, AUD: 1.76, CNY: 8.24, INR: 94.5, MXN: 19.8 },
      CNY: { USD: 0.138, EUR: 0.127, GBP: 0.109, JPY: 20.4, CAD: 0.188, AUD: 0.212, CHF: 0.121, INR: 11.5, MXN: 2.41 },
      INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.79, CAD: 0.0163, AUD: 0.0184, CHF: 0.0106, CNY: 0.087, MXN: 0.21 },
      MXN: { USD: 0.058, EUR: 0.053, GBP: 0.046, JPY: 8.7, CAD: 0.079, AUD: 0.089, CHF: 0.051, CNY: 0.414, INR: 4.76 }
    }

    const rates = mockRates[base] || mockRates['USD']
    
    return Response.json({ rates, base })
  } catch (error) {
    console.log("[v0] Error fetching rates:", error)
    return Response.json({ error: 'Failed to fetch rates' }, { status: 500 })
  }
}

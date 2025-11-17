'use client'

import { useState, useEffect } from 'react'
import { ArrowRightLeft, Zap } from 'lucide-react'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'MXN']

interface ExchangeRates {
  [key: string]: number
}

export default function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [amount, setAmount] = useState('100')
  const [rates, setRates] = useState<ExchangeRates>({})
  const [loading, setLoading] = useState(true)
  const [displayRate, setDisplayRate] = useState('1')

  useEffect(() => {
    fetchRates()
  }, [])

  const fetchRates = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/rates?base=${fromCurrency}`)
      const data = await res.json()
      setRates(data.rates || {})
      updateDisplayRate(data.rates || {}, fromCurrency, toCurrency)
    } catch (error) {
      console.log("[v0] Error fetching rates:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    updateDisplayRate(rates, fromCurrency, toCurrency)
  }, [fromCurrency, toCurrency, rates])

  const updateDisplayRate = (currentRates: ExchangeRates, from: string, to: string) => {
    if (currentRates[to]) {
      const rate = (currentRates[to] || 1).toFixed(5)
      setDisplayRate(rate)
    }
  }

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const convertedAmount = (parseFloat(amount || '0') * parseFloat(displayRate)).toFixed(2)

  return (
    <div className="w-full max-w-md">
      <div className="gradient-primary rounded-3xl p-8 text-white mb-6">
        <div className="text-sm opacity-90 mb-2">Exchange Rate</div>
        <div className="text-3xl font-bold">1 {fromCurrency} = {displayRate} {toCurrency}</div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
        {/* From */}
        <div>
          <label className="block text-sm font-medium mb-2">From</label>
          <div className="flex gap-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {CURRENCIES.map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-2 hover:bg-muted rounded-lg transition"
          >
            <ArrowRightLeft size={20} className="text-primary" />
          </button>
        </div>

        {/* To */}
        <div>
          <label className="block text-sm font-medium mb-2">To</label>
          <div className="flex gap-4">
            <div className="flex-1 px-4 py-3 bg-input border border-border rounded-lg text-foreground font-semibold">
              {loading ? '-' : convertedAmount}
            </div>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {CURRENCIES.map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Convert Button */}
        <button className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
          <Zap size={18} />
          Convert
        </button>
      </div>
    </div>
  )
}

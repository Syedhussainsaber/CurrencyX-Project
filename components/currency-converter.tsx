'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowRightLeft,
  Clock4,
  RefreshCw,
  Search,
  ShieldCheck,
  Zap,
  AlertCircle
} from 'lucide-react'
import { currencies, getCurrencyMeta } from '@/data/currencies'
import { cn, formatDate } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

const formSchema = z.object({
  amount: z.string().min(1).default('100'),
  fromCurrency: z.string().length(3),
  toCurrency: z.string().length(3)
})

type ConverterForm = z.infer<typeof formSchema>

interface RateResponse {
  base: string
  rates: Record<string, number>
  timestamp: string
  provider: string
}

const REFRESH_INTERVAL_MS = 1000 * 60 * 3 // 3 minutes

interface CurrencySelectProps {
  label: string
  value: string
  onChange: (value: string) => void
}

const CurrencySelect = ({ label, value, onChange }: CurrencySelectProps) => {
  const [open, setOpen] = useState(false)
  const selected = getCurrencyMeta(value)

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">{selected?.flag ?? '🌐'}</span>
              <span className="text-left">
                <span className="block text-sm font-semibold">{selected?.code}</span>
                <span className="block text-xs text-muted-foreground truncate">{selected?.name}</span>
              </span>
            </span>
            <Search size={16} className="opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-80" sideOffset={8}>
          <Command>
            <CommandInput placeholder="Search currency..." />
            <CommandList>
              <CommandEmpty>No currency found.</CommandEmpty>
              <ScrollArea className="max-h-64">
                <CommandGroup heading="Global currencies">
                  {currencies.map((currencyItem) => (
                    <CommandItem
                      key={currencyItem.code}
                      onSelect={() => {
                        onChange(currencyItem.code)
                        setOpen(false)
                      }}
                    >
                      <span className="text-xl mr-3">{currencyItem.flag}</span>
                      <div>
                        <p className="font-semibold text-sm">
                          {currencyItem.code} · {currencyItem.country}
                        </p>
                        <p className="text-xs text-muted-foreground">{currencyItem.name}</p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function CurrencyConverter() {
  const [rates, setRates] = useState<RateResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const { register, watch, setValue } = useForm<ConverterForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '100',
      fromCurrency: 'USD',
      toCurrency: 'EUR'
    }
  })

  const formValues = watch()

  const fetchRates = useCallback(
    async (base: string) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/rates?base=${base}`, {
          cache: 'no-store'
        })

        if (!response.ok) {
          throw new Error('Unable to fetch live rates')
        }

        const data: RateResponse = await response.json()
        data.rates[base] = 1
        setRates(data)
        setLastUpdated(data.timestamp)
      } catch (err) {
        console.error('[converter] rates error', err)
        setError('Unable to load rates. Try again shortly.')
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchRates(formValues.fromCurrency)
  }, [fetchRates, formValues.fromCurrency])

  useEffect(() => {
    const interval = setInterval(() => fetchRates(formValues.fromCurrency), REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [fetchRates, formValues.fromCurrency])

  const handleSwap = () => {
    const currentFrom = formValues.fromCurrency
    const currentTo = formValues.toCurrency
    setValue('fromCurrency', currentTo)
    setValue('toCurrency', currentFrom)
  }

  const currentRate = useMemo(() => {
    if (!rates) return 0
    return rates.rates[formValues.toCurrency] || 0
  }, [rates, formValues.toCurrency])

  const convertedAmount = useMemo(() => {
    const amount = parseFloat(formValues.amount || '0')
    if (!currentRate || Number.isNaN(amount)) return '0.00'
    return (amount * currentRate).toFixed(2)
  }, [formValues.amount, currentRate])

  const highlights = useMemo(() => {
    if (!rates) return []
    const majorPairs = ['GBP', 'EUR', 'JPY', 'NGN', 'INR', 'AUD']
    return majorPairs.map((code) => ({
      code,
      meta: getCurrencyMeta(code),
      rate: rates.rates[code]
    }))
  }, [rates])

  return (
    <div className="w-full max-w-xl space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-primary to-secondary text-white p-6 shadow-xl">
        <div className="flex items-center justify-between text-sm opacity-90">
          <span>Real-Time Exchange Rate</span>
          <div className="flex items-center gap-2">
            <Clock4 size={16} />
            {lastUpdated ? formatDate(lastUpdated, { dateStyle: 'medium', timeStyle: 'short' }) : 'Syncing...'}
          </div>
        </div>
        <p className="mt-4 text-4xl font-semibold">
          1 {formValues.fromCurrency} ={' '}
          {loading ? <span className="text-base">updating...</span> : currentRate.toFixed(5)} {formValues.toCurrency}
        </p>
        <p className="mt-2 text-sm opacity-80 flex items-center gap-2">
          <ShieldCheck size={16} />
          {rates?.provider === 'mock' ? (
            <span className="text-yellow-200">Using approximate rates (API unavailable)</span>
          ) : rates?.provider ? (
            `Powered by ${rates.provider}`
          ) : (
            'Bank-grade data source'
          )}
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="text-sm font-semibold mb-2 block">Amount</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register('amount')}
              className="text-lg h-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CurrencySelect
              label="From Currency"
              value={formValues.fromCurrency}
              onChange={(val) => setValue('fromCurrency', val)}
            />

            <CurrencySelect
              label="To Currency"
              value={formValues.toCurrency}
              onChange={(val) => setValue('toCurrency', val)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              type="button"
              onClick={handleSwap}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <ArrowRightLeft size={16} className="mr-2" />
              Swap
            </Button>
            <Button
              type="button"
              onClick={() => fetchRates(formValues.fromCurrency)}
              variant="outline"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <RefreshCw size={16} className={cn('mr-2', loading && 'animate-spin')} />
              Refresh rate
            </Button>
            <Button className="w-full sm:flex-1 bg-primary text-primary-foreground">
              <Zap size={16} className="mr-2" />
              Convert Now
            </Button>
          </div>
        </div>

        <div className="p-5 bg-muted/60 rounded-xl border border-dashed border-primary/30">
          <p className="text-sm font-semibold text-muted-foreground">Converted Amount</p>
          <p className="text-3xl font-bold mt-2">{convertedAmount} {formValues.toCurrency}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Updated {lastUpdated ? formatDate(lastUpdated, { dateStyle: 'medium', timeStyle: 'short' }) : 'Just now'}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/30 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Unable to fetch live rates</p>
              <p className="text-xs mt-1 opacity-90">{error}</p>
            </div>
          </div>
        )}
        
        {!error && rates?.provider === 'mock' && (
          <div className="p-4 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-sm rounded-lg border border-yellow-500/30 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Using approximate rates</p>
              <p className="text-xs mt-1 opacity-90">
                Live exchange rates are temporarily unavailable. Showing approximate values for reference only.
              </p>
            </div>
          </div>
        )}

        {!error && (
          <div>
            <p className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Search size={14} /> Popular pairs
            </p>
            <div className="grid grid-cols-2 gap-3">
              {loading || !rates ? (
                Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} className="h-16 rounded-xl" />)
              ) : (
                highlights.map((item) => (
                  <div key={item.code} className="p-3 rounded-xl border bg-input flex flex-col">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>{item.meta?.flag}</span>
                      {item.meta?.country}
                    </span>
                    <span className="text-lg font-semibold">
                      {formValues.fromCurrency} → {item.code}
                    </span>
                    <span className="text-sm text-primary font-bold">
                      {item.rate ? item.rate.toFixed(4) : '—'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

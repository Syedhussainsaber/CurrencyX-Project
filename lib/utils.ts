import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number, currency = 'USD', maximumFractionDigits = 2) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits
    }).format(value)
  } catch {
    return value.toFixed(2)
  }
}

export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
  const dt = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', options || { dateStyle: 'medium' }).format(dt)
}

export const flagFromCountryCode = (countryCode?: string) => {
  if (!countryCode) return '🌐'
  return countryCode
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('')
}

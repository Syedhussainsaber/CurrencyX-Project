'use client'

import { createContext, useContext } from 'react'
import type { SiteSettingsPayload } from '@/lib/site'

const SiteSettingsContext = createContext<SiteSettingsPayload | null>(null)

interface ProviderProps {
  settings: SiteSettingsPayload
  children: React.ReactNode
}

export const SiteSettingsProvider = ({ settings, children }: ProviderProps) => {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
}

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext)
  if (!context) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider')
  }
  return context
}


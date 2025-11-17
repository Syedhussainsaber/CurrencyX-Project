import { cache } from 'react'
import { connectToDatabase } from './db'
import SiteSettingsModel from '@/models/SiteSettings'

export interface SiteSettingsPayload {
  id: string
  brandName: string
  heroHeadline: string
  heroSubheadline: string
  primaryColor: string
  accentColor: string
  highlightColor: string
  logoUrl?: string
  faviconUrl?: string
  supportEmail: string
  supportPhone: string
  address: string
  metaTitle: string
  metaDescription: string
  social?: {
    twitter?: string
    linkedin?: string
    facebook?: string
    instagram?: string
  }
  updatedAt: string
  createdAt: string
}

export const getSiteSettings = cache(async (): Promise<SiteSettingsPayload> => {
      try {
        await connectToDatabase()
        let settings = await SiteSettingsModel.findOne().lean()
        if (!settings) {
          const created = await SiteSettingsModel.create({})
          settings = await SiteSettingsModel.findById(created._id).lean()
        }

        if (!settings) {
          throw new Error('Failed to create site settings')
        }

    return {
      id: settings._id.toString(),
      brandName: settings.brandName,
      heroHeadline: settings.heroHeadline,
      heroSubheadline: settings.heroSubheadline,
      primaryColor: settings.primaryColor,
      accentColor: settings.accentColor,
      highlightColor: settings.highlightColor,
      logoUrl: settings.logoUrl,
      faviconUrl: settings.faviconUrl,
      supportEmail: settings.supportEmail,
      supportPhone: settings.supportPhone,
      address: settings.address,
      metaTitle: settings.metaTitle,
      metaDescription: settings.metaDescription,
      social: settings.social,
      updatedAt: settings.updatedAt instanceof Date ? settings.updatedAt.toISOString() : new Date(settings.updatedAt).toISOString(),
      createdAt: settings.createdAt instanceof Date ? settings.createdAt.toISOString() : new Date(settings.createdAt).toISOString()
    }
  } catch (error) {
    console.warn('[site] Database connection failed, using defaults:', error instanceof Error ? error.message : String(error))
    // Return default settings if database is unavailable
    return {
      id: 'default',
      brandName: 'CurrencyX',
      heroHeadline: 'International Currency Transfer Provider',
      heroSubheadline: 'Send money worldwide with competitive rates, zero hidden fees, and 24/7 support.',
      primaryColor: '#075E54',
      accentColor: '#25D366',
      highlightColor: '#128C7E',
      logoUrl: undefined,
      faviconUrl: undefined,
      supportEmail: 'support@currencyx.com',
      supportPhone: '+1 (800) 123-4567',
      address: '123 Finance St, New York, NY 10001',
      metaTitle: 'CurrencyX - Fast International Money Transfer',
      metaDescription: 'Send money worldwide with competitive rates, no hidden fees, 24/7 support.',
      social: undefined,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
  }
})


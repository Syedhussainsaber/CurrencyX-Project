import { unstable_cache } from 'next/cache'
import prisma from '@/lib/prisma'

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

export const getSiteSettings = unstable_cache(async (): Promise<SiteSettingsPayload> => {
  try {
    let settings = await prisma.siteSettings.findFirst()

    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.siteSettings.create({
        data: {
          brandName: 'PayIn Global',
          heroHeadline: 'International Currency Transfer Provider',
          heroSubheadline: 'Send money worldwide with competitive rates, zero hidden fees, and 24/7 support.',
          primaryColor: '#075E54',
          accentColor: '#25D366',
          highlightColor: '#128C7E',
          supportEmail: 'support@payinglobal.com',
          supportPhone: '+91 9392698184',
          address: 'Hyderabad, India',
          metaTitle: 'PayIn Global - Fast International Money Transfer',
          metaDescription: 'Send money worldwide with competitive rates, no hidden fees, 24/7 support.',
        }
      })
    }
    // Normalize existing records to the new brand
    if (settings.brandName !== 'PayIn Global' || settings.supportPhone !== '+91 9392698184') {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          brandName: 'PayIn Global',
          metaTitle: 'PayIn Global - Fast International Money Transfer',
          supportEmail: settings.supportEmail || 'support@payinglobal.com',
          supportPhone: '+91 9392698184'
        }
      })
    }

    return {
      id: settings.id,
      brandName: settings.brandName,
      heroHeadline: settings.heroHeadline,
      heroSubheadline: settings.heroSubheadline,
      primaryColor: settings.primaryColor,
      accentColor: settings.accentColor,
      highlightColor: settings.highlightColor,
      logoUrl: settings.logoUrl || undefined,
      faviconUrl: settings.faviconUrl || undefined,
      supportEmail: settings.supportEmail,
      supportPhone: settings.supportPhone,
      address: settings.address,
      metaTitle: settings.metaTitle,
      metaDescription: settings.metaDescription,
      social: settings.social as any,
      updatedAt: settings.updatedAt.toISOString(),
      createdAt: settings.createdAt.toISOString()
    }
  } catch (error) {
    console.warn('[site] Database connection failed, using defaults:', error instanceof Error ? error.message : String(error))
    // Return default settings if database is unavailable
    return {
      id: 'default',
      brandName: 'PayIn Global',
      heroHeadline: 'International Currency Transfer Provider',
      heroSubheadline: 'Send money worldwide with competitive rates, zero hidden fees, and 24/7 support.',
      primaryColor: '#075E54',
      accentColor: '#25D366',
      highlightColor: '#128C7E',
      logoUrl: undefined,
      faviconUrl: undefined,
      supportEmail: 'support@payinglobal.com',
      supportPhone: '+91 9392698184',
      address: 'Hyderabad, India',
      metaTitle: 'PayIn Global - Fast International Money Transfer',
      metaDescription: 'Send money worldwide with competitive rates, no hidden fees, 24/7 support.',
      social: undefined,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
  }
}, ['site-settings'], { revalidate: 60 })


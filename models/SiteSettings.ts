import { Schema, model, models, type Document, type Model } from 'mongoose'

export interface SiteSettingsDocument extends Document {
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
  social: {
    twitter?: string
    linkedin?: string
    facebook?: string
    instagram?: string
  }
  updatedAt: Date
  createdAt: Date
}

const SiteSettingsSchema = new Schema<SiteSettingsDocument>(
  {
    brandName: { type: String, default: 'Global CurrencyX' },
    heroHeadline: { type: String, default: 'Your All-in-One Currency Intelligence Hub' },
    heroSubheadline: {
      type: String,
      default: 'Convert currencies, monitor global rates, and publish insights in real-time.'
    },
    primaryColor: { type: String, default: '#075E54' },
    accentColor: { type: String, default: '#25D366' },
    highlightColor: { type: String, default: '#128C7E' },
    logoUrl: { type: String },
    faviconUrl: { type: String },
    supportEmail: { type: String, default: 'support@currencyx.com' },
    supportPhone: { type: String, default: '+1 (800) 123-4567' },
    address: {
      type: String,
      default: '123 Finance St, New York, NY 10001, USA'
    },
    metaTitle: {
      type: String,
      default: 'Global CurrencyX — Real-Time Currency Converter, Blog & Admin'
    },
    metaDescription: {
      type: String,
      default: 'Convert any currency instantly, monitor live FX rates, manage insights, and stay compliant with Global CurrencyX.'
    },
    social: {
      twitter: { type: String },
      linkedin: { type: String },
      facebook: { type: String },
      instagram: { type: String }
    }
  },
  {
    timestamps: true
  }
)

const SiteSettingsModel: Model<SiteSettingsDocument> =
  models.SiteSettings || model<SiteSettingsDocument>('SiteSettings', SiteSettingsSchema)

export default SiteSettingsModel


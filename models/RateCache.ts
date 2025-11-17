import { Schema, model, models, type Document, type Model } from 'mongoose'

export interface RateCacheDocument extends Document {
  base: string
  rates: Record<string, number>
  fetchedAt: Date
  expiresAt: Date
  provider?: string
}

const RateCacheSchema = new Schema<RateCacheDocument>(
  {
    base: { type: String, required: true, uppercase: true, unique: true },
    rates: { type: Schema.Types.Mixed, required: true },
    fetchedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    provider: { type: String, default: 'fastforex' }
  },
  {
    timestamps: true
  }
)

const RateCacheModel: Model<RateCacheDocument> =
  models.RateCache || model<RateCacheDocument>('RateCache', RateCacheSchema)

export default RateCacheModel


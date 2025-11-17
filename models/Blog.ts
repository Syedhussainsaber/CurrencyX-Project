import { Schema, model, models, type Document, type Model } from 'mongoose'
import slugify from 'slugify'

export interface BlogDocument extends Document {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  author: string
  tags: string[]
  status: 'draft' | 'published'
  readingTime: number
  publishedAt?: Date
  seoTitle?: string
  seoDescription?: string
  createdAt: Date
  updatedAt: Date
}

const BlogSchema = new Schema<BlogDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
    coverImage: { type: String },
    author: { type: String, required: true, default: 'CurrencyX Editorial' },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    readingTime: { type: Number, default: 5 },
    publishedAt: { type: Date },
    seoTitle: { type: String },
    seoDescription: { type: String }
  },
  {
    timestamps: true
  }
)

BlogSchema.index({
  title: 'text',
  excerpt: 'text',
  content: 'text',
  tags: 'text'
})

BlogSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }

  if (this.content) {
    const words = this.content.trim().split(/\s+/).length
    this.readingTime = Math.max(1, Math.round(words / 200))
  }

  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date()
  }

  next()
})

const BlogModel: Model<BlogDocument> = models.Blog || model<BlogDocument>('Blog', BlogSchema)

export default BlogModel


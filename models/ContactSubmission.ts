import { Schema, model, models, type Document, type Model } from 'mongoose'

export interface ContactSubmissionDocument extends Document {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'responded'
  createdAt: Date
  updatedAt: Date
}

const ContactSubmissionSchema = new Schema<ContactSubmissionDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'responded'], default: 'new' }
  },
  {
    timestamps: true
  }
)

const ContactSubmissionModel: Model<ContactSubmissionDocument> =
  models.ContactSubmission || model<ContactSubmissionDocument>('ContactSubmission', ContactSubmissionSchema)

export default ContactSubmissionModel


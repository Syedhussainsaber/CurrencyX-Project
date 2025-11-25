import { Resend } from 'resend'
import { getServerEnv } from './env'

const buildResend = () => {
  const env = getServerEnv()
  if (!env.RESEND_API_KEY) {
    console.warn('[mailer] RESEND_API_KEY missing, skipping transactional email')
    return null
  }

  return new Resend(env.RESEND_API_KEY)
}

export interface ContactEmailPayload {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
}

export const sendContactEmails = async (payload: ContactEmailPayload) => {
  const env = getServerEnv()
  const resend = buildResend()

  if (!resend) return

  const inbox = env.CONTACT_INBOX_EMAIL || env.ADMIN_EMAIL
  const html = `
    <h2>New Contact Submission</h2>
    <p><strong>Name:</strong> ${payload.name}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Phone:</strong> ${payload.phone || 'N/A'}</p>
    <p><strong>Subject:</strong> ${payload.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${payload.message}</p>
  `

  await resend.emails.send({
    from: `PayIn Global Support <support@${new URL(env.SITE_URL).hostname}>`,
    to: [payload.email],
    subject: `We've received your message: ${payload.subject}`,
    html: `<p>Hi ${payload.name},</p><p>Thank you for reaching out to PayIn Global. Our support team will respond shortly.</p>`
  })

  await resend.emails.send({
    from: `PayIn Global Contact <no-reply@${new URL(env.SITE_URL).hostname}>`,
    to: [inbox],
    subject: `[Contact] ${payload.subject}`,
    html
  })
}


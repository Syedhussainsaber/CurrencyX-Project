export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json()

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return Response.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, use email service like Resend, SendGrid, or Nodemailer
    // For now, log the contact form submission
    console.log("[v0] Contact form submission:", {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString()
    })

    // TODO: Integrate with email service
    // Example with Resend (install: npm install resend):
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // 
    // await resend.emails.send({
    //   from: 'contact@currencyx.com',
    //   to: email,
    //   subject: `Re: ${subject}`,
    //   html: `<p>Thank you for contacting CurrencyX. We've received your message and will respond within 24 hours.</p>`
    // });
    //
    // await resend.emails.send({
    //   from: 'contact@currencyx.com',
    //   to: process.env.ADMIN_EMAIL,
    //   subject: `New Contact Form: ${subject}`,
    //   html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Phone:</strong> ${phone || 'N/A'}</p><p><strong>Message:</strong></p><p>${message}</p>`
    // });

    return Response.json({
      success: true,
      message: 'Message sent successfully! We will respond within 24 hours.'
    })
  } catch (error) {
    console.log("[v0] Contact form error:", error)
    return Response.json(
      { message: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}

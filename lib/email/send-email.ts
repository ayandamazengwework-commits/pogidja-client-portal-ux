import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

const resend = apiKey ? new Resend(apiKey) : null

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions) {
  // During local development we don't want builds to fail.
  if (!resend) {
    console.warn(
      'RESEND_API_KEY is missing. Email skipped.'
    )

    return {
      success: false,
    }
  }

  return resend.emails.send({
    from:
      process.env.RESEND_FROM_EMAIL ??
      'POG Advisory <noreply@pogidja.co.za>',
    to,
    subject,
    html,
  })
}

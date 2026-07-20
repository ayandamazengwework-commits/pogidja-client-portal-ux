import { Resend } from 'resend'

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.warn('RESEND_API_KEY is not configured. Email skipped.')
    return
  }

  const resend = new Resend(apiKey)

  return resend.emails.send({
    from: 'POG Advisory <noreply@pogidja.co.za>',
    to,
    subject,
    html,
  })
}

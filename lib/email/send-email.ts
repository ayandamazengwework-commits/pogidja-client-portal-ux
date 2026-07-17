import { resend } from './resend'

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
  const { error } = await resend.emails.send({
    from: 'POG Advisory <noreply@pogidja.co.za>',
    to,
    subject,
    html,
  })

  if (error) {
    console.error('Resend Error:', error)
    throw error
  }
}

import { getResend } from './resend'

interface SendEmailProps {
  to: string
  subject: string
  html: string
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailProps) {
  const resend = getResend()

  return resend.emails.send({
    from: 'POG Advisory <notifications@pogidja.co.za>',
    to,
    subject,
    html,
  })
}

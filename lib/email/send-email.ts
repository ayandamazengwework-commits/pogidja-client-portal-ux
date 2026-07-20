<<<<<<< HEAD
import { transporter } from "./transporter";
=======
import { getResend } from './resend'
>>>>>>> 96b6ba1 (Install Nodemailer)

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions) {
<<<<<<< HEAD
  await transporter.sendMail({
    from: process.env.SMTP_FROM!,
=======
  const resend = getResend()

  const { error } = await resend.emails.send({
    from: 'POG Advisory <noreply@pogidja.co.za>',
>>>>>>> 96b6ba1 (Install Nodemailer)
    to,
    subject,
    html,
  });
}

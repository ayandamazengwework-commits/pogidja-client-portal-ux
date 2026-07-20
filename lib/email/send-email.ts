import { transporter } from "./transporter";

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
  await transporter.sendMail({
    from: process.env.SMTP_FROM!,
    to,
    subject,
    html,
  });
}

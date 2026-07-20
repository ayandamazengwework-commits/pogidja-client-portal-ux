import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

interface WelcomeEmailProps {
  email: string
  firstName: string
}

export async function sendClientWelcomeEmail({
  email,
  firstName,
}: WelcomeEmailProps) {
  return resend.emails.send({
    from: 'POG Advisory <noreply@pogidja.co.za>',
    to: email,
    subject: 'Welcome to POG Advisory',

    html: `
      <div style="font-family:Arial,sans-serif;padding:40px;max-width:700px;margin:auto">

        <h2>Welcome ${firstName},</h2>

        <p>
          Thank you for joining the POG Advisory Client Portal.
        </p>

        <p>
          Your account has been activated successfully.
        </p>

        <p>
          You can now securely access your portal to:
        </p>

        <ul>
          <li>Upload requested documents</li>
          <li>Track your services</li>
          <li>Receive invoices</li>
          <li>Upload proof of payment</li>
          <li>Chat directly with your advisor</li>
        </ul>

        <p style="margin-top:30px">
          <a
            href="https://portal.pogidja.co.za/auth/login"
            style="
              background:#1E88E5;
              color:#ffffff;
              text-decoration:none;
              padding:14px 24px;
              border-radius:8px;
              display:inline-block;
            "
          >
            Login to Portal
          </a>
        </p>

        <hr style="margin:40px 0">

        <p style="color:#666">
          If you did not expect this email, please contact POG Advisory immediately.
        </p>

      </div>
    `,
  })
}

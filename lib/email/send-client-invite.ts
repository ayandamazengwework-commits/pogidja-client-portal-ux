import { getResend } from '@/lib/email/resend'

interface InviteProps {
  email: string
  firstName: string
  temporaryPassword: string
}

export async function sendClientInvite({
  email,
  firstName,
  temporaryPassword,
}: InviteProps) {
  const resend = getResend()

  await resend.emails.send({
    from: 'POG Advisory <notifications@pogidja.co.za>',
    to: email,
    subject: 'Welcome to the POG Advisory Client Portal',

    html: `
      <div style="font-family:Arial;padding:40px;max-width:700px;margin:auto">

        <h2>Welcome ${firstName},</h2>

        <p>
          Your accountant has created your secure client portal.
        </p>

        <p>
          All communication, document uploads, invoices and progress updates
          will happen inside this portal.
        </p>

        <hr>

        <h3>Login Details</h3>

        <p>
          <strong>Email</strong><br>
          ${email}
        </p>

        <p>
          <strong>Temporary Password</strong><br>
          ${temporaryPassword}
        </p>

        <br>

        <a
          href="https://portal.pogidja.co.za/auth/login"
          style="
            background:#1E88E5;
            color:white;
            padding:14px 28px;
            border-radius:8px;
            text-decoration:none;
            display:inline-block;
          "
        >
          Login to Portal
        </a>

        <br><br>

        <p>
          Once logged in you will be able to:
        </p>

        <ul>
          <li>Upload requested documents</li>
          <li>View your application progress</li>
          <li>Receive messages from your accountant</li>
          <li>Receive invoices</li>
          <li>Upload proof of payment</li>
        </ul>

        <p>
          Your personal information can only be edited by your accountant.
          If anything needs changing simply send us a message through the portal.
        </p>

        <br>

        <p>
          Regards,<br>
          <strong>POG Advisory</strong>
        </p>

      </div>
    `,
  })
}

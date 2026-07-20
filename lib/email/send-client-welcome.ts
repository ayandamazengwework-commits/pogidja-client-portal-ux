import { sendEmail } from './send-email'

export async function sendClientWelcomeEmail({
  email,
  firstName,
  temporaryPassword,
}: {
  email: string
  firstName: string
  temporaryPassword: string
}) {
  return sendEmail({
    to: email,
    subject: 'Welcome to POG Advisory Client Portal',

    html: `
      <div style="font-family:Arial;padding:40px;max-width:700px">

        <h2>Welcome ${firstName}</h2>

        <p>Your advisor has created your client portal.</p>

        <p>Please login using the details below.</p>

        <table style="margin:25px 0">

          <tr>
            <td><strong>Email</strong></td>
            <td>${email}</td>
          </tr>

          <tr>
            <td><strong>Password</strong></td>
            <td>${temporaryPassword}</td>
          </tr>

        </table>

        <a
          href="https://portal.pogidja.co.za/auth/login"
          style="
            background:#1E88E5;
            color:white;
            padding:14px 24px;
            text-decoration:none;
            border-radius:8px;
            display:inline-block;
          "
        >
          Login to Portal
        </a>

        <hr style="margin:40px 0">

        <p>Inside the portal you can:</p>

        <ul>
          <li>Upload requested documents</li>
          <li>Track application progress</li>
          <li>Receive invoices</li>
          <li>Upload proof of payment</li>
          <li>Chat directly with your advisor</li>
        </ul>

      </div>
    `,
  })
}

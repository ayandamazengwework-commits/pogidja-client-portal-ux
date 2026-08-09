import { sendEmail } from './send-email'

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
  return sendEmail({
    to: email,

    subject:
      'Welcome to the POG ADVISORY AND CHARTERED ACCOUNTANTS INC. Client Portal',

    html: `
<!DOCTYPE html>
<html>
  <body
    style="
      margin:0;
      padding:0;
      background:#f8fafc;
      font-family:Arial,Helvetica,sans-serif;
      color:#0f172a;
    "
  >

    <div
      style="
        max-width:600px;
        margin:40px auto;
        background:#ffffff;
        border-radius:16px;
        overflow:hidden;
        border:1px solid #e2e8f0;
      "
    >

      <!-- HEADER -->

      <div
        style="
          background:#0f2747;
          padding:32px 28px;
          text-align:center;
        "
      >

        <h1
          style="
            margin:0;
            color:#ffffff;
            font-size:20px;
            line-height:1.3;
            font-weight:700;
          "
        >
          POG ADVISORY AND
          CHARTERED ACCOUNTANTS INC.
        </h1>

        <p
          style="
            margin:10px 0 0;
            color:#cbd5e1;
            font-size:14px;
          "
        >
          Secure Client Portal
        </p>

      </div>

      <!-- CONTENT -->

      <div
        style="
          padding:32px;
        "
      >

        <h2
          style="
            margin:0 0 16px;
            font-size:24px;
            color:#0f172a;
          "
        >
          Welcome ${firstName},
        </h2>

        <p
          style="
            margin:0 0 16px;
            color:#475569;
            font-size:15px;
            line-height:1.7;
          "
        >
          Your secure client portal account has
          been created by your accountant.
        </p>

        <p
          style="
            margin:0 0 24px;
            color:#475569;
            font-size:15px;
            line-height:1.7;
          "
        >
          Your client portal gives you one secure
          place to manage your accounting services,
          submit documents, communicate with your
          advisor, view invoices and monitor the
          progress of your services.
        </p>

        <!-- LOGIN DETAILS -->

        <div
          style="
            margin:24px 0;
            padding:22px;
            background:#f8fafc;
            border:1px solid #e2e8f0;
            border-radius:12px;
          "
        >

          <h3
            style="
              margin:0 0 18px;
              font-size:16px;
              color:#0f2747;
            "
          >
            Your Login Details
          </h3>

          <p
            style="
              margin:0 0 14px;
              color:#475569;
              font-size:14px;
              line-height:1.5;
            "
          >
            <strong>Email Address</strong><br />
            ${email}
          </p>

          <p
            style="
              margin:0;
              color:#475569;
              font-size:14px;
              line-height:1.5;
            "
          >
            <strong>Temporary Password</strong><br />
            ${temporaryPassword}
          </p>

        </div>

        <!-- LOGIN BUTTON -->

        <div
          style="
            text-align:center;
            margin:30px 0;
          "
        >

          <a
            href="${process.env.NEXT_PUBLIC_SITE_URL}/auth/login"
            style="
              display:inline-block;
              padding:14px 26px;
              background:#1E88E5;
              color:#ffffff;
              text-decoration:none;
              border-radius:10px;
              font-size:15px;
              font-weight:bold;
            "
          >
            Login to Client Portal
          </a>

        </div>

        <!-- PORTAL FEATURES -->

        <div
          style="
            margin:28px 0;
          "
        >

          <p
            style="
              margin:0 0 12px;
              color:#334155;
              font-size:15px;
              font-weight:bold;
            "
          >
            Once logged in, you will be able to:
          </p>

          <ul
            style="
              margin:0;
              padding-left:22px;
              color:#475569;
              font-size:14px;
              line-height:1.9;
            "
          >

            <li>
              Upload requested documents
            </li>

            <li>
              Track the progress of your services
            </li>

            <li>
              Receive and send secure messages
            </li>

            <li>
              View your invoices
            </li>

            <li>
              Upload proof of payment
            </li>

            <li>
              Receive important notifications
            </li>

          </ul>

        </div>

        <!-- IMPORTANT INFORMATION -->

        <div
          style="
            margin:28px 0;
            padding:18px;
            background:#eff6ff;
            border-left:4px solid #1E88E5;
            border-radius:8px;
          "
        >

          <p
            style="
              margin:0;
              color:#334155;
              font-size:14px;
              line-height:1.7;
            "
          >
            Your personal information can only be
            updated by your accountant. If any of
            your details need to be changed, please
            contact your accountant through the
            secure client portal.
          </p>

        </div>

        <!-- SECURITY NOTICE -->

        <p
          style="
            margin:28px 0 0;
            color:#64748b;
            font-size:13px;
            line-height:1.7;
          "
        >
          For your security, please change your
          temporary password after signing in and
          keep your login details private.
        </p>

        <!-- SIGN OFF -->

        <p
          style="
            margin:30px 0 0;
            color:#64748b;
            font-size:14px;
            line-height:1.7;
          "
        >
          Kind regards,<br />

          <strong style="color:#0f2747;">
            POG ADVISORY AND
            CHARTERED ACCOUNTANTS INC.
          </strong>
        </p>

      </div>

      <!-- FOOTER -->

      <div
        style="
          padding:20px 28px;
          background:#f8fafc;
          border-top:1px solid #e2e8f0;
          text-align:center;
        "
      >

        <p
          style="
            margin:0;
            color:#94a3b8;
            font-size:12px;
            line-height:1.6;
          "
        >
          This email contains information relating
          to your secure client portal.
        </p>

      </div>

    </div>

  </body>
</html>
    `,
  })
}

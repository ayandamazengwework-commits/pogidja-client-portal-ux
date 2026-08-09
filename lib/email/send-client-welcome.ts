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
    subject:
      'Welcome to the POG Advisory & Chartered Accountants Inc. Client Portal',

    html: `
      <!DOCTYPE html>
      <html>
        <body
          style="
            margin:0;
            padding:0;
            background:#f5f7fa;
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
                padding:28px;
                text-align:center;
              "
            >

              <h1
                style="
                  margin:0;
                  color:#ffffff;
                  font-size:22px;
                  font-weight:700;
                "
              >
                POG ADVISORY
              </h1>

              <p
                style="
                  margin:8px 0 0;
                  color:#cbd5e1;
                  font-size:13px;
                "
              >
                AND CHARTERED ACCOUNTANTS INC.
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
                Welcome ${firstName}
              </h2>

              <p
                style="
                  color:#475569;
                  line-height:1.7;
                  margin:0 0 16px;
                "
              >
                Your advisor has created your secure client portal.
              </p>

              <p
                style="
                  color:#475569;
                  line-height:1.7;
                  margin:0;
                "
              >
                The portal gives you one secure place to communicate
                with your advisor, submit documents, track your services
                and access important updates.
              </p>

              <!-- LOGIN DETAILS -->

              <div
                style="
                  margin:28px 0;
                  padding:22px;
                  background:#f8fafc;
                  border:1px solid #e2e8f0;
                  border-radius:12px;
                "
              >

                <p
                  style="
                    margin:0 0 16px;
                    font-size:13px;
                    font-weight:bold;
                    color:#64748b;
                    text-transform:uppercase;
                    letter-spacing:0.05em;
                  "
                >
                  Your Login Details
                </p>

                <p
                  style="
                    margin:0 0 12px;
                    color:#334155;
                  "
                >
                  <strong>Email</strong><br />
                  ${email}
                </p>

                <p
                  style="
                    margin:0;
                    color:#334155;
                  "
                >
                  <strong>Temporary Password</strong><br />
                  ${temporaryPassword}
                </p>

              </div>

              <!-- BUTTON -->

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
                    padding:14px 28px;
                    background:#1E88E5;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:10px;
                    font-weight:bold;
                    font-size:15px;
                  "
                >
                  Login to Client Portal
                </a>

              </div>

              <!-- FEATURES -->

              <p
                style="
                  margin:30px 0 12px;
                  color:#334155;
                  font-weight:bold;
                "
              >
                Inside your portal you can:
              </p>

              <ul
                style="
                  margin:0;
                  padding-left:22px;
                  color:#475569;
                  line-height:1.9;
                "
              >
                <li>Upload requested documents</li>
                <li>Track your service progress</li>
                <li>Receive important notifications</li>
                <li>View invoices and payment information</li>
                <li>Communicate securely with your advisor</li>
              </ul>

              <!-- SECURITY NOTE -->

              <div
                style="
                  margin-top:28px;
                  padding:16px;
                  background:#eff6ff;
                  border-radius:10px;
                  border-left:4px solid #1E88E5;
                "
              >

                <p
                  style="
                    margin:0;
                    color:#334155;
                    font-size:14px;
                    line-height:1.6;
                  "
                >
                  For your security, please keep your login details
                  confidential and do not share your password with anyone.
                </p>

              </div>

              <!-- FOOTER -->

              <p
                style="
                  margin:30px 0 0;
                  color:#64748b;
                  font-size:14px;
                  line-height:1.6;
                "
              >
                Kind regards,<br />
                <strong>
                  POG Advisory & Chartered Accountants Inc.
                </strong>
              </p>

            </div>

            <!-- EMAIL FOOTER -->

            <div
              style="
                padding:20px 32px;
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
                  line-height:1.5;
                "
              >
                This email was sent by POG Advisory & Chartered Accountants Inc.
                <br />
                Please do not reply to this automated email.
              </p>

            </div>

          </div>

        </body>
      </html>
    `,
  })
}

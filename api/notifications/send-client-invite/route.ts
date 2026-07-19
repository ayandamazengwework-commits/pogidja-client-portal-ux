import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const {
      email,
      firstName,
      invitationUrl,
    } = await request.json()

    const { error } = await resend.emails.send({
      from: 'POG Advisory <noreply@pogidja.co.za>',
      to: email,
      subject: 'Welcome to the POG Advisory Client Portal',

      html: `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto">

        <h2 style="color:#1565C0">
          Welcome to POG Advisory
        </h2>

        <p>Hello ${firstName},</p>

        <p>
          Your consultant has created your secure client portal.
        </p>

        <p>
          All future communication, document requests,
          invoices and status updates will happen inside
          this portal.
        </p>

        <p>
          Click the button below to activate your account.
        </p>

        <p style="margin:35px 0">

          <a
            href="${invitationUrl}"
            style="
              background:#1E88E5;
              color:#fff;
              padding:14px 28px;
              text-decoration:none;
              border-radius:8px;
              display:inline-block;
            "
          >
            Activate My Portal
          </a>

        </p>

        <hr>

        <p style="font-size:13px;color:#777">
          If you were not expecting this email,
          simply ignore it.
        </p>

      </div>
      `,
    })

    if (error) {
      console.error(error)
      return NextResponse.json(
        { error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      {
        error: 'Unable to send invitation.',
      },
      {
        status: 500,
      }
    )
  }
}

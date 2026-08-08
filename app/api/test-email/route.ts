import { NextResponse } from 'next/server'
import { transporter } from '@/lib/email/transporter'

export async function GET() {
  try {
    console.log('========== EMAIL TEST ==========')

    console.log('SMTP_HOST:', process.env.SMTP_HOST)
    console.log('SMTP_PORT:', process.env.SMTP_PORT)
    console.log('SMTP_USER:', process.env.SMTP_USER)
    console.log(
      'SMTP_PASS EXISTS:',
      !!process.env.SMTP_PASS
    )
    console.log('SMTP_FROM:', process.env.SMTP_FROM)

    /*
    Test SMTP connection
    */

    await transporter.verify()

    console.log('SMTP CONNECTION SUCCESSFUL')

    /*
    Send test email
    */

    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM!,
      to: 'godmadepsalms@gmail.com',
      subject: 'POG Advisory Email Test',
      html: `
        <div
          style="
            font-family: Arial, Helvetica, sans-serif;
            padding: 30px;
          "
        >
          <h1>POG Advisory</h1>

          <p>
            This is a test email from the POG Advisory
            Client Portal.
          </p>

          <p>
            If you received this email, SMTP is working.
          </p>
        </div>
      `,
    })

    console.log(
      'TEST EMAIL SENT:',
      result.messageId
    )

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId,
    })
  } catch (error) {
    console.error(
      '========== EMAIL TEST FAILED =========='
    )

    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    )
  }
}

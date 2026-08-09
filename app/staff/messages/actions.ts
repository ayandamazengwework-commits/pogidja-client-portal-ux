'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/send-email'

export async function sendMessage(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const recipientId = String(
    formData.get('recipientId') ?? ''
  )

  const serviceId = String(
    formData.get('serviceId') ?? ''
  )

  const subject = String(
    formData.get('subject') ?? ''
  ).trim()

  const body = String(
    formData.get('body') ?? ''
  ).trim()

  if (!recipientId || !body) {
    throw new Error('Missing required fields')
  }

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const { error } = await supabase
    .from('messages')
    .insert({
      sender_id: user.id,
      recipient_id: recipientId,
      service_id: serviceId || null,
      subject,
      body,
      read: false,
    })

  if (error) {
    throw error
  }

  // =====================================================
  // RECIPIENT
  // =====================================================

  const { data: recipient } = await supabase
    .from('profiles')
    .select(`
      first_name,
      last_name,
      email,
      company_name
    `)
    .eq('id', recipientId)
    .single()

  // =====================================================
  // EMAIL
  // =====================================================

  if (recipient?.email) {
    try {
      await sendEmail({
        to: recipient.email,

        subject:
          subject ||
          'New Message from POG ADVISORY AND CHARTERED ACCOUNTANTS INC.',

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
            font-size:20px;
            line-height:1.3;
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

        <p
          style="
            margin:10px 0 0;
            color:#cbd5e1;
            font-size:13px;
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
          Hello ${recipient.first_name ?? 'Client'},
        </h2>

        <p
          style="
            margin:0 0 18px;
            color:#475569;
            font-size:15px;
            line-height:1.7;
          "
        >
          You have received a new secure message from
          POG ADVISORY AND CHARTERED ACCOUNTANTS INC.
        </p>

        ${
          subject
            ? `
              <!-- SUBJECT -->

              <div
                style="
                  margin:20px 0;
                  padding:16px 18px;
                  background:#f8fafc;
                  border:1px solid #e2e8f0;
                  border-radius:10px;
                "
              >

                <p
                  style="
                    margin:0 0 6px;
                    color:#64748b;
                    font-size:12px;
                    font-weight:bold;
                    text-transform:uppercase;
                    letter-spacing:0.04em;
                  "
                >
                  Subject
                </p>

                <p
                  style="
                    margin:0;
                    color:#0f172a;
                    font-size:16px;
                    font-weight:600;
                  "
                >
                  ${subject}
                </p>

              </div>
            `
            : ''
        }

        <!-- MESSAGE -->

        <div
          style="
            margin:24px 0;
            padding:20px;
            background:#f8fafc;
            border:1px solid #e2e8f0;
            border-radius:12px;
          "
        >

          <p
            style="
              margin:0 0 10px;
              color:#64748b;
              font-size:12px;
              font-weight:bold;
              text-transform:uppercase;
              letter-spacing:0.04em;
            "
          >
            Secure Message
          </p>

          <p
            style="
              margin:0;
              color:#334155;
              font-size:15px;
              line-height:1.7;
            "
          >
            ${body.replace(/\n/g, '<br />')}
          </p>

        </div>

        <p
          style="
            margin:24px 0;
            color:#475569;
            font-size:15px;
            line-height:1.7;
          "
        >
          Please log into your secure client portal
          to view the message and respond to your advisor.
        </p>

        <!-- BUTTON -->

        <div
          style="
            text-align:center;
            margin:30px 0;
          "
        >

          <a
            href="${process.env.NEXT_PUBLIC_SITE_URL}/portal/messages"
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
            View Secure Message
          </a>

        </div>

        <!-- SECURITY NOTE -->

        <div
          style="
            margin:28px 0 0;
            padding:16px;
            background:#eff6ff;
            border-left:4px solid #1E88E5;
            border-radius:8px;
          "
        >

          <p
            style="
              margin:0;
              color:#334155;
              font-size:13px;
              line-height:1.6;
            "
          >
            This message was sent through your secure
            client portal. Please do not reply directly
            to this email.
          </p>

        </div>

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
            POG ADVISORY AND CHARTERED ACCOUNTANTS INC.
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
          <br />
          Please do not reply directly to this email.
        </p>

      </div>

    </div>

  </body>

</html>
        `,
      })

      console.log(
        'MESSAGE EMAIL SENT:',
        recipient.email
      )
    } catch (err) {
      console.error(
        'MESSAGE EMAIL FAILED:',
        err
      )
    }
  }

  // =====================================================
  // CLIENT NOTIFICATION
  // =====================================================

  await supabase
    .from('notifications')
    .insert({
      user_id: recipientId,

      title:
        subject || 'New Message',

      message:
        body.length > 180
          ? `${body.substring(0, 180)}...`
          : body,

      type: 'message',

      link: serviceId
        ? `/portal/cases/${serviceId}`
        : '/portal/messages',

      read: false,
    })

  // =====================================================
  // ACTIVITY LOG
  // =====================================================

  await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,

      role: 'staff',

      entity_type: 'message',

      entity_id: recipientId,

      action: 'Message Sent',

      description:
        subject ||
        'Message sent to client',
    })

  // =====================================================
  // REFRESH
  // =====================================================

  revalidatePath('/staff/messages')
  revalidatePath('/staff/notifications')
  revalidatePath('/portal/messages')
  revalidatePath('/portal/notifications')
}

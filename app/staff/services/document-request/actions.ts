'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/send-email'

export async function createDocumentRequest(
  formData: FormData
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const serviceId = String(
    formData.get('service_id') ?? ''
  )

  const clientId = String(
    formData.get('client_id') ?? ''
  )

  const title = String(
    formData.get('title') ?? ''
  )

  const description = String(
    formData.get('description') ?? ''
  )

  if (!serviceId) {
    throw new Error('Service is required')
  }

  if (!clientId) {
    throw new Error('Client is required')
  }

  if (!title) {
    throw new Error('Document title is required')
  }

  /*
  ==========================================================
  GET SERVICE + CLIENT INFORMATION
  ==========================================================
  */

  const {
    data: service,
    error: serviceError,
  } = await supabase
    .from('services')
    .select(`
      id,
      title,
      client:clients(
        id,
        profile_id
      )
    `)
    .eq('id', serviceId)
    .single()

  if (serviceError || !service) {
    throw new Error('Service not found')
  }

  const clientProfileId =
    service.client?.profile_id

  if (!clientProfileId) {
    throw new Error(
      'Client profile not found'
    )
  }

  /*
  ==========================================================
  CREATE DOCUMENT REQUEST
  ==========================================================
  */

  const {
    data: documentRequest,
    error: documentError,
  } = await supabase
    .from('document_requests')
    .insert({
      service_id: serviceId,
      client_id: clientId,
      title,
      description,
      created_by: user.id,
    })
    .select()
    .single()

  if (documentError) {
    throw new Error(
      documentError.message
    )
  }

  /*
  ==========================================================
  ACTIVITY LOG
  ==========================================================
  */

  await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,
      client_id: clientId,
      role: 'staff',
      action: 'Requested Document',
      description:
        `${title} requested for ${service.title}`,
      entity_type: 'service',
      entity_id: serviceId,
    })

  /*
  ==========================================================
  CLIENT NOTIFICATION
  ==========================================================
  */

  const {
    error: notificationError,
  } = await supabase
    .from('notifications')
    .insert({
      user_id: clientProfileId,

      title: 'New Document Required',

      message:
        `${title} is required for your ${service.title} service.`,

      type: 'document',

      link:
        `/portal/cases/${serviceId}`,

      read: false,
    })

  if (notificationError) {
    console.error(
      'DOCUMENT NOTIFICATION FAILED:',
      notificationError
    )
  }

  /*
  ==========================================================
  GET CLIENT EMAIL
  ==========================================================
  */

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from('profiles')
    .select(
      'email, first_name'
    )
    .eq(
      'id',
      clientProfileId
    )
    .single()

  if (profileError) {
    console.error(
      'CLIENT PROFILE LOOKUP FAILED:',
      profileError
    )
  }

  /*
  ==========================================================
  EMAIL CLIENT
  ==========================================================
  */

  if (profile?.email) {
    try {
      await sendEmail({
        to: profile.email,

        subject:
          `Document Required - ${service.title}`,

        html: `
          <!DOCTYPE html>

          <html>

            <head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
              />
              <meta
                http-equiv="Content-Type"
                content="text/html; charset=UTF-8"
              />
              <title>
                Document Required
              </title>
            </head>

            <body
              style="
                margin:0;
                padding:0;
                background:#f4f7fb;
                font-family:Arial,Helvetica,sans-serif;
                color:#172033;
              "
            >

              <div
                style="
                  width:100%;
                  padding:40px 16px;
                  box-sizing:border-box;
                "
              >

                <div
                  style="
                    max-width:620px;
                    margin:0 auto;
                    background:#ffffff;
                    border-radius:18px;
                    overflow:hidden;
                    border:1px solid #e2e8f0;
                    box-shadow:0 8px 30px rgba(15,39,71,0.06);
                  "
                >

                  <!-- HEADER -->

                  <div
                    style="
                      background:#17365D;
                      padding:32px 28px;
                      text-align:center;
                    "
                  >

                    <div
                      style="
                        display:inline-block;
                        padding:10px 14px;
                        background:#1E88E5;
                        border-radius:10px;
                        margin-bottom:14px;
                      "
                    >

                      <span
                        style="
                          display:block;
                          color:#ffffff;
                          font-size:20px;
                          font-weight:700;
                          line-height:1;
                        "
                      >
                        P
                      </span>

                    </div>

                    <h1
                      style="
                        margin:0;
                        color:#ffffff;
                        font-size:20px;
                        line-height:1.3;
                        font-weight:700;
                        letter-spacing:0.3px;
                      "
                    >
                      POG ADVISORY
                    </h1>

                    <p
                      style="
                        margin:7px 0 0;
                        color:#cbd8e8;
                        font-size:12px;
                        line-height:1.5;
                        letter-spacing:0.5px;
                        text-transform:uppercase;
                      "
                    >
                      AND CHARTERED ACCOUNTANTS INC.
                    </p>

                  </div>

                  <!-- CONTENT -->

                  <div
                    style="
                      padding:36px 32px;
                    "
                  >

                    <p
                      style="
                        margin:0 0 8px;
                        color:#1E88E5;
                        font-size:12px;
                        line-height:1.5;
                        font-weight:700;
                        letter-spacing:1.5px;
                        text-transform:uppercase;
                      "
                    >
                      Document Request
                    </p>

                    <h2
                      style="
                        margin:0;
                        color:#17365D;
                        font-size:25px;
                        line-height:1.3;
                        font-weight:700;
                      "
                    >
                      Hello ${profile.first_name ?? 'Client'},
                    </h2>

                    <p
                      style="
                        margin:18px 0 0;
                        color:#475569;
                        font-size:15px;
                        line-height:1.7;
                      "
                    >
                      A document is required from you
                      to continue processing your
                      accounting service.
                    </p>

                    <!-- DOCUMENT CARD -->

                    <div
                      style="
                        margin:28px 0 20px;
                        padding:22px;
                        background:#f8fafc;
                        border-radius:14px;
                        border:1px solid #e2e8f0;
                      "
                    >

                      <p
                        style="
                          margin:0 0 9px;
                          color:#64748b;
                          font-size:11px;
                          line-height:1.4;
                          font-weight:700;
                          letter-spacing:1px;
                          text-transform:uppercase;
                        "
                      >
                        Document Required
                      </p>

                      <p
                        style="
                          margin:0;
                          color:#17365D;
                          font-size:18px;
                          line-height:1.4;
                          font-weight:700;
                        "
                      >
                        ${title}
                      </p>

                      ${
                        description
                          ? `
                            <p
                              style="
                                margin:14px 0 0;
                                color:#475569;
                                font-size:14px;
                                line-height:1.7;
                              "
                            >
                              ${description}
                            </p>
                          `
                          : ''
                      }

                    </div>

                    <!-- SERVICE -->

                    <div
                      style="
                        margin:20px 0;
                        padding:16px 18px;
                        background:#eef6ff;
                        border-left:4px solid #1E88E5;
                        border-radius:8px;
                      "
                    >

                      <p
                        style="
                          margin:0;
                          color:#475569;
                          font-size:14px;
                          line-height:1.6;
                        "
                      >
                        <strong
                          style="
                            color:#17365D;
                          "
                        >
                          Service:
                        </strong>

                        ${service.title}

                      </p>

                    </div>

                    <p
                      style="
                        margin:24px 0 0;
                        color:#475569;
                        font-size:15px;
                        line-height:1.7;
                      "
                    >
                      Please sign in to your secure
                      client portal to upload the
                      requested document.
                    </p>

                    <!-- BUTTON -->

                    <div
                      style="
                        text-align:center;
                        margin:32px 0;
                      "
                    >

                      <a
                        href="${process.env.NEXT_PUBLIC_SITE_URL}/portal/cases/${serviceId}"
                        style="
                          display:inline-block;
                          padding:14px 26px;
                          background:#1E88E5;
                          color:#ffffff;
                          text-decoration:none;
                          border-radius:10px;
                          font-size:14px;
                          font-weight:700;
                        "
                      >
                        Upload Document
                      </a>

                    </div>

                    <p
                      style="
                        margin:30px 0 0;
                        padding-top:24px;
                        border-top:1px solid #e2e8f0;
                        color:#64748b;
                        font-size:13px;
                        line-height:1.7;
                      "
                    >
                      Kind regards,<br />

                      <strong
                        style="
                          color:#17365D;
                        "
                      >
                        POG ADVISORY
                      </strong>

                      <br />

                      AND CHARTERED ACCOUNTANTS INC.

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
                        font-size:11px;
                        line-height:1.6;
                      "
                    >
                      This email was sent from the
                      POG Advisory secure client portal.
                    </p>

                    <p
                      style="
                        margin:5px 0 0;
                        color:#94a3b8;
                        font-size:11px;
                      "
                    >
                      Please do not reply directly
                      to this automated email.
                    </p>

                  </div>

                </div>

              </div>

            </body>

          </html>
        `,
      })

      console.log(
        'DOCUMENT REQUEST EMAIL SENT'
      )

    } catch (error) {
      /*
      Email failure should NOT
      prevent the document request
      from being created.
      */

      console.error(
        'DOCUMENT REQUEST EMAIL FAILED:',
        error
      )
    }
  }

  /*
  ==========================================================
  REFRESH PAGES
  ==========================================================
  */

  revalidatePath(
    `/staff/services/${serviceId}`
  )

  revalidatePath(
    `/portal/cases/${serviceId}`
  )

  revalidatePath(
    '/portal'
  )

  revalidatePath(
    '/portal/notifications'
  )
}

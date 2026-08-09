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
          "
        >
          POG ADVISORY AND CHARTERED ACCOUNTANTS INC.
        </h1>

        <p
          style="
            margin:8px 0 0;
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
            margin-top:0;
            font-size:22px;
          "
        >
          Hello ${profile.first_name ?? 'Client'},
        </h2>

        <p
          style="
            color:#475569;
            line-height:1.6;
          "
        >
          A new document has been requested
          for your accounting service.
        </p>

        <!-- DOCUMENT -->

        <div
          style="
            margin:24px 0;
            padding:20px;
            background:#f8fafc;
            border-radius:12px;
            border:1px solid #e2e8f0;
          "
        >

          <p
            style="
              margin:0 0 8px;
              color:#64748b;
              font-size:12px;
              font-weight:bold;
              text-transform:uppercase;
            "
          >
            Document Required
          </p>

          <p
            style="
              margin:0;
              font-size:18px;
              font-weight:bold;
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
                    line-height:1.6;
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
            padding:16px;
            background:#eff6ff;
            border-radius:10px;
          "
        >

          <p
            style="
              margin:0;
              color:#475569;
              font-size:14px;
            "
          >
            Service:
            <strong>
              ${service.title}
            </strong>
          </p>

        </div>

        <p
          style="
            color:#475569;
            line-height:1.6;
          "
        >
          Please log into your secure client portal
          to upload the requested document.
        </p>

        <!-- BUTTON -->

        <div
          style="
            text-align:center;
            margin:30px 0;
          "
        >

          <a
            href="${process.env.NEXT_PUBLIC_SITE_URL}/portal/cases/${serviceId}"
            style="
              display:inline-block;
              padding:14px 24px;
              background:#1E88E5;
              color:#ffffff;
              text-decoration:none;
              border-radius:10px;
              font-weight:bold;
            "
          >
            Upload Document
          </a>

        </div>

        <p
          style="
            margin-top:30px;
            color:#64748b;
            font-size:14px;
            line-height:1.6;
          "
        >
          Kind regards,<br />
          <strong>
            POG ADVISORY AND CHARTERED ACCOUNTANTS INC.
          </strong>
        </p>

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

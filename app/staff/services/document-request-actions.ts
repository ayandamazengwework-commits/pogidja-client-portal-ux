'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/send-email'

interface RequestDocumentsInput {
  serviceId: string
  clientId: string
  documents: string
}

export async function requestDocuments({
  serviceId,
  clientId,
  documents,
}: RequestDocumentsInput) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  if (!serviceId) {
    throw new Error('Service ID is required')
  }

  if (!clientId) {
    throw new Error('Client ID is required')
  }

  if (!documents.trim()) {
    throw new Error('Please enter the documents required')
  }

  // ---------------------------------------------------
  // GET CLIENT
  // ---------------------------------------------------

  const {
    data: client,
    error: clientError,
  } = await supabase
    .from('clients')
    .select(`
      id,
      profile_id
    `)
    .eq('id', clientId)
    .single()

  if (clientError || !client) {
    throw new Error('Client not found')
  }

  // ---------------------------------------------------
  // GET SERVICE
  // ---------------------------------------------------

  const {
    data: service,
    error: serviceError,
  } = await supabase
    .from('services')
    .select(`
      id,
      title,
      client_id
    `)
    .eq('id', serviceId)
    .single()

  if (serviceError || !service) {
    throw new Error('Service not found')
  }

  if (service.client_id !== clientId) {
    throw new Error(
      'This service does not belong to the selected client'
    )
  }

  // ---------------------------------------------------
  // GET CLIENT PROFILE
  // ---------------------------------------------------

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from('profiles')
    .select(`
      email,
      first_name
    `)
    .eq('id', client.profile_id)
    .single()

  if (profileError) {
    console.error(
      'CLIENT PROFILE LOOKUP FAILED:',
      profileError
    )
  }

  // ---------------------------------------------------
  // SPLIT DOCUMENTS
  // ---------------------------------------------------

  const requestedDocuments = documents
    .split('\n')
    .map((document) => document.trim())
    .filter(Boolean)

  if (requestedDocuments.length === 0) {
    throw new Error(
      'Please enter at least one document'
    )
  }

  // ---------------------------------------------------
  // CREATE DOCUMENT REQUESTS
  // ---------------------------------------------------

  const documentRows = requestedDocuments.map(
    (document) => ({
      service_id: serviceId,
      client_id: clientId,
      title: document,
      description:
        `Document requested for ${service.title}`,
      required: true,
      uploaded: false,
      uploaded_at: null,
      uploaded_document: null,
      created_by: user.id,
    })
  )

  const {
    data: createdDocuments,
    error: documentError,
  } = await supabase
    .from('document_requests')
    .insert(documentRows)
    .select()

  if (documentError) {
    throw new Error(documentError.message)
  }

  console.log(
    'DOCUMENT REQUESTS CREATED:',
    createdDocuments?.length ?? 0
  )

  // ---------------------------------------------------
  // PORTAL NOTIFICATION
  // ---------------------------------------------------

  const { error: notificationError } =
    await supabase
      .from('notifications')
      .insert({
        user_id: client.profile_id,

        title: 'Documents Requested',

        message:
          `Your advisor has requested ${
            requestedDocuments.length
          } document${
            requestedDocuments.length === 1
              ? ''
              : 's'
          } for ${service.title}.`,

        type: 'documents',

        link:
          `/portal/cases/${serviceId}`,

        read: false,
      })

  if (notificationError) {
    console.error(
      'DOCUMENT REQUEST NOTIFICATION FAILED:',
      notificationError
    )
  }

  // ---------------------------------------------------
  // ACTIVITY LOG
  // ---------------------------------------------------

  const { error: activityError } =
    await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,

        role: 'staff',

        client_id: clientId,

        action: 'Requested Documents',

        description:
          requestedDocuments.join(', '),

        entity_type: 'service',

        entity_id: serviceId,
      })

  if (activityError) {
    console.error(
      'DOCUMENT REQUEST ACTIVITY LOG FAILED:',
      activityError
    )
  }

  // ---------------------------------------------------
  // EMAIL CLIENT
  // ---------------------------------------------------

  if (profile?.email) {
    try {
      await sendEmail({
        to: profile.email,

        subject:
          `Documents Required - ${service.title}`,

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
          POG ADVISORY AND
          CHARTERED ACCOUNTANTS INC.
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
          Your advisor has requested
          additional documents for your
          accounting service.
        </p>

        <!-- SERVICE -->

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
            Service
          </p>

          <p
            style="
              margin:0;
              font-size:18px;
              font-weight:bold;
            "
          >
            ${service.title}
          </p>

        </div>

        <!-- DOCUMENTS -->

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
              margin:0 0 12px;
              color:#64748b;
              font-size:12px;
              font-weight:bold;
              text-transform:uppercase;
            "
          >
            Documents Required
          </p>

          <ul
            style="
              margin:0;
              padding-left:20px;
              color:#334155;
              line-height:1.8;
            "
          >

            ${requestedDocuments
              .map(
                (document) =>
                  `<li>${document}</li>`
              )
              .join('')}

          </ul>

        </div>

        <p
          style="
            color:#475569;
            line-height:1.6;
          "
        >
          Please log into your secure client
          portal to upload the requested
          documents.
        </p>

        <!-- BUTTON -->

        <div
          style="
            text-align:center;
            margin:30px 0;
          "
        >

          <a
            href="${
              process.env.NEXT_PUBLIC_SITE_URL
            }/portal/cases/${serviceId}"
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
            Upload Documents
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
            POG ADVISORY AND
            CHARTERED ACCOUNTANTS INC.
          </strong>
        </p>

      </div>

    </div>

  </body>
</html>
        `,
      })

      console.log(
        'DOCUMENT REQUEST EMAIL SENT:',
        profile.email
      )
    } catch (error) {
      console.error(
        'DOCUMENT REQUEST EMAIL FAILED:',
        error
      )
    }
  }

  // ---------------------------------------------------
  // REFRESH PAGES
  // ---------------------------------------------------

  revalidatePath(
    `/staff/services/${serviceId}`
  )

  revalidatePath(
    '/staff/services'
  )

  revalidatePath(
    `/portal/cases/${serviceId}`
  )

  revalidatePath('/portal')

  revalidatePath('/portal/documents')

  revalidatePath('/portal/notifications')

  return {
    success: true,
    count: requestedDocuments.length,
  }
}

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

  console.log('========================================')
  console.log('DOCUMENT REQUEST STARTED')
  console.log('SERVICE ID:', serviceId)
  console.log('CLIENT ID:', clientId)
  console.log('========================================')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('STAFF USER:', user?.id)

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
  // CLIENT
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

  console.log('CLIENT:', client)
  console.log('CLIENT ERROR:', clientError)

  if (clientError || !client) {
    throw new Error('Client not found')
  }

  // ---------------------------------------------------
  // SERVICE
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

  console.log('SERVICE:', service)
  console.log('SERVICE ERROR:', serviceError)

  if (serviceError || !service) {
    throw new Error('Service not found')
  }

  if (service.client_id !== clientId) {
    throw new Error(
      'This service does not belong to the selected client'
    )
  }

  // ---------------------------------------------------
  // CLIENT PROFILE
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

  console.log('CLIENT PROFILE:', profile)
  console.log('CLIENT PROFILE ERROR:', profileError)

  // ---------------------------------------------------
  // CREATE DOCUMENT REQUESTS
  // ---------------------------------------------------
  //
  // The database stores each requested document as its
  // own row using:
  //
  // title
  // description
  // required
  // uploaded
  // created_by
  //
  // The textarea can contain multiple documents, one
  // per line. We create one request per line.
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

  console.log(
    'DOCUMENTS TO CREATE:',
    requestedDocuments
  )

  const documentRows = requestedDocuments.map(
    (document) => ({
      service_id: serviceId,
      client_id: clientId,
      title: document,
      description: `Document requested for ${service.title}`,
      required: true,
      uploaded: false,
      uploaded_at: null,
      uploaded_document: null,
      created_by: user.id,
    })
  )

  console.log('CREATING DOCUMENT REQUESTS...')

  const {
    data: createdDocuments,
    error: documentError,
  } = await supabase
    .from('document_requests')
    .insert(documentRows)
    .select()

  console.log(
    'CREATED DOCUMENT REQUESTS:',
    createdDocuments
  )

  console.log(
    'DOCUMENT REQUEST ERROR:',
    documentError
  )

  if (documentError) {
    throw new Error(documentError.message)
  }

  // ---------------------------------------------------
  // PORTAL NOTIFICATION
  // ---------------------------------------------------

  console.log('CREATING PORTAL NOTIFICATION...')

  const {
    error: notificationError,
  } = await supabase
    .from('notifications')
    .insert({
      user_id: client.profile_id,

      title: 'Documents Requested',

      message:
        `Your advisor has requested ${requestedDocuments.length} document${
          requestedDocuments.length === 1 ? '' : 's'
        } for ${service.title}.`,

      type: 'documents',

      link:
        `/portal/cases/${serviceId}`,

      read: false,
    })

  console.log(
    'NOTIFICATION ERROR:',
    notificationError
  )

  /*
   * Notification failure should not undo the
   * document request.
   */
  if (notificationError) {
    console.error(
      'DOCUMENT REQUEST NOTIFICATION FAILED:',
      notificationError
    )
  }

  // ---------------------------------------------------
  // ACTIVITY LOG
  // ---------------------------------------------------

  console.log('CREATING ACTIVITY LOG...')

  const {
    error: activityError,
  } = await supabase
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

  console.log(
    'ACTIVITY LOG ERROR:',
    activityError
  )

  if (activityError) {
    console.error(
      'DOCUMENT REQUEST ACTIVITY LOG FAILED:',
      activityError
    )
  }

  // ---------------------------------------------------
  // EMAIL
  // ---------------------------------------------------

  if (profile?.email) {
    console.log(
      'SENDING DOCUMENT REQUEST EMAIL TO:',
      profile.email
    )

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
          "
        >
          POG Advisory
        </h1>

        <p
          style="
            margin:8px 0 0;
            color:#cbd5e1;
            font-size:14px;
          "
        >
          Document Request
        </p>

      </div>

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
          Your advisor at POG Advisory has requested
          additional documents for your service.
        </p>

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
              margin:0 0 10px;
              font-size:13px;
              color:#64748b;
            "
          >
            SERVICE
          </p>

          <p
            style="
              margin:0 0 24px;
              font-size:18px;
              font-weight:bold;
            "
          >
            ${service.title}
          </p>

          <p
            style="
              margin:0 0 12px;
              font-size:13px;
              color:#64748b;
            "
          >
            DOCUMENTS REQUIRED
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
          Please log into your POG Advisory Client
          Portal to upload the requested documents.
        </p>

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
          <strong>POG Advisory Team</strong>
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
  } else {
    console.log(
      'NO CLIENT EMAIL FOUND - EMAIL NOT SENT'
    )
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

  revalidatePath(
    '/portal'
  )

  revalidatePath(
    '/portal/documents'
  )

  revalidatePath(
    '/portal/notifications'
  )

  console.log('========================================')
  console.log('DOCUMENT REQUEST COMPLETED')
  console.log(
    'DOCUMENT COUNT:',
    requestedDocuments.length
  )
  console.log('========================================')

  return {
    success: true,
    count: requestedDocuments.length,
  }
}

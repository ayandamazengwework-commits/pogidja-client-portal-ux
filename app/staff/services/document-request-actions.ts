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
  console.log('========================================')
  console.log('DOCUMENT REQUEST STARTED')
  console.log('SERVICE ID:', serviceId)
  console.log('CLIENT ID:', clientId)
  console.log('========================================')

  const supabase = await createClient()

  // ---------------------------------------------------
  // AUTH
  // ---------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('STAFF USER:', user?.id ?? null)

  if (!user) {
    throw new Error('Not authenticated')
  }

  // ---------------------------------------------------
  // VALIDATION
  // ---------------------------------------------------

  const cleanedDocuments = documents.trim()

  if (!serviceId) {
    throw new Error('Service ID is required')
  }

  if (!clientId) {
    throw new Error('Client ID is required')
  }

  if (!cleanedDocuments) {
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
    .select('id, profile_id')
    .eq('id', clientId)
    .single()

  console.log('CLIENT:', client)
  console.log('CLIENT ERROR:', clientError)

  if (clientError || !client) {
    throw new Error('Client not found')
  }

  if (!client.profile_id) {
    throw new Error('Client profile not found')
  }

  // ---------------------------------------------------
  // GET SERVICE
  // ---------------------------------------------------

  const {
    data: service,
    error: serviceError,
  } = await supabase
    .from('services')
    .select('id, title, client_id')
    .eq('id', serviceId)
    .single()

  console.log('SERVICE:', service)
  console.log('SERVICE ERROR:', serviceError)

  if (serviceError || !service) {
    throw new Error('Service not found')
  }

  // ---------------------------------------------------
  // VERIFY CLIENT BELONGS TO SERVICE
  // ---------------------------------------------------

  if (service.client_id !== clientId) {
    throw new Error(
      'Client does not belong to this service'
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
    .select('email, first_name')
    .eq('id', client.profile_id)
    .single()

  console.log('CLIENT PROFILE:', profile)
  console.log('CLIENT PROFILE ERROR:', profileError)

  if (profileError) {
    console.error(
      'CLIENT PROFILE FETCH FAILED:',
      profileError
    )
  }

  // ---------------------------------------------------
  // SAVE DOCUMENT REQUEST
  // ---------------------------------------------------

  console.log('CREATING DOCUMENT REQUEST...')

  const {
    data: documentRequest,
    error: documentError,
  } = await supabase
    .from('document_requests')
    .insert({
      service_id: serviceId,
      client_id: clientId,
      requested_documents: cleanedDocuments,
      status: 'Pending',
    })
    .select()
    .single()

  console.log(
    'DOCUMENT REQUEST:',
    documentRequest
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

  console.log(
    'CREATING CLIENT PORTAL NOTIFICATION...'
  )

  const {
    error: notificationError,
  } = await supabase
    .from('notifications')
    .insert({
      user_id: client.profile_id,

      title: 'Documents Requested',

      message:
        `Your advisor has requested additional documents for ${service.title}.`,

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

    /*
    We do NOT throw here.

    The document request has already been created.
    A notification failure should not make staff
    think the document request failed.
    */
  } else {
    console.log(
      'CLIENT PORTAL NOTIFICATION CREATED'
    )
  }

  // ---------------------------------------------------
  // ACTIVITY LOG
  // ---------------------------------------------------

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
        `Requested documents for ${service.title}: ${cleanedDocuments}`,

      entity_type: 'service',

      entity_id: serviceId,
    })

  if (activityError) {
    console.error(
      'DOCUMENT REQUEST ACTIVITY LOG FAILED:',
      activityError
    )
  } else {
    console.log(
      'DOCUMENT REQUEST ACTIVITY LOG CREATED'
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
          Client Portal
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
            color:#0f172a;
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
          Your POG Advisory advisor requires
          additional documents to continue processing
          your service.
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
              font-size:13px;
              color:#64748b;
              text-transform:uppercase;
              letter-spacing:0.05em;
            "
          >
            SERVICE
          </p>

          <p
            style="
              margin:0;
              font-size:18px;
              font-weight:bold;
              color:#0f172a;
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
            background:#ffffff;
            border-radius:12px;
            border:1px solid #e2e8f0;
          "
        >

          <p
            style="
              margin:0 0 12px;
              font-size:13px;
              color:#64748b;
              text-transform:uppercase;
              letter-spacing:0.05em;
            "
          >
            DOCUMENTS REQUIRED
          </p>

          <div
            style="
              color:#334155;
              line-height:1.7;
              white-space:pre-wrap;
              font-size:15px;
            "
          >
            ${cleanedDocuments}
          </div>

        </div>

        <p
          style="
            color:#475569;
            line-height:1.6;
          "
        >
          Please log into your POG Advisory Client Portal
          and upload the requested documents.
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
            Upload Documents
          </a>

        </div>

        <p
          style="
            color:#64748b;
            font-size:14px;
            line-height:1.6;
          "
        >
          If you have already submitted these documents,
          you can ignore this email.
        </p>

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
      /*
      Email failure must NOT undo the
      document request.
      */

      console.error(
        'DOCUMENT REQUEST EMAIL FAILED:',
        error
      )
    }
  } else {
    console.warn(
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
    `/staff/clients/${clientId}`
  )

  revalidatePath(
    '/portal'
  )

  revalidatePath(
    `/portal/cases/${serviceId}`
  )

  revalidatePath(
    '/portal/documents'
  )

  revalidatePath(
    '/portal/notifications'
  )

  console.log('========================================')
  console.log('DOCUMENT REQUEST COMPLETED')
  console.log('REQUEST ID:', documentRequest?.id)
  console.log('========================================')

  return {
    success: true,
    documentRequestId: documentRequest?.id,
  }
}

'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/send-email'

/*
==========================================================
UPDATE SERVICE STATUS
==========================================================
*/

export async function updateServiceStatus(
  serviceId: string,
  status: string
) {
  console.log('==========================================')
  console.log('UPDATE SERVICE STATUS STARTED')
  console.log('SERVICE ID:', serviceId)
  console.log('NEW STATUS:', status)
  console.log('==========================================')

  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  console.log('AUTH USER:', user?.id)
  console.log('AUTH ERROR:', authError)

  if (!user) {
    console.error('UPDATE SERVICE STATUS FAILED: NOT AUTHENTICATED')
    throw new Error('Not authenticated')
  }

  if (!serviceId) {
    console.error('UPDATE SERVICE STATUS FAILED: NO SERVICE ID')
    throw new Error('Service ID is required')
  }

  if (!status) {
    console.error('UPDATE SERVICE STATUS FAILED: NO STATUS')
    throw new Error('Status is required')
  }

  /*
  --------------------------------------------------------
  GET SERVICE + CLIENT
  --------------------------------------------------------
  */

  console.log('FETCHING SERVICE:', serviceId)

  const {
    data: service,
    error: serviceError,
  } = await supabase
    .from('services')
    .select(`
      *,
      client:clients(
        profile_id
      )
    `)
    .eq('id', serviceId)
    .single()

  console.log('SERVICE:', service)
  console.log('SERVICE FETCH ERROR:', serviceError)

  if (serviceError || !service) {
    console.error(
      'SERVICE FETCH FAILED:',
      serviceError
    )

    throw new Error('Service not found')
  }

  const previousStatus = service.status

  console.log('PREVIOUS STATUS:', previousStatus)
  console.log('NEW STATUS:', status)

  /*
  --------------------------------------------------------
  DON'T DO ANYTHING IF STATUS DID NOT CHANGE
  --------------------------------------------------------
  */

  if (previousStatus === status) {
    console.log(
      'STATUS DID NOT CHANGE - NOTHING TO DO'
    )

    return {
      success: true,
      changed: false,
    }
  }

  /*
  --------------------------------------------------------
  UPDATE SERVICE
  --------------------------------------------------------
  */

  console.log('UPDATING SERVICE STATUS...')

  const {
    error: updateError,
  } = await supabase
    .from('services')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', serviceId)

  console.log('SERVICE UPDATE ERROR:', updateError)

  if (updateError) {
    console.error(
      'SERVICE STATUS UPDATE FAILED:',
      updateError
    )

    throw new Error(updateError.message)
  }

  console.log(
    'SERVICE STATUS UPDATED SUCCESSFULLY'
  )

  /*
  --------------------------------------------------------
  ACTIVITY LOG
  --------------------------------------------------------
  */

  console.log('CREATING ACTIVITY LOG...')

  const {
    data: activityLog,
    error: activityError,
  } = await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,

      action: 'Service Status Updated',

      description:
        `${service.title}: ${previousStatus} → ${status}`,

      entity_type: 'service',

      entity_id: service.id,
    })
    .select()
    .single()

  console.log('ACTIVITY LOG:', activityLog)
  console.log('ACTIVITY LOG ERROR:', activityError)

  if (activityError) {
    console.error(
      'ACTIVITY LOG FAILED:',
      activityError
    )
  } else {
    console.log(
      'ACTIVITY LOG CREATED SUCCESSFULLY'
    )
  }

  /*
  --------------------------------------------------------
  GET CLIENT PROFILE ID
  --------------------------------------------------------
  */

  const clientProfileId =
    service.client?.profile_id

  console.log(
    'CLIENT PROFILE ID:',
    clientProfileId
  )

  if (!clientProfileId) {
    console.error(
      'NO CLIENT PROFILE ID FOUND'
    )

    revalidatePath(
      `/staff/services/${serviceId}`
    )

    revalidatePath(
      '/staff/services'
    )

    return {
      success: true,
      changed: true,
      notificationSent: false,
      emailSent: false,
    }
  }

  /*
  --------------------------------------------------------
  CREATE PORTAL NOTIFICATION
  --------------------------------------------------------
  */

  console.log(
    'CREATING PORTAL NOTIFICATION...'
  )

  const {
    data: notification,
    error: notificationError,
  } = await supabase
    .from('notifications')
    .insert({
      user_id: clientProfileId,

      title: 'Service Status Updated',

      message:
        `${service.title} is now ${status}.`,

      type: 'service',

      link:
        `/portal/cases/${service.id}`,

      read: false,
    })
    .select()
    .single()

  console.log(
    'PORTAL NOTIFICATION:',
    notification
  )

  console.log(
    'PORTAL NOTIFICATION ERROR:',
    notificationError
  )

  if (notificationError) {
    console.error(
      'SERVICE NOTIFICATION FAILED:',
      notificationError
    )
  } else {
    console.log(
      'PORTAL NOTIFICATION CREATED SUCCESSFULLY'
    )
  }

  /*
  --------------------------------------------------------
  GET CLIENT EMAIL
  --------------------------------------------------------
  */

  console.log(
    'FETCHING CLIENT PROFILE...'
  )

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

  console.log(
    'CLIENT PROFILE:',
    profile
  )

  console.log(
    'CLIENT PROFILE ERROR:',
    profileError
  )

  if (profileError) {
    console.error(
      'CLIENT PROFILE FETCH FAILED:',
      profileError
    )
  }

  /*
  --------------------------------------------------------
  SEND EMAIL
  --------------------------------------------------------
  */

  let emailSent = false

  if (profile?.email) {

    console.log(
      'CLIENT EMAIL FOUND:',
      profile.email
    )

    console.log(
      'STARTING SERVICE STATUS EMAIL...'
    )

    try {

      await sendEmail({

        to: profile.email,

        subject:
          `Service Update - ${service.title}`,

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
          Client Portal Update
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
          There has been an update to your
          service on the POG Advisory Client Portal.
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
              margin:0 0 18px;
              font-size:18px;
              font-weight:bold;
            "
          >
            ${service.title}
          </p>

          <p
            style="
              margin:0 0 8px;
              color:#64748b;
            "
          >
            Previous status:
            <strong>
              ${previousStatus}
            </strong>
          </p>

          <p
            style="
              margin:0;
              color:#64748b;
            "
          >
            New status:
            <strong>
              ${status}
            </strong>
          </p>

        </div>

        <p
          style="
            color:#475569;
            line-height:1.6;
          "
        >
          Please log into your client portal
          to view the latest information.
        </p>

        <div
          style="
            text-align:center;
            margin:30px 0;
          "
        >

          <a
            href="${process.env.NEXT_PUBLIC_SITE_URL}/portal/cases/${service.id}"
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
            View Service
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

      emailSent = true

      console.log(
        '=========================================='
      )

      console.log(
        'SERVICE STATUS EMAIL SENT SUCCESSFULLY'
      )

      console.log(
        'EMAIL:',
        profile.email
      )

      console.log(
        '=========================================='
      )

    } catch (error) {

      console.error(
        '=========================================='
      )

      console.error(
        'SERVICE STATUS EMAIL FAILED'
      )

      console.error(
        'EMAIL:',
        profile.email
      )

      console.error(
        'ERROR:',
        error
      )

      console.error(
        '=========================================='
      )
    }

  } else {

    console.error(
      'NO CLIENT EMAIL AVAILABLE - EMAIL NOT SENT'
    )
  }

  /*
  --------------------------------------------------------
  REVALIDATE
  --------------------------------------------------------
  */

  console.log(
    'REVALIDATING SERVICE PAGES...'
  )

  revalidatePath(
    `/staff/services/${serviceId}`
  )

  revalidatePath(
    '/staff/services'
  )

  revalidatePath(
    '/portal'
  )

  revalidatePath(
    '/portal/notifications'
  )

  console.log(
    'UPDATE SERVICE STATUS FINISHED'
  )

  console.log(
    'EMAIL SENT:',
    emailSent
  )

  console.log('==========================================')

  return {
    success: true,
    changed: true,
    notificationSent:
      !notificationError,
    emailSent,
  }
}


/*
==========================================================
TOGGLE CHECKLIST ITEM
==========================================================
*/

export async function toggleChecklistItem(
  serviceId: string,
  checklistId: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const {
    data: item,
    error,
  } = await supabase
    .from('service_checklist')
    .select(
      'completed,title'
    )
    .eq(
      'id',
      checklistId
    )
    .single()

  if (error || !item) {
    throw new Error(
      error?.message ??
        'Checklist item not found'
    )
  }

  const completed =
    !item.completed

  const {
    error: updateError,
  } = await supabase
    .from('service_checklist')
    .update({
      completed,

      completed_at:
        completed
          ? new Date().toISOString()
          : null,

      completed_by:
        completed
          ? user.id
          : null,
    })
    .eq(
      'id',
      checklistId
    )

  if (updateError) {
    throw new Error(
      updateError.message
    )
  }

  const {
    error: activityError,
  } = await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,

      entity_type: 'service',

      entity_id: serviceId,

      action:
        completed
          ? 'Checklist Completed'
          : 'Checklist Reopened',

      description: item.title,
    })

  if (activityError) {
    console.error(
      'CHECKLIST ACTIVITY LOG FAILED:',
      activityError
    )
  }

  revalidatePath(
    `/staff/services/${serviceId}`
  )
}


/*
==========================================================
CREATE CHECKLIST ITEM
==========================================================
*/

export async function createChecklistItem(
  serviceId: string,
  title: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  if (!title.trim()) {
    throw new Error(
      'Checklist title is required'
    )
  }

  const {
    error,
  } = await supabase
    .from('service_checklist')
    .insert({
      service_id: serviceId,

      title: title.trim(),

      completed: false,
    })

  if (error) {
    throw new Error(
      error.message
    )
  }

  const {
    error: activityError,
  } = await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,

      entity_type: 'service',

      entity_id: serviceId,

      action:
        'Checklist Item Added',

      description: title.trim(),
    })

  if (activityError) {
    console.error(
      'CHECKLIST ITEM ACTIVITY LOG FAILED:',
      activityError
    )
  }

  revalidatePath(
    `/staff/services/${serviceId}`
  )
}


/*
==========================================================
SAVE INTERNAL NOTES
==========================================================
*/

export async function saveInternalNotes(
  serviceId: string,
  notes: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const {
    error,
  } = await supabase
    .from('services')
    .update({
      internal_notes: notes,
    })
    .eq(
      'id',
      serviceId
    )

  if (error) {
    throw new Error(
      error.message
    )
  }

  const {
    error: activityError,
  } = await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,

      entity_type: 'service',

      entity_id: serviceId,

      action:
        'Updated Internal Notes',

      description:
        'Internal notes updated',
    })

  if (activityError) {
    console.error(
      'INTERNAL NOTES ACTIVITY LOG FAILED:',
      activityError
    )
  }

  revalidatePath(
    `/staff/services/${serviceId}`
  )
}


/*
==========================================================
CREATE DOCUMENT REQUEST
==========================================================
*/

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

  const serviceId =
    String(
      formData.get('service_id') ?? ''
    ).trim()

  const clientId =
    String(
      formData.get('client_id') ?? ''
    ).trim()

  const title =
    String(
      formData.get('title') ?? ''
    ).trim()

  const description =
    String(
      formData.get('description') ?? ''
    ).trim()

  if (!serviceId) {
    throw new Error(
      'Service ID is required'
    )
  }

  if (!clientId) {
    throw new Error(
      'Client ID is required'
    )
  }

  if (!title) {
    throw new Error(
      'Document title is required'
    )
  }

  /*
  --------------------------------------------------------
  GET SERVICE + CLIENT
  --------------------------------------------------------
  */

  const {
    data: service,
    error: serviceError,
  } = await supabase
    .from('services')
    .select(`
      id,
      title,
      client_id,
      client:clients(
        profile_id
      )
    `)
    .eq(
      'id',
      serviceId
    )
    .single()

  if (
    serviceError ||
    !service
  ) {
    console.error(
      'DOCUMENT REQUEST SERVICE FETCH FAILED:',
      serviceError
    )

    throw new Error(
      'Service not found'
    )
  }

  /*
  --------------------------------------------------------
  VERIFY CLIENT
  --------------------------------------------------------
  */

  if (
    service.client_id !== clientId
  ) {
    throw new Error(
      'Client does not belong to this service'
    )
  }

  const profileId =
    service.client?.profile_id

  if (!profileId) {
    throw new Error(
      'Client profile not found'
    )
  }

  /*
  --------------------------------------------------------
  CREATE DOCUMENT REQUEST
  --------------------------------------------------------
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
    console.error(
      'DOCUMENT REQUEST CREATE FAILED:',
      documentError
    )

    throw new Error(
      documentError.message
    )
  }

  /*
  --------------------------------------------------------
  CREATE PORTAL NOTIFICATION
  --------------------------------------------------------
  */

  const {
    error: notificationError,
  } = await supabase
    .from('notifications')
    .insert({
      user_id: profileId,

      title: 'Document Required',

      message:
        `Please provide the following document for ${service.title}: ${title}`,

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
  } else {
    console.log(
      'DOCUMENT NOTIFICATION CREATED'
    )
  }

  /*
  --------------------------------------------------------
  GET CLIENT EMAIL
  --------------------------------------------------------
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
      profileId
    )
    .single()

  if (profileError) {
    console.error(
      'CLIENT PROFILE FETCH FAILED:',
      profileError
    )
  }

  /*
  --------------------------------------------------------
  SEND DOCUMENT REQUEST EMAIL
  --------------------------------------------------------
  */

  if (profile?.email) {

    console.log(
      'SENDING DOCUMENT REQUEST EMAIL TO:',
      profile.email
    )

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
          POG Advisory requires a document from you
          in order to continue processing your service.
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
              margin:0 0 10px;
              font-size:13px;
              color:#64748b;
            "
          >
            DOCUMENT REQUIRED
          </p>

          <p
            style="
              margin:0;
              font-size:17px;
              font-weight:bold;
            "
          >
            ${title}
          </p>

          ${
            description
              ? `
          <div
            style="
              margin-top:18px;
              padding-top:18px;
              border-top:1px solid #e2e8f0;
            "
          >

            <p
              style="
                margin:0 0 8px;
                font-size:13px;
                color:#64748b;
              "
            >
              DETAILS
            </p>

            <p
              style="
                margin:0;
                color:#475569;
                line-height:1.6;
              "
            >
              ${description}
            </p>

          </div>
          `
              : ''
          }

        </div>

        <p
          style="
            color:#475569;
            line-height:1.6;
          "
        >
          Please log into your POG Advisory Client Portal
          and upload the requested document.
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
            Upload Document
          </a>

        </div>

        <p
          style="
            color:#64748b;
            font-size:14px;
            line-height:1.6;
          "
        >
          If you have already provided this document,
          you can ignore this notification.
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

      console.error(
        'DOCUMENT REQUEST EMAIL FAILED:',
        error
      )
    }
  } else {
    console.error(
      'NO CLIENT EMAIL FOUND FOR DOCUMENT REQUEST'
    )
  }

  /*
  --------------------------------------------------------
  ACTIVITY LOG
  --------------------------------------------------------
  */

  const {
    error: activityError,
  } = await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,

      client_id: clientId,

      role: 'staff',

      action:
        'Requested Document',

      description:
        description
          ? `${title} - ${description}`
          : title,

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

  /*
  --------------------------------------------------------
  REVALIDATE
  --------------------------------------------------------
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

  return {
    success: true,
    documentRequestId:
      documentRequest?.id,
  }
}


/*
==========================================================
MANUAL CLIENT NOTIFICATION
==========================================================
*/

export async function notifyClient(
  serviceId: string,
  title: string,
  message: string
) {
  console.log('==========================================')
  console.log('NOTIFY CLIENT STARTED')
  console.log('SERVICE ID:', serviceId)
  console.log('TITLE:', title)
  console.log('==========================================')

  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  console.log('AUTH USER:', user?.id)
  console.log('AUTH ERROR:', authError)

  if (!user) {
    throw new Error('Not authenticated')
  }

  if (!title.trim()) {
    throw new Error(
      'Notification title is required'
    )
  }

  if (!message.trim()) {
    throw new Error(
      'Notification message is required'
    )
  }

  /*
  --------------------------------------------------------
  GET SERVICE + CLIENT
  --------------------------------------------------------
  */

  const {
    data: service,
    error: serviceError,
  } = await supabase
    .from('services')
    .select(`
      title,
      client:clients(
        profile_id
      )
    `)
    .eq(
      'id',
      serviceId
    )
    .single()

  console.log('SERVICE:', service)
  console.log(
    'SERVICE ERROR:',
    serviceError
  )

  if (
    serviceError ||
    !service
  ) {
    throw new Error(
      'Service not found'
    )
  }

  const profileId =
    service.client?.profile_id

  console.log(
    'CLIENT PROFILE ID:',
    profileId
  )

  if (!profileId) {
    throw new Error(
      'Client profile not found'
    )
  }

  /*
  --------------------------------------------------------
  GET CLIENT PROFILE
  --------------------------------------------------------
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
      profileId
    )
    .single()

  console.log(
    'CLIENT PROFILE:',
    profile
  )

  console.log(
    'PROFILE ERROR:',
    profileError
  )

  /*
  --------------------------------------------------------
  PORTAL NOTIFICATION
  --------------------------------------------------------
  */

  console.log(
    'CREATING CLIENT NOTIFICATION...'
  )

  const {
    data: notification,
    error: notificationError,
  } = await supabase
    .from('notifications')
    .insert({
      user_id: profileId,

      title: title.trim(),

      message: message.trim(),

      type: 'service',

      link:
        `/portal/cases/${serviceId}`,

      read: false,
    })
    .select()
    .single()

  console.log(
    'NOTIFICATION:',
    notification
  )

  console.log(
    'NOTIFICATION ERROR:',
    notificationError
  )

  if (notificationError) {
    console.error(
      'NOTIFICATION FAILED:',
      notificationError
    )
  } else {
    console.log(
      'CLIENT NOTIFICATION CREATED SUCCESSFULLY'
    )
  }

  /*
  --------------------------------------------------------
  EMAIL NOTIFICATION
  --------------------------------------------------------
  */

  let emailSent = false

  if (profile?.email) {

    console.log(
      'SENDING CLIENT NOTIFICATION EMAIL TO:',
      profile.email
    )

    try {

      await sendEmail({

        to: profile.email,

        subject: title.trim(),

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
          "
        >
          Client Portal
        </p>

      </div>

      <div
        style="
          padding:32px;
        "
      >

        <h2>
          Hello ${profile.first_name ?? 'Client'},
        </h2>

        <p
          style="
            color:#475569;
            line-height:1.6;
          "
        >
          ${message.trim()}
        </p>

        <div
          style="
            margin:24px 0;
            padding:20px;
            background:#f8fafc;
            border-radius:12px;
          "
        >

          <strong>
            Service
          </strong>

          <p>
            ${service.title}
          </p>

        </div>

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
            Open Service
          </a>

        </div>

        <p
          style="
            color:#64748b;
            font-size:14px;
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

      emailSent = true

      console.log(
        '=========================================='
      )

      console.log(
        'CLIENT NOTIFICATION EMAIL SENT'
      )

      console.log(
        'EMAIL:',
        profile.email
      )

      console.log(
        '=========================================='
      )

    } catch (error) {

      console.error(
        '=========================================='
      )

      console.error(
        'CLIENT NOTIFICATION EMAIL FAILED'
      )

      console.error(
        error
      )

      console.error(
        '=========================================='
      )
    }

  } else {

    console.error(
      'NO CLIENT EMAIL FOUND - EMAIL NOT SENT'
    )
  }

  /*
  --------------------------------------------------------
  ACTIVITY LOG
  --------------------------------------------------------
  */

  console.log(
    'CREATING CLIENT NOTIFICATION ACTIVITY LOG...'
  )

  const {
    error: activityError,
  } = await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,

      entity_type: 'service',

      entity_id: serviceId,

      action:
        'Client Notified',

      description:
        title.trim(),
    })

  console.log(
    'CLIENT NOTIFICATION ACTIVITY LOG ERROR:',
    activityError
  )

  if (activityError) {
    console.error(
      'CLIENT NOTIFICATION ACTIVITY LOG FAILED:',
      activityError
    )
  } else {
    console.log(
      'CLIENT NOTIFICATION ACTIVITY LOG CREATED'
    )
  }

  /*
  --------------------------------------------------------
  REVALIDATE
  --------------------------------------------------------
  */

  revalidatePath(
    `/staff/services/${serviceId}`
  )

  revalidatePath(
    '/portal'
  )

  revalidatePath(
    '/portal/notifications'
  )

  console.log(
    'NOTIFY CLIENT FINISHED'
  )

  console.log(
    'EMAIL SENT:',
    emailSent
  )

  console.log('==========================================')

  return {
    success: true,
    notificationSent:
      !notificationError,
    emailSent,
  }
}

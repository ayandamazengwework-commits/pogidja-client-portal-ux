'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/send-email'

/*
==========================================================
CREATE SERVICE
==========================================================
*/

export async function createService(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  /*
  --------------------------------------------------------
  FORM DATA
  --------------------------------------------------------
  */

  const clientId =
    String(formData.get('client_id') ?? '').trim()

  if (!clientId) {
    throw new Error('Please select a client')
  }

  const title =
    String(formData.get('title') ?? '').trim()

  if (!title) {
    throw new Error('Service title is required')
  }

  const categoryId =
    String(
      formData.get('service_category_id') ?? ''
    ).trim()

  if (!categoryId) {
    throw new Error(
      'Please select a service category'
    )
  }

  const description =
    String(
      formData.get('description') ?? ''
    ).trim()

  const priority =
    String(
      formData.get('priority') ?? 'Normal'
    ).trim()

  const dueDate =
    String(
      formData.get('due_date') ?? ''
    ).trim()

  const progress =
    Number(
      formData.get('progress') || 0
    )

  const assignedTo =
    String(
      formData.get('assigned_to') ?? ''
    ).trim() || null

  /*
  --------------------------------------------------------
  GET SERVICE CATEGORY
  --------------------------------------------------------
  */

  const {
    data: category,
    error: categoryError,
  } = await supabase
    .from('service_categories')
    .select('name')
    .eq('id', categoryId)
    .single()

  if (categoryError) {
    console.error(
      'SERVICE CATEGORY FETCH FAILED:',
      categoryError
    )
  }

  const serviceType =
    category?.name ?? 'General'

  /*
  --------------------------------------------------------
  CREATE SERVICE
  --------------------------------------------------------
  */

  const {
    data: service,
    error,
  } = await supabase
    .from('services')
    .insert({
      client_id: clientId,

      assigned_to: assignedTo,

      title,

      service_type: serviceType,

      service_category_id: categoryId,

      description,

      priority,

      due_date: dueDate || null,

      progress,

      status: 'Pending',
    })
    .select()
    .single()

  if (error || !service) {
    console.error(
      'SERVICE CREATE FAILED:',
      error
    )

    throw new Error(
      error?.message ??
        'Failed to create service'
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

      role: 'staff',

      client_id: clientId,

      action: 'service_created',

      description:
        `Created service "${title}"`,

      entity_type: 'service',

      entity_id: service.id,
    })

  if (activityError) {
    console.error(
      'SERVICE CREATE ACTIVITY LOG FAILED:',
      activityError
    )
  }

  /*
  --------------------------------------------------------
  REVALIDATE
  --------------------------------------------------------
  */

  revalidatePath(
    '/staff/services'
  )

  revalidatePath(
    `/staff/services/${service.id}`
  )

  revalidatePath(
    `/staff/clients/${clientId}`
  )

  /*
  --------------------------------------------------------
  REDIRECT
  --------------------------------------------------------
  */

  redirect('/staff/services')
}


/*
==========================================================
UPDATE SERVICE
==========================================================
*/

export async function updateService(
  formData: FormData
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log(
    'UPDATE SERVICE - AUTH USER:',
    user?.id,
    user?.email
  )

  if (!user) {
    throw new Error('Unauthorized')
  }

  /*
  --------------------------------------------------------
  FORM DATA
  --------------------------------------------------------
  */

  const serviceId =
    String(
      formData.get('serviceId') ?? ''
    ).trim()

  const status =
    String(
      formData.get('status') ?? ''
    ).trim()

  const priority =
    String(
      formData.get('priority') ?? ''
    ).trim()

  const progress =
    Number(
      formData.get('progress') ?? 0
    )

  const dueDate =
    String(
      formData.get('due_date') ?? ''
    ).trim()

  console.log(
    'UPDATE SERVICE - FORM:',
    {
      serviceId,
      status,
      priority,
      progress,
      dueDate,
    }
  )

  if (!serviceId) {
    throw new Error(
      'Service ID missing'
    )
  }

  if (!status) {
    throw new Error(
      'Status is required'
    )
  }

  /*
  --------------------------------------------------------
  GET EXISTING SERVICE
  --------------------------------------------------------
  */

  const {
    data: service,
    error: serviceFetchError,
  } = await supabase
    .from('services')
    .select('*')
    .eq('id', serviceId)
    .single()

  if (
    serviceFetchError ||
    !service
  ) {
    console.error(
      'UPDATE SERVICE - SERVICE FETCH ERROR:',
      serviceFetchError
    )

    throw new Error(
      'Service not found'
    )
  }

  const previousStatus =
    service.status

  const previousPriority =
    service.priority

  const previousProgress =
    service.progress

  const previousDueDate =
    service.due_date

  console.log(
    'UPDATE SERVICE - PREVIOUS:',
    {
      previousStatus,
      previousPriority,
      previousProgress,
      previousDueDate,
    }
  )

  /*
  --------------------------------------------------------
  CHECK WHETHER STATUS CHANGED
  --------------------------------------------------------
  */

  const statusChanged =
    previousStatus !== status

  /*
  --------------------------------------------------------
  UPDATE SERVICE
  --------------------------------------------------------
  */

  const {
    error: updateError,
  } = await supabase
    .from('services')
    .update({
      status,

      priority,

      progress,

      due_date:
        dueDate || null,

      updated_at:
        new Date().toISOString(),
    })
    .eq(
      'id',
      serviceId
    )

  if (updateError) {
    console.error(
      'UPDATE SERVICE - DATABASE UPDATE ERROR:',
      updateError
    )

    throw new Error(
      updateError.message
    )
  }

  console.log(
    'UPDATE SERVICE - DATABASE UPDATED:',
    serviceId
  )

  /*
  ========================================================
  ACTIVITY LOG
  ========================================================
  */

  const {
    error: activityError,
  } = await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,

      role: 'staff',

      client_id:
        service.client_id,

      action:
        statusChanged
          ? 'service_status_updated'
          : 'service_updated',

      description:
        statusChanged
          ? `Updated "${service.title}" from ${previousStatus} to ${status} (${progress}%)`
          : `Updated "${service.title}" (${progress}%)`,

      entity_type: 'service',

      entity_id: serviceId,
    })

  if (activityError) {
    console.error(
      'UPDATE SERVICE - ACTIVITY LOG FAILED:',
      activityError
    )
  }

  /*
  ========================================================
  ONLY SEND CLIENT NOTIFICATION
  WHEN STATUS CHANGED
  ========================================================
  */

  if (statusChanged) {

    console.log(
      'UPDATE SERVICE - STATUS CHANGED:',
      previousStatus,
      '→',
      status
    )

    /*
    ------------------------------------------------------
    GET CLIENT PROFILE ID
    ------------------------------------------------------
    */

    const {
      data: client,
      error: clientError,
    } = await supabase
      .from('clients')
      .select(`
        id,
        profile_id
      `)
      .eq(
        'id',
        service.client_id
      )
      .single()

    console.log(
      'UPDATE SERVICE - CLIENT:',
      client,
      'ERROR:',
      clientError
    )

    if (
      clientError ||
      !client
    ) {
      console.error(
        'UPDATE SERVICE - CLIENT FETCH FAILED:',
        clientError
      )
    } else {

      const profileId =
        client.profile_id

      console.log(
        'UPDATE SERVICE - CLIENT PROFILE ID:',
        profileId
      )

      if (profileId) {

        /*
        ====================================================
        PORTAL NOTIFICATION
        ====================================================
        */

        const {
          error: notificationError,
        } = await supabase
          .from('notifications')
          .insert({
            user_id:
              profileId,

            title:
              'Service Status Updated',

            message:
              `${service.title} is now ${status}.`,

            type:
              'service',

            link:
              `/portal/cases/${serviceId}`,

            read: false,
          })

        if (notificationError) {
          console.error(
            'UPDATE SERVICE - NOTIFICATION FAILED:',
            notificationError
          )
        } else {
          console.log(
            'UPDATE SERVICE - PORTAL NOTIFICATION CREATED'
          )
        }

        /*
        ====================================================
        GET CLIENT EMAIL
        ====================================================
        */

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from('profiles')
          .select(`
            id,
            email,
            first_name
          `)
          .eq(
            'id',
            profileId
          )
          .single()

        console.log(
          'UPDATE SERVICE - CLIENT PROFILE:',
          profile,
          'ERROR:',
          profileError
        )

        if (profileError) {
          console.error(
            'UPDATE SERVICE - PROFILE FETCH FAILED:',
            profileError
          )
        }

        /*
        ====================================================
        SEND EMAIL
        ====================================================
        */

        if (
          profile?.email
        ) {

          console.log(
            'UPDATE SERVICE - ATTEMPTING EMAIL:',
            profile.email
          )

          const siteUrl =
            process.env.NEXT_PUBLIC_SITE_URL

          console.log(
            'UPDATE SERVICE - SITE URL:',
            siteUrl
          )

          try {

            await sendEmail({

              to:
                profile.email,

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
          Hello ${
            profile.first_name ??
            'Client'
          },
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

        ${
          siteUrl
            ? `
        <div
          style="
            text-align:center;
            margin:30px 0;
          "
        >

          <a
            href="${siteUrl}/portal/cases/${serviceId}"
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
        `
            : ''
        }

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
              'UPDATE SERVICE - EMAIL SENT SUCCESSFULLY:',
              profile.email
            )

          } catch (emailError) {

            console.error(
              'UPDATE SERVICE - EMAIL FAILED:',
              emailError
            )
          }

        } else {

          console.error(
            'UPDATE SERVICE - NO CLIENT EMAIL FOUND'
          )
        }
      }
    }
  } else {

    console.log(
      'UPDATE SERVICE - STATUS DID NOT CHANGE. NO EMAIL SENT.'
    )
  }

  /*
  ========================================================
  REVALIDATE
  ========================================================
  */

  revalidatePath(
    '/staff/services'
  )

  revalidatePath(
    `/staff/services/${serviceId}`
  )

  revalidatePath(
    `/staff/clients/${service.client_id}`
  )

  revalidatePath(
    '/portal'
  )

  revalidatePath(
    '/portal/notifications'
  )
}

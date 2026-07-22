'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/send-email'

export async function notifyClient(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const clientId = String(formData.get('clientId'))
  const title = String(formData.get('title'))
  const message = String(formData.get('message'))
  const link = String(formData.get('link') ?? '')

  if (!clientId || !title || !message) {
    throw new Error('Missing required fields')
  }

  // Get client profile
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select(`
      profile_id,
      profile:profiles(
        email,
        first_name,
        last_name
      )
    `)
    .eq('id', clientId)
    .single()

  if (clientError || !client) {
    throw new Error('Client not found')
  }

  // Create notification
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: client.profile_id,
      title,
      message,
      type: 'general',
      link,
      read: false,
    })

  if (error) {
    throw error
  }

  // Email
  const profile = Array.isArray(client.profile)
    ? client.profile[0]
    : client.profile

  if (profile?.email) {
    try {
      await sendEmail({
        to: profile.email,
        subject: title,
        html: `
          <h2>Hello ${profile.first_name ?? 'Client'},</h2>

          <p>${message}</p>

          <hr>

          <p>
            Please log into your portal to view this update.
          </p>
        `,
      })
    } catch (err) {
      console.error(err)
    }
  }

  // Activity Log
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    role: 'staff',
    client_id: clientId,
    entity_type: 'notification',
    entity_id: clientId,
    action: 'Notification Sent',
    description: title,
  })

  revalidatePath('/staff/clients')
  revalidatePath('/portal/notifications')
}

export async function markNotificationRead(id: string) {
  const supabase = await createClient()

  await supabase
    .from('notifications')
    .update({
      read: true,
    })
    .eq('id', id)

  revalidatePath('/portal/notifications')
}

export async function deleteNotification(id: string) {
  const supabase = await createClient()

  await supabase
    .from('notifications')
    .delete()
    .eq('id', id)

  revalidatePath('/portal/notifications')
}

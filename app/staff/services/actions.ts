'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/send-email'

export async function updateServiceStatus(
  serviceId: string,
  status: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: service } = await supabase
    .from('services')
    .select('*, client:clients(profile_id)')
    .eq('id', serviceId)
    .single()

  if (!service) throw new Error('Service not found')

  await supabase
    .from('services')
    .update({
      status,
    })
    .eq('id', serviceId)

  // Staff activity
  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action: 'Service Status Updated',
    description: `${service.title} → ${status}`,
    entity_type: 'service',
    entity_id: service.id,
  })

  const clientProfileId = service.client?.profile_id

  if (clientProfileId) {
    // Client notification
    await supabase.from('notifications').insert({
      user_id: clientProfileId,
      title: 'Service Updated',
      message: `${service.title} is now ${status}.`,
      type: 'service',
      link: `/portal/cases/${service.id}`,
      read: false,
    })

    const { data: profile } = await supabase
      .from('profiles')
      .select('email,first_name')
      .eq('id', clientProfileId)
      .single()

    if (profile?.email) {
      try {
        await sendEmail({
          to: profile.email,
          subject: 'Service Update',
          html: `
            <h2>Hello ${profile.first_name ?? 'Client'},</h2>

            <p>Your service has been updated.</p>

            <p><strong>${service.title}</strong></p>

            <p>Status: <strong>${status}</strong></p>

            <p>Please log into your portal for more information.</p>
          `,
        })
      } catch (e) {
        console.error(e)
      }
    }
  }

  revalidatePath(`/staff/services/${serviceId}`)
  revalidatePath('/portal')
  revalidatePath('/portal/notifications')
}

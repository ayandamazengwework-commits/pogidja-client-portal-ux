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

  // ---------------------------------------------------
  // Client
  // ---------------------------------------------------

  const { data: client } = await supabase
    .from('clients')
    .select('profile_id')
    .eq('id', clientId)
    .single()

  if (!client) {
    throw new Error('Client not found')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, first_name')
    .eq('id', client.profile_id)
    .single()

  // ---------------------------------------------------
  // Save request
  // ---------------------------------------------------

  await supabase
    .from('document_requests')
    .insert({
      service_id: serviceId,
      client_id: clientId,
      requested_documents: documents,
      status: 'Pending',
    })

  // ---------------------------------------------------
  // Notification
  // ---------------------------------------------------

  await supabase
    .from('notifications')
    .insert({
      user_id: client.profile_id,
      title: 'Documents Requested',
      message:
        'Your advisor has requested additional documents.',
      type: 'documents',
      link: `/portal/cases/${serviceId}`,
      read: false,
    })

  // ---------------------------------------------------
  // Activity
  // ---------------------------------------------------

  await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,
      action: 'Requested Documents',
      description: documents,
      entity_type: 'service',
      entity_id: serviceId,
    })

  // ---------------------------------------------------
  // Email
  // ---------------------------------------------------

  if (profile?.email) {
    try {
      await sendEmail({
        to: profile.email,
        subject: 'Documents Required',
        html: `
          <h2>Hello ${profile.first_name ?? 'Client'},</h2>

          <p>Your advisor requires the following documents:</p>

          <pre style="font-family:Arial;font-size:15px;">${documents}</pre>

          <p>Please log into your client portal and upload them at your earliest convenience.</p>
        `,
      })
    } catch (err) {
      console.error(err)
    }
  }

  revalidatePath(`/staff/services/${serviceId}`)
  revalidatePath('/portal')
  revalidatePath('/portal/documents')
  revalidatePath('/portal/notifications')
}

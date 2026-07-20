'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/send-email'

export async function sendMessage(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const recipientId = formData.get('recipientId') as string
  const serviceId = formData.get('serviceId') as string | null
  const subject = formData.get('subject') as string
  const body = formData.get('body') as string

  if (!recipientId || !body) {
    throw new Error('Missing required fields')
  }

  // --------------------------------------------------
  // Create Message
  // --------------------------------------------------

  const { error } = await supabase
    .from('messages')
    .insert({
      sender_id: user.id,
      recipient_id: recipientId,
      service_id: serviceId || null,
      subject,
      body,
      read: false,
    })

  if (error) throw error

  // --------------------------------------------------
  // Recipient Profile
  // --------------------------------------------------

  const { data: recipient } = await supabase
    .from('profiles')
    .select('email, first_name')
    .eq('id', recipientId)
    .single()

  // --------------------------------------------------
  // Email Notification
  // --------------------------------------------------

  if (recipient?.email) {
    try {
      await sendEmail({
        to: recipient.email,
        subject: subject || 'New message from POG Advisory',
        html: `
          <h2>Hello ${recipient.first_name ?? 'Client'},</h2>

          <p>You have received a new message from the POG Advisory team.</p>

          <p>${body}</p>

          <hr />

          <p>Please log into your client portal to reply.</p>
        `,
      })
    } catch (err) {
      console.error('Failed to send email:', err)
    }
  }

  // --------------------------------------------------
  // Client Record
  // --------------------------------------------------

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('profile_id', recipientId)
    .single()

  // --------------------------------------------------
  // Activity Log
  // --------------------------------------------------

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    role: 'staff',
    action: 'Message Sent',
    description: subject || 'New message',
    entity_type: 'message',
    entity_id: serviceId,
    client_id: client?.id ?? null,
  })

  // --------------------------------------------------
  // In-App Notification
  // --------------------------------------------------

  await supabase.from('notifications').insert({
    user_id: recipientId,
    title: 'New Message',
    message:
      subject && subject.length > 0
        ? subject
        : 'You have received a new message from POG Advisory.',
    type: 'message',
    link: '/portal/messages',
    read: false,
  })

  // --------------------------------------------------
  // Refresh
  // --------------------------------------------------

  revalidatePath('/staff/messages')

  if (client?.id) {
    revalidatePath(`/staff/clients/${client.id}`)
  }

  revalidatePath('/portal/messages')
  revalidatePath('/portal')
}

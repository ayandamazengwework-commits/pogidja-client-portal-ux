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

  // Create the message
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

  // Find the recipient's profile
  const { data: recipient } = await supabase
    .from('profiles')
    .select('email, first_name')
    .eq('id', recipientId)
    .single()

  // Send email notification
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
      // Don't fail the request if the email couldn't be sent.
    }
  }

  // Find the client record
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('profile_id', recipientId)
    .single()

  // Log activity
  await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,
      role: 'staff',
      action: 'Message Sent',
      description: subject || 'New message',
      entity_type: 'message',
      entity_id: null,
      client_id: client?.id ?? null,
    })

  revalidatePath('/staff/messages')

  if (client?.id) {
    revalidatePath(`/staff/clients/${client.id}`)
  }
}

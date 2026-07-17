'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

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

  await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,
      role: 'staff',
      action: 'Message Sent',
      description: subject || 'New message',
      entity_type: 'message',
      client_id: recipientId,
    })

  revalidatePath('/staff/messages')
}

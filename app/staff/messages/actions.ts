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

  const recipientId = String(formData.get('recipientId') ?? '')
  const serviceId = String(formData.get('serviceId') ?? '')
  const subject = String(formData.get('subject') ?? '').trim()
  const body = String(formData.get('body') ?? '').trim()

  if (!recipientId || !body) {
    throw new Error('Missing required fields')
  }

  // =====================================================
  // SEND MESSAGE
  // =====================================================

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

  // =====================================================
  // RECIPIENT
  // =====================================================

  const { data: recipient } = await supabase
    .from('profiles')
    .select(`
      first_name,
      last_name,
      email,
      company_name
    `)
    .eq('id', recipientId)
    .single()

  // =====================================================
  // EMAIL
  // =====================================================

  if (recipient?.email) {
    try {
      await sendEmail({
        to: recipient.email,
        subject: subject || 'New Message from POG Advisory',
        html: `
          <div style="font-family:Arial,sans-serif;padding:30px">

            <h2>Hello ${recipient.first_name ?? 'Client'},</h2>

            <p>You have received a new secure message from the POG Advisory team.</p>

            ${
              subject
                ? `<p><strong>Subject:</strong> ${subject}</p>`
                : ''
            }

            <div style="margin:20px 0;padding:20px;background:#f6f8fa;border-radius:10px">
              ${body.replace(/\n/g, '<br/>')}
            </div>

            <p>Please log into your client portal to respond.</p>

            <p>Regards,<br/>POG Advisory</p>

          </div>
        `,
      })
    } catch (err) {
      console.error(err)
    }
  }

  // =====================================================
  // CLIENT NOTIFICATION
  // =====================================================

  await supabase.from('notifications').insert({
    user_id: recipientId,
    title: subject || 'New Message',
    message:
      body.length > 180
        ? `${body.substring(0, 180)}...`
        : body,
    type: 'message',
    link: serviceId
      ? `/portal/cases/${serviceId}`
      : '/portal/messages',
    read: false,
  })

  // =====================================================
  // ACTIVITY LOG
  // =====================================================

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    role: 'staff',
    entity_type: 'message',
    entity_id: recipientId,
    action: 'Message Sent',
    description:
      subject || 'Message sent to client',
  })

  revalidatePath('/staff/messages')
  revalidatePath('/staff/notifications')
  revalidatePath('/portal/messages')
  revalidatePath('/portal/notifications')
}
